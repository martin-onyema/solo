import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Add it to your .env file (dev) or Vercel environment variables (prod)."
    );
  }

  // Strip ?pgbouncer=true — not needed by pg.Pool and causes
  // PgBouncer transaction-mode to hide tables (same bug as the seed failure).
  const connectionString = rawUrl
    .replace(/([?&])pgbouncer=true(&|$)/gi, "$1")
    .replace(/[?&]$/, "");

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  process.on("beforeExit", async () => { await db.$disconnect(); });
}
