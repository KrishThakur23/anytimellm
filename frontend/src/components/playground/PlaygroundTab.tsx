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
              Live Chatbot Thought Logs
            </span>
          </div>

          {/* Log trail stream */}
          <div className="flex-1 p-5 bg-[#0A0A0F] overflow-y-auto font-mono text-base space-y-4 text-slate-400 custom-scrollbar min-h-0">
            {agentLogs.map((log, idx) => {
              if (!log || typeof log !== "string") return null;
              
              // Custom translate technical logs into colorful, friendly, high-contrast sentences
              let friendlyText = log;
              let logColorClass = "border-[#252530] bg-[#1a1a24] text-slate-200 rounded-none";
              let iconName = "smart_toy";
              
              if (log.startsWith("System initialized")) {
                friendlyText = "🏪 Chatbot System is turned ON and ready!";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "check_circle";
              } else if (log.startsWith("Business tenant loaded")) {
                friendlyText = "🏪 Loaded details for Your Store successfully!";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-200";
                iconName = "store";
              } else if (log.startsWith("Ready for RAG or SQL")) {
                friendlyText = "⚡ Assistant is online and waiting for customer chats 24/7.";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-500";
                iconName = "bolt";
              } else if (log.startsWith("Incoming Web Chat Message")) {
                const msgPart = log.split(': "')[1]?.replace('"', '') || "";
                friendlyText = `📥 Customer asked: "${msgPart}"`;
                logColorClass = "bg-[#1a1a24] border-[#252530] text-white font-bold";
                iconName = "forum";
              } else if (log.includes("Invoking LangGraph Orchestrator")) {
                friendlyText = "🤖 Assistant is reading customer question...";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-200";
                iconName = "psychology";
              } else if (log.includes("State node [agent] started")) {
                friendlyText = "💭 Assistant is formulating thoughts and searching memory...";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-white animate-pulse";
                iconName = "pending";
              } else if (log.includes("LLM generating thoughts")) {
                friendlyText = "💭 Formulating best response details...";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-500";
                iconName = "lightbulb";
              } else if (log.includes("Query matches potential catalog")) {
                friendlyText = "🔍 Searching item list and memory sheets...";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-200";
                iconName = "search";
              } else if (log.includes("query_catalog_sql_tool")) {
                friendlyText = "🔍 Checked Product Price List: Found matching items successfully.";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "search_check";
              } else if (log.includes("query_vector_store_tool")) {
                friendlyText = "📚 Read your uploaded Store Files to find custom info.";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-200";
                iconName = "menu_book";
              } else if (log.includes("place_order_tool")) {
                friendlyText = "🛒 Processed customer buy order automatically!";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "shopping_cart";
              } else if (log.includes("State node [agent] finalized response")) {
                friendlyText = "✅ Assistant successfully decided the reply.";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "task_alt";
              } else if (log.includes("Outbox delivery completed")) {
                friendlyText = "📤 Reply sent back to WhatsApp customer successfully!";
                logColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                iconName = "send";
              } else if (log.includes("tools executed")) {
                friendlyText = "⚙️ Verified product guidelines & storage maps.";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-500";
                iconName = "construction";
              } else if (log.includes("Conditional edge")) {
                friendlyText = "⚙️ Routing details safely...";
                logColorClass = "bg-[#1a1a24] border-[#252530] text-slate-500";
                iconName = "alt_route";
              }
 
              const isToolNodeLog = log.includes("Invoked") || log.includes("tools executed") || log.includes("query_");
              const isCollapsibleOpened = expandedLogIdx === idx;
 
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div
                    onClick={() => isToolNodeLog && setExpandedLogIdx(isCollapsibleOpened ? null : idx)}
                    className={`flex items-start gap-3 p-3.5 border transition-all duration-300 ${
                      isToolNodeLog ? "cursor-pointer hover:border-slate-500" : ""
                    } ${logColorClass}`}
                    style={{ borderRadius: 10 }}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
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
                  
                  {/* Collapsible detail box */}
                  {isToolNodeLog && isCollapsibleOpened && (
                    <div className="ml-6 bg-[#1a1a24] border border-[#252530] p-4 text-sm text-slate-350 leading-relaxed font-mono border-l-2 border-l-[#25D366]" style={{ borderRadius: 10 }}>
                      <span className="text-[9px] font-bold block uppercase tracking-wider text-slate-500 mb-2">Technical Details</span>
                      <div className="space-y-1.5">
                        <p><strong>Action:</strong> Searched store price data</p>
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
