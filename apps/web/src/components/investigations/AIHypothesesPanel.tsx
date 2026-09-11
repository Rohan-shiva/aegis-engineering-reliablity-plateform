import React from "react";
import { AIHypothesis } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Bot, CheckCircle2, ShieldAlert, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIHypothesesPanelProps {
  hypotheses: AIHypothesis[];
}

export const AIHypothesesPanel: React.FC<AIHypothesesPanelProps> = ({ hypotheses }) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-light" />
          Root Cause Hypotheses & Confidence Ratings ({hypotheses.length})
        </CardTitle>
        <CardDescription>
          Multi-agent evidence correlation ranking primary vs secondary root cause candidates
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono text-xs">
        {hypotheses.map((hyp) => (
          <div
            key={hyp.id}
            className={cn(
              "rounded-lg border p-4 transition-all space-y-3",
              hyp.isPrimary
                ? "border-brand/40 bg-brand/5 shadow-brand/5"
                : "border-slate-800 bg-slate-950/60"
            )}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs",
                    hyp.isPrimary
                      ? "bg-brand text-white"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  )}
                >
                  #{hyp.rank}
                </span>
                <span className="font-bold text-slate-100 text-sm">{hyp.title}</span>
              </div>

              <div className="flex items-center gap-2">
                {hyp.isPrimary && (
                  <span className="rounded bg-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand-light border border-brand/40">
                    PRIMARY CANDIDATE
                  </span>
                )}
                <span
                  className={cn(
                    "rounded border px-2.5 py-0.5 font-bold text-xs",
                    hyp.confidencePercentage > 75
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  )}
                >
                  {hyp.confidencePercentage}% Confidence
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed pl-8">
              {hyp.reasoningText}
            </p>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 pl-8">
              <span>Evidence Category: <strong className="text-slate-300">{hyp.evidenceCategory}</strong></span>
              <span className="text-brand-light">Validated by 4 tool calls</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
