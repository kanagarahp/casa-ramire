import { getState } from '../core/store.js';
import { sendInvoiceEmail } from './invoice.js';
import { createBillPaymentLink, createInvoicePaymentLink } from './payments.js';
import { isDokuEnabled } from './settings.js';

function tenantEmail(tenantId) {
  if (!tenantId) return '';
  return (
    getState().tenants.find((tenant) => String(tenant.id) === String(tenantId))?.email || ''
  );
}

function recipientEmail(record) {
  return String(record?.email || tenantEmail(record?.tenantId) || '').trim();
}

async function paymentLinkForBill(bill) {
  if (!isDokuEnabled()) return null;
  return createBillPaymentLink(bill);
}

async function paymentLinkForInvoice(invoice) {
  if (!isDokuEnabled()) return null;
  return createInvoicePaymentLink(invoice);
}

/**
 * Email a rent bill with the invoice PDF attached. DOKU is only used when the
 * owner enables it in Settings; otherwise the email contains payment
 * instructions and a bank transfer summary.
 */
export async function sendBillByEmail(bill) {
  const to = recipientEmail(bill);
  if (!to) {
    throw new Error('Email penghuni belum diisi. Lengkapi email di data penghuni terlebih dahulu.');
  }

  const link = await paymentLinkForBill(bill);
  const delivery = await sendInvoiceEmail({
    type: 'bill',
    id: bill.id,
    mode: 'billing',
    to,
    paymentUrl: link?.paymentUrl || '',
    expiresAt: link?.expiresAt || '',
  });

  return { link, delivery: { ...delivery, sent: true } };
}

export async function sendInvoiceByEmail(invoice) {
  const to = recipientEmail(invoice);
  if (!to) {
    throw new Error('Email penerima invoice belum diisi.');
  }

  const link = await paymentLinkForInvoice(invoice);
  const delivery = await sendInvoiceEmail({
    type: 'invoice',
    id: invoice.id,
    mode: 'billing',
    to,
    paymentUrl: link?.paymentUrl || '',
    expiresAt: link?.expiresAt || '',
  });

  return { link, delivery: { ...delivery, sent: true } };
}
