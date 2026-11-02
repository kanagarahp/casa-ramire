import { DEFAULT_POS_CATEGORIES } from '../core/constants.js';
import { addDays, isInMonth, toNumber, todayISO } from '../core/format.js';
import { documentNumber, nextId } from '../core/id.js';
import { getState, update } from '../core/store.js';
import { getActiveUser } from './auth.js';

function qtyText(value) {
  return (Number(value) || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

function itemSummary(items) {
  return items
    .map((item) => `${item.name} ×${qtyText(item.qty)}${item.unit ? ` ${item.unit}` : ''}`)
    .join(', ');
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeProduct(product, index = 0) {
  return {
    ...product,
    id: product.id ?? index + 1,
    name: normalizeText(product.name),
    category: normalizeText(product.category) || 'Lainnya',
    price: Math.max(0, Math.round(toNumber(product.price))),
    unit: normalizeText(product.unit),
    active: product.active !== false,
    createdAt: product.createdAt || '',
  };
}

/** Product/service master used by the POS cashier. */
export function getPosProducts({ activeOnly = false, category = '' } = {}) {
  const products = (getState().posProducts || []).map(normalizeProduct);
  return products
    .filter((product) => (activeOnly ? product.active : true))
    .filter((product) => (category ? product.category === category : true))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category, 'id') ||
        a.name.localeCompare(b.name, 'id'),
    );
}

export function getPosProduct(id) {
  const product = (getState().posProducts || []).find(
    (item) => String(item.id) === String(id),
  );
  return product ? normalizeProduct(product) : null;
}

export function getPosCategories() {
  const categories = new Set(DEFAULT_POS_CATEGORIES);
  for (const product of getPosProducts()) {
    if (product.category) categories.add(product.category);
  }
  return [...categories].sort((a, b) => a.localeCompare(b, 'id'));
}

export function savePosProduct({ id = null, name, category = 'Lainnya', price, unit = '', active = true }) {
  const cleanName = normalizeText(name);
  const cleanCategory = normalizeText(category) || 'Lainnya';
  const cleanUnit = normalizeText(unit);
  const value = Math.round(toNumber(price));

  if (!cleanName) throw new Error('Nama produk/layanan wajib diisi.');
  if (value <= 0) throw new Error('Harga produk/layanan harus lebih dari 0.');

  let saved = null;
  update((draft) => {
    if (!Array.isArray(draft.posProducts)) draft.posProducts = [];
    if (id) {
      const target = draft.posProducts.find((item) => String(item.id) === String(id));
      if (!target) throw new Error('Produk/layanan tidak ditemukan.');
      Object.assign(target, {
        name: cleanName,
        category: cleanCategory,
        price: value,
        unit: cleanUnit,
        active: Boolean(active),
        updatedAt: new Date().toISOString(),
      });
      saved = target;
      return;
    }

    saved = {
      id: nextId(draft.posProducts),
      name: cleanName,
      category: cleanCategory,
      price: value,
      unit: cleanUnit,
      active: Boolean(active),
      createdAt: new Date().toISOString(),
    };
    draft.posProducts.push(saved);
  });

  return saved;
}

export function togglePosProduct(id) {
  update((draft) => {
    const target = (draft.posProducts || []).find(
      (item) => String(item.id) === String(id),
    );
    if (target) target.active = !target.active;
  });
}

export function deletePosProduct(id) {
  update((draft) => {
    draft.posProducts = (draft.posProducts || []).filter(
      (item) => String(item.id) !== String(id),
    );
  });
}

export function getPosSales({ limit = 300 } = {}) {
  return [...(getState().posSales || [])]
    .sort((a, b) => {
      const created = String(b.createdAt || b.date || '').localeCompare(
        String(a.createdAt || a.date || ''),
      );
      return created || Number(b.id) - Number(a.id);
    })
    .slice(0, Math.max(1, Number(limit) || 300));
}

export function getPosSale(id) {
  return (getState().posSales || []).find((sale) => String(sale.id) === String(id)) || null;
}

/**
 * Create a POS sale. Items may reference a product from the master or carry a
 * one-off name/price snapshot. Product prices are copied into the sale so later
 * price changes do not rewrite past receipts.
 *
 * A tenant transaction (or any unpaid transaction) also creates a manual
 * invoice, which is what the tenant profile and Financial menu read as the
 * receivable. The POS sale keeps the cashier receipt and links to that invoice.
 */
export function createPosSale({
  items = [],
  discount = 0,
  method = 'Tunai / Cash',
  amountPaid = null,
  customerName = '',
  customerPhone = '',
  customerEmail = '',
  tenantId = null,
  roomId = null,
  roomNumber = '',
  note = '',
  date = todayISO(),
  status = 'paid',
  dueDate = '',
  withInvoice = null,
} = {}) {
  const state = getState();
  const productsById = new Map(
    (state.posProducts || []).map((product) => [String(product.id), product]),
  );

  const normalizedItems = [];
  for (const item of Array.isArray(items) ? items : []) {
    const product = item?.productId
      ? productsById.get(String(item.productId))
      : null;
    const name = normalizeText(product?.name || item?.name);
    const price = Math.max(
      0,
      Math.round(toNumber(product ? product.price : item?.price)),
    );
    const qty = Math.max(0, Math.round(toNumber(item?.qty) * 100) / 100);

    if (!name) throw new Error('Ada item tanpa nama produk/layanan.');
    if (qty <= 0) throw new Error(`Jumlah untuk ${name} harus lebih dari 0.`);
    if (price <= 0) throw new Error(`Harga ${name} harus lebih dari 0.`);

    normalizedItems.push({
      productId: product?.id ?? item?.productId ?? null,
      name,
      category: normalizeText(product?.category || item?.category) || 'Lainnya',
      unit: normalizeText(product?.unit || item?.unit),
      price,
      qty,
      subtotal: Math.round(price * qty),
    });
  }

  if (!normalizedItems.length) {
    throw new Error('Keranjang masih kosong. Pilih produk/layanan terlebih dahulu.');
  }

  const isPaid = status !== 'unpaid';
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountValue = Math.min(
    subtotal,
    Math.max(0, Math.round(toNumber(discount))),
  );
  const total = Math.max(0, subtotal - discountValue);
  const paid = isPaid
    ? amountPaid === null || amountPaid === ''
      ? total
      : Math.round(toNumber(amountPaid))
    : 0;
  if (isPaid && paid < total) throw new Error('Nominal pembayaran kurang dari total.');

  const tenant = tenantId
    ? (state.tenants || []).find((item) => String(item.id) === String(tenantId)) || null
    : null;
  const room = roomId
    ? (state.rooms || []).find((item) => String(item.id) === String(roomId)) || null
    : (state.rooms || []).find((item) => String(item.id) === String(tenant?.roomId)) || null;
  const user = getActiveUser();
  const now = new Date().toISOString();
  const invoiceDueDate = dueDate || addDays(todayISO(), 7);
  const shouldInvoice = Boolean(tenant?.id) || !isPaid || Boolean(withInvoice);
  const summary = itemSummary(normalizedItems);

  let createdSale = null;
  let createdInvoice = null;

  update((draft) => {
    if (!Array.isArray(draft.posSales)) draft.posSales = [];

    const saleId = nextId(draft.posSales);
    const saleNumber = documentNumber('POS', draft.posSales);

    if (shouldInvoice) {
      if (!Array.isArray(draft.manualInvoices)) draft.manualInvoices = [];
      createdInvoice = {
        id: nextId(draft.manualInvoices),
        number: documentNumber('SRV', draft.manualInvoices),
        tenantId: tenant?.id ?? null,
        roomId: room?.id ?? null,
        tenantName: normalizeText(customerName || tenant?.name) || 'Pelanggan POS',
        email: normalizeText(customerEmail || tenant?.email),
        phone: normalizeText(customerPhone || tenant?.phone),
        roomNumber: room?.nomor || roomNumber || '—',
        mode: tenant?.id ? 'tenant' : 'non-tenant',
        item: summary,
        items: normalizedItems,
        subtotal,
        discount: discountValue,
        amount: total,
        paid: isPaid ? total : 0,
        amountPaid: isPaid ? paid : 0,
        change: isPaid ? Math.max(0, paid - total) : 0,
        status: isPaid ? 'paid' : 'unpaid',
        dueDate: invoiceDueDate,
        method: isPaid ? normalizeText(method) || 'Tunai / Cash' : '',
        note: normalizeText(note),
        source: 'pos',
        posSaleId: saleId,
        cashier: user?.name || '',
        createdAt: now,
        paidAt: isPaid ? now : null,
      };
      draft.manualInvoices.push(createdInvoice);
    }

    createdSale = {
      id: saleId,
      number: saleNumber,
      date: date || todayISO(),
      items: normalizedItems,
      subtotal,
      discount: discountValue,
      total,
      method: isPaid ? normalizeText(method) || 'Tunai / Cash' : '',
      amountPaid: paid,
      change: isPaid ? Math.max(0, paid - total) : 0,
      customerName: normalizeText(customerName || tenant?.name) || 'Walk-in',
      customerPhone: normalizeText(customerPhone || tenant?.phone),
      customerEmail: normalizeText(customerEmail || tenant?.email),
      tenantId: tenant?.id ?? null,
      roomNumber: room?.nomor || roomNumber || '',
      note: normalizeText(note),
      status: isPaid ? 'paid' : 'unpaid',
      dueDate: shouldInvoice ? invoiceDueDate : '',
      invoiceId: createdInvoice?.id ?? null,
      invoiceNumber: createdInvoice?.number || '',
      paidAt: isPaid ? now : null,
      cashier: user?.name || '',
      createdAt: now,
    };
    draft.posSales.push(createdSale);

    // A paid tenant sale appears in the tenant payment history immediately.
    // It is not added to totalPaid because POS services are not rent.
    if (isPaid && tenant?.id && createdInvoice) {
      const target = (draft.tenants || []).find(
        (item) => String(item.id) === String(tenant.id),
      );
      if (target) {
        target.payments = target.payments || [];
        target.payments.push({
          id: nextId(target.payments),
          date: todayISO(),
          amount: total,
          type: `POS — ${summary}`,
          method: normalizeText(method) || 'Tunai / Cash',
          note: createdSale.number,
          invoiceId: createdInvoice.id,
        });
      }
    }
  });

  return { ...createdSale, invoice: createdInvoice };
}

export function deletePosSale(id) {
  update((draft) => {
    const sale = (draft.posSales || []).find((item) => String(item.id) === String(id));
    if (sale?.invoiceId) {
      draft.manualInvoices = (draft.manualInvoices || []).filter(
        (invoice) => String(invoice.id) !== String(sale.invoiceId),
      );
      for (const tenant of draft.tenants || []) {
        tenant.payments = (tenant.payments || []).filter(
          (payment) =>
            String(payment.invoiceId) !== String(sale.invoiceId) &&
            String(payment.billId) !== String(sale.invoiceId),
        );
      }
    }
    draft.posSales = (draft.posSales || []).filter(
      (item) => String(item.id) !== String(id),
    );
  });
}

export function getPosInvoiceForSale(saleId) {
  return (
    (getState().manualInvoices || []).find(
      (invoice) => String(invoice.posSaleId) === String(saleId),
    ) || null
  );
}

export function getPosRevenue(reference = new Date()) {
  return (getState().posSales || [])
    .filter(
      (sale) =>
        sale.status === 'paid' && isInMonth(sale.date || sale.createdAt, reference),
    )
    .reduce((sum, sale) => sum + toNumber(sale.total), 0);
}

export function getPosSummary(reference = new Date()) {
  const sales = getState().posSales || [];
  const today = todayISO();
  const monthSales = sales.filter((sale) =>
    isInMonth(sale.date || sale.createdAt, reference),
  );
  const paidMonth = monthSales.filter((sale) => sale.status === 'paid');
  const unpaidMonth = monthSales.filter((sale) => sale.status === 'unpaid');
  const todaySales = sales.filter((sale) => String(sale.date || '').slice(0, 10) === today);
  const todayPaid = todaySales.filter((sale) => sale.status === 'paid');

  return {
    totalSales: sales.length,
    monthCount: monthSales.length,
    monthRevenue: paidMonth.reduce((sum, sale) => sum + toNumber(sale.total), 0),
    monthOutstanding: unpaidMonth.reduce((sum, sale) => sum + toNumber(sale.total), 0),
    unpaidCount: unpaidMonth.length,
    todayCount: todaySales.length,
    todayRevenue: todayPaid.reduce((sum, sale) => sum + toNumber(sale.total), 0),
    itemsSoldThisMonth: paidMonth.reduce(
      (sum, sale) => sum + (sale.items || []).reduce((qty, item) => qty + toNumber(item.qty), 0),
      0,
    ),
  };
}
