"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full" id="pricing">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] text-[11px] font-semibold tracking-wider uppercase" style={{ borderRadius: 9999 }}>
          Pricing Plans
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Plans built to scale with you
        </h2>
        <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
          Choose the perfect plan. Start a 14-day free trial on any tier today.
        </p>

        {/* Toggle Billing Period */}
        <div className="mt-8 inline-flex items-center gap-4 bg-slate-50 border border-slate-200 p-1.5 backdrop-blur-md" style={{ borderRadius: 16 }}>
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 transition-all duration-300 cursor-pointer ${
              billingPeriod === "monthly" ? "bg-white text-slate-900 font-bold shadow-md" : "text-slate-400 hover:text-slate-700"
            }`}
            style={{ borderRadius: 10 }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 transition-all duration-300 relative cursor-pointer ${
              billingPeriod === "yearly" ? "bg-white text-slate-900 font-bold shadow-md" : "text-slate-400 hover:text-slate-700"
            }`}
            style={{ borderRadius: 10 }}
          >
            Yearly
            <span className="absolute -top-3.5 -right-3.5 px-2 py-0.5 bg-emerald-500 text-[7px] text-white tracking-widest font-bold shadow-sm" style={{ borderRadius: '4px' }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* 3 cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Starter Plan */}
        <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 relative card-tilt" style={{ borderRadius: 20 }}>
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#128C7E] uppercase block mb-1 font-bold">
              BASIC AUTOMATION
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide mb-2">Starter</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-6">
              Perfect for local shops and small businesses starting with WhatsApp automation.
            </p>

            <div className="flex items-baseline gap-1 mb-8 border-b border-slate-100 pb-6">
              <span className="font-mono text-lg text-slate-400 mr-1 font-bold">₹</span>
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
                {billingPeriod === "monthly" ? "999" : "799"}
              </span>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase ml-2">/ month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "1 business workspace",
                "500 customer conversations/mo",
                "Basic catalog Q&A assistant",
                "Instant document & text ingestion",
                "Web chat widget integration",
                "WhatsApp integration setup guide"
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#25D366]/20 bg-[#25D366]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#128C7E]" />
                  </div>
                  <span className="text-[12px] text-slate-600 leading-normal">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
            className="w-full h-12 font-semibold text-base tracking-wider uppercase border border-slate-200 hover:border-slate-300 text-slate-700 bg-white flex items-center justify-center gap-1.5 transition-all duration-300 shadow-xs"
            style={{ borderRadius: 10 }}
          >
            Start free trial
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Growth Plan (Popular) */}
        <div className="bg-white border-2 border-[#25D366] p-8 flex flex-col justify-between transition-all duration-300 relative shadow-xl scale-[1.01] card-tilt" style={{ borderRadius: 20 }}>
          {/* Top border highlighting */}
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#128C7E] to-[#25D366]" style={{ borderRadius: '20px 20px 0 0' }} />
          
          <span className="absolute top-4 right-8 bg-[#128C7E] text-white font-mono text-[8px] tracking-[0.2em] uppercase font-bold py-1 px-3 shadow-sm" style={{ borderRadius: '4px' }}>
            Most Popular
          </span>

          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#128C7E] uppercase block mb-1 font-bold">
              FULL SCALE AUTOMATION
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide mb-2">Growth</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-6">
              For growing brands needing full automation, order collection, and catalog sync.
            </p>

            <div className="flex items-baseline gap-1 mb-8 border-b border-slate-100 pb-6">
              <span className="font-mono text-lg text-slate-400 mr-1 font-bold">₹</span>
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
                {billingPeriod === "monthly" ? "2,999" : "2,399"}
              </span>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase ml-2">/ month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "3,000 customer conversations/mo",
                "Full order placement & tracking",
                "Automatic catalog sync & updates",
                "Advanced analytics dashboard",
                "Hinglish / Multilingual AI agent",
                "Active WhatsApp Cloud API connection"
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#25D366]/20 bg-[#25D366]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#128C7E]" />
                  </div>
                  <span className="text-[12px] text-slate-600 leading-normal">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
            className="w-full h-12 font-semibold text-base tracking-wider uppercase text-white bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md magnetic-btn"
            style={{ borderRadius: 10 }}
          >
            Start free trial
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Agency Plan */}
        <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 relative card-tilt" style={{ borderRadius: 20 }}>
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#128C7E] uppercase block mb-1 font-bold">
              ENTERPRISE SCALING
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide mb-2">Agency</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-6">
              For agencies or large enterprises managing multiple sub-brands and domains.
            </p>

            <div className="flex items-baseline gap-1 mb-8 border-b border-slate-100 pb-6">
              <span className="font-mono text-lg text-slate-400 mr-1 font-bold">₹</span>
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
                {billingPeriod === "monthly" ? "7,999" : "6,399"}
              </span>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase ml-2">/ month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "5 sub-businesses / workspaces",
                "White-label branding options",
                "Custom domain integration",
                "Priority 24/7 dedicated support",
                "Unlimited catalog & document ingestion",
                "Dedicated agent instance scaling"
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#25D366]/20 bg-[#25D366]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#128C7E]" />
                  </div>
                  <span className="text-[12px] text-slate-600 leading-normal">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/demo"
            className="w-full h-12 font-semibold text-base tracking-wider uppercase border border-slate-200 hover:border-slate-300 text-slate-700 bg-white flex items-center justify-center gap-1.5 transition-all duration-300 shadow-xs"
            style={{ borderRadius: 10 }}
          >
            Talk to us
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
