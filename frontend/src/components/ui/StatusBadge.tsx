"use client";

import React from "react";
import { CheckCircle2, Loader2, XCircle, AlertCircle } from "lucide-react";

type StatusVariant = "success" | "processing" | "error" | "info";

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  className?: string;
}

const config: Record<StatusVariant, { 
  icon: React.ElementType;
  colors: string;
}> = {
  success: {
    icon: CheckCircle2,
    colors: "text-[var(--accent-green)] bg-[var(--accent-green-muted)] border-[var(--accent-green)]/20",
  },
  processing: {
    icon: Loader2,
    colors: "text-[var(--primary)] bg-[var(--primary-muted)] border-[var(--primary)]/25",
  },
  error: {
    icon: XCircle,
    colors: "text-[var(--accent-red)] bg-[var(--accent-red-muted)] border-[var(--accent-red)]/20",
  },
  info: {
    icon: AlertCircle,
    colors: "text-[var(--accent-blue)] bg-[var(--accent-blue-muted)] border-[var(--accent-blue)]/20",
  },
};

export default function StatusBadge({ variant, label, className = "" }: StatusBadgeProps) {
  const itemConfig = config[variant];
  if (!itemConfig) return null;
  const { icon: Icon, colors } = itemConfig;
  const isAnimated = variant === "processing";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${colors} ${
        isAnimated ? "animate-pulse" : ""
      } ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${isAnimated ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}
