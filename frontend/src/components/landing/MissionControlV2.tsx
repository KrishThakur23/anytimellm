"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, ShoppingBag, ArrowUpRight, Sparkles } from "lucide-react";

export default function MissionControlV2() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full bg-transparent">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-[3rem] font-black text-slate-900 tracking-tight mb-6">
          People buy <span className="text-slate-400">outcomes.</span>
        </h2>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
          Business Brain™ doesn't just chat. It resolves queries, captures leads, and generates revenue while you sleep.
        </p>
      </div>

      {/* Real UI Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto bg-[#F8FAFC] border border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden"
      >
        {/* App Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-[10px] flex items-center justify-center">
               <Sparkles className="w-5 h-5 text-white" />
             </div>
             <div>
               <span className="font-black text-slate-900 block leading-tight tracking-tight">Today's Performance</span>
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">dashboard.anytimellm.com</span>
             </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 md:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
            
            {/* Primary Metric: Revenue */}
            <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-md transition-shadow">
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Revenue Generated Today</h3>
                 <div className="flex items-baseline gap-4">
                   <span className="text-5xl md:text-[5rem] font-black text-slate-900 tracking-tight">₹12,490</span>
                   <div className="flex items-center gap-1 text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-md text-sm">
                     <ArrowUpRight className="w-4 h-4" />
                     24%
                   </div>
                 </div>
              </div>
              <div className="w-full md:w-auto flex-1 max-w-sm h-28 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden flex items-end px-4 gap-2 pb-4 pt-8">
                 {/* Fake Sparkline */}
                 {[40, 30, 60, 45, 80, 55, 90, 100].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={inView ? { height: `${h}%` } : { height: 0 }}
                     transition={{ duration: 1, delay: i * 0.1 }}
                     className="flex-1 bg-emerald-400 rounded-t-sm"
                   />
                 ))}
              </div>
            </div>

            {/* Metric 2: Orders */}
            <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
               <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Orders Created</h3>
                 <span className="text-5xl font-black text-slate-900 tracking-tight">3</span>
                 <div className="mt-3 text-sm font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 inline-block rounded">Perfect accuracy</div>
               </div>
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                 <ShoppingBag className="w-6 h-6 text-slate-400" />
               </div>
            </div>

            {/* Metric 3: Customers Helped */}
            <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
               <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Customers Helped</h3>
                 <span className="text-5xl font-black text-slate-900 tracking-tight">14</span>
                 <div className="mt-3 text-sm font-semibold text-blue-500 bg-blue-50 px-2 py-1 inline-block rounded">2 leads recovered</div>
               </div>
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                 <Users className="w-6 h-6 text-slate-400" />
               </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
