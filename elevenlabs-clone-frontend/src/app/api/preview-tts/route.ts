import { NextRequest } from "next/server";
import { synthesizeSpeechDirect } from "~/lib/tts-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text?.trim();
    const voice = body.voice?.trim() || "athalea";

    if (!text) {
      return Response.json({ error: "Teks tidak boleh kosong" }, { status: 400 });
    }

    // Limit preview length to 350 chars for rapid interactive responsiveness
    const trimmedText = text.slice(0, 350);

    const { dataUrl, durationEstimate } = await synthesizeSpeechDirect(trimmedText, voice);

    return Response.json({
      success: true,
      audioUrl: dataUrl,
      duration: durationEstimate,
      voice,
    });
  } catch (error: any) {
    console.error("Preview TTS error:", error);
    return Response.json(
      { error: error?.message || "Gagal menghasilkan suara" },
      { status: 500 }
    );
  }
}
