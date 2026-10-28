import { rupiah, waLink } from '../core/format.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import { getSettings } from './settings.js';
import { ensureSynced } from './sync.js';

function adminKey() {
  return String(getSettings().catalogAdminKey || '').trim();
}

async function postPaymentLink(payload) {
  const key = adminKey();
  if (!key) {
    throw new Error(
      'Kunci admin belum diisi. Buka Pengaturan → Landing page & katalog publik.',
    );
  }

  const synced = await ensureSynced();
  if (!synced) {
    throw new Error(
      'Sinkronisasi data belum siap. Periksa koneksi dan kunci admin, lalu coba lagi.',
    );
  }

  const response = await fetch('/api/payments/doku/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': key,
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      'API pembayaran DOKU tidak tersedia. Gunakan production atau jalankan `vercel dev`.',
    );
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = String(result.error || 'Gagal membuat link pembayaran DOKU.');
    if (/PAYMENT CHANNEL IS INACTIVE/i.test(message)) {
      throw new Error(
        'Channel DOKU masih nonaktif. Aktifkan QRIS/VA/e-wallet di DOKU Back Office terlebih dahulu.',
      );
    }
    if (/sinkronisasi/i.test(message)) {
      throw new Error(message);
    }
    throw new Error(message);
  }

  return result;
}

export function createBillPaymentLink(bill) {
  return postPaymentLink({ kind: 'bill', recordId: bill.id });
}

export function createInvoicePaymentLink(invoice) {
  return postPaymentLink({ kind: 'invoice', recordId: invoice.id });
}

export function createRenewalPaymentLink(renewal) {
  return postPaymentLink({ kind: 'renewal', renewal });
}

function formatExpiry(value) {
  const raw = String(value || '');
  if (!/^\d{14}$/.test(raw)) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)} ${raw.slice(8, 10)}:${raw.slice(10, 12)}`;
}

function copyText(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
  } finally {
    input.remove();
  }
  return Promise.resolve();
}

export function openPaymentLinkModal({
  title = 'Link Pembayaran DOKU',
  subtitle = '',
  paymentUrl,
  invoiceNumber = '',
  amount = 0,
  expiresAt = '',
  phone = '',
  message = '',
}) {
  if (!paymentUrl) {
    toast('Link pembayaran tidak tersedia.', 'error');
    return;
  }

  const customerMessage = `${message}${message ? '\n\n' : ''}Link pembayaran: ${paymentUrl}`;
  const wa = phone ? waLink(phone, customerMessage) : '';

  openModal({
    title,
    subtitle,
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div class="flex items-start gap-3">
            <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              ${icon('CreditCard', 'w-5 h-5')}
            </span>
            <div class="min-w-0">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Link pembayaran siap</p>
              <p class="text-xl font-black text-emerald-900 mt-1">${rupiah(amount)}</p>
              ${invoiceNumber ? `<p class="text-[11px] font-semibold text-emerald-800 mt-0.5">${esc(invoiceNumber)}</p>` : ''}
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="pay-link">Link DOKU</label>
          <div class="flex gap-2">
            <input id="pay-link" type="text" class="input font-mono text-[11px]" readonly value="${esc(paymentUrl)}" />
            <button type="button" class="btn-outline btn-sm shrink-0" data-copy-link>${icon('Copy', 'w-4 h-4')} Salin</button>
          </div>
          ${expiresAt ? `<p class="hint mt-1">Berlaku sampai: ${esc(formatExpiry(expiresAt))}</p>` : ''}
        </div>

        <div class="rounded-xl border border-line bg-cream/60 px-3 py-2.5 text-[11px] text-stone-600 leading-relaxed">
          Status pembayaran akan <b>otomatis diperbarui</b> setelah pelanggan membayar di halaman DOKU.
          Tidak perlu verifikasi manual.
        </div>

        <div class="flex flex-wrap gap-2">
          <a href="${esc(paymentUrl)}" target="_blank" rel="noopener" class="btn-primary btn-sm">
            ${icon('ExternalLink', 'w-4 h-4')} Buka halaman pembayaran
          </a>
          ${
            wa
              ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-outline btn-sm text-emerald-700">
                  ${icon('MessageCircle', 'w-4 h-4')} Kirim via WhatsApp
                </a>`
              : ''
          }
        </div>
      </div>
    `,
    footer: `<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,
    onMount(el, close) {
      el.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
        try {
          await copyText(paymentUrl);
          toast('Link pembayaran disalin.');
        } catch {
          el.querySelector('#pay-link')?.select();
          toast('Salin link secara manual.', 'warning');
        }
      });

      el.querySelector('[data-modal-close]')?.addEventListener('click', close);
    },
  });
}
