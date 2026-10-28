import crypto from 'node:crypto';

export const DOKU_CHECKOUT_TARGET = '/checkout/v1/payment';

const DEFAULT_CHANNELS = [
  'QRIS',
  'VIRTUAL_ACCOUNT_BCA',
  'VIRTUAL_ACCOUNT_BNI',
  'VIRTUAL_ACCOUNT_BRI',
  'VIRTUAL_ACCOUNT_BANK_MANDIRI',
  'VIRTUAL_ACCOUNT_BANK_PERMATA',
  'VIRTUAL_ACCOUNT_BANK_CIMB',
  'EMONEY_DANA',
  'EMONEY_SHOPEEPAY',
  'EMONEY_OVO',
];

export function getDokuConfig() {
  const clientId = String(process.env.DOKU_CLIENT_ID || '').trim();
  const secretKey = String(process.env.DOKU_SECRET_KEY || '').trim();

  if (!clientId || !secretKey) {
    throw new Error('Integrasi DOKU belum dikonfigurasi di server.');
  }

  const mode = String(process.env.DOKU_MODE || 'production').trim().toLowerCase();
  const isSandbox = mode === 'sandbox';

  return {
    clientId,
    secretKey,
    mode,
    isSandbox,
    baseUrl: isSandbox ? 'https://api-sandbox.doku.com' : 'https://api.doku.com',
  };
}

export function getPaymentChannels() {
  const raw = String(process.env.DOKU_PAYMENT_CHANNELS || '').trim();
  if (!raw) return DEFAULT_CHANNELS;
  const values = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return values.length ? values : DEFAULT_CHANNELS;
}

export function utcTimestamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function sha256Base64(body) {
  return crypto.createHash('sha256').update(body, 'utf8').digest('base64');
}

function hmacSha256Base64(secret, value) {
  return crypto.createHmac('sha256', secret).update(value, 'utf8').digest('base64');
}

export function buildDokuSignature({
  clientId,
  requestId,
  timestamp,
  target,
  secretKey,
  body,
}) {
  const components = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${target}`,
  ];

  if (body !== undefined) {
    components.push(`Digest:${sha256Base64(body)}`);
  }

  return `HMACSHA256=${hmacSha256Base64(secretKey, components.join('\n'))}`;
}

export function verifyDokuSignature(input) {
  const expected = buildDokuSignature(input);
  const received = String(input.signature || '');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(received, 'utf8');
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function normalizeCustomerName(value) {
  const cleaned = String(value || '')
    .replace(/[^A-Za-z\s.'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 255);
  return cleaned || undefined;
}

function extractErrorMessage(payload, status) {
  if (payload && typeof payload === 'object') {
    const messages = payload.error_messages ?? payload.message;
    if (Array.isArray(messages) && messages.length) return messages.join(', ');
    if (typeof messages === 'string' && messages) return messages;
  }
  return `DOKU menolak permintaan (HTTP ${status}). Periksa kredensial dan channel yang aktif.`;
}

export async function createDokuCheckout({
  invoiceNumber,
  amount,
  customerName,
  customerEmail,
  description,
  origin,
}) {
  const config = getDokuConfig();
  const requestId = crypto.randomUUID();
  const timestamp = utcTimestamp();
  const dueMinutes = Math.max(
    1,
    Number(process.env.DOKU_PAYMENT_DUE_MINUTES || 1440) || 1440,
  );

  const baseOrigin = String(origin || '').replace(/\/$/, '');
  if (!baseOrigin) throw new Error('APP_URL belum dikonfigurasi.');

  const customer = normalizeCustomerName(customerName);
  const email = String(customerEmail || '').trim();
  const customerPayload = {
    ...(customer ? { name: customer } : {}),
    ...(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { email } : {}),
  };
  const additionalInfo = {
    override_notification_url: `${baseOrigin}/api/payments/doku/notification`,
  };

  const payload = {
    order: {
      amount: Math.round(Number(amount) || 0),
      invoice_number: invoiceNumber,
      currency: 'IDR',
      callback_url: baseOrigin,
      callback_url_result: baseOrigin,
      auto_redirect: true,
    },
    payment: {
      payment_due_date: dueMinutes,
      payment_method_types: getPaymentChannels(),
    },
    ...(Object.keys(customerPayload).length ? { customer: customerPayload } : {}),
    additional_info: additionalInfo,
  };

  const body = JSON.stringify(payload);
  const signature = buildDokuSignature({
    clientId: config.clientId,
    requestId,
    timestamp,
    target: DOKU_CHECKOUT_TARGET,
    secretKey: config.secretKey,
    body,
  });

  const response = await fetch(`${config.baseUrl}${DOKU_CHECKOUT_TARGET}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': config.clientId,
      'Request-Id': requestId,
      'Request-Timestamp': timestamp,
      Signature: signature,
    },
    body,
    signal: AbortSignal.timeout(20_000),
    cache: 'no-store',
  });

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  const paymentUrl = json?.response?.payment?.url;
  if (!response.ok || typeof paymentUrl !== 'string' || !paymentUrl) {
    throw new Error(extractErrorMessage(json, response.status));
  }

  return {
    url: paymentUrl,
    expiresAt: json?.response?.payment?.expired_date || null,
    sessionId: json?.response?.payment?.token_id || null,
    raw: json,
  };
}
