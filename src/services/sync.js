import { replaceState, getState, subscribe } from '../core/store.js';
import { rupiah } from '../core/format.js';
import { toast } from '../ui/toast.js';
import { getSettings } from './settings.js';

const POLL_INTERVAL = 15_000;

let started = false;
let ready = false;
let version = 0;
let applying = false;
let pushing = false;
let pulling = false;
let pushTimer = null;
let pollTimer = null;
let lastKey = '';
let unsubscribe = null;
let authWarned = false;

function handleFocus() {
  if (document.visibilityState === 'visible') pull();
}

function adminKey() {
  return String(getSettings().catalogAdminKey || '').trim();
}

function sanitizeForServer(state) {
  const clone = JSON.parse(JSON.stringify(state));
  delete clone.users;
  delete clone.session;
  if (clone.settings) delete clone.settings.catalogAdminKey;

  if (Array.isArray(clone.rooms)) {
    clone.rooms = clone.rooms.map((room) => {
      const photo = String(room.photo || '');
      return {
        ...room,
        // Photos are published separately via /api/catalog/photo.
        photo: photo.startsWith('data:image/') ? '' : photo,
      };
    });
  }

  if (Array.isArray(clone.gallery)) {
    clone.gallery = clone.gallery.map((item) => {
      const photo = String(item.photo || '');
      return {
        ...item,
        photo: photo.startsWith('data:image/') ? '' : photo,
      };
    });
  }

  return clone;
}

function mergeServerState(serverState) {
  const local = getState();
  const localPhotos = new Map(
    (local.rooms || [])
      .filter((room) => room.photo)
      .map((room) => [String(room.id), room.photo]),
  );
  const localGalleryPhotos = new Map(
    (local.gallery || [])
      .filter((item) => item.photo)
      .map((item) => [String(item.id), item.photo]),
  );

  return {
    ...serverState,
    users: local.users,
    session: local.session,
    settings: {
      ...(serverState.settings || {}),
      catalogAdminKey: local.settings?.catalogAdminKey || '',
    },
    rooms: (serverState.rooms || []).map((room) => ({
      ...room,
      photo: localPhotos.get(String(room.id)) || '',
    })),
    gallery: (serverState.gallery || []).map((item) => ({
      ...item,
      photo: localGalleryPhotos.get(String(item.id)) || item.photo || '',
    })),
  };
}

function notifyRemoteChanges(before, after) {
  const beforePaid = new Set(
    (before.bills || []).filter((bill) => bill.status === 'paid').map((bill) => String(bill.id)),
  );

  const newlyPaid = (after.bills || []).filter(
    (bill) => bill.status === 'paid' && !beforePaid.has(String(bill.id)),
  );

  const beforeInvoices = new Set(
    (before.manualInvoices || [])
      .filter((invoice) => invoice.status === 'paid')
      .map((invoice) => String(invoice.id)),
  );
  const newlyPaidInvoices = (after.manualInvoices || []).filter(
    (invoice) => invoice.status === 'paid' && !beforeInvoices.has(String(invoice.id)),
  );

  if (newlyPaid.length) {
    const bill = newlyPaid[0];
    toast(
      `Pembayaran DOKU diterima: ${bill.tenantName || 'penghuni'} • ${rupiah(bill.amount)}`,
    );
    return;
  }

  if (newlyPaidInvoices.length) {
    const invoice = newlyPaidInvoices[0];
    toast(
      `Invoice lunas via DOKU: ${invoice.tenantName || 'penghuni'} • ${rupiah(invoice.amount)}`,
    );
    return;
  }

  for (const tenant of after.tenants || []) {
    const previous = (before.tenants || []).find(
      (item) => String(item.id) === String(tenant.id),
    );
    if (previous && tenant.endDate && tenant.endDate > (previous.endDate || '')) {
      toast(`Kontrak ${tenant.name} otomatis diperpanjang sampai ${tenant.endDate}.`);
      return;
    }
  }
}

function applyServerState(serverState, { notify = true } = {}) {
  const before = getState();
  const next = mergeServerState(serverState);
  applying = true;
  try {
    replaceState(next);
  } finally {
    applying = false;
  }
  ready = true;
  if (notify) notifyRemoteChanges(before, next);
}

async function pull() {
  const key = adminKey();
  if (!key || pulling) return;
  if (ready && (pushing || pushTimer)) return;

  pulling = true;
  try {
    const response = await fetch('/api/state', {
      headers: { Accept: 'application/json', 'x-admin-key': key },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      if (response.status === 401 && !authWarned) {
        authWarned = true;
        toast('Kunci admin tidak valid. Periksa Pengaturan.', 'error');
      }
      return;
    }

    authWarned = false;
    const payload = await response.json();

    if (!payload?.exists) {
      ready = false;
      version = 0;
      await push({ initial: true });
      return;
    }

    const nextVersion = Number(payload.version) || 0;

    if (!ready) {
      const localAt = Date.parse(getState().meta?.updatedAt || 0);
      const serverAt = Date.parse(payload.state?.meta?.updatedAt || 0);
      version = nextVersion;

      if (serverAt > localAt) {
        applyServerState(payload.state);
      } else {
        ready = true;
        await push();
      }
      return;
    }

    if (nextVersion > version) {
      version = nextVersion;
      applyServerState(payload.state);
    }
  } catch (error) {
    console.warn('[sync] gagal mengambil data server', error);
  } finally {
    pulling = false;
  }
}

async function push({ initial = false } = {}) {
  const key = adminKey();
  if (!key || pushing) return;
  clearTimeout(pushTimer);
  pushTimer = null;
  if (pulling) {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push({ initial }), 500);
    return;
  }

  if (!ready && !initial) {
    await pull();
    if (!ready) return;
  }

  pushing = true;
  try {
    const response = await fetch('/api/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': key,
      },
      body: JSON.stringify({
        state: sanitizeForServer(getState()),
        baseVersion: version,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn('[sync] API state tidak tersedia. Gunakan production atau `vercel dev`.');
      return;
    }

    const payload = await response.json().catch(() => ({}));

    if (response.status === 409 && payload?.conflict) {
      version = Number(payload.version) || version;
      if (payload.state) applyServerState(payload.state);
      toast(
        'Data dari server baru saja diperbarui. Perubahan lokal terakhir mungkin perlu diulang.',
        'warning',
      );
      return;
    }

    if (!response.ok) {
      console.warn('[sync] gagal menyimpan state', payload);
      return;
    }

    version = Number(payload.version) || version;
    ready = true;
  } catch (error) {
    console.warn('[sync] gagal mengirim state', error);
  } finally {
    pushing = false;
  }
}

function schedulePush() {
  if (applying) return;

  const key = adminKey();
  if (key !== lastKey) {
    lastKey = key;
    ready = false;
    version = 0;
    if (key) pull();
    return;
  }

  if (!key || !ready) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => push(), 700);
}

export function startSync() {
  if (started) return;
  started = true;
  lastKey = adminKey();

  unsubscribe = subscribe(schedulePush);

  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible') pull();
  }, POLL_INTERVAL);

  if (lastKey) pull();
}

export function stopSync() {
  if (!started) return;
  started = false;
  ready = false;
  version = 0;
  clearTimeout(pushTimer);
  clearInterval(pollTimer);
  window.removeEventListener('focus', handleFocus);
  document.removeEventListener('visibilitychange', handleFocus);
  unsubscribe?.();
  unsubscribe = null;
}

export function syncNow() {
  if (adminKey()) pull();
}

/** Make sure the shared state exists before creating a payment link. */
export async function ensureSynced() {
  if (!adminKey()) return false;
  if (!started) startSync();

  for (let attempt = 0; attempt < 4 && !ready; attempt += 1) {
    if (pulling || pushing) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      continue;
    }
    await pull();
    if (!ready) await push({ initial: true });
  }

  // Flush the latest local bill/invoice edits before the server computes a
  // payment amount from the shared state.
  if (ready) {
    if (pushing) await new Promise((resolve) => setTimeout(resolve, 300));
    await push();
  }

  return ready;
}

export function getSyncState() {
  return {
    active: started && Boolean(adminKey()),
    ready,
    version,
    keySet: Boolean(adminKey()),
  };
}
