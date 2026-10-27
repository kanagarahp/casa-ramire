import assert from 'node:assert/strict';
import test from 'node:test';

import { addDays, todayISO } from '../src/core/format.js';
import { buildSeedState } from '../src/core/seed.js';
import { replaceState } from '../src/core/store.js';
import { buildCatalogSnapshot } from '../src/services/catalog.js';
import { getExpiringContracts, getOverdueTenants } from '../src/services/reports.js';

function tenant(overrides = {}) {
  return {
    id: 1,
    name: 'Vallerie',
    phone: '081234567890',
    roomId: 1,
    roomNumber: '201',
    status: 'aktif',
    monthlyCharge: 2200000,
    totalPaid: 0,
    ...overrides,
  };
}

function bill(overrides = {}) {
  return {
    id: 1,
    tenantId: 1,
    roomId: 1,
    roomNumber: '201',
    tenantName: 'Vallerie',
    amount: 2200000,
    paid: 0,
    status: 'unpaid',
    type: 'Sewa',
    dueDate: addDays(todayISO(), -2),
    ...overrides,
  };
}

test('overdue tenants group unpaid bills and count the longest delay', () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    tenants: [tenant()],
    bills: [
      bill({ id: 1, amount: 1000000, dueDate: addDays(todayISO(), -2) }),
      bill({ id: 2, amount: 500000, dueDate: addDays(todayISO(), -5) }),
      bill({ id: 3, amount: 900000, status: 'paid', paid: 900000, dueDate: addDays(todayISO(), -9) }),
      bill({ id: 4, amount: 700000, dueDate: addDays(todayISO(), 3) }),
    ],
  });

  const overdue = getOverdueTenants();
  assert.equal(overdue.length, 1);
  assert.equal(overdue[0].name, 'Vallerie');
  assert.equal(overdue[0].daysOverdue, 5);
  assert.equal(overdue[0].amount, 1500000);
  assert.equal(overdue[0].bills.length, 2);
});

test('overdue notification disappears once all bills are paid', () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    tenants: [tenant()],
    bills: [
      bill({ id: 1, amount: 1000000, dueDate: addDays(todayISO(), -2) }),
    ],
  });

  assert.equal(getOverdueTenants().length, 1);

  replaceState({
    ...seed,
    tenants: [tenant()],
    bills: [
      bill({ id: 1, amount: 1000000, paid: 1000000, status: 'paid', dueDate: addDays(todayISO(), -2) }),
    ],
  });

  assert.equal(getOverdueTenants().length, 0);
});

test('overdue ignores inactive tenants and bills that are not due yet', () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    tenants: [tenant({ status: 'checkout' })],
    bills: [
      bill({ id: 1, dueDate: addDays(todayISO(), -2) }),
      bill({ id: 2, tenantId: 2, dueDate: addDays(todayISO(), 2) }),
    ],
  });

  assert.equal(getOverdueTenants().length, 0);
});

test('expiring contracts include only active tenants within seven days', () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    tenants: [
      tenant({ id: 1, name: 'Segera Berakhir', endDate: addDays(todayISO(), 3) }),
      tenant({ id: 2, name: 'Masih Lama', endDate: addDays(todayISO(), 10) }),
      tenant({ id: 3, name: 'Sudah Checkout', status: 'checkout', endDate: addDays(todayISO(), 2) }),
    ],
    bills: [],
  });

  const expiring = getExpiringContracts(7);
  assert.equal(expiring.length, 1);
  assert.equal(expiring[0].tenant.name, 'Segera Berakhir');
  assert.equal(expiring[0].daysLeft, 3);
});

test('public catalog snapshot never exposes private admin or tenant data', () => {
  const seed = buildSeedState();
  replaceState({
    ...seed,
    settings: {
      ...seed.settings,
      whatsapp: '081234567890',
      catalogAdminKey: 'super-secret-key',
    },
    tenants: [tenant()],
    bills: [bill()],
  });

  const snapshot = buildCatalogSnapshot();
  const serialized = JSON.stringify(snapshot);

  assert.equal(snapshot.property.whatsapp, '081234567890');
  assert.equal(snapshot.rooms.length, 42);
  assert.equal(serialized.includes('super-secret-key'), false);
  assert.equal(serialized.includes('Vallerie'), false);
  assert.equal(serialized.includes('081234567890'), true); // admin WA is intentionally public
});
