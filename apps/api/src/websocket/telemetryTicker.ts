import { AegisWsServer } from "./wsServer";

let tickerInterval: NodeJS.Timeout | null = null;

export function startTelemetryTicker(intervalMs = 3000): void {
  if (tickerInterval) return;

  console.log(`[Aegis Telemetry] Starting realtime background ticker (${intervalMs}ms interval)`);

  tickerInterval = setInterval(() => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    // Generate realistic fluctuating metrics
    const baseRps = 4200;
    const rpsFluc = Math.floor((Math.random() - 0.5) * 400);
    const p99LatencyMs = Math.floor(45 + Math.random() * 85);
    const errorRate = Number((0.15 + Math.random() * 0.45).toFixed(2));

    const tickData = {
      timestamp: timeStr,
      requestVolume: baseRps + rpsFluc,
      p99LatencyMs,
      errorRate,
      activeIncidentsCount: 2,
    };

    AegisWsServer.broadcast("telemetry:tick", tickData);
  }, intervalMs);
}

export function stopTelemetryTicker(): void {
  if (tickerInterval) {
    clearInterval(tickerInterval);
    tickerInterval = null;
  }
}
