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
  IoShieldCheckmarkOutline,
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900 relative">
      {/* Subtle top ambient gradient background */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-purple-50/70 via-indigo-50/30 to-transparent pointer-events-none -z-10"></div>

      {/* Audio player element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="hidden"
      />

      {/* Clean Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-tight text-gray-950 flex items-center gap-1.5">
              wiuuulab
              <span className="h-2 w-2 rounded-full bg-purple-600"></span>
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
              ElevenLabs v4 Engine
            </span>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link
              href="/app/api-keys"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-950 flex items-center gap-1.5 transition-colors"
            >
              <IoKeyOutline className="text-base text-gray-400" />
              <span className="hidden sm:inline">Developer API</span>
            </Link>

            <Link
              href="/app/sign-in"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-950 px-3 py-1.5 transition-colors"
            >
              Masuk
            </Link>

            <Link
              href="/app/sign-up"
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-purple-500/20 flex items-center gap-1.5"
            >
              <span>Daftar Gratis</span>
              <IoArrowForward className="text-sm" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-12 pb-20 w-full flex flex-col items-center">
        {/* Subtle Hero Badge with Gradient */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 text-xs text-gray-700 mb-6 shadow-sm">
          <IoSparkles className="text-purple-600" />
          <span className="font-semibold text-gray-900">Akses Gratis untuk Akun Terdaftar</span>
          <span className="text-gray-300">•</span>
          <span className="text-purple-700 font-medium">Bebas Microsoft Edge TTS</span>
        </div>

        {/* Hero Title with Subtle Gradient Touch */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-center tracking-tight max-w-4xl leading-[1.15] text-gray-950">
          Suara AI & Sound Effects yang{" "}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Hidup & Penuh Penghayatan
          </span>
        </h1>

        <p className="mt-4 text-center text-gray-600 max-w-2xl text-sm sm:text-base leading-relaxed">
          Kloning suara 1:1 presisi vokal <strong>Athalea (Sendu Puitis)</strong>, <strong>Serena (Heartfelt)</strong>, <strong>Alwi (Sinematik Bariton)</strong>, dan efek suara AI foley terdepan.
        </p>

        {/* Clean Mode Tab Switcher with Subtle Gradient */}
        <div className="mt-8 flex items-center p-1 rounded-2xl bg-gray-100/90 border border-gray-200/80 shadow-inner">
          <button
            onClick={() => setActiveTab("tts")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "tts"
                ? "bg-white text-gray-950 shadow-sm border border-gray-200/60"
                : "text-gray-600 hover:text-gray-950"
            }`}
          >
            <IoMicOutline className={`text-base ${activeTab === "tts" ? "text-purple-600" : ""}`} />
            <span>Suara Karakter (Text to Speech)</span>
          </button>
          <button
            onClick={() => setActiveTab("sfx")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "sfx"
                ? "bg-white text-gray-950 shadow-sm border border-gray-200/60"
                : "text-gray-600 hover:text-gray-950"
            }`}
          >
            <IoMusicalNotesOutline className={`text-base ${activeTab === "sfx" ? "text-purple-600" : ""}`} />
            <span>Efek Suara AI (Sound Effects)</span>
          </button>
        </div>

        {/* Interactive Speech & Sound Synthesis Card (Clean White with Subtle Gradient Border) */}
        <div className="mt-6 w-full max-w-3xl rounded-3xl border border-gray-200/90 bg-white shadow-xl shadow-gray-200/50 p-5 sm:p-7 relative overflow-hidden">
          {/* Subtle gradient accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

          {activeTab === "tts" ? (
            /* TAB 1: TEXT TO SPEECH */
            <>
              {/* Voice Selector Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  Pilih Karakter Suara:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VOICES.map((v) => {
                    const isSelected = selectedVoice === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVoiceSelect(v.id)}
                        className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/50 shadow-sm ring-1 ring-purple-500/30"
                            : "border-gray-200/70 bg-gray-50/50 hover:bg-gray-100/70 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-bold text-sm text-gray-950 flex items-center justify-between">
                          {v.name}
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-1 line-clamp-1">{v.accent}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Contoh Teks:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(p.text);
                      setSelectedVoice(p.voice);
                    }}
                    className="text-xs rounded-full bg-gray-100 hover:bg-gray-200/80 px-3 py-1 text-gray-700 transition-colors"
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
                  placeholder="Tulis kalimat apapun di sini untuk diubah menjadi suara yang hidup..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/40 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 resize-none transition-all"
                />
              </div>
            </>
          ) : (
            /* TAB 2: SOUND EFFECTS GENERATION */
            <>
              {/* SFX Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
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
                        className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/50 shadow-sm ring-1 ring-purple-500/30"
                            : "border-gray-200/70 bg-gray-50/50 hover:bg-gray-100/70 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm text-gray-950 flex items-center justify-between">
                          {s.label}
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-1">{s.duration} detik</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SFX Prompt Input */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Deskripsi Suara (Prompt):
                </label>
                <textarea
                  rows={2}
                  value={sfxPrompt}
                  onChange={(e) => setSfxPrompt(e.target.value)}
                  placeholder="Contoh: heavy thunderstorm rain and loud lightning crash, atau futuristic sci-fi laser blaster..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/40 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 resize-none transition-all"
                />
              </div>

              {/* Duration selector */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-600 font-medium flex items-center gap-1">
                  <IoTimeOutline /> Durasi Efek:
                </span>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 6, 8].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSfxDuration(sec)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        sfxDuration === sec
                          ? "border-purple-600 bg-purple-50 text-purple-700 font-bold"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-950"
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
            <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          )}

          {/* Action Row: Generate & Audio Player */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <IoVolumeHighOutline className="text-base text-purple-600" />
              <span>
                {activeTab === "tts" ? (
                  <>
                    Suara Aktif:{" "}
                    <strong className="text-gray-950">
                      {VOICES.find((v) => v.id === selectedVoice)?.name}
                    </strong>
                  </>
                ) : (
                  <>
                    Efek Suara: <strong className="text-gray-950">{sfxDuration} detik</strong>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {audioUrl && (
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700">
                  <button
                    onClick={togglePlay}
                    className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm"
                    title={isPlaying ? "Jeda" : "Putar"}
                  >
                    {isPlaying ? <IoPause /> : <IoPlay className="ml-0.5" />}
                  </button>
                  <span className="font-mono text-gray-900 font-medium">{duration || "0:04"}</span>
                  <a
                    href={audioUrl}
                    download={activeTab === "tts" ? `wiuuulab_${selectedVoice}.mp3` : `wiuuulab_sfx.mp3`}
                    className="text-gray-400 hover:text-gray-700 ml-1"
                    title="Download MP3"
                  >
                    <IoDownloadOutline className="text-sm" />
                  </a>
                </div>
              )}

              <button
                onClick={activeTab === "tts" ? handleGenerateTTS : handleGenerateSFX}
                disabled={loading || (activeTab === "tts" ? !text.trim() : !sfxPrompt.trim())}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 text-sm font-bold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

        {/* Clean Registration CTA Banner with Soft Gradient (No Hardcoded Admin Passwords!) */}
        <div className="mt-12 w-full max-w-3xl rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-pink-50/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-purple-200/80 text-[11px] font-bold text-purple-700 shadow-xs mb-1">
              <IoShieldCheckmarkOutline className="text-sm" />
              <span>AKSES STUDIO UNTUK PENGGUNA TERDAFTAR</span>
            </div>
            <h3 className="text-lg font-bold text-gray-950">
              Buat Akun Gratis untuk Mengakses Studio Lengkap
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md">
              Daftar gratis dalam 30 detik untuk menikmati fitur Speech Synthesis, Sound Generation, dan API Key tanpa batas kuota.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/app/sign-up"
              className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 transition-all shadow-sm hover:shadow-md hover:shadow-purple-500/25 whitespace-nowrap"
            >
              Daftar Akun Gratis
            </Link>
            <Link
              href="/app/sign-in"
              className="w-full sm:w-auto text-center rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-semibold text-xs px-4 py-3 transition-colors shadow-xs whitespace-nowrap"
            >
              Masuk
            </Link>
          </div>
        </div>

        {/* Clean Features Grid (White Cards with Delicate Borders) */}
        <div className="mt-16 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 space-y-2.5 shadow-sm">
            <div className="h-9 w-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs border border-pink-100">
              1:1
            </div>
            <h3 className="font-bold text-base text-gray-950">Kloning Vokal Athalea</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Presisi F0 248Hz dengan jeda napas intim, serak basah sendu, dan penghayatan puitis persis rekaman audio sample.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 space-y-2.5 shadow-sm">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-100">
              v4
            </div>
            <h3 className="font-bold text-base text-gray-950">Zero Robotic Edge-TTS</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% ditenagai Neural Engine ElevenLabs v4. Artikulasi tanda baca (koma & titik) dibaca natural tanpa desahan noise.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 space-y-2.5 shadow-sm">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
              API
            </div>
            <h3 className="font-bold text-base text-gray-950">Developer API Ready</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Gunakan API Key wiuuulab untuk menghubungkan seluruh katalog vokal dan sound effects ke chatbot AI & platform eksternal.
            </p>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-xs text-gray-500 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 wiuuulab Studio. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/app/speech-synthesis/text-to-speech" className="hover:text-gray-900">
              Studio
            </Link>
            <Link href="/app/api-keys" className="hover:text-gray-900">
              API Documentation
            </Link>
            <Link href="/app/sign-in" className="hover:text-gray-900">
              Masuk
            </Link>
            <Link href="/app/sign-up" className="hover:text-gray-900 font-medium text-purple-600">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
