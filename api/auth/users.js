import crypto from 'node:crypto';

import {
  countActiveOwners,
  findUserById,
  hashPassword,
  listUsers,
  normalizeUsername,
  publicUser,
  readAuth,
  requireOwner,
  validUsername,
  validatePassword,
} from '../_lib/auth.js';
import { ensureCatalogSchema, query, withTransaction } from '../_lib/db.js';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http.js';
import { tokenMatchesPassword } from '../_lib/token.js';

function cleanName(value) {
  return String(value || '').trim().slice(0, 120);
}

function cleanRole(value) {
  return value === 'owner' ? 'owner' : 'staff';
}

export default async function handler(req, res) {
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

      const name =
        body?.name === undefined ? current.name : cleanName(body.name);
      const role =
        body?.role === undefined ? current.role : cleanRole(body.role);
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
        current.role === 'owner' &&
        (role !== 'owner' || !active);
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
        const result = await client.query('delete from casa_users where id = $1 returning id', [
          id,
        ]);
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
