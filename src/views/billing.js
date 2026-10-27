import {
  formatDate,
  isInMonth,
  rupiah,
  toNumber,
  todayISO,
  waLink,
} from '../core/format.js';
import {
  deleteBill,
  getBills,
  markBillUnpaid,
} from '../services/billing.js';
import { createBillPaymentLink, openPaymentLinkModal } from '../services/payments.js';
import { buildMessage } from '../services/templates.js';
import {
  billBadge,
  cardHeader,
  emptyState,
  pageHeader,
  statCard,
} from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import {
  openCreateBillModal,
  openManualInvoiceModal,
  openVerifyModal,
} from './billing-modals.js';

let statusFilter = 'semua';
let searchTerm = '';

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'unpaid', label: 'Belum Bayar' },
  { key: 'paid', label: 'Lunas' },
];

function isOverdue(bill) {
  return bill.status === 'unpaid' && Boolean(bill.dueDate) && bill.dueDate < todayISO();
}

function billRow(bill) {
  const overdue = isOverdue(bill);
  const message = buildMessage('tagihan', {
    nama: bill.tenantName || 'Penghuni',
    kamar: bill.roomNumber || '—',
    nominal: rupiah(bill.amount),
    jatuh_tempo: formatDate(bill.dueDate),
    no_invoice: bill.number,
  });

  return `
    <tr>
      <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${esc(bill.number || '—')}</td>
      <td>
        <p class="font-bold text-stone-800">${esc(bill.tenantName || '—')}</p>
        <p class="text-[10px] text-stone-600">Kamar ${esc(bill.roomNumber || '—')}</p>
      </td>
      <td>
        <p class="font-semibold text-stone-700">${esc(bill.type || 'Sewa')}</p>
        ${bill.description ? `<p class="text-[10px] text-stone-600 max-w-[240px] truncate">${esc(bill.description)}</p>` : ''}
      </td>
      <td class="font-black text-stone-800 whitespace-nowrap">${rupiah(bill.amount)}</td>
      <td class="whitespace-nowrap">
        <span class="${overdue ? 'text-rose-700 font-bold' : ''}">${formatDate(bill.dueDate)}</span>
        ${overdue ? '<p class="text-[10px] font-bold text-rose-600">Terlambat</p>' : ''}
      </td>
      <td>${billBadge(bill.status)}</td>
      <td>
        <div class="flex flex-wrap items-center justify-end gap-1">
          ${
            bill.status === 'unpaid'
              ? `
                <button type="button" class="btn-outline btn-xs" data-action="doku-link" data-id="${bill.id}">${icon('CreditCard', 'w-3 h-3')} Link DOKU</button>
                <button type="button" class="btn-primary btn-xs" data-action="verify" data-id="${bill.id}">${icon('ShieldCheck', 'w-3 h-3')} Verifikasi</button>
                ${
                  bill.phone
                    ? `<a href="${waLink(bill.phone, message)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan via WhatsApp">${icon('MessageCircle', 'w-4 h-4')}</a>`
                    : ''
                }
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${bill.id}" title="Hapus tagihan">${icon('Trash2', 'w-3.5 h-3.5')}</button>
              `
              : `
                <button type="button" class="btn-outline btn-xs" data-action="unverify" data-id="${bill.id}">Batalkan</button>
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${bill.id}" title="Hapus tagihan">${icon('Trash2', 'w-3.5 h-3.5')}</button>
              `
          }
        </div>
      </td>
    </tr>
  `;
}

export function render(root) {
  const bills = getBills();
  const unpaid = bills.filter((bill) => bill.status === 'unpaid');
  const paidThisMonth = bills.filter(
    (bill) => bill.status === 'paid' && isInMonth(bill.paidAt || bill.dueDate),
  );
  const outstanding = unpaid.reduce(
    (sum, bill) => sum + Math.max(0, toNumber(bill.amount) - toNumber(bill.paid)),
    0,
  );
  const collectedThisMonth = paidThisMonth.reduce(
    (sum, bill) => sum + toNumber(bill.paid || bill.amount),
    0,
  );
  const overdueCount = unpaid.filter(isOverdue).length;

  root.innerHTML = `
    <div data-view="billing" class="animate-in">
      ${pageHeader({
        eyebrow: 'Cash Verification',
        title: 'Sewa & Verifikasi Kas 🧾',
        subtitle: 'Pantau tagihan sewa, verifikasi pembayaran, dan kirim pengingat WhatsApp.',
        actions: `
          <button type="button" class="btn-outline btn-sm" data-action="add-invoice">${icon('FilePlus2', 'w-4 h-4')} Invoice Layanan</button>
          <button type="button" class="btn-primary btn-sm" data-action="add-bill">${icon('Plus', 'w-4 h-4')} Buat Tagihan</button>
        `,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${statCard({
          label: 'Belum Dibayar',
          value: rupiah(outstanding),
          iconName: 'CircleAlert',
          tone: outstanding > 0 ? 'rose' : 'green',
          hint: `${unpaid.length} tagihan aktif`,
        })}
        ${statCard({
          label: 'Terverifikasi Bulan Ini',
          value: rupiah(collectedThisMonth),
          iconName: 'ShieldCheck',
          tone: 'green',
          hint: `${paidThisMonth.length} tagihan lunas`,
        })}
        ${statCard({
          label: 'Lewat Jatuh Tempo',
          value: overdueCount,
          iconName: 'Clock',
          tone: overdueCount > 0 ? 'amber' : 'default',
          hint: overdueCount > 0 ? 'Perlu ditindaklanjuti' : 'Semua tepat waktu',
        })}
        ${statCard({
          label: 'Total Tagihan',
          value: bills.length,
          iconName: 'ReceiptText',
          hint: `Nilai ${rupiah(bills.reduce((sum, bill) => sum + toNumber(bill.amount), 0))}`,
        })}
      </div>

      <div class="card p-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex flex-wrap gap-2" id="bill-filters">
          ${FILTERS.map(
            (filter) => `
            <button type="button" class="${statusFilter === filter.key ? 'chip-active' : 'chip-idle'}" data-filter="${filter.key}">
              ${filter.label} (${filter.key === 'semua' ? bills.length : bills.filter((bill) => bill.status === filter.key).length})
            </button>`,
          ).join('')}
        </div>
        <div class="relative sm:ml-auto sm:w-72">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">${icon('Search', 'w-3.5 h-3.5')}</span>
          <input id="bill-search" type="search" class="input input-sm pl-8" placeholder="Cari nomor / nama / kamar…" value="${esc(searchTerm)}" />
        </div>
      </div>

      <div id="bill-content"></div>
    </div>
  `;

  const scope = root.querySelector('[data-view="billing"]');
  const content = scope.querySelector('#bill-content');
  const searchInput = scope.querySelector('#bill-search');

  const syncFilters = () => {
    scope.querySelectorAll('[data-filter]').forEach((button) => {
      button.className = button.dataset.filter === statusFilter ? 'chip-active' : 'chip-idle';
    });
  };

  const paint = () => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = bills
      .filter((bill) => (statusFilter === 'semua' ? true : bill.status === statusFilter))
      .filter((bill) => {
        if (!term) return true;
        return [
          bill.number,
          bill.tenantName,
          bill.roomNumber,
          bill.type,
          bill.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);
      });

    if (!filtered.length) {
      content.innerHTML = `
        <div class="card">
          ${emptyState({
            iconName: 'ReceiptText',
            title: 'Tidak ada tagihan',
            description:
              statusFilter === 'unpaid'
                ? 'Semua tagihan sudah lunas. Kerja bagus! 🎉'
                : 'Belum ada tagihan yang cocok dengan filter atau pencarian.',
            action: `<button type="button" class="btn-primary btn-sm" data-action="add-bill">${icon('Plus', 'w-4 h-4')} Buat Tagihan</button>`,
          })}
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="card overflow-hidden">
        ${cardHeader({
          title: 'Daftar Tagihan Sewa',
          description: `${filtered.length} tagihan ditampilkan · total ${rupiah(filtered.reduce((sum, bill) => sum + toNumber(bill.amount), 0))}`,
          actions: `<span class="badge-gold">${unpaid.length} belum bayar</span>`,
        })}
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Tagihan</th>
                <th>Penghuni</th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>${filtered.map(billRow).join('')}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  syncFilters();
  paint();

  scope.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      statusFilter = button.dataset.filter;
      syncFilters();
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

    if (action === 'add-bill') {
      openCreateBillModal();
      return;
    }

    if (action === 'add-invoice') {
      openManualInvoiceModal();
      return;
    }

    if (action === 'doku-link') {
      const bill = getBills().find((item) => String(item.id) === String(id));
      if (!bill) return;
      const message = buildMessage('tagihan', {
        nama: bill.tenantName || 'Penghuni',
        kamar: bill.roomNumber || '—',
        nominal: rupiah(bill.amount),
        jatuh_tempo: formatDate(bill.dueDate),
        no_invoice: bill.number,
      });
      try {
        const result = await createBillPaymentLink(bill);
        openPaymentLinkModal({
          title: `Link Pembayaran — ${bill.type || 'Tagihan'}`,
          subtitle: `${bill.tenantName || '—'} • Kamar ${bill.roomNumber || '—'}`,
          paymentUrl: result.paymentUrl,
          invoiceNumber: result.invoiceNumber,
          amount: result.amount,
          expiresAt: result.expiresAt,
          phone: bill.phone || '',
          message,
        });
      } catch (error) {
        toast(error.message, 'error');
      }
      return;
    }

    if (action === 'verify') {
      openVerifyModal({ kind: 'bill', id });
      return;
    }

    if (action === 'unverify') {
      const approved = await confirmAction({
        title: 'Batalkan verifikasi?',
        message:
          'Tagihan akan kembali berstatus <b>belum dibayar</b> dan pembayaran penghuni akan dikurangi sesuai nominal tagihan.',
        confirmText: 'Ya, batalkan',
        danger: true,
      });
      if (!approved) return;
      try {
        markBillUnpaid(id);
        toast('Verifikasi pembayaran dibatalkan.', 'warning');
      } catch (error) {
        toast(error.message, 'error');
      }
      return;
    }

    if (action === 'delete') {
      const approved = await confirmAction({
        title: 'Hapus tagihan?',
        message:
          'Tagihan akan dihapus permanen. Jika sudah lunas, riwayat pembayaran penghuni ikut disesuaikan.',
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      try {
        deleteBill(id);
        toast('Tagihan berhasil dihapus.');
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  });
}
