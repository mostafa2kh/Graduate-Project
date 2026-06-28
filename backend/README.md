# RentSphere Backend

This directory contains all backend microservices for the RentSphere platform.

## Architecture

- **API Gateway** — Single entry point routing to internal services
- **13 Microservices** — Each owns its own database and business domain
- **Technology:** Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Flyway

## Service List

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| api-gateway | 8080 | — | API gateway, routing, CORS, rate-limiting |
| auth-service | 8081 | rentsphere_auth_db | Authentication, JWT, roles |
| user-service | 8082 | rentsphere_user_db | User profiles, preferences |
| listing-service | 8083 | rentsphere_listing_db | Listing CRUD, amenities |
| media-service | 8084 | rentsphere_media_db | Image upload and management |
| ai-review-service | 8085 | rentsphere_ai_review_db | Mock AI trust scores |
| moderation-service | 8086 | rentsphere_moderation_db | Admin listing moderation |
| verification-service | 8087 | rentsphere_verification_db | KYC document verification |
| search-service | 8088 | rentsphere_search_db | Public listing search |
| booking-service | 8089 | rentsphere_booking_db | Booking requests and management |
| payment-service | 8090 | rentsphere_payment_db | Mock payment and escrow |
| chat-service | 8091 | rentsphere_chat_db | REST chat threads and messages |
| notification-service | 8092 | rentsphere_notification_db | In-app notifications |
| audit-service | 8093 | rentsphere_audit_db | Admin audit logs |

## How to Run

Each service is a Spring Boot application. To run a service:

```bash
cd backend/<service-name>
./mvnw spring-boot:run
```

Services will be generated as Spring Boot projects in their respective phases.
