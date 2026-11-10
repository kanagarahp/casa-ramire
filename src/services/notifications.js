import { formatDate, rupiah, toNumber } from '../core/format.js';
import { getState } from '../core/store.js';
import { sendEmail, isValidEmail } from './email.js';
import { getNotificationEmail } from './settings.js';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function tenantEmailOf(record) {
  if (!record?.tenantId) return '';
  return (
    getState().tenants.find((tenant) => String(tenant.id) === String(record.tenantId))
      ?.email || ''
  );
}

function propertyName() {
  return String(getState().settings?.propertyName || 'Casa Ramire');
}

function signature() {
  const settings = getState().settings || {};
  return [
    '',
    settings.propertyName || 'Casa Ramire',
    settings.address || '',
    settings.whatsapp ? `WhatsApp: ${settings.whatsapp}` : '',
    settings.email ? `Email: ${settings.email}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function safeSend({ to, subject, text }) {
  const target = normalizeEmail(to);
  if (!isValidEmail(target)) return { sent: false, reason: 'invalid-recipient' };
  try {
    await sendEmail({ to: target, subject, text });
    return { sent: true, to: target };
  } catch (error) {
    console.warn('[notifications] email gagal dikirim', target, error.message);
    return { sent: false, to: target, reason: error.message, code: error.code || '' };
  }
}

async function sendWithAdminCopy({ to, subject, text, includeAdminCopy = true }) {
  const admin = normalizeEmail(getNotificationEmail());
  const recipient = normalizeEmail(to);
  const results = [];

  if (recipient) {
    results.push(await safeSend({ to: recipient, subject, text }));
  }

  if (includeAdminCopy && admin && admin !== recipient) {
    results.push(
      await safeSend({
        to: admin,
        subject: `[Salinan Admin] ${subject}`,
        text,
      }),
    );
  }

  return results;
}

/** Notify the guest and the owner inbox after a booking/check-in is saved. */
export async function notifyBookingSaved({ room, booking, email = '', isNew = true, kind = 'booking' }) {
  if (!booking) return { sent: false, reason: 'booking-missing' };
  const property = propertyName();
  const recipient = normalizeEmail(email || booking.email || '');
  const title =
    kind === 'checkin'
      ? `Konfirmasi Check-in Kamar ${room?.nomor || booking.roomNumber || ''}`
      : isNew
        ? `Konfirmasi Booking Kamar ${room?.nomor || booking.roomNumber || ''}`
        : `Perubahan Booking Kamar ${room?.nomor || booking.roomNumber || ''}`;

  const addons = Array.isArray(booking.addons) ? booking.addons : [];
  const depositPaid = toNumber(booking.depositPaid);
  const lines = [
    `Halo ${booking.name || 'Kak'},`,
    '',
    `${title} — ${property}`,
    `Kamar: ${room?.nomor || booking.roomNumber || '—'}`,
    `Tipe: ${room?.tipe || booking.tipe || 'Deluxe'}`,
    `Periode: ${formatDate(booking.startDate)} — ${formatDate(booking.endDate)}`,
    `Total sewa: ${rupiah(booking.grandTotal)}`,
    depositPaid > 0
      ? `Deposit/DP diterima: ${rupiah(depositPaid)}`
      : booking.deposit > 0
        ? `Deposit: ${rupiah(booking.deposit)} (belum dibayar)`
        : null,
    addons.length
      ? `Add-on: ${addons.map((addon) => `${addon.name} (${rupiah(addon.price)})`).join(', ')}`
      : null,
    booking.notes ? `Catatan: ${booking.notes}` : null,
    '',
    'Simpan email ini sebagai bukti booking. Admin akan menghubungi Anda untuk konfirmasi lanjutan.',
    ...signature().split('\n'),
  ].filter((line) => line !== null && line !== undefined);

  const text = lines.join('\n');
  const results = await sendWithAdminCopy({
    to: recipient || getNotificationEmail(),
    subject: title,
    text,
    includeAdminCopy: Boolean(recipient),
  });
  return { sent: results.some((result) => result.sent), results };
}

/** Notify tenant/customer + owner inbox when a payment or deposit is verified. */
export async function notifyPaymentConfirmed({ kind = 'bill', record, method = '', note = '' }) {
  if (!record) return { sent: false, reason: 'record-missing' };
  const recipient = normalizeEmail(record.email || tenantEmailOf(record));
  const isDeposit =
    String(record.type || '').toLowerCase().includes('deposit') ||
    String(record.item || '').toLowerCase().includes('deposit');
  const title = isDeposit ? 'DP / Deposit Diterima' : 'Pembayaran Dikonfirmasi';
  const amount = toNumber(record.paid || record.amount);
  const label = record.type || record.item || (kind === 'invoice' ? 'Invoice Layanan' : 'Tagihan Sewa');
  const number = record.number || '—';
  const text = [
    `Halo ${record.tenantName || 'Kak'},`,
    '',
    `${title} — ${propertyName()}`,
    `Nomor: ${number}`,
    `Jenis: ${label}`,
    `Nominal: ${rupiah(amount)}`,
    method ? `Metode: ${method}` : null,
    note ? `Catatan: ${note}` : null,
    `Kamar: ${record.roomNumber || '—'}`,
    '',
    'Pembayaran sudah tercatat dan diverifikasi oleh admin. Terima kasih.',
    ...signature().split('\n'),
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n');

  const results = await sendWithAdminCopy({
    to: recipient || getNotificationEmail(),
    subject: title,
    text,
    includeAdminCopy: Boolean(recipient),
  });

  return { sent: results.some((result) => result.sent), results };
}

/** Send a paid POS receipt/confirmation to the customer and owner inbox. */
export async function notifyPosPayment({ sale, email = '' }) {
  if (!sale) return { sent: false, reason: 'sale-missing' };
  const recipient = normalizeEmail(email || sale.customerEmail || '');
  const items = (sale.items || [])
    .map((item) => `- ${item.name} x${item.qty} = ${rupiah(item.subtotal)}`)
    .join('\n');
  const text = [
    `Halo ${sale.customerName || 'Kak'},`,
    '',
    `Pembayaran POS diterima — ${propertyName()}`,
    `Nomor: ${sale.number || '—'}`,
    items,
    `Total: ${rupiah(sale.total)}`,
    `Metode: ${sale.method || '—'}`,
    '',
    'Terima kasih sudah menggunakan layanan Casa Ramire.',
    ...signature().split('\n'),
  ].join('\n');

  const results = await sendWithAdminCopy({
    to: recipient || getNotificationEmail(),
    subject: `Pembayaran POS ${sale.number || ''}`.trim(),
    text,
    includeAdminCopy: Boolean(recipient),
  });
  return { sent: results.some((result) => result.sent), results };
}

export async function sendAdminNotification({ subject, text }) {
  return sendWithAdminCopy({
    to: getNotificationEmail(),
    subject,
    text,
    includeAdminCopy: false,
  });
}
