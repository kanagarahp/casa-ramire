import { storage } from '../core/storage.js';
import { getApiAuthHeaders, hasApiAuth } from './auth.js';

const LOCAL_KEY = 'casa-ramire:booking-requests';

function readLocal() {
  const list = storage.get(LOCAL_KEY);
  return Array.isArray(list) ? list : [];
}

function writeLocal(list) {
  storage.set(LOCAL_KEY, list);
}

function localCode() {
  return `LOCAL-${Date.now().toString(36).toUpperCase()}`;
}

function apiError(payload, fallback) {
  const error = new Error(String(payload?.error || fallback));
  error.code = payload?.code || '';
  return error;
}

/**
 * Submit a booking request from the public landing page.
 *
 * The server is the source of truth (and enforces the promo quota). During
 * local Vite development, where serverless functions are unavailable, the
 * request is kept in localStorage so the admin flow can still be tested.
 */
export async function submitBookingRequest(payload) {
  let response;
  try {
    response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return saveLocalBooking(payload, error);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return saveLocalBooking(payload, new Error('API booking tidak tersedia.'));
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Do not lose a visitor's request when the server/database is temporarily
    // unavailable. Keep it locally so the admin on this device can recover it.
    if (response.status >= 500) {
      const local = saveLocalBooking(payload, apiError(result, 'Server booking sedang bermasalah.'));
      local.offlineReason = String(result.error || local.offlineReason || '');
      return local;
    }
    throw apiError(result, 'Gagal mengirim booking.');
  }
  if (!result?.request) throw new Error('Server tidak mengembalikan data booking.');
  return {
    ...result.request,
    source: 'server',
    emailSent: Boolean(result.emailSent),
    emailNote: result.emailNote || '',
  };
}

function saveLocalBooking(payload, cause) {
  const now = new Date().toISOString();
  const request = {
    id: `local-${Date.now()}`,
    code: localCode(),
    status: 'pending',
    source: 'local',
    createdAt: now,
    updatedAt: now,
    ...payload,
  };
  const list = readLocal();
  list.unshift(request);
  writeLocal(list);
  request.offline = true;
  request.offlineReason = cause?.message || '';
  return request;
}

/** Load booking requests for the admin/owner panel. */
export async function fetchBookingRequests({ status = '' } = {}) {
  const local = readLocal().map((item) => ({ ...item, source: 'local' }));
  if (!hasApiAuth()) {
    return { requests: local, offline: true, reason: 'Belum masuk ke sistem.', promos: [] };
  }

  let response;
  try {
    response = await fetch(`/api/bookings${status ? `?status=${encodeURIComponent(status)}` : ''}`, {
      headers: getApiAuthHeaders({ Accept: 'application/json' }),
      cache: 'no-store',
    });
  } catch (error) {
    return { requests: local, offline: true, reason: error.message, promos: [] };
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return { requests: local, offline: true, reason: 'API booking tidak tersedia.', promos: [] };
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      requests: local,
      offline: true,
      reason: String(result.error || 'Gagal memuat booking online.'),
      promos: [],
    };
  }

  const server = (Array.isArray(result.requests) ? result.requests : []).map((item) => ({
    ...item,
    source: 'server',
  }));

  return {
    requests: [...local, ...server].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    ),
    offline: false,
    reason: '',
    promos: Array.isArray(result.promos) ? result.promos : [],
  };
}

export async function updateBookingRequest({ id, code, status, source }) {
  if (source === 'local' || String(code || '').startsWith('LOCAL-')) {
    const list = readLocal().map((item) =>
      String(item.id) === String(id)
        ? { ...item, status, updatedAt: new Date().toISOString() }
        : item,
    );
    writeLocal(list);
    return { ok: true };
  }

  if (!hasApiAuth()) throw new Error('Sesi login tidak valid. Silakan masuk kembali.');

  const response = await fetch('/api/bookings', {
    method: 'PATCH',
    headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, status }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API booking tidak tersedia.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw apiError(result, 'Gagal memperbarui booking.');
  return result;
}
