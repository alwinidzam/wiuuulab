import { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useVoiceStore } from "~/stores/voice-store";
import { ServiceType } from "~/types/services";

export function VoiceSelector({ service }: { service: ServiceType }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getVoices = useVoiceStore((state) => state.getVoices);
  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);
  const selectVoice = useVoiceStore((state) => state.selectVoice);

  const voices = getVoices(service);
  const selectedVoice = getSelectedVoice(service);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md px-3.5 py-2.5 hover:cursor-pointer hover:bg-sky-50/60 hover:border-sky-300 transition-all shadow-xs"
      >
        <div className="flex items-center">
          <div
            className="relative mr-2.5 flex h-4 w-4 items-center justify-center overflow-hidden rounded-full shadow-xs"
            style={{ background: selectedVoice?.gradientColors }}
          ></div>
          <span className="text-xs font-semibold text-slate-800">
            {selectedVoice?.name ?? "Pilih karakter suara"}
          </span>
        </div>
        {isOpen ? (
          <IoChevronUp className="h-4 w-4 text-sky-600" />
        ) : (
          <IoChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-30 mt-1.5 max-h-60 overflow-auto rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-1.5 shadow-xl">
          {voices.map((voice) => (
            <div
              key={voice.id}
              className={`flex items-center rounded-xl px-3 py-2 hover:cursor-pointer hover:bg-sky-50 transition-colors ${
                voice.id === selectedVoice?.id ? "bg-sky-50/80 text-sky-800 font-semibold" : "text-slate-700"
              }`}
              onClick={() => {
                selectVoice(service, voice.id);
                setIsOpen(false);
              }}
            >
              <div
                className="relative mr-2.5 flex h-4 w-4 items-center justify-center overflow-hidden rounded-full shadow-xs"
                style={{ background: voice.gradientColors }}
              />
              <span className="text-xs">{voice.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
