"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Business, CatalogItem, DocumentInfo } from "@/lib/api";
import { Copy, Check } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

interface OverviewTabProps {
  activeBusiness: Business;
  documents: DocumentInfo[];
  catalog: CatalogItem[];
  copied: boolean;
  copyToClipboard: (text: string) => void;
  onTabChange?: (tab: "overview" | "ingest" | "catalog" | "playground" | "integrations") => void;
}

export default function OverviewTab({
  activeBusiness,
  documents,
  catalog,
  copied,
  copyToClipboard,
  onTabChange,
}: OverviewTabProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
    if (logRef.current) {
      gsap.fromTo(
        logRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.25 }
      );
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-text">
          Shop Dashboard
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 font-semibold">
          Monitor your WhatsApp assistant and customer chat records.
        </p>
      </div>

      {/* Tenant Indicator (Stitch style) */}
      <section className="mb-4">
        <div className="flex items-center justify-between p-4 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <p className="font-label-xs text-[9px] text-on-surface-variant uppercase tracking-widest font-extrabold mb-0.5">CURRENT ACTIVE STORE</p>
              <p className="font-body-md text-sm font-bold text-ink-text">{activeBusiness.name}</p>
            </div>
          </div>
          <span className="font-label-sm text-[10px] text-muted-gold font-mono uppercase tracking-widest font-bold">
            Chatbot Active & Running
          </span>
        </div>
      </section>

      {/* High-Level KPIs (Stitch Bento Style Grid) */}
      <section ref={cardsRef} className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
        <div className="md:col-span-2 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/30 p-6 flex flex-col justify-between rounded-xl shadow-sm relative overflow-hidden min-h-[160px] hover:scale-[1.01] transition-transform duration-200">
          <div>
            <span className="font-label-xs text-label-xs text-blue-700 dark:text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              💬 Total Customer Chats (कुल ग्राहक बातचीत)
            </span>
            <h2 className="font-display-lg text-4xl mt-3 text-ink-text tracking-tighter leading-none font-black text-blue-600 dark:text-blue-400">
              <AnimatedCounter target={14208} />
            </h2>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[16px] font-bold">trending_up</span>
            <span className="text-[10px] font-label-xs text-blue-700 dark:text-blue-400 font-black tracking-wider">📈 More customer chats this week!</span>
          </div>
          {/* Sparkline background */}
          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-15 dark:opacity-25" preserveAspectRatio="none" viewBox="0 0 100 50">
            <path className="sparkline-path" d="M0,40 L20,35 L40,45 L60,20 L80,25 L100,5" fill="none" stroke="#2563eb" strokeWidth="2"></path>
          </svg>
        </div>

        <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[160px] hover:scale-[1.01] transition-transform duration-200">
          <div>
            <span className="font-label-xs text-label-xs text-amber-700 dark:text-amber-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              🤖 Auto-Answer Rate (सटीक जवाब दर)
            </span>
            <h3 className="font-headline-lg text-3xl mt-4 text-amber-600 dark:text-amber-400 tracking-tight font-black leading-none">92.4%</h3>
          </div>
          <div className="w-full bg-amber-200/50 dark:bg-amber-900/30 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: "92.4%" }}></div>
          </div>
        </div>

        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[160px] hover:scale-[1.01] transition-transform duration-200 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
          <div>
            <span className="font-label-xs text-label-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              🟢 Assistant Status (सहायक की स्थिति)
            </span>
            <h3 className="font-headline-lg text-2xl mt-4 text-emerald-600 dark:text-emerald-400 tracking-tight font-black leading-none uppercase">Online 24/7</h3>
          </div>
          <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/30 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: "100%" }}></div>
          </div>
        </div>
      </section>

      {/* Quick Actions (Stitch design) */}
      <section className="mb-8">
        <h4 className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest mb-4 font-black">⚙️ Quick Settings (आसान सेटिंग्स)</h4>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onTabChange?.("ingest")}
            className="group flex flex-col items-center justify-center p-5 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl hover:border-purple-500 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-600 dark:group-hover:bg-purple-500 group-hover:text-white transition-colors border border-purple-500/20">
              <span className="material-symbols-outlined text-[22px] text-purple-600 dark:text-purple-400 group-hover:text-white">upload_file</span>
            </div>
            <span className="font-label-xs text-[11px] font-black text-ink-text">📁 Upload Shop Files</span>
          </button>
          <button
            onClick={() => onTabChange?.("catalog")}
            className="group flex flex-col items-center justify-center p-5 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl hover:border-amber-500 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-600 dark:group-hover:bg-amber-500 group-hover:text-white transition-colors border border-amber-500/20">
              <span className="material-symbols-outlined text-[22px] text-amber-600 dark:text-amber-400 group-hover:text-white">auto_stories</span>
            </div>
            <span className="font-label-xs text-[11px] font-black text-ink-text">🛍️ Add Items & Prices</span>
          </button>
          <button
            onClick={() => onTabChange?.("playground")}
            className="group flex flex-col items-center justify-center p-5 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl hover:border-emerald-500 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-emerald-500/20">
              <span className="material-symbols-outlined text-[22px] text-emerald-600 dark:text-emerald-400 group-hover:text-white">smart_toy</span>
            </div>
            <span className="font-label-xs text-[11px] font-black text-ink-text">💬 Try Chatbot</span>
          </button>
        </div>
      </section>

      {/* Grid: Left: Recent Activity Feed, Right: Tenant Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Recent Activity Feed */}
        <section ref={logRef} className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest font-black">📋 Recent Activity (हाल ही की हलचल)</h4>
            <span className="font-label-xs text-[10px] text-muted-gold uppercase tracking-wider font-extrabold cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-0.5 border border-border-subtle bg-border-subtle rounded-lg overflow-hidden shadow-sm">
            {/* Activity 1 */}
            <div className="bg-parchment-surface dark:bg-surface-container p-4 flex gap-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="mt-0.5">
                <span className="material-symbols-outlined text-blue-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-body-md font-black text-ink-text text-xs">💬 Assistant Answered Customer</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant font-mono font-bold">2m ago</span>
                </div>
                <p className="text-on-surface-variant text-[11px] font-bold">Answered customer query about product prices & stock availability successfully.</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-low dark:bg-surface-container-high font-mono text-[9px] text-on-surface-variant uppercase border border-border-subtle font-black">
                    Chat ID: 829-XJ
                  </span>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="bg-parchment-surface dark:bg-surface-container p-4 flex gap-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
              <div className="mt-0.5">
                <span className="material-symbols-outlined text-purple-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-body-md font-black text-ink-text text-xs">📄 File Added: Uploaded price list successfully!</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant font-mono font-bold">14m ago</span>
                </div>
                <p className="text-on-surface-variant text-[11px] font-bold">
                  Added shop details from <code className="font-mono bg-surface-container-low dark:bg-surface-container-high px-1 rounded text-ink-text">product_prices.pdf</code>.
                </p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="bg-parchment-surface dark:bg-surface-container p-4 flex gap-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <div className="mt-0.5 text-emerald-500">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-body-md font-black text-ink-text text-xs">🟢 Chatbot Status: Luminous and online 24/7</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant font-mono font-bold">1h ago</span>
                </div>
                <p className="text-on-surface-variant text-[11px] font-bold">The AI chatbot is fully online and ready to answer incoming WhatsApp queries.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Tenant Keys & Info */}
        <section className="lg:col-span-5 flex flex-col gap-6 justify-between animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-lg p-5 shadow-sm flex-grow flex flex-col justify-between">
            <div>
              <h3 className="font-label-xs text-on-surface-variant uppercase tracking-widest mb-4 font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">vpn_key</span>
                🔑 Secret Shop ID Key (गुप्त चाबी)
              </h3>
              <div className="space-y-4 font-bold text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Shop ID Key (दुकान की चाबी)</span>
                  <div className="flex items-center gap-2 bg-surface-container-low dark:bg-surface-container-high border border-border-subtle px-3 py-2 rounded font-mono text-[11px] text-ink-text truncate">
                    <span className="truncate flex-1 select-all">{activeBusiness.id}</span>
                    <button
                      onClick={() => copyToClipboard(activeBusiness.id)}
                      className="p-1.5 hover:bg-surface-container hover:text-ink-text rounded text-on-surface-variant transition duration-200 shrink-0 border border-border-subtle bg-parchment-surface dark:bg-surface-container cursor-pointer"
                      title="Copy Tenant ID"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">🤖 Chatbot Instructions (निर्देश)</span>
                  <div className="bg-surface-container-low dark:bg-surface-container-high border border-border-subtle p-3 rounded text-[11px] text-on-surface-variant leading-relaxed font-semibold max-h-36 overflow-y-auto custom-scrollbar">
                    {activeBusiness.api_settings?.system_prompt || "None configured."}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border-subtle mt-4 pt-4 flex justify-between items-center text-[10px] text-on-surface-variant font-mono font-black uppercase tracking-wider">
              <span>🔒 Secure Database (सुरक्षित डेटाबेस)</span>
              <span className="text-emerald-600 dark:text-emerald-400">[ACTIVE - चालू है]</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
