"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles, ChevronDown, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

export default function GlobalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [onboardingStage, setOnboardingStage] = useState<"name" | "email" | "done" | "dashboard">("name");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Listen for global custom event to open the chat
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-ai-assistant", handleOpenChat);
    return () => window.removeEventListener("open-ai-assistant", handleOpenChat);
  }, []);

  // Initialize flow based on auth state
  useEffect(() => {
    const token = localStorage.getItem("anytimellm-token");
    if (token) {
      setOnboardingStage("dashboard");
      setMessages([
        { id: "1", sender: "ai", text: "Welcome to your Mission Control! 🚀 I'm here to help. Should we start by uploading your product catalog or connecting your WhatsApp number?" }
      ]);
    } else {
      setOnboardingStage("name");
      setMessages([
        { id: "1", sender: "ai", text: "Hi there! 👋 I'm your AnytimeLLM Sales Operator. I'll help you get set up in 2 minutes. First, what should I call you?" }
      ]);
    }
  }, [isOpen]); // Re-evaluate when opened if token changed

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { id: Date.now().toString(), sender: "user", text: userText }];
    setMessages(newMessages);
    setInput("");

    if (onboardingStage === "name") {
      setTimeout(() => {
        setUserName(userText);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "ai", text: `Nice to meet you, ${userText}! Let's secure your workspace. What's your best email address?` }
        ]);
        setOnboardingStage("email");
      }, 600);
    } 
    else if (onboardingStage === "email") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "ai", text: `Perfect! Setting up your workspace now... Hang tight. ⚡` }
        ]);
        
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), sender: "ai", text: `All done! 🎉 I've logged you in. Redirecting you to your dashboard... I'll meet you there!` }
          ]);
          
          setTimeout(() => {
            localStorage.setItem("anytimellm-token", "chat-onboarding-token");
            setOnboardingStage("dashboard");
            router.push("/dashboard");
          }, 1500);
        }, 1500);
      }, 600);
    }
    else if (onboardingStage === "dashboard") {
      setIsLoading(true);
      try {
        let businessId = "7d30c138-ebd4-4c14-aea2-e820e89be180"; // Fallback to first DB business
        const token = localStorage.getItem("anytimellm-token");
        if (token && token !== "chat-onboarding-token") {
          try {
             const payload = JSON.parse(atob(token.split('.')[1]));
             if (payload.business_id) businessId = payload.business_id;
          } catch(e) {}
        }
        
        const res = await fetch(`http://localhost:8000/api/chat/${businessId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: userText,
            customer_phone: "WebUser-1234"
          })
        });
        
        if (!res.ok) throw new Error("API failed");
        
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "ai", text: data.content || "Sorry, I couldn't process that." }
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "ai", text: "Error connecting to AI server. Please make sure the backend is running." }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        
        {/* Helper Tooltip (only show if closed and on home page) */}
        {!isOpen && pathname === "/" && (
          <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce cursor-pointer relative" onClick={() => setIsOpen(true)}>
            <div className="w-8 h-8 rounded-full bg-[#DCF8C6] flex items-center justify-center shrink-0">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Need help getting started?</p>
              <p className="text-xs text-slate-500">Chat with our AI operator</p>
            </div>
            {/* Tooltip triangle */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45"></div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? "bg-slate-800 text-white rotate-90" : "bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white hover:scale-105"
          }`}
        >
          {isOpen ? <ChevronDown className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-[#128C7E] px-4 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#128C7E] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">AnytimeLLM AI</h3>
                <p className="text-white/80 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sales Director
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            <div className="flex justify-center mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">Today</span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === "user" 
                    ? "bg-[#25D366] text-white rounded-tr-sm shadow-sm" 
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#128C7E]" /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={onboardingStage === "name" ? "Type your name..." : onboardingStage === "email" ? "Type your email..." : "Type your message..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:border-[#25D366] transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-[#128C7E] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-slate-400 font-medium">Powered by AnytimeLLM ⚡</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
