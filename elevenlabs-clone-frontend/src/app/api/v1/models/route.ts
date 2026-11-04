export async function GET() {
  return Response.json({
    data: [
      {
        id: "eleven_v4",
        name: "Eleven v4 (Flagship Ultra-Fidelity)",
        can_do_text_to_speech: true,
        can_do_voice_conversion: true,
        languages: [
          { language_id: "id", name: "Indonesian" },
          { language_id: "en", name: "English" },
        ],
        description:
          "ElevenLabs v4 Flagship Architecture with Native Indonesian Acoustic & Intonation Engine",
      },
      {
        id: "eleven_v4_turbo",
        name: "Eleven v4 Turbo (Realtime Low-Latency)",
        can_do_text_to_speech: true,
        can_do_voice_conversion: false,
        languages: [
          { language_id: "id", name: "Indonesian" },
          { language_id: "en", name: "English" },
        ],
        description:
          "Ultra-low latency model for conversational agents and real-time streaming",
      },
      {
        id: "eleven_multilingual_v2",
        name: "Eleven Multilingual v2",
        can_do_text_to_speech: true,
        can_do_voice_conversion: true,
        languages: [
          { language_id: "id", name: "Indonesian" },
          { language_id: "en", name: "English" },
        ],
        description: "Production studio multilingual synthesis",
      },
      {
        id: "styletts2",
        name: "StyleTTS2 Native Engine",
        can_do_text_to_speech: true,
        can_do_voice_conversion: false,
        description: "Native Neural Voice Engine",
      },
    ],
  });
}
