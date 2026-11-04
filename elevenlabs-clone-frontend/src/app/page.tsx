"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SignInFormValues, signInSchema } from "~/schemas/auth";
import {
  IoKeyOutline,
  IoShieldCheckmarkOutline,
  IoSparkles,
  IoMicOutline,
  IoMusicalNotesOutline,
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
    <div className="flex min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Left Column: Clean Login Form */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16">
        <div>
          <img
            src="/logo-banner.png"
            alt="WIULab Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600 mb-3 shadow-xs">
              <IoShieldCheckmarkOutline className="text-purple-600" />
              <span>Akses Pribadi Terotorisasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Masuk ke Studio Audio
            </h1>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Silakan masukkan email dan kata sandi akun pribadi Anda untuk mengakses seluruh instrumen suara wiuuulab.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 flex items-start gap-2.5 shadow-xs">
              <span className="text-base leading-none">⚠️</span>
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="nama@email.com"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
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
                className="mb-1.5 block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Masukkan kata sandi Anda"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
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
              className={`w-full mt-6 rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-md ${
                isLoading || !isFormValid
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25 hover:shadow-lg"
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

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Sistem diamankan. Pendaftaran publik ditutup untuk keperluan privat.
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          © 2026 wiuuulab Studio. Hak cipta dilindungi undang-undang.
        </div>
      </div>

      {/* Right Column: Clean Subtle Gradient Hero Panel */}
      <div className="hidden lg:block lg:w-1/2 p-4">
        <div className="h-full w-full rounded-3xl bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-pink-50/70 border border-purple-100/80 flex flex-col justify-between p-12 relative overflow-hidden shadow-xs">
          {/* Subtle Ambient Blur Orb */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/40 via-indigo-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-200/30 via-purple-100/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/80 text-xs font-semibold text-purple-900 w-fit shadow-xs z-10">
            <IoSparkles className="text-purple-600" />
            <span>Generative AI Voice & Sound Studio</span>
          </div>

          {/* Center Showcase */}
          <div className="space-y-4 max-w-lg z-10 my-auto py-8">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-gray-950 leading-tight">
              Suara AI yang Hidup, Lembut &{" "}
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Penuh Penghayatan
              </span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ditenagai arsitektur ElevenLabs v4 Neural Model dan Foley Diffusion Engine tanpa Microsoft Edge TTS.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-4">
              <div className="rounded-2xl bg-white/95 border border-purple-100 p-4 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <IoMicOutline className="text-purple-600" />
                  <span>Athalea (1:1 Clone)</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  F0 248Hz intonasi sendu, intim, dan puitis monolog senja.
                </p>
              </div>

              <div className="rounded-2xl bg-white/95 border border-purple-100 p-4 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <IoMicOutline className="text-purple-600" />
                  <span>Serena (Heartfelt)</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Vokal hangat penuh penghayatan emosional novel & puisi.
                </p>
              </div>

              <div className="rounded-2xl bg-white/95 border border-purple-100 p-4 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <IoMicOutline className="text-purple-600" />
                  <span>Alwi (Bariton)</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Resonansi berat sinematik narator misteri & horor.
                </p>
              </div>

              <div className="rounded-2xl bg-white/95 border border-purple-100 p-4 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <IoMusicalNotesOutline className="text-purple-600" />
                  <span>Foley AI Sound Effects</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Efek suara ambient & SFX murni tanpa formant vokal manusia.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-purple-100 p-4 z-10 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                v4
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">100% Neural Synthesis</p>
                <p className="text-[11px] text-gray-500">Zero robotic artifacts, artikulasi tanda baca bersih.</p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
