"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Clock, MessageSquare, AlertCircle, Bot } from "lucide-react";

export default function InteractiveStoryV2() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-[3rem] font-black text-slate-900 tracking-tight mb-6">
          The difference is <span className="text-slate-400">instant.</span>
        </h2>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
          Customers don't wait. See how Business Brain™ captures the sale while your competitors are still typing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {/* Traditional */}
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden shadow-sm">
          <div className="absolute top-8 left-8">
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Without AnytimeLLM</span>
          </div>

          <div className="space-y-6 w-full max-w-[320px] mt-8">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                 <MessageSquare className="w-4 h-4 text-slate-400" />
               </div>
               <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm text-[15px] font-medium text-slate-600 shadow-sm">
                 Do you have this in medium? I want to buy now.
               </div>
             </div>

             <div className="flex flex-col items-center gap-3 text-slate-400 opacity-60 py-2">
               <Clock className="w-5 h-5 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest">2 Hours Later</span>
             </div>

             <div className="flex items-start gap-4 opacity-60">
               <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                 <MessageSquare className="w-4 h-4 text-slate-400" />
               </div>
               <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm text-[15px] font-medium text-slate-600 shadow-sm">
                 Nevermind, bought it from someone else.
               </div>
             </div>

             <div className="pt-8 mt-8 border-t border-slate-200 w-full text-center">
               <div className="inline-flex items-center gap-2 text-slate-400 font-black text-2xl">
                 <AlertCircle className="w-6 h-6 text-slate-300" />
                 <span>Lost Sale</span>
               </div>
             </div>
          </div>
        </div>

        {/* AnytimeLLM */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <div className="absolute top-8 left-8">
            <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">With AnytimeLLM</span>
          </div>

          <div className="space-y-6 w-full max-w-[320px] mt-8">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                 <MessageSquare className="w-4 h-4 text-slate-400" />
               </div>
               <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-sm text-[15px] font-medium text-slate-300 shadow-sm">
                 Do you have this in medium? I want to buy now.
               </div>
             </div>

             <div className="flex justify-end items-start gap-4 pt-2">
               <div className="bg-emerald-500 border border-emerald-400 p-4 rounded-2xl rounded-tr-sm text-[15px] font-medium text-white shadow-sm">
                 Yes! 2 left in stock. I've created your order here:
               </div>
               <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30 border border-violet-400">
                 <Bot className="w-5 h-5 text-white" />
               </div>
             </div>

             <div className="pt-8 mt-8 border-t border-slate-800 w-full text-center">
               <div className="inline-flex flex-col items-center">
                 <span className="text-[10px] font-bold text-emerald-500/70 tracking-widest uppercase mb-1">Revenue Generated</span>
                 <div className="text-emerald-400 font-black text-5xl md:text-6xl leading-none tracking-tight flex items-center gap-1 drop-shadow-sm">
                   <span className="text-3xl md:text-4xl -mt-2">₹</span>
                   <Counter value={899} />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, inView]);

  return <span ref={ref}>{count}</span>;
}
