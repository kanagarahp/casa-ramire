/** Formatting and date helpers (Indonesian locale). */

const DAY_MS = 24 * 60 * 60 * 1000;

export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const cleaned = String(value ?? '').replace(/[^\d.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** @returns {string} e.g. "Rp2.200.000" */
export function rupiah(value) {
  return `Rp${Math.round(toNumber(value)).toLocaleString('id-ID')}`;
}

/** Compact rupiah for tight KPI cards: Rp2,2 jt */
export function rupiahCompact(value) {
  const n = toNumber(value);
  if (Math.abs(n) >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
  if (Math.abs(n) >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`;
  if (Math.abs(n) >= 1_000) return `Rp${(n / 1_000).toFixed(0)} rb`;
  return rupiah(n);
}

/** Local (not UTC) ISO date: YYYY-MM-DD */
export function toISODate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

/** Parse YYYY-MM-DD as a local date (avoids UTC off-by-one). */
export function parseISODate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(dateISO, days) {
  const date = parseISODate(dateISO) || new Date();
  date.setDate(date.getDate() + Number(days || 0));
  return toISODate(date);
}

export function addMonths(dateISO, months) {
  const date = parseISODate(dateISO) || new Date();
  const targetDay = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + Number(months || 0));
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(targetDay, lastDay));
  return toISODate(date);
}

/** Whole days between two ISO dates (end - start). */
export function daysBetween(startISO, endISO) {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

export function formatDate(value, options = {}) {
  const date = value instanceof Date ? value : parseISODate(value);
  if (!date) return '—';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatDateLong(value) {
  return formatDate(value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function monthKey(value = new Date()) {
  const date = value instanceof Date ? value : parseISODate(value) || new Date(value);
  if (!date || Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function isInMonth(value, reference = new Date()) {
  return monthKey(value) === monthKey(reference);
}

export function formatPeriodLabel(periode, units) {
  if (periode === 'harian') return `${units} hari`;
  if (periode === 'mingguan') return `${units} minggu`;
  return `${units} bulan`;
}

/** Convert a local phone number to the international format used by wa.me. */
export function normalizePhone(value) {
  let digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith('620')) digits = `62${digits.slice(3)}`;
  else if (digits.startsWith('8')) digits = `62${digits}`;
  return digits;
}

export function waLink(phone, message = '') {
  const target = normalizePhone(phone);
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${target}${query}`;
}

export function initials(name = '') {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);
  return words.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || '?';
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function plural(count, singular, pluralForm = `${singular}`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
