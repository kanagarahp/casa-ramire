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
];

const BOOLEAN_FIELDS = ['dokuEnabled'];

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
