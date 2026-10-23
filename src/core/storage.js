/**
 * localStorage wrapper with an in-memory fallback.
 * Prevents the app from crashing when storage is blocked (private mode/iframes).
 */

const memory = new Map();

function hasLocalStorage() {
  try {
    const probe = '__casa_ramire_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const available = hasLocalStorage();

export const storage = {
  get(key) {
    try {
      const raw = available ? window.localStorage.getItem(key) : memory.get(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (available) window.localStorage.setItem(key, raw);
      else memory.set(key, raw);
      return true;
    } catch (error) {
      console.warn('[storage] Gagal menyimpan data:', error);
      return false;
    }
  },

  remove(key) {
    try {
      if (available) window.localStorage.removeItem(key);
      else memory.delete(key);
    } catch {
      /* ignore */
    }
  },

  getRaw(key) {
    try {
      return available ? window.localStorage.getItem(key) : memory.get(key) ?? null;
    } catch {
      return null;
    }
  },

  setRaw(key, value) {
    try {
      if (available) window.localStorage.setItem(key, value);
      else memory.set(key, value);
      return true;
    } catch {
      return false;
    }
  },
};
