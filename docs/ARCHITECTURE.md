# RentSphere Architecture

## Overview

RentSphere is a real-estate rental marketplace built with a microservices architecture. The system consists of:

- **Angular Frontend** — Single-page application with role-based dashboards
- **API Gateway** — Single entry point routing requests to internal services
- **Microservices** — 13 domain-specific Spring Boot services
- **PostgreSQL** — One database per service
- **Redis** — Caching, rate-limiting, token blacklist
- **Redpanda (Kafka-compatible)** — Async event-driven communication

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular SPA (Port 4200)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Port 8080)                    │
│     ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐  │
│     │ Routing │ │   CORS   │ │  Logging   │ │ Rate-Lim │  │
│     └─────────┘ └──────────┘ └────────────┘ └──────────┘  │
└──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┘
   │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │
   ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
  ┌───────────────────────────────────────────────────────────┐
  │                     Microservices                         │
  │  auth  user  listing  media  ai-review  moderation        │
  │  verification  search  booking  payment  chat             │
  │  notification  audit                                      │
  └───────────────────────────────────────────────────────────┘
       │              │                              │
       ▼              ▼                              ▼
  ┌────────┐   ┌──────────┐                  ┌──────────────┐
  │PostgreSQL│  │  Redis   │                  │  Redpanda    │
  │ per svc │   │  Cache   │                  │ (Kafka)      │
  └────────┘   └──────────┘                  └──────────────┘
```

## Key Principles

1. **Database per service** — Each service owns its own database and schema.
2. **REST for sync** — Services communicate via REST for synchronous operations.
3. **Kafka for async** — Events are published to Kafka for cross-service workflows.
4. **Gateway as entry** — All external requests go through the API Gateway.
5. **JWT auth** — Authentication and authorization are handled via JWT tokens.
6. **Flyway migrations** — All database schema changes are versioned with Flyway.
