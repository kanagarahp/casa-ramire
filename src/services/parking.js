import { getState } from '../core/store.js';
import { hasCarAddon } from './pricing.js';
import { getParkingCapacity } from './settings.js';

function sameId(a, b) {
  return a !== null && a !== undefined && String(a) === String(b);
}

/**
 * Cars currently using the parking area.
 *
 * A booking becomes a tenant at check-in, so counting bookings and active
 * tenants never double-counts the same guest. `exclude*` lets the edit form
 * ignore the record being edited.
 */
export function getCarParkingUsage({ excludeRoomId = null, excludeTenantId = null } = {}) {
  const state = getState();
  let used = 0;

  for (const tenant of state.tenants || []) {
    if (tenant.status !== 'aktif') continue;
    if (hasCarAddon(tenant.addons || [])) {
      if (excludeTenantId && sameId(tenant.id, excludeTenantId)) continue;
      used += 1;
    }
  }

  for (const room of state.rooms || []) {
    if (!room.booking) continue;
    if (!hasCarAddon(room.booking.addons || [])) continue;
    if (excludeRoomId && sameId(room.id, excludeRoomId)) continue;
    used += 1;
  }

  return used;
}

export function getCarParkingStatus(options = {}) {
  const capacity = getParkingCapacity();
  const used = getCarParkingUsage(options);
  const available = Math.max(0, capacity - used);
  return {
    capacity,
    used,
    available,
    full: used >= capacity,
    overbooked: used > capacity,
    percent: capacity ? Math.min(100, Math.round((used / capacity) * 100)) : 100,
  };
}

export function parkingFullMessage(options = {}) {
  const status = getCarParkingStatus(options);
  return `Parkir mobil penuh (${status.used}/${status.capacity}). Tamu tanpa mobil tetap dapat booking.`;
}
