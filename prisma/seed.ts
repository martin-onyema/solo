import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL is not set.");

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = "admin";
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "solo2024";
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) { console.log(`Admin already exists. Skipping.`); return; }
  const passwordHash = await bcrypt.hash(defaultPassword, 12);
  const admin = await prisma.user.create({
    data: { username, email: "admin@sololuxury.com", name: "Admin", passwordHash, role: "admin", emailVerified: new Date() },
  });
  console.log(`Admin created: ${admin.username} / ${defaultPassword}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
