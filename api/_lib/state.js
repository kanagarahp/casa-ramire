function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function nextId(list = []) {
  return list.reduce((max, item) => Math.max(max, Number(item?.id) || 0), 0) + 1;
}

function documentNumber(prefix, list = []) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  return `${prefix}/${stamp}/${String(nextId(list)).padStart(4, '0')}`;
}

function todayISO(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

export function periodLabel(renewal = {}) {
  if (renewal.periodLabel) return renewal.periodLabel;
  if (renewal.periode === 'harian') return 'Harian';
  if (renewal.periode === 'mingguan') return 'Mingguan';
  return `${renewal.periode || ''} Bulan`.trim();
}

/** Strip secrets and local-only fields before storing the shared state. */
export function sanitizeStateForServer(state) {
  const clean = JSON.parse(JSON.stringify(state || {}));
  delete clean.users;
  delete clean.session;

  if (clean.settings) {
    delete clean.settings.catalogAdminKey;
  }

  if (Array.isArray(clean.rooms)) {
    clean.rooms = clean.rooms.map((room) => {
      const photo = String(room.photo || '');
      return {
        ...room,
        // Local data URLs are only needed on the admin device. Published
        // photos already have a stable photoUrl from /api/catalog/photo.
        photo: photo.startsWith('data:image/') ? '' : photo,
      };
    });
  }

  if (Array.isArray(clean.gallery)) {
    clean.gallery = clean.gallery.map((item) => {
      const photo = String(item.photo || '');
      return {
        ...item,
        photo: photo.startsWith('data:image/') ? '' : photo,
      };
    });
  }

  return clean;
}

function findPaymentTenant(state, tenantId) {
  return (state.tenants || []).find((tenant) => String(tenant.id) === String(tenantId)) || null;
}

function pushTenantPayment(tenant, draft, { amount, type, method, note, billId, date }) {
  const value = Math.max(0, Math.round(toNumber(amount)));
  if (!value) return;
  tenant.payments = tenant.payments || [];
  tenant.payments.push({
    id: nextId(tenant.payments),
    date: date || todayISO(),
    amount: value,
    type,
    method,
    note,
    billId,
  });
}

/**
 * Apply a confirmed DOKU payment to the shared state.
 * Returns a small result object for logs and client toasts.
 */
export function applyPaymentToState(state, payment, { channel = '', paidAt = new Date() } = {}) {
  const now = paidAt instanceof Date ? paidAt : new Date(paidAt);
  const nowISO = now.toISOString();
  const method = `DOKU Checkout${channel ? ` (${channel})` : ''}`;
  const reference = `DOKU ${payment.id}`;

  if (payment.kind === 'bill') {
    const bill = (state.bills || []).find((item) => String(item.id) === String(payment.record_id));
    if (!bill) return { applied: false, reason: 'bill-not-found' };
    if (bill.status === 'paid') return { applied: false, reason: 'already-paid' };

    const outstanding = Math.max(0, toNumber(bill.amount) - toNumber(bill.paid));
    const delta = Math.max(0, Math.min(toNumber(payment.amount), outstanding));
    if (delta <= 0) return { applied: false, reason: 'nothing-to-pay' };

    bill.paid = Math.min(toNumber(bill.amount), toNumber(bill.paid) + delta);
    bill.status = bill.paid >= toNumber(bill.amount) - 0.5 ? 'paid' : 'unpaid';
    bill.paidAt = bill.status === 'paid' ? nowISO : null;
    bill.method = method;
    bill.note = reference;

    const tenant = findPaymentTenant(state, bill.tenantId);
    if (tenant) {
      tenant.totalPaid = Math.max(0, toNumber(tenant.totalPaid) + delta);
      pushTenantPayment(tenant, state, {
        amount: delta,
        type: bill.type,
        method,
        note: reference,
        billId: bill.id,
        date: todayISO(now),
      });
    }

    state.meta = { ...(state.meta || {}), updatedAt: nowISO };
    return {
      applied: true,
      type: 'bill',
      tenantName: bill.tenantName,
      amount: delta,
      fullyPaid: bill.status === 'paid',
    };
  }

  if (payment.kind === 'invoice') {
    const invoice = (state.manualInvoices || []).find(
      (item) => String(item.id) === String(payment.record_id),
    );
    if (!invoice) return { applied: false, reason: 'invoice-not-found' };
    if (invoice.status === 'paid') return { applied: false, reason: 'already-paid' };

    const outstanding = Math.max(0, toNumber(invoice.amount) - toNumber(invoice.paid));
    const delta = Math.max(0, Math.min(toNumber(payment.amount), outstanding));
    if (delta <= 0) return { applied: false, reason: 'nothing-to-pay' };

    invoice.paid = Math.min(toNumber(invoice.amount), toNumber(invoice.paid) + delta);
    invoice.status = invoice.paid >= toNumber(invoice.amount) - 0.5 ? 'paid' : 'unpaid';
    invoice.paidAt = invoice.status === 'paid' ? nowISO : null;
    invoice.method = method;
    invoice.note = reference;

    state.meta = { ...(state.meta || {}), updatedAt: nowISO };
    return {
      applied: true,
      type: 'invoice',
      tenantName: invoice.tenantName,
      amount: delta,
      fullyPaid: invoice.status === 'paid',
    };
  }

  if (payment.kind === 'renewal') {
    const renewal = payment.payload?.renewal;
    if (!renewal) return { applied: false, reason: 'renewal-payload-missing' };

    const tenant = findPaymentTenant(state, payment.tenant_id || renewal.tenantId);
    if (!tenant) return { applied: false, reason: 'tenant-not-found' };
    if (tenant.status !== 'aktif') return { applied: false, reason: 'tenant-not-active' };

    const grandTotal = toNumber(renewal.grandTotal);
    if (grandTotal <= 0) return { applied: false, reason: 'invalid-total' };
    if (toNumber(payment.amount) + 0.5 < grandTotal) {
      return { applied: false, reason: 'renewal-underpaid' };
    }

    tenant.periode = renewal.periode;
    tenant.endDate = renewal.endDate;
    tenant.startDate = tenant.startDate || renewal.startDate;
    tenant.addons = Array.isArray(renewal.addons) ? renewal.addons : [];
    tenant.promoId = renewal.promo?.id ?? null;
    tenant.promoName = renewal.promo?.name ?? '';
    tenant.promoType = renewal.promo?.type ?? '';
    tenant.promoValue = renewal.promo?.value ?? 0;
    tenant.base = toNumber(renewal.base);
    tenant.discount = toNumber(renewal.discount);
    tenant.rentTotal = toNumber(tenant.rentTotal) + toNumber(renewal.rentTotal);
    tenant.addonTotal = toNumber(tenant.addonTotal) + toNumber(renewal.addonTotal);
    tenant.contractTotal = toNumber(tenant.contractTotal) + grandTotal;
    tenant.monthlyCharge = toNumber(renewal.monthlyCharge);
    tenant.totalPaid = toNumber(tenant.totalPaid) + grandTotal;
    tenant.pendingRenewal = null;
    tenant.updatedAt = nowISO;

    const bill = {
      id: nextId(state.bills),
      number: documentNumber('INV', state.bills),
      tenantId: tenant.id,
      roomId: tenant.roomId,
      tenantName: tenant.name,
      phone: tenant.phone || '',
      email: tenant.email || '',
      roomNumber: tenant.roomNumber || '—',
      type: 'Perpanjangan',
      description: `${periodLabel(renewal)} • ${renewal.startDate} s/d ${renewal.endDate}`,
      amount: grandTotal,
      paid: grandTotal,
      status: 'paid',
      dueDate: renewal.startDate,
      periodStart: renewal.startDate,
      periodEnd: renewal.endDate,
      source: 'rent',
      method,
      note: reference,
      createdAt: nowISO,
      paidAt: nowISO,
    };
    state.bills = Array.isArray(state.bills) ? state.bills : [];
    state.bills.push(bill);

    pushTenantPayment(tenant, state, {
      amount: grandTotal,
      type: 'Perpanjangan',
      method,
      note: reference,
      billId: bill.id,
      date: todayISO(now),
    });

    state.meta = { ...(state.meta || {}), updatedAt: nowISO };
    return {
      applied: true,
      type: 'renewal',
      tenantName: tenant.name,
      amount: grandTotal,
      endDate: tenant.endDate,
    };
  }

  return { applied: false, reason: 'unknown-kind' };
}
