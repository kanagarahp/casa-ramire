import { rupiah } from '../core/format.js';
import { getSettings } from './settings.js';

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

export function buildPaymentEmail({ name, title, invoiceNumber, amount, paymentUrl, expiresAt }) {
  const subject = `${title} — ${propertyName()}`;
  const lines = [
    `Halo ${name || 'Kak'},`,
    '',
    `${title}${invoiceNumber ? ` (${invoiceNumber})` : ''}`,
    `Nominal: ${rupiah(amount)}`,
    expiresAt ? `Berlaku sampai: ${expiresAt}` : null,
    '',
    'Silakan lakukan pembayaran melalui link berikut:',
    paymentUrl,
    '',
    'Status pembayaran akan diperbarui otomatis setelah pembayaran berhasil.',
    ...propertySignature().split('\n'),
  ];

  return {
    subject,
    text: lines.filter((line) => line !== null && line !== undefined).join('\n'),
  };
}

/**
 * Send a billing/payment link by email. When the email provider has not been
 * configured yet, fall back to the device's default mail client so the link is
 * never lost.
 */
export async function sendPaymentEmail(payload) {
  const { subject, text } = buildPaymentEmail(payload);
  try {
    await sendEmail({ to: payload.to, subject, text });
    return { sent: true, fallback: false };
  } catch (error) {
    if (error.code === 'EMAIL_NOT_CONFIGURED') {
      openMailto(payload.to, subject, text);
      return { sent: false, fallback: true, error };
    }
    throw error;
  }
}
