"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

export default function FloatingCTA() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the floating CTA after scrolling past the hero section (approx 500px)
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[88px] right-6 z-[90] animate-fade-in">
      <button
        onClick={() => router.push("/sandbox")}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/25"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#128C7E] to-[#25D366] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <Play className="relative z-10 h-4 w-4 fill-current" />
        <span className="relative z-10">See It Working</span>
      </button>
    </div>
  );
}
