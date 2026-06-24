"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import type { ChatMessage } from "@/lib/api";

interface PlaygroundTabProps {
  chatPhone: string;
  setChatPhone: (val: string) => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  chatMessages: ChatMessage[];
  sendingChat: boolean;
  agentLogs: string[];
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  handleSendMessage: (e: React.FormEvent) => void;
}

export default function PlaygroundTab({
  chatPhone,
  setChatPhone,
  chatInput,
  setChatInput,
  chatMessages,
  sendingChat,
  agentLogs,
  chatEndRef,
  handleSendMessage,
}: PlaygroundTabProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const handleClearLogs = () => {
    alert("Clearing simulated test trails.");
  };

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col overflow-hidden text-left">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          Test Store Chatbot
        </h1>
        <p className="font-body text-sm text-slate-500 mt-1">
          Test how your automated assistant answers customer questions. You can ask about item prices, store opening hours, or policy details you uploaded.
        </p>
      </div>

      {/* Main console layout */}
      <div ref={panelRef} className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch overflow-hidden min-h-0">
        {/* Left Side: Chat playground */}
        <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-none overflow-hidden shadow-xs" style={{ borderRadius: 16 }}>
          {/* Header specs */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-mono text-[9px] text-slate-700 uppercase tracking-widest font-bold">Chatbot Simulator</span>
            </div>
            
            {/* Phone simulator */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                Customer Phone No:
              </span>
              <input
                type="text"
                value={chatPhone}
                onChange={(e) => setChatPhone(e.target.value)}
                className="bg-white border border-slate-200 rounded-none px-2 py-1.5 text-base text-slate-800 font-mono w-24 text-center focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] transition-all duration-205"
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>

          {/* Operational logs status bar */}
          <div className="flex justify-between items-center px-6 py-2.5 bg-slate-50/50 border-b border-slate-200 shrink-0">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 font-mono text-sm text-slate-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span>Chatbot Status: <strong className="text-slate-800 font-bold">Active & Online</strong></span>
              </div>
              <div className="w-px h-3 bg-slate-200"></div>
              <span className="font-mono text-sm text-slate-500">Languages: English & Hindi</span>
            </div>
            <div className="font-mono text-sm text-slate-500">
              Capacity: <strong className="text-slate-800 font-bold">Automatic 24/7</strong>
            </div>
          </div>

          {/* Chat Messages flow */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/20 custom-scrollbar">
            <div className="flex items-start justify-center opacity-60">
              <div className="font-mono text-[8px] text-slate-400 bg-white px-3 py-1 rounded-none uppercase tracking-wider border border-slate-200" style={{ borderRadius: 9999 }}>
                Assistant is online and ready!
              </div>
            </div>

            <AnimatePresence initial={false}>
              {chatMessages.map((msg, idx) => {
                const isCustomer = msg.sender === "customer";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                  >
                    {isCustomer ? (
                      <div className="bg-white border border-slate-200 max-w-lg px-4 py-3 rounded-none font-mono text-left shadow-xs" style={{ borderRadius: "14px 4px 14px 14px" }}>
                        <p className="text-base text-slate-700 leading-relaxed font-medium">
                          {msg.content}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#25D366]/10 max-w-lg p-4 rounded-none border border-[#DCF8C6]/60 space-y-3 flex flex-col font-mono text-left shadow-xs" style={{ borderRadius: "4px 14px 14px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-[#128C7E] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#128C7E]">AI Assistant</span>
                        </div>
                        <div className="space-y-4">
                          <p className="text-base text-slate-700 leading-relaxed font-medium">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {sendingChat && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-none px-4 py-3 flex items-center gap-2 animate-pulse font-mono shadow-xs" style={{ borderRadius: "4px 14px 14px 14px" }}>
                  <Loader2 className="w-4 h-4 animate-spin text-[#128C7E]" />
                  <span className="text-sm uppercase tracking-wider text-slate-650 font-semibold">Assistant is thinking... Please wait</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input controller */}
          <div className="bg-white border-t border-slate-200 p-4 shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="relative flex items-center bg-slate-50 border border-slate-250 rounded-none focus-within:ring-1 focus-within:ring-[#25D366] focus-within:border-[#25D366] focus-within:bg-white transition-all duration-200" style={{ borderRadius: 10 }}>
                <div className="pl-4 pr-2 py-3 flex items-center justify-center text-slate-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">add_circle</span>
                </div>
                <input
                  type="text"
                  required
                  disabled={sendingChat}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-4 font-mono text-base text-slate-800 placeholder:text-slate-400"
                  placeholder="TYPE CUSTOMER MESSAGE"
                />
                <div className="pr-3 flex items-center gap-2 shrink-0">
                  <button
                    type="submit"
                    disabled={sendingChat || !chatInput.trim()}
                    className="bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white w-8 h-8 rounded-none flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-xs"
                    style={{ borderRadius: 6 }}
                  >
                    <Send className="w-3.5 h-3.5 text-current" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-1 font-mono text-base">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="font-mono text-[9px] text-slate-450 hover:text-slate-700 transition-colors flex items-center gap-1 uppercase tracking-wider cursor-pointer bg-transparent border-0 font-bold"
                  >
                    <span className="material-symbols-outlined text-[14px]">clear_all</span> Clear
                  </button>
                  <button
                    type="button"
                    className="font-mono text-[9px] text-slate-455 hover:text-slate-700 transition-colors flex items-center gap-1 uppercase tracking-wider cursor-pointer bg-transparent border-0 font-bold"
                  >
                    <span className="material-symbols-outlined text-[14px]">bookmark_border</span> Save
                  </button>
                </div>
                <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest hidden sm:flex items-center gap-1">
                  <span>Press Enter to Send</span>
                  <span className="px-1.5 py-0.5 rounded-none bg-slate-50 border border-slate-200 font-mono" style={{ borderRadius: 4 }}>↵</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Agent Trails & tool logs (Dark panel exception - 5% dark elements) */}
        <div className="lg:col-span-2 flex flex-col bg-[#111118] border border-[#252530] rounded-none overflow-hidden shadow-2xl" style={{ borderRadius: 16 }}>
          <div className="p-4 border-b border-[#252530] bg-[#1a1a24] flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-[#25D366]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            <span className="font-mono text-[9px] text-slate-200 uppercase tracking-widest font-bold">
              Live Chatbot Event Logs
            </span>
          </div>

          {/* Log trail stream */}
          <div className="flex-1 p-5 bg-[#0A0A0F] overflow-y-auto font-mono text-base space-y-4 text-slate-400 custom-scrollbar min-h-0">
            {agentLogs.map((log, idx) => {
              if (!log || typeof log !== "string") return null;
              
              let friendlyText = log;
              let logColorClass = "border-[#252530] bg-[#1a1a24] text-slate-200 rounded-none";
              let iconName = "smart_toy";
              
              if (log === "Chat Session Started") {
                friendlyText = "⚙️ Chat Session Started";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "check_circle";
              } else if (log === "Inbound customer query") {
                friendlyText = "📥 Inbound customer query";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-200";
                iconName = "forum";
              } else if (log === "Response dispatched to client") {
                friendlyText = "📤 Response dispatched to client";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "send";
              } else if (log.startsWith("[ERROR]")) {
                friendlyText = log;
                logColorClass = "bg-red-500/10 text-red-400 border-red-500/20";
                iconName = "warning";
              }

              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div
                    className={`flex items-start gap-3 p-3.5 border transition-all duration-300 ${logColorClass}`}
                    style={{ borderRadius: 10 }}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                      {iconName}
                    </span>
                    <div className="flex-1 font-bold leading-relaxed text-[11px]">
                      {friendlyText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
