import { ensureCatalogSchema, query } from '../_lib/db.js';
import {
  findUserByUsername,
  hashPassword,
  issueLoginToken,
  needsRehash,
  normalizeUsername,
  publicUser,
  verifyPassword,
} from '../_lib/auth.js';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
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
