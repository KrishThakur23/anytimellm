"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIMULATION_STEPS = [
  { id: "step-1", type: "customer", text: "Do you have black shirts in size M?" },
  { id: "step-2", type: "brain", text: "Analyzing intent: 'Product Availability'" },
  { id: "step-3", type: "brain", text: "Searching catalog for: 'black shirts size M'" },
  { id: "step-4", type: "brain", text: "Found 17 products. 3 in stock." },
  { id: "step-5", type: "operator", text: "Yes, we have 3 black shirts in size M available right now!" },
  { id: "step-6", type: "customer", text: "Great, I'll take one. Deliver to my address." },
  { id: "step-7", type: "brain", text: "Extracting address from customer profile..." },
  { id: "step-8", type: "brain", text: "Creating order #1042..." },
  { id: "step-9", type: "operator", text: "Done! Your order #1042 is confirmed. I'll send the payment link shortly." },
  { id: "step-10", type: "revenue", text: "Order Created" }
];

export default function HeroSimulation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < SIMULATION_STEPS.length ? prev + 1 : 0));
    }, 2000); // 2 seconds per step

    return () => clearInterval(interval);
  }, []);

  const visibleSteps = SIMULATION_STEPS.slice(0, currentStep === 0 ? 0 : currentStep);

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12 rounded-2xl border border-slate-200/60 bg-white/95 shadow-xl overflow-hidden">
      {/* Mac-like Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="text-base font-medium text-slate-400">Live Automation</div>
        <div className="w-8" />
      </div>

      <div className="p-6">
        <div className="space-y-4 min-h-[320px] flex flex-col justify-end">
          <AnimatePresence initial={false}>
            {visibleSteps.map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className={`flex w-full ${
                  step.type === "customer"
                    ? "justify-start"
                    : step.type === "brain"
                    ? "justify-center"
                    : step.type === "revenue"
                    ? "justify-center mt-6"
                    : "justify-end"
                }`}
              >
                {step.type === "customer" && (
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-800">
                    {step.text}
                  </div>
                )}
                {step.type === "operator" && (
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#128C7E] px-4 py-2.5 text-sm text-white shadow-md shadow-violet-500/20">
                    {step.text}
                  </div>
                )}
                {step.type === "brain" && (
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-500">{step.text}</span>
                  </div>
                )}
                {step.type === "revenue" && (
                  <div className="flex flex-col items-center gap-1 animate-pulse-dot">
                    <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm shadow-emerald-500/10">
                      <span className="text-base font-bold text-emerald-600 uppercase tracking-wider">{step.text}</span>
                    </div>
                    <span className="text-lg font-black text-emerald-500">+ ₹899</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
