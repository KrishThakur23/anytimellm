"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { Check, ArrowRight, Star, ShieldCheck } from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for local shops and small businesses starting with WhatsApp automation.",
      price: billingPeriod === "monthly" ? "999" : "799",
      features: [
        "1 business workspace",
        "500 customer conversations/mo",
        "Basic catalog Q&A assistant",
        "Instant document & text ingestion",
        "Web chat widget integration",
        "WhatsApp integration setup guide"
      ],
      cta: "Start free trial",
      href: "/register",
      popular: false,
    },
    {
      name: "Growth",
      desc: "For growing brands needing full automation, order collection, and catalog sync.",
      price: billingPeriod === "monthly" ? "2,999" : "2,399",
      features: [
        "3,000 customer conversations/mo",
        "Full order placement & tracking",
        "Automatic catalog sync & updates",
        "Advanced analytics dashboard",
        "Hinglish / Multilingual AI agent",
        "Active WhatsApp Cloud API connection"
      ],
      cta: "Start free trial",
      href: "/register",
      popular: true,
    },
    {
      name: "Agency",
      desc: "For agencies or large enterprises managing multiple sub-brands and domains.",
      price: billingPeriod === "monthly" ? "7,999" : "6,399",
      features: [
        "5 sub-businesses / workspaces",
        "White-label branding options",
        "Custom domain integration",
        "Priority 24/7 dedicated support",
        "Unlimited catalog & document ingestion",
        "Dedicated agent instance scaling"
      ],
      cta: "Talk to us",
      href: "/demo",
      popular: false,
    }
  ];

  const featuresMatrix = [
    { category: "Core Volume", starter: "500 / mo", growth: "3,000 / mo", agency: "Custom / Unlimited" },
    { category: "Workspaces", starter: "1 Workspace", growth: "1 Workspace", agency: "5 Workspaces" },
    { category: "Catalog Lookups", starter: "Basic", growth: "Advanced / Sync", agency: "Advanced / Sync" },
    { category: "Order Tracking", starter: "❌", growth: "✅ Included", agency: "✅ Included" },
    { category: "Languages", starter: "English only", growth: "Hindi, English, Hinglish", agency: "Hindi, English, Hinglish" },
    { category: "Custom Domains", starter: "❌", growth: "❌", agency: "✅ Included" },
    { category: "White Labeling", starter: "❌", growth: "❌", agency: "✅ Included" },
    { category: "Support", starter: "Email support", growth: "Standard priority", agency: "24/7 Dedicated manager" }
  ];

  return (
    <div className="min-h-screen bg-[#02000f] text-white relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[400px] right-1/4 w-[400px] h-[400px] bg-indigo-600/[0.015] rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-36 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full text-center z-10">
        <div className="mb-4 inline-flex items-center gap-1.5 border border-purple-500/20 bg-purple-950/20 px-3 py-1" style={{ borderRadius: '9999px' }}>
          <Star className="w-3 h-3 text-purple-300 fill-current animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-300 uppercase font-bold">
            FLEXIBLE PLANS
          </span>
        </div>
        
        <h1 className="font-display-lg text-4xl md:text-6xl tracking-wide uppercase text-white mt-2 mb-4 max-w-3xl mx-auto leading-tight">
          Transparent, Business-First Pricing
        </h1>
        <p className="font-body-lg text-lg text-text-secondary italic max-w-xl mx-auto mb-10 leading-relaxed">
          Scale your WhatsApp customer service automation without any hidden setup fees.
        </p>

        {/* Toggle Billing Period */}
        <div className="inline-flex items-center gap-4 bg-surface-1/60 border border-border-subtle p-1.5 rounded-none backdrop-blur-md" style={{ borderRadius: 'var(--radius-lg)' }}>
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 transition-all duration-300 cursor-pointer ${
              billingPeriod === "monthly" ? "bg-white text-black font-bold" : "text-text-muted hover:text-white"
            }`}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 transition-all duration-300 relative cursor-pointer ${
              billingPeriod === "yearly" ? "bg-white text-black font-bold" : "text-text-muted hover:text-white"
            }`}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Yearly
            <span className="absolute -top-3.5 -right-3.5 px-2 py-0.5 bg-emerald-500 text-[7px] text-white tracking-widest rounded-none font-bold shadow-md" style={{ borderRadius: '4px' }}>
              -20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-8 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card-interactive flex flex-col justify-between p-8 md:p-10 relative transition-all duration-500 ${
              plan.popular 
                ? "card-glow-pulse bg-[#050314]/80 shadow-[0_0_50px_rgba(168,85,247,0.1)] scale-[1.01]" 
                : "border-border-subtle bg-surface-0/20 hover:border-purple-500/20"
            }`}
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            {/* Top border highlighting */}
            {plan.popular && (
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-500" style={{ borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
            )}

            {plan.popular && (
              <span className="absolute top-4 right-8 bg-purple-500 text-white font-mono text-[8px] tracking-[0.2em] uppercase font-bold py-1 px-3 shadow-md" style={{ borderRadius: '4px' }}>
                Most Popular
              </span>
            )}

            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase block mb-1 font-bold">
                {plan.name === "Agency" ? "ENTERPRISE" : "PLAN"}
              </span>
              <h3 className="font-display-lg text-2xl md:text-3xl tracking-wider uppercase text-white mb-2 font-bold">
                {plan.name}
              </h3>
              <p className="font-body-md text-xs text-text-secondary leading-relaxed mb-8">
                {plan.desc}
              </p>

              <div className="flex items-baseline gap-1 mb-8 border-b border-border-subtle/50 pb-6">
                <span className="font-mono text-lg text-purple-400 mr-1 font-bold">₹</span>
                <span className="font-display-lg text-4xl md:text-5xl font-bold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-text-muted uppercase ml-2">
                  / month
                </span>
                {billingPeriod === "yearly" && (
                  <span className="font-mono text-[8px] text-emerald-400 block tracking-wider uppercase ml-2.5 font-bold">
                    Billed annually
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-purple-500/20 bg-purple-950/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-purple-300" />
                    </div>
                    <span className="font-body-md text-xs text-text-secondary leading-normal">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={plan.popular ? "/register" : plan.href}
              className={`w-full h-12 font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 ${
                plan.popular
                  ? "bg-white text-black hover:bg-purple-600 hover:text-white"
                  : "border border-border-subtle hover:border-white text-white hover:bg-white/[0.02]"
              }`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {plan.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </section>

      {/* Feature Matrix comparison */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto w-full z-10">
        <div className="text-center mb-12">
          <div className="mb-2 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase font-bold">COMPARISON MATRIX</span>
          </div>
          <h2 className="font-display-lg text-2xl md:text-3xl tracking-wide uppercase text-white mt-1">
            Compare Features Side-by-Side
          </h2>
        </div>

        <div className="border border-border-subtle bg-[#070518]/50 backdrop-blur-md overflow-x-auto shadow-2xl" style={{ borderRadius: 'var(--radius-xl)' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-1/40 font-mono text-[9px] tracking-[0.2em] text-purple-300 uppercase">
                <th className="p-5 font-bold">Feature</th>
                <th className="p-5 font-bold">Starter</th>
                <th className="p-5 font-bold">Growth</th>
                <th className="p-5 font-bold">Agency</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-xs md:text-sm text-text-secondary">
              {featuresMatrix.map((row, idx) => (
                <tr key={idx} className="border-b border-border-subtle/40 last:border-b-0 hover:bg-purple-900/[0.05] transition-colors">
                  <td className="p-5 font-mono text-[10px] tracking-wider uppercase text-white font-semibold">{row.category}</td>
                  <td className="p-5">{row.starter}</td>
                  <td className="p-5">{row.growth}</td>
                  <td className="p-5">{row.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
