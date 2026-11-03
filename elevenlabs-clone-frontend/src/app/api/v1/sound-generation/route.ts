import { NextRequest } from "next/server";
import { env } from "~/env";
import { validateApiKey } from "~/server/api-auth";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  const authResult = await validateApiKey(request);
  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  const { user } = authResult;

  let body: { text?: string; prompt?: string };
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
    const backendRes = await fetch(env.MAKE_AN_AUDIO_API_ROUTE + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: env.BACKEND_API_KEY,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!backendRes.ok) {
      return Response.json(
        { error: "Sound generation backend error", status: backendRes.statusText },
        { status: backendRes.status }
      );
    }

    const { audio_url, s3_key } = (await backendRes.json()) as {
      audio_url: string;
      s3_key: string;
    };

    await db.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 50 } },
    });

    await db.generatedAudioClip.create({
      data: {
        userId: user.id,
        text: prompt,
        voice: "sfx",
        s3Key: s3_key,
        service: "make-an-audio",
      },
    });

    const audioRes = await fetch(audio_url);
    const audioBuffer = await audioRes.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: "Internal SFX generation error", detail: error?.message },
      { status: 500 }
    );
  }
}
