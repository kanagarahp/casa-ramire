import { ensureCatalogSchema, query, withTransaction } from '../../_lib/db.js';
import { getDokuConfig, verifyDokuSignature } from '../../_lib/doku.js';
import { methodNotAllowed, readRawBody, sendJson } from '../../_lib/http.js';
import { applyPaymentToState } from '../../_lib/state.js';

function ack(res) {
  return sendJson(res, 200, {
    responseCode: '2000700',
    responseMessage: 'Successful',
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const rawBody = await readRawBody(req);
  const clientId = String(req.headers['client-id'] || '');
  const requestId = String(req.headers['request-id'] || '');
  const timestamp = String(req.headers['request-timestamp'] || '');
  const signature = String(req.headers['signature'] || '');
  const target = new URL(req.url, 'http://localhost').pathname;

  let config;
  try {
    config = getDokuConfig();
  } catch (error) {
    console.error('[doku-notification] konfigurasi tidak lengkap', error);
    return sendJson(res, 503, {
      responseCode: '5000700',
      responseMessage: 'Server not configured',
    });
  }

  const valid = verifyDokuSignature({
    clientId,
    requestId,
    timestamp,
    target,
    secretKey: config.secretKey,
    body: rawBody,
    signature,
  });

  if (!valid || clientId !== config.clientId) {
    console.warn('[doku-notification] signature tidak valid');
    return sendJson(res, 401, {
      responseCode: '4010700',
      responseMessage: 'Invalid signature',
    });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return sendJson(res, 400, {
      responseCode: '4000700',
      responseMessage: 'Invalid JSON',
    });
  }

  const invoiceNumber = String(
    payload?.order?.invoice_number || payload?.invoice_number || '',
  ).trim();
  const status = String(
    payload?.transaction?.status || payload?.order?.status || '',
  ).toUpperCase();
  const channel = String(
    payload?.channel?.id || payload?.channel?.channel_id || payload?.channel?.name || '',
  );
  const notifiedAmount = Number(payload?.order?.amount);

  if (!invoiceNumber) {
    console.warn('[doku-notification] invoice number kosong');
    return ack(res);
  }

  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[doku-notification] database error', error);
    return sendJson(res, 503, {
      responseCode: '5000700',
      responseMessage: 'Database not ready',
    });
  }

  if (!['SUCCESS', 'PAID', 'SETTLED'].includes(status)) {
    if (['EXPIRED', 'FAILED', 'VOID', 'CANCELLED'].includes(status)) {
      await query(
        `update casa_payments
         set status = $2, updated_at = now()
         where id = $1 and status = 'PENDING'`,
        [invoiceNumber, status],
      ).catch((error) => console.error('[doku-notification] update status gagal', error));
    }
    return ack(res);
  }

  try {
    const result = await withTransaction(async (client) => {
      const paymentResult = await client.query(
        'select * from casa_payments where id = $1 for update',
        [invoiceNumber],
      );

      if (!paymentResult.rows.length) {
        return { applied: false, reason: 'unknown-payment' };
      }

      const payment = paymentResult.rows[0];
      if (payment.status === 'PAID') {
        return { applied: false, reason: 'already-paid' };
      }

      if (Number.isFinite(notifiedAmount) && notifiedAmount !== Number(payment.amount)) {
        return {
          applied: false,
          reason: 'amount-mismatch',
          notifiedAmount,
          expected: Number(payment.amount),
        };
      }

      const stateResult = await client.query(
        "select data from casa_state where id = 'public' for update",
      );

      if (!stateResult.rows.length) {
        await client.query(
          `update casa_payments
           set status = 'PAID', paid_at = now(), updated_at = now(), doku_ref = $2
           where id = $1`,
          [invoiceNumber, channel],
        );
        return { applied: false, reason: 'state-missing' };
      }

      const row = stateResult.rows[0];
      const state = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      const applied = applyPaymentToState(state, payment, { channel, paidAt: new Date() });

      await client.query(
        `update casa_state
         set data = $1::jsonb, version = version + 1, updated_at = now()
         where id = 'public'`,
        [JSON.stringify(state)],
      );

      await client.query(
        `update casa_payments
         set status = 'PAID', paid_at = now(), updated_at = now(), doku_ref = $2
         where id = $1`,
        [invoiceNumber, channel],
      );

      return applied;
    });

    console.log('[doku-notification]', invoiceNumber, status, JSON.stringify(result));
    return ack(res);
  } catch (error) {
    console.error('[doku-notification] gagal memproses pembayaran', error);
    return sendJson(res, 500, {
      responseCode: '5000700',
      responseMessage: 'Failed to process notification',
    });
  }
}
