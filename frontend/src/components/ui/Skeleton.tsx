"use client";

import React from "react";

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonLine({ width = "100%", height = "14px", className = "" }: SkeletonLineProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`glass-panel p-6 space-y-4 ${className}`} aria-hidden="true">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <SkeletonLine width="40%" height="12px" />
          <SkeletonLine width="60%" height="28px" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <SkeletonLine width="70%" height="10px" />
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTable({ rows = 4, cols = 4, className = "" }: SkeletonTableProps) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-zinc-900">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine
            key={`h-${i}`}
            width={i === 0 ? "30%" : "18%"}
            height="10px"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonLine
              key={`r${rowIdx}-c${colIdx}`}
              width={colIdx === 0 ? "35%" : "16%"}
              height="14px"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
