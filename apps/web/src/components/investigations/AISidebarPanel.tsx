import React from "react";
import Link from "next/link";
import { AISourceCitation } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ShieldCheck, BookOpen, GitCommit, FileText, ExternalLink, CheckCircle2 } from "lucide-react";

interface AISidebarPanelProps {
  recommendedActions?: string[];
  citations?: AISourceCitation[];
}

export const AISidebarPanel: React.FC<AISidebarPanelProps> = ({
  recommendedActions = [],
  citations = [],
}) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Recommended Actions Card */}
      <Card variant="default" className="border-emerald-900/40 bg-emerald-950/10">
        <CardHeader className="border-b border-emerald-900/30 pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Recommended Mitigation Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <ul className="space-y-2 text-xs font-sans text-slate-200">
            {recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Verifiable Source Citations Card */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-light" />
            Verifiable Evidence Citations ({citations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {citations.length === 0 ? (
            <div className="p-2 text-center text-xs text-slate-500 font-mono">
              No citation links generated yet.
            </div>
          ) : (
            citations.map((cit) => (
              <a
                key={cit.id}
                href={cit.url}
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 block truncate max-w-[200px]">
                    {cit.title}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    [{cit.type}] • {(cit.relevanceScore * 100).toFixed(0)}% match
                  </span>
                </div>
                <ExternalLink className="h-3 w-3 text-slate-500 shrink-0" />
              </a>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
