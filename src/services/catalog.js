import { getState, update } from '../core/store.js';
import { getFacilities } from './settings.js';
import { getRate, syncPromoUsage } from './pricing.js';

const STATUS_LABEL = {
  kosong: 'Tersedia',
  booking: 'Booking',
  terisi: 'Terisi',
};

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function sortedRooms(rooms) {
  return [...rooms].sort((a, b) =>
    String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true }),
  );
}

export function buildCatalogSnapshot({ includeLocalPhotos = false } = {}) {
  const state = getState();
  const settings = state.settings || {};
  const rooms = sortedRooms(safeArray(state.rooms));
  const available = rooms.filter((room) => room.status === 'kosong').length;
  const occupied = rooms.filter((room) => room.status === 'terisi').length;
  const booked = rooms.filter((room) => room.status === 'booking').length;

  return {
    version: 2,
    generatedAt: new Date().toISOString(),
    property: {
      name: String(settings.propertyName || 'Casa Ramire').trim(),
      tagline: String(settings.tagline || '').trim(),
      description: String(settings.description || '').trim(),
      address: String(settings.address || '').trim(),
      whatsapp: String(settings.whatsapp || '').trim(),
      email: String(settings.email || '').trim(),
      mapsUrl: String(settings.mapsUrl || '').trim(),
      mapsEmbedUrl: String(settings.mapsEmbedUrl || '').trim(),
      facilities: getFacilities(),
      deposit: Number(settings.depositDefault) || 500000,
    },
    pricing: {
      lantai2: { ...(state.pricing?.lantai2 || {}) },
      lantai3: { ...(state.pricing?.lantai3 || {}) },
    },
    availability: {
      total: rooms.length,
      available,
      occupied,
      booked,
    },
    gallery: safeArray(state.gallery).map((item) => ({
      id: item.id,
      caption: String(item.caption || '').trim(),
      url: includeLocalPhotos ? item.photo || item.photoUrl || '' : item.photoUrl || '',
    })),
    promos: safeArray(state.promos)
      .filter((promo) => promo.active && promo.code)
      .map((promo) => ({
        code: String(promo.code || '').toUpperCase(),
        name: String(promo.name || ''),
        type: promo.type === 'persen' ? 'persen' : 'rupiah',
        value: Number(promo.value) || 0,
        maxUses: Math.max(0, Number(promo.maxUses) || 0),
        usedCount: Math.max(0, Number(promo.usedCount) || 0),
      })),
    rooms: rooms.map((room) => ({
      id: room.id,
      nomor: room.nomor,
      lantai: room.lantai,
      status: room.status,
      statusLabel: STATUS_LABEL[room.status] || 'Tersedia',
      priceMonthly: getRate(room.lantai, '1'),
    })),
  };
}

async function uploadCatalogPhoto(adminKey, dataUrl) {
  const response = await fetch('/api/catalog/photo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ dataUrl }),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : {};
  if (!response.ok || !contentType.includes('application/json') || !payload.url) {
    throw new Error(
      payload.error ||
        'Gagal mengunggah foto katalog. Pastikan API berjalan di production atau `vercel dev`.',
    );
  }

  return payload.url;
}

/**
 * Upload every local room photo that has not been published yet, then publish
 * a clean snapshot of the catalog to the public API.
 */
export async function publishCatalog({ adminKey, onProgress } = {}) {
  const key = String(adminKey || '').trim();
  if (!key) {
    throw new Error('Kunci publikasi katalog belum diisi di Pengaturan.');
  }

  const state = getState();
  const pending = [
    ...state.rooms
      .filter((room) => typeof room.photo === 'string' && room.photo.startsWith('data:image/'))
      .map((room) => ({
        kind: 'room',
        id: room.id,
        photo: room.photo,
        label: `Mengunggah foto kamar ${room.nomor}…`,
      })),
    ...(state.gallery || [])
      .filter((item) => typeof item.photo === 'string' && item.photo.startsWith('data:image/'))
      .map((item, index) => ({
        kind: 'gallery',
        id: item.id,
        photo: item.photo,
        label: `Mengunggah foto galeri ${index + 1}…`,
      })),
  ];

  const uploaded = [];
  let index = 0;

  for (const item of pending) {
    index += 1;
    onProgress?.({
      current: index,
      total: pending.length,
      label: item.label,
    });
    const url = await uploadCatalogPhoto(key, item.photo);
    uploaded.push({ ...item, url });
  }

  if (uploaded.length) {
    update((draft) => {
      for (const item of uploaded) {
        if (item.kind === 'gallery') {
          const entry = (draft.gallery || []).find(
            (photo) => String(photo.id) === String(item.id),
          );
          if (entry) {
            entry.photoUrl = item.url;
            // Keep the browser quota healthy: the public URL is now the
            // single source of truth for published gallery photos.
            entry.photo = '';
          }
          continue;
        }
        const room = draft.rooms.find((entry) => String(entry.id) === String(item.id));
        if (room) {
          room.photoUrl = item.url;
          room.photo = '';
        }
      }
    });
  }

  onProgress?.({ current: pending.length, total: pending.length, label: 'Menyimpan katalog…' });

  const catalog = buildCatalogSnapshot();
  const response = await fetch('/api/catalog', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': key,
    },
    body: JSON.stringify({ catalog }),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : {};
  if (!response.ok || !contentType.includes('application/json')) {
    throw new Error(
      payload.error ||
        'Gagal mempublikasikan katalog. Pastikan API berjalan di production atau `vercel dev`.',
    );
  }

  const updatedAt = payload.updatedAt || new Date().toISOString();
  if (Array.isArray(payload.promos) && payload.promos.length) {
    syncPromoUsage(payload.promos);
  }
  update((draft) => {
    draft.settings = draft.settings || {};
    draft.settings.catalogPublishedAt = updatedAt;
  });

  return { updatedAt, uploadedPhotos: uploaded.length };
}

export async function fetchPublishedCatalog() {
  const response = await fetch('/api/catalog', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.includes('application/json')) {
    // `vite dev` does not run the serverless functions. Fall back to local
    // data instead of trying to parse an HTML/module response as JSON.
    return null;
  }

  const payload = await response.json();
  if (!payload?.published || !payload.catalog) return null;
  return payload.catalog;
}

/**
 * Live room counts from the shared state, independent of the published
 * catalog snapshot. Returns null when the API is unavailable.
 */
export async function fetchLiveAvailability() {
  try {
    const response = await fetch('/api/availability', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) return null;

    const payload = await response.json().catch(() => null);
    if (!payload?.exists || !payload.availability) return null;
    return {
      availability: payload.availability,
      rooms: Array.isArray(payload.rooms) ? payload.rooms : [],
    };
  } catch {
    return null;
  }
}
