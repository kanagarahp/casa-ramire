import {
  formatDate,
  isInMonth,
  rupiah,
  toNumber,
  todayISO,
  waLink,
} from '../core/format.js';
import {
  deleteManualInvoice,
  getManualInvoices,
  markManualInvoiceUnpaid,
} from '../services/billing.js';
import { getState } from '../core/store.js';
import {
  addExpense,
  addExpenseCategory,
  deleteExpense,
  deleteExpenseCategory,
  getExpenseCategories,
  getExpenses,
  updateExpense,
} from '../services/expenses.js';
import { getAccrualReport, getProfitLoss } from '../services/reports.js';
import { sendInvoiceByEmail } from '../services/billing-notify.js';
import { createInvoicePaymentLink, openPaymentLinkModal } from '../services/payments.js';
import { buildMessage } from '../services/templates.js';
import {
  billBadge,
  cardHeader,
  emptyRow,
  emptyState,
  pageHeader,
  progressBar,
  statCard,
} from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import { openManualInvoiceModal, openVerifyModal } from './billing-modals.js';

let activeTab = 'expenses';

function invoiceEmail(invoice) {
  return String(
    invoice?.email ||
      getState().tenants.find((tenant) => String(tenant.id) === String(invoice?.tenantId))
        ?.email ||
      '',
  ).trim();
}

const TABS = [
  { id: 'expenses', label: 'Jurnal Pengeluaran', iconName: 'ScrollText' },
  { id: 'invoices', label: 'Invoice Manual', iconName: 'FileText' },
  { id: 'accrual', label: 'Pendapatan Accrual', iconName: 'TrendingUp' },
  { id: 'pnl', label: 'Laba Rugi', iconName: 'PieChart' },
];

function expensesSection() {
  const expenses = getExpenses();
  const categories = getExpenseCategories();
  const monthTotal = expenses
    .filter((expense) => isInMonth(expense.date))
    .reduce((sum, expense) => sum + toNumber(expense.amount), 0);
  const allTotal = expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);

  return `
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${statCard({ label: 'Pengeluaran Bulan Ini', value: rupiah(monthTotal), iconName: 'TrendingDown', tone: 'rose' })}
        ${statCard({ label: 'Total Pengeluaran', value: rupiah(allTotal), iconName: 'Coins' })}
        ${statCard({ label: 'Jumlah Transaksi', value: expenses.length, iconName: 'Receipt' })}
        ${statCard({ label: 'Kategori Aktif', value: categories.length, iconName: 'Tags', tone: 'amber' })}
      </div>

      <div class="card overflow-hidden">
        ${cardHeader({
          title: 'Catatan Pengeluaran',
          description: 'Jurnal biaya operasional bulanan dan harian.',
          actions: `
            <button type="button" class="btn-outline btn-xs" data-action="manage-categories">${icon('Tags', 'w-3.5 h-3.5')} Kelola kategori</button>
            <button type="button" class="btn-primary btn-xs" data-action="add-expense">${icon('Plus', 'w-3.5 h-3.5')} Catat pengeluaran</button>
          `,
        })}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Tanggal</th><th>Kategori</th><th>Uraian</th><th>Nominal</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                expenses.length
                  ? expenses
                      .map(
                        (expense) => `
                        <tr>
                          <td class="whitespace-nowrap">${formatDate(expense.date)}</td>
                          <td><span class="badge-gray">${esc(expense.category)}</span></td>
                          <td class="font-semibold text-stone-700">${esc(expense.description)}</td>
                          <td class="font-black text-rose-700 whitespace-nowrap">${rupiah(expense.amount)}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-ghost btn-xs" data-action="edit-expense" data-id="${expense.id}" title="Edit">${icon('Pencil', 'w-3.5 h-3.5')}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-expense" data-id="${expense.id}" title="Hapus">${icon('Trash2', 'w-3.5 h-3.5')}</button>
                            </div>
                          </td>
                        </tr>`,
                      )
                      .join('')
                  : emptyRow(5, 'Belum ada pengeluaran tercatat.')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function invoicesSection() {
  const invoices = getManualInvoices();
  const unpaid = invoices.filter((invoice) => invoice.status === 'unpaid');
  const paidThisMonth = invoices.filter(
    (invoice) => invoice.status === 'paid' && isInMonth(invoice.paidAt),
  );
  const unpaidTotal = unpaid.reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
  const paidTotal = paidThisMonth.reduce((sum, invoice) => sum + toNumber(invoice.paid), 0);

  return `
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${statCard({ label: 'Total Invoice', value: invoices.length, iconName: 'FileText' })}
        ${statCard({ label: 'Belum Dibayar', value: rupiah(unpaidTotal), iconName: 'CircleAlert', tone: unpaid.length ? 'rose' : 'green', hint: `${unpaid.length} invoice` })}
        ${statCard({ label: 'Lunas Bulan Ini', value: rupiah(paidTotal), iconName: 'CheckCircle2', tone: 'green', hint: `${paidThisMonth.length} invoice` })}
        ${statCard({ label: 'Nilai Layanan', value: rupiah(invoices.reduce((sum, invoice) => sum + toNumber(invoice.amount), 0)), iconName: 'HandCoins' })}
      </div>

      <div class="card overflow-hidden">
        ${cardHeader({
          title: 'Invoice Layanan & Non-Sewa',
          description: 'Laundry, perbaikan, fasilitas, dan tagihan lain di luar sewa.',
          actions: `<button type="button" class="btn-primary btn-xs" data-action="add-invoice">${icon('FilePlus2', 'w-3.5 h-3.5')} Buat invoice</button>`,
        })}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No. Invoice</th><th>Kamar / Tenant</th><th>Item Layanan</th><th>Nominal</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                invoices.length
                  ? invoices
                      .map((invoice) => {
                        const email = invoiceEmail(invoice);
                        const message = buildMessage('manual', {
                          nama: invoice.tenantName,
                          kamar: invoice.roomNumber,
                          nominal: rupiah(invoice.amount),
                          no_invoice: invoice.number,
                          item_layanan: invoice.item,
                          jatuh_tempo: formatDate(invoice.dueDate),
                        });
                        return `
                          <tr>
                            <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${esc(invoice.number)}</td>
                            <td>
                              <p class="font-bold text-stone-800">${esc(invoice.tenantName || '—')}</p>
                              <p class="text-[10px] text-stone-600">Kamar ${esc(invoice.roomNumber || '—')}${email ? ` · ${esc(email)}` : ''}</p>
                            </td>
                            <td>
                              <p class="font-semibold text-stone-700">${esc(invoice.item)}</p>
                              <p class="text-[10px] text-stone-500">${formatDate(invoice.dueDate)}</p>
                            </td>
                            <td class="font-black text-stone-800 whitespace-nowrap">${rupiah(invoice.amount)}</td>
                            <td>${billBadge(invoice.status)}</td>
                            <td>
                              <div class="flex flex-wrap items-center justify-end gap-1">
                                ${
                                  invoice.status === 'unpaid'
                                    ? `<button type="button" class="btn-outline btn-xs" data-action="doku-invoice-link" data-id="${invoice.id}">${icon('CreditCard', 'w-3 h-3')} Link DOKU</button>
                                       <button type="button" class="btn-outline btn-xs" data-action="email-invoice" data-id="${invoice.id}" ${email ? '' : 'disabled title="Email belum diisi"'}>${icon('Send', 'w-3 h-3')} Kirim Tagihan</button>
                                       <button type="button" class="btn-primary btn-xs" data-action="verify-invoice" data-id="${invoice.id}">${icon('ShieldCheck', 'w-3 h-3')} Verifikasi</button>`
                                    : `<button type="button" class="btn-outline btn-xs" data-action="unverify-invoice" data-id="${invoice.id}">Batalkan</button>`
                                }
                                ${
                                  invoice.phone
                                    ? `<a href="${waLink(invoice.phone, message)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim invoice via WhatsApp">${icon('MessageCircle', 'w-4 h-4')}</a>`
                                    : ''
                                }
                                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-invoice" data-id="${invoice.id}" title="Hapus invoice">${icon('Trash2', 'w-3.5 h-3.5')}</button>
                              </div>
                            </td>
                          </tr>`;
                      })
                      .join('')
                  : emptyRow(6, 'Belum ada invoice layanan. Buat invoice pertama Anda.')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function accrualSection() {
  const report = getAccrualReport();

  return `
    <div class="space-y-5">
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 leading-relaxed">
        <p class="font-extrabold mb-1">Prinsip pengakuan pendapatan</p>
        Sewa dasar dan add-on diakui penuh sebagai pendapatan bulan berjalan. Pembayaran di atas nilai bulanan dicatat sebagai pendapatan dimuka.
        Deposit tidak diakui sebagai pendapatan karena merupakan kewajiban yang dapat dikembalikan.
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${statCard({ label: 'Diakui Bulan Ini', value: rupiah(report.totalRecognized), iconName: 'TrendingUp', tone: 'green' })}
        ${statCard({ label: 'Pendapatan Dimuka', value: rupiah(report.totalDeferred), iconName: 'CalendarClock', tone: 'amber' })}
        ${statCard({ label: 'Total Kas Masuk', value: rupiah(report.totalPaid), iconName: 'Banknote', tone: 'brand' })}
        ${statCard({ label: 'Belum Tertagih', value: rupiah(report.totalOutstanding), iconName: 'CircleAlert', tone: report.totalOutstanding ? 'rose' : 'green' })}
      </div>

      <div class="card overflow-hidden">
        ${cardHeader({
          title: 'Rincian Pendapatan per Penghuni',
          description: 'Nilai kontrak bulanan, kas masuk, dan pendapatan dimuka.',
        })}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Penghuni / Kamar</th><th>Total Kas Masuk</th><th>Sewa + Add-On</th><th>Diakui Bulan Ini</th><th>Dimuka</th><th>Belum Tertagih</th></tr></thead>
            <tbody>
              ${
                report.rows.length
                  ? report.rows
                      .map(
                        (row) => `
                        <tr>
                          <td>
                            <p class="font-bold text-stone-800">${esc(row.name)}</p>
                            <p class="text-[10px] text-stone-600">Kamar ${esc(row.roomNumber)}</p>
                          </td>
                          <td class="font-bold whitespace-nowrap">${rupiah(row.paid)}</td>
                          <td class="whitespace-nowrap">${rupiah(row.monthlyCharge)}</td>
                          <td class="font-black text-emerald-700 whitespace-nowrap">${rupiah(row.recognized)}</td>
                          <td class="font-bold text-amber-700 whitespace-nowrap">${rupiah(row.deferred)}</td>
                          <td class="font-bold whitespace-nowrap ${row.outstanding > 0 ? 'text-rose-700' : 'text-stone-600'}">${row.outstanding > 0 ? rupiah(row.outstanding) : '—'}</td>
                        </tr>`,
                      )
                      .join('')
                  : emptyRow(6, 'Belum ada penghuni aktif untuk diakui pendapatannya.')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function pnlSection() {
  const pnl = getProfitLoss();
  const monthLabel = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const maxExpense = Math.max(1, ...pnl.expenseByCategory.map(([, value]) => value));

  return `
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 class="font-extrabold text-stone-800">Laporan Laba Rugi</h2>
            <p class="text-xs text-stone-500">Periode ${monthLabel}</p>
          </div>
          <span class="badge-gold">P&amp;L</span>
        </div>

        <div class="space-y-2.5 text-sm">
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pendapatan sewa (accrual)</span><span class="font-bold text-stone-800">${rupiah(pnl.rentRevenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pendapatan layanan (lunas)</span><span class="font-bold text-stone-800">${rupiah(pnl.serviceRevenue)}</span></div>
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total pendapatan</span><span class="font-black text-emerald-700">${rupiah(pnl.revenue)}</span></div>
          <div class="flex justify-between gap-3"><span class="text-stone-600">Pengeluaran operasional</span><span class="font-bold text-rose-700">−${rupiah(pnl.expenses)}</span></div>
          <div class="flex justify-between gap-3 pt-3 border-t-2 border-stone-300 items-center">
            <span class="font-black text-stone-800">Laba / (rugi) bersih</span>
            <span class="font-black text-xl ${pnl.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${pnl.net < 0 ? '−' : ''}${rupiah(Math.abs(pnl.net))}</span>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 class="font-extrabold text-stone-800">Komposisi Pengeluaran</h2>
            <p class="text-xs text-stone-500">Berdasarkan kategori · ${monthLabel}</p>
          </div>
          <span class="badge-gray">${pnl.expenseByCategory.length} kategori</span>
        </div>

        ${
          pnl.expenseByCategory.length
            ? `<div class="space-y-3.5">
                ${pnl.expenseByCategory
                  .map(
                    ([category, value]) => `
                    <div>
                      <div class="flex justify-between text-xs mb-1">
                        <span class="font-bold text-stone-700">${esc(category)}</span>
                        <span class="font-black text-stone-800">${rupiah(value)}</span>
                      </div>
                      ${progressBar((value / maxExpense) * 100, 'bg-rose-400')}
                    </div>`,
                  )
                  .join('')}
              </div>`
            : emptyState({
                iconName: 'PieChart',
                title: 'Belum ada pengeluaran',
                description: 'Catat pengeluaran operasional untuk melihat komposisi biaya.',
              })
        }
      </div>
    </div>
  `;
}

function renderTab() {
  if (activeTab === 'invoices') return invoicesSection();
  if (activeTab === 'accrual') return accrualSection();
  if (activeTab === 'pnl') return pnlSection();
  return expensesSection();
}

export function render(root) {
  root.innerHTML = `
    <div data-view="financial" class="animate-in">
      ${pageHeader({
        eyebrow: 'Accounting System',
        title: 'Financial & Keuangan 📊',
        subtitle: 'Jurnal pengeluaran, invoice layanan, pendapatan accrual, dan laba rugi.',
        actions: `
          <button type="button" class="btn-outline btn-sm" data-action="add-expense">${icon('Plus', 'w-4 h-4')} Catat Pengeluaran</button>
          <button type="button" class="btn-primary btn-sm" data-action="add-invoice">${icon('FilePlus2', 'w-4 h-4')} Buat Invoice</button>
        `,
      })}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3" id="fin-tabs">
        ${TABS.map(
          (tab) => `
          <button type="button" class="${activeTab === tab.id ? 'chip-active' : 'chip-idle'} flex items-center gap-1.5" data-tab="${tab.id}">
            ${icon(tab.iconName, 'w-3.5 h-3.5')} ${tab.label}
          </button>`,
        ).join('')}
      </div>

      <div id="fin-content"></div>
    </div>
  `;

  const scope = root.querySelector('[data-view="financial"]');
  const content = scope.querySelector('#fin-content');

  const syncTabs = () => {
    scope.querySelectorAll('[data-tab]').forEach((button) => {
      button.className = `${button.dataset.tab === activeTab ? 'chip-active' : 'chip-idle'} flex items-center gap-1.5`;
    });
  };

  const paint = () => {
    content.innerHTML = renderTab();
    syncTabs();
  };

  scope.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab;
      paint();
    });
  });

  paint();

  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (action === 'add-expense') {
      openExpenseModal();
      return;
    }
    if (action === 'add-invoice') {
      openManualInvoiceModal();
      return;
    }
    if (action === 'manage-categories') {
      openCategoriesModal();
      return;
    }
    if (action === 'edit-expense') {
      openExpenseModal(id);
      return;
    }
    if (action === 'delete-expense') {
      const approved = await confirmAction({
        title: 'Hapus pengeluaran?',
        message: 'Catatan pengeluaran ini akan dihapus permanen.',
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      deleteExpense(id);
      toast('Pengeluaran berhasil dihapus.');
      return;
    }
    if (action === 'doku-invoice-link') {
      const invoice = getManualInvoices().find((item) => String(item.id) === String(id));
      if (!invoice) return;
      const message = buildMessage('manual', {
        nama: invoice.tenantName,
        kamar: invoice.roomNumber,
        nominal: rupiah(invoice.amount),
        no_invoice: invoice.number,
        item_layanan: invoice.item,
        jatuh_tempo: formatDate(invoice.dueDate),
      });
      try {
        const result = await createInvoicePaymentLink(invoice);
        openPaymentLinkModal({
          title: 'Link Pembayaran Invoice',
          subtitle: `${invoice.tenantName || '—'} • Kamar ${invoice.roomNumber || '—'}`,
          paymentUrl: result.paymentUrl,
          invoiceNumber: result.invoiceNumber,
          amount: result.amount,
          expiresAt: result.expiresAt,
          phone: invoice.phone || '',
          email: invoiceEmail(invoice),
          recipientName: invoice.tenantName || '',
          message,
        });
      } catch (error) {
        toast(error.message, 'error');
      }
      return;
    }

    if (action === 'verify-invoice') {
      openVerifyModal({ kind: 'invoice', id });
      return;
    }

    if (action === 'email-invoice') {
      const invoice = getManualInvoices().find((item) => String(item.id) === String(id));
      if (!invoice) return;
      const email = invoiceEmail(invoice);
      if (!email) {
        toast('Email penerima belum diisi.', 'warning');
        return;
      }
      target.disabled = true;
      try {
        const { delivery } = await sendInvoiceByEmail(invoice);
        toast(
          delivery.sent
            ? `Tagihan dikirim ke ${email}.`
            : 'Email belum dikonfigurasi. Aplikasi email perangkat dibuka sebagai gantinya.',
          delivery.sent ? 'success' : 'warning',
        );
      } catch (error) {
        toast(error.message, 'error');
      } finally {
        target.disabled = false;
      }
      return;
    }
    if (action === 'unverify-invoice') {
      markManualInvoiceUnpaid(id);
      toast('Verifikasi invoice dibatalkan.', 'warning');
      return;
    }
    if (action === 'delete-invoice') {
      const approved = await confirmAction({
        title: 'Hapus invoice?',
        message: 'Invoice layanan ini akan dihapus permanen.',
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      deleteManualInvoice(id);
      toast('Invoice berhasil dihapus.');
    }
  });
}

function openExpenseModal(expenseId = null) {
  const expense = expenseId ? getExpenses().find((item) => item.id === expenseId) : null;
  const categories = getExpenseCategories();

  openModal({
    title: expense ? 'Edit Pengeluaran' : 'Catat Pengeluaran',
    size: 'md',
    body: `
      <form id="expense-form" class="space-y-4" novalidate>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="ex-date">Tanggal</label>
            <input id="ex-date" type="date" class="input" value="${expense?.date || todayISO()}" />
          </div>
          <div>
            <label class="label" for="ex-category">Kategori</label>
            <select id="ex-category" class="select">
              ${categories.map((category) => `<option value="${esc(category)}" ${expense?.category === category ? 'selected' : ''}>${esc(category)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <label class="label" for="ex-description">Uraian / deskripsi</label>
          <input id="ex-description" type="text" class="input" placeholder="cth: Token listrik lantai 2" value="${esc(expense?.description || '')}" />
        </div>
        <div>
          <label class="label" for="ex-amount">Nominal (Rp)</label>
          <input id="ex-amount" type="number" min="0" step="1000" class="input" placeholder="cth: 350000" value="${expense ? toNumber(expense.amount) : ''}" />
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="expense-form" class="btn-primary btn-sm" data-submit>${icon('Check', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('#expense-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const payload = {
          date: el.querySelector('#ex-date').value || todayISO(),
          category: el.querySelector('#ex-category').value,
          description: el.querySelector('#ex-description').value,
          amount: toNumber(el.querySelector('#ex-amount').value),
        };
        try {
          if (expense) updateExpense(expense.id, payload);
          else addExpense(payload);
          toast(expense ? 'Pengeluaran berhasil diperbarui.' : 'Pengeluaran berhasil dicatat.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function openCategoriesModal() {
  const instance = openModal({
    title: 'Kelola Kategori Pengeluaran',
    subtitle: 'Kategori dipakai untuk mengelompokkan jurnal biaya.',
    size: 'sm',
    body: `
      <div class="space-y-4">
        <div class="flex gap-2">
          <input id="cat-input" type="text" class="input input-sm flex-1" placeholder="Nama kategori baru" />
          <button type="button" class="btn-primary btn-sm shrink-0" data-add-category>${icon('Plus', 'w-4 h-4')} Tambah</button>
        </div>
        <div id="cat-list" class="space-y-1.5 max-h-64 overflow-y-auto"></div>
      </div>
    `,
    footer: `<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,
    onMount(el) {
      const input = el.querySelector('#cat-input');
      const list = el.querySelector('#cat-list');

      const paint = () => {
        const categories = getExpenseCategories();
        list.innerHTML = categories
          .map(
            (category) => `
            <div class="flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-3 py-2">
              <span class="text-xs font-semibold text-stone-700">${esc(category)}</span>
              <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50" data-remove-category="${esc(category)}" aria-label="Hapus ${esc(category)}">
                ${icon('X', 'w-3.5 h-3.5')}
              </button>
            </div>`,
          )
          .join('');
      };

      paint();

      el.querySelector('[data-add-category]')?.addEventListener('click', () => {
        try {
          addExpenseCategory(input.value);
          input.value = '';
          paint();
          toast('Kategori berhasil ditambahkan.');
        } catch (error) {
          toast(error.message, 'error');
        }
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          el.querySelector('[data-add-category]')?.click();
        }
      });

      list.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-remove-category]');
        if (!button) return;
        const category = button.dataset.removeCategory;
        const approved = await confirmAction({
          title: 'Hapus kategori?',
          message: `Kategori <b>${esc(category)}</b> akan dihapus. Pengeluaran lama tetap menyimpan nama kategori.`,
          confirmText: 'Ya, hapus',
          danger: true,
        });
        if (!approved) return;
        try {
          deleteExpenseCategory(category);
          paint();
          toast('Kategori berhasil dihapus.');
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
  void instance;
}
