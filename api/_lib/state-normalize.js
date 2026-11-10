/**
 * Keep the shared state compatible with the latest public endpoints even
 * before an admin device has pushed its migrated local state.
 *
 * This is read-only normalization: callers use the returned object for a
 * response or validation and never persist it directly.
 */
export function normalizePublicState(input) {
  if (!input || typeof input !== 'object') return input;
  const state = input;

  state.settings = state.settings || {};
  if (!String(state.settings.notificationEmail || '').trim()) {
    state.settings.notificationEmail = 'casaramirejogja@gmail.com';
  }
  const parkingCapacity = Math.floor(Number(state.settings.parkingCapacity));
  state.settings.parkingCapacity =
    Number.isFinite(parkingCapacity) && parkingCapacity > 0 ? parkingCapacity : 15;
  delete state.settings.carDailyFee;
  if (!String(state.settings.bankName || '').trim()) {
    state.settings.bankName = 'Bank Mandiri';
  }
  if (!String(state.settings.bankAccountNumber || '').trim()) {
    state.settings.bankAccountNumber = '700013745877';
  }
  if (!String(state.settings.bankAccountName || '').trim()) {
    state.settings.bankAccountName = 'ERNY KURNIAWATI';
  }

  state.pricing = state.pricing || {};
  state.pricing.lantai1 = {
    harian: 250000,
    mingguan: 0,
    '1': 0,
    '3': 0,
    '6': 0,
    '12': 0,
    ...(state.pricing.lantai1 || {}),
  };
  state.pricing.lantai2 = state.pricing.lantai2 || {};
  state.pricing.lantai3 = state.pricing.lantai3 || {};

  state.rooms = Array.isArray(state.rooms) ? state.rooms : [];
  state.rooms = state.rooms.map((room) => {
    const floor = String(room.lantai || '2');
    return {
      ...room,
      lantai: floor,
      tipe: floor === '1' ? 'Deluxe VIP' : room.tipe || 'Deluxe',
      dailyEnabled: room.dailyEnabled !== false,
      monthlyEnabled: floor === '1' ? false : room.monthlyEnabled !== false,
      dailyCalendar:
        room.dailyCalendar &&
        typeof room.dailyCalendar === 'object' &&
        !Array.isArray(room.dailyCalendar)
          ? room.dailyCalendar
          : {},
    };
  });

  if (!state.rooms.some((room) => String(room.lantai) === '1')) {
    const id =
      state.rooms.reduce((max, room) => Math.max(max, Number(room.id) || 0), 0) + 1;
    state.rooms.push({
      id,
      nomor: '101',
      lantai: '1',
      tipe: 'Deluxe VIP',
      status: 'kosong',
      tenantId: null,
      booking: null,
      photo: '',
      photoUrl: '',
      dailyEnabled: true,
      monthlyEnabled: false,
      dailyCalendar: {},
    });
  }

  return state;
}
