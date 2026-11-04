import { NextRequest } from "next/server";
import { synthesizeSoundEffect } from "~/lib/tts-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.text?.trim() || body.prompt?.trim();
    if (!prompt) {
      return Response.json(
        { error: "Deskripsi sound effect tidak boleh kosong" },
        { status: 400 }
      );
    }

    const { dataUrl, durationEstimate } = await synthesizeSoundEffect(prompt, {
      duration_seconds: body.duration_seconds,
      prompt_influence: body.prompt_influence,
    });

    return Response.json({
      success: true,
      audioUrl: dataUrl,
      duration: durationEstimate,
    });
  } catch (error: any) {
    console.error("Preview SFX error:", error);
    return Response.json(
      { error: error?.message || "Gagal menghasilkan efek suara" },
      { status: 500 }
    );
  }
}
