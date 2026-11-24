import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildInvoiceEmail,
  buildInvoicePdf,
  normalizeInvoice,
} from '../api/_lib/invoice.js';

function sampleState() {
  return {
    settings: {
      propertyName: 'Casa Ramire',
      address: 'Kos Casa Ramire, Yogyakarta',
      whatsapp: '081116623661',
      email: 'casaramirejogja@gmail.com',
      bankName: 'Bank Mandiri',
      bankAccountNumber: '700013745877',
      bankAccountName: 'ERNY KURNIAWATI',
    },
    tenants: [
      {
        id: 1,
        name: 'Ms Gabriel Celine Yuwono',
        phone: '0812-2353-9190',
        email: 'gabriel@example.com',
      },
    ],
    bills: [
      {
        id: 1,
        number: 'INV/202611/0001',
        tenantId: 1,
        tenantName: 'Ms Gabriel Celine Yuwono',
        phone: '0812-2353-9190',
        email: 'gabriel@example.com',
        roomNumber: '319',
        type: 'Sewa 1 Tahun',
        amount: 22_500_000,
        paid: 22_500_000,
        status: 'paid',
        dueDate: '2027-01-31',
        periodStart: '2027-01-31',
        periodEnd: '2028-01-30',
        paidAt: '2026-11-01T10:00:00.000Z',
        method: 'Transfer Bank Mandiri',
      },
    ],
    manualInvoices: [],
    posSales: [],
  };
}

test('invoice data and email follow the requested layout', () => {
  const invoice = normalizeInvoice(sampleState(), { type: 'bill', id: 1 });
  assert.equal(invoice.number, 'INV/202611/0001');
  assert.equal(invoice.client.name, 'Ms Gabriel Celine Yuwono');
  assert.equal(invoice.client.phone, '0812-2353-9190');
  assert.equal(invoice.total, 22_500_000);
  assert.match(invoice.items[0].title, /Pembayaran Kamar #319/);
  assert.match(invoice.items[0].subtitle, /31 Jan 2027 - 30 Jan 2028/);

  const paid = buildInvoiceEmail(invoice, { mode: 'paid' });
  assert.match(paid.subject, /Terima kasih/i);
  assert.match(paid.text, /Pembayaran Anda sudah kami terima/i);
  assert.match(paid.text, /Rp22\.500\.000/);
  assert.match(paid.html, /Pembayaran diterima/i);

  const billing = buildInvoiceEmail(
    { ...invoice, status: 'unpaid', paid: 0, outstanding: invoice.total },
    { mode: 'billing' },
  );
  assert.match(billing.subject, /Invoice/);
  assert.match(billing.text, /Bank Mandiri/);
  assert.match(billing.text, /700013745877/);
});

test('invoice PDF renders an A4 document', async () => {
  const invoice = normalizeInvoice(sampleState(), { type: 'bill', id: 1 });
  const pdf = await buildInvoicePdf(invoice);
  assert.ok(pdf.length > 1_000);
  assert.equal(Buffer.from(pdf.slice(0, 4)).toString('utf8'), '%PDF');
});

test('POS and manual invoices normalize their line items', async () => {
  const state = sampleState();
  state.posSales = [
    {
      id: 9,
      number: 'POS/202611/0009',
      status: 'paid',
      customerName: 'Budi',
      customerPhone: '0812',
      customerEmail: 'budi@example.com',
      items: [
        { name: 'Laundry 5 Kg', qty: 1, unit: 'kg', price: 25_000, subtotal: 25_000 },
        { name: 'Setrika', qty: 2, unit: 'pcs', price: 5_000, subtotal: 10_000 },
      ],
      subtotal: 35_000,
      discount: 5_000,
      total: 30_000,
      amountPaid: 50_000,
      method: 'Tunai / Cash',
      paidAt: '2026-11-20T10:00:00.000Z',
    },
  ];
  state.manualInvoices = [
    {
      id: 4,
      number: 'SRV/202611/0004',
      status: 'unpaid',
      tenantName: 'Budi',
      email: 'budi@example.com',
      item: 'Laundry 5 Kg',
      amount: 30_000,
      paid: 0,
      dueDate: '2026-11-27',
      createdAt: '2026-11-20T10:00:00.000Z',
      items: state.posSales[0].items,
      subtotal: 35_000,
      discount: 5_000,
    },
  ];

  const pos = normalizeInvoice(state, { type: 'pos', id: 9 });
  assert.equal(pos.items.length, 2);
  assert.equal(pos.total, 30_000);
  assert.equal(pos.status, 'paid');

  const manual = normalizeInvoice(state, { type: 'invoice', id: 4 });
  assert.equal(manual.items.length, 2);
  assert.equal(manual.total, 30_000);
  assert.equal(manual.status, 'unpaid');

  const pdf = await buildInvoicePdf(pos);
  assert.ok(pdf.length > 1_000);
});
