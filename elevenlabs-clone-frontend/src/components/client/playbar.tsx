"use client";

import { useEffect } from "react";
import {
  IoChevronDown,
  IoDownloadOutline,
  IoPause,
  IoPlay,
  IoTimeOutline,
} from "react-icons/io5";
import { RiForward10Fill, RiReplay10Fill } from "react-icons/ri";
import { useAudioStore } from "~/stores/audio-store";
import { useVoiceStore } from "~/stores/voice-store";
import { audioManager } from "~/utils/audio-manager";

export default function Playbar() {
  const {
    currentAudio,
    isPlaybarOpen,
    isPlaying,
    progress,
    duration,
    togglePlaybar,
    togglePlayPause,
    skipForward,
    skipBackward,
    downloadAudio,
    setIsPlaying,
    setProgress,
    setDuration,
  } = useAudioStore();

  const getVoices = useVoiceStore((state) => state.getVoices);

  useEffect(() => {
    if (!currentAudio) return;

    const audio = audioManager.initialize();
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentProgress = audioManager.getProgress();
      setProgress(currentProgress);
    };

    const handleLoadedMetadata = () => {
      const durationTime = audioManager.getDuration();
      const formattedDuration = formatTime(durationTime);
      setDuration(formattedDuration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentAudio, setDuration, setIsPlaying, setProgress]);

  const styleTTS2Voices = getVoices("styletts2");
  const seedVCVoices = getVoices("seedvc");
  const allVoices = [...styleTTS2Voices, ...seedVCVoices];
  const voice = allVoices.find((v) => v.id === currentAudio?.voice);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentTimeFormatted = () => {
    return formatTime(audioManager.getCurrentTime());
  };

  return (
    <>
      {!isPlaybarOpen && (
        <div
          onClick={togglePlaybar}
          className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 transform cursor-pointer"
        >
          <div className="flex h-1.5 w-96 items-center rounded-full bg-slate-200/80 backdrop-blur-md shadow-xs">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-150"
              style={{ width: `${progress === 0 ? 100 : progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className={`relative border-t border-white/80 liquid-glass shadow-lg z-20`}>
        <div className="absolute left-0 top-0 h-1 w-full bg-sky-100 md:hidden">
          <div
            className="absolute h-1 bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-150"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div
          className="transition-all duration-300 ease-in-out"
          style={{
            height: isPlaybarOpen ? "80px" : "0px",
          }}
        >
          <div className="hidden h-full md:grid md:grid-cols-[28%_44%_28%] items-center">
            {/* Left section */}
            <div className="flex items-center px-6">
              <div className="flex flex-col gap-0.5">
                <p className="max-w-xs truncate text-xs font-bold text-slate-800">
                  {currentAudio?.title}
                </p>
                <div className="flex items-center text-[11px] text-slate-400">
                  {voice && (
                    <>
                      <div className="flex items-center">
                        <div
                          className="mr-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full"
                          style={{ background: voice.gradientColors }}
                        />
                        <span className="font-medium text-slate-600">{voice.name}</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center">
                    <IoTimeOutline className="mr-1 h-3 w-3 text-slate-400" />
                    <span>{currentAudio?.createdAt || "Baru saja"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center section */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={skipBackward}
                  className="rounded-full p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                  title="Mundur 10 detik"
                >
                  <RiReplay10Fill className="h-4 w-4" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 active:scale-95 transition-all"
                >
                  {isPlaying ? (
                    <IoPause className="h-5 w-5" />
                  ) : (
                    <IoPlay className="ml-0.5 h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={skipForward}
                  className="rounded-full p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                  title="Maju 10 detik"
                >
                  <RiForward10Fill className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1.5 flex w-full max-w-sm items-center">
                <span className="mr-2.5 text-[11px] font-mono text-slate-400">
                  {getCurrentTimeFormatted()}
                </span>
                <div className="relative flex-1">
                  <div className="h-1 rounded-full bg-slate-200">
                    <div
                      className="absolute h-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="ml-2.5 text-[11px] font-mono text-slate-400">{duration}</span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center justify-end gap-3 px-6">
              <button
                onClick={downloadAudio}
                className="rounded-xl p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                title="Unduh Audio"
              >
                <IoDownloadOutline className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlaybar}
                className="rounded-xl p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                title="Tutup Player"
              >
                <IoChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile view */}
          <div className="flex h-full md:hidden items-center px-4">
            <div className="flex flex-1 items-center">
              <div className="flex w-full flex-col gap-0.5">
                <p className="truncate text-xs font-bold text-slate-800">{currentAudio?.title}</p>
                <div className="flex items-center text-[10px] text-slate-400">
                  {voice && (
                    <span className="font-medium text-slate-600 mr-2">{voice.name}</span>
                  )}
                  <span>{currentAudio?.createdAt || "Baru saja"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadAudio}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-sky-50"
              >
                <IoDownloadOutline className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlayPause}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm"
              >
                {isPlaying ? (
                  <IoPause className="h-4 w-4" />
                ) : (
                  <IoPlay className="ml-0.5 h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
