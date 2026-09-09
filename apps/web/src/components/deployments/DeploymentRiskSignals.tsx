import React from "react";
import { DeploymentRiskSignal } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { AlertTriangle, Database, ShieldAlert, Cpu, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentRiskSignalsProps {
  signals?: DeploymentRiskSignal[];
  riskScore: number;
}

export const DeploymentRiskSignals: React.FC<DeploymentRiskSignalsProps> = ({
  signals = [],
  riskScore,
}) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          Deterministic Risk Signal Rationale ({signals.length} Signals)
        </CardTitle>
        <CardDescription>Weighted risk scoring signals evaluated before and during deployment</CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono text-xs">
        {signals.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 font-mono">
            No high-risk signal factors detected for this deployment change.
          </div>
        ) : (
          signals.map((sig) => (
            <div
              key={sig.id}
              className="flex items-start justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 transition-colors hover:border-slate-700"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{sig.title}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 uppercase">
                    [{sig.category}]
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{sig.description}</p>
              </div>

              <div className="rounded border border-red-900/40 bg-red-950/40 px-2.5 py-1 text-red-400 font-bold text-xs shrink-0 ml-3">
                +{sig.weight} pts
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
