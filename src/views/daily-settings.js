import {
  addDays,
  formatDate,
  rupiah,
  toNumber,
  todayISO,
} from '../core/format.js';
import { isOwner } from '../services/auth.js';
import {
  applyRoomDailyRange,
  clearRoomDailyCalendar,
  removeRoomDailyEntry,
  setRoomDailyEntry,
} from '../services/daily.js';
import {
  dailyPriceForDate,
  getDailyCalendar,
} from '../services/daily-calendar.js';
import { getRate, savePricing } from '../services/pricing.js';
import { getRooms } from '../services/property.js';
import { emptyState, pageHeader, statCard } from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

const PAGE_SIZE = 120;
let calendarCursor = todayISO().slice(0, 7);
let overrideLimit = PAGE_SIZE;

function vipRoom() {
  return getRooms().find((room) => String(room.lantai) === '1') || null;
}

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function calendarDays(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = first.getDay(); // Sunday = 0
  const cells = [];
  for (let index = 0; index < offset; index += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${monthKey}-${String(day).padStart(2, '0')}`);
  }
  return cells;
}

function dayCell(room, date, defaultPrice) {
  if (!date) return '<div class="h-24 rounded-xl bg-transparent"></div>';
  const entry = getDailyCalendar(room)[date];
  const blocked = entry?.available === false;
  const price = dailyPriceForDate(room, date, defaultPrice);
  const isPast = date < todayISO();
  const isToday = date === todayISO();
  const hasOverride = Boolean(entry);

  return `
    <button type="button" data-date="${date}" class="h-24 rounded-xl border p-2 text-left flex flex-col justify-between transition ${
      blocked
        ? 'border-rose-200 bg-rose-50 hover:border-rose-300'
        : hasOverride
          ? 'border-amber-300 bg-amber-50 hover:border-amber-400'
          : 'border-line bg-white hover:border-gold-300'
    } ${isPast ? 'opacity-50' : ''}">
      <div class="flex items-start justify-between gap-1">
        <span class="text-sm font-black ${isToday ? 'text-brand' : 'text-stone-700'}">${Number(date.slice(8, 10))}</span>
        ${isToday ? '<span class="badge-gold text-[8px] px-1 py-0">Hari ini</span>' : ''}
      </div>
      <div>
        <p class="text-[9px] font-extrabold uppercase tracking-wider ${blocked ? 'text-rose-700' : 'text-stone-500'}">${blocked ? 'Ditutup' : rupiah(price)}</p>
        ${entry?.note ? `<p class="text-[9px] text-stone-500 truncate" title="${esc(entry.note)}">${esc(entry.note)}</p>` : ''}
      </div>
    </button>
  `;
}

function overridesFor(room) {
  return Object.entries(getDailyCalendar(room))
    .map(([date, entry]) => ({ date, ...entry }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function render(root) {
  if (!isOwner()) {
    root.innerHTML = `<div class="card">${emptyState({
      iconName: 'Lock',
      title: 'Akses terbatas',
      description: 'Pengaturan harga & ketersediaan kamar harian hanya untuk owner.',
      action: `<a href="#/daily" class="btn-primary btn-sm">Kembali ke Booking Harian</a>`,
    })}</div>`;
    return;
  }

  const room = vipRoom();
  if (!room) {
    root.innerHTML = `<div class="card">${emptyState({
      iconName: 'CalendarDays',
      title: 'Kamar VIP belum ada',
      description: 'Tambahkan kamar lantai 1 terlebih dahulu di Status Kamar.',
      action: `<a href="#/rooms" class="btn-primary btn-sm">Buka Status Kamar</a>`,
    })}</div>`;
    return;
  }

  const defaultPrice = getRate('1', 'harian');
  const calendar = getDailyCalendar(room);
  const overrides = overridesFor(room);
  const upcoming = overrides.filter((entry) => entry.date >= todayISO());
  const closed = upcoming.filter((entry) => entry.available === false).length;
  const priced = upcoming.filter((entry) => entry.price > 0).length;
  const cells = calendarDays(calendarCursor);
  const weekdayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  root.innerHTML = `
    <div data-view="daily-settings" class="animate-in">
      ${pageHeader({
        eyebrow: 'VIP Daily Room',
        title: 'Atur Kamar Harian 🗓️',
        subtitle: 'Khusus Kamar 101 Deluxe VIP lantai 1. Kamar lantai 2 & 3 otomatis mengikuti ketersediaan penghuni bulanan.',
        actions: `<a href="#/daily" class="btn-outline btn-sm">${icon('CalendarClock', 'w-4 h-4')} Booking Harian</a>`,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        ${statCard({ label: 'Harga Default / Malam', value: rupiah(defaultPrice), iconName: 'Tags', tone: 'brand' })}
        ${statCard({ label: 'Tanggal Ditutup', value: closed, iconName: 'Lock', tone: closed ? 'rose' : 'green', hint: 'Dari tanggal mendatang' })}
        ${statCard({ label: 'Harga Khusus', value: priced, iconName: 'SlidersHorizontal', tone: 'amber', hint: 'Weekend / peak season' })}
        ${statCard({ label: 'Kamar', value: '101', iconName: 'Sparkles', hint: 'Deluxe VIP · Lantai 1' })}
      </div>

      <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 mb-5">
        <div class="card p-5">
          <h2 class="font-extrabold text-stone-800 text-sm">Harga default harian</h2>
          <p class="text-xs text-stone-500 mt-1">Dipakai untuk tanggal yang tidak punya harga khusus.</p>
          <form id="vip-default-price-form" class="mt-4 space-y-3">
            <div>
              <label class="label" for="vip-default-price">Harga per malam (Rp)</label>
              <input id="vip-default-price" type="number" min="1" step="10000" class="input font-bold" value="${toNumber(defaultPrice)}" />
            </div>
            <button type="submit" class="btn-primary btn-sm">${icon('Save', 'w-4 h-4')} Simpan harga default</button>
          </form>
        </div>

        <div class="card p-5">
          <h2 class="font-extrabold text-stone-800 text-sm">Atur cepat beberapa tanggal</h2>
          <p class="text-xs text-stone-500 mt-1">Cocok untuk weekend, peak season, atau menutup kamar karena dipakai sendiri.</p>
          <form id="vip-range-form" class="mt-4 space-y-3">
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="label" for="vip-range-start">Tanggal mulai</label>
                <input id="vip-range-start" type="date" class="input" value="${todayISO()}" />
              </div>
              <div>
                <label class="label" for="vip-range-end">Sampai tanggal (inklusif)</label>
                <input id="vip-range-end" type="date" class="input" value="${addDays(todayISO(), 1)}" />
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="label" for="vip-range-status">Status</label>
                <select id="vip-range-status" class="select">
                  <option value="open">Buka untuk dijual</option>
                  <option value="closed">Tutup / dipakai sendiri</option>
                </select>
              </div>
              <div>
                <label class="label" for="vip-range-price">Harga khusus (opsional)</label>
                <input id="vip-range-price" type="number" min="0" step="10000" class="input" placeholder="Kosong = harga default" />
              </div>
            </div>
            <div>
              <label class="label" for="vip-range-note">Catatan (opsional)</label>
              <input id="vip-range-note" type="text" class="input" placeholder="cth: Weekend / peak season / dipakai sendiri" />
            </div>
            <button type="submit" class="btn-primary btn-sm">${icon('Check', 'w-4 h-4')} Terapkan ke rentang tanggal</button>
          </form>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="font-extrabold text-stone-800 text-sm">Kalender Kamar 101</h2>
            <p class="text-xs text-stone-500 mt-0.5">Klik tanggal untuk mengatur harga dan ketersediaan.</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="btn-outline btn-xs" data-month="-1">${icon('ChevronLeft', 'w-3.5 h-3.5')}</button>
            <span class="text-sm font-extrabold text-stone-800 min-w-32 text-center">${monthLabel(calendarCursor)}</span>
            <button type="button" class="btn-outline btn-xs" data-month="1">${icon('ChevronRight', 'w-3.5 h-3.5')}</button>
            <button type="button" class="btn-ghost btn-xs text-brand" data-month="today">Hari ini</button>
          </div>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-7 gap-1.5 mb-2">
            ${weekdayLabels.map((label) => `<div class="text-center text-[10px] font-extrabold uppercase tracking-wider text-stone-500 py-1">${label}</div>`).join('')}
          </div>
          <div class="grid grid-cols-7 gap-1.5">
            ${cells.map((date) => dayCell(room, date, defaultPrice)).join('')}
          </div>
          <div class="flex flex-wrap items-center gap-3 mt-4 text-[10px] font-semibold text-stone-600">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-white border border-line"></span> Harga default</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-200"></span> Harga khusus</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-300"></span> Ditutup</span>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden mt-5">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="font-extrabold text-stone-800 text-sm">Daftar harga & tanggal khusus</h2>
            <p class="text-xs text-stone-500 mt-0.5">${overrides.length} tanggal memiliki pengaturan khusus.</p>
          </div>
          ${
            overrides.length
              ? `<button type="button" class="btn-ghost btn-xs text-rose-600" data-clear-calendar>Hapus semua pengaturan</button>`
              : ''
          }
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Tanggal</th><th>Status</th><th>Harga</th><th>Catatan</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                overrides.length
                  ? overrides
                      .slice(0, overrideLimit)
                      .map(
                        (entry) => `
                        <tr>
                          <td class="font-bold text-stone-800 whitespace-nowrap">${formatDate(entry.date)}</td>
                          <td>${entry.available === false ? '<span class="badge-red">Ditutup</span>' : '<span class="badge-green">Dijual</span>'}</td>
                          <td class="font-bold whitespace-nowrap">${entry.price > 0 ? rupiah(entry.price) : `<span class="text-stone-500">Default ${rupiah(defaultPrice)}</span>`}</td>
                          <td class="text-xs text-stone-600 max-w-[240px] truncate" title="${esc(entry.note || '')}">${esc(entry.note || '—')}</td>
                          <td>
                            <div class="flex justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-date="${entry.date}">${icon('Pencil', 'w-3 h-3')} Edit</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-delete-date="${entry.date}" title="Hapus pengaturan tanggal">${icon('Trash2', 'w-3.5 h-3.5')}</button>
                            </div>
                          </td>
                        </tr>`,
                      )
                      .join('')
                  : `<tr><td colspan="5" class="py-10">${emptyState({
                      iconName: 'CalendarDays',
                      title: 'Belum ada harga khusus',
                      description: 'Semua tanggal memakai harga default. Klik tanggal di kalender atau gunakan Atur cepat untuk weekend/peak season.',
                    })}</td></tr>`
              }
            </tbody>
          </table>
        </div>
        ${
          overrides.length > overrideLimit
            ? `<div class="p-3 text-center"><button type="button" class="btn-outline btn-sm" data-show-more>Tampilkan semua (${overrides.length})</button></div>`
            : ''
        }
      </div>

      <div class="rounded-2xl border border-line bg-white p-4 mt-5 text-xs text-stone-600 leading-relaxed">
        <b>Kamar lantai 2 & 3</b> tidak perlu diatur di sini. Kamar tersebut otomatis bisa disewa harian saat kosong dan otomatis tidak tersedia saat terisi bulanan.
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="daily-settings"]');

  scope.querySelector('#vip-default-price-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const value = toNumber(scope.querySelector('#vip-default-price').value);
      if (value <= 0) throw new Error('Harga default harus lebih dari 0.');
      savePricing('1', {
        harian: value,
        mingguan: 0,
        '1': 0,
        '3': 0,
        '6': 0,
        '12': 0,
      });
      toast('Harga default kamar VIP berhasil disimpan.');
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  scope.querySelector('#vip-range-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const startDate = scope.querySelector('#vip-range-start').value || todayISO();
      let endDate = scope.querySelector('#vip-range-end').value || startDate;
      if (endDate < startDate) endDate = startDate;
      const available = scope.querySelector('#vip-range-status').value !== 'closed';
      const price = toNumber(scope.querySelector('#vip-range-price').value);
      const note = scope.querySelector('#vip-range-note').value.trim();
      const dates = applyRoomDailyRange(room.id, {
        startDate,
        endDate,
        available,
        price,
        note,
      });
      toast(`${dates.length} tanggal berhasil diperbarui.`);
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  scope.querySelectorAll('[data-month]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.month;
      calendarCursor =
        action === 'today' ? todayISO().slice(0, 7) : shiftMonth(calendarCursor, Number(action));
      render(root);
    });
  });

  delegate(scope, 'click', '[data-date]', (event, target) => {
    openDateEditor(room, target.dataset.date, () => render(root));
  });

  delegate(scope, 'click', '[data-delete-date]', async (event, target) => {
    const approved = await confirmAction({
      title: 'Hapus pengaturan tanggal?',
      message: `Harga & status khusus untuk <b>${formatDate(target.dataset.deleteDate)}</b> akan dihapus dan kembali ke default.`,
      confirmText: 'Ya, hapus',
      danger: true,
    });
    if (!approved) return;
    try {
      removeRoomDailyEntry(room.id, target.dataset.deleteDate);
      toast('Pengaturan tanggal dihapus.');
      render(root);
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  scope.querySelector('[data-clear-calendar]')?.addEventListener('click', async () => {
    const approved = await confirmAction({
      title: 'Hapus semua pengaturan kalender?',
      message: 'Semua harga khusus dan tanggal yang ditutup akan dihapus. Kamar kembali memakai harga default dan tersedia setiap hari.',
      confirmText: 'Ya, hapus semua',
      danger: true,
    });
    if (!approved) return;
    try {
      clearRoomDailyCalendar(room.id);
      toast('Semua pengaturan kalender dihapus.');
      render(root);
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  scope.querySelector('[data-show-more]')?.addEventListener('click', () => {
    overrideLimit = Number.MAX_SAFE_INTEGER;
    render(root);
  });
}

function openDateEditor(room, date, onDone) {
  const defaultPrice = getRate('1', 'harian');
  const entry = getDailyCalendar(room)[date] || null;
  const available = entry ? entry.available !== false : true;
  const price = entry?.price || '';
  const note = entry?.note || '';

  openModal({
    title: `Atur ${formatDate(date)}`,
    subtitle: 'Kamar 101 — Deluxe VIP lantai 1',
    size: 'sm',
    body: `
      <form id="vip-date-form" class="space-y-4">
        <label class="flex items-start gap-3 rounded-xl border border-line bg-white p-3 cursor-pointer">
          <input id="vip-date-available" type="checkbox" class="w-4 h-4 accent-brand mt-0.5" ${available ? 'checked' : ''} />
          <span>
            <span class="block text-xs font-bold text-stone-800">Buka untuk dijual</span>
            <span class="block text-[10px] text-stone-500 mt-0.5">Hilangkan centang jika kamar dipakai sendiri / tidak dijual.</span>
          </span>
        </label>
        <div>
          <label class="label" for="vip-date-price">Harga khusus (Rp)</label>
          <input id="vip-date-price" type="number" min="0" step="10000" class="input" value="${price}" placeholder="Kosong = default ${rupiah(defaultPrice)}" />
        </div>
        <div>
          <label class="label" for="vip-date-note">Catatan</label>
          <input id="vip-date-note" type="text" class="input" value="${esc(note)}" placeholder="cth: Weekend / peak season / dipakai sendiri" />
        </div>
        <p class="hint">Harga default saat ini ${rupiah(defaultPrice)}/malam.</p>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save-date>${icon('Check', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('[data-save-date]')?.addEventListener('click', () => {
        try {
          setRoomDailyEntry(room.id, {
            date,
            available: el.querySelector('#vip-date-available').checked,
            price: toNumber(el.querySelector('#vip-date-price').value),
            note: el.querySelector('#vip-date-note').value,
          });
          toast(`Pengaturan ${formatDate(date)} disimpan.`);
          close();
          onDone?.();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
