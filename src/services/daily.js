import { addDays, todayISO } from '../core/format.js';
import { update } from '../core/store.js';
import { requireOwner } from './auth.js';
import {
  datesInRange,
  isDateBlocked,
  normalizeDailyCalendar,
  rangeAvailability,
} from './daily-calendar.js';
import { getRooms } from './property.js';

const SHORT_PERIODS = new Set(['harian', 'mingguan']);

export function isShortPeriod(periode) {
  return SHORT_PERIODS.has(String(periode));
}

export function roomType(room) {
  if (!room) return 'Deluxe';
  return String(room.tipe || (String(room.lantai) === '1' ? 'Deluxe VIP' : 'Deluxe'));
}

/**
 * All rooms can be offered for daily stays while empty.
 * Floors 2–3 follow monthly occupancy; floor 1 uses the date calendar.
 */
export function isDailyRoom(room) {
  return Boolean(room);
}

/** A room is daily-available for a date when empty and not blocked. */
export function isDailyAvailable(room, date = todayISO()) {
  if (!isDailyRoom(room) || room.status !== 'kosong') return false;
  if (String(room.lantai) !== '1') return true;
  return !isDateBlocked(room, date);
}

export function isDailyAvailableForRange(room, startDate, endDate) {
  if (!isDailyRoom(room) || room.status !== 'kosong') return false;
  if (String(room.lantai) !== '1') return true;
  return rangeAvailability(room, startDate, endDate).available;
}

export function isMonthlyAvailable(room) {
  return Boolean(room) && room.monthlyEnabled !== false && room.status === 'kosong';
}

/** Periods offered by a room, used by both admin and landing forms. */
export function periodsForRoom(room) {
  if (!room) return [];
  if (String(room.lantai) === '1' || room.monthlyEnabled === false) {
    return ['harian'];
  }
  return ['harian', 'mingguan', '1', '3', '6', '12'];
}

export function roomSupportsPeriod(room, periode) {
  return periodsForRoom(room).includes(String(periode));
}

export function getDailyRooms() {
  return getRooms()
    .filter(isDailyRoom)
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));
}

export function getDailyAvailableRooms({ startDate = todayISO(), endDate = addDays(startDate, 1) } = {}) {
  return getDailyRooms().filter((room) =>
    isDailyAvailableForRange(room, startDate, endDate),
  );
}

export function getMonthlyAvailableRooms() {
  return getRooms()
    .filter(isMonthlyAvailable)
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));
}

export function getDailyBookings() {
  return getDailyRooms().filter(
    (room) => room.status === 'booking' && room.booking && isShortPeriod(room.booking.periode),
  );
}

export function getDailyOccupants() {
  return getDailyRooms().filter(
    (room) => room.status === 'terisi' && room.tenantId,
  );
}

export function getDailySummary() {
  const rooms = getDailyRooms();
  const startDate = todayISO();
  const endDate = addDays(startDate, 1);
  const available = rooms.filter((room) =>
    isDailyAvailableForRange(room, startDate, endDate),
  );
  const booked = rooms.filter(
    (room) => room.status === 'booking' && isShortPeriod(room.booking?.periode),
  );
  const occupied = rooms.filter((room) => room.status === 'terisi');
  return {
    total: rooms.length,
    available: available.length,
    booked: booked.length,
    occupied: occupied.length,
    availableRooms: available,
    bookedRooms: booked,
    occupiedRooms: occupied,
  };
}

/** Owner-only daily availability switch. */
export function setRoomDailyEnabled(roomId, enabled) {
  requireOwner();
  update((draft) => {
    const room = draft.rooms.find((item) => String(item.id) === String(roomId));
    if (!room) throw new Error('Kamar tidak ditemukan.');
    if (String(room.lantai) === '1') {
      room.dailyEnabled = true;
      room.monthlyEnabled = false;
      return;
    }
    room.dailyEnabled = Boolean(enabled);
  });
}

/** Set price/availability for one date on the floor-1 VIP calendar. */
export function setRoomDailyEntry(roomId, { date, available = true, price = 0, note = '' }) {
  requireOwner();
  const cleanDate = String(date || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) throw new Error('Tanggal tidak valid.');
  const cleanPrice = Math.max(0, Math.round(Number(price) || 0));
  const cleanNote = String(note || '').trim();

  update((draft) => {
    const room = draft.rooms.find((item) => String(item.id) === String(roomId));
    if (!room) throw new Error('Kamar tidak ditemukan.');
    if (String(room.lantai) !== '1') {
      throw new Error('Kalender harga khusus hanya untuk kamar VIP lantai 1.');
    }
    const calendar = normalizeDailyCalendar(room.dailyCalendar);
    if (available !== false && cleanPrice <= 0 && !cleanNote) {
      delete calendar[cleanDate];
    } else {
      calendar[cleanDate] = {
        available: available !== false,
        price: cleanPrice,
        note: cleanNote,
      };
    }
    room.dailyCalendar = calendar;
  });
}

/** Apply the same availability/price to an inclusive date range. */
export function applyRoomDailyRange(
  roomId,
  { startDate, endDate, available = true, price = 0, note = '' },
) {
  requireOwner();
  const dates = datesInRange(startDate, endDate, { includeEnd: true });
  if (!dates.length) throw new Error('Rentang tanggal tidak valid.');
  const cleanPrice = Math.max(0, Math.round(Number(price) || 0));
  const cleanNote = String(note || '').trim();

  update((draft) => {
    const room = draft.rooms.find((item) => String(item.id) === String(roomId));
    if (!room) throw new Error('Kamar tidak ditemukan.');
    if (String(room.lantai) !== '1') {
      throw new Error('Kalender harga khusus hanya untuk kamar VIP lantai 1.');
    }
    const calendar = normalizeDailyCalendar(room.dailyCalendar);
    for (const date of dates) {
      if (available !== false && cleanPrice <= 0 && !cleanNote) {
        delete calendar[date];
      } else {
        calendar[date] = {
          available: available !== false,
          price: cleanPrice,
          note: cleanNote,
        };
      }
    }
    room.dailyCalendar = calendar;
  });
  return dates;
}

export function removeRoomDailyEntry(roomId, date) {
  requireOwner();
  const cleanDate = String(date || '').slice(0, 10);
  update((draft) => {
    const room = draft.rooms.find((item) => String(item.id) === String(roomId));
    if (!room) throw new Error('Kamar tidak ditemukan.');
    const calendar = normalizeDailyCalendar(room.dailyCalendar);
    delete calendar[cleanDate];
    room.dailyCalendar = calendar;
  });
}

export function clearRoomDailyCalendar(roomId) {
  requireOwner();
  update((draft) => {
    const room = draft.rooms.find((item) => String(item.id) === String(roomId));
    if (!room) throw new Error('Kamar tidak ditemukan.');
    room.dailyCalendar = {};
  });
}

export function setRoomType(roomId, tipe) {
  requireOwner();
  const allowed = ['Deluxe', 'Deluxe VIP'];
  if (!allowed.includes(tipe)) throw new Error('Tipe kamar tidak valid.');
  update((draft) => {
    const room = draft.rooms.find((item) => String(item.id) === String(roomId));
    if (!room) throw new Error('Kamar tidak ditemukan.');
    room.tipe = tipe;
  });
}
