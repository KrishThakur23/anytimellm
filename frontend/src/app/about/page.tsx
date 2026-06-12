"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { ArrowUpRight, Award, MessageSquare, Heart } from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Background Glows */}
      <div className="absolute top-[10%] left-1/3 w-[500px] h-[500px] bg-purple-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-36 pb-8 px-6 md:px-12 max-w-5xl mx-auto w-full text-center z-10">
        <div className="mb-4 inline-flex items-center gap-1.5 border border-purple-100 bg-purple-50 px-3 py-1" style={{ borderRadius: '9999px' }}>
          <Heart className="w-3.5 h-3.5 text-purple-600 animate-pulse fill-current" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-600 uppercase font-bold">
            OUR MISSION
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-slate-900 mt-2 mb-4 leading-tight font-extrabold">
          Built for Indian SMBs who live on WhatsApp
        </h1>
        <p className="font-body text-base md:text-lg text-slate-500 italic max-w-2xl mx-auto mb-12 leading-relaxed">
          Empowering millions of small and medium businesses in India to automate order collection and answer catalog inquiries instantly.
        </p>
      </section>

      {/* Main Grid content */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto w-full z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
        
        {/* Founder Card Info (cols 1-5) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full border border-slate-200 bg-slate-50/50 p-6 md:p-8 text-center hover:border-purple-200 hover:bg-white hover:shadow-xl hover:shadow-purple-100/35 transition-all duration-300 relative group rounded-3xl">
            
            {/* Founder Photo Graphic */}
            <div className="aspect-square w-full border border-slate-200 relative overflow-hidden group mb-6 rounded-2xl">
              <img 
                src="/founder_gaurav.png" 
                alt="Gaurav Sharma" 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10" />
              <span className="absolute bottom-4 left-6 font-mono text-[8px] tracking-[0.2em] text-white uppercase z-20 font-bold bg-purple-600 border border-purple-500 px-2.5 py-0.5 rounded-full">
                FOUNDER PROFILE
              </span>
            </div>

            <span className="font-mono text-[8px] tracking-[0.2em] text-purple-600 uppercase block mb-1 font-bold">
              Founder & Builder
            </span>
            <h3 className="font-display text-xl tracking-wide uppercase text-slate-900 font-bold mb-1">
              Gaurav Sharma
            </h3>
            <p className="font-body text-xs text-slate-500 italic mb-6">
              "Solving conversational commerce for local shops."
            </p>

            {/* LinkedIn Redirect Link */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 border border-slate-200 hover:border-slate-400 text-slate-700 font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 font-bold rounded-xl"
            >
              Connect on LinkedIn
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

          </div>
        </div>

        {/* Brand Story and Context (cols 6-12) */}
        <div className="md:col-span-7 flex flex-col gap-6 font-body text-base text-slate-600 leading-relaxed text-left">
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] tracking-[0.25em] text-purple-600 uppercase font-bold">THE STORY BEHIND ANYTIMELLM</span>
          </div>

          <p className="italic">
            In India, WhatsApp is not just an app; it is the digital operating system for commerce. From local kirana shops and boutique fashion brands to large distributors, millions of customer deals are initiated, negotiated, and settled via chat threads every single day. However, managing hundreds of manual messages, checking stock lists, and updating catalog coordinates takes hours of precious business time.
          </p>

          <p className="italic">
            AnytimeLLM was built to bridge this gap. We wanted to create an intelligent assistant that learns your pricing grids instantly and responds to customers in Hindi, English, or Hinglish just like a human store manager would. By combining easy catalog uploads, order tracking database logic, and simple WhatsApp webhook triggers, we allow business owners to sleep soundly knowing their customers are served 24/7 without delays or coding hassles.
          </p>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex gap-3 items-start p-4 bg-purple-50/60 border border-purple-100" style={{ borderRadius: 'var(--radius-md)' }}>
              <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-display text-xs uppercase tracking-wider text-slate-800 font-bold">Local-First Solution</span>
                <span className="font-mono text-[8px] tracking-wider text-slate-500 uppercase mt-0.5 font-bold">Built specifically for Indian businesses</span>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 bg-purple-50/60 border border-purple-100" style={{ borderRadius: 'var(--radius-md)' }}>
              <MessageSquare className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-display text-xs uppercase tracking-wider text-slate-800 font-bold">Multilingual AI</span>
                <span className="font-mono text-[8px] tracking-wider text-slate-500 uppercase mt-0.5 font-bold">Answers fluently in Hindi & Hinglish</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
