# API Gateway

Single entry point for the RentSphere Angular frontend. Routes requests to internal microservices.

**Port:** 8080 | **Database:** None | **Stack:** Spring Cloud Gateway 4 + WebFlux

## Responsibilities

- Route requests to internal services via path-based routing
- CORS configuration for Angular dev server (http://localhost:4200)
- Request logging with correlation IDs
- Centralized health endpoint
- Swagger documentation index page
- Rate-limit placeholder (Redis-backed — deferred)

## Route Table

| Gateway Path | Target Service |
|--------------|----------------|
| `/api/auth/**` | auth-service (8081) |
| `/api/users/**` | user-service (8082) |
| `/api/listings/**` | listing-service (8083) |
| `/api/media/**` | media-service (8084) |
| `/api/ai-review/**` | ai-review-service (8085) |
| `/api/admin/**` | moderation-service (8086) |
| `/api/verification/**` | verification-service (8087) |
| `/api/search/**` | search-service (8088) |
| `/api/bookings/**` | booking-service (8089) |
| `/api/payments/**` | payment-service (8090) |
| `/api/chat/**` | chat-service (8091) |
| `/api/notifications/**` | notification-service (8092) |
| `/api/admin/audit/**` | audit-service (8093) |

## How to Run

```bash
cd backend/api-gateway
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Requires: Java 21+, Maven 3.8+

## API Standards

All responses follow the format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "timestamp": "2026-06-26T12:00:00Z",
  "path": "/api/gateway/health"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "details": [{"field": "email", "message": "Email is required"}],
  "timestamp": "2026-06-26T12:00:00Z",
  "path": "/api/auth/register"
}
```

## Endpoints

- `GET /actuator/health` — Actuator health check
- `GET /api/gateway/health` — Custom gateway health response
- `GET /swagger` — Swagger documentation index
