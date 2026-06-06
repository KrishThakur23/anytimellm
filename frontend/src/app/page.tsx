"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaBanner from "@/components/layout/CtaBanner";
import { 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  UploadCloud, 
  Link2, 
  ChevronDown, 
  Database,
  Send,
  CheckCircle2,
  Server,
  Cpu,
  Layers,
  Star
} from "lucide-react";
import FloatingParticles from "@/components/effects/FloatingParticles";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    ingestion: false,
    vector: false,
    langgraph: false,
    namespaces: false,
  });

  const toggleAccordion = (id: string) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Interactive Custom Chat Simulator
  const [customInput, setCustomInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    { sender: "bot", text: "Hey! Try talking to me. Type any query (e.g. 'what is the status of my order', 'do you have leather jackets', or just say 'hello') and see me reason in real-time!", time: "09:41 AM" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [traceLogs, setTraceLogs] = useState<string[]>(["System: Standby. Ready for input."]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isTyping) return;
    executeMessageFlow(customInput.trim());
    setCustomInput("");
  };

  const executeMessageFlow = (userText: string) => {
    setChatMessages(prev => [...prev, { sender: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    // Initial log
    setTraceLogs(["Agent: Parsing message...", "Analyzing query intent..."]);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botResponse = "";
      let logs: string[] = [];

      if (lower.includes("price") || lower.includes("catalog") || lower.includes("menu") || lower.includes("have") || lower.includes("jacket") || lower.includes("product")) {
        botResponse = "Yes, absolutely! We have our **Premium Leather Jacket** in stock (₹4,999, Size L, Black/Brown) and **Classic Denim Shirt** (₹1,899). Would you like to order? 🧥";
        logs = [
          "Query matched [query_catalog_intent]",
          "Invoking query_catalog_sql_tool...",
          "Found: Leather Jacket (stock=3), Denim Shirt (stock=12)",
          "Formulating response in plain language..."
        ];
      } else if (lower.includes("status") || lower.includes("track") || lower.includes("order") || lower.includes("where") || lower.includes("delivery")) {
        botResponse = "I tracked your order #ORD-8392! It is dispatched and out for delivery today. It should reach you by 6:00 PM via Delhivery. 📦";
        logs = [
          "Query matched [check_order_intent]",
          "Querying relational order records for id='8392'...",
          "Status: Out For Delivery (Carrier=Delhivery)",
          "Formulating response..."
        ];
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("yo") || lower.includes("greetings") || lower.includes("menu")) {
        botResponse = "Hello! I am AnytimeLLM's virtual assistant. Try asking me to look up catalog items, track an order, or check wholesale pricing. 💬";
        logs = [
          "Query matched [greet_intent]",
          "Checking active session context...",
          "Ready for catalog/RAG queries."
        ];
      } else {
        botResponse = "I've matched that query against your catalog database. It is ready to be handled automatically on WhatsApp! 🚀";
        logs = [
          "Query matched [general_rag_intent]",
          "Searching Pinecone vector stores...",
          "Top chunk matched (confidence=91.4%)",
          "Generating contextual response..."
        ];
      }

      // Roll out logs sequentially
      setTraceLogs(prev => [logs[0], ...prev]);

      setTimeout(() => {
        setTraceLogs(prev => [logs[1], ...prev]);
      }, 500);

      setTimeout(() => {
        if (logs[2]) setTraceLogs(prev => [logs[2], ...prev]);
      }, 1000);

      setTimeout(() => {
        if (logs[3]) setTraceLogs(prev => [logs[3], ...prev]);
        setIsTyping(false);
        setChatMessages(prev => [...prev, { sender: "bot", text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }, 1500);

    }, 500);
  };

  const triggerQuickReply = (text: string) => {
    if (isTyping) return;
    executeMessageFlow(text);
  };

  const steps = [
    {
      num: "01",
      title: "Create your business console",
      subtitle: "30 seconds setup",
      desc: "Register your workspace, set up your admin email, and obtain your secure tenant credentials in seconds.",
      icon: <Sparkles className="w-5 h-5 text-white" />,
    },
    {
      num: "02",
      title: "Upload your catalog or documents",
      subtitle: "Universal file parsing",
      desc: "Instantly upload PDF price lists, menus, or catalog links. Our system converts them to structured memory.",
      icon: <UploadCloud className="w-5 h-5 text-white" />,
    },
    {
      num: "03",
      title: "Connect WhatsApp, your bot goes live",
      subtitle: "Instant API webhook link",
      desc: "Link your WhatsApp Cloud API webhook key and let our intelligent assistant answer your customers instantly.",
      icon: <Link2 className="w-5 h-5 text-white" />,
    },
  ];

  const testimonials = [
    {
      quote: "We saved 3 hours a day on customer replies. Our customers love the instant responses.",
      author: "Aditya R.",
      role: "Retail & Catalog Shop Owner",
      city: "Mumbai",
      avatar: "/avatar_aditya.png"
    },
    {
      quote: "No more copying and pasting product lists. The catalog sync automatically handles stock queries on WhatsApp.",
      author: "Pooja Mehta",
      role: "D2C Boutique Founder",
      city: "Bengaluru",
      avatar: "/avatar_pooja.png"
    }
  ];

  const technicalAccordions = [
    {
      id: "ingestion",
      title: "Multi-Tenant AI Ingestion Platform",
      desc: "An isolated ingestion gateway that securely processes multi-format text, PDF, and HTML structures. It strips boilerplate, parses tables, and chunks documents into context-coherent structures.",
      icon: <Server className="w-4 h-4 text-purple-400" />
    },
    {
      id: "vector",
      title: "Vector RAG Orchestration",
      desc: "Indexes chunks using high-performance text-embedding models. Search queries retrieve the most relevant semantic chunks in real-time, feeding context directly to the LLM context window.",
      icon: <Database className="w-4 h-4 text-purple-400" />
    },
    {
      id: "langgraph",
      title: "LangGraph RAG Agents",
      desc: "Utilizes a state graph structure built on top of Gemini. The agent dynamically routes queries: looking up catalog database items using SQL tools, searching vector stores for Q&As, or creating pending orders.",
      icon: <Cpu className="w-4 h-4 text-purple-400" />
    },
    {
      id: "namespaces",
      title: "Pinecone Namespaces Isolation",
      desc: "Guarantees strict tenant data boundaries. Each business operates inside its own isolated Pinecone vector namespace, preventing cross-tenant data leaks and keeping business intelligence secure.",
      icon: <Layers className="w-4 h-4 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#02000f] text-white relative flex flex-col justify-between overflow-x-hidden">
      <FloatingParticles />
      <Header />

      {/* Decorative Moving Background Mesh Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.03] blur-[150px] animate-[float-drift_25s_infinite_alternate] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[130px] animate-[float-drift-secondary_20s_infinite_alternate] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[700px] h-[700px] rounded-full bg-violet-600/[0.02] blur-[160px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline & copy */}
        <div className="lg:col-span-7 text-left flex flex-col items-start">
          
          {/* Sub-header tag line */}
          <div className="mb-6 inline-flex items-center gap-2 border border-purple-500/20 bg-purple-950/20 px-3.5 py-1.5 backdrop-blur-md" style={{ borderRadius: '9999px' }}>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-purple-300 uppercase font-bold">
              Smart WhatsApp AI for your business
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="font-display-lg text-4xl md:text-6xl tracking-wide uppercase text-white leading-[1.05] mb-6 mt-2">
            Your business, <br />
            answering WhatsApp 24/7 <br />
            <span className="text-gradient-accent font-bold">automatically.</span>
          </h1>

          {/* Hero Sub-headline */}
          <p className="font-body-lg text-lg md:text-xl text-text-secondary italic leading-relaxed mb-10 max-w-xl">
            Upload your catalog. Connect WhatsApp. Done in under 5 minutes. No code required.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
            <Link
              href="/register"
              className="h-12 px-8 bg-white text-black hover:bg-purple-600 hover:text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 group shadow-lg"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="h-12 px-8 border border-border-subtle hover:border-white text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center transition-all duration-300 bg-white/[0.01]"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Watch Video
            </Link>
          </div>

          {/* Social Proof Strip */}
          <div className="w-full max-w-lg border-t border-border-subtle/40 pt-6 grid grid-cols-3 gap-4 text-left">
            <div>
              <span className="font-display-lg text-2xl font-bold tracking-wider text-white">10+</span>
              <span className="font-mono text-[8px] tracking-widest text-text-muted uppercase block mt-1">Businesses Live</span>
            </div>
            <div className="border-x border-border-subtle/30 px-4">
              <span className="font-display-lg text-2xl font-bold tracking-wider text-white">500k+</span>
              <span className="font-mono text-[8px] tracking-widest text-text-muted uppercase block mt-1">Chats Answered</span>
            </div>
            <div className="pl-4">
              <span className="font-display-lg text-2xl font-bold tracking-wider text-white">99.2%</span>
              <span className="font-mono text-[8px] tracking-widest text-text-muted uppercase block mt-1">Uptime SLA</span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Chat Simulator Widget with rotating border glow */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm card-glow-pulse p-[1px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="w-full bg-[#050314] backdrop-blur-md p-5 border border-white/5 shadow-2xl relative" style={{ borderRadius: 'var(--radius-xl)' }}>
              
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-white font-bold">
                    Try Live Simulator
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] text-purple-400 border border-purple-500/20 px-2 py-0.5 bg-purple-950/10 uppercase tracking-widest">
                    SQLite DB Live
                  </span>
                </div>
              </div>

              {/* Simulated Phone Body */}
              <div className="border border-border-subtle bg-[#0b141a] h-[260px] flex flex-col justify-between overflow-hidden shadow-inner" style={{ borderRadius: 'var(--radius-lg)' }}>
                
                {/* Phone Status Bar */}
                <div className="bg-[#202c33] px-3 py-2 border-b border-white/5 flex items-center justify-between text-white/40 text-[9px] font-sans">
                  <span className="font-bold">9:41 AM</span>
                  <span className="font-bold uppercase tracking-wider text-[8px]">WhatsApp Bot</span>
                </div>

                {/* Chat Thread Messages */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-[11px] leading-normal text-left">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`p-2.5 max-w-[85%] border border-white/5 shadow-sm rounded-none animate-in fade-in duration-300 ${
                        msg.sender === "user" 
                          ? "bg-[#202c33] text-white/90" 
                          : "bg-[#005c4b] text-white ml-auto"
                      }`}
                      style={{ borderRadius: msg.sender === 'user' ? '0px 10px 10px 10px' : '10px 0px 10px 10px' }}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[7px] text-white/35 block mt-1 text-right">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />

                  {isTyping && (
                    <div className="bg-[#005c4b] text-white p-2.5 max-w-[30%] ml-auto border border-white/5 shadow-sm flex items-center justify-center gap-1" style={{ borderRadius: '10px 0 10px 10px' }}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick-Reply Suggestion Pills */}
              <div className="py-2.5 flex flex-wrap gap-1.5 items-center justify-start text-[9px] font-sans">
                <button
                  type="button"
                  onClick={() => triggerQuickReply("Do you have leather jackets?")}
                  className="bg-[#120f2b] hover:bg-[#1f1a44] border border-purple-500/20 hover:border-purple-500/40 text-purple-200 px-3 py-1 transition-all duration-300 cursor-pointer"
                  style={{ borderRadius: '9999px' }}
                  disabled={isTyping}
                >
                  🧥 Catalog
                </button>
                
                <button
                  type="button"
                  onClick={() => triggerQuickReply("Where is my order #ORD-8392?")}
                  className="bg-[#120f2b] hover:bg-[#1f1a44] border border-purple-500/20 hover:border-purple-500/40 text-purple-200 px-3 py-1 transition-all duration-300 cursor-pointer"
                  style={{ borderRadius: '9999px' }}
                  disabled={isTyping}
                >
                  📦 Track Order
                </button>
                
                <button
                  type="button"
                  onClick={() => triggerQuickReply("Hello! Can I see the menu?")}
                  className="bg-[#120f2b] hover:bg-[#1f1a44] border border-purple-500/20 hover:border-purple-500/40 text-purple-200 px-3 py-1 transition-all duration-300 cursor-pointer"
                  style={{ borderRadius: '9999px' }}
                  disabled={isTyping}
                >
                  👋 Hello
                </button>
              </div>

              {/* Live Interactive Input Bar */}
              <form onSubmit={handleCustomSend} className="bg-[#202c33] p-2 flex items-center gap-2 border border-white/5 mt-1" style={{ borderRadius: 'var(--radius-md)' }}>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Ask bot something..."
                  className="flex-1 bg-[#2a3942] rounded-none py-1.5 px-3 text-white text-[11px] focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-white/20"
                  disabled={isTyping}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="w-8 h-8 rounded-none bg-[#00a884] hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Trace logs terminal simulator */}
              <div className="mt-4 bg-[#02000c] border border-border-subtle p-3 font-mono text-[8px] leading-relaxed text-left text-zinc-500 max-h-[75px] overflow-y-auto" style={{ borderRadius: 'var(--radius-md)' }}>
                <span className="text-purple-300 block mb-1 uppercase tracking-widest text-[7px] border-b border-border-subtle/50 pb-1 font-bold">
                  Cognition Trace Terminal
                </span>
                {traceLogs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    <span className="text-purple-500 mr-1">$</span>
                    {log}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Plain Language Features */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full z-10" id="features">
        <div className="text-center mb-16">
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase font-bold">CAPABILITIES</span>
          <h2 className="font-display-lg text-3xl md:text-5xl tracking-wide uppercase text-white mt-2">
            AI Built to Sell, Not Just Chat
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card-interactive p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-950/20 border border-purple-500/20 flex items-center justify-center mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="font-display-lg text-lg tracking-wider uppercase text-white mb-3 font-bold">Learns your catalog instantly</h3>
            <p className="font-body-md text-sm text-text-secondary leading-relaxed">
              Simply upload your PDFs, sheets, or list URLs. The assistant analyzes every item, category, and price in seconds.
            </p>
          </div>

          <div className="glass-card-interactive p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-950/20 border border-purple-500/20 flex items-center justify-center mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
              <Database className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="font-display-lg text-lg tracking-wider uppercase text-white mb-3 font-bold">Remembers every conversation</h3>
            <p className="font-body-md text-sm text-text-secondary leading-relaxed">
              Relational memory keeps track of what customers ordered, where they wanted it shipped, and their preferences over time.
            </p>
          </div>

          <div className="glass-card-interactive p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-950/20 border border-purple-500/20 flex items-center justify-center mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
              <MessageSquare className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="font-display-lg text-lg tracking-wider uppercase text-white mb-3 font-bold">Hindi, English, Hinglish</h3>
            <p className="font-body-md text-sm text-text-secondary leading-relaxed">
              Answers fluently in standard languages and colloquial dialects (Hinglish), matching how customers actually talk.
            </p>
          </div>

          <div className="glass-card-interactive p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-950/20 border border-purple-500/20 flex items-center justify-center mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
              <Link2 className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="font-display-lg text-lg tracking-wider uppercase text-white mb-3 font-bold">No coding needed</h3>
            <p className="font-body-md text-sm text-text-secondary leading-relaxed">
              Connect via an easy admin console. No APIs to code, no servers to configure, no technical background required.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section - Rebuilt split interactive design layout */}
      <section className="py-24 bg-surface-1/20 border-y border-border-subtle/30 w-full z-10">
        <div className="max-w-7xl auto px-6 md:px-12">
          
          <div className="text-center mb-16">
            <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase font-bold font-mono">THREE SIMPLE STEPS</span>
            <h2 className="font-display-lg text-3xl md:text-5xl tracking-wide uppercase text-white mt-2">
              Go Live in Under 5 Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: Steps checklist */}
            <div className="lg:col-span-5 space-y-5">
              {steps.map((step, idx) => (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 border transition-all duration-500 cursor-pointer flex gap-5 items-start ${
                    activeStep === idx 
                      ? "border-purple-500 bg-surface-2/80 shadow-glow-sm" 
                      : "border-border-subtle bg-surface-1/20 opacity-60 hover:opacity-90"
                  }`}
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <div className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
                    activeStep === idx ? "border-purple-400 bg-purple-950/40 text-purple-300" : "border-border-subtle bg-white/5"
                  }`} style={{ borderRadius: 'var(--radius-md)' }}>
                    <span className="font-display-lg text-sm font-bold">{step.num}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-purple-400 uppercase block mb-1 font-bold">
                      {step.subtitle}
                    </span>
                    <h3 className="font-display-lg text-base tracking-wider uppercase text-white mb-2 font-bold">
                      {step.title}
                    </h3>
                    <p className="font-body-md text-xs text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Interactive console mockup */}
            <div className="lg:col-span-7">
              <div className="border border-border-subtle bg-[#060417] p-6 shadow-2xl relative min-h-[360px] flex flex-col justify-between" style={{ borderRadius: 'var(--radius-xl)' }}>
                {/* Mock Window Top Bar */}
                <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4 mb-6">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-[8px] text-text-muted tracking-widest uppercase font-bold">
                    {activeStep === 0 ? "Setup Workspace" : activeStep === 1 ? "Catalog Ingestion" : "Meta Webhook Live"}
                  </span>
                  <span className="font-mono text-[8px] text-purple-400 border border-purple-500/30 px-2 py-0.5 bg-purple-950/20" style={{ borderRadius: '4px' }}>
                    CONSOLE v1.0
                  </span>
                </div>

                {/* Content switching based on activeStep */}
                <div className="flex-1 flex flex-col justify-center items-center py-4">
                  {activeStep === 0 && (
                    <div className="w-full space-y-5 animate-in fade-in zoom-in-95 duration-350">
                      <div className="text-center mb-2">
                        <span className="font-mono text-[8px] text-purple-400 tracking-widest uppercase block mb-1 font-bold">STEP 1</span>
                        <h4 className="font-display-lg text-sm text-white uppercase tracking-wider font-bold">Initialize Assistant Namespace</h4>
                      </div>
                      
                      <div className="space-y-3.5 max-w-sm w-full mx-auto">
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] text-text-muted uppercase block font-semibold">Business Name</label>
                          <div className="bg-surface-2 border border-border-subtle p-2.5 text-xs text-white" style={{ borderRadius: 'var(--radius-sm)' }}>
                            Trendify Boutique
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] text-text-muted uppercase block font-semibold">Admin Email</label>
                          <div className="bg-surface-2 border border-border-subtle p-2.5 text-xs text-zinc-400" style={{ borderRadius: 'var(--radius-sm)' }}>
                            aditya@trendify.in
                          </div>
                        </div>

                        <div className="h-10 bg-white text-black font-mono text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 font-bold shadow-md cursor-default" style={{ borderRadius: 'var(--radius-md)' }}>
                          Create Workspace
                          <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse text-purple-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="w-full space-y-5 animate-in fade-in zoom-in-95 duration-350">
                      <div className="text-center mb-2">
                        <span className="font-mono text-[8px] text-purple-400 tracking-widest uppercase block mb-1 font-bold">STEP 2</span>
                        <h4 className="font-display-lg text-sm text-white uppercase tracking-wider font-bold">File Parsing & Chunking</h4>
                      </div>

                      <div className="border border-dashed border-purple-500/20 hover:border-purple-500/40 bg-surface-2/40 p-6 text-center max-w-sm w-full mx-auto flex flex-col items-center justify-center gap-2.5 transition-colors cursor-pointer" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <UploadCloud className="w-7 h-7 text-purple-400 animate-bounce" />
                        <div>
                          <p className="font-display-lg text-xs text-white font-medium uppercase tracking-wider">Drag & drop price_list.pdf</p>
                          <p className="font-body-md text-[9px] text-text-muted mt-1">or click to browse local files</p>
                        </div>
                      </div>

                      {/* Mock upload list */}
                      <div className="max-w-sm w-full mx-auto space-y-2">
                        <div className="bg-surface-2/60 border border-border-subtle p-2.5 flex items-center justify-between text-[10px]" style={{ borderRadius: 'var(--radius-sm)' }}>
                          <span className="text-white">catalog_2026_summer.pdf</span>
                          <span className="font-mono text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5" style={{ borderRadius: '4px' }}>Parsed 23 Items</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="w-full space-y-5 animate-in fade-in zoom-in-95 duration-350">
                      <div className="text-center mb-2">
                        <span className="font-mono text-[8px] text-purple-400 tracking-widest uppercase block mb-1 font-bold">STEP 3</span>
                        <h4 className="font-display-lg text-sm text-white uppercase tracking-wider font-bold">WhatsApp API Webhook Key</h4>
                      </div>

                      <div className="space-y-3.5 max-w-sm w-full mx-auto">
                        <div className="space-y-1">
                          <label className="font-mono text-[8px] text-text-muted uppercase block font-semibold">Webhook Verify Token</label>
                          <div className="bg-surface-2 border border-border-subtle p-2.5 text-xs text-zinc-500 font-mono tracking-wider truncate" style={{ borderRadius: 'var(--radius-sm)' }}>
                            anytimellm_verify_token_3aef8d1
                          </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-emerald-950/10 border border-emerald-500/20 p-2.5 flex flex-col justify-between" style={{ borderRadius: 'var(--radius-md)' }}>
                            <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-wider font-bold">Connection</span>
                            <span className="font-display-lg text-xs text-white font-bold mt-1 uppercase">Live & Listening</span>
                          </div>
                          
                          <div className="bg-purple-950/10 border border-purple-500/20 p-2.5 flex flex-col justify-between" style={{ borderRadius: 'var(--radius-md)' }}>
                            <span className="font-mono text-[8px] text-purple-400 uppercase tracking-wider font-bold">Sync State</span>
                            <span className="font-display-lg text-xs text-white font-bold mt-1 uppercase">Active Namespace</span>
                          </div>
                        </div>

                        <div className="border border-border-subtle p-2 text-[8px] font-mono text-zinc-400 bg-surface-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                          <span className="text-white">https://api.anytimellm.in/webhook/wa</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mock Window Footer Bar */}
                <div className="border-t border-border-subtle/40 pt-4 mt-6 flex justify-between items-center text-text-muted text-[8px] font-mono">
                  <span>SQLite Fallback Engine</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>System Status: 100% Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase font-bold">TESTIMONIALS</span>
          <h2 className="font-display-lg text-3xl md:text-5xl tracking-wide uppercase text-white mt-2">
            Approved by Pilot Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card-interactive p-8 flex flex-col justify-between relative bg-surface-1/10 border-border-subtle" style={{ borderRadius: 'var(--radius-xl)' }}>
              <span className="absolute top-4 left-6 text-6xl text-purple-500/10 font-serif select-none pointer-events-none">“</span>
              <p className="font-body-lg text-lg text-white italic leading-relaxed relative z-10 mb-8">
                {t.quote}
              </p>
              <div className="border-t border-border-subtle/50 pt-4 flex items-center gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.author} 
                  className="w-10 h-10 rounded-full border border-purple-500/25 object-cover object-center bg-zinc-900 shrink-0" 
                />
                <div className="flex flex-col">
                  <span className="font-display-lg text-sm tracking-wider uppercase text-white font-bold">{t.author}</span>
                  <span className="font-mono text-[9px] tracking-widest text-text-muted uppercase mt-0.5">{t.role}, {t.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical How It Works Accordion */}
      <section className="py-20 bg-surface-1/10 border-t border-border-subtle/20 w-full z-10">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 uppercase font-bold">DEEP DIVE</span>
            <h2 className="font-display-lg text-2xl md:text-3xl tracking-wide uppercase text-white mt-2">
              How It Works (Technical)
            </h2>
          </div>

          <div className="space-y-4 border border-border-subtle bg-[#050314]" style={{ borderRadius: 'var(--radius-xl)' }}>
            {technicalAccordions.map((item) => {
              const isOpen = accordionOpen[item.id];
              return (
                <div key={item.id} className="border-b border-border-subtle last:border-b-0">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-surface-1/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white font-bold">
                        {item.title}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[300px] border-t border-border-subtle/50" : "max-h-0"
                    }`}
                  >
                    <p className="font-body-md text-xs text-text-secondary leading-relaxed p-5 bg-[#08061a]/60">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
