"use client";

import React, { useState } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <TopNav onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile Slide-Over Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-50 flex w-72 flex-col bg-surface p-4 shadow-xl border-r border-slate-800">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-800">
                <span className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
                  AEGIS MENU
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar className="w-full h-full border-r-0 px-0" onItemClick={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950/40 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
