import React from "react";
import { ShieldAlert, Search, Bell, ChevronDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiConnectionBadge } from "@/components/common/ApiConnectionBadge";

interface TopNavProps {
  onToggleMobileSidebar?: () => void;
  isLive?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleMobileSidebar, isLive = true }) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-surface/90 px-4 backdrop-blur-md">
      {/* Left section: Logo & Context Selectors */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:hidden"
          aria-label="Toggle mobile menu"
        >
          <Activity className="h-5 w-5" />
        </button>

        {/* Platform Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-indigo-600 shadow-md shadow-brand/20">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-wider text-slate-100 uppercase">
              AEGIS
            </span>
            <span className="text-[10px] font-mono text-slate-500">v0.1.0-alpha</span>
          </div>
        </div>

        <div className="hidden h-5 w-[1px] bg-slate-800 md:block" />

        {/* Organization / Project Selector */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors">
            <span className="h-2 w-2 rounded-full bg-brand-light" />
            <span className="font-mono font-medium">Acme Corp</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Core Services</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Center section: Global Command Search */}
      <div className="hidden flex-1 max-w-md mx-6 lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search services, incidents, deployments, postmortems... (Ctrl+K)"
            className="w-full rounded-md border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-12 text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none focus:ring-1 focus:ring-brand/60 transition-colors"
            readOnly
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section: Environment status, API Connection Badge & User Profile */}
      <div className="flex items-center gap-3">
        <ApiConnectionBadge isLive={isLive} />

        {/* Environment Indicator */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-mono text-emerald-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PROD (us-east-1)</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative text-slate-400 hover:text-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand" />
        </Button>

        <div className="h-5 w-[1px] bg-slate-800" />

        {/* User Badge */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200">
            SE
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-medium text-slate-200">Sr. Engineer</span>
            <span className="text-[10px] text-slate-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
