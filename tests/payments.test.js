import assert from 'node:assert/strict';
import test from 'node:test';

import { addDays, todayISO } from '../src/core/format.js';
import { buildSeedState } from '../src/core/seed.js';
import { applyPaymentToState, sanitizeStateForServer } from '../api/_lib/state.js';

function makeState() {
  const state = buildSeedState();
  state.rooms[0].status = 'terisi';
  state.rooms[0].tenantId = 1;
  state.tenants = [
    {
      id: 1,
      name: 'Vallerie',
      phone: '081234567890',
      roomId: 1,
      roomNumber: '201',
      floor: '2',
      status: 'aktif',
      periode: '1',
      startDate: addDays(todayISO(), -28),
      endDate: addDays(todayISO(), 2),
      monthlyCharge: 2200000,
      totalPaid: 0,
      rentTotal: 2200000,
      addonTotal: 0,
      contractTotal: 2200000,
      addons: [],
      payments: [],
    },
  ];
  state.bills = [
    {
      id: 1,
      number: 'INV/202610/0001',
      tenantId: 1,
      roomId: 1,
      tenantName: 'Vallerie',
      phone: '081234567890',
      roomNumber: '201',
      type: 'Sewa',
      amount: 2200000,
      paid: 0,
      status: 'unpaid',
      dueDate: addDays(todayISO(), -2),
      createdAt: new Date().toISOString(),
      paidAt: null,
    },
  ];
  state.manualInvoices = [
    {
      id: 1,
      number: 'SRV/202610/0001',
      tenantId: 1,
      roomId: 1,
      tenantName: 'Vallerie',
      phone: '081234567890',
      roomNumber: '201',
      item: 'Laundry',
      amount: 50000,
      paid: 0,
      status: 'unpaid',
      dueDate: addDays(todayISO(), -1),
      createdAt: new Date().toISOString(),
      paidAt: null,
    },
  ];
  return state;
}

test('DOKU bill payment marks the bill paid and updates tenant cash', () => {
  const state = makeState();
  const result = applyPaymentToState(
    state,
    { id: 'CR-1', kind: 'bill', record_id: '1', amount: 2200000 },
    { channel: 'QRIS' },
  );

  assert.equal(result.applied, true);
  assert.equal(state.bills[0].status, 'paid');
  assert.equal(state.bills[0].paid, 2200000);
  assert.equal(state.bills[0].method, 'DOKU Checkout (QRIS)');
  assert.equal(state.tenants[0].totalPaid, 2200000);
  assert.equal(state.tenants[0].payments.length, 1);
});

test('DOKU invoice payment marks the manual invoice paid', () => {
  const state = makeState();
  const result = applyPaymentToState(
    state,
    { id: 'CR-2', kind: 'invoice', record_id: '1', amount: 50000 },
    { channel: 'VIRTUAL_ACCOUNT_BCA' },
  );

  assert.equal(result.applied, true);
  assert.equal(state.manualInvoices[0].status, 'paid');
  assert.equal(state.manualInvoices[0].paid, 50000);
  assert.equal(state.manualInvoices[0].method, 'DOKU Checkout (VIRTUAL_ACCOUNT_BCA)');
});

test('DOKU renewal payment extends the contract and creates a paid bill', () => {
  const state = makeState();
  const startDate = addDays(state.tenants[0].endDate, 1);
  const endDate = addDays(startDate, 30);

  const result = applyPaymentToState(
    state,
    {
      id: 'CR-3',
      kind: 'renewal',
      record_id: '1',
      tenant_id: '1',
      amount: 2200000,
      payload: {
        renewal: {
          tenantId: 1,
          periode: '1',
          periodLabel: '1 Bulan',
          startDate,
          endDate,
          base: 2200000,
          discount: 0,
          rentTotal: 2200000,
          addonTotal: 0,
          grandTotal: 2200000,
          monthlyCharge: 2200000,
          addons: [],
          promo: null,
        },
      },
    },
    { channel: 'QRIS' },
  );

  assert.equal(result.applied, true);
  assert.equal(state.tenants[0].endDate, endDate);
  assert.equal(state.tenants[0].totalPaid, 2200000);
  assert.equal(state.tenants[0].contractTotal, 4400000);
  const renewalBill = state.bills.find((bill) => bill.type === 'Perpanjangan');
  assert.ok(renewalBill);
  assert.equal(renewalBill.status, 'paid');
  assert.equal(renewalBill.amount, 2200000);
});

test('DOKU payment is idempotent when the bill is already paid', () => {
  const state = makeState();
  const payment = { id: 'CR-4', kind: 'bill', record_id: '1', amount: 2200000 };
  applyPaymentToState(state, payment, { channel: 'QRIS' });
  const second = applyPaymentToState(state, payment, { channel: 'QRIS' });

  assert.equal(second.applied, false);
  assert.equal(second.reason, 'already-paid');
  assert.equal(state.tenants[0].totalPaid, 2200000);
  assert.equal(state.tenants[0].payments.length, 1);
});

test('shared state strips auth, publish key, and local photo data URLs', () => {
  const state = makeState();
  state.settings.catalogAdminKey = 'secret-key';
  state.rooms[0].photo = 'data:image/jpeg;base64,abc';
  state.rooms[0].photoUrl = '/api/catalog/photo?id=1';
  const clean = sanitizeStateForServer(state);

  assert.equal('users' in clean, false);
  assert.equal('session' in clean, false);
  assert.equal('catalogAdminKey' in clean.settings, false);
  assert.equal(clean.rooms[0].photo, '');
  assert.equal(clean.rooms[0].photoUrl, '/api/catalog/photo?id=1');
});
