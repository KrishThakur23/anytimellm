"use client";

import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";

interface OnboardingHeroProps {
  businessName: string;
  setBusinessName: (val: string) => void;
  businessIdInput: string;
  setBusinessIdInput: (val: string) => void;
  loadingBusiness: boolean;
  error: string | null;
  handleCreateBusiness: (e: React.FormEvent) => void;
  handleLoadBusiness: (e: React.FormEvent) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function OnboardingHero({
  businessName,
  setBusinessName,
  businessIdInput,
  setBusinessIdInput,
  loadingBusiness,
  error,
  handleCreateBusiness,
  handleLoadBusiness,
  theme,
  toggleTheme,
}: OnboardingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle mouse interaction for background movement
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      const blurredShapes = document.querySelectorAll(".blur-shapes");
      
      blurredShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        gsap.to(shape, {
          x: moveX * speed,
          y: moveY * speed,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Initial load animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      brandRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 }
    ).fromTo(
      ".onboarding-content-animate",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      "-=0.4"
    ).fromTo(
      visualRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8 },
      "-=0.3"
    );

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col bg-oatmeal-bg text-ink-text relative overflow-x-hidden transition-colors duration-300"
    >
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-transparent h-16 flex items-center px-margin-mobile md:px-margin-desktop justify-between">
        <div ref={brandRef} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-ink-text text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          <span className="font-headline-md text-headline-md text-ink-text tracking-tight font-extrabold">AnytimeLLM</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-r border-border-subtle pr-4 mr-4 hidden md:inline">
            Status: Operational
          </span>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-parchment-surface dark:bg-surface-container hover:bg-surface-container-low text-ink-text rounded-full border border-border-subtle transition-all duration-200 shadow-sm"
            title="Toggle Day/Night mode"
          >
            {theme === "dark" ? (
              <span className="material-symbols-outlined text-[16px] text-amber-500 block">light_mode</span>
            ) : (
              <span className="material-symbols-outlined text-[16px] text-indigo-500 block">dark_mode</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-margin-mobile">
        {/* Abstract Background Graphic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blur-shapes absolute top-[15%] left-[10%] w-[600px] h-[600px] opacity-[0.05] rounded-full border border-primary blur-3xl"></div>
          <div className="blur-shapes absolute bottom-[10%] right-[5%] w-[400px] h-[400px] opacity-[0.03] rounded-full border border-muted-gold blur-2xl"></div>
          {/* Intelligent Grid Lines */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)", backgroundSize: "80px 80px" }}></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="onboarding-content-animate mb-6 inline-flex items-center gap-2 px-3 py-1 bg-surface-container/30 border border-border-subtle rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-label-xs text-label-xs text-on-secondary-container uppercase tracking-widest font-bold">WhatsApp Assistant Platform</span>
          </div>

          {/* Headline */}
          <h1 className="onboarding-content-animate font-display-lg text-display-lg text-ink-text mb-4 max-w-2xl leading-tight font-extrabold">
            Automatic WhatsApp Assistant for Your Shop
          </h1>

          {/* Value Prop */}
          <p className="onboarding-content-animate font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl font-semibold">
            Let customers chat with your shop on WhatsApp! They can search your products, check prices, read details, and place orders automatically 24/7.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="onboarding-content-animate w-full max-w-3xl mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs leading-relaxed text-left animate-pulse">
              <span className="material-symbols-outlined text-[16px] text-red-500 shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Onboarding Bento Box Grid Layout */}
          <div className="onboarding-content-animate grid grid-cols-1 md:grid-cols-12 gap-gutter w-full max-w-3xl px-2">
            {/* Primary Action Card: Initialize Tenant */}
            <div className="md:col-span-7 bg-parchment-surface dark:bg-surface-container border border-border-subtle p-8 text-left flex flex-col justify-between transition-all duration-300 hover:bg-white dark:hover:bg-surface-container-high rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:scale-[1.01] hover:border-emerald-500/40">
              <div>
                <h3 className="font-headline-md text-headline-md text-ink-text mb-2 font-black">🆕 Create New Shop Assistant</h3>
                <p className="font-body-md text-on-surface-variant mb-8 text-xs leading-relaxed font-bold">
                  Create a smart assistant for your shop in 10 seconds! Type your shop's name below to begin.
                </p>
              </div>
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g. Gaurav Jewellers (गौरव ज्वैलर्स) or Kirana Store"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded-md px-4 py-3.5 text-xs focus:outline-none focus:border-emerald-500 text-ink-text placeholder:text-outline transition-all duration-200 font-bold"
                />
                <button
                  type="submit"
                  disabled={loadingBusiness}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-4 px-6 rounded-md flex items-center justify-center gap-2 transition-all active:scale-[0.95] hover:scale-[1.01] disabled:opacity-50 uppercase tracking-wider shadow-[0_4px_15px_rgba(16,185,129,0.3)] border-none cursor-pointer"
                >
                  {loadingBusiness ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  ) : (
                    <>
                      🚀 CREATE MY SHOP CHATBOT (सहायक बनाएं)
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Secondary Action Card: Resume Tenant */}
            <div className="md:col-span-5 bg-surface-container-low dark:bg-surface-container border border-border-subtle p-8 text-left flex flex-col justify-between transition-all duration-300 rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:scale-[1.01] hover:border-blue-500/40">
              <div>
                <h3 className="font-headline-md text-headline-md text-ink-text mb-2 font-black">🔑 Open Existing Shop</h3>
                <p className="font-body-md text-on-surface-variant mb-6 text-xs leading-relaxed font-bold">
                  Enter your secret Shop ID key below to open your assistant settings.
                </p>
              </div>
              <form onSubmit={handleLoadBusiness} className="space-y-4">
                <input
                  type="text"
                  placeholder="Paste your Shop ID key here"
                  value={businessIdInput}
                  onChange={(e) => setBusinessIdInput(e.target.value)}
                  className="w-full bg-parchment-surface dark:bg-surface-container-low border border-border-subtle rounded-md px-4 py-3.5 text-xs focus:outline-none focus:border-blue-500 text-ink-text placeholder:text-outline font-mono transition-all duration-200 font-bold"
                />
                <button
                  type="submit"
                  disabled={loadingBusiness}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-4 px-6 rounded-md flex items-center justify-center gap-2 transition-all active:scale-[0.95] hover:scale-[1.01] disabled:opacity-50 uppercase tracking-wider shadow-[0_4px_15px_rgba(37,99,235,0.3)] border-none cursor-pointer"
                >
                  {loadingBusiness ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  ) : (
                    "🔓 OPEN MY SHOP SETTINGS"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Step-by-Step Flowchart */}
          <div ref={visualRef} className="mt-10 w-full max-w-3xl bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-2xl p-6 shadow-md hover:scale-[1.01] hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden">
            <h4 className="font-black text-xs text-ink-text uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-emerald-500 animate-pulse">sync_alt</span>
              How Your Shop Chatbot Works (यह कैसे काम करता है)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              {/* Step 1 */}
              <div className="md:col-span-1 flex flex-col items-center p-4 rounded-xl bg-surface-container-low dark:bg-surface-container-high border border-border-subtle hover:border-blue-500 hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] transition-all duration-200 cursor-pointer">
                <span className="material-symbols-outlined text-[28px] text-blue-500 mb-2">forum</span>
                <span className="text-[10px] font-black text-ink-text text-center whitespace-nowrap">1. Customer Chats</span>
                <span className="text-[9px] text-on-surface-variant text-center font-bold mt-1">ग्राहक सवाल पूछता है</span>
              </div>
              {/* Arrow */}
              <div className="md:col-span-1 hidden md:flex justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
              {/* Step 2 */}
              <div className="md:col-span-1 flex flex-col items-center p-4 rounded-xl bg-surface-container-low dark:bg-surface-container-high border border-border-subtle hover:border-purple-500 hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)] transition-all duration-200 cursor-pointer">
                <span className="material-symbols-outlined text-[28px] text-purple-500 mb-2">send_to_mobile</span>
                <span className="text-[10px] font-black text-ink-text text-center whitespace-nowrap">2. Sent via WhatsApp</span>
                <span className="text-[9px] text-on-surface-variant text-center font-bold mt-1">व्हाट्सएप पर जाता है</span>
              </div>
              {/* Arrow */}
              <div className="md:col-span-1 hidden md:flex justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
              {/* Step 3 */}
              <div className="md:col-span-1 flex flex-col items-center p-4 rounded-xl bg-surface-container-low dark:bg-surface-container-high border border-border-subtle hover:border-amber-500 hover:shadow-[0_4px_12px_rgba(245,158,11,0.15)] transition-all duration-200 cursor-pointer">
                <span className="material-symbols-outlined text-[28px] text-amber-500 mb-2">smart_toy</span>
                <span className="text-[10px] font-black text-ink-text text-center whitespace-nowrap">3. Chatbot Answers</span>
                <span className="text-[9px] text-on-surface-variant text-center font-bold mt-1">रोबोट जवाब देता है</span>
              </div>
              {/* Arrow */}
              <div className="md:col-span-1 hidden md:flex justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
              {/* Step 4 */}
              <div className="md:col-span-1 flex flex-col items-center p-4 rounded-xl bg-surface-container-low dark:bg-surface-container-high border border-border-subtle hover:border-emerald-500 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] transition-all duration-200 cursor-pointer">
                <span className="material-symbols-outlined text-[28px] text-emerald-500 mb-2">task_alt</span>
                <span className="text-[10px] font-black text-ink-text text-center whitespace-nowrap">4. Happy Customer</span>
                <span className="text-[9px] text-on-surface-variant text-center font-bold mt-1">ग्राहक खुश!</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <footer className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-on-surface-variant font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-full shadow-sm hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[16px] text-emerald-500 font-bold">verified_user</span>
              <span className="font-label-xs text-[10px] uppercase font-black tracking-wider">🔒 Safe & Secure (100% सुरक्षित)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 rounded-full shadow-sm hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[16px] text-blue-500 font-bold">cloud_done</span>
              <span className="font-label-xs text-[10px] uppercase font-black tracking-wider">⚡ Super Fast (बहुत तेज़)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 rounded-full shadow-sm hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[16px] text-purple-500 font-bold">dns</span>
              <span className="font-label-xs text-[10px] uppercase font-black tracking-wider">💬 Works on WhatsApp (व्हाट्सएप पर चालू)</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
