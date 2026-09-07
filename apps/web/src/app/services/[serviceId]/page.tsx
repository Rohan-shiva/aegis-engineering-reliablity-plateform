"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceOverviewTab } from "@/components/services/ServiceOverviewTab";
import { ServiceDependenciesTab } from "@/components/services/ServiceDependenciesTab";
import { ServiceHistoryTab } from "@/components/services/ServiceHistoryTab";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { MOCK_SERVICES } from "@/mocks";
import {
  Server,
  ArrowLeft,
  GitBranch,
  RotateCcw,
  ExternalLink,
  Activity,
  Network,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceDetailPageProps {
  params: {
    serviceId: string;
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = MOCK_SERVICES.find(
    (s) => s.id === params.serviceId || s.name === params.serviceId
  );

  const [activeTab, setActiveTab] = useState<"overview" | "dependencies" | "history">("overview");

  if (!service) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-lg">
          <Server className="h-10 w-10 text-slate-600 mb-2" />
          <h2 className="font-mono text-base font-bold text-slate-200">Service Not Found</h2>
          <p className="font-mono text-xs text-slate-400 mt-1 mb-4">
            No registered microservice matches ID "{params.serviceId}".
          </p>
          <Link href="/services">
            <Button variant="secondary" size="sm" className="gap-1 font-mono">
              <ArrowLeft className="h-4 w-4" /> Return to Service Catalog
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* 1. Header Navigation & Back Breadcrumb */}
      <div className="space-y-4 border-b border-slate-800/80 pb-5">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Service Catalog</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-brand-light">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-mono text-xl font-bold text-slate-100">{service.name}</h1>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {service.environment}
                  </span>
                  <StatusBadge status={service.status} size="sm" />
                </div>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{service.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href={service.repositoryUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 font-mono">
                <GitBranch className="h-3.5 w-3.5 text-slate-400" />
                <span>Repository</span>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </Button>
            </a>

            {service.status === "critical" && (
              <Button variant="danger" size="sm" className="gap-1.5 font-mono">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Quick Rollback</span>
              </Button>
            )}
          </div>
        </div>

        {/* 2. Detail Tabs */}
        <div className="flex items-center gap-1 border-t border-slate-800/60 pt-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "overview"
                ? "bg-slate-800 text-brand-light font-bold border border-slate-700/60"
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Overview & Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab("dependencies")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "dependencies"
                ? "bg-slate-800 text-brand-light font-bold border border-slate-700/60"
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Dependencies Topology</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "history"
                ? "bg-slate-800 text-brand-light font-bold border border-slate-700/60"
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Deployments & Incidents</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Body Content */}
      <div className="pt-2">
        {activeTab === "overview" && <ServiceOverviewTab service={service} />}
        {activeTab === "dependencies" && <ServiceDependenciesTab service={service} />}
        {activeTab === "history" && <ServiceHistoryTab service={service} />}
      </div>
    </AppShell>
  );
}
