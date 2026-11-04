"use client";

import { useUIStore } from "~/stores/ui-store";
import { ServiceType } from "~/types/services";
import { VoiceSelector } from "../voice-selector";
import { HistoryPanel } from "./history-panel";
import { useState } from "react";
import { HistoryItem } from "~/lib/history";
import { IoClose, IoOptionsOutline, IoSparklesOutline } from "react-icons/io5";

export function SpeechSidebar({
  service,
  historyItems,
}: {
  service: ServiceType;
  historyItems?: HistoryItem[];
}) {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    toggleMobileMenu,
    isMobileScreen,
  } = useUIStore();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ElevenLabs Voice Settings
  const [selectedModel, setSelectedModel] = useState("eleven_v4");
  const [stability, setStability] = useState(50);
  const [similarity, setSimilarity] = useState(75);
  const [styleExaggeration, setStyleExaggeration] = useState(0);
  const [speakerBoost, setSpeakerBoost] = useState(true);

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Voice Selection */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Voice
        </label>
        <VoiceSelector service={service} />
      </div>

      {/* Model Selection */}
      {service === "styletts2" && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Model
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="eleven_v4">
                Eleven v4 (Flagship Ultra-Fidelity • 90+ Languages)
              </option>
              <option value="eleven_v4_turbo">
                Eleven v4 Turbo (Low Latency Realtime)
              </option>
              <option value="eleven_multilingual_v2">
                Eleven Multilingual v2 (Studio Quality)
              </option>
              <option value="eleven_turbo_v2_5">
                Eleven Turbo v2.5 (Low Latency)
              </option>
              <option value="eleven_flash_v2_5">
                Eleven Flash v2.5 (Fastest)
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <IoSparklesOutline className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Voice Settings Sliders (Exact ElevenLabs Specification) */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-700">
            <IoOptionsOutline className="h-4 w-4" />
            <span>Voice Settings</span>
          </div>
          <button
            onClick={() => {
              setStability(50);
              setSimilarity(75);
              setStyleExaggeration(0);
              setSpeakerBoost(true);
            }}
            className="text-xs text-gray-400 hover:text-black"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Stability */}
          <div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Stability</span>
              <span className="font-mono text-gray-500">{stability}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={stability}
              onChange={(e) => setStability(Number(e.target.value))}
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>More variable</span>
              <span>More stable</span>
            </div>
          </div>

          {/* Clarity + Similarity */}
          <div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Clarity + Similarity</span>
              <span className="font-mono text-gray-500">{similarity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={similarity}
              onChange={(e) => setSimilarity(Number(e.target.value))}
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Style Exaggeration */}
          <div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Style Exaggeration</span>
              <span className="font-mono text-gray-500">{styleExaggeration}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={styleExaggeration}
              onChange={(e) => setStyleExaggeration(Number(e.target.value))}
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>None</span>
              <span>Exaggerated</span>
            </div>
          </div>

          {/* Speaker Boost Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-gray-700">Speaker Boost</p>
              <p className="text-[10px] text-gray-400">
                Boost similarity to original speaker
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={speakerBoost}
                onChange={(e) => setSpeakerBoost(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-black peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden h-full w-[350px] flex-col border-l border-gray-200 bg-white p-5 md:flex lg:w-[420px]">
        <div className="relative mb-6 flex">
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-200"></div>
          <button
            onClick={() => setActiveTab("settings")}
            className={`relative z-10 mr-4 pb-2 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "settings"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`relative z-10 mr-4 pb-2 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "history"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "settings" ? (
            renderSettings()
          ) : (
            <HistoryPanel
              service={service}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              historyItems={historyItems}
            />
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileScreen && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <span className="text-base font-bold text-gray-900">Voice Controls</span>
            <button onClick={toggleMobileMenu} className="p-1 text-gray-500 hover:text-black">
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mb-6 flex">
            <div className="absolute bottom-0 left-0 right-0 border-b border-gray-200"></div>
            <button
              onClick={() => setActiveTab("settings")}
              className={`relative z-10 mr-4 pb-2 text-sm font-semibold ${
                activeTab === "settings"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`relative z-10 mr-4 pb-2 text-sm font-semibold ${
                activeTab === "history"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              History
            </button>
          </div>

          {activeTab === "settings" ? (
            renderSettings()
          ) : (
            <HistoryPanel
              service={service}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              historyItems={historyItems}
            />
          )}
        </div>
      </div>
    </>
  );
}
