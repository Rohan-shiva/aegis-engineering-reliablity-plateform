import React from "react";
import { cn } from "@/lib/utils";
import { StatusType as DomainStatusType } from "@aegis/types";

export type StatusType = DomainStatusType | "unknown";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; dotBg: string; badgeBg: string; text: string; border: string }
> = {
  healthy: {
    label: "Healthy",
    dotBg: "bg-emerald-400 animate-pulse",
    badgeBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  nominal: {
    label: "Nominal",
    dotBg: "bg-emerald-400 animate-pulse",
    badgeBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  degraded: {
    label: "Degraded",
    dotBg: "bg-amber-400 animate-pulse",
    badgeBg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  critical: {
    label: "Critical",
    dotBg: "bg-red-500 animate-ping",
    badgeBg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  failing: {
    label: "Failing",
    dotBg: "bg-red-500 animate-ping",
    badgeBg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  unknown: {
    label: "Unknown",
    dotBg: "bg-slate-400",
    badgeBg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "md",
  className,
}) => {
  const config = statusConfig[status] || statusConfig.unknown;
  const displayText = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono font-medium tracking-tight transition-colors",
        config.badgeBg,
        config.text,
        config.border,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className={cn("inline-flex h-full w-full rounded-full", config.dotBg)} />
      </span>
      {displayText}
    </span>
  );
};
