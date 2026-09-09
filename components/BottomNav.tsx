"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AktivitasIcon, AnalisisIcon, CameraIcon, HomeIcon, ProfileIcon } from "./icons";
import { useCameraScanner } from "./CameraScanner";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/analisis", label: "Analisis", icon: AnalisisIcon },
  { href: "/aktivitas", label: "Aktivitas", icon: AktivitasIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { open } = useCameraScanner();

  // Do not show bottom nav on login, register, or deteksi screens
  if (pathname === "/login" || pathname === "/register" || pathname === "/deteksi") {
    return null;
  }

  const [leftItems, rightItems] = [NAV_ITEMS.slice(0, 2), NAV_ITEMS.slice(2)];

  function renderItem(item: (typeof NAV_ITEMS)[number]) {
    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex flex-1 flex-col items-center justify-center min-h-[48px] py-1.5 touch-manipulation transition-transform active:scale-90 select-none cursor-pointer"
      >
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-emerald-600" : "text-zinc-400 hover:text-zinc-600"
          }`}
        />
        <span
          className={`text-[10.5px] font-semibold tracking-tight transition-colors ${
            isActive ? "text-emerald-600 font-bold" : "text-zinc-400"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <nav className="w-full border-t border-zinc-200/90 bg-white/95 backdrop-blur-lg pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] shadow-[0_-4px_16px_rgba(0,0,0,0.03)] select-none">
      <div className="flex w-full items-center justify-between px-2">
        {leftItems.map(renderItem)}

        {/* Center Capture Shutter FAB */}
        <Link
          href="/deteksi"
          aria-label="Buka scanner deteksi kamera"
          className="relative flex flex-1 flex-col items-center justify-center min-h-[52px] py-1 touch-manipulation cursor-pointer select-none group active:scale-95 transition-transform z-50"
        >
          <div className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/35 ring-4 ring-white transition-all group-hover:bg-emerald-500">
            <CameraIcon className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-[10.5px] font-bold text-emerald-700 select-none">
            Deteksi
          </span>
        </Link>

        {rightItems.map(renderItem)}
      </div>
    </nav>
  );
}
