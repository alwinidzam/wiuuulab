"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUpload } from "react-icons/fa";
import {
  generateSpeechToSpeech,
  generationStatus,
} from "~/actions/generate-speech";
import { GenerateButton } from "~/components/client/generate-button";
import { useAudioStore } from "~/stores/audio-store";
import { useVoiceStore } from "~/stores/voice-store";
import { ServiceType } from "~/types/services";

const ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/wav"];

export function VoiceChanger({
  credits,
  service,
}: {
  credits: number;
  service: ServiceType;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const { playAudio } = useAudioStore();
  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);

  const handleFileSelect = (selectedFile: File) => {
    const isAllowedAudio = ALLOWED_AUDIO_TYPES.includes(selectedFile.type);
    const isUnder50MB = selectedFile.size <= 50 * 1024 * 1024;

    if (isAllowedAudio && isUnder50MB) {
      setFile(selectedFile);
    } else {
      alert(
        isAllowedAudio
          ? "Ukuran file terlalu besar. Maksimal 50MB."
          : "Hanya mendukung file audio MP3 atau WAV.",
      );
    }
  };

  const handleGenerateSpeech = async () => {
    const selectedVoice = getSelectedVoice("seedvc");

    if (!file || !selectedVoice) return;

    try {
      setIsLoading(true);
      const result = await generateSpeechToSpeech("local-upload", selectedVoice.id);
      if (result.success && result.audioUrl) {
        const newAudio = {
          id: result.audioId,
          title: "Voice Conversion (" + selectedVoice.name + ")",
          audioUrl: result.audioUrl,
          voice: selectedVoice.id,
          duration: result.duration || "0:15",
          progress: 0,
          service: service,
          createdAt: new Date().toLocaleDateString(),
        };

        playAudio(newAudio);
        toast.success("Konversi suara berhasil!");
      } else {
        toast.error(result.error || "Gagal konversi suara.");
      }
    } catch (error) {
      console.error("Error generating speech: ", error);
      toast.error(error instanceof Error ? error.message : "Gagal konversi suara");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentAudioId || !isLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await generationStatus(currentAudioId);

        const selectedVoice = getSelectedVoice("seedvc");

        if (status.success && status.audioUrl && selectedVoice) {
          clearInterval(pollInterval);
          setIsLoading(false);

          const newAudio = {
            id: currentAudioId,
            title: file?.name || "Voice changed audio",
            audioUrl: status.audioUrl,
            voice: selectedVoice.id,
            duration: "0:30",
            progress: 0,
            service: service,
            createdAt: new Date().toLocaleDateString(),
          };

          playAudio(newAudio);
          setCurrentAudioId(null);
          setFile(null);
        } else if (!status.success) {
          clearInterval(pollInterval);
          setIsLoading(false);
          setCurrentAudioId(null);
          console.error("Voice changing failed");
        }
      } catch (error) {
        console.error("Error polling for audio status: " + error);
        clearInterval(pollInterval);
        setIsLoading(false);
        setCurrentAudioId(null);
      }
    }, 500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [currentAudioId, isLoading, getSelectedVoice, playAudio, file, service]);

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-sm overflow-hidden p-6 sm:p-8">
      <div className="flex flex-1 items-center justify-center py-6">
        <div
          className={`w-full max-w-xl rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? "border-sky-400 bg-sky-50/80"
              : "border-slate-300/80 hover:border-sky-300 hover:bg-sky-50/30"
          } ${file ? "bg-white shadow-sm border-sky-200" : "bg-white/60"}`}
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) {
                handleFileSelect(droppedFile);
              }
            }
          }}
          onClick={() => {
            if (isLoading) return;

            const input = document.createElement("input");
            input.type = "file";
            input.accept = "audio/mp3,audio/wav";
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                const selected = target.files[0];
                if (selected) {
                  handleFileSelect(selected);
                }
              }
            };
            input.click();
          }}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-xs">
                <FaUpload className="h-5 w-5" />
              </div>
              <p className="mb-1 text-sm font-bold text-slate-800">{file.name}</p>
              <p className="mb-2 text-xs font-mono text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLoading) {
                    setFile(null);
                  }
                }}
                disabled={isLoading}
                className={`text-xs font-semibold ${
                  isLoading ? "cursor-not-allowed text-slate-400" : "text-sky-600 hover:text-sky-800"
                }`}
              >
                Ganti file audio
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 shadow-xs">
                <FaUpload className="h-5 w-5" />
              </div>
              <p className="mb-1.5 text-sm font-bold text-slate-800">
                Klik untuk unggah atau seret file audio kemari
              </p>
              <p className="text-xs text-slate-400 font-normal">
                Format audio MP3 atau WAV, ukuran maksimal hingga 50MB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100/90">
        <GenerateButton
          onGenerate={handleGenerateSpeech}
          isDisabled={!file || isLoading}
          isLoading={isLoading}
          showDownload={true}
          creditsRemaining={credits}
          buttonText="Konversi Suara (Voice Changer)"
        />
      </div>
    </div>
  );
}
