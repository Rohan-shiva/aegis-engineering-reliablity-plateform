# Aegis Infrastructure & Docker Orchestration Guide

This directory contains containerization, environment configuration, and infrastructure orchestration assets for the **Aegis Engineering Reliability Platform**.

---

## 🐋 Docker Stack Components

- `api`: Express REST API & AegisWsServer WebSocket Broadcaster (Port 4000)
- `web`: Next.js 14 Production Web Dashboard (Port 3000)
- `redis`: Redis 7 Alpine cache & pub/sub event store (Port 6379)
- `qdrant`: Qdrant Vector Engine for 1536-dim RAG vector embeddings (Port 6333)

---

## ⚡ Quickstart Commands

### 1. Launch Local Infrastructure Stack
```bash
docker compose up -d --build
```

### 2. Verify Container Health
```bash
docker compose ps
```

### 3. Stream Container Logs
```bash
docker compose logs -f api
```

### 4. Stop Stack & Retain Volumes
```bash
docker compose down
```
