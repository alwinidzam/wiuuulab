"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  IoChatboxOutline,
  IoKeyOutline,
  IoMicOutline,
  IoMusicalNotesOutline,
  IoPersonOutline,
  IoPinOutline,
} from "react-icons/io5";

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const isExpanded = isMobile || isPinned || isHovered;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setShowAccountMenu(false);
  };

  return (
    <div
      className={`${isExpanded ? "w-64" : "w-16"} flex h-full flex-col border-r border-slate-200/70 bg-white/75 backdrop-blur-xl px-3 py-4 transition-all duration-300 z-30`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        {isExpanded ? (
          <img
            src="/logo-banner.png"
            alt="WIULab"
            className="h-8 w-auto object-contain max-w-[170px]"
          />
        ) : (
          <img
            src="/logo-icon.png"
            alt="WIULab"
            className="h-7 w-7 object-contain mx-auto"
          />
        )}
        {!isMobile && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-sky-50 hover:text-sky-600 text-slate-400"
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center transition-all ${isPinned ? "rounded-xl bg-sky-50 text-sky-600 border border-sky-100" : "text-slate-400"}`}
            >
              {isExpanded ? (
                <IoPinOutline className="h-4 w-4" />
              ) : (
                <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-sky-600 px-2 py-0.5 text-white shadow-xs">
                  <span className="text-xs font-bold">W</span>
                </div>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col space-y-1">
        <SectionHeader isExpanded={isExpanded}>Playground</SectionHeader>
        <SidebarButton
          icon={<IoChatboxOutline className="text-base" />}
          isExpanded={isExpanded}
          isActive={pathname.includes("/app/speech-synthesis/text-to-speech")}
          href="/app/speech-synthesis/text-to-speech"
        >
          Text to Speech
        </SidebarButton>
        <SidebarButton
          icon={<IoMicOutline className="text-base" />}
          isExpanded={isExpanded}
          isActive={pathname.includes("/app/speech-synthesis/speech-to-speech")}
          href="/app/speech-synthesis/speech-to-speech"
        >
          Voice Changer
        </SidebarButton>
        <SidebarButton
          icon={<IoMusicalNotesOutline className="text-base" />}
          isExpanded={isExpanded}
          isActive={pathname.includes("/app/sound-effects")}
          href="/app/sound-effects/generate"
        >
          Sound Effects
        </SidebarButton>

        <SectionHeader isExpanded={isExpanded}>Developers</SectionHeader>
        <SidebarButton
          icon={<IoKeyOutline className="text-base" />}
          isExpanded={isExpanded}
          isActive={pathname.includes("/app/api-keys")}
          href="/app/api-keys"
        >
          API Keys
        </SidebarButton>
      </nav>

      {/* Bottom Section */}
      <div className="relative mt-auto" ref={accountMenuRef}>
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="flex w-full items-center rounded-xl px-2.5 py-2.5 text-sm hover:bg-sky-50/60 hover:text-sky-900 transition-colors"
        >
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-slate-500">
            <IoPersonOutline className="text-base" />
          </div>
          <div
            className={`ml-3 overflow-hidden text-slate-600 font-medium transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
            style={{ whiteSpace: "nowrap" }}
          >
            My Account
          </div>
        </button>

        {showAccountMenu && (
          <div className="absolute bottom-12 left-0 z-50 min-w-[190px] rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl p-1.5 shadow-xl">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sesi Masuk</p>
              <p className="text-xs font-medium text-slate-800 truncate">Administrator</p>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              Keluar (Sign out)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  children,
  isExpanded,
}: {
  children: ReactNode;
  isExpanded: boolean;
}) {
  return (
    <div className="mb-1 mt-4 h-5 px-3">
      <span
        className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </span>
    </div>
  );
}

function SidebarButton({
  icon,
  children,
  isExpanded,
  isActive,
  href,
}: {
  icon: ReactNode;
  children: ReactNode;
  isExpanded: boolean;
  isActive: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center rounded-xl px-2.5 py-2 text-sm transition-all duration-200 ${
        isActive
          ? "bg-sky-50/90 text-sky-800 border border-sky-200/80 shadow-xs font-semibold"
          : "text-slate-600 hover:text-slate-900 hover:bg-white/70 font-medium"
      }`}
    >
      <div
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center transition-colors ${
          isActive ? "text-sky-600" : "text-slate-400"
        }`}
      >
        {icon}
      </div>
      <div
        className={`ml-3 overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
        style={{ whiteSpace: "nowrap" }}
      >
        {children}
      </div>
    </Link>
  );
}
