"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getRandomAnalisisId } from "@/lib/mock-data";
import { FarmoraLogoIcon, GalleryIcon } from "./icons";

interface CameraScannerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CameraScannerContext = createContext<CameraScannerContextValue | null>(null);

export function useCameraScanner() {
  const ctx = useContext(CameraScannerContext);
  if (!ctx) {
    throw new Error("useCameraScanner must be used within CameraScannerProvider");
  }
  return ctx;
}

// Retain compatibility with useCaptureSheet
export const useCaptureSheet = useCameraScanner;

export function CameraScannerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [flashMode, setFlashMode] = useState<"off" | "on" | "auto">("auto");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("Memindai citra daun...");

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const open = () => {
    setIsOpen(true);
    startCamera(facingMode);
  };

  const close = () => {
    stopCamera();
    setIsOpen(false);
    setIsProcessing(false);
  };

  // Start real device camera
  const startCamera = async (facing: "environment" | "user") => {
    stopCamera();
    setCameraError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Kamera tidak didukung di peramban ini.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
    } catch (err) {
      console.warn("Camera access fallback:", err);
      setCameraError("Izin kamera belum diberikan. Menggunakan mode simulasi.");
    }
  };

  // Bind media stream to video element whenever stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn("Video play interrupted:", err);
      });
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // When facingMode is flipped while camera is open, restart camera
  useEffect(() => {
    // Only restart for facingMode changes when already open (not initial mount)
    if (isOpen && stream) {
      startCamera(facingMode);
    }
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  // Flip camera between front & back
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Trigger snapshot & processing
  const handleCapture = () => {
    setIsCapturing(true);

    // Flash animation duration
    setTimeout(() => {
      setIsCapturing(false);
      startAnalysis();
    }, 300);
  };

  // Handle image upload from file picker (Galeri)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startAnalysis();
    }
    e.target.value = "";
  };

  const startAnalysis = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setProcessingStep("Ekstraksi fitur morfologi...");
    }, 600);

    setTimeout(() => {
      setProcessingStep("Mencocokkan basis data Gulma & Hama...");
    }, 1200);

    setTimeout(() => {
      const targetId = getRandomAnalisisId();
      stopCamera();
      setIsOpen(false);
      setIsProcessing(false);
      router.push(`/analisis/${targetId}`);
    }, 1800);
  };

  return (
    <CameraScannerContext.Provider value={{ isOpen, open, close }}>
      {children}

      {/* Hidden File Input for Bottom Gallery Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Full-Screen Native-Styled Camera Interface */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black text-white select-none animate-in fade-in duration-200 overflow-hidden overscroll-none" style={{ touchAction: "manipulation" }}>
          {/* Shutter Flash Animation overlay */}
          {isCapturing && (
            <div className="absolute inset-0 z-50 bg-white animate-shutter-flash pointer-events-none" />
          )}

          {/* Top Camera Controls Bar */}
          <div className="relative z-30 flex items-center justify-between px-5 pt-4 pb-3 bg-gradient-to-b from-black/80 to-transparent">
            {/* Close Button (X) */}
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition active:scale-90 cursor-pointer"
              aria-label="Tutup kamera"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* AI Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI DETEKSI AKTIF</span>
            </div>

            {/* Flash Mode Toggle */}
            <button
              type="button"
              onClick={() =>
                setFlashMode((prev) => (prev === "auto" ? "on" : prev === "on" ? "off" : "auto"))
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition active:scale-90 text-xs font-bold cursor-pointer"
              aria-label="Mode Flash"
            >
              {flashMode === "auto" ? (
                <span className="text-amber-400">⚡A</span>
              ) : flashMode === "on" ? (
                <span className="text-amber-300">⚡ON</span>
              ) : (
                <span className="text-zinc-400">⚡OFF</span>
              )}
            </button>
          </div>

          {/* Camera Viewfinder Area */}
          <div className="relative flex-1 w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
            {/* Live Video Feed */}
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                {...({ "webkit-playsinline": "" } as any)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              /* Simulated high-tech viewfinder background */
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 flex flex-col items-center justify-center p-6 text-center">
                {/* Background grid pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, #000 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3 max-w-[280px]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <svg className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="3" strokeWidth={1.8} />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {cameraError ? cameraError : "Memulai kamera perangkat..."}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Arahkan ke daun tanaman, hama, atau gulma untuk memindai otomatis.
                  </p>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="mt-1 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold tracking-wide shadow-lg shadow-emerald-600/40 transition-all cursor-pointer"
                  >
                    Beri Izin Kamera
                  </button>
                </div>
              </div>
            )}

            {/* Viewfinder Reticle & Laser Scan Lines */}
            <div className="relative z-20 w-[270px] h-[340px] pointer-events-none flex flex-col items-center justify-between">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-xl shadow-sm shadow-emerald-500/50" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-xl shadow-sm shadow-emerald-500/50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-xl shadow-sm shadow-emerald-500/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-xl shadow-sm shadow-emerald-500/50" />

              {/* Animated scanning laser line */}
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-laser" />

              {/* Viewfinder Target center mark */}
              <div className="m-auto flex items-center justify-center h-10 w-10">
                <span className="h-2 w-2 rounded-full bg-emerald-400/80 animate-ping" />
              </div>

              {/* Helper pill indicator inside viewfinder */}
              <div className="mb-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/90 text-[11px] font-medium tracking-wide">
                Posisikan objek di dalam kotak
              </div>
            </div>

            {/* Analysis State Modal Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md px-6 text-center animate-in fade-in duration-200">
                <div className="relative flex h-20 w-20 items-center justify-center mb-4">
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-400">
                    <FarmoraLogoIcon className="h-5 w-5 text-emerald-400" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Menganalisis Spesies</h3>
                <p className="text-xs text-emerald-400 font-mono tracking-wide">{processingStep}</p>
                <div className="w-48 h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full animate-pulse w-3/4 transition-all duration-500" />
                </div>
              </div>
            )}
          </div>

          {/* Camera App Bottom Controls */}
          <div className="relative z-30 flex flex-col items-center justify-end px-6 pt-4 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent">
            {/* Main Action Buttons Bar */}
            <div className="w-full flex items-center justify-between px-4 max-w-[340px]">
              {/* Bottom Left: Upload dari Galeri Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1 text-white/90 active:scale-90 transition"
                aria-label="Upload dari galeri"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur shadow-sm">
                  <GalleryIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-zinc-300">Galeri</span>
              </button>

              {/* Bottom Center: Big Circular Shutter Button */}
              <button
                type="button"
                onClick={handleCapture}
                className="relative flex h-18 w-18 items-center justify-center rounded-full border-[4px] border-white p-1 transition active:scale-95 shadow-xl shadow-emerald-600/30"
                aria-label="Ambil foto"
              >
                <span className="h-full w-full rounded-full bg-white transition hover:bg-emerald-400 active:bg-emerald-500 flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-emerald-600" />
                </span>
              </button>

              {/* Bottom Right: Flip Camera Button */}
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="flex flex-col items-center gap-1 text-white/90 active:scale-90 transition"
                aria-label="Putar kamera"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur shadow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-zinc-300">Putar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </CameraScannerContext.Provider>
  );
}
