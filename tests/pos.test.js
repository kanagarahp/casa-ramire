import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSeedState } from '../src/core/seed.js';
import { getState, replaceState } from '../src/core/store.js';
import { verifyManualInvoice } from '../src/services/billing.js';
import { buildBillingEmail } from '../src/services/email.js';
import {
  createPosSale,
  deletePosProduct,
  getPosProducts,
  getPosRevenue,
  getPosSummary,
  savePosProduct,
} from '../src/services/pos.js';
import { checkInDirect, getOutstandingForTenant } from '../src/services/property.js';
import { getCashflowTrend, getProfitLoss } from '../src/services/reports.js';

function fresh() {
  replaceState(buildSeedState());
}

test('POS seeds laundry products and owner can add/edit/delete them', () => {
  fresh();
  const products = getPosProducts();
  assert.ok(products.length > 0);
  assert.ok(products.some((product) => product.category === 'Laundry'));

  savePosProduct({
    name: 'Laundry Kiloan Express',
    category: 'Laundry',
    unit: 'kg',
    price: 9000,
  });
  const created = getPosProducts().find((product) => product.name === 'Laundry Kiloan Express');
  assert.equal(created.price, 9000);
  assert.equal(created.active, true);

  savePosProduct({
    id: created.id,
    name: 'Laundry Kiloan Express',
    category: 'Laundry',
    unit: 'kg',
    price: 11000,
    active: false,
  });
  assert.equal(getPosProducts().find((product) => product.id === created.id).price, 11000);

  deletePosProduct(created.id);
  assert.equal(getPosProducts().some((product) => product.id === created.id), false);
});

test('POS sale snapshots item prices, quantity, discount and change', () => {
  fresh();
  const products = getPosProducts();
  const laundry = products.find((product) => product.name === 'Cuci Kering Setrika');
  const bedCover = products.find((product) => product.name === 'Bed Cover');

  const sale = createPosSale({
    items: [
      { productId: laundry.id, qty: 3.5 },
      { productId: bedCover.id, qty: 1 },
    ],
    discount: 5000,
    method: 'Tunai / Cash',
    amountPaid: 60000,
    customerName: 'Budi',
    note: 'Antar sore',
    date: '2026-11-02',
  });

  assert.match(sale.number, /^POS\//);
  assert.equal(sale.items[0].price, 7000);
  assert.equal(sale.items[0].qty, 3.5);
  assert.equal(sale.items[0].subtotal, 24500);
  assert.equal(sale.subtotal, 49500);
  assert.equal(sale.discount, 5000);
  assert.equal(sale.total, 44500);
  assert.equal(sale.amountPaid, 60000);
  assert.equal(sale.change, 15500);
  assert.equal(sale.customerName, 'Budi');
  assert.equal(getState().posSales.length, 1);
});

test('POS rejects empty carts and underpayment', () => {
  fresh();
  assert.throws(() => createPosSale({ items: [] }), /Keranjang masih kosong/);

  const product = getPosProducts()[0];
  assert.throws(
    () =>
      createPosSale({
        items: [{ productId: product.id, qty: 1 }],
        amountPaid: 1,
      }),
    /pembayaran kurang/i,
  );
});

test('POS revenue is included in P&L and cashflow', () => {
  fresh();
  const product = getPosProducts()[0];
  const sale = createPosSale({
    items: [{ productId: product.id, qty: 2 }],
    amountPaid: null,
  });

  assert.equal(getPosRevenue(), sale.total);
  assert.equal(getPosSummary().monthRevenue, sale.total);

  const pnl = getProfitLoss();
  assert.equal(pnl.posRevenue, sale.total);
  assert.equal(pnl.revenue, sale.total);

  const trend = getCashflowTrend(6);
  const current = trend[trend.length - 1];
  assert.equal(current.income, sale.total);
});

test('older saves receive POS defaults while keeping existing data', () => {
  const seed = buildSeedState();
  const legacy = {
    ...seed,
    version: 5,
    posProducts: undefined,
    posSales: undefined,
    settings: { ...seed.settings },
  };
  delete legacy.settings.dokuEnabled;
  delete legacy.settings.paymentInstructions;

  replaceState(legacy);
  const migrated = getState();

  assert.ok(migrated.posProducts.length > 0);
  assert.deepEqual(migrated.posSales, []);
  assert.equal(migrated.settings.dokuEnabled, false);
  assert.equal(typeof migrated.settings.paymentInstructions, 'string');
});

test('POS tenant invoice becomes an unpaid receivable and verification updates the sale', () => {
  fresh();
  const tenant = checkInDirect(1, {
    name: 'Lita',
    phone: '081234567891',
    email: 'lita@example.com',
    periode: '1',
    startDate: '2026-11-01',
    depositEnabled: false,
    payOption: 'full',
  });
  const product = getPosProducts().find((item) => item.name === 'Cuci Kering Setrika');

  const sale = createPosSale({
    items: [{ productId: product.id, qty: 2 }],
    status: 'unpaid',
    tenantId: tenant.id,
    roomId: 1,
    dueDate: '2026-11-09',
    customerEmail: tenant.email,
  });

  assert.equal(sale.status, 'unpaid');
  assert.ok(sale.invoice);
  assert.equal(sale.invoice.status, 'unpaid');
  assert.equal(sale.invoice.tenantName, 'Lita');
  assert.equal(sale.invoice.roomNumber, '201');
  assert.equal(sale.invoice.source, 'pos');
  assert.equal(sale.invoice.posSaleId, sale.id);
  assert.equal(getOutstandingForTenant(tenant.id), sale.total);
  assert.equal(getPosRevenue(), 0);

  verifyManualInvoice(sale.invoice.id, { method: 'Tunai / Cash', note: 'Dibayar 2 hari kemudian' });

  const updatedSale = getState().posSales.find((item) => item.id === sale.id);
  const updatedTenant = getState().tenants.find((item) => item.id === tenant.id);
  assert.equal(updatedSale.status, 'paid');
  assert.equal(getPosRevenue(), sale.total);
  assert.equal(getOutstandingForTenant(tenant.id), 0);
  assert.ok(
    updatedTenant.payments.some((payment) => String(payment.invoiceId) === String(sale.invoice.id)),
  );
});

test('billing email works without a DOKU link', () => {
  fresh();
  const email = buildBillingEmail({
    name: 'Budi',
    title: 'Tagihan Sewa Kamar 201',
    invoiceNumber: 'INV/202611/0001',
    amount: 2200000,
    dueDate: '2026-11-10',
    paymentInstructions: 'Transfer BCA 1234567890 a.n. Casa Ramire.',
  });

  assert.match(email.subject, /Tagihan Sewa/);
  assert.match(email.text, /Rp2\.200\.000/);
  assert.match(email.text, /Transfer BCA 1234567890/);
  assert.equal(email.text.includes('https://checkout.doku.com'), false);
});
