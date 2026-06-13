"use client";

import React, { useEffect, useRef, useCallback } from "react";

/* ────────────────────────────────────────────────────────────────
   CursorEffects — Spotlight, Magnetic Buttons, Card Tilt
   Apple-quality, subtle interactions
   ──────────────────────────────────────────────────────────────── */

export default function CursorEffects() {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Check if it's a mobile/touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // ── Cursor Spotlight ──
    const spotlightEls = document.querySelectorAll<HTMLElement>(".cursor-spotlight");
    const handleSpotlight = (e: MouseEvent) => {
      spotlightEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
        el.style.setProperty("--spotlight-x", `${x}px`);
        el.style.setProperty("--spotlight-y", `${y}px`);
        el.style.setProperty("--spotlight-opacity", inside ? "1" : "0");
      });
    };

    // ── Magnetic Buttons ──
    const magneticBtns = document.querySelectorAll<HTMLElement>(".magnetic-btn");
    const handleMagnetic = (e: MouseEvent) => {
      magneticBtns.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = 120;

        if (dist < threshold) {
          const strength = (1 - dist / threshold) * 6;
          btn.style.transform = `translate(${dx * strength * 0.04}px, ${dy * strength * 0.04}px)`;
        } else {
          btn.style.transform = "translate(0, 0)";
        }
      });
    };

    // ── Card Tilt ──
    const tiltCards = document.querySelectorAll<HTMLElement>(".card-tilt");
    const handleTilt = (e: MouseEvent) => {
      tiltCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

        if (inside) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateY = ((x - centerX) / centerX) * 2.5;
          const rotateX = ((centerY - y) / centerY) * 2.5;
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        } else {
          card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
        }
      });
    };

    // ── Glass card mouse position ──
    const glassCards = document.querySelectorAll<HTMLElement>(".glass-card-interactive");
    const handleGlass = (e: MouseEvent) => {
      glassCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        handleSpotlight(e);
        handleMagnetic(e);
        handleTilt(e);
        handleGlass(e);
      });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return null; // This component adds behavior, no visual output
}
