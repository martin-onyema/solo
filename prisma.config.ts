// ============================================================================
// Prisma 7.x Configuration File (REQUIRED)
//
// In Prisma 7, connection URLs are configured HERE, not in schema.prisma.
// The datasource block in schema.prisma only has the provider name.
//
// KEY: We import dotenv/config FIRST so that .env vars are available.
// Without this, Prisma 7 won't find your URLs.
//
// NOTE: Prisma 7 no longer has a separate directUrl field.
// For Supabase, use the DIRECT connection URL (port 5432) as the main url
// for Prisma CLI commands (db push, migrate). Then set DATABASE_URL
// (pooled, port 6543) as the runtime URL in src/lib/db.ts via datasourceUrl.
// ============================================================================

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
  path: "prisma/migrations",
  seed: "npx tsx prisma/seed.ts",  // ← add this line
},
  datasource: {
    // This URL is used by Prisma CLI commands (db push, migrate, etc.)
    // For Supabase, use the DIRECT connection (port 5432) for CLI commands
    // because PgBouncer (port 6543) doesn't support DDL/migrations
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});
