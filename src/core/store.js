import { SCHEMA_VERSION, STORAGE_KEY } from './constants.js';
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
    pricing: { ...base.pricing, ...(stored.pricing || {}) },
    templates: { ...base.templates, ...(stored.templates || {}) },
    settings: { ...base.settings, ...(stored.settings || {}) },
  };

  for (const key of [
    'users',
    'rooms',
    'tenants',
    'bills',
    'manualInvoices',
    'expenses',
    'expenseCategories',
    'addons',
    'promos',
  ]) {
    if (!Array.isArray(merged[key])) merged[key] = base[key];
  }

  // v4: rooms can carry a catalog photo (local data URL and/or published URL).
  merged.rooms = merged.rooms.map((room) => ({
    photo: '',
    photoUrl: '',
    ...room,
  }));

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
