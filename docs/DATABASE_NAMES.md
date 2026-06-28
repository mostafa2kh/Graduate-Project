# RentSphere Database Names

Each microservice owns its own PostgreSQL database. No service accesses another service's database directly.

## Database Map

| Service | Database Name | Owner |
|---------|---------------|-------|
| Auth Service | `rentsphere_auth_db` | auth-service |
| User Service | `rentsphere_user_db` | user-service |
| Listing Service | `rentsphere_listing_db` | listing-service |
| Media Service | `rentsphere_media_db` | media-service |
| AI Review Service | `rentsphere_ai_review_db` | ai-review-service |
| Moderation Service | `rentsphere_moderation_db` | moderation-service |
| Verification Service | `rentsphere_verification_db` | verification-service |
| Search Service | `rentsphere_search_db` | search-service |
| Booking Service | `rentsphere_booking_db` | booking-service |
| Payment Service | `rentsphere_payment_db` | payment-service |
| Chat Service | `rentsphere_chat_db` | chat-service |
| Notification Service | `rentsphere_notification_db` | notification-service |
| Audit Service | `rentsphere_audit_db` | audit-service |

## Convention

- All database names use `snake_case`.
- All databases are created via Docker Compose initialization scripts.
- In production, databases should be created with appropriate users and permissions.
- Flyway manages schema migrations inside each service.
