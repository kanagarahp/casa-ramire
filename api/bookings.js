import crypto from 'node:crypto';

import { ensureCatalogSchema, query, withTransaction } from './_lib/db.js';
import {
  emailConfigured,
  notificationEmail,
  sendResendEmail,
} from './_lib/email.js';
import {
  asString,
  methodNotAllowed,
  readBody,
  requireAdmin,
  sendJson,
} from './_lib/http.js';
import { normalizePublicState } from './_lib/state-normalize.js';

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
      floor: ['1', '2', '3'].includes(String(body?.floor)) ? String(body.floor) : '',
      estimate: Number(body?.estimate) > 0 ? Math.round(Number(body.estimate)) : 0,
      deposit: Number(body?.deposit) > 0 ? Math.round(Number(body.deposit)) : 0,
      totalDue: Number(body?.totalDue) > 0 ? Math.round(Number(body.totalDue)) : 0,
      paymentStatus: 'unpaid',
      emergencyContact: {
        name: asString(emergency.name, 120),
        relation: asString(emergency.relation, 60),
        phone: asString(emergency.phone, 30),
      },
    },
  };
}

function addDaysISO(value, days) {
  const [year, month, day] = String(value || '').slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '';
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + Number(days || 0));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function stayDates(startDate, endDate) {
  const start = String(startDate || '').slice(0, 10);
  const end = String(endDate || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return [];
  const dates = [];
  let cursor = start;
  for (let index = 0; index < 370; index += 1) {
    if (!cursor || cursor >= end) break;
    dates.push(cursor);
    cursor = addDaysISO(cursor, 1);
  }
  return dates;
}

function blockedDatesFor(room, startDate, endDate) {
  const calendar = room?.dailyCalendar || {};
  return stayDates(startDate, endDate).filter((date) => calendar[date]?.available === false);
}

function hasCarAddon(addons = []) {
  return (Array.isArray(addons) ? addons : []).some(
    (addon) =>
      String(addon?.id) === 'car-parking' ||
      String(addon?.name || '').toLowerCase() === 'parkir mobil',
  );
}

async function loadSharedState() {
  const result = await query('select data from casa_state where id = $1 limit 1', ['public']);
  if (!result.rows.length) return null;
  const row = result.rows[0];
  const state = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
  return normalizePublicState(state);
}

function parkingFromState(state) {
  const capacity = Math.max(1, Math.floor(Number(state?.settings?.parkingCapacity)) || 15);
  let used = 0;
  for (const tenant of state?.tenants || []) {
    if (tenant.status === 'aktif' && hasCarAddon(tenant.addons)) used += 1;
  }
  for (const room of state?.rooms || []) {
    if (room.booking && hasCarAddon(room.booking.addons)) used += 1;
  }
  return { capacity, used, available: Math.max(0, capacity - used), full: used >= capacity };
}

function roomUnavailableMessage(state, data) {
  if (!state || !data.roomId) return '';
  const room = (state.rooms || []).find(
    (item) => String(item.id) === String(data.roomId),
  );
  if (!room) return 'Kamar yang dipilih tidak ditemukan. Silakan pilih kamar lain.';
  if (room.status !== 'kosong') {
    return `Kamar ${room.nomor} sudah tidak tersedia. Silakan pilih kamar lain.`;
  }
  const short = data.periode === 'harian' || data.periode === 'mingguan';
  if (short && room.dailyEnabled === false) {
    return `Kamar ${room.nomor} tidak dibuka untuk sewa harian.`;
  }
  if (!short && room.monthlyEnabled === false) {
    return `Kamar ${room.nomor} hanya untuk sewa harian, bukan bulanan.`;
  }
  if (short) {
    const blocked = blockedDatesFor(room, data.startDate, data.endDate);
    if (blocked.length) {
      return `Kamar ${room.nomor} tidak tersedia pada tanggal ${blocked.join(', ')}. Silakan pilih tanggal atau kamar lain.`;
    }
  }
  return '';
}

function bookingEmailText({ code, data, admin = false, state = null }) {
  const title = admin ? 'Booking Online Baru' : 'Booking Online Diterima';
  const settings = state?.settings || {};
  const bank = {
    bankName: String(settings.bankName || 'Bank Mandiri'),
    accountNumber: String(settings.bankAccountNumber || '700013745877'),
    accountName: String(settings.bankAccountName || 'ERNY KURNIAWATI'),
  };
  const deposit = Math.max(0, Number(data.deposit) || 0);
  const rent = Math.max(0, Number(data.estimate) || 0);
  const totalDue = Math.max(0, Number(data.totalDue) || rent + deposit);
  return [
    admin ? 'Booking baru masuk dari landing page.' : `Halo ${data.name},`,
    '',
    `${title} — Casa Ramire`,
    `Kode booking: ${code}`,
    `Nama: ${data.name}`,
    `WhatsApp: ${data.phone}`,
    `Email: ${data.email}`,
    `Durasi: ${data.periode}`,
    `Mulai: ${data.startDate || '—'}`,
    `Selesai: ${data.endDate || '—'}`,
    `Lantai: ${data.floor || 'fleksibel'}`,
    `Kamar: ${data.roomNumber || 'dipilih admin'}`,
    `Mobil: ${data.car ? 'Ya' : 'Tidak'}`,
    `Total sewa: Rp${rent.toLocaleString('id-ID')}`,
    `Deposit (dikembalikan saat check-out): Rp${deposit.toLocaleString('id-ID')}`,
    `Total yang perlu dibayar: Rp${totalDue.toLocaleString('id-ID')}`,
    '',
    'Transfer pembayaran ke:',
    bank.bankName,
    `No. Rekening: ${bank.accountNumber}`,
    `a.n. ${bank.accountName}`,
    '',
    'Setelah transfer, kirim bukti pembayaran ke WhatsApp admin. Admin akan memverifikasi pembayaran booking Anda.',
    data.notes ? `Catatan: ${data.notes}` : null,
    '',
    admin
      ? 'Buka menu Booking Online di aplikasi untuk memproses permintaan ini dan verifikasi pembayarannya.'
      : 'Admin akan menghubungi Anda untuk konfirmasi ketersediaan kamar.',
    '',
    'Casa Ramire',
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n');
}

async function sendBookingEmails({ code, data, state = null }) {
  if (!emailConfigured()) {
    return { sent: false, reason: 'EMAIL_NOT_CONFIGURED' };
  }

  const jobs = [];
  jobs.push(
    sendResendEmail({
      to: data.email,
      subject: `Booking Online Diterima — ${code}`,
      text: bookingEmailText({ code, data, state }),
    }),
  );
  const admin = notificationEmail();
  if (admin && admin !== data.email.toLowerCase()) {
    jobs.push(
      sendResendEmail({
        to: admin,
        subject: `Booking Online Baru — ${code}`,
        text: bookingEmailText({ code, data, admin: true, state }),
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  const sent = results.some((result) => result.status === 'fulfilled');
  if (!sent) {
    console.error(
      '[bookings] email notifikasi gagal',
      results.map((result) => result.reason?.message),
    );
  }
  return { sent };
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

      const sharedState = await loadSharedState().catch((error) => {
        console.warn('[bookings] gagal membaca state untuk validasi', error.message);
        return null;
      });
      const unavailable = roomUnavailableMessage(sharedState, data);
      if (unavailable) {
        return sendJson(res, 409, { error: unavailable, code: 'ROOM_UNAVAILABLE' });
      }
      const parking = parkingFromState(sharedState);
      if (data.car && parking.full) {
        return sendJson(res, 409, {
          error: `Parkir mobil penuh (${parking.used}/${parking.capacity}). Silakan pilih tanpa mobil atau hubungi admin Casa Ramire.`,
          code: 'PARKING_FULL',
          parking,
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
      const emailResult = await sendBookingEmails({ code, data, state: sharedState }).catch((error) => {
        console.error('[bookings] notifikasi email error', error);
        return { sent: false, reason: error.message };
      });
      return sendJson(res, 201, {
        ok: true,
        emailSent: Boolean(emailResult.sent),
        emailNote: emailResult.sent
          ? ''
          : emailResult.reason === 'EMAIL_NOT_CONFIGURED'
            ? 'Email belum dikonfigurasi di server.'
            : 'Booking tersimpan, tetapi email notifikasi gagal dikirim.',
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
