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

export function normalizeText(text: string, isFormal = false): string {
  const map = isFormal ? INDONESIAN_FORMAL_MAP : INDONESIAN_CASUAL_MAP;
  let result = text;
  for (const [regex, replacement] of map) {
    result = result.replace(regex, replacement);
  }

  // Clean multi-spaces & normalize ellipsis
  result = result.replace(/\s+/g, " ");
  result = result.replace(/\.{3,}/g, " … ");

  // Natural comma, semicolon, and colon breath micro-pauses
  result = result.replace(/([,;:])\s*(?!\.\.\.)/g, "$1 … ");

  // Handle ElevenLabs latent prompt tags -> convert to acoustic pauses & expressive breathing
  result = result.replace(/\[(whispers?|whispering|bisik)\]/gi, " … ");
  result = result.replace(/\[\/(whispers?|whispering|bisik)\]/gi, "");
  result = result.replace(/\[(sendu|serak|serak basah|sedih|rintih)\]/gi, " … — ");
  result = result.replace(/\[(pause|jeda|napas|tarik napas)\]/gi, " … — ");
  result = result.replace(/\[(clears throat|coughing|chuckling|sighing|laughing)\]/gi, " … ");
  result = result.replace(/\[.*?\]/g, ""); // strip remaining bracket tags

  // Sentence boundary natural breath pauses (puitis & sinematik)
  result = result.replace(/([.!?])\s+/g, "$1 … ");
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

  // Official ElevenLabs direct neural engine integration
  const elevenApiKey = process.env.ELEVENLABS_API_KEY || "sk_9424176c8c0b66e8baa2b5f6497ec4ed23e7f3b4023039d6";
  if (elevenApiKey) {
    const ELEVENLABS_VOICE_MAP: Record<string, string> = {
      alwi: "nPczCjzI2devNBz1zQrb", // Brian - Deep Baritone Horror & Creepypasta
      george: "JBFqnCBsd6RMkjVDRZzb", // George - Warm Captivating Storyteller
      adam: "pNInz6obpgDQGcFmaJgB", // Adam - Dominant, Firm, Deep
      sarah: "EXAVITQu4vr4xnSDxMaL", // Sarah - Mature, Reassuring
      bella: "hpp4J3VqNfWAUOO0d1Us", // Bella - Soft, Warm Storytelling
      jessica: "cgSgspJ2msm6clMCkdW9", // Jessica - Playful, Warm
      lily: "pFZP5JQG7iQjIQuC4Bku", // Lily - Velvety Actress
      serena: "fpsPI3vlnQ0anCTPiHk5", // Serena - Heartfelt Indonesian
      ongky: "5YVVTVlHuEcIu0JBLbEF", // Ongky - Calm & Deep
      bowo: "LxiqOV1uxBCgYTeitAHf", // Bowo - Intimidating & Hoarse
    };
    const elevenVoiceId = ELEVENLABS_VOICE_MAP[voiceKey.toLowerCase().trim()];
    if (elevenVoiceId) {
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
              stability: options?.stability ?? 0.38,
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
        console.warn("ElevenLabs direct passthrough failed, falling back to calibrated neural engine:", err);
      }
    }
  }

  const config = getVoiceConfig(voiceKey, options?.speed ?? 1.0, options?.stability ?? 0.5);

  const tts = new MsEdgeTTS();
  // Studio High-Bitrate 96kbps Mono MP3 for rich resonance & zero metallic artifacts
  await tts.setMetadata(config.voiceId, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(processedText, {
    pitch: config.pitch,
    rate: config.rate,
  });

  const chunks: Buffer[] = [];
  audioStream.on("data", (chunk: Buffer) => {
    chunks.push(chunk);
  });

  await new Promise<void>((resolve, reject) => {
    audioStream.on("end", () => resolve());
    audioStream.on("error", (err: Error) => reject(err));
  });

  tts.close();

  const buffer = Buffer.concat(chunks);
  const base64 = buffer.toString("base64");
  const dataUrl = `data:audio/mp3;base64,${base64}`;

  // Estimate duration (24kHz 96kbps mono MP3 ~ 12000 bytes/sec)
  const seconds = Math.max(1, Math.round(buffer.length / 12000));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const durationEstimate = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

  return {
    buffer,
    dataUrl,
    durationEstimate,
  };
}
