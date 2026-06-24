"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Bot, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSectionV2() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep > 3) {
        currentStep = 0;
      }
      setStep(currentStep);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-16 pb-16 px-6 md:px-12 w-full z-10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left: Copy */}
        <div className="flex-1 max-w-2xl z-10">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Business Brain™ OS</span>
          </div>

          <h1 className="text-5xl md:text-[4rem] font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
            Every missed WhatsApp message is a <span className="text-slate-400">customer buying elsewhere.</span>
          </h1>

          <p className="text-xl text-slate-600 font-medium mb-10 max-w-xl leading-relaxed">
            Turn WhatsApp conversations into orders, bookings, and revenue 24/7. Your AI employee replies instantly, so you never lose a sale again.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <Link
              href="/pricing"
              className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Start Capturing More Orders
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex flex-col justify-center text-sm text-slate-500 font-medium">
              <span>Deploy your WhatsApp</span>
              <span>AI Employee in minutes.</span>
            </div>
          </div>
        </div>

        {/* Right: 5s Proof Loop with Orb */}
        <div className="flex-1 w-full max-w-md relative z-10 perspective-1000">
           {/* The Business Brain Orb */}
           <motion.div 
             animate={{ 
               scale: [1, 1.05, 1],
               opacity: [0.4, 0.6, 0.4]
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500 rounded-full blur-[80px] -z-20 pointer-events-none"
           />
           
           {/* Decor Frame */}
           <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[2rem] transform rotate-2 scale-105 -z-10 border border-white/20 shadow-2xl"></div>
           
           <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 relative overflow-hidden h-[420px] flex flex-col justify-center">
             
             {/* Timeline track */}
             <div className="absolute left-12 top-20 bottom-20 w-0.5 bg-slate-200/50"></div>

             <div className="space-y-8">
               {/* Step 0: Customer */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: step >= 0 ? 1 : 0, y: step >= 0 ? 0 : 10 }}
                 className="relative pl-12"
               >
                 <div className="absolute left-[-1.125rem] w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm z-10">
                   <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                 </div>
                 <div className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Customer • 10:42 AM</div>
                 <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm inline-block max-w-[90%] font-medium">
                   Do you have the blue linen shirt in large?
                 </div>
               </motion.div>

               {/* Step 1: AI */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 10 }}
                 className="relative pl-12"
               >
                 <div className="absolute left-[-1.125rem] w-8 h-8 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center shadow-sm z-10">
                   <Bot className="w-4 h-4 text-violet-600" />
                 </div>
                 <div className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Business Brain™ • 10:42 AM</div>
                 <div className="bg-emerald-50 border border-emerald-100/50 p-3.5 rounded-2xl rounded-tl-sm text-sm text-emerald-900 shadow-sm inline-block font-medium">
                   Yes, we have 3 left in Large! Would you like me to reserve one or create an order for you?
                 </div>
               </motion.div>

               {/* Step 2: Order */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.95 }}
                 className="relative pl-12"
               >
                 <div className="absolute left-[-1.125rem] w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-sm z-10">
                   <ShoppingBag className="w-3.5 h-3.5 text-white" />
                 </div>
                 <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg mt-1 relative overflow-hidden">
                   {/* Background shimmer */}
                   {step >= 2 && (
                     <motion.div 
                       initial={{ x: "-100%" }}
                       animate={{ x: "100%" }}
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                       className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 z-10"
                     />
                   )}
                   <div className="flex items-center justify-between mb-2">
                     <div className="font-bold text-slate-900 text-sm">Order Created</div>
                     <div className="text-emerald-600 font-bold text-sm">₹1,499</div>
                   </div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Link Sent via WhatsApp</div>
                 </div>
               </motion.div>
             </div>
           </div>
        </div>

      </div>
    </section>
  );
}
