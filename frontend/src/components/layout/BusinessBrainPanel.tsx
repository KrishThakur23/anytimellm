"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface BusinessBrainPanelProps {
  onTabChange?: (tab: "overview" | "ingest" | "catalog" | "playground" | "integrations" | "orders" | "chats") => void;
}

export default function BusinessBrainPanel({ onTabChange }: BusinessBrainPanelProps) {
  const brainFeed = [
    { time: "11:02 AM", title: "Customer asked about menu", type: "user" },
    { time: "11:02 AM", title: "Found answer in AI Memory Center", type: "system" },
    { time: "11:03 AM", title: "Created order for 2x Cappuccino", type: "action" },
    { time: "11:03 AM", title: "Generated ₹899", type: "success" },
    { time: "10:45 AM", title: "User inquired about store hours", type: "user" },
    { time: "10:45 AM", title: "Answered from Business Information", type: "system" },
  ];

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2 shrink-0">
        <Bot className="w-5 h-5 text-purple-600" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 font-display">Business Brain™</h2>
          <p className="text-[11px] text-slate-500">Your business operating in real time.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative bg-[#F8FAFC]">
        {/* Soft glow behind panel */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          {brainFeed.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="flex gap-3 relative"
            >
              {/* Timeline connector line */}
              {idx !== brainFeed.length - 1 && (
                <div className="absolute left-1.5 top-5 bottom-[-20px] w-px bg-slate-200" />
              )}
              
              {/* Bullet point */}
              <div className="mt-1.5 relative z-10">
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                  ${item.type === 'user' ? 'bg-slate-300' : ''}
                  ${item.type === 'system' ? 'bg-purple-400' : ''}
                  ${item.type === 'action' ? 'bg-blue-400' : ''}
                  ${item.type === 'success' ? 'bg-emerald-400' : ''}
                `} />
              </div>
              
              {/* Content */}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                <span className={`text-sm mt-0.5 ${item.type === 'success' ? 'font-semibold text-emerald-700' : 'text-slate-700'}`}>
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white text-center shrink-0">
        <button 
          onClick={() => onTabChange?.("chats")}
          className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline transition-all"
        >
          View all Live Chats &rarr;
        </button>
      </div>
    </div>
  );
}
