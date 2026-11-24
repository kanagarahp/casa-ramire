import crypto from 'node:crypto';

import {
  countActiveOwners,
  findUserById,
  findUserByUsername,
  hashPassword,
  issueLoginToken,
  legacyHash,
  listUsers,
  needsRehash,
  normalizeUsername,
  publicUser,
  readAuth,
  requireOwner,
  validUsername,
  validatePassword,
  verifyPassword,
} from './auth.js';
import { ensureCatalogSchema, query, withTransaction } from './db.js';
import { emailConfigured, notificationEmail, sendResendEmail } from './email.js';
import { asString, methodNotAllowed, readBody, sendJson } from './http.js';
import { sameSecret, tokenMatchesPassword } from './token.js';

const MAX_BOOTSTRAP_USERS = 50;

function cleanName(value) {
  return String(value || '').trim().slice(0, 120);
}

function cleanRole(value) {
  return value === 'owner' ? 'owner' : 'staff';
}

function hashCode(username, code) {
  return crypto
    .createHash('sha256')
    .update(`${String(username).toLowerCase()}:${code}`)
    .digest('hex');
}

function maskEmail(value) {
  const [name, domain] = String(value || '').split('@');
  if (!domain) return value || '';
  const visible = name.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(1, name.length - 1))}@${domain}`;
}

export async function handleLogin(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const username = normalizeUsername(body?.username);
  const password = String(body?.password || '');
  if (!username || !password) {
    return sendJson(res, 400, { error: 'Username dan password wajib diisi.' });
  }

  try {
    await ensureCatalogSchema();

    const total = await query('select count(*)::int as total from casa_users');
    if (!Number(total.rows[0]?.total || 0)) {
      return sendJson(res, 409, {
        code: 'ACCOUNTS_NOT_READY',
        error:
          'Akun belum disiapkan di server. Buka aplikasi sekali di perangkat utama owner (yang memiliki kunci admin), lalu coba lagi.',
      });
    }

    const row = await findUserByUsername(username);
    if (!row || !verifyPassword(password, row.password_hash)) {
      // Small delay to make simple brute-force attempts less attractive.
      await new Promise((resolve) => setTimeout(resolve, 250));
      return sendJson(res, 401, { error: 'Username atau password salah.' });
    }

    if (!row.active) {
      return sendJson(res, 403, { error: 'Akun ini sedang dinonaktifkan. Hubungi owner.' });
    }

    // Upgrade older browser hashes to a server-side scrypt hash on login.
    if (needsRehash(row.password_hash)) {
      const upgraded = hashPassword(password);
      await query(
        'update casa_users set password_hash = $2, updated_at = now() where id = $1',
        [row.id, upgraded],
      );
      row.password_hash = upgraded;
    }

    const signed = issueLoginToken(row);
    return sendJson(res, 200, {
      ok: true,
      token: signed.token,
      expiresAt: signed.expiresAt,
      user: publicUser(row),
    });
  } catch (error) {
    console.error('[auth] gagal login', error);
    return sendJson(res, 500, {
      error: 'Gagal memproses login. Coba lagi beberapa saat lagi.',
    });
  }
}

/**
 * Seed server-side accounts from the owner's existing local device. Existing
 * usernames are never overwritten, so an old device cannot reset passwords
 * that were changed later from another device.
 */
export async function handleBootstrap(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const users = Array.isArray(body?.users)
    ? body.users.slice(0, MAX_BOOTSTRAP_USERS)
    : [];
  if (!users.length) {
    return sendJson(res, 400, { error: 'Daftar akun wajib diisi.' });
  }

  try {
    await ensureCatalogSchema();

    const auth = readAuth(req);
    if (!auth) {
      return sendJson(res, 401, {
        error: 'Kunci admin atau sesi owner diperlukan untuk menyiapkan akun.',
      });
    }
    if (auth.kind === 'user') {
      const current = await findUserById(auth.user.sub);
      if (!current || !current.active || current.role !== 'owner') {
        return sendJson(res, 403, {
          error: 'Hanya owner yang dapat menyiapkan akun server.',
        });
      }
      if (!tokenMatchesPassword(auth.user, current.password_hash)) {
        return sendJson(res, 401, {
          error: 'Sesi login berakhir. Silakan masuk kembali.',
        });
      }
    }

    const existing = await query('select count(*)::int as total from casa_users');
    const alreadyExists = Number(existing.rows[0]?.total || 0) > 0;

    let created = 0;
    let skipped = 0;

    for (const item of users) {
      const username = normalizeUsername(item?.username);
      if (!validUsername(username)) {
        skipped += 1;
        continue;
      }

      const name = String(item?.name || username).trim().slice(0, 120);
      const role = cleanRole(item?.role);
      const active = item?.active !== false;
      const legacy = String(item?.passHash || '').trim();
      const plain = String(item?.password || '');

      let passwordHash = '';
      if (legacy && /^[a-f0-9]{64}$/i.test(legacy)) {
        passwordHash = legacy.toLowerCase();
      } else if (plain.length >= 6) {
        passwordHash = hashPassword(plain);
      } else {
        // Keep the documented default for unusable seed entries.
        passwordHash = legacyHash('123456');
      }

      const createdAt =
        item?.createdAt && !Number.isNaN(Date.parse(item.createdAt))
          ? item.createdAt
          : null;

      const inserted = await query(
        `insert into casa_users
           (id, username, name, role, active, password_hash, created_at)
         values ($1, $2, $3, $4, $5, $6, coalesce($7::timestamptz, now()))
         on conflict (username) do nothing
         returning id`,
        [
          String(item?.id || crypto.randomUUID()),
          username,
          name,
          role,
          active,
          passwordHash,
          createdAt,
        ],
      );

      if (inserted.rows.length) created += 1;
      else skipped += 1;
    }

    return sendJson(res, 200, {
      ok: true,
      created,
      skipped,
      alreadyExists,
    });
  } catch (error) {
    console.error('[auth] gagal bootstrap akun', error);
    return sendJson(res, 500, {
      error: 'Gagal menyiapkan akun di server. Coba lagi.',
    });
  }
}

export async function handleUsers(req, res) {
  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[auth/users] database belum siap', error);
    return sendJson(res, 503, { error: 'Database belum siap. Coba lagi.' });
  }

  try {
    if (req.method === 'GET') {
      const auth = readAuth(req);
      if (!auth) {
        return sendJson(res, 401, {
          error: 'Sesi login tidak valid atau sudah berakhir.',
        });
      }
      if (auth.kind === 'user') {
        const current = await findUserById(auth.user.sub);
        if (!current || !current.active) {
          return sendJson(res, 401, { error: 'Akun ini sudah dinonaktifkan.' });
        }
        if (!tokenMatchesPassword(auth.user, current.password_hash)) {
          return sendJson(res, 401, {
            error: 'Sesi login berakhir. Silakan masuk kembali.',
          });
        }
      }
      return sendJson(res, 200, { ok: true, users: await listUsers() });
    }

    const auth = await requireOwner(req, res);
    if (!auth) return;

    if (req.method === 'POST') {
      let body;
      try {
        body = readBody(req);
      } catch {
        return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
      }

      const name = cleanName(body?.name);
      const username = normalizeUsername(body?.username);
      const role = cleanRole(body?.role);
      if (!name) return sendJson(res, 400, { error: 'Nama lengkap wajib diisi.' });
      if (!validUsername(username)) {
        return sendJson(res, 400, {
          error: 'Username 3–20 karakter, hanya huruf, angka, titik, garis bawah, atau strip.',
        });
      }

      let password;
      try {
        password = validatePassword(body?.password);
      } catch (error) {
        return sendJson(res, 400, { error: error.message });
      }

      const duplicate = await query('select id from casa_users where username = $1', [
        username,
      ]);
      if (duplicate.rows.length) {
        return sendJson(res, 409, { error: 'Username sudah digunakan.' });
      }

      const result = await query(
        `insert into casa_users (id, username, name, role, active, password_hash)
         values ($1, $2, $3, $4, true, $5)
         returning *`,
        [crypto.randomUUID(), username, name, role, hashPassword(password)],
      );

      return sendJson(res, 201, { ok: true, user: publicUser(result.rows[0]) });
    }

    if (req.method === 'PATCH') {
      let body;
      try {
        body = readBody(req);
      } catch {
        return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
      }

      const id = String(body?.id || '').trim();
      if (!id) return sendJson(res, 400, { error: 'ID akun wajib diisi.' });

      const target = await query('select * from casa_users where id = $1', [id]);
      if (!target.rows.length) {
        return sendJson(res, 404, { error: 'Akun tidak ditemukan.' });
      }
      const current = target.rows[0];

      const name = body?.name === undefined ? current.name : cleanName(body.name);
      const role = body?.role === undefined ? current.role : cleanRole(body.role);
      const active =
        body?.active === undefined ? current.active : Boolean(body.active);
      let passwordHash = current.password_hash;

      if (body?.password !== undefined) {
        try {
          passwordHash = hashPassword(validatePassword(body.password));
        } catch (error) {
          return sendJson(res, 400, { error: error.message });
        }
      }

      if (!name) return sendJson(res, 400, { error: 'Nama lengkap wajib diisi.' });

      const removingOwner =
        current.role === 'owner' && (role !== 'owner' || !active);
      if (removingOwner) {
        const otherOwners = await countActiveOwners(current.id);
        if (!otherOwners) {
          return sendJson(res, 409, {
            error: 'Minimal harus ada satu owner aktif.',
          });
        }
      }

      const result = await query(
        `update casa_users
            set name = $2, role = $3, active = $4, password_hash = $5, updated_at = now()
          where id = $1
          returning *`,
        [id, name, role, active, passwordHash],
      );

      return sendJson(res, 200, { ok: true, user: publicUser(result.rows[0]) });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url || '/', 'http://localhost');
      let id = String(url.searchParams.get('id') || '').trim();
      if (!id) {
        try {
          id = String(readBody(req)?.id || '').trim();
        } catch {
          id = '';
        }
      }
      if (!id) return sendJson(res, 400, { error: 'ID akun wajib diisi.' });

      const target = await query('select * from casa_users where id = $1', [id]);
      if (!target.rows.length) {
        return sendJson(res, 404, { error: 'Akun tidak ditemukan.' });
      }

      if (auth.kind === 'user' && String(auth.user.sub) === id) {
        return sendJson(res, 409, {
          error: 'Anda tidak dapat menghapus akun yang sedang digunakan.',
        });
      }

      if (target.rows[0].role === 'owner') {
        const otherOwners = await countActiveOwners(id);
        if (!otherOwners) {
          return sendJson(res, 409, {
            error: 'Minimal harus ada satu owner aktif.',
          });
        }
      }

      const deleted = await withTransaction(async (client) => {
        const result = await client.query(
          'delete from casa_users where id = $1 returning id',
          [id],
        );
        return result.rows.length > 0;
      });

      if (!deleted) return sendJson(res, 404, { error: 'Akun tidak ditemukan.' });
      return sendJson(res, 200, { ok: true });
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'DELETE']);
  } catch (error) {
    console.error('[auth/users] gagal memproses akun', error);
    return sendJson(res, 500, {
      error: 'Gagal memproses akun. Coba lagi beberapa saat lagi.',
    });
  }
}

export async function handleChangePassword(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const auth = readAuth(req);
  if (!auth || auth.kind !== 'user') {
    return sendJson(res, 401, {
      error: 'Sesi login tidak valid. Silakan masuk kembali.',
    });
  }

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const currentPassword = String(body?.currentPassword || '');
  let newPassword;
  try {
    newPassword = validatePassword(body?.newPassword);
  } catch (error) {
    return sendJson(res, 400, { error: error.message });
  }

  try {
    await ensureCatalogSchema();

    const row = await findUserById(auth.user.sub);
    if (!row || !row.active) {
      return sendJson(res, 401, {
        error: 'Akun tidak ditemukan atau sudah dinonaktifkan.',
      });
    }
    if (!tokenMatchesPassword(auth.user, row.password_hash)) {
      return sendJson(res, 401, { error: 'Sesi login berakhir. Silakan masuk kembali.' });
    }
    if (!verifyPassword(currentPassword, row.password_hash)) {
      return sendJson(res, 400, { error: 'Password saat ini salah.' });
    }

    const updated = await query(
      `update casa_users
          set password_hash = $2, updated_at = now()
        where id = $1
        returning *`,
      [row.id, hashPassword(newPassword)],
    );

    // Refresh this device's session so the user is not logged out.
    const signed = issueLoginToken(updated.rows[0]);

    return sendJson(res, 200, {
      ok: true,
      token: signed.token,
      expiresAt: signed.expiresAt,
      user: publicUser(updated.rows[0]),
    });
  } catch (error) {
    console.error('[auth] gagal mengganti password', error);
    return sendJson(res, 500, { error: 'Gagal mengganti password. Coba lagi.' });
  }
}

export async function handleRecover(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const username = normalizeUsername(body?.username);
  const recoveryKey = String(body?.recoveryKey || '').trim();
  const configuredKey = String(process.env.CATALOG_ADMIN_KEY || '').trim();

  if (!username) return sendJson(res, 400, { error: 'Username owner wajib diisi.' });
  if (!recoveryKey) return sendJson(res, 400, { error: 'Kunci admin wajib diisi.' });
  if (!configuredKey) {
    return sendJson(res, 503, {
      error: 'Kunci admin belum dikonfigurasi di server.',
    });
  }
  if (!sameSecret(recoveryKey, configuredKey)) {
    return sendJson(res, 401, { error: 'Kunci admin tidak valid.' });
  }

  let newPassword;
  try {
    newPassword = validatePassword(body?.newPassword);
  } catch (error) {
    return sendJson(res, 400, { error: error.message });
  }

  try {
    await ensureCatalogSchema();

    const row = await findUserByUsername(username);
    if (!row) {
      return sendJson(res, 404, {
        error:
          'Akun owner belum ada di server. Buka aplikasi sekali di perangkat utama owner, lalu coba lagi.',
      });
    }
    if (!row.active) {
      return sendJson(res, 403, { error: 'Akun owner sedang dinonaktifkan.' });
    }
    if (row.role !== 'owner') {
      return sendJson(res, 403, {
        error: 'Reset mandiri hanya untuk akun owner. Minta owner mereset akun staf.',
      });
    }

    const result = await query(
      'update casa_users set password_hash = $2, updated_at = now() where id = $1 returning *',
      [row.id, hashPassword(newPassword)],
    );

    return sendJson(res, 200, { ok: true, user: publicUser(result.rows[0]) });
  } catch (error) {
    console.error('[auth] gagal reset password dengan kunci admin', error);
    return sendJson(res, 500, { error: 'Gagal mereset password. Coba lagi.' });
  }
}

export async function handleForgotPassword(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const username = asString(body?.username, 40).toLowerCase();
  if (!/^[a-z0-9._-]{3,20}$/.test(username)) {
    return sendJson(res, 400, { error: 'Username tidak valid.' });
  }

  if (!emailConfigured()) {
    return sendJson(res, 503, {
      error:
        'Email belum dikonfigurasi di server. Owner perlu mengatur RESEND_API_KEY dan EMAIL_FROM di Vercel.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
  }

  try {
    await ensureCatalogSchema();

    const user = await findUserByUsername(username);
    if (!user || user.role !== 'owner' || !user.active) {
      return sendJson(res, 404, {
        error:
          'Akun owner tidak ditemukan di server. Buka aplikasi sekali di perangkat utama owner, lalu coba lagi.',
      });
    }

    const recent = await query(
      `select count(*)::int as total
         from casa_password_resets
        where username = $1
          and created_at > now() - interval '10 minutes'`,
      [username],
    );
    if (Number(recent.rows[0]?.total || 0) >= 3) {
      return sendJson(res, 429, {
        error: 'Terlalu banyak permintaan reset. Coba lagi 10 menit lagi.',
      });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const recipient = notificationEmail();

    await query(
      `insert into casa_password_resets (id, username, code_hash, expires_at)
       values ($1, $2, $3, $4)`,
      [id, username, hashCode(username, code), expiresAt.toISOString()],
    );

    await sendResendEmail({
      to: recipient,
      subject: 'Kode Reset Password Owner — Casa Ramire',
      text: [
        'Kode reset password owner Casa Ramire',
        '',
        `Username: ${username}`,
        `Kode verifikasi: ${code}`,
        'Kode berlaku selama 15 menit dan hanya dapat dipakai satu kali.',
        '',
        'Jika Anda tidak meminta reset password, abaikan email ini.',
        '',
        'Casa Ramire',
      ].join('\n'),
    });

    return sendJson(res, 200, {
      ok: true,
      message: `Kode reset dikirim ke email owner ${maskEmail(recipient)}.`,
      maskedEmail: maskEmail(recipient),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[auth] gagal mengirim kode reset', error);
    return sendJson(res, error.status || 500, {
      error:
        error.code === 'EMAIL_NOT_CONFIGURED'
          ? 'Email belum dikonfigurasi di server. Hubungi pengelola Vercel.'
          : `Gagal mengirim kode reset: ${error.message || 'coba lagi beberapa saat lagi.'}`,
    });
  }
}

export async function handleResetPassword(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const username = asString(body?.username, 40).toLowerCase();
  const code = asString(body?.code, 10).replace(/\D/g, '');
  const newPassword = String(body?.newPassword || '');

  if (!/^[a-z0-9._-]{3,20}$/.test(username)) {
    return sendJson(res, 400, { error: 'Username tidak valid.' });
  }
  if (code.length !== 6) {
    return sendJson(res, 400, { error: 'Kode verifikasi harus 6 digit.' });
  }
  if (newPassword.length < 6) {
    return sendJson(res, 400, { error: 'Password baru minimal 6 karakter.' });
  }

  try {
    await ensureCatalogSchema();

    const result = await query(
      `select id, code_hash, attempts, expires_at, used_at
         from casa_password_resets
        where username = $1
        order by created_at desc
        limit 1`,
      [username],
    );
    if (!result.rows.length) {
      return sendJson(res, 400, { error: 'Kode reset tidak ditemukan. Minta kode baru.' });
    }

    const row = result.rows[0];
    if (row.used_at) {
      return sendJson(res, 400, { error: 'Kode reset sudah dipakai. Minta kode baru.' });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return sendJson(res, 400, { error: 'Kode reset sudah kedaluwarsa. Minta kode baru.' });
    }
    if (Number(row.attempts) >= 5) {
      return sendJson(res, 429, {
        error: 'Terlalu banyak percobaan. Minta kode reset baru.',
      });
    }

    if (!sameSecret(row.code_hash, hashCode(username, code))) {
      await query(
        'update casa_password_resets set attempts = attempts + 1 where id = $1',
        [row.id],
      );
      return sendJson(res, 400, { error: 'Kode verifikasi salah.' });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return sendJson(res, 404, {
        error:
          'Akun owner belum ada di server. Buka aplikasi sekali di perangkat utama owner, lalu minta kode baru.',
      });
    }
    if (!user.active) {
      return sendJson(res, 403, { error: 'Akun ini sedang dinonaktifkan.' });
    }
    if (user.role !== 'owner') {
      return sendJson(res, 403, {
        error: 'Password admin/staf hanya dapat direset oleh owner.',
      });
    }

    await query(
      'update casa_users set password_hash = $2, updated_at = now() where id = $1',
      [user.id, hashPassword(newPassword)],
    );

    await query(
      'update casa_password_resets set used_at = now() where id = $1',
      [row.id],
    );

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('[auth] gagal reset password', error);
    return sendJson(res, 500, { error: 'Gagal mereset password. Coba lagi.' });
  }
}
