// ============================================================================
// Prisma Client Singleton — Prisma 7.x with PostgreSQL Driver Adapter
//
// In Prisma 7, the "client" engine is the default (WASM-based, no binary).
// It requires a Driver Adapter to connect to the database.
// We use @prisma/adapter-pg with the 'pg' driver for Supabase PostgreSQL.
//
// Connection flow:
//   .env → DATABASE_URL (pooled, port 6543) → pg.Pool → PrismaAdapter → PrismaClient
// ============================================================================

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env file. " +
      "For Supabase: postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres"
    );
  }

  // Create a PostgreSQL connection pool
  const pool = new pg.Pool({ connectionString });

  // Create the Prisma PG adapter
  const adapter = new PrismaPg(pool);

  // Create PrismaClient with the adapter
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Graceful shutdown
if (process.env.NODE_ENV !== "production") {
  process.on("beforeExit", async () => {
    await db.$disconnect();
  });
}
