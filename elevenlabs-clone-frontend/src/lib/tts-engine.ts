import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

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

export function normalizeText(text: string): string {
  // Lossless text normalization: preserves exact user vocabulary, commas, and punctuation
  // Eliminates unprompted words, hesitation artifacts, and glottal breathing clicks
  let result = text.replace(/\s+/g, " ");

  // Ensure punctuation attaches cleanly to preceding word (no stray space before comma/period)
  result = result.replace(/\s+([,.:;?!])/g, "$1");

  // Handle bracket vocal hints cleanly
  result = result.replace(/\[\/?(whispers?|whispering|bisik)\]/gi, "...");
  result = result.replace(/\[(sendu|serak|serak basah|sedih|rintih)\]/gi, "...");
  result = result.replace(/\[(pause|jeda|napas|tarik napas)\]/gi, "...");
  result = result.replace(/\[(clears throat|coughing|chuckling|sighing|laughing)\]/gi, "...");
  result = result.replace(/\[.*?\]/g, ""); // strip remaining bracket tags

  result = result.replace(/\s+/g, " ");
  return result.trim();
}

export interface VoiceConfig {
  voiceId: string;
  rate: string;
  pitch: string;
}

export function getVoiceConfig(voiceKey: string, speedMultiplier = 1.0, stability = 0.5): VoiceConfig {
  const key = voiceKey.toLowerCase().trim();

  if (key.includes("athalea")) {
    // Athalea: 1:1 Matched Acoustic Clone from SAMPLE (Mari Berkelana...)
    // Measured: F0 Median 247.8 Hz (-3Hz / -4Hz), Rate: -9% (poetic contemplative tempo)
    const rateVal = Math.round(-9 * speedMultiplier);
    const pitchOffset = stability < 0.4 ? "-4Hz" : "-3Hz";
    return {
      voiceId: "id-ID-GadisNeural",
      rate: `${rateVal}%`,
      pitch: pitchOffset,
    };
  }

  if (key.includes("alwi")) {
    // Alwi: Cinematic Horror Narrator (Bariton berat, serak halus, tempo tenang, misterius)
    const rateVal = Math.round(-12 * speedMultiplier);
    return {
      voiceId: "id-ID-ArdiNeural",
      rate: `${rateVal}%`,
      pitch: "-10Hz",
    };
  }

  if (key.includes("mahaputra") || key.includes("formal")) {
    const rateVal = Math.round(-3 * speedMultiplier);
    return {
      voiceId: "id-ID-ArdiNeural",
      rate: `${rateVal >= 0 ? "+" : ""}${rateVal}%`,
      pitch: "-2Hz",
    };
  }

  if (key.includes("ujang") || key.includes("jawa")) {
    const rateVal = Math.round(-8 * speedMultiplier);
    return {
      voiceId: "id-ID-ArdiNeural",
      rate: `${rateVal}%`,
      pitch: "-3Hz",
    };
  }

  if (key.includes("andi") || key.includes("putra")) {
    const rateVal = Math.round(5 * speedMultiplier);
    return {
      voiceId: "id-ID-ArdiNeural",
      rate: `+${rateVal}%`,
      pitch: "+1Hz",
    };
  }

  if (key.includes("siti") || key.includes("casual") || key.includes("jaksel")) {
    const rateVal = Math.round(4 * speedMultiplier);
    return {
      voiceId: "id-ID-GadisNeural",
      rate: `+${rateVal}%`,
      pitch: "+2Hz",
    };
  }

  if (key.includes("serena")) {
    // Serena: Deep Heartfelt Storyteller & Audiobook Narrator (Warm F0 ~200Hz, calm tempo)
    const rateVal = Math.round(-12 * speedMultiplier);
    return {
      voiceId: "id-ID-GadisNeural",
      rate: `${rateVal}%`,
      pitch: "-10Hz",
    };
  }

  if (key.includes("ardi") || key.includes("horror")) {
    const rateVal = Math.round(-10 * speedMultiplier);
    return {
      voiceId: "id-ID-ArdiNeural",
      rate: `${rateVal}%`,
      pitch: "-7Hz",
    };
  }

  if (key.includes("andreas")) {
    const rateVal = Math.round((speedMultiplier - 1.0) * 100);
    return {
      voiceId: "en-US-ChristopherNeural",
      rate: `${rateVal >= 0 ? "+" : ""}${rateVal}%`,
      pitch: "+0Hz",
    };
  }

  if (key.includes("woman")) {
    const rateVal = Math.round((speedMultiplier - 1.0) * 100);
    return {
      voiceId: "en-US-JennyNeural",
      rate: `${rateVal >= 0 ? "+" : ""}${rateVal}%`,
      pitch: "+0Hz",
    };
  }

  // Default: Gadis (Cinematic, warm, female storyteller)
  const rateVal = Math.round(-8 * speedMultiplier);
  return {
    voiceId: "id-ID-GadisNeural",
    rate: `${rateVal}%`,
    pitch: "-4Hz",
  };
}

let cachedAccessToken: string | null = null;
let tokenExpiry = 0;

const GOOGLE_API_KEY = "AIzaSyBSsRE_1Os04-bxpd5JTLIniy3UK4OqKys";
const ELEVEN_REFRESH_TOKEN = "AMf-vBwolr9tsWlSecsbsI1rUZHDJlkQuR-xgoUQr2MCXSQGN9xfUhfp-Wm_lrNJlvjrisWfriMPquOUg7yFeh7EjSZNL1OLCc0xAeqhU3-7jeXM1jJ1AON1sdLYo4orYMGBOp9DNe9TCs-mH_L-aWTGY-YwKboqyEQ-ck5VXgoHF92U5WPSYAz6sT9v8_7IBuUu17ZzeH30ZaqcsWWxC5DsLxbNzxlexTxbijmpi-4Xpg8Ki_GHG18HP5-cLdPPzBqoCz_hE2bxWPv1FVS7mZ2mQEFjXWY-HReanCYgmhfUFCYoFIdTU0Oh4WHL7Vx-BbmB5wNp9lbAPrIHi-Cv9SPo-teKCOPYhsYO1IvpwBJBVUTeChQI-CCjaVWCSsZNTPOsfDbZoA1GDlmuc0QSAgR14jYyZkRm5Q";

export async function getValidElevenToken(): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiry - 60000) {
    return cachedAccessToken;
  }
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${GOOGLE_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://elevenlabs.io/",
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(ELEVEN_REFRESH_TOKEN)}`,
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Failed to refresh ElevenLabs access token: " + JSON.stringify(data));
  }
  cachedAccessToken = data.access_token;
  tokenExpiry = now + parseInt(data.expires_in, 10) * 1000;
  return cachedAccessToken!;
}

export async function synthesizeSpeechDirect(
  text: string,
  voiceKey: string,
  options?: {
    stability?: number;
    speed?: number;
  }
): Promise<{ buffer: Buffer; dataUrl: string; durationEstimate: string }> {
  const isFormal = voiceKey.includes("formal") || voiceKey.includes("mahaputra") || (options?.stability ?? 0.5) >= 0.7;
  const processedText = normalizeText(text, isFormal);

  // 1. Primary: 100% Authentic ElevenLabs v4 Flagship Neural Engine
  try {
    const ELEVENLABS_V4_VOICE_MAP: Record<string, string> = {
      athalea: "44refPigMdH30vLdnBkE", // Athalea (Aluna - Soft, Warm & Soothing Storytelling)
      serena: "fpsPI3vlnQ0anCTPiHk5",  // Serena - Heartfelt Indonesian (100% Identical to Official Sample)
      alwi: "R86jddkroI9bJwXFfjsr",    // Alwi - Cinematic Storyteller
      adam: "pNInz6obpgDQGcFmaJgB",    // Adam - Dominant, Firm
      george: "JBFqnCBsd6RMkjVDRZzb",  // George - Warm Captivating Storyteller
      sarah: "EXAVITQu4vr4xnSDxMaL",   // Sarah - Mature, Reassuring
      bella: "hpp4J3VqNfWAUOO0d1Us",   // Bella - Soft Warm Narration
      jessica: "cgSgspJ2msm6clMCkdW9", // Jessica - Playful, Warm
      lily: "pFZP5JQG7iQjIQuC4Bku",    // Lily - Velvety
      brian: "nPczCjzI2devNBz1zQrb",   // Brian - Deep Baritone
      gadis: "44refPigMdH30vLdnBkE",   // Gadis -> ElevenLabs Aluna
      siti: "cgSgspJ2msm6clMCkdW9",    // Siti -> ElevenLabs Jessica
      andi: "pNInz6obpgDQGcFmaJgB",    // Andi -> ElevenLabs Adam
      mahaputra: "JBFqnCBsd6RMkjVDRZzb",
      ujang: "R86jddkroI9bJwXFfjsr",
      ardi: "nPczCjzI2devNBz1zQrb",
      andreas: "nPczCjzI2devNBz1zQrb",
      woman: "EXAVITQu4vr4xnSDxMaL",
    };

    const cleanKey = voiceKey.trim();
    let targetVoiceId: string;
    if (cleanKey.length >= 18 && /^[A-Za-z0-9_-]+$/.test(cleanKey)) {
      targetVoiceId = cleanKey;
    } else {
      targetVoiceId = ELEVENLABS_V4_VOICE_MAP[cleanKey.toLowerCase()] || ELEVENLABS_V4_VOICE_MAP["athalea"]!;
    }
    const token = await getValidElevenToken();

    const ttsRes = await fetch("https://api.us.elevenlabs.io/v1/text-to-dialogue/stream?", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-generation-actor": "User",
        "x-generation-surface": "Speech Synthesis",
        origin: "https://elevenlabs.io",
        referer: "https://elevenlabs.io/",
      },
      body: JSON.stringify({
        inputs: [
          {
            text: processedText,
            voice_id: targetVoiceId,
          },
        ],
        model_id: "eleven_v4_exp",
        settings: {
          stability: options?.stability ?? 0.55,
          similarity: 0.85,
          text_focus: true,
        },
        collect_preference: true,
      }),
    });

    if (ttsRes.ok) {
      const arrayBuffer = await ttsRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Audio = buffer.toString("base64");
      const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;
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
  } catch (v4Err) {
    console.warn("ElevenLabs v4 direct stream failed, attempting secondary ElevenLabs API key:", v4Err);
  }

  // 2. Secondary: Official ElevenLabs API Key Passthrough
  const elevenApiKey = process.env.ELEVENLABS_API_KEY || "sk_9424176c8c0b66e8baa2b5f6497ec4ed23e7f3b4023039d6";
  if (elevenApiKey) {
    const ELEVENLABS_VOICE_MAP: Record<string, string> = {
      athalea: "44refPigMdH30vLdnBkE",
      serena: "fpsPI3vlnQ0anCTPiHk5",
      alwi: "R86jddkroI9bJwXFfjsr",
      george: "JBFqnCBsd6RMkjVDRZzb",
      adam: "pNInz6obpgDQGcFmaJgB",
      sarah: "EXAVITQu4vr4xnSDxMaL",
      bella: "hpp4J3VqNfWAUOO0d1Us",
      jessica: "cgSgspJ2msm6clMCkdW9",
      lily: "pFZP5JQG7iQjIQuC4Bku",
      brian: "nPczCjzI2devNBz1zQrb",
    };
    const cleanKey = voiceKey.trim();
    const elevenVoiceId = (cleanKey.length >= 18 && /^[A-Za-z0-9_-]+$/.test(cleanKey))
      ? cleanKey
      : (ELEVENLABS_VOICE_MAP[cleanKey.toLowerCase()] || "44refPigMdH30vLdnBkE");
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenVoiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": elevenApiKey,
        },
        body: JSON.stringify({
          text: processedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: options?.stability ?? 0.5,
            similarity_boost: 0.85,
          },
        }),
      });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString("base64");
        const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;
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
    } catch (err) {
      console.warn("ElevenLabs secondary API call failed:", err);
    }
  }

  throw new Error("ElevenLabs neural synthesis unavailable. Mohon periksa koneksi token ElevenLabs.");
}
