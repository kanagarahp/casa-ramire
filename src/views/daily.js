import { rupiah } from '../core/format.js';
import { getState } from '../core/store.js';
import { isOwner } from '../services/auth.js';
import {
  getDailyRooms,
  getDailySummary,
  isShortPeriod,
  roomType,
  setRoomDailyEnabled,
} from '../services/daily.js';
import { getCarParkingStatus } from '../services/parking.js';
import { getRate } from '../services/pricing.js';
import { cancelBooking, getTenant } from '../services/property.js';
import { getCarDailyFee, getParkingCapacity, updateSettings } from '../services/settings.js';
import { statusBadge, emptyState, pageHeader, statCard } from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import {
  openBookingModal,
  openCheckinFlow,
  openCheckoutModal,
  openExtendModal,
  openMoveBookingModal,
} from './booking-modal.js';
import { openTenantDetail } from './tenant-detail.js';

function dailyPrice(room) {
  return getRate(room.lantai, 'harian');
}

function tenantOf(room) {
  return room.tenantId ? getTenant(room.tenantId) : null;
}

function actionsFor(room) {
  if (room.status === 'kosong') {
    return `
      <button type="button" class="btn-primary btn-xs" data-action="booking" data-id="${room.id}">${icon('CalendarClock', 'w-3 h-3')} Booking Harian</button>
      <button type="button" class="btn-outline btn-xs" data-action="checkin" data-id="${room.id}">${icon('LogIn', 'w-3 h-3')} Check-in</button>
    `;
  }
  if (room.status === 'booking') {
    return `
      <button type="button" class="btn-primary btn-xs" data-action="checkin-flow" data-id="${room.id}">${icon('LogIn', 'w-3 h-3')} Check-in</button>
      <button type="button" class="btn-outline btn-xs" data-action="edit" data-id="${room.id}">${icon('Pencil', 'w-3 h-3')} Edit</button>
      <button type="button" class="btn-outline btn-xs" data-action="move" data-id="${room.id}">${icon('Repeat', 'w-3 h-3')} Pindah</button>
      <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="cancel" data-id="${room.id}" title="Batalkan booking">${icon('X', 'w-3.5 h-3.5')}</button>
    `;
  }
  const tenant = tenantOf(room);
  if (!tenant || !isShortPeriod(tenant.periode)) {
    return `<span class="badge-gray">Terisi bulanan — tidak tersedia harian</span>`;
  }
  return `
    <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${room.tenantId}">${icon('UserRound', 'w-3 h-3')} Detail</button>
    <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${room.tenantId}">${icon('Repeat', 'w-3 h-3')} Perpanjang</button>
    <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${room.tenantId}" title="Check-out">${icon('DoorOpen', 'w-3.5 h-3.5')}</button>
  `;
}

function cardHtml(room) {
  const tenant = tenantOf(room);
  const booking = room.booking;
  const name = tenant?.name || booking?.name || '';
  return `
    <div class="card rounded-2xl p-4 flex flex-col gap-3">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold-700">${esc(roomType(room))} · Lantai ${esc(room.lantai)}</p>
          <h3 class="text-xl font-black text-stone-800 mt-0.5">Kamar ${esc(room.nomor)}</h3>
        </div>
        ${statusBadge(room.status)}
      </div>
      <div class="rounded-xl border border-line bg-cream/60 px-3 py-2.5 text-xs space-y-1">
        <div class="flex justify-between gap-2"><span class="text-stone-500">Tarif harian</span><b class="text-stone-800">${rupiah(dailyPrice(room))}</b></div>
        ${name ? `<div class="flex justify-between gap-2"><span class="text-stone-500">${room.status === 'terisi' ? 'Penghuni' : 'Tamu'}</span><b class="text-stone-800 text-right">${esc(name)}</b></div>` : ''}
        ${
          booking
            ? `<div class="flex justify-between gap-2"><span class="text-stone-500">Periode</span><b class="text-stone-800 text-right">${esc(booking.startDate)} — ${esc(booking.endDate)}</b></div>`
            : ''
        }
      </div>
      <div class="flex flex-wrap justify-end gap-1.5 mt-auto">${actionsFor(room)}</div>
    </div>
  `;
}

export function render(root) {
  const summary = getDailySummary();
  const parking = getCarParkingStatus();
  const rooms = getDailyRooms();

  root.innerHTML = `
    <div data-view="daily" class="animate-in">
      ${pageHeader({
        eyebrow: 'Daily Stays',
        title: 'Booking Harian 📅',
        subtitle: 'Kamar Deluxe VIP lantai 1 dan kamar bulanan kosong yang bisa disewakan harian.',
        actions: `
          ${isOwner() ? `<button type="button" class="btn-outline btn-sm" data-action="availability">${icon('SlidersHorizontal', 'w-4 h-4')} Atur Ketersediaan</button>` : ''}
          <button type="button" class="btn-primary btn-sm" data-action="parking">${icon('Car', 'w-4 h-4')} Parkir ${parking.used}/${parking.capacity}</button>
        `,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        ${statCard({ label: 'Kamar Harian Tersedia', value: summary.available, iconName: 'DoorOpen', tone: summary.available ? 'green' : 'amber' })}
        ${statCard({ label: 'Booking Harian', value: summary.booked, iconName: 'CalendarClock', tone: 'amber' })}
        ${statCard({ label: 'Terisi Harian', value: summary.occupied, iconName: 'UserCheck', tone: 'brand' })}
        ${statCard({ label: 'Parkir Mobil', value: `${parking.used}/${parking.capacity}`, iconName: 'Car', tone: parking.full ? 'rose' : 'green', hint: parking.full ? 'Penuh — admin masih bisa overbook' : `${parking.available} slot tersisa` })}
      </div>

      ${
        parking.full
          ? `<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 mb-4 text-xs text-rose-900 flex items-start gap-2">
              ${icon('AlertTriangle', 'w-4 h-4 shrink-0 mt-0.5')}
              <span><b>Parkir mobil penuh (${parking.used}/${parking.capacity}).</b> Booking online tidak dapat menambahkan parkir mobil. Admin/owner tetap bisa menambahkan (overbook).</span>
            </div>`
          : ''
      }

      <div class="rounded-2xl border border-line bg-white p-4 mb-5 text-xs text-stone-600 leading-relaxed">
        Kamar yang sudah terisi bulanan otomatis tidak bisa dibooking harian. Setelah tamu harian check-out, kamar kembali tersedia untuk harian maupun bulanan.
      </div>

      <div id="daily-rooms" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        ${
          rooms.length
            ? rooms
                .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }))
                .map(cardHtml)
                .join('')
            : emptyState({
                iconName: 'CalendarDays',
                title: 'Belum ada kamar harian',
                description: 'Aktifkan ketersediaan harian dari tombol Atur Ketersediaan.',
              })
        }
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="daily"]');

  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    const room = rooms.find((item) => Number(item.id) === id);

    if (action === 'availability') {
      openAvailabilityModal();
      return;
    }
    if (action === 'parking') {
      openParkingModal();
      return;
    }
    if (!room && !['detail', 'extend', 'checkout'].includes(action)) return;

    if (action === 'booking') openBookingModal(room.id, 'booking');
    if (action === 'checkin') openBookingModal(room.id, 'checkin');
    if (action === 'checkin-flow') openCheckinFlow(room.id);
    if (action === 'edit') openBookingModal(room.id, 'edit_booking');
    if (action === 'move') openMoveBookingModal(room.id);
    if (action === 'detail') openTenantDetail(id);
    if (action === 'extend') openExtendModal(id);
    if (action === 'checkout') openCheckoutModal(id);

    if (action === 'cancel') {
      const approved = await confirmAction({
        title: 'Batalkan booking harian?',
        message: `Booking kamar <b>${esc(room.nomor)}</b>${room.booking ? ` oleh <b>${esc(room.booking.name)}</b>` : ''} akan dibatalkan.`,
        confirmText: 'Ya, batalkan',
        danger: true,
      });
      if (!approved) return;
      try {
        cancelBooking(room.id);
        toast('Booking harian dibatalkan.');
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  });
}

function openAvailabilityModal() {
  if (!isOwner()) {
    toast('Atur ketersediaan hanya dapat dilakukan owner.', 'warning');
    return;
  }
  const rooms = getState().rooms
    .filter((room) => String(room.lantai) !== '1')
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));

  openModal({
    title: 'Atur Ketersediaan Harian',
    subtitle: 'Aktifkan kamar bulanan yang boleh dipakai untuk tamu harian saat kosong.',
    size: 'lg',
    body: `
      <div class="space-y-3">
        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900 leading-relaxed">
          Kamar 101 (Deluxe VIP lantai 1) selalu aktif untuk harian. Kamar lantai 2 & 3 hanya bisa dipakai harian jika dicentang dan sedang kosong.
        </div>
        <div class="grid sm:grid-cols-2 gap-2">
          ${rooms
            .map(
              (room) => `
              <label class="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 py-2.5 cursor-pointer hover:bg-stone-50">
                <span class="text-xs font-bold text-stone-700">Kamar ${esc(room.nomor)} · Lantai ${esc(room.lantai)}</span>
                <input type="checkbox" class="w-4 h-4 accent-brand" data-room-daily="${room.id}" ${room.dailyEnabled !== false ? 'checked' : ''} />
              </label>`,
            )
            .join('')}
        </div>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save-availability>${icon('Check', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('[data-save-availability]')?.addEventListener('click', () => {
        try {
          el.querySelectorAll('[data-room-daily]').forEach((input) => {
            setRoomDailyEnabled(Number(input.dataset.roomDaily), input.checked);
          });
          toast('Ketersediaan harian berhasil diperbarui.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function openParkingModal() {
  const parking = getCarParkingStatus();
  const owner = isOwner();

  openModal({
    title: 'Parkir Mobil',
    subtitle: `${parking.used} terpakai dari ${parking.capacity} slot`,
    size: 'sm',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border ${parking.full ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'} p-4">
          <p class="text-2xl font-black ${parking.full ? 'text-rose-800' : 'text-emerald-800'}">${parking.used}/${parking.capacity}</p>
          <p class="text-[11px] ${parking.full ? 'text-rose-700' : 'text-emerald-700'} mt-1">${parking.full ? 'Penuh. Booking online tidak dapat menambah parkir mobil.' : `${parking.available} slot masih tersedia.`}</p>
        </div>
        ${
          owner
            ? `
            <form id="parking-form" class="space-y-3">
              <div>
                <label class="label" for="pk-capacity">Kapasitas maksimal mobil</label>
                <input id="pk-capacity" type="number" min="1" step="1" class="input" value="${getParkingCapacity()}" />
              </div>
              <div>
                <label class="label" for="pk-daily">Tarif parkir harian (Rp/hari)</label>
                <input id="pk-daily" type="number" min="0" step="1000" class="input" value="${getCarDailyFee()}" />
              </div>
              <p class="hint">Perubahan ini juga dipakai pada estimasi booking online.</p>
            </form>`
            : `<p class="hint">Hubungi owner untuk mengubah kapasitas parkir.</p>`
        }
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      ${owner ? `<button type="button" class="btn-primary btn-sm" data-save-parking>${icon('Check', 'w-4 h-4')} Simpan</button>` : ''}
    `,
    onMount(el, close) {
      el.querySelector('[data-save-parking]')?.addEventListener('click', () => {
        try {
          updateSettings({
            parkingCapacity: el.querySelector('#pk-capacity').value,
            carDailyFee: el.querySelector('#pk-daily').value,
          });
          toast('Pengaturan parkir disimpan.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
