import {
  findUserByUsername,
  hashPassword,
  normalizeUsername,
  publicUser,
  validatePassword,
  verifyPassword,
} from '../_lib/auth.js';
import { ensureCatalogSchema, query } from '../_lib/db.js';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http.js';
import { sameSecret } from '../_lib/token.js';

export default async function handler(req, res) {
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

    // Do not allow an accidental reset to the same password? Keep it simple:
    // the recovery key already proves ownership of the installation.
    if (verifyPassword(newPassword, row.password_hash)) {
      return sendJson(res, 400, {
        error: 'Password baru harus berbeda dari password saat ini.',
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
