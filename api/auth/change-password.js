import {
  findUserById,
  hashPassword,
  issueLoginToken,
  publicUser,
  readAuth,
  validatePassword,
  verifyPassword,
} from '../_lib/auth.js';
import { ensureCatalogSchema, query } from '../_lib/db.js';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http.js';
import { tokenMatchesPassword } from '../_lib/token.js';

export default async function handler(req, res) {
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
      return sendJson(res, 401, { error: 'Akun tidak ditemukan atau sudah dinonaktifkan.' });
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
