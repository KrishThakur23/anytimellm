"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StickyMobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-[60] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <Link 
        href="/pricing"
        className="w-full h-14 bg-slate-900 text-white rounded-[1rem] shadow-2xl flex items-center justify-center gap-2 font-bold text-[15px] border border-slate-800"
      >
        Start Free Trial
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
