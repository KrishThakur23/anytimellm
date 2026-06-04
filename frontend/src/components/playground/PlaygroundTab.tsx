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
  const [expandedLogIdx, setExpandedLogIdx] = useState<number | null>(null);

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
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-text">
          Test Store Chatbot
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 font-semibold">
          Test how your automated assistant answers customer questions. You can ask about item prices, store opening hours, or policy details you uploaded.
        </p>
      </div>

      {/* Main console layout */}
      <div ref={panelRef} className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch overflow-hidden min-h-0">
        {/* Left Side: Chat playground */}
        <div className="lg:col-span-3 flex flex-col bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Header specs */}
          <div className="px-6 py-4 border-b border-border-subtle bg-surface-container-low dark:bg-surface-container flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(76,175,80,0.4)] animate-pulse"></span>
              <span className="font-label-sm text-[10px] text-ink-text uppercase tracking-widest font-extrabold">Chatbot Simulator</span>
            </div>
            
            {/* Phone simulator */}
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider font-extrabold">
                Customer Phone No:
              </span>
              <input
                type="text"
                value={chatPhone}
                onChange={(e) => setChatPhone(e.target.value)}
                className="bg-parchment-surface dark:bg-surface-container-low border border-border-subtle rounded px-2 py-1.5 text-xs text-ink-text font-mono w-24 text-center focus:outline-none focus:border-ink-text transition-all duration-200 font-semibold"
              />
            </div>
          </div>

          {/* Operational logs status bar */}
          <div className="flex justify-between items-center px-6 py-2.5 bg-surface-container-low/40 border-b border-border-subtle shrink-0">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 font-label-xs text-[10px] text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Chatbot Status: <strong className="text-ink-text font-semibold">Active & Online</strong></span>
              </div>
              <div className="w-px h-3 bg-border-subtle"></div>
              <span className="font-label-xs text-[10px] text-on-surface-variant">Languages: English & Hindi</span>
            </div>
            <div className="font-label-xs text-[10px] text-on-surface-variant">
              Capacity: <strong className="text-ink-text font-semibold">Automatic 24/7</strong>
            </div>
          </div>

          {/* Chat Messages flow */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-oatmeal-bg/30 custom-scrollbar">
            <div className="flex items-start justify-center opacity-60">
              <div className="font-label-xs text-[9px] text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border border-border-subtle shadow-[0_1px_1px_rgba(0,0,0,0.01)]">
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
                      <div className="bg-surface-container-high dark:bg-surface-container border border-border-subtle max-w-2xl px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="font-body-md text-xs text-ink-text leading-relaxed font-semibold">
                          {msg.content}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-parchment-surface dark:bg-surface-container max-w-2xl p-5 rounded-2xl rounded-tl-sm border border-border-subtle shadow-sm space-y-4 flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-ink-text dark:bg-primary-fixed-dim flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[12px] text-parchment-surface dark:text-ink-text" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                          </div>
                          <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider text-ink-text">AI Assistant</span>
                        </div>
                        <div className="space-y-4">
                          <p className="font-body-md text-xs text-ink-text leading-relaxed font-semibold">
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
                <div className="bg-parchment-surface dark:bg-surface-container border border-border-subtle text-on-surface-variant rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2 animate-pulse shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-ink-text dark:text-primary-fixed-dim" />
                  <span className="font-label-xs text-[10px] uppercase font-black tracking-widest text-purple-600 dark:text-purple-400">💭 Assistant is thinking... Please wait (सहायक सोच रहा है)</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input controller */}
          <div className="bg-parchment-surface dark:bg-surface-container border-t border-border-subtle p-4 shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="relative flex items-center bg-oatmeal-bg dark:bg-surface-container-low border border-border-subtle rounded-xl shadow-sm focus-within:border-emerald-500 transition-all duration-200">
                <div className="pl-4 pr-2 py-3 flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-emerald-500">add_circle</span>
                </div>
                <input
                  type="text"
                  required
                  disabled={sendingChat}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 px-2 py-4 font-body-md text-xs text-ink-text placeholder:text-outline font-bold"
                  placeholder=""
                />
                <div className="pr-3 flex items-center gap-2 shrink-0">
                  <button
                    type="submit"
                    disabled={sendingChat || !chatInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shadow-md border-none cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-white font-bold" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-1 font-bold text-xs">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="font-label-sm text-[10px] text-on-surface-variant hover:text-ink-text transition-colors flex items-center gap-1 uppercase tracking-wider font-black cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">clear_all</span> Clear
                  </button>
                  <button
                    type="button"
                    className="font-label-sm text-[10px] text-on-surface-variant hover:text-ink-text transition-colors flex items-center gap-1 uppercase tracking-wider font-black cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">bookmark_border</span> Save
                  </button>
                </div>
                <div className="font-label-xs text-[9px] text-on-surface-variant uppercase tracking-widest hidden sm:flex items-center gap-1 font-black">
                  <span>Press Enter to Send (भेजें)</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-low dark:bg-surface-container-high border border-border-subtle font-mono">↵</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Agent Trails & tool logs */}
        <div className="lg:col-span-2 flex flex-col bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0,0.02)]">
          <div className="p-4 border-b border-border-subtle bg-surface-container-low dark:bg-surface-container flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-muted-gold" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            <span className="font-label-sm text-[10px] text-ink-text uppercase tracking-widest font-extrabold">
              Live Chatbot Thought Logs
            </span>
          </div>

          {/* Log trail stream */}
          <div className="flex-1 p-5 bg-oatmeal-bg/30 overflow-y-auto font-sans text-xs space-y-4 text-on-surface-variant custom-scrollbar min-h-0">
            {agentLogs.map((log, idx) => {
              if (!log || typeof log !== "string") return null;
              
              // Custom translate technical logs into colorful, friendly, high-contrast sentences
              let friendlyText = log;
              let logColorClass = "bg-parchment-surface dark:bg-surface-container border-border-subtle text-ink-text";
              let iconName = "smart_toy";
              
              if (log.startsWith("System initialized")) {
                friendlyText = "🏪 Chatbot System is turned ON and ready!";
                logColorClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-bold";
                iconName = "check_circle";
              } else if (log.startsWith("Business tenant loaded")) {
                friendlyText = "🏪 Loaded details for Your Store successfully!";
                logColorClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-bold";
                iconName = "store";
              } else if (log.startsWith("Ready for RAG or SQL")) {
                friendlyText = "⚡ Assistant is online and waiting for customer chats 24/7.";
                logColorClass = "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
                iconName = "bolt";
              } else if (log.startsWith("Incoming Web Chat Message")) {
                const msgPart = log.split(': "')[1]?.replace('"', '') || "";
                friendlyText = `📥 Customer asked: "${msgPart}"`;
                logColorClass = "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 font-bold";
                iconName = "forum";
              } else if (log.includes("Invoking LangGraph Orchestrator")) {
                friendlyText = "🤖 Assistant is reading customer question...";
                logColorClass = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
                iconName = "psychology";
              } else if (log.includes("State node [agent] started")) {
                friendlyText = "💭 Assistant is formulating thoughts and searching memory...";
                logColorClass = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 animate-pulse";
                iconName = "pending";
              } else if (log.includes("LLM generating thoughts")) {
                friendlyText = "💭 Formulating best response details...";
                logColorClass = "bg-purple-500/5 text-purple-600 dark:text-purple-400/80 border-border-subtle";
                iconName = "lightbulb";
              } else if (log.includes("Query matches potential catalog")) {
                friendlyText = "🔍 Searching item list and memory sheets...";
                logColorClass = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
                iconName = "search";
              } else if (log.includes("query_catalog_sql_tool")) {
                friendlyText = "🔍 Checked Product Price List: Found matching items successfully.";
                logColorClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-bold";
                iconName = "search_check";
              } else if (log.includes("query_vector_store_tool")) {
                friendlyText = "📚 Read your uploaded Store Files to find custom info.";
                logColorClass = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 font-bold";
                iconName = "menu_book";
              } else if (log.includes("place_order_tool")) {
                friendlyText = "🛒 Processed customer buy order automatically!";
                logColorClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-bold";
                iconName = "shopping_cart";
              } else if (log.includes("State node [agent] finalized response")) {
                friendlyText = "✅ Assistant successfully decided the reply.";
                logColorClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-bold";
                iconName = "task_alt";
              } else if (log.includes("Outbox delivery completed")) {
                friendlyText = "📤 Reply sent back to WhatsApp customer successfully!";
                logColorClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-bold";
                iconName = "send";
              } else if (log.includes("tools executed")) {
                friendlyText = "⚙️ Verified product guidelines & storage maps.";
                logColorClass = "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
                iconName = "construction";
              } else if (log.includes("Conditional edge")) {
                friendlyText = "⚙️ Routing details safely...";
                logColorClass = "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
                iconName = "alt_route";
              }

              // Collapsible details block (now beautifully simple)
              const isToolNodeLog = log.includes("Invoked") || log.includes("tools executed") || log.includes("query_");
              const isCollapsibleOpened = expandedLogIdx === idx;

              return (
                <div key={idx} className="flex flex-col gap-2 animate-[fadeIn_0.2s_ease-out]">
                  <div
                    onClick={() => isToolNodeLog && setExpandedLogIdx(isCollapsibleOpened ? null : idx)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                      isToolNodeLog ? "cursor-pointer hover:border-ink-text" : ""
                    } ${logColorClass}`}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {iconName}
                    </span>
                    <div className="flex-1 font-bold leading-relaxed text-[11px]">
                      {friendlyText}
                    </div>
                    {isToolNodeLog && (
                      <span className="material-symbols-outlined text-[16px] shrink-0 opacity-60">
                        {isCollapsibleOpened ? "expand_less" : "expand_more"}
                      </span>
                    )}
                  </div>
                  
                  {/* Collapsible detail box - Simplified */}
                  {isToolNodeLog && isCollapsibleOpened && (
                    <div className="ml-6 bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-lg p-4 text-[10px] text-on-surface-variant leading-relaxed shadow-sm font-bold border-l-4 border-l-blue-500 animate-[fadeIn_0.15s_ease-out]">
                      <span className="text-[9px] font-bold block uppercase tracking-wider text-blue-500 mb-2">🔍 Technical Details (Simple view)</span>
                      <div className="space-y-1.5 font-semibold">
                        <p><strong>Action:</strong> Searched your store data</p>
                        <p><strong>Status:</strong> Success (matched customer query)</p>
                        <p><strong>Detail:</strong> Found product matching the search criteria in 12ms.</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
