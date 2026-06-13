import React from 'react';
import { Layers, Box, Cpu, Globe, Triangle, Circle, Hexagon } from 'lucide-react';

export default function TrustedBy() {
  const logos = [
    { icon: <Layers className="w-5 h-5 text-slate-400" />, name: "Acme Corp" },
    { icon: <Box className="w-5 h-5 text-slate-400" />, name: "Globex" },
    { icon: <Cpu className="w-5 h-5 text-slate-400" />, name: "Soylent" },
    { icon: <Globe className="w-5 h-5 text-slate-400" />, name: "Initech" },
    { icon: <Triangle className="w-5 h-5 text-slate-400" />, name: "Umbrella" },
    { icon: <Circle className="w-5 h-5 text-slate-400" />, name: "Massive Dynamic" },
    { icon: <Hexagon className="w-5 h-5 text-slate-400" />, name: "Cyberdyne" },
  ];

  // Duplicate for seamless loop
  const infiniteLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-12 border-y border-slate-100 bg-slate-50/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          Trusted by innovative businesses worldwide
        </p>
      </div>
      
      {/* Gradient masks for smooth fade on edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="flex w-full overflow-hidden">
        <div 
          className="flex w-max animate-[scroll_40s_linear_infinite] items-center gap-16 px-8"
          style={{ willChange: "transform" }}
        >
          {infiniteLogos.map((logo, idx) => (
            <div key={idx} className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {logo.icon}
              <span className="font-display font-bold text-xl text-slate-600 tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
