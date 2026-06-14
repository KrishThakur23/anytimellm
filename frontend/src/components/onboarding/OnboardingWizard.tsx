"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import type { Business } from "@/lib/api";
import { Loader2, Send, UploadCloud, CheckCircle2, QrCode, ArrowRight, Sparkles } from "lucide-react";

interface OnboardingWizardProps {
  activeBusiness: Business;
  onComplete: (updatedBiz: Business) => void;
}

type ChatStep = "ASK_NAME" | "ASK_INDUSTRY" | "UPLOAD_CATALOG" | "SCAN_QR" | "FINISHED";

interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  action?: "UPLOAD" | "QR" | "FINISH";
}

export default function OnboardingWizard({ activeBusiness, onComplete }: OnboardingWizardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Welcome to AnytimeLLM! ✨ I'm your AI onboarding assistant. Let's get your autonomous sales agent set up in under 2 minutes.\n\nFirst, what is the name of your business?"
    }
  ]);
  const [input, setInput] = useState("");
  const [chatStep, setChatStep] = useState<ChatStep>("ASK_NAME");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Data Collected
  const [businessName, setBusinessName] = useState(activeBusiness.name || "");
  const [industry, setIndustry] = useState(activeBusiness.business_type || "");
  const [isQrScanned, setIsQrScanned] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current && endOfMessagesRef.current.parentElement) {
      const container = endOfMessagesRef.current.parentElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  // Auto-scan QR simulation after 4 seconds when in SCAN_QR step
  useEffect(() => {
    if (chatStep === "SCAN_QR" && !isQrScanned) {
      const timer = setTimeout(() => {
        setIsQrScanned(true);
        addAgentMessage("Awesome! WhatsApp connected successfully. Your AI agent is now deployed and ready to handle customer inquiries 24/7. Shall we enter your mission control dashboard?", "FINISH");
        setChatStep("FINISHED");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [chatStep, isQrScanned]);

  const addAgentMessage = (text: string, action?: "UPLOAD" | "QR" | "FINISH", delayMs = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "agent", text, action }]);
      setIsTyping(false);
    }, delayMs);
  };

  const selectIndustry = (opt: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: opt }]);
    setIndustry(opt);
    setChatStep("UPLOAD_CATALOG");
    addAgentMessage(
      `Perfect. I've configured the baseline settings for a **${opt}** business.\n\nNow, please upload your catalog, menu, or pricing document so I can learn about your products and answer customer questions accurately.`,
      "UPLOAD"
    );
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatStep === "UPLOAD_CATALOG" || chatStep === "SCAN_QR" || chatStep === "FINISHED") return;

    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userText }]);

    if (chatStep === "ASK_NAME") {
      setBusinessName(userText);
      setChatStep("ASK_INDUSTRY");
      addAgentMessage(`Great name, **${userText}**! What industry are you in? (e.g., Restaurant, Retail, Salon, SaaS)`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    // Optimistic UI for file upload
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: `Uploaded: ${file.name}` }]);

    try {
      await api.uploadFile(activeBusiness.id, file, businessName, industry);
      setLoading(false);
      setChatStep("SCAN_QR");
      addAgentMessage(`Got it! I've successfully analyzed **${file.name}** and indexed your products into my vector memory.\n\nFinally, let's connect your WhatsApp. Please scan this QR code using the WhatsApp app on your phone (Linked Devices).`, "QR", 1500);
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.message || "";
      if (errMsg.includes("This file doesn't appear to contain information about your business. Please upload a menu, catalog, service list, brochure, FAQ, or other business document.")) {
        addAgentMessage(`This file doesn't appear to contain information about your business. Please upload a menu, catalog, service list, brochure, FAQ, or other business document..\n\nNow, please upload your catalog, menu, or pricing document so I can learn about your products and answer customer questions accurately.`, "UPLOAD");
      } else {
        addAgentMessage(`Hmm, there was an issue uploading the file: ${err.message}. Please try again.`, "UPLOAD");
      }
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.updateBusinessSettings(activeBusiness.id, {
        name: businessName,
        business_type: industry,
        onboarding_status: "completed"
      });
      const freshBiz = await api.getMyBusiness();
      onComplete(freshBiz);
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">

      {/* Left side branding / visual panel */}
      <div className="hidden md:flex flex-col w-1/3 bg-surface-1 border-r border-surface-border p-12 justify-between relative z-10">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-widest uppercase text-primary">AnytimeLLM</h1>
          <p className="mt-4 text-sm text-slate-500">Autonomous Sales Agents</p>
        </div>

        <div className="space-y-8">
          <div className={`transition-opacity duration-500 ${chatStep === "ASK_NAME" || chatStep === "ASK_INDUSTRY" ? "opacity-100" : "opacity-30"}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">1</div>
            <h3 className="font-bold">Business Profile</h3>
            <p className="text-sm text-slate-500">Tell us what you do.</p>
          </div>
          <div className={`transition-opacity duration-500 ${chatStep === "UPLOAD_CATALOG" ? "opacity-100" : "opacity-30"}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">2</div>
            <h3 className="font-bold">Knowledge Base</h3>
            <p className="text-sm text-slate-500">Train your agent on your products.</p>
          </div>
          <div className={`transition-opacity duration-500 ${chatStep === "SCAN_QR" || chatStep === "FINISHED" ? "opacity-100" : "opacity-30"}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">3</div>
            <h3 className="font-bold">Channel Connection</h3>
            <p className="text-sm text-slate-500">Go live on WhatsApp instantly.</p>
          </div>
        </div>

        <p className="text-base text-slate-400">&copy; {new Date().getFullYear()} AnytimeLLM Inc.</p>
      </div>

      {/* Right side Chatbot interface */}
      <div className="flex-1 flex flex-col h-screen relative z-10 bg-background">

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "agent" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mr-3 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-surface-1 border border-surface-border text-foreground rounded-tl-sm"
                  }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Action UI injected inside agent message */}
                  {msg.action === "UPLOAD" && (
                    <div className="mt-4 p-6 border-2 border-dashed border-surface-border rounded-xl bg-surface-0 flex flex-col items-center justify-center text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.csv,.txt,.docx"
                      />
                      {loading ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                          <span className="text-base font-semibold text-slate-500">Uploading and Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-primary mb-2" />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-primary text-white text-base font-bold rounded-lg hover:bg-primary-hover transition-colors"
                          >
                            Browse Files
                          </button>
                          <span className="text-sm text-slate-400 mt-2">PDF, CSV, TXT up to 10MB</span>
                        </>
                      )}
                    </div>
                  )}

                  {msg.action === "QR" && (
                    <div className="mt-4 p-6 border border-surface-border rounded-xl bg-surface-0 flex flex-col items-center justify-center text-center">
                      {!isQrScanned ? (
                        <div className="relative">
                          <QrCode className="w-32 h-32 text-foreground opacity-50" />
                          <motion.div
                            className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_#10b981]"
                            animate={{ y: [0, 128, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                          />
                          <p className="text-base text-slate-500 mt-4">Waiting for scan...</p>
                        </div>
                      ) : (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <span className="text-sm font-bold text-emerald-600">WhatsApp Linked</span>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {msg.action === "FINISH" && (
                    <div className="mt-4">
                      <button
                        onClick={handleFinish}
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-lg"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Go to Dashboard"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mr-3 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-1 border border-surface-border text-foreground rounded-tl-sm flex items-center gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-surface-0 border-t border-surface-border animate-fade-in">
          {chatStep === "ASK_INDUSTRY" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto flex flex-wrap gap-3 justify-center py-2"
            >
              {["Retail", "Restaurant", "Salon", "Grocery", "General (others)"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectIndustry(opt)}
                  className="px-6 py-3 bg-surface-1 border border-surface-border text-foreground hover:bg-primary hover:text-white hover:border-primary font-bold rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95 text-sm"
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          ) : (
            <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  chatStep === "ASK_NAME" ? "Enter your business name..." :
                    "Follow the assistant's instructions above..."
                }
                disabled={chatStep === "UPLOAD_CATALOG" || chatStep === "SCAN_QR" || chatStep === "FINISHED"}
                className="w-full bg-surface-1 border border-surface-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground pl-6 pr-14 py-4 rounded-full outline-none transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!input.trim() || chatStep === "UPLOAD_CATALOG" || chatStep === "SCAN_QR" || chatStep === "FINISHED"}
                className="absolute right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <button
              onClick={handleFinish}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600 text-sm font-mono uppercase tracking-wider transition-colors"
            >
              Skip Onboarding
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
