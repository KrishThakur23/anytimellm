"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { Check, ArrowRight, Star, ShieldCheck } from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("anytimellm-token");
    if (token) {
      setIsLoggedIn(true);
      api.getMe()
        .then(profile => {
          setUserProfile(profile);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleUpgrade = async (planType: string) => {
    setLoading(true);
    try {
      await api.upgradePlan(planType);
      setSuccessMessage(`Successfully upgraded to ${planType}! Redirecting to dashboard...`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade subscription.");
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#25D366]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[400px] right-1/4 w-[400px] h-[400px] bg-[#128C7E]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-36 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full text-center z-10">
        <div className="mb-4 inline-flex items-center gap-1.5 border border-[#25D366]/20 bg-[#25D366]/10 px-3 py-1" style={{ borderRadius: '9999px' }}>
          <Star className="w-3 h-3 text-[#128C7E] fill-current animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#128C7E] uppercase font-bold">
            FLEXIBLE PLANS
          </span>
        </div>
        
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-slate-900 mt-2 mb-4 max-w-3xl mx-auto leading-tight font-extrabold">
          Transparent, Business-First Pricing
        </h1>
        <p className="font-body text-base md:text-lg text-slate-500 italic max-w-xl mx-auto mb-10 leading-relaxed">
          Scale your WhatsApp customer service automation without any hidden setup fees.
        </p>

        {/* Toggle Billing Period */}
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/60 p-1 rounded-full backdrop-blur-md">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 transition-all duration-300 cursor-pointer rounded-full ${
              billingPeriod === "monthly" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 transition-all duration-300 relative cursor-pointer rounded-full ${
              billingPeriod === "yearly" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Yearly
            <span className="absolute -top-3.5 -right-3 px-2 py-0.5 bg-emerald-500 text-[7px] text-white tracking-widest rounded-full font-bold shadow-sm">
              -20%
            </span>
          </button>
        </div>
      </section>

      {/* Success Message Banner */}
      {successMessage && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center font-bold text-sm animate-pulse z-10">
          {successMessage}
        </div>
      )}

      {/* Pricing Cards Section */}
      <section className="py-8 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col justify-between p-8 md:p-10 relative transition-all duration-500 rounded-3xl ${
              plan.popular 
                ? "border border-[#25D366]/40 bg-white shadow-xl scale-[1.02] ring-1 ring-[#25D366]/20 shadow-[#25D366]/10" 
                : "border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 shadow-sm hover:shadow-md"
            }`}
          >
            {/* Top border highlighting */}
            {plan.popular && (
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#128C7E] to-[#25D366] rounded-t-3xl" />
            )}

            {plan.popular && (
              <span className="absolute top-4 right-8 bg-[#128C7E] text-white font-mono text-[8px] tracking-[0.2em] uppercase font-bold py-1 px-3 rounded-full shadow-sm">
                Most Popular
              </span>
            )}

            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#128C7E] uppercase block mb-1 font-bold">
                {plan.name === "Agency" ? "ENTERPRISE" : "PLAN"}
              </span>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight text-slate-900 mb-2 font-bold">
                {plan.name}
              </h3>
              <p className="font-body text-xs text-slate-500 leading-relaxed mb-8">
                {plan.desc}
              </p>

              <div className="flex items-baseline gap-1 mb-8 border-b border-slate-200/60 pb-6">
                <span className="font-mono text-lg text-[#128C7E] mr-1 font-bold">₹</span>
                <span className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                  {plan.price}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase ml-2">
                  / month
                </span>
                {billingPeriod === "yearly" && (
                  <span className="font-mono text-[8px] text-emerald-600 block tracking-wider uppercase ml-2.5 font-bold">
                    Billed annually
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border border-[#25D366]/20 bg-[#25D366]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#128C7E]" />
                    </div>
                    <span className="font-body text-xs text-slate-600 leading-normal">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.name !== "Agency" ? (
              <>
                {!isLoggedIn ? (
                  <Link
                    href="/register"
                    className={`w-full h-12 font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 rounded-xl font-bold ${
                      plan.popular
                        ? "bg-[#128C7E] text-white hover:bg-[#0c6b60] shadow-lg shadow-[#128C7E]/20"
                        : "border border-slate-200 hover:border-slate-400 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Start 15-Day Free Trial
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : userProfile?.trial_expired ? (
                  <button
                    onClick={() => handleUpgrade(plan.name.toUpperCase())}
                    disabled={loading}
                    className={`w-full h-12 font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 rounded-xl font-bold cursor-pointer disabled:opacity-50 ${
                      plan.popular
                        ? "bg-[#128C7E] text-white hover:bg-[#0c6b60] shadow-lg shadow-[#128C7E]/20"
                        : "border border-slate-200 hover:border-slate-400 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {loading ? "Processing..." : `Pay ₹${plan.price}`}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="w-full h-12 font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg text-center"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/demo"
                className="w-full h-12 font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 rounded-xl font-bold border border-slate-200 hover:border-slate-400 text-slate-700 hover:bg-slate-50"
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </section>

      {/* Feature Matrix comparison */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto w-full z-10">
        <div className="text-center mb-12">
          <div className="mb-2 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#128C7E]" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#128C7E] uppercase font-bold">COMPARISON MATRIX</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-slate-900 mt-1 font-bold">
            Compare Features Side-by-Side
          </h2>
        </div>

        <div className="border border-slate-200 bg-white overflow-x-auto shadow-lg rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase">
                <th className="p-5 font-bold">Feature</th>
                <th className="p-5 font-bold">Starter</th>
                <th className="p-5 font-bold">Growth</th>
                <th className="p-5 font-bold">Agency</th>
              </tr>
            </thead>
            <tbody className="font-body text-xs md:text-sm text-slate-600">
              {featuresMatrix.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-mono text-[10px] tracking-wider uppercase text-slate-900 font-semibold">{row.category}</td>
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
