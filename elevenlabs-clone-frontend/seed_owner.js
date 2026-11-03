import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@wiuuulab.ai";
  const rawPassword = "wiuuulab_admin_2026!";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: "Owner wiuuulab",
      credits: 9999999,
    },
    create: {
      email,
      name: "Owner wiuuulab",
      password: hashedPassword,
      credits: 9999999,
    },
  });

  console.log("SUCCESS! Owner user seeded successfully:");
  console.log("Email / ID:", user.email);
  console.log("Password:", rawPassword);
  console.log("User ID:", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
