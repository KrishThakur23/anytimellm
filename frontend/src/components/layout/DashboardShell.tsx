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
    <div className="min-h-screen flex bg-oatmeal-bg text-ink-text relative transition-colors duration-300">
      {/* Ambient orbs */}
      <GradientOrb
        color={theme === "dark" ? "rgba(5, 243, 173, 0.04)" : "rgba(181, 140, 61, 0.04)"}
        size={500}
        top="-100px"
        right="-100px"
        duration={25}
      />
      <GradientOrb
        color={theme === "dark" ? "rgba(59, 130, 246, 0.03)" : "rgba(5, 243, 173, 0.03)"}
        size={400}
        top="60%"
        left="-80px"
        duration={30}
      />

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
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl relative z-10 transition-colors duration-300">
        {/* Grid pattern overlay */}
        <div
          className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 dark:opacity-40"
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
