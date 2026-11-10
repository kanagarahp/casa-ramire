import { update } from '../core/store.js';
import { requireOwner } from './auth.js';
import { getRooms } from './property.js';

const SHORT_PERIODS = new Set(['harian', 'mingguan']);

export function isShortPeriod(periode) {
  return SHORT_PERIODS.has(String(periode));
}

export function roomType(room) {
  if (!room) return 'Deluxe';
  return String(room.tipe || (String(room.lantai) === '1' ? 'Deluxe VIP' : 'Deluxe'));
}

/** Rooms that may ever be offered for daily stays. */
export function isDailyRoom(room) {
  return Boolean(room) && room.dailyEnabled !== false;
}

/** A room is daily-available only while it is empty. */
export function isDailyAvailable(room) {
  return isDailyRoom(room) && room.status === 'kosong';
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

export function getDailyAvailableRooms() {
  return getDailyRooms().filter((room) => room.status === 'kosong');
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
  const available = rooms.filter((room) => room.status === 'kosong');
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
