export async function GET() {
  return Response.json({
    voices: [
      {
        voice_id: "athalea",
        name: "Athalea (Sendu & Serak Basah • 1:1 Sample Clone 🕯️)",
        category: "indonesian_poetic_storyteller",
        labels: {
          accent: "indonesian_standard",
          gender: "female",
          age: "young_adult",
          use_case: "poetic monologue, romantic drama, dark bedtime stories, travel aesthetic, emotional suspense",
          style: "poetic, intimate, calm, warm F0 248Hz, pitch -14Hz, tempo -16%, natural breathing pauses",
        },
      },
      {
        voice_id: "serena",
        name: "Serena (Heartfelt Indonesian • Lembut & Hangat 🎙️)",
        category: "indonesian_heartfelt",
        labels: {
          accent: "indonesian",
          gender: "female",
          age: "young_adult",
          use_case: "emotional narration, novel, poetry, gentle stories",
          style: "soft, soothing, heartfelt, warm F0 235Hz, pitch -8Hz, tempo -11%",
        },
      },
      {
        voice_id: "alwi",
        name: "Alwi (Horror Baritone & Cinematic Storyteller 🎬)",
        category: "indonesian_horror_storyteller",
        labels: {
          accent: "indonesian_standard",
          gender: "male",
          age: "adult",
          use_case: "horror storytelling, creepypasta, dark documentary, reels, shorts",
          style: "warm, deep baritone, pitch -8Hz, tempo -12%, calm, controlled intonation, cinematic pauses",
        },
      },
      {
        voice_id: "ongky",
        name: "Ongky Himawan (Calm & Deep Baritone 🎙️)",
        category: "indonesian_baritone",
        labels: {
          accent: "indonesian",
          gender: "male",
          age: "adult",
          use_case: "documentary, corporate, authoritative",
          style: "bariton resonansi dada bawah, tenang, mantap, dan berwibawa",
        },
      },
      {
        voice_id: "bowo",
        name: "Bowo (Intimidating and Hoarse ⚡)",
        category: "indonesian_horror",
        labels: {
          accent: "indonesian",
          gender: "male",
          age: "middle_aged",
          use_case: "horror narration, suspense, villain",
          style: "serak basah berat (creaky vocal fry & hoarse timbre), nada rendah",
        },
      },
      {
        voice_id: "nandar",
        name: "Kang Nandar (Smooth, Soothing and Calm 🍃)",
        category: "indonesian_storyteller",
        labels: {
          accent: "indonesian",
          gender: "male",
          age: "adult",
          use_case: "explainer, folklore, relaxing stories",
          style: "tutur kata ramah, hangat, dan santai",
        },
      },
      {
        voice_id: "mangili",
        name: "Mangili (Encouraging & Sleep Story 🌙)",
        category: "indonesian_sleep_story",
        labels: {
          accent: "indonesian",
          gender: "female",
          age: "adult",
          use_case: "sleep stories, meditation, relaxation",
          style: "vokal hipnotik pengantar tidur (sleep story)",
        },
      },
      {
        voice_id: "adam",
        name: "Adam (Distinct, Deep and Engaging 🎙️)",
        category: "official_elevenlabs",
        labels: { accent: "american", gender: "male", age: "middle_aged", use_case: "signature narrator, cinematic horror, podcast" },
      },
      {
        voice_id: "jenna",
        name: "Jenna (Warm, Soft, and Sultry 🌸)",
        category: "official_elevenlabs",
        labels: { accent: "american", gender: "female", age: "young", use_case: "warm, soft, sultry and breathy narration" },
      },
      {
        voice_id: "george",
        name: "George (Official ElevenLabs Warm Storyteller 🕯️)",
        category: "official_elevenlabs",
        labels: { accent: "british", gender: "male", age: "middle_aged", use_case: "warm captivating storyteller, dark tales" },
      },
      {
        voice_id: "sarah",
        name: "Sarah (Official ElevenLabs Reassuring Narrator ✨)",
        category: "official_elevenlabs",
        labels: { accent: "american", gender: "female", age: "young", use_case: "mature, reassuring, audiobook" },
      },
      {
        voice_id: "bella",
        name: "Bella (Official ElevenLabs Soft & Warm 🌸)",
        category: "official_elevenlabs",
        labels: { accent: "american", gender: "female", age: "middle_aged", use_case: "intimate reflective narration, romantic drama" },
      },
      {
        voice_id: "brian",
        name: "Brian (Official ElevenLabs Deep Baritone 🎙️)",
        category: "official_elevenlabs",
        labels: { accent: "american", gender: "male", age: "middle_aged", use_case: "deep baritone narration, cinema, commercial" },
      },
      {
        voice_id: "jessica",
        name: "Jessica (Official ElevenLabs Playful & Warm 🌻)",
        category: "official_elevenlabs",
        labels: { accent: "american", gender: "female", age: "young", use_case: "playful, conversational, commercial" },
      },
      {
        voice_id: "lily",
        name: "Lily (Official ElevenLabs Velvety Smooth 🌿)",
        category: "official_elevenlabs",
        labels: { accent: "british", gender: "female", age: "middle_aged", use_case: "velvety, calm narration, documentary" },
      },
    ],
  });
}
