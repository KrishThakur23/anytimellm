"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("anytimellm-token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Use Cases", href: "/use-cases" },
    { name: "Demo", href: "/demo" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#02000f]/90 backdrop-blur-md h-20 flex items-center justify-between px-6 md:px-12 border-b border-border-subtle/30">
      {/* Brand logo */}
      <Link href="/" className="flex items-center gap-1 group">
        <span className="font-display-lg text-lg md:text-xl tracking-[0.4em] font-bold uppercase text-white group-hover:text-purple-400 transition-colors duration-300">
          ANYTIMELLM
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 hover:text-purple-400 ${
              pathname === link.href ? "text-purple-300 font-bold" : "text-text-muted"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Action CTA Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="font-mono text-[10px] tracking-[0.2em] uppercase border border-purple-500/30 px-5 py-2.5 hover:bg-white hover:text-black transition-all duration-300 font-bold"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted hover:text-white transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="font-mono text-[10px] tracking-[0.2em] uppercase bg-white text-black px-5 py-2.5 hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center gap-2 group font-bold"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Start Free Trial
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger menu */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-white hover:text-purple-400 transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#02000f]/98 border-b border-border-subtle flex flex-col p-8 gap-6 z-40 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-mono text-xs tracking-[0.2em] uppercase hover:text-purple-400 transition-colors ${
                  pathname === link.href ? "text-purple-300" : "text-text-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="w-full h-[1px] bg-border-subtle/50 my-2" />

          <div className="flex flex-col gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center font-mono text-xs tracking-[0.2em] uppercase border border-purple-500/30 py-3 hover:bg-white hover:text-black transition-all font-bold"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-mono text-xs tracking-[0.2em] uppercase text-text-muted hover:text-white py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-mono text-xs tracking-[0.2em] uppercase bg-white text-black py-3 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 font-bold"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Start Free Trial
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
