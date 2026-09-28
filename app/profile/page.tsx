"use client";

import {
  ChevronRightIcon,
  PlantIcon,
  ProfileIcon,
  ShieldIcon,
  SignalIcon,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

type ModalId = "akun" | "preferensi" | "notifikasi" | "bantuan" | "tentang";

const MENU_ITEMS: { id: ModalId; label: string; icon: React.ReactNode }[] = [
  {
    id: "akun",
    label: "Pengaturan Akun",
    icon: <ProfileIcon className="h-4 w-4" />,
  },
  {
    id: "preferensi",
    label: "Preferensi Pertanian",
    icon: <PlantIcon className="h-4 w-4" />,
  },
  {
    id: "notifikasi",
    label: "Notifikasi & Sensor IoT",
    icon: <SignalIcon className="h-4 w-4" />,
  },
  {
    id: "bantuan",
    label: "Pusat Bantuan",
    icon: <ShieldIcon className="h-4 w-4" />,
  },
  {
    id: "tentang",
    label: "Tentang Aplikasi",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
        <path d="M12 8h.01M12 12v4" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
];

const LOGOUT_ICON = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, [key]);

  const update = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore write failure (e.g. private browsing quota)
    }
  };

  return [value, update] as const;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-800">{label}</span>
        {description && (
          <span className="block text-[11px] text-zinc-400 mt-0.5">{description}</span>
        )}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-600" : "bg-zinc-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-zinc-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 active:scale-90 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AccountSettingsModal({ onClose }: { onClose: () => void }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    landSize: user?.landSize ?? "",
    commodity: user?.commodity ?? "",
  });
  const [saved, setSaved] = useState(false);

  const field = (
    key: keyof typeof form,
    label: string,
    type: "text" | "email" = "text"
  ) => (
    <label className="block">
      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => {
          setSaved(false);
          setForm((prev) => ({ ...prev, [key]: e.target.value }));
        }}
        className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );

  return (
    <Modal title="Pengaturan Akun" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {field("name", "Nama Lengkap")}
        {field("email", "Email", "email")}
        {field("phone", "Nomor Telepon")}
        {field("landSize", "Luas Lahan")}
        {field("commodity", "Komoditas")}

        <button
          type="button"
          onClick={() => {
            updateUser(form);
            setSaved(true);
          }}
          className="mt-2 w-full rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 active:scale-95 transition"
        >
          {saved ? "Tersimpan ✓" : "Simpan Perubahan"}
        </button>
      </div>
    </Modal>
  );
}

function FarmPreferencesModal({ onClose }: { onClose: () => void }) {
  const [autoRecommend, setAutoRecommend] = usePersistedState(
    "agriva_pref_auto_recommend",
    true
  );
  const [weatherAlert, setWeatherAlert] = usePersistedState(
    "agriva_pref_weather_alert",
    true
  );
  const [irrigationMode, setIrrigationMode] = usePersistedState<"manual" | "otomatis">(
    "agriva_pref_irrigation_mode",
    "otomatis"
  );

  return (
    <Modal title="Preferensi Pertanian" onClose={onClose}>
      <div className="flex flex-col divide-y divide-zinc-100">
        <Toggle
          checked={autoRecommend}
          onChange={setAutoRecommend}
          label="Rekomendasi Otomatis AI"
          description="Terapkan dosis pestisida/herbisida hasil deteksi secara otomatis"
        />
        <Toggle
          checked={weatherAlert}
          onChange={setWeatherAlert}
          label="Peringatan Cuaca Ekstrem"
          description="Notifikasi saat kondisi cuaca berisiko untuk penyemprotan"
        />
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
          Mode Irigasi
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["manual", "otomatis"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setIrrigationMode(mode)}
              className={`rounded-xl py-2.5 text-xs font-bold capitalize transition ${
                irrigationMode === mode
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

const SENSORS = [
  { id: "AGRIVA-01", zone: "Petak A", status: "Online" as const },
  { id: "AGRIVA-02", zone: "Petak B", status: "Online" as const },
  { id: "AGRIVA-03", zone: "Petak C", status: "Online" as const },
  { id: "AGRIVA-04", zone: "Petak D", status: "Offline" as const },
];

function NotificationSensorModal({ onClose }: { onClose: () => void }) {
  const [pushEnabled, setPushEnabled] = usePersistedState("agriva_notif_push", true);
  const [emailEnabled, setEmailEnabled] = usePersistedState("agriva_notif_email", false);
  const [smsEnabled, setSmsEnabled] = usePersistedState("agriva_notif_sms", false);

  return (
    <Modal title="Notifikasi & Sensor IoT" onClose={onClose}>
      <div className="flex flex-col divide-y divide-zinc-100 mb-3">
        <Toggle checked={pushEnabled} onChange={setPushEnabled} label="Notifikasi Push" />
        <Toggle checked={emailEnabled} onChange={setEmailEnabled} label="Notifikasi Email" />
        <Toggle checked={smsEnabled} onChange={setSmsEnabled} label="Notifikasi SMS" />
      </div>

      <div className="pt-3 border-t border-zinc-100">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
          Sensor Terpasang
        </span>
        <div className="mt-2 flex flex-col gap-2">
          {SENSORS.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2"
            >
              <div>
                <p className="text-xs font-bold text-zinc-800">{sensor.id}</p>
                <p className="text-[10px] text-zinc-400">{sensor.zone}</p>
              </div>
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${
                  sensor.status === "Online" ? "text-emerald-600" : "text-zinc-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    sensor.status === "Online" ? "bg-emerald-500" : "bg-zinc-300"
                  }`}
                />
                {sensor.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

const FAQ_ITEMS = [
  {
    q: "Bagaimana cara memulai deteksi hama & gulma?",
    a: "Ketuk tombol kamera di navigasi bawah, arahkan ke tanaman, lalu ambil gambar. AI akan menganalisis dalam beberapa detik.",
  },
  {
    q: "Kenapa sensor IoT saya menunjukkan status Offline?",
    a: "Periksa koneksi daya dan jaringan pada perangkat sensor di lapangan, lalu tunggu hingga 1 menit untuk sinkronisasi ulang.",
  },
  {
    q: "Apakah data analisis saya tersimpan otomatis?",
    a: "Ya, setiap hasil deteksi otomatis tersimpan di riwayat Analisis dan dapat dibuka kembali kapan saja.",
  },
];

function HelpCenterModal({ onClose }: { onClose: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Modal title="Pusat Bantuan" onClose={onClose}>
      <div className="flex flex-col gap-2">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.q}
              className="rounded-xl border border-zinc-100 bg-zinc-50/70 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
              >
                <span className="text-xs font-semibold text-zinc-800">{item.q}</span>
                <ChevronRightIcon
                  className={`h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="px-3 pb-3 text-[11px] leading-relaxed text-zinc-500">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
        <p className="text-[11px] text-zinc-400">Butuh bantuan lebih lanjut?</p>
        <p className="text-xs font-semibold text-emerald-700 mt-0.5">support@agriva.id</p>
      </div>
    </Modal>
  );
}

function AboutAppModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Tentang Aplikasi" onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-2 mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-600/30">
          <PlantIcon className="h-7 w-7" />
        </div>
        <p className="text-sm font-bold text-zinc-900">AGRIVA Precision Agrotech</p>
        <p className="text-[11px] text-zinc-400">Versi 0.1.0-preview</p>
      </div>
      <p className="text-xs leading-relaxed text-zinc-500 text-center">
        Platform pertanian presisi berbasis AI untuk deteksi hama &amp; gulma, pemantauan
        lahan real-time, dan rekomendasi penanganan otomatis bagi petani Indonesia.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {["Computer Vision", "IoT Sensor", "Precision Spray"].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </Modal>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
            {user?.email || "petani@agriva.id"}
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
            key={item.id}
            type="button"
            onClick={() => setActiveModal(item.id)}
            className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition active:bg-zinc-50 text-zinc-800 font-medium ${
              index !== MENU_ITEMS.length - 1 ? "border-b border-zinc-100" : ""
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <ChevronRightIcon className="h-4 w-4 text-zinc-300" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition active:bg-zinc-50 border-t border-zinc-100 text-red-600 font-semibold"
        >
          <span className="flex items-center gap-3">
            <span className="text-base">{LOGOUT_ICON}</span>
            <span>Keluar</span>
          </span>
          <ChevronRightIcon className="h-4 w-4 text-red-400" />
        </button>
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
              Anda akan dialihkan ke halaman masuk AGRIVA.
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

      {activeModal === "akun" && (
        <AccountSettingsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "preferensi" && (
        <FarmPreferencesModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "notifikasi" && (
        <NotificationSensorModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "bantuan" && (
        <HelpCenterModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "tentang" && <AboutAppModal onClose={() => setActiveModal(null)} />}

      <p className="text-center text-[11px] text-zinc-400 pt-2">
        AGRIVA Precision Agrotech &middot; v0.1.0-preview
      </p>
    </div>
  );
}
