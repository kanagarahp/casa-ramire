import crypto from 'node:crypto';

import { ensureCatalogSchema, query } from '../_lib/db.js';
import {
  emailConfigured,
  notificationEmail,
  sendResendEmail,
} from '../_lib/email.js';
import {
  asString,
  methodNotAllowed,
  readBody,
  sendJson,
} from '../_lib/http.js';

function hashCode(username, code) {
  return crypto
    .createHash('sha256')
    .update(`${String(username).toLowerCase()}:${code}`)
    .digest('hex');
}

function maskEmail(value) {
  const [name, domain] = String(value || '').split('@');
  if (!domain) return value || '';
  const visible = name.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(1, name.length - 1))}@${domain}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  let body;
  try {
    body = readBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
  }

  const username = asString(body?.username, 40).toLowerCase();
  if (!/^[a-z0-9._-]{3,20}$/.test(username)) {
    return sendJson(res, 400, { error: 'Username tidak valid.' });
  }

  if (!emailConfigured()) {
    return sendJson(res, 503, {
      error:
        'Email belum dikonfigurasi di server. Owner perlu mengatur RESEND_API_KEY dan EMAIL_FROM di Vercel.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
  }

  try {
    await ensureCatalogSchema();

    const recent = await query(
      `select count(*)::int as total
         from casa_password_resets
        where username = $1
          and created_at > now() - interval '10 minutes'`,
      [username],
    );
    if (Number(recent.rows[0]?.total || 0) >= 3) {
      return sendJson(res, 429, {
        error: 'Terlalu banyak permintaan reset. Coba lagi 10 menit lagi.',
      });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const recipient = notificationEmail();

    await query(
      `insert into casa_password_resets (id, username, code_hash, expires_at)
       values ($1, $2, $3, $4)`,
      [id, username, hashCode(username, code), expiresAt.toISOString()],
    );

    await sendResendEmail({
      to: recipient,
      subject: 'Kode Reset Password Owner — Casa Ramire',
      text: [
        'Kode reset password owner Casa Ramire',
        '',
        `Username: ${username}`,
        `Kode verifikasi: ${code}`,
        'Kode berlaku selama 15 menit dan hanya dapat dipakai satu kali.',
        '',
        'Jika Anda tidak meminta reset password, abaikan email ini.',
        '',
        'Casa Ramire',
      ].join('\n'),
    });

    return sendJson(res, 200, {
      ok: true,
      message: `Kode reset dikirim ke email owner ${maskEmail(recipient)}.`,
      maskedEmail: maskEmail(recipient),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[auth] gagal mengirim kode reset', error);
    return sendJson(res, error.status || 500, {
      error:
        error.code === 'EMAIL_NOT_CONFIGURED'
          ? 'Email belum dikonfigurasi di server. Hubungi pengelola Vercel.'
          : `Gagal mengirim kode reset: ${error.message || 'coba lagi beberapa saat lagi.'}`,
    });
  }
}
