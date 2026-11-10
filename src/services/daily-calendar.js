import { addDays, daysBetween, parseISODate, todayISO, toNumber } from '../core/format.js';

/**
 * Per-date calendar for the Deluxe VIP room on floor 1.
 *
 * Shape: { 'YYYY-MM-DD': { available: boolean, price: number, note: string } }
 * Missing date = available with the default daily rate.
 */
export function normalizeDailyCalendar(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const [date, entry] of Object.entries(value)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!entry || typeof entry !== 'object') continue;
    result[date] = {
      available: entry.available !== false,
      price: Math.max(0, Math.round(toNumber(entry.price))),
      note: String(entry.note || '').trim(),
    };
  }
  return result;
}

export function getDailyCalendar(room) {
  return normalizeDailyCalendar(room?.dailyCalendar);
}

export function getDailyEntry(room, date) {
  return getDailyCalendar(room)[String(date || '').slice(0, 10)] || null;
}

export function isDateBlocked(room, date) {
  const entry = getDailyEntry(room, date);
  return Boolean(entry && entry.available === false);
}

export function dailyPriceForDate(room, date, fallbackRate) {
  const entry = getDailyEntry(room, date);
  if (entry && entry.price > 0) return entry.price;
  return Math.max(0, Math.round(toNumber(fallbackRate)));
}

export function datesInRange(startDate, endDate, { includeEnd = false } = {}) {
  const start = parseISODate(startDate) ? startDate : todayISO();
  let end = parseISODate(endDate) ? endDate : addDays(start, 1);
  if (daysBetween(start, end) <= 0) end = addDays(start, 1);
  const last = includeEnd ? end : addDays(end, -1);
  const total = Math.max(0, daysBetween(start, last)) + 1;
  const dates = [];
  for (let index = 0; index < total; index += 1) dates.push(addDays(start, index));
  return dates;
}

/** Booking stay dates: start inclusive, check-out date exclusive. */
export function stayDates(startDate, endDate) {
  return datesInRange(startDate, endDate, { includeEnd: false });
}

export function rangeAvailability(room, startDate, endDate) {
  const dates = stayDates(startDate, endDate);
  const blockedDates = dates.filter((date) => isDateBlocked(room, date));
  return { available: blockedDates.length === 0, blockedDates, dates };
}

export function dailyTotalForRange(room, startDate, endDate, fallbackRate) {
  return stayDates(startDate, endDate).reduce(
    (sum, date) => sum + dailyPriceForDate(room, date, fallbackRate),
    0,
  );
}
