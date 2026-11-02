import { DEFAULT_POS_CATEGORIES } from '../core/constants.js';
import { isInMonth, toNumber, todayISO } from '../core/format.js';
import { documentNumber, nextId } from '../core/id.js';
import { getState, update } from '../core/store.js';
import { getActiveUser } from './auth.js';

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
 * Create a paid POS sale. Items may reference a product from the master or
 * carry a one-off name/price snapshot. Product prices are copied into the sale
 * so later price changes do not rewrite past receipts.
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
  note = '',
  date = todayISO(),
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

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discountValue = Math.min(
    subtotal,
    Math.max(0, Math.round(toNumber(discount))),
  );
  const total = Math.max(0, subtotal - discountValue);
  const paid = amountPaid === null || amountPaid === '' ? total : Math.round(toNumber(amountPaid));
  if (paid < total) throw new Error('Nominal pembayaran kurang dari total.');
  const tenant = tenantId
    ? (state.tenants || []).find((item) => String(item.id) === String(tenantId)) || null
    : null;
  const user = getActiveUser();

  let created = null;
  update((draft) => {
    if (!Array.isArray(draft.posSales)) draft.posSales = [];
    created = {
      id: nextId(draft.posSales),
      number: documentNumber('POS', draft.posSales),
      date: date || todayISO(),
      items: normalizedItems,
      subtotal,
      discount: discountValue,
      total,
      method: normalizeText(method) || 'Tunai / Cash',
      amountPaid: paid,
      change: Math.max(0, paid - total),
      customerName: normalizeText(customerName || tenant?.name),
      customerPhone: normalizeText(customerPhone || tenant?.phone),
      customerEmail: normalizeText(customerEmail || tenant?.email),
      tenantId: tenant?.id ?? null,
      roomNumber: tenant?.roomNumber || '',
      note: normalizeText(note),
      status: 'paid',
      cashier: user?.name || '',
      createdAt: new Date().toISOString(),
    };
    draft.posSales.push(created);
  });

  return created;
}

export function deletePosSale(id) {
  update((draft) => {
    draft.posSales = (draft.posSales || []).filter(
      (sale) => String(sale.id) !== String(id),
    );
  });
}

export function getPosRevenue(reference = new Date()) {
  return (getState().posSales || [])
    .filter((sale) => sale.status !== 'void' && isInMonth(sale.date || sale.createdAt, reference))
    .reduce((sum, sale) => sum + toNumber(sale.total), 0);
}

export function getPosSummary(reference = new Date()) {
  const sales = getState().posSales || [];
  const today = todayISO();
  const monthSales = sales.filter((sale) =>
    isInMonth(sale.date || sale.createdAt, reference),
  );
  const todaySales = sales.filter((sale) => String(sale.date || '').slice(0, 10) === today);

  return {
    totalSales: sales.length,
    monthCount: monthSales.length,
    monthRevenue: monthSales.reduce((sum, sale) => sum + toNumber(sale.total), 0),
    todayCount: todaySales.length,
    todayRevenue: todaySales.reduce((sum, sale) => sum + toNumber(sale.total), 0),
    itemsSoldThisMonth: monthSales.reduce(
      (sum, sale) => sum + (sale.items || []).reduce((qty, item) => qty + toNumber(item.qty), 0),
      0,
    ),
  };
}
