"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

const COMMODITIES = ["Padi Sawah", "Palawija", "Hortikultura", "Perkebunan"];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [commodity, setCommodity] = useState("Padi Sawah");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Silakan isi nama lengkap Anda.");
      return;
    }
    if (!phone.trim()) {
      setError("Silakan isi nomor WhatsApp/Telepon aktif.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Silakan masukkan alamat email yang valid.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!termsAgreed) {
      setError("Anda harus menyetujui ketentuan layanan EVERGREEN.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name,
        email,
        phone,
        commodity,
        password,
      });
      router.push("/");
    } catch {
      setError("Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-4 pb-8 bg-[#f8fafc] text-zinc-900 select-none animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/login"
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-zinc-200 text-[#275349] shadow-xs transition active:scale-90"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-xs font-bold text-[#507d71] uppercase tracking-wider">
          Registrasi Petani
        </span>
        <div className="w-9" />
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#275349]">Buat Akun Baru</h1>
        <p className="text-xs text-[#6e8e85] mt-1">
          Lengkapi data lahan Anda untuk personalisasi rekomendasi perawatan.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-zinc-200/80 mb-5">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-2xl bg-[#e3ece8] py-2.5 px-4 text-sm text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Nomor WhatsApp / HP
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full rounded-2xl bg-[#e3ece8] py-2.5 px-4 text-sm text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
            />
          </div>

          {/* Alamat Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="petani@evergreen.id"
              className="w-full rounded-2xl bg-[#e3ece8] py-2.5 px-4 text-sm text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
            />
          </div>

          {/* Jenis Komoditas Lahan */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Komoditas Utama Lahan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMODITIES.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCommodity(item)}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold text-center transition ${
                    commodity === item
                      ? "bg-[#43786b] text-white shadow-xs"
                      : "bg-[#e3ece8] text-[#275349] hover:bg-[#d8e3de]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Kata Sandi */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-2xl bg-[#e3ece8] py-2.5 pl-4 pr-10 text-sm text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#597e74] hover:text-[#275349]"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Konfirmasi Sandi
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className="w-full rounded-2xl bg-[#e3ece8] py-2.5 px-4 text-sm text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
            />
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-zinc-600 leading-snug">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#43786b] focus:ring-[#43786b]"
              />
              <span>
                Saya menyetujui <strong className="text-[#275349]">Syarat &amp; Ketentuan</strong> serta{" "}
                <strong className="text-[#275349]">Kebijakan Privasi</strong> aplikasi EVERGREEN.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#43786b] hover:bg-[#38675c] py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <span>Daftar &amp; Masuk ke Lahan</span>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Login */}
      <div className="mt-auto text-center text-xs text-[#6e8e85]">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-bold text-[#275349] hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
