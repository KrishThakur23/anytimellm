"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Loader2, 
  RefreshCw, 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Clock, 
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Conversation } from "@/lib/api";

interface ChatsTabProps {
  chats: Conversation[];
  loading: boolean;
  onRefresh: () => void;
  onSendReply: (conversationId: string, content: string) => Promise<void>;
  onTogglePause: (conversationId: string, isPaused: boolean) => Promise<void>;
}

export default function ChatsTab({
  chats,
  loading,
  onRefresh,
  onSendReply,
  onTogglePause,
}: ChatsTabProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  
  const threadEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat thread on change
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId, chats]);

  // Entrance animations for lists
  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll(".chat-item-card");
      gsap.fromTo(
        items,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [chats]);

  const activeChat = chats.find(c => c.id === selectedChatId);

  // Filter conversations by customer name or phone number
  const filteredChats = chats.filter(c => {
    const name = (c.customer_name || "").toLowerCase();
    const phone = (c.customer_phone || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || phone.includes(query);
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId) return;

    setSendingReply(true);
    try {
      await onSendReply(selectedChatId, replyText);
      setReplyText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  const getRelativeTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const delta = Math.round((Date.now() - date.getTime()) / 1000);
      if (delta < 60) return "just now";
      const minutes = Math.round(delta / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  };

  const getFormatTimeOnly = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-text flex items-center gap-2">
            💬 WhatsApp Chat Inbox
          </h1>
          <p className="text-on-surface-variant text-sm mt-1 font-semibold">
            Monitor real-time conversations between your automated AI agent and customers. Step in to send manual outbox overrides when needed.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-lg border border-border-subtle bg-parchment-surface dark:bg-surface-container text-ink-text hover:bg-oatmeal-bg dark:hover:bg-surface-2 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          🔁 Refresh Chats (ताज़ा करें)
        </button>
      </div>

      {/* Main split-pane content */}
      <div className="flex-1 flex gap-6 items-stretch overflow-hidden min-h-0">
        {/* Left Column: Chat Conversation Threads list */}
        <div className="w-80 flex flex-col bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl overflow-hidden shadow-sm shrink-0">
          {/* Search bar */}
          <div className="p-4 border-b border-border-subtle bg-surface-container-low/40 dark:bg-surface-container-high/20 flex items-center gap-2 shrink-0">
            <Search className="w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-xs text-ink-text font-bold placeholder:text-outline/75"
            />
          </div>

          {/* List feed */}
          <div 
            ref={listRef} 
            className="flex-1 overflow-y-auto divide-y divide-border-subtle/50 custom-scrollbar"
          >
            {loading && chats.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-ink-text dark:text-primary-fixed-dim" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Loading threads...</span>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant font-mono text-[10px] uppercase tracking-wider font-bold">
                {searchQuery ? "No matching chats found" : "No active WhatsApp chats"}
              </div>
            ) : (
              filteredChats.map((c) => {
                const isSelected = selectedChatId === c.id;
                const initials = (c.customer_name || "W")
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                  
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedChatId(c.id)}
                    className={`chat-item-card p-4 flex gap-3 cursor-pointer transition-all duration-200 relative select-none ${
                      isSelected
                        ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-l-4 border-emerald-500"
                        : "hover:bg-surface-container-low/40 border-l-4 border-transparent"
                    }`}
                  >
                    {/* Customer avatar */}
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/25 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs shrink-0">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-black text-ink-text text-xs truncate">
                          {c.customer_name || "WhatsApp Client"}
                        </span>
                        <span className="font-mono text-[8px] text-outline font-black tracking-wider shrink-0 ml-1">
                          {c.messages.length > 0
                            ? getRelativeTime(c.messages[c.messages.length - 1].created_at)
                            : getRelativeTime(c.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1 text-[9px] text-outline font-semibold font-mono">
                        <Phone className="w-2.5 h-2.5 shrink-0" />
                        <span>{c.customer_phone}</span>
                      </div>

                      <p className="text-[10px] text-on-surface-variant font-bold truncate mt-2 leading-relaxed">
                        {c.last_message_content || "No messages sent yet"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat thread detail */}
        <div className="flex-1 flex flex-col bg-parchment-surface dark:bg-surface-container border border-border-subtle rounded-xl overflow-hidden shadow-sm relative">
          {activeChat ? (
            <>
              {/* Header profile info */}
              <div className="px-6 py-4 border-b border-border-subtle bg-surface-container-low dark:bg-surface-container flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs border border-emerald-500/15">
                    {activeChat.customer_name?.charAt(0).toUpperCase() || "W"}
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-ink-text leading-tight">{activeChat.customer_name || "WhatsApp Client"}</h3>
                    <span className="text-[9px] font-semibold font-mono text-outline flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5" />
                      {activeChat.customer_phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* AI Agent Pause Toggle Button */}
                  <button
                    onClick={() => onTogglePause(activeChat.id, !activeChat.is_ai_paused)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
                      activeChat.is_ai_paused
                        ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25"
                        : "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {activeChat.is_ai_paused ? "smart_toy" : "pause_circle"}
                    </span>
                    {activeChat.is_ai_paused ? "🤖 Resume AI Agent" : "⏸️ Pause AI Agent"}
                  </button>

                  <div className="flex items-center gap-1.5 bg-surface-container-high dark:bg-surface-2 border border-border-subtle rounded-md px-2 py-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeChat.is_ai_paused ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`}></span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-outline font-black">
                      {activeChat.is_ai_paused ? "Manual Mode" : "Auto Mode"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat messages feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-oatmeal-bg/40 dark:bg-surface-container-low/20 custom-scrollbar">
                {activeChat.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant p-8">
                    <MessageSquare className="w-12 h-12 text-outline mb-2 animate-pulse" />
                    <span className="font-mono text-[10px] uppercase font-black tracking-wider">No message logs recorded.</span>
                  </div>
                ) : (
                  activeChat.messages.map((m, idx) => {
                    const isAgent = m.sender === "agent";
                    return (
                      <div
                        key={m.id || idx}
                        className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] border flex flex-col ${
                            isAgent
                              ? "bg-emerald-600 border-emerald-500/20 text-white rounded-tr-sm"
                              : "bg-parchment-surface dark:bg-surface-container border-border-subtle text-ink-text rounded-tl-sm"
                          }`}
                        >
                          <span className="font-body-md text-xs font-semibold leading-relaxed break-words whitespace-pre-wrap">
                            {m.content}
                          </span>
                          
                          <span className={`text-[8px] font-mono mt-2 self-end font-bold tracking-wider uppercase opacity-75 ${
                            isAgent ? "text-emerald-100" : "text-outline"
                          }`}>
                            <Clock className="w-2 h-2 inline mr-1" />
                            {getFormatTimeOnly(m.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={threadEndRef} />
              </div>

              {/* Chat outbox reply form */}
              <form 
                onSubmit={handleSend}
                className="p-4 border-t border-border-subtle bg-surface-container-low dark:bg-surface-container shrink-0 flex gap-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Type a manual override message to send back to customer WhatsApp..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sendingReply}
                  className="flex-1 bg-parchment-surface dark:bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-ink-text placeholder:text-outline/70 font-bold disabled:opacity-50"
                />
                
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shrink-0 border-none transition-all duration-200 active:scale-95 hover:scale-[1.03] disabled:opacity-40 cursor-pointer shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
                >
                  {sendingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-ink-text">No chat selected</h3>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs font-semibold leading-relaxed">
                Select an active conversation thread from the left column to read message logs and send direct replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
