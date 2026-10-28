import { sendPaymentEmail } from './email.js';
import { createBillPaymentLink, createInvoicePaymentLink } from './payments.js';
import { getState } from '../core/store.js';

function tenantEmail(tenantId) {
  if (!tenantId) return '';
  return (
    getState().tenants.find((tenant) => String(tenant.id) === String(tenantId))?.email || ''
  );
}

function recipientEmail(record) {
  return String(record?.email || tenantEmail(record?.tenantId) || '').trim();
}

/**
 * Create a DOKU payment link and email it to the tenant.
 * The caller decides what to do with the returned result.
 */
export async function sendBillByEmail(bill) {
  const to = recipientEmail(bill);
  if (!to) {
    throw new Error('Email penghuni belum diisi. Lengkapi email di data penghuni terlebih dahulu.');
  }

  const link = await createBillPaymentLink(bill);
  const delivery = await sendPaymentEmail({
    to,
    name: bill.tenantName || 'Kak',
    title: `Tagihan ${bill.type || 'Sewa'} Kamar ${bill.roomNumber || '—'}`,
    invoiceNumber: link.invoiceNumber,
    amount: link.amount,
    paymentUrl: link.paymentUrl,
    expiresAt: link.expiresAt,
  });

  return { link, delivery };
}

export async function sendInvoiceByEmail(invoice) {
  const to = recipientEmail(invoice);
  if (!to) {
    throw new Error('Email penerima invoice belum diisi.');
  }

  const link = await createInvoicePaymentLink(invoice);
  const delivery = await sendPaymentEmail({
    to,
    name: invoice.tenantName || 'Kak',
    title: `Invoice ${invoice.item || 'Layanan'}${invoice.number ? ` (${invoice.number})` : ''}`,
    invoiceNumber: link.invoiceNumber,
    amount: link.amount,
    paymentUrl: link.paymentUrl,
    expiresAt: link.expiresAt,
  });

  return { link, delivery };
}
