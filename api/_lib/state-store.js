import { query } from './db.js';

const STATE_ID = 'public';

export async function readSharedState() {
  const result = await query(
    'select data, version, updated_at from casa_state where id = $1',
    [STATE_ID],
  );
  if (!result.rows.length) return null;
  const row = result.rows[0];
  return {
    state: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    version: Number(row.version) || 0,
    updatedAt: row.updated_at,
  };
}
