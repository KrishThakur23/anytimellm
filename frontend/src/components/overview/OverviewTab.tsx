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
  onTabChange?: (tab: "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats") => void;
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
        <h1 className="font-display-lg text-4xl tracking-[0.08em] uppercase text-white">
          CONSOLE OVERVIEW
        </h1>
        <p className="font-body-md text-sm text-muted mt-1 italic">
          Monitoring runtime parameters, vector namespace index counts, and incoming orders.
        </p>
      </div>

      {/* Tenant Indicator Spec Cell */}
      <section className="mb-4">
        <div className="flex items-center justify-between p-5 bg-surface-1 border border-border-subtle rounded-none">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <p className="font-mono text-[9px] text-muted-gold uppercase tracking-[0.15em] mb-0.5">CURRENT ACTIVE STORE</p>
              <p className="font-display-lg text-base tracking-[0.05em] text-white uppercase">{activeBusiness.name}</p>
            </div>
          </div>
          <span className="font-mono text-[9px] text-white uppercase tracking-[0.2em]">
            SYSTEM READY
          </span>
        </div>
      </section>

      {/* Shop Metrics (Automotive Spec Cells layout) */}
      <section 
        ref={cardsRef} 
        className="grid grid-cols-1 md:grid-cols-3 border-y border-border-subtle py-8 gap-y-8 md:gap-y-0"
      >
        {/* Total Orders Spec Cell */}
        <div className="flex flex-col items-center md:items-start px-6 border-r border-border-subtle/50 last:border-r-0">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">01 / TOTAL ORDERS</span>
          <h2 className="font-display-lg text-5xl tracking-wide text-white uppercase mt-4">
            <AnimatedCounter target={orders.length} />
          </h2>
          <span className="font-mono text-[8px] tracking-[0.15em] text-muted-gold uppercase mt-2">Active business events</span>
        </div>

        {/* Catalog Items Spec Cell */}
        <div className="flex flex-col items-center md:items-start px-6 border-r border-border-subtle/50 last:border-r-0">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">02 / CATALOG ITEMS</span>
          <h2 className="font-display-lg text-5xl tracking-wide text-white uppercase mt-4">
            <AnimatedCounter target={catalog.length} />
          </h2>
          <span className="font-mono text-[8px] tracking-[0.15em] text-muted-gold uppercase mt-2">Registered in inventory</span>
        </div>

        {/* Documents Spec Cell */}
        <div className="flex flex-col items-center md:items-start px-6">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">03 / INGESTED PARAMETERS</span>
          <h2 className="font-display-lg text-5xl tracking-wide text-white uppercase mt-4">
            <AnimatedCounter target={documents.length} />
          </h2>
          <span className="font-mono text-[8px] tracking-[0.15em] text-muted-gold uppercase mt-2">Source guidelines loaded</span>
        </div>
      </section>

      {/* Quick Actions (Bugatti Minimal Cards) */}
      <section className="mb-8">
        <h4 className="font-mono text-[10px] tracking-[0.2em] text-muted-gold uppercase mb-4">QUICK NAVIGATION</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onTabChange?.("ingest")}
            className="group flex flex-col items-start p-5 bg-surface-1 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer"
          >
            <span className="font-mono text-[8px] text-muted group-hover:text-white transition-colors uppercase tracking-[0.2em]">01 / INPUTS</span>
            <span className="font-display-lg text-sm text-white tracking-[0.1em] uppercase mt-4">UPLOAD DOCUMENTS</span>
          </button>
          
          <button
            onClick={() => onTabChange?.("catalog")}
            className="group flex flex-col items-start p-5 bg-surface-1 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer"
          >
            <span className="font-mono text-[8px] text-muted group-hover:text-white transition-colors uppercase tracking-[0.2em]">02 / INVENTORY</span>
            <span className="font-display-lg text-sm text-white tracking-[0.1em] uppercase mt-4">MANAGE CATALOG</span>
          </button>

          <button
            onClick={() => onTabChange?.("orders")}
            className="group flex flex-col items-start p-5 bg-surface-1 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer"
          >
            <span className="font-mono text-[8px] text-muted group-hover:text-white transition-colors uppercase tracking-[0.2em]">03 / INBOX</span>
            <span className="font-display-lg text-sm text-white tracking-[0.1em] uppercase mt-4">ORDER LISTINGS</span>
          </button>

          <button
            onClick={() => onTabChange?.("playground")}
            className="group flex flex-col items-start p-5 bg-surface-1 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer"
          >
            <span className="font-mono text-[8px] text-muted group-hover:text-white transition-colors uppercase tracking-[0.2em]">04 / TESTING</span>
            <span className="font-display-lg text-sm text-white tracking-[0.1em] uppercase mt-4">TEST CLIENT CHAT</span>
          </button>
        </div>
      </section>

      {/* Grid: Left: Recent Activity Feed, Right: Tenant Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity Feed (Bugatti Newsroom style rows) */}
        <section ref={logRef} className="lg:col-span-7">
          <h4 className="font-mono text-[10px] tracking-[0.2em] text-muted-gold uppercase mb-4">RECENT telemetry ACTIVE LOGS</h4>
          <div className="border border-border-subtle divide-y divide-border-subtle rounded-none bg-surface-1">
            {displayActivities.length === 0 ? (
              <div className="p-8 text-center text-muted font-mono text-xs tracking-wider uppercase">
                No recent activity recorded in namespace.
              </div>
            ) : (
              displayActivities.map((act, idx) => (
                <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] text-muted-gold tracking-[0.15em] uppercase">
                        {act.badge}
                      </span>
                      <span className="font-mono text-[8px] text-muted">
                        |
                      </span>
                      <span className="font-mono text-[9px] text-muted font-medium">
                        {getRelativeTimeString(act.time)}
                      </span>
                    </div>
                    <h5 className="font-display-lg text-sm tracking-[0.1em] text-white uppercase mt-1">
                      {act.title}
                    </h5>
                    <p className="font-body-md text-xs text-text-secondary italic mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-muted tracking-widest hidden md:inline shrink-0 uppercase">
                    RESOLVED
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Tenant Keys & Info */}
        <section className="lg:col-span-5 flex flex-col justify-start">
          <div className="bg-surface-1 border border-border-subtle rounded-none p-6 flex flex-col justify-between h-full">
            <div>
              <h3 className="font-mono text-[9px] tracking-[0.2em] text-muted-gold uppercase mb-4 flex items-center gap-2">
                CREDENTIAL INTERFACE
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-muted uppercase tracking-[0.15em]">CONSOLE SECRET KEY</span>
                  <div className="flex items-center justify-between bg-surface-2 border border-border-subtle px-3.5 py-2.5 rounded-none font-mono text-[10px] text-white">
                    <span className="truncate flex-1 pr-4">{activeBusiness.id}</span>
                    <button
                      onClick={() => copyToClipboard(activeBusiness.id)}
                      className="p-1.5 border border-border-subtle hover:border-white rounded-full bg-transparent text-white transition-all duration-350 shrink-0 cursor-pointer"
                      title="Copy Key"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-muted uppercase tracking-[0.15em]">ACTIVE PROMPT MODEL</span>
                  <div className="bg-surface-2 border border-border-subtle p-3.5 rounded-none text-xs text-text-secondary leading-relaxed italic max-h-36 overflow-y-auto custom-scrollbar font-body-sm">
                    {activeBusiness.api_settings?.system_prompt || "No custom instructions registered in database settings."}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border-subtle mt-6 pt-4 flex justify-between items-center font-mono text-[8px] text-muted uppercase tracking-[0.2em]">
              <span>WORKSPACE SECURE</span>
              <span className="text-emerald-500">ONLINE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
