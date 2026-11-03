"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function getApiKeys() {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const keys = await db.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      key: true,
      createdAt: true,
      lastUsed: true,
    },
  });

  return keys;
}

export async function createApiKey(name: string) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  if (!name || name.trim().length === 0) {
    throw new Error("Nama API key tidak boleh kosong");
  }

  // Format: sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
  const rawSecret = randomBytes(24).toString("hex");
  const fullKey = `sk_live_${rawSecret}`;

  const newKey = await db.apiKey.create({
    data: {
      name: name.trim(),
      key: fullKey,
      userId: session.user.id,
    },
  });

  revalidatePath("/app/api-keys");

  return {
    id: newKey.id,
    name: newKey.name,
    key: fullKey,
  };
}

export async function deleteApiKey(id: string) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  await db.apiKey.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/app/api-keys");

  return { success: true };
}
