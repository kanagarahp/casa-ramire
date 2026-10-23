import assert from 'node:assert/strict';
import test from 'node:test';

import { hashPassword, sha256, verifyPassword } from '../src/core/crypto.js';
import {
  addMonths,
  daysBetween,
  initials,
  normalizePhone,
  rupiah,
  toISODate,
} from '../src/core/format.js';

test('sha256 matches known vectors', () => {
  assert.equal(
    sha256('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
  assert.equal(
    sha256(''),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  );
});

test('password hashing is deterministic and verifiable', () => {
  const hash = hashPassword('123456');
  assert.equal(hash, hashPassword('123456'));
  assert.notEqual(hash, hashPassword('1234567'));
  assert.equal(verifyPassword('123456', hash), true);
  assert.equal(verifyPassword('wrong', hash), false);
  assert.equal(verifyPassword('123456', null), false);
});

test('rupiah formats Indonesian thousands', () => {
  assert.equal(rupiah(2_200_000), 'Rp2.200.000');
  assert.equal(rupiah('150000'), 'Rp150.000');
  assert.equal(rupiah(0), 'Rp0');
});

test('month arithmetic clamps to the last day of the month', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonths('2026-11-24', 1), '2026-12-24');
});

test('day distance is inclusive of the start and exclusive of the end', () => {
  assert.equal(daysBetween('2026-01-01', '2026-01-31'), 30);
  assert.equal(daysBetween('2026-10-23', '2026-11-23'), 31);
  assert.equal(daysBetween('', '2026-01-01'), 0);
});

test('local ISO date keeps the calendar day', () => {
  assert.equal(toISODate(new Date(2026, 9, 23, 23, 30)), '2026-10-23');
});

test('phone numbers are normalised for WhatsApp', () => {
  assert.equal(normalizePhone('0812-3456-7890'), '6281234567890');
  assert.equal(normalizePhone('+62 812 3456 7890'), '6281234567890');
  assert.equal(normalizePhone(''), '');
});

test('initials ignore punctuation-only words', () => {
  assert.equal(initials('Rian (Staf Kasir)'), 'RS');
  assert.equal(initials('Budi Santoso'), 'BS');
  assert.equal(initials(''), '?');
});
