import crypto from 'node:crypto';

import { ensureCatalogSchema, query } from '../_lib/db.js';
import { methodNotAllowed, readBody, requireAdmin, sendJson } from '../_lib/http.js';

const MAX_PHOTO_BYTES = 1_400_000;
const IMAGE_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/;

function photoId(req) {
  const url = new URL(req.url, 'http://localhost');
  return String(url.searchParams.get('id') || '').trim();
}

function validId(id) {
  return /^[a-zA-Z0-9_-]{8,80}$/.test(id);
}

function signatureLooksValid(mime, base64) {
  if (mime === 'image/jpeg') return base64.startsWith('/9j/');
  if (mime === 'image/png') return base64.startsWith('iVBORw0KGgo');
  if (mime === 'image/webp') return base64.startsWith('UklGR');
  return false;
}

export default async function handler(req, res) {
  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[catalog-photo] gagal menyiapkan database', error);
    return sendJson(res, 503, { error: 'Database katalog belum siap.' });
  }

  if (req.method === 'GET') {
    const id = photoId(req);
    if (!validId(id)) return sendJson(res, 400, { error: 'ID foto tidak valid.' });

    try {
      const result = await query(
        'select mime, data from casa_catalog_photos where id = $1 limit 1',
        [id],
      );

      if (!result.rows.length) {
        return sendJson(res, 404, { error: 'Foto tidak ditemukan.' });
      }

      const row = result.rows[0];
      const buffer = Buffer.from(String(row.data), 'base64');
      res.statusCode = 200;
      res.setHeader('Content-Type', row.mime);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.end(buffer);
      return;
    } catch (error) {
      console.error('[catalog-photo] gagal membaca foto', error);
      return sendJson(res, 500, { error: 'Gagal membaca foto katalog.' });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;

    let body;
    try {
      body = readBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
    }

    const dataUrl = String(body?.dataUrl || '').trim();
    const match = dataUrl.match(IMAGE_PATTERN);
    if (!match) {
      return sendJson(res, 400, {
        error: 'Foto harus berupa JPEG, PNG, atau WebP.',
      });
    }

    const mime = match[1];
    const base64 = match[2].replace(/\s+/g, '');
    if (!signatureLooksValid(mime, base64)) {
      return sendJson(res, 400, { error: 'Isi file foto tidak sesuai formatnya.' });
    }

    const bytes = Math.floor((base64.length * 3) / 4);
    if (bytes > MAX_PHOTO_BYTES) {
      return sendJson(res, 413, {
        error: 'Ukuran foto terlalu besar. Maksimal sekitar 1 MB per foto.',
      });
    }

    try {
      const id = crypto.randomUUID();
      await query(
        `insert into casa_catalog_photos (id, mime, data)
         values ($1, $2, $3)`,
        [id, mime, base64],
      );

      return sendJson(res, 201, {
        id,
        url: `/api/catalog/photo?id=${encodeURIComponent(id)}`,
      });
    } catch (error) {
      console.error('[catalog-photo] gagal menyimpan foto', error);
      return sendJson(res, 500, { error: 'Gagal menyimpan foto katalog.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    const id = photoId(req);
    if (!validId(id)) return sendJson(res, 400, { error: 'ID foto tidak valid.' });

    try {
      await query('delete from casa_catalog_photos where id = $1', [id]);
      return sendJson(res, 200, { ok: true });
    } catch (error) {
      console.error('[catalog-photo] gagal menghapus foto', error);
      return sendJson(res, 500, { error: 'Gagal menghapus foto katalog.' });
    }
  }

  return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
}
