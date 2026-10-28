import { ensureCatalogSchema, query, withTransaction } from './_lib/db.js';
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

      // Promo remaining quota lives in its own ledger because public bookings
      // update it between catalog publications.
      if (Array.isArray(catalog?.promos) && catalog.promos.length) {
        try {
          const promoRows = await query(
            'select code, max_uses, used_count from casa_promo_codes',
          );
          const byCode = new Map(
            promoRows.rows.map((promo) => [String(promo.code).toUpperCase(), promo]),
          );
          catalog.promos = catalog.promos.map((promo) => {
            const live = byCode.get(String(promo.code || '').toUpperCase());
            return live
              ? {
                  ...promo,
                  maxUses: Number(live.max_uses) || 0,
                  usedCount: Number(live.used_count) || 0,
                }
              : promo;
          });
        } catch (error) {
          console.error('[catalog] gagal membaca kuota promo', error);
        }
      }

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

      // Keep the public promo-code ledger in sync. `used_count` is preserved
      // across publications so one-time codes stay redeemed.
      let promoUsage = [];
      if (Array.isArray(catalog.promos)) {
        try {
          await withTransaction(async (client) => {
            const codes = [];
            for (const promo of catalog.promos) {
              const code = String(promo?.code || '')
                .toUpperCase()
                .replace(/[^A-Z0-9-]/g, '')
                .slice(0, 24);
              if (!code) continue;
              codes.push(code);
              await client.query(
                `insert into casa_promo_codes (code, max_uses, used_count, updated_at)
                 values ($1, $2, 0, now())
                 on conflict (code) do update
                 set max_uses = excluded.max_uses, updated_at = now()`,
                [code, Math.max(0, Number(promo.maxUses) || 0)],
              );
            }

            if (codes.length) {
              await client.query(
                'delete from casa_promo_codes where not (code = any($1::text[]))',
                [codes],
              );
            } else {
              await client.query('delete from casa_promo_codes');
            }
          });

          const livePromos = await query(
            'select code, max_uses, used_count from casa_promo_codes order by code',
          );
          promoUsage = livePromos.rows.map((promo) => ({
            code: promo.code,
            maxUses: Number(promo.max_uses) || 0,
            usedCount: Number(promo.used_count) || 0,
          }));
        } catch (error) {
          console.error('[catalog] gagal menyinkronkan kode promo', error);
        }
      }

      return sendJson(res, 200, {
        ok: true,
        updatedAt: result.rows[0]?.updated_at || new Date().toISOString(),
        promos: promoUsage,
      });
    } catch (error) {
      console.error('[catalog] gagal menyimpan katalog', error);
      return sendJson(res, 500, { error: 'Gagal menyimpan katalog publik.' });
    }
  }

  return methodNotAllowed(res, ['GET', 'PUT']);
}
