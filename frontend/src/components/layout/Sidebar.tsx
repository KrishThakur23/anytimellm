"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Building,
  Activity,
  UploadCloud,
  Database,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { Business } from "@/lib/api";

type Tab = "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats";

interface SidebarProps {
  activeBusiness: Business;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const navItems: {
  id: Tab;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  hoverClass: string;
  activeClass: string;
  glowClass: string;
}[] = [
  {
    id: "overview",
    label: "📊 Shop Dashboard",
    icon: Activity,
    colorClass: "text-blue-500",
    hoverClass: "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 dark:hover:bg-blue-500/10",
    activeClass: "bg-blue-600 text-white font-black shadow-[0_4px_12px_rgba(37,99,235,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(59,130,246,0.25)] border-blue-500/40 bg-blue-500/[0.03] dark:bg-blue-500/[0.08]"
  },
  {
    id: "ingest",
    label: "📁 Upload Shop Files",
    icon: UploadCloud,
    colorClass: "text-purple-500",
    hoverClass: "hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/5 dark:hover:bg-purple-500/10",
    activeClass: "bg-purple-600 text-white font-black shadow-[0_4px_12px_rgba(147,51,234,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.25)] border-purple-500/40 bg-purple-500/[0.03] dark:bg-purple-500/[0.08]"
  },
  {
    id: "catalog",
    label: "🛍️ Product Catalog",
    icon: Database,
    colorClass: "text-amber-500",
    hoverClass: "hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-500/10",
    activeClass: "bg-amber-600 text-white font-black shadow-[0_4px_12px_rgba(217,119,6,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(245,158,11,0.25)] border-amber-500/40 bg-amber-500/[0.03] dark:bg-amber-500/[0.08]"
  },
  {
    id: "playground",
    label: "💬 Test Chatbot",
    icon: MessageSquare,
    colorClass: "text-emerald-500",
    hoverClass: "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10",
    activeClass: "bg-emerald-600 text-white font-black shadow-[0_4px_12px_rgba(5,150,105,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(16,185,129,0.25)] border-emerald-500/40 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.08]"
  },
  {
    id: "integrations",
    label: "📞 WhatsApp Setup",
    icon: Settings,
    colorClass: "text-cyan-500",
    hoverClass: "hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/5 dark:hover:bg-cyan-500/10",
    activeClass: "bg-cyan-600 text-white font-black shadow-[0_4px_12px_rgba(8,145,178,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(6,182,212,0.25)] border-cyan-500/40 bg-cyan-500/[0.03] dark:bg-cyan-500/[0.08]"
  },
  {
    id: "orders",
    label: "📦 Order Inbox",
    icon: Settings,
    colorClass: "text-rose-500",
    hoverClass: "hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10",
    activeClass: "bg-rose-600 text-white font-black shadow-[0_4px_12px_rgba(244,63,94,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(244,63,94,0.25)] border-rose-500/40 bg-rose-500/[0.03] dark:bg-rose-500/[0.08]"
  },
  {
    id: "chats",
    label: "💬 WhatsApp Chats",
    icon: MessageSquare,
    colorClass: "text-emerald-500",
    hoverClass: "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10",
    activeClass: "bg-emerald-600 text-white font-black shadow-[0_4px_12px_rgba(16,185,129,0.3)]",
    glowClass: "shadow-[0_0_15px_rgba(16,185,129,0.25)] border-emerald-500/40 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.08]"
  }
];

export default function Sidebar({
  activeBusiness,
  tab,
  onTabChange,
  onLogout,
  theme,
  toggleTheme,
}: SidebarProps) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll(".nav-item");
    gsap.fromTo(
      items,
      { opacity: 0, scale: 0.95, x: -16 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(1.4)",
        delay: 0.15,
      }
    );
  }, []);

  return (
    <aside className="w-64 border-r border-border-subtle bg-surface-container-low flex flex-col justify-between shrink-0 relative overflow-hidden transition-all duration-300">
      {/* Ambient electro-teal/sapphire glow (only in dark mode for aesthetic) */}
      <div
        className="absolute -top-24 -left-24 w-48 h-48 rounded-full pointer-events-none opacity-40 dark:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(5,243,173,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -right-20 w-40 h-40 rounded-full pointer-events-none opacity-20 dark:opacity-100"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Business Identity Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-parchment-surface dark:bg-surface-container border border-border-subtle transition-colors duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="p-2.5 bg-surface-container-low dark:bg-surface-2 rounded-lg border border-border-subtle flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-ink-text dark:text-primary-fixed-dim animate-spin" style={{ fontVariationSettings: "'FILL' 1", animationDuration: '6s' }}>token</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-xs tracking-tight text-ink-text truncate">
                {activeBusiness.name}
              </h2>
              <span className="flex items-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-extrabold mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                🏪 ACTIVE STORE (दुकान चालू है)
              </span>
              <span className="flex items-center gap-1 text-[8px] text-muted-gold dark:text-amber-400/80 uppercase tracking-widest font-black mt-1">
                <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>sparkles</span>
                AnytimeLLM Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className="px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = tab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-item group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition-all duration-300 font-black relative cursor-pointer active:scale-[0.95] hover:scale-[1.02] ${
                  isActive
                    ? `${item.activeClass}`
                    : `text-on-surface-variant ${item.hoverClass} border border-transparent`
                }`}
              >
                {/* Active indicator pill (Frosted/Lifted card effect) */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className={`absolute inset-0 border border-border-subtle rounded-xl shadow-md -z-10 ${item.glowClass}`}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[18px] transition-all duration-300 group-hover:scale-125 ${
                    isActive ? "text-white" : `${item.colorClass}`
                  }`}>
                    {item.id === "overview" && "space_dashboard"}
                    {item.id === "ingest" && "schema"}
                    {item.id === "catalog" && "library_books"}
                    {item.id === "playground" && "terminal"}
                    {item.id === "integrations" && "settings"}
                    {item.id === "orders" && "shopping_bag"}
                    {item.id === "chats" && "forum"}
                  </span>
                  <span className={isActive ? "text-white" : "text-ink-text dark:text-foreground"}>
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border-subtle relative z-10 space-y-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 text-xs font-black rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] border-2 border-emerald-400/30 transition-all duration-200 active:scale-[0.95] hover:scale-[1.02] cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <span className="material-symbols-outlined text-[16px] text-white">light_mode</span>
              ☀️ Switch to Day Mode
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px] text-white">dark_mode</span>
              🌙 Switch to Night Mode
            </>
          )}
        </button>
 
        {/* Change Tenant */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 text-xs font-black rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:shadow-[0_0_25px_rgba(244,63,94,0.75)] border-2 border-rose-400/40 transition-all duration-200 active:scale-[0.95] hover:scale-[1.02] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-white">logout</span>
          🔴 EXIT / Switch Shop (बाहर निकलें)
        </button>
      </div>
    </aside>
  );
}
