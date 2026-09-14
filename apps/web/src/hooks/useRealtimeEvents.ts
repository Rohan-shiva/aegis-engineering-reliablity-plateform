import { useState, useEffect } from "react";
import { AegisWsClient, WsConnectionStatus, WsMessage } from "@/lib/websocket-client";

export interface TelemetryTickData {
  timestamp: string;
  requestVolume: number;
  p99LatencyMs: number;
  errorRate: number;
  activeIncidentsCount: number;
}

export function useRealtimeEvents() {
  const [wsStatus, setWsStatus] = useState<WsConnectionStatus>("disconnected");
  const [latestTick, setLatestTick] = useState<TelemetryTickData | null>(null);
  const [eventsLog, setEventsLog] = useState<WsMessage[]>([]);

  useEffect(() => {
    const wsClient = AegisWsClient.getInstance();

    const unsubscribeStatus = wsClient.onStatusChange((status) => {
      setWsStatus(status);
    });

    const unsubscribeTick = wsClient.subscribe("telemetry:tick", (msg) => {
      setLatestTick(msg.data);
      setEventsLog((prev) => [msg, ...prev].slice(0, 20));
    });

    const unsubscribeIncident = wsClient.subscribe("incident:alert", (msg) => {
      setEventsLog((prev) => [msg, ...prev].slice(0, 20));
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTick();
      unsubscribeIncident();
    };
  }, []);

  return {
    wsStatus,
    isWsConnected: wsStatus === "connected",
    isFallback: wsStatus === "fallback",
    latestTick,
    eventsLog,
  };
}
