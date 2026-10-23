import { DEFAULT_TEMPLATES } from '../core/constants.js';
import { getState, update } from '../core/store.js';
import { formatDate, rupiah } from '../core/format.js';

export function getTemplates() {
  return { ...DEFAULT_TEMPLATES, ...(getState().templates || {}) };
}

export function saveTemplates(next) {
  const merged = { ...getTemplates(), ...next };
  for (const [key, value] of Object.entries(merged)) {
    if (!String(value || '').trim()) {
      throw new Error(`Template "${key}" tidak boleh kosong.`);
    }
  }
  update((draft) => {
    draft.templates = merged;
  });
}

export function buildMessage(type, context = {}) {
  const template = getTemplates()[type] || '';
  return template.replace(/\{([a-z_]+)\}/gi, (match, token) => {
    const value = context[token];
    return value === undefined || value === null ? match : String(value);
  });
}

export const SAMPLE_CONTEXT = {
  nama: 'Rani Putri',
  kamar: '204',
  nominal: rupiah(2200000),
  jatuh_tempo: formatDate(new Date().toISOString().slice(0, 10)),
  no_invoice: 'SRV/202610/0001',
  item_layanan: 'Laundry 5 Kg',
};
