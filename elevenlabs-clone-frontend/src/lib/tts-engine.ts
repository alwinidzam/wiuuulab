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

  // Natural comma, semicolon, and colon breath micro-pauses
  result = result.replace(/([,;:])\s+/g, "$1 ... ");

  // Handle ElevenLabs latent prompt tags -> convert to acoustic pauses & expressive breathing
  result = result.replace(/\[(whispers?|whispering|bisik)\]/gi, " ... ");
  result = result.replace(/\[\/(whispers?|whispering|bisik)\]/gi, "");
  result = result.replace(/\[(sendu|serak|serak basah|sedih|rintih)\]/gi, " ... — ");
  result = result.replace(/\[(pause|jeda|napas|tarik napas)\]/gi, " ... — ");
  result = result.replace(/\[(clears throat|coughing|chuckling|sighing|laughing)\]/gi, " ... ");
  result = result.replace(/\[.*?\]/g, ""); // strip remaining bracket tags

  // Pacing pauses for storytelling (commas and periods get natural breathing rhythm)
  result = result.replace(/\.{3,}/g, "... — ");
  return result.trim();
}

export interface VoiceConfig {
  voiceId: string;
  rate: string;
  pitch: string;
}

export function getVoiceConfig(voiceKey: string, speedMultiplier = 1.0): VoiceConfig {
  const key = voiceKey.toLowerCase().trim();

  if (key.includes("athalea")) {
    // Athalea: Serak Basah & Sendu (Vocal Fry, Register Dada Dalam, Jeda Emosional Misterius)
    const rateVal = Math.round(-16 * speedMultiplier);
    return {
      voiceId: "id-ID-GadisNeural",
      rate: `${rateVal}%`,
      pitch: "-14Hz",
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
    const rateVal = Math.round(-12 * speedMultiplier);
    return {
      voiceId: "id-ID-GadisNeural",
      rate: `${rateVal}%`,
      pitch: "-6Hz",
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
  const config = getVoiceConfig(voiceKey, options?.speed ?? 1.0);

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
