import { PERIODS } from '../core/constants.js';
import {
  addDays,
  addMonths,
  daysBetween,
  parseISODate,
  toNumber,
  todayISO,
} from '../core/format.js';
import { nextId } from '../core/id.js';
import { getState, update } from '../core/store.js';

export function priceKeyForFloor(lantai) {
  return String(lantai) === '3' ? 'lantai3' : 'lantai2';
}

export function getRates(lantai) {
  return getState().pricing[priceKeyForFloor(lantai)] || {};
}

export function getRate(lantai, periode) {
  return toNumber(getRates(lantai)?.[periode]);
}

export function getDepositDefault() {
  return toNumber(getState().settings?.depositDefault) || 500000;
}

export function periodDefinition(periode) {
  return PERIODS.find((item) => item.key === String(periode)) || PERIODS[0];
}

export function resolveEndDate({ periode, startDate, endDate }) {
  const period = periodDefinition(periode);
  const start = parseISODate(startDate) ? startDate : todayISO();

  if (period.kind === 'months') return addMonths(start, period.months);

  if (period.kind === 'days') {
    if (endDate && daysBetween(start, endDate) > 0) return endDate;
    return addDays(start, 1);
  }

  // weeks
  if (endDate && daysBetween(start, endDate) > 0) return endDate;
  return addDays(start, 7);
}

function unitsFor(period, startDate, endDate) {
  if (period.kind === 'months') return period.months;
  const days = Math.max(1, daysBetween(startDate, endDate));
  if (period.kind === 'days') return days;
  return Math.max(1, Math.ceil(days / 7));
}

function monthlyPromoDiscount(monthlyRate, promo) {
  if (!promo) return 0;
  if (promo.type === 'persen') return (monthlyRate * toNumber(promo.value)) / 100;
  return toNumber(promo.value);
}

/**
 * Calculate a full contract quote.
 *
 * Rules:
 * - Harian/Mingguan: tariff × units.
 * - Bulanan: tariff for the selected package (already the package total).
 * - Promo "rupiah" is per month; applied once for daily/weekly periods.
 * - Add-ons are monthly; multiplied by contract months for monthly packages.
 * - Deposit is a separate (returnable) amount, never counted as rent revenue.
 */
export function computeQuote({
  lantai,
  periode,
  startDate,
  endDate,
  promo = null,
  addons = [],
  depositEnabled = false,
  depositValue = 0,
  payOption = 'partial',
}) {
  const period = periodDefinition(periode);
  const start = parseISODate(startDate) ? startDate : todayISO();
  const resolvedEnd = resolveEndDate({ periode: period.key, startDate: start, endDate });

  if (period.kind !== 'months' && daysBetween(start, resolvedEnd) <= 0) {
    throw new Error('Tanggal selesai harus setelah tanggal mulai.');
  }

  const rate = getRate(lantai, period.key);
  if (!rate) throw new Error('Tarif untuk periode ini belum diatur di Pricelist.');

  const units = unitsFor(period, start, resolvedEnd);
  const base = period.kind === 'months' ? rate : rate * units;

  const grossDiscount = !promo
    ? 0
    : promo.type === 'persen'
      ? (base * toNumber(promo.value)) / 100
      : toNumber(promo.value) * (period.kind === 'months' ? period.months : 1);
  const discount = Math.min(base, Math.max(0, Math.round(grossDiscount)));

  const addonMonthly = (addons || []).reduce((sum, addon) => sum + toNumber(addon.price), 0);
  const addonTotal = period.kind === 'months' ? addonMonthly * period.months : addonMonthly;

  const rentTotal = Math.max(0, base - discount);
  const grandTotal = rentTotal + addonTotal;
  const deposit = depositEnabled ? Math.max(0, Math.round(toNumber(depositValue))) : 0;
  const isFull = payOption === 'full';

  const monthlyRate = getRate(lantai, '1') || Math.round(base / Math.max(1, units));
  const monthlyCharge = Math.max(0, Math.round(monthlyRate - monthlyPromoDiscount(monthlyRate, promo))) + addonMonthly;

  return {
    periode: period.key,
    periodLabel: period.label,
    unitLabel: period.unit,
    units,
    startDate: start,
    endDate: resolvedEnd,
    rate,
    base,
    discount,
    rentTotal,
    addonMonthly,
    addonTotal,
    grandTotal,
    deposit,
    payOption: isFull ? 'full' : 'partial',
    payNow: deposit + (isFull ? grandTotal : 0),
    rentPaidNow: isFull ? grandTotal : 0,
    remaining: isFull ? 0 : grandTotal,
    monthlyCharge,
    promo: promo
      ? { id: promo.id, name: promo.name, type: promo.type, value: toNumber(promo.value) }
      : null,
  };
}

export function getPromos({ activeOnly = false } = {}) {
  const promos = getState().promos || [];
  return activeOnly ? promos.filter((promo) => promo.active) : promos;
}

export function getPromo(id) {
  if (id === null || id === undefined || id === '' || id === 'none') return null;
  return getState().promos.find((promo) => String(promo.id) === String(id) && promo.active) || null;
}

export function savePromo({ id = null, name, type, value, active = true }) {
  const cleanName = String(name || '').trim();
  if (!cleanName) throw new Error('Nama promo wajib diisi.');
  if (!['rupiah', 'persen'].includes(type)) throw new Error('Tipe diskon tidak valid.');
  const cleanValue = toNumber(value);
  if (cleanValue <= 0) throw new Error('Nilai diskon harus lebih dari 0.');
  if (type === 'persen' && cleanValue > 100) throw new Error('Diskon persen maksimal 100%.');

  update((draft) => {
    if (id) {
      const target = draft.promos.find((promo) => String(promo.id) === String(id));
      if (!target) throw new Error('Promo tidak ditemukan.');
      Object.assign(target, { name: cleanName, type, value: cleanValue, active: Boolean(active) });
    } else {
      draft.promos.push({
        id: nextId(draft.promos),
        name: cleanName,
        type,
        value: cleanValue,
        active: Boolean(active),
      });
    }
  });
}

export function deletePromo(id) {
  update((draft) => {
    draft.promos = draft.promos.filter((promo) => String(promo.id) !== String(id));
  });
}

export function togglePromo(id) {
  update((draft) => {
    const target = draft.promos.find((promo) => String(promo.id) === String(id));
    if (target) target.active = !target.active;
  });
}

export function savePricing(lantai, rates) {
  const key = priceKeyForFloor(lantai);
  const current = getState().pricing[key] || {};
  const next = { ...current };

  for (const periode of PERIODS.map((item) => item.key)) {
    const value = toNumber(rates?.[periode]);
    if (value <= 0) throw new Error('Semua tarif harus lebih dari 0.');
    next[periode] = value;
  }

  update((draft) => {
    draft.pricing[key] = next;
  });
}
