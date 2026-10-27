import pg from 'pg';

const { Pool } = pg;

let pool = null;
let schemaPromise = null;

function cleanConnectionString(value) {
  try {
    const url = new URL(value);
    // Vercel/Postgres URLs sometimes carry sslmode=require. pg treats that as
    // verify-full and rejects Supabase's certificate chain in serverless
    // runtimes. The TLS setting below is applied explicitly instead.
    url.searchParams.delete('sslmode');
    url.searchParams.delete('ssl');
    return url.toString();
  } catch {
    return value;
  }
}

function getPool() {
  if (pool) return pool;

  const rawConnectionString =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (!rawConnectionString) {
    throw new Error('Database katalog belum dikonfigurasi di environment Vercel.');
  }

  const connectionString = cleanConnectionString(rawConnectionString);
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

export async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    const result = await fn(client);
    await client.query('commit');
    return result;
  } catch (error) {
    await client.query('rollback').catch(() => null);
    throw error;
  } finally {
    client.release();
  }
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
      await query(`
        create table if not exists casa_state (
          id text primary key,
          data jsonb not null,
          version integer not null default 1,
          updated_at timestamptz not null default now()
        )
      `);
      await query(`
        create table if not exists casa_payments (
          id text primary key,
          kind text not null,
          record_id text,
          tenant_id text,
          amount integer not null,
          status text not null default 'PENDING',
          payment_url text,
          doku_ref text,
          payload jsonb,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          paid_at timestamptz
        )
      `);
      await query(`
        create index if not exists casa_payments_status_idx
          on casa_payments (status)
      `);
      await query(`
        create index if not exists casa_payments_record_idx
          on casa_payments (kind, record_id)
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
