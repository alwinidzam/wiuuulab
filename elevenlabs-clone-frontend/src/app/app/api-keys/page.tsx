"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IoCopyOutline,
  IoKeyOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCodeSlashOutline,
} from "react-icons/io5";
import { createApiKey, deleteApiKey, getApiKeys } from "~/actions/api-keys";

type ApiKeyItem = {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [keyName, setKeyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<"openai" | "elevenlabs" | "python">("openai");

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
    loadKeys();
  }, []);

  async function loadKeys() {
    try {
      const data = await getApiKeys();
      setKeys(data);
    } catch {
      toast.error("Gagal memuat API keys");
    }
  }

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!keyName.trim()) {
      toast.error("Nama API key harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await createApiKey(keyName);
      setNewlyCreatedKey(res.key);
      setKeyName("");
      toast.success("API Key berhasil dibuat!");
      await loadKeys();
    } catch (err: any) {
      toast.error(err?.message || "Gagal membuat API key");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus API key ini?")) return;

    try {
      await deleteApiKey(id);
      toast.success("API key dihapus");
      await loadKeys();
    } catch {
      toast.error("Gagal menghapus API key");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    toast.success("Disalin ke clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  }

  function maskKey(key: string) {
    if (key.length <= 15) return key;
    return `${key.slice(0, 10)}••••••••••••${key.slice(-4)}`;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow">
              <IoKeyOutline className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Developer API Keys
              </h1>
              <p className="text-sm text-gray-500">
                Hubungkan studio suara ElevenLabs Anda ke aplikasi AI lain (OpenWebUI, SillyTavern, LangChain, Discord Bot, dll.)
              </p>
            </div>
          </div>
        </div>

        {/* Modal / Banner for newly created key */}
        {newlyCreatedKey && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-green-800">
                  Simpan API Key Anda Sekarang!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Kunci ini hanya ditampilkan sekali demi keamanan. Salin dan simpan di tempat yang aman.
                </p>
              </div>
              <button
                onClick={() => setNewlyCreatedKey(null)}
                className="text-xs font-medium text-green-600 hover:text-green-800"
              >
                Tutup
              </button>
            </div>

            <div className="mt-3 flex items-center space-x-2">
              <code className="flex-1 overflow-x-auto rounded-lg border border-green-300 bg-white px-3 py-2 font-mono text-sm font-bold text-gray-800">
                {newlyCreatedKey}
              </code>
              <button
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="flex items-center space-x-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                {copiedKey ? <IoCheckmarkOutline /> : <IoCopyOutline />}
                <span>{copiedKey ? "Disalin!" : "Salin"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Create Key Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Buat API Key Baru
          </h2>
          <form onSubmit={handleCreateKey} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Nama Kunci (contoh: OpenWebUI, Bot Discord, Script Python)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Membuat..." : "Generate Key"}
            </button>
          </form>
        </div>

        {/* Key List Card */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Daftar API Key Aktif</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {keys.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Belum ada API key. Klik "Generate Key" di atas untuk membuat.
              </div>
            ) : (
              keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">{k.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <code className="font-mono text-gray-600">{maskKey(k.key)}</code>
                      <span>• Dibuat: {new Date(k.createdAt).toLocaleDateString()}</span>
                      {k.lastUsed && (
                        <span>• Terakhir dipakai: {new Date(k.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(k.key)}
                      title="Salin Key"
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <IoCopyOutline className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteKey(k.id)}
                      title="Hapus Key"
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <IoTrashOutline className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Voice Catalog Card */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Katalog Suara & Voice ID Lengkap
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Gunakan alias nama suara atau ID ElevenLabs asli di parameter <code>voice</code> / URL endpoint API.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              100% ElevenLabs v4 Neural
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Nama Karakter</th>
                  <th className="px-6 py-3">Bahasa & Gaya</th>
                  <th className="px-6 py-3">Alias Voice ID</th>
                  <th className="px-6 py-3">ElevenLabs Voice ID</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  {
                    name: "Athalea 🕯️",
                    desc: "Puitis, intim, monolog senja (1:1 Clone)",
                    lang: "Indonesian",
                    alias: "athalea",
                    elevenId: "44refPigMdH30vLdnBkE",
                    badge: "1:1 Matched",
                  },
                  {
                    name: "Serena 🎙️",
                    desc: "Heartfelt, lembut, penuh penghayatan novel",
                    lang: "Indonesian",
                    alias: "serena",
                    elevenId: "fpsPI3vlnQ0anCTPiHk5",
                    badge: "Ground Truth",
                  },
                  {
                    name: "Alwi 🎬",
                    desc: "Bariton berat, tenang, horor & creepypasta",
                    lang: "Indonesian",
                    alias: "alwi",
                    elevenId: "R86jddkroI9bJwXFfjsr",
                    badge: "Cinematic",
                  },
                  {
                    name: "Adam 🎙️",
                    desc: "Signature ElevenLabs baritone, authoritative",
                    lang: "English (US)",
                    alias: "adam",
                    elevenId: "pNInz6obpgDQGcFmaJgB",
                    badge: "Official",
                  },
                  {
                    name: "Brian 🎙️",
                    desc: "Deep, resonant, rich cinematic baritone",
                    lang: "English (US)",
                    alias: "brian",
                    elevenId: "nPczCjzI2devNBz1zQrb",
                    badge: "Official",
                  },
                  {
                    name: "George 🕯️",
                    desc: "Warm British storyteller, captivating narration",
                    lang: "English (UK)",
                    alias: "george",
                    elevenId: "JBFqnCBsd6RMkjVDRZzb",
                    badge: "Official",
                  },
                  {
                    name: "Sarah ✨",
                    desc: "Mature, reassuring, audiobook narrator",
                    lang: "English (US)",
                    alias: "sarah",
                    elevenId: "EXAVITQu4vr4xnSDxMaL",
                    badge: "Official",
                  },
                  {
                    name: "Bella 🌸",
                    desc: "Soft, warm, intimate reflective stories",
                    lang: "English (US)",
                    alias: "bella",
                    elevenId: "hpp4J3VqNfWAUOO0d1Us",
                    badge: "Official",
                  },
                  {
                    name: "Jessica 🌻",
                    desc: "Bright, engaging, friendly storytelling",
                    lang: "English (US)",
                    alias: "jessica",
                    elevenId: "cgSgspJ2msm6clMCkdW9",
                    badge: "Official",
                  },
                  {
                    name: "Lily 🌿",
                    desc: "Velvety smooth, calm documentary narration",
                    lang: "English (UK)",
                    alias: "lily",
                    elevenId: "pFZP5JQG7iQjIQuC4Bku",
                    badge: "Official",
                  },
                ].map((v) => (
                  <tr key={v.alias} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                      {v.name}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      <div><span className="font-semibold text-gray-700">{v.lang}</span> • {v.desc}</div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-800">
                      <span className="rounded bg-gray-100 px-2 py-1 font-semibold">{v.alias}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                      <span className="truncate block max-w-[130px]">{v.elevenId}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => copyToClipboard(v.alias)}
                        className="rounded-lg bg-gray-100 hover:bg-black hover:text-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors mr-1"
                        title="Salin Alias"
                      >
                        Salin Alias
                      </button>
                      <button
                        onClick={() => copyToClipboard(v.elevenId)}
                        className="rounded-lg border border-gray-200 hover:border-black px-2 py-1 text-xs font-mono text-gray-500 hover:text-black transition-colors"
                        title="Salin Raw ID"
                      >
                        Salin ID
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Guides Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <IoCodeSlashOutline className="h-5 w-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Cara Tautkan ke Aplikasi AI Lain
            </h2>
          </div>

          <div className="mt-4 flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("openai")}
              className={`border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === "openai"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              OpenAI Format (OpenWebUI / Dify)
            </button>
            <button
              onClick={() => setActiveTab("elevenlabs")}
              className={`border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === "elevenlabs"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ElevenLabs Format (SDK / cURL)
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === "python"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Python Script
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "openai" && (
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Gunakan format ini di <strong>OpenWebUI</strong>, <strong>LibreChat</strong>, <strong>NextChat</strong>, atau aplikasi berbasis OpenAI Audio:
                </p>
                <div className="rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-100">
                  <p className="text-gray-400"># Setting di OpenWebUI / App AI:</p>
                  <p><strong>TTS Engine:</strong> OpenAI</p>
                  <p><strong>API Base URL:</strong> {baseUrl || "https://wiuuulab.vercel.app"}/api/v1</p>
                  <p><strong>API Key:</strong> sk_live_xxxxxxxxxxxxxxxxxxxxxxxx</p>
                  <p><strong>Voice:</strong> athalea (atau serena, alwi, adam, brian)</p>
                </div>
              </div>
            )}

            {activeTab === "elevenlabs" && (
              <div className="space-y-3 text-sm text-gray-600">
                <p>Format request langsung endpoint mirip ElevenLabs (bisa pakai alias nama suara atau Voice ID asli):</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-100">
{`# 1. Menggunakan Alias Suara (athalea)
curl -X POST "${baseUrl || "https://wiuuulab.vercel.app"}/api/v1/text-to-speech/athalea" \\
  -H "xi-api-key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Mari berkelana tanpa rencana, menikmati senja bersama wiuuulab."}' \\
  --output voice_athalea.mp3

# 2. Menggunakan Raw ElevenLabs Voice ID (Serena: fpsPI3vlnQ0anCTPiHk5)
curl -X POST "${baseUrl || "https://wiuuulab.vercel.app"}/api/v1/text-to-speech/fpsPI3vlnQ0anCTPiHk5" \\
  -H "xi-api-key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Halo, ini Serena dengan penghayatan emosional mendalam."}' \\
  --output voice_serena.mp3`}
                </pre>
              </div>
            )}

            {activeTab === "python" && (
              <div className="space-y-3 text-sm text-gray-600">
                <p>Gunakan pustaka resmi <code>openai</code> di Python:</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-100">
{`from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl || "https://wiuuulab.vercel.app"}/api/v1",
    api_key="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
)

# Sintesis suara Athalea (1:1 Sample Clone)
response = client.audio.speech.create(
    model="eleven_v4_exp",
    voice="athalea", # atau "serena", "alwi", "adam", "brian"
    input="Mari berkelana tanpa rencana, menikmati heningnya malam bersama suara ini."
)

response.stream_to_file("output_athalea.mp3")
print("Suara Athalea berhasil disimpan ke output_athalea.mp3")`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
