"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AIHypothesesPanel } from "@/components/investigations/AIHypothesesPanel";
import { AIToolExecutionTraces } from "@/components/investigations/AIToolExecutionTraces";
import { AISidebarPanel } from "@/components/investigations/AISidebarPanel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_INVESTIGATIONS } from "@/mocks";
import {
  Bot,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  Brain,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestigationDetailPageProps {
  params: {
    investigationId: string;
  };
}

export default function InvestigationDetailPage({ params }: InvestigationDetailPageProps) {
  const inv = MOCK_INVESTIGATIONS.find(
    (i) => i.id === params.investigationId || i.id.toLowerCase() === params.investigationId.toLowerCase()
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!inv) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-lg">
          <Bot className="h-10 w-10 text-slate-600 mb-2" />
          <h2 className="font-mono text-base font-bold text-slate-200">Investigation Run Not Found</h2>
          <p className="font-mono text-xs text-slate-400 mt-1 mb-4">
            No AI agent investigation run matches ID "{params.investigationId}".
          </p>
          <Link href="/investigations">
            <Button variant="secondary" size="sm" className="gap-1 font-mono">
              <ArrowLeft className="h-4 w-4" /> Return to AI Investigations Catalog
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleRerun = () => {
    setToastMessage(`Triggered new AI Agent reasoning loop for ${inv.title}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-brand/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Back Breadcrumb */}
      <div className="space-y-4 border-b border-slate-800/80 pb-5">
        <Link
          href="/investigations"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to AI Investigations</span>
        </Link>

        {/* Title Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="rounded bg-brand/20 text-brand-light border border-brand/40 px-2 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1">
                <Bot className="h-3 w-3" />
                AI AGENT RUN #{inv.id}
              </span>

              {inv.targetIncidentCode && (
                <Link
                  href={`/incidents/${inv.targetIncidentCode.toLowerCase()}`}
                  className="rounded bg-red-950/80 border border-red-800/60 text-red-400 px-2 py-0.5 text-[10px] font-bold hover:underline flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Target: {inv.targetIncidentCode}
                </Link>
              )}
            </div>

            <h1 className="font-mono text-xl font-bold text-slate-100">{inv.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRerun} className="gap-1.5 font-mono">
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Re-run Agent</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Confidence Gauge & Planner Thought Bar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 pt-2">
        <Card variant="bordered" className="border-brand/40 bg-slate-900/60 p-4 font-mono">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Overall Confidence Score
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-light">{inv.confidenceScore}%</span>
            <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
              HIGH CONFIDENCE
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Supported by 4 tool execution traces</p>
        </Card>

        {/* Planner Thought Trace Box (3/4 width) */}
        <Card variant="default" className="lg:col-span-3 p-4 bg-slate-950/80 font-mono text-xs">
          <div className="flex items-center gap-2 font-bold text-brand-light text-xs mb-1.5">
            <Brain className="h-4 w-4 text-brand" />
            AI Agent Planner Internal Thought Trace:
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            "{inv.plannerThought}"
          </p>
        </Card>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-4">
        {/* Left Column (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          <AIHypothesesPanel hypotheses={inv.hypotheses} />
          <AIToolExecutionTraces toolCalls={inv.toolCalls} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          <AISidebarPanel recommendedActions={inv.recommendedActions} citations={inv.citations} />
        </div>
      </div>
    </AppShell>
  );
}
