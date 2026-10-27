import { ensureCatalogSchema, query } from './_lib/db.js';
import { methodNotAllowed, readBody, requireAdmin, sendJson } from './_lib/http.js';
import { sanitizeStateForServer } from './_lib/state.js';

const STATE_ID = 'public';
const MAX_STATE_BYTES = 2_000_000;

function asState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!Array.isArray(value.rooms) || !Array.isArray(value.tenants) || !Array.isArray(value.bills)) {
    return null;
  }
  return value;
}

async function currentRow() {
  const result = await query('select data, version, updated_at from casa_state where id = $1', [
    STATE_ID,
  ]);
  if (!result.rows.length) return null;
  const row = result.rows[0];
  return {
    state: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    version: Number(row.version),
    updatedAt: row.updated_at,
  };
}

export default async function handler(req, res) {
  try {
    await ensureCatalogSchema();
  } catch (error) {
    console.error('[state] gagal menyiapkan database', error);
    return sendJson(res, 503, { error: 'Database belum siap. Coba lagi sebentar lagi.' });
  }

  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    try {
      const row = await currentRow();
      if (!row) return sendJson(res, 200, { exists: false, version: 0 });
      return sendJson(res, 200, { exists: true, ...row });
    } catch (error) {
      console.error('[state] gagal membaca state', error);
      return sendJson(res, 500, { error: 'Gagal membaca data tersinkronisasi.' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;

    let body;
    try {
      body = readBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Body JSON tidak valid.' });
    }

    const state = asState(body?.state);
    if (!state) {
      return sendJson(res, 400, { error: 'Format state tidak valid.' });
    }

    const clean = sanitizeStateForServer(state);
    const serialized = JSON.stringify(clean);
    if (Buffer.byteLength(serialized, 'utf8') > MAX_STATE_BYTES) {
      return sendJson(res, 413, { error: 'Data terlalu besar untuk disinkronkan.' });
    }

    const baseVersion = Math.max(0, Number(body?.baseVersion) || 0);

    try {
      if (baseVersion === 0) {
        const inserted = await query(
          `insert into casa_state (id, data, version, updated_at)
           values ($1, $2::jsonb, 1, now())
           on conflict (id) do nothing
           returning version, updated_at`,
          [STATE_ID, serialized],
        );

        if (inserted.rows.length) {
          return sendJson(res, 200, {
            ok: true,
            version: Number(inserted.rows[0].version),
            updatedAt: inserted.rows[0].updated_at,
          });
        }

        const row = await currentRow();
        return sendJson(res, 409, {
          error: 'Data sudah ada di server.',
          conflict: true,
          version: row?.version || 0,
          updatedAt: row?.updatedAt || null,
          state: row?.state || null,
        });
      }

      const updated = await query(
        `update casa_state
         set data = $2::jsonb, version = version + 1, updated_at = now()
         where id = $1 and version = $3
         returning version, updated_at`,
        [STATE_ID, serialized, baseVersion],
      );

      if (updated.rows.length) {
        return sendJson(res, 200, {
          ok: true,
          version: Number(updated.rows[0].version),
          updatedAt: updated.rows[0].updated_at,
        });
      }

      const row = await currentRow();
      if (!row) {
        return sendJson(res, 404, { error: 'Data tersinkronisasi tidak ditemukan.' });
      }

      return sendJson(res, 409, {
        error: 'Data di server sudah berubah.',
        conflict: true,
        version: row.version,
        updatedAt: row.updatedAt,
        state: row.state,
      });
    } catch (error) {
      console.error('[state] gagal menyimpan state', error);
      return sendJson(res, 500, { error: 'Gagal menyimpan data tersinkronisasi.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    try {
      await query('delete from casa_state where id = $1', [STATE_ID]);
      return sendJson(res, 200, { ok: true });
    } catch (error) {
      console.error('[state] gagal menghapus state', error);
      return sendJson(res, 500, { error: 'Gagal menghapus data tersinkronisasi.' });
    }
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
}
