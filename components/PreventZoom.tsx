"use client";

import { useEffect } from "react";

export function PreventZoom() {
  useEffect(() => {
    // 1. Prevent iOS gesture zooming (pinch-to-zoom)
    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("gesturestart", handleGesture as EventListener, {
      passive: false,
    });
    document.addEventListener("gesturechange", handleGesture as EventListener, {
      passive: false,
    });
    document.addEventListener("gestureend", handleGesture as EventListener, {
      passive: false,
    });

    return () => {
      document.removeEventListener("gesturestart", handleGesture as EventListener);
      document.removeEventListener("gesturechange", handleGesture as EventListener);
      document.removeEventListener("gestureend", handleGesture as EventListener);
    };
  }, []);

  return null;
}
