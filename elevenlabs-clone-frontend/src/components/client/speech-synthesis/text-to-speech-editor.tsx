"use client";

import { useRef, useState } from "react";
import {
  IoBookOutline,
  IoFilmOutline,
  IoGameControllerOutline,
  IoHappyOutline,
  IoLanguageOutline,
  IoLeafOutline,
  IoMegaphoneOutline,
  IoMicOutline,
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
  const [activePlaceholder, setActivePlaceholder] = useState(
    "Start typing here or paste any text you want to turn into lifelike speech...",
  );
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);
  const { playAudio } = useAudioStore();

  const templateTexts = {
    "Narrate a story":
      "Di sebuah malam yang gelap gulita di tengah hutan pinus yang sunyi, langkah kaki misterius itu terdengar semakin dekat. Angin berbisik pelan, membawa hawa dingin yang menusuk tulang. Apa sebenarnya yang sedang mengintai dari balik bayangan kabut?",
    "Tell a silly joke":
      "Kenapa ayam kalau berkokok matanya merem? Soalnya dia udah hafal teksnya! Kalau belum hafal, pasti dia berkokok sambil baca contekan di pohon pisang.",
    "Record an advertisement":
      "Memperkenalkan wiuuulab Studio, platform AI Speech Synthesis terdepan dengan intonasi natural khas Indonesia. Ciptakan sulih suara profesional untuk YouTube, podcast, dan iklan Anda hanya dalam hitungan detik!",
    "Speak in different languages":
      "Halo! Selamat datang di wiuuulab. Hello! Welcome to wiuuulab. We support multilingual natural voiceovers with authentic Indonesian accents and global languages seamlessly.",
    "Direct a dramatic movie scene":
      "Hujan deras mengguyur kaca jendela. 'Aku tidak pernah menyangka semuanya akan berakhir seperti ini,' bisiknya dengan napas tertahan. Tepat saat itu, pintu tua berderit terbuka perlahan...",
    "Hear from a video game character":
      "Prajurit, bersiaplah! Gerbang kegelapan telah terbuka dan kekuatan kuno mulai bangkit di lembah utara. Pegang senjatamu erat-erat, takdir dunia ada di tangan kita malam ini!",
    "Introduce your podcast":
      "Halo semua, selamat datang di Cerita Tengah Malam. Bersama gue Alwi, malam ini kita bakal ngebahas kisah-kisah tak terpecahkan yang bikin merinding dari seluruh nusantara.",
    "Guide a meditation class":
      "Tarik napas perlahan melalui hidung Anda... rasakan ketenangan mengisi setiap sudut pikiran. Hembuskan perlahan lewat mulut... lepaskan semua beban hari ini. Rasakan tubuh Anda menjadi lebih rileks dan damai.",
  };

  const handleButtonHover = (text: string) => {
    setActivePlaceholder(templateTexts[text as keyof typeof templateTexts]);
  };

  const handleButtonClick = (text: string) => {
    const textToInsert = templateTexts[text as keyof typeof templateTexts];
    setTextContent(textToInsert);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleGenerateSpeech = async () => {
    const selectedVoice = getSelectedVoice("styletts2");
    const voiceId = selectedVoice?.id || "alwi";

    if (textContent.trim().length === 0) {
      toast.error("Silakan masukkan teks terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      const result = await generateTextToSpeech(textContent, voiceId);

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
        toast.success("Suara berhasil digenerate!");
      }
    } catch (error) {
      console.error("Error generating speech: ", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengenerate suara",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Main Textarea */}
      <div className="flex flex-grow flex-col">
        <textarea
          ref={textareaRef}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder={activePlaceholder}
          disabled={loading}
          rows={8}
          className="w-full flex-grow resize-none rounded-xl bg-white p-4 text-base text-gray-800 placeholder:font-light placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0"
        />

        {/* Suggestion Template Pills (Visible when empty) */}
        {textContent.length === 0 && (
          <div className="my-3 px-2 md:px-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Coba teks template cepat:
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { text: "Narrate a story", icon: <IoBookOutline /> },
                { text: "Tell a silly joke", icon: <IoHappyOutline /> },
                {
                  text: "Record an advertisement",
                  icon: <IoMegaphoneOutline />,
                },
                {
                  text: "Speak in different languages",
                  icon: <IoLanguageOutline />,
                },
                {
                  text: "Direct a dramatic movie scene",
                  icon: <IoFilmOutline />,
                },
                {
                  text: "Hear from a video game character",
                  icon: <IoGameControllerOutline />,
                },
                {
                  text: "Introduce your podcast",
                  icon: <IoMicOutline />,
                },
                {
                  text: "Guide a meditation class",
                  icon: <IoLeafOutline />,
                },
              ].map(({ text, icon }) => (
                <button
                  key={text}
                  type="button"
                  className="flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300"
                  onMouseEnter={() => handleButtonHover(text)}
                  onMouseLeave={() =>
                    setActivePlaceholder(
                      "Start typing here or paste any text you want to turn into lifelike speech...",
                    )
                  }
                  onClick={() => handleButtonClick(text)}
                >
                  <span className="mr-1.5 text-gray-500">{icon}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Always Visible ElevenLabs Controls */}
      <div className="border-t border-gray-100 bg-white p-3 md:p-4">
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
          buttonText="Generate Speech"
        />
      </div>
    </div>
  );
}
