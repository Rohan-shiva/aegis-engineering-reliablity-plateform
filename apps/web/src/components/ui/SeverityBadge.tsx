import React from "react";
import { cn } from "@/lib/utils";
import { SeverityType as DomainSeverityType } from "@aegis/types";

export type SeverityType = DomainSeverityType;

interface SeverityBadgeProps {
  severity: SeverityType;
  className?: string;
  showDot?: boolean;
}

const severityConfig: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  "SEV-1": {
    bg: "bg-red-950/60",
    text: "text-red-400 font-bold",
    border: "border-red-600/40",
    dot: "bg-red-500",
  },
  SEV1: {
    bg: "bg-red-950/60",
    text: "text-red-400 font-bold",
    border: "border-red-600/40",
    dot: "bg-red-500",
  },
  "SEV-2": {
    bg: "bg-orange-950/60",
    text: "text-orange-400 font-semibold",
    border: "border-orange-500/40",
    dot: "bg-orange-500",
  },
  SEV2: {
    bg: "bg-orange-950/60",
    text: "text-orange-400 font-semibold",
    border: "border-orange-500/40",
    dot: "bg-orange-500",
  },
  "SEV-3": {
    bg: "bg-amber-950/50",
    text: "text-amber-300 font-medium",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  SEV3: {
    bg: "bg-amber-950/50",
    text: "text-amber-300 font-medium",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  "SEV-4": {
    bg: "bg-blue-950/40",
    text: "text-blue-400 font-medium",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
  SEV4: {
    bg: "bg-blue-950/40",
    text: "text-blue-400 font-medium",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className,
  showDot = true,
}) => {
  const config = severityConfig[severity] || severityConfig["SEV-4"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs tracking-wider uppercase",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />}
      {severity}
    </span>
  );
};
