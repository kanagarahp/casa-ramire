import crypto from 'node:crypto';

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

export function requireAdmin(req, res) {
  const configuredKey = String(process.env.CATALOG_ADMIN_KEY || '').trim();
  const providedKey = String(req.headers['x-admin-key'] || '').trim();

  if (!configuredKey) {
    sendJson(res, 503, {
      error: 'Kunci publikasi katalog belum dikonfigurasi di server.',
    });
    return false;
  }

  if (!providedKey) {
    sendJson(res, 401, { error: 'Kunci publikasi katalog wajib diisi.' });
    return false;
  }

  const expected = Buffer.from(configuredKey);
  const received = Buffer.from(providedKey);
  const valid =
    expected.length === received.length && crypto.timingSafeEqual(expected, received);

  if (!valid) {
    sendJson(res, 401, { error: 'Kunci publikasi katalog tidak valid.' });
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
