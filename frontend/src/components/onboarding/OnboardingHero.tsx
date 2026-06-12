"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";

interface OnboardingHeroProps {
  loadingBusiness: boolean;
  error: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (businessName: string, email: string, password: string) => Promise<void>;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function OnboardingHero({
  loadingBusiness,
  error,
  onLogin,
  onRegister,
}: OnboardingHeroProps) {
  const brandRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);

  // Local form states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    // Premium reveal timeline with GSAP
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.fromTo(
      brandRef.current,
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 1.0, delay: 0.2 }
    );

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=0.6"
      );
    }

    tl.fromTo(
      ".onboarding-animate-element",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
      "-=0.8"
    );

    if (visualRef.current) {
      tl.fromTo(
        visualRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 1.0 },
        "-=0.6"
      );
    }
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) return;
    onRegister(registerName.trim(), registerEmail.trim(), registerPassword);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    onLogin(loginEmail.trim(), loginPassword);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 relative overflow-x-hidden text-center">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-r from-[#128C7E]/10 to-[#25D366]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[400px] right-1/4 w-[500px] h-[250px] bg-gradient-to-r from-cyan-500/10 to-[#25D366]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header 
        ref={brandRef} 
        className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md h-16 flex items-center justify-between px-8 border-b border-slate-200 shadow-xs"
      >
        <span className="font-mono text-[9px] tracking-[0.2em] text-slate-550 uppercase cursor-pointer hover:text-slate-800 transition-colors duration-300 font-bold">MENU</span>
        <div className="flex items-center gap-1">
          <span className="font-display text-sm tracking-[0.4em] font-extrabold uppercase text-slate-900 cursor-pointer">ANYTIMELLM</span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] text-slate-550 uppercase cursor-pointer hover:text-slate-800 transition-colors duration-300 font-bold">Dashboard</span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-start pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
        {/* Tagline overlay */}
        <div className="onboarding-animate-element mb-4 inline-flex items-center gap-2 bg-[#F0F2F5] border border-[#DCF8C6] px-3 py-1 rounded-full">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase font-bold">Smart WhatsApp AI for your business</span>
        </div>

        {/* Big Display Headline */}
        <h1 
          ref={headerRef} 
          className="font-display text-4xl md:text-5xl lg:text-6xl text-slate-900 font-extrabold tracking-tight max-w-4xl text-center leading-[1.1] mb-6"
        >
          Automate Customer Service At High Precision
        </h1>

        {/* Serif Body */}
        <p className="onboarding-animate-element font-body text-base md:text-lg text-slate-500 max-w-2xl text-center mb-16 leading-relaxed">
          Deploy smart agents mapping your business catalog to WhatsApp in seconds. Universal parsing, relational memory, and vector-RAG orchestration.
        </p>

        {/* Error Banner */}
        {error && (
          <div className="onboarding-animate-element w-full max-w-4xl mb-8 p-4 bg-red-50 border border-red-200 rounded-none flex items-start gap-3 text-red-750 text-base text-left font-mono" style={{ borderRadius: 12 }}>
            <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0 mt-0.5">error</span>
            <span className="tracking-wider">{error}</span>
          </div>
        )}

        {/* Main Interface Bento Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Register Form */}
          <div className="onboarding-animate-element md:col-span-6 bg-white border border-slate-200 p-8 rounded-none text-left flex flex-col justify-between hover:border-[#25D366] transition-all duration-300 shadow-xs" style={{ borderRadius: 16 }}>
            <div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase font-bold">PHASE 01</span>
              <h3 className="font-display text-xl font-extrabold tracking-[0.1em] text-slate-800 uppercase mt-1 mb-3">NEW WORKSPACE</h3>
              <p className="font-body text-base text-slate-500 mb-6 leading-relaxed">
                Set up your AI assistant and secure workspace for your brand. Type details to spin up metadata and vector namespace.
              </p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="ENTER BUSINESS NAME"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-3.5 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] focus:bg-white tracking-widest uppercase transition-all duration-300"
                style={{ borderRadius: 10 }}
              />
              <input
                type="email"
                placeholder="ENTER ADMIN EMAIL"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-3.5 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] focus:bg-white tracking-widest transition-all duration-300"
                style={{ borderRadius: 10 }}
              />
              <input
                type="password"
                placeholder="CREATE PASSWORD"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-3.5 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] focus:bg-white tracking-widest transition-all duration-300"
                style={{ borderRadius: 10 }}
              />
              <button
                type="submit"
                disabled={loadingBusiness}
                className="w-full h-11 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:opacity-95 text-white font-mono text-base tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4 shadow-sm font-bold"
                style={{ borderRadius: 10 }}
              >
                {loadingBusiness ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  "REGISTER & CREATE WORKSPACE"
                )}
              </button>
            </form>
          </div>

          {/* Login Form */}
          <div className="onboarding-animate-element md:col-span-6 bg-white border border-slate-200 p-8 rounded-none text-left flex flex-col justify-between hover:border-[#25D366] transition-all duration-300 shadow-xs" style={{ borderRadius: 16 }}>
            <div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase font-bold">AUTHENTICATION</span>
              <h3 className="font-display text-xl font-extrabold tracking-[0.1em] text-slate-800 uppercase mt-1 mb-3">LOAD WORKSPACE</h3>
              <p className="font-body text-base text-slate-500 mb-6 leading-relaxed">
                Re-enter your secure console. Login with your administrator credentials to open configured documents, catalogs, and logs.
              </p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="ADMIN EMAIL"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-3.5 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] focus:bg-white tracking-widest transition-all duration-300"
                style={{ borderRadius: 10 }}
              />
              <input
                type="password"
                placeholder="PASSWORD"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-none px-3.5 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] focus:bg-white tracking-widest transition-all duration-300"
                style={{ borderRadius: 10 }}
              />
              <button
                type="submit"
                disabled={loadingBusiness}
                className="w-full h-11 bg-slate-850 hover:bg-slate-900 text-white font-mono text-base tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4 shadow-sm font-bold"
                style={{ borderRadius: 10 }}
              >
                {loadingBusiness ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  "SIGN IN TO CONSOLE"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* System Capabilities Section */}
        <div 
          ref={visualRef} 
          className="w-full max-w-4xl bg-white border border-slate-200 rounded-none p-8 relative overflow-hidden mb-12 shadow-xs"
          style={{ borderRadius: 20 }}
        >
          <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#128C7E] uppercase mb-8 text-center font-bold">
            SYSTEM SEQUENCE & CAPABILITIES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {/* Step 1 */}
            <div className="flex flex-col items-start p-5 bg-slate-50 border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer" style={{ borderRadius: 12 }}>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 mb-2 font-bold">01 / INGESTION</span>
              <span className="font-display text-sm font-extrabold text-slate-800 tracking-widest uppercase mb-1">Crawl & Parse</span>
              <span className="font-body text-base text-slate-500 leading-relaxed">
                Feed unstructured docs, URLs or files. Raw data is cleaned instantly.
              </span>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-start p-5 bg-slate-50 border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer" style={{ borderRadius: 12 }}>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 mb-2 font-bold">02 / INDEXING</span>
              <span className="font-display text-sm font-extrabold text-slate-800 tracking-widest uppercase mb-1">Instant memory</span>
              <span className="font-body text-base text-slate-500 leading-relaxed">
                Embedded data indexed in Pinecone namespaces with low latency.
              </span>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-start p-5 bg-slate-50 border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer" style={{ borderRadius: 12 }}>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 mb-2 font-bold">03 / COGNITION</span>
              <span className="font-display text-sm font-extrabold text-slate-800 tracking-widest uppercase mb-1">Smart reasoning</span>
              <span className="font-body text-base text-slate-500 leading-relaxed">
                Gemini routes reasoning loops through relational catalogs.
              </span>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-start p-5 bg-slate-50 border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 cursor-pointer" style={{ borderRadius: 12 }}>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 mb-2 font-bold">04 / DELIVERY</span>
              <span className="font-display text-sm font-extrabold text-slate-800 tracking-widest uppercase mb-1">WhatsApp integration</span>
              <span className="font-body text-base text-slate-500 leading-relaxed">
                Respond to queries, look up catalog items, and process orders 24/7.
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <footer className="onboarding-animate-element flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 text-[9px] font-mono tracking-widest uppercase border-t border-slate-200 pt-8 w-full font-bold">
          <span>🔒 JWT ENCRYPTED AUTHENTICATION</span>
          <span>⚡ MULTI-TENANT ISOLATED CONSOLE</span>
          <span>💬 WHATSAPP CLOUD API READY</span>
        </footer>
      </main>
    </div>
  );
}
