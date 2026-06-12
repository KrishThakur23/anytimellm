"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingEventCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  delay?: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  isRevenue?: boolean;
}

export default function FloatingEventCard({
  icon,
  title,
  subtitle,
  delay = 0,
  position,
  isRevenue = false,
}: FloatingEventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="absolute z-20 pointer-events-none"
      style={position}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay % 2, // stagger the floating slightly
        }}
        className={`flex items-center gap-3 rounded-2xl border p-3 shadow-lg backdrop-blur-xl ${
          isRevenue
            ? "border-emerald-200/50 bg-emerald-50/80 shadow-emerald-500/10"
            : "border-slate-200/60 bg-white/80 shadow-slate-900/5"
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isRevenue
              ? "bg-emerald-100 text-emerald-600"
              : "bg-[#DCF8C6] text-[#128C7E]"
          }`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${
              isRevenue ? "text-emerald-700" : "text-slate-900"
            }`}
          >
            {title}
          </p>
          {subtitle && <p className="text-base text-slate-500">{subtitle}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}
