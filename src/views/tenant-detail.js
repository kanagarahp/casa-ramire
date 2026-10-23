import { formatDate, formatDateTime, rupiah, toNumber } from '../core/format.js';
import { getState } from '../core/store.js';
import {
  deleteTenant,
  getOutstandingForTenant,
  getRoomOfTenant,
  getTenant,
  updateTenant,
} from '../services/property.js';
import { avatar, billBadge } from '../ui/components.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import {
  openCheckoutModal,
  openExtendModal,
  openMoveRoomModal,
} from './booking-modal.js';

function tabButton(id, label, iconName, active) {
  return `
    <button type="button" class="${active ? 'bg-brand text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'} px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5" data-tab="${id}">
      ${icon(iconName, 'w-3.5 h-3.5')} ${label}
    </button>
  `;
}

/**
 * Full tenant profile: biodata, room history, payment history and lifecycle actions.
 */
export function openTenantDetail(tenantId) {
  const tenant = getTenant(tenantId);
  if (!tenant) {
    toast('Penghuni tidak ditemukan.', 'error');
    return;
  }

  const state = getState();
  const room = getRoomOfTenant(tenant);
  const bills = state.bills
    .filter((bill) => String(bill.tenantId) === String(tenant.id))
    .sort((a, b) => b.id - a.id);
  const invoices = state.manualInvoices
    .filter((invoice) => String(invoice.tenantId) === String(tenant.id))
    .sort((a, b) => b.id - a.id);
  const outstanding = getOutstandingForTenant(tenant.id);

  const payments = [
    ...bills.map((bill) => ({
      key: `bill-${bill.id}`,
      label: bill.description || bill.type,
      date: bill.paidAt || bill.dueDate,
      amount: bill.status === 'paid' ? bill.paid : bill.amount,
      status: bill.status,
      note: bill.status === 'paid' ? bill.method : 'Belum dibayar',
    })),
    ...invoices.map((invoice) => ({
      key: `invoice-${invoice.id}`,
      label: `${invoice.item} (${invoice.number})`,
      date: invoice.paidAt || invoice.dueDate,
      amount: invoice.status === 'paid' ? invoice.paid : invoice.amount,
      status: invoice.status,
      note: invoice.status === 'paid' ? invoice.method : 'Belum dibayar',
    })),
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  if (toNumber(tenant.depositPaid) > 0) {
    payments.unshift({
      key: 'deposit',
      label: 'Deposit / jaminan',
      date: tenant.checkinDate,
      amount: tenant.depositPaid,
      status: 'paid',
      note: 'Deposit check-in',
    });
  }

  const paidTotal = payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);
  const unpaidTotal = payments
    .filter((payment) => payment.status !== 'paid')
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

  const isActive = tenant.status === 'aktif';
  const history = tenant.stayHistory || [];

  const body = `
    <div class="space-y-5">
      <div class="rounded-2xl border border-line bg-cream/60 p-4">
        <div class="flex flex-wrap items-center gap-3">
          ${avatar(tenant.name, 'w-12 h-12 text-sm')}
          <div class="min-w-0 flex-1">
            <h3 class="font-black text-stone-800 text-lg leading-tight">${esc(tenant.name)}</h3>
            <p class="text-xs text-stone-500 mt-0.5">
              ${isActive ? `Kamar ${esc(room?.nomor || tenant.roomNumber || '—')} · ${esc(tenant.periode || '')} ${tenant.periode === 'harian' ? 'hari' : tenant.periode === 'mingguan' ? 'minggu' : 'bulan'}` : 'Sudah check-out'}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="${isActive ? 'badge-green' : 'badge-gray'}">${isActive ? 'Aktif' : 'Checkout'}</span>
            ${outstanding > 0 ? `<span class="badge-red">Tunggakan ${rupiah(outstanding)}</span>` : ''}
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Mulai</p><p class="font-bold text-stone-700">${formatDate(tenant.startDate)}</p></div>
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Berakhir</p><p class="font-bold text-stone-700">${formatDate(tenant.endDate)}</p></div>
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Nilai kontrak</p><p class="font-bold text-stone-700">${rupiah(tenant.contractTotal)}</p></div>
          <div><p class="text-stone-400 font-bold uppercase text-[9px]">Sisa tagihan</p><p class="font-bold ${outstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}">${rupiah(outstanding)}</p></div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 border-b border-line pb-2">
        ${tabButton('biodata', 'Biodata', 'UserRound', true)}
        ${tabButton('stay', 'Riwayat Kamar', 'ScrollText', false)}
        ${tabButton('payment', 'Riwayat Pembayaran', 'Receipt', false)}
      </div>

      <div id="dt-biodata" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="td-name">Nama lengkap</label>
            <input id="td-name" type="text" class="input" value="${esc(tenant.name)}" />
          </div>
          <div>
            <label class="label" for="td-phone">No. WhatsApp</label>
            <input id="td-phone" type="tel" class="input" value="${esc(tenant.phone)}" />
          </div>
          <div class="sm:col-span-2">
            <label class="label" for="td-job">Pekerjaan / instansi</label>
            <input id="td-job" type="text" class="input" value="${esc(tenant.job || '')}" />
          </div>
        </div>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            ${icon('PhoneCall', 'w-3.5 h-3.5 text-rose-500')} Kontak darurat
          </p>
          <div class="grid sm:grid-cols-3 gap-2">
            <div>
              <label class="label" for="td-ec-name">Nama</label>
              <input id="td-ec-name" type="text" class="input input-sm" value="${esc(tenant.emergencyContact?.name || '')}" />
            </div>
            <div>
              <label class="label" for="td-ec-relation">Hubungan</label>
              <input id="td-ec-relation" type="text" class="input input-sm" value="${esc(tenant.emergencyContact?.relation || '')}" />
            </div>
            <div>
              <label class="label" for="td-ec-phone">No. telepon</label>
              <input id="td-ec-phone" type="tel" class="input input-sm" value="${esc(tenant.emergencyContact?.phone || '')}" />
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="td-notes">Catatan admin</label>
          <textarea id="td-notes" rows="3" class="input bg-amber-50/40 border-amber-200" placeholder="Catatan khusus, permintaan, atau reminder">${esc(tenant.notes || '')}</textarea>
        </div>
      </div>

      <div id="dt-stay" class="hidden">
        ${
          history.length
            ? `<div class="overflow-x-auto">
                <table class="data-table">
                  <thead><tr><th>Kamar</th><th>Lantai</th><th>Mulai</th><th>Selesai</th></tr></thead>
                  <tbody>
                    ${history
                      .map(
                        (entry) => `
                        <tr>
                          <td class="font-bold text-stone-800">Kamar ${esc(entry.roomNumber)}</td>
                          <td>Lantai ${esc(entry.floor || '—')}</td>
                          <td>${formatDate(entry.from)}</td>
                          <td>${entry.to ? formatDate(entry.to) : '<span class="badge-green">Berjalan</span>'}</td>
                        </tr>`,
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>`
            : `<div class="rounded-2xl border border-line bg-stone-50 p-6 text-center text-sm text-stone-500">Belum ada riwayat kamar.</div>`
        }
      </div>

      <div id="dt-payment" class="hidden space-y-4">
        <div class="grid sm:grid-cols-3 gap-3">
          <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Total dibayar</p>
            <p class="font-black text-emerald-900 text-lg">${rupiah(paidTotal)}</p>
          </div>
          <div class="rounded-2xl border border-rose-200 bg-rose-50 p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-rose-700">Belum dibayar</p>
            <p class="font-black text-rose-900 text-lg">${rupiah(unpaidTotal)}</p>
          </div>
          <div class="rounded-2xl border border-line bg-white p-3">
            <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Nilai kontrak</p>
            <p class="font-black text-stone-800 text-lg">${rupiah(tenant.contractTotal)}</p>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-line">
          <table class="data-table">
            <thead><tr><th>Item</th><th>Tanggal</th><th>Nominal</th><th>Status</th></tr></thead>
            <tbody>
              ${
                payments.length
                  ? payments
                      .map(
                        (payment) => `
                        <tr>
                          <td class="font-semibold text-stone-700">${esc(payment.label)}<p class="text-[10px] text-stone-400">${esc(payment.note || '')}</p></td>
                          <td class="whitespace-nowrap">${formatDateTime(payment.date)}</td>
                          <td class="font-bold ${payment.status === 'paid' ? 'text-stone-800' : 'text-rose-700'}">${rupiah(payment.amount)}</td>
                          <td>${billBadge(payment.status)}</td>
                        </tr>`,
                      )
                      .join('')
                  : `<tr><td colspan="4" class="text-center py-8 text-stone-400">Belum ada riwayat pembayaran.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  openModal({
    title: 'Detail Penghuni',
    subtitle: `${tenant.name}${room ? ` • Kamar ${room.nomor}` : ''}`,
    size: 'xl',
    body,
    footer: `
      <div class="w-full flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap gap-2">
          ${isActive ? `
            <button type="button" class="btn-outline btn-sm" data-action="extend">${icon('Repeat', 'w-4 h-4')} Perpanjang</button>
            <button type="button" class="btn-outline btn-sm" data-action="move">${icon('ArrowRight', 'w-4 h-4')} Pindah Kamar</button>
            <button type="button" class="btn-danger-soft btn-sm" data-action="checkout">${icon('DoorOpen', 'w-4 h-4')} Check-out</button>
          ` : `
            <button type="button" class="btn-danger-soft btn-sm" data-action="delete">${icon('Trash2', 'w-4 h-4')} Hapus data</button>
          `}
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
          <button type="button" class="btn-primary btn-sm" data-action="save">${icon('Check', 'w-4 h-4')} Simpan perubahan</button>
        </div>
      </div>
    `,
    onMount(el, close) {
      const tabs = {
        biodata: el.querySelector('#dt-biodata'),
        stay: el.querySelector('#dt-stay'),
        payment: el.querySelector('#dt-payment'),
      };
      el.querySelectorAll('[data-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          const target = button.dataset.tab;
          Object.entries(tabs).forEach(([key, section]) => section.classList.toggle('hidden', key !== target));
          el.querySelectorAll('[data-tab]').forEach((item) => {
            const active = item.dataset.tab === target;
            item.className = `${active ? 'bg-brand text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'} px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5`;
          });
        });
      });

      el.querySelector('[data-action="save"]')?.addEventListener('click', () => {
        try {
          updateTenant(tenant.id, {
            name: el.querySelector('#td-name').value,
            phone: el.querySelector('#td-phone').value,
            job: el.querySelector('#td-job').value,
            notes: el.querySelector('#td-notes').value,
            emergencyContact: {
              name: el.querySelector('#td-ec-name').value,
              relation: el.querySelector('#td-ec-relation').value,
              phone: el.querySelector('#td-ec-phone').value,
            },
          });
          toast('Data penghuni berhasil diperbarui.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });

      el.querySelector('[data-action="extend"]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openExtendModal(tenant.id), 0);
      });

      el.querySelector('[data-action="move"]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openMoveRoomModal(tenant.id), 0);
      });

      el.querySelector('[data-action="checkout"]')?.addEventListener('click', () => {
        close();
        setTimeout(() => openCheckoutModal(tenant.id), 0);
      });

      el.querySelector('[data-action="delete"]')?.addEventListener('click', async () => {
        const approved = await confirmAction({
          title: 'Hapus data penghuni?',
          message: `Data <b>${esc(tenant.name)}</b> akan dihapus permanen. Riwayat tagihan tetap tersimpan tanpa tautan ke profil ini.`,
          confirmText: 'Ya, hapus',
          danger: true,
        });
        if (!approved) return;
        try {
          deleteTenant(tenant.id);
          toast('Data penghuni berhasil dihapus.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
