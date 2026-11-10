import {
  CAR_FEE,
  MAX_PARKING_CARS,
  NOTIFICATION_EMAIL,
  SCHEMA_VERSION,
  STORAGE_KEY,
} from './constants.js';
import { buildSeedState } from './seed.js';
import { storage } from './storage.js';

let state = loadState();
const listeners = new Set();

/** Fill in missing keys so old/corrupt saves never break a new release. */
function migrate(stored) {
  const base = buildSeedState();
  const storedVersion = Number(stored.version) || 0;
  const merged = {
    ...base,
    ...stored,
    version: SCHEMA_VERSION,
    meta: { ...base.meta, ...(stored.meta || {}) },
    pricing: {
      lantai1: { ...base.pricing.lantai1, ...(stored.pricing?.lantai1 || {}) },
      lantai2: { ...base.pricing.lantai2, ...(stored.pricing?.lantai2 || {}) },
      lantai3: { ...base.pricing.lantai3, ...(stored.pricing?.lantai3 || {}) },
    },
    templates: { ...base.templates, ...(stored.templates || {}) },
    settings: { ...base.settings, ...(stored.settings || {}) },
  };

  for (const key of [
    'users',
    'rooms',
    'gallery',
    'tenants',
    'bills',
    'manualInvoices',
    'expenses',
    'expenseCategories',
    'addons',
    'promos',
    'posProducts',
    'posSales',
  ]) {
    if (!Array.isArray(merged[key])) merged[key] = base[key];
  }

  // v4: rooms can carry a catalog photo (local data URL and/or published URL).
  // v9: room type + daily/monthly availability. Floor 1 holds a single
  // Deluxe VIP room that is rented daily; empty monthly rooms on floors 2–3
  // can also be used for daily guests.
  merged.rooms = merged.rooms.map((room) => {
    const floor = String(room.lantai || '2');
    const isVip = floor === '1';
    return {
      photo: '',
      photoUrl: '',
      ...room,
      lantai: floor,
      tipe: isVip ? 'Deluxe VIP' : room.tipe || 'Deluxe',
      dailyEnabled: room.dailyEnabled !== false,
      monthlyEnabled: isVip ? false : room.monthlyEnabled !== false,
    };
  });

  // Existing saves (created before v9) do not have the lantai 1 VIP room.
  if (!merged.rooms.some((room) => String(room.lantai) === '1')) {
    const nextRoomId =
      merged.rooms.reduce((max, room) => Math.max(max, Number(room.id) || 0), 0) + 1;
    merged.rooms.push({
      id: nextRoomId,
      nomor: '101',
      lantai: '1',
      tipe: 'Deluxe VIP',
      status: 'kosong',
      tenantId: null,
      booking: null,
      photo: '',
      photoUrl: '',
      dailyEnabled: true,
      monthlyEnabled: false,
    });
  }

  // v5: landing-page gallery replaces the per-room catalog.
  merged.gallery = merged.gallery.map((item, index) => ({
    id: item.id ?? index + 1,
    caption: '',
    photo: '',
    photoUrl: '',
    createdAt: '',
    ...item,
  }));

  // v5: contact email + Google Maps embed for the landing page.
  if (storedVersion < 5) {
    if (!merged.settings.email) merged.settings.email = base.settings.email;
    if (!merged.settings.mapsUrl) merged.settings.mapsUrl = base.settings.mapsUrl;
    if (!merged.settings.mapsEmbedUrl) {
      merged.settings.mapsEmbedUrl = base.settings.mapsEmbedUrl;
    }
  }

  // v5: promo codes are redeemable on the landing page. Old promos receive a
  // deterministic code and unlimited quota so nothing breaks.
  merged.promos = merged.promos.map((promo, index) => {
    const fallbackCode = `PROMO${promo.id ?? index + 1}`;
    return {
      ...promo,
      code: String(promo.code || fallbackCode).toUpperCase().replace(/[^A-Z0-9-]/g, ''),
      maxUses: Math.max(0, Number(promo.maxUses) || 0),
      usedCount: Math.max(0, Number(promo.usedCount) || 0),
    };
  });

  // v5: align the parking add-on with the landing-page car surcharge.
  if (storedVersion < 5) {
    merged.addons = merged.addons.map((addon) =>
      /parkir/i.test(String(addon.name || ''))
        ? { ...addon, name: 'Parkir Mobil', price: CAR_FEE }
        : addon,
    );
  }

  // v6: POS product master and sale history. Older saves receive the sample
  // laundry products so the cashier is usable immediately.
  merged.posProducts = merged.posProducts.map((product, index) => ({
    ...product,
    id: product.id ?? index + 1,
    name: String(product.name || '').trim(),
    category: String(product.category || 'Lainnya').trim(),
    price: Math.max(0, Number(product.price) || 0),
    unit: String(product.unit || '').trim(),
    active: product.active !== false,
    createdAt: product.createdAt || '',
  }));

  merged.posSales = merged.posSales.map((sale, index) => ({
    ...sale,
    id: sale.id ?? index + 1,
    number: sale.number || `POS/${sale.date || ''}/${String(index + 1).padStart(4, '0')}`,
    date: sale.date || '',
    items: Array.isArray(sale.items) ? sale.items : [],
    subtotal: Math.max(0, Number(sale.subtotal) || 0),
    discount: Math.max(0, Number(sale.discount) || 0),
    total: Math.max(0, Number(sale.total) || 0),
    method: sale.method || 'Tunai / Cash',
    amountPaid: Math.max(0, Number(sale.amountPaid) || 0),
    change: Math.max(0, Number(sale.change) || 0),
    customerName: sale.customerName || '',
    customerPhone: sale.customerPhone || '',
    customerEmail: sale.customerEmail || '',
    tenantId: sale.tenantId ?? null,
    roomNumber: sale.roomNumber || '',
    note: sale.note || '',
    status: sale.status === 'unpaid' ? 'unpaid' : 'paid',
    dueDate: sale.dueDate || '',
    invoiceId: sale.invoiceId ?? null,
    invoiceNumber: sale.invoiceNumber || '',
    paidAt: sale.paidAt || (sale.status === 'paid' ? sale.createdAt || '' : null),
    createdAt: sale.createdAt || '',
  }));

  // v7: POS invoices may be linked to a tenant and paid later. The manual
  // invoice is the receivable record; the POS sale keeps the cashier receipt.
  merged.manualInvoices = merged.manualInvoices.map((invoice) => ({
    source: 'manual',
    items: [],
    posSaleId: null,
    ...invoice,
    items: Array.isArray(invoice.items) ? invoice.items : [],
  }));

  // v6: email billing can run without DOKU; payment instructions are
  // configurable and DOKU links stay off until the account is active.
  if (storedVersion < 6) {
    if (typeof merged.settings.paymentInstructions !== 'string') {
      merged.settings.paymentInstructions = base.settings.paymentInstructions;
    }
    if (typeof merged.settings.dokuEnabled !== 'boolean') {
      merged.settings.dokuEnabled = base.settings.dokuEnabled;
    }
  }

  // v9: operational notification inbox, parking capacity, and daily parking
  // fee. Empty/invalid old values are replaced with safe defaults.
  if (!String(merged.settings.notificationEmail || '').trim()) {
    merged.settings.notificationEmail = NOTIFICATION_EMAIL;
  }
  const parkingCapacity = Math.floor(Number(merged.settings.parkingCapacity));
  merged.settings.parkingCapacity =
    Number.isFinite(parkingCapacity) && parkingCapacity > 0
      ? parkingCapacity
      : MAX_PARKING_CARS;
  // Parkir mobil memakai satu tarif flat (CAR_FEE), tanpa tarif harian.
  delete merged.settings.carDailyFee;

  // v10: bank transfer details for landing-page bookings and billing emails.
  if (!String(merged.settings.bankName || '').trim()) {
    merged.settings.bankName = 'Bank Mandiri';
  }
  if (!String(merged.settings.bankAccountNumber || '').trim()) {
    merged.settings.bankAccountNumber = '700013745877';
  }
  if (!String(merged.settings.bankAccountName || '').trim()) {
    merged.settings.bankAccountName = 'ERNY KURNIAWATI';
  }

  // v5: tenants and active bookings store an email address for billing.
  // v8: deposits are tracked separately from rent payments. `deposit` is the
  // refundable target, `depositPaid` is cash received, and `depositRefunded`
  // is cash returned at check-out.
  merged.tenants = merged.tenants.map((tenant) => ({
    email: '',
    deposit: 0,
    depositPaid: 0,
    depositRefunded: 0,
    depositHistory: [],
    ...tenant,
    depositHistory: Array.isArray(tenant.depositHistory) ? tenant.depositHistory : [],
  }));
  merged.rooms = merged.rooms.map((room) => {
    if (!room.booking) return room;
    const booking = {
      email: '',
      depositPaid: 0,
      depositRefunded: 0,
      depositHistory: [],
      ...room.booking,
      depositHistory: Array.isArray(room.booking.depositHistory)
        ? room.booking.depositHistory
        : [],
    };
    const paidInFull = booking.payOption === 'full';
    booking.paymentStatus =
      booking.paymentStatus === 'paid'
        ? 'paid'
        : booking.paymentStatus === 'unpaid'
          ? 'unpaid'
          : paidInFull
            ? 'paid'
            : 'unpaid';
    booking.amountPaid = Math.max(
      0,
      Number(booking.amountPaid) ||
        (booking.paymentStatus === 'paid' ? Number(booking.grandTotal) || 0 : 0),
    );
    booking.paidAt = booking.paidAt || null;
    booking.paymentMethod =
      booking.paymentMethod || (booking.paymentStatus === 'paid' ? 'Transfer Bank Mandiri' : '');
    return { ...room, booking };
  });

  // Keep the public WhatsApp number filled for saves created before the
  // landing page existed (empty string would otherwise override the default).
  if (!merged.settings.whatsapp) {
    merged.settings.whatsapp = base.settings.whatsapp;
  }

  // v3: the seeded staff account moved from "rian" to "admin". Rename an
  // existing saved account (keeping its password/role) or add the new seed.
  if (storedVersion < 3) {
    const adminExists = merged.users.some(
      (user) => String(user.username).toLowerCase() === 'admin',
    );
    const legacyStaff = merged.users.find(
      (user) => String(user.username).toLowerCase() === 'rian',
    );

    if (!adminExists && legacyStaff) {
      legacyStaff.username = 'admin';
      legacyStaff.name = 'Admin (Staf Kasir)';
    } else if (!adminExists) {
      const seedAdmin = base.users.find((user) => user.username === 'admin');
      if (seedAdmin) {
        const nextId =
          merged.users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1;
        merged.users.push({ ...seedAdmin, id: nextId });
      }
    }
  }

  // Drop a stale session that points to a removed/disabled account.
  if (merged.session) {
    const user = merged.users.find((item) => String(item.id) === String(merged.session.userId));
    if (!user || !user.active) merged.session = null;
  }

  return merged;
}

function loadState() {
  const stored = storage.get(STORAGE_KEY);
  if (stored && typeof stored === 'object') {
    return migrate(stored);
  }
  const seed = buildSeedState();
  storage.set(STORAGE_KEY, seed);
  return seed;
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) {
    try {
      listener(state);
    } catch (error) {
      console.error('[store] listener error', error);
    }
  }
}

/**
 * Mutate the state, persist it and notify subscribers.
 * @param {(draft: ReturnType<typeof buildSeedState>) => void} mutator
 */
export function update(mutator) {
  mutator(state);
  state.meta = { ...state.meta, updatedAt: new Date().toISOString() };
  storage.set(STORAGE_KEY, state);
  emit();
}

export function replaceState(nextState) {
  state = migrate(nextState || buildSeedState());
  storage.set(STORAGE_KEY, state);
  emit();
}

/**
 * Reset operational data but keep configuration (pricing, addons, promos,
 * templates, users). Used by the "Reset Data" action.
 */
export function resetOperationalData() {
  const current = state;
  update((draft) => {
    const fresh = buildSeedState();
    draft.rooms = fresh.rooms;
    draft.tenants = [];
    draft.bills = [];
    draft.manualInvoices = [];
    draft.expenses = [];
    draft.expenseCategories = fresh.expenseCategories;
    draft.posSales = [];
    // preserve configuration + auth
    draft.users = current.users;
    draft.session = current.session;
    draft.pricing = current.pricing;
    draft.addons = current.addons;
    draft.promos = current.promos;
    draft.templates = current.templates;
    draft.settings = current.settings;
  });
}

/** Factory reset: clears everything back to the seeded demo state. */
export function factoryReset() {
  state = buildSeedState();
  storage.set(STORAGE_KEY, state);
  emit();
}
