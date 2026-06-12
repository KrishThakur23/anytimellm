"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Business } from "@/lib/api";

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
}[] = [
  { id: "overview", label: "DASHBOARD" },
  { id: "ingest", label: "INGESTION" },
  { id: "catalog", label: "CATALOG" },
  { id: "playground", label: "TEST CLIENT" },
  { id: "integrations", label: "WHATSAPP SETUP" },
  { id: "orders", label: "ORDER INBOX" },
  { id: "chats", label: "LIVE CHATS" }
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
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.1,
      }
    );
  }, []);

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 relative overflow-hidden">
      <div className="relative z-10">
        {/* Business Identity Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="p-4 rounded-none bg-slate-50 border border-slate-200 flex flex-col gap-2" style={{ borderRadius: 12 }}>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase font-bold">
              ACTIVE SESSION
            </span>
            <h2 className="font-display text-base font-extrabold text-slate-800 truncate uppercase">
              {activeBusiness.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 border-t border-slate-200 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[8px] text-emerald-600 tracking-[0.15em] uppercase font-bold">
                STATUS: RUNNING
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav ref={navRef} className="mt-6 flex flex-col">
          {navItems.map((item) => {
            const isActive = tab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-item w-full text-left py-3.5 px-6 font-mono text-[11px] tracking-[0.2em] transition-all duration-300 border-l-[3px] cursor-pointer ${
                  isActive
                    ? "border-[#128C7E] text-[#075E54] bg-[#25D366]/10 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-50 hover:pl-7"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-slate-200 space-y-4">

 
        {/* Switch Shop */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 h-9 border border-red-200 hover:border-red-500 hover:bg-red-50/50 rounded-none bg-transparent text-red-600 hover:text-red-500 font-mono text-sm tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.98] cursor-pointer"
          style={{ borderRadius: 8 }}
        >
          <span className="material-symbols-outlined text-[13px]">logout</span>
          EXIT CONSOLE
        </button>
      </div>
    </aside>
  );
}
