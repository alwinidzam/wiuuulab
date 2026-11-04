"use client";

import {
  IoDownloadOutline,
  IoPlayOutline,
  IoVolumeHighOutline,
} from "react-icons/io5";
import { HistoryItem } from "~/lib/history";
import { useAudioStore } from "~/stores/audio-store";

export function HistoryList({ historyItems }: { historyItems: HistoryItem[] }) {
  const { playAudio } = useAudioStore();

  const groupedItems = historyItems.reduce(
    (groups: Record<string, typeof historyItems>, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    },
    {},
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center md:pt-6 max-w-3xl">
        <div className="w-full rounded-3xl liquid-glass p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Riwayat Efek Suara</h2>
            <p className="text-xs text-slate-400">Daftar efek audio yang pernah Anda ciptakan</p>
          </div>

          {historyItems.length > 0 ? (
            <div className="mt-6 space-y-6">
              {Object.entries(groupedItems).map(([date, items]) => (
                <div key={date}>
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {date}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-3.5 hover:bg-sky-50/50 hover:border-sky-200 transition-all shadow-xs"
                      >
                        {/* Left side */}
                        <div className="flex min-w-0 flex-1 items-center">
                          <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                            <IoVolumeHighOutline className="h-4 w-4" />
                          </div>
                          <p className="break-words text-xs font-semibold text-slate-800 md:truncate">
                            <span className="block sm:hidden">
                              {item.title.length > 20
                                ? `${item.title.substring(0, 20)}...`
                                : item.title}
                            </span>
                            <span className="hidden sm:block">
                              {item.title}
                            </span>
                          </p>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-slate-400">
                            {item.time}
                          </span>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                if (item.audioUrl) {
                                  playAudio({
                                    id: item.id.toString(),
                                    title: item.title,
                                    voice: item.voice || "",
                                    audioUrl: item.audioUrl,
                                    service: item.service,
                                  });
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-500 hover:text-white transition-all shadow-xs"
                              title="Putar Audio"
                            >
                              <IoPlayOutline className="h-4 w-4 ml-0.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (item.audioUrl) {
                                  const a = document.createElement("a");
                                  a.href = item.audioUrl;
                                  a.download = `${item.title || "sound-effect"}.wav`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-all shadow-xs"
                              title="Unduh Audio"
                            >
                              <IoDownloadOutline className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-xs font-medium text-slate-400">
                Belum ada efek suara yang dibuat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
