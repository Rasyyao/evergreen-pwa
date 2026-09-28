"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EverGreenLogoIcon, GalleryIcon } from "@/components/icons";
import { getDeviceList } from "@/lib/mock-data";
import {
  DETECTION_STORAGE_KEY,
  blobToDataUrl,
  captureVideoFrame,
  detectImage,
  type StoredDetection,
} from "@/lib/detection";

export default function DeteksiPage() {
  const router = useRouter();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [flashMode, setFlashMode] = useState<"off" | "on" | "auto">("auto");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("Memindai citra daun...");
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showDeviceSheet, setShowDeviceSheet] = useState(false);
  const [devices, setDevices] = useState(() => getDeviceList());

  // Debug state for mobile troubleshooting
  const [debugInfo, setDebugInfo] = useState<{
    isSecureContext: boolean | null;
    hasMediaDevices: boolean | null;
    hasGetUserMedia: boolean | null;
    userAgent: string;
    protocol: string;
    lastError: string | null;
  }>({
    isSecureContext: null,
    hasMediaDevices: null,
    hasGetUserMedia: null,
    userAgent: "",
    protocol: "",
    lastError: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Populate debug info on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDebugInfo({
        isSecureContext: window.isSecureContext,
        hasMediaDevices: !!navigator.mediaDevices,
        hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        userAgent: navigator.userAgent.slice(0, 120),
        protocol: window.location.protocol,
        lastError: null,
      });
    }
  }, []);

  // Camera start - ONLY called from direct user gesture (tap/click)
  const startCamera = useCallback(async (facing: "environment" | "user", switching = false) => {
    if (switching) setIsSwitching(true);
    // Stop any existing stream first
    setStream((prev) => {
      if (prev) {
        prev.getTracks().forEach((track) => track.stop());
      }
      return null;
    });
    setCameraError(null);

    // Check prerequisites
    if (typeof navigator === "undefined") {
      const msg = "Navigator API tidak tersedia.";
      setCameraError(msg);
      setDebugInfo((prev) => ({ ...prev, lastError: msg }));
      return;
    }

    if (!navigator.mediaDevices) {
      const msg = window.isSecureContext
        ? "navigator.mediaDevices tidak tersedia. Coba refresh halaman."
        : "Kamera memerlukan HTTPS. Buka via link HTTPS ngrok, bukan HTTP.";
      setCameraError(msg);
      setDebugInfo((prev) => ({ ...prev, lastError: msg }));
      return;
    }

    if (!navigator.mediaDevices.getUserMedia) {
      const msg = "getUserMedia tidak didukung di browser ini.";
      setCameraError(msg);
      setDebugInfo((prev) => ({ ...prev, lastError: msg }));
      return;
    }

    // Try multiple constraint tiers
    const tiers = [
      // Tier 1: Ideal with resolution
      {
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      },
      // Tier 2: Simple facingMode
      { video: { facingMode: facing }, audio: false },
      // Tier 3: Just video
      { video: true, audio: false },
    ];

    for (let i = 0; i < tiers.length; i++) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          tiers[i] as MediaStreamConstraints
        );
        setStream(mediaStream);
        setCameraStarted(true);
        setIsSwitching(false);
        setDebugInfo((prev) => ({ ...prev, lastError: null }));
        return; // Success!
      } catch (err: unknown) {
        const error = err as DOMException;
        console.warn(`Camera tier ${i + 1} failed:`, error.name, error.message);

        if (i === tiers.length - 1) {
          // All tiers failed
          let userMsg: string;
          if (error.name === "NotAllowedError") {
            userMsg =
              "Izin kamera ditolak. Buka Settings > Safari > Camera dan izinkan untuk situs ini. Lalu refresh.";
          } else if (error.name === "NotFoundError") {
            userMsg = "Tidak ada kamera ditemukan pada perangkat ini.";
          } else if (error.name === "NotReadableError" || error.name === "AbortError") {
            userMsg = "Kamera sedang digunakan aplikasi lain. Tutup app lain lalu coba lagi.";
          } else if (error.name === "OverconstrainedError") {
            userMsg = "Resolusi kamera tidak didukung, coba lagi.";
          } else {
            userMsg = `Gagal mengakses kamera: ${error.name} - ${error.message}`;
          }
          setCameraError(userMsg);
          setIsSwitching(false);
          setDebugInfo((prev) => ({
            ...prev,
            lastError: `${error.name}: ${error.message}`,
          }));
        }
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    setStream((prev) => {
      if (prev) {
        prev.getTracks().forEach((track) => track.stop());
      }
      return null;
    });
  }, []);

  // Bind media stream to video element
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      // Use a small delay for iOS Safari to properly bind srcObject
      const timer = setTimeout(() => {
        video.play().catch((err) => {
          console.warn("Video play interrupted:", err);
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [stream]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setStream((prev) => {
        if (prev) {
          prev.getTracks().forEach((track) => track.stop());
        }
        return null;
      });
    };
  }, []);

  // When facingMode changes and camera was already started, restart
  useEffect(() => {
    if (cameraStarted) {
      startCamera(facingMode, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleCapture = () => {
    if (stream && videoRef.current) {
      setIsCapturing(true);
      setTimeout(async () => {
        setIsCapturing(false);
        try {
          const blob = await captureVideoFrame(videoRef.current!);
          await startAnalysis(blob);
        } catch (err) {
          setProcessingError(err instanceof Error ? err.message : "Gagal mengambil gambar.");
          setIsProcessing(true);
        }
      }, 300);
    } else {
      // If live WebRTC stream is unavailable, seamlessly open native camera
      cameraInputRef.current?.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startAnalysis(file);
    }
    e.target.value = "";
  };

  const startAnalysis = async (image: Blob) => {
    setIsProcessing(true);
    setProcessingError(null);
    setProcessingStep("Mengirim gambar ke server AI...");

    try {
      const [result, imageDataUrl] = await Promise.all([
        detectImage(image),
        blobToDataUrl(image),
      ]);

      setProcessingStep("Mencocokkan basis data Gulma & Hama...");

      const stored: StoredDetection = {
        result,
        imageDataUrl,
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem(DETECTION_STORAGE_KEY, JSON.stringify(stored));

      stopCamera();
      router.push("/analisis/hasil");
    } catch (err) {
      setProcessingError(
        err instanceof Error ? err.message : "Deteksi gagal. Coba lagi."
      );
    }
  };

  const handleRetry = () => {
    setIsProcessing(false);
    setProcessingError(null);
  };

  const handleClose = () => {
    stopCamera();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Handle "Mulai Kamera" button - MUST be from direct user gesture for iOS Safari
  const handleStartCamera = () => {
    startCamera(facingMode);
  };

  return (
    <div className="fixed inset-0 md:relative z-50 w-full h-[100dvh] flex flex-col bg-black text-white select-none overflow-hidden overscroll-none" style={{ touchAction: "manipulation" }}>
      {/* Hidden File Input for Gallery Picker */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Hidden File Input for Direct Native Phone Camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Shutter Flash Animation overlay */}
      {isCapturing && (
        <div className="absolute inset-0 z-50 bg-white animate-shutter-flash pointer-events-none" />
      )}

        {/* Top Camera Controls Bar */}
      <div className="relative z-30 flex items-center justify-between px-5 pt-4 pb-3 bg-gradient-to-b from-black/80 to-transparent">
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition active:scale-90 cursor-pointer"
          aria-label="Kembali"
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

        {/* Right side: Flash + Connect Device */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => setShowDeviceSheet(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur transition active:scale-90 cursor-pointer"
            aria-label="Hubungkan perangkat"
          >
            {/* Bluetooth-style icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 6l8 6-8 6V6zM16 6v12"
              />
              <circle
                cx="19"
                cy="6"
                r="2"
                fill={devices.some((d) => d.status === "connected") ? "#34d399" : "#71717a"}
                stroke="none"
              />
            </svg>
          </button>
        </div>
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
        ) : isSwitching ? (
          /* Loading state while switching cameras */
          <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center mb-3">
              <span className="absolute inset-0 rounded-full border-[3px] border-emerald-500/20" />
              <span className="absolute inset-0 rounded-full border-[3px] border-emerald-400 border-t-transparent animate-spin" />
              <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-zinc-200">Mengganti kamera...</p>
          </div>
        ) : (
          /* Viewfinder fallback — user MUST tap to start camera (iOS Safari requirement) */
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
            <div className="relative z-10 flex flex-col items-center gap-3 max-w-[290px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/20">
                <svg className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" strokeWidth={1.8} />
                </svg>
              </div>

              <p className="text-sm font-semibold text-zinc-100">
                {cameraError
                  ? cameraError
                  : "Ketuk tombol di bawah untuk mengaktifkan kamera"}
              </p>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Arahkan ke daun tanaman, hama, atau gulma untuk memindai otomatis.
              </p>

              <div className="flex flex-col gap-2 w-full mt-1">
                {/* Button 1: Request Browser Camera Permission — direct user gesture */}
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold tracking-wide shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  📷 Mulai Kamera
                </button>

                {/* Button 2: Direct Native Phone Camera (100% Guaranteed on Mobile) */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 border border-zinc-700 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CameraIcon className="h-4 w-4 text-emerald-400" />
                  <span>Buka Kamera Bawaan HP</span>
                </button>
              </div>

              {/* Debug Info Panel — helps diagnose mobile issues */}
              {(cameraError || debugInfo.lastError) && (
                <details className="w-full mt-2 text-left">
                  <summary className="text-[10px] text-zinc-500 cursor-pointer hover:text-zinc-300 transition">
                    🔍 Info Debug Kamera
                  </summary>
                  <div className="mt-1 p-2 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-[10px] text-zinc-400 space-y-0.5 font-mono">
                    <p>Secure: <span className={debugInfo.isSecureContext ? "text-emerald-400" : "text-red-400"}>{String(debugInfo.isSecureContext)}</span></p>
                    <p>Protocol: {debugInfo.protocol}</p>
                    <p>MediaDevices: <span className={debugInfo.hasMediaDevices ? "text-emerald-400" : "text-red-400"}>{String(debugInfo.hasMediaDevices)}</span></p>
                    <p>getUserMedia: <span className={debugInfo.hasGetUserMedia ? "text-emerald-400" : "text-red-400"}>{String(debugInfo.hasGetUserMedia)}</span></p>
                    {debugInfo.lastError && (
                      <p className="text-red-400 break-all">Error: {debugInfo.lastError}</p>
                    )}
                    <p className="break-all text-zinc-500">{debugInfo.userAgent}</p>
                  </div>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Viewfinder Reticle & Laser Scan Lines */}
        <div className="relative z-20 w-[270px] h-[340px] pointer-events-none flex flex-col items-center justify-between">
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

          {/* Helper pill indicator */}
          <div className="mb-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/90 text-[11px] font-medium tracking-wide">
            Posisikan objek di dalam kotak
          </div>
        </div>

        {/* Analysis State Modal Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md px-6 text-center animate-in fade-in duration-200">
            {processingError ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 mb-4">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Deteksi Gagal</h3>
                <p className="text-xs text-zinc-300 max-w-[260px]">{processingError}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold tracking-wide shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  Coba Lagi
                </button>
              </>
            ) : (
              <>
                <div className="relative flex h-20 w-20 items-center justify-center mb-4">
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-400">
                    <EverGreenLogoIcon className="h-5 w-5 text-emerald-400" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Menganalisis Spesies</h3>
                <p className="text-xs text-emerald-400 font-mono tracking-wide">{processingStep}</p>
                <div className="w-48 h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full animate-pulse w-3/4 transition-all duration-500" />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Camera App Bottom Controls */}
      <div className="relative z-30 flex flex-col items-center justify-end px-6 pt-4 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent">
        {/* Main Action Buttons Bar */}
        <div className="w-full flex items-center justify-between px-4 max-w-[340px]">
          {/* Gallery Button */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-white/90 active:scale-90 transition cursor-pointer"
            aria-label="Upload dari galeri"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur shadow-sm">
              <GalleryIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-[10px] font-medium text-zinc-300">Galeri</span>
          </button>

          {/* Shutter Button: Captures live stream or opens native mobile camera */}
          <button
            type="button"
            onClick={handleCapture}
            className="relative flex h-18 w-18 items-center justify-center rounded-full border-[4px] border-white p-1 transition active:scale-95 shadow-xl shadow-emerald-600/30 cursor-pointer"
            aria-label="Ambil foto"
          >
            <span className="h-full w-full rounded-full bg-white transition hover:bg-emerald-400 active:bg-emerald-500 flex items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-emerald-600" />
            </span>
          </button>

          {/* Flip Camera Button */}
          <button
            type="button"
            onClick={toggleCameraFacing}
            className="flex flex-col items-center gap-1 text-white/90 active:scale-90 transition cursor-pointer"
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

      {/* ── Connect Device Bottom Sheet ── */}
      {showDeviceSheet && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeviceSheet(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-zinc-900 border-t border-zinc-700/60 px-5 pt-4 pb-10 animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-600" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-white">Hubungkan Perangkat</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {devices.filter((d) => d.status === "connected").length}/{devices.length} sensor terhubung
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeviceSheet(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition active:scale-90 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Device List */}
            <div className="flex flex-col gap-2.5">
              {devices.map((device) => {
                const isOn = device.status === "connected";
                return (
                  <div
                    key={device.id}
                    className="flex items-center justify-between rounded-2xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-3"
                  >
                    {/* Left: icon + info */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                          isOn
                            ? "bg-emerald-500/15 border border-emerald-500/30"
                            : "bg-zinc-700 border border-zinc-600"
                        }`}
                      >
                        {/* IoT device icon */}
                        <svg className={`h-5 w-5 ${isOn ? "text-emerald-400" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={1.8} />
                          <path strokeLinecap="round" strokeWidth={1.8} d="M8 7V5a4 4 0 018 0v2" />
                          <circle cx="12" cy="14" r="2" strokeWidth={1.8} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{device.id}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {device.lahanName ?? "–"} · Baterai {device.battery}%
                        </p>
                      </div>
                    </div>

                    {/* Right: status + button */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold ${
                          isOn ? "text-emerald-400" : "text-zinc-500"
                        }`}
                      >
                        {isOn ? "Terhubung" : "Offline"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDevices((prev) =>
                            prev.map((d) =>
                              d.id === device.id
                                ? { ...d, status: d.status === "connected" ? "disconnected" : "connected" }
                                : d
                            )
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition active:scale-95 cursor-pointer ${
                          isOn
                            ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                            : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
                        }`}
                      >
                        {isOn ? "Putus" : "Sambung"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <circle cx="12" cy="13" r="3" strokeWidth={2} />
    </svg>
  );
}
