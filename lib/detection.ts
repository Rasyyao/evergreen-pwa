import type { Severity } from "@/lib/mock-data";

export type Detection = {
  class: string;
  display_name: string;
  confidence: number;
  bbox: [number, number, number, number];
  severity: Severity;
};

export type DetectionResult = {
  id?: string;
  detections: Detection[];
  count: number;
  summary: string;
};

export type StoredDetection = {
  result: DetectionResult;
  imageDataUrl: string;
  timestamp: string;
};

export const DETECTION_STORAGE_KEY = "evergreen:lastDetection";

export async function detectImage(image: Blob): Promise<DetectionResult> {
  const formData = new FormData();
  formData.append("image", image, "capture.jpg");

  const res = await fetch("/api/detect", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Deteksi gagal (${res.status})`);
  }

  return res.json();
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function captureVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context tidak tersedia."));
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gagal mengambil frame kamera."));
      },
      "image/jpeg",
      0.92
    );
  });
}
