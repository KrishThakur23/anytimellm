"use client";

import { useEffect, useRef } from "react";

export default function AnimatedGradientMesh() {
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let currentX = 50;
    let currentY = 50;
    let targetX = 50;
    let targetY = 50;

    const handleMouseMove = (event: MouseEvent) => {
      // Convert to percentages
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (meshRef.current) {
        meshRef.current.style.background = `
          radial-gradient(circle at ${currentX}% ${currentY}%, rgba(124, 58, 237, 0.25) 0%, transparent 50%),
          radial-gradient(circle at ${100 - currentX}% ${100 - currentY}%, rgba(6, 182, 212, 0.2) 0%, transparent 65%),
          radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 70%)
        `;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div 
        ref={meshRef}
        className="absolute inset-0 opacity-[0.15] mix-blend-multiply transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 65%),
            radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 70%)
          `
        }}
      />
    </div>
  );
}
