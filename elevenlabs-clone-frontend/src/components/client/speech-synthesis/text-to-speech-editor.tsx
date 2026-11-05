"use client";

import { useEffect, useRef, useState } from "react";
import {
  IoBookOutline,
  IoFilmOutline,
  IoGameControllerOutline,
  IoHappyOutline,
  IoLanguageOutline,
  IoLeafOutline,
  IoMegaphoneOutline,
  IoMicOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { ServiceType } from "~/types/services";
import { GenerateButton } from "../generate-button";
import { generateTextToSpeech } from "~/actions/generate-speech";
import { useVoiceStore } from "~/stores/voice-store";
import { useAudioStore } from "~/stores/audio-store";
import toast from "react-hot-toast";

export function TextToSpeechEditor({
  service,
  credits,
}: {
  service: ServiceType;
  credits: number;
}) {
  const [textContent, setTextContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);
  const selectedLanguage = useVoiceStore((state) => state.selectedLanguage);
  const { playAudio } = useAudioStore();

  const templateTexts = {
    id: [
      {
        title: "Cerita Misteri",
        icon: <IoBookOutline />,
        text: "Di sebuah malam yang dingin di tengah hutan pinus yang sunyi, langkah kaki itu terdengar semakin dekat. Angin berbisik pelan, membawa hawa dingin yang menusuk tulang. Apa sebenarnya yang sedang mengintai dari balik bayangan kabut?",
      },
      {
        title: "Lelucon Santai",
        icon: <IoHappyOutline />,
        text: "Kenapa ayam kalau berkokok matanya merem? Soalnya dia udah hafal teksnya! Kalau belum hafal, pasti dia berkokok sambil baca contekan di pohon pisang.",
      },
      {
        title: "Iklan Produk",
        icon: <IoMegaphoneOutline />,
        text: "Memperkenalkan wiuuulab Studio, platform AI Speech Synthesis terdepan dengan intonasi natural khas Indonesia. Ciptakan sulih suara profesional untuk YouTube, podcast, dan iklan Anda hanya dalam hitungan detik!",
      },
      {
        title: "Drama Sinematik",
        icon: <IoFilmOutline />,
        text: "Hujan deras mengguyur kaca jendela. 'Aku tidak pernah menyangka semuanya akan berakhir seperti ini,' bisiknya dengan napas tertahan. Tepat saat itu, pintu tua berderit terbuka perlahan...",
      },
      {
        title: "Karakter Game",
        icon: <IoGameControllerOutline />,
        text: "Prajurit, bersiaplah! Gerbang kegelapan telah terbuka dan kekuatan kuno mulai bangkit di lembah utara. Pegang senjatamu erat-erat, takdir dunia ada di tangan kita malam ini!",
      },
      {
        title: "Intro Podcast",
        icon: <IoMicOutline />,
        text: "Halo semua, selamat datang di Cerita Tengah Malam. Bersama gue Alwi, malam ini kita bakal ngebahas kisah-kisah tak terpecahkan yang bikin merinding dari seluruh nusantara.",
      },
      {
        title: "Relaksasi Pikiran",
        icon: <IoLeafOutline />,
        text: "Tarik napas perlahan melalui hidung Anda... rasakan ketenangan mengisi setiap sudut pikiran. Hembuskan perlahan lewat mulut... lepaskan semua beban hari ini. Rasakan tubuh Anda menjadi lebih rileks dan damai.",
      },
    ],
    en: [
      {
        title: "Narrate a Story",
        icon: <IoBookOutline />,
        text: "In the quiet heart of the ancient forest, deep shadows danced between towering pines. A gentle breeze whispered long-forgotten secrets, while the silver moonlight illuminated the winding path ahead.",
      },
      {
        title: "Silly Joke",
        icon: <IoHappyOutline />,
        text: "Why don't scientists trust atoms? Because they make up everything! And every time they try to explain gravity, they just bring everyone down.",
      },
      {
        title: "Product Commercial",
        icon: <IoMegaphoneOutline />,
        text: "Introducing wiuuulab Studio, the next-generation neural speech synthesis engine. Experience ultra-realistic voiceovers for creators, developers, and global storytellers in seconds.",
      },
      {
        title: "Cinematic Drama",
        icon: <IoFilmOutline />,
        text: "Rain lashed against the misted window. 'I never imagined we'd reach this crossroad,' she murmured with trembling breath. At that exact moment, the heavy oak door creaked open...",
      },
      {
        title: "Video Game Hero",
        icon: <IoGameControllerOutline />,
        text: "Warriors of the realm, stand firm! The northern gates have breached and the ancient dragon stirs beneath the citadel. Draw your blades and defend the throne!",
      },
      {
        title: "Podcast Intro",
        icon: <IoMicOutline />,
        text: "Welcome to The Midnight Frequency, where we explore unsolved mysteries, deep tech, and the enigmatic frontiers of digital audio. I am your host, and tonight we plunge into the unknown.",
      },
      {
        title: "Mindful Meditation",
        icon: <IoLeafOutline />,
        text: "Take a slow, deep breath in through your nose... letting pure stillness fill your chest. Exhale gently... releasing every tension from today. Feel your mind sinking into total calm.",
      },
    ],
  };

  const currentTemplates =
    selectedLanguage === "id" ? templateTexts.id : templateTexts.en;

  const defaultPlaceholder =
    selectedLanguage === "id"
      ? "Ketik atau tempel teks bahasa Indonesia di sini untuk diubah menjadi suara natural berjiwa..."
      : "Start typing or paste English text here to turn into lifelike neural speech...";

  const [activePlaceholder, setActivePlaceholder] = useState(defaultPlaceholder);

  useEffect(() => {
    setActivePlaceholder(defaultPlaceholder);
  }, [selectedLanguage, defaultPlaceholder]);

  const handleButtonClick = (text: string) => {
    setTextContent(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleGenerateSpeech = async () => {
    const selectedVoice = getSelectedVoice("styletts2");
    const voiceId = selectedVoice?.id || (selectedLanguage === "id" ? "athalea" : "adam");

    if (textContent.trim().length === 0) {
      toast.error(
        selectedLanguage === "id"
          ? "Silakan masukkan teks terlebih dahulu."
          : "Please enter text before generating speech."
      );
      return;
    }

    try {
      setLoading(true);
      const result = await generateTextToSpeech(textContent, voiceId, {
        language: selectedLanguage,
        stability: 0.5,
        speed: 1.0,
      });

      if (result.success && result.audioUrl) {
        const newAudio = {
          id: result.audioId,
          title:
            textContent.substring(0, 50) +
            (textContent.length > 50 ? "..." : ""),
          audioUrl: result.audioUrl,
          voice: voiceId,
          duration: result.duration || "0:15",
          progress: 0,
          service: service,
          createdAt: new Date().toLocaleDateString(),
        };

        playAudio(newAudio);
        toast.success(
          selectedLanguage === "id"
            ? "Suara berhasil digenerate!"
            : "Speech generated successfully!"
        );
      } else {
        toast.error(
          result.error ||
            (selectedLanguage === "id"
              ? "Gagal mengenerate suara. Silakan coba lagi."
              : "Failed to generate speech. Please try again.")
        );
      }
    } catch (error) {
      console.error("Error generating speech: ", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengenerate suara"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-blue-100/90 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(59,130,246,0.06)] overflow-hidden">
      {/* Main Textarea Area */}
      <div className="flex flex-grow flex-col p-4 sm:p-6 overflow-hidden">
        {/* Language Badge Indicator */}
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/60 text-xs font-semibold text-blue-700">
            <span>{selectedLanguage === "id" ? "🇮🇩" : "🇺🇸"}</span>
            <span>
              Mode Bahasa:{" "}
              {selectedLanguage === "id" ? "Bahasa Indonesia (Utama)" : "English"}
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {textContent.length} karakter
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder={activePlaceholder}
          disabled={loading}
          rows={8}
          className="w-full flex-grow resize-none bg-transparent p-2 text-base text-slate-800 placeholder:font-light placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 rounded-xl leading-relaxed"
        />

        {/* Suggestion Template Pills (Visible when empty) */}
        {textContent.length === 0 && (
          <div className="mt-4 px-2">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <IoSparklesOutline className="text-blue-500" />
              <span>
                {selectedLanguage === "id"
                  ? "Coba teks inspirasi cepat:"
                  : "Quick inspiration prompts:"}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              {currentTemplates.map(({ title, icon, text }) => (
                <button
                  key={title}
                  type="button"
                  className="flex items-center rounded-xl border border-blue-100/80 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-800 active:scale-95"
                  onMouseEnter={() => setActivePlaceholder(text)}
                  onMouseLeave={() => setActivePlaceholder(defaultPlaceholder)}
                  onClick={() => handleButtonClick(text)}
                >
                  <span className="mr-1.5 text-blue-600 text-sm">{icon}</span>
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Always Visible Action Controls */}
      <div className="border-t border-blue-50 bg-white/95 backdrop-blur-md p-4 sm:px-6">
        <GenerateButton
          onGenerate={handleGenerateSpeech}
          isDisabled={
            textContent.length > 5000 ||
            textContent.trim().length === 0 ||
            loading
          }
          isLoading={loading}
          showDownload={true}
          creditsRemaining={credits}
          showCredits={true}
          characterCount={textContent.length}
          characterLimit={5000}
          buttonText={
            selectedLanguage === "id"
              ? "Generate Suara Natural"
              : "Generate Neural Speech"
          }
        />
      </div>
    </div>
  );
}
