import React from "react";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-800/80 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
      </div>
      <div className="divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between space-x-4">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-4 bg-slate-800 rounded w-1/5"></div>
            <div className="h-4 bg-slate-800 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
