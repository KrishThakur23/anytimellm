"use client";

import React from "react";
import Sidebar from "./Sidebar";
import ErrorBanner from "../ui/ErrorBanner";
import GradientOrb from "../effects/GradientOrb";
import type { Business } from "@/lib/api";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats";

interface DashboardShellProps {
  activeBusiness: Business;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  error: string | null;
  onDismissError: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  children: React.ReactNode;
}

export default function DashboardShell({
  activeBusiness,
  tab,
  onTabChange,
  onLogout,
  error,
  onDismissError,
  theme,
  toggleTheme,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen flex bg-black text-white relative">
      {/* Sidebar */}
      <Sidebar
        activeBusiness={activeBusiness}
        tab={tab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl relative z-10">
        {/* Grid pattern overlay */}
        <div
          className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-[0.03]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <ErrorBanner message={error} onDismiss={onDismissError} />
          {children}
        </div>
      </main>
    </div>
  );
}
