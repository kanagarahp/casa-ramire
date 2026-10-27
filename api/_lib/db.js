import pg from 'pg';

const { Pool } = pg;

let pool = null;
let schemaPromise = null;

function getPool() {
  if (pool) return pool;

  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Database katalog belum dikonfigurasi di environment Vercel.');
  }

  const isLocal = /(^|@)(localhost|127\.0\.0\.1)(:|\/)/.test(connectionString);

  pool = new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  });

  return pool;
}

export async function query(text, params = []) {
  return getPool().query(text, params);
}

export async function ensureCatalogSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await query(`
        create table if not exists casa_catalog (
          id text primary key,
          data jsonb not null,
          updated_at timestamptz not null default now()
        )
      `);
      await query(`
        create table if not exists casa_catalog_photos (
          id text primary key,
          mime text not null,
          data text not null,
          created_at timestamptz not null default now()
        )
      `);
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  return schemaPromise;
}

export function catalogDatabaseConfigured() {
  return Boolean(
    process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL,
  );
}
