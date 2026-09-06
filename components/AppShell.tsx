"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CameraScannerProvider } from "./CameraScanner";
import { MobileFrame } from "./MobileFrame";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CameraScannerProvider>
        <MobileFrame bottomNav={<BottomNav />}>
          <div className="flex-1 w-full h-full flex flex-col">{children}</div>
        </MobileFrame>
      </CameraScannerProvider>
    </AuthProvider>
  );
}
