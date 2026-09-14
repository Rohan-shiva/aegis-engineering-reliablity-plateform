import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

export interface WsMessagePayload {
  type: string;
  data: any;
  timestamp: string;
}

export class AegisWsServer {
  private static wss: WebSocketServer | null = null;
  private static clients: Set<WebSocket> = new Set();

  public static initialize(server: HttpServer): WebSocketServer {
    if (this.wss) return this.wss;

    this.wss = new WebSocketServer({ server, path: "/ws" });

    this.wss.on("connection", (ws: WebSocket) => {
      this.clients.add(ws);
      console.log(`[Aegis WS] Client connected (Total active: ${this.clients.size})`);

      // Send initial welcome message
      const welcomeMsg: WsMessagePayload = {
        type: "system:connected",
        data: { status: "ready", activeClients: this.clients.size },
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(welcomeMsg));

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log(`[Aegis WS] Client disconnected (Total active: ${this.clients.size})`);
      });

      ws.on("error", (err) => {
        console.error("[Aegis WS Client Error]:", err);
      });
    });

    console.log("[Aegis WS] WebSocket server initialized on path /ws");
    return this.wss;
  }

  public static broadcast(type: string, data: any): void {
    if (!this.wss || this.clients.size === 0) return;

    const payload: WsMessagePayload = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(payload);

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonStr);
      }
    }
  }
}
