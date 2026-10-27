import { getState, update } from '../core/store.js';
import { getFacilities } from './settings.js';
import { getRate } from './pricing.js';

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

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    property: {
      name: String(settings.propertyName || 'Casa Ramire').trim(),
      tagline: String(settings.tagline || '').trim(),
      description: String(settings.description || '').trim(),
      address: String(settings.address || '').trim(),
      whatsapp: String(settings.whatsapp || '').trim(),
      mapsUrl: String(settings.mapsUrl || '').trim(),
      facilities: getFacilities(),
      deposit: Number(settings.depositDefault) || 500000,
    },
    pricing: {
      lantai2: { ...(state.pricing?.lantai2 || {}) },
      lantai3: { ...(state.pricing?.lantai3 || {}) },
    },
    rooms: sortedRooms(safeArray(state.rooms)).map((room) => ({
      id: room.id,
      nomor: room.nomor,
      lantai: room.lantai,
      status: room.status,
      statusLabel: STATUS_LABEL[room.status] || 'Tersedia',
      photo: includeLocalPhotos
        ? room.photo || room.photoUrl || ''
        : room.photoUrl || '',
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

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.url) {
    throw new Error(payload.error || 'Gagal mengunggah foto katalog.');
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
  const pending = state.rooms.filter(
    (room) => typeof room.photo === 'string' && room.photo.startsWith('data:image/'),
  );

  const uploaded = [];
  let index = 0;

  for (const room of pending) {
    index += 1;
    onProgress?.({
      current: index,
      total: pending.length,
      label: `Mengunggah foto kamar ${room.nomor}…`,
    });
    const url = await uploadCatalogPhoto(key, room.photo);
    uploaded.push({ roomId: room.id, url });
  }

  if (uploaded.length) {
    update((draft) => {
      for (const item of uploaded) {
        const room = draft.rooms.find((entry) => String(entry.id) === String(item.roomId));
        if (room) {
          room.photoUrl = item.url;
          // The public URL is now the single source of truth. Keeping the
          // base64 copy would quickly fill the browser storage quota.
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

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Gagal mempublikasikan katalog.');
  }

  const updatedAt = payload.updatedAt || new Date().toISOString();
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

  if (!response.ok) {
    throw new Error('Katalog publik belum dapat dimuat.');
  }

  const payload = await response.json();
  if (!payload?.published || !payload.catalog) return null;
  return payload.catalog;
}
