"use client";

// Re-export CameraScanner as the new capture interface
export {
  CameraScannerProvider as CaptureSheetProvider,
  useCameraScanner as useCaptureSheet,
} from "./CameraScanner";
