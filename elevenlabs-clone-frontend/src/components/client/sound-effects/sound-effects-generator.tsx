"use client";

import { useEffect, useState } from "react";
import { useAudioStore } from "~/stores/audio-store";
import { GenerateButton } from "../generate-button";
import { BiDoorOpen } from "react-icons/bi";
import {
  IoCarSportOutline,
  IoThunderstormOutline,
  IoLeafOutline,
  IoPeopleOutline,
  IoWaterOutline,
  IoHardwareChipOutline,
  IoAirplaneOutline,
} from "react-icons/io5";
import {
  generateSoundEffect,
  generationStatus,
} from "~/actions/generate-speech";
import toast from "react-hot-toast";

const MAX_CHARS = 500;

export function SoundEffectsGenerator({ credits }: { credits: number }) {
  const [textContent, setTextContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState(
    "Deskripsikan efek suara yang ingin Anda ciptakan...",
  );
  const [loading, setLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const { playAudio } = useAudioStore();

  const isTextEmpty = textContent.trim() === "";

  const handleGenerateSoundEffect = async () => {
    if (isTextEmpty) return;

    try {
      setLoading(true);
      const result = await generateSoundEffect(textContent);
      if (result.success && result.audioUrl) {
        const newAudio = {
          id: result.audioId,
          title:
            textContent.substring(0, 50) +
            (textContent.length > 50 ? "..." : ""),
          audioUrl: result.audioUrl,
          voice: "sound-fx",
          duration: result.duration || "0:10",
          progress: 0,
          service: "make-an-audio",
          createdAt: new Date().toLocaleDateString(),
        };

        playAudio(newAudio);
        toast.success("Sound effect berhasil digenerate!");
      } else {
        toast.error(result.error || "Gagal generate sound effect.");
      }
    } catch (error) {
      console.error("Error generating sound effect: ", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal generate sound effect",
      );
    } finally {
      setLoading(false);
    }
  };

  const templateTexts = {
    "Car engine revving":
      "A powerful sports car engine revving up, starting low and building to a high-pitched roar with the sound of turbocharger spooling",
    "Heavy rainstorm":
      "Heavy rain pouring down with occasional thunder in the background, rain hitting windows and roof",
    "Forest ambience":
      "Peaceful forest sounds with birds chirping, leaves rustling in the wind, and a small stream flowing nearby",
    "Stadium crowd cheering":
      "A large stadium crowd erupting in cheers and applause after a goal or touchdown, with whistles and horns",
    "Ocean waves":
      "Ocean waves crashing against a rocky shore, with the rhythmic sound of water rushing in and receding",
    "Robot sounds":
      "Futuristic robot powering up with mechanical servo sounds, beeps, and electronic processing noises",
    "Creaky door":
      "Old wooden door slowly opening with an eerie creak, hinges squeaking in a haunted house",
    "Helicopter flyby":
      "Helicopter approaching from a distance, passing overhead with loud rotor blades, then flying away",
  };

  useEffect(() => {
    if (!currentAudioId || !loading) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await generationStatus(currentAudioId);

        if (status.success && status.audioUrl) {
          clearInterval(pollInterval);
          setLoading(false);

          const newAudio = {
            id: currentAudioId,
            title:
              textContent.substring(0, 50) +
              (textContent.length > 50 ? "..." : ""),
            audioUrl: status.audioUrl,
            voice: "",
            duration: "0:30",
            progress: 0,
            service: "make-an-audio",
            createdAt: new Date().toLocaleDateString(),
          };

          playAudio(newAudio);
          setCurrentAudioId(null);
        } else if (!status.success) {
          clearInterval(pollInterval);
          setLoading(false);
          setCurrentAudioId(null);
          console.error("Sound effect generation failed");
        }
      } catch (error) {
        console.error("Error polling for audio status: " + error);
        clearInterval(pollInterval);
        setLoading(false);
        setCurrentAudioId(null);
      }
    }, 500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [currentAudioId, loading, playAudio, textContent]);

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="relative z-10 flex h-full w-full flex-col items-center gap-6 md:pt-10 max-w-3xl">
        {/* Main Generator Card */}
        <div
          className={`w-full rounded-3xl liquid-glass p-6 shadow-sm border transition-all duration-200 ${
            isFocused ? "border-sky-400/80 ring-4 ring-sky-500/10" : "border-slate-200/80"
          }`}
        >
          <div className="flex flex-col">
            <textarea
              value={textContent}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= MAX_CHARS) {
                  setTextContent(text);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={MAX_CHARS}
              placeholder={activePlaceholder}
              className="h-20 resize-none bg-transparent p-2 text-sm text-slate-800 placeholder:font-light placeholder:text-slate-400 focus:border-none focus:outline-none focus:ring-0 leading-relaxed"
            />
            <div className="mt-1 flex w-full justify-end">
              <span className="text-[11px] font-mono text-slate-400">
                {textContent.length}/{MAX_CHARS}
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <GenerateButton
                onGenerate={handleGenerateSoundEffect}
                isDisabled={isTextEmpty || loading}
                isLoading={loading}
                buttonText="Generate Sound Effect"
                showDownload={false}
                creditsRemaining={credits}
                fullWidth={false}
              />
            </div>
          </div>
        </div>

        {/* Quick Example Templates Card */}
        <div className="w-full rounded-3xl liquid-glass-subtle p-6 shadow-sm border border-slate-200/80">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Contoh Efek Suara Cepat:
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { text: "Car engine revving", icon: <IoCarSportOutline /> },
              { text: "Heavy rainstorm", icon: <IoThunderstormOutline /> },
              { text: "Forest ambience", icon: <IoLeafOutline /> },
              { text: "Stadium crowd cheering", icon: <IoPeopleOutline /> },
              { text: "Ocean waves", icon: <IoWaterOutline /> },
              { text: "Robot sounds", icon: <IoHardwareChipOutline /> },
              { text: "Creaky door", icon: <BiDoorOpen /> },
              { text: "Helicopter flyby", icon: <IoAirplaneOutline /> },
            ].map(({ text, icon }) => (
              <button
                className="flex items-center rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-xs transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-800"
                key={text}
                onMouseEnter={() =>
                  setActivePlaceholder(
                    templateTexts[text as keyof typeof templateTexts],
                  )
                }
                onMouseLeave={() =>
                  setActivePlaceholder(
                    "Deskripsikan efek suara yang ingin Anda ciptakan...",
                  )
                }
                onClick={() => {
                  const content =
                    templateTexts[text as keyof typeof templateTexts];
                  if (content.length <= MAX_CHARS) {
                    setTextContent(content);
                  } else {
                    setTextContent(content.substring(0, MAX_CHARS));
                  }
                }}
              >
                <span className="mr-1.5 text-sky-600 text-sm">{icon}</span>
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
