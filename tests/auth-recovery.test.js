import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSeedState } from '../src/core/seed.js';
import { replaceState } from '../src/core/store.js';
import { login, resetPasswordWithRecoveryKey } from '../src/services/auth.js';

test('owner password can be reset with the admin recovery key', async () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    settings: { ...seed.settings, catalogAdminKey: 'test-admin-key' },
  });

  const reset = await resetPasswordWithRecoveryKey({
    username: 'owner',
    newPassword: 'passwordbaru',
    recoveryKey: 'test-admin-key',
  });

  assert.equal(reset.username, 'owner');
  const result = login('owner', 'passwordbaru');
  assert.equal(result.ok, true);
  assert.equal(result.user.username, 'owner');
});

test('recovery reset rejects staff accounts', async () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    settings: { ...seed.settings, catalogAdminKey: 'test-admin-key' },
  });

  await assert.rejects(
    () =>
      resetPasswordWithRecoveryKey({
        username: 'admin',
        newPassword: 'passwordbaru',
        recoveryKey: 'test-admin-key',
      }),
    /hanya untuk akun owner/i,
  );
});

test('recovery reset rejects a password that is too short', async () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    settings: { ...seed.settings, catalogAdminKey: 'test-admin-key' },
  });

  await assert.rejects(
    () =>
      resetPasswordWithRecoveryKey({
        username: 'owner',
        newPassword: '123',
        recoveryKey: 'test-admin-key',
      }),
    /minimal 6 karakter/i,
  );
});
