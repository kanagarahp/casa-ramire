import assert from 'node:assert/strict';
import test from 'node:test';

import { computeQuote, resolveEndDate } from '../src/services/pricing.js';

const addons = [{ name: 'Parkir Mobil', price: 100_000 }];

test('one-month quote uses the package price', () => {
  const quote = computeQuote({
    lantai: '2',
    periode: '1',
    startDate: '2026-01-15',
    addons,
    depositEnabled: true,
    depositValue: 500_000,
    payOption: 'full',
  });

  assert.equal(quote.endDate, '2026-02-15');
  assert.equal(quote.base, 2_200_000);
  assert.equal(quote.addonTotal, 100_000);
  assert.equal(quote.grandTotal, 2_300_000);
  assert.equal(quote.deposit, 500_000);
  assert.equal(quote.payNow, 2_800_000);
  assert.equal(quote.remaining, 0);
  assert.equal(quote.monthlyCharge, 2_300_000);
  assert.equal(quote.rentPaidNow, 2_300_000);
});

test('rupiah promo is applied once per contract month', () => {
  const quote = computeQuote({
    lantai: '2',
    periode: '3',
    startDate: '2026-01-01',
    promo: { id: 1, name: 'Diskon', type: 'rupiah', value: 200_000 },
    addons,
  });

  assert.equal(quote.base, 6_300_000);
  assert.equal(quote.discount, 600_000);
  assert.equal(quote.rentTotal, 5_700_000);
  assert.equal(quote.addonTotal, 300_000);
  assert.equal(quote.grandTotal, 6_000_000);
  assert.equal(quote.monthlyCharge, 2_100_000);
});

test('percentage promo is calculated from the package total', () => {
  const quote = computeQuote({
    lantai: '3',
    periode: '3',
    startDate: '2026-01-01',
    promo: { id: 2, name: 'Promo 10%', type: 'persen', value: 10 },
  });

  assert.equal(quote.base, 6_000_000);
  assert.equal(quote.discount, 600_000);
  assert.equal(quote.grandTotal, 5_400_000);
});

test('deposit does not become rent revenue', () => {
  const quote = computeQuote({
    lantai: '2',
    periode: '1',
    startDate: '2026-01-01',
    depositEnabled: true,
    depositValue: 500_000,
    payOption: 'partial',
  });

  assert.equal(quote.payNow, 500_000);
  assert.equal(quote.remaining, 2_200_000);
  assert.equal(quote.grandTotal, 2_200_000);
});

test('daily quotes multiply the daily rate by days', () => {
  const quote = computeQuote({
    lantai: '2',
    periode: 'harian',
    startDate: '2026-01-01',
    endDate: '2026-01-04',
  });

  assert.equal(quote.units, 3);
  assert.equal(quote.base, 450_000);
  assert.equal(quote.endDate, '2026-01-04');
});

test('weekly quotes round up to full weeks', () => {
  const quote = computeQuote({
    lantai: '2',
    periode: 'mingguan',
    startDate: '2026-01-01',
    endDate: '2026-01-10',
  });

  assert.equal(quote.units, 2);
  assert.equal(quote.base, 1_700_000);
});

test('short periods require an end date after the start', () => {
  const end = resolveEndDate({ periode: 'harian', startDate: '2026-01-01', endDate: '2026-01-01' });
  assert.equal(end, '2026-01-02');

  // An invalid end date is repaired to the minimum valid period.
  const quote = computeQuote({
    lantai: '2',
    periode: 'harian',
    startDate: '2026-01-02',
    endDate: '2026-01-01',
  });
  assert.equal(quote.endDate, '2026-01-03');
  assert.equal(quote.units, 1);
});
