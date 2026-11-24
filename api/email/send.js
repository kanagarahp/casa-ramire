import {
  asString,
  methodNotAllowed,
  readBody,
  requireAdmin,
  sendJson,
} from '../_lib/http.js';

const DEFAULT_FROM = 'Casa Ramire <no-reply@casaramire.com>';

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
  if (!['GET', 'POST'].includes(req.method)) {
    return methodNotAllowed(res, ['GET', 'POST']);
  }
  if (!(await requireAdmin(req, res))) return;

  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    return sendJson(res, 503, {
      error:
        'Pengiriman email belum dikonfigurasi. Tambahkan RESEND_API_KEY (dan EMAIL_FROM) di environment Vercel.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
  }

  if (req.method === 'GET') {
    const url = new URL(req.url || '/', 'http://localhost');
    const id = asString(url.searchParams.get('id'), 120);
    if (!id) return sendJson(res, 400, { error: 'ID email wajib diisi.' });

    try {
      const response = await fetch(
        `https://api.resend.com/emails/${encodeURIComponent(id)}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(15_000),
          cache: 'no-store',
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return sendJson(res, response.status, {
          error: payload?.message || 'Gagal membaca status email dari Resend.',
        });
      }
      return sendJson(res, 200, { ok: true, email: payload });
    } catch (error) {
      console.error('[email] gagal membaca status', error);
      return sendJson(res, 502, {
        error: 'Layanan Resend tidak dapat dihubungi.',
      });
    }
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
  const attachments = Array.isArray(body?.attachments)
    ? body.attachments
        .filter(
          (item) =>
            item &&
            typeof item.filename === 'string' &&
            typeof item.content === 'string' &&
            item.content.length < 12_000_000,
        )
        .slice(0, 5)
        .map((item) => ({
          filename: item.filename.slice(0, 160),
          content: item.content,
        }))
    : [];

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
        ...(attachments.length ? { attachments } : {}),
        reply_to: String(
          process.env.EMAIL_REPLY_TO || 'casaramirejogja@gmail.com',
        ),
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
