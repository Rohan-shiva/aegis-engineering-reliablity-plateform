# WebSocket Real-Time Event Streaming Architecture

This document details the real-time event streaming architecture for the **Aegis** platform (`apps/api/src/websocket` & `apps/web/src/lib/websocket-client.ts`), including message schemas, channel topics, auto-reconnect strategy, and fallback simulation tickers.

---

## 1. Overview & Pub/Sub Topology

```
┌───────────────────────────┐                ┌───────────────────────────┐
│     Express API Server    │                │      Next.js Web UI       │
│     (apps/api /ws)        │  WebSocket     │      (apps/web Client)    │
│                           │ <============> │                           │
│  - AegisWsServer          │   (ws://)      │  - AegisWsClient          │
│  - telemetryTicker (3s)   │                │  - useRealtimeEvents()    │
└───────────────────────────┘                └───────────────────────────┘
```

---

## 2. Event Channel Schemas (`ws://localhost:4000/ws`)

### `telemetry:tick` Payload
Emitted every 3 seconds containing live system metrics:

```json
{
  "type": "telemetry:tick",
  "data": {
    "timestamp": "14:32:05",
    "requestVolume": 4350,
    "p99LatencyMs": 62,
    "errorRate": 0.24,
    "activeIncidentsCount": 2
  },
  "timestamp": "2026-09-15T00:35:00.000Z"
}
```

### `incident:alert` Payload
Broadcast upon declaration of high-severity incidents:

```json
{
  "type": "incident:alert",
  "data": {
    "code": "INC-8492",
    "severity": "SEV1",
    "title": "Payment Checkout 500 Spike",
    "status": "investigating"
  },
  "timestamp": "2026-09-15T00:35:00.000Z"
}
```

---

## 3. Client Auto-Reconnect & Fallback Ticker

1. **Active Connection**: Client establishes WebSocket channel to `ws://localhost:4000/ws`. Status rendered as `WS Streaming` (Cyan badge).
2. **Disconnect Handling**: If server closes or network drops, client triggers exponential backoff reconnection attempts ($1\text{s}, 2\text{s}, 4\text{s}, 8\text{s}, 10\text{s}$).
3. **Simulated Fallback Mode**: Client engages internal fallback ticker emitting `telemetry:tick` messages, ensuring smooth UI sparklines and zero blank states. Status rendered as `WS Simulated` (Amber badge).
