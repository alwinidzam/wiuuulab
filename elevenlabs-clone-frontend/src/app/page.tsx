"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  IoPlay,
  IoPause,
  IoSparkles,
  IoArrowForward,
  IoDownloadOutline,
  IoKeyOutline,
  IoVolumeHighOutline,
  IoMicOutline,
  IoMusicalNotesOutline,
  IoTimeOutline,
} from "react-icons/io5";

const VOICES = [
  {
    id: "athalea",
    name: "Athalea 🕯️",
    desc: "Puitis, intim, monolog senja (1:1 Clone)",
    accent: "Indonesian • Lembut & Sendu",
    sampleText:
      "Mari berkelana tanpa rencana. Menikmati setiap detik yang tersisa di bawah langit senja.",
  },
  {
    id: "serena",
    name: "Serena 🎙️",
    desc: "Heartfelt, lembut, penuh penghayatan emosional",
    accent: "Indonesian • Novel & Puisi",
    sampleText:
      "Terkadang yang paling kita butuhkan bukanlah jawaban, melainkan seseorang yang bersedia mendengar dalam diam.",
  },
  {
    id: "alwi",
    name: "Alwi 🎬",
    desc: "Bariton berat, tenang, narasi horor & creepypasta",
    accent: "Indonesian • Sinematik Bariton",
    sampleText:
      "Di tengah heningnya malam, ada langkah kaki yang tak kasat mata bergerak pelan di belakangmu.",
  },
  {
    id: "adam",
    name: "Adam 🎙️",
    desc: "ElevenLabs signature authoritative baritone",
    accent: "English (US) • Deep Narrator",
    sampleText:
      "Welcome to wiuuulab. Experience lifelike generative AI speech with unprecedented vocal nuance.",
  },
  {
    id: "brian",
    name: "Brian 🎙️",
    desc: "Resonant, deep, rich cinematic narration",
    accent: "English (US) • Resonant Baritone",
    sampleText:
      "Every great journey begins with a single whisper, echoing across the boundless horizon.",
  },
  {
    id: "sarah",
    name: "Sarah ✨",
    desc: "Mature, reassuring, confident female narration",
    accent: "English (US) • Reassuring Female",
    sampleText:
      "No matter how turbulent the storm may seem, peace awaits quietly just beneath the surface.",
  },
];

const PRESETS = [
  {
    label: "Puitis Senja",
    text: "Mari berkelana tanpa rencana. Menikmati setiap detik yang tersisa di bawah langit senja.",
    voice: "athalea",
  },
  {
    label: "Heartfelt (Serena)",
    text: "Terkadang yang paling kita butuhkan bukanlah jawaban, melainkan seseorang yang bersedia mendengar dalam diam.",
    voice: "serena",
  },
  {
    label: "Horor Misterius (Alwi)",
    text: "Di tengah heningnya malam, ada langkah kaki yang tak kasat mata bergerak pelan di belakangmu.",
    voice: "alwi",
  },
  {
    label: "Global English (Adam)",
    text: "Experience lifelike generative AI speech with unprecedented vocal nuance and zero latency.",
    voice: "adam",
  },
];

const SFX_PRESETS = [
  {
    label: "⛈️ Hujan Badai Petir",
    prompt: "heavy thunderstorm rain and loud lightning crash",
    duration: 4,
  },
  {
    label: "🏎️ Deru Mobil Sport",
    prompt: "high performance sports car engine revving and accelerating down street",
    duration: 3,
  },
  {
    label: "🔫 Sci-Fi Blaster",
    prompt: "futuristic laser gun blaster fire with energetic plasma pulse",
    duration: 2,
  },
  {
    label: "🚁 Helikopter Rendah",
    prompt: "military helicopter rotor blades flying low overhead",
    duration: 4,
  },
  {
    label: "🛸 UFO Drone",
    prompt: "deep cinematic alien spaceship drone and eerie synthesizer hum",
    duration: 4,
  },
  {
    label: "🐾 Langkah di Kayu",
    prompt: "slow footsteps creaking on old wooden floor in empty house",
    duration: 3,
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"tts" | "sfx">("tts");

  // TTS State
  const [selectedVoice, setSelectedVoice] = useState("athalea");
  const [text, setText] = useState(VOICES[0]!.sampleText);

  // SFX State
  const [sfxPrompt, setSfxPrompt] = useState("heavy thunderstorm rain and loud lightning crash");
  const [sfxDuration, setSfxDuration] = useState(4);

  // Playback & Global State
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVoiceSelect = (vId: string) => {
    setSelectedVoice(vId);
    const v = VOICES.find((item) => item.id === vId);
    if (v) {
      setText(v.sampleText);
    }
  };

  const handleGenerateTTS = async () => {
    if (!text.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/preview-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioUrl) {
        throw new Error(data.error || "Gagal menghasilkan audio");
      }

      setAudioUrl(data.audioUrl);
      setDuration(data.duration);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
      }
    } catch (err: any) {
      setError(err?.message || "Gagal generate audio");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSFX = async () => {
    if (!sfxPrompt.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/preview-sfx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: sfxPrompt,
          duration_seconds: sfxDuration,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioUrl) {
        throw new Error(data.error || "Gagal menghasilkan sound effect");
      }

      setAudioUrl(data.audioUrl);
      setDuration(data.duration);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
      }
    } catch (err: any) {
      setError(err?.message || "Gagal generate sound effect");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-gray-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Audio player element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="hidden"
      />

      {/* Navigation */}
      <nav className="border-b border-gray-800/80 bg-[#0d0f12]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              wiuuulab
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50">
              ElevenLabs v4 Engine
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/app/api-keys"
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <IoKeyOutline className="text-base" />
              <span>Developer API</span>
            </Link>
            <Link
              href="/app/speech-synthesis/text-to-speech"
              className="rounded-full bg-white text-black hover:bg-gray-200 px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow hover:shadow-lg flex items-center gap-1.5"
            >
              <span>Buka Studio</span>
              <IoArrowForward className="text-sm" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-12 pb-20 w-full flex flex-col items-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300 mb-6 shadow-inner">
          <IoSparkles className="text-purple-400" />
          <span className="font-semibold text-white">100% Free & Unlimited Audio Generation</span>
          <span className="text-gray-500">•</span>
          <span className="text-purple-300 font-medium">Bebas Microsoft Edge TTS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-center tracking-tight max-w-4xl leading-[1.15]">
          Suara AI & Sound Effect Paling Hidup,{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
            Penuh Penghayatan
          </span>
        </h1>

        <p className="mt-4 text-center text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Rasakan kedalaman karakter suara <strong>Athalea (1:1 Clone)</strong>, <strong>Serena (Heartfelt)</strong>, <strong>Alwi (Horror Bariton)</strong>, serta <strong>ElevenLabs Neural Sound Effects</strong> secara langsung tanpa login.
        </p>

        {/* Tab Switcher: TTS vs SFX */}
        <div className="mt-8 flex items-center p-1 rounded-xl bg-gray-900 border border-gray-800 shadow-inner">
          <button
            onClick={() => setActiveTab("tts")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "tts"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <IoMicOutline className="text-base" />
            <span>Suara Karakter (Text to Speech)</span>
          </button>
          <button
            onClick={() => setActiveTab("sfx")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "sfx"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <IoMusicalNotesOutline className="text-base" />
            <span>Efek Suara AI (Sound Effects)</span>
          </button>
        </div>

        {/* Interactive Speech Synthesis Playground */}
        <div className="mt-6 w-full max-w-3xl rounded-2xl border border-gray-800 bg-[#14171d] shadow-2xl p-5 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>

          {activeTab === "tts" ? (
            /* TAB 1: TEXT TO SPEECH */
            <>
              {/* Voice Selector Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Pilih Karakter Suara:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VOICES.map((v) => {
                    const isSelected = selectedVoice === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVoiceSelect(v.id)}
                        className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-950/30 shadow-md ring-1 ring-purple-500"
                            : "border-gray-800/80 bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-700"
                        }`}
                      >
                        <span className="font-bold text-sm text-white flex items-center justify-between">
                          {v.name}
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-1 line-clamp-1">{v.accent}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Contoh Teks:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(p.text);
                      setSelectedVoice(p.voice);
                    }}
                    className="text-xs rounded-full bg-gray-800/60 hover:bg-gray-700 px-3 py-1 text-gray-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Text Area Input */}
              <div className="mt-4">
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis kalimat apapun di sini untuk diubah menjadi suara..."
                  className="w-full rounded-xl border border-gray-800 bg-[#0d0f12] p-4 text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none transition-all"
                />
              </div>
            </>
          ) : (
            /* TAB 2: SOUND EFFECTS GENERATION */
            <>
              {/* SFX Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Preset Efek Suara Foley:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SFX_PRESETS.map((s, idx) => {
                    const isSelected = sfxPrompt === s.prompt;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSfxPrompt(s.prompt);
                          setSfxDuration(s.duration);
                        }}
                        className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-950/30 shadow-md ring-1 ring-purple-500"
                            : "border-gray-800/80 bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-700"
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm text-white flex items-center justify-between">
                          {s.label}
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-1">{s.duration} detik</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SFX Prompt Input */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Deskripsi Suara (Prompt):
                </label>
                <textarea
                  rows={2}
                  value={sfxPrompt}
                  onChange={(e) => setSfxPrompt(e.target.value)}
                  placeholder="Contoh: heavy thunderstorm rain and loud lightning crash, atau futuristic sci-fi laser blaster..."
                  className="w-full rounded-xl border border-gray-800 bg-[#0d0f12] p-4 text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none transition-all"
                />
              </div>

              {/* Duration selector */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <IoTimeOutline /> Durasi Efek:
                </span>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 6, 8].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSfxDuration(sec)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        sfxDuration === sec
                          ? "border-purple-500 bg-purple-900/40 text-purple-200 font-bold"
                          : "border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-3 text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-2.5">
              {error}
            </div>
          )}

          {/* Action Row: Generate & Audio Player */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-800/60">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <IoVolumeHighOutline className="text-base text-purple-400" />
              <span>
                {activeTab === "tts" ? (
                  <>
                    Suara:{" "}
                    <strong className="text-white">
                      {VOICES.find((v) => v.id === selectedVoice)?.name}
                    </strong>
                  </>
                ) : (
                  <>
                    Efek: <strong className="text-white">{sfxDuration} detik</strong> (Foley AI)
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {audioUrl && (
                <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5 text-xs text-gray-300">
                  <button
                    onClick={togglePlay}
                    className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 transition-colors"
                    title={isPlaying ? "Jeda" : "Putar"}
                  >
                    {isPlaying ? <IoPause /> : <IoPlay className="ml-0.5" />}
                  </button>
                  <span className="font-mono">{duration || "0:04"}</span>
                  <a
                    href={audioUrl}
                    download={activeTab === "tts" ? `wiuuulab_${selectedVoice}.mp3` : `wiuuulab_sfx.mp3`}
                    className="text-gray-400 hover:text-white ml-1"
                    title="Download MP3"
                  >
                    <IoDownloadOutline className="text-sm" />
                  </a>
                </div>
              )}

              <button
                onClick={activeTab === "tts" ? handleGenerateTTS : handleGenerateSFX}
                disabled={loading || (activeTab === "tts" ? !text.trim() : !sfxPrompt.trim())}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 text-sm font-bold shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Generating Audio...</span>
                  </>
                ) : (
                  <>
                    <IoPlay className="text-sm" />
                    <span>
                      {activeTab === "tts" ? "Generate & Putar Suara" : "Generate Efek Suara"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Studio Access Banner */}
        <div className="mt-10 w-full max-w-3xl rounded-xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Akses Penuh ke Studio Audio
              </p>
            </div>
            <p className="text-sm font-semibold text-white">
              Gunakan Akun Bawaan untuk Masuk ke Studio
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Email: <span className="text-gray-200">admin@wiuuulab.ai</span> • Password:{" "}
              <span className="text-gray-200">wiuuulab_admin_2026!</span>
            </p>
          </div>

          <Link
            href="/app/speech-synthesis/text-to-speech"
            className="w-full sm:w-auto whitespace-nowrap rounded-lg bg-white text-black font-bold text-xs px-5 py-2.5 hover:bg-gray-200 transition-colors shadow text-center"
          >
            ⚡ Masuk ke Studio Lengkap
          </Link>
        </div>

        {/* Features Highlights Grid */}
        <div className="mt-16 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-xl border border-gray-800/80 bg-[#14171d]/60 p-6 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-pink-950/60 text-pink-400 flex items-center justify-center font-bold">
              1:1
            </div>
            <h3 className="font-bold text-base text-white">Kloning Vokal Athalea</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Kalibrasi akustik presisi F0 248Hz dengan jeda napas sendu, intim, dan puitis sesuai sampel asli.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800/80 bg-[#14171d]/60 p-6 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center font-bold">
              v4
            </div>
            <h3 className="font-bold text-base text-white">Zero Robotic Edge-TTS</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              100% ditenagai Neural Transformer ElevenLabs v4. Teks tanda baca (koma & titik) dibaca bersih tanpa desahan aneh.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800/80 bg-[#14171d]/60 p-6 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold">
              API
            </div>
            <h3 className="font-bold text-base text-white">OpenAI & ElevenLabs API</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tautkan seluruh karakter suara ke OpenWebUI, LibreChat, atau bot Python melalui endpoint kompatibel penuh.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-8 px-6 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 wiuuulab Studio. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/app/speech-synthesis/text-to-speech" className="hover:text-gray-300">
              Studio
            </Link>
            <Link href="/app/api-keys" className="hover:text-gray-300">
              API Documentation
            </Link>
            <Link href="/app/sign-in" className="hover:text-gray-300">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
