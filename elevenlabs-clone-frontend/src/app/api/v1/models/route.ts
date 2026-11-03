export async function GET() {
  return Response.json({
    data: [
      {
        id: "styletts2",
        object: "model",
        created: 1710000000,
        owned_by: "elevenlabs-clone",
        description: "StyleTTS2 expressive Text-to-Speech",
      },
      {
        id: "seedvc",
        object: "model",
        created: 1710000000,
        owned_by: "elevenlabs-clone",
        description: "Seed-VC Zero-Shot Voice Conversion",
      },
      {
        id: "make-an-audio",
        object: "model",
        created: 1710000000,
        owned_by: "elevenlabs-clone",
        description: "Make-An-Audio Text-to-Sound Diffusion",
      },
    ],
  });
}
