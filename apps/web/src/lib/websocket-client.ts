export type WsConnectionStatus = "connecting" | "connected" | "disconnected" | "fallback";

export interface WsMessage {
  type: string;
  data: any;
  timestamp: string;
}

export type WsListener = (msg: WsMessage) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/ws";

export class AegisWsClient {
  private static instance: AegisWsClient | null = null;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<WsListener>> = new Map();
  private statusListeners: Set<(status: WsConnectionStatus) => void> = new Set();
  private status: WsConnectionStatus = "disconnected";
  private fallbackInterval: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    this.connect();
  }

  public static getInstance(): AegisWsClient {
    if (!AegisWsClient.instance) {
      AegisWsClient.instance = new AegisWsClient();
    }
    return AegisWsClient.instance;
  }

  public connect(): void {
    if (typeof window === "undefined") return;
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) return;

    this.setStatus("connecting");

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("[Aegis WS Client] Connected to live WebSocket server at", WS_URL);
        this.reconnectAttempts = 0;
        this.stopFallbackTicker();
        this.setStatus("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const payload: WsMessage = JSON.parse(event.data);
          this.emit(payload.type, payload);
        } catch (e) {
          console.warn("[Aegis WS Client] Failed to parse message:", event.data);
        }
      };

      this.ws.onerror = () => {
        console.info("[Aegis WS Client] Unable to establish WebSocket link to server. Engaging fallback ticker.");
        this.handleDisconnect();
      };

      this.ws.onclose = () => {
        this.handleDisconnect();
      };
    } catch (e) {
      this.handleDisconnect();
    }
  }

  private handleDisconnect(): void {
    this.ws = null;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      setTimeout(() => this.connect(), delay);
    }

    this.setStatus("fallback");
    this.startFallbackTicker();
  }

  private startFallbackTicker(): void {
    if (this.fallbackInterval) return;

    this.fallbackInterval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const fallbackMsg: WsMessage = {
        type: "telemetry:tick",
        data: {
          timestamp: timeStr,
          requestVolume: 4120 + Math.floor((Math.random() - 0.5) * 300),
          p99LatencyMs: 48 + Math.floor(Math.random() * 40),
          errorRate: Number((0.18 + Math.random() * 0.2).toFixed(2)),
          activeIncidentsCount: 2,
        },
        timestamp: now.toISOString(),
      };
      this.emit("telemetry:tick", fallbackMsg);
    }, 3000);
  }

  private stopFallbackTicker(): void {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  private setStatus(newStatus: WsConnectionStatus): void {
    this.status = newStatus;
    for (const listener of this.statusListeners) {
      listener(newStatus);
    }
  }

  public getStatus(): WsConnectionStatus {
    return this.status;
  }

  public onStatusChange(listener: (status: WsConnectionStatus) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  public subscribe(eventType: string, listener: WsListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(listener);
        if (set.size === 0) this.listeners.delete(eventType);
      }
    };
  }

  private emit(eventType: string, payload: WsMessage): void {
    const set = this.listeners.get(eventType);
    if (set) {
      for (const listener of set) {
        listener(payload);
      }
    }
  }
}
