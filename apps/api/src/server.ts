import http from "http";
import { createApp } from "./app";
import { config } from "./config/env";
import { AegisWsServer } from "./websocket/wsServer";
import { startTelemetryTicker } from "./websocket/telemetryTicker";

const app = createApp();
const server = http.createServer(app);

// Initialize WebSocket server
AegisWsServer.initialize(server);

// Start background realtime telemetry ticker
startTelemetryTicker();

server.listen(config.port, () => {
  console.log(`[Aegis API] Server running on http://localhost:${config.port} (${config.nodeEnv})`);
  console.log(`[Aegis WS] WebSocket endpoint available at ws://localhost:${config.port}/ws`);
});
