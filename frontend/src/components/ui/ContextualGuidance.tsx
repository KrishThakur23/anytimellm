"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ContextualGuidance() {
  const [toast, setToast] = useState<{ id: string; message: string; link?: string } | null>(null);

  useEffect(() => {
    // Show a hint after 20 seconds
    const timer = setTimeout(() => {
      setToast({
        id: "demo-hint",
        message: "Want to see a live demo?",
        link: "/demo"
      });
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 pr-12 flex items-center gap-3 relative"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <Sparkles className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
              {toast.link && (
                <Link href={toast.link} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5 transition-colors">
                  Check it out <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            <button 
              onClick={() => setToast(null)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
