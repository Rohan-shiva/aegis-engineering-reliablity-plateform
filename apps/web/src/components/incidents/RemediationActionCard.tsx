"use client";

import React, { useState } from "react";
import { RemediationAction } from "@aegis/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Terminal,
  Activity,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RemediationActionCardProps {
  action: RemediationAction;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onExecute: (id: string) => Promise<void>;
}

export const RemediationActionCard: React.FC<RemediationActionCardProps> = ({
  action,
  onApprove,
  onReject,
  onExecute,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(action.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(action.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = async () => {
    setIsProcessing(true);
    try {
      await onExecute(action.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    switch (action.status) {
      case "pending_approval":
        return (
          <span className="rounded bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            Pending Engineer Approval
          </span>
        );
      case "approved":
        return (
          <span className="rounded bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            Approved — Ready to Execute
          </span>
        );
      case "executing":
        return (
          <span className="rounded bg-brand/20 border border-brand/40 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-light uppercase flex items-center gap-1 animate-pulse">
            <Activity className="h-3 w-3 animate-spin" />
            Executing Playbook...
          </span>
        );
      case "completed":
        return (
          <span className="rounded bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Mitigation Completed
          </span>
        );
      case "rejected":
        return (
          <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <XCircle className="h-3 w-3 text-slate-500" />
            Action Rejected
          </span>
        );
      default:
        return (
          <span className="rounded bg-red-950/80 border border-red-800/80 px-2 py-0.5 font-mono text-[10px] font-bold text-red-400 uppercase">
            Failed
          </span>
        );
    }
  };

  const getRiskBadge = () => {
    const isHigh = action.riskLevel === "HIGH" || action.riskLevel === "CRITICAL";
    return (
      <span
        className={cn(
          "px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border",
          isHigh
            ? "bg-red-950/60 border-red-800/60 text-red-400"
            : "bg-slate-800 border-slate-700 text-slate-300"
        )}
      >
        {action.riskLevel} Risk
      </span>
    );
  };

  return (
    <Card
      variant="bordered"
      className={cn(
        "p-4 bg-slate-950/90 transition-all border-slate-800",
        action.status === "pending_approval" && "border-amber-500/40 bg-amber-950/10"
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-brand" />
            <span className="font-mono text-xs font-bold text-slate-200">
              REMEDIATION PLAYBOOK #{action.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getRiskBadge()}
            {getStatusBadge()}
          </div>
        </div>

        {/* Action Description */}
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100">{action.title}</h3>
          <p className="font-mono text-xs text-slate-400 mt-1">{action.description}</p>
        </div>

        {/* Safety Guardrail Alert Box for Pending Actions */}
        {action.status === "pending_approval" && (
          <div className="rounded-md border border-amber-800/50 bg-amber-950/40 p-3 font-mono text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block">Safety Guardrail Intercept</span>
              High-risk mitigation action on microservice <code className="bg-amber-900/60 px-1 py-0.5 rounded text-amber-100">{action.serviceName}</code> requires explicit engineer authorization before execution.
            </div>
          </div>
        )}

        {/* Approved Metadata Bar */}
        {action.approvedBy && (
          <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>Authorized by: <strong className="text-slate-200">{action.approvedBy}</strong></span>
          </div>
        )}

        {/* Interactive Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="font-mono text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-slate-500" />
            <span>Execution Logs ({action.logs.length})</span>
            {showLogs ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <div className="flex items-center gap-2">
            {action.status === "pending_approval" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="font-mono text-xs text-slate-400 hover:text-red-400"
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="gap-1.5 font-mono"
                >
                  {isProcessing ? (
                    <Activity className="h-3.5 w-3.5 animate-spin text-brand" />
                  ) : (
                    <UserCheck className="h-3.5 w-3.5" />
                  )}
                  <span>Approve Action</span>
                </Button>
              </>
            )}

            {action.status === "approved" && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecute}
                disabled={isProcessing}
                className="gap-1.5 font-mono bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
              >
                {isProcessing ? (
                  <Activity className="h-3.5 w-3.5 animate-spin text-white" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                <span>Execute Playbook</span>
              </Button>
            )}

            {action.status === "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExecute}
                disabled={isProcessing}
                className="gap-1.5 font-mono text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>Re-trigger Playbook</span>
              </Button>
            )}
          </div>
        </div>

        {/* Execution Log Console Drawer */}
        {showLogs && (
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
              Playbook Console Logs:
            </div>
            {action.logs.map((line, idx) => (
              <div key={idx} className="font-mono leading-relaxed">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
