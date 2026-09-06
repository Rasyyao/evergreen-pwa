"use client";

import {
  ChevronRightIcon,
  PlantIcon,
  ProfileIcon,
  ShieldIcon,
  SignalIcon,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const MENU_ITEMS = [
  {
    label: "Pengaturan Akun",
    icon: <ProfileIcon className="h-4 w-4" />,
  },
  {
    label: "Preferensi Pertanian",
    icon: <PlantIcon className="h-4 w-4" />,
  },
  {
    label: "Notifikasi & Sensor IoT",
    icon: <SignalIcon className="h-4 w-4" />,
  },
  {
    label: "Pusat Bantuan",
    icon: <ShieldIcon className="h-4 w-4" />,
  },
  {
    label: "Tentang Aplikasi",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
        <path d="M12 8h.01M12 12v4" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Keluar",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleMenuClick = (item: string) => {
    if (item === "Keluar") {
      setShowLogoutConfirm(true);
    } else {
      setActiveModal(item);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-2 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Profil Petani</h1>
          <p className="text-xs text-zinc-500">Informasi akun dan preferensi lahan</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide uppercase">
          Terverifikasi
        </span>
      </header>

      {/* User Info Card */}
      <section className="flex items-center gap-3.5 rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-lg font-bold text-white shadow-md shadow-emerald-600/30">
          {user ? getInitials(user.name) : "PT"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-zinc-900 truncate">
            {user?.name || "Rasya Pratama"}
          </p>
          <p className="text-xs text-emerald-700 font-medium">
            Petani &middot; {user?.commodity || "Lahan Padi Sawah"}
          </p>
          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
            {user?.email || "petani@farmora.id"}
          </p>
        </div>
      </section>

      {/* Farm Stats Highlight */}
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 text-center shadow-xs">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Luas Lahan</p>
          <p className="text-sm font-bold text-zinc-900 mt-0.5">{user?.landSize || "2.4 ha"}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 text-center shadow-xs">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Sensor Aktif</p>
          <p className="text-sm font-bold text-emerald-600 mt-0.5">4 Titik</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 text-center shadow-xs">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Status AI</p>
          <p className="text-sm font-bold text-emerald-600 mt-0.5">Online</p>
        </div>
      </section>

      {/* Menu List */}
      <section className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-sm">
        {MENU_ITEMS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleMenuClick(item.label)}
            className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition active:bg-zinc-50 ${
              index !== MENU_ITEMS.length - 1 ? "border-b border-zinc-100" : ""
            } ${item.label === "Keluar" ? "text-red-600 font-semibold" : "text-zinc-800 font-medium"}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <ChevronRightIcon
              className={`h-4 w-4 ${item.label === "Keluar" ? "text-red-400" : "text-zinc-300"}`}
            />
          </button>
        ))}
      </section>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl text-center animate-in zoom-in-95 duration-150">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-1">Keluar Akun?</h3>
            <p className="text-xs text-zinc-500 mb-5">
              Anda akan dialihkan ke halaman masuk FARMORA.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-2xl border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 active:scale-95 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 rounded-2xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 active:scale-95 transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal Placeholder */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl text-center">
            <h3 className="text-base font-bold text-zinc-900 mb-2">{activeModal}</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Fitur {activeModal} sedang disiapkan untuk rilis versi demo Agropreneur 2026.
            </p>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-zinc-400 pt-2">
        FARMORA Precision Agrotech &middot; v0.1.0-preview
      </p>
    </div>
  );
}
