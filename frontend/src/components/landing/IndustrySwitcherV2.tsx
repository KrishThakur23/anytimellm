"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Store, Scissors, ShoppingBag, ShoppingCart } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   Industry Data
   ──────────────────────────────────────────────────────────────── */

interface IndustryConfig {
  id: string;
  name: string;
  businessName: string;
  icon: React.ReactNode;
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
    businessName: "Pizza Palace",
    icon: <Store className="w-5 h-5" />,
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
    businessName: "Trendify Boutique",
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "text-violet-600",
    borderColor: "border-violet-400",
    bgColor: "bg-violet-50",
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
    businessName: "Glow Salon",
    icon: <Scissors className="w-5 h-5" />,
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
    businessName: "FreshMart Grocery",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "text-emerald-600",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50",
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

export default function IndustrySwitcherV2() {
  const [activeId, setActiveId] = useState("retail");
  const active = industries.find((i) => i.id === activeId) || industries[1];

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full bg-transparent">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-[3rem] font-black text-slate-900 tracking-tight mb-6">
          Built for <span className="text-slate-400">every business.</span>
        </h2>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
          From menus to catalogs, bookings to inventory. See how Business Brain™ adapts to your specific needs.
        </p>
      </div>

      {/* Mobile swipeable, Desktop wrap Tabs */}
      <div className="flex md:justify-center overflow-x-auto snap-x snap-mandatory gap-4 mb-16 pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setActiveId(ind.id)}
            className={`snap-center shrink-0 w-64 md:w-auto md:shrink px-6 py-5 flex flex-col items-start gap-4 transition-all duration-300 rounded-[1.5rem] border-2 text-left ${
              activeId === ind.id
                ? `bg-white ${ind.borderColor} shadow-xl shadow-slate-200/50`
                : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
            }`}
          >
            <div className={`p-3 rounded-xl ${activeId === ind.id ? ind.bgColor : 'bg-slate-200'} ${activeId === ind.id ? ind.color : 'text-slate-500'}`}>
              {ind.icon}
            </div>
            <div>
              <div className={`font-black tracking-tight text-lg ${activeId === ind.id ? 'text-slate-900' : 'text-slate-700'}`}>{ind.name}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">{ind.businessName}</div>
            </div>
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
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left: Chat Simulation */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 shadow-xl overflow-hidden rounded-[2rem]">
              {/* Chat Header */}
              <div className={`${active.bgColor} px-6 py-5 border-b border-slate-200 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {active.icon}
                </div>
                <div>
                  <span className="text-base font-black text-slate-900 tracking-tight block">
                    {active.businessName}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 h-[400px] overflow-y-auto bg-slate-50/50 scrollbar-hide">
                {active.conversation.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.3 }}
                    className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] px-5 py-4 text-[15px] font-medium leading-relaxed shadow-sm ${
                        msg.sender === "customer"
                          ? "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm"
                          : "bg-slate-900 border border-slate-800 text-white rounded-2xl rounded-tr-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[10px] font-bold block mt-3 text-right ${msg.sender === "customer" ? "text-slate-400" : "text-slate-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Bar */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3 bg-white">
                <div className="flex-1 bg-slate-100 px-5 py-3.5 text-sm font-medium text-slate-400 rounded-full">
                  Message...
                </div>
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-md">
                  <Send className="w-5 h-5 ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Agent Reasoning Trace + Catalog Result */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Agent Trace */}
            <div className="bg-slate-900 rounded-[2rem] p-8 flex-1 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 to-violet-400" />
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-300 tracking-widest uppercase">Business Brain™ Activity</span>
              </div>
              <div className="space-y-5">
                {active.agentTrace.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.12, duration: 0.3 }}
                    className="flex items-start gap-3 text-sm font-mono"
                  >
                    <span className="text-violet-400 mt-0.5 shrink-0">→</span>
                    <span className="text-slate-400 leading-relaxed font-medium">{log}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Catalog Result Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className={`${active.bgColor} border-2 ${active.borderColor} p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm rounded-[2rem]`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-[1.25rem] ${active.borderColor} border-2 bg-white flex items-center justify-center shadow-sm shrink-0`}>
                  <div className={active.color}>{active.icon}</div>
                </div>
                <div>
                  <div className={`text-lg font-black tracking-tight ${active.color} mb-1.5`}>{active.catalogResult.name}</div>
                  <div className="text-sm font-bold text-slate-600">{active.catalogResult.detail}</div>
                </div>
              </div>
              <div className={`text-3xl font-black ${active.color}`}>{active.catalogResult.price}</div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
