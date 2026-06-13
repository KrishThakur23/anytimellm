"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  UploadCloud, 
  Link2, 
  ChevronDown, 
  Database,
  Send,
  CheckCircle2,
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  Check,
  Globe,
  Settings,
  HelpCircle,
  FileText,
  Bot
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import FloatingParticles from "@/components/effects/FloatingParticles";
import CursorEffects from "@/components/effects/CursorEffects";
import GradientOrb from "@/components/effects/GradientOrb";
import AnimatedGradientMesh from "@/components/effects/AnimatedGradientMesh";

import IndustrySwitcher from "@/components/landing/IndustrySwitcher";
import MissionControlPreview from "@/components/landing/MissionControlPreview";
import TransformationJourney from "@/components/landing/TransformationJourney";
import WhatsAppIntegration from "@/components/landing/WhatsAppIntegration";
import KnowledgeBaseSimulator from "@/components/landing/KnowledgeBaseSimulator";
import FounderStory from "@/components/landing/FounderStory";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import HeroSimulation from "@/components/landing/HeroSimulation";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FloatingEventCard from "@/components/landing/FloatingEventCard";
import FloatingCTA from "@/components/landing/FloatingCTA";
import TrustedBy from "@/components/landing/TrustedBy";

export default function LandingPage() {




  return (
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden select-none">
      {/* Global Client Cursor Effects */}
      <CursorEffects />

      {/* Subtle Grid / Particle background */}
      <FloatingParticles />
      
      {/* 🚀 Launch Banner */}
      <div className="w-full bg-[#25D366] text-[#054C44] text-xs md:text-sm font-semibold text-center py-2 px-4 z-50 relative flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4" />
        <span>We are officially launching! Get 50% off your first 3 months with code <strong>LAUNCH50</strong>.</span>
      </div>

      {/* Fixed top layout header */}
      <Header />

      {/* Decorative Orbs */}
      <GradientOrb size={600} top="0%" left="-10%" color="rgba(18, 140, 126, 0.04)" duration={30} />
      <GradientOrb size={500} top="30%" right="-5%" color="rgba(37, 211, 102, 0.04)" duration={25} />
      <GradientOrb size={700} top="60%" left="20%" color="rgba(52, 183, 241, 0.03)" duration={35} />

      {/* Floating Global CTA */}
      <FloatingCTA />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 1: HERO
         ──────────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 px-6 md:px-12 w-full z-10 cursor-spotlight overflow-hidden">
        <AnimatedGradientMesh />
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center relative z-10">
          
          {/* Sub-header tag line */}
          <div className="mb-6 inline-flex items-center gap-2 border border-[#DCF8C6] bg-[#F0F2F5]/80 px-3.5 py-1.5 backdrop-blur-md" style={{ borderRadius: '9999px' }}>
            <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#075E54] uppercase font-bold">
              AI Operating System for Local Businesses
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-8">
            Never Miss Another Customer. <br className="hidden md:inline" />
            <span className="text-gradient-hero">Automate WhatsApp & Web.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="font-body text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl font-normal">
            Every message, order, question, and lead handled automatically. Upload your catalog, connect your business WhatsApp, and go live in 3 minutes.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 relative z-10 justify-center">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
              className="h-12 px-8 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 group shadow-lg shadow-[#25D366]/25 magnetic-btn"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/sandbox"
              className="h-12 px-8 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white/80 backdrop-blur-md font-semibold text-sm tracking-wide flex items-center justify-center transition-all duration-300 shadow-sm"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Explore Live Demo
            </Link>
          </div>

          {/* Hero Simulation Container */}
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Floating Event Cards around Simulation */}
            <div className="hidden lg:block">
              <FloatingEventCard
                icon={<MessageSquare className="h-5 w-5" />}
                title="Customer Replied"
                subtitle="via WhatsApp"
                position={{ top: "10%", left: "-5%" }}
                delay={0}
              />
              <FloatingEventCard
                icon={<Database className="h-5 w-5" />}
                title="Knowledge Retrieved"
                subtitle="from Product Catalog"
                position={{ top: "45%", right: "-8%" }}
                delay={1.5}
              />
              <FloatingEventCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Order Created"
                subtitle="Automatically verified"
                position={{ bottom: "10%", left: "-10%" }}
                delay={3}
                isRevenue={true}
              />
            </div>
            
            <HeroSimulation />
          </div>
        </div>

        {/* Main Hero Poster/Banner */}
        <div className="relative w-full max-w-5xl mx-auto mt-20 px-4 z-20 perspective-1000">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 bg-white/95 flex flex-col md:flex-row transform hover:scale-[1.01] transition-transform duration-500">
            {/* Sidebar */}
            <div className="w-64 bg-slate-50/50 border-r border-slate-200/50 p-6 hidden md:flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#128C7E] to-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-slate-800 tracking-tight text-lg">AnytimeLLM</span>
              </div>
              <div className="space-y-2 mt-4">
                {['Overview', 'Live Agents', 'Knowledge Base', 'Analytics', 'Settings'].map((item, i) => (
                  <div key={i} className={`h-10 px-4 rounded-lg flex items-center text-sm font-medium transition-colors ${i === 1 ? 'bg-white shadow-sm border border-slate-200 text-[#128C7E]' : 'text-slate-500 hover:bg-slate-200/30'}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 bg-slate-50/30">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Live Agent Activity</h3>
                  <p className="text-sm text-slate-500 mt-1">Real-time conversations handled by your AI.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#128C7E]"></span>
                  </span>
                  <span className="text-xs font-bold tracking-wide text-slate-700">SYSTEM ACTIVE</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chat Panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[320px]">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JD</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">John Doe</p>
                        <p className="text-[10px] text-slate-500">WhatsApp • Just now</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 text-[#128C7E]" />
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-[#E5DDD5]/10 space-y-4 overflow-hidden">
                    <div className="flex justify-start">
                      <div className="bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm text-xs text-slate-700 max-w-[85%] border border-slate-100">
                        Do you offer bulk discounts for the premium tier?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] px-3 py-2 rounded-lg rounded-tr-none shadow-sm text-xs text-slate-800 max-w-[85%] border border-[#DCF8C6] flex flex-col gap-1">
                        <p>Yes, John! We offer a 20% discount on yearly billing for 5+ licenses. Would you like me to send you the custom pricing link?</p>
                        <span className="text-[9px] text-[#128C7E] self-end flex items-center gap-1 font-medium mt-1">
                          <Bot className="w-3 h-3"/> Sent by AI
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics Panel */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Value Generated Today</h4>
                    <div className="text-4xl font-black text-slate-800 tracking-tight mb-2">$1,240.00</div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md flex items-center gap-1">
                        ↑ 14%
                      </div>
                      <span className="text-xs text-slate-500">vs yesterday</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6 flex-1 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl group-hover:bg-violet-500/30 transition-colors duration-500"></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Time Saved</h4>
                    <div className="text-4xl font-black text-white tracking-tight mb-2">14<span className="text-lg text-slate-400 font-medium">h</span> 32<span className="text-lg text-slate-400 font-medium">m</span></div>
                    <p className="text-xs text-slate-400">Through autonomous query resolution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Banner */}
      <TrustedBy />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 2: INDUSTRY SWITCHER
         ──────────────────────────────────────────────────────────────── */}
      <div id="switcher" className="scroll-mt-24">
        <IndustrySwitcher />
      </div>



      {/* ────────────────────────────────────────────────────────────────
         SECTION 4: TRANSFORMATION JOURNEY
         ──────────────────────────────────────────────────────────────── */}
      <TransformationJourney />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 5: WHATSAPP INTEGRATION
         ──────────────────────────────────────────────────────────────── */}
      <WhatsAppIntegration />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 6: KNOWLEDGE BASE
         ──────────────────────────────────────────────────────────────── */}
      <KnowledgeBaseSimulator />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 7: FOUNDER STORY
         ──────────────────────────────────────────────────────────────── */}
      <FounderStory />

      {/* Mid-Page Banner (Dealism Style CSS Mockup) */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#25D366]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#128C7E]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 relative group">
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-12">
              <div className="max-w-xl">
                <h3 className="text-white font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                  Connect your business to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#128C7E]">global network.</span>
                </h3>
                <p className="text-slate-300 font-body text-lg mb-8 leading-relaxed">
                  Deploy autonomous AI operators that live where your customers live. No downloads, no new apps, just seamless conversational commerce.
                </p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl hover:shadow-white/20 flex items-center gap-2"
                >
                  Deploy Your Agent Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Abstract Nodes Graphic built with CSS */}
              <div className="relative w-full max-w-md h-[300px] flex items-center justify-center">
                <div className="absolute w-64 h-64 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute w-48 h-48 border border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                
                {/* Center Node */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#128C7E] to-[#25D366] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#25D366]/40 z-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '3s' }}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-10 right-10 w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-1/2 -right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 animate-pulse">
                  <Server className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
         SECTION 7: MISSION CONTROL PREVIEW
         ──────────────────────────────────────────────────────────────── */}
      <MissionControlPreview />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 9: PRICING (MONTHLY/YEARLY)
         ──────────────────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 10: FAQ (ACCORDION STYLING)
         ──────────────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ────────────────────────────────────────────────────────────────
         SECTION 11: CTA BANNER
         ──────────────────────────────────────────────────────────────── */}
      <CtaBanner />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
