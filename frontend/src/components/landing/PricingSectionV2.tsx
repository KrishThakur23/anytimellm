import React, { useState, useEffect } from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function PricingSectionV2() {
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

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full bg-transparent" id="pricing">
      
      {/* Comparison Section (Staff vs AI) */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-[3rem] font-black text-slate-900 tracking-tight mb-6">
            Cheaper than <span className="text-slate-400">hiring.</span> Faster than <span className="text-slate-400">typing.</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            A human employee works 8 hours, takes days off, and costs ₹15,000+/mo. Business Brain™ works 24/7.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-slate-50 border-2 border-slate-200 rounded-[2rem] p-8 md:p-12">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Human Employee</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-[15px] text-slate-600 font-medium"><X className="w-5 h-5 text-rose-400 shrink-0" /> Works 9 AM to 6 PM</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-600 font-medium"><X className="w-5 h-5 text-rose-400 shrink-0" /> Takes 10+ mins to reply</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-600 font-medium"><X className="w-5 h-5 text-rose-400 shrink-0" /> Makes spelling mistakes</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-600 font-medium"><X className="w-5 h-5 text-rose-400 shrink-0" /> Needs constant training</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-600 font-medium"><X className="w-5 h-5 text-rose-400 shrink-0" /> Costs ₹15,000+ per month</li>
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 to-violet-400" />
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-8">Business Brain™</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-[15px] text-slate-300 font-medium"><Check className="w-5 h-5 text-violet-400 shrink-0" /> Works 24/7/365</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-300 font-medium"><Check className="w-5 h-5 text-violet-400 shrink-0" /> Replies instantly in &lt; 1 sec</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-300 font-medium"><Check className="w-5 h-5 text-violet-400 shrink-0" /> Perfect catalog knowledge</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-300 font-medium"><Check className="w-5 h-5 text-violet-400 shrink-0" /> Learns your business instantly</li>
              <li className="flex items-center gap-4 text-[15px] text-slate-300 font-medium"><Check className="w-5 h-5 text-violet-400 shrink-0" /> Starts from ₹999/month</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-[3rem] font-black text-slate-900 tracking-tight mb-8">
          Pricing
        </h2>
        
        {successMessage && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center font-bold text-sm animate-pulse">
            {successMessage}
          </div>
        )}
        
        {/* Toggle Billing Period */}
        <div className="inline-flex items-center gap-2 bg-slate-100 p-1.5 rounded-full">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`font-bold text-sm px-8 py-3 transition-all duration-300 rounded-full ${
              billingPeriod === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`font-bold text-sm px-8 py-3 transition-all duration-300 relative rounded-full ${
              billingPeriod === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Yearly
            <span className="absolute -top-3 -right-4 px-2.5 py-1 bg-violet-500 text-[10px] text-white font-black uppercase tracking-widest rounded-md shadow-sm">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* 2 cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Starter Plan */}
        <div className="bg-white border-2 border-slate-200 p-8 md:p-12 rounded-[2rem] flex flex-col justify-between hover:shadow-xl transition-shadow">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Starter</h3>
            <p className="text-sm font-medium text-slate-500 mb-10 max-w-[85%]">
              Perfect for local shops starting with WhatsApp automation.
            </p>

            <div className="flex items-baseline gap-1 mb-10 border-b border-slate-100 pb-10">
              <span className="text-3xl font-black text-slate-300">₹</span>
              <span className="text-[4.5rem] leading-none font-black tracking-tight text-slate-900">
                {billingPeriod === "monthly" ? "999" : "799"}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-3">/ mo</span>
            </div>

            <ul className="space-y-6 mb-12">
              {["500 customer conversations/mo", "Basic catalog Q&A assistant", "Instant document ingestion", "WhatsApp integration setup"].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1"><Check className="w-5 h-5 text-emerald-500" /></div>
                  <span className="text-[15px] font-medium text-slate-700 leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {!isLoggedIn ? (
            <Link
              href="/register"
              className="w-full h-16 font-bold text-base bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-all flex items-center justify-center"
            >
              Start 15-Day Free Trial
            </Link>
          ) : userProfile?.trial_expired ? (
            <button
              onClick={() => handleUpgrade("STARTER")}
              disabled={loading}
              className="w-full h-16 font-bold text-base bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer font-semibold"
            >
              {loading ? "Processing..." : `Pay ₹${billingPeriod === "monthly" ? "999" : "799"}/mo`}
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="w-full h-16 font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all flex items-center justify-center text-center"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Growth Plan */}
        <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2rem] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-violet-400" />
          <span className="absolute top-10 right-10 bg-violet-500/20 text-violet-300 font-bold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-lg border border-violet-500/30">
            Most Popular
          </span>

          <div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-3">Growth</h3>
            <p className="text-sm font-medium text-slate-400 mb-10 max-w-[80%]">
              For growing brands needing full automation, order collection, and catalog sync.
            </p>

            <div className="flex items-baseline gap-1 mb-10 border-b border-slate-800 pb-10">
              <span className="text-3xl font-black text-slate-600">₹</span>
              <span className="text-[4.5rem] leading-none font-black tracking-tight text-white">
                {billingPeriod === "monthly" ? "2,999" : "2,399"}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-3">/ mo</span>
            </div>

            <ul className="space-y-6 mb-12">
              {["3,000 customer conversations/mo", "Full order placement & tracking", "Automatic catalog sync", "Advanced analytics dashboard"].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1"><Check className="w-5 h-5 text-violet-400" /></div>
                  <span className="text-[15px] font-medium text-slate-300 leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {!isLoggedIn ? (
            <Link
              href="/register"
              className="w-full h-16 font-bold text-base bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-lg shadow-violet-600/25 border border-violet-400 flex items-center justify-center"
            >
              Start 15-Day Free Trial
            </Link>
          ) : userProfile?.trial_expired ? (
            <button
              onClick={() => handleUpgrade("GROWTH")}
              disabled={loading}
              className="w-full h-16 font-bold text-base bg-violet-700 hover:bg-violet-600 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer border border-violet-400 shadow-lg font-semibold"
            >
              {loading ? "Processing..." : `Pay ₹${billingPeriod === "monthly" ? "2,999" : "2,399"}/mo`}
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="w-full h-16 font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all flex items-center justify-center text-center border border-emerald-500 shadow-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

      </div>

      {/* Risk Reversal */}
      <div className="max-w-3xl mx-auto mt-16 bg-white/50 backdrop-blur-md rounded-2xl p-8 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left border border-slate-200 shadow-sm">
         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
           <ShieldCheck className="w-8 h-8 text-violet-500" />
         </div>
         <div>
           <h4 className="font-black text-lg text-slate-900 mb-2">15-Day Money-Back Guarantee</h4>
           <p className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-xl">If Business Brain™ doesn't save you time and capture more orders in the first 15 days, we'll refund your payment in full. No questions asked.</p>
         </div>
      </div>
    </section>
  );
}
