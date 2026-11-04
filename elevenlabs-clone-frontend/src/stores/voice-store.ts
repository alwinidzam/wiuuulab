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
  // Indonesian Native Neural Voices (100% Logat, Dialek, Slang, Formal, Kasual & Storytelling)
  {
    id: "alwi",
    name: "Alwi (Cinematic Horror Narrator 🎙️)",
    description: "Medium-low bariton, hangat, sedikit husky, tempo tenang — narasi horor, misteri & creepypasta",
    gradientColors: "linear-gradient(45deg, #1e293b, #475569, #0f172a, #334155)",
    service: "styletts2",
  },
  {
    id: "athalea",
    name: "Athalea (Puitis & Intim • 1:1 Clone 🕯️)",
    description: "Puitis, lembut, intim, jeda napas alami (1:1 Acoustic Clone) — monolog senja, kisah cinta, misteri & narasi puitis",
    gradientColors: "linear-gradient(45deg, #831843, #be185d, #fda4af, #500724)",
    service: "styletts2",
  },
  {
    id: "gadis",
    name: "Gadis / Naya (Indonesian Storyteller 📖)",
    description: "Hangat, empatik, jeda dramatis — sangat cocok untuk dongeng, novel, dan creepypasta",
    gradientColors: GRADIENT_COLORS[0]!,
    service: "styletts2",
  },
  {
    id: "serena",
    name: "Serena (Indonesian Heartfelt & Audiobooks 🎙️)",
    description: "Lembut, menenangkan, penuh emosi mendalam untuk narasi reflektif dan puisi",
    gradientColors: GRADIENT_COLORS[1]!,
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
  {
    id: "mahaputra",
    name: "Mahaputra (Indonesian Formal & News Anchor 📰)",
    description: "Artikulasi baku EYD, tegas, berwibawa — sempurna untuk berita resmi & presentasi korporat",
    gradientColors: GRADIENT_COLORS[4]!,
    service: "styletts2",
  },
  {
    id: "ujang",
    name: "Ujang (Indonesian Javanese Accent / Medok 🌿)",
    description: "Logat Jawa autentik yang halus, ramah, dan menenangkan untuk konten daerah",
    gradientColors: GRADIENT_COLORS[5]!,
    service: "styletts2",
  },
  {
    id: "ardi",
    name: "Ardi (Indonesian Narrator & Documentary 🎬)",
    description: "Bariton dalam, sinematik, cocok untuk dokumenter sains dan podcast",
    gradientColors: GRADIENT_COLORS[5]!,
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
