import {
  DEFAULT_ADDONS,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_POS_PRODUCTS,
  DEFAULT_PRICING,
  DEFAULT_PROMOS,
  DEFAULT_SETTINGS,
  DEFAULT_TEMPLATES,
  DEFAULT_USERS,
  SCHEMA_VERSION,
} from './constants.js';
import { hashPassword } from './crypto.js';

/** 1 VIP room on floor 1 + 21 rooms per floor on floors 2–3. */
export function generateRooms() {
  const rooms = [];
  let id = 1;

  for (const floor of ['2', '3']) {
    for (let index = 1; index <= 21; index += 1) {
      rooms.push({
        id,
        nomor: `${floor}${String(index).padStart(2, '0')}`,
        lantai: floor,
        tipe: 'Deluxe',
        status: 'kosong',
        tenantId: null,
        booking: null,
        photo: '',
        photoUrl: '',
        // Kamar bulanan yang sedang kosong boleh dipakai untuk tamu harian.
        dailyEnabled: true,
        monthlyEnabled: true,
        dailyCalendar: {},
      });
      id += 1;
    }
  }

  // Lantai 1: satu kamar Deluxe VIP yang dikhususkan untuk sewa harian.
  // Appended so existing room IDs stay stable for saved data and tests.
  rooms.push({
    id,
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
    // Harga & status per tanggal untuk kamar VIP.
    dailyCalendar: {},
  });
  return rooms;
}

function withIds(list) {
  return list.map((item, index) => ({ id: index + 1, ...item }));
}

export function buildSeedState() {
  const now = new Date().toISOString();
  return {
    version: SCHEMA_VERSION,
    meta: { createdAt: now, updatedAt: now },
    session: null,
    users: DEFAULT_USERS.map((user, index) => ({
      id: index + 1,
      name: user.name,
      username: user.username,
      passHash: hashPassword(user.password),
      role: user.role,
      active: true,
      createdAt: now,
    })),
    rooms: generateRooms(),
    gallery: [],
    tenants: [],
    bills: [],
    manualInvoices: [],
    expenses: [],
    expenseCategories: [...DEFAULT_EXPENSE_CATEGORIES],
    addons: withIds(DEFAULT_ADDONS),
    promos: withIds(DEFAULT_PROMOS),
    posProducts: withIds(DEFAULT_POS_PRODUCTS),
    posSales: [],
    pricing: structuredClone(DEFAULT_PRICING),
    templates: { ...DEFAULT_TEMPLATES },
    settings: { ...DEFAULT_SETTINGS },
  };
}
