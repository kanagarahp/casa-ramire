import { ensureCatalogSchema, query } from '../_lib/db.js';
import {
  emailConfigured,
  notificationEmail,
  renderBillingEmail,
  sendResendEmail,
} from '../_lib/email.js';
import { methodNotAllowed, requireAdmin, sendJson } from '../_lib/http.js';

const STATE_ID = 'public';

function todayISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function addDays(value, days) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return todayISO(date);
}

function toNumber(value) {
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function isAuthorized(req, res) {
  const secret = String(process.env.CRON_SECRET || '').trim();
  const header = String(req.headers.authorization || '').trim();
  if (secret && header === `Bearer ${secret}`) return true;
  return requireAdmin(req, res);
}

async function sendReminder({
  kind,
  record,
  propertyName,
  paymentInstructions,
  bankName,
  bankAccountNumber,
  bankAccountName,
}) {
  const recipient = String(record.email || '').trim().toLowerCase();
  const admin = notificationEmail();
  const outstanding = Math.max(0, toNumber(record.amount) - toNumber(record.paid));
  const isInvoice = kind === 'invoice';
  const title = isInvoice
    ? `Pengingat Invoice ${record.item || 'Layanan'}`
    : `Pengingat Tagihan ${record.type || 'Sewa'} Kamar ${record.roomNumber || '—'}`;
  const content = renderBillingEmail({
    title,
    invoiceNumber: record.number || '',
    amount: outstanding,
    dueDate: record.dueDate,
    description: record.description || record.item || '',
    name: record.tenantName || 'Kak',
    roomNumber: record.roomNumber || '',
    propertyName,
    paymentInstructions,
    bankName,
    bankAccountNumber,
    bankAccountName,
  });

  if (!recipient) {
    return { sent: false, reason: 'missing-email' };
  }

  await sendResendEmail({ to: recipient, subject: content.subject, text: content.text });
  if (admin && admin !== recipient) {
    await sendResendEmail({
      to: admin,
      subject: `[Salinan Admin] ${content.subject}`,
      text: content.text,
    }).catch((error) => console.warn('[reminders] salinan admin gagal', error.message));
  }
  return { sent: true, recipient };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    return methodNotAllowed(res, ['GET', 'POST']);
  }
  if (!isAuthorized(req, res)) return;

  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[reminders] database belum siap', error);
    return sendJson(res, 503, { error: 'Database belum siap.' });
  }

  if (!emailConfigured()) {
    return sendJson(res, 503, {
      error:
        'Email belum dikonfigurasi. Tambahkan RESEND_API_KEY dan EMAIL_FROM di environment Vercel.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
  }

  try {
    const result = await query('select data from casa_state where id = $1 limit 1', [STATE_ID]);
    if (!result.rows.length) {
      return sendJson(res, 200, {
        ok: true,
        sent: 0,
        failed: 0,
        checked: 0,
        message: 'Belum ada data tersinkronisasi.',
      });
    }
    const raw = result.rows[0].data;
    const state = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const targetDate = addDays(todayISO(), 7);
    const propertyName = String(state?.settings?.propertyName || 'Casa Ramire');
    const paymentInstructions = String(state?.settings?.paymentInstructions || '');
    const bankName = String(state?.settings?.bankName || 'Bank Mandiri');
    const bankAccountNumber = String(
      state?.settings?.bankAccountNumber || '700013745877',
    );
    const bankAccountName = String(
      state?.settings?.bankAccountName || 'ERNY KURNIAWATI',
    );

    const bills = (state.bills || []).filter(
      (bill) =>
        bill.status === 'unpaid' &&
        toNumber(bill.amount) - toNumber(bill.paid) > 0 &&
        String(bill.dueDate || '').slice(0, 10) === targetDate,
    );
    const invoices = (state.manualInvoices || []).filter(
      (invoice) =>
        invoice.status === 'unpaid' &&
        toNumber(invoice.amount) - toNumber(invoice.paid) > 0 &&
        String(invoice.dueDate || '').slice(0, 10) === targetDate,
    );

    const existing = new Set(
      (
        await query(
          'select id from casa_billing_reminders where due_date = $1 and status = $2',
          [targetDate, 'sent'],
        )
      ).rows.map((row) => row.id),
    );

    let sent = 0;
    let failed = 0;
    let skipped = 0;
    const details = [];

    for (const [kind, records] of [
      ['bill', bills],
      ['invoice', invoices],
    ]) {
      for (const record of records) {
        const reminderId = `${kind}:${record.id}:h7:${targetDate}`;
        if (existing.has(reminderId)) {
          skipped += 1;
          continue;
        }
        try {
          const outcome = await sendReminder({
            kind,
            record,
            propertyName,
            paymentInstructions,
            bankName,
            bankAccountNumber,
            bankAccountName,
          });
          if (!outcome.sent) {
            failed += 1;
            details.push({ kind, id: record.id, reason: outcome.reason });
            continue;
          }
          sent += 1;
          await query(
            `insert into casa_billing_reminders
               (id, kind, record_id, due_date, recipient, status, sent_at)
             values ($1, $2, $3, $4, $5, 'sent', now())
             on conflict (id) do nothing`,
            [reminderId, kind, String(record.id), targetDate, outcome.recipient],
          );
        } catch (error) {
          failed += 1;
          details.push({ kind, id: record.id, reason: error.message });
          console.error('[reminders] gagal mengirim', kind, record.id, error.message);
        }
      }
    }

    return sendJson(res, 200, {
      ok: true,
      targetDate,
      checked: bills.length + invoices.length,
      sent,
      failed,
      skipped,
      details,
    });
  } catch (error) {
    console.error('[reminders] gagal memproses', error);
    return sendJson(res, 500, { error: 'Gagal memproses pengingat tagihan.' });
  }
}
