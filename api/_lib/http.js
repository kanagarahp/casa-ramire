import crypto from 'node:crypto';

import { query } from './db.js';
import {
  getBearerToken,
  tokenMatchesPassword,
  verifyToken,
} from './token.js';

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);
  return null;
}

/**
 * Read the exact request bytes. DOKU signs the raw JSON body, so webhooks must
 * verify against this string rather than a re-serialized object.
 */
export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(req.body)) {
      resolve(req.body.toString('utf8'));
      return;
    }

    if (typeof req.body === 'string' && req.body.length) {
      resolve(req.body);
      return;
    }

    if (req.readableEnded || req.complete) {
      resolve(req.body && typeof req.body === 'object' ? JSON.stringify(req.body) : '');
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw) {
        resolve(raw);
        return;
      }
      // Last-resort fallback for runtimes that consumed the stream before the
      // handler. This preserves key order for normal JSON payloads.
      resolve(req.body && typeof req.body === 'object' ? JSON.stringify(req.body) : '');
    });
    req.on('error', reject);
  });
}

export async function requireAdmin(req, res) {
  // A login token from any device is enough for state sync, bookings, email,
  // payments, and catalog operations.
  const payload = verifyToken(getBearerToken(req));
  if (payload) {
    // Honour account deactivation without waiting for token expiry. If the
    // database is temporarily unreachable, keep the session alive rather than
    // locking every device out.
    try {
      const result = await query(
        'select active, password_hash from casa_users where id = $1',
        [String(payload.sub)],
      );
      if (!result.rows.length) {
        sendJson(res, 401, { error: 'Akun tidak ditemukan. Silakan masuk kembali.' });
        return false;
      }
      const row = result.rows[0];
      if (!row.active) {
        sendJson(res, 401, { error: 'Akun ini sudah dinonaktifkan.' });
        return false;
      }
      if (!tokenMatchesPassword(payload, row.password_hash)) {
        sendJson(res, 401, {
          error: 'Sesi login berakhir. Silakan masuk kembali.',
        });
        return false;
      }
    } catch {
      /* keep the token valid when the database check fails */
    }
    return true;
  }

  const configuredKey = String(process.env.CATALOG_ADMIN_KEY || '').trim();
  const providedKey = String(req.headers['x-admin-key'] || '').trim();

  if (!configuredKey) {
    sendJson(res, 503, {
      error: 'Kunci admin belum dikonfigurasi di server.',
    });
    return false;
  }

  if (!providedKey) {
    sendJson(res, 401, {
      error: 'Sesi login tidak valid. Silakan masuk kembali.',
    });
    return false;
  }

  const expected = Buffer.from(configuredKey);
  const received = Buffer.from(providedKey);
  const valid =
    expected.length === received.length && crypto.timingSafeEqual(expected, received);

  if (!valid) {
    sendJson(res, 401, { error: 'Kunci admin tidak valid.' });
    return false;
  }

  return true;
}

export function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  sendJson(res, 405, { error: 'Metode tidak didukung.' });
}

export function asString(value, maxLength = 500) {
  return String(value ?? '').trim().slice(0, maxLength);
}
