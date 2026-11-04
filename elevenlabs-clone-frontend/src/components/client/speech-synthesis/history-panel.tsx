"use client";

import { IoDownloadOutline, IoPlay } from "react-icons/io5";
import { HistoryItem as HistoryItemType } from "~/lib/history";
import { useAudioStore } from "~/stores/audio-store";
import { useVoiceStore, Voice } from "~/stores/voice-store";
import { ServiceType } from "~/types/services";

export function HistoryPanel({
  service,
  searchQuery,
  setSearchQuery,
  hoveredItem,
  setHoveredItem,
  historyItems,
}: {
  service: ServiceType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
  historyItems?: HistoryItemType[];
}) {
  const { playAudio } = useAudioStore();
  const getVoices = useVoiceStore((state) => state.getVoices);
  const voices = getVoices(service);

  const handlePlayHistoryItem = (item: HistoryItemType) => {
    if (item.audioUrl) {
      playAudio({
        id: item.id.toString(),
        title: item.title,
        voice: item.voice,
        audioUrl: item.audioUrl,
        service: item.service,
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari riwayat suara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-xs"
          />
        </div>
      </div>

      {historyItems && historyItems.length > 0 ? (
        <div className="mt-3 flex h-[100vh] w-full flex-col overflow-y-auto space-y-2">
          {/* Filter history items based on search */}
          {(() => {
            const filteredGroups = Object.entries(
              historyItems
                .filter(
                  (item) =>
                    item.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    voices
                      .find((voice) => voice.id === item.voice)
                      ?.name.toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .reduce((groups: Record<string, typeof historyItems>, item) => {
                  const date = item.date;
                  if (!groups[date]) {
                    groups[date] = [];
                  }
                  groups[date].push(item);
                  return groups;
                }, {}),
            );

            // Show no results found when filtered results are empty
            return filteredGroups.length > 0 ? (
              filteredGroups.map(([date, items]) => (
                <div key={date}>
                  <div className="sticky top-0 z-10 my-2 flex w-full justify-center bg-white/80 backdrop-blur-md py-1">
                    <div className="rounded-full liquid-glass-pill px-3 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {date}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        voices={voices}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                        onPlay={handlePlayHistoryItem}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-8 text-center text-xs text-slate-400">
                Tidak ada riwayat ditemukan
              </p>
            );
          })()}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center py-10">
          <p className="text-xs text-slate-400">Belum ada riwayat suara.</p>
        </div>
      )}
    </div>
  );
}

function HistoryItem({
  item,
  voices,
  hoveredItem,
  setHoveredItem,
  onPlay,
}: {
  item: HistoryItemType;
  voices: Voice[];
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
  onPlay: (item: HistoryItemType) => void;
}) {
  const voiceUsed =
    voices.find((voice) => voice.id === item.voice) || voices[0]!;

  return (
    <div
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className="relative flex items-center rounded-2xl border border-transparent p-3 hover:border-slate-200/80 hover:bg-sky-50/50 transition-all shadow-xs"
    >
      <div className="flex w-full flex-col gap-1">
        <div className="relative w-full">
          <p className="truncate text-xs font-semibold text-slate-800">{item.title || "Tanpa judul"}</p>
          {hoveredItem === item.id && (
            <div className="absolute right-0 top-0 flex items-center gap-1 bg-white/90 backdrop-blur-sm pl-2 rounded-lg">
              <button
                onClick={() => onPlay(item)}
                className="rounded-lg p-1 text-sky-600 hover:bg-sky-50 transition-colors"
                title="Putar"
              >
                <IoPlay className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (item.audioUrl) {
                    const a = document.createElement("a");
                    a.href = item.audioUrl;
                    a.download = `${item.title || "speech"}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }
                }}
                className="rounded-lg p-1 text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                title="Unduh"
              >
                <IoDownloadOutline className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <div
            className="flex h-2.5 w-2.5 items-center justify-center rounded-full"
            style={{ background: voiceUsed.gradientColors }}
          ></div>
          <span className="text-[11px] font-medium text-slate-500">
            {voiceUsed.name}
          </span>
          <span className="text-[11px] text-slate-300">·</span>
          <span className="text-[11px] font-mono text-slate-400">
            {item.time || "Baru saja"}
          </span>
        </div>
      </div>
    </div>
  );
}
