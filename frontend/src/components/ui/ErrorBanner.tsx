"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 overflow-hidden"
        >
          <div className="p-4 bg-[var(--accent-red-muted)] border border-[var(--accent-red)]/25 rounded-none flex justify-between items-center text-red-650 dark:text-red-200 text-sm backdrop-blur-sm shadow-none">
            <div className="flex gap-2.5 items-center">
              <div className="p-1.5 bg-red-500/10 rounded-none">
                <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
              </div>
              <span className="font-semibold">{message}</span>
            </div>
            <button
              onClick={onDismiss}
              className="p-1.5 hover:bg-red-500/10 rounded-none text-zinc-550 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
