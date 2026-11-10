import { PAYMENT_METHODS, PERIODS } from '../core/constants.js';
import {
  addDays,
  formatDate,
  rupiah,
  toNumber,
  todayISO,
} from '../core/format.js';
import { getAddons } from '../services/addons.js';
import {
  checkInDirect,
  checkInFromBooking,
  checkoutTenant,
  extendContract,
  getOutstandingForTenant,
  getRoom,
  getRooms,
  getTenant,
  markRenewalPending,
  moveBooking,
  moveTenant,
  saveBooking,
} from '../services/property.js';
import { getDepositAccount, refundDeposit } from '../services/deposit.js';
import { createRenewalPaymentLink, openPaymentLinkModal } from '../services/payments.js';
import { computeQuote, getDepositDefault, getPromo, getPromos, hasCarAddon } from '../services/pricing.js';
import { getCarParkingStatus } from '../services/parking.js';
import { isDokuEnabled } from '../services/settings.js';
import { periodsForRoom, roomType } from '../services/daily.js';
import { notifyBookingSaved } from '../services/notifications.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

const isShortPeriod = (periode) => periode === 'harian' || periode === 'mingguan';

function promoOptionsHtml(selectedId) {
  const promos = getPromos({ activeOnly: true });
  return [
    `<option value="none" ${!selectedId || selectedId === 'none' ? 'selected' : ''}>Tanpa promo / diskon</option>`,
    ...promos.map((promo) => {
      const value = promo.type === 'persen' ? `${promo.value}%` : rupiah(promo.value);
      return `<option value="${promo.id}" ${String(promo.id) === String(selectedId) ? 'selected' : ''}>${esc(promo.name)} — ${value}</option>`;
    }),
  ].join('');
}

function addonOptionsHtml(room = null) {
  const addons = getAddons({ activeOnly: true });
  const parking = getCarParkingStatus({ excludeRoomId: room?.id });
  return [
    `<option value="">— Pilih layanan add-on —</option>`,
    ...addons.map((addon) => {
      const parkingNote = hasCarAddon([addon])
        ? ` (${parking.used}/${parking.capacity}${parking.full ? ' — PENUH' : ''})`
        : '';
      return `<option value="${addon.id}">${esc(addon.name)} — ${rupiah(addon.price)}/bln${parkingNote}</option>`;
    }),
  ].join('');
}

function addonListHtml(addons) {
  if (!addons.length) {
    return `<p class="text-[11px] text-stone-600 italic">Belum ada add-on dipilih.</p>`;
  }
  return addons
    .map(
      (addon, index) => `
      <div class="flex items-center justify-between gap-2 bg-white border border-amber-200 rounded-xl px-3 py-2">
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-stone-700 truncate">${esc(addon.name)}</p>
          <p class="text-[10px] text-stone-500">${rupiah(addon.price)} / bulan</p>
        </div>
        <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50" data-remove-addon="${index}" aria-label="Hapus ${esc(addon.name)}">
          ${icon('X', 'w-3.5 h-3.5')}
        </button>
      </div>`,
    )
    .join('');
}

function summaryBody(quote, mode) {
  const totalLabel = mode === 'extend' ? 'Total perpanjangan' : 'Total tagihan sewa';
  const rows = [
    `<div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${quote.units} ${quote.unitLabel})</span><span class="font-bold">${rupiah(quote.base)}</span></div>`,
    quote.discount > 0
      ? `<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${quote.promo ? ` (${esc(quote.promo.name)})` : ''}</span><span class="font-bold">−${rupiah(quote.discount)}</span></div>`
      : '',
    quote.addonTotal > 0
      ? `<div class="flex justify-between gap-3 text-amber-800"><span>Add-on</span><span class="font-bold">${rupiah(quote.addonTotal)}</span></div>`
      : '',
    `<div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">${totalLabel}</span><span class="font-extrabold text-stone-800">${rupiah(quote.grandTotal)}</span></div>`,
    quote.deposit > 0
      ? `<div class="flex justify-between gap-3"><span class="text-stone-500">Deposit (jaminan)</span><span class="font-bold">${rupiah(quote.deposit)}</span></div>`
      : '',
    quote.deposit > 0 && !quote.depositPaid
      ? `<div class="flex justify-between gap-3 text-amber-800"><span>Deposit belum dibayar</span><span class="font-bold">${rupiah(quote.deposit)}</span></div>`
      : '',
    `<div class="flex justify-between gap-3 text-emerald-700"><span class="font-bold">Dibayar sekarang</span><span class="font-extrabold">${rupiah(quote.payNow)}</span></div>`,
    `<div class="flex justify-between gap-3 ${quote.remaining > 0 ? 'text-rose-700' : 'text-stone-500'}"><span class="font-semibold">Sisa tagihan</span><span class="font-extrabold">${rupiah(quote.remaining)}</span></div>`,
    `<div class="text-[10px] text-stone-600 pt-1">Periode: ${formatDate(quote.startDate)} — ${formatDate(quote.endDate)}</div>`,
  ];
  return rows.filter(Boolean).join('');
}

function summaryError(message) {
  return `
    <div class="flex items-start gap-2 text-rose-700">
      ${icon('CircleAlert', 'w-4 h-4 shrink-0 mt-0.5')}
      <span class="font-semibold">${esc(message)}</span>
    </div>
  `;
}

const MODE_META = {
  booking: { title: 'Booking Kamar', submit: 'Simpan Booking', iconName: 'CalendarClock' },
  checkin: { title: 'Check-in Kamar', submit: 'Proses Check-in', iconName: 'LogIn' },
  edit_booking: { title: 'Edit Booking', submit: 'Simpan Perubahan', iconName: 'Pencil' },
  extend: { title: 'Perpanjang Kontrak', submit: 'Simpan Perpanjangan', iconName: 'Repeat' },
};

/**
 * Booking / check-in / extension form.
 * @param {number|string} roomId
 * @param {'booking'|'checkin'|'edit_booking'|'extend'} mode
 * @param {number|string|null} tenantId required for extend
 */
export function openBookingModal(roomId, mode = 'booking', tenantId = null) {
  const room = getRoom(roomId);
  if (!room) {
    toast('Kamar tidak ditemukan.', 'error');
    return;
  }
  const tenant = tenantId ? getTenant(tenantId) : null;
  const booking = room.booking;
  const meta = MODE_META[mode] || MODE_META.booking;
  const isExtend = mode === 'extend';
  const allowedPeriods = isExtend ? periodsForRoom(room) : periodsForRoom(room);
  const parking = getCarParkingStatus({ excludeRoomId: room.id });

  if (isExtend && !tenant) {
    toast('Data penghuni tidak ditemukan.', 'error');
    return;
  }
  if (mode === 'checkin' && room.status !== 'kosong') {
    toast('Kamar tidak kosong. Muat ulang halaman.', 'error');
    return;
  }

  const initialStart = isExtend
    ? addDays(tenant.endDate, 1)
    : booking?.startDate || todayISO();
  const preferredPeriode = isExtend ? tenant.periode || '1' : booking?.periode || '';
  const initialPeriode = allowedPeriods.includes(String(preferredPeriode))
    ? String(preferredPeriode)
    : String(room.lantai) === '1'
      ? 'harian'
      : allowedPeriods[0] || '1';
  const initialEnd = isExtend
    ? '-'
    : booking?.endDate || (isShortPeriod(initialPeriode)
        ? addDays(initialStart, initialPeriode === 'harian' ? 1 : 7)
        : '-');
  const initialPromo = isExtend ? tenant.promoId || 'none' : booking?.promoId || 'none';
  const initialAddons = (isExtend ? tenant.addons : booking?.addons) || [];
  const initialDeposit = isExtend
    ? 0
    : booking?.deposit ?? getDepositDefault();
  const initialPayOption = isExtend ? 'full' : booking?.payOption || (mode === 'checkin' ? 'full' : 'partial');
  const initialDepositEnabled = isExtend ? false : booking ? booking.deposit > 0 : true;
  const initialDepositPaid = isExtend
    ? false
    : booking && booking.deposit > 0
      ? Number(booking.depositPaid) > 0
      : true;

  const guestSection = isExtend
    ? `
      <div class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
        <div class="flex items-start gap-3">
          <span class="w-10 h-10 rounded-xl bg-white text-indigo-700 flex items-center justify-center shrink-0">${icon('UserCheck', 'w-5 h-5')}</span>
          <div class="text-xs">
            <p class="font-extrabold text-stone-800 text-sm">${esc(tenant.name)} — Kamar ${esc(tenant.roomNumber || room.nomor)}</p>
            <p class="text-stone-600 mt-0.5">Kontrak berjalan: ${formatDate(tenant.startDate)} — <b>${formatDate(tenant.endDate)}</b></p>
            <p class="text-stone-500 mt-0.5">Perpanjangan dimulai otomatis sehari setelah kontrak berakhir.</p>
          </div>
        </div>
      </div>
    `
    : `
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="label" for="bm-name">Nama penghuni <span class="text-rose-500">*</span></label>
          <input id="bm-name" type="text" class="input" placeholder="Nama lengkap" value="${esc(booking?.name || '')}" required />
        </div>
        <div>
          <label class="label" for="bm-phone">No. WhatsApp <span class="text-rose-500">*</span></label>
          <input id="bm-phone" type="tel" class="input" placeholder="cth: 08123456789" value="${esc(booking?.phone || '')}" required />
        </div>
        <div>
          <label class="label" for="bm-email">Email penghuni</label>
          <input id="bm-email" type="email" class="input" placeholder="cth: nama@email.com" value="${esc(booking?.email || '')}" />
          <p class="hint mt-1">Dipakai untuk kirim tagihan & link pembayaran.</p>
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="bm-job">Pekerjaan / Instansi</label>
          <input id="bm-job" type="text" class="input" placeholder="Mahasiswa / Karyawan" value="${esc(booking?.job || '')}" />
        </div>
      </div>
    `;

  const body = `
    <form id="bm-form" class="space-y-5" novalidate>
      ${guestSection}

      <div class="grid sm:grid-cols-3 gap-3">
        <div>
          <label class="label" for="bm-periode">Skema periode</label>
          <select id="bm-periode" class="select">
            ${PERIODS.filter((period) => allowedPeriods.includes(period.key))
              .map((period) => `<option value="${period.key}" ${period.key === initialPeriode ? 'selected' : ''}>${period.label}</option>`)
              .join('')}
          </select>
        </div>
        <div>
          <label class="label" for="bm-start">Tanggal mulai</label>
          <input id="bm-start" type="date" class="input" value="${initialStart}" />
        </div>
        <div id="bm-end-wrap" class="${isShortPeriod(initialPeriode) ? '' : 'hidden'}">
          <label class="label" for="bm-end">Tanggal selesai</label>
          <input id="bm-end" type="date" class="input" value="${isShortPeriod(initialPeriode) ? initialEnd : ''}" />
        </div>
      </div>

      <div>
        <label class="label" for="bm-promo">Promo / diskon</label>
        <select id="bm-promo" class="select">${promoOptionsHtml(initialPromo)}</select>
      </div>

      ${
        isExtend
          ? ''
          : `
          <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kontak darurat</p>
            <div class="grid sm:grid-cols-3 gap-2">
              <input id="bm-ec-name" type="text" class="input input-sm" placeholder="Nama kontak" value="${esc(booking?.emergencyContact?.name || '')}" />
              <input id="bm-ec-relation" type="text" class="input input-sm" placeholder="Hubungan" value="${esc(booking?.emergencyContact?.relation || '')}" />
              <input id="bm-ec-phone" type="tel" class="input input-sm" placeholder="No. telepon" value="${esc(booking?.emergencyContact?.phone || '')}" />
            </div>
          </div>
        `
      }

      <div class="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">Layanan add-on</p>
          <span class="badge-gold">Opsional</span>
        </div>
        <div class="flex gap-2">
          <select id="bm-addon-select" class="select input-sm flex-1">${addonOptionsHtml(room)}</select>
          <button type="button" class="btn-primary btn-sm shrink-0" data-add-addon>${icon('Plus', 'w-4 h-4')} Tambah</button>
        </div>
        <div id="bm-addon-list" class="space-y-2">${addonListHtml(initialAddons)}</div>
        ${
          parking.full
            ? `<div class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[11px] text-rose-800 leading-relaxed">
                <b>Parkir mobil penuh (${parking.used}/${parking.capacity}).</b> Anda tetap dapat menambahkan parkir sebagai admin/owner (overbook), tetapi tamu online tidak bisa memilih parkir mobil.
              </div>`
            : `<p class="text-[10px] text-stone-500">Kapasitas parkir mobil: ${parking.used}/${parking.capacity} terpakai.</p>`
        }
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        ${
          isExtend
            ? ''
            : `
            <div class="rounded-2xl border border-line bg-white p-4 space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input id="bm-deposit-enabled" type="checkbox" class="w-4 h-4 accent-brand" ${initialDepositEnabled ? 'checked' : ''} />
                <span class="text-xs font-bold text-stone-800">Kenakan deposit</span>
              </label>
              <div id="bm-deposit-wrap" class="${initialDepositEnabled ? '' : 'hidden'} space-y-2">
                <input id="bm-deposit" type="number" min="0" step="1000" class="input input-sm" placeholder="Nominal deposit" value="${toNumber(initialDeposit) || ''}" />
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line bg-white">
                  <input id="bm-deposit-paid" type="checkbox" class="w-4 h-4 accent-brand" ${initialDepositPaid ? 'checked' : ''} />
                  <span class="text-[11px] font-bold text-stone-700">Deposit sudah dibayar / diterima</span>
                </label>
              </div>
              <p class="hint">Deposit adalah uang jaminan, bukan DP sewa. Tidak dihitung sebagai pendapatan dan dikembalikan saat check-out sesuai ketentuan.</p>
            </div>
          `
        }
        <div class="rounded-2xl border border-line bg-white p-4 space-y-2">
          <p class="text-xs font-bold text-stone-800">Opsi pembayaran sewa</p>
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line hover:bg-stone-50">
            <input type="radio" name="bm-pay-option" value="partial" class="accent-brand" ${initialPayOption === 'partial' ? 'checked' : ''} />
            <span class="text-xs font-semibold">${isExtend ? 'Catat sebagai tagihan' : 'Sewa belum dibayar (buat tagihan)'}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-line hover:bg-stone-50">
            <input type="radio" name="bm-pay-option" value="full" class="accent-brand" ${initialPayOption === 'full' ? 'checked' : ''} />
            <span class="text-xs font-semibold">${isExtend ? 'Lunas sekarang' : 'Sewa lunas sekarang'}</span>
          </label>
        </div>
      </div>

      ${
        isExtend
          ? ''
          : `
          <div>
            <label class="label" for="bm-notes">Catatan khusus / permintaan penghuni</label>
            <textarea id="bm-notes" rows="2" class="input" placeholder="cth: minta kamar dekat jendela">${esc(booking?.notes || '')}</textarea>
          </div>
        `
      }

      <div id="bm-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
    </form>
  `;

  openModal({
    title: `${meta.title} — Kamar ${room.nomor} (${roomType(room)})`,
    subtitle: isExtend ? 'Perpanjang masa sewa penghuni aktif.' : 'Lengkapi data untuk menghitung total otomatis.',
    size: 'xl',
    body,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${
        isExtend && isDokuEnabled()
          ? `<button type="button" class="btn-gold btn-sm" data-doku-extend>${icon('CreditCard', 'w-4 h-4')} Buat Link DOKU</button>`
          : ''
      }
      <button type="submit" form="bm-form" class="btn-primary btn-sm" data-submit>
        ${icon(meta.iconName, 'w-4 h-4')} ${meta.submit}
      </button>
    `,
    onMount(el, close) {
      const form = el.querySelector('#bm-form');
      const summary = el.querySelector('#bm-summary');
      const addonList = el.querySelector('#bm-addon-list');
      const periodeSelect = el.querySelector('#bm-periode');
      const startInput = el.querySelector('#bm-start');
      const endInput = el.querySelector('#bm-end');
      const endWrap = el.querySelector('#bm-end-wrap');
      const depositToggle = el.querySelector('#bm-deposit-enabled');
      const depositPaidToggle = el.querySelector('#bm-deposit-paid');
      const depositWrap = el.querySelector('#bm-deposit-wrap');
      const promoSelect = el.querySelector('#bm-promo');

      let addons = initialAddons.map((addon) => ({
        id: addon.id ?? null,
        name: addon.name,
        price: toNumber(addon.price),
      }));

      const value = (selector) => el.querySelector(selector)?.value.trim() ?? '';
      const getPayOption = () =>
        el.querySelector('input[name="bm-pay-option"]:checked')?.value || 'partial';
      const getPromoValue = () => getPromo(promoSelect.value);

      function toggleEndField() {
        const short = isShortPeriod(periodeSelect.value);
        endWrap.classList.toggle('hidden', !short);
        if (short) {
          const minimum = periodeSelect.value === 'harian' ? 1 : 7;
          const start = startInput.value || todayISO();
          if (!endInput.value || endInput.value <= start) {
            endInput.value = addDays(start, minimum);
          }
        }
      }

      function currentQuote() {
        try {
          return computeQuote({
            lantai: room.lantai,
            periode: periodeSelect.value,
            startDate: startInput.value,
            endDate: endInput.value || undefined,
            promo: getPromoValue(),
            addons,
            depositEnabled: Boolean(depositToggle?.checked),
            depositValue: toNumber(value('#bm-deposit')),
            depositPaid: Boolean(depositPaidToggle?.checked),
            payOption: getPayOption(),
          });
        } catch (error) {
          return { error: error.message };
        }
      }

      function renderSummary() {
        const quote = currentQuote();
        if (quote.error) {
          summary.innerHTML = summaryError(quote.error);
          return null;
        }
        summary.innerHTML = summaryBody(quote, mode);
        return quote;
      }

      function rerenderAddons() {
        addonList.innerHTML = addonListHtml(addons);
        renderSummary();
      }

      form.addEventListener('input', (event) => {
        if (event.target === depositToggle) return;
        renderSummary();
      });
      form.addEventListener('change', (event) => {
        if (event.target === periodeSelect) {
          toggleEndField();
        }
        if (event.target === depositToggle) {
          depositWrap.classList.toggle('hidden', !depositToggle.checked);
        }
        renderSummary();
      });

      startInput.addEventListener('change', () => {
        if (isShortPeriod(periodeSelect.value)) {
          const minimum = periodeSelect.value === 'harian' ? 1 : 7;
          if (!endInput.value || endInput.value <= startInput.value) {
            endInput.value = addDays(startInput.value, minimum);
          }
        }
        renderSummary();
      });

      el.querySelector('[data-add-addon]')?.addEventListener('click', () => {
        const select = el.querySelector('#bm-addon-select');
        const addon = getAddons().find((item) => String(item.id) === String(select.value));
        if (!addon) {
          toast('Pilih layanan add-on terlebih dahulu.', 'warning');
          return;
        }
        if (addons.some((item) => String(item.id) === String(addon.id))) {
          toast('Add-on ini sudah ditambahkan.', 'warning');
          return;
        }
        if (hasCarAddon([addon])) {
          const status = getCarParkingStatus({ excludeRoomId: room.id });
          if (status.full) {
            toast(
              `Peringatan: parkir mobil penuh (${status.used}/${status.capacity}). Penambahan ini dicatat sebagai overbook oleh admin.`,
              'warning',
            );
          }
        }
        addons.push({ id: addon.id, name: addon.name, price: addon.price });
        select.value = '';
        rerenderAddons();
      });

      addonList.addEventListener('click', (event) => {
        const button = event.target.closest('[data-remove-addon]');
        if (!button) return;
        addons.splice(Number(button.dataset.removeAddon), 1);
        rerenderAddons();
      });

      toggleEndField();
      renderSummary();

      const collectPayload = () => ({
        name: value('#bm-name'),
        phone: value('#bm-phone'),
        email: value('#bm-email'),
        job: value('#bm-job'),
        periode: periodeSelect.value,
        startDate: startInput.value,
        endDate: endInput.value || undefined,
        promo: getPromoValue(),
        addons,
        depositEnabled: Boolean(depositToggle?.checked),
        depositValue: toNumber(value('#bm-deposit')),
        depositPaidNow: Boolean(depositPaidToggle?.checked),
        payOption: getPayOption(),
        notes: value('#bm-notes'),
        emergencyContact: {
          name: value('#bm-ec-name'),
          relation: value('#bm-ec-relation'),
          phone: value('#bm-ec-phone'),
        },
      });

      el.querySelector('[data-doku-extend]')?.addEventListener('click', async () => {
        if (!isDokuEnabled()) {
          toast('Link DOKU belum diaktifkan di Pengaturan.', 'warning');
          return;
        }
        const quote = renderSummary();
        if (!quote) return;

        const payload = collectPayload();
        try {
          const result = await createRenewalPaymentLink({
            ...quote,
            tenantId: tenant.id,
            addons: payload.addons,
          });

          markRenewalPending(tenant.id, {
            paymentId: result.invoiceNumber,
            amount: result.amount,
            paymentUrl: result.paymentUrl,
            createdAt: todayISO(),
            expiresAt: addDays(todayISO(), 7),
          });

          close();
          openPaymentLinkModal({
            title: 'Link Pembayaran Perpanjangan',
            subtitle: `${tenant.name} • Kamar ${tenant.roomNumber}`,
            paymentUrl: result.paymentUrl,
            invoiceNumber: result.invoiceNumber,
            amount: result.amount,
            expiresAt: result.expiresAt,
            phone: tenant.phone || '',
            email: tenant.email || '',
            recipientName: tenant.name || '',
            message: `Halo Kak ${tenant.name}, berikut tagihan perpanjangan sewa Kamar ${tenant.roomNumber} Casa Ramire sebesar ${rupiah(quote.grandTotal)}. Pembayaran dapat dilakukan melalui link DOKU berikut.`,
          });
        } catch (error) {
          toast(error.message, 'error');
        }
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const quote = renderSummary();
        if (!quote) return;

        const payload = collectPayload();

        try {
          if (mode === 'booking' || mode === 'edit_booking') {
            const savedRoom = saveBooking(room.id, payload);
            toast(`Booking kamar ${room.nomor} berhasil disimpan.`);
            void notifyBookingSaved({
              room: savedRoom,
              booking: savedRoom.booking,
              email: payload.email,
              isNew: mode === 'booking',
            });
          } else if (mode === 'checkin') {
            const tenantRecord = checkInDirect(room.id, payload);
            toast(`${payload.name} berhasil check-in di kamar ${room.nomor}.`);
            void notifyBookingSaved({
              room: getRoom(room.id),
              booking: {
                ...payload,
                grandTotal: tenantRecord.contractTotal,
                depositPaid: tenantRecord.depositPaid,
              },
              email: payload.email,
              isNew: true,
              kind: 'checkin',
            });
          } else if (mode === 'extend') {
            extendContract(tenant.id, payload);
            toast(`Kontrak ${tenant.name} berhasil diperpanjang.`);
          }
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Check-in confirmation (handles outstanding rent before check-in). */
export function openCheckinFlow(roomId) {
  const room = getRoom(roomId);
  const booking = room?.booking;
  if (!room || !booking) {
    toast('Booking tidak ditemukan.', 'error');
    return;
  }

  const paid = booking.payOption === 'full' ? booking.grandTotal : 0;
  const remaining = Math.max(0, toNumber(booking.grandTotal) - paid);

  openModal({
    title: `Check-in ${booking.name}`,
    subtitle: `Kamar ${room.nomor} • ${formatDate(booking.startDate)}`,
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between"><span class="text-stone-500">Nama</span><b class="text-stone-800">${esc(booking.name)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">WhatsApp</span><b class="text-stone-800">${esc(booking.phone)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Email</span><b class="text-stone-800">${esc(booking.email || '—')}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Periode</span><b class="text-stone-800">${formatDate(booking.startDate)} — ${formatDate(booking.endDate)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Total sewa</span><b class="text-stone-800">${rupiah(booking.grandTotal)}</b></div>
          <div class="flex justify-between"><span class="text-stone-500">Deposit</span><b class="text-stone-800">${rupiah(booking.deposit)}</b></div>
          <div class="flex justify-between pt-2 border-t border-line"><span class="text-stone-500">Sisa sewa</span><b class="${remaining > 0 ? 'text-rose-700' : 'text-emerald-700'}">${rupiah(remaining)}</b></div>
        </div>
        ${
          remaining > 0
            ? `<div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2">
                ${icon('AlertTriangle', 'w-4 h-4 shrink-0 mt-0.5')}
                <span>Booking ini baru membayar deposit. Pilih <b>Tandai lunas</b> jika sisa sewa sudah diterima, atau <b>Check-in & tagih sisa</b> untuk mencatat tagihan.</span>
              </div>`
            : `<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${icon('CheckCircle2', 'w-4 h-4 shrink-0 mt-0.5')}
                <span>Sewa sudah lunas. Penghuni siap check-in.</span>
              </div>`
        }
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${remaining > 0 ? `<button type="button" class="btn-outline btn-sm" data-checkin-unpaid>Check-in & tagih sisa</button>` : ''}
      <button type="button" class="btn-primary btn-sm" data-checkin-settle>${icon('Check', 'w-4 h-4')} ${remaining > 0 ? 'Tandai lunas & check-in' : 'Check-in sekarang'}</button>
    `,
    onMount(el, close) {
      const doCheckin = (settle) => {
        try {
          checkInFromBooking(room.id, { settle });
          toast(`${booking.name} berhasil check-in di kamar ${room.nomor}.`);
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      };
      el.querySelector('[data-checkin-settle]')?.addEventListener('click', () => doCheckin(true));
      el.querySelector('[data-checkin-unpaid]')?.addEventListener('click', () => doCheckin(false));
    },
  });
}

/** Checkout confirmation with a settlement warning. */
export function openCheckoutModal(tenantId) {
  const tenant = getTenant(tenantId);
  if (!tenant) return;
  const outstanding = getOutstandingForTenant(tenantId);
  const depositAccount = getDepositAccount('tenant', tenantId);
  const depositHeld = depositAccount?.depositHeld || 0;

  openModal({
    title: `Check-out ${tenant.name}`,
    subtitle: `Kamar ${tenant.roomNumber || '-'} akan dikosongkan.`,
    size: 'md',
    body: `
      <div class="space-y-4">
        <div>
          <label class="label" for="co-date">Tanggal check-out</label>
          <input id="co-date" type="date" class="input" value="${todayISO()}" />
        </div>
        ${
          outstanding > 0
            ? `<div class="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2">
                ${icon('AlertTriangle', 'w-4 h-4 shrink-0 mt-0.5')}
                <span>Masih ada tunggakan <b>${rupiah(outstanding)}</b>. Check-out tetap dapat diproses, tagihan akan tetap tercatat.</span>
              </div>`
            : `<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${icon('CheckCircle2', 'w-4 h-4 shrink-0 mt-0.5')}
                <span>Tidak ada tunggakan. Kamar siap dikosongkan.</span>
              </div>`
        }

        ${
          depositHeld > 0
            ? `<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">Deposit ditahan</p>
                    <p class="text-xl font-black text-amber-900 mt-1">${rupiah(depositHeld)}</p>
                  </div>
                  <span class="badge-amber">Jaminan</span>
                </div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input id="co-refund-deposit" type="checkbox" class="w-4 h-4 accent-brand" checked />
                  <span class="text-xs font-bold text-stone-800">Kembalikan deposit saat check-out</span>
                </label>
                <div id="co-refund-wrap" class="grid sm:grid-cols-2 gap-2">
                  <div>
                    <label class="label" for="co-refund-amount">Nominal dikembalikan</label>
                    <input id="co-refund-amount" type="number" min="0" step="1000" class="input input-sm" value="${depositHeld}" />
                  </div>
                  <div>
                    <label class="label" for="co-refund-method">Metode</label>
                    <select id="co-refund-method" class="select">
                      ${PAYMENT_METHODS.map((method) => `<option value="${esc(method)}">${esc(method)}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <p class="text-[10px] text-amber-800 leading-relaxed">Pengembalian deposit dicatat sebagai kas keluar. Jika ada kerusakan, kurangi nominal atau hilangkan centang untuk menahan deposit.</p>
              </div>`
            : depositAccount && depositAccount.outstanding > 0
              ? `<div class="rounded-2xl border border-line bg-stone-50 p-3.5 text-xs text-stone-600">
                  Deposit belum dibayar penuh. Sisa deposit yang belum disetor: <b>${rupiah(depositAccount.outstanding)}</b>.
                </div>`
              : ''
        }

        <p class="hint">Riwayat hunian, pembayaran, dan deposit tetap tersimpan pada profil penghuni.</p>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-danger btn-sm" data-checkout>${icon('DoorOpen', 'w-4 h-4')} Proses check-out</button>
    `,
    onMount(el, close) {
      const refundToggle = el.querySelector('#co-refund-deposit');
      const refundWrap = el.querySelector('#co-refund-wrap');
      refundToggle?.addEventListener('change', () => {
        refundWrap?.classList.toggle('hidden', !refundToggle.checked);
      });

      el.querySelector('[data-checkout]')?.addEventListener('click', () => {
        const date = el.querySelector('#co-date').value || todayISO();
        try {
          if (refundToggle?.checked) {
            const amount = toNumber(el.querySelector('#co-refund-amount').value);
            if (amount > 0) {
              refundDeposit('tenant', tenant.id, amount, {
                date,
                method: el.querySelector('#co-refund-method').value,
                note: 'Pengembalian deposit check-out',
              });
            }
          }
          checkoutTenant(tenant.id, date);
          toast(`${tenant.name} berhasil check-out.`);
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Move a tenant to another vacant room. */
export function openMoveRoomModal(tenantId) {
  const tenant = getTenant(tenantId);
  if (!tenant) return;
  const tenantPeriode = String(tenant.periode || '1');
  const available = getRooms()
    .filter(
      (room) =>
        room.status === 'kosong' &&
        room.id !== tenant.roomId &&
        periodsForRoom(room).includes(tenantPeriode),
    )
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));

  openModal({
    title: 'Pindah Kamar',
    subtitle: `${tenant.name} • saat ini di kamar ${tenant.roomNumber || '—'}`,
    size: 'md',
    body: `
      <div class="space-y-4">
        ${
          available.length
            ? `
            <div>
              <label class="label" for="mv-room">Kamar tujuan</label>
              <select id="mv-room" class="select">
                ${available.map((room) => `<option value="${room.id}">Kamar ${room.nomor} — Lantai ${room.lantai}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="label" for="mv-date">Tanggal efektif pindah</label>
              <input id="mv-date" type="date" class="input" value="${todayISO()}" />
            </div>
            <p class="hint">Riwayat kamar akan diperbarui otomatis.</p>
          `
            : `<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Tidak ada kamar kosong yang tersedia saat ini.</div>`
        }
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${available.length ? `<button type="button" class="btn-primary btn-sm" data-move>${icon('Repeat', 'w-4 h-4')} Proses pindah</button>` : ''}
    `,
    onMount(el, close) {
      el.querySelector('[data-move]')?.addEventListener('click', () => {
        const roomId = el.querySelector('#mv-room').value;
        const date = el.querySelector('#mv-date').value || todayISO();
        try {
          const moved = moveTenant(tenant.id, roomId, date);
          toast(`${tenant.name} dipindahkan ke kamar ${moved.roomNumber}.`);
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Move a booking (pre-check-in) to another vacant room. */
export function openMoveBookingModal(roomId) {
  const source = getRoom(roomId);
  const booking = source?.booking;
  if (!source || !booking) {
    toast('Booking tidak ditemukan.', 'error');
    return;
  }

  const available = getRooms()
    .filter(
      (room) =>
        String(room.id) !== String(source.id) &&
        room.status === 'kosong' &&
        periodsForRoom(room).includes(String(booking.periode)),
    )
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));

  openModal({
    title: 'Pindah Kamar Booking',
    subtitle: `${booking.name} • sekarang di kamar ${source.nomor}`,
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5 text-xs text-indigo-900">
          Booking tetap tersimpan. Data tamu, promo, add-on, dan riwayat deposit ikut pindah. Harga dihitung ulang mengikuti tarif kamar tujuan.
        </div>
        ${
          available.length
            ? `
            <div>
              <label class="label" for="mb-room">Kamar tujuan</label>
              <select id="mb-room" class="select">
                ${available
                  .map(
                    (room) =>
                      `<option value="${room.id}">Kamar ${esc(room.nomor)} — Lantai ${esc(room.lantai)} · ${esc(roomType(room))}</option>`,
                  )
                  .join('')}
              </select>
            </div>
            <p class="hint">Riwayat perpindahan booking akan dicatat pada data booking.</p>
          `
            : `<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Tidak ada kamar kosong yang mendukung durasi ${esc(booking.periode)} saat ini.</div>`
        }
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      ${
        available.length
          ? `<button type="button" class="btn-primary btn-sm" data-move-booking>${icon('Repeat', 'w-4 h-4')} Pindahkan booking</button>`
          : ''
      }
    `,
    onMount(el, close) {
      el.querySelector('[data-move-booking]')?.addEventListener('click', () => {
        const targetId = el.querySelector('#mb-room').value;
        try {
          const moved = moveBooking(source.id, targetId);
          toast(`Booking ${moved.booking?.name || booking.name} dipindahkan ke kamar ${moved.nomor}.`);
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Extension shortcut used by the tenant table and detail modal. */
export function openExtendModal(tenantId) {
  const tenant = getTenant(tenantId);
  if (!tenant) {
    toast('Penghuni tidak ditemukan.', 'error');
    return;
  }
  const roomId = tenant.roomId;
  if (!roomId) {
    toast('Penghuni tidak memiliki kamar aktif.', 'error');
    return;
  }
  openBookingModal(roomId, 'extend', tenant.id);
}
