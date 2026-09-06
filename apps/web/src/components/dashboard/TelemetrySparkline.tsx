import React from "react";
import { TelemetryDatapoint } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TelemetrySparklineProps {
  data: TelemetryDatapoint[];
  title?: string;
  metricType?: "errorRate" | "p99LatencyMs";
  className?: string;
}

export const TelemetrySparkline: React.FC<TelemetrySparklineProps> = ({
  data,
  title = "Telemetry Trend (24h)",
  metricType = "errorRate",
  className,
}) => {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => (metricType === "errorRate" ? d.errorRate : d.p99LatencyMs));
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);

  // SVG dimensions
  const width = 300;
  const height = 60;

  // Calculate SVG points
  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const normalizedY = (val - minValue) / (maxValue - minValue || 1);
      const y = height - normalizedY * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  const latestValue = values[values.length - 1];
  const isAnomaly = metricType === "errorRate" ? latestValue > 2.0 : latestValue > 500;

  return (
    <Card variant="bordered" className={cn("bg-slate-900/50", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-mono flex items-center gap-2 text-slate-300">
            <Activity className={cn("h-3.5 w-3.5", isAnomaly ? "text-red-400" : "text-brand-light")} />
            {title}
          </CardTitle>
          <span
            className={cn(
              "font-mono text-xs font-bold",
              isAnomaly ? "text-red-400" : "text-emerald-400"
            )}
          >
            {metricType === "errorRate" ? `${latestValue.toFixed(2)}%` : `${latestValue}ms`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <div className="relative w-full h-16 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            {/* Grid lines */}
            <line x1="0" y1="0" x2={width} y2="0" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1={height} x2={width} y2={height} stroke="#1e293b" />

            {/* Sparkline path */}
            <polyline
              fill="none"
              stroke={isAnomaly ? "#ef4444" : "#3b82f6"}
              strokeWidth="2"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
          <span>{data[0]?.timestamp}</span>
          <span>Max: {metricType === "errorRate" ? `${maxValue.toFixed(1)}%` : `${maxValue}ms`}</span>
          <span>{data[data.length - 1]?.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );
};
