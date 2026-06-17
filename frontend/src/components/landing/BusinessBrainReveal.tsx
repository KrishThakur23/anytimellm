"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BusinessBrainReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Calculate opacities based on scroll progress
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [0.2, 1, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4, 0.5], [0.2, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [0.2, 1, 1]);
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.8, 0.9], [0.2, 1, 1]);
  const opacity5 = useTransform(scrollYProgress, [0.8, 1, 1], [0.2, 1, 1]);

  return (
    <section ref={containerRef} className="h-[200vh] bg-transparent text-slate-900 relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-hero opacity-30 pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-4 md:space-y-6">
          <motion.h3 style={{ opacity: opacity1 }} className="text-4xl md:text-[4rem] font-black tracking-tight leading-none text-slate-900">
            Reads your catalog.
          </motion.h3>
          <motion.h3 style={{ opacity: opacity2 }} className="text-4xl md:text-[4rem] font-black tracking-tight leading-none text-slate-900">
            Understands your business.
          </motion.h3>
          <motion.h3 style={{ opacity: opacity3 }} className="text-4xl md:text-[4rem] font-black tracking-tight leading-none text-slate-900">
            Answers customers.
          </motion.h3>
          <motion.h3 style={{ opacity: opacity4 }} className="text-4xl md:text-[4rem] font-black tracking-tight leading-none text-emerald-500">
            Creates orders.
          </motion.h3>
          <motion.h3 style={{ opacity: opacity5 }} className="text-4xl md:text-[4rem] font-black tracking-tight leading-none text-violet-600">
            Never sleeps.
          </motion.h3>
        </div>
      </div>
    </section>
  );
}
