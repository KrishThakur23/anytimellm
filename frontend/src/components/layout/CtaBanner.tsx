"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative w-full py-20 px-6 md:px-12 bg-[#02000f] overflow-hidden z-10">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-purple-600/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="max-w-4xl mx-auto border border-border-subtle p-8 md:p-16 text-center bg-[#070518]/45 backdrop-blur-md relative z-10 transition-colors hover:border-purple-500/25 duration-500" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase block mb-4 font-bold">
          GET STARTED TODAY
        </span>
        
        <h2 className="font-display-lg text-3xl md:text-5xl tracking-wide uppercase text-white mb-4 leading-tight">
          Ready to automate your customer service?
        </h2>
        
        <p className="font-body-lg text-lg text-text-secondary max-w-xl mx-auto italic mb-10">
          Start your 14-day free trial, no credit card needed. Set up your AI assistant in under 5 minutes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto h-12 px-8 bg-white text-black hover:bg-purple-600 hover:text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 group font-bold"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform animate-pulse" />
          </Link>
          <Link
            href="/demo"
            className="w-full sm:w-auto h-12 px-8 border border-border-subtle hover:border-white text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center transition-all duration-300 font-bold"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
