import { notificationEmail, sendResendEmail } from './_lib/email.js';
import { methodNotAllowed, readBody, requireAdmin, sendJson } from './_lib/http.js';
import {
  buildInvoiceEmail,
  buildInvoicePdf,
  invoiceFilename,
  invoicePdfBase64,
  invoiceRecipient,
  normalizeInvoice,
} from './_lib/invoice.js';
import { readSharedState } from './_lib/state-store.js';

const TYPES = new Set(['bill', 'invoice', 'pos']);
const MODES = new Set(['billing', 'paid', 'reminder']);

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

async function loadInvoice(type, id) {
  if (!TYPES.has(type) || !id) return null;
  const row = await readSharedState();
  if (!row?.state) return null;
  return normalizeInvoice(row.state, { type, id });
}

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;
  if (!['GET', 'POST'].includes(req.method)) {
    return methodNotAllowed(res, ['GET', 'POST']);
  }

  try {
    const url = new URL(req.url || '/', 'http://localhost');
    let type = String(url.searchParams.get('type') || '').trim();
    let id = String(url.searchParams.get('id') || '').trim();
    let body = null;

    if (req.method === 'POST') {
      try {
        body = readBody(req) || {};
      } catch {
        return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
      }
      type = String(body.type || type).trim();
      id = String(body.id || id).trim();
    }

    const invoice = await loadInvoice(type, id);
    if (!invoice) {
      return sendJson(res, 404, { error: 'Invoice tidak ditemukan.' });
    }

    const pdfBytes = await buildInvoicePdf(invoice);

    if (req.method === 'GET') {
      const filename = invoiceFilename(invoice);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Length', String(pdfBytes.length));
      res.end(Buffer.from(pdfBytes));
      return;
    }

    let mode = String(body?.mode || '').trim();
    if (!MODES.has(mode)) {
      mode = invoice.status === 'paid' ? 'paid' : 'billing';
    }
    if (mode === 'paid' && invoice.status !== 'paid') mode = 'billing';

    const overrideTo = String(body?.to || '').trim().toLowerCase();
    const recipient = overrideTo || invoiceRecipient(invoice);
    if (!isEmail(recipient)) {
      return sendJson(res, 400, {
        error: 'Email penerima belum diisi atau tidak valid.',
      });
    }

    const email = buildInvoiceEmail(invoice, {
      mode,
      paymentUrl: String(body?.paymentUrl || ''),
      expiresAt: String(body?.expiresAt || ''),
    });

    const attachment = {
      filename: invoiceFilename(invoice),
      content: invoicePdfBase64(pdfBytes),
    };

    const sent = await sendResendEmail({
      to: recipient,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments: [attachment],
    });

    const admin = notificationEmail();
    let adminCopy = false;
    if (admin && admin !== recipient) {
      try {
        await sendResendEmail({
          to: admin,
          subject: `[Salinan Admin] ${email.subject}`,
          text: email.text,
          html: email.html,
          attachments: [attachment],
        });
        adminCopy = true;
      } catch (error) {
        console.warn('[invoice] salinan admin gagal', error.message);
      }
    }

    return sendJson(res, 200, {
      ok: true,
      sent: true,
      to: recipient,
      adminCopy,
      id: sent.id || '',
      mode,
    });
  } catch (error) {
    console.error('[invoice] gagal memproses invoice', error);
    return sendJson(res, error.status || 500, {
      error:
        error.code === 'EMAIL_NOT_CONFIGURED'
          ? 'Pengiriman email belum dikonfigurasi di server.'
          : error.message || 'Gagal memproses invoice.',
    });
  }
}
