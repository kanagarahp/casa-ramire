import { PAYMENT_METHODS } from '../core/constants.js';
import { addDays, formatDate, rupiah, toNumber, todayISO } from '../core/format.js';
import { getState } from '../core/store.js';
import { createBill, createManualInvoice, verifyBill, verifyManualInvoice } from '../services/billing.js';
import { sendInvoiceByEmail } from '../services/billing-notify.js';
import { createInvoicePaymentLink, openPaymentLinkModal } from '../services/payments.js';
import { getTenants } from '../services/property.js';
import { esc, setBusy } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

/** Verify a rent bill or a manual service invoice. */
export function openVerifyModal({ kind = 'bill', id }) {
  const state = getState();
  const record =
    kind === 'invoice'
      ? state.manualInvoices.find((item) => String(item.id) === String(id))
      : state.bills.find((item) => String(item.id) === String(id));

  if (!record) {
    toast('Data tagihan tidak ditemukan.', 'error');
    return;
  }

  const isPaid = record.status === 'paid';
  const title = kind === 'invoice' ? 'Verifikasi Invoice Layanan' : 'Verifikasi Pembayaran Sewa';

  openModal({
    title,
    subtitle: `${record.tenantName || '—'} • Kamar ${record.roomNumber || '—'}`,
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nomor</span><b class="text-stone-800 font-mono text-[11px]">${esc(record.number || '—')}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Jenis</span><b class="text-stone-800">${esc(record.type || record.item || '—')}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Jatuh tempo</span><b class="text-stone-800">${esc(record.dueDate || '—')}</b></div>
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="text-stone-500">Nominal</span><b class="text-stone-800 text-base">${rupiah(record.amount)}</b></div>
        </div>

        ${
          isPaid
            ? `<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                ${icon('CheckCircle2', 'w-4 h-4 shrink-0 mt-0.5')}
                <span>Pembayaran sudah diverifikasi${record.method ? ` via <b>${esc(record.method)}</b>` : ''}.</span>
              </div>`
            : ''
        }

        <div>
          <label class="label" for="vf-method">Metode pembayaran</label>
          <select id="vf-method" class="select" ${isPaid ? 'disabled' : ''}>
            ${PAYMENT_METHODS.map((method) => `<option value="${method}" ${record.method === method ? 'selected' : ''}>${method}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="label" for="vf-note">Catatan pengirim / referensi</label>
          <input id="vf-note" type="text" class="input" placeholder="cth: transfer a.n. Budi / no. referensi" value="${esc(record.note || '')}" ${isPaid ? 'disabled' : ''} />
        </div>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>${isPaid ? 'Tutup' : 'Batal'}</button>
      ${
        isPaid
          ? ''
          : `<button type="button" class="btn-primary btn-sm" data-confirm>${icon('ShieldCheck', 'w-4 h-4')} Verifikasi & Tandai Lunas</button>`
      }
    `,
    onMount(el, close) {
      el.querySelector('[data-confirm]')?.addEventListener('click', () => {
        const method = el.querySelector('#vf-method').value;
        const note = el.querySelector('#vf-note').value.trim();
        try {
          if (kind === 'invoice') verifyManualInvoice(id, { method, note });
          else verifyBill(id, { method, note });
          toast('Pembayaran berhasil diverifikasi.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Create an additional rent/utility bill for an active tenant. */
export function openCreateBillModal() {
  const tenants = getTenants({ activeOnly: true });
  if (!tenants.length) {
    toast('Belum ada penghuni aktif. Tambahkan penghuni terlebih dahulu.', 'warning');
    return;
  }

  openModal({
    title: 'Buat Tagihan Baru',
    subtitle: 'Tagihan tambahan di luar sewa utama.',
    size: 'md',
    body: `
      <form id="bill-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="bl-tenant">Penghuni / kamar</label>
          <select id="bl-tenant" class="select">
            ${tenants.map((tenant) => `<option value="${tenant.id}">${esc(tenant.name)} — Kamar ${esc(tenant.roomNumber || '—')}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="label" for="bl-type">Jenis tagihan</label>
          <input id="bl-type" type="text" list="bill-type-list" class="input" placeholder="cth: Listrik bulan ini" value="Tagihan Tambahan" />
          <datalist id="bill-type-list">
            <option value="Tagihan Tambahan"></option>
            <option value="Listrik"></option>
            <option value="Air"></option>
            <option value="Kebersihan"></option>
            <option value="Denda Keterlambatan"></option>
            <option value="Kerusakan"></option>
          </datalist>
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="bl-amount">Nominal (Rp)</label>
            <input id="bl-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 150000" />
          </div>
          <div>
            <label class="label" for="bl-due">Jatuh tempo</label>
            <input id="bl-due" type="date" class="input" value="${addDays(todayISO(), 7)}" />
          </div>
        </div>
        <div>
          <label class="label" for="bl-note">Catatan</label>
          <input id="bl-note" type="text" class="input" placeholder="Opsional" />
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="bill-form" class="btn-primary btn-sm" data-submit>${icon('ReceiptText', 'w-4 h-4')} Simpan tagihan</button>
    `,
    onMount(el, close) {
      el.querySelector('#bill-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          createBill({
            tenantId: el.querySelector('#bl-tenant').value,
            type: el.querySelector('#bl-type').value,
            amount: toNumber(el.querySelector('#bl-amount').value),
            dueDate: el.querySelector('#bl-due').value || todayISO(),
            note: el.querySelector('#bl-note').value.trim(),
          });
          toast('Tagihan baru berhasil dibuat.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Create a non-rent service invoice for a tenant or a non-tenant payer. */
export function openManualInvoiceModal(preselectedRoomId = '') {
  const state = getState();
  const tenantsById = new Map(state.tenants.map((tenant) => [String(tenant.id), tenant]));
  const occupiedRooms = state.rooms
    .filter((room) => room.tenantId)
    .sort((a, b) => a.nomor.localeCompare(b.nomor, undefined, { numeric: true }));

  const initialRoom =
    occupiedRooms.find((room) => String(room.id) === String(preselectedRoomId)) ||
    occupiedRooms[0] ||
    null;

  const tenantNameOf = (roomId) => {
    const room = occupiedRooms.find((item) => String(item.id) === String(roomId));
    return tenantsById.get(String(room?.tenantId))?.name || '';
  };

  openModal({
    title: 'Buat Invoice Manual',
    subtitle: 'Untuk layanan non-sewa: laundry, perbaikan, fasilitas, dll.',
    size: 'md',
    body: `
      <form id="invoice-form" class="space-y-4" novalidate>
        <div>
          <span class="label">Target invoice</span>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line p-2.5 hover:bg-stone-50">
              <input type="radio" name="iv-mode" value="tenant" class="accent-brand" ${occupiedRooms.length ? 'checked' : ''} />
              <span class="text-xs font-bold text-stone-700">Tenant / penghuni</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer rounded-xl border border-line p-2.5 hover:bg-stone-50">
              <input type="radio" name="iv-mode" value="non-tenant" class="accent-brand" ${occupiedRooms.length ? '' : 'checked'} />
              <span class="text-xs font-bold text-stone-700">Non tenant</span>
            </label>
          </div>
        </div>

        <div id="iv-tenant-section" class="space-y-3 ${occupiedRooms.length ? '' : 'hidden'}">
          <div>
            <label class="label" for="iv-room">No. kamar</label>
            <select id="iv-room" class="select">
              ${occupiedRooms
                .map(
                  (room) => `<option value="${room.id}" ${initialRoom?.id === room.id ? 'selected' : ''}>Kamar ${esc(room.nomor)} — ${esc(tenantNameOf(room.id))}</option>`,
                )
                .join('')}
            </select>
          </div>
          <div class="rounded-xl border border-line bg-cream/60 px-3 py-2.5 text-xs">
            <span class="text-stone-500">Nama penghuni:</span>
            <b id="iv-tenant-name" class="text-stone-800">${esc(initialRoom ? tenantNameOf(initialRoom.id) : '—')}</b>
          </div>
        </div>

        <div id="iv-non-tenant-section" class="space-y-3 ${occupiedRooms.length ? 'hidden' : ''}">
          <div>
            <label class="label" for="iv-name">Nama penerima</label>
            <input id="iv-name" type="text" class="input" placeholder="cth: Budi (laundry)" />
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="iv-email">Email</label>
              <input id="iv-email" type="email" class="input" placeholder="nama@email.com" />
            </div>
            <div>
              <label class="label" for="iv-phone">No. telepon</label>
              <input id="iv-phone" type="tel" class="input" placeholder="cth: 08123456789" />
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="iv-item">Item layanan</label>
          <input id="iv-item" type="text" class="input" placeholder="cth: Laundry 5 Kg / Ganti kunci" />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="iv-amount">Nominal (Rp)</label>
            <input id="iv-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 50000" />
          </div>
          <div>
            <label class="label" for="iv-due">Tanggal</label>
            <input id="iv-due" type="date" class="input" value="${todayISO()}" />
          </div>
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="invoice-form" class="btn-primary btn-sm" data-submit>${icon('FilePlus2', 'w-4 h-4')} Terbitkan invoice</button>
    `,
    onMount(el, close) {
      const tenantSection = el.querySelector('#iv-tenant-section');
      const nonTenantSection = el.querySelector('#iv-non-tenant-section');
      const roomSelect = el.querySelector('#iv-room');
      const nameLabel = el.querySelector('#iv-tenant-name');

      const currentMode = () =>
        el.querySelector('input[name="iv-mode"]:checked')?.value || 'non-tenant';

      const syncMode = () => {
        const tenantMode = currentMode() === 'tenant';
        tenantSection.classList.toggle('hidden', !tenantMode);
        nonTenantSection.classList.toggle('hidden', tenantMode);
      };

      const syncTenantName = () => {
        if (!roomSelect || !nameLabel) return;
        nameLabel.textContent = tenantNameOf(roomSelect.value) || '—';
      };

      el.querySelectorAll('input[name="iv-mode"]').forEach((radio) => {
        radio.addEventListener('change', syncMode);
      });
      roomSelect?.addEventListener('change', syncTenantName);
      syncMode();
      syncTenantName();

      el.querySelector('#invoice-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          const mode = currentMode();
          const selectedRoom = occupiedRooms.find(
            (room) => String(room.id) === String(roomSelect?.value),
          );
          const invoice = createManualInvoice({
            mode,
            tenantId: mode === 'tenant' ? selectedRoom?.tenantId : null,
            roomId: mode === 'tenant' ? selectedRoom?.id : null,
            name: mode === 'non-tenant' ? el.querySelector('#iv-name').value : '',
            email: mode === 'non-tenant' ? el.querySelector('#iv-email').value : '',
            phone: mode === 'non-tenant' ? el.querySelector('#iv-phone').value : '',
            item: el.querySelector('#iv-item').value,
            amount: toNumber(el.querySelector('#iv-amount').value),
            dueDate: el.querySelector('#iv-due').value || todayISO(),
          });
          toast('Invoice manual berhasil diterbitkan.');
          close();
          setTimeout(() => openInvoiceIssuedModal(invoice), 0);
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

/** Post-issue actions: create a DOKU link or email the bill directly. */
export function openInvoiceIssuedModal(invoice) {
  if (!invoice) return;
  openModal({
    title: 'Invoice Diterbitkan',
    subtitle: `${invoice.number} • ${invoice.tenantName || '—'}`,
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">${esc(invoice.item || 'Invoice layanan')}</p>
          <p class="text-2xl font-black text-emerald-900 mt-1">${rupiah(invoice.amount)}</p>
          <p class="text-[11px] text-emerald-800 mt-0.5">Tanggal: ${formatDate(invoice.dueDate)}</p>
        </div>
        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nomor</span><b class="font-mono text-[11px] text-stone-800">${esc(invoice.number)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Penerima</span><b class="text-stone-800">${esc(invoice.tenantName || '—')}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Email</span><b class="text-stone-800">${esc(invoice.email || 'belum diisi')}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Kamar</span><b class="text-stone-800">${esc(invoice.roomNumber || '—')}</b></div>
        </div>
        ${
          invoice.email
            ? ''
            : `<div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">Email belum diisi. Tambahkan email agar tagihan bisa dikirim langsung.</div>`
        }
        <div class="rounded-xl border border-line bg-white px-3 py-2.5 text-[11px] text-stone-600 leading-relaxed">
          Pilih <b>Buat Link DOKU</b> untuk menyalin link pembayaran, atau <b>Kirim Tagihan</b> untuk membuat link dan mengirimkannya langsung ke email penerima.
        </div>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      <button type="button" class="btn-outline btn-sm" data-doku>${icon('CreditCard', 'w-4 h-4')} Buat Link DOKU</button>
      <button type="button" class="btn-primary btn-sm" data-send>${icon('Send', 'w-4 h-4')} Kirim Tagihan</button>
    `,
    onMount(el, close) {
      el.querySelector('[data-doku]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        setBusy(button, true, 'Membuat link…');
        try {
          const result = await createInvoicePaymentLink(invoice);
          close();
          openPaymentLinkModal({
            title: 'Link Pembayaran Invoice',
            subtitle: `${invoice.tenantName || '—'} • Kamar ${invoice.roomNumber || '—'}`,
            paymentUrl: result.paymentUrl,
            invoiceNumber: result.invoiceNumber,
            amount: result.amount,
            expiresAt: result.expiresAt,
            phone: invoice.phone || '',
            email: invoice.email || '',
            recipientName: invoice.tenantName || '',
            message: `Halo Kak ${invoice.tenantName || ''}, berikut invoice ${invoice.item} sebesar ${rupiah(invoice.amount)}.`,
          });
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(button, false);
        }
      });

      el.querySelector('[data-send]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        if (!invoice.email) {
          toast('Email penerima belum diisi.', 'warning');
          return;
        }
        setBusy(button, true, 'Mengirim…');
        try {
          const { delivery } = await sendInvoiceByEmail(invoice);
          close();
          toast(
            delivery.sent
              ? `Tagihan dikirim ke ${invoice.email}.`
              : 'Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.',
            delivery.sent ? 'success' : 'warning',
          );
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(button, false);
        }
      });
    },
  });
}
