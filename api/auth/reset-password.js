import crypto from 'node:crypto';

import { ensureCatalogSchema, query } from '../_lib/db.js';
import { asString, methodNotAllowed, readBody, sendJson } from '../_lib/http.js';

function hashCode(username, code) {
  return crypto
    .createHash('sha256')
    .update(`${String(username).toLowerCase()}:${code}`)
    .digest('hex');
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
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

    if (!safeEqual(row.code_hash, hashCode(username, code))) {
      await query(
        'update casa_password_resets set attempts = attempts + 1 where id = $1',
        [row.id],
      );
      return sendJson(res, 400, { error: 'Kode verifikasi salah.' });
    }

    await query(
      'update casa_password_resets set used_at = now() where id = $1',
      [row.id],
    );

    // The actual password hash lives on the owner's device. The client stores
    // the new hash locally after this server-side code verification succeeds.
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('[auth] gagal reset password', error);
    return sendJson(res, 500, { error: 'Gagal mereset password. Coba lagi.' });
  }
}
