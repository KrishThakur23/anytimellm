"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TabTransitionProps {
  tabKey: string;
  children: React.ReactNode;
}

export default function TabTransition({ tabKey, children }: TabTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, x: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -12, filter: "blur(4px)" }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
