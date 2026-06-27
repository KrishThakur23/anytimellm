"use client";

import React from "react";
import { MessageSquare, Database, Brain, ShoppingBag, TrendingUp, ArrowRight, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function BusinessBrainMotif({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 md:gap-4 text-slate-400 opacity-80 ${className}`}>
      <div className="flex flex-col items-center gap-1">
        <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">Message</span>
      </div>
      <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 text-slate-300" />
      <div className="flex flex-col items-center gap-1">
        <Database className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">Knowledge</span>
      </div>
      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-slate-300" />
      <div className="flex flex-col items-center gap-1">
        <Brain className="w-4 h-4 md:w-5 md:h-5 text-violet-500" />
        <span className="text-[9px] md:text-[10px] font-bold text-violet-500 uppercase tracking-widest hidden sm:block">Brain</span>
      </div>
      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-slate-300" />
      <div className="flex flex-col items-center gap-1">
        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
        <span className="text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest hidden sm:block">Order</span>
      </div>
      <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-slate-300" />
      <div className="flex flex-col items-center gap-1">
        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-slate-900" />
        <span className="text-[9px] md:text-[10px] font-bold text-slate-900 uppercase tracking-widest hidden sm:block">Revenue</span>
      </div>
    </div>
  );
}
