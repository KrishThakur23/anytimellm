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
    <div className="min-h-screen w-full flex flex-col bg-black text-white relative overflow-x-hidden">
      {/* Background Hero Photo Band */}
      <div className="absolute inset-0 h-[65vh] w-full overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 filter grayscale" 
          style={{ backgroundImage: `url('/luxury_watch_precision.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      </div>

      {/* Top Navigation Bar */}
      <header 
        ref={brandRef} 
        className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md h-16 flex items-center justify-between px-8 border-b border-border-subtle/30"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-gold uppercase cursor-pointer hover:text-white transition-colors duration-300">MENU</span>
        <div className="flex items-center gap-1">
          <span className="font-display-lg text-sm tracking-[0.4em] font-medium uppercase text-white cursor-pointer">ANYTIMELLM</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-gold uppercase cursor-pointer hover:text-white transition-colors duration-300">CONSOLE v1.0</span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-start pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
        {/* Tagline overlay */}
        <div className="onboarding-animate-element mb-4 inline-flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">SECURE MULTI-TENANT INGESTION GATEWAY</span>
        </div>

        {/* Big Display Headline */}
        <h1 
          ref={headerRef} 
          className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.08em] uppercase max-w-4xl text-center leading-[1.1] mb-6"
        >
          Automate Customer Service At High Precision
        </h1>

        {/* Serif Body */}
        <p className="onboarding-animate-element font-body-lg text-lg text-on-surface-variant max-w-2xl text-center mb-16 leading-relaxed italic">
          Deploy smart agents mapping your business catalog to WhatsApp in seconds. Universal parsing, relational memory, and vector-RAG orchestration.
        </p>

        {/* Error Banner */}
        {error && (
          <div className="onboarding-animate-element w-full max-w-4xl mb-8 p-4 bg-red-950/20 border border-red-900/40 rounded-none flex items-start gap-3 text-red-300 text-xs text-left font-mono">
            <span className="material-symbols-outlined text-[16px] text-red-500 shrink-0 mt-0.5">error</span>
            <span className="tracking-wider">{error}</span>
          </div>
        )}

        {/* Main Interface Bento Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Register Form */}
          <div className="onboarding-animate-element md:col-span-6 bg-surface-2 border border-border-subtle p-8 rounded-none text-left flex flex-col justify-between transition-colors hover:border-hairline-strong duration-300">
            <div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted-gold uppercase">PHASE 01</span>
              <h3 className="font-display-lg text-xl tracking-[0.1em] text-white uppercase mt-1 mb-3">NEW WORKSPACE</h3>
              <p className="font-body-sm text-sm text-on-surface-variant mb-6 leading-relaxed">
                Initialize a dedicated agent instance and secure workspace for your brand. Type details to spin up metadata and vector namespace.
              </p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="ENTER BUSINESS NAME"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2.5 text-xs text-white placeholder-muted-soft focus:outline-none tracking-widest uppercase transition-all duration-300"
              />
              <input
                type="email"
                placeholder="ENTER ADMIN EMAIL"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2.5 text-xs text-white placeholder-muted-soft focus:outline-none tracking-widest transition-all duration-300"
              />
              <input
                type="password"
                placeholder="CREATE PASSWORD"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2.5 text-xs text-white placeholder-muted-soft focus:outline-none tracking-widest transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loadingBusiness}
                className="w-full h-11 border border-white hover:bg-white hover:text-black rounded-none bg-transparent text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4"
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
          <div className="onboarding-animate-element md:col-span-6 bg-surface-1 border border-border-subtle p-8 rounded-none text-left flex flex-col justify-between transition-colors hover:border-hairline-strong duration-300">
            <div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted-gold uppercase">AUTHENTICATION</span>
              <h3 className="font-display-lg text-xl tracking-[0.1em] text-white uppercase mt-1 mb-3">LOAD WORKSPACE</h3>
              <p className="font-body-sm text-sm text-on-surface-variant mb-6 leading-relaxed">
                Re-enter your secure console. Login with your administrator credentials to open configured documents, catalogs, and logs.
              </p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="ADMIN EMAIL"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2.5 text-xs text-white placeholder-muted-soft focus:outline-none tracking-widest transition-all duration-300"
              />
              <input
                type="password"
                placeholder="PASSWORD"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2.5 text-xs text-white placeholder-muted-soft focus:outline-none tracking-widest transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loadingBusiness}
                className="w-full h-11 border border-white hover:bg-white hover:text-black rounded-none bg-transparent text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4"
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
          className="w-full max-w-4xl bg-surface-2 border border-border-subtle rounded-none p-8 relative overflow-hidden mb-12"
        >
          <h4 className="font-mono text-[10px] tracking-[0.2em] text-white uppercase mb-8 text-center flex items-center justify-center gap-2">
            SYSTEM SEQUENCE & CAPABILITIES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-start p-5 bg-black/40 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer">
              <span className="font-mono text-[10px] tracking-widest text-muted mb-2">01 / INGESTION</span>
              <span className="font-display-lg text-sm text-white tracking-widest uppercase mb-1">Crawl & Parse</span>
              <span className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Feed unstructured docs, URLs or files. Raw data is cleaned instantly.
              </span>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-start p-5 bg-black/40 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer">
              <span className="font-mono text-[10px] tracking-widest text-muted mb-2">02 / INDEXING</span>
              <span className="font-display-lg text-sm text-white tracking-widest uppercase mb-1">Vector DB</span>
              <span className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Embedded data indexed in Pinecone namespaces with low latency.
              </span>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-start p-5 bg-black/40 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer">
              <span className="font-mono text-[10px] tracking-widest text-muted mb-2">03 / COGNITION</span>
              <span className="font-display-lg text-sm text-white tracking-widest uppercase mb-1">LangGraph RAG</span>
              <span className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Gemini routes reasoning loops through relational catalogs.
              </span>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-start p-5 bg-black/40 border border-border-subtle rounded-none hover:border-white transition-all duration-300 cursor-pointer">
              <span className="font-mono text-[10px] tracking-widest text-muted mb-2">04 / DELIVERY</span>
              <span className="font-display-lg text-sm text-white tracking-widest uppercase mb-1">WhatsApp Webhook</span>
              <span className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Respond to queries, look up catalog items, and process orders 24/7.
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <footer className="onboarding-animate-element flex flex-wrap justify-center gap-x-8 gap-y-4 text-muted text-[10px] font-mono tracking-widest uppercase border-t border-border-subtle/30 pt-8 w-full">
          <span>🔒 JWT ENCRYPTED AUTHENTICATION</span>
          <span>⚡ MULTI-TENANT ISOLATED CONSOLE</span>
          <span>💬 WHATSAPP CLOUD API READY</span>
        </footer>
      </main>
    </div>
  );
}
