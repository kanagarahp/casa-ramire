import { sendBillingEmail } from './email.js';
import { createBillPaymentLink, createInvoicePaymentLink } from './payments.js';
import { getSettings, isDokuEnabled } from './settings.js';
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

async function paymentLinkForBill(bill) {
  if (!isDokuEnabled()) return null;
  return createBillPaymentLink(bill);
}

async function paymentLinkForInvoice(invoice) {
  if (!isDokuEnabled()) return null;
  return createInvoicePaymentLink(invoice);
}

/**
 * Email a rent bill. DOKU is only used when the owner enables it in Settings;
 * otherwise the email contains the bill details and payment instructions.
 */
export async function sendBillByEmail(bill) {
  const to = recipientEmail(bill);
  if (!to) {
    throw new Error('Email penghuni belum diisi. Lengkapi email di data penghuni terlebih dahulu.');
  }

  const link = await paymentLinkForBill(bill);
  const delivery = await sendBillingEmail({
    to,
    name: bill.tenantName || 'Kak',
    title: `Tagihan ${bill.type || 'Sewa'} Kamar ${bill.roomNumber || '—'}`,
    invoiceNumber: bill.number || link?.invoiceNumber || '',
    description: bill.description || '',
    amount: bill.amount,
    dueDate: bill.dueDate,
    paymentUrl: link?.paymentUrl || '',
    expiresAt: link?.expiresAt || '',
    paymentInstructions: getSettings().paymentInstructions || '',
  });

  return { link, delivery };
}

export async function sendInvoiceByEmail(invoice) {
  const to = recipientEmail(invoice);
  if (!to) {
    throw new Error('Email penerima invoice belum diisi.');
  }

  const link = await paymentLinkForInvoice(invoice);
  const delivery = await sendBillingEmail({
    to,
    name: invoice.tenantName || 'Kak',
    title: `Invoice ${invoice.item || 'Layanan'}`,
    invoiceNumber: invoice.number || link?.invoiceNumber || '',
    description: invoice.item || '',
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    paymentUrl: link?.paymentUrl || '',
    expiresAt: link?.expiresAt || '',
    paymentInstructions: getSettings().paymentInstructions || '',
  });

  return { link, delivery };
}
