import { NextRequest } from "next/server";
import { synthesizeSoundEffect } from "~/lib/tts-engine";
import { validateApiKey } from "~/server/api-auth";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  const authResult = await validateApiKey(request);
  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  const { user } = authResult;

  let body: {
    text?: string;
    prompt?: string;
    duration_seconds?: number;
    prompt_influence?: number;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.text || body.prompt;
  if (!prompt || prompt.trim().length === 0) {
    return Response.json({ error: "'text' is required" }, { status: 400 });
  }

  try {
    const { buffer, dataUrl } = await synthesizeSoundEffect(prompt, {
      duration_seconds: body.duration_seconds,
      prompt_influence: body.prompt_influence,
    });

    await db.generatedAudioClip.create({
      data: {
        userId: user.id,
        text: prompt,
        voice: "sound-fx",
        s3Key: dataUrl,
        service: "make-an-audio",
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
    console.error("API Sound generation error:", error);
    return Response.json(
      { error: "Internal SFX generation error", detail: error?.message },
      { status: 500 }
    );
  }
}
