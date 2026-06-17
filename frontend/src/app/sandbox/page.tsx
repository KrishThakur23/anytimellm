"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Database, Code, Activity, Server, Cpu } from "lucide-react";
import Link from "next/link";

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono text-sm relative selection:bg-violet-900/50 selection:text-violet-200 flex flex-col">
      {/* Dark Mode Background Orb */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md h-16 flex items-center justify-between px-8 border-b border-slate-800">
        <Link 
          href="/" 
          className="text-[10px] tracking-[0.2em] text-slate-500 uppercase hover:text-slate-300 transition-colors duration-300 font-bold"
        >
          ← EXIT LAB
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] font-extrabold uppercase text-slate-300">SANDBOX_ENV</span>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-violet-400 uppercase font-bold">API v2.0.4</span>
      </header>

      <main className="relative z-10 flex-grow pt-24 pb-12 px-6 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold px-4 mb-2">Modules</div>
          {[
            { id: "logs", icon: <Terminal className="w-4 h-4" />, label: "System Logs" },
            { id: "vector", icon: <Database className="w-4 h-4" />, label: "Vector DB" },
            { id: "webhooks", icon: <Activity className="w-4 h-4" />, label: "Webhooks" },
            { id: "api", icon: <Code className="w-4 h-4" />, label: "API Explorer" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-wider ${
                activeTab === tab.id 
                  ? "bg-violet-600/10 text-violet-400 border border-violet-600/20" 
                  : "text-slate-500 hover:bg-slate-900 hover:text-slate-300 border border-transparent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          <div className="mt-auto pt-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Node Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">CPU</span>
                  <span className="text-emerald-400">12%</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">RAM</span>
                  <span className="text-emerald-400">2.4GB / 8GB</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Latency</span>
                  <span className="text-emerald-400">42ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/50">
          
          {/* Header */}
          <div className="h-12 border-b border-slate-800 flex items-center px-4 bg-slate-950/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            </div>
            <div className="mx-auto flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <Cpu className="w-3 h-3" />
              {activeTab === "logs" ? "/var/log/system.out" : `/sandbox/${activeTab}`}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "logs" && (
              <div className="space-y-3">
                <div className="text-slate-500"># Initializing Business Brain Core...</div>
                <div className="text-emerald-400">[OK] Vector embeddings loaded (42.1ms)</div>
                <div className="text-emerald-400">[OK] WhatsApp Webhook connected</div>
                <div className="text-emerald-400">[OK] Memory nodes synchronized</div>
                <div className="text-slate-500">Waiting for incoming events...</div>
                <div className="mt-6 flex items-start gap-3">
                  <span className="text-violet-400 shrink-0">14:02:41</span>
                  <span className="text-slate-300">
                    <span className="text-blue-400">[EVENT]</span> message.received
                    <br/>
                    <span className="text-slate-500">{"{"} from: "+919876543210", text: "Do you have the black variant in size 10?" {"}"}</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-violet-400 shrink-0">14:02:42</span>
                  <span className="text-slate-300">
                    <span className="text-amber-400">[RAG]</span> Querying knowledge base for "black variant size 10"...
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-violet-400 shrink-0">14:02:43</span>
                  <span className="text-slate-300">
                    <span className="text-emerald-400">[ACTION]</span> Sending reply: "Yes, we have 3 pairs left in size 10 black! Would you like me to reserve one for you?"
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-violet-500">❯</span>
                  <span className="w-2 h-4 bg-slate-500 animate-pulse" />
                </div>
              </div>
            )}

            {activeTab === "vector" && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Database className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-slate-300 font-bold uppercase tracking-widest mb-2">Vector Space Explorer</h3>
                <p className="text-slate-500 text-xs max-w-md">Visualize embeddings and nearest neighbors. Connect your data source to begin semantic exploration.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

