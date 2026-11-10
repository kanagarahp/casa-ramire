import { addDays, formatDate, rupiah, todayISO } from '../core/format.js';
import { getState, update } from '../core/store.js';
import { storage } from '../core/storage.js';
import { sendBillingEmail } from './email.js';
import { getSettings } from './settings.js';

const LAST_RUN_KEY = 'casa-ramire:last-billing-reminder';

function adminKey() {
  return String(getSettings().catalogAdminKey || '').trim();
}

async function runOnServer() {
  const key = adminKey();
  if (!key) return null;

  let response;
  try {
    response = await fetch('/api/cron/billing-reminders', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-admin-key': key,
      },
      body: JSON.stringify({}),
    });
  } catch {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) return null;
  return result;
}

function dueRecord(record) {
  const outstanding = Math.max(
    0,
    Number(record.amount || 0) - Number(record.paid || 0),
  );
  return record.status === 'unpaid' && outstanding > 0;
}

async function runLocally() {
  const target = addDays(todayISO(), 7);
  const state = getState();
  const bills = (state.bills || []).filter(
    (bill) => dueRecord(bill) && String(bill.dueDate || '').slice(0, 10) === target && !bill.reminder7SentAt,
  );
  const invoices = (state.manualInvoices || []).filter(
    (invoice) =>
      dueRecord(invoice) &&
      String(invoice.dueDate || '').slice(0, 10) === target &&
      !invoice.reminder7SentAt,
  );

  let sent = 0;
  let failed = 0;
  const mark = [];

  for (const bill of bills) {
    const to = String(bill.email || '').trim();
    if (!to) {
      failed += 1;
      continue;
    }
    try {
      const result = await sendBillingEmail(
        {
          to,
          name: bill.tenantName || 'Kak',
          title: `Pengingat Tagihan ${bill.type || 'Sewa'} Kamar ${bill.roomNumber || '—'}`,
          invoiceNumber: bill.number,
          description: bill.description || `Jatuh tempo ${formatDate(bill.dueDate)}`,
          amount: Math.max(0, Number(bill.amount) - Number(bill.paid || 0)),
          dueDate: bill.dueDate,
          paymentInstructions: getSettings().paymentInstructions || '',
        },
        { fallbackToMailto: false },
      );
      if (result.sent) {
        sent += 1;
        mark.push({ kind: 'bill', id: bill.id });
      } else {
        failed += 1;
      }
    } catch {
      failed += 1;
    }
  }

  for (const invoice of invoices) {
    const to = String(invoice.email || '').trim();
    if (!to) {
      failed += 1;
      continue;
    }
    try {
      const result = await sendBillingEmail(
        {
          to,
          name: invoice.tenantName || 'Kak',
          title: `Pengingat Invoice ${invoice.item || 'Layanan'}`,
          invoiceNumber: invoice.number,
          description: invoice.item || '',
          amount: Math.max(0, Number(invoice.amount) - Number(invoice.paid || 0)),
          dueDate: invoice.dueDate,
          paymentInstructions: getSettings().paymentInstructions || '',
        },
        { fallbackToMailto: false },
      );
      if (result.sent) {
        sent += 1;
        mark.push({ kind: 'invoice', id: invoice.id });
      } else {
        failed += 1;
      }
    } catch {
      failed += 1;
    }
  }

  if (mark.length) {
    const now = new Date().toISOString();
    update((draft) => {
      for (const item of mark) {
        const list = item.kind === 'bill' ? draft.bills : draft.manualInvoices;
        const record = (list || []).find((entry) => String(entry.id) === String(item.id));
        if (record) record.reminder7SentAt = now;
      }
    });
  }

  return {
    ok: true,
    source: 'local',
    sent,
    failed,
    checked: bills.length + invoices.length,
    targetDate: target,
  };
}

/**
 * Send H-7 reminders. On production the server cron endpoint de-duplicates
 * across devices; local Vite development falls back to this browser.
 */
export async function runBillingReminders({ force = false, silent = true } = {}) {
  const today = todayISO();
  if (!force && storage.getRaw(LAST_RUN_KEY) === today) {
    return { ok: true, skipped: true, reason: 'already-run-today' };
  }

  let result = await runOnServer();
  if (!result) result = await runLocally();
  storage.setRaw(LAST_RUN_KEY, today);

  if (!silent && result) {
    if (result.sent > 0) {
      // Dynamic import avoids creating a dependency cycle with UI toast.
      const { toast } = await import('../ui/toast.js');
      toast(`${result.sent} pengingat tagihan H-7 dikirim.`);
    } else if (result.checked === 0) {
      const { toast } = await import('../ui/toast.js');
      toast('Tidak ada tagihan yang jatuh tempo 7 hari lagi.', 'warning');
    }
  }

  return result || { ok: false, sent: 0, failed: 0 };
}
