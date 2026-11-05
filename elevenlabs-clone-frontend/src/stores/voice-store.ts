import { create } from "zustand";
import { ServiceType } from "~/types/services";

const GRADIENT_COLORS = [
  "linear-gradient(45deg, #ec4899, #f43f5e, #ffffff, #8b5cf6)", // Pink/Rose (Gadis)
  "linear-gradient(45deg, #f59e0b, #ec4899, #ffffff, #10b981)", // Amber/Pink (Siti)
  "linear-gradient(45deg, #3b82f6, #06b6d4, #ffffff, #10b981)", // Blue/Cyan (Ardi)
  "linear-gradient(45deg, #8b5cf6, #3b82f6, #ffffff, #ec4899)", // Purple/Blue (Andreas)
  "linear-gradient(45deg, #10b981, #f59e0b, #ffffff, #f43f5e)", // Green/Amber (Woman)
  "linear-gradient(45deg, #ef4444, #f97316, #ffffff, #eab308)", // Red/Orange (Trump)
];

export interface Voice {
  id: string;
  name: string;
  displayName: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  gradientColors: string;
  service: ServiceType;
  category: "id" | "en" | "all";
}

const voices: Voice[] = [
  // Indonesian Native Neural Voices (100% Sampling Master & Formula Human-Feel)
  {
    id: "athalea",
    name: "Athalea (Sendu & Serak Basah • 1:1 Sample Clone 🕯️)",
    displayName: "Athalea",
    badge: "1:1 Master Clone",
    subtitle: "Sendu & Serak Basah 🕯️",
    description: "F0 248Hz register dada, puitis, intim, jeda napas respirasi alami dari sampel asli user",
    gradientColors: "linear-gradient(45deg, #831843, #be185d, #fda4af, #500724)",
    service: "styletts2",
    category: "id",
  },
  {
    id: "serena",
    name: "Serena (Heartfelt Indonesian • Lembut & Hangat 🎙️)",
    displayName: "Serena",
    badge: "Heartfelt",
    subtitle: "Lembut & Hangat Pencerita 🎙️",
    description: "Lembut, hangat, penuh penghayatan emosional mendalam narator novel & puisi",
    gradientColors: GRADIENT_COLORS[0]!,
    service: "styletts2",
    category: "id",
  },
  {
    id: "alwi",
    name: "Alwi (Horror Baritone & Cinematic Storyteller 🎬)",
    displayName: "Alwi",
    badge: "Horror Baritone",
    subtitle: "Sinematik & Misteri 🎬",
    description: "Pitch bariton berat, tempo misteri untuk narasi horor, creepypasta, dan dokumenter",
    gradientColors: "linear-gradient(45deg, #1e293b, #475569, #0f172a, #334155)",
    service: "styletts2",
    category: "id",
  },
  {
    id: "ongky",
    name: "Ongky Himawan (Calm & Deep Baritone 🎙️)",
    displayName: "Ongky Himawan",
    badge: "Deep Baritone",
    subtitle: "Tenang & Berwibawa 🎙️",
    description: "Bariton resonansi dada bawah, tenang, mantap, dan berwibawa",
    gradientColors: "linear-gradient(45deg, #0f172a, #334155, #64748b, #1e293b)",
    service: "styletts2",
    category: "id",
  },
  {
    id: "bowo",
    name: "Bowo (Intimidating & Hoarse Vocal Fry ⚡)",
    displayName: "Bowo",
    badge: "Gravelly Fry",
    subtitle: "Serak Basah Berat ⚡",
    description: "Serak basah berat (creaky vocal fry & hoarse timbre), nada rendah mengintimidasi narasi horor",
    gradientColors: "linear-gradient(45deg, #451a03, #78350f, #b45309, #292524)",
    service: "styletts2",
    category: "id",
  },
  {
    id: "nandar",
    name: "Kang Nandar (Smooth, Soothing and Calm 🍃)",
    displayName: "Kang Nandar",
    badge: "Elder Story",
    subtitle: "Ramah & Menyejukkan 🍃",
    description: "Tutur kata ramah, hangat, dan santai untuk explainer dan dongeng",
    gradientColors: GRADIENT_COLORS[1]!,
    service: "styletts2",
    category: "id",
  },
  {
    id: "mangili",
    name: "Mangili (Encouraging & Sleep Story 🌙)",
    displayName: "Mangili",
    badge: "Hypnotic",
    subtitle: "Pengantar Tidur 🌙",
    description: "Vokal hipnotik dan menenangkan pengantar tidur (sleep story)",
    gradientColors: "linear-gradient(45deg, #1e1b4b, #312e81, #4338ca, #172554)",
    service: "styletts2",
    category: "id",
  },
  {
    id: "siti",
    name: "Siti (Indonesian Casual & Jaksel Slang 🌸)",
    displayName: "Siti",
    badge: "Casual Slang",
    subtitle: "Santai & Gaul 🌸",
    description: "Luwes, santai, fasih bahasa gaul, partikel tutur (dong, sih, deh) & gaya tongkrongan",
    gradientColors: GRADIENT_COLORS[2]!,
    service: "styletts2",
    category: "id",
  },
  {
    id: "andi",
    name: "Andi / Putra (Indonesian Casual & Creator 🎧)",
    displayName: "Andi Putra",
    badge: "Creator",
    subtitle: "Energik & Gaul 🎧",
    description: "Pemuda santai, energik, luwes gaul untuk konten YouTube, TikTok, dan podcast",
    gradientColors: GRADIENT_COLORS[3]!,
    service: "styletts2",
    category: "id",
  },

  // English & Global Neural Voices
  {
    id: "adam",
    name: "Adam (Distinct, Deep and Engaging 🎙️)",
    displayName: "Adam",
    badge: "American Baritone",
    subtitle: "Distinct & Engaging 🎙️",
    description: "Bariton klasik legendaris untuk narasi dokumenter sinematik",
    gradientColors: "linear-gradient(45deg, #1e3a8a, #3b82f6, #93c5fd, #172554)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "jenna",
    name: "Jenna (Warm, Soft, and Sultry 🌸)",
    displayName: "Jenna",
    badge: "Warm Sultry",
    subtitle: "Intim & Breathy 🌸",
    description: "Suara wanita intim dengan tekstur desah napas tipis (sultry & breathy)",
    gradientColors: "linear-gradient(45deg, #831843, #db2777, #fbcfe8, #500724)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "george",
    name: "George (Warm Storyteller 🕯️)",
    displayName: "George",
    badge: "Storyteller",
    subtitle: "Warm & Captivating 🕯️",
    description: "Warm, captivating storyteller — cinematic narration, suspense & mystery",
    gradientColors: "linear-gradient(45deg, #7c2d12, #ea580c, #fed7aa, #431407)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "sarah",
    name: "Sarah (Reassuring Narrator ✨)",
    displayName: "Sarah",
    badge: "Reassuring",
    subtitle: "Mature & Confident ✨",
    description: "Mature, reassuring, confident female voice for audiobooks & high-tier media",
    gradientColors: "linear-gradient(45deg, #4c1d95, #8b5cf6, #ddd6fe, #2e1065)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "bella",
    name: "Bella (Soft & Warm 🌸)",
    displayName: "Bella",
    badge: "Reflective",
    subtitle: "Soft & Intimate 🌸",
    description: "Soft, warm, intimate narration — ideal for reflective stories & romantic drama",
    gradientColors: "linear-gradient(45deg, #831843, #db2777, #fbcfe8, #500724)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "brian",
    name: "Brian (Deep Baritone 🎙️)",
    displayName: "Brian",
    badge: "Cinematic",
    subtitle: "Deep & Resonant 🎙️",
    description: "Deep, resonant, rich narration — signature cinematic baritone",
    gradientColors: "linear-gradient(45deg, #0f172a, #334155, #64748b, #1e293b)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "jessica",
    name: "Jessica (Playful & Warm 🌻)",
    displayName: "Jessica",
    badge: "Playful",
    subtitle: "Bright & Energetic 🌻",
    description: "Bright, engaging, friendly voice for dynamic storytelling & podcasts",
    gradientColors: "linear-gradient(45deg, #d97706, #f59e0b, #fef3c7, #b45309)",
    service: "styletts2",
    category: "en",
  },
  {
    id: "lily",
    name: "Lily (Velvety Smooth 🌿)",
    displayName: "Lily",
    badge: "Smooth",
    subtitle: "Calm & Velvety 🌿",
    description: "Velvety, calm, soothing narration for bedtime stories and documentaries",
    gradientColors: "linear-gradient(45deg, #047857, #10b981, #d1fae5, #065f46)",
    service: "styletts2",
    category: "en",
  },

  // Seed-VC Voice Changer
  {
    id: "gadis",
    name: "Gadis (Indonesian Female Storyteller)",
    displayName: "Gadis",
    badge: "Indonesian",
    subtitle: "Storyteller",
    gradientColors: GRADIENT_COLORS[0]!,
    service: "seedvc",
    category: "id",
  },
  {
    id: "andreas",
    name: "Andreas (Male Timbre)",
    displayName: "Andreas",
    badge: "Male Timbre",
    subtitle: "Deep Baritone",
    gradientColors: GRADIENT_COLORS[3]!,
    service: "seedvc",
    category: "en",
  },
  {
    id: "woman",
    name: "Woman (Female Timbre)",
    displayName: "Woman",
    badge: "Female Timbre",
    subtitle: "Expressive",
    gradientColors: GRADIENT_COLORS[4]!,
    service: "seedvc",
    category: "en",
  },
  {
    id: "trump",
    name: "Trump (Voice Clone)",
    displayName: "Trump",
    badge: "Celebrity",
    subtitle: "Voice Clone",
    gradientColors: GRADIENT_COLORS[5]!,
    service: "seedvc",
    category: "en",
  },
];

const defaultStyleTTS2Voice =
  voices.find((v) => v.service === "styletts2" && v.id === "athalea") ?? voices[0]!;
const defaultSeedVCVoice =
  voices.find((v) => v.service === "seedvc") ?? null;

interface VoiceState {
  voices: Voice[];
  selectedLanguage: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
  selectedVoices: Record<ServiceType, Voice | null>;
  getVoices: (service: ServiceType, lang?: "id" | "en" | "all") => Voice[];
  getSelectedVoice: (service: ServiceType) => Voice | null;
  selectVoice: (service: ServiceType, voice: string) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voices: voices,
  selectedLanguage: "id",
  setLanguage: (lang) => {
    set({ selectedLanguage: lang });
    // Auto-select primary voice matching language
    const currentVoice = get().selectedVoices.styletts2;
    if (lang === "id" && currentVoice?.category === "en") {
      const defaultIdVoice = get().voices.find((v) => v.service === "styletts2" && v.id === "athalea");
      if (defaultIdVoice) {
        set((state) => ({
          selectedVoices: { ...state.selectedVoices, styletts2: defaultIdVoice },
        }));
      }
    } else if (lang === "en" && currentVoice?.category === "id") {
      const defaultEnVoice = get().voices.find((v) => v.service === "styletts2" && v.id === "adam");
      if (defaultEnVoice) {
        set((state) => ({
          selectedVoices: { ...state.selectedVoices, styletts2: defaultEnVoice },
        }));
      }
    }
  },
  selectedVoices: {
    styletts2: defaultStyleTTS2Voice,
    seedvc: defaultSeedVCVoice,
    "make-an-audio": null,
  },
  getVoices: (service, lang) => {
    const list = get().voices.filter((voice) => voice.service === service);
    if (!lang || lang === "all") return list;
    return list.filter((v) => v.category === lang || v.category === "all");
  },
  getSelectedVoice: (service) => {
    return get().selectedVoices[service];
  },
  selectVoice: (service, voiceId) => {
    const serviceVoices = get().voices.filter(
      (voice) => voice.service === service,
    );

    const selectedVoice =
      serviceVoices.find((voice) => voice.id === voiceId) || serviceVoices[0];

    set((state) => ({
      selectedVoices: {
        ...state.selectedVoices,
        [service]: selectedVoice,
      },
    }));
  },
}));
