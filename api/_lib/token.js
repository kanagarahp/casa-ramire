import crypto from 'node:crypto';

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function tokenSecret() {
  return String(
    process.env.AUTH_TOKEN_SECRET || process.env.CATALOG_ADMIN_KEY || '',
  ).trim();
}

function base64url(buffer) {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64url(value) {
  const normalized = String(value || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  return Buffer.from(normalized, 'base64');
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Sign a compact HMAC token. Payload must be JSON-serializable. */
export function signToken(payload, { expiresInSeconds = DEFAULT_TTL_SECONDS } = {}) {
  const secret = tokenSecret();
  if (!secret) {
    throw new Error('AUTH_TOKEN_SECRET atau CATALOG_ADMIN_KEY belum dikonfigurasi.');
  }

  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + Math.max(60, Number(expiresInSeconds) || DEFAULT_TTL_SECONDS),
  };

  const data = base64url(Buffer.from(JSON.stringify(body), 'utf8'));
  const signature = base64url(
    crypto.createHmac('sha256', secret).update(data).digest(),
  );

  return {
    token: `${data}.${signature}`,
    expiresAt: new Date(body.exp * 1000).toISOString(),
    payload: body,
  };
}

/** Verify signature and expiry. Returns the payload or null. */
export function verifyToken(token) {
  const secret = tokenSecret();
  const value = String(token || '').trim();
  if (!secret || !value) return null;

  const [data, signature] = value.split('.');
  if (!data || !signature) return null;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest();
  const received = fromBase64url(signature);

  if (expected.length !== received.length) return null;
  if (!crypto.timingSafeEqual(expected, received)) return null;

  let payload;
  try {
    payload = JSON.parse(fromBase64url(data).toString('utf8'));
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;
  if (!payload.exp || Number(payload.exp) < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

/** Short fingerprint so password changes invalidate existing tokens. */
export function passwordVersion(passwordHash) {
  return crypto
    .createHash('sha256')
    .update(String(passwordHash || ''))
    .digest('hex')
    .slice(0, 16);
}

export function tokenMatchesPassword(payload, passwordHash) {
  return Boolean(payload?.pv) && payload.pv === passwordVersion(passwordHash);
}

export function getBearerToken(req) {
  const header = String(req?.headers?.authorization || '');
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

export function sameSecret(left, right) {
  return safeEqual(left, right);
}
