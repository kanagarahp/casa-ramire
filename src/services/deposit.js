import { toNumber, todayISO } from '../core/format.js';
import { getState, update } from '../core/store.js';

function entryId(prefix = 'dep') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function normalizeDate(value, fallback = todayISO()) {
  return String(value || fallback).slice(0, 10);
}

function accountHistory(account, { kind, depositPaid, depositRefunded, fallbackDate }) {
  const stored = Array.isArray(account.depositHistory) ? account.depositHistory : [];
  if (stored.length) return stored;

  const entries = [];
  if (depositPaid > 0) {
    entries.push({
      id: entryId('dep-in'),
      type: 'in',
      kind: 'payment',
      amount: depositPaid,
      date: normalizeDate(fallbackDate),
      method: '',
      note: 'Deposit tercatat sebelumnya',
      createdAt: fallbackDate || '',
    });
  }
  if (depositRefunded > 0) {
    entries.push({
      id: entryId('dep-out'),
      type: 'out',
      kind: 'refund',
      amount: depositRefunded,
      date: normalizeDate(account.checkoutDate || fallbackDate),
      method: '',
      note: 'Pengembalian deposit sebelumnya',
      createdAt: account.checkoutDate || '',
    });
  }
  void kind;
  return entries;
}

function tenantAccount(tenant) {
  const deposit = Math.max(0, Math.round(toNumber(tenant.deposit)));
  const depositPaid = Math.max(0, Math.round(toNumber(tenant.depositPaid)));
  const depositRefunded = Math.max(0, Math.round(toNumber(tenant.depositRefunded)));
  const history = accountHistory(tenant, {
    kind: 'tenant',
    depositPaid,
    depositRefunded,
    fallbackDate: tenant.checkinDate || tenant.startDate || tenant.createdAt,
  });

  return {
    kind: 'tenant',
    id: tenant.id,
    tenantId: tenant.id,
    roomId: tenant.roomId,
    roomNumber: tenant.roomNumber || '—',
    name: tenant.name,
    status: tenant.status,
    deposit,
    depositPaid,
    depositRefunded,
    depositHeld: Math.max(0, depositPaid - depositRefunded),
    outstanding: Math.max(0, deposit - depositPaid),
    history,
    hasStoredHistory:
      Array.isArray(tenant.depositHistory) && tenant.depositHistory.length > 0,
  };
}

function bookingAccount(room) {
  const booking = room.booking;
  const deposit = Math.max(0, Math.round(toNumber(booking.deposit)));
  const depositPaid = Math.max(0, Math.round(toNumber(booking.depositPaid)));
  const depositRefunded = Math.max(0, Math.round(toNumber(booking.depositRefunded)));
  const history = accountHistory(booking, {
    kind: 'booking',
    depositPaid,
    depositRefunded,
    fallbackDate: booking.createdAt || booking.startDate,
  });

  return {
    kind: 'booking',
    id: room.id,
    tenantId: null,
    roomId: room.id,
    roomNumber: room.nomor,
    name: booking.name || 'Booking',
    status: 'booking',
    deposit,
    depositPaid,
    depositRefunded,
    depositHeld: Math.max(0, depositPaid - depositRefunded),
    outstanding: Math.max(0, deposit - depositPaid),
    history,
    hasStoredHistory:
      Array.isArray(booking.depositHistory) && booking.depositHistory.length > 0,
  };
}

function findAccount(draft, kind, id) {
  if (kind === 'booking') {
    const room = (draft.rooms || []).find((item) => String(item.id) === String(id));
    return room?.booking ? { account: room.booking, room } : null;
  }
  const tenant = (draft.tenants || []).find((item) => String(item.id) === String(id));
  return tenant ? { account: tenant, tenant } : null;
}

/** Active tenants and active bookings with their deposit position. */
export function getDepositAccounts() {
  const state = getState();
  const tenants = (state.tenants || [])
    .filter(
      (tenant) =>
        tenant.status === 'aktif' ||
        toNumber(tenant.depositPaid) > toNumber(tenant.depositRefunded),
    )
    .map((tenant) => tenantAccount(tenant));
  const bookings = (state.rooms || [])
    .filter((room) => room.status === 'booking' && room.booking)
    .map((room) => bookingAccount(room));

  return [...tenants, ...bookings].sort((a, b) =>
    String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true }),
  );
}

export function getDepositAccount(kind, id) {
  return getDepositAccounts().find(
    (account) => account.kind === kind && String(account.id) === String(id),
  ) || null;
}

export function getDepositSummary() {
  const accounts = getDepositAccounts();
  return {
    accounts: accounts.length,
    target: accounts.reduce((sum, account) => sum + account.deposit, 0),
    paid: accounts.reduce((sum, account) => sum + account.depositPaid, 0),
    refunded: accounts.reduce((sum, account) => sum + account.depositRefunded, 0),
    held: accounts.reduce((sum, account) => sum + account.depositHeld, 0),
    outstanding: accounts.reduce((sum, account) => sum + account.outstanding, 0),
    unpaidCount: accounts.filter((account) => account.outstanding > 0).length,
  };
}

export function setDepositTarget(kind, id, amount) {
  const value = Math.max(0, Math.round(toNumber(amount)));
  update((draft) => {
    const found = findAccount(draft, kind, id);
    if (!found) throw new Error('Data deposit tidak ditemukan.');
    found.account.deposit = value;
    found.account.updatedAt = new Date().toISOString();
  });
  return getDepositAccount(kind, id);
}

/**
 * Set the total deposit received. Increasing the amount records a cash-in
 * ledger entry; lowering it records a correction unless `replaceHistory` is
 * used by the spreadsheet importer.
 */
export function setDepositPaid(
  kind,
  id,
  amount,
  { date = todayISO(), method = 'Tunai / Cash', note = '', replaceHistory = false } = {},
) {
  const value = Math.max(0, Math.round(toNumber(amount)));
  let result = null;

  update((draft) => {
    const found = findAccount(draft, kind, id);
    if (!found) throw new Error('Data deposit tidak ditemukan.');
    const { account } = found;
    const current = Math.max(0, Math.round(toNumber(account.depositPaid)));
    const history = Array.isArray(account.depositHistory) ? account.depositHistory : [];
    const nextHistory = replaceHistory ? [] : [...history];

    if (!replaceHistory && !nextHistory.length && current > 0) {
      nextHistory.push({
        id: entryId('dep-in'),
        type: 'in',
        kind: 'payment',
        amount: current,
        date: normalizeDate(account.checkinDate || account.createdAt || date),
        method: '',
        note: 'Deposit tercatat sebelumnya',
        createdAt: '',
      });
    }

    if (replaceHistory) {
      if (value > 0) {
        nextHistory.push({
          id: entryId('dep-in'),
          type: 'in',
          kind: 'payment',
          amount: value,
          date: normalizeDate(date),
          method,
          note: note || 'Impor status deposit',
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      const delta = value - current;
      if (delta > 0) {
        nextHistory.push({
          id: entryId('dep-in'),
          type: 'in',
          kind: 'payment',
          amount: delta,
          date: normalizeDate(date),
          method,
          note: note || 'Pembayaran deposit',
          createdAt: new Date().toISOString(),
        });
      } else if (delta < 0) {
        nextHistory.push({
          id: entryId('dep-out'),
          type: 'out',
          kind: 'adjustment',
          amount: Math.abs(delta),
          date: normalizeDate(date),
          method,
          note: note || 'Koreksi status deposit',
          createdAt: new Date().toISOString(),
        });
      }
    }

    account.depositPaid = value;
    account.depositHistory = nextHistory;
    account.updatedAt = new Date().toISOString();
    result = account;
  });

  return result;
}

/** Refund part or all of the deposit held for an active tenant/booking. */
export function refundDeposit(
  kind,
  id,
  amount,
  { date = todayISO(), method = 'Tunai / Cash', note = 'Pengembalian deposit check-out' } = {},
) {
  const value = Math.max(0, Math.round(toNumber(amount)));
  if (value <= 0) throw new Error('Nominal pengembalian deposit harus lebih dari 0.');

  let result = null;
  update((draft) => {
    const found = findAccount(draft, kind, id);
    if (!found) throw new Error('Data deposit tidak ditemukan.');
    const { account } = found;
    const paid = Math.max(0, Math.round(toNumber(account.depositPaid)));
    const refunded = Math.max(0, Math.round(toNumber(account.depositRefunded)));
    const held = Math.max(0, paid - refunded);
    if (value > held) {
      throw new Error(`Nominal pengembalian melebihi deposit yang ditahan (${held}).`);
    }

    const history = Array.isArray(account.depositHistory) ? [...account.depositHistory] : [];
    if (!history.length && paid > 0) {
      history.push({
        id: entryId('dep-in'),
        type: 'in',
        kind: 'payment',
        amount: paid,
        date: normalizeDate(account.checkinDate || account.createdAt || date),
        method: '',
        note: 'Deposit tercatat sebelumnya',
        createdAt: '',
      });
    }
    history.push({
      id: entryId('dep-out'),
      type: 'out',
      kind: 'refund',
      amount: value,
      date: normalizeDate(date),
      method,
      note,
      createdAt: new Date().toISOString(),
    });

    account.depositRefunded = refunded + value;
    account.depositHistory = history;
    account.updatedAt = new Date().toISOString();
    result = account;
  });

  return result;
}

export function getDepositOutstanding(tenantId) {
  const tenant = (getState().tenants || []).find(
    (item) => String(item.id) === String(tenantId),
  );
  if (!tenant) return 0;
  return Math.max(0, toNumber(tenant.deposit) - toNumber(tenant.depositPaid));
}

export function depositLedgerEntries() {
  const state = getState();
  const accounts = [
    ...(state.tenants || []).map((tenant) => tenantAccount(tenant)),
    ...(state.rooms || [])
      .filter((room) => room.booking)
      .map((room) => bookingAccount(room)),
  ];

  return accounts.flatMap((account) =>
    account.history.map((entry) => ({
      ...entry,
      account,
      direction: entry.type === 'out' ? 'out' : 'in',
    })),
  );
}
