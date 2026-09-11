import React from "react";
import { AIToolCall } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Wrench, CheckCircle2, Clock, Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIToolExecutionTracesProps {
  toolCalls: AIToolCall[];
}

export const AIToolExecutionTraces: React.FC<AIToolExecutionTracesProps> = ({ toolCalls }) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Wrench className="h-4 w-4 text-emerald-400" />
          AI Agent Tool Execution Traces ({toolCalls.length} Executions)
        </CardTitle>
        <CardDescription>Auditable log of autonomous tool invocations and evidence responses</CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono text-xs">
        {toolCalls.map((tc) => (
          <div
            key={tc.id}
            className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-2 transition-colors hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-bold text-brand-light">
                  {tc.toolName}()
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {JSON.stringify(tc.args)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-400 font-mono">{tc.executionTimeMs}ms</span>
                <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 font-bold uppercase">
                  {tc.status}
                </span>
              </div>
            </div>

            <div className="rounded bg-slate-900/90 p-2.5 border border-slate-800 text-slate-300 font-mono text-[11px]">
              <div className="flex items-center gap-1 text-slate-500 text-[10px] mb-1">
                <Terminal className="h-3 w-3" /> Result Payload Summary:
              </div>
              "{tc.resultSummary}"
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
