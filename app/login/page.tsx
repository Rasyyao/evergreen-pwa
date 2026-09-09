"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeOffIcon, FarmoraLogoIcon } from "@/components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Silakan masukkan email atau username Anda.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(email.trim(), password);
      if (success) {
        router.push("/");
      } else {
        setError("Email atau kata sandi tidak cocok.");
      }
    } catch {
      setError("Gagal masuk. Silakan periksa koneksi internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    try {
      setIsDemoLoading(true);
      setError(null);
      // Visual feedback tactile vibration on mobile
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(30);
      }
      loginAsDemo();
      router.push("/");
      // Fallback redirect if router transition delays
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname === "/login") {
          window.location.href = "/";
        }
      }, 500);
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-zinc-900 select-none overflow-x-hidden flex flex-col justify-between py-6 px-4">
      {/* ──────────────── Rich Decorative Background Elements ──────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft emerald radial aura - top right */}
        <div
          className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-[0.12] blur-2xl"
          style={{ background: "radial-gradient(circle, #43786b 0%, #7dbfae 45%, transparent 70%)" }}
        />

        {/* Soft mint radial aura - bottom left */}
        <div
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.1] blur-3xl"
          style={{ background: "radial-gradient(circle, #346358 0%, #8acab8 50%, transparent 70%)" }}
        />

        {/* Center subtle glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-[0.06] blur-2xl"
          style={{ background: "radial-gradient(circle, #43786b 0%, transparent 75%)" }}
        />

        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#275349 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Decorative Floating Badges (Farm Tech Aesthetic) */}
        <div className="hidden sm:flex items-center gap-1.5 absolute top-10 left-8 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 shadow-sm backdrop-blur-sm text-[11px] font-semibold text-[#275349] rotate-[-4deg]">
          <span>🌱</span>
          <span>AI Smart Crop</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 absolute top-20 right-8 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 shadow-sm backdrop-blur-sm text-[11px] font-semibold text-[#275349] rotate-[3deg]">
          <span>🔍</span>
          <span>Fast Detection</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 absolute bottom-16 right-10 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 shadow-sm backdrop-blur-sm text-[11px] font-semibold text-[#275349] rotate-[-2deg]">
          <span>🌾</span>
          <span>Eco Agriculture</span>
        </div>

        {/* Decorative Botanical Leaf SVGs */}
        {/* Leaf 1 - Top Left */}
        <svg
          className="absolute top-12 left-4 w-12 h-12 text-[#43786b] opacity-[0.14] rotate-[-30deg]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 3C7 5 3 10 3 16a6 6 0 0 0 12 0C15 10 12 3 12 3Z" fill="currentColor" fillOpacity="0.3" />
          <path d="M12 3v13M8 10l4 3M16 11l-4 3" strokeLinecap="round" />
        </svg>

        {/* Leaf 2 - Mid Right */}
        <svg
          className="absolute top-1/3 right-3 w-10 h-10 text-[#275349] opacity-[0.1] rotate-[25deg]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 3C14 4 10 9 10 15a5 5 0 0 0 10 0c0-5-3-11-9-12Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M10 15C13 12 18 8 21 3" strokeLinecap="round" />
        </svg>

        {/* Leaf 3 - Bottom Left */}
        <svg
          className="absolute bottom-24 left-6 w-14 h-14 text-[#43786b] opacity-[0.12] rotate-[50deg]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2C6 4 2 10 2 16a7 7 0 0 0 14 0C16 10 12 2 12 2Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 2v14M7 9l5 4M17 10l-5 4" strokeLinecap="round" />
        </svg>

        {/* Leaf 4 - Bottom Right */}
        <svg
          className="absolute bottom-10 right-6 w-9 h-9 text-[#275349] opacity-[0.09] rotate-[-15deg]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 3C7 5 3 10 3 16a6 6 0 0 0 12 0C15 10 12 3 12 3Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      </div>


      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Logo & Header Branding */}
        <div className="flex flex-col items-center pt-2 pb-5">
          {/* Logo with double glowing squircle */}
          <div className="relative mb-3.5 group">
            <div className="absolute -inset-2 rounded-[26px] bg-gradient-to-tr from-[#43786b]/40 to-emerald-400/20 blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#3d6e62] via-[#2d5a4f] to-[#1e4138] shadow-xl shadow-[#275349]/30 border border-white/25">
              <FarmoraLogoIcon className="h-10 w-10 text-white drop-shadow-md" />
              {/* Glossy top-light reflection */}
              <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[21px] bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            </div>
            {/* Tiny tech status badge */}
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-emerald-100">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <h1 className="text-[24px] font-black text-[#1e4138] tracking-tight font-sans">
              FARMORA
            </h1>
            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-[#275349] tracking-wider uppercase">
              PWA
            </span>
          </div>

          <p className="text-[12px] text-[#5d857a] font-medium tracking-wide mt-0.5 flex items-center gap-1.5">
            <span>🌿</span>
            <span>Smart Farming Assistant</span>
          </p>
        </div>

        {/* ──────────────── Form Container: Grey Rounded Card ──────────────── */}
        <div className="w-full rounded-[30px] bg-[#edf2ef] p-6 shadow-xl shadow-[#275349]/8 border border-[#d6e3dc] transition-all">
          {/* Card Header */}
          <div className="mb-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-[#d2ded8] text-[10px] font-bold text-[#2d5a4f] mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>PORTAL PETANI CERDAS</span>
            </div>
            <h2 className="text-[19px] font-extrabold text-[#1e4138] tracking-tight">
              Selamat Datang 👋
            </h2>
            <p className="text-[11.5px] text-[#6b9286] mt-0.5 font-medium leading-relaxed">
              Masuk untuk pantau lahan, hama &amp; analisis AI
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-2xl bg-red-50/90 border border-red-200/90 p-3 text-left text-xs text-red-700 font-medium flex items-start gap-2 animate-shake">
              <span className="text-sm shrink-0">⚠️</span>
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Email / Username Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#426c60] mb-1.5 ml-1 uppercase tracking-wider">
                Email atau Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#6c978b] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@farmora.id"
                  className="w-full rounded-2xl bg-white pl-10 pr-4 py-3 text-sm text-[#1e4138] font-semibold placeholder-[#9dbbb2] border border-[#d2ded8] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 focus:border-[#43786b] transition shadow-xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#426c60] mb-1.5 ml-1 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#6c978b] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-white pl-10 pr-11 py-3 text-sm text-[#1e4138] font-semibold placeholder-[#9dbbb2] border border-[#d2ded8] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 focus:border-[#43786b] transition shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 inset-y-0 px-3.5 flex items-center text-[#7ba498] hover:text-[#275349] transition cursor-pointer touch-manipulation"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4.5 w-4.5" />
                  ) : (
                    <EyeIcon className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-2 px-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-[#547a6f]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#c3d5cd] text-[#43786b] focus:ring-0 cursor-pointer accent-[#43786b]"
                  />
                  <span>Ingat saya</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Silakan hubungi admin Farmora via email: support@farmora.id")}
                  className="text-[11px] font-bold text-[#326154] hover:text-[#1e4138] hover:underline transition cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || isDemoLoading}
              className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2d5a4f] via-[#386b5e] to-[#254d43] hover:from-[#244c42] hover:to-[#1d3d35] active:scale-[0.98] py-3.5 px-4 text-center font-bold text-white text-sm shadow-lg shadow-[#275349]/25 transition disabled:opacity-70 cursor-pointer touch-manipulation flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Memproses Masuk...</span>
                </span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="text-base font-normal">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ──────────────── Quick Demo Section (Interactive & Highly Clickable) ──────────────── */}
        <div className="w-full mt-4 px-1">
          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-[#dce7e1]" />
            <span className="text-[10.5px] font-bold text-[#7d9f95] uppercase tracking-widest">
              atau coba langsung
            </span>
            <div className="flex-1 h-px bg-[#dce7e1]" />
          </div>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isDemoLoading || isSubmitting}
            className="w-full relative group rounded-2xl bg-white hover:bg-emerald-50/50 active:bg-emerald-100/60 active:scale-[0.98] border-2 border-emerald-600/30 hover:border-emerald-600/60 p-3.5 text-center shadow-md shadow-emerald-950/5 transition-all duration-200 cursor-pointer touch-manipulation z-20"
          >
            <div className="flex items-center justify-center gap-2.5">
              {isDemoLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2d5a4f] border-t-transparent" />
                  <span className="text-sm font-extrabold text-[#275349]">
                    Membuka Demo Dashboard...
                  </span>
                </>
              ) : (
                <div className="text-center py-0.5">
                  <span className="text-sm font-extrabold text-[#275349] block leading-tight">
                    Akses Demo Instan (1-Klik)
                  </span>
                  <span className="text-[10.5px] text-[#5e887d] font-medium block mt-0.5">
                    Eksplor semua fitur petani tanpa perlu registrasi
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Register Link */}
          <p className="text-center text-xs text-[#5e887d] font-medium mt-4">
            Belum memiliki akun Farmora?{" "}
            <Link
              href="/register"
              className="font-extrabold text-[#275349] hover:underline underline-offset-2"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ──────────────── Footer Security Badge ──────────────── */}
      <div className="relative z-10 text-center pt-2">
        <div className="inline-flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-[#7a9d93]">
          <svg className="w-3.5 h-3.5 text-[#43786b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Sistem Pertanian Digital Terenkripsi &amp; Aman</span>
        </div>
      </div>
    </div>
  );
}
