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

export function createManualInvoice({ roomId, item, amount, dueDate }) {
  const state = getState();
  const room = state.rooms.find((entry) => String(entry.id) === String(roomId));
  if (!room) throw new Error('Kamar tidak ditemukan.');
  if (!String(item || '').trim()) throw new Error('Item layanan wajib diisi.');
  if (toNumber(amount) <= 0) throw new Error('Nominal invoice harus lebih dari 0.');

  const tenant = room.tenantId
    ? state.tenants.find((entry) => String(entry.id) === String(room.tenantId))
    : null;
  const booking = room.status === 'booking' ? room.booking : null;
  const name = tenant?.name || booking?.name || 'Calon Tenant';
  const phone = tenant?.phone || booking?.phone || '';

  let created;
  update((draft) => {
    const invoice = {
      id: nextId(draft.manualInvoices),
      number: documentNumber('SRV', draft.manualInvoices),
      tenantId: tenant?.id ?? null,
      roomId: room.id,
      tenantName: name,
      phone,
      roomNumber: room.nomor,
      item: String(item).trim(),
      amount: Math.round(toNumber(amount)),
      paid: 0,
      status: 'unpaid',
      dueDate: dueDate || addDays(todayISO(), 7),
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

export function verifyManualInvoice(id, { method = 'Virtual Account BCA', note = '' } = {}) {
  update((draft) => {
    const invoice = draft.manualInvoices.find((item) => String(item.id) === String(id));
    if (!invoice) throw new Error('Invoice tidak ditemukan.');
    if (invoice.status === 'paid') return;
    invoice.paid = invoice.amount;
    invoice.status = 'paid';
    invoice.paidAt = new Date().toISOString();
    invoice.method = method;
    invoice.note = note;
  });
}

export function markManualInvoiceUnpaid(id) {
  update((draft) => {
    const invoice = draft.manualInvoices.find((item) => String(item.id) === String(id));
    if (!invoice) return;
    invoice.paid = 0;
    invoice.status = 'unpaid';
    invoice.paidAt = null;
    invoice.method = '';
  });
}

export function deleteManualInvoice(id) {
  update((draft) => {
    draft.manualInvoices = draft.manualInvoices.filter((item) => String(item.id) !== String(id));
  });
}

export function getManualInvoice(id) {
  return getState().manualInvoices.find((invoice) => String(invoice.id) === String(id)) || null;
}
