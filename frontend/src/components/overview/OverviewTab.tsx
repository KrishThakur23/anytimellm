"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { api } from "@/lib/api";
import type { Business, CatalogItem, DocumentInfo, Order } from "@/lib/api";
import { Copy, Check, Edit2, Save, X, Loader2 } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

interface OverviewTabProps {
  activeBusiness: Business;
  documents: DocumentInfo[];
  catalog: CatalogItem[];
  orders: Order[];
  copied: boolean;
  copyToClipboard: (text: string) => void;
  onTabChange?: (tab: "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats") => void;
  onUpdateBusiness?: (updatedBiz: Business) => void;
}

export default function OverviewTab({
  activeBusiness,
  documents,
  catalog,
  orders,
  copied,
  copyToClipboard,
  onTabChange,
  onUpdateBusiness
}: OverviewTabProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(activeBusiness.api_settings?.system_prompt || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedPrompt(activeBusiness.api_settings?.system_prompt || "");
  }, [activeBusiness]);

  const handleSavePrompt = async () => {
    setSaving(true);
    try {
      const updatedBusiness = await api.updateBusinessSettings(activeBusiness.id, {
        system_prompt: editedPrompt
      });
      if (onUpdateBusiness) {
        onUpdateBusiness(updatedBusiness);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save system prompt", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }
    if (logRef.current) {
      gsap.fromTo(
        logRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [documents, catalog, orders]);

  // Generate dynamic recent activities feed
  const activities: {
    title: string;
    description: string;
    time: Date;
    badge: string;
  }[] = [
    ...documents.map(doc => ({
      title: doc.file_type === "html" ? "URL SYNCED" : "FILE INGESTED",
      description: doc.file_type === "html" 
        ? `Synced business parameters from: ${doc.file_name}`
        : `Ingested store guidelines from: ${doc.file_name}`,
      time: new Date(doc.created_at),
      badge: "DATA"
    })),
    ...catalog.map(item => ({
      title: "CATALOG REGISTERED",
      description: `Added catalog item '${item.name}' priced at ₹${item.price || "N/A"}.`,
      time: item.created_at ? new Date(item.created_at) : new Date(Date.now() - 3600000),
      badge: "CATALOG"
    })),
    ...orders.map(order => ({
      title: `ORDER STATE: ${order.status.toUpperCase()}`,
      description: `Customer ${order.customer_name || "Guest"} ordered ${order.details?.items?.map(i => `${i.name} (Qty: ${i.quantity})`).join(", ")}.`,
      time: new Date(order.created_at),
      badge: "ORDER"
    }))
  ];

  // Sort activities by timestamp descending
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());
  const displayActivities = activities.slice(0, 3);

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
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          CONSOLE OVERVIEW
        </h1>
        <p className="font-body text-sm text-slate-500 mt-1">
          Monitoring runtime parameters, vector namespace index counts, and incoming orders.
        </p>
      </div>

      {/* Tenant Indicator Spec Cell */}
      <section className="mb-4">
        <div className="flex items-center justify-between p-5 bg-white border border-slate-200 shadow-xs" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 2s infinite" }}></div>
            <div>
              <p className="font-mono text-[9px] text-[#128C7E] uppercase tracking-[0.15em] font-bold mb-0.5">CURRENT ACTIVE STORE</p>
              <p className="font-display text-base font-extrabold text-slate-800 uppercase">{activeBusiness.name}</p>
            </div>
          </div>
          <span className="font-mono text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 font-bold uppercase tracking-[0.15em]" style={{ borderRadius: 9999 }}>
            SYSTEM READY
          </span>
        </div>
      </section>

      {/* Shop Metrics (Automotive Spec Cells layout) */}
      <section 
        ref={cardsRef} 
        className="grid grid-cols-1 md:grid-cols-3 border-y border-slate-200 py-8 gap-y-8 md:gap-y-0"
      >
        {/* Total Orders Spec Cell */}
        <div className="flex flex-col items-center md:items-start px-6 border-r border-slate-200/60 last:border-r-0">
          <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase font-bold">01 / TOTAL ORDERS</span>
          <h2 className="font-display text-5xl font-extrabold tracking-tight text-slate-900 uppercase mt-4">
            <AnimatedCounter target={orders.length} />
          </h2>
          <span className="font-mono text-[8px] tracking-[0.15em] text-[#128C7E] uppercase mt-2 font-bold">Active business events</span>
        </div>

        {/* Catalog Items Spec Cell */}
        <div className="flex flex-col items-center md:items-start px-6 border-r border-slate-200/60 last:border-r-0">
          <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase font-bold">02 / CATALOG ITEMS</span>
          <h2 className="font-display text-5xl font-extrabold tracking-tight text-slate-900 uppercase mt-4">
            <AnimatedCounter target={catalog.length} />
          </h2>
          <span className="font-mono text-[8px] tracking-[0.15em] text-[#128C7E] uppercase mt-2 font-bold">Registered in inventory</span>
        </div>

        {/* Documents Spec Cell */}
        <div className="flex flex-col items-center md:items-start px-6">
          <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase font-bold">03 / INGESTED PARAMETERS</span>
          <h2 className="font-display text-5xl font-extrabold tracking-tight text-slate-900 uppercase mt-4">
            <AnimatedCounter target={documents.length} />
          </h2>
          <span className="font-mono text-[8px] tracking-[0.15em] text-[#128C7E] uppercase mt-2 font-bold">Source guidelines loaded</span>
        </div>
      </section>

      {/* Quick Actions (Bugatti Minimal Cards) */}
      <section className="mb-8">
        <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase mb-4 font-bold">QUICK NAVIGATION</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onTabChange?.("ingest")}
            className="group flex flex-col items-start p-5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer text-left shadow-xs"
            style={{ borderRadius: 14 }}
          >
            <span className="font-mono text-[8px] text-slate-400 group-hover:text-[#128C7E] transition-colors uppercase tracking-[0.2em] font-bold">01 / INPUTS</span>
            <span className="font-display text-base font-bold text-slate-800 tracking-[0.15em] uppercase mt-4">UPLOAD DOCUMENTS</span>
          </button>
          
          <button
            onClick={() => onTabChange?.("catalog")}
            className="group flex flex-col items-start p-5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer text-left shadow-xs"
            style={{ borderRadius: 14 }}
          >
            <span className="font-mono text-[8px] text-slate-400 group-hover:text-[#128C7E] transition-colors uppercase tracking-[0.2em] font-bold">02 / INVENTORY</span>
            <span className="font-display text-base font-bold text-slate-800 tracking-[0.15em] uppercase mt-4">MANAGE CATALOG</span>
          </button>

          <button
            onClick={() => onTabChange?.("orders")}
            className="group flex flex-col items-start p-5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer text-left shadow-xs"
            style={{ borderRadius: 14 }}
          >
            <span className="font-mono text-[8px] text-slate-400 group-hover:text-[#128C7E] transition-colors uppercase tracking-[0.2em] font-bold">03 / INBOX</span>
            <span className="font-display text-base font-bold text-slate-800 tracking-[0.15em] uppercase mt-4">ORDER LISTINGS</span>
          </button>

          <button
            onClick={() => onTabChange?.("playground")}
            className="group flex flex-col items-start p-5 bg-white border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer text-left shadow-xs"
            style={{ borderRadius: 14 }}
          >
            <span className="font-mono text-[8px] text-slate-400 group-hover:text-[#128C7E] transition-colors uppercase tracking-[0.2em] font-bold">04 / TESTING</span>
            <span className="font-display text-base font-bold text-slate-800 tracking-[0.15em] uppercase mt-4">TEST CLIENT CHAT</span>
          </button>
        </div>
      </section>

      {/* Grid: Left: Recent Activity Feed, Right: Tenant Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity Feed (Bugatti Newsroom style rows) */}
        <section ref={logRef} className="lg:col-span-7">
          <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase mb-4 font-bold">RECENT TELEMETRY ACTIVE LOGS</h4>
          <div className="border border-slate-200 divide-y divide-slate-100 rounded-none bg-white shadow-xs" style={{ borderRadius: 16 }}>
            {displayActivities.length === 0 ? (
              <div className="p-8 text-center text-slate-450 font-mono text-sm tracking-wider uppercase font-semibold">
                No recent activity recorded in namespace.
              </div>
            ) : (
              displayActivities.map((act, idx) => (
                <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] text-[#128C7E] tracking-[0.15em] uppercase font-bold">
                        {act.badge}
                      </span>
                      <span className="font-mono text-[8px] text-slate-300">
                        |
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 font-semibold">
                        {getRelativeTimeString(act.time)}
                      </span>
                    </div>
                    <h5 className="font-display text-sm font-extrabold tracking-wide text-slate-800 uppercase mt-1">
                      {act.title}
                    </h5>
                    <p className="font-body text-base text-slate-500 mt-0.5">
                      {act.description}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold uppercase tracking-widest hidden md:inline shrink-0" style={{ borderRadius: 6 }}>
                    RESOLVED
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Tenant Keys & Info */}
        <section className="lg:col-span-5 flex flex-col justify-start">
          <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between h-full shadow-xs" style={{ borderRadius: 16 }}>
            <div>
              <h3 className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase mb-4 flex items-center gap-2 font-bold">
                CREDENTIAL INTERFACE
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-slate-400 uppercase tracking-[0.15em] font-bold">CONSOLE SECRET KEY</span>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-none font-mono text-sm text-slate-800" style={{ borderRadius: 10 }}>
                    <span className="truncate flex-1 pr-4">{activeBusiness.id}</span>
                    <button
                      onClick={() => copyToClipboard(activeBusiness.id)}
                      className="p-1.5 border border-slate-200 hover:border-slate-300 rounded-full bg-white text-slate-600 hover:text-slate-900 transition-all duration-300 shrink-0 cursor-pointer shadow-xs"
                      title="Copy Key"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-slate-400 uppercase tracking-[0.15em] font-bold">ACTIVE PROMPT MODEL</span>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[8px] font-mono text-[#128C7E] hover:text-[#075E54] uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-transparent border-0 font-bold"
                      >
                        <Edit2 className="w-2.5 h-2.5" /> Edit Instructions
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex flex-col gap-2.5">
                      <textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="w-full min-h-[120px] bg-slate-50 border border-slate-200 p-3 text-base text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] resize-y font-body"
                        style={{ borderRadius: 10 }}
                        placeholder="Enter system prompt instructions for the AI assistant..."
                        disabled={saving}
                      />
                      <div className="flex justify-end gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditedPrompt(activeBusiness.api_settings?.system_prompt || "");
                            setIsEditing(false);
                          }}
                          disabled={saving}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 font-mono text-[9px] uppercase tracking-widest flex items-center gap-1 cursor-pointer font-bold"
                          style={{ borderRadius: 8 }}
                        >
                          <X className="w-2.5 h-2.5" /> Cancel
                        </button>
                        <button
                          onClick={handleSavePrompt}
                          disabled={saving}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white font-mono text-[9px] uppercase tracking-widest flex items-center gap-1 cursor-pointer font-bold shadow-sm"
                          style={{ borderRadius: 8 }}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-2.5 h-2.5" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none text-base text-slate-600 leading-relaxed max-h-36 overflow-y-auto custom-scrollbar font-body" style={{ borderRadius: 10 }}>
                      {activeBusiness.api_settings?.system_prompt || "No custom instructions registered in database settings."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-6 pt-4 flex justify-between items-center font-mono text-[8px] text-slate-400 uppercase tracking-[0.2em] font-bold">
              <span>WORKSPACE SECURE</span>
              <span className="text-emerald-500 font-bold">ONLINE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
