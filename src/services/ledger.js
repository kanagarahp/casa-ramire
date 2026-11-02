import { toNumber, todayISO } from '../core/format.js';
import { getState } from '../core/store.js';
import { depositLedgerEntries, getDepositSummary } from './deposit.js';

function timestamp(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function dateOnly(value) {
  return String(value || '').slice(0, 10);
}

function itemText(items = []) {
  return items
    .map(
      (item) =>
        `${item.name} ×${(Number(item.qty) || 0).toLocaleString('id-ID', {
          maximumFractionDigits: 2,
        })}${item.unit ? ` ${item.unit}` : ''}`,
    )
    .join(', ');
}

function makeEntry({
  key,
  date,
  sortDate,
  category,
  description,
  reference = '',
  party = '',
  roomNumber = '',
  method = '',
  direction = 'in',
  amount = 0,
  sourceType = '',
  sourceId = null,
  isDeposit = false,
}) {
  return {
    key,
    date: dateOnly(date) || todayISO(),
    sortDate: sortDate || date || '',
    timestamp: timestamp(sortDate || date),
    category,
    description,
    reference,
    party,
    roomNumber,
    method,
    direction,
    amount: Math.max(0, Math.round(toNumber(amount))),
    sourceType,
    sourceId,
    isDeposit,
  };
}

/** Build the unified cash ledger from every module in the app. */
export function buildLedgerEntries() {
  const state = getState();
  const entries = [];

  for (const deposit of depositLedgerEntries()) {
    entries.push(
      makeEntry({
        key: `deposit-${deposit.account.kind}-${deposit.account.id}-${deposit.id}`,
        date: deposit.date,
        sortDate: deposit.createdAt || deposit.date,
        category: deposit.direction === 'out' ? 'Refund Deposit' : 'Deposit / Jaminan',
        description:
          deposit.direction === 'out'
            ? `Pengembalian deposit ${deposit.account.name}`
            : `Deposit ${deposit.account.name}`,
        reference: deposit.note || deposit.kind || '',
        party: deposit.account.name,
        roomNumber: deposit.account.roomNumber,
        method: deposit.method,
        direction: deposit.direction,
        amount: deposit.amount,
        sourceType: deposit.account.kind,
        sourceId: deposit.account.id,
        isDeposit: true,
      }),
    );
  }

  for (const bill of state.bills || []) {
    if (bill.status !== 'paid' || toNumber(bill.paid) <= 0) continue;
    entries.push(
      makeEntry({
        key: `bill-${bill.id}`,
        date: bill.paidAt || bill.dueDate,
        sortDate: bill.paidAt || bill.dueDate,
        category: bill.type === 'Sewa' ? 'Sewa Kamar' : 'Tagihan Tambahan',
        description: bill.description || bill.type || 'Tagihan',
        reference: bill.number || '',
        party: bill.tenantName || '',
        roomNumber: bill.roomNumber || '',
        method: bill.method || '',
        direction: 'in',
        amount: bill.paid,
        sourceType: 'bill',
        sourceId: bill.id,
      }),
    );
  }

  for (const invoice of state.manualInvoices || []) {
    if (invoice.source === 'pos') continue;
    if (invoice.status !== 'paid' || toNumber(invoice.paid) <= 0) continue;
    entries.push(
      makeEntry({
        key: `invoice-${invoice.id}`,
        date: invoice.paidAt || invoice.dueDate,
        sortDate: invoice.paidAt || invoice.dueDate,
        category: 'Invoice Layanan',
        description: invoice.item || 'Invoice layanan',
        reference: invoice.number || '',
        party: invoice.tenantName || '',
        roomNumber: invoice.roomNumber || '',
        method: invoice.method || '',
        direction: 'in',
        amount: invoice.paid,
        sourceType: 'invoice',
        sourceId: invoice.id,
      }),
    );
  }

  for (const sale of state.posSales || []) {
    if (sale.status !== 'paid' || toNumber(sale.total) <= 0) continue;
    entries.push(
      makeEntry({
        key: `pos-${sale.id}`,
        date: sale.paidAt || sale.date,
        sortDate: sale.paidAt || sale.date,
        category: 'POS / Layanan',
        description: itemText(sale.items) || 'Penjualan POS',
        reference: sale.number || '',
        party: sale.customerName || '',
        roomNumber: sale.roomNumber || '',
        method: sale.method || '',
        direction: 'in',
        amount: sale.total,
        sourceType: 'pos',
        sourceId: sale.id,
      }),
    );
  }

  for (const expense of state.expenses || []) {
    if (toNumber(expense.amount) <= 0) continue;
    entries.push(
      makeEntry({
        key: `expense-${expense.id}`,
        date: expense.date,
        sortDate: expense.createdAt || expense.date,
        category: 'Pengeluaran',
        description: expense.description || expense.category || 'Pengeluaran',
        reference: expense.category || '',
        method: 'Kas',
        direction: 'out',
        amount: expense.amount,
        sourceType: 'expense',
        sourceId: expense.id,
      }),
    );
  }

  entries.sort((a, b) => a.timestamp - b.timestamp || a.key.localeCompare(b.key));
  let balance = 0;
  for (const entry of entries) {
    balance += entry.direction === 'in' ? entry.amount : -entry.amount;
    entry.balanceAfter = balance;
  }

  return entries;
}

export function getLedgerCategories() {
  return [...new Set(buildLedgerEntries().map((entry) => entry.category))].sort((a, b) =>
    a.localeCompare(b, 'id'),
  );
}

export function getLedgerEntries({ category = '', search = '', limit = 300 } = {}) {
  const term = String(search || '').trim().toLowerCase();
  return buildLedgerEntries()
    .filter((entry) => (category ? entry.category === category : true))
    .filter((entry) => {
      if (!term) return true;
      return [
        entry.description,
        entry.category,
        entry.reference,
        entry.party,
        entry.roomNumber,
        entry.method,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term);
    })
    .sort((a, b) => b.timestamp - a.timestamp || b.key.localeCompare(a.key))
    .slice(0, Math.max(1, Number(limit) || 300));
}

export function getLedgerSummary() {
  const entries = buildLedgerEntries();
  const totalIn = entries
    .filter((entry) => entry.direction === 'in')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalOut = entries
    .filter((entry) => entry.direction === 'out')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const depositIn = entries
    .filter((entry) => entry.isDeposit && entry.direction === 'in')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const depositOut = entries
    .filter((entry) => entry.isDeposit && entry.direction === 'out')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const deposit = getDepositSummary();

  return {
    totalIn,
    totalOut,
    balance: totalIn - totalOut,
    depositIn,
    depositOut,
    depositHeld: deposit.held,
    depositOutstanding: deposit.outstanding,
    operatingIn: totalIn - depositIn,
    count: entries.length,
  };
}
