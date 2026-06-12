"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   Industry Data — Each tab morphs the entire demo
   ──────────────────────────────────────────────────────────────── */

interface IndustryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  conversation: { sender: "customer" | "bot"; text: string; time: string }[];
  agentTrace: string[];
  catalogResult: { name: string; detail: string; price: string };
}

const industries: IndustryConfig[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "🍽️",
    color: "text-amber-600",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-50",
    conversation: [
      { sender: "customer", text: "Hi! Do you have a table for 2 tonight at 8pm?", time: "8:12 PM" },
      { sender: "bot", text: "Yes! We have a window table available at 8 PM for 2. Our chef's special tonight is the Truffle Risotto (₹899). Shall I reserve it for you?", time: "8:12 PM" },
      { sender: "customer", text: "Perfect, please book it. Also what's on the dessert menu?", time: "8:13 PM" },
      { sender: "bot", text: "Reserved! 🎉 Table for 2 at 8 PM confirmed. Our desserts: Tiramisu (₹349), Dark Chocolate Fondant (₹399), and Mango Panna Cotta (₹299). See you tonight!", time: "8:13 PM" },
    ],
    agentTrace: [
      "Intent: reservation_query | Confidence: 96.1%",
      "Checking availability... Table T-7 (window) available",
      "Intent: catalog_query → dessert category",
      "Found 3 dessert items in catalog",
      "Reservation confirmed → Order #RSV-4421",
    ],
    catalogResult: { name: "Truffle Risotto", detail: "Chef's Special • Italian", price: "₹899" },
  },
  {
    id: "retail",
    name: "Retail",
    icon: "👕",
    color: "text-[#128C7E]",
    borderColor: "border-violet-400",
    bgColor: "bg-[#F0F2F5]",
    conversation: [
      { sender: "customer", text: "Do you have black leather jackets in size L?", time: "11:02 AM" },
      { sender: "bot", text: "Yes! We have the Premium Leather Jacket in Black, Size L at ₹4,999. Only 3 left in stock. Would you like to place an order?", time: "11:02 AM" },
      { sender: "customer", text: "Yes please, ship to Andheri West", time: "11:03 AM" },
      { sender: "bot", text: "Order placed! 🧥 Order #ORD-8392 — 1x Premium Leather Jacket (Black, L) — ₹4,999. Shipping to Andheri West. Expected delivery: 2-3 days.", time: "11:03 AM" },
    ],
    agentTrace: [
      "Intent: catalog_query | Confidence: 94.2%",
      "SQL: SELECT * FROM catalog WHERE category='jackets' AND attributes->>'color'='black'",
      "Found: Premium Leather Jacket (stock=3, size=L)",
      "Intent: place_order → validating size + color",
      "Order #ORD-8392 created → status: pending",
    ],
    catalogResult: { name: "Premium Leather Jacket", detail: "Black • Size L • 3 in stock", price: "₹4,999" },
  },
  {
    id: "salon",
    name: "Salon",
    icon: "💇",
    color: "text-pink-600",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-50",
    conversation: [
      { sender: "customer", text: "Can I book a haircut for tomorrow at 3pm?", time: "6:45 PM" },
      { sender: "bot", text: "Of course! We have a slot at 3 PM tomorrow with Priya (Senior Stylist). Haircut & Styling — ₹599. Shall I confirm?", time: "6:45 PM" },
      { sender: "customer", text: "Yes, and add a beard trim too", time: "6:46 PM" },
      { sender: "bot", text: "Done! ✅ Booking confirmed: Haircut + Beard Trim with Priya, tomorrow 3 PM. Total: ₹799. We'll send a reminder 1 hour before!", time: "6:46 PM" },
    ],
    agentTrace: [
      "Intent: booking_query | Confidence: 97.3%",
      "Checking slots... Priya available 3:00-4:00 PM",
      "Service: Haircut (₹599) + Beard Trim (₹200)",
      "Booking #BK-1156 confirmed → tomorrow 3 PM",
      "Reminder scheduled: 2 PM notification",
    ],
    catalogResult: { name: "Haircut + Beard Trim", detail: "Priya • Tomorrow 3 PM", price: "₹799" },
  },
  {
    id: "grocery",
    name: "Grocery",
    icon: "🛒",
    color: "text-green-600",
    borderColor: "border-green-400",
    bgColor: "bg-green-50",
    conversation: [
      { sender: "customer", text: "5kg basmati rice kitna ka hai?", time: "10:15 AM" },
      { sender: "bot", text: "India Gate Basmati Rice 5kg — ₹549. We also have Fortune Basmati at ₹489. Both in stock! Delivery available within 2 hours. Order karna hai?", time: "10:15 AM" },
      { sender: "customer", text: "India Gate wala de do, and 1L Amul milk bhi", time: "10:16 AM" },
      { sender: "bot", text: "Order placed! 🛒 India Gate Basmati 5kg (₹549) + Amul Milk 1L (₹68) = ₹617. Delivery by 12:15 PM. Payment on delivery. 🚚", time: "10:16 AM" },
    ],
    agentTrace: [
      "Intent: catalog_query | Language: Hinglish",
      "SQL: SELECT * FROM catalog WHERE name LIKE '%basmati%'",
      "Found: India Gate (₹549), Fortune (₹489)",
      "Intent: place_order → 2 items",
      "Order #GR-7891 → ₹617 total → COD",
    ],
    catalogResult: { name: "India Gate Basmati 5kg", detail: "In Stock • 2hr Delivery", price: "₹549" },
  },
];

/* ────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────── */

export default function IndustrySwitcher() {
  const [activeId, setActiveId] = useState("retail");
  const active = industries.find((i) => i.id === activeId) || industries[1];

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
          Built For Every Business
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          One platform. <span className="text-gradient-hero">Every industry.</span>
        </h2>
        <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
          See how AnytimeLLM adapts to your business type — handling menus, catalogs, bookings, or inventory automatically.
        </p>
      </div>

      {/* Industry Tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setActiveId(ind.id)}
            className={`px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all duration-300 cursor-pointer ${
              activeId === ind.id
                ? `bg-white ${ind.borderColor} border-2 shadow-md ${ind.color}`
                : "bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:shadow-sm"
            }`}
            style={{ borderRadius: 12 }}
          >
            <span className="text-lg">{ind.icon}</span>
            {ind.name}
          </button>
        ))}
      </div>

      {/* Demo Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left: Chat Simulation */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 shadow-lg overflow-hidden" style={{ borderRadius: 20 }}>
              {/* Chat Header */}
              <div className={`${active.bgColor} px-5 py-3 border-b border-slate-200 flex items-center gap-3`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-semibold text-slate-700 tracking-wide">
                  {active.icon} {active.name} Assistant
                </span>
                <span className="ml-auto text-sm text-slate-400 font-medium">LIVE DEMO</span>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 h-[320px] overflow-y-auto bg-slate-50/50">
                {active.conversation.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.3 }}
                    className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 text-[12px] leading-relaxed ${
                        msg.sender === "customer"
                          ? "bg-white border border-slate-200 text-slate-700"
                          : "bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white"
                      }`}
                      style={{ borderRadius: msg.sender === "customer" ? "4px 14px 14px 14px" : "14px 4px 14px 14px" }}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[9px] block mt-1 text-right ${msg.sender === "customer" ? "text-slate-400" : "text-white/60"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Bar */}
              <div className="px-4 py-3 border-t border-slate-200 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 px-3 py-2 text-[11px] text-slate-400" style={{ borderRadius: 8 }}>
                  Type a message...
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-[#128C7E] to-[#25D366] flex items-center justify-center text-white" style={{ borderRadius: 8 }}>
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Agent Reasoning Trace + Catalog Result */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Agent Trace — Dark Panel (5% dark element) */}
            <div className="dark-panel p-5 flex-1">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s infinite" }} />
                <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">Agent Reasoning Trace</span>
                <span className="ml-auto text-[9px] text-slate-500 font-mono">LIVE</span>
              </div>
              <div className="space-y-2.5">
                {active.agentTrace.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.12, duration: 0.3 }}
                    className="flex items-start gap-2 text-[11px] font-mono"
                  >
                    <span className="text-[#25D366] mt-0.5 shrink-0">→</span>
                    <span className="text-slate-300">{log}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Catalog Result Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className={`${active.bgColor} border-2 ${active.borderColor} p-5 flex items-center justify-between`}
              style={{ borderRadius: 14 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${active.borderColor} border-2 bg-white flex items-center justify-center text-lg`}>
                  {active.icon}
                </div>
                <div>
                  <div className={`text-[13px] font-bold ${active.color}`}>{active.catalogResult.name}</div>
                  <div className="text-sm text-slate-500">{active.catalogResult.detail}</div>
                </div>
              </div>
              <div className={`text-xl font-extrabold ${active.color}`}>{active.catalogResult.price}</div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
