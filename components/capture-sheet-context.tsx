"use client";

import { createContext, useContext } from "react";

export type CaptureSheetContextValue = {
  open: () => void;
};

export const CaptureSheetContext = createContext<CaptureSheetContextValue | null>(null);

export function useCaptureSheet() {
  const ctx = useContext(CaptureSheetContext);
  if (!ctx) {
    throw new Error("useCaptureSheet must be used within CaptureSheetProvider");
  }
  return ctx;
}
