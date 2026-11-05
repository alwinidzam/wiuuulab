"use server";

import { revalidatePath } from "next/cache";
import { getEffectiveGatewayUrl, setMemoryGatewayUrl } from "~/lib/tts-engine";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function getGatewayStatus() {
  const currentUrl = await getEffectiveGatewayUrl();
  return {
    connected: Boolean(currentUrl && !currentUrl.includes("127.0.0.1")),
    gatewayUrl: currentUrl || "",
    mode: currentUrl ? "gpu_cloud_tunnel" : "autonomous_neural_engine",
  };
}

export async function updateGatewayUrl(newUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Sesi login kedaluwarsa. Silakan masuk kembali.");
  }

  const cleanUrl = newUrl.trim();
  if (!cleanUrl || !cleanUrl.startsWith("http")) {
    throw new Error("URL Gateway harus diawali dengan http:// atau https://");
  }

  const prefix = "GATEWAY_URL:";
  const existing = await db.post.findFirst({
    where: { name: { startsWith: prefix } },
  });

  if (existing) {
    await db.post.update({
      where: { id: existing.id },
      data: { name: `${prefix}${cleanUrl}` },
    });
  } else {
    await db.post.create({
      data: {
        name: `${prefix}${cleanUrl}`,
        createdById: session.user.id,
      },
    });
  }

  setMemoryGatewayUrl(cleanUrl);
  revalidatePath("/app/api-keys");
  revalidatePath("/app/speech-synthesis/text-to-speech");

  return { success: true, gatewayUrl: cleanUrl };
}
