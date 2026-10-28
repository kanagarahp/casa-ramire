import {
  asString,
  methodNotAllowed,
  readBody,
  requireAdmin,
  sendJson,
} from '../_lib/http.js';

const DEFAULT_FROM = 'Casa Ramire <casaramirejogja@gmail.com>';

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

/**
 * Send transactional email through Resend.
 *
 * Required environment variables:
 *   RESEND_API_KEY   API key from https://resend.com
 *   EMAIL_FROM       verified sender, e.g. "Casa Ramire <no-reply@casaramire.com>"
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireAdmin(req, res)) return;

  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    return sendJson(res, 503, {
      error:
        'Pengiriman email belum dikonfigurasi. Tambahkan RESEND_API_KEY (dan EMAIL_FROM) di environment Vercel.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
  }

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const to = asString(body?.to, 160).toLowerCase();
  const subject = asString(body?.subject, 200);
  const text = asString(body?.text, 20_000);
  const html = asString(body?.html, 40_000);

  if (!isEmail(to)) return sendJson(res, 400, { error: 'Alamat email penerima tidak valid.' });
  if (!subject) return sendJson(res, 400, { error: 'Subjek email wajib diisi.' });
  if (!text && !html) return sendJson(res, 400, { error: 'Isi email kosong.' });

  const from = String(process.env.EMAIL_FROM || DEFAULT_FROM).trim() || DEFAULT_FROM;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        ...(text ? { text } : {}),
        ...(html ? { html } : {}),
      }),
      signal: AbortSignal.timeout(20_000),
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('[email] Resend menolak pengiriman', payload);
      return sendJson(res, 502, {
        error:
          payload?.message ||
          'Gagal mengirim email. Periksa domain pengirim yang sudah diverifikasi di Resend.',
      });
    }

    return sendJson(res, 200, { ok: true, id: payload?.id || '' });
  } catch (error) {
    console.error('[email] gagal menghubungi Resend', error);
    return sendJson(res, 502, {
      error: 'Layanan email tidak dapat dihubungi. Coba lagi beberapa saat lagi.',
    });
  }
}
