import {
  daysBetween,
  isInMonth,
  monthKey,
  toNumber,
  todayISO,
} from '../core/format.js';
import { getState } from '../core/store.js';

export function getDashboardStats() {
  const state = getState();
  const rooms = state.rooms;
  const total = rooms.length;
  const occupied = rooms.filter((room) => room.status === 'terisi').length;
  const vacant = rooms.filter((room) => room.status === 'kosong').length;
  const booking = rooms.filter((room) => room.status === 'booking').length;

  const accrual = getAccrualReport();
  const outstandingBills = state.bills
    .filter((bill) => bill.status === 'unpaid')
    .reduce((sum, bill) => sum + toNumber(bill.amount - bill.paid), 0);
  const outstandingInvoices = state.manualInvoices
    .filter((invoice) => invoice.status === 'unpaid')
    .reduce((sum, invoice) => sum + toNumber(invoice.amount - invoice.paid), 0);

  const monthExpenses = state.expenses
    .filter((expense) => isInMonth(expense.date))
    .reduce((sum, expense) => sum + toNumber(expense.amount), 0);

  return {
    total,
    occupied,
    vacant,
    booking,
    occupancy: total ? (occupied / total) * 100 : 0,
    revenue: accrual.totalRecognized,
    expenses: monthExpenses,
    profit: accrual.totalRecognized - monthExpenses,
    outstanding: outstandingBills + outstandingInvoices,
    expiring: getExpiringContracts(7),
    pendingRenewals: getPendingRenewals(),
    overdue: getOverdueTenants(),
    checkins: getUpcomingCheckins(),
    unpaidBills: getOutstandingBills(),
    floors: getFloorStats(),
  };
}

export function getFloorStats() {
  const rooms = getState().rooms;
  const floors = [...new Set(rooms.map((room) => room.lantai))].sort();
  return floors.map((floor) => {
    const scoped = rooms.filter((room) => room.lantai === floor);
    const occupied = scoped.filter((room) => room.status === 'terisi').length;
    const vacant = scoped.filter((room) => room.status === 'kosong').length;
    const booking = scoped.filter((room) => room.status === 'booking').length;
    return {
      floor,
      total: scoped.length,
      occupied,
      vacant,
      booking,
      occupancy: scoped.length ? (occupied / scoped.length) * 100 : 0,
    };
  });
}

export function getUpcomingCheckins() {
  return getState()
    .rooms.filter((room) => room.status === 'booking' && room.booking)
    .map((room) => ({ room, booking: room.booking }))
    .sort((a, b) => String(a.booking.startDate).localeCompare(String(b.booking.startDate)));
}

function hasActivePendingRenewal(tenant, today) {
  const pending = tenant.pendingRenewal;
  if (!pending) return false;
  if (!pending.expiresAt) return true;
  return pending.expiresAt >= today;
}

/** Active contracts that end within `days` (overdue contracts are included). */
export function getExpiringContracts(days = 7) {
  const today = todayISO();
  return getState()
    .tenants.filter((tenant) => tenant.status === 'aktif' && tenant.endDate)
    .filter((tenant) => !hasActivePendingRenewal(tenant, today))
    .map((tenant) => ({
      tenant,
      roomNumber: tenant.roomNumber,
      daysLeft: daysBetween(today, tenant.endDate),
    }))
    .filter((entry) => entry.daysLeft <= days)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

/** Tenants waiting for a DOKU renewal payment link to be paid. */
export function getPendingRenewals() {
  const today = todayISO();
  return getState()
    .tenants.filter(
      (tenant) =>
        tenant.status === 'aktif' &&
        tenant.pendingRenewal &&
        hasActivePendingRenewal(tenant, today),
    )
    .map((tenant) => ({
      tenant,
      amount: toNumber(tenant.pendingRenewal.amount),
      paymentUrl: tenant.pendingRenewal.paymentUrl || '',
      paymentId: tenant.pendingRenewal.paymentId || '',
      expiresAt: tenant.pendingRenewal.expiresAt || '',
    }))
    .sort((a, b) => String(a.expiresAt).localeCompare(String(b.expiresAt)));
}

export function getOutstandingBills() {
  return getState()
    .bills.filter((bill) => bill.status === 'unpaid')
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
}

/**
 * Active tenants with at least one unpaid bill whose due date has arrived.
 *
 * The dashboard notification is derived from the bill status, so it disappears
 * automatically once every overdue bill for that tenant is verified as paid.
 */
export function getOverdueTenants() {
  const state = getState();
  const today = todayISO();
  const groups = new Map();

  for (const bill of state.bills) {
    if (bill.status === 'paid' || !bill.dueDate || bill.dueDate > today) continue;

    const tenant = bill.tenantId
      ? state.tenants.find((item) => String(item.id) === String(bill.tenantId))
      : null;

    if (!tenant || tenant.status !== 'aktif') continue;

    const key = String(tenant.id);
    const days = Math.max(0, daysBetween(bill.dueDate, today));
    const outstanding = Math.max(0, toNumber(bill.amount) - toNumber(bill.paid));

    if (outstanding <= 0) continue;

    const entry = groups.get(key) || {
      tenant,
      name: tenant.name,
      phone: tenant.phone || '',
      roomNumber: tenant.roomNumber || '—',
      daysOverdue: 0,
      dueDate: bill.dueDate,
      amount: 0,
      bills: [],
    };

    entry.amount += outstanding;
    entry.daysOverdue = Math.max(entry.daysOverdue, days);
    if (bill.dueDate < entry.dueDate) entry.dueDate = bill.dueDate;
    entry.bills.push(bill);
    groups.set(key, entry);
  }

  return [...groups.values()]
    .map((entry) => ({
      ...entry,
      bills: [...entry.bills].sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate))),
    }))
    .sort(
      (a, b) =>
        b.daysOverdue - a.daysOverdue ||
        a.name.localeCompare(b.name, 'id'),
    );
}

/**
 * Revenue recognition per active tenant.
 *
 * Every month of an active contract is recognised at its recurring monthly
 * value. Anything paid above that is deferred revenue (advance payment).
 * Deposits are excluded because they are liabilities, not rent.
 */
export function getAccrualReport() {
  const state = getState();
  const rows = [];

  for (const tenant of state.tenants.filter((item) => item.status === 'aktif')) {
    const monthlyCharge = Math.max(0, toNumber(tenant.monthlyCharge));
    const paid = Math.max(0, toNumber(tenant.totalPaid));
    const recognized = monthlyCharge;
    const deferred = Math.max(0, paid - monthlyCharge);
    const outstanding = Math.max(0, monthlyCharge - paid);

    rows.push({
      tenant,
      name: tenant.name,
      roomNumber: tenant.roomNumber || '—',
      paid,
      monthlyCharge,
      recognized,
      deferred,
      outstanding,
    });
  }

  rows.sort((a, b) => a.name.localeCompare(b.name, 'id'));

  return {
    rows,
    totalRecognized: rows.reduce((sum, row) => sum + row.recognized, 0),
    totalDeferred: rows.reduce((sum, row) => sum + row.deferred, 0),
    totalPaid: rows.reduce((sum, row) => sum + row.paid, 0),
    totalOutstanding: rows.reduce((sum, row) => sum + row.outstanding, 0),
  };
}

export function getProfitLoss(reference = new Date()) {
  const state = getState();
  const accrual = getAccrualReport();

  const serviceRevenue = state.manualInvoices
    .filter((invoice) => invoice.status === 'paid' && isInMonth(invoice.paidAt, reference))
    .reduce((sum, invoice) => sum + toNumber(invoice.paid), 0);

  const expenses = state.expenses.filter((expense) => isInMonth(expense.date, reference));
  const expenseTotal = expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);

  const byCategory = expenses.reduce((map, expense) => {
    const key = expense.category || 'Lain-lain';
    map[key] = (map[key] || 0) + toNumber(expense.amount);
    return map;
  }, {});

  const rentRevenue = accrual.totalRecognized;
  const revenue = rentRevenue + serviceRevenue;

  return {
    rentRevenue,
    serviceRevenue,
    revenue,
    expenses: expenseTotal,
    expenseByCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
    net: revenue - expenseTotal,
  };
}

/** Cash-in vs cash-out for the last `months` months (for the dashboard chart). */
export function getCashflowTrend(months = 6, reference = new Date()) {
  const state = getState();
  const buckets = [];

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(reference.getFullYear(), reference.getMonth() - index, 1);
    buckets.push({
      key: monthKey(date),
      label: date.toLocaleDateString('id-ID', { month: 'short' }),
      income: 0,
      expense: 0,
    });
  }

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const bill of state.bills) {
    if (bill.status !== 'paid' || !bill.paidAt) continue;
    const bucket = byKey.get(monthKey(bill.paidAt));
    if (bucket) bucket.income += toNumber(bill.paid);
  }

  for (const invoice of state.manualInvoices) {
    if (invoice.status !== 'paid' || !invoice.paidAt) continue;
    const bucket = byKey.get(monthKey(invoice.paidAt));
    if (bucket) bucket.income += toNumber(invoice.paid);
  }

  for (const expense of state.expenses) {
    const bucket = byKey.get(monthKey(expense.date));
    if (bucket) bucket.expense += toNumber(expense.amount);
  }

  return buckets.map((bucket) => ({ ...bucket, net: bucket.income - bucket.expense }));
}

export function getRoomStatusSummary() {
  const rooms = getState().rooms;
  return {
    total: rooms.length,
    kosong: rooms.filter((room) => room.status === 'kosong').length,
    booking: rooms.filter((room) => room.status === 'booking').length,
    terisi: rooms.filter((room) => room.status === 'terisi').length,
  };
}
