import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Resolve the database URL from multiple common env var names for convenience
const DB_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.VERCEL_POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL

if (!DB_URL) {
  throw new Error(
    'POSTGRES_URL environment variable is required. Tried POSTGRES_URL, DATABASE_URL, VERCEL_POSTGRES_URL, NEON_DATABASE_URL, POSTGRES_PRISMA_URL.',
  )
}

const client = postgres(DB_URL)
export const db = drizzle(client, { schema })
