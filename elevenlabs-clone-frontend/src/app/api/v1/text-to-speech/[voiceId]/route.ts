import { NextRequest } from "next/server";
import { env } from "~/env";
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

  let body: { text?: string; prompt?: string };
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
    const backendRes = await fetch(env.STYLETTS2_API_ROUTE + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: env.BACKEND_API_KEY,
      },
      body: JSON.stringify({
        text,
        target_voice: targetVoice,
      }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      return Response.json(
        { error: `Backend synthesis error: ${backendRes.statusText}`, detail: errText },
        { status: backendRes.status }
      );
    }

    const { audio_url, s3_key } = (await backendRes.json()) as {
      audio_url: string;
      s3_key: string;
    };

    // 100% Free - Save clip history without deducting credits
    await db.generatedAudioClip.create({
      data: {
        userId: user.id,
        text,
        voice: targetVoice,
        s3Key: s3_key,
        service: "styletts2",
      },
    });

    const audioStreamRes = await fetch(audio_url);
    if (!audioStreamRes.ok) {
      return Response.json({ error: "Failed to download generated audio" }, { status: 502 });
    }

    const audioBuffer = await audioStreamRes.arrayBuffer();
    const contentType = audio_url.endsWith(".mp3") ? "audio/mpeg" : "audio/wav";

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: "Internal generation error", detail: error?.message },
      { status: 500 }
    );
  }
}
