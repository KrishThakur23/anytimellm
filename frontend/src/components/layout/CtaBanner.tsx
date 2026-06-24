"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative w-full py-24 px-6 md:px-12 bg-white overflow-hidden z-10">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#128C7E]/10 to-[#25D366]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#128C7E] to-[#25D366] p-10 md:p-20 text-center relative z-10 shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-2xl)' }}>
        {/* Decorative elements within the banner */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

        <span className="font-mono text-[9px] tracking-[0.25em] text-cyan-200 uppercase block mb-4 font-bold">
          GET STARTED TODAY
        </span>
        
        <h2 className="font-display text-4xl md:text-6xl tracking-tight text-white mb-6 leading-tight max-w-3xl mx-auto font-extrabold">
          Never Miss Another Customer.
        </h2>
        
        <p className="font-body text-base md:text-lg text-white/95 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
          Start your free trial. Set up in under 3 minutes. No credit card required.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
          <Link
            href="/pricing"
            className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 group shadow-md"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/demo"
            className="w-full sm:w-auto h-12 px-8 border border-white/30 hover:border-white text-white hover:bg-white/10 font-semibold text-sm tracking-wide flex items-center justify-center transition-all duration-300"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
