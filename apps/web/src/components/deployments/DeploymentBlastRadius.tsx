import React from "react";
import Link from "next/link";
import { Deployment } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Network, Server, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentBlastRadiusProps {
  deployment: Deployment;
}

export const DeploymentBlastRadius: React.FC<DeploymentBlastRadiusProps> = ({ deployment }) => {
  const isHighRisk = deployment.riskLevel === "HIGH";

  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Network className="h-4 w-4 text-brand-light" />
          Deployment Blast Radius & Service Impact
        </CardTitle>
        <CardDescription>Estimated potential outage blast radius across dependency graph nodes</CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono text-xs">
        {/* Target Service Box */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
            Direct Target Deployment Node
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-brand-light" />
              <span className="font-bold text-slate-100 text-sm">{deployment.serviceName}</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {deployment.environment}
              </span>
            </div>
            <Link href={`/services/${deployment.serviceId}`} className="text-xs text-brand-light hover:underline">
              Service View →
            </Link>
          </div>
        </div>

        {/* Downstream Impact Alert */}
        <div
          className={cn(
            "rounded-lg border p-3.5 space-y-2",
            isHighRisk ? "border-red-900/50 bg-red-950/20" : "border-slate-800 bg-slate-900/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Downstream Dependent Microservices ({deployment.affectedServicesCount || 1})
            </span>
            {isHighRisk && (
              <span className="rounded bg-red-950 border border-red-800 px-2 py-0.5 text-[10px] font-bold text-red-400">
                HIGH CASCADE RISK
              </span>
            )}
          </div>

          <p className="text-slate-300 font-sans text-xs">
            Changes to <strong className="text-slate-100 font-mono">{deployment.serviceName}</strong> affect checkout workflows in <code className="text-brand-light">order-processor</code> and authentication verification in <code className="text-brand-light">auth-service</code>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
