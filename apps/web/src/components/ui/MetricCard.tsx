import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  subtitle,
  icon: Icon,
  iconColor = "text-brand-light",
  className,
}) => {
  return (
    <Card className={cn("p-4 relative overflow-hidden transition-all hover:border-slate-700/80", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-slate-50">
              {value}
            </span>
          </div>
        </div>

        {Icon && (
          <div className={cn("rounded-md border border-slate-800 bg-slate-900/60 p-2", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-mono font-medium",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-slate-400"
              )}
            >
              {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
              {changeType === "negative" && <TrendingDown className="h-3 w-3" />}
              {changeType === "neutral" && <Minus className="h-3 w-3" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 font-sans">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
