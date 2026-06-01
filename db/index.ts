import { createPool } from '@vercel/postgres';

// For local development, use DATABASE_URL env var
// For Vercel deployment, use the built-in Vercel Postgres connection
export const db = createPool({
  connectionString: process.env.DATABASE_URL,
});
