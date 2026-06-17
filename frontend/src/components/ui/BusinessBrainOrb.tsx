"use client";

import React, { useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import { MessageSquare, ShoppingBag, Brain, DollarSign, Sparkles } from "lucide-react";

export default function BusinessBrainOrb({ className = "" }: { className?: string }) {
  const msgRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);
  const knowRef = useRef<HTMLDivElement>(null);
  const revRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((time) => {
    // time is in ms
    const radiusOuter = 160; // 320px diameter / 2
    const radiusInner = 110;

    // Messages (outer, clockwise)
    if (msgRef.current) {
      const angle = (time * 0.0004) % (Math.PI * 2);
      const x = Math.cos(angle) * radiusOuter;
      const y = Math.sin(angle) * radiusOuter;
      msgRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Orders (outer, counter-clockwise)
    if (orderRef.current) {
      const angle = (-time * 0.0005 + Math.PI) % (Math.PI * 2);
      const x = Math.cos(angle) * radiusOuter;
      const y = Math.sin(angle) * radiusOuter;
      orderRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Knowledge (inner, clockwise)
    if (knowRef.current) {
      const angle = (time * 0.0006 + Math.PI / 2) % (Math.PI * 2);
      const x = Math.cos(angle) * radiusInner;
      const y = Math.sin(angle) * radiusInner;
      knowRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Revenue (inner, counter-clockwise)
    if (revRef.current) {
      const angle = (-time * 0.0007 + Math.PI * 1.5) % (Math.PI * 2);
      const x = Math.cos(angle) * radiusInner;
      const y = Math.sin(angle) * radiusInner;
      revRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  return (
    <div className={`relative flex items-center justify-center w-[360px] h-[360px] ${className}`}>
      {/* Central Node */}
      <div className="absolute w-20 h-20 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center z-20 border border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Minimal Orbits */}
      <div className="absolute w-[320px] h-[320px] rounded-full border border-slate-200 opacity-60"></div>
      <div className="absolute w-[220px] h-[220px] rounded-full border border-slate-200 border-dashed opacity-40"></div>

      {/* Flowing Nodes */}
      
      {/* Messages */}
      <div ref={msgRef} className="absolute flex items-center justify-center z-30">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
           <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
           <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Messages</span>
        </div>
      </div>

      {/* Orders */}
      <div ref={orderRef} className="absolute flex items-center justify-center z-30">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
           <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
           <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Orders</span>
        </div>
      </div>

      {/* Knowledge */}
      <div ref={knowRef} className="absolute flex items-center justify-center z-30">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
           <Brain className="w-3.5 h-3.5 text-slate-600" />
           <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Knowledge</span>
        </div>
      </div>

      {/* Revenue */}
      <div ref={revRef} className="absolute flex items-center justify-center z-30">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
           <DollarSign className="w-3.5 h-3.5 text-slate-600" />
           <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Revenue</span>
        </div>
      </div>

    </div>
  );
}
