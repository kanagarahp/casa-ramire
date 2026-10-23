import { PERIOD_KEYS } from '../core/constants.js';
import { addDays, toNumber, todayISO } from '../core/format.js';
import { nextId } from '../core/id.js';
import { getState, update } from '../core/store.js';
import { pushBill } from './billing.js';
import { computeQuote } from './pricing.js';

function must(condition, message) {
  if (!condition) throw new Error(message);
}

export function getRooms() {
  return getState().rooms;
}

export function getRoom(id) {
  return getState().rooms.find((room) => String(room.id) === String(id)) || null;
}

export function getTenant(id) {
  return getState().tenants.find((tenant) => String(tenant.id) === String(id)) || null;
}

export function getTenants({ activeOnly = false } = {}) {
  const tenants = getState().tenants;
  return (activeOnly ? tenants.filter((tenant) => tenant.status === 'aktif') : [...tenants]).sort(
    (a, b) => a.name.localeCompare(b.name, 'id'),
  );
}

export function getRoomOfTenant(tenant) {
  if (!tenant) return null;
  if (tenant.roomId) {
    const room = getRoom(tenant.roomId);
    if (room) return room;
  }
  return null;
}

export function addRoom({ nomor, lantai }) {
  const number = String(nomor || '').trim();
  const floor = String(lantai || '').trim();
  must(/^\d{2,4}$/.test(number), 'Nomor kamar harus berupa 2–4 digit angka.');
  must(['2', '3'].includes(floor), 'Lantai tidak valid.');

  const state = getState();
  must(!state.rooms.some((room) => room.nomor === number), `Kamar ${number} sudah ada.`);

  update((draft) => {
    draft.rooms.push({
      id: nextId(draft.rooms),
      nomor: number,
      lantai: floor,
      status: 'kosong',
      tenantId: null,
      booking: null,
    });
  });
}

export function deleteRoom(id) {
  const room = getRoom(id);
  if (!room) return;
  must(room.status === 'kosong' && !room.booking, 'Hanya kamar kosong tanpa booking yang dapat dihapus.');

  update((draft) => {
    draft.rooms = draft.rooms.filter((item) => String(item.id) !== String(id));
  });
}

function validateGuest(data) {
  const name = String(data.name || '').trim();
  const phone = String(data.phone || '').trim();
  must(name.length >= 2, 'Nama penghuni wajib diisi.');
  must(phone.length >= 8, 'Nomor WhatsApp wajib diisi dengan benar.');
  must(PERIOD_KEYS.includes(String(data.periode)), 'Skema periode tidak valid.');
  return { name, phone };
}

function normalizeAddons(addons) {
  return (addons || [])
    .filter((addon) => addon && addon.name)
    .map((addon) => ({
      id: addon.id ?? null,
      name: String(addon.name),
      price: Math.max(0, Math.round(toNumber(addon.price))),
    }));
}

function promoSnapshot(quote) {
  return {
    promoId: quote.promo?.id ?? null,
    promoName: quote.promo?.name ?? '',
    promoType: quote.promo?.type ?? '',
    promoValue: quote.promo?.value ?? 0,
  };
}

function buildQuoteFor(room, payload) {
  return computeQuote({
    lantai: room.lantai,
    periode: payload.periode,
    startDate: payload.startDate,
    endDate: payload.endDate,
    promo: payload.promo || null,
    addons: payload.addons || [],
    depositEnabled: Boolean(payload.depositEnabled),
    depositValue: payload.depositValue,
    payOption: payload.payOption === 'full' ? 'full' : 'partial',
  });
}

/* ------------------------------------------------------------------ */
/* Booking                                                             */
/* ------------------------------------------------------------------ */

export function saveBooking(roomId, payload) {
  const room = getRoom(roomId);
  must(room, 'Kamar tidak ditemukan.');
  must(room.status !== 'terisi', 'Kamar sedang dihuni. Gunakan perpanjangan atau pindah kamar.');

  const guest = validateGuest(payload);
  const addons = normalizeAddons(payload.addons);
  const quote = buildQuoteFor(room, { ...payload, addons });

  update((draft) => {
    const target = draft.rooms.find((item) => String(item.id) === String(roomId));
    target.status = 'booking';
    target.tenantId = null;
    target.booking = {
      name: guest.name,
      phone: guest.phone,
      job: String(payload.job || '').trim(),
      notes: String(payload.notes || '').trim(),
      emergencyContact: {
        name: String(payload.emergencyContact?.name || '').trim(),
        relation: String(payload.emergencyContact?.relation || '').trim(),
        phone: String(payload.emergencyContact?.phone || '').trim(),
      },
      periode: quote.periode,
      startDate: quote.startDate,
      endDate: quote.endDate,
      addons,
      ...promoSnapshot(quote),
      base: quote.base,
      discount: quote.discount,
      rentTotal: quote.rentTotal,
      addonTotal: quote.addonTotal,
      grandTotal: quote.grandTotal,
      deposit: quote.deposit,
      payOption: quote.payOption,
      payNow: quote.payNow,
      remaining: quote.remaining,
      monthlyCharge: quote.monthlyCharge,
      createdAt: target.booking?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  return getRoom(roomId);
}

export function cancelBooking(roomId) {
  const room = getRoom(roomId);
  if (!room) return;
  must(room.status === 'booking', 'Kamar ini tidak memiliki booking aktif.');

  update((draft) => {
    const target = draft.rooms.find((item) => String(item.id) === String(roomId));
    target.status = 'kosong';
    target.tenantId = null;
    target.booking = null;
  });
}

/* ------------------------------------------------------------------ */
/* Check-in                                                            */
/* ------------------------------------------------------------------ */

function addPayment(tenant, draft, { amount, type, method = 'Tunai / Cash', note = '', billId = null, date }) {
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

function createTenant(draft, room, data, quote, rentPaid) {
  const now = new Date().toISOString();
  const tenant = {
    id: nextId(draft.tenants),
    name: data.name,
    phone: data.phone,
    job: data.job || '',
    notes: data.notes || '',
    emergencyContact: data.emergencyContact || { name: '', relation: '', phone: '' },
    roomId: room.id,
    roomNumber: room.nomor,
    floor: room.lantai,
    periode: quote.periode,
    startDate: quote.startDate,
    endDate: quote.endDate,
    addons: normalizeAddons(data.addons),
    ...promoSnapshot(quote),
    base: quote.base,
    discount: quote.discount,
    rentTotal: quote.rentTotal,
    addonTotal: quote.addonTotal,
    contractTotal: quote.grandTotal,
    monthlyCharge: quote.monthlyCharge,
    deposit: quote.deposit,
    depositPaid: quote.deposit,
    totalPaid: Math.max(0, Math.round(toNumber(rentPaid))),
    status: 'aktif',
    checkinDate: quote.startDate,
    checkoutDate: null,
    stayHistory: [
      {
        roomId: room.id,
        roomNumber: room.nomor,
        floor: room.lantai,
        from: quote.startDate,
        to: null,
      },
    ],
    payments: [],
    createdAt: now,
    updatedAt: now,
  };

  draft.tenants.push(tenant);

  const isPaid = tenant.totalPaid >= quote.grandTotal - 0.5;
  const bill =
    quote.grandTotal > 0
      ? pushBill(draft, {
          tenantId: tenant.id,
          roomId: room.id,
          type: 'Sewa',
          description: `${quote.periodLabel} • ${quote.startDate} s/d ${quote.endDate}`,
          amount: quote.grandTotal,
          paid: isPaid,
          dueDate: quote.startDate,
          periodStart: quote.startDate,
          periodEnd: quote.endDate,
          source: 'rent',
        })
      : null;

  if (quote.deposit > 0) {
    addPayment(tenant, draft, {
      amount: quote.deposit,
      type: 'Deposit',
      note: 'Deposit check-in',
      date: quote.startDate,
    });
  }
  if (tenant.totalPaid > 0) {
    addPayment(tenant, draft, {
      amount: tenant.totalPaid,
      type: 'Sewa',
      note: 'Pembayaran check-in',
      billId: bill?.id ?? null,
      date: quote.startDate,
    });
  }

  room.status = 'terisi';
  room.tenantId = tenant.id;
  room.booking = null;

  return tenant;
}

export function checkInDirect(roomId, payload) {
  const room = getRoom(roomId);
  must(room, 'Kamar tidak ditemukan.');
  must(room.status === 'kosong', 'Kamar ini tidak kosong. Muat ulang data.');

  const guest = validateGuest(payload);
  const addons = normalizeAddons(payload.addons);
  const quote = buildQuoteFor(room, { ...payload, addons });
  const rentPaid = quote.payOption === 'full' ? quote.grandTotal : 0;

  let tenant;
  update((draft) => {
    const target = draft.rooms.find((item) => String(item.id) === String(roomId));
    tenant = createTenant(
      draft,
      target,
      {
        ...guest,
        job: payload.job,
        notes: payload.notes,
        emergencyContact: payload.emergencyContact,
        addons,
      },
      quote,
      rentPaid,
    );
  });

  return tenant;
}

/**
 * Convert a booking into an active tenancy.
 * @param {number|string} roomId
 * @param {{settle?: boolean}} options settle=true marks the remaining rent as paid.
 */
export function checkInFromBooking(roomId, { settle = true } = {}) {
  const room = getRoom(roomId);
  must(room?.booking, 'Booking tidak ditemukan.');
  const booking = room.booking;

  const quote = {
    periode: booking.periode,
    startDate: booking.startDate,
    endDate: booking.endDate,
    periodLabel: booking.periode === 'harian' ? 'Harian' : booking.periode === 'mingguan' ? 'Mingguan' : `${booking.periode} Bulan`,
    base: booking.base,
    discount: booking.discount,
    rentTotal: booking.rentTotal,
    addonTotal: booking.addonTotal,
    grandTotal: booking.grandTotal,
    deposit: booking.deposit,
    monthlyCharge: booking.monthlyCharge,
    promo: booking.promoId
      ? {
          id: booking.promoId,
          name: booking.promoName,
          type: booking.promoType,
          value: booking.promoValue,
        }
      : null,
  };

  const alreadyPaid = booking.payOption === 'full' ? booking.grandTotal : 0;
  const rentPaid = settle ? quote.grandTotal : alreadyPaid;

  let tenant;
  update((draft) => {
    const target = draft.rooms.find((item) => String(item.id) === String(roomId));
    tenant = createTenant(
      draft,
      target,
      {
        name: booking.name,
        phone: booking.phone,
        job: booking.job,
        notes: booking.notes,
        emergencyContact: booking.emergencyContact,
        addons: booking.addons,
      },
      quote,
      rentPaid,
    );
  });

  return tenant;
}

/* ------------------------------------------------------------------ */
/* Contract lifecycle                                                  */
/* ------------------------------------------------------------------ */

export function extendContract(tenantId, payload) {
  const tenant = getTenant(tenantId);
  must(tenant, 'Penghuni tidak ditemukan.');
  must(tenant.status === 'aktif', 'Penghuni sudah tidak aktif.');
  const room = getRoomOfTenant(tenant);
  must(room, 'Kamar penghuni tidak ditemukan.');

  const startDate = payload.startDate || addDays(tenant.endDate, 1);
  must(startDate >= tenant.endDate, 'Tanggal mulai perpanjangan tidak boleh sebelum akhir kontrak berjalan.');

  const addons = normalizeAddons(payload.addons ?? tenant.addons);
  const quote = buildQuoteFor(room, { ...payload, startDate, addons });
  const rentPaid = quote.payOption === 'full' ? quote.grandTotal : 0;

  update((draft) => {
    const target = draft.tenants.find((item) => String(item.id) === String(tenantId));
    target.periode = quote.periode;
    target.endDate = quote.endDate;
    target.startDate = target.startDate || quote.startDate;
    target.addons = addons;
    Object.assign(target, promoSnapshot(quote));
    target.base = quote.base;
    target.discount = quote.discount;
    target.rentTotal = toNumber(target.rentTotal) + quote.rentTotal;
    target.addonTotal = toNumber(target.addonTotal) + quote.addonTotal;
    target.contractTotal = toNumber(target.contractTotal) + quote.grandTotal;
    target.monthlyCharge = quote.monthlyCharge;
    target.totalPaid = toNumber(target.totalPaid) + rentPaid;
    target.updatedAt = new Date().toISOString();

    const bill =
      quote.grandTotal > 0
        ? pushBill(draft, {
            tenantId: target.id,
            roomId: room.id,
            type: 'Perpanjangan',
            description: `${quote.periodLabel} • ${quote.startDate} s/d ${quote.endDate}`,
            amount: quote.grandTotal,
            paid: rentPaid >= quote.grandTotal,
            dueDate: quote.startDate,
            periodStart: quote.startDate,
            periodEnd: quote.endDate,
            source: 'rent',
          })
        : null;

    if (rentPaid > 0) {
      addPayment(target, draft, {
        amount: rentPaid,
        type: 'Perpanjangan',
        note: 'Pembayaran perpanjangan',
        billId: bill?.id ?? null,
        date: quote.startDate,
      });
    }
  });

  return getTenant(tenantId);
}

export function moveTenant(tenantId, roomId, date = todayISO()) {
  const tenant = getTenant(tenantId);
  must(tenant, 'Penghuni tidak ditemukan.');
  must(tenant.status === 'aktif', 'Penghuni sudah tidak aktif.');

  const oldRoom = getRoomOfTenant(tenant);
  const newRoom = getRoom(roomId);
  must(newRoom, 'Kamar tujuan tidak ditemukan.');
  must(newRoom.status === 'kosong', 'Kamar tujuan tidak kosong.');
  must(!oldRoom || oldRoom.id !== newRoom.id, 'Kamar tujuan sama dengan kamar saat ini.');

  update((draft) => {
    const target = draft.tenants.find((item) => String(item.id) === String(tenantId));

    if (oldRoom) {
      const old = draft.rooms.find((item) => String(item.id) === String(oldRoom.id));
      if (old) {
        old.status = 'kosong';
        old.tenantId = null;
        old.booking = null;
      }
    }

    const nextRoom = draft.rooms.find((item) => String(item.id) === String(newRoom.id));
    nextRoom.status = 'terisi';
    nextRoom.tenantId = target.id;
    nextRoom.booking = null;

    target.roomId = nextRoom.id;
    target.roomNumber = nextRoom.nomor;
    target.floor = nextRoom.lantai;
    target.updatedAt = new Date().toISOString();

    const history = target.stayHistory || [];
    const openEntry = [...history].reverse().find((entry) => !entry.to);
    if (openEntry) openEntry.to = date;
    history.push({
      roomId: nextRoom.id,
      roomNumber: nextRoom.nomor,
      floor: nextRoom.lantai,
      from: date,
      to: null,
    });
    target.stayHistory = history;
  });

  return getTenant(tenantId);
}

export function checkoutTenant(tenantId, date = todayISO()) {
  const tenant = getTenant(tenantId);
  must(tenant, 'Penghuni tidak ditemukan.');
  must(tenant.status === 'aktif', 'Penghuni sudah tidak aktif.');

  const room = getRoomOfTenant(tenant);

  update((draft) => {
    const target = draft.tenants.find((item) => String(item.id) === String(tenantId));
    if (room) {
      const currentRoom = draft.rooms.find((item) => String(item.id) === String(room.id));
      if (currentRoom) {
        currentRoom.status = 'kosong';
        currentRoom.tenantId = null;
        currentRoom.booking = null;
      }
    }

    target.status = 'checkout';
    target.checkoutDate = date;
    target.roomId = null;
    target.updatedAt = new Date().toISOString();

    const openEntry = [...(target.stayHistory || [])].reverse().find((entry) => !entry.to);
    if (openEntry) openEntry.to = date;
  });

  return getTenant(tenantId);
}

export function updateTenant(tenantId, patch) {
  const tenant = getTenant(tenantId);
  must(tenant, 'Penghuni tidak ditemukan.');

  const name = String(patch.name ?? tenant.name).trim();
  must(name.length >= 2, 'Nama penghuni wajib diisi.');

  update((draft) => {
    const target = draft.tenants.find((item) => String(item.id) === String(tenantId));
    target.name = name;
    if (patch.phone !== undefined) target.phone = String(patch.phone).trim();
    if (patch.job !== undefined) target.job = String(patch.job).trim();
    if (patch.notes !== undefined) target.notes = String(patch.notes).trim();
    if (patch.emergencyContact !== undefined) {
      target.emergencyContact = {
        name: String(patch.emergencyContact.name || '').trim(),
        relation: String(patch.emergencyContact.relation || '').trim(),
        phone: String(patch.emergencyContact.phone || '').trim(),
      };
    }
    target.updatedAt = new Date().toISOString();
  });

  return getTenant(tenantId);
}

export function deleteTenant(tenantId) {
  const tenant = getTenant(tenantId);
  must(tenant, 'Penghuni tidak ditemukan.');
  must(tenant.status === 'checkout', 'Checkout penghuni terlebih dahulu sebelum menghapus data.');

  update((draft) => {
    draft.tenants = draft.tenants.filter((item) => String(item.id) !== String(tenantId));
    draft.bills.forEach((bill) => {
      if (String(bill.tenantId) === String(tenantId)) bill.tenantId = null;
    });
    draft.manualInvoices.forEach((invoice) => {
      if (String(invoice.tenantId) === String(tenantId)) invoice.tenantId = null;
    });
  });
}

export function getOutstandingForTenant(tenantId) {
  const state = getState();
  const bills = state.bills
    .filter((bill) => String(bill.tenantId) === String(tenantId) && bill.status === 'unpaid')
    .reduce((sum, bill) => sum + toNumber(bill.amount - bill.paid), 0);
  const invoices = state.manualInvoices
    .filter((invoice) => String(invoice.tenantId) === String(tenantId) && invoice.status === 'unpaid')
    .reduce((sum, invoice) => sum + toNumber(invoice.amount - invoice.paid), 0);
  return bills + invoices;
}

export function getBookingRoomOfTenant(tenant) {
  return tenant?.roomId ? getRoom(tenant.roomId) : null;
}
