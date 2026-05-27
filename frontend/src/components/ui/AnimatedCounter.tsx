"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  target,
  duration = 1.2,
  delay = 0.2,
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!counterRef.current) return;

    if (prefersReduced) {
      counterRef.current.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        }
      },
    });

    return () => { tween.kill(); };
  }, [target, duration, delay, prefix, suffix, prefersReduced]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
