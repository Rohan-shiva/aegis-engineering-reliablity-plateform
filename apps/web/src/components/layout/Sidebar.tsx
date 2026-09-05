import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Server,
  GitCommit,
  AlertTriangle,
  BookOpen,
  Bot,
  Network,
  BarChart2,
  Settings,
  Activity,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Operations",
    items: [
      { name: "Overview", href: "/", icon: LayoutDashboard },
      { name: "Services", href: "/services", icon: Server, badge: "12" },
      { name: "Deployments", href: "/deployments", icon: GitCommit },
      { name: "Incidents", href: "/incidents", icon: AlertTriangle, badge: "2 Active", badgeColor: "bg-red-500/20 text-red-400 border-red-500/30" },
    ],
  },
  {
    title: "Intelligence & RAG",
    items: [
      { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
      { name: "AI Investigator", href: "/investigations", icon: Bot, badge: "AI", badgeColor: "bg-brand/20 text-brand-light border-brand/30" },
      { name: "Dependency Graph", href: "/graph", icon: Network },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Telemetry", href: "/analytics", icon: BarChart2 },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onItemClick }) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-[calc(100vh-3.5rem)] w-60 flex-col justify-between border-r border-slate-800 bg-surface/95 px-3 py-4 select-none shrink-0",
        className
      )}
    >
      <div className="space-y-6 overflow-y-auto pr-1">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h4 className="px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </h4>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-slate-800/90 text-white font-semibold shadow-inner border border-slate-700/50"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-brand-light" : "text-slate-500 group-hover:text-slate-300"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none",
                          item.badgeColor || "border-slate-700 bg-slate-800 text-slate-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* System Status Footer Box */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs font-medium text-slate-300">Aegis Engine</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">99.98%</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Telemetry Stream</span>
          <span className="text-slate-400">1.4k events/s</span>
        </div>
      </div>
    </aside>
  );
};
