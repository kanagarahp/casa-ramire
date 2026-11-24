import crypto from 'node:crypto';

import {
  findUserById,
  hashPassword,
  legacyHash,
  normalizeUsername,
  readAuth,
  validUsername,
} from '../_lib/auth.js';
import { ensureCatalogSchema, query } from '../_lib/db.js';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http.js';
import { tokenMatchesPassword } from '../_lib/token.js';

const MAX_USERS = 50;

function cleanRole(value) {
  return value === 'owner' ? 'owner' : 'staff';
}

/**
 * Seed server-side accounts from the owner's existing local device.
 * Existing usernames are never overwritten, so an old device cannot reset
 * passwords that were changed later from another device.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const users = Array.isArray(body?.users) ? body.users.slice(0, MAX_USERS) : [];
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
