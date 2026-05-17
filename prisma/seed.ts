import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

// Seeds are CLI operations — use DIRECT_URL (port 5432), not DATABASE_URL
// (port 6543 with ?pgbouncer=true), which hides tables in PgBouncer transaction mode.
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DIRECT_URL (or DATABASE_URL) environment variable is not set.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = "admin";
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "solo2024";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`Admin user "${username}" already exists. Skipping seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash(defaultPassword, 12);
  const admin = await prisma.user.create({
    data: {
      username,
      email: "admin@sololuxury.com",
      name: "Admin",
      passwordHash,
      role: "admin",
      emailVerified: new Date(),
    },
  });

  console.log(`Admin user created:`);
  console.log(`   Username: ${admin.username}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Default password: ${defaultPassword}`);
  console.log(`   WARNING: Change the password after first login!`);
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
