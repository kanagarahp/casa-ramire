import { BILL_STATUS } from '../core/constants.js';
import { documentNumber, nextId } from '../core/id.js';
import { addDays, toNumber, todayISO } from '../core/format.js';
import { getState, update } from '../core/store.js';

function findTenant(draft, tenantId) {
  return draft.tenants.find((tenant) => String(tenant.id) === String(tenantId)) || null;
}

function findRoom(draft, roomId) {
  return draft.rooms.find((room) => String(room.id) === String(roomId)) || null;
}

/**
 * Append a bill to a draft state. Used by both check-in (rent) and manual bills.
 * `paid` means the bill is settled immediately.
 */
export function pushBill(draft, payload) {
  const tenant = payload.tenantId ? findTenant(draft, payload.tenantId) : null;
  const room = payload.roomId ? findRoom(draft, payload.roomId) : null;
  const amount = Math.max(0, Math.round(toNumber(payload.amount)));
  if (amount <= 0) throw new Error('Nominal tagihan harus lebih dari 0.');

  const isPaid = Boolean(payload.paid);
  const now = new Date().toISOString();

  const bill = {
    id: nextId(draft.bills),
    number: documentNumber('INV', draft.bills),
    tenantId: tenant?.id ?? payload.tenantId ?? null,
    roomId: room?.id ?? payload.roomId ?? null,
    tenantName: tenant?.name || payload.tenantName || 'Tanpa nama',
    phone: tenant?.phone || payload.phone || '',
    email: tenant?.email || payload.email || '',
    roomNumber: room?.nomor || payload.roomNumber || '—',
    type: payload.type || 'Sewa',
    description: payload.description || '',
    amount,
    paid: isPaid ? amount : 0,
    status: isPaid ? 'paid' : 'unpaid',
    dueDate: payload.dueDate || todayISO(),
    periodStart: payload.periodStart || null,
    periodEnd: payload.periodEnd || null,
    source: payload.source || 'rent',
    method: isPaid ? payload.method || 'Tunai / Cash' : '',
    note: payload.note || '',
    createdAt: now,
    paidAt: isPaid ? now : null,
  };

  draft.bills.push(bill);
  return bill;
}

export function createBill({ tenantId, type, amount, dueDate, note = '' }) {
  const state = getState();
  const tenant = state.tenants.find((item) => String(item.id) === String(tenantId));
  if (!tenant) throw new Error('Penghuni tidak ditemukan.');
  if (!String(type || '').trim()) throw new Error('Jenis tagihan wajib diisi.');
  if (toNumber(amount) <= 0) throw new Error('Nominal tagihan harus lebih dari 0.');

  let created;
  update((draft) => {
    created = pushBill(draft, {
      tenantId: tenant.id,
      roomId: tenant.roomId,
      type: String(type).trim(),
      amount,
      dueDate: dueDate || todayISO(),
      note,
      source: 'manual',
    });
  });
  return created;
}

export function getBills({ status = null, tenantId = null } = {}) {
  return getState().bills
    .filter((bill) => (status ? bill.status === status : true))
    .filter((bill) => (tenantId ? String(bill.tenantId) === String(tenantId) : true))
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'unpaid' ? -1 : 1;
      return String(a.dueDate).localeCompare(String(b.dueDate));
    });
}

export function getBill(id) {
  return getState().bills.find((bill) => String(bill.id) === String(id)) || null;
}

export function verifyBill(id, { method = 'Virtual Account BCA', note = '' } = {}) {
  const state = getState();
  const bill = getBill(id);
  if (!bill) throw new Error('Tagihan tidak ditemukan.');
  if (bill.status === 'paid') return bill;

  update((draft) => {
    const target = draft.bills.find((item) => String(item.id) === String(id));
    const delta = Math.max(0, target.amount - toNumber(target.paid));
    const now = new Date().toISOString();
    target.paid = target.amount;
    target.status = 'paid';
    target.paidAt = now;
    target.method = method;
    target.note = note;

    const tenant = findTenant(draft, target.tenantId);
    if (tenant) {
      tenant.totalPaid = Math.max(0, toNumber(tenant.totalPaid) + delta);
      tenant.payments = tenant.payments || [];
      tenant.payments.push({
        id: nextId(tenant.payments),
        date: todayISO(),
        amount: delta,
        type: bill.type,
        method,
        note,
        billId: target.id,
      });
    }
  });

  return getBill(id);
}

export function markBillUnpaid(id) {
  const bill = getBill(id);
  if (!bill) throw new Error('Tagihan tidak ditemukan.');
  if (bill.status !== 'paid') return bill;

  update((draft) => {
    const target = draft.bills.find((item) => String(item.id) === String(id));
    target.paid = 0;
    target.status = 'unpaid';
    target.paidAt = null;
    target.method = '';
    target.note = '';

    const tenant = findTenant(draft, target.tenantId);
    if (tenant) {
      tenant.totalPaid = Math.max(0, toNumber(tenant.totalPaid) - bill.amount);
      tenant.payments = (tenant.payments || []).filter(
        (payment) => String(payment.billId) !== String(target.id),
      );
    }
  });

  return getBill(id);
}

export function deleteBill(id) {
  const bill = getBill(id);
  if (!bill) return;

  update((draft) => {
    if (bill.status === 'paid') {
      const tenant = findTenant(draft, bill.tenantId);
      if (tenant) {
        tenant.totalPaid = Math.max(0, toNumber(tenant.totalPaid) - bill.paid);
        tenant.payments = (tenant.payments || []).filter(
          (payment) => String(payment.billId) !== String(bill.id),
        );
      }
    }
    draft.bills = draft.bills.filter((item) => String(item.id) !== String(id));
  });
}

export function billBadgeClass(status) {
  return (BILL_STATUS[status] || BILL_STATUS.unpaid).badge;
}

/* ------------------------------------------------------------------ */
/* Manual service invoices (non-rent)                                  */
/* ------------------------------------------------------------------ */

export function getManualInvoices() {
  return [...getState().manualInvoices].sort((a, b) => b.id - a.id);
}

export function createManualInvoice({
  mode = 'tenant',
  tenantId = null,
  roomId = null,
  name = '',
  email = '',
  phone = '',
  item,
  amount,
  dueDate,
  date,
}) {
  const state = getState();
  if (!String(item || '').trim()) throw new Error('Item layanan wajib diisi.');
  if (toNumber(amount) <= 0) throw new Error('Nominal invoice harus lebih dari 0.');

  let tenant = null;
  let room = null;
  let invoiceName = '';
  let invoiceEmail = '';
  let invoicePhone = '';
  let invoiceRoom = '—';

  if (mode === 'tenant') {
    tenant = state.tenants.find((entry) => String(entry.id) === String(tenantId)) || null;
    if (!tenant) throw new Error('Penghuni tidak ditemukan.');
    room =
      state.rooms.find((entry) => String(entry.id) === String(tenant.roomId)) ||
      (roomId
        ? state.rooms.find((entry) => String(entry.id) === String(roomId))
        : null) ||
      null;
    invoiceName = tenant.name;
    invoiceEmail = tenant.email || '';
    invoicePhone = tenant.phone || '';
    invoiceRoom = room?.nomor || tenant.roomNumber || '—';
  } else {
    invoiceName = String(name || '').trim();
    if (!invoiceName) throw new Error('Nama penerima invoice wajib diisi.');
    room = roomId
      ? state.rooms.find((entry) => String(entry.id) === String(roomId)) || null
      : null;
    invoiceEmail = String(email || '').trim();
    invoicePhone = String(phone || '').trim();
    invoiceRoom = room?.nomor || '—';
  }

  let created;
  update((draft) => {
    const invoice = {
      id: nextId(draft.manualInvoices),
      number: documentNumber('SRV', draft.manualInvoices),
      tenantId: tenant?.id ?? null,
      roomId: room?.id ?? null,
      tenantName: invoiceName,
      email: invoiceEmail,
      phone: invoicePhone,
      roomNumber: invoiceRoom,
      mode: mode === 'tenant' ? 'tenant' : 'non-tenant',
      item: String(item).trim(),
      amount: Math.round(toNumber(amount)),
      paid: 0,
      status: 'unpaid',
      dueDate: dueDate || date || addDays(todayISO(), 7),
      method: '',
      note: '',
      createdAt: new Date().toISOString(),
      paidAt: null,
    };
    draft.manualInvoices.push(invoice);
    created = invoice;
  });
  return created;
}

function linkedPosSale(draft, invoice) {
  if (!invoice) return null;
  return (draft.posSales || []).find(
    (sale) =>
      (invoice.posSaleId && String(sale.id) === String(invoice.posSaleId)) ||
      (sale.invoiceId && String(sale.invoiceId) === String(invoice.id)),
  );
}

function pushManualInvoicePayment(draft, invoice, { method, note, paidAt }) {
  if (!invoice.tenantId) return;
  const tenant = draft.tenants.find(
    (item) => String(item.id) === String(invoice.tenantId),
  );
  if (!tenant) return;
  tenant.payments = tenant.payments || [];
  const exists = tenant.payments.some(
    (payment) => String(payment.invoiceId) === String(invoice.id),
  );
  if (exists) return;
  tenant.payments.push({
    id: nextId(tenant.payments),
    date: todayISO(),
    amount: toNumber(invoice.amount),
    type: invoice.source === 'pos' ? `POS — ${invoice.item}` : `Invoice — ${invoice.item}`,
    method,
    note: note || invoice.number,
    invoiceId: invoice.id,
    createdAt: paidAt,
  });
}

export function verifyManualInvoice(id, { method = 'Virtual Account BCA', note = '' } = {}) {
  update((draft) => {
    const invoice = draft.manualInvoices.find((item) => String(item.id) === String(id));
    if (!invoice) throw new Error('Invoice tidak ditemukan.');
    if (invoice.status === 'paid') return;
    const now = new Date().toISOString();
    invoice.paid = invoice.amount;
    invoice.amountPaid = invoice.amount;
    invoice.change = 0;
    invoice.status = 'paid';
    invoice.paidAt = now;
    invoice.method = method;
    invoice.note = note;

    const sale = linkedPosSale(draft, invoice);
    if (sale) {
      sale.status = 'paid';
      sale.paidAt = now;
      sale.method = method;
      sale.amountPaid = toNumber(invoice.amount);
      sale.change = 0;
    }

    pushManualInvoicePayment(draft, invoice, { method, note, paidAt: now });
  });
}

export function markManualInvoiceUnpaid(id) {
  update((draft) => {
    const invoice = draft.manualInvoices.find((item) => String(item.id) === String(id));
    if (!invoice) return;
    invoice.paid = 0;
    invoice.amountPaid = 0;
    invoice.change = 0;
    invoice.status = 'unpaid';
    invoice.paidAt = null;
    invoice.method = '';

    const sale = linkedPosSale(draft, invoice);
    if (sale) {
      sale.status = 'unpaid';
      sale.paidAt = null;
      sale.amountPaid = 0;
      sale.change = 0;
      sale.method = '';
    }

    for (const tenant of draft.tenants || []) {
      tenant.payments = (tenant.payments || []).filter(
        (payment) =>
          String(payment.invoiceId) !== String(invoice.id) &&
          String(payment.billId) !== String(invoice.id),
      );
    }
  });
}

export function deleteManualInvoice(id) {
  update((draft) => {
    const invoice = draft.manualInvoices.find((item) => String(item.id) === String(id));
    const sale = linkedPosSale(draft, invoice);
    if (sale) {
      draft.posSales = (draft.posSales || []).filter(
        (item) => String(item.id) !== String(sale.id),
      );
    }
    for (const tenant of draft.tenants || []) {
      tenant.payments = (tenant.payments || []).filter(
        (payment) =>
          String(payment.invoiceId) !== String(id) &&
          String(payment.billId) !== String(id),
      );
    }
    draft.manualInvoices = draft.manualInvoices.filter((item) => String(item.id) !== String(id));
  });
}

export function getManualInvoice(id) {
  return getState().manualInvoices.find((invoice) => String(invoice.id) === String(id)) || null;
}
