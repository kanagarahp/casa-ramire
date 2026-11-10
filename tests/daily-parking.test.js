import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizePublicState } from '../api/_lib/state-normalize.js';
import { PAYMENT_METHODS } from '../src/core/constants.js';
import { buildSeedState } from '../src/core/seed.js';
import { getState, replaceState, update } from '../src/core/store.js';
import { buildBillingEmail } from '../src/services/email.js';
import {
  getDailyAvailableRooms,
  getDailySummary,
  isDailyAvailable,
} from '../src/services/daily.js';
import { getCarParkingStatus, parkingFullMessage } from '../src/services/parking.js';
import { carAddon, computeQuote, getRate } from '../src/services/pricing.js';
import {
  checkInDirect,
  checkInFromBooking,
  getRoom,
  getRooms,
  markBookingPaymentUnpaid,
  moveBooking,
  saveBooking,
  verifyBookingPayment,
} from '../src/services/property.js';
import { updateSettings } from '../src/services/settings.js';

function fresh() {
  replaceState(buildSeedState());
}

function bookingPayload(overrides = {}) {
  return {
    name: 'Tamu Harian',
    phone: '08123456789',
    email: 'tamu@example.com',
    periode: 'harian',
    startDate: '2026-11-10',
    endDate: '2026-11-12',
    depositEnabled: false,
    depositValue: 0,
    payOption: 'partial',
    ...overrides,
  };
}

test('seed includes Deluxe VIP room 101 as daily-only', () => {
  fresh();
  const vip = getRooms().find((room) => room.nomor === '101');
  assert.ok(vip);
  assert.equal(vip.lantai, '1');
  assert.equal(vip.tipe, 'Deluxe VIP');
  assert.equal(vip.dailyEnabled, true);
  assert.equal(vip.monthlyEnabled, false);
  assert.equal(getRate('1', 'harian'), 250000);
  assert.equal(getRate('1', '1'), 0);
});

test('vacant monthly rooms are daily-available, daily summary follows room state', () => {
  fresh();
  assert.equal(getDailyAvailableRooms().length, 43);
  assert.equal(getDailySummary().available, 43);

  const room = getRooms().find((item) => item.nomor === '201');
  saveBooking(room.id, bookingPayload());
  assert.equal(isDailyAvailable(getRoom(room.id)), false);
  assert.equal(getDailySummary().booked, 1);
  assert.equal(getDailySummary().available, 42);
});

test('VIP calendar controls blocked dates and per-date prices', () => {
  fresh();
  const vip = getRooms().find((room) => room.nomor === '101');
  update((draft) => {
    const room = draft.rooms.find((item) => item.nomor === '101');
    room.dailyCalendar = {
      '2026-11-20': { available: false, price: 0, note: 'Dipakai sendiri' },
      '2026-11-21': { available: true, price: 350000, note: 'Weekend' },
    };
  });

  const updated = getRoom(vip.id);
  assert.equal(isDailyAvailable(updated, '2026-11-20'), false);
  assert.equal(isDailyAvailable(updated, '2026-11-21'), true);

  const quote = computeQuote({
    lantai: '1',
    room: updated,
    periode: 'harian',
    startDate: '2026-11-21',
    endDate: '2026-11-23',
    depositEnabled: false,
    payOption: 'partial',
  });
  assert.equal(quote.base, 350000 + 250000);

  assert.throws(
    () =>
      saveBooking(vip.id, {
        ...bookingPayload(),
        startDate: '2026-11-20',
        endDate: '2026-11-21',
      }),
    /tidak tersedia/,
  );
});

test('room 101 rejects monthly bookings but accepts daily bookings', () => {
  fresh();
  const vip = getRooms().find((room) => room.nomor === '101');
  assert.throws(
    () => saveBooking(vip.id, bookingPayload({ periode: '1', endDate: '' })),
    /tidak mendukung durasi/,
  );
  const saved = saveBooking(vip.id, bookingPayload());
  assert.equal(saved.status, 'booking');
  assert.equal(saved.booking.periode, 'harian');
});

test('a booking can be moved to another room without deleting it', () => {
  fresh();
  const source = getRooms().find((room) => room.nomor === '201');
  const target = getRooms().find((room) => room.nomor === '202');
  saveBooking(source.id, bookingPayload({ periode: '1', endDate: '', name: 'Budi' }));

  const moved = moveBooking(source.id, target.id);
  assert.equal(moved.nomor, '202');
  assert.equal(moved.booking.name, 'Budi');
  assert.equal(moved.booking.movedFrom.roomNumber, '201');
  assert.equal(getRoom(source.id).status, 'kosong');
  assert.equal(getRoom(source.id).booking, null);
  assert.equal(getRoom(target.id).status, 'booking');

  const vip = getRooms().find((room) => room.nomor === '101');
  assert.throws(
    () => moveBooking(target.id, vip.id),
    /tidak mendukung durasi/,
  );
});

test('parking uses one flat Rp130.000 tariff for daily stays', () => {
  fresh();
  const quote = computeQuote({
    lantai: '2',
    periode: 'harian',
    startDate: '2026-11-10',
    endDate: '2026-11-13',
    addons: [carAddon()],
    depositEnabled: false,
    payOption: 'partial',
  });
  assert.equal(quote.units, 3);
  assert.equal(quote.addonTotal, 130_000);
});

test('parking usage counts active cars and can be overbooked by admin', () => {
  fresh();
  updateSettings({ parkingCapacity: 1 });
  const room = getRooms().find((item) => item.nomor === '201');
  checkInDirect(room.id, {
    name: 'Budi',
    phone: '08123456789',
    email: 'budi@example.com',
    periode: '1',
    startDate: '2026-11-10',
    addons: [carAddon()],
    depositEnabled: false,
    depositValue: 0,
    payOption: 'partial',
  });

  let status = getCarParkingStatus();
  assert.equal(status.used, 1);
  assert.equal(status.full, true);
  assert.match(parkingFullMessage(), /penuh/i);

  // Admin flow still allows adding another car (overbook).
  const other = getRooms().find((item) => item.nomor === '202');
  saveBooking(other.id, {
    name: 'Sari',
    phone: '08129876543',
    email: 'sari@example.com',
    periode: '1',
    startDate: '2026-11-10',
    addons: [carAddon()],
    depositEnabled: false,
    depositValue: 0,
    payOption: 'partial',
  });

  status = getCarParkingStatus();
  assert.equal(status.used, 2);
  assert.equal(status.overbooked, true);
});

test('public API normalization adds room 101 before the admin device syncs', () => {
  const seed = buildSeedState();
  const state = normalizePublicState({
    ...seed,
    rooms: seed.rooms.filter((room) => room.lantai !== '1'),
    pricing: { lantai2: seed.pricing.lantai2, lantai3: seed.pricing.lantai3 },
  });
  assert.equal(state.rooms.length, 43);
  assert.equal(state.rooms.some((room) => room.nomor === '101'), true);
  assert.equal(state.pricing.lantai1.harian, 250000);
  assert.equal(state.settings.parkingCapacity, 15);
});

test('booking payment verification marks rent + deposit paid and carries deposit to check-in', () => {
  fresh();
  const room = getRooms().find((item) => item.nomor === '201');
  saveBooking(room.id, {
    ...bookingPayload({ periode: '1', endDate: '' }),
    depositEnabled: true,
    depositValue: 500000,
    depositPaidNow: false,
    payOption: 'partial',
  });

  let booking = getRoom(room.id).booking;
  assert.equal(booking.paymentStatus, 'unpaid');
  assert.equal(booking.depositPaid, 0);

  const verified = verifyBookingPayment(room.id, {
    method: 'Transfer Bank Mandiri',
    note: 'Transfer a.n. Budi',
  });
  booking = verified.booking;
  assert.equal(booking.paymentStatus, 'paid');
  assert.equal(booking.depositPaid, 500000);
  assert.equal(booking.amountPaid, booking.grandTotal + 500000);
  assert.ok(
    booking.depositHistory.some((entry) =>
      String(entry.note || '').toLowerCase().includes('deposit booking'),
    ),
  );

  const tenant = checkInFromBooking(room.id, { settle: true });
  assert.equal(tenant.depositPaid, 500000);
});

test('booking payment verification can be reverted', () => {
  fresh();
  const room = getRooms().find((item) => item.nomor === '202');
  saveBooking(room.id, {
    ...bookingPayload({ periode: '1', endDate: '' }),
    depositEnabled: true,
    depositValue: 500000,
    depositPaidNow: false,
    payOption: 'partial',
  });
  verifyBookingPayment(room.id);
  const unpaid = markBookingPaymentUnpaid(room.id);
  assert.equal(unpaid.booking.paymentStatus, 'unpaid');
  assert.equal(unpaid.booking.depositPaid, 0);
  assert.equal(unpaid.booking.amountPaid, 0);
});

test('only bank transfer and cash are offered, and billing email includes Mandiri account', () => {
  assert.deepEqual(PAYMENT_METHODS, ['Transfer Bank Mandiri', 'Tunai / Cash']);
  const email = buildBillingEmail({
    name: 'Budi',
    title: 'Tagihan Sewa',
    amount: 2200000,
    dueDate: '2026-11-20',
  });
  assert.match(email.text, /Bank Mandiri/);
  assert.match(email.text, /700013745877/);
  assert.match(email.text, /ERNY KURNIAWATI/);
  assert.doesNotMatch(email.text, /QRIS/);
});

test('old saves without floor 1 receive the VIP room and room fields', () => {
  const seed = buildSeedState();
  const old = {
    ...seed,
    version: 8,
    rooms: seed.rooms
      .filter((room) => room.lantai !== '1')
      .map(({ tipe, dailyEnabled, monthlyEnabled, ...room }) => room),
  };
  replaceState(old);
  const rooms = getState().rooms;
  assert.equal(rooms.some((room) => room.nomor === '101'), true);
  assert.equal(rooms.length, 43);
  assert.equal(
    rooms.find((room) => room.nomor === '201').dailyEnabled,
    true,
  );
});
