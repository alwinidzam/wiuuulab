import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("file:")) {
  process.env.DATABASE_URL = "file:./db.sqlite";
}

const createPrismaClient = () =>
  new PrismaClient({
    datasources: {
      db: {
        url: "file:./db.sqlite",
      },
    },
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
