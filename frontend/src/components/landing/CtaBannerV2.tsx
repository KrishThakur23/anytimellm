"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, QrCode, UploadCloud, Rocket, ChevronDown } from "lucide-react";

export default function CtaBannerV2() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setActiveFaq(prev => prev === id ? null : id);
  };

  const faqs = [
    {
      id: "wa-api",
      q: "How does the WhatsApp integration work?",
      a: "AnytimeLLM connects directly to your WhatsApp Business number. Once configured, all incoming messages trigger our secure gateway, which processes queries, scans your catalog, and replies instantly."
    },
    {
      id: "unknown",
      q: "What happens when the AI doesn't know the answer?",
      a: "If the AI is unsure, it detects a complaint, or faces a complex query, it pauses auto-replies and alerts you immediately so you can intervene manually in the Mission Control."
    },
    {
      id: "hinglish",
      q: "Does it support local Indian languages or Hinglish?",
      a: "Yes! Our engine natively understands and writes in Hindi, English, and Hinglish, mapping exactly to how local Indian customers naturally converse on WhatsApp."
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 w-full bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30 mix-blend-multiply" />
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        
        <h2 className="text-5xl md:text-[4.5rem] font-black tracking-tight text-slate-900 text-center leading-tight mb-6">
          Start Capturing <br className="hidden md:block"/> More Orders.
        </h2>
        <p className="text-xl text-slate-500 font-medium mb-16 text-center max-w-2xl">
          Deploy your WhatsApp AI Employee in minutes.
        </p>

        {/* Visual Checklist */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mb-16">
          <div className="flex-1 flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <QrCode className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">1. Scan QR</h3>
            <p className="text-[15px] font-medium text-slate-500">Connect your WhatsApp Business number securely.</p>
            {/* Arrow connecting to next step */}
            <div className="hidden md:block absolute top-1/2 -right-6 text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <UploadCloud className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">2. Upload Menu</h3>
            <p className="text-[15px] font-medium text-slate-500">Add your products, FAQs, and business rules.</p>
            {/* Arrow connecting to next step */}
            <div className="hidden md:block absolute top-1/2 -right-6 text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border-2 border-violet-500 shadow-2xl relative md:scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
              Ready
            </div>
            <div className="w-16 h-16 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">3. Go Live</h3>
            <p className="text-[15px] font-medium text-slate-500">Business Brain™ starts capturing orders 24/7.</p>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/pricing"
          className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-[1rem] font-bold text-lg tracking-wide shadow-2xl shadow-slate-900/20 flex items-center gap-3 transition-transform hover:scale-105 mb-6"
        >
          Start 15-Day Free Trial <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mb-24 text-xs font-bold text-slate-400 uppercase tracking-widest">No credit card required</p>

        {/* Top 3 FAQs (as part of CTA section) */}
        <div className="w-full max-w-3xl border-t border-slate-200 pt-16">
          <h3 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">Top Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div key={faq.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-base text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[300px]" : "max-h-0"
                    }`}
                  >
                    <p className="text-[15px] text-slate-600 font-medium leading-relaxed p-6 pt-0">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
