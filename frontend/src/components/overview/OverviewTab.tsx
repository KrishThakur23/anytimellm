"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Business, CatalogItem, DocumentInfo, Order } from "@/lib/api";
import { Copy, Check } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

interface OverviewTabProps {
  activeBusiness: Business;
  documents: DocumentInfo[];
  catalog: CatalogItem[];
  orders: Order[];
  copied: boolean;
  copyToClipboard: (text: string) => void;
  onTabChange?: (tab: "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders") => void;
}

export default function OverviewTab({
  activeBusiness,
  documents,
  catalog,
  orders,
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
  }, [documents, catalog, orders]);

  // Generate dynamic recent activities feed
  const activities: {
    title: string;
    description: string;
    time: Date;
    color: string;
    icon: string;
    badge: string;
  }[] = [
    // Documents
    ...documents.map(doc => ({
      title: doc.file_type === "html" ? "🌐 Website Link Synced" : "📄 File Ingested",
      description: doc.file_type === "html" 
        ? `Added shop details from website: ${doc.file_name}`
        : `Ingested store guidelines from file: ${doc.file_name}`,
      time: new Date(doc.created_at),
      color: "bg-purple-500",
      icon: "schema",
      badge: "DOC"
    })),
    // Catalog items
    ...catalog.map(item => ({
      title: "🛍️ Product Registered",
      description: `Added product '${item.name}' priced at ${item.price ? `₹${item.price}` : "N/A"} to catalog.`,
      time: item.created_at ? new Date(item.created_at) : new Date(Date.now() - 3600000),
      color: "bg-amber-500",
      icon: "library_books",
      badge: "CATALOG"
    })),
    // Orders
    ...orders.map(order => ({
      title: `🛒 Order: ${order.status.toUpperCase()}`,
      description: `Customer ${order.customer_name || "Guest"} ordered ${order.details?.items?.map(i => `${i.name} (Qty: ${i.quantity})`).join(", ")}.`,
      time: new Date(order.created_at),
      color: order.status === "confirmed" ? "bg-emerald-500" : order.status === "cancelled" ? "bg-rose-500" : "bg-blue-500",
      icon: "shopping_bag",
      badge: "ORDER"
    }))
  ];

  // Sort activities by timestamp descending
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());

  // Show top 3 recent activities
  const displayActivities = activities.slice(0, 3);

  // Formatting relative time helper
  const getRelativeTimeString = (date: Date): string => {
    const delta = Math.round((Date.now() - date.getTime()) / 1000);
    if (delta < 60) return "just now";
    const minutes = Math.round(delta / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

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
        {/* Total Orders Card */}
        <div className="md:col-span-2 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/30 p-6 flex flex-col justify-between rounded-xl shadow-sm relative overflow-hidden min-h-[160px] hover:scale-[1.01] transition-transform duration-200">
          <div>
            <span className="font-label-xs text-label-xs text-blue-700 dark:text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              💬 Total Customer Orders (कुल ऑर्डर्स)
            </span>
            <h2 className="font-display-lg text-4xl mt-3 text-ink-text tracking-tighter leading-none font-black text-blue-600 dark:text-blue-400">
              <AnimatedCounter target={orders.length} />
            </h2>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[16px] font-bold">trending_up</span>
            <span className="text-[10px] font-label-xs text-blue-700 dark:text-blue-400 font-black tracking-wider">📈 Track customer shopping behaviors</span>
          </div>
          {/* Sparkline background */}
          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-15 dark:opacity-25" preserveAspectRatio="none" viewBox="0 0 100 50">
            <path className="sparkline-path" d="M0,40 L20,35 L40,45 L60,20 L80,25 L100,5" fill="none" stroke="#2563eb" strokeWidth="2"></path>
          </svg>
        </div>

        {/* Catalog Items Card */}
        <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[160px] hover:scale-[1.01] transition-transform duration-200">
          <div>
            <span className="font-label-xs text-label-xs text-amber-700 dark:text-amber-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              🛍️ Products Registered (सामान लिस्ट)
            </span>
            <h3 className="font-headline-lg text-3xl mt-4 text-amber-600 dark:text-amber-400 tracking-tight font-black leading-none">{catalog.length}</h3>
          </div>
          <div className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Available in Database
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/30 p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[160px] hover:scale-[1.01] transition-transform duration-200">
          <div>
            <span className="font-label-xs text-label-xs text-purple-700 dark:text-purple-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              📄 Ingested Guidelines (दस्तावेज़)
            </span>
            <h3 className="font-headline-lg text-3xl mt-4 text-purple-600 dark:text-purple-400 tracking-tight font-black leading-none">{documents.length}</h3>
          </div>
          <div className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Uploaded store details
          </div>
        </div>
      </section>

      {/* Quick Actions (Stitch design) */}
      <section className="mb-8">
        <h4 className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-widest mb-4 font-black">⚙️ Quick Settings (आसान सेटिंग्स)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            onClick={() => onTabChange?.("orders")}
            className="group flex flex-col items-center justify-center p-5 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl hover:border-rose-500 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-3 group-hover:bg-rose-600 dark:group-hover:bg-rose-500 group-hover:text-white transition-colors border border-rose-500/20">
              <span className="material-symbols-outlined text-[22px] text-rose-600 dark:text-rose-400 group-hover:text-white">shopping_bag</span>
            </div>
            <span className="font-label-xs text-[11px] font-black text-ink-text">📦 Order Inbox ({orders.length})</span>
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
          </div>
          <div className="space-y-0.5 border border-border-subtle bg-border-subtle rounded-lg overflow-hidden shadow-sm">
            {displayActivities.length === 0 ? (
              <div className="bg-parchment-surface dark:bg-surface-container p-8 text-center text-on-surface-variant text-xs font-mono">
                No recent activity recorded yet. Register products or upload details to begin.
              </div>
            ) : (
              displayActivities.map((act, idx) => (
                <div key={idx} className="bg-parchment-surface dark:bg-surface-container p-4 flex gap-4 relative">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${act.color}`}></div>
                  <div className={`mt-0.5 ${act.color.replace("bg-", "text-")}`}>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      circle
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-body-md font-black text-ink-text text-xs truncate mr-2">
                        {act.title}
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant font-mono font-bold shrink-0">
                        {getRelativeTimeString(act.time)}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] font-bold leading-relaxed">{act.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-low dark:bg-surface-container-high font-mono text-[9px] text-on-surface-variant uppercase border border-border-subtle font-black">
                        {act.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
