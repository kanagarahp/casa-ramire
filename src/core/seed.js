import {
  DEFAULT_ADDONS,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_PRICING,
  DEFAULT_PROMOS,
  DEFAULT_SETTINGS,
  DEFAULT_TEMPLATES,
  DEFAULT_USERS,
  SCHEMA_VERSION,
} from './constants.js';
import { hashPassword } from './crypto.js';

/** 21 rooms per floor: 201–221 and 301–321. */
export function generateRooms() {
  const rooms = [];
  let id = 1;
  for (const floor of ['2', '3']) {
    for (let index = 1; index <= 21; index += 1) {
      rooms.push({
        id,
        nomor: `${floor}${String(index).padStart(2, '0')}`,
        lantai: floor,
        status: 'kosong',
        tenantId: null,
        booking: null,
        photo: '',
        photoUrl: '',
      });
      id += 1;
    }
  }
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
    tenants: [],
    bills: [],
    manualInvoices: [],
    expenses: [],
    expenseCategories: [...DEFAULT_EXPENSE_CATEGORIES],
    addons: withIds(DEFAULT_ADDONS),
    promos: withIds(DEFAULT_PROMOS),
    pricing: structuredClone(DEFAULT_PRICING),
    templates: { ...DEFAULT_TEMPLATES },
    settings: { ...DEFAULT_SETTINGS },
  };
}
