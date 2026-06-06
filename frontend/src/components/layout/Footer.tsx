"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { name: "Pricing", href: "/pricing" },
    { name: "Demo", href: "/demo" },
    { name: "Use Cases", href: "/use-cases" },
    { name: "About", href: "/about" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <footer className="w-full bg-[#02000f] border-t border-border-subtle/30 py-16 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand Information */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <span className="font-display-lg text-md md:text-lg tracking-[0.3em] font-bold uppercase text-white">
            ANYTIMELLM
          </span>
          <p className="font-mono text-[9px] tracking-wider text-purple-400 uppercase font-bold">
            Built for Indian SMBs who live on WhatsApp.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-mono text-[10px] tracking-widest text-text-muted uppercase hover:text-purple-300 transition-colors duration-250"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Contact info */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1.5 font-mono text-[10px] tracking-widest text-text-muted uppercase">
          <div>
            Email: <span className="text-white hover:text-purple-400 transition-colors duration-250 cursor-pointer">hello@anytimellm.com</span>
          </div>
          <div>
            WhatsApp: <span className="text-white hover:text-purple-400 transition-colors duration-250 cursor-pointer">+91 99999 99999</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border-subtle/20 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <span className="font-mono text-[9px] tracking-widest text-text-ghost uppercase">
          © {new Date().getFullYear()} AnytimeLLM. All Rights Reserved.
        </span>
        <span className="font-mono text-[9px] tracking-widest text-text-ghost uppercase">
          🇮🇳 Made with pride in India
        </span>
      </div>
    </footer>
  );
}
