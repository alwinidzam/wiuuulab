"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SignInFormValues, signInSchema } from "~/schemas/auth";
import {
  IoShieldCheckmarkOutline,
  IoSparkles,
  IoMicOutline,
  IoMusicalNotesOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    setIsFormValid(!!email && !!password);
  }, [email, password]);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!signInResult?.error) {
        router.push("/app/speech-synthesis/text-to-speech");
      } else {
        setError(
          signInResult.error === "CredentialsSignin"
            ? "Email atau kata sandi tidak cocok. Silakan periksa kembali."
            : "Terjadi kesalahan saat masuk. Silakan coba lagi.",
        );
      }
    } catch (err: any) {
      setError("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full ambient-softblue-bg text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900 relative overflow-hidden">
      {/* Soft Ambient Background Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Left Column: Clean Flat Minimalist Form */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 z-10">
        <div>
          <img
            src="/logo-banner.png"
            alt="WIULab Logo"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </div>

        {/* Form Container with Liquid Glass Accent */}
        <div className="w-full max-w-md mx-auto my-auto py-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-xs font-medium text-sky-800 mb-3.5">
              <IoShieldCheckmarkOutline className="text-sky-600 text-sm" />
              <span>Akses Pribadi Terotorisasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Masuk ke Studio Audio
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Silakan masukkan email dan kata sandi akun pribadi Anda untuk mengakses seluruh instrumen vokal & efek suara wiuuulab.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200/80 bg-red-50/90 backdrop-blur-md p-4 text-sm text-red-700 flex items-start gap-2.5 shadow-sm">
              <span className="text-base leading-none">⚠️</span>
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="nama@email.com"
                required
                className="w-full rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/15 transition-all shadow-xs"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Masukkan kata sandi Anda"
                required
                className="w-full rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/15 transition-all shadow-xs"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full mt-6 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all duration-200 ${
                isLoading || !isFormValid
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:via-sky-500 hover:to-blue-500 shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 active:scale-[0.99] border border-sky-400/40"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Memverifikasi akun...</span>
                </span>
              ) : (
                "Masuk ke Studio"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
            <p className="text-xs text-slate-400 font-normal">
              Sistem diamankan. Pendaftaran publik ditutup untuk keperluan privat.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-normal">
          © 2026 WIULab Studio. Hak cipta dilindungi undang-undang.
        </div>
      </div>

      {/* Right Column: Liquid Glass Apple HIG Showcase Panel */}
      <div className="hidden lg:block lg:w-1/2 p-6 z-10">
        <div className="h-full w-full rounded-3xl liquid-glass flex flex-col justify-between p-12 relative overflow-hidden">
          {/* Internal Glass Reflection Highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-sky-800 w-fit">
            <IoSparkles className="text-sky-600" />
            <span>Generative AI Voice & Sound Studio</span>
          </div>

          {/* Center Showcase */}
          <div className="space-y-5 max-w-lg my-auto py-8">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-950 leading-[1.2] tracking-tight">
              Suara AI yang Hidup, Lembut &{" "}
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                Penuh Penghayatan
              </span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Ditenagai WIULab Autonomous Neural Engine dan Foley AI Diffusion Studio mandiri.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-3">
              <div className="rounded-2xl liquid-glass-subtle p-4 space-y-1 hover:border-sky-200 transition-all">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <IoMicOutline className="text-sky-600 text-sm" />
                  <span>Athalea (1:1 Clone)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  F0 248Hz intonasi sendu, intim, dan puitis monolog senja.
                </p>
              </div>

              <div className="rounded-2xl liquid-glass-subtle p-4 space-y-1 hover:border-sky-200 transition-all">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <IoMicOutline className="text-sky-600 text-sm" />
                  <span>Serena (Heartfelt)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Vokal hangat penuh penghayatan emosional novel & puisi.
                </p>
              </div>

              <div className="rounded-2xl liquid-glass-subtle p-4 space-y-1 hover:border-sky-200 transition-all">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <IoMicOutline className="text-sky-600 text-sm" />
                  <span>Alwi (Bariton)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Resonansi berat sinematik narator misteri & horor.
                </p>
              </div>

              <div className="rounded-2xl liquid-glass-subtle p-4 space-y-1 hover:border-sky-200 transition-all">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <IoMusicalNotesOutline className="text-sky-600 text-sm" />
                  <span>Foley AI Sound Effects</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Efek suara ambient & SFX murni tanpa formant vokal manusia.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="rounded-2xl liquid-glass-subtle p-4 flex items-center justify-between border border-sky-100/80">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-sky-500/20">
                v4
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Neural Synthesis</p>
                <p className="text-[11px] text-slate-500">Zero robotic artifacts, artikulasi tanda baca bersih.</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
              <IoCheckmarkCircle className="text-xs" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
