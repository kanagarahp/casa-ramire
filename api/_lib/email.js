const DEFAULT_FROM = 'Casa Ramire <no-reply@casaramire.com>';
export const DEFAULT_NOTIFICATION_EMAIL = 'casaramirejogja@gmail.com';

export function notificationEmail() {
  return String(
    process.env.NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL,
  )
    .trim()
    .toLowerCase();
}

export function emailConfigured() {
  return Boolean(String(process.env.RESEND_API_KEY || '').trim());
}

function formatDate(value) {
  const raw = String(value || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw || '—';
  const [year, month, day] = raw.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function rupiah(value) {
  return `Rp${Math.round(Number(value) || 0).toLocaleString('id-ID')}`;
}

export async function sendResendEmail({ to, subject, text, html }) {
  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    const error = new Error(
      'Pengiriman email belum dikonfigurasi. Tambahkan RESEND_API_KEY di environment Vercel.',
    );
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const recipients = (Array.isArray(to) ? to : [to])
    .map((item) => String(item || '').trim().toLowerCase())
    .filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item));
  if (!recipients.length) throw new Error('Alamat email penerima tidak valid.');

  const from = String(process.env.EMAIL_FROM || DEFAULT_FROM).trim() || DEFAULT_FROM;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: String(subject || '').slice(0, 200),
      ...(text ? { text: String(text).slice(0, 40_000) } : {}),
      ...(html ? { html: String(html).slice(0, 80_000) } : {}),
      reply_to: String(process.env.EMAIL_REPLY_TO || notificationEmail()),
    }),
    signal: AbortSignal.timeout(20_000),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('[email] Resend menolak pengiriman', payload);
    const error = new Error(
      payload?.message ||
        'Gagal mengirim email. Periksa domain pengirim yang sudah diverifikasi di Resend.',
    );
    error.status = 502;
    throw error;
  }

  return { ok: true, id: payload?.id || '' };
}

export function renderBillingEmail({
  title,
  invoiceNumber,
  amount,
  dueDate,
  description,
  name,
  roomNumber,
  propertyName = 'Casa Ramire',
  paymentInstructions = '',
  bankName = 'Bank Mandiri',
  bankAccountNumber = '700013745877',
  bankAccountName = 'ERNY KURNIAWATI',
}) {
  const instructions =
    String(paymentInstructions || '').trim() ||
    [
      `Transfer ke ${bankName}`,
      `No. Rekening: ${bankAccountNumber}`,
      `a.n. ${bankAccountName}`,
      '',
      'Setelah transfer, kirim bukti pembayaran ke WhatsApp admin Casa Ramire.',
    ].join('\n');
  const lines = [
    `Halo ${name || 'Kak'},`,
    '',
    `${title}${invoiceNumber ? ` (${invoiceNumber})` : ''}`,
    roomNumber ? `Kamar: ${roomNumber}` : null,
    description ? String(description) : null,
    `Nominal: ${rupiah(amount)}`,
    dueDate ? `Jatuh tempo: ${formatDate(dueDate)}` : null,
    '',
    instructions,
    '',
    propertyName,
  ].filter((line) => line !== null && line !== undefined);

  return {
    subject: `${title} — ${propertyName}`,
    text: lines.join('\n'),
  };
}
