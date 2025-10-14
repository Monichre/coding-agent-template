import { defineConfig } from 'drizzle-kit'

const URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.VERCEL_POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Drizzle CLI will use whichever is defined
    url: URL!,
  },
})
