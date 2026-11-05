"use client";

import { GoDownload } from "react-icons/go";

export function GenerateButton({
  onGenerate,
  isDisabled,
  isLoading,
  showDownload,
  characterCount,
  characterLimit,
  buttonText = "Generate Speech",
  className,
  fullWidth,
  showCharacterCount,
  showCredits = true,
}: {
  onGenerate: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  showDownload?: boolean;
  creditsRemaining?: number;
  characterCount?: number;
  characterLimit?: number;
  buttonText?: string;
  className?: string;
  fullWidth?: boolean;
  showCharacterCount?: boolean;
  showCredits?: boolean;
}) {
  return (
    <div
      className={`flex w-full flex-col-reverse items-center gap-4 md:flex-row md:justify-between ${className}`}
    >
      {(showCredits ||
        (showCharacterCount && characterCount !== undefined)) && (
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          {showCredits && (
            <div className="flex items-center space-x-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                100% Neural Studio • Unlimited
              </span>
            </div>
          )}

          {/* Character counter */}
          {showCharacterCount &&
            characterCount !== undefined &&
            characterLimit !== undefined && (
              <p className="text-xs font-medium text-slate-500">
                <span className="text-slate-800 font-semibold">{characterCount}</span> / <span>{characterLimit}</span>
                <span className="ml-1 hidden sm:inline-block">karakter</span>
              </p>
            )}
        </div>
      )}

      <div
        className={`flex items-center gap-3 ${fullWidth ? "w-full" : "w-full md:w-fit"}`}
      >
        {showDownload && (
          <button
            className="hidden min-h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-600 hover:bg-sky-50 hover:text-sky-700 shadow-xs transition-colors lg:flex"
            type="button"
            disabled={true}
            title="Download Audio"
          >
            <GoDownload className="h-4 w-4" />
          </button>
        )}

        <button
          data-testid="generate-speech-button"
          className={`h-10 w-full whitespace-nowrap rounded-xl px-4 text-sm font-semibold text-white transition-all duration-200 ${
            isDisabled || isLoading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-transparent"
              : "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:via-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 active:scale-[0.98] border border-blue-400/40"
          }`}
          onClick={onGenerate}
          disabled={isDisabled || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="ml-2">Mengolah Suara...</span>
            </div>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </div>
  );
}
