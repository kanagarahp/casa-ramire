import crypto from 'node:crypto';

import { ensureCatalogSchema, query, withTransaction } from './_lib/db.js';
import {
  asString,
  methodNotAllowed,
  readBody,
  requireAdmin,
  sendJson,
} from './_lib/http.js';

const PERIOD_KEYS = ['harian', 'mingguan', '1', '3', '6', '12'];
const STATUSES = ['pending', 'confirmed', 'rejected'];

function normalizePromoCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 24);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

function bookingCode() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`;
  return `CRB-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.socket?.remoteAddress || 'unknown');
}

function validateBooking(body) {
  const name = asString(body?.name, 120);
  const phone = asString(body?.phone, 30);
  const email = asString(body?.email, 160).toLowerCase();
  const periode = asString(body?.periode, 20);
  const startDate = asString(body?.startDate, 10);
  const endDate = asString(body?.endDate, 10);
  const promoCode = normalizePromoCode(body?.promoCode);

  if (name.length < 2) return { error: 'Nama lengkap wajib diisi.' };
  if (phone.replace(/\D/g, '').length < 8) return { error: 'Nomor WhatsApp tidak valid.' };
  if (!isEmail(email)) return { error: 'Alamat email tidak valid.' };
  if (!PERIOD_KEYS.includes(periode)) return { error: 'Durasi sewa tidak valid.' };
  if (!isDate(startDate)) return { error: 'Tanggal mulai tidak valid.' };
  if (periode === 'harian' || periode === 'mingguan') {
    if (!isDate(endDate)) return { error: 'Tanggal selesai tidak valid.' };
  }

  const emergency = body?.emergencyContact || {};
  return {
    data: {
      name,
      phone,
      email,
      job: asString(body?.job, 120),
      notes: asString(body?.notes, 1000),
      periode,
      startDate,
      endDate: isDate(endDate) ? endDate : '',
      car: Boolean(body?.car),
      promoCode,
      roomId: body?.roomId ? asString(body.roomId, 40) : '',
      roomNumber: asString(body?.roomNumber, 10),
      floor: ['2', '3'].includes(String(body?.floor)) ? String(body.floor) : '',
      estimate: Number(body?.estimate) > 0 ? Math.round(Number(body.estimate)) : 0,
      emergencyContact: {
        name: asString(emergency.name, 120),
        relation: asString(emergency.relation, 60),
        phone: asString(emergency.phone, 30),
      },
    },
  };
}

async function listRequests(status) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = 'where status = $1';
  }
  const result = await query(
    `select id, code, status, data, created_at, updated_at
       from casa_bookings
       ${where}
      order by created_at desc
      limit 200`,
    params,
  );

  return result.rows.map((row) => ({
    id: row.id,
    code: row.code,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(typeof row.data === 'string' ? JSON.parse(row.data) : row.data),
  }));
}

export default async function handler(req, res) {
  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[bookings] gagal menyiapkan database', error);
    return sendJson(res, 503, {
      error: 'Database booking belum siap. Coba lagi beberapa saat lagi.',
    });
  }

  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const url = new URL(req.url, 'http://localhost');
    const status = asString(url.searchParams.get('status'), 20);
    if (status && !STATUSES.includes(status)) {
      return sendJson(res, 400, { error: 'Status booking tidak valid.' });
    }
    try {
      const requests = await listRequests(status);
      const promos = await query(
        'select code, max_uses, used_count from casa_promo_codes order by code',
      );
      return sendJson(res, 200, {
        requests,
        promos: promos.rows.map((row) => ({
          code: row.code,
          maxUses: Number(row.max_uses) || 0,
          usedCount: Number(row.used_count) || 0,
        })),
      });
    } catch (error) {
      console.error('[bookings] gagal membaca booking', error);
      return sendJson(res, 500, { error: 'Gagal membaca booking online.' });
    }
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = readBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
    }

    const validated = validateBooking(body);
    if (validated.error) return sendJson(res, 400, { error: validated.error });

    const data = {
      ...validated.data,
      ip: clientIp(req),
      userAgent: asString(req.headers['user-agent'], 300),
    };
    const id = crypto.randomUUID();
    const code = bookingCode();

    try {
      const recent = await query(
        `select count(*)::int as total
           from casa_bookings
          where created_at > now() - interval '10 minutes'
            and data->>'ip' = $1`,
        [data.ip],
      );
      if (Number(recent.rows[0]?.total || 0) >= 5) {
        return sendJson(res, 429, {
          error: 'Terlalu banyak permintaan booking. Coba lagi beberapa menit lagi.',
        });
      }

      const result = await withTransaction(async (client) => {
        if (data.promoCode) {
          const promo = await client.query(
            'select code, max_uses, used_count from casa_promo_codes where code = $1 for update',
            [data.promoCode],
          );
          if (!promo.rows.length) {
            const error = new Error('Kode promo tidak valid atau sudah tidak aktif.');
            error.status = 400;
            error.code = 'INVALID_PROMO';
            throw error;
          }
          const row = promo.rows[0];
          const maxUses = Number(row.max_uses) || 0;
          const used = Number(row.used_count) || 0;
          if (maxUses > 0 && used >= maxUses) {
            const error = new Error('Kode promo sudah habis dipakai.');
            error.status = 409;
            error.code = 'PROMO_EXHAUSTED';
            throw error;
          }
          await client.query(
            `update casa_promo_codes
                set used_count = used_count + 1, updated_at = now()
              where code = $1`,
            [data.promoCode],
          );
        }

        await client.query(
          `insert into casa_bookings (id, code, status, data, created_at, updated_at)
           values ($1, $2, 'pending', $3::jsonb, now(), now())`,
          [id, code, JSON.stringify(data)],
        );
      });

      void result;
      return sendJson(res, 201, {
        ok: true,
        request: {
          id,
          code,
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...data,
        },
      });
    } catch (error) {
      if (error.status) {
        return sendJson(res, error.status, { error: error.message, code: error.code || '' });
      }
      console.error('[bookings] gagal menyimpan booking', error);
      return sendJson(res, 500, { error: 'Gagal menyimpan booking. Coba lagi.' });
    }
  }

  if (req.method === 'PATCH') {
    if (!requireAdmin(req, res)) return;

    let body;
    try {
      body = readBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
    }

    const id = asString(body?.id, 80);
    const status = asString(body?.status, 20);
    if (!id || !STATUSES.includes(status)) {
      return sendJson(res, 400, { error: 'Data pembaruan booking tidak valid.' });
    }

    try {
      const outcome = await withTransaction(async (client) => {
        const current = await client.query(
          'select id, status, data from casa_bookings where id = $1 for update',
          [id],
        );
        if (!current.rows.length) return { found: false };

        const row = current.rows[0];
        const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        if (status === 'rejected' && row.status !== 'rejected' && data?.promoCode) {
          // Returning the promo quota keeps "one-time" codes fair when the
          // owner declines a request.
          await client.query(
            `update casa_promo_codes
                set used_count = greatest(0, used_count - 1), updated_at = now()
              where code = $1`,
            [data.promoCode],
          );
        }

        await client.query(
          'update casa_bookings set status = $2, updated_at = now() where id = $1',
          [id, status],
        );
        return { found: true };
      });

      if (!outcome.found) return sendJson(res, 404, { error: 'Booking tidak ditemukan.' });
      return sendJson(res, 200, { ok: true });
    } catch (error) {
      console.error('[bookings] gagal memperbarui booking', error);
      return sendJson(res, 500, { error: 'Gagal memperbarui booking.' });
    }
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH']);
}
