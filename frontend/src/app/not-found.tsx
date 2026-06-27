"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MoveRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500/30 font-body">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none mix-blend-multiply" />
      
      {/* Ambient Gradient Glow */}
      <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[600px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <Header />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10 py-24">
        <span className="font-display text-[100px] md:text-[140px] font-bold text-slate-200 leading-none tracking-tighter mb-4 block selection:bg-transparent">
          404
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          This page does not exist.
        </h1>
        <p className="font-body text-base md:text-lg text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
          The link might be broken, or the page has moved. Let us get you back to your workspace or catalog.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            Go to homepage
          </Link>
          <Link
            href="/dashboard"
            className="h-12 px-6 border border-slate-200 hover:border-slate-350 text-slate-700 bg-slate-50/50 hover:bg-slate-50 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            Open dashboard
            <MoveRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
