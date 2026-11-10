import { ensureCatalogSchema, query } from './_lib/db.js';
import { methodNotAllowed, sendJson } from './_lib/http.js';
import { normalizePublicState } from './_lib/state-normalize.js';

const STATE_ID = 'public';

function toNumber(value) {
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasCarAddon(addons = []) {
  return (Array.isArray(addons) ? addons : []).some(
    (addon) =>
      String(addon?.id) === 'car-parking' ||
      String(addon?.name || '').toLowerCase() === 'parkir mobil',
  );
}

function parkingStatus(state) {
  const capacity = Math.max(1, Math.floor(toNumber(state?.settings?.parkingCapacity)) || 15);
  let used = 0;
  for (const tenant of state?.tenants || []) {
    if (tenant.status === 'aktif' && hasCarAddon(tenant.addons)) used += 1;
  }
  for (const room of state?.rooms || []) {
    if (room.booking && hasCarAddon(room.booking.addons)) used += 1;
  }
  return {
    capacity,
    used,
    available: Math.max(0, capacity - used),
    full: used >= capacity,
    overbooked: used > capacity,
  };
}

/**
 * Public, privacy-safe availability summary derived from the shared state.
 * Only room numbers/statuses and aggregate counts are returned.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[availability] database error', error);
    return sendJson(res, 503, { error: 'Data ketersediaan belum siap.' });
  }

  try {
    const result = await query('select data, updated_at from casa_state where id = $1 limit 1', [
      STATE_ID,
    ]);

    // If the operational state has never been synced, fall back to the latest
    // published catalog so the landing page still reflects the admin's last
    // published room statuses instead of showing seed data.
    let source = 'state';
    let state = null;
    let updatedAt = null;

    if (result.rows.length) {
      const row = result.rows[0];
      state = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      updatedAt = row.updated_at || null;
    } else {
      const catalog = await query(
        'select data, updated_at from casa_catalog where id = $1 limit 1',
        [STATE_ID],
      );
      if (!catalog.rows.length) return sendJson(res, 200, { exists: false });
      const row = catalog.rows[0];
      state = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      updatedAt = row.updated_at || null;
      source = 'catalog';
    }

    state = normalizePublicState(state);

    const rooms = (Array.isArray(state?.rooms) ? state.rooms : [])
      .map((room) => ({
        id: room.id,
        nomor: room.nomor,
        lantai: room.lantai,
        tipe: room.tipe || (String(room.lantai) === '1' ? 'Deluxe VIP' : 'Deluxe'),
        status: room.status,
        dailyEnabled: room.dailyEnabled !== false,
        monthlyEnabled: room.monthlyEnabled !== false,
        priceDaily: toNumber(state?.pricing?.[room.lantai === '1' ? 'lantai1' : room.lantai === '3' ? 'lantai3' : 'lantai2']?.harian),
        priceMonthly: toNumber(state?.pricing?.[room.lantai === '1' ? 'lantai1' : room.lantai === '3' ? 'lantai3' : 'lantai2']?.['1']),
      }))
      .sort((a, b) => String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true }));

    return sendJson(res, 200, {
      exists: true,
      source,
      updatedAt,
      availability: {
        total: rooms.length,
        available: rooms.filter((room) => room.status === 'kosong').length,
        occupied: rooms.filter((room) => room.status === 'terisi').length,
        booked: rooms.filter((room) => room.status === 'booking').length,
        dailyAvailable: rooms.filter(
          (room) => room.status === 'kosong' && room.dailyEnabled,
        ).length,
        monthlyAvailable: rooms.filter(
          (room) => room.status === 'kosong' && room.monthlyEnabled,
        ).length,
      },
      parking: parkingStatus(state),
      pricing: {
        lantai1: { ...(state?.pricing?.lantai1 || {}) },
        lantai2: { ...(state?.pricing?.lantai2 || {}) },
        lantai3: { ...(state?.pricing?.lantai3 || {}) },
      },
      rooms,
    });
  } catch (error) {
    console.error('[availability] gagal membaca state', error);
    return sendJson(res, 500, { error: 'Gagal membaca ketersediaan kamar.' });
  }
}
