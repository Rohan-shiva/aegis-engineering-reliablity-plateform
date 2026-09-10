import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { FileText, Copy, Terminal } from "lucide-react";

interface DocumentContentViewerProps {
  contentMarkdown: string;
  title: string;
}

export const DocumentContentViewer: React.FC<DocumentContentViewerProps> = ({
  contentMarkdown,
  title,
}) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-light" />
            Markdown Source Content
          </CardTitle>
          <CardDescription>Rendered runbook markdown document source</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none font-sans text-xs leading-relaxed space-y-4 text-slate-200">
          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
            <code>{contentMarkdown}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
