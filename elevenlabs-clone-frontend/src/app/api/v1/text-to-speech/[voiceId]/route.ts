import { NextRequest } from "next/server";
import { synthesizeSpeechDirect } from "~/lib/tts-engine";
import { validateApiKey } from "~/server/api-auth";
import { db } from "~/server/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { voiceId: string } }
) {
  const authResult = await validateApiKey(request);
  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  const { user } = authResult;
  const { voiceId } = await params;

  let body: { text?: string; prompt?: string; stability?: number; speed?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body.text || body.prompt;
  if (!text || text.trim().length === 0) {
    return Response.json({ error: "'text' is required" }, { status: 400 });
  }

  const targetVoice = voiceId || "alwi";

  try {
    const { buffer, dataUrl } = await synthesizeSpeechDirect(text, targetVoice, {
      stability: body.stability,
      speed: body.speed,
    });

    // Save clip history (100% Free & Unlimited)
    await db.generatedAudioClip.create({
      data: {
        userId: user.id,
        text,
        voice: targetVoice,
        s3Key: dataUrl,
        service: "styletts2",
        failed: false,
      },
    });

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("API TTS synthesis error:", error);
    return Response.json(
      { error: "Internal generation error", detail: error?.message },
      { status: 500 }
    );
  }
}
