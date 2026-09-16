"use client";

import React, { useState } from "react";
import { Sparkles, X, Bot, Activity, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TriggerInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger: (params: { targetIncidentCode: string; targetServiceName: string }) => Promise<void>;
}

export const TriggerInvestigationModal: React.FC<TriggerInvestigationModalProps> = ({
  isOpen,
  onClose,
  onTrigger,
}) => {
  const [incidentCode, setIncidentCode] = useState("INC-8092");
  const [serviceName, setServiceName] = useState("auth-identity-svc");
  const [isExecuting, setIsExecuting] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setCompleted(false);

    try {
      await onTrigger({ targetIncidentCode: incidentCode, targetServiceName: serviceName });
      setCompleted(true);
      setTimeout(() => {
        setIsExecuting(false);
        setCompleted(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-100"
          disabled={isExecuting}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-brand/10 border border-brand/30">
            <Bot className="h-6 w-6 text-brand" />
          </div>
          <div>
            <h2 className="font-mono text-base font-bold text-slate-100">Launch ReAct Agent Investigation</h2>
            <p className="font-mono text-xs text-slate-400">Multi-tool reasoning state machine</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs font-semibold text-slate-300 mb-1.5">
              Target Incident Code
            </label>
            <input
              type="text"
              value={incidentCode}
              onChange={(e) => setIncidentCode(e.target.value)}
              placeholder="e.g. INC-8092"
              required
              disabled={isExecuting}
              className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-200 focus:border-brand/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-semibold text-slate-300 mb-1.5">
              Target Microservice
            </label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              disabled={isExecuting}
              className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-200 focus:border-brand/60 focus:outline-none"
            >
              <option value="auth-identity-svc">auth-identity-svc</option>
              <option value="payment-checkout-svc">payment-checkout-svc</option>
              <option value="order-management-svc">order-management-svc</option>
              <option value="user-profile-svc">user-profile-svc</option>
              <option value="inventory-db-svc">inventory-db-svc</option>
              <option value="api-gateway">api-gateway</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isExecuting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isExecuting} className="gap-2 font-mono">
              {isExecuting ? (
                <>
                  <Activity className="h-4 w-4 animate-spin text-brand" />
                  <span>{completed ? "Investigation Finished!" : "Running ReAct Loop..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Start Agent Run</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
