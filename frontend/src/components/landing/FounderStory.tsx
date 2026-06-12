"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FounderStory() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto w-full relative z-10 border-t border-slate-100">
      <div className="bg-slate-50 border border-slate-200 p-8 md:p-12 shadow-xl" style={{ borderRadius: 24 }}>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
          
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#128C7E] to-[#25D366] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-4xl text-white">👋</span>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-bold px-2 py-1 uppercase tracking-widest rounded-md shadow-sm">
                Founder
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Why we built AnytimeLLM</h3>
            
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                My family ran a small retail business for 30 years. The hardest part wasn't getting customers—it was replying to them. Between managing inventory, packing orders, and attending walk-ins, WhatsApp messages piled up. By the time we replied, the customer had already bought from someone else.
              </p>
              <p>
                Every missed message was a lost sale.
              </p>
              <p>
                We built AnytimeLLM because local businesses deserve the same 24/7 automation that billion-dollar e-commerce giants have. You shouldn't need a dev team to make money while you sleep.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 mt-6 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">Aditya & The Team</div>
                <div className="text-[11px] text-slate-500 font-mono tracking-wider">BUILDING FOR MAIN STREET</div>
              </div>

              <Link
                href="/register"
                className="text-[#128C7E] hover:text-[#075E54] font-semibold text-[11px] tracking-widest uppercase flex items-center gap-1.5 transition-colors group"
              >
                Join Us
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
