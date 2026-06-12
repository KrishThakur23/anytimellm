"use client";

import React from "react";

interface GradientOrbProps {
  /** CSS color like "rgba(168, 85, 247, 0.15)" */
  color?: string;
  /** Size in pixels */
  size?: number;
  /** Top offset */
  top?: string;
  /** Left offset */
  left?: string;
  /** Right offset */
  right?: string;
  /** Animation duration in seconds */
  duration?: number;
  className?: string;
}

export default function GradientOrb({
  color = "rgba(168, 85, 247, 0.12)",
  size = 400,
  top,
  left,
  right,
  duration = 20,
  className = "",
}: GradientOrbProps) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        top,
        left,
        right,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        animation: `float-drift ${duration}s ease-in-out infinite`,
        willChange: "transform",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
