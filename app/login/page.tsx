"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your username or email.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      router.push("/");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#598477] text-zinc-900 select-none overflow-hidden rounded-t-[32px]">
      {/* Top 60%: Large Illustration Banner with curved top-left and top-right radius */}
      <div className="relative w-full h-[58%] min-h-0 shrink-0 overflow-hidden bg-[#598477] flex items-center justify-center rounded-t-[32px]">
        {/* Subtle decorative concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <div className="h-64 w-64 rounded-full border border-white/40" />
          <div className="absolute h-96 w-96 rounded-full border border-white/30" />
          <div className="absolute h-[520px] w-[520px] rounded-full border border-white/20" />
        </div>

        {/* 3D isometric agriculture & tech illustration */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/login_illustration.jpg"
          alt="FARMORA Smart Agriculture Illustration"
          className="w-full h-full object-cover object-center rounded-t-[32px]"
        />
      </div>

      {/* Bottom 40%: Compact White Card with curved top-left and top-right radius */}
      <div className="relative -mt-6 flex-1 w-full min-h-0 bg-white rounded-t-[32px] px-6 pt-5 pb-5 shadow-2xl flex flex-col justify-between z-10">
        <div>
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-2xl font-bold text-[#275349] tracking-tight">Login</h1>
            <p className="text-xs text-[#6e8e85] mt-0.5 font-medium">
              Your journey is finally here
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-2 rounded-xl bg-red-50 border border-red-200 p-2 text-center text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-2.5">
            {/* Username or Email Input */}
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username or Email"
                className="w-full rounded-2xl bg-[#e3ece8] px-4 py-3 text-xs text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl bg-[#e3ece8] px-4 py-3 pr-11 text-xs text-[#275349] font-medium placeholder-[#8ea49d] focus:outline-none focus:ring-2 focus:ring-[#43786b]/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#597e74] hover:text-[#275349] transition"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => alert("Silakan hubungi administrator tim FARMORA.")}
                  className="text-xs font-semibold text-[#43786b] hover:text-[#275349] transition"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#43786b] hover:bg-[#38675c] active:scale-[0.98] py-3 text-center font-bold text-white text-sm shadow-sm transition disabled:opacity-70 mt-0.5"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Logging in...</span>
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="pt-2 flex flex-col items-center gap-1">
          <p className="text-xs text-[#6e8e85]">
            Don&apos;t have account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#275349] hover:underline"
            >
              Create one!
            </Link>
          </p>

          <button
            type="button"
            onClick={loginAsDemo}
            className="text-[10px] font-semibold text-[#507d71] hover:text-[#275349] hover:underline transition"
          >
            ⚡ Masuk Cepat sebagai Tamu (Mode Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
