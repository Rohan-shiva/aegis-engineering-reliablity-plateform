import React from "react";
import { DeploymentChangedFile } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { FileCode, AlertTriangle, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentChangedFilesProps {
  files?: DeploymentChangedFile[];
}

export const DeploymentChangedFiles: React.FC<DeploymentChangedFilesProps> = ({ files = [] }) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <FileCode className="h-4 w-4 text-brand-light" />
          Changed Files Diff Audit ({files.length} Files Modified)
        </CardTitle>
        <CardDescription>Audited source files, migration scripts, and configuration changes</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {files.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-mono">
            No file diff breakdown recorded for this release artifact.
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase text-slate-400">
              <tr>
                <th className="px-4 py-2.5">File Path</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Additions</th>
                <th className="px-4 py-2.5">Deletions</th>
                <th className="px-4 py-2.5 text-right">Risk Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {files.map((file, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="px-4 py-2.5 font-bold text-slate-200 truncate max-w-xs">
                    {file.filename}
                  </td>
                  <td className="px-4 py-2.5 capitalize text-[10px]">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-bold",
                        file.status === "added" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40",
                        file.status === "modified" && "bg-blue-950 text-blue-300 border border-blue-800/40",
                        file.status === "deleted" && "bg-red-950 text-red-400 border border-red-800/40"
                      )}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-emerald-400 font-bold">
                    +{file.additions}
                  </td>
                  <td className="px-4 py-2.5 text-red-400 font-bold">
                    -{file.deletions}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {file.isHighRisk ? (
                      <span className="inline-flex items-center gap-1 rounded bg-red-950 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-800/40">
                        <AlertTriangle className="h-3 w-3" />
                        CRITICAL PATH
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">Standard</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
