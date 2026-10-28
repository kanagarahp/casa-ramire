import { BOOKING_REQUEST_STATUS } from '../core/constants.js';
import { formatDate, formatDateTime, rupiah, todayISO } from '../core/format.js';
import { fetchBookingRequests, updateBookingRequest } from '../services/bookings.js';
import { computeQuote, getPromoByCode, syncPromoUsage } from '../services/pricing.js';
import { getRooms, saveBooking } from '../services/property.js';
import { emptyState, pageHeader, statCard } from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

let filter = 'pending';
let requests = [];
let loading = true;
let notice = '';
let lastLoaded = 0;
let inFlight = false;

function statusBadge(status) {
  const meta = BOOKING_REQUEST_STATUS[status] || BOOKING_REQUEST_STATUS.pending;
  return `<span class="${meta.badge}">${meta.label}</span>`;
}

function periodLabel(request) {
  if (request.periode === 'harian') return 'Harian';
  if (request.periode === 'mingguan') return 'Mingguan';
  return `${request.periode} bulan`;
}

function promoLabel(request) {
  if (!request.promoCode) return '—';
  const promo = getPromoByCode(request.promoCode);
  if (!promo) return `${request.promoCode} (tidak aktif)`;
  return `${promo.code} · ${promo.type === 'persen' ? `${promo.value}%` : rupiah(promo.value)}`;
}

function rowHtml(request) {
  const isPending = request.status === 'pending';
  return `
    <tr>
      <td>
        <p class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${esc(request.code)}</p>
        <p class="text-[10px] text-stone-500 mt-0.5">${formatDateTime(request.createdAt)}</p>
        ${request.source === 'local' ? '<span class="badge-amber mt-1">Lokal (dev)</span>' : ''}
      </td>
      <td>
        <p class="font-bold text-stone-800">${esc(request.name)}</p>
        <p class="text-[10px] text-stone-600">${esc(request.phone)}</p>
        <p class="text-[10px] text-stone-500 truncate max-w-[180px]">${esc(request.email || '—')}</p>
      </td>
      <td>
        <p class="font-semibold text-stone-700">${periodLabel(request)}</p>
        <p class="text-[10px] text-stone-600">${formatDate(request.startDate)}${request.endDate ? ` — ${formatDate(request.endDate)}` : ''}</p>
        <p class="text-[10px] text-stone-500">${request.floor ? `Lantai ${esc(request.floor)}` : 'Lantai fleksibel'}${request.roomNumber ? ` · Kamar ${esc(request.roomNumber)}` : ''}</p>
      </td>
      <td>
        ${request.car ? '<span class="badge-blue">Mobil</span>' : '<span class="badge-gray">Tanpa mobil</span>'}
        <p class="text-[10px] text-stone-500 mt-1">${esc(promoLabel(request))}</p>
      </td>
      <td class="font-bold whitespace-nowrap">${request.estimate ? rupiah(request.estimate) : '—'}</td>
      <td>${statusBadge(request.status)}</td>
      <td>
        <div class="flex flex-wrap justify-end gap-1">
          ${isPending ? `<button type="button" class="btn-primary btn-xs" data-action="convert" data-code="${esc(request.code)}">${icon('UserPlus', 'w-3 h-3')} Jadikan Booking</button>` : ''}
          ${isPending ? `<button type="button" class="btn-ghost btn-xs text-rose-600" data-action="reject" data-code="${esc(request.code)}">Tolak</button>` : ''}
        </div>
      </td>
    </tr>
  `;
}

export function render(root) {
  const filtered = filter === 'all' ? requests : requests.filter((item) => item.status === filter);
  const pending = requests.filter((item) => item.status === 'pending').length;
  const confirmed = requests.filter((item) => item.status === 'confirmed').length;
  const withCar = requests.filter((item) => item.car).length;

  root.innerHTML = `
    <div data-view="bookings" class="animate-in">
      ${pageHeader({
        eyebrow: 'Public Booking',
        title: 'Booking Online 📥',
        subtitle: 'Permintaan booking dari calon penghuni di landing page. Konversi menjadi booking kamar setelah dikonfirmasi.',
        actions: `<button type="button" class="btn-outline btn-sm" data-action="refresh">${icon('RefreshCw', 'w-4 h-4')} Muat ulang</button>`,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        ${statCard({ label: 'Menunggu', value: pending, iconName: 'Inbox', tone: pending ? 'amber' : 'default' })}
        ${statCard({ label: 'Sudah Dikonversi', value: confirmed, iconName: 'CheckCircle2', tone: 'green' })}
        ${statCard({ label: 'Bawa Mobil', value: withCar, iconName: 'Car', tone: 'brand', hint: 'Surcharge Rp130.000/bln' })}
        ${statCard({ label: 'Total Permintaan', value: requests.length, iconName: 'ClipboardList' })}
      </div>

      ${
        notice
          ? `<div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 mb-4 flex items-start gap-2">
              ${icon('AlertTriangle', 'w-4 h-4 shrink-0 mt-0.5')}
              <span>${esc(notice)}</span>
            </div>`
          : ''
      }

      <div class="card p-3 mb-5 flex flex-wrap items-center gap-2">
        ${[
          ['pending', 'Menunggu'],
          ['confirmed', 'Dikonversi'],
          ['rejected', 'Ditolak'],
          ['all', 'Semua'],
        ]
          .map(
            ([key, label]) => `
            <button type="button" class="${filter === key ? 'chip-active' : 'chip-idle'}" data-filter="${key}">
              ${label} (${key === 'all' ? requests.length : requests.filter((item) => item.status === key).length})
            </button>`,
          )
          .join('')}
        <span class="ml-auto text-[10px] text-stone-500">${loading ? 'Memuat…' : `Diperbarui ${new Date().toLocaleTimeString('id-ID')}`}</span>
      </div>

      <div class="card overflow-hidden">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Calon Penghuni</th>
                <th>Sewa</th>
                <th>Tambahan</th>
                <th>Estimasi</th>
                <th>Status</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length
                  ? filtered.map(rowHtml).join('')
                  : `<tr><td colspan="7" class="py-10">${emptyState({
                      iconName: 'Inbox',
                      title: loading ? 'Memuat booking…' : 'Belum ada booking online',
                      description: loading
                        ? 'Mohon tunggu sebentar.'
                        : 'Permintaan booking dari landing page akan muncul di sini.',
                    })}</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="bookings"]');

  delegate(scope, 'click', '[data-action], [data-filter]', async (event, target) => {
    const action = target.dataset.action;

    if (target.dataset.filter) {
      filter = target.dataset.filter;
      render(root);
      return;
    }

    if (action === 'refresh') {
      loading = true;
      render(root);
      await load();
      if (root.querySelector('[data-view="bookings"]')) render(root);
      return;
    }

    const request = requests.find((item) => item.code === target.dataset.code);
    if (!request) return;

    if (action === 'convert') {
      openConvertModal(request, () => {
        if (root.querySelector('[data-view="bookings"]')) render(root);
      });
      return;
    }

    if (action === 'reject') {
      const approved = await confirmAction({
        title: 'Tolak booking online?',
        message: `Permintaan <b>${esc(request.code)}</b> dari <b>${esc(request.name)}</b> akan ditandai ditolak. Kuota promo dikembalikan.`,
        confirmText: 'Ya, tolak',
        danger: true,
      });
      if (!approved) return;
      try {
        await updateBookingRequest({ ...request, status: 'rejected' });
        request.status = 'rejected';
        toast('Booking online ditolak.');
        render(root);
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  });

  const stale = Date.now() - lastLoaded > 30_000;
  if (!loading && stale) {
    loading = true;
    render(root);
    return;
  }

  if (loading && !inFlight) {
    inFlight = true;
    load()
      .then(() => {
        if (root.querySelector('[data-view="bookings"]')) render(root);
      })
      .finally(() => {
        inFlight = false;
      });
  }
}

async function load() {
  const result = await fetchBookingRequests();
  requests = result.requests;
  notice = result.offline
    ? `Mode lokal / API belum tersedia: ${result.reason || 'perubahan hanya tersimpan di perangkat ini.'}`
    : '';
  if (result.promos?.length) syncPromoUsage(result.promos);
  lastLoaded = Date.now();
  loading = false;
}

function vacantRooms(preferredRoomId) {
  return getRooms()
    .filter((room) => room.status === 'kosong')
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));
}

function openConvertModal(request, onDone) {
  const rooms = vacantRooms(request.roomId);
  if (!rooms.length) {
    toast('Tidak ada kamar kosong. Kosongkan kamar terlebih dahulu.', 'warning');
    return;
  }
  const preferred = rooms.find((room) => String(room.id) === String(request.roomId));

  openModal({
    title: `Konversi Booking ${request.code}`,
    subtitle: `${request.name} • ${periodLabel(request)}`,
    size: 'lg',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs grid sm:grid-cols-2 gap-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nama</span><b class="text-stone-800">${esc(request.name)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">WhatsApp</span><b class="text-stone-800">${esc(request.phone)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Email</span><b class="text-stone-800">${esc(request.email)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Pekerjaan</span><b class="text-stone-800">${esc(request.job || '—')}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Mulai</span><b class="text-stone-800">${formatDate(request.startDate)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Durasi</span><b class="text-stone-800">${periodLabel(request)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Mobil</span><b class="text-stone-800">${request.car ? 'Ya (+Rp130.000/bln)' : 'Tidak'}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Kode promo</span><b class="text-stone-800">${esc(promoLabel(request))}</b></div>
          ${request.notes ? `<div class="sm:col-span-2 flex justify-between gap-3"><span class="text-stone-500">Catatan</span><b class="text-stone-800 text-right">${esc(request.notes)}</b></div>` : ''}
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="bk-room">Kamar untuk booking</label>
            <select id="bk-room" class="select">
              ${rooms.map((room) => `<option value="${room.id}" ${preferred?.id === room.id ? 'selected' : ''}>Kamar ${esc(room.nomor)} — Lantai ${esc(room.lantai)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="label" for="bk-start">Tanggal mulai</label>
            <input id="bk-start" type="date" class="input" value="${request.startDate || todayISO()}" />
          </div>
        </div>

        <div class="rounded-xl border border-line bg-white p-3 text-[11px] text-stone-600 leading-relaxed">
          Total final dihitung ulang memakai pricelist aktif. Promo hanya berlaku jika kodenya masih aktif di menu Pricelist.
        </div>

        <div id="bk-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-confirm>${icon('CalendarClock', 'w-4 h-4')} Simpan sebagai Booking</button>
    `,
    onMount(el, close) {
      const roomSelect = el.querySelector('#bk-room');
      const startInput = el.querySelector('#bk-start');
      const summary = el.querySelector('#bk-summary');

      const paintSummary = () => {
        const room = getRooms().find((item) => String(item.id) === String(roomSelect.value));
        if (!room) {
          summary.innerHTML = '<span class="text-rose-700 font-semibold">Kamar tidak ditemukan.</span>';
          return null;
        }
        try {
          const quote = computeQuote({
            lantai: room.lantai,
            periode: request.periode,
            startDate: startInput.value || request.startDate,
            endDate: request.endDate || undefined,
            promo: getPromoByCode(request.promoCode),
            addons: [],
            car: Boolean(request.car),
            depositEnabled: false,
            depositValue: 0,
            payOption: 'partial',
          });
          summary.innerHTML = `
            <div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${quote.units} ${quote.unitLabel})</span><span class="font-bold">${rupiah(quote.base)}</span></div>
            ${quote.discount > 0 ? `<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${quote.promo ? ` (${esc(quote.promo.name)})` : ''}</span><span class="font-bold">−${rupiah(quote.discount)}</span></div>` : ''}
            ${quote.addonTotal > 0 ? `<div class="flex justify-between gap-3 text-amber-800"><span>Parkir mobil</span><span class="font-bold">${rupiah(quote.addonTotal)}</span></div>` : ''}
            <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total sewa</span><span class="font-extrabold text-stone-800">${rupiah(quote.grandTotal)}</span></div>
            <p class="text-[10px] text-stone-500">${formatDate(quote.startDate)} — ${formatDate(quote.endDate)}</p>
          `;
          return quote;
        } catch (error) {
          summary.innerHTML = `<span class="text-rose-700 font-semibold">${esc(error.message)}</span>`;
          return null;
        }
      };

      roomSelect.addEventListener('change', paintSummary);
      startInput.addEventListener('change', paintSummary);
      paintSummary();

      el.querySelector('[data-confirm]')?.addEventListener('click', async () => {
        const roomId = el.querySelector('#bk-room').value;
        const startDate = el.querySelector('#bk-start').value || request.startDate;
        const quote = paintSummary();
        if (!quote) return;
        try {
          saveBooking(roomId, {
            name: request.name,
            phone: request.phone,
            email: request.email,
            job: request.job,
            notes: request.notes,
            emergencyContact: request.emergencyContact,
            periode: request.periode,
            startDate,
            endDate: request.endDate || undefined,
            car: Boolean(request.car),
            promo: getPromoByCode(request.promoCode),
            addons: [],
            depositEnabled: false,
            depositValue: 0,
            payOption: 'partial',
          });
          await updateBookingRequest({ ...request, status: 'confirmed' });
          request.status = 'confirmed';
          toast('Booking online berhasil dikonversi ke booking kamar.');
          close();
          onDone?.();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
