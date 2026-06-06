"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { Play, Calendar, CheckCircle2, ChevronRight, User, Building, Phone, Send } from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    whatsappNumber: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.businessType || !formData.whatsappNumber) return;
    
    setSubmitting(true);
    // Simulate booking submission
    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#02000f] text-white relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Background Glows */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <section className="relative pt-36 pb-8 px-6 md:px-12 max-w-5xl mx-auto w-full text-center z-10">
        <div className="mb-4 inline-flex items-center gap-1.5 border border-purple-500/20 bg-purple-950/20 px-3 py-1" style={{ borderRadius: '9999px' }}>
          <Calendar className="w-3.5 h-3.5 text-purple-300 animate-pulse fill-current" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-300 uppercase font-bold">
            LIVE WALKTHROUGH
          </span>
        </div>
        <h1 className="font-display-lg text-4xl md:text-6xl tracking-wide uppercase text-white mt-2 mb-4 leading-tight">
          See it work in 2 minutes
        </h1>
        <p className="font-body-lg text-lg text-text-secondary italic max-w-2xl mx-auto mb-12 leading-relaxed">
          Watch how an AnytimeLLM AI agent automatically reads a catalog and answers complex order requests on WhatsApp.
        </p>
      </section>

      {/* Video / Chat Mockup Container */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto w-full z-10 mb-20">
        <div className="border border-border-subtle bg-[#070518]/45 backdrop-blur-md p-4 md:p-8 rounded-none relative overflow-hidden shadow-2xl flex items-center justify-center" style={{ borderRadius: 'var(--radius-2xl)' }}>
          
          <div className="w-full max-w-md aspect-[9/16] md:aspect-video border border-border-subtle bg-black relative flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.02)] transition-all duration-300" style={{ borderRadius: 'var(--radius-xl)' }}>
            
            {isPlaying ? (
              // Live Interactive Mockup
              <div className="w-full h-full relative bg-[#0b141a] flex flex-col text-left font-sans text-xs select-none animate-in fade-in duration-500">
                
                {/* Custom Mobile Header */}
                <div className="bg-[#202c33] p-3 border-b border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-950/45 border border-purple-500/20 flex items-center justify-center font-bold text-white text-[10px]">
                    AL
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[11px] text-white/95 leading-tight">AnytimeLLM Assistant</span>
                    <span className="text-[9px] text-[#00a884] font-medium mt-0.5 leading-none">Online</span>
                  </div>
                  <span className="font-mono text-[9px] text-white/30 ml-auto">9:41 AM</span>
                </div>

                {/* Chat Log Window */}
                <div className="space-y-4 overflow-y-auto flex-1 p-4 font-body-md text-xs leading-normal">
                  
                  {/* Customer Msg 1 */}
                  <div className="p-3 bg-[#202c33] text-white/90 max-w-[85%] border border-white/5 shadow-sm animate-in fade-in duration-500 delay-300" style={{ borderRadius: '0 10px 10px 10px' }}>
                    <p className="font-mono text-[8px] text-white/40 uppercase tracking-wider mb-1">Customer</p>
                    Do you have a deep cleaning service available for tomorrow? And what is the price?
                  </div>
                  
                  {/* Agent Msg 1 */}
                  <div className="p-3 bg-[#005c4b] text-white max-w-[85%] ml-auto border border-white/5 shadow-sm animate-in fade-in duration-500 delay-[1200ms]" style={{ borderRadius: '10px 0 10px 10px' }}>
                    <p className="font-mono text-[8px] text-white/60 uppercase tracking-wider mb-1">AI Assistant</p>
                    Yes! We have our **Deep Cleaning Package** available. The price is ₹2,499. Would you like me to book this for tomorrow?
                  </div>

                  {/* Customer Msg 2 */}
                  <div className="p-3 bg-[#202c33] text-white/90 max-w-[85%] border border-white/5 shadow-sm animate-in fade-in duration-500 delay-[2400ms]" style={{ borderRadius: '0 10px 10px 10px' }}>
                    <p className="font-mono text-[8px] text-white/40 uppercase tracking-wider mb-1">Customer</p>
                    Yes please, book it. Email is gaurav@example.com
                  </div>

                  {/* Agent Msg 2 */}
                  <div className="p-3 bg-[#005c4b] text-white max-w-[85%] ml-auto border border-white/5 shadow-sm animate-in fade-in duration-500 delay-[3600ms]" style={{ borderRadius: '10px 0 10px 10px' }}>
                    <p className="font-mono text-[8px] text-white/60 uppercase tracking-wider mb-1">AI Assistant</p>
                    Perfect! Order created for **Deep Cleaning** for tomorrow. Order ID: **#ORD-7392**. We sent details to gaurav@example.com.
                  </div>

                </div>

                {/* Mock Input Bar */}
                <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-white/5">
                  <div className="flex-1 bg-[#2a3942] rounded-full py-2 px-4 text-white/30 text-[10px]">
                    Type a message...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Close Button overlay */}
                <button 
                  onClick={() => setIsPlaying(false)} 
                  className="absolute bottom-16 right-4 bg-black/80 hover:bg-black border border-border-subtle hover:border-white px-3 py-1.5 font-mono text-[8px] tracking-widest uppercase text-white shadow-lg transition-all"
                  style={{ borderRadius: '4px' }}
                >
                  Reset Demo
                </button>

              </div>
            ) : (
              // Cover Layout
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 filter grayscale transition-transform duration-700 group-hover:scale-105" 
                  style={{ backgroundImage: `url('/luxury_watch_precision.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Play Trigger */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 w-20 h-20 rounded-full border border-white bg-black/60 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-500 transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.06)] cursor-pointer"
                  aria-label="Play video demo"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>

                <div className="absolute bottom-6 left-6 z-10 text-left">
                  <span className="font-mono text-[8px] tracking-[0.2em] text-purple-400 uppercase block mb-1 font-bold">
                    INTERACTIVE PREVIEW
                  </span>
                  <span className="font-display-lg text-lg tracking-wider uppercase text-white font-bold block">
                    Click to launch WhatsApp simulator
                  </span>
                </div>
              </>
            )}

          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12 px-6 md:px-12 max-w-xl mx-auto w-full z-10 mb-20">
        <div className="glass-card-interactive border p-8 md:p-10 bg-[#070518]/40 backdrop-blur-md relative" style={{ borderRadius: 'var(--radius-2xl)' }}>
          
          {formSubmitted ? (
            // Success State
            <div className="text-center py-6 animate-in zoom-in-95 duration-350">
              <div className="w-12 h-12 bg-purple-950/20 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-display-lg text-xl tracking-wider uppercase text-white mb-2 font-bold">
                Demo Booking Received!
              </h3>
              <p className="font-body-md text-sm text-text-secondary leading-relaxed mb-6">
                Thanks, {formData.name}. Our WhatsApp solutions expert will contact you at <strong>{formData.whatsappNumber}</strong> to show a live catalog sync demo customized for your business.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: "", businessType: "", whatsappNumber: "" });
                }}
                className="font-mono text-[10px] tracking-[0.2em] uppercase border border-border-subtle px-6 py-2.5 hover:border-white text-white transition-colors"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Book another demo
              </button>
            </div>
          ) : (
            // Booking Form
            <>
              <div className="mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-purple-400 uppercase mb-2 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  Live Meeting
                </div>
                <h3 className="font-display-lg text-2xl tracking-wider uppercase text-white mb-2 font-bold">
                  Book a live demo
                </h3>
                <p className="font-body-md text-xs text-text-secondary leading-relaxed">
                  Fill in your details below and a solutions expert will reach out over WhatsApp to run a live catalog sync tailored to your products.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.15em] text-text-muted uppercase mb-1.5 flex items-center gap-1.5 font-semibold">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2 text-sm text-white placeholder-muted-soft focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] tracking-[0.15em] text-text-muted uppercase mb-1.5 flex items-center gap-1.5 font-semibold">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    Business Type
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Retail, Food, Distributor"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2 text-sm text-white placeholder-muted-soft focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] tracking-[0.15em] text-text-muted uppercase mb-1.5 flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2 text-sm text-white placeholder-muted-soft focus:outline-none transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-white hover:bg-purple-600 hover:text-white text-black font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer disabled:opacity-50 font-bold"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  {submitting ? "Booking..." : "Submit request"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
