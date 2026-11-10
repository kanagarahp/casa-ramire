import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizePublicState } from '../api/_lib/state-normalize.js';
import { buildSeedState } from '../src/core/seed.js';
import { getState, replaceState } from '../src/core/store.js';
import {
  getDailyAvailableRooms,
  getDailySummary,
  isDailyAvailable,
} from '../src/services/daily.js';
import { getCarParkingStatus, parkingFullMessage } from '../src/services/parking.js';
import { carAddon, computeQuote, getRate } from '../src/services/pricing.js';
import {
  checkInDirect,
  getRoom,
  getRooms,
  moveBooking,
  saveBooking,
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

test('daily parking fee is charged per day, not as a monthly fee', () => {
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
  assert.equal(quote.addonTotal, 30_000);
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
