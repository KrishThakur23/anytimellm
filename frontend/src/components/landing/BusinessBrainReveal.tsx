"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BusinessBrainReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;
    const sentences = gsap.utils.toArray<HTMLElement>(".reveal-sentence", textRef.current);
    if (sentences.length === 0) return;

    // Set initial opacities: Sentence 1 is active (1.0), rest are inactive (0.2)
    gsap.set(sentences, { opacity: 0.2 });
    gsap.set(sentences[0], { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: "center center",
        end: "+=200%", // Scroll distance to complete animation
        scrub: 0.5, // smooth scrubbing transition
        pin: true,
      }
    });

    // Create a sequential cross-fade timeline
    for (let i = 1; i < sentences.length; i++) {
      tl.to(sentences[i - 1], { opacity: 0.2, duration: 1 }, `fade-${i}`)
        .to(sentences[i], { opacity: 1, duration: 1 }, `fade-${i}`);
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-transparent text-slate-900 relative py-20 md:py-32">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30 pointer-events-none -z-10" />

      <div ref={textRef} className="max-w-5xl mx-auto px-6 text-center space-y-4 md:space-y-6">
        <h3 className="reveal-sentence font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
          Reads your catalog.
        </h3>
        <h3 className="reveal-sentence font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
          Understands your business.
        </h3>
        <h3 className="reveal-sentence font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
          Answers customers.
        </h3>
        <h3 className="reveal-sentence font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-emerald-500">
          Creates orders.
        </h3>
        <h3 className="reveal-sentence font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-violet-600">
          Never sleeps.
        </h3>
      </div>
    </section>
  );
}
