"use client";

import { ReactNode, useEffect } from "react";
import { ServiceType } from "~/types/services";
import Sidebar from "./sidebar";
import { useUIStore } from "~/stores/ui-store";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpeechSidebar } from "./speech-synthesis/right-sidebar";
import { HistoryItem } from "~/lib/history";
import Playbar from "./playbar";
import { useAudioStore } from "~/stores/audio-store";
import { MobileSettingsButton } from "./speech-synthesis/mobile-settings-button";

interface TabItem {
  name: string;
  path: string;
}

export function PageLayout({
  title,
  children,
  service,
  tabs,
  showSidebar = true,
  historyItems,
}: {
  title: string;
  children: ReactNode;
  service: ServiceType;
  tabs?: TabItem[];
  showSidebar: boolean;
  historyItems?: HistoryItem[];
}) {
  const pathname = usePathname();
  const {
    isMobileDrawerOpen,
    isMobileScreen,
    toggleMobileDrawer,
    setMobileScreen,
    toggleMobileMenu,
  } = useUIStore();
  const { currentAudio } = useAudioStore();

  useEffect(() => {
    const checkScreenSize = () => {
      setMobileScreen(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setMobileScreen]);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      {/* Ambient Blur Blue Glow Meshes */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-sky-400/12 blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-indigo-500/8 blur-3xl -z-10" />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-30">
        <Sidebar />
      </div>

      {/* Mobile Backdrop */}
      {isMobileScreen && isMobileDrawerOpen && (
        <div
          onClick={toggleMobileDrawer}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full w-64 bg-white shadow-2xl">
          <button
            onClick={toggleMobileDrawer}
            className="absolute right-3 top-3 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <IoClose className="text-lg" />
          </button>
          <Sidebar isMobile={true} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Apple HIG Top Bar with Frosted Liquid Glass */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-blue-100/70 sticky top-0 z-20 px-6 h-16 flex items-center justify-between shadow-[0_1px_10px_rgba(59,130,246,0.03)]">
          <div className="flex items-center space-x-3">
            {isMobileScreen && (
              <button
                onClick={toggleMobileDrawer}
                className="mr-2 rounded-xl p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors lg:hidden"
              >
                <IoMenu className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            {/* Apple HIG Segmented Tab Pills */}
            {tabs && tabs.length > 0 && (
              <div className="ml-4 flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-blue-100/70 shadow-inner">
                {tabs.map((tab) => {
                  const isActive = pathname === tab.path;
                  return (
                    <Link
                      key={tab.path}
                      href={tab.path}
                      className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-white text-blue-700 shadow-sm border border-blue-200/60"
                          : "text-slate-600 hover:text-slate-950 hover:bg-white/60"
                      }`}
                    >
                      {tab.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-[11px] font-semibold text-blue-700 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Neural v4
            </span>
          </div>
        </header>

        {/* Studio Workspace Content */}
        <div className="flex-1 overflow-auto bg-transparent relative">
          <div className="flex h-full">
            <main className="flex-1 px-6 py-6 overflow-y-auto">
              <div className="flex h-full flex-col max-w-5xl mx-auto">{children}</div>
            </main>

            {showSidebar && service && (
              <aside className="w-88 lg:w-96 xl:w-[410px] shrink-0 border-l border-blue-100/70 bg-white/80 backdrop-blur-2xl hidden md:flex flex-col h-full overflow-hidden shadow-[-4px_0_24px_-4px_rgba(59,130,246,0.04)]">
                <SpeechSidebar historyItems={historyItems} service={service} />
              </aside>
            )}
          </div>
        </div>

        {/* Mobile Settings Button */}
        {isMobileScreen && !pathname.includes("/app/sound-effects") && (
          <MobileSettingsButton toggleMobileMenu={toggleMobileMenu} />
        )}

        {/* Floating Playbar */}
        {currentAudio && <Playbar />}
      </div>
    </div>
  );
}
