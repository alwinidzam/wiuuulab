export async function GET() {
  return Response.json({
    voices: [
      {
        voice_id: "alwi",
        name: "Alwi (Cinematic Horror Narrator 🎙️)",
        category: "indonesian_horror_storyteller",
        labels: {
          accent: "indonesian_standard",
          gender: "male",
          age: "adult",
          use_case: "horror storytelling, creepypasta, dark documentary, reels, shorts",
          style: "warm, medium-low pitch, slightly husky, calm, controlled intonation, cinematic pauses",
        },
      },
      {
        voice_id: "athalea",
        name: "Athalea (Puitis & Intim • 1:1 Clone 🕯️)",
        category: "indonesian_poetic_storyteller",
        labels: {
          accent: "indonesian_standard",
          gender: "female",
          age: "young_adult",
          use_case: "poetic monologue, romantic drama, dark bedtime stories, travel aesthetic, emotional suspense",
          style: "poetic, intimate, calm, warm F0 248Hz, velvety, natural breathing pauses",
        },
      },
      {
        voice_id: "gadis",
        name: "Gadis / Naya (Indonesian Storyteller 📖)",
        category: "indonesian_storyteller",
        labels: {
          accent: "indonesian",
          gender: "female",
          age: "young_adult",
          use_case: "storytelling, audiobook, narration, emotional",
          style: "warm, empathetic, cinematic breathing",
        },
      },
      {
        voice_id: "serena",
        name: "Serena (Indonesian Heartfelt & Audiobooks 🎙️)",
        category: "indonesian_storyteller",
        labels: {
          accent: "indonesian",
          gender: "female",
          age: "young",
          use_case: "emotional narration, poetry, gentle stories",
          style: "soft, soothing, heartfelt",
        },
      },
      {
        voice_id: "siti",
        name: "Siti (Indonesian Casual & Jaksel Slang 🌸)",
        category: "indonesian_casual",
        labels: {
          accent: "indonesian_jakarta_colloquial",
          gender: "female",
          age: "young",
          use_case: "conversational, casual, social media, slang, tiktok",
          style: "friendly, playful, fluent particles (dong, sih, deh)",
        },
      },
      {
        voice_id: "andi",
        name: "Andi / Putra (Indonesian Casual & Creator 🎧)",
        category: "indonesian_casual",
        labels: {
          accent: "indonesian_colloquial",
          gender: "male",
          age: "young_adult",
          use_case: "youtube, tiktok, gaming commentary, casual chat",
          style: "energetic, natural spoken slang",
        },
      },
      {
        voice_id: "mahaputra",
        name: "Mahaputra (Indonesian Formal & News Anchor 📰)",
        category: "indonesian_formal",
        labels: {
          accent: "indonesian_standard_baku",
          gender: "male",
          age: "young_adult",
          use_case: "news broadcast, official presentations, formal speech",
          style: "authoritative, stiff, precise EYD articulation",
        },
      },
      {
        voice_id: "ujang",
        name: "Ujang (Indonesian Javanese Accent / Medok 🌿)",
        category: "indonesian_regional",
        labels: {
          accent: "indonesian_javanese",
          gender: "male",
          age: "young",
          use_case: "regional storytelling, cultural podcasts, relaxing narration",
          style: "soft, warm, authentic Javanese charm",
        },
      },
      {
        voice_id: "ardi",
        name: "Ardi (Indonesian Narrator & Documentary 🎬)",
        category: "indonesian_formal",
        labels: {
          accent: "indonesian_standard",
          gender: "male",
          age: "middle_aged",
          use_case: "science documentary, deep narration, longform audiobooks",
          style: "cinematic, deep baritone, resonant",
        },
      },
      {
        voice_id: "andreas",
        name: "Andreas (English Deep Narrative)",
        category: "premade",
        labels: { accent: "neutral", gender: "male", age: "middle_aged" },
      },
      {
        voice_id: "woman",
        name: "Woman (English Expressive)",
        category: "premade",
        labels: { accent: "american", gender: "female", age: "young" },
      },
      {
        voice_id: "trump",
        name: "Trump (Voice Conversion)",
        category: "cloned",
        labels: { accent: "american", gender: "male", age: "senior" },
      },
    ],
  });
}
