# RentSphere 🏠

A production-style real-estate rental marketplace built with **Spring Boot 3 microservices**, **Angular 17+**, and **Docker**.

Built for Menoufia University — Faculty of Engineering, Communications and Electronics Engineering Department.

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@rentsphere.com` | `password123` |
| Landlord | `landlord@rentsphere.com` | `password123` |
| Renter | `renter@rentsphere.com` | `password123` |

---

## Architecture

```
┌──────────────────────────────────────────┐
│         Angular SPA (port 4200)          │
│       served via Nginx (port 80)         │
└──────────────────┬───────────────────────┘
                   │ REST / WebSocket
┌──────────────────▼───────────────────────┐
│         API Gateway (port 8080)           │
│  Spring Cloud Gateway — route, filter     │
└──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┘
  │  │  │  │  │  │  │  │  │  │  │  │  │
  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
 14 Spring Boot 3 Microservices (8081-8093)
         Each with its own DB
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 17+, TypeScript, SCSS, RxJS, standalone components |
| **Backend** | Java 21, Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 16 (1 database per microservice) |
| **Cache** | Redis 7 |
| **Events** | Redpanda (Kafka-compatible broker) |
| **Migrations** | Flyway |
| **API Docs** | Swagger UI / OpenAPI 3 |
| **Auth** | JWT (HMAC-SHA, access tokens) |
| **Deployment** | Docker Compose, multi-stage Dockerfiles |
| **CI/CD** | GitHub Actions |

## Services Overview

| # | Service | Port | Database | Description |
|---|---------|------|----------|-------------|
| 1 | **api-gateway** | 8080 | — | Spring Cloud Gateway, CORS, correlation IDs |
| 2 | **auth-service** | 8081 | `rentsphere_auth_db` | JWT auth, roles (RENTER/LANDLORD/ADMIN) |
| 3 | **user-service** | 8082 | `rentsphere_user_db` | User profiles, preferences, favorites |
| 4 | **listing-service** | 8083 | `rentsphere_listing_db` | Listing CRUD, amenities, 6-step wizard |
| 5 | **media-service** | 8084 | `rentsphere_media_db` | Image upload, drag-and-drop, MD5 dedup |
| 6 | **ai-review-service** | 8085 | `rentsphere_ai_review_db` | Mock AI trust score (0-100) + flags |
| 7 | **moderation-service** | 8086 | `rentsphere_moderation_db` | Admin listing review, approve/reject |
| 8 | **verification-service** | 8087 | `rentsphere_verification_db` | KYC submissions, document upload |
| 9 | **search-service** | 8091 | `rentsphere_search_db` | Public search, PostgreSQL FTS |
| 10 | **booking-service** | 8092 | `rentsphere_booking_db` | Booking requests, overlap detection |
| 11 | **payment-service** | 8088 | `rentsphere_payment_db` | Mock payment (pi_mock_ IDs) |
| 12 | **chat-service** | 8090 | `rentsphere_chat_db` | REST chat, participant authorization |
| 13 | **notification-service** | 8089 | `rentsphere_notification_db` | In-app notifications, preferences |
| 14 | **audit-service** | 8093 | `rentsphere_audit_db` | Audit events, admin activity log |

## Frontend Routes

| Route | Feature | Access |
|-------|---------|--------|
| `/` | Home, hero, features | Public |
| `/search` | Public search with filters | Public |
| `/search/:id` | Public listing details | Public |
| `/login` | Login with role toggle | Public |
| `/register` | Register with role toggle | Public |
| `/profile` | User profile | Authenticated |
| `/settings` | Account settings | Authenticated |
| `/favorites` | Saved listings | Authenticated |
| `/verification` | KYC submission | Authenticated |
| `/dashboard/listings` | My listings | Landlord |
| `/dashboard/listings/create` | Create listing (6-step) | Landlord |
| `/dashboard/listings/:id` | Listing detail | Landlord |
| `/dashboard/bookings` | My bookings | Renter |
| `/dashboard/requests` | Booking requests | Landlord |
| `/dashboard/bookings/:id` | Booking detail | Both |
| `/dashboard/payments` | Payment history | Renter |
| `/dashboard/payments/:bookingId/checkout` | Mock checkout | Renter |
| `/dashboard/messages` | Chat inbox | Both |
| `/dashboard/messages/:threadId` | Chat thread | Both |
| `/dashboard/notifications` | All notifications | Both |
| `/admin/overview` | Dashboard stats | Admin |
| `/admin/listings` | Moderation queue | Admin |
| `/admin/listings/:id` | Listing review | Admin |
| `/admin/users` | User management | Admin |
| `/admin/kyc` | KYC submissions | Admin |
| `/admin/kyc/:id` | KYC review | Admin |
| `/admin/audit` | Audit log | Admin |
| `/admin/notifications` | Admin notifications | Admin |

## Quick Start

### Prerequisites
- Java 21+
- Node.js 20+
- Docker & Docker Compose
- Angular CLI: `npm install -g @angular/cli`

### 1. Clone and configure
```bash
git clone <repo-url> rentsphere
cd rentsphere
cp .env.example .env
```

### 2. Start infrastructure
```bash
docker compose up -d
```
Starts PostgreSQL, Redis, Redpanda + Console.

### 3. Start all backend services
```bash
# Option A: Run individual services
cd backend/<service-name>
./mvnw spring-boot:run

# Option B: Run via Docker Compose (production)
docker compose -f docker-compose.prod.yml up -d
```

### 4. Start the frontend
```bash
cd frontend
npm install
ng serve
```
Opens at **http://localhost:4200**.

### 5. Seed data
The demo accounts and listings are created automatically via Flyway migrations on first startup:
- 3 demo users (admin, landlord, renter)
- 6 demo listings in major US cities
- 1 pending KYC submission for the renter

## Production Deployment

```bash
# Build and start the full stack
docker compose -f docker-compose.prod.yml up -d

# The frontend will be available at http://localhost
# API gateway at http://localhost:8080
```

## API Documentation (Swagger)

Each service exposes Swagger UI when running:

| Service | Swagger URL |
|---------|------------|
| API Gateway | http://localhost:8080/swagger-ui.html |
| Auth Service | http://localhost:8081/swagger-ui.html |
| Listing Service | http://localhost:8083/swagger-ui.html |
| *(replace port for each service)* | |

When running behind the gateway, use the gateway route path + `/swagger-ui.html`.

## Demo Flow (Graduation Presentation)

1. **Admin** logs in → shows dashboard stats, pending listings, recent activity
2. **Landlord** logs in → completes profile, creates listing with 6-step wizard
3. **Landlord** uploads images (drag-and-drop, up to 20)
4. **AI Review** generates mock trust score (0-100 ring gauge)
5. **Admin** reviews listing in moderation queue → approves
6. **Renter** searches (city, type, price, bedrooms filters) → opens listing
7. **Renter** requests booking → **Landlord** accepts
8. **Renter** completes mock payment (`pi_mock_` ID)
9. **Renter + Landlord** exchange chat messages
10. **Notifications** appear for booking, payment, chat events
11. **Admin** opens audit log → sees all recorded actions
12. **Docker Compose** shows the full 20-container deployment

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | rentsphere | PostgreSQL username |
| `POSTGRES_PASSWORD` | rentsphere | PostgreSQL password |
| `DB_PORT` | 5432 | PostgreSQL host port |
| `REDIS_PORT` | 6379 | Redis host port |
| `REDPANDA_PORT` | 9092 | Kafka broker host port |
| `GATEWAY_PORT` | 8080 | API Gateway host port |
| `JWT_SECRET` | (see `.env.example`) | HMAC-SHA key for JWT signing |
| `JWT_ACCESS_TOKEN_MINUTES` | 30 | Token expiry in minutes |
| `CORS_ALLOWED_ORIGINS` | http://localhost:4200 | CORS origins |

## Key Design Decisions

- **Each service owns its own database** — no cross-service DB queries
- **JWT secret shared** across all services via config property
- **Gateway routes** all `/api/**` with `StripPrefix=1`
- **Files stored locally** with UUID names, MD5 dedup, path traversal prevention
- **AI review is mocked** (base 60 ± random 31, clamped 0-100)
- **Payment is mocked** with `STRIPE_MOCK` provider, `pi_mock_` transaction IDs
- **Chat is REST-based** with participant authorization; WebSocket planned post-MVP
- **Search uses PostgreSQL FTS** with GIN indexes; OpenSearch planned post-MVP

## Known Limitations (Graduation Demo)

| Limitation | Post-MVP Plan |
|-----------|--------------|
| AI trust score is mocked | Real ML model integration |
| Payment is mocked (no real charges) | Stripe Connect integration |
| Email/SMS notifications are not implemented | SendGrid / Twilio integration |
| Chat is REST-only (polling) | WebSocket for real-time |
| Search is basic PostgreSQL FTS | Elasticsearch / OpenSearch |
| Media stored on local filesystem | S3 / Cloudinary |
| Kafka events are defined but not fully wired | Full event-driven workflows |
| No rate limiting or circuit breakers | Resilience4j |
| No integration tests | Full test suite |

## Backup

```bash
# Backup all databases
./scripts/backup.sh

# Restore a single database
pg_restore -h localhost -U rentsphere -d rentsphere_auth_db backups/rentsphere_auth_db_20250101_120000.dump
```

## CI/CD

The repository includes GitHub Actions workflows:
- **Backend**: Matrix build of all 14 services (JDK 21)
- **Frontend**: Angular production build (Node 20)
- **Docker**: Image builds on main branch

## Project Structure

```
├── backend/                    # 14 Spring Boot microservices
├── frontend/                   # Angular 17+ SPA
├── infra/                      # Docker, init scripts
│   └── postgres/init/          # Database creation scripts
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
│   └── backup.sh              # Database backup
├── .github/workflows/          # CI/CD pipelines
├── docker-compose.yml          # Infrastructure services
├── docker-compose.prod.yml     # Full production stack
└── .env.example                # Environment template
```
