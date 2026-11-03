import { NextRequest } from "next/server";
import { env } from "~/env";
import { getUploadUrl } from "~/lib/s3";
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
  const targetVoice = voiceId || "andreas";

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return Response.json({ error: "Form field 'audio' (file) is required" }, { status: 400 });
    }

    // 1. Upload input audio to S3
    const { uploadUrl, s3Key: inputS3Key } = await getUploadUrl("audio/wav");
    const arrayBuf = await audioFile.arrayBuffer();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: arrayBuf,
      headers: { "Content-Type": "audio/wav" },
    });

    if (!uploadRes.ok) {
      return Response.json({ error: "Failed to upload source audio" }, { status: 502 });
    }

    // 2. Call Seed-VC backend
    const backendRes = await fetch(env.SEED_VC_API_ROUTE + "/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: env.BACKEND_API_KEY,
      },
      body: JSON.stringify({
        source_audio_key: inputS3Key,
        target_voice: targetVoice,
      }),
    });

    if (!backendRes.ok) {
      return Response.json(
        { error: "Voice conversion backend error", status: backendRes.statusText },
        { status: backendRes.status }
      );
    }

    const { audio_url, s3_key } = (await backendRes.json()) as {
      audio_url: string;
      s3_key: string;
    };

    // 3. Deduct credits & save history
    await db.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 50 } },
    });

    await db.generatedAudioClip.create({
      data: {
        userId: user.id,
        voice: targetVoice,
        originalVoiceS3Key: inputS3Key,
        s3Key: s3_key,
        service: "seedvc",
      },
    });

    // 4. Return audio stream
    const audioRes = await fetch(audio_url);
    const outputBuffer = await audioRes.arrayBuffer();

    return new Response(outputBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": outputBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: "Internal STS generation error", detail: error?.message },
      { status: 500 }
    );
  }
}
