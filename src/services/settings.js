import { getState, update } from '../core/store.js';

const TEXT_FIELDS = [
  'propertyName',
  'tagline',
  'description',
  'address',
  'whatsapp',
  'email',
  'mapsUrl',
  'mapsEmbedUrl',
  'facilities',
  'catalogAdminKey',
  'paymentInstructions',
  'notificationEmail',
];

const BOOLEAN_FIELDS = ['dokuEnabled'];

const NUMBER_FIELDS = ['parkingCapacity', 'carDailyFee'];

function normalizeText(value) {
  return String(value ?? '').trim();
}

export function getSettings() {
  return getState().settings || {};
}

export function updateSettings(patch = {}) {
  update((draft) => {
    draft.settings = draft.settings || {};
    for (const field of TEXT_FIELDS) {
      if (patch[field] !== undefined) {
        draft.settings[field] = normalizeText(patch[field]);
      }
    }
    for (const field of BOOLEAN_FIELDS) {
      if (patch[field] !== undefined) {
        draft.settings[field] = Boolean(patch[field]);
      }
    }
    for (const field of NUMBER_FIELDS) {
      if (patch[field] !== undefined) {
        const value = Math.max(0, Math.floor(Number(patch[field]) || 0));
        draft.settings[field] = value;
      }
    }
  });

  return getSettings();
}

export function getFacilities() {
  const raw = getSettings().facilities || '';
  return raw
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAdminWhatsApp() {
  return String(getSettings().whatsapp || '').trim();
}

/** DOKU links are opt-in so billing email still works before activation. */
export function isDokuEnabled() {
  return Boolean(getSettings().dokuEnabled);
}

export function getNotificationEmail() {
  return String(getSettings().notificationEmail || 'casaramirejogja@gmail.com').trim();
}

export function getParkingCapacity() {
  const value = Math.floor(Number(getSettings().parkingCapacity));
  return Number.isFinite(value) && value > 0 ? value : 15;
}

export function getCarDailyFee() {
  const value = Math.floor(Number(getSettings().carDailyFee));
  return Number.isFinite(value) && value >= 0 ? value : 10000;
}
