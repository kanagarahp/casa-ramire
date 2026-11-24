import { formatDate, rupiah, toNumber } from '../core/format.js';
import { getState } from '../core/store.js';
import { getApiAuthHeaders, hasApiAuth } from './auth.js';
import { ensureSynced } from './sync.js';
import { logoMark } from '../ui/brand.js';
import { esc, setBusy } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

function formatDateLong(value) {
  const raw = String(value || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return '-';
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function dateISO(value) {
  return String(value || '').slice(0, 10);
}

function findTenant(state, tenantId) {
  if (!tenantId) return null;
  return (
    state.tenants.find((tenant) => String(tenant.id) === String(tenantId)) || null
  );
}

function clientOf(record, tenant) {
  return {
    name: String(record.tenantName || record.customerName || tenant?.name || 'Pelanggan').trim(),
    address: String(record.address || tenant?.address || '').trim(),
    phone: String(record.phone || record.customerPhone || tenant?.phone || '').trim(),
    email: String(record.email || record.customerEmail || tenant?.email || '')
      .trim()
      .toLowerCase(),
  };
}

function posItems(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    title: String(item.name || 'Layanan').trim(),
    subtitle: [
      `${Number(item.qty || 0).toLocaleString('id-ID', {
        maximumFractionDigits: 2,
      })}${item.unit ? ` ${item.unit}` : ''} x ${rupiah(item.price)}`,
      item.category && item.category !== 'Lainnya' ? item.category : '',
    ]
      .filter(Boolean)
      .join(' · '),
    amount: toNumber(item.subtotal ?? toNumber(item.price) * toNumber(item.qty)),
  }));
}

function propertyOf(state) {
  const settings = state.settings || {};
  return {
    name: String(settings.propertyName || 'Casa Ramire').trim(),
    address: String(settings.address || '').trim(),
    whatsapp: String(settings.whatsapp || '').trim(),
    email: String(settings.email || '').trim(),
    bankName: String(settings.bankName || 'Bank Mandiri').trim(),
    bankAccountNumber: String(settings.bankAccountNumber || '700013745877').trim(),
    bankAccountName: String(settings.bankAccountName || 'ERNY KURNIAWATI').trim(),
  };
}

/** Build the invoice data used by the preview. */
export function buildInvoiceData({ type, id }) {
  const state = getState();
  const property = propertyOf(state);

  if (type === 'bill') {
    const bill = state.bills.find((item) => String(item.id) === String(id));
    if (!bill) return null;
    const tenant = findTenant(state, bill.tenantId);
    const periodStart = bill.periodStart || '';
    const periodEnd = bill.periodEnd || '';
    return {
      type: 'bill',
      id: bill.id,
      number: bill.number || `INV-${bill.id}`,
      status: bill.status === 'paid' ? 'paid' : 'unpaid',
      dateISO: bill.paidAt || bill.createdAt || bill.dueDate,
      dueDate: bill.dueDate || '',
      method: bill.method || '',
      client: clientOf(bill, tenant),
      items: [
        {
          title: `Pembayaran Kamar #${bill.roomNumber || '-'} | ${bill.type || 'Sewa'}`,
          subtitle:
            periodStart && periodEnd
              ? `Periode ${formatDate(periodStart)} - ${formatDate(periodEnd)}`
              : bill.description || `Jatuh tempo ${formatDate(bill.dueDate)}`,
          amount: toNumber(bill.amount),
        },
      ],
      subtotal: toNumber(bill.amount),
      discount: 0,
      total: toNumber(bill.amount),
      paid: toNumber(bill.paid),
      outstanding: Math.max(0, toNumber(bill.amount) - toNumber(bill.paid)),
      property,
      meta: { roomNumber: bill.roomNumber || '' },
    };
  }

  if (type === 'invoice') {
    const invoice = state.manualInvoices.find((item) => String(item.id) === String(id));
    if (!invoice) return null;
    const tenant = findTenant(state, invoice.tenantId);
    const items = posItems(invoice.items);
    const subtotal = toNumber(
      invoice.subtotal ?? items.reduce((sum, item) => sum + item.amount, 0),
    );
    const total = toNumber(invoice.amount ?? subtotal);
    return {
      type: 'invoice',
      id: invoice.id,
      number: invoice.number || `SRV-${invoice.id}`,
      status: invoice.status === 'paid' ? 'paid' : 'unpaid',
      dateISO: invoice.paidAt || invoice.createdAt || invoice.dueDate,
      dueDate: invoice.dueDate || '',
      method: invoice.method || '',
      client: clientOf(invoice, tenant),
      items: items.length
        ? items
        : [
            {
              title: invoice.item || 'Layanan',
              subtitle: invoice.note || `Jatuh tempo ${formatDate(invoice.dueDate)}`,
              amount: total,
            },
          ],
      subtotal,
      discount: toNumber(invoice.discount),
      total,
      paid: toNumber(invoice.paid ?? invoice.amountPaid),
      outstanding: Math.max(0, total - toNumber(invoice.paid ?? invoice.amountPaid)),
      property,
      meta: { roomNumber: invoice.roomNumber || '', source: invoice.source || 'manual' },
    };
  }

  if (type === 'pos') {
    const sale = state.posSales.find((item) => String(item.id) === String(id));
    if (!sale) return null;
    const tenant = findTenant(state, sale.tenantId);
    const items = posItems(sale.items);
    const subtotal = toNumber(
      sale.subtotal ?? items.reduce((sum, item) => sum + item.amount, 0),
    );
    const total = toNumber(sale.total ?? subtotal);
    return {
      type: 'pos',
      id: sale.id,
      number: sale.number || sale.invoiceNumber || `POS-${sale.id}`,
      status: sale.status === 'paid' ? 'paid' : 'unpaid',
      dateISO: sale.paidAt || sale.createdAt || sale.date,
      dueDate: sale.dueDate || '',
      method: sale.method || '',
      client: clientOf(sale, tenant),
      items,
      subtotal,
      discount: toNumber(sale.discount),
      total,
      paid: sale.status === 'paid' ? toNumber(sale.amountPaid ?? total) : 0,
      outstanding: sale.status === 'paid' ? 0 : total,
      property,
      meta: { roomNumber: sale.roomNumber || '' },
    };
  }

  return null;
}

export function invoiceEmailFor({ type, id }) {
  return buildInvoiceData({ type, id })?.client.email || '';
}

function itemRows(invoice) {
  return invoice.items
    .map(
      (item, index) => `
        <div style="display:flex;justify-content:space-between;gap:20px;padding:11px 12px;${index % 2 === 1 ? 'background:#f5f5f4;' : ''}">
          <div style="min-width:0;">
            <div style="font-weight:700;color:#292524;font-size:12px;">${esc(item.title)}</div>
            ${item.subtitle ? `<div style="font-size:10px;color:#78716c;margin-top:2px;">${esc(item.subtitle)}</div>` : ''}
          </div>
          <div style="white-space:nowrap;font-weight:700;font-size:12px;color:#292524;">${rupiah(item.amount)}</div>
        </div>`,
    )
    .join('');
}

/** HTML preview that mirrors the PDF layout. */
function invoiceHtml(invoice) {
  const paid = invoice.status === 'paid';
  const property = invoice.property;
  const contact = [property.whatsapp, property.email].filter(Boolean).join('  ·  ');
  const extraTotals =
    invoice.subtotal !== invoice.total || invoice.discount > 0
      ? `<div style="margin-top:10px;font-size:11px;color:#78716c;display:flex;justify-content:space-between;padding:0 12px;">
           <span>Subtotal</span><span>${rupiah(invoice.subtotal)}</span>
         </div>
         ${
           invoice.discount > 0
             ? `<div style="font-size:11px;color:#be123c;display:flex;justify-content:space-between;padding:2px 12px;">
                  <span>Diskon</span><span>-${rupiah(invoice.discount)}</span>
                </div>`
             : ''
         }`
      : '';

  return `
    <div style="border-radius:18px;background:#f5f5f4;padding:10px;overflow-x:auto;">
      <div style="max-width:720px;min-width:520px;margin:0 auto;background:#ffffff;box-shadow:0 18px 45px rgba(41,37,36,.16);">
        <div style="background:#1f3938;color:#ffffff;padding:24px 30px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
          <div style="font-size:32px;line-height:1;font-weight:800;letter-spacing:-.03em;">Invoice</div>
          <div style="text-align:right;">
            <div style="display:flex;justify-content:flex-end;align-items:center;gap:10px;">
              ${logoMark('w-11 h-11')}
              <div>
                <div style="color:#d4a359;font-weight:800;letter-spacing:.14em;font-size:13px;">CASA RAMIRE</div>
                <div style="font-size:9px;color:#d6d3d1;margin-top:3px;">${esc(contact)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style="padding:26px 30px 30px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div>
              <div style="display:inline-block;font-weight:800;font-size:15px;color:#1f3938;border-bottom:3px solid #d4a359;padding-bottom:4px;">Klien</div>
            </div>
            ${
              paid
                ? '<span style="font-size:10px;font-weight:800;letter-spacing:.08em;color:#047857;background:#ecfdf5;border-radius:999px;padding:5px 10px;">LUNAS</span>'
                : '<span style="font-size:10px;font-weight:800;letter-spacing:.08em;color:#b45309;background:#fffbeb;border-radius:999px;padding:5px 10px;">BELUM DIBAYAR</span>'
            }
          </div>

          <table style="width:100%;margin-top:14px;border-collapse:collapse;font-size:12px;">
            <tr><td style="width:74px;color:#78716c;padding:3px 0;">Nama</td><td style="padding:3px 0;">: ${esc(invoice.client.name || '-')}</td></tr>
            <tr><td style="color:#78716c;padding:3px 0;">Alamat</td><td style="padding:3px 0;">: ${esc(invoice.client.address || '-')}</td></tr>
            <tr><td style="color:#78716c;padding:3px 0;">Telepon</td><td style="padding:3px 0;">: ${esc(invoice.client.phone || '-')}</td></tr>
          </table>

          <div style="margin-top:28px;display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#1f3938;padding:0 12px;">
            <span>Items</span><span>Total</span>
          </div>
          <div style="border-top:1px solid #e7e5e4;margin-top:6px;">${itemRows(invoice)}</div>
          ${extraTotals}
          <div style="margin-top:14px;background:#1f3938;color:#ffffff;padding:13px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:800;">
            <span>Total</span><span style="font-size:16px;">${rupiah(invoice.total)}</span>
          </div>

          <div style="margin-top:24px;text-align:right;font-size:11px;line-height:1.8;color:#78716c;">
            <div>Tanggal : ${formatDateLong(dateISO(invoice.dateISO))}</div>
            <div>No Order : ${esc(invoice.number)}</div>
          </div>

          ${
            paid
              ? `<p style="margin:20px 0 0;font-size:11px;color:#78716c;">Terima kasih atas pembayaran Anda.</p>`
              : `<div style="margin-top:18px;border-top:1px solid #e7e5e4;padding-top:14px;font-size:11px;line-height:1.7;color:#57534e;">
                  <b style="color:#1f3938;">Pembayaran ke:</b><br />
                  ${esc(property.bankName)} · ${esc(property.bankAccountNumber)} · a.n. ${esc(property.bankAccountName)}<br />
                  <span style="color:#be123c;font-weight:700;">Jatuh tempo: ${formatDateLong(dateISO(invoice.dueDate))}</span>
                </div>`
          }
        </div>
      </div>
    </div>
  `;
}

async function fetchInvoicePdf({ type, id }) {
  if (!hasApiAuth()) throw new Error('Sesi login tidak valid. Silakan masuk kembali.');
  const synced = await ensureSynced();
  if (!synced) {
    throw new Error('Sinkronisasi data belum siap. Periksa koneksi lalu coba lagi.');
  }
  const response = await fetch(
    `/api/invoice?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`,
    { headers: getApiAuthHeaders(), cache: 'no-store' },
  );
  if (!response.ok) {
    let message = 'Gagal membuat PDF invoice.';
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return response.blob();
}

function filenameOf(invoice) {
  return `Invoice-${String(invoice.number || 'Casa-Ramire').replace(/[\\/:*?"<>|\s]+/g, '-')}.pdf`;
}

export async function downloadInvoicePdf({ type, id }) {
  const invoice = buildInvoiceData({ type, id });
  const blob = await fetchInvoicePdf({ type, id });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filenameOf(invoice || {});
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function openInvoicePdf({ type, id }) {
  // Open the tab while the click gesture is still active; some mobile
  // browsers block window.open() after an await.
  const win = window.open('', '_blank');
  if (!win) {
    toast('Popup diblokir. Gunakan tombol Download PDF.', 'warning');
    return;
  }
  try {
    const blob = await fetchInvoicePdf({ type, id });
    const url = URL.createObjectURL(blob);
    win.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    try {
      win.close();
    } catch {
      /* ignore */
    }
    throw error;
  }
}

export async function sendInvoiceEmail({
  type,
  id,
  mode,
  to = '',
  paymentUrl = '',
  expiresAt = '',
}) {
  if (!hasApiAuth()) throw new Error('Sesi login tidak valid. Silakan masuk kembali.');
  const synced = await ensureSynced();
  if (!synced) {
    throw new Error('Sinkronisasi data belum siap. Periksa koneksi lalu coba lagi.');
  }
  const response = await fetch('/api/invoice', {
    method: 'POST',
    headers: getApiAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ type, id, mode, to, paymentUrl, expiresAt }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'Gagal mengirim email invoice.');
  }
  return payload;
}

/** Send the paid invoice + thank-you email automatically. */
export async function sendPaidInvoiceEmail({ type, id }) {
  return sendInvoiceEmail({ type, id, mode: 'paid' });
}

export function openInvoicePreview({ type, id, sentTo = '' } = {}) {
  const invoice = buildInvoiceData({ type, id });
  if (!invoice) {
    toast('Data invoice tidak ditemukan.', 'error');
    return;
  }

  const paid = invoice.status === 'paid';
  const mode = paid ? 'paid' : 'billing';
  let currentEmail = invoice.client.email || '';

  openModal({
    title: `Invoice ${invoice.number}`,
    subtitle: `${esc(invoice.client.name)} • ${rupiah(invoice.total)}`,
    size: 'full',
    body: `
      <div class="space-y-4">
        ${
          sentTo
            ? `<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                <span class="shrink-0 mt-0.5">${icon('CheckCircle2', 'w-4 h-4')}</span>
                <span>Email ${paid ? 'ucapan terima kasih dan ' : ''}invoice PDF sudah dikirim ke <b>${esc(sentTo)}</b>.</span>
              </div>`
            : ''
        }
        <div class="rounded-2xl border border-line bg-white p-3.5">
          <label class="label" for="invoice-email">Kirim ke email</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input id="invoice-email" type="email" class="input flex-1" value="${esc(currentEmail)}" placeholder="nama@email.com" autocomplete="email" />
            <button type="button" class="btn-outline btn-sm sm:w-auto" data-invoice-send-local>${icon('Send', 'w-4 h-4')} Kirim Email</button>
          </div>
          <p class="hint mt-1.5">
            ${paid
              ? 'Email berisi ucapan terima kasih dan invoice PDF terlampir.'
              : 'Email berisi rincian tagihan dan invoice PDF terlampir.'}
          </p>
        </div>
        ${invoiceHtml(invoice)}
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      <button type="button" class="btn-outline btn-sm" data-invoice-download>${icon('Download', 'w-4 h-4')} Download PDF</button>
      <button type="button" class="btn-outline btn-sm" data-invoice-print>${icon('Printer', 'w-4 h-4')} Cetak</button>
      <button type="button" class="btn-primary btn-sm" data-invoice-send>${icon('Send', 'w-4 h-4')} ${paid ? 'Kirim Ucapan & Invoice' : 'Kirim Invoice'}</button>
    `,
    onMount(el, close) {
      const emailInput = el.querySelector('#invoice-email');
      const sendButton = el.querySelector('[data-invoice-send]');
      const sendLocal = el.querySelector('[data-invoice-send-local]');

      const doSend = async (button) => {
        const to = String(emailInput?.value || '').trim();
        if (!to) {
          toast('Isi email penerima terlebih dahulu.', 'warning');
          emailInput?.focus();
          return;
        }
        setBusy(button, true, 'Mengirim…');
        try {
          const result = await sendInvoiceEmail({ type, id, mode, to });
          toast(
            `Email ${paid ? 'ucapan terima kasih dan invoice' : 'invoice'} terkirim ke ${result.to || to}.`,
          );
          close();
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(button, false);
        }
      };

      sendButton?.addEventListener('click', () => doSend(sendButton));
      sendLocal?.addEventListener('click', () => doSend(sendLocal));

      el.querySelector('[data-invoice-download]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        setBusy(button, true, 'Membuat PDF…');
        try {
          await downloadInvoicePdf({ type, id });
          toast('Invoice PDF berhasil diunduh.');
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(button, false);
        }
      });

      el.querySelector('[data-invoice-print]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        setBusy(button, true, 'Membuka PDF…');
        try {
          await openInvoicePdf({ type, id });
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(button, false);
        }
      });
    },
  });
}
