"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { ArrowUpRight, Award, MessageSquare, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative flex flex-col justify-between overflow-x-hidden selection:bg-violet-100 selection:text-violet-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      
      <Header />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="relative pt-40 pb-16 px-6 md:px-12 max-w-4xl mx-auto w-full text-center z-10">
        <div className="mb-6 inline-flex items-center gap-1.5 border border-violet-200/50 bg-violet-50/50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
          <Heart className="w-3.5 h-3.5 text-violet-600 animate-pulse fill-violet-600/20" />
          <span className="text-[10px] tracking-[0.2em] text-violet-700 uppercase font-bold">
            OUR MISSION
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 mt-2 mb-6 leading-[1.1] font-extrabold">
          Solving the 24/7 responsiveness problem for local businesses.
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Small businesses lose customers every day simply because they can't reply to WhatsApps instantly. We are leveling the playing field.
        </p>
      </section>

      {/* Main Grid content */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto w-full z-10 grid grid-cols-1 md:grid-cols-12 gap-16 items-start mb-32">
        
        {/* Founder Card Info (cols 1-5) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 md:p-8 text-center hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-500 relative group rounded-3xl">
            
            {/* Founder Photo Graphic */}
            <div className="aspect-square w-full border border-slate-200/50 relative overflow-hidden group mb-6 rounded-2xl bg-slate-100">
              <img 
                src="/founder_gaurav.png" 
                alt="Gaurav Sharma" 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/5 to-transparent z-10 opacity-80" />
              <span className="absolute bottom-4 left-4 text-[9px] tracking-[0.2em] text-white uppercase z-20 font-bold bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-full">
                FOUNDER
              </span>
            </div>

            <span className="text-[10px] tracking-[0.2em] text-violet-600 uppercase block mb-2 font-bold">
              Engineering & Product
            </span>
            <h3 className="text-xl tracking-tight text-slate-900 font-bold mb-2">
              Gaurav Sharma
            </h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              "Building conversational commerce for the millions of businesses that run entirely on chat."
            </p>

            {/* LinkedIn Redirect Link */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all duration-300 font-bold rounded-xl shadow-sm"
            >
              Connect on LinkedIn
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

          </div>
        </div>

        {/* Brand Story and Context (cols 6-12) */}
        <div className="md:col-span-7 flex flex-col gap-6 text-base text-slate-600 leading-relaxed text-left md:pl-8">
          
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-violet-600/30"></div>
            <span className="text-[10px] tracking-[0.2em] text-violet-600 uppercase font-bold">THE STORY</span>
          </div>

          <p className="text-lg text-slate-800 font-medium leading-snug">
            In India, WhatsApp is not just a messaging app; it is the digital operating system for commerce.
          </p>

          <p>
            From local kirana shops and boutique fashion brands to large distributors, millions of customer deals are initiated, negotiated, and settled via chat threads every single day. However, managing hundreds of manual messages, checking stock lists, and updating catalog coordinates takes hours of precious business time.
          </p>

          <p>
            AnytimeLLM was built to bridge this gap. We wanted to create an intelligent assistant that learns your pricing grids instantly and responds to customers in Hindi, English, or Hinglish just like a human store manager would.
          </p>

          <p>
            By combining easy catalog uploads, order tracking database logic, and simple WhatsApp webhook triggers, we allow business owners to sleep soundly knowing their customers are served 24/7 without delays or coding hassles.
          </p>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex gap-4 items-start p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:border-violet-200 hover:shadow-md transition-all duration-300">
              <Award className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[13px] tracking-tight text-slate-900 font-bold mb-1">Local-First Solution</span>
                <span className="text-[11px] leading-tight text-slate-500 font-medium">Built specifically for Indian business workflows.</span>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:border-violet-200 hover:shadow-md transition-all duration-300">
              <MessageSquare className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[13px] tracking-tight text-slate-900 font-bold mb-1">Multilingual AI</span>
                <span className="text-[11px] leading-tight text-slate-500 font-medium">Answers fluently in Hindi, English & Hinglish.</span>
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
