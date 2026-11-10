import { formatDate, rupiah } from '../core/format.js';
import { getBankDetails, getNotificationEmail, getSettings } from './settings.js';

function adminKey() {
  return String(getSettings().catalogAdminKey || '').trim();
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function mailtoLink(to, subject, body) {
  const target = String(to || '').trim();
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${target}?${query}`;
}

export function openMailto(to, subject, body) {
  window.location.href = mailtoLink(to, subject, body);
}

/**
 * Send an email through the serverless email endpoint (Resend).
 * Throws a friendly error when the provider is not configured.
 */
export async function sendEmail({ to, subject, text }) {
  const target = String(to || '').trim();
  if (!isValidEmail(target)) throw new Error('Alamat email penerima tidak valid.');

  const key = adminKey();
  if (!key) {
    const error = new Error('Kunci admin belum diisi. Buka Pengaturan terlebih dahulu.');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  let response;
  try {
    response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': key,
      },
      body: JSON.stringify({ to: target, subject, text }),
    });
  } catch {
    const error = new Error('Layanan email tidak dapat dihubungi.');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const error = new Error('Layanan email belum tersedia di server.');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(String(result.error || 'Gagal mengirim email.'));
    error.code = result.code || (response.status === 503 ? 'EMAIL_NOT_CONFIGURED' : '');
    throw error;
  }

  return result;
}

function propertyName() {
  return String(getSettings().propertyName || 'Casa Ramire');
}

function propertySignature() {
  const settings = getSettings();
  return [
    '',
    propertyName(),
    settings.address ? String(settings.address) : '',
    settings.whatsapp ? `WhatsApp: ${settings.whatsapp}` : '',
    settings.email ? `Email: ${settings.email}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Build a billing email. A payment URL is optional so bills can still be sent
 * by email while the DOKU account is not active yet.
 */
export function buildBillingEmail({
  name,
  title,
  invoiceNumber,
  amount,
  dueDate,
  description,
  paymentUrl,
  expiresAt,
  paymentInstructions,
}) {
  const subject = `${title} — ${propertyName()}`;
  const bank = getBankDetails();
  const instructions =
    String(paymentInstructions || '').trim() ||
    [
      `Transfer ke ${bank.bankName}`,
      `No. Rekening: ${bank.accountNumber}`,
      `a.n. ${bank.accountName}`,
      '',
      'Setelah transfer, kirim bukti pembayaran ke WhatsApp admin Casa Ramire.',
    ].join('\n');
  const lines = [
    `Halo ${name || 'Kak'},`,
    '',
    `${title}${invoiceNumber ? ` (${invoiceNumber})` : ''}`,
    description ? String(description) : null,
    `Nominal: ${rupiah(amount)}`,
    dueDate ? `Jatuh tempo: ${formatDate(dueDate)}` : null,
    expiresAt ? `Berlaku sampai: ${expiresAt}` : null,
    '',
    paymentUrl
      ? 'Silakan lakukan pembayaran melalui link berikut:'
      : instructions ||
        'Silakan lakukan pembayaran melalui transfer Bank Mandiri. Setelah membayar, kirim bukti pembayaran ke admin Casa Ramire.',
    paymentUrl || null,
    '',
    paymentUrl
      ? 'Status pembayaran akan diperbarui otomatis setelah pembayaran berhasil.'
      : 'Pembayaran akan diverifikasi oleh admin. Simpan pesan ini sebagai bukti tagihan.',
    ...propertySignature().split('\n'),
  ];

  return {
    subject,
    text: lines.filter((line) => line !== null && line !== undefined).join('\n'),
  };
}

export const buildPaymentEmail = buildBillingEmail;

/**
 * Send a bill/payment link by email. When the email provider has not been
 * configured yet, fall back to the device's default mail client so the bill is
 * never lost.
 */
export async function sendBillingEmail(payload, { fallbackToMailto = true, copyToAdmin = true } = {}) {
  const { subject, text } = buildBillingEmail(payload);
  const recipient = String(payload.to || '').trim().toLowerCase();
  const admin = getNotificationEmail().toLowerCase();

  try {
    await sendEmail({ to: payload.to, subject, text });
  } catch (error) {
    if (error.code === 'EMAIL_NOT_CONFIGURED' && fallbackToMailto) {
      openMailto(payload.to, subject, text);
      return { sent: false, fallback: true, error };
    }
    throw error;
  }

  // Keep a copy in the owner inbox so bills sent from POS/manual invoices are
  // auditable even when the staff device closes the browser.
  if (copyToAdmin && admin && admin !== recipient) {
    sendEmail({ to: admin, subject: `[Salinan Admin] ${subject}`, text }).catch((error) => {
      console.warn('[email] gagal mengirim salinan admin', error.message);
    });
  }

  return { sent: true, fallback: false };
}

export const sendPaymentEmail = sendBillingEmail;
