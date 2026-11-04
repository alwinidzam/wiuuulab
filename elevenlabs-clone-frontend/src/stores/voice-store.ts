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
  description?: string;
  gradientColors: string;
  service: ServiceType;
}

const voices: Voice[] = [
  // Indonesian Native Neural Voices (100% Sampling Resmi & Formula Human-Feel)
  {
    id: "athalea",
    name: "Athalea (Sendu & Serak Basah • 1:1 Sample Clone 🕯️)",
    description: "F0 248Hz register dada (-14Hz), tempo -16%, puitis, intim, jeda napas respirasi alami dari sampel asli user",
    gradientColors: "linear-gradient(45deg, #831843, #be185d, #fda4af, #500724)",
    service: "styletts2",
  },
  {
    id: "serena",
    name: "Serena (Heartfelt Indonesian • Lembut & Hangat 🎙️)",
    description: "Voice ID: fpsPI3vlnQ0anCTPiHk5 • Lembut, hangat, penuh penghayatan emosional mendalam narator novel & puisi",
    gradientColors: GRADIENT_COLORS[0]!,
    service: "styletts2",
  },
  {
    id: "alwi",
    name: "Alwi (Horror Baritone & Cinematic Storyteller 🎬)",
    description: "Voice ID: R86jddkroI9bJwXFfjsr • Pitch bariton (-8Hz), tempo misteri (-12%) narasi horor, misteri & creepypasta",
    gradientColors: "linear-gradient(45deg, #1e293b, #475569, #0f172a, #334155)",
    service: "styletts2",
  },
  {
    id: "ongky",
    name: "Ongky Himawan (Calm & Deep Baritone 🎙️)",
    description: "Voice ID: 5YVVTVlHuEcIu0JBLbEF • Bariton resonansi dada bawah, tenang, mantap, dan berwibawa",
    gradientColors: "linear-gradient(45deg, #0f172a, #334155, #64748b, #1e293b)",
    service: "styletts2",
  },
  {
    id: "bowo",
    name: "Bowo (Intimidating & Hoarse Vocal Fry ⚡)",
    description: "Voice ID: LxiqOV1uxBCgYTeitAHf • Serak basah berat (creaky vocal fry & hoarse timbre), nada rendah mengintimidasi narasi horor",
    gradientColors: "linear-gradient(45deg, #451a03, #78350f, #b45309, #292524)",
    service: "styletts2",
  },
  {
    id: "nandar",
    name: "Kang Nandar (Smooth, Soothing and Calm 🍃)",
    description: "Voice ID: aK834gEOxQEtviMPgurT • Tutur kata ramah, hangat, dan santai untuk explainer dan dongeng",
    gradientColors: GRADIENT_COLORS[1]!,
    service: "styletts2",
  },
  {
    id: "mangili",
    name: "Mangili (Encouraging & Sleep Story 🌙)",
    description: "Voice ID: xw0L8SaiU5Mv7xqjcraJ • Vokal hipnotik pengantar tidur (sleep story)",
    gradientColors: "linear-gradient(45deg, #1e1b4b, #312e81, #4338ca, #172554)",
    service: "styletts2",
  },
  {
    id: "siti",
    name: "Siti (Indonesian Casual & Jaksel Slang 🌸)",
    description: "Luwes, santai, fasih bahasa gaul, partikel tutur (dong, sih, deh) & gaya tongkrongan",
    gradientColors: GRADIENT_COLORS[2]!,
    service: "styletts2",
  },
  {
    id: "andi",
    name: "Andi / Putra (Indonesian Casual & Creator 🎧)",
    description: "Pemuda santai, energik, luwes gaul untuk konten YouTube, TikTok, dan podcast",
    gradientColors: GRADIENT_COLORS[3]!,
    service: "styletts2",
  },

  // English & Global Neural Voices (Official ElevenLabs Sampling)
  {
    id: "adam",
    name: "Adam (Distinct, Deep and Engaging 🎙️)",
    description: "Voice ID: bfGb7JTLUnZebZRiFYyq • Bariton klasik legendaris ElevenLabs untuk narasi dokumenter sinematik",
    gradientColors: "linear-gradient(45deg, #1e3a8a, #3b82f6, #93c5fd, #172554)",
    service: "styletts2",
  },
  {
    id: "jenna",
    name: "Jenna (Warm, Soft, and Sultry 🌸)",
    description: "Voice ID: qFjcP4hHD9WIdODvuJOJ • Suara wanita intim dengan tekstur desah napas tipis (sultry & breathy)",
    gradientColors: "linear-gradient(45deg, #831843, #db2777, #fbcfe8, #500724)",
    service: "styletts2",
  },
  {
    id: "george",
    name: "George (Official ElevenLabs Warm Storyteller 🕯️)",
    description: "Warm, captivating storyteller — cinematic narration, suspense & mystery",
    gradientColors: "linear-gradient(45deg, #7c2d12, #ea580c, #fed7aa, #431407)",
    service: "styletts2",
  },
  {
    id: "sarah",
    name: "Sarah (Official ElevenLabs Reassuring Narrator ✨)",
    description: "Mature, reassuring, confident female voice for audiobooks & high-tier media",
    gradientColors: "linear-gradient(45deg, #4c1d95, #8b5cf6, #ddd6fe, #2e1065)",
    service: "styletts2",
  },
  {
    id: "bella",
    name: "Bella (Official ElevenLabs Soft & Warm 🌸)",
    description: "Soft, warm, intimate narration — ideal for reflective stories & romantic drama",
    gradientColors: "linear-gradient(45deg, #831843, #db2777, #fbcfe8, #500724)",
    service: "styletts2",
  },
  {
    id: "brian",
    name: "Brian (Official ElevenLabs Deep Baritone 🎙️)",
    description: "Deep, resonant, rich narration — signature cinematic baritone",
    gradientColors: "linear-gradient(45deg, #0f172a, #334155, #64748b, #1e293b)",
    service: "styletts2",
  },
  {
    id: "jessica",
    name: "Jessica (Official ElevenLabs Playful & Warm 🌻)",
    description: "Bright, engaging, friendly voice for dynamic storytelling & podcasts",
    gradientColors: "linear-gradient(45deg, #d97706, #f59e0b, #fef3c7, #b45309)",
    service: "styletts2",
  },
  {
    id: "lily",
    name: "Lily (Official ElevenLabs Velvety Smooth 🌿)",
    description: "Velvety, calm, soothing narration for bedtime stories and documentaries",
    gradientColors: "linear-gradient(45deg, #047857, #10b981, #d1fae5, #065f46)",
    service: "styletts2",
  },

  // English & Cloned Voices
  {
    id: "andreas",
    name: "Andreas (English Deep Narrative)",
    gradientColors: GRADIENT_COLORS[3]!,
    service: "styletts2",
  },
  {
    id: "woman",
    name: "Woman (English Expressive)",
    gradientColors: GRADIENT_COLORS[4]!,
    service: "styletts2",
  },

  // Seed-VC Voice Changer
  {
    id: "gadis",
    name: "Gadis (Indonesian Female Storyteller)",
    gradientColors: GRADIENT_COLORS[0]!,
    service: "seedvc",
  },
  {
    id: "andreas",
    name: "Andreas (Male Timbre)",
    gradientColors: GRADIENT_COLORS[3]!,
    service: "seedvc",
  },
  {
    id: "woman",
    name: "Woman (Female Timbre)",
    gradientColors: GRADIENT_COLORS[4]!,
    service: "seedvc",
  },
  {
    id: "trump",
    name: "Trump (Voice Clone)",
    gradientColors: GRADIENT_COLORS[5]!,
    service: "seedvc",
  },
];

const defaultStyleTTS2Voice =
  voices.find((v) => v.service === "styletts2") ?? null;
const defaultSeedVCVoice = voices.find((v) => v.service === "seedvc") ?? null;

interface VoiceState {
  voices: Voice[];
  selectedVoices: Record<ServiceType, Voice | null>;
  getVoices: (service: ServiceType) => Voice[];
  getSelectedVoice: (service: ServiceType) => Voice | null;
  selectVoice: (service: ServiceType, voice: string) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voices: voices,
  selectedVoices: {
    styletts2: defaultStyleTTS2Voice,
    seedvc: defaultSeedVCVoice,
    "make-an-audio": null,
  },
  getVoices: (service) => {
    return get().voices.filter((voice) => voice.service === service);
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
