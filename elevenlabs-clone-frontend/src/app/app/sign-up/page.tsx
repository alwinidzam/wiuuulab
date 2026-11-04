"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpFormValues, signUpSchema } from "~/schemas/auth";
import { signUp } from "~/actions/auth";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    setIsFormValid(!!email && !!password && password.length >= 6);
  }, [email, password]);

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      const res = await signUp(data);

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      setSuccess("Akun berhasil dibuat! Sedang masuk ke studio...");

      // Automatically sign in the newly registered user
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!signInResult?.error) {
        router.push("/app/speech-synthesis/text-to-speech");
      } else {
        router.push("/app/sign-in");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan sistem saat mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-900 font-sans">
      <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-gray-950">
              wiuuulab
            </span>
            <span className="h-2 w-2 rounded-full bg-purple-600"></span>
          </Link>
        </div>

        {/* Centered sign up form */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Buat Akun Studio Baru
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Daftar gratis untuk mengakses seluruh fitur suara AI, sound effects, dan riwayat kreasi audio Anda.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm text-emerald-700">
              {success}
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all"
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
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Minimal 6 karakter"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all"
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
              className={`w-full mt-6 rounded-xl py-3 text-sm font-bold text-white transition-all shadow-md ${
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
                  <span>Mendaftarkan akun...</span>
                </span>
              ) : (
                "Daftar Akun Gratis"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Sudah memiliki akun?{" "}
            <Link
              href="/app/sign-in"
              className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-2"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        <div className="text-xs text-gray-400">
          © 2026 wiuuulab Studio. Hak cipta dilindungi undang-undang.
        </div>
      </div>

      {/* Right side banner with clean subtle gradient */}
      <div className="hidden lg:block lg:w-1/2 p-4">
        <div className="h-full w-full rounded-3xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-pink-50 border border-purple-100 flex flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/40 via-indigo-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-purple-200 text-xs font-semibold text-purple-900 w-fit shadow-sm">
            ✨ Generative Speech & Foley Audio
          </div>

          <div className="space-y-4 max-w-lg z-10">
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Akses Penuh Seluruh Karakter Suara AI & Efek Suara
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nikmati keaslian suara Athalea (1:1 Clone), Serena (Heartfelt), Alwi (Sinematik Bariton), dan generator Foley AI ElevenLabs secara gratis dengan mendaftarkan akun Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 z-10">
            <div className="rounded-2xl bg-white/90 border border-purple-100 p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-900">100% Free Access</p>
              <p className="text-[11px] text-gray-500 mt-1">Kuota generasi suara gratis untuk seluruh pengguna terdaftar.</p>
            </div>
            <div className="rounded-2xl bg-white/90 border border-purple-100 p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-900">Developer API</p>
              <p className="text-[11px] text-gray-500 mt-1">Integrasikan ke aplikasi eksternal via API Key pribadi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
