import crypto from 'node:crypto';

import { query } from './db.js';
import { sendJson } from './http.js';
import {
  getBearerToken,
  passwordVersion,
  sameSecret,
  signToken,
  tokenMatchesPassword,
  verifyToken,
} from './token.js';

const LEGACY_SALT = 'casa-ramire::credentials::v2';
const SCRYPT_PREFIX = 'scrypt$';
const USERNAME_PATTERN = /^[a-z0-9._-]{3,20}$/;

export function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

export function validUsername(value) {
  return USERNAME_PATTERN.test(normalizeUsername(value));
}

export function validatePassword(value) {
  const password = String(value || '');
  if (password.length < 6) {
    throw Object.assign(new Error('Password minimal 6 karakter.'), { status: 400 });
  }
  return password;
}

/** Legacy browser hash (kept so existing device accounts can log in). */
export function legacyHash(password) {
  return crypto
    .createHash('sha256')
    .update(`${LEGACY_SALT}:${String(password)}`)
    .digest('hex');
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, 64);
  return `${SCRYPT_PREFIX}${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  const value = String(stored || '');
  if (!value) return false;

  if (value.startsWith(SCRYPT_PREFIX)) {
    const [, saltHex, hashHex] = value.split('$');
    if (!saltHex || !hashHex) return false;
    try {
      const expected = Buffer.from(hashHex, 'hex');
      const actual = crypto.scryptSync(
        String(password),
        Buffer.from(saltHex, 'hex'),
        expected.length,
      );
      return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
    } catch {
      return false;
    }
  }

  // Legacy SHA-256 hash created by the browser.
  const expected = Buffer.from(value);
  const actual = Buffer.from(legacyHash(password));
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function needsRehash(stored) {
  return !String(stored || '').startsWith(SCRYPT_PREFIX);
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    username: row.username,
    role: row.role,
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findUserByUsername(username) {
  const result = await query('select * from casa_users where username = $1', [
    normalizeUsername(username),
  ]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await query('select * from casa_users where id = $1', [String(id)]);
  return result.rows[0] || null;
}

export async function listUsers() {
  const result = await query(
    'select * from casa_users order by lower(name), username',
  );
  return result.rows.map(publicUser);
}

export function issueLoginToken(row) {
  return signToken({
    sub: String(row.id),
    username: row.username,
    role: row.role,
    name: row.name,
    pv: passwordVersion(row.password_hash),
  });
}

/**
 * Identify a request. The legacy admin key is still accepted so the owner's
 * original device keeps working, while every logged-in device uses a token.
 */
export function readAuth(req) {
  const providedKey = String(req?.headers?.['x-admin-key'] || '').trim();
  const configuredKey = String(process.env.CATALOG_ADMIN_KEY || '').trim();

  if (providedKey && configuredKey && sameSecret(providedKey, configuredKey)) {
    return { kind: 'admin' };
  }

  const payload = verifyToken(getBearerToken(req));
  if (payload) return { kind: 'user', user: payload };

  return null;
}

export async function requireOwner(req, res) {
  const auth = readAuth(req);
  if (!auth) {
    sendJson(res, 401, { error: 'Sesi login tidak valid atau sudah berakhir.' });
    return null;
  }
  if (auth.kind === 'admin') return auth;

  const row = await findUserById(auth.user.sub);
  if (!row || !row.active) {
    sendJson(res, 401, { error: 'Akun tidak ditemukan atau sudah dinonaktifkan.' });
    return null;
  }
  if (!tokenMatchesPassword(auth.user, row.password_hash)) {
    sendJson(res, 401, { error: 'Sesi login berakhir. Silakan masuk kembali.' });
    return null;
  }
  if (row.role !== 'owner') {
    sendJson(res, 403, { error: 'Aksi ini hanya dapat dilakukan oleh owner.' });
    return null;
  }

  return { ...auth, row };
}

export async function countActiveOwners(excludeId = null) {
  const result = await query(
    `select count(*)::int as total
       from casa_users
      where role = 'owner' and active = true
        and ($1::text is null or id <> $1)`,
    [excludeId == null ? null : String(excludeId)],
  );
  return Number(result.rows[0]?.total || 0);
}
