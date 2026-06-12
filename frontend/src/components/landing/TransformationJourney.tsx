"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   Pipeline Steps Data
   ──────────────────────────────────────────────────────────────── */

const steps = [
  {
    time: "11:02 AM",
    icon: "📩",
    title: "Customer Message Received",
    description: '"Do you have black leather jackets in size L?"',
    color: "border-blue-400",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    time: "11:02 AM",
    icon: "🧠",
    title: "AI Agent Thinking",
    description: "Intent: catalog_query | Confidence: 94.2%",
    color: "border-violet-400",
    dotColor: "bg-[#F0F2F5]0",
    bgColor: "bg-[#F0F2F5]",
    isThinking: true,
  },
  {
    time: "11:02 AM",
    icon: "🔍",
    title: "Knowledge Search",
    description: "Searching catalog... 3 results found\n→ Premium Leather Jacket (₹4,999, Size L, Black) ✓",
    color: "border-indigo-400",
    dotColor: "bg-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    time: "11:03 AM",
    icon: "📦",
    title: "Order Created",
    description: "ORD-8392 | 1x Premium Leather Jacket | ₹4,999",
    color: "border-amber-400",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    time: "11:03 AM",
    icon: "💬",
    title: "Customer Reply Sent",
    description: '"Yes! We have the Premium Leather Jacket in Black, Size L at ₹4,999. I\'ve created order #ORD-8392. Shall I confirm?"',
    color: "border-emerald-400",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50",
  },
];

/* ────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────── */

export default function TransformationJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: The Problem (Comparison) */}
        <div>
          <div className="mb-10">
            <span className="inline-block px-3 py-1 bg-[#F0F2F5] border border-[#DCF8C6] text-[#128C7E] text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
              The AnytimeLLM Advantage
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why traditional <br/> businesses <span className="text-gradient-hero">lose sales</span>
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              Customers expect instant replies. While you're busy running your business, unread messages turn into lost revenue.
            </p>
          </div>

          <div className="border border-slate-200 bg-white shadow-xl overflow-hidden" style={{ borderRadius: 16 }}>
            <div className="grid grid-cols-[1fr_auto_auto] items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Feature</div>
              <div className="w-24 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">Traditional</div>
              <div className="w-28 text-center text-sm font-bold text-[#128C7E] uppercase tracking-wider">AnytimeLLM</div>
            </div>
            
            {[
              { label: "Missed messages", trad: "Frequent", new: "Never" },
              { label: "Manual follow-up", trad: "Slow", new: "Automatic" },
              { label: "Lost leads", trad: "High", new: "Captured" },
              { label: "Availability", trad: "Business hours", new: "24/7" },
              { label: "Support team", trad: "Human-only", new: "AI Workforce" },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto_auto] items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <div className="text-[13px] font-medium text-slate-700">{row.label}</div>
                <div className="w-24 text-center text-[12px] text-slate-500 flex items-center justify-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  {row.trad}
                </div>
                <div className="w-28 text-center text-[12px] font-semibold text-emerald-600 flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {row.new}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Solution (Revenue Journey) */}
        <div className="relative pt-6">
          <div className="absolute top-0 right-10 flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 text-emerald-700 shadow-sm z-20" style={{ borderRadius: 12 }}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-bold tracking-wide uppercase">Live Revenue Journey</span>
          </div>

          <div className="relative pl-6 mt-8">
            {/* Vertical Line */}
            <div className="absolute left-[39px] top-4 bottom-12 w-[2px] bg-gradient-to-b from-blue-300 via-violet-300 to-emerald-300 opacity-30" />

            <div className="space-y-1">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + (idx * 0.18), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-5 relative"
                >
                  {/* Timeline Dot */}
                  <div className={`w-10 h-10 rounded-full ${step.bgColor} border-2 ${step.color} flex items-center justify-center text-lg shrink-0 z-10 shadow-sm mt-1`}>
                    {step.icon}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 ${step.bgColor} border ${step.color} p-4 mb-3 relative`} style={{ borderRadius: 14 }}>
                    {/* Thinking pulse indicator */}
                    {step.isThinking && (
                      <div className="absolute top-3 right-3 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0F2F5]0 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0F2F5]0 animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0F2F5]0 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-mono text-slate-400">{step.time}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-1">{step.title}</h4>
                    <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-line">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final result indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-6 ml-6"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 shadow-xl shadow-emerald-200/40" style={{ borderRadius: 16 }}>
                <span className="text-2xl">💸</span>
                <div>
                  <span className="text-sm font-mono tracking-widest text-emerald-100 uppercase block">Total Time: 1 min</span>
                  <span className="text-xl font-extrabold tracking-tight">₹4,999 Revenue Generated</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
