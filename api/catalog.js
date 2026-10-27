import { ensureCatalogSchema, query } from './_lib/db.js';
import { methodNotAllowed, readBody, requireAdmin, sendJson } from './_lib/http.js';

const CATALOG_ID = 'public';
const MAX_CATALOG_BYTES = 1_500_000;

function isCatalogShape(value) {
  return (
    value &&
    typeof value === 'object' &&
    value.property &&
    typeof value.property === 'object' &&
    Array.isArray(value.rooms)
  );
}

export default async function handler(req, res) {
  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[catalog] gagal menyiapkan database', error);
    return sendJson(res, 503, {
      error: 'Database katalog belum siap. Coba lagi beberapa saat lagi.',
    });
  }

  if (req.method === 'GET') {
    try {
      const result = await query(
        'select data, updated_at from casa_catalog where id = $1 limit 1',
        [CATALOG_ID],
      );

      if (!result.rows.length) {
        return sendJson(res, 200, { published: false });
      }

      const row = result.rows[0];
      const catalog = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      return sendJson(res, 200, {
        published: true,
        updatedAt: row.updated_at,
        catalog,
      });
    } catch (error) {
      console.error('[catalog] gagal membaca katalog', error);
      return sendJson(res, 500, { error: 'Gagal membaca katalog publik.' });
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    if (!requireAdmin(req, res)) return;

    let body;
    try {
      body = readBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
    }

    const catalog = body?.catalog || body;
    if (!isCatalogShape(catalog)) {
      return sendJson(res, 400, { error: 'Format katalog tidak valid.' });
    }

    const serialized = JSON.stringify(catalog);
    if (Buffer.byteLength(serialized, 'utf8') > MAX_CATALOG_BYTES) {
      return sendJson(res, 413, {
        error: 'Katalog terlalu besar. Kurangi jumlah foto atau ukuran foto.',
      });
    }

    try {
      const result = await query(
        `insert into casa_catalog (id, data, updated_at)
         values ($1, $2::jsonb, now())
         on conflict (id) do update
         set data = excluded.data, updated_at = now()
         returning updated_at`,
        [CATALOG_ID, serialized],
      );

      return sendJson(res, 200, {
        ok: true,
        updatedAt: result.rows[0]?.updated_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error('[catalog] gagal menyimpan katalog', error);
      return sendJson(res, 500, { error: 'Gagal menyimpan katalog publik.' });
    }
  }

  return methodNotAllowed(res, ['GET', 'PUT']);
}
