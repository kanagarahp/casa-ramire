import { PAYMENT_METHODS } from '../core/constants.js';
import { addDays, rupiah, toNumber, todayISO } from '../core/format.js';
import { getState } from '../core/store.js';
import { createBill, createManualInvoice, verifyBill, verifyManualInvoice } from '../services/billing.js';
import { getTenants } from '../services/property.js';
import { esc } from '../ui/dom.js';
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

/** Create a non-rent service invoice for a room. */
export function openManualInvoiceModal(preselectedRoomId = '') {
  const rooms = [...getState().rooms].sort((a, b) =>
    a.nomor.localeCompare(b.nomor, undefined, { numeric: true }),
  );

  const roomLabel = (room) => {
    const tenant = room.tenantId
      ? getState().tenants.find((item) => String(item.id) === String(room.tenantId))
      : null;
    const name = tenant?.name || room.booking?.name || '';
    return `Kamar ${room.nomor}${name ? ` — ${name}` : ' — kosong'}`;
  };

  openModal({
    title: 'Buat Invoice Manual',
    subtitle: 'Untuk layanan non-sewa: laundry, perbaikan, fasilitas, dll.',
    size: 'md',
    body: `
      <form id="invoice-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="iv-room">Kamar target</label>
          <select id="iv-room" class="select">
            ${rooms.map((room) => `<option value="${room.id}" ${String(room.id) === String(preselectedRoomId) ? 'selected' : ''}>${esc(roomLabel(room))}</option>`).join('')}
          </select>
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
            <label class="label" for="iv-due">Jatuh tempo</label>
            <input id="iv-due" type="date" class="input" value="${addDays(todayISO(), 7)}" />
          </div>
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="invoice-form" class="btn-primary btn-sm" data-submit>${icon('FilePlus2', 'w-4 h-4')} Terbitkan invoice</button>
    `,
    onMount(el, close) {
      el.querySelector('#invoice-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          createManualInvoice({
            roomId: el.querySelector('#iv-room').value,
            item: el.querySelector('#iv-item').value,
            amount: toNumber(el.querySelector('#iv-amount').value),
            dueDate: el.querySelector('#iv-due').value || todayISO(),
          });
          toast('Invoice manual berhasil diterbitkan.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
