"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";
import Script from "next/script";

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In registration states
  const [showBusinessPrompt, setShowBusinessPrompt] = useState(false);
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);
  const [googleBusinessName, setGoogleBusinessName] = useState("");
  const [registeringGoogle, setRegisteringGoogle] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect them immediately to dashboard
    const token = localStorage.getItem("anytimellm-token");
    if (token) {
      // Verify token is valid before redirecting
      api.getMe()
        .then(() => {
          router.push("/dashboard");
        })
        .catch(() => {
          // If token is invalid, clear it
          localStorage.removeItem("anytimellm-token");
          localStorage.removeItem("anytimellm-active-business-id");
        });
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

  const handleGoogleCallback = async (response: any) => {
    const credential = response.credential;
    if (!credential) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.loginWithGoogle(credential);
      if (res.is_registered) {
        router.push("/dashboard");
      } else {
        setGoogleCredential(credential);
        setShowBusinessPrompt(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (typeof window !== "undefined" && (window as any).google) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "mock-google-client-id.apps.googleusercontent.com";
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });
        
        const btnElem = document.getElementById("google-signin-btn");
        if (btnElem) {
          (window as any).google.accounts.id.renderButton(btnElem, {
            theme: "outline",
            size: "large",
            width: btnElem.clientWidth || 320,
            text: "continue_with",
            shape: "square"
          });
        }
      }
    };

    const timer = setInterval(() => {
      if ((window as any).google) {
        initGoogle();
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleCompleteGoogleRegistration = async () => {
    if (!googleBusinessName.trim() || !googleCredential) return;
    
    setRegisteringGoogle(true);
    setError(null);
    try {
      await api.loginWithGoogle(googleCredential, googleBusinessName.trim());
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to finalize registration.");
      setRegisteringGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.login(email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-slate-900 relative overflow-x-hidden">
      {/* Script to load Google Identity Services */}
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] bg-indigo-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header 
        ref={brandRef} 
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-8 border-b border-slate-200/60"
      >
        <Link 
          href="/" 
          className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase hover:text-slate-900 transition-colors duration-300"
        >
          ← HOME
        </Link>
        <div className="flex items-center gap-1">
          <span className="font-display text-sm tracking-[0.4em] font-extrabold uppercase text-slate-900 cursor-pointer">ANYTIMELLM</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">Dashboard</span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center pt-28 pb-16 px-6 max-w-[500px] mx-auto w-full">
        <div 
          ref={formRef} 
          className="w-full bg-white border border-slate-200 p-8 md:p-10 rounded-2xl text-left flex flex-col justify-between shadow-xl shadow-slate-100/50 transition-all duration-300"
        >
          <div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-purple-600 uppercase font-bold">AUTHENTICATION</span>
            <h3 className="font-display text-2xl tracking-tight text-slate-900 font-extrabold uppercase mt-1 mb-3">LOAD WORKSPACE</h3>
            <p className="font-body text-sm text-slate-500 mb-6 leading-relaxed">
              Re-enter your secure console. Login with your administrator credentials to open configured documents, catalogs, and logs.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600 text-xs text-left font-mono">
              <span className="shrink-0 mt-0.5 font-bold">⚠️</span>
              <span className="tracking-wider">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] text-slate-500 uppercase mb-1.5 font-bold">ADMIN EMAIL</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-300"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] text-slate-500 uppercase mb-1.5 font-bold">PASSWORD</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-mono text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer mt-6 shadow-lg shadow-purple-500/10 font-bold"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                "SIGN IN TO CONSOLE"
              )}
            </button>
          </form>

          {/* Google Sign-In Section */}
          <div className="w-full flex flex-col items-center gap-4 mt-6 border-t border-slate-100 pt-6">
            <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase font-bold">OR CONTINUE WITH</span>
            <div id="google-signin-btn" className="w-full flex justify-center min-h-[40px] z-10"></div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <span className="font-body text-xs text-slate-500">Don't have a workspace? </span>
            <Link 
              href="/register" 
              className="font-mono text-xs text-purple-600 uppercase hover:text-purple-700 font-bold transition-colors duration-300"
            >
              Register Workspace
            </Link>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <footer className="mt-12 flex justify-center text-slate-400 text-[10px] font-mono tracking-widest uppercase border-t border-slate-100 pt-6 w-full text-center">
          <span>🔒 JWT SECURED SESSION</span>
        </footer>
      </main>

      {/* Glassmorphic Prompt Modal for Workspace Name */}
      {showBusinessPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-[420px] bg-white border border-slate-200 p-8 font-mono text-left relative flex flex-col justify-between shadow-2xl rounded-2xl">
            <div>
              <span className="text-[9px] tracking-[0.2em] text-purple-600 uppercase block mb-1 font-bold">REGISTRATION</span>
              <h4 className="text-lg tracking-tight uppercase text-slate-900 font-extrabold mb-3">NAME YOUR WORKSPACE</h4>
              <p className="font-body text-[11px] text-slate-500 leading-relaxed mb-6 italic">
                Welcome! It looks like you're signing in with Google for the first time. Please specify a brand name to initialize your tenant workspace.
              </p>
              
              <div>
                <label className="block text-[8px] tracking-[0.15em] text-slate-500 uppercase mb-1.5 font-bold">BUSINESS NAME</label>
                <input
                  type="text"
                  required
                  placeholder="ENTER BUSINESS NAME"
                  value={googleBusinessName}
                  onChange={(e) => setGoogleBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none uppercase tracking-widest transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowBusinessPrompt(false);
                  setGoogleCredential(null);
                }}
                className="flex-1 h-10 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 rounded-xl bg-transparent font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={registeringGoogle || !googleBusinessName.trim()}
                onClick={handleCompleteGoogleRegistration}
                className="flex-1 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-mono text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-1 transition-all duration-300 disabled:opacity-40 cursor-pointer shadow-lg shadow-purple-500/10"
              >
                {registeringGoogle ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "CREATE WORKSPACE"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
