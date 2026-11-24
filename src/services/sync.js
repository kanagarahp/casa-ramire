import { replaceState, getState, subscribe } from '../core/store.js';
import { rupiah } from '../core/format.js';
import { storage } from '../core/storage.js';
import { toast } from '../ui/toast.js';
import {
  bootstrapAccounts,
  getApiAuthHeaders,
  getAuthToken,
  handleAuthExpired,
  loadRemoteUsers,
} from './auth.js';
import { getSettings } from './settings.js';

const POLL_INTERVAL = 15_000;

/**
 * Marker that this browser has completed a sync with the server at least once.
 * It protects a fresh device from pushing its empty seed state over real data.
 */
const SYNC_MARK_KEY = 'casa-ramire:sync';

let started = false;
let ready = false;
let version = 0;
let applying = false;
let pushing = false;
let pulling = false;
let pushTimer = null;
let pollTimer = null;
let lastCredential = '';
let unsubscribe = null;
let authWarned = false;

function handleFocus() {
  if (document.visibilityState === 'visible') pull();
}

function adminKey() {
  return String(getSettings().catalogAdminKey || '').trim();
}

/** Login token from any device, with the legacy admin key as fallback. */
function syncCredential() {
  return getAuthToken() || adminKey();
}

function readSyncMark() {
  const mark = storage.get(SYNC_MARK_KEY);
  return mark && typeof mark === 'object' ? mark : null;
}

function writeSyncMark() {
  storage.set(SYNC_MARK_KEY, {
    version,
    at: new Date().toISOString(),
  });
}

/**
 * A device may push its local state during the first sync only when it has
 * synced at the same server version before. A fresh device (no marker) must
 * always pull first so its empty seed never replaces real server data.
 */
function canPushOnFirstSync(serverVersion) {
  const mark = readSyncMark();
  return Boolean(mark) && Number(mark.version) === Number(serverVersion);
}

function refreshSyncBadge() {
  const badge = document.querySelector('[data-sync-badge]');
  if (!badge) return;

  const { keySet, ready: synced } = getSyncState();
  const state = !keySet ? 'off' : synced ? 'on' : 'pending';
  const dot = badge.querySelector('[data-sync-dot]');
  const label = badge.querySelector('[data-sync-label]');

  if (dot) {
    dot.className = `w-1.5 h-1.5 rounded-full ${
      state === 'on' ? 'bg-emerald-500' : state === 'pending' ? 'bg-amber-500' : 'bg-stone-400'
    }`;
  }
  if (label) {
    label.textContent =
      state === 'on' ? 'Tersinkron' : state === 'pending' ? 'Menyinkronkan…' : 'Sinkron nonaktif';
  }
  badge.title =
    state === 'on'
      ? 'Data perangkat ini sama dengan data server.'
      : state === 'pending'
        ? 'Sedang mengambil data terbaru dari server.'
        : 'Belum masuk atau kunci admin belum diisi. Data hanya tersimpan di perangkat ini.';
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
  writeSyncMark();
  refreshSyncBadge();
  if (notify) notifyRemoteChanges(before, next);
}

async function pull() {
  if (!syncCredential()) {
    if (getState().session?.remote) {
      handleAuthExpired();
      toast('Sesi login berakhir. Silakan masuk kembali.', 'error');
    }
    return;
  }
  if (pulling) return;
  if (ready && (pushing || pushTimer)) return;

  pulling = true;
  try {
    const response = await fetch('/api/state', {
      headers: getApiAuthHeaders({ Accept: 'application/json' }),
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      if (response.status === 401) {
        if (getAuthToken()) {
          handleAuthExpired();
          toast('Sesi login berakhir. Silakan masuk kembali.', 'error');
        } else if (!authWarned) {
          authWarned = true;
          toast('Kunci admin tidak valid. Periksa Pengaturan.', 'error');
        }
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
      const mark = readSyncMark();
      const localAt = Date.parse(getState().meta?.updatedAt || 0) || 0;
      const syncedAt = Date.parse(mark?.at || 0) || 0;
      const hasLocalEdits = Boolean(mark) && localAt > syncedAt;
      version = nextVersion;

      // A device that has never synced must never overwrite the server with
      // its seed/empty state. It may only push when the server is still at
      // the exact version this device last synced with.
      if (hasLocalEdits && canPushOnFirstSync(nextVersion)) {
        ready = true;
        await push();
      } else {
        if (hasLocalEdits) {
          toast(
            'Data server lebih baru. Perubahan lokal yang belum terkirim digantikan data server.',
            'warning',
          );
        }
        applyServerState(payload.state);
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
    refreshSyncBadge();
  }
}

async function push({ initial = false } = {}) {
  if (!syncCredential() || pushing) return;
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
      headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
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
      else writeSyncMark();
      toast(
        'Data dari server baru saja diperbarui. Perubahan lokal terakhir mungkin perlu diulang.',
        'warning',
      );
      return;
    }

    if (!response.ok) {
      if (response.status === 401 && getAuthToken()) {
        handleAuthExpired();
        toast('Sesi login berakhir. Silakan masuk kembali.', 'error');
      } else {
        console.warn('[sync] gagal menyimpan state', payload);
      }
      return;
    }

    version = Number(payload.version) || version;
    ready = true;
    writeSyncMark();
    refreshSyncBadge();
  } catch (error) {
    console.warn('[sync] gagal mengirim state', error);
  } finally {
    pushing = false;
    refreshSyncBadge();
  }
}

function schedulePush() {
  if (applying) return;

  const credential = syncCredential();
  if (credential !== lastCredential) {
    lastCredential = credential;
    ready = false;
    version = 0;
    if (credential) pull();
    return;
  }

  if (!credential || !ready) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => push(), 700);
}

export function startSync() {
  if (started) return;
  started = true;
  lastCredential = syncCredential();

  // The owner's original device may still rely on the legacy admin key. Seed
  // the server account table once so every other device can log in normally.
  if (!getAuthToken() && adminKey()) {
    bootstrapAccounts().catch(() => {});
  }

  unsubscribe = subscribe(schedulePush);

  // Keep the local account directory in sync (roles, names, deactivations).
  if (getAuthToken()) {
    loadRemoteUsers().catch(() => {});
  }

  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible') pull();
  }, POLL_INTERVAL);

  refreshSyncBadge();
  if (lastCredential) pull();
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
  refreshSyncBadge();
}

export function syncNow() {
  if (syncCredential()) pull();
}

/** Make sure the shared state exists before creating a payment link. */
export async function ensureSynced() {
  if (!syncCredential()) return false;
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
  const credential = syncCredential();
  return {
    active: started && Boolean(credential),
    ready,
    version,
    keySet: Boolean(credential),
    mode: getAuthToken() ? 'login' : credential ? 'key' : 'none',
  };
}
