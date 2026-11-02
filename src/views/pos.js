import { PAYMENT_METHODS } from '../core/constants.js';
import { formatDateTime, rupiah, toNumber, todayISO } from '../core/format.js';
import { isOwner } from '../services/auth.js';
import {
  createPosSale,
  deletePosProduct,
  deletePosSale,
  getPosCategories,
  getPosProduct,
  getPosProducts,
  getPosSales,
  getPosSummary,
  savePosProduct,
  togglePosProduct,
} from '../services/pos.js';
import { getSettings } from '../services/settings.js';
import { emptyState, pageHeader, statCard } from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

let activeTab = 'kasir';
let searchTerm = '';
let categoryFilter = 'semua';
let cart = [];
let draft = {
  customerName: '',
  customerPhone: '',
  note: '',
  method: 'Tunai / Cash',
  discount: '',
  amountPaid: '',
};

function money(value) {
  return rupiah(value);
}

function qtyLabel(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

function roundQty(value) {
  return Math.max(0, Math.round((Number(value) || 0) * 100) / 100);
}

function cartLines() {
  return cart
    .map((entry) => {
      const product = getPosProduct(entry.productId);
      if (!product) return null;
      const qty = roundQty(entry.qty);
      return {
        ...entry,
        product,
        qty,
        subtotal: Math.round(product.price * qty),
      };
    })
    .filter(Boolean);
}

function cartTotals() {
  const lines = cartLines();
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = Math.min(
    subtotal,
    Math.max(0, Math.round(toNumber(draft.discount))),
  );
  const total = Math.max(0, subtotal - discount);
  const paid = draft.amountPaid === '' ? total : Math.round(toNumber(draft.amountPaid));
  return {
    lines,
    subtotal,
    discount,
    total,
    paid,
    change: Math.max(0, paid - total),
    shortfall: Math.max(0, total - paid),
  };
}

function syncDraftFromInputs(scope) {
  const name = scope.querySelector('#pos-customer-name');
  const phone = scope.querySelector('#pos-customer-phone');
  const note = scope.querySelector('#pos-note');
  const method = scope.querySelector('#pos-method');
  const discount = scope.querySelector('#pos-discount');
  const paid = scope.querySelector('#pos-paid');
  if (name) draft.customerName = name.value;
  if (phone) draft.customerPhone = phone.value;
  if (note) draft.note = note.value;
  if (method) draft.method = method.value;
  if (discount) draft.discount = discount.value;
  if (paid) draft.amountPaid = paid.value;
}

function cartLinesHtml() {
  const lines = cartLines();
  if (!lines.length) {
    return `
      <div class="rounded-2xl border border-dashed border-line bg-stone-50/70 px-4 py-8 text-center">
        <span class="w-11 h-11 rounded-2xl bg-white border border-line text-stone-500 flex items-center justify-center mx-auto">${icon('ShoppingCart', 'w-5 h-5')}</span>
        <p class="text-xs font-bold text-stone-700 mt-3">Keranjang masih kosong</p>
        <p class="text-[11px] text-stone-500 mt-1">Pilih layanan di sebelah kiri untuk mulai transaksi.</p>
      </div>
    `;
  }

  return `
    <div class="divide-y divide-line-soft">
      ${lines
        .map(
          (line) => `
          <div class="py-3 first:pt-0 last:pb-0">
            <div class="flex items-start gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-extrabold text-stone-800 leading-snug">${esc(line.product.name)}</p>
                <p class="text-[10px] text-stone-500 mt-0.5">${money(line.product.price)} / ${esc(line.product.unit || 'item')}</p>
              </div>
              <button type="button" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 shrink-0" data-pos-remove data-product="${line.product.id}" aria-label="Hapus ${esc(line.product.name)}">
                ${icon('Trash2', 'w-3.5 h-3.5')}
              </button>
            </div>
            <div class="flex items-center justify-between gap-2 mt-2">
              <div class="flex items-center gap-1">
                <button type="button" class="w-7 h-7 rounded-lg border border-line bg-white text-stone-600 hover:bg-stone-50 flex items-center justify-center" data-pos-minus data-product="${line.product.id}" aria-label="Kurangi jumlah">${icon('Minus', 'w-3.5 h-3.5')}</button>
                <input
                  type="number"
                  min="0.01"
                  step="${String(line.product.unit).toLowerCase() === 'kg' ? '0.1' : '1'}"
                  value="${line.qty}"
                  class="w-16 h-7 rounded-lg border border-line bg-white px-1.5 text-center text-xs font-bold text-stone-800"
                  data-pos-qty
                  data-product="${line.product.id}"
                  aria-label="Jumlah ${esc(line.product.name)}"
                />
                <button type="button" class="w-7 h-7 rounded-lg border border-line bg-white text-stone-600 hover:bg-stone-50 flex items-center justify-center" data-pos-plus data-product="${line.product.id}" aria-label="Tambah jumlah">${icon('Plus', 'w-3.5 h-3.5')}</button>
              </div>
              <p class="text-xs font-black text-stone-800 whitespace-nowrap">${money(line.subtotal)}</p>
            </div>
          </div>`,
        )
        .join('')}
    </div>
  `;
}

function totalsHtml() {
  const totals = cartTotals();
  return `
    <div class="space-y-1.5 text-xs">
      <div class="flex justify-between gap-3"><span class="text-stone-500">Subtotal</span><span class="font-bold text-stone-800">${money(totals.subtotal)}</span></div>
      ${totals.discount > 0 ? `<div class="flex justify-between gap-3 text-rose-700"><span>Diskon</span><span class="font-bold">−${money(totals.discount)}</span></div>` : ''}
      <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-extrabold text-stone-700">Total</span><span class="font-black text-lg text-stone-900">${money(totals.total)}</span></div>
      ${
        draft.amountPaid !== ''
          ? `<div class="flex justify-between gap-3"><span class="text-stone-500">Uang diterima</span><span class="font-bold text-stone-800">${money(totals.paid)}</span></div>
             <div class="flex justify-between gap-3"><span class="text-stone-500">Kembalian</span><span class="font-bold ${totals.shortfall ? 'text-rose-700' : 'text-emerald-700'}">${totals.shortfall ? `Kurang ${money(totals.shortfall)}` : money(totals.change)}</span></div>`
          : ''
      }
    </div>
  `;
}

function refreshCart(scope) {
  const lines = scope.querySelector('#pos-cart-lines');
  const totals = scope.querySelector('#pos-totals');
  const count = scope.querySelector('#pos-cart-count');
  const submit = scope.querySelector('[data-pos-checkout]');
  if (lines) lines.innerHTML = cartLinesHtml();
  if (totals) totals.innerHTML = totalsHtml();
  if (count) count.textContent = `${cartLines().length} item`;
  if (submit) submit.disabled = cartLines().length === 0;
}

function productCard(product) {
  return `
    <button type="button" class="text-left rounded-2xl border border-line bg-white p-3.5 hover:border-gold-300 hover:shadow-sm transition group" data-pos-add data-product="${product.id}">
      <div class="flex items-start justify-between gap-2">
        <span class="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${icon('Package', 'w-4 h-4')}</span>
        <span class="badge-gray normal-case tracking-normal">${esc(product.category)}</span>
      </div>
      <p class="text-xs font-extrabold text-stone-800 mt-2.5 leading-snug">${esc(product.name)}</p>
      <div class="flex items-end justify-between gap-2 mt-2">
        <p class="text-sm font-black text-stone-900">${money(product.price)}</p>
        <p class="text-[10px] text-stone-500">/ ${esc(product.unit || 'item')}</p>
      </div>
      <p class="text-[10px] font-bold text-brand mt-2 group-hover:text-gold-700">+ Tambah</p>
    </button>
  `;
}

function productGridHtml() {
  const term = searchTerm.trim().toLowerCase();
  const products = getPosProducts({
    activeOnly: true,
    category: categoryFilter === 'semua' ? '' : categoryFilter,
  }).filter((product) => {
    if (!term) return true;
    return `${product.name} ${product.category} ${product.unit}`.toLowerCase().includes(term);
  });

  if (!products.length) {
    return emptyState({
      iconName: 'Package',
      title: 'Produk tidak ditemukan',
      description: 'Ubah kata kunci atau tambahkan produk/layanan baru dari menu Kelola Produk.',
    });
  }

  return `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">${products.map(productCard).join('')}</div>`;
}

function categoryChips() {
  const categories = ['semua', ...getPosCategories()];
  return categories
    .map(
      (category) => `
      <button type="button" class="${categoryFilter === category ? 'chip-active' : 'chip-idle'}" data-pos-category="${esc(category)}">
        ${category === 'semua' ? 'Semua' : esc(category)}
      </button>`,
    )
    .join('');
}

function kasirHtml() {
  const owner = isOwner();
  return `
    <div class="grid lg:grid-cols-[1.3fr_0.7fr] gap-5 items-start">
      <div class="space-y-4 min-w-0">
        <div class="card p-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">${icon('Search', 'w-3.5 h-3.5')}</span>
              <input id="pos-search" type="search" class="input input-sm pl-8" placeholder="Cari layanan / produk…" value="${esc(searchTerm)}" />
            </div>
            ${
              owner
                ? `<button type="button" class="btn-outline btn-sm shrink-0" data-pos-manage>${icon('Package', 'w-4 h-4')} Kelola Produk</button>`
                : ''
            }
          </div>
          <div class="flex flex-wrap gap-1.5 mt-3" id="pos-categories">${categoryChips()}</div>
        </div>

        <div class="card p-4">
          <div class="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-stone-800">Pilih Layanan</h2>
              <p class="text-[11px] text-stone-500">Harga mengikuti master POS yang diatur owner.</p>
            </div>
            <span class="badge-gold">${getPosProducts({ activeOnly: true }).length} aktif</span>
          </div>
          <div id="pos-products">${productGridHtml()}</div>
        </div>
      </div>

      <aside class="card rounded-3xl p-4 sm:p-5 lg:sticky lg:top-4">
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-line">
          <div>
            <h2 class="text-sm font-extrabold text-stone-800">Keranjang</h2>
            <p class="text-[11px] text-stone-500" id="pos-cart-count">${cartLines().length} item</p>
          </div>
          <button type="button" class="btn-ghost btn-xs text-rose-600" data-pos-clear ${cart.length ? '' : 'disabled'}>Reset</button>
        </div>

        <div class="py-3" id="pos-cart-lines">${cartLinesHtml()}</div>

        <div class="space-y-3 pt-3 border-t border-line">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="label" for="pos-customer-name">Nama pelanggan</label>
              <input id="pos-customer-name" type="text" class="input input-sm" placeholder="Opsional" value="${esc(draft.customerName)}" />
            </div>
            <div>
              <label class="label" for="pos-customer-phone">No. telepon</label>
              <input id="pos-customer-phone" type="tel" class="input input-sm" placeholder="Opsional" value="${esc(draft.customerPhone)}" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="label" for="pos-discount">Diskon (Rp)</label>
              <input id="pos-discount" type="number" min="0" step="500" class="input input-sm" placeholder="0" value="${esc(draft.discount)}" />
            </div>
            <div>
              <label class="label" for="pos-method">Metode bayar</label>
              <select id="pos-method" class="select select-sm">
                ${PAYMENT_METHODS.map((method) => `<option value="${esc(method)}" ${draft.method === method ? 'selected' : ''}>${esc(method)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div>
            <label class="label" for="pos-paid">Uang diterima (opsional)</label>
            <input id="pos-paid" type="number" min="0" step="1000" class="input input-sm" placeholder="Kosongkan = uang pas" value="${esc(draft.amountPaid)}" />
          </div>

          <div>
            <label class="label" for="pos-note">Catatan</label>
            <input id="pos-note" type="text" class="input input-sm" placeholder="cth: antar jam 5 sore" value="${esc(draft.note)}" />
          </div>

          <div class="rounded-2xl border border-line bg-cream/70 p-3" id="pos-totals">${totalsHtml()}</div>

          <button type="button" class="btn-primary w-full py-3" data-pos-checkout ${cartLines().length ? '' : 'disabled'}>
            ${icon('Check', 'w-4 h-4')} Simpan Pembayaran
          </button>
          <p class="text-[10px] text-stone-500 text-center">Transaksi langsung tercatat sebagai pendapatan POS.</p>
        </div>
      </aside>
    </div>
  `;
}

function historyHtml() {
  const owner = isOwner();
  const sales = getPosSales();
  const summary = getPosSummary();

  return `
    <div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${statCard({ label: 'Transaksi Hari Ini', value: summary.todayCount, iconName: 'ReceiptText', hint: money(summary.todayRevenue) })}
        ${statCard({ label: 'Pendapatan Hari Ini', value: money(summary.todayRevenue), iconName: 'Wallet', tone: 'green' })}
        ${statCard({ label: 'Transaksi Bulan Ini', value: summary.monthCount, iconName: 'ShoppingCart', hint: money(summary.monthRevenue) })}
        ${statCard({ label: 'Pendapatan POS Bulan Ini', value: money(summary.monthRevenue), iconName: 'Coins', tone: 'brand' })}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="text-sm font-extrabold text-stone-800">Riwayat Transaksi POS</h2>
            <p class="text-[11px] text-stone-500 mt-0.5">${sales.length} transaksi terakhir. Struk dapat dicetak ulang.</p>
          </div>
          <span class="badge-gold">${money(summary.monthRevenue)} bulan ini</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>No. Struk</th><th>Waktu</th><th>Pelanggan</th><th>Item</th><th>Metode</th><th>Total</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                sales.length
                  ? sales
                      .map((sale) => {
                        const items = (sale.items || [])
                          .map((item) => `${item.name} ×${qtyLabel(item.qty)}`)
                          .join(', ');
                        return `
                          <tr>
                            <td class="font-mono text-[11px] font-bold text-stone-700 whitespace-nowrap">${esc(sale.number || '—')}</td>
                            <td class="whitespace-nowrap text-[11px] text-stone-600">${formatDateTime(sale.createdAt || sale.date)}</td>
                            <td>
                              <p class="font-bold text-stone-800">${esc(sale.customerName || 'Walk-in')}</p>
                              ${sale.roomNumber ? `<p class="text-[10px] text-stone-500">Kamar ${esc(sale.roomNumber)}</p>` : ''}
                            </td>
                            <td class="max-w-[240px]"><p class="text-[11px] text-stone-600 truncate" title="${esc(items)}">${esc(items)}</p></td>
                            <td><span class="badge-gray normal-case tracking-normal">${esc(sale.method || '—')}</span></td>
                            <td class="font-black text-stone-800 whitespace-nowrap">${money(sale.total)}</td>
                            <td>
                              <div class="flex items-center justify-end gap-1">
                                <button type="button" class="btn-ghost btn-xs" data-pos-detail data-sale="${sale.id}" title="Lihat struk">${icon('ReceiptText', 'w-3.5 h-3.5')}</button>
                                ${owner ? `<button type="button" class="btn-ghost btn-xs text-rose-600" data-pos-delete-sale data-sale="${sale.id}" title="Hapus transaksi">${icon('Trash2', 'w-3.5 h-3.5')}</button>` : ''}
                              </div>
                            </td>
                          </tr>`;
                      })
                      .join('')
                  : `<tr><td colspan="7" class="px-4 py-12 text-center text-sm text-stone-600">Belum ada transaksi POS. Mulai dari tab Kasir.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function pageContent() {
  return activeTab === 'riwayat' ? historyHtml() : kasirHtml();
}

function syncTabs(scope) {
  scope.querySelectorAll('[data-pos-tab]').forEach((button) => {
    button.className = `${button.dataset.posTab === activeTab ? 'chip-active' : 'chip-idle'} flex items-center gap-1.5`;
  });
}

function paint(scope) {
  const content = scope.querySelector('#pos-content');
  if (!content) return;
  content.innerHTML = pageContent();
  syncTabs(scope);
}

function resetCheckout() {
  cart = [];
  draft = {
    customerName: '',
    customerPhone: '',
    note: '',
    method: 'Tunai / Cash',
    discount: '',
    amountPaid: '',
  };
}

function receiptBodyHtml(sale) {
  const settings = getSettings();
  return `
    <div class="rounded-2xl border border-line bg-white p-5 font-mono text-[11px] text-stone-700">
      <div class="text-center border-b border-dashed border-stone-300 pb-3">
        <p class="font-black text-sm tracking-wider text-stone-900">${esc(settings.propertyName || 'Casa Ramire')}</p>
        ${settings.address ? `<p class="text-[10px] text-stone-500 mt-0.5">${esc(settings.address)}</p>` : ''}
        ${settings.whatsapp ? `<p class="text-[10px] text-stone-500">WA ${esc(settings.whatsapp)}</p>` : ''}
      </div>
      <div class="py-3 border-b border-dashed border-stone-300 space-y-1">
        <div class="flex justify-between gap-2"><span>No.</span><b>${esc(sale.number || '—')}</b></div>
        <div class="flex justify-between gap-2"><span>Tanggal</span><span>${formatDateTime(sale.createdAt || sale.date)}</span></div>
        <div class="flex justify-between gap-2"><span>Kasir</span><span>${esc(sale.cashier || '—')}</span></div>
        <div class="flex justify-between gap-2"><span>Pelanggan</span><span>${esc(sale.customerName || 'Walk-in')}</span></div>
      </div>
      <div class="py-3 border-b border-dashed border-stone-300 space-y-2">
        ${(sale.items || [])
          .map(
            (item) => `
            <div>
              <p class="font-bold text-stone-800">${esc(item.name)}</p>
              <div class="flex justify-between gap-2">
                <span>${qtyLabel(item.qty)} ${esc(item.unit || '')} × ${money(item.price)}</span>
                <b>${money(item.subtotal)}</b>
              </div>
            </div>`,
          )
          .join('')}
      </div>
      <div class="py-3 space-y-1">
        <div class="flex justify-between gap-2"><span>Subtotal</span><span>${money(sale.subtotal)}</span></div>
        ${sale.discount > 0 ? `<div class="flex justify-between gap-2"><span>Diskon</span><span>−${money(sale.discount)}</span></div>` : ''}
        <div class="flex justify-between gap-2 font-black text-sm text-stone-900 pt-1 border-t border-stone-300"><span>Total</span><span>${money(sale.total)}</span></div>
        <div class="flex justify-between gap-2"><span>${esc(sale.method || 'Bayar')}</span><span>${money(sale.amountPaid)}</span></div>
        <div class="flex justify-between gap-2"><span>Kembalian</span><span>${money(sale.change)}</span></div>
      </div>
      ${sale.note ? `<p class="border-t border-dashed border-stone-300 pt-2 text-[10px] text-stone-600">Catatan: ${esc(sale.note)}</p>` : ''}
      <p class="text-center text-[10px] text-stone-500 pt-3">Terima kasih sudah menggunakan layanan kami.</p>
    </div>
  `;
}

function receiptPrintBody(sale) {
  const settings = getSettings();
  return `
    <div class="center">
      <h1>${esc(settings.propertyName || 'Casa Ramire')}</h1>
      ${settings.address ? `<div class="muted">${esc(settings.address)}</div>` : ''}
      ${settings.whatsapp ? `<div class="muted">WA ${esc(settings.whatsapp)}</div>` : ''}
    </div>
    <div class="line"></div>
    <div class="row"><span>No.</span><span class="bold">${esc(sale.number || '—')}</span></div>
    <div class="row"><span>Tanggal</span><span>${formatDateTime(sale.createdAt || sale.date)}</span></div>
    <div class="row"><span>Kasir</span><span>${esc(sale.cashier || '—')}</span></div>
    <div class="row"><span>Pelanggan</span><span>${esc(sale.customerName || 'Walk-in')}</span></div>
    <div class="line"></div>
    ${(sale.items || [])
      .map(
        (item) => `
        <div class="item">
          <div class="bold">${esc(item.name)}</div>
          <div class="row"><span>${qtyLabel(item.qty)} ${esc(item.unit || '')} × ${money(item.price)}</span><span>${money(item.subtotal)}</span></div>
        </div>`,
      )
      .join('')}
    <div class="line"></div>
    <div class="row"><span>Subtotal</span><span>${money(sale.subtotal)}</span></div>
    ${sale.discount > 0 ? `<div class="row"><span>Diskon</span><span>−${money(sale.discount)}</span></div>` : ''}
    <div class="row total"><span>Total</span><span>${money(sale.total)}</span></div>
    <div class="row"><span>${esc(sale.method || 'Bayar')}</span><span>${money(sale.amountPaid)}</span></div>
    <div class="row"><span>Kembalian</span><span>${money(sale.change)}</span></div>
    ${sale.note ? `<div class="line"></div><div class="muted">Catatan: ${esc(sale.note)}</div>` : ''}
    <div class="line"></div>
    <div class="center muted">Terima kasih sudah menggunakan layanan kami.</div>
  `;
}

function printReceipt(sale) {
  const win = window.open('', '_blank', 'width=420,height=680');
  if (!win) {
    toast('Popup diblokir browser. Izinkan popup untuk mencetak struk.', 'warning');
    return;
  }

  win.document.write(`<!doctype html>
    <html lang="id"><head><meta charset="utf-8" /><title>${esc(sale.number || 'Struk POS')}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; color: #292524; margin: 0; padding: 18px; }
      .center { text-align: center; }
      .row { display: flex; justify-content: space-between; gap: 12px; }
      .muted { color: #78716c; font-size: 10px; }
      .bold { font-weight: 700; }
      .line { border-top: 1px dashed #a8a29e; margin: 8px 0; }
      .item { margin-bottom: 6px; }
      h1 { font-size: 15px; margin: 0 0 4px; letter-spacing: .08em; }
      .total { font-size: 15px; font-weight: 800; }
    </style></head>
    <body>${receiptPrintBody(sale)}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 250);
}

function openReceipt(sale, { fresh = false } = {}) {
  openModal({
    title: fresh ? 'Pembayaran Berhasil' : `Struk ${sale.number || 'POS'}`,
    subtitle: `${sale.customerName || 'Walk-in'} • ${money(sale.total)}`,
    size: 'md',
    body: `
      <div class="space-y-4">
        ${
          fresh
            ? `<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
                <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">${icon('CheckCircle2', 'w-5 h-5')}</span>
                <div>
                  <p class="text-sm font-extrabold text-emerald-900">Transaksi tersimpan</p>
                  <p class="text-[11px] text-emerald-800 mt-0.5">Pendapatan POS sudah masuk ke laporan keuangan.</p>
                </div>
              </div>`
            : ''
        }
        ${receiptBodyHtml(sale)}
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      <button type="button" class="btn-primary btn-sm" data-print-receipt>${icon('Printer', 'w-4 h-4')} Cetak Struk</button>
    `,
    onMount(el) {
      el.querySelector('[data-print-receipt]')?.addEventListener('click', () => printReceipt(sale));
    },
  });
}

function openProductForm(productId = null, onSaved) {
  if (!isOwner()) {
    toast('Kelola produk POS hanya dapat dilakukan oleh owner.', 'warning');
    return;
  }

  const product = productId ? getPosProduct(productId) : null;
  const categories = getPosCategories();

  openModal({
    title: product ? 'Edit Produk / Layanan' : 'Tambah Produk / Layanan',
    subtitle: 'Nama, kategori, harga, dan satuan dipakai di kasir POS.',
    size: 'md',
    body: `
      <form id="pos-product-form" class="space-y-3" novalidate>
        <div>
          <label class="label" for="pos-product-name">Nama produk / layanan</label>
          <input id="pos-product-name" type="text" class="input" placeholder="cth: Cuci Kering Setrika" value="${esc(product?.name || '')}" />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="pos-product-category">Kategori</label>
            <input id="pos-product-category" type="text" list="pos-category-list" class="input" placeholder="cth: Laundry" value="${esc(product?.category || 'Laundry')}" />
            <datalist id="pos-category-list">
              ${categories.map((category) => `<option value="${esc(category)}"></option>`).join('')}
            </datalist>
          </div>
          <div>
            <label class="label" for="pos-product-unit">Satuan</label>
            <input id="pos-product-unit" type="text" class="input" placeholder="kg / pcs / kali" value="${esc(product?.unit || '')}" />
          </div>
        </div>
        <div>
          <label class="label" for="pos-product-price">Harga (Rp)</label>
          <input id="pos-product-price" type="number" min="0" step="500" class="input" placeholder="cth: 7000" value="${product ? toNumber(product.price) : ''}" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="pos-product-active" type="checkbox" class="w-4 h-4 accent-brand" ${product ? (product.active ? 'checked' : '') : 'checked'} />
          <span class="text-xs font-bold text-stone-700">Tampilkan di kasir</span>
        </label>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="pos-product-form" class="btn-primary btn-sm">${icon('Check', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('#pos-product-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          savePosProduct({
            id: product?.id || null,
            name: el.querySelector('#pos-product-name').value,
            category: el.querySelector('#pos-product-category').value,
            unit: el.querySelector('#pos-product-unit').value,
            price: toNumber(el.querySelector('#pos-product-price').value),
            active: el.querySelector('#pos-product-active').checked,
          });
          toast(product ? 'Produk berhasil diperbarui.' : 'Produk baru berhasil ditambahkan.');
          close();
          onSaved?.();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function openProductManager() {
  if (!isOwner()) {
    toast('Kelola produk POS hanya dapat dilakukan oleh owner.', 'warning');
    return;
  }

  const instance = openModal({
    title: 'Kelola Produk POS',
    subtitle: 'Tambah, ubah harga, nonaktifkan, atau hapus layanan.',
    size: 'lg',
    body: `
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <p class="text-[11px] text-stone-500">Perubahan langsung dipakai di kasir.</p>
          <button type="button" class="btn-primary btn-sm" data-pm-add>${icon('Plus', 'w-4 h-4')} Tambah Produk</button>
        </div>
        <div id="pos-pm-list" class="space-y-2"></div>
      </div>
    `,
    footer: `<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,
    onMount(el) {
      const list = el.querySelector('#pos-pm-list');

      const paintList = () => {
        const products = getPosProducts();
        list.innerHTML = products.length
          ? products
              .map(
                (product) => `
                <div class="rounded-2xl border border-line bg-white px-3.5 py-3 flex flex-wrap items-center gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-xs font-extrabold text-stone-800">${esc(product.name)}</p>
                      <span class="badge-gray normal-case tracking-normal">${esc(product.category)}</span>
                      ${product.active ? '<span class="badge-green">Aktif</span>' : '<span class="badge-gray">Nonaktif</span>'}
                    </div>
                    <p class="text-[11px] text-stone-500 mt-0.5">${money(product.price)}${product.unit ? ` / ${esc(product.unit)}` : ''}</p>
                  </div>
                  <div class="flex items-center gap-1 ml-auto">
                    <button type="button" class="btn-outline btn-xs" data-pm-toggle="${product.id}">${product.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                    <button type="button" class="btn-ghost btn-xs" data-pm-edit="${product.id}" title="Edit">${icon('Pencil', 'w-3.5 h-3.5')}</button>
                    <button type="button" class="btn-ghost btn-xs text-rose-600" data-pm-delete="${product.id}" title="Hapus">${icon('Trash2', 'w-3.5 h-3.5')}</button>
                  </div>
                </div>`,
              )
              .join('')
          : `<p class="text-sm text-stone-500 text-center py-8">Belum ada produk. Tambahkan layanan pertama.</p>`;
      };

      paintList();

      el.querySelector('[data-pm-add]')?.addEventListener('click', () => {
        openProductForm(null, paintList);
      });

      el.addEventListener('click', async (event) => {
        const edit = event.target.closest('[data-pm-edit]');
        if (edit) {
          openProductForm(Number(edit.dataset.pmEdit), paintList);
          return;
        }

        const toggle = event.target.closest('[data-pm-toggle]');
        if (toggle) {
          togglePosProduct(Number(toggle.dataset.pmToggle));
          paintList();
          toast('Status produk diperbarui.');
          return;
        }

        const remove = event.target.closest('[data-pm-delete]');
        if (!remove) return;
        const product = getPosProduct(Number(remove.dataset.pmDelete));
        const approved = await confirmAction({
          title: 'Hapus produk?',
          message: `Produk <b>${esc(product?.name || '')}</b> akan dihapus dari kasir. Transaksi lama tetap menyimpan nama dan harga saat itu.`,
          confirmText: 'Ya, hapus',
          danger: true,
        });
        if (!approved) return;
        deletePosProduct(Number(remove.dataset.pmDelete));
        paintList();
        toast('Produk berhasil dihapus.');
      });
    },
  });

  void instance;
}

export function render(root) {
  const owner = isOwner();
  root.innerHTML = `
    <div data-view="pos" class="animate-in">
      ${pageHeader({
        eyebrow: 'Point of Sale',
        title: 'POS / Kasir 🧺',
        subtitle: 'Catat penjualan laundry dan layanan lain. Owner dapat menambah atau mengubah produk.',
        actions: `
          ${owner ? `<button type="button" class="btn-outline btn-sm" data-pos-manage>${icon('Package', 'w-4 h-4')} Kelola Produk</button>` : ''}
          <button type="button" class="btn-primary btn-sm" data-pos-new>${icon('ShoppingCart', 'w-4 h-4')} Transaksi Baru</button>
        `,
      })}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3">
        <button type="button" class="${activeTab === 'kasir' ? 'chip-active' : 'chip-idle'} flex items-center gap-1.5" data-pos-tab="kasir">${icon('ShoppingCart', 'w-3.5 h-3.5')} Kasir</button>
        <button type="button" class="${activeTab === 'riwayat' ? 'chip-active' : 'chip-idle'} flex items-center gap-1.5" data-pos-tab="riwayat">${icon('ReceiptText', 'w-3.5 h-3.5')} Riwayat</button>
      </div>

      <div id="pos-content"></div>
    </div>
  `;

  const scope = root.querySelector('[data-view="pos"]');
  paint(scope);

  scope.querySelectorAll('[data-pos-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.posTab === 'riwayat' ? 'riwayat' : 'kasir';
      paint(scope);
    });
  });

  delegate(scope, 'click', '[data-pos-new]', () => {
    activeTab = 'kasir';
    paint(scope);
  });

  delegate(scope, 'click', '[data-pos-category]', (event, target) => {
    categoryFilter = target.dataset.posCategory || 'semua';
    const categories = scope.querySelector('#pos-categories');
    if (categories) categories.innerHTML = categoryChips();
    const products = scope.querySelector('#pos-products');
    if (products) products.innerHTML = productGridHtml();
  });

  delegate(scope, 'input', '#pos-search', (event, target) => {
    searchTerm = target.value;
    const products = scope.querySelector('#pos-products');
    if (products) products.innerHTML = productGridHtml();
  });

  delegate(scope, 'click', '[data-pos-add]', (event, target) => {
    const productId = Number(target.dataset.product);
    const product = getPosProduct(productId);
    if (!product || !product.active) {
      toast('Produk tidak tersedia.', 'warning');
      return;
    }
    const existing = cart.find((entry) => Number(entry.productId) === productId);
    if (existing) existing.qty = roundQty(existing.qty + 1);
    else cart.push({ productId, qty: 1 });
    refreshCart(scope);
  });

  delegate(scope, 'click', '[data-pos-plus]', (event, target) => {
    const productId = Number(target.dataset.product);
    const entry = cart.find((item) => Number(item.productId) === productId);
    if (!entry) return;
    entry.qty = roundQty(entry.qty + 1);
    refreshCart(scope);
  });

  delegate(scope, 'click', '[data-pos-minus]', (event, target) => {
    const productId = Number(target.dataset.product);
    const entry = cart.find((item) => Number(item.productId) === productId);
    if (!entry) return;
    entry.qty = roundQty(entry.qty - 1);
    if (entry.qty <= 0) cart = cart.filter((item) => Number(item.productId) !== productId);
    refreshCart(scope);
  });

  delegate(scope, 'change', '[data-pos-qty]', (event, target) => {
    const productId = Number(target.dataset.product);
    const entry = cart.find((item) => Number(item.productId) === productId);
    if (!entry) return;
    entry.qty = roundQty(target.value);
    if (entry.qty <= 0) cart = cart.filter((item) => Number(item.productId) !== productId);
    refreshCart(scope);
  });

  delegate(scope, 'click', '[data-pos-remove]', (event, target) => {
    const productId = Number(target.dataset.product);
    cart = cart.filter((item) => Number(item.productId) !== productId);
    refreshCart(scope);
  });

  delegate(scope, 'click', '[data-pos-clear]', () => {
    cart = [];
    draft.discount = '';
    draft.amountPaid = '';
    refreshCart(scope);
  });

  const refreshDraftTotals = () => {
    syncDraftFromInputs(scope);
    const totals = scope.querySelector('#pos-totals');
    if (totals) totals.innerHTML = totalsHtml();
  };

  delegate(scope, 'input', '#pos-discount, #pos-paid, #pos-method', refreshDraftTotals);
  delegate(scope, 'change', '#pos-method', refreshDraftTotals);

  delegate(scope, 'input', '#pos-customer-name, #pos-customer-phone, #pos-note', () => {
    syncDraftFromInputs(scope);
  });

  delegate(scope, 'click', '[data-pos-checkout]', () => {
    syncDraftFromInputs(scope);
    const totals = cartTotals();
    if (!totals.lines.length) {
      toast('Keranjang masih kosong.', 'warning');
      return;
    }

    try {
      const sale = createPosSale({
        items: totals.lines.map((line) => ({
          productId: line.product.id,
          qty: line.qty,
        })),
        discount: draft.discount,
        method: draft.method,
        amountPaid: draft.amountPaid,
        customerName: draft.customerName,
        customerPhone: draft.customerPhone,
        note: draft.note,
        date: todayISO(),
      });
      resetCheckout();
      paint(scope);
      openReceipt(sale, { fresh: true });
      toast('Transaksi POS berhasil disimpan.');
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  delegate(scope, 'click', '[data-pos-manage]', () => {
    openProductManager();
  });

  delegate(scope, 'click', '[data-pos-detail]', (event, target) => {
    const sale = getPosSales().find((item) => String(item.id) === String(target.dataset.sale));
    if (sale) openReceipt(sale);
  });

  delegate(scope, 'click', '[data-pos-delete-sale]', async (event, target) => {
    if (!isOwner()) {
      toast('Hapus transaksi hanya dapat dilakukan oleh owner.', 'warning');
      return;
    }
    const sale = getPosSales().find((item) => String(item.id) === String(target.dataset.sale));
    const approved = await confirmAction({
      title: 'Hapus transaksi POS?',
      message: `Transaksi <b>${esc(sale?.number || '')}</b> sebesar <b>${money(sale?.total || 0)}</b> akan dihapus permanen dan tidak lagi dihitung di laporan.`,
      confirmText: 'Ya, hapus',
      danger: true,
    });
    if (!approved) return;
    deletePosSale(Number(target.dataset.sale));
    paint(scope);
    toast('Transaksi POS berhasil dihapus.');
  });
}
