import fs from "fs";
import path from "path";
import { analyzeContext, type ContextAnalysisResult } from "./context-engine";

// Indonesian Slang & Colloquial Normalizer (Jaksel, Casual, Social Media)
const INDONESIAN_CASUAL_MAP: [RegExp, string][] = [
  [/\bbgt\b/gi, "banget"],
  [/\bbngt\b/gi, "banget"],
  [/\bgak\b/gi, "nggak"],
  [/\bga\b/gi, "nggak"],
  [/\bngga\b/gi, "nggak"],
  [/\bg\b/gi, "nggak"],
  [/\bklo\b/gi, "kalau"],
  [/\bkalo\b/gi, "kalau"],
  [/\byg\b/gi, "yang"],
  [/\bdgn\b/gi, "dengan"],
  [/\budh\b/gi, "udah"],
  [/\budah\b/gi, "udah"],
  [/\bsdh\b/gi, "sudah"],
  [/\bblm\b/gi, "belum"],
  [/\bbelom\b/gi, "belum"],
  [/\btp\b/gi, "tapi"],
  [/\btpi\b/gi, "tapi"],
  [/\bbeneran\b/gi, "bener-bener"],
  [/\bsantuy\b/gi, "santai"],
  [/\bgw\b/gi, "gue"],
  [/\bkrn\b/gi, "karena"],
  [/\bkarna\b/gi, "karena"],
  [/\bjd\b/gi, "jadi"],
  [/\bjgn\b/gi, "jangan"],
  [/\bkm\b/gi, "kamu"],
  [/\bsy\b/gi, "saya"],
  [/\blg\b/gi, "lagi"],
  [/\blgi\b/gi, "lagi"],
  [/\bskrg\b/gi, "sekarang"],
  [/\bskg\b/gi, "sekarang"],
  [/\bntar\b/gi, "sebentar"],
  [/\bgpp\b/gi, "nggak apa-apa"],
  [/\bgapapa\b/gi, "nggak apa-apa"],
  [/\bygy\b/gi, "ya guys ya"],
  [/\bbtw\b/gi, "by the way"],
  [/\bfyi\b/gi, "for your information"],
  [/\bpls\b/gi, "tolong"],
  [/\bplz\b/gi, "tolong"],
  [/\bthx\b/gi, "terima kasih"],
  [/\bty\b/gi, "terima kasih"],
  [/\btengs\b/gi, "thanks"],
];

// Formal EYD Indonesian Normalizer (News, Corporate, Documents)
const INDONESIAN_FORMAL_MAP: [RegExp, string][] = [
  [/\bgak\b/gi, "tidak"],
  [/\bga\b/gi, "tidak"],
  [/\bngga\b/gi, "tidak"],
  [/\bnggak\b/gi, "tidak"],
  [/\bg\b/gi, "tidak"],
  [/\budh\b/gi, "sudah"],
  [/\budah\b/gi, "sudah"],
  [/\bsdh\b/gi, "sudah"],
  [/\bklo\b/gi, "kalau"],
  [/\bkalo\b/gi, "kalau"],
  [/\byg\b/gi, "yang"],
  [/\bdgn\b/gi, "dengan"],
  [/\bblm\b/gi, "belum"],
  [/\bbelom\b/gi, "belum"],
  [/\btp\b/gi, "tetapi"],
  [/\btpi\b/gi, "tetapi"],
  [/\bkrn\b/gi, "karena"],
  [/\bkarna\b/gi, "karena"],
  [/\bbgt\b/gi, "sangat"],
  [/\bbngt\b/gi, "sangat"],
  [/\bbener\b/gi, "benar"],
  [/\bbeneran\b/gi, "sungguh-sungguh"],
  [/\baja\b/gi, "saja"],
  [/\baj\b/gi, "saja"],
  [/\bjd\b/gi, "jadi"],
  [/\bjgn\b/gi, "jangan"],
  [/\bkm\b/gi, "Anda"],
  [/\bsy\b/gi, "saya"],
  [/\btau\b/gi, "tahu"],
  [/\bbikin\b/gi, "membuat"],
];

export function normalizeText(text: string, isFormal = false): string {
  let result = text.replace(/\s+/g, " ");

  // Natural punctuation flow
  result = result.replace(/([,;:])/g, "$1 ");

  // Handle emotional tags with natural cadences
  result = result.replace(/\[\/?(whispers?|whispering|bisik)\]/gi, " ");
  result = result.replace(/\[(sendu|serak|serak basah|sedih|rintih)\]/gi, " ");
  result = result.replace(/\[(pause|jeda|napas|tarik napas)\]/gi, " — ");
  result = result.replace(/\[(clears throat|coughing|chuckling|sighing|laughing)\]/gi, " ");
  result = result.replace(/\[.*?\]/g, ""); // strip remaining bracket tags

  // Punctuation clean-up
  result = result.replace(/\s+([,.:;?!])/g, "$1");
  result = result.replace(/\.{4,}/g, "...");
  result = result.replace(/\s+/g, " ");

  const map = isFormal ? INDONESIAN_FORMAL_MAP : INDONESIAN_CASUAL_MAP;
  for (const [regex, replacement] of map) {
    result = result.replace(regex, replacement);
  }

  return result.trim();
}

export interface KokoroVoiceProfile {
  voice_names: string[];
  speed: number;
}

// 1:1 Character Acoustic Mappings using Kokoro Neural Voice Blends
export function getKokoroVoiceConfig(
  voiceKey: string,
  speedMultiplier = 1.0
): KokoroVoiceProfile {
  const key = voiceKey.toLowerCase().trim();

  // Athalea: Sendu & Serak-Serak Basah (Heartfelt, breathy, chest resonance)
  if (key.includes("athalea")) {
    return {
      voice_names: ["af_heart", "af_nicole"],
      speed: Math.round(0.95 * speedMultiplier * 100) / 100,
    };
  }

  // Serena: Heartfelt Indonesian (Novel & Poetry, warm emotional cadence)
  if (key.includes("serena") || key === "fpspi3vlnq0anctpihk5") {
    return {
      voice_names: ["af_heart", "af_bella"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Alwi: Horror Baritone (Cinematic dark suspenseful timbre)
  if (key.includes("alwi") || key === "r86jddkroi9bjwxffjsr") {
    return {
      voice_names: ["am_onyx", "am_fenrir"],
      speed: Math.round(0.92 * speedMultiplier * 100) / 100,
    };
  }

  // Ongky Himawan: Calm & Deep Baritone
  if (key.includes("ongky") || key === "5yvvtvlhueciu0jblbef") {
    return {
      voice_names: ["am_michael", "am_adam"],
      speed: Math.round(0.96 * speedMultiplier * 100) / 100,
    };
  }

  // Bowo: Intimidating and Hoarse (Creaky gravelly vocal fry)
  if (key.includes("bowo") || key === "lxiqov1uxbcgyteitahf") {
    return {
      voice_names: ["am_fenrir", "am_onyx"],
      speed: Math.round(0.88 * speedMultiplier * 100) / 100,
    };
  }

  // Kang Nandar: Smooth, Soothing and Calm (Indonesian Elder Explainer)
  if (key.includes("nandar") || key === "ak834geoxqetvimpgurt") {
    return {
      voice_names: ["bm_george", "am_liam"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Mangili: Encouraging & Hypnotic Sleep Story
  if (key.includes("mangili") || key === "xw0l8saiu5mv7xqjcraj") {
    return {
      voice_names: ["af_sky", "af_heart"],
      speed: Math.round(0.90 * speedMultiplier * 100) / 100,
    };
  }

  // Siti: Indonesian Casual & Jaksel Slang
  if (key.includes("siti") || key.includes("jaksel")) {
    return {
      voice_names: ["af_sarah", "af_bella"],
      speed: Math.round(1.08 * speedMultiplier * 100) / 100,
    };
  }

  // Andi Putra: Indonesian Casual & Creator
  if (key.includes("andi") || key.includes("putra")) {
    return {
      voice_names: ["am_adam", "am_michael"],
      speed: Math.round(1.04 * speedMultiplier * 100) / 100,
    };
  }

  // Rachel: ElevenLabs Signature Calm Narration
  if (key.includes("rachel") || key === "21m00tcm4tlvdq8ikwam") {
    return {
      voice_names: ["af_nicole", "af_sarah"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Nicole: Whisper & Breathy
  if (key.includes("nicole")) {
    return {
      voice_names: ["af_nicole"],
      speed: Math.round(0.95 * speedMultiplier * 100) / 100,
    };
  }

  // Bella: Soft & Warm Romantic Narration
  if (key.includes("bella") || key === "exavitqu4vr4xnsdxmal") {
    return {
      voice_names: ["af_bella"],
      speed: Math.round(0.98 * speedMultiplier * 100) / 100,
    };
  }

  // Antoni: Modulated Energetic Voice
  if (key.includes("antoni") || key === "erxwobayin019pkysvjv") {
    return {
      voice_names: ["am_onyx", "am_adam"],
      speed: Math.round(1.02 * speedMultiplier * 100) / 100,
    };
  }

  // Sarah: Mature Audiobook Narrator
  if (key.includes("sarah")) {
    return {
      voice_names: ["af_sarah"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Jenna: Warm, Soft and Sultry
  if (key.includes("jenna")) {
    return {
      voice_names: ["af_heart", "af_bella"],
      speed: Math.round(0.92 * speedMultiplier * 100) / 100,
    };
  }

  // Jessica: Playful, Bright, Conversational
  if (key.includes("jessica")) {
    return {
      voice_names: ["af_jessica"],
      speed: Math.round(1.05 * speedMultiplier * 100) / 100,
    };
  }

  // Lily: Velvety Smooth
  if (key.includes("lily")) {
    return {
      voice_names: ["bf_emma", "bf_isabella"],
      speed: Math.round(0.96 * speedMultiplier * 100) / 100,
    };
  }

  // Adam: Distinct, Deep and Engaging American Baritone
  if (key.includes("adam") || key === "pninz6obpgdqpcfmajgb") {
    return {
      voice_names: ["am_adam"],
      speed: Math.round(0.95 * speedMultiplier * 100) / 100,
    };
  }

  // Brian: Deep Baritone
  if (key.includes("brian")) {
    return {
      voice_names: ["bm_daniel", "am_liam"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // George: Warm British Storyteller
  if (key.includes("george")) {
    return {
      voice_names: ["bm_george"],
      speed: Math.round(0.98 * speedMultiplier * 100) / 100,
    };
  }

  // Arnold: Deep Raspy Action Narrator
  if (key.includes("arnold") || key === "vr6aewltigwg4xsoukag") {
    return {
      voice_names: ["am_fenrir", "am_michael"],
      speed: Math.round(0.95 * speedMultiplier * 100) / 100,
    };
  }

  // Josh: Deep Conversational Young
  if (key.includes("josh") || key === "txgeqnhwrfwftfgw9xjx") {
    return {
      voice_names: ["am_michael"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Sam: American Dynamic
  if (key.includes("sam") || key === "yoz06amxzjj28mfd3poq") {
    return {
      voice_names: ["am_adam"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Elli: Young Emotional
  if (key.includes("elli") || key === "mf3mgyeycl7xywbv9v6o") {
    return {
      voice_names: ["af_sky"],
      speed: Math.round(1.02 * speedMultiplier * 100) / 100,
    };
  }

  // Domi: Strong Conversational
  if (key.includes("domi") || key === "aznzlk1xvdvuebnxmlld") {
    return {
      voice_names: ["af_sarah"],
      speed: Math.round(1.0 * speedMultiplier * 100) / 100,
    };
  }

  // Default female heartfelt voice
  return {
    voice_names: ["af_heart"],
    speed: Math.round(1.0 * speedMultiplier * 100) / 100,
  };
}

export async function synthesizeWithKokoroNeural(
  text: string,
  voiceKey: string,
  options?: { speed?: number }
): Promise<{ buffer: Buffer; dataUrl: string; durationEstimate: string }> {
  const { Client } = await import("@gradio/client");
  const config = getKokoroVoiceConfig(voiceKey, options?.speed ?? 1.0);

  const app = await Client.connect("remsky/Kokoro-TTS-Zero");
  const result = await app.predict("/generate_speech_from_ui", {
    text: text,
    voice_names: config.voice_names,
    speed: config.speed,
  });

  const audioUrl = (result.data as any)?.[0]?.url;
  if (!audioUrl) {
    throw new Error("Kokoro Neural Engine tidak mengembalikan data audio");
  }

  const res = await fetch(audioUrl);
  if (!res.ok) {
    throw new Error(`Gagal mengunduh audio hasil sintesis: HTTP ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Audio = buffer.toString("base64");
  const dataUrl = `data:audio/wav;base64,${base64Audio}`;

  const wordCount = text.split(/\s+/).length;
  const durationSeconds = Math.max(1, Math.round(wordCount / 2.5));
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;

  return {
    buffer,
    dataUrl,
    durationEstimate: `${mins}:${secs.toString().padStart(2, "0")}`,
  };
}

export async function synthesizeSpeechDirect(
  text: string,
  voiceKey: string,
  options?: {
    stability?: number;
    speed?: number;
    language?: "id" | "en";
  }
): Promise<{ buffer: Buffer; dataUrl: string; durationEstimate: string }> {
  // 1. Text Context & Semantic Analysis
  const context = analyzeContext(text, voiceKey);
  const isFormal =
    voiceKey.includes("formal") ||
    voiceKey.includes("mahaputra") ||
    context.mood === "authoritative" ||
    (options?.stability ?? 0.35) >= 0.7;
  const processedText = normalizeText(context.processedText, isFormal);

  // 2. Primary: Local Self-Hosted AI Gateway (if configured & running)
  const gatewayUrl =
    process.env.AI_GATEWAY_URL ||
    process.env.STYLETTS2_API_ROUTE ||
    process.env.STYLETTS2_URL;

  if (gatewayUrl && !gatewayUrl.includes("127.0.0.1")) {
    try {
      const res = await fetch(
        `${gatewayUrl}/api/v1/text-to-speech/${encodeURIComponent(voiceKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: processedText,
            voice: voiceKey,
            speed: options?.speed ?? 1.0,
            stability: options?.stability ?? 0.35,
            language: options?.language ?? "id",
          }),
        }
      );
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString("base64");
        const isWav = buffer.subarray(0, 4).toString() === "RIFF";
        const dataUrl = `data:${isWav ? "audio/wav" : "audio/mpeg"};base64,${base64Audio}`;
        const wordCount = processedText.split(/\s+/).length;
        const durationSeconds = Math.max(1, Math.round(wordCount / 2.5));
        const mins = Math.floor(durationSeconds / 60);
        const secs = durationSeconds % 60;
        return {
          buffer,
          dataUrl,
          durationEstimate: `${mins}:${secs.toString().padStart(2, "0")}`,
        };
      }
    } catch (gwErr) {
      console.warn("Self-Hosted Gateway attempt bypassed:", gwErr);
    }
  }

  // 3. Autonomous High-Fidelity Kokoro Neural Engine (Zero ElevenLabs, Zero Edge-TTS, Zero Python)
  try {
    return await synthesizeWithKokoroNeural(processedText, voiceKey, options);
  } catch (err: any) {
    console.error("Kokoro Neural Engine error:", err);
    throw new Error(
      "Gagal memproses sintesis suara mandiri: " +
        (err?.message || "Kesalahan jaringan")
    );
  }
}

// Organic Procedural Sound Effects Synthesizer (Zero vocal formants)
function createWavBuffer(samples: Float32Array, sampleRate = 44100): Buffer {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] || 0));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, 44 + i * 2);
  }
  return buffer;
}

export function generateProceduralSFX(
  prompt: string,
  durationSeconds = 4
): { buffer: Buffer; dataUrl: string; durationEstimate: string } {
  const sampleRate = 44100;
  const safeDuration = Math.min(10, Math.max(1, durationSeconds));
  const numSamples = Math.floor(sampleRate * safeDuration);
  const samples = new Float32Array(numSamples);
  const p = prompt.toLowerCase();

  const isExplosionOrHit =
    /boom|hit|impact|punch|kick|explosion|thunder|gun|shot|blast|strike|slam/.test(
      p
    );
  const isWhooshOrWind =
    /whoosh|swoosh|wind|transition|flyby|breeze|air|fast|zoom/.test(p);
  const isSciFiOrLaser =
    /laser|blaster|scifi|sci-fi|beep|robot|alien|energy|zap|cyber/.test(p);
  const isWaterOrRain = /water|rain|river|ocean|wave|splash|drop|stream/.test(
    p
  );

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / safeDuration;

    if (isExplosionOrHit) {
      const decay = Math.exp(-progress * 5.5);
      const sub = Math.sin(2 * Math.PI * (85 * Math.exp(-progress * 4.5)) * t);
      const noise = (Math.random() * 2 - 1) * Math.exp(-progress * 12);
      samples[i] = (sub * 0.7 + noise * 0.5) * decay;
    } else if (isWhooshOrWind) {
      const env = Math.sin(Math.PI * progress);
      const noise = (Math.random() * 2 - 1) * 0.55;
      const mod = Math.sin(2 * Math.PI * (180 + 160 * progress) * t);
      samples[i] = (noise * 0.6 + mod * 0.4) * env;
    } else if (isSciFiOrLaser) {
      const freq = 1200 * Math.exp(-progress * 6) + 180;
      const env = Math.exp(-progress * 3.5);
      const tone = Math.sin(2 * Math.PI * freq * t);
      const glitch = Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.3;
      samples[i] = (tone * 0.7 + glitch * 0.3) * env;
    } else if (isWaterOrRain) {
      const env = Math.min(progress * 4, 1) * Math.min((1 - progress) * 4, 1);
      const ripple = Math.sin(2 * Math.PI * 3.5 * t) * 0.15;
      const noise = (Math.random() * 2 - 1) * (0.35 + ripple);
      samples[i] = noise * env;
    } else {
      const env = Math.sin(Math.PI * progress);
      const f1 = Math.sin(2 * Math.PI * 130.81 * t);
      const f2 = Math.sin(2 * Math.PI * 196.0 * t) * 0.6;
      const f3 = Math.sin(2 * Math.PI * 261.63 * t) * 0.3;
      const drone = (f1 + f2 + f3) * 0.3;
      const air = (Math.random() * 2 - 1) * 0.08;
      samples[i] = (drone + air) * env;
    }
  }

  const buffer = createWavBuffer(samples, sampleRate);
  const dataUrl = `data:audio/wav;base64,${buffer.toString("base64")}`;
  const mins = Math.floor(safeDuration / 60);
  const secs = Math.round(safeDuration % 60);

  return {
    buffer,
    dataUrl,
    durationEstimate: `${mins}:${secs.toString().padStart(2, "0")}`,
  };
}

export async function synthesizeSoundEffect(
  prompt: string,
  options?: {
    duration_seconds?: number;
    prompt_influence?: number;
    loop?: boolean;
    model_id?: "eleven_text_to_sound_v3" | "eleven_text_to_sound_v2";
  }
): Promise<{ buffer: Buffer; dataUrl: string; durationEstimate: string }> {
  const safePrompt = prompt.trim();
  const duration =
    options?.duration_seconds ??
    Math.min(10, Math.max(3, Math.round(safePrompt.length / 12)));

  const sfxGatewayUrl =
    process.env.MAKE_AN_AUDIO_URL || process.env.AI_GATEWAY_URL;
  if (sfxGatewayUrl && !sfxGatewayUrl.includes("127.0.0.1")) {
    try {
      const res = await fetch(`${sfxGatewayUrl}/api/v1/sound-generation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: safePrompt,
          duration: duration,
        }),
      });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUrl = `data:audio/mpeg;base64,${buffer.toString("base64")}`;
        const mins = Math.floor(duration / 60);
        const secs = Math.round(duration % 60);
        return {
          buffer,
          dataUrl,
          durationEstimate: `${mins}:${secs.toString().padStart(2, "0")}`,
        };
      }
    } catch (sfxErr) {
      console.warn("Self-hosted sound generation attempt:", sfxErr);
    }
  }

  // 100% Autonomous Foley Synthesizer
  return generateProceduralSFX(safePrompt, duration);
}
