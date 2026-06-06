"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect them immediately to dashboard
    const token = localStorage.getItem("anytimellm-token");
    if (token) {
      router.push("/");
      return;
    }

    // GSAP Reveal Animations
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    if (brandRef.current) {
      tl.fromTo(
        brandRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 1.0, delay: 0.1 }
      );
    }

    if (formRef.current) {
      tl.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0 },
        "-=0.6"
      );
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await api.register(businessName.trim(), email.trim(), password);
      // Success: redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Email might already be taken.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white relative overflow-x-hidden">
      {/* Background Hero Photo Band */}
      <div className="absolute inset-0 h-[65vh] w-full overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter grayscale" 
          style={{ backgroundImage: `url('/luxury_watch_precision.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />
      </div>

      {/* Top Navigation Bar */}
      <header 
        ref={brandRef} 
        className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md h-16 flex items-center justify-between px-8 border-b border-border-subtle/30"
      >
        <Link 
          href="/" 
          className="font-mono text-[10px] tracking-[0.2em] text-muted-gold uppercase hover:text-white transition-colors duration-300"
        >
          ← HOME
        </Link>
        <div className="flex items-center gap-1">
          <span className="font-display-lg text-sm tracking-[0.4em] font-medium uppercase text-white cursor-pointer">ANYTIMELLM</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-gold uppercase">CONSOLE v1.0</span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center pt-24 pb-16 px-6 max-w-[500px] mx-auto w-full">
        <div 
          ref={formRef} 
          className="w-full bg-surface-2 border border-border-subtle p-8 md:p-10 rounded-none text-left flex flex-col justify-between transition-colors hover:border-hairline-strong duration-300"
        >
          <div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-gold uppercase">PHASE 01</span>
            <h3 className="font-display-lg text-2xl tracking-[0.1em] text-white uppercase mt-1 mb-3">NEW WORKSPACE</h3>
            <p className="font-body-sm text-sm text-on-surface-variant mb-6 leading-relaxed">
              Initialize a dedicated agent instance and secure workspace for your brand. Type details to spin up metadata and vector namespace.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-6 p-4 bg-red-950/20 border border-red-900/40 rounded-none flex items-start gap-3 text-red-300 text-xs text-left font-mono">
              <span className="material-symbols-outlined text-[16px] text-red-500 shrink-0 mt-0.5">error</span>
              <span className="tracking-wider">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-1">BUSINESS NAME</label>
              <input
                type="text"
                required
                placeholder="ENTER BUSINESS NAME"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2 text-sm text-white placeholder-muted-soft focus:outline-none tracking-widest uppercase transition-all duration-300"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-1">ADMIN EMAIL</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2 text-sm text-white placeholder-muted-soft focus:outline-none transition-all duration-300"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-1">PASSWORD</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border-subtle focus:border-white rounded-none py-2 text-sm text-white placeholder-muted-soft focus:outline-none transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 border border-white hover:bg-white hover:text-black rounded-none bg-transparent text-white font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                "REGISTER & CREATE WORKSPACE"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-border-subtle/30 pt-6 text-center">
            <span className="font-body-sm text-xs text-on-surface-variant">Already have a workspace? </span>
            <Link 
              href="/login" 
              className="font-mono text-xs text-muted-gold uppercase hover:text-white transition-colors duration-300"
            >
              Sign In to Console
            </Link>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <footer className="mt-12 flex justify-center text-muted text-[10px] font-mono tracking-widest uppercase border-t border-border-subtle/20 pt-6 w-full text-center">
          <span>🔒 SECURE WORKSPACE INGESTION</span>
        </footer>
      </main>
    </div>
  );
}
