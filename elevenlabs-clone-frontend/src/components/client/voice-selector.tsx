"use client";

import { useEffect, useRef, useState } from "react";
import { IoCheckmark, IoChevronDown, IoChevronUp, IoSearchOutline } from "react-icons/io5";
import { useVoiceStore } from "~/stores/voice-store";
import { ServiceType } from "~/types/services";

export function VoiceSelector({ service }: { service: ServiceType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getVoices = useVoiceStore((state) => state.getVoices);
  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);
  const selectVoice = useVoiceStore((state) => state.selectVoice);
  const selectedLanguage = useVoiceStore((state) => state.selectedLanguage);
  const setLanguage = useVoiceStore((state) => state.setLanguage);

  const [activeFilter, setActiveFilter] = useState<"current" | "id" | "en" | "all">("current");

  const allVoices = getVoices(service);
  const selectedVoice = getSelectedVoice(service);

  // Sync active filter with store's selectedLanguage if on current
  const effectiveFilter = activeFilter === "current" ? selectedLanguage : activeFilter;

  const filteredVoices = allVoices.filter((voice) => {
    const matchesCategory =
      effectiveFilter === "all" ||
      voice.category === effectiveFilter ||
      voice.category === "all";

    const matchesSearch =
      searchQuery.trim() === "" ||
      voice.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (voice.subtitle && voice.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (voice.badge && voice.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

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
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button with Apple HIG Glass & Ambient Blue Accents */}
      <div
        data-testid="voice-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-between rounded-2xl border transition-all duration-200 cursor-pointer p-3 ${
          isOpen
            ? "border-blue-400 bg-white/95 shadow-[0_0_20px_rgba(59,130,246,0.18)] ring-2 ring-blue-500/20"
            : "border-blue-100/80 bg-white/85 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-[0_4px_16px_rgba(59,130,246,0.08)] backdrop-blur-md shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {/* Avatar Orb with Ambient Glow Ring */}
          <div
            className="relative h-9 w-9 shrink-0 rounded-full shadow-sm ring-2 ring-white/80 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: selectedVoice?.gradientColors }}
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
          </div>

          {/* Voice Details - 2 Line Layout to Prevent Text Clipping */}
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                {selectedVoice?.displayName || selectedVoice?.name || "Pilih Karakter"}
              </span>
              {selectedVoice?.badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 shrink-0">
                  {selectedVoice.badge}
                </span>
              )}
              {selectedVoice?.category === "id" && (
                <span className="text-[10px]" title="Bahasa Indonesia">🇮🇩</span>
              )}
              {selectedVoice?.category === "en" && (
                <span className="text-[10px]" title="English">🇺🇸</span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500 truncate">
              {selectedVoice?.subtitle || selectedVoice?.description || "Karakter vokal natural AI"}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <div className="shrink-0 pl-1 text-slate-400 group-hover:text-blue-600 transition-colors">
          {isOpen ? (
            <IoChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <IoChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-blue-200/90 bg-white/95 backdrop-blur-2xl p-2.5 shadow-[0_12px_36px_rgba(37,99,235,0.15)] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Quick Search */}
          <div className="relative mb-2">
            <IoSearchOutline className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari suara / karakter..."
              className="w-full rounded-xl border border-blue-100 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mb-2 flex items-center gap-1 p-0.5 rounded-xl bg-slate-100/80 border border-blue-50 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveFilter("current")}
              className={`flex-1 py-1 rounded-lg transition-all text-center ${
                activeFilter === "current"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {selectedLanguage === "id" ? "🇮🇩 Bahasa Utama" : "🇺🇸 English Utama"}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilter("id");
                setLanguage("id");
              }}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeFilter === "id"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🇮🇩 Indo
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilter("en");
                setLanguage("en");
              }}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeFilter === "en"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🇺🇸 Eng
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Semua
            </button>
          </div>

          {/* Voice Items List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredVoices.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Tidak ada karakter yang cocok dengan kata kunci
              </div>
            ) : (
              filteredVoices.map((voice) => {
                const isSelected = voice.id === selectedVoice?.id;
                return (
                  <div
                    key={voice.id}
                    data-testid={`voice-option-${voice.id}`}
                    onClick={() => {
                      selectVoice(service, voice.id);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center justify-between rounded-xl px-2.5 py-2 cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-blue-50/90 border border-blue-200/80 shadow-xs"
                        : "hover:bg-blue-50/40 hover:border-blue-100 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className="relative h-7 w-7 shrink-0 rounded-full shadow-xs ring-1 ring-white/90 overflow-hidden"
                        style={{ background: voice.gradientColors }}
                      />
                      <div className="flex flex-col min-w-0 text-left">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-bold tracking-tight truncate ${
                              isSelected ? "text-blue-900" : "text-slate-800"
                            }`}
                          >
                            {voice.displayName || voice.name}
                          </span>
                          {voice.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-100/70 text-blue-800 border border-blue-200/50 shrink-0">
                              {voice.badge}
                            </span>
                          )}
                          {voice.category === "id" && (
                            <span className="text-[10px]">🇮🇩</span>
                          )}
                          {voice.category === "en" && (
                            <span className="text-[10px]">🇺🇸</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 truncate">
                          {voice.subtitle || voice.description}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <IoCheckmark className="h-4 w-4 shrink-0 text-blue-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
