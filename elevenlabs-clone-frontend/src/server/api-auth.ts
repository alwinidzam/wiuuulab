import { NextRequest } from "next/server";
import { db } from "~/server/db";

export async function validateApiKey(request: NextRequest) {
  let apiKey: string | null = null;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    apiKey = authHeader.substring(7).trim();
  } else if (authHeader) {
    apiKey = authHeader.trim();
  }

  if (!apiKey) {
    const xiKey = request.headers.get("xi-api-key");
    if (xiKey) {
      apiKey = xiKey.trim();
    }
  }

  if (!apiKey) {
    return { error: "API key is missing in Authorization or xi-api-key header", status: 401 };
  }

  const keyRecord = await db.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true },
  });

  if (!keyRecord) {
    return { error: "Invalid API key", status: 401 };
  }

  // Update last used asynchronously
  db.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsed: new Date() },
  }).catch(() => {});

  // 100% Free - Unlimited generations, no credit checks!
  return { user: keyRecord.user, apiKey: keyRecord };
}
