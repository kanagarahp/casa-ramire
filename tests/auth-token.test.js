import assert from 'node:assert/strict';
import test from 'node:test';

import { hashPassword, legacyHash, verifyPassword } from '../api/_lib/auth.js';
import {
  passwordVersion,
  signToken,
  tokenMatchesPassword,
  verifyToken,
} from '../api/_lib/token.js';

process.env.CATALOG_ADMIN_KEY = process.env.CATALOG_ADMIN_KEY || 'test-token-secret';

test('server passwords use scrypt and legacy browser hashes still verify', () => {
  const hashed = hashPassword('rahasia123');
  assert.match(hashed, /^scrypt\$/);
  assert.equal(verifyPassword('rahasia123', hashed), true);
  assert.equal(verifyPassword('salah', hashed), false);

  const legacy = legacyHash('123456');
  assert.equal(legacy.length, 64);
  assert.equal(verifyPassword('123456', legacy), true);
  assert.equal(verifyPassword('654321', legacy), false);
});

test('login tokens are signed, expire, and invalidate on password change', () => {
  const signed = signToken({ sub: 'user-1', role: 'owner', pv: 'abc' });
  const payload = verifyToken(signed.token);

  assert.equal(payload.sub, 'user-1');
  assert.equal(payload.role, 'owner');
  assert.ok(payload.exp > payload.iat);

  assert.equal(verifyToken(`${signed.token}x`), null);
  assert.equal(verifyToken('not-a-token'), null);

  const firstHash = hashPassword('password-satu');
  const secondHash = hashPassword('password-dua');
  const token = signToken({
    sub: 'user-1',
    pv: passwordVersion(firstHash),
  }).token;
  const decoded = verifyToken(token);

  assert.equal(tokenMatchesPassword(decoded, firstHash), true);
  assert.equal(tokenMatchesPassword(decoded, secondHash), false);
});
