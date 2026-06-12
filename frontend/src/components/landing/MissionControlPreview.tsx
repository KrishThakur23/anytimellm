"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ────────────────────────────────────────────────────────────────
   Mission Control Preview — Dashboard mockup for landing page
   ──────────────────────────────────────────────────────────────── */

const activityFeed = [
  { type: "order", text: "New order #ORD-1204 from Rahul S.", time: "2m ago", color: "bg-amber-500" },
  { type: "chat", text: "WhatsApp message from Priya M.", time: "5m ago", color: "bg-emerald-500" },
  { type: "ingest", text: "Catalog synced: 12 new items added", time: "12m ago", color: "bg-blue-500" },
  { type: "agent", text: "Agent resolved query in 0.6s", time: "18m ago", color: "bg-[#F0F2F5]0" },
  { type: "order", text: "Order #ORD-1198 confirmed by customer", time: "25m ago", color: "bg-emerald-500" },
];

const sidebarItems = [
  { label: "Overview", active: true },
  { label: "Ingestion", active: false },
  { label: "Catalog", active: false },
  { label: "Test Client", active: false },
  { label: "WhatsApp", active: false },
  { label: "Orders", active: false },
  { label: "Live Chats", active: false },
];

export default function MissionControlPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
          Mission Control
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your <span className="text-gradient-hero">command center</span>
        </h2>
        <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
          Monitor every agent, order, conversation, and knowledge retrieval — in real time.
        </p>
      </div>

      {/* Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-slate-200 shadow-xl overflow-hidden card-tilt"
        style={{ borderRadius: 20 }}
      >
        {/* Window Chrome */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm text-slate-400 font-mono">dashboard.anytimellm.com</span>
          </div>
        </div>

        <div className="flex min-h-[420px]">
          {/* Sidebar Mock */}
          <div className="w-52 border-r border-slate-200 bg-slate-50/50 py-4 hidden md:block">
            {/* Brand */}
            <div className="px-4 mb-5">
              <span className="text-[12px] font-bold text-slate-800 tracking-wider">ANYTIMELLM</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 2s infinite" }} />
                <span className="text-[9px] text-emerald-600 font-medium">ONLINE</span>
              </div>
            </div>

            {/* Nav */}
            <div className="space-y-0.5">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`px-4 py-2 text-[11px] font-medium ${
                    item.active
                      ? "text-[#075E54] bg-[#F0F2F5] border-l-[3px] border-[#128C7E]"
                      : "text-slate-500 border-l-[3px] border-transparent"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Orders", value: "847", change: "+12 today", color: "text-[#128C7E]" },
                { label: "Active Agents", value: "4", change: "All running", color: "text-emerald-600" },
                { label: "Response Time", value: "0.8s", change: "Avg today", color: "text-blue-600" },
                { label: "Revenue", value: "₹2.4L", change: "+₹18K today", color: "text-amber-600" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-slate-50 border border-slate-200 p-3.5"
                  style={{ borderRadius: 12 }}
                >
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                  <div className={`text-2xl font-extrabold ${stat.color} mt-1`}>{stat.value}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">{stat.change}</div>
                </motion.div>
              ))}
            </div>

            {/* Activity Feed */}
            <div className="bg-slate-50 border border-slate-200 overflow-hidden" style={{ borderRadius: 12 }}>
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 2s infinite" }} />
                  <span className="text-[11px] font-semibold text-slate-700 tracking-wide">LIVE ACTIVITY</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">STREAMING</span>
              </div>
              <div className="divide-y divide-slate-100">
                {activityFeed.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.3 }}
                    className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-100/50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                    <span className="text-[11px] text-slate-700 flex-1">{item.text}</span>
                    <span className="text-[9px] text-slate-400 shrink-0">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
