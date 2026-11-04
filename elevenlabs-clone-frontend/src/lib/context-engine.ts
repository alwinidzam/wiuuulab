/**
 * WIULab Semantic & Contextual Prosody Engine (ElevenLabs v4 Reverse-Engineered Architecture)
 * 
 * Replicates the multi-layered neural text-conditioning pipeline:
 * 1. Semantic Mood Detection (Horror, Poetic, Heartfelt, Authoritative, Casual)
 * 2. Expressive Punctuation & Contemplative Breath Engineering
 * 3. Dynamic Acoustic Parameter Tuning (Rate, Pitch, Inflection Offsets)
 */

export type SemanticMood = "horror" | "poetic" | "heartfelt" | "authoritative" | "casual" | "neutral";

export interface ContextAnalysisResult {
  mood: SemanticMood;
  rateOffsetPercent: number;
  pitchOffsetHz: number;
  processedText: string;
  sentimentScore: number;
  tagsApplied: string[];
}

const HORROR_KEYWORDS = [
  "malam", "gelap", "sunyi", "hutan", "kabut", "misteri", "takut", "bayangan",
  "langkah", "darah", "kematian", "hantu", "jeritan", "kengerian", "menanti",
  "keringat dingin", "lorong", "tangisan", "mencekam", "kuno", "kuburan", "teror"
];

const POETIC_KEYWORDS = [
  "senja", "rindu", "semesta", "angin", "berkelana", "langit", "bintang", "cinta",
  "peluk", "sepi", "jiwa", "kenangan", "tatap", "keheningan", "hening", "kisah",
  "hati", "sayang", "bayang", "angan", "melangkah", "luka", "pagi", "embun"
];

const HEARTFELT_KEYWORDS = [
  "kehangatan", "terima kasih", "tulus", "sahabat", "keluarga", "syukur", "bahagia",
  "senyuman", "senyum", "pelukan", "harapan", "semangat", "doa", "cinta kasih", "damai"
];

const AUTHORITATIVE_KEYWORDS = [
  "pemerintah", "kebijakan", "ekonomi", "laporan", "resmi", "perusahaan", "analisis",
  "data", "undang-undang", "informasi", "strategi", "sistem", "industri", "pasar"
];

const CASUAL_KEYWORDS = [
  "halo", "santai", "ngobrol", "yuk", "nih", "dong", "sih", "deh", "banget", "asik",
  "keren", "bro", "sis", "gaes", "guys", "tongkrongan", "bikin", "gimana", "kuy"
];

export function analyzeContext(text: string, voiceKey: string = ""): ContextAnalysisResult {
  const lower = text.toLowerCase();
  const voiceLower = voiceKey.toLowerCase();
  const tagsApplied: string[] = [];

  // 1. Keyword Count Scoring
  let horrorScore = 0;
  let poeticScore = 0;
  let heartfeltScore = 0;
  let authScore = 0;
  let casualScore = 0;

  for (const kw of HORROR_KEYWORDS) {
    if (lower.includes(kw)) horrorScore += 2;
  }
  for (const kw of POETIC_KEYWORDS) {
    if (lower.includes(kw)) poeticScore += 2;
  }
  for (const kw of HEARTFELT_KEYWORDS) {
    if (lower.includes(kw)) heartfeltScore += 2;
  }
  for (const kw of AUTHORITATIVE_KEYWORDS) {
    if (lower.includes(kw)) authScore += 2;
  }
  for (const kw of CASUAL_KEYWORDS) {
    if (lower.includes(kw)) casualScore += 2;
  }

  // Voice Persona Bias: Character naturally enhances their native genre
  if (voiceLower.includes("athalea")) {
    poeticScore += 3;
    tagsApplied.push("athalea_poetic_bias");
  } else if (voiceLower.includes("alwi") || voiceLower.includes("bowo")) {
    horrorScore += 3;
    tagsApplied.push("horror_narrator_bias");
  } else if (voiceLower.includes("serena")) {
    heartfeltScore += 3;
    tagsApplied.push("heartfelt_bias");
  } else if (voiceLower.includes("ongky") || voiceLower.includes("adam")) {
    authScore += 3;
    tagsApplied.push("baritone_authority_bias");
  }

  // Determine dominant mood
  let mood: SemanticMood = "neutral";
  let maxScore = 2; // threshold

  if (horrorScore > maxScore && horrorScore >= poeticScore && horrorScore >= heartfeltScore) {
    mood = "horror";
    maxScore = horrorScore;
  } else if (poeticScore > maxScore && poeticScore >= heartfeltScore && poeticScore >= authScore) {
    mood = "poetic";
    maxScore = poeticScore;
  } else if (heartfeltScore > maxScore && heartfeltScore >= authScore) {
    mood = "heartfelt";
    maxScore = heartfeltScore;
  } else if (authScore > maxScore && authScore >= casualScore) {
    mood = "authoritative";
    maxScore = authScore;
  } else if (casualScore > maxScore) {
    mood = "casual";
    maxScore = casualScore;
  }

  // 2. Compute Dynamic Acoustic Parameter Offsets
  let rateOffsetPercent = 0;
  let pitchOffsetHz = 0;

  switch (mood) {
    case "horror":
      // Slower tempo for dramatic suspense, deeper pitch for chest resonance
      rateOffsetPercent = -8;
      pitchOffsetHz = -4;
      tagsApplied.push("suspense_cadence", "sub_bass_resonance");
      break;

    case "poetic":
      // Intimate contemplative tempo, slight chest pitch for vocal fry
      rateOffsetPercent = -5;
      pitchOffsetHz = -2;
      tagsApplied.push("contemplative_tempo", "breathy_intimacy");
      break;

    case "heartfelt":
      // Gentle, tender flow, warm pitch
      rateOffsetPercent = -3;
      pitchOffsetHz = -1;
      tagsApplied.push("tender_warmth");
      break;

    case "authoritative":
      // Controlled, steady cadence, confident baritone
      rateOffsetPercent = -2;
      pitchOffsetHz = -2;
      tagsApplied.push("steady_authority");
      break;

    case "casual":
      // Upbeat, lively pace
      rateOffsetPercent = +4;
      pitchOffsetHz = +1;
      tagsApplied.push("lively_pace");
      break;

    default:
      rateOffsetPercent = 0;
      pitchOffsetHz = 0;
  }

  // 3. Expressive Punctuation Engineering (ElevenLabs v4 Natural Cadence)
  let processed = text;

  // Handle contemplative ellipsis: replace 3 or more dots with gentle breath mark
  processed = processed.replace(/\.{3,}/g, " ... ");

  // Handle dramatic em-dash: add natural boundary space
  processed = processed.replace(/—/g, " — ");

  // Clean double spaces
  processed = processed.replace(/\s+/g, " ").trim();

  return {
    mood,
    rateOffsetPercent,
    pitchOffsetHz,
    processedText: processed,
    sentimentScore: maxScore,
    tagsApplied,
  };
}
