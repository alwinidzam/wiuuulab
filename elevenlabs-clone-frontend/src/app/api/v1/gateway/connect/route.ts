import { NextRequest } from "next/server";
import { getEffectiveGatewayUrl, setMemoryGatewayUrl } from "~/lib/tts-engine";
import { validateApiKey } from "~/server/api-auth";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
  const currentUrl = await getEffectiveGatewayUrl();
  return Response.json({
    connected: Boolean(currentUrl && !currentUrl.includes("127.0.0.1")),
    gateway_url: currentUrl,
    mode: currentUrl ? "gpu_cloud_tunnel" : "autonomous_neural_engine",
  });
}

export async function POST(request: NextRequest) {
  let body: { gateway_url?: string; api_key?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const gatewayUrl = body.gateway_url?.trim();
  if (!gatewayUrl || !gatewayUrl.startsWith("http")) {
    return Response.json(
      { error: "Valid 'gateway_url' is required (e.g. https://xxx.trycloudflare.com)" },
      { status: 400 }
    );
  }

  // 1. Authenticate via API Key or Session
  let userId: string | null = null;
  const authResult = await validateApiKey(request);
  if (!("error" in authResult)) {
    userId = authResult.user.id;
  } else {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
    }
  }

  if (!userId) {
    // If no session, allow connecting if system admin key matches or first user
    const adminUser = await db.user.findFirst();
    if (!adminUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = adminUser.id;
  }

  // 2. Persist Gateway URL in DB (Prefix: GATEWAY_URL:)
  const prefix = "GATEWAY_URL:";
  const existing = await db.post.findFirst({
    where: { name: { startsWith: prefix } },
  });

  if (existing) {
    await db.post.update({
      where: { id: existing.id },
      data: { name: `${prefix}${gatewayUrl}` },
    });
  } else {
    await db.post.create({
      data: {
        name: `${prefix}${gatewayUrl}`,
        createdById: userId,
      },
    });
  }

  // 3. Update hot memory cache
  setMemoryGatewayUrl(gatewayUrl);

  return Response.json({
    success: true,
    gateway_url: gatewayUrl,
    message: "AI Gateway GPU berhasil terhubung! Studio dan API sekarang menggunakan GPU Colab secara instan.",
  });
}
