import { toNumber } from '../core/format.js';
import { nextId } from '../core/id.js';
import { getState, update } from '../core/store.js';

export function getAddons({ activeOnly = false } = {}) {
  const addons = getState().addons || [];
  return activeOnly ? addons.filter((addon) => addon.active) : [...addons];
}

export function getAddon(id) {
  return getState().addons.find((addon) => String(addon.id) === String(id)) || null;
}

export function saveAddon({ id = null, name, price, active = true }) {
  const cleanName = String(name || '').trim();
  const value = Math.round(toNumber(price));
  if (!cleanName) throw new Error('Nama add-on wajib diisi.');
  if (value <= 0) throw new Error('Tarif add-on harus lebih dari 0.');

  update((draft) => {
    if (id) {
      const target = draft.addons.find((addon) => String(addon.id) === String(id));
      if (!target) throw new Error('Add-on tidak ditemukan.');
      Object.assign(target, { name: cleanName, price: value, active: Boolean(active) });
    } else {
      draft.addons.push({
        id: nextId(draft.addons),
        name: cleanName,
        price: value,
        active: Boolean(active),
      });
    }
  });
}

export function toggleAddon(id) {
  update((draft) => {
    const target = draft.addons.find((addon) => String(addon.id) === String(id));
    if (target) target.active = !target.active;
  });
}

export function deleteAddon(id) {
  update((draft) => {
    draft.addons = draft.addons.filter((addon) => String(addon.id) !== String(id));
  });
}
