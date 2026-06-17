"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function StickyBusinessBrain() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (~600px)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 hidden md:block ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-full px-5 py-2.5 flex items-center gap-6">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Business Brain™</span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Knowledge Loaded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">WhatsApp Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Ready to Assist</span>
          </div>
        </div>
      </div>
    </div>
  );
}
