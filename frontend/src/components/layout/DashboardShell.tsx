"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ErrorBanner from "../ui/ErrorBanner";
import UniversalSearch from "./UniversalSearch";
import { Bell, UserCircle2, ChevronDown } from "lucide-react";
import type { Business } from "@/lib/api";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats" | "analytics";

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
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 relative">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeBusiness={activeBusiness}
        tab={tab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 2. Main Content Center */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header Area */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          <div className="flex-1">
            <UniversalSearch />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            <button className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-md transition-colors hidden sm:flex">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                {activeBusiness.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{activeBusiness.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <button className="sm:hidden p-1 text-slate-400">
              <UserCircle2 className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Center Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative custom-scrollbar">
          <ErrorBanner message={error} onDismiss={onDismissError} />
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
