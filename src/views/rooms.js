import { getRates } from '../services/pricing.js';
import {
  addRoom,
  cancelBooking,
  deleteRoom,
  getRooms,
  getTenants,
  updateRoomPhoto,
} from '../services/property.js';
import { isOwner } from '../services/auth.js';
import { storage } from '../core/storage.js';
import { rupiah } from '../core/format.js';
import {
  avatar,
  emptyState,
  pageHeader,
  statusBadge,
} from '../ui/components.js';
import { delegate, esc, readImageAsDataUrl, setBusy } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import {
  openBookingModal,
  openCheckinFlow,
  openCheckoutModal,
  openExtendModal,
} from './booking-modal.js';
import { openTenantDetail } from './tenant-detail.js';

let floorFilter = 'all';
let statusFilter = 'all';
let searchTerm = '';
let viewMode = storage.getRaw('casa-ramire:room-view') || 'grid';

const STATUS_ACCENT = {
  kosong: 'border-t-amber-400',
  booking: 'border-t-indigo-400',
  terisi: 'border-t-emerald-500',
};

function syncFilterButtons(scope) {
  scope.querySelectorAll('[data-floor]').forEach((button) => {
    button.className = button.dataset.floor === floorFilter ? 'chip-active' : 'chip-idle';
  });
  scope.querySelectorAll('[data-status]').forEach((button) => {
    button.className = button.dataset.status === statusFilter ? 'chip-active' : 'chip-idle';
  });
  scope.querySelectorAll('[data-viewmode]').forEach((button) => {
    const active = button.dataset.viewmode === viewMode;
    button.className = `p-2 rounded-lg transition ${active ? 'bg-brand text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`;
  });
}

function roomRate(room) {
  const rates = getRates(room.lantai);
  return rupiah(rates['1'] || 0);
}

function photoAction(room) {
  return `<button type="button" class="btn-ghost btn-xs ${room.photo || room.photoUrl ? 'text-brand' : 'text-stone-600'}" data-action="photo" data-id="${room.id}" title="Unggah / ganti foto kamar">${icon('Camera', 'w-3.5 h-3.5')} ${room.photo || room.photoUrl ? 'Foto' : 'Tambah foto'}</button>`;
}

function actionsFor(room) {
  if (room.status === 'kosong') {
    return `
      ${photoAction(room)}
      <button type="button" class="btn-outline btn-xs" data-action="booking" data-id="${room.id}">${icon('CalendarClock', 'w-3 h-3')} Booking</button>
      <button type="button" class="btn-primary btn-xs" data-action="checkin" data-id="${room.id}">${icon('LogIn', 'w-3 h-3')} Check-in</button>
      ${
        isOwner()
          ? `<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-room" data-id="${room.id}" title="Hapus kamar">${icon('Trash2', 'w-3.5 h-3.5')}</button>`
          : ''
      }
    `;
  }
  if (room.status === 'booking') {
    return `
      ${photoAction(room)}
      <button type="button" class="btn-primary btn-xs" data-action="checkin" data-id="${room.id}">${icon('LogIn', 'w-3 h-3')} Check-in</button>
      <button type="button" class="btn-outline btn-xs" data-action="edit-booking" data-id="${room.id}">${icon('Pencil', 'w-3 h-3')} Edit</button>
      <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="cancel-booking" data-id="${room.id}" title="Batalkan booking">${icon('X', 'w-3.5 h-3.5')}</button>
    `;
  }
  return `
    ${photoAction(room)}
    <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${room.id}">${icon('UserRound', 'w-3 h-3')} Detail</button>
    <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${room.id}">${icon('Repeat', 'w-3 h-3')} Perpanjang</button>
    <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${room.id}" title="Check-out">${icon('DoorOpen', 'w-3.5 h-3.5')}</button>
  `;
}

function occupantHtml(room, tenant) {
  if (room.status === 'terisi' && tenant) {
    return `
      <button type="button" class="flex items-center gap-2 hover:text-brand text-left min-w-0" data-action="detail" data-id="${room.id}">
        ${avatar(tenant.name, 'w-7 h-7 text-[9px]')}
        <span class="min-w-0">
          <span class="block text-xs font-bold text-stone-800 truncate">${esc(tenant.name)}</span>
          <span class="block text-[10px] text-stone-600">Penghuni aktif</span>
        </span>
      </button>`;
  }
  if (room.status === 'booking' && room.booking) {
    return `
      <button type="button" class="flex items-center gap-2 hover:text-brand text-left min-w-0" data-action="edit-booking" data-id="${room.id}">
        ${avatar(room.booking.name, 'w-7 h-7 text-[9px] bg-indigo-600')}
        <span class="min-w-0">
          <span class="block text-xs font-bold text-stone-800 truncate">${esc(room.booking.name)}</span>
          <span class="block text-[10px] text-indigo-500">Calon penghuni</span>
        </span>
      </button>`;
  }
  return `<span class="text-xs text-stone-600 italic">Siap dihuni</span>`;
}

function gridHtml(rooms, tenantsById) {
  if (!rooms.length) {
    return emptyState({
      iconName: 'SearchX',
      title: 'Kamar tidak ditemukan',
      description: 'Coba ubah filter lantai/status atau kata kunci pencarian.',
    });
  }

  return `<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    ${rooms
      .map((room) => {
        const tenant = room.tenantId ? tenantsById.get(String(room.tenantId)) : null;
        return `
          <div class="card border-t-4 ${STATUS_ACCENT[room.status] || 'border-t-stone-300'} p-5 rounded-2xl card-hover flex flex-col">
            <div class="flex items-center justify-between gap-2 mb-2">
              ${statusBadge(room.status)}
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-600">Lantai ${esc(room.lantai)}</span>
            </div>
            ${
              room.photo || room.photoUrl
                ? `<img src="${esc(room.photo || room.photoUrl)}" alt="Foto kamar ${esc(room.nomor)}" loading="lazy" class="w-full h-32 object-cover rounded-xl border border-line-soft mb-3" />`
                : `<div class="w-full h-24 rounded-xl border border-dashed border-line bg-gradient-to-br from-brand-50 via-cream to-gold-50 mb-3 flex flex-col items-center justify-center gap-1 text-stone-400">
                    ${icon('Image', 'w-6 h-6')}
                    <span class="text-[10px] font-bold uppercase tracking-wider">Belum ada foto</span>
                  </div>`
            }
            <div class="flex items-end justify-between gap-2">
              <div>
                <h2 class="text-2xl font-black text-stone-800 leading-none">Kamar ${esc(room.nomor)}</h2>
                <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-1">Deluxe</p>
              </div>
              <div class="text-right">
                <p class="text-[9px] text-stone-600 font-bold uppercase tracking-wider">Tarif / bulan</p>
                <p class="text-sm font-black text-stone-700">${roomRate(room)}</p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-line-soft flex-1">
              ${occupantHtml(room, tenant)}
            </div>
            <div class="mt-3 flex flex-wrap justify-end gap-1.5">${actionsFor(room)}</div>
          </div>`;
      })
      .join('')}
  </div>`;
}

function listHtml(rooms, tenantsById) {
  if (!rooms.length) {
    return `<div class="card">${emptyState({
      iconName: 'SearchX',
      title: 'Kamar tidak ditemukan',
      description: 'Coba ubah filter lantai/status atau kata kunci pencarian.',
    })}</div>`;
  }

  return `
    <div class="card overflow-hidden">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Kamar</th><th>Lantai</th><th>Status</th><th>Penghuni</th><th>Tarif / bulan</th><th class="text-right">Aksi</th></tr></thead>
          <tbody>
            ${rooms
              .map((room) => {
                const tenant = room.tenantId ? tenantsById.get(String(room.tenantId)) : null;
                return `
                  <tr>
                    <td class="font-black text-stone-800">
                      <div class="flex items-center gap-2">
                        ${
                          room.photo || room.photoUrl
                            ? `<img src="${esc(room.photo || room.photoUrl)}" alt="Foto kamar ${esc(room.nomor)}" loading="lazy" class="w-10 h-10 rounded-lg object-cover border border-line-soft shrink-0" />`
                            : `<span class="w-10 h-10 rounded-lg border border-dashed border-line bg-cream text-stone-400 flex items-center justify-center shrink-0">${icon('Image', 'w-4 h-4')}</span>`
                        }
                        <span>Kamar ${esc(room.nomor)}</span>
                      </div>
                    </td>
                    <td>Lantai ${esc(room.lantai)}</td>
                    <td>${statusBadge(room.status)}</td>
                    <td>${occupantHtml(room, tenant)}</td>
                    <td class="font-bold whitespace-nowrap">${roomRate(room)}</td>
                    <td><div class="flex flex-wrap justify-end gap-1.5">${actionsFor(room)}</div></td>
                  </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

export function render(root) {
  const allRooms = getRooms();

  const counts = {
    all: allRooms.length,
    '2': allRooms.filter((room) => room.lantai === '2').length,
    '3': allRooms.filter((room) => room.lantai === '3').length,
    kosong: allRooms.filter((room) => room.status === 'kosong').length,
    booking: allRooms.filter((room) => room.status === 'booking').length,
    terisi: allRooms.filter((room) => room.status === 'terisi').length,
  };

  root.innerHTML = `
    <div data-view="rooms" class="animate-in">
      ${pageHeader({
        eyebrow: 'Inventaris Kamar',
        title: 'Status & Manajemen Kamar 🏢',
        subtitle: `Kelola ${allRooms.length} kamar di lantai 2 dan 3. Filter, cari, dan proses check-in dari satu tempat.`,
        actions: `
          <button type="button" class="btn-primary btn-sm" data-action="add-room">${icon('Plus', 'w-4 h-4')} Tambah Kamar</button>
        `,
      })}

      <div class="card p-3 mb-5 flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="chip-active" data-floor="all">Semua (${counts.all})</button>
          <button type="button" class="chip-idle" data-floor="2">Lantai 2 (${counts['2']})</button>
          <button type="button" class="chip-idle" data-floor="3">Lantai 3 (${counts['3']})</button>
          <div class="hidden sm:block w-px h-6 bg-line mx-1"></div>
          <button type="button" class="chip-idle" data-status="all">Semua status</button>
          <button type="button" class="chip-idle" data-status="kosong">Kosong (${counts.kosong})</button>
          <button type="button" class="chip-idle" data-status="booking">Booking (${counts.booking})</button>
          <button type="button" class="chip-idle" data-status="terisi">Terisi (${counts.terisi})</button>

          <div class="ml-auto flex items-center gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-56">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">${icon('Search', 'w-3.5 h-3.5')}</span>
              <input id="room-search" type="search" class="input input-sm pl-8" placeholder="Cari kamar / penghuni…" value="${esc(searchTerm)}" />
            </div>
            <div class="flex bg-stone-100 rounded-xl p-1 shrink-0">
              <button type="button" class="p-2 rounded-lg" data-viewmode="grid" title="Tampilan grid" aria-label="Tampilan grid">${icon('LayoutGrid', 'w-4 h-4')}</button>
              <button type="button" class="p-2 rounded-lg" data-viewmode="list" title="Tampilan daftar" aria-label="Tampilan daftar">${icon('List', 'w-4 h-4')}</button>
            </div>
          </div>
        </div>
      </div>

      <div id="rooms-content"></div>

      <div class="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-stone-600">
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Terisi</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Booking</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Kosong</span>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="rooms"]');
  const content = scope.querySelector('#rooms-content');
  const searchInput = scope.querySelector('#room-search');

  const sync = () => syncFilterButtons(scope);

  const paint = () => {
    const tenants = getTenants();
    const tenantsById = new Map(tenants.map((tenant) => [String(tenant.id), tenant]));
    const term = searchTerm.trim().toLowerCase();

    const filtered = allRooms
      .filter((room) => (floorFilter === 'all' ? true : room.lantai === floorFilter))
      .filter((room) => (statusFilter === 'all' ? true : room.status === statusFilter))
      .filter((room) => {
        if (!term) return true;
        const tenant = room.tenantId ? tenantsById.get(String(room.tenantId)) : null;
        return [room.nomor, room.lantai, room.booking?.name || '', tenant?.name || '']
          .join(' ')
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));

    content.innerHTML = viewMode === 'grid' ? gridHtml(filtered, tenantsById) : listHtml(filtered, tenantsById);
  };

  sync();
  paint();

  scope.querySelectorAll('[data-floor]').forEach((button) => {
    button.addEventListener('click', () => {
      floorFilter = button.dataset.floor;
      sync();
      paint();
    });
  });

  scope.querySelectorAll('[data-status]').forEach((button) => {
    button.addEventListener('click', () => {
      statusFilter = button.dataset.status;
      sync();
      paint();
    });
  });

  scope.querySelectorAll('[data-viewmode]').forEach((button) => {
    button.addEventListener('click', () => {
      viewMode = button.dataset.viewmode;
      storage.setRaw('casa-ramire:room-view', viewMode);
      sync();
      paint();
    });
  });

  searchInput?.addEventListener('input', () => {
    searchTerm = searchInput.value;
    paint();
  });

  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    const room = allRooms.find((item) => item.id === id);

    if (action === 'add-room') {
      openAddRoomModal();
      return;
    }
    if (!room) return;

    if (action === 'photo') openRoomPhotoModal(room.id);
    if (action === 'booking') openBookingModal(room.id, 'booking');
    if (action === 'checkin') {
      if (room.status === 'booking') openCheckinFlow(room.id);
      else openBookingModal(room.id, 'checkin');
    }
    if (action === 'edit-booking') openBookingModal(room.id, 'edit_booking');
    if (action === 'detail' && room.tenantId) openTenantDetail(room.tenantId);
    if (action === 'extend' && room.tenantId) openExtendModal(room.tenantId);
    if (action === 'checkout' && room.tenantId) openCheckoutModal(room.tenantId);
    if (action === 'cancel-booking') {
      const approved = await confirmAction({
        title: 'Batalkan booking?',
        message: `Booking kamar <b>${esc(room.nomor)}</b>${room.booking ? ` oleh <b>${esc(room.booking.name)}</b>` : ''} akan dibatalkan dan kamar kembali kosong.`,
        confirmText: 'Ya, batalkan',
        danger: true,
      });
      if (!approved) return;
      try {
        cancelBooking(room.id);
        toast('Booking berhasil dibatalkan.');
      } catch (error) {
        toast(error.message, 'error');
      }
    }
    if (action === 'delete-room') {
      const approved = await confirmAction({
        title: 'Hapus kamar?',
        message: `Kamar <b>${esc(room.nomor)}</b> akan dihapus dari inventaris.`,
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      try {
        deleteRoom(room.id);
        toast('Kamar berhasil dihapus.');
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  });
}

function openAddRoomModal() {
  openModal({
    title: 'Tambah Kamar Baru',
    subtitle: 'Kamar akan langsung tersedia di inventaris.',
    size: 'sm',
    body: `
      <form id="room-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="nr-number">Nomor kamar</label>
          <input id="nr-number" type="text" inputmode="numeric" class="input" placeholder="cth: 222" />
        </div>
        <div>
          <label class="label" for="nr-floor">Lantai</label>
          <select id="nr-floor" class="select">
            <option value="2">Lantai 2</option>
            <option value="3">Lantai 3</option>
          </select>
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="room-form" class="btn-primary btn-sm" data-submit>${icon('Plus', 'w-4 h-4')} Simpan kamar</button>
    `,
    onMount(el, close) {
      el.querySelector('#room-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          addRoom({
            nomor: el.querySelector('#nr-number').value,
            lantai: el.querySelector('#nr-floor').value,
          });
          toast('Kamar baru berhasil ditambahkan.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function openRoomPhotoModal(roomId) {
  const room = getRooms().find((item) => String(item.id) === String(roomId));
  if (!room) return;

  const existing = room.photo || room.photoUrl || '';
  let selectedPhoto = null;

  openModal({
    title: `Foto Kamar ${room.nomor}`,
    subtitle: 'Foto ini tampil di landing page / katalog publik.',
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-3">
          <div id="rp-preview-wrap" class="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-line flex items-center justify-center">
            ${
              existing
                ? `<img id="rp-preview" src="${esc(existing)}" alt="Foto kamar ${esc(room.nomor)}" class="w-full h-full object-cover" />`
                : `<div id="rp-preview" class="flex flex-col items-center justify-center gap-2 text-stone-400">
                    ${icon('Image', 'w-10 h-10')}
                    <span class="text-xs font-bold">Belum ada foto</span>
                  </div>`
            }
          </div>
        </div>

        <div>
          <label class="label" for="rp-file">Pilih foto kamar</label>
          <input id="rp-file" type="file" accept="image/jpeg,image/png,image/webp" class="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold" />
          <p class="hint mt-1.5">JPG/PNG/WebP. Foto otomatis dikompres agar ringan dan cepat dibuka.</p>
        </div>

        <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-800 leading-relaxed">
          Setelah foto diunggah, buka <b>Pengaturan ? Landing page &amp; katalog</b> lalu klik <b>Publikasikan katalog</b> agar foto terlihat oleh pengunjung casaramire.com.
        </div>
      </div>
    `,
    footer: `
      ${existing ? `<button type="button" class="btn-ghost btn-sm text-rose-600" data-remove-photo>${icon('Trash2', 'w-4 h-4')} Hapus foto</button>` : ''}
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save-photo>${icon('Check', 'w-4 h-4')} Simpan foto</button>
    `,
    onMount(el, close) {
      const fileInput = el.querySelector('#rp-file');
      const previewWrap = el.querySelector('#rp-preview-wrap');
      const saveButton = el.querySelector('[data-save-photo]');

      const paintPreview = (src) => {
        if (src) {
          previewWrap.innerHTML = `<img src="${esc(src)}" alt="Pratinjau foto kamar ${esc(room.nomor)}" class="w-full h-full object-cover" />`;
        } else {
          previewWrap.innerHTML = `<div class="flex flex-col items-center justify-center gap-2 text-stone-400">
            ${icon('Image', 'w-10 h-10')}
            <span class="text-xs font-bold">Belum ada foto</span>
          </div>`;
        }
      };

      fileInput?.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        setBusy(saveButton, true, 'Mengompres foto…');
        try {
          selectedPhoto = await readImageAsDataUrl(file);
          paintPreview(selectedPhoto);
          toast('Foto siap disimpan.');
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(saveButton, false);
        }
      });

      el.querySelector('[data-remove-photo]')?.addEventListener('click', () => {
        selectedPhoto = '';
        paintPreview('');
        toast('Foto akan dihapus saat disimpan.', 'warning');
      });

      saveButton?.addEventListener('click', () => {
        if (selectedPhoto === null) {
          close();
          return;
        }
        try {
          updateRoomPhoto(room.id, selectedPhoto);
          toast(selectedPhoto ? 'Foto kamar berhasil disimpan.' : 'Foto kamar dihapus.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
