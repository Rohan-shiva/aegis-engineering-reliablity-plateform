import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-800 rounded w-1/3"></div>
        <div className="h-5 bg-slate-800 rounded w-16"></div>
      </div>
      <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
      <div className="h-4 bg-slate-800/40 rounded w-4/6"></div>
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-24"></div>
        <div className="h-4 bg-slate-800 rounded w-20"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
