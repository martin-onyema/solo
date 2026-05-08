// ============================================================================
// Database Seed Script
// Creates the initial admin user in the User table (for Auth.js)
// ============================================================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const defaultPassword =
    process.env.ADMIN_DEFAULT_PASSWORD || "solo2024";

  // Check if admin user already exists
  const existing = await prisma.user.findUnique({
    where: { username },
  });

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
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
