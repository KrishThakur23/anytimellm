"use client";

import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Global Elements
import StickyBusinessBrain from "@/components/ui/StickyBusinessBrain";
import ContextualGuidance from "@/components/ui/ContextualGuidance";
import StickyMobileCta from "@/components/ui/StickyMobileCta";

// Homepage Sections (Exactly 7)
import HeroSectionV2 from "@/components/landing/HeroSectionV2";
import InteractiveStoryV2 from "@/components/landing/InteractiveStoryV2";
import BusinessBrainReveal from "@/components/landing/BusinessBrainReveal";
import IndustrySwitcherV2 from "@/components/landing/IndustrySwitcherV2";
import MissionControlV2 from "@/components/landing/MissionControlV2";
import PricingSectionV2 from "@/components/landing/PricingSectionV2";
import CtaBannerV2 from "@/components/landing/CtaBannerV2";

export default function LandingPage() {
  // Hide global chat bubble entirely on homepage
  useEffect(() => {
    const chatBubble = document.getElementById("global-chat-bubble");
    if (chatBubble) {
      chatBubble.style.display = "none";
    }
    return () => {
      if (chatBubble) chatBubble.style.display = "block";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500/30 bg-gradient-hero">
      {/* Background Dot Pattern Overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none mix-blend-multiply" />
      
      {/* Subtle Violet Orb Behind Header */}
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-[100%] pointer-events-none" />

      {/* Editorial Status Bar */}
      <StickyBusinessBrain />

      {/* Optional contextual toasts for "aha" moments */}
      <ContextualGuidance />

      {/* Fixed top layout header */}
      <Header />

      {/* Mobile Sticky CTA */}
      <StickyMobileCta />

      <main className="flex-1 w-full flex flex-col">
        {/* ────────────────────────────────────────────────────────────────
           SECTION 1: HERO (Pain + Hope + Proof Loop)
           ──────────────────────────────────────────────────────────────── */}
        <HeroSectionV2 />

        {/* ────────────────────────────────────────────────────────────────
           SECTION 2: INTERACTIVE STORY (Emotional Narrative + Revenue Dopamine)
           ──────────────────────────────────────────────────────────────── */}
        <InteractiveStoryV2 />

        {/* ────────────────────────────────────────────────────────────────
           SECTION 3: BUSINESS BRAIN REVEAL (Apple-style Sticky Scroll)
           ──────────────────────────────────────────────────────────────── */}
        <BusinessBrainReveal />

        {/* ────────────────────────────────────────────────────────────────
           SECTION 4: INDUSTRY PROOF (Real Business Names + Trust Markers)
           ──────────────────────────────────────────────────────────────── */}
        <IndustrySwitcherV2 />

        {/* ────────────────────────────────────────────────────────────────
           SECTION 5: MISSION CONTROL (Real UI + Real Outcomes)
           ──────────────────────────────────────────────────────────────── */}
        <MissionControlV2 />

        {/* ────────────────────────────────────────────────────────────────
           SECTION 6: CTA BANNER (Launch in 3 Minutes Setup)
           ──────────────────────────────────────────────────────────────── */}
        <CtaBannerV2 />

        {/* ────────────────────────────────────────────────────────────────
           SECTION 7: PRICING (Staff vs AI + Risk Reversal + Pricing)
           ──────────────────────────────────────────────────────────────── */}
        <PricingSectionV2 />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
