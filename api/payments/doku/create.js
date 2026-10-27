import crypto from 'node:crypto';

import { ensureCatalogSchema, query } from '../../_lib/db.js';
import { createDokuCheckout } from '../../_lib/doku.js';
import { methodNotAllowed, readBody, requireAdmin, sendJson } from '../../_lib/http.js';
import { periodLabel } from '../../_lib/state.js';

const STATE_ID = 'public';

function originFrom(req) {
  const configured = String(process.env.APP_URL || '').trim().replace(/\/$/, '');
  if (configured) return configured;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function invoiceNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`;
  return `CR-${stamp}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

async function loadState() {
  const result = await query('select data from casa_state where id = $1 limit 1', [STATE_ID]);
  if (!result.rows.length) return null;
  const row = result.rows[0];
  return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
}

function findById(list, id) {
  return (Array.isArray(list) ? list : []).find((item) => String(item.id) === String(id)) || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireAdmin(req, res)) return;

  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[doku-create] database error', error);
    return sendJson(res, 503, { error: 'Database belum siap. Coba lagi sebentar lagi.' });
  }

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const kind = String(body?.kind || '').trim();
  if (!['bill', 'invoice', 'renewal'].includes(kind)) {
    return sendJson(res, 400, { error: 'Jenis pembayaran tidak didukung.' });
  }

  const state = await loadState();
  if (!state) {
    return sendJson(res, 409, {
      error:
        'Sinkronisasi data belum aktif. Masukkan kunci admin di Pengaturan, lalu coba lagi.',
    });
  }

  let amount = 0;
  let customerName = '';
  let description = '';
  let recordId = null;
  let tenantId = null;
  let payload = { kind };

  if (kind === 'bill') {
    recordId = body?.recordId;
    const bill = findById(state.bills, recordId);
    if (!bill) return sendJson(res, 404, { error: 'Tagihan tidak ditemukan.' });
    if (bill.status === 'paid') {
      return sendJson(res, 400, { error: 'Tagihan ini sudah lunas.' });
    }

    amount = Math.max(0, Number(bill.amount) - Number(bill.paid || 0));
    customerName = bill.tenantName || '';
    description = `${bill.type || 'Tagihan'} Kamar ${bill.roomNumber || '—'}`;
    tenantId = bill.tenantId || null;
    payload = { kind, recordId: bill.id, billId: bill.id };
  }

  if (kind === 'invoice') {
    recordId = body?.recordId;
    const invoice = findById(state.manualInvoices, recordId);
    if (!invoice) return sendJson(res, 404, { error: 'Invoice tidak ditemukan.' });
    if (invoice.status === 'paid') {
      return sendJson(res, 400, { error: 'Invoice ini sudah lunas.' });
    }

    amount = Math.max(0, Number(invoice.amount) - Number(invoice.paid || 0));
    customerName = invoice.tenantName || '';
    description = `${invoice.item || 'Invoice'} Kamar ${invoice.roomNumber || '—'}`;
    tenantId = invoice.tenantId || null;
    payload = { kind, recordId: invoice.id, invoiceId: invoice.id };
  }

  if (kind === 'renewal') {
    const renewal = body?.renewal;
    if (!renewal || !renewal.tenantId) {
      return sendJson(res, 400, { error: 'Data perpanjangan tidak lengkap.' });
    }

    const tenant = findById(state.tenants, renewal.tenantId);
    if (!tenant || tenant.status !== 'aktif') {
      return sendJson(res, 404, { error: 'Penghuni aktif tidak ditemukan.' });
    }

    amount = Number(renewal.grandTotal) || 0;
    customerName = tenant.name || '';
    description = `Perpanjangan sewa Kamar ${tenant.roomNumber || '—'} - ${periodLabel(renewal)}`;
    recordId = tenant.id;
    tenantId = tenant.id;
    payload = {
      kind,
      recordId: tenant.id,
      tenantId: tenant.id,
      renewal: {
        ...renewal,
        tenantId: tenant.id,
        tenantName: tenant.name,
        roomNumber: tenant.roomNumber,
      },
    };
  }

  if (amount <= 0) {
    return sendJson(res, 400, { error: 'Nominal pembayaran harus lebih dari 0.' });
  }

  const id = invoiceNumber();
  const origin = originFrom(req);
  const serializedPayload = JSON.stringify(payload);

  try {
    await query(
      `insert into casa_payments
        (id, kind, record_id, tenant_id, amount, status, payload, created_at, updated_at)
       values ($1, $2, $3, $4, $5, 'PENDING', $6::jsonb, now(), now())`,
      [id, kind, recordId, tenantId, Math.round(amount), serializedPayload],
    );
  } catch (error) {
    console.error('[doku-create] gagal menyimpan payment intent', error);
    return sendJson(res, 500, { error: 'Gagal menyimpan data pembayaran.' });
  }

  try {
    const doku = await createDokuCheckout({
      invoiceNumber: id,
      amount,
      customerName,
      description,
      origin,
    });

    await query(
      `update casa_payments
       set payment_url = $2, doku_ref = $3, updated_at = now()
       where id = $1`,
      [id, doku.url, doku.sessionId],
    );

    return sendJson(res, 201, {
      ok: true,
      invoiceNumber: id,
      amount: Math.round(amount),
      paymentUrl: doku.url,
      expiresAt: doku.expiresAt,
    });
  } catch (error) {
    await query(
      `update casa_payments set status = 'FAILED', updated_at = now() where id = $1`,
      [id],
    ).catch(() => null);

    console.error('[doku-create] gagal membuat checkout', id, error);
    return sendJson(res, 502, {
      error: error?.message || 'Gagal membuat link pembayaran DOKU.',
      invoiceNumber: id,
    });
  }
}
