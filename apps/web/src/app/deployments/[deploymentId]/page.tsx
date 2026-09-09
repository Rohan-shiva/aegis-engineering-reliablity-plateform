"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DeploymentRiskSignals } from "@/components/deployments/DeploymentRiskSignals";
import { DeploymentChangedFiles } from "@/components/deployments/DeploymentChangedFiles";
import { DeploymentBlastRadius } from "@/components/deployments/DeploymentBlastRadius";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_DEPLOYMENTS } from "@/mocks";
import { Deployment } from "@/types/domain";
import {
  GitCommit,
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentDetailPageProps {
  params: {
    deploymentId: string;
  };
}

export default function DeploymentDetailPage({ params }: DeploymentDetailPageProps) {
  const deployment = MOCK_DEPLOYMENTS.find(
    (d) => d.id === params.deploymentId || d.commitSha.toLowerCase() === params.deploymentId.toLowerCase()
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!deployment) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-lg">
          <GitCommit className="h-10 w-10 text-slate-600 mb-2" />
          <h2 className="font-mono text-base font-bold text-slate-200">Deployment Record Not Found</h2>
          <p className="font-mono text-xs text-slate-400 mt-1 mb-4">
            No deployment risk audit record matches ID "{params.deploymentId}".
          </p>
          <Link href="/deployments">
            <Button variant="secondary" size="sm" className="gap-1 font-mono">
              <ArrowLeft className="h-4 w-4" /> Return to Deployment Stream
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isHighRisk = deployment.riskLevel === "HIGH";
  const isMediumRisk = deployment.riskLevel === "MEDIUM";

  const handleRollback = () => {
    setToastMessage(`Initiated automated rollback for ${deployment.serviceName} to ${deployment.rollbackSha || "v2.4.1"}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppShell>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-brand/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Back Breadcrumb */}
      <div className="space-y-4 border-b border-slate-800/80 pb-5">
        <Link
          href="/deployments"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Deployment Stream</span>
        </Link>

        {/* Title Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="font-bold text-slate-100 text-lg">{deployment.serviceName}</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                {deployment.environment}
              </span>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-xs text-brand-light font-bold">
                [{deployment.commitSha}]
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">{deployment.commitMessage}</p>
          </div>

          <div className="flex items-center gap-2">
            {isHighRisk && (
              <Button variant="danger" size="sm" onClick={handleRollback} className="gap-1.5 font-mono">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Rollback Release</span>
              </Button>
            )}

            <a
              href={`https://github.com/aegis/${deployment.serviceName}/commit/${deployment.commitSha}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5 font-mono">
                <GitCommit className="h-3.5 w-3.5 text-slate-400" />
                <span>GitHub Commit</span>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Risk Score Gauge Card */}
      <Card
        variant="bordered"
        className={cn(
          "p-6 transition-all border font-mono",
          isHighRisk && "border-red-900/60 bg-red-950/20",
          isMediumRisk && "border-amber-900/50 bg-amber-950/15",
          !isHighRisk && !isMediumRisk && "border-emerald-900/40 bg-emerald-950/15"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Automated Deterministic Change Risk Score
            </span>
            <div className="flex items-baseline gap-3">
              <span
                className={cn(
                  "text-3xl font-extrabold tracking-tight",
                  isHighRisk && "text-red-400",
                  isMediumRisk && "text-amber-400",
                  !isHighRisk && !isMediumRisk && "text-emerald-400"
                )}
              >
                {deployment.riskScore} / 100
              </span>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 font-bold text-xs uppercase",
                  isHighRisk && "border-red-500/40 bg-red-500/10 text-red-400",
                  isMediumRisk && "border-amber-500/40 bg-amber-500/10 text-amber-400",
                  !isHighRisk && !isMediumRisk && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                )}
              >
                {deployment.riskLevel} RISK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Deployed By</span>
              <span className="text-slate-200 font-semibold">{deployment.author.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Deployed At</span>
              <span className="text-slate-200 font-semibold">{deployment.deployedAt}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Build Time</span>
              <span className="text-slate-200 font-semibold">{deployment.durationSeconds || 120}s</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
        {/* Left Column (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          <DeploymentRiskSignals signals={deployment.riskSignals} riskScore={deployment.riskScore} />
          <DeploymentChangedFiles files={deployment.changedFiles} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          <DeploymentBlastRadius deployment={deployment} />
        </div>
      </div>
    </AppShell>
  );
}
