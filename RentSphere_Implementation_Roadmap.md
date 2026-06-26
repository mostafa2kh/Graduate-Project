# RentSphere Implementation Roadmap

> Build-ready Markdown roadmap extracted from the uploaded project plan. Use this file as the source of truth to implement RentSphere phase by phase.

## 1. Project Summary
RentSphere is a real-estate rental marketplace graduation project for Menoufia University Engineering.
The system allows:
- Renters to search for rental properties, view details, book listings, chat with landlords, and receive notifications.
- Landlords to create listings, upload media, manage booking requests, and communicate with renters.
- Admins to moderate listings, review KYC submissions, manage users, inspect audit logs, and monitor platform activity.
- The platform to demonstrate modern software architecture using Spring Boot microservices, Angular, PostgreSQL, Kafka, Redis, Docker, and deployment-ready DevOps practices.
The goal is to build a realistic, professional, runnable graduation project without trying to build every advanced feature at once.
## 2. Final Architecture
### Frontend
- One Angular application.
- Role-based dashboards inside the same app.
- Public website for visitors and renters.
- Auth pages for login and registration.
- Landlord dashboard for listing, media, booking, and chat management.
- Renter dashboard for profile, favorites, bookings, payments, chat, and notifications.
- Admin dashboard for moderation, KYC, users, audit logs, and platform statistics.
- Angular Router for page routing.
- Reactive Forms for forms.
- RxJS for async flows.
- HTTP Interceptors for JWT handling and error handling.
- AuthGuard for authenticated routes.
- RoleGuard for admin, landlord, and renter access.
- Tailwind CSS or SCSS for responsive professional UI.
### API Gateway
- Single backend entry point for the Angular app.
- Routes requests to internal microservices.
- Handles CORS.
- Applies request logging.
- Adds rate-limit placeholder.
- Validates JWT at gateway level where appropriate.
- Forwards authenticated user claims to downstream services.
- Exposes centralized Swagger links or API documentation index.
### Backend Microservices
- api-gateway
- auth-service
- user-service
- listing-service
- media-service
- ai-review-service
- admin-moderation-service
- verification-service
- search-service
- booking-service
- payment-service
- chat-service
- notification-service
- audit-service
Each service owns its own database and communicates through REST or Kafka.
REST communication is used for:
- Direct user-facing actions.
- Synchronous validation.
- Querying current state when immediate response is required.
- Gateway-to-service traffic.
Kafka communication is used for:
- Listing submitted events.
- Listing approved or rejected events.
- User registered events.
- Booking created or updated events.
- Payment completed or failed events.
- Admin actions.
- Notification creation.
- Audit logging.
### Databases
Each service has a separate PostgreSQL database:
| Service | Database |
| --- | --- |
| Auth Service | rentsphere_auth_db |
| User Service | rentsphere_user_db |
| Listing Service | rentsphere_listing_db |
| Media Service | rentsphere_media_db |
| AI Review Service | rentsphere_ai_review_db |
| Admin Moderation Service | rentsphere_moderation_db |
| Verification Service | rentsphere_verification_db |
| Search Service | rentsphere_search_db |
| Booking Service | rentsphere_booking_db |
| Payment Service | rentsphere_payment_db |
| Chat Service | rentsphere_chat_db |
| Notification Service | rentsphere_notification_db |
| Audit Service | rentsphere_audit_db |
Flyway is used in every service for schema migrations.
### Kafka
Kafka is used for async communication where useful.
Main topics:
- user.registered
- profile.updated
- listing.created
- listing.submitted
- listing.reviewed
- listing.approved
- listing.rejected
- media.uploaded
- kyc.submitted
- kyc.approved
- kyc.rejected
- booking.requested
- booking.accepted
- booking.rejected
- payment.mock.completed
- chat.message.sent
- notification.requested
- audit.event.created
### Redis
Redis is used where useful, not everywhere by default.
Suggested usage:
- Gateway rate-limit placeholder.
- Token blacklist placeholder for logout.
- Temporary OTP or verification code placeholder.
- Short-lived cache for public listing/search responses.
- WebSocket session coordination placeholder.
### Search
Phase 10 starts with database search for realistic MVP delivery.
Post-MVP search can use Elasticsearch or OpenSearch.
Search evolution:
- MVP: PostgreSQL filtering and pagination.
- Improved: Database indexes and optimized queries.
- Post-MVP: OpenSearch indexing by consuming listing events from Kafka.
### Media Storage
MVP media storage:
- Local filesystem volume in Docker Compose.
- Metadata stored in media-service PostgreSQL database.
- Images linked to listings by listingId.
Post-MVP media storage:
- MinIO for S3-compatible local object storage.
- AWS S3 or Cloudinary for cloud deployment.
- CDN for production image delivery.
### Deployment
Local development:
- Docker Compose for PostgreSQL, Redis, Kafka, and services.
- Angular runs locally or through Docker.
- Swagger available per service.
Staging deployment:
- Docker Compose on VPS.
- Nginx reverse proxy.
- Environment variables managed through .env.
- PostgreSQL volumes and backup scripts.
Cloud option:
- Kubernetes or managed container service.
- Managed PostgreSQL.
- Managed Redis.
- Managed Kafka or Redpanda.
- S3-compatible object storage.
- GitHub Actions CI/CD.
## 3. Build Strategy
- Build the project phase by phase.
- Keep every phase runnable before moving to the next one.
- Start with infrastructure, routing, standards, and authentication.
- Build the frontend continuously instead of waiting until the backend is finished.
- Use mocked implementations for difficult integrations first.
- Replace mocks later with real implementations.
- Avoid building all microservices at once.
- Add automated tests gradually.
- Use database migrations from the beginning.
- Use Docker Compose early so deployment does not become a final-week problem.
- Keep the MVP focused on the graduation demo flow.
- Treat advanced features like real payments, AI model integration, OpenSearch, cloud storage, and Kubernetes as post-MVP unless time allows.
## 4. Global Standards
### API Response Format
All successful responses should follow:
{
"success": true,
"message": "Operation completed successfully",
"data": {},
"timestamp": "2026-06-26T12:00:00Z",
"path": "/api/listings"
}
For paginated responses:
{
"success": true,
"message": "Data retrieved successfully",
"data": {
"items": [],
"page": 0,
"size": 10,
"totalItems": 100,
"totalPages": 10,
"hasNext": true
},
"timestamp": "2026-06-26T12:00:00Z",
"path": "/api/listings"
}
### Error Response Format
All errors should follow:
{
"success": false,
"message": "Validation failed",
"errorCode": "VALIDATION_ERROR",
"details": [
{
"field": "email",
"message": "Email is required"
}
],
"timestamp": "2026-06-26T12:00:00Z",
"path": "/api/auth/register"
}
Standard error codes:
| Code | Meaning |
| --- | --- |
| VALIDATION_ERROR | Request body or query parameters are invalid |
| AUTHENTICATION_FAILED | Login failed or token is invalid |
| ACCESS_DENIED | User does not have required role |
| RESOURCE_NOT_FOUND | Requested resource does not exist |
| CONFLICT | Duplicate or conflicting state |
| BUSINESS_RULE_VIOLATION | Valid request but rejected by business rules |
| INTERNAL_ERROR | Unexpected server error |
### Authentication Standard
- JWT access token is used for authenticated API calls.
- Access token contains userId, email, and roles.
- Access token is sent using Authorization: Bearer <token>.
- Refresh token is added as a placeholder early and implemented later if needed.
- Passwords are hashed using BCrypt.
- Logout initially removes tokens from frontend storage.
- Token blacklist using Redis can be added later.
### Role-Based Authorization
Roles:
| Role | Description |
| --- | --- |
| ROLE_RENTER | Searches listings, books properties, pays mock payments, chats |
| ROLE_LANDLORD | Creates listings, uploads media, manages bookings, chats |
| ROLE_ADMIN | Moderates listings, reviews KYC, manages users, views audit logs |
Rules:
- Public pages do not require authentication.
- Profile and dashboard pages require authentication.
- Admin routes require ROLE_ADMIN.
- Landlord listing routes require ROLE_LANDLORD.
- Booking creation requires ROLE_RENTER.
- Listing approval requires ROLE_ADMIN.
- KYC review requires ROLE_ADMIN.
### Validation Standard
- Backend validates every request using Jakarta Bean Validation.
- Frontend validates every form using Angular Reactive Forms.
- Backend validation is the source of truth.
- Frontend validation improves user experience but does not replace backend validation.
- All IDs use UUIDs unless there is a strong reason not to.
- Dates use ISO-8601 format.
- Money values use decimal types.
- Never trust user role or user ID from frontend body; read them from JWT claims.
### Naming Conventions
Backend:
- Service names use kebab-case: auth-service.
- Java packages use lowercase: com.rentsphere.auth.
- Controllers end with Controller.
- Services end with Service.
- Repositories end with Repository.
- DTO classes end with Request, Response, or Dto.
- Flyway files use V1__create_users_table.sql.
Frontend:
- Components use kebab-case folders: listing-card.
- Services end with .service.ts.
- Guards end with .guard.ts.
- Interceptors end with .interceptor.ts.
- Interfaces use PascalCase: ListingResponse.
- Routes use kebab-case: /landlord/listings.
Database:
- Tables use snake_case.
- Columns use snake_case.
- Primary keys use id.
- Foreign references use <entity>_id.
- Timestamps use created_at and updated_at.
### Git Branch and Commit Convention
Branches:
- main
- develop
- feature/phase-02-auth-service
- feature/listing-create-wizard
- fix/login-token-refresh
- chore/docker-compose-cleanup
Commit messages:
- chore: initialize repository structure
- feat(auth): add register and login endpoints
- feat(frontend): add login and register pages
- fix(listing): validate minimum image count
- test(booking): add booking request service tests
- docs: update setup instructions
### Environment Variables Convention
Use uppercase snake case.
Examples:
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8081
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rentsphere_auth_db
DB_USERNAME=rentsphere
DB_PASSWORD=rentsphere
JWT_SECRET=change-me-in-env
JWT_ACCESS_TOKEN_MINUTES=30
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
MEDIA_STORAGE_PATH=/app/uploads
CORS_ALLOWED_ORIGINS=http://localhost:4200
Rules:
- Never commit real secrets.
- Commit .env.example, not real production .env.
- Each service has its own environment variables.
- Local defaults are acceptable for development only.
- Production secrets must be stored outside Git.
## 5. Phase-by-Phase Roadmap
## Phase 0 — Repository and Environment Setup
### Goal
Create the base repository structure, local development environment, service folders, Angular app folder, Docker Compose foundation, environment file templates, and root documentation.
### Why this phase matters
A clean foundation prevents confusion later. Every developer should be able to clone the project, read the README, run infrastructure, and understand where each service belongs.
### Backend services involved
- api-gateway
- auth-service
- user-service
- listing-service
- media-service
- ai-review-service
- admin-moderation-service
- verification-service
- search-service
- booking-service
- payment-service
- chat-service
- notification-service
- audit-service
### Frontend areas involved
- Angular workspace initialization.
- Base app shell placeholder.
- Routing placeholder.
- Environment configuration placeholder.
### Database changes
- Create PostgreSQL containers.
- Create separate database names for each service.
- No application tables yet.
- Add database initialization scripts if needed.
### API endpoints
- No business endpoints in this phase.
- Optional GET /actuator/health placeholder per service later.
### Events
No events in this phase.
### Backend tasks
- [ ] Create root repository.
- [ ] Create backend/ folder.
- [ ] Create one folder per backend service.
- [ ] Add Java 21 and Spring Boot 3 baseline decision to README.
- [ ] Add placeholder README inside each service folder.
- [ ] Add .gitkeep files where needed.
- [ ] Define service port map.
- [ ] Define database name map.
- [ ] Create .env.example.
- [ ] Create root .gitignore.
- [ ] Add shared documentation folder.
- [ ] Add initial architecture diagram placeholder.
- [ ] Decide whether each service is generated now or generated phase-by-phase.
### Frontend tasks
- [ ] Create frontend/ folder.
- [ ] Initialize Angular application.
- [ ] Add Angular Router.
- [ ] Add base app.routes.ts.
- [ ] Add base layout placeholder.
- [ ] Add environment files.
- [ ] Add placeholder home page.
- [ ] Add placeholder not-found page.
- [ ] Add frontend README.
### DevOps tasks
- [ ] Add docker-compose.yml.
- [ ] Add PostgreSQL service containers.
- [ ] Add Redis container placeholder.
- [ ] Add Kafka or Redpanda placeholder.
- [ ] Add Docker network.
- [ ] Add named volumes for databases.
- [ ] Add .env.example for Docker Compose.
- [ ] Add README instructions for running infrastructure.
- [ ] Add port mapping documentation.
- [ ] Add make or script placeholders if the team wants command shortcuts.
### Security rules
- [ ] No secrets committed.
- [ ] .env files ignored by Git.
- [ ] .env.example contains safe dummy values only.
- [ ] Database development passwords are documented as local-only.
- [ ] Docker volumes are not committed.
### Validation rules
- [ ] Validate that required environment variables are documented.
- [ ] Validate that all service names follow naming convention.
- [ ] Validate that all ports are unique.
- [ ] Validate that local Docker Compose starts successfully.
### Mocked parts
- Backend services are only folders or generated shells.
- Redis is only a placeholder.
- Kafka is only a placeholder.
- Databases exist but have no business schema.
### Real parts
- Repository structure.
- Docker Compose infrastructure.
- Angular application shell.
- Documentation skeleton.
- Environment conventions.
### Manual testing checklist
- [ ] Clone repository into a clean folder.
- [ ] Copy .env.example to .env.
- [ ] Run Docker Compose.
- [ ] Confirm PostgreSQL containers start.
- [ ] Confirm Redis starts if enabled.
- [ ] Confirm Kafka or Redpanda starts if enabled.
- [ ] Start Angular app.
- [ ] Open Angular app in browser.
- [ ] Confirm README setup steps are accurate.
### Automated testing checklist
- [ ] Add placeholder CI workflow plan.
- [ ] Add frontend test command placeholder.
- [ ] Add backend test command placeholder.
- [ ] Verify repository has no committed secrets.
- [ ] Verify ignored files are ignored correctly.
### Completion criteria
- [ ] Repository has clear backend and frontend structure.
- [ ] Docker Compose starts core infrastructure.
- [ ] Angular app runs locally.
- [ ] .env.example exists.
- [ ] README explains setup.
- [ ] No business logic is required yet.
### Suggested Git commit
chore: initialize repository and local environment
## Phase 1 — API Gateway and Shared Standards
### Goal
Build the API Gateway foundation and define shared backend standards for API responses, error handling, CORS, Swagger, logging, and future rate limiting.
### Why this phase matters
The API Gateway becomes the frontend’s single entry point. Shared standards prevent every service from returning different response formats and error structures.
### Backend services involved
- api-gateway
- Optional generated shell for auth-service
- Optional generated shell for user-service
### Frontend areas involved
- Angular environment API base URL.
- HTTP client base setup.
- Global error display placeholder.
### Database changes
- No business tables.
- Optional gateway has no database.
- No Flyway migrations required unless service shells include health metadata.
### API endpoints
- GET /actuator/health checks gateway health.
- GET /api/gateway/health returns gateway custom health response.
- GET /swagger or /swagger-ui.html exposes Swagger documentation index.
- GET /api/auth/** routes to Auth Service placeholder.
- GET /api/users/** routes to User Service placeholder.
- GET /api/listings/** routes to Listing Service placeholder.
### Events
No events in this phase.
### Backend tasks
- [ ] Create Spring Boot project for api-gateway.
- [ ] Configure Java 21.
- [ ] Configure Spring Cloud Gateway if selected.
- [ ] Configure route definitions.
- [ ] Add CORS configuration for Angular origin.
- [ ] Add global response standard documentation.
- [ ] Add global error response standard documentation.
- [ ] Add request correlation ID placeholder.
- [ ] Add request logging filter.
- [ ] Add rate-limit placeholder using Redis design.
- [ ] Add Swagger/OpenAPI documentation strategy.
- [ ] Add health endpoint.
- [ ] Add Dockerfile placeholder or defer to deployment phase.
- [ ] Add service port configuration.
- [ ] Add gateway README.
### Frontend tasks
- [ ] Set Angular API base URL to gateway URL.
- [ ] Create base API service wrapper.
- [ ] Create global error model.
- [ ] Create placeholder error toast or alert component.
- [ ] Add environment variable documentation.
- [ ] Verify frontend can call gateway health endpoint.
### DevOps tasks
- [ ] Add gateway service to Docker Compose if generated.
- [ ] Add gateway environment variables.
- [ ] Document gateway port.
- [ ] Confirm gateway can resolve downstream service names inside Docker network.
- [ ] Add placeholder Redis rate-limit configuration.
- [ ] Add Swagger access instructions.
### Security rules
- [ ] Only local Angular origin is allowed in development CORS.
- [ ] Do not allow wildcard CORS in production.
- [ ] Gateway must not expose internal service ports publicly in production.
- [ ] Error responses must not expose stack traces.
- [ ] Logs must not include passwords or tokens.
### Validation rules
- [ ] Validate route paths.
- [ ] Validate required gateway environment variables.
- [ ] Validate CORS allowed origins.
- [ ] Validate response format from gateway health endpoint.
### Mocked parts
- Downstream service routes can point to placeholder services.
- Rate limiting is a placeholder.
- JWT validation at gateway can be deferred to Auth phase.
### Real parts
- API Gateway project.
- Route structure.
- CORS policy.
- Health endpoint.
- API response and error standards.
- Swagger documentation strategy.
### Manual testing checklist
- [ ] Start gateway locally.
- [ ] Open health endpoint.
- [ ] Start Angular app.
- [ ] Call gateway from Angular.
- [ ] Verify CORS works.
- [ ] Try invalid route and verify standard error response.
- [ ] Confirm route configuration is readable.
### Automated testing checklist
- [ ] Add gateway context load test.
- [ ] Add route configuration test if practical.
- [ ] Add CORS configuration test if practical.
- [ ] Add error response unit test.
- [ ] Add CI placeholder for gateway tests.
### Completion criteria
- [ ] Gateway runs locally.
- [ ] Angular can call gateway.
- [ ] CORS is configured.
- [ ] API response and error standards are documented.
- [ ] Swagger strategy is documented.
- [ ] Gateway routing foundation exists.
### Suggested Git commit
feat(gateway): add api gateway foundation and shared standards
## Phase 2 — Auth Service
### Goal
Implement user registration, login, JWT authentication, logout, role support, password hashing, and Angular authentication flow.
### Why this phase matters
Most future features depend on authenticated users and role-based access. Building Auth early gives every later phase a stable security foundation.
### Backend services involved
- api-gateway
- auth-service
### Frontend areas involved
- Login page.
- Register page.
- Token storage.
- Auth service.
- Auth interceptor.
- AuthGuard.
- RoleGuard.
- Navbar authenticated state.
### Database changes
- users
- roles
- user_roles
- refresh_tokens placeholder table or future migration placeholder.
- Flyway migration V1__create_auth_tables.sql.
### API endpoints
- POST /api/auth/register registers a new user.
- POST /api/auth/login authenticates user and returns JWT.
- POST /api/auth/logout logs out current user.
- POST /api/auth/refresh placeholder for refresh token.
- GET /api/auth/me returns current authenticated user summary.
- GET /api/auth/validate validates token for internal or gateway use.
### Events
- user.registered is published after successful registration.
- audit.event.created can be planned but may remain mocked until Audit Service exists.
### Backend tasks
- [ ] Create Spring Boot project for auth-service.
- [ ] Configure PostgreSQL datasource.
- [ ] Configure Flyway.
- [ ] Create auth database migrations.
- [ ] Implement user entity.
- [ ] Implement role entity.
- [ ] Seed default roles.
- [ ] Implement registration request and response DTOs.
- [ ] Implement login request and response DTOs.
- [ ] Hash passwords using BCrypt.
- [ ] Implement JWT generation.
- [ ] Implement JWT validation.
- [ ] Add Spring Security configuration.
- [ ] Add role mapping into JWT claims.
- [ ] Add logout endpoint.
- [ ] Add refresh token placeholder.
- [ ] Add duplicate email validation.
- [ ] Add global exception handling.
- [ ] Add Swagger documentation.
- [ ] Publish user.registered event if Kafka is ready.
- [ ] Mock event publishing if Kafka is not ready.
### Frontend tasks
- [ ] Create login page.
- [ ] Create register page.
- [ ] Create authentication service.
- [ ] Create token storage service.
- [ ] Add AuthInterceptor for Authorization header.
- [ ] Add global 401 handling.
- [ ] Add AuthGuard.
- [ ] Add RoleGuard.
- [ ] Add form validation for login.
- [ ] Add form validation for registration.
- [ ] Add logout button.
- [ ] Add navbar state for guest and logged-in user.
- [ ] Redirect users after login based on role.
- [ ] Show validation errors from backend.
### DevOps tasks
- [ ] Add auth-service to Docker Compose.
- [ ] Add auth database container or database initialization.
- [ ] Add JWT environment variables.
- [ ] Add Kafka environment variables if event publishing is enabled.
- [ ] Add service health check.
- [ ] Add Swagger URL documentation.
- [ ] Confirm gateway routes /api/auth/** to auth-service.
### Security rules
- [ ] Passwords must be hashed with BCrypt.
- [ ] Plain passwords must never be logged.
- [ ] JWT secret must come from environment variables.
- [ ] Access token expiry must be limited.
- [ ] Registration must not allow ROLE_ADMIN from public request.
- [ ] Default public registration role is ROLE_RENTER.
- [ ] Landlord registration can be explicit if the UI supports role selection.
- [ ] Admin users should be seeded manually or created by database seed.
- [ ] Authenticated endpoints require valid JWT.
- [ ] Logout must remove frontend token.
### Validation rules
- [ ] Email is required.
- [ ] Email must be valid format.
- [ ] Email must be unique.
- [ ] Password is required.
- [ ] Password minimum length is 8 characters.
- [ ] Password should contain letters and numbers.
- [ ] Full name is required.
- [ ] Role must be one of allowed public roles.
- [ ] Login rejects invalid credentials with generic message.
### Mocked parts
- Refresh token can be placeholder.
- Redis token blacklist can be placeholder.
- Email verification can be placeholder.
- Audit event can be mocked if Audit Service does not exist.
- User profile creation event consumer can be mocked until User Service phase.
### Real parts
- User registration.
- User login.
- JWT generation.
- JWT validation.
- Password hashing.
- Angular auth flow.
- Guards and interceptor.
### Manual testing checklist
- [ ] Register renter account.
- [ ] Register landlord account if supported.
- [ ] Try duplicate email.
- [ ] Try weak password.
- [ ] Login with valid credentials.
- [ ] Login with invalid credentials.
- [ ] Confirm token is stored.
- [ ] Confirm authenticated request sends bearer token.
- [ ] Logout and verify protected routes are blocked.
- [ ] Try accessing admin route as renter and verify denied.
### Automated testing checklist
- [ ] Unit test password hashing.
- [ ] Unit test JWT generation.
- [ ] Unit test JWT validation.
- [ ] Unit test registration validation.
- [ ] Unit test duplicate email handling.
- [ ] Integration test register endpoint.
- [ ] Integration test login endpoint.
- [ ] Frontend test AuthGuard behavior.
- [ ] Frontend test AuthInterceptor adds token.
- [ ] Frontend test login form validation.
### Completion criteria
- [ ] Users can register and login.
- [ ] JWT access token works.
- [ ] Angular stores and sends token.
- [ ] Guards protect routes.
- [ ] Roles are included in token.
- [ ] Gateway routes auth requests.
- [ ] Auth Service has Flyway migrations and tests.
### Suggested Git commit
feat(auth): implement jwt authentication and angular auth flow
## Phase 3 — User/Profile Service
### Goal
Implement user profiles, role summary, verification status summary, user preferences, favorites placeholder, and Angular profile/settings pages.
### Why this phase matters
Authentication only proves identity. The platform also needs user-facing profile data, account settings, verification state, and profile information for dashboards.
### Backend services involved
- api-gateway
- auth-service
- user-service
### Frontend areas involved
- Profile page.
- Settings page.
- Account dashboard.
- User preferences form.
- Verification status summary widget.
- Favorites placeholder UI.
### Database changes
- user_profiles
- user_preferences
- favorite_listings placeholder
- Flyway migration V1__create_user_profile_tables.sql.
### API endpoints
- GET /api/users/me returns current user profile.
- PUT /api/users/me updates current user profile.
- GET /api/users/me/preferences returns preferences.
- PUT /api/users/me/preferences updates preferences.
- GET /api/users/me/verification-summary returns KYC summary placeholder.
- GET /api/users/me/favorites returns favorite listings placeholder.
- POST /api/users/me/favorites/{listingId} placeholder for adding favorite.
- DELETE /api/users/me/favorites/{listingId} placeholder for removing favorite.
- GET /api/users/{userId}/public-profile returns public profile summary.
### Events
- user.registered is consumed to create initial profile.
- profile.updated is published after profile update.
- audit.event.created can be planned for profile changes.
### Backend tasks
- [ ] Create Spring Boot project for user-service.
- [ ] Configure datasource and Flyway.
- [ ] Create profile database migrations.
- [ ] Implement profile entity.
- [ ] Implement preferences entity.
- [ ] Implement favorites placeholder table.
- [ ] Implement user registered event consumer.
- [ ] Implement fallback profile creation if event was missed.
- [ ] Implement get current profile endpoint.
- [ ] Implement update current profile endpoint.
- [ ] Implement preferences endpoints.
- [ ] Implement verification summary placeholder.
- [ ] Implement public profile endpoint.
- [ ] Add role summary from JWT claims.
- [ ] Add Swagger documentation.
- [ ] Add service-level security configuration.
### Frontend tasks
- [ ] Create profile page.
- [ ] Create settings page.
- [ ] Create profile edit form.
- [ ] Create preferences form.
- [ ] Create verification summary card.
- [ ] Create favorites placeholder page.
- [ ] Show current user name in navbar.
- [ ] Add profile service.
- [ ] Add loading and empty states.
- [ ] Add validation messages.
- [ ] Add success notification after update.
### DevOps tasks
- [ ] Add user-service to Docker Compose.
- [ ] Add user database.
- [ ] Add gateway route /api/users/**.
- [ ] Add Kafka topic user.registered if enabled.
- [ ] Add health check.
- [ ] Document service environment variables.
### Security rules
- [ ] Users can read and update only their own private profile.
- [ ] Public profile endpoint exposes safe fields only.
- [ ] Admin profile access can be deferred.
- [ ] User ID must come from JWT, not request body.
- [ ] Sensitive auth data must not be duplicated from Auth Service.
- [ ] Preferences must not include secrets.
### Validation rules
- [ ] Full name is required.
- [ ] Phone number format must be valid if provided.
- [ ] Bio has maximum length.
- [ ] City and area have maximum length.
- [ ] Preferred price range must be valid.
- [ ] Preferred bedrooms must be non-negative.
- [ ] Favorite listing ID must be valid UUID.
### Mocked parts
- Verification summary is placeholder until KYC Service.
- Favorites can be placeholder until Search/Listings are ready.
- Profile creation event can be mocked if Kafka is not active.
- Public profile can return limited local data only.
### Real parts
- Profile storage.
- Preferences storage.
- Angular profile and settings pages.
- User registered event consumer if Kafka is ready.
- Profile update flow.
### Manual testing checklist
- [ ] Register new user.
- [ ] Confirm profile is created.
- [ ] Open profile page.
- [ ] Update profile.
- [ ] Refresh and confirm data persists.
- [ ] Update preferences.
- [ ] Try invalid phone number.
- [ ] Confirm public profile hides private fields.
- [ ] Confirm user cannot access another user’s private profile.
### Automated testing checklist
- [ ] Unit test profile creation.
- [ ] Unit test profile update validation.
- [ ] Integration test GET /api/users/me.
- [ ] Integration test PUT /api/users/me.
- [ ] Integration test preferences endpoints.
- [ ] Event consumer test for user.registered.
- [ ] Frontend test profile form validation.
- [ ] Frontend test profile service calls.
### Completion criteria
- [ ] User profiles work end to end.
- [ ] Settings page works.
- [ ] Preferences are saved.
- [ ] Verification summary placeholder displays.
- [ ] Favorites placeholder exists.
- [ ] User Service owns its database and runs independently.
### Suggested Git commit
feat(user): add profile preferences and settings pages
## Phase 4 — Public Website and UI Design System
### Goal
Build the public website foundation, responsive layout, navigation, footer, reusable Angular UI components, design system, and Arabic/English-ready structure.
### Why this phase matters
A professional graduation project needs strong presentation. Building the UI system early makes later pages faster and more consistent.
### Backend services involved
- api-gateway
- Optional public health endpoints only.
### Frontend areas involved
- Home page.
- Public layout.
- Navbar.
- Footer.
- Button components.
- Card components.
- Form components.
- Modal components.
- Loading states.
- Empty states.
- Error states.
- Responsive styles.
- Arabic/English-ready structure.
### Database changes
- No database changes.
### API endpoints
- No new business endpoints.
- Optional GET /api/gateway/health for frontend connectivity check.
### Events
No events in this phase.
### Backend tasks
- [ ] Confirm gateway remains compatible with frontend routes.
- [ ] Ensure CORS works with Angular development server.
- [ ] Keep backend unchanged unless health endpoint needs adjustment.
### Frontend tasks
- [ ] Design public home page.
- [ ] Build public layout.
- [ ] Build responsive navbar.
- [ ] Build responsive footer.
- [ ] Build reusable button component.
- [ ] Build reusable input component.
- [ ] Build reusable select component.
- [ ] Build reusable textarea component.
- [ ] Build reusable listing card shell.
- [ ] Build reusable dashboard card component.
- [ ] Build reusable status badge component.
- [ ] Build reusable modal component.
- [ ] Build reusable table component shell.
- [ ] Build loading spinner or skeleton component.
- [ ] Build empty state component.
- [ ] Build error state component.
- [ ] Add responsive spacing scale.
- [ ] Add color tokens.
- [ ] Add typography rules.
- [ ] Prepare layout direction support for Arabic later.
- [ ] Prepare translation key structure if i18n is planned.
- [ ] Add mobile menu behavior.
- [ ] Add route-level page titles if desired.
### DevOps tasks
- [ ] Ensure Angular development command is documented.
- [ ] Add frontend lint command.
- [ ] Add frontend test command.
- [ ] Add frontend build command.
- [ ] Document UI design decisions in README or docs/ui.md.
### Security rules
- [ ] Public pages must not expose hidden admin links to unauthenticated users.
- [ ] Navbar must show role-specific links only after login.
- [ ] Client-side hiding is not security; backend guards still apply later.
- [ ] Error components must not display raw stack traces.
### Validation rules
- [ ] Forms use Reactive Forms.
- [ ] Required fields show clear messages.
- [ ] Error messages are consistent.
- [ ] Buttons have disabled state during submission.
- [ ] Components support mobile screens.
- [ ] Components support keyboard navigation basics.
### Mocked parts
- Listing cards use mock data.
- Search bar submits to placeholder.
- Featured listings are mock data.
- Statistics are mock data.
- Arabic translation values can be placeholder.
### Real parts
- Public website UI.
- Reusable Angular components.
- Responsive layout.
- Design system foundation.
- Role-aware navigation structure.
### Manual testing checklist
- [ ] Open home page on desktop.
- [ ] Open home page on mobile width.
- [ ] Test navbar menu on mobile.
- [ ] Test login/register links.
- [ ] Test footer links.
- [ ] Inspect reusable components visually.
- [ ] Check page does not break when logged out.
- [ ] Check page does not break when logged in.
- [ ] Check basic keyboard navigation.
### Automated testing checklist
- [ ] Add component tests for reusable button.
- [ ] Add component tests for input validation display.
- [ ] Add component tests for navbar role rendering.
- [ ] Add snapshot or DOM tests if team uses them.
- [ ] Add Angular build verification.
- [ ] Add lint verification.
### Completion criteria
- [ ] Public website looks professional.
- [ ] Reusable UI components exist.
- [ ] Layout is responsive.
- [ ] Angular app remains connected to gateway.
- [ ] Later feature pages can reuse the design system.
### Suggested Git commit
feat(frontend): add public website and design system foundation
## Phase 5 — Listing Service
### Goal
Implement listing CRUD, listing statuses, amenities, availability, landlord listing dashboard, and Angular create listing wizard.
### Why this phase matters
Listings are the core business object. Without listings, search, media, AI review, moderation, bookings, and payments cannot be built meaningfully.
### Backend services involved
- api-gateway
- listing-service
- auth-service
- user-service
### Frontend areas involved
- Landlord listing dashboard.
- Create listing wizard.
- Edit listing page.
- Listing status badges.
- My listings table.
- Listing draft workflow.
### Database changes
- listings
- listing_addresses
- listing_amenities
- amenities
- listing_availability
- listing_status_history
- Flyway migration V1__create_listing_tables.sql.
### API endpoints
- POST /api/listings creates listing draft.
- GET /api/listings/my returns landlord listings.
- GET /api/listings/my/{listingId} returns landlord listing details.
- PUT /api/listings/{listingId} updates listing.
- DELETE /api/listings/{listingId} deletes draft listing.
- POST /api/listings/{listingId}/submit submits listing for review.
- GET /api/listings/{listingId}/status-history returns listing status history.
- GET /api/listings/amenities returns available amenities.
- PUT /api/listings/{listingId}/availability updates availability.
### Events
- listing.created is published after draft creation.
- listing.submitted is published after landlord submits listing for review.
- audit.event.created can be planned for status changes.
### Backend tasks
- [ ] Create Spring Boot project for listing-service.
- [ ] Configure datasource and Flyway.
- [ ] Create listing migrations.
- [ ] Implement listing entity.
- [ ] Implement address entity.
- [ ] Implement amenity entity.
- [ ] Implement availability entity.
- [ ] Implement status history entity.
- [ ] Seed standard amenities.
- [ ] Implement create draft endpoint.
- [ ] Implement update listing endpoint.
- [ ] Implement landlord listing list endpoint.
- [ ] Implement landlord listing details endpoint.
- [ ] Implement submit for review endpoint.
- [ ] Implement status transition rules.
- [ ] Implement ownership checks.
- [ ] Implement delete draft only rule.
- [ ] Publish listing events.
- [ ] Add Swagger documentation.
- [ ] Add pagination for landlord listings.
- [ ] Add indexes for landlord ID and status.
### Frontend tasks
- [ ] Create landlord dashboard shell.
- [ ] Create my listings page.
- [ ] Create listing create wizard.
- [ ] Add step for basic information.
- [ ] Add step for address.
- [ ] Add step for pricing.
- [ ] Add step for amenities.
- [ ] Add step for availability.
- [ ] Add review step before submit.
- [ ] Add edit listing page.
- [ ] Add listing status badge.
- [ ] Add draft saving behavior.
- [ ] Add submit for review button.
- [ ] Add validation messages.
- [ ] Add loading and error states.
- [ ] Add confirmation modal for delete draft.
### DevOps tasks
- [ ] Add listing-service to Docker Compose.
- [ ] Add listing database.
- [ ] Add gateway route /api/listings/**.
- [ ] Add Kafka topics for listing events.
- [ ] Add health check.
- [ ] Document listing service environment variables.
### Security rules
- [ ] Only authenticated landlords can create listings.
- [ ] Landlords can only access their own draft and pending listings.
- [ ] Admin approval is not available in this phase.
- [ ] Public users cannot see unapproved listings.
- [ ] Listing owner ID must come from JWT.
- [ ] Delete is allowed only for draft listings.
- [ ] Status changes must follow allowed transitions.
### Validation rules
- [ ] Title is required.
- [ ] Title has maximum length.
- [ ] Description is required.
- [ ] Description has minimum length.
- [ ] Price must be positive.
- [ ] City is required.
- [ ] Area is required.
- [ ] Address details are required.
- [ ] Property type is required.
- [ ] Bedrooms must be non-negative.
- [ ] Bathrooms must be non-negative.
- [ ] Area size must be positive.
- [ ] At least one amenity is recommended.
- [ ] Availability dates must be valid.
- [ ] Listing cannot be submitted if required fields are missing.
### Mocked parts
- Listing images are mocked until Media Service.
- AI review is mocked until AI Review phase.
- Admin approval is mocked until Moderation Service.
- Public search is deferred until Search Service.
- Booking availability conflict checks are deferred until Booking Service.
### Real parts
- Listing CRUD for landlords.
- Listing statuses.
- Amenities.
- Availability.
- Landlord dashboard.
- Create listing wizard.
- Listing submission event.
### Manual testing checklist
- [ ] Login as landlord.
- [ ] Create draft listing.
- [ ] Update draft listing.
- [ ] Add amenities.
- [ ] Add availability.
- [ ] Submit listing for review.
- [ ] Confirm status changes to pending review.
- [ ] Try deleting submitted listing and verify blocked.
- [ ] Login as renter and verify landlord endpoints are denied.
- [ ] Try accessing another landlord listing and verify denied.
### Automated testing checklist
- [ ] Unit test listing validation.
- [ ] Unit test status transitions.
- [ ] Unit test ownership checks.
- [ ] Integration test create listing.
- [ ] Integration test update listing.
- [ ] Integration test submit listing.
- [ ] Integration test landlord listing pagination.
- [ ] Frontend test create listing wizard validation.
- [ ] Frontend test my listings page rendering.
### Completion criteria
- [ ] Landlords can create, edit, and submit listings.
- [ ] Listing data persists in its own database.
- [ ] Status rules work.
- [ ] Angular landlord dashboard works.
- [ ] Listing events are published or mocked.
### Suggested Git commit
feat(listing): add landlord listing management and submission flow
## Phase 6 — Media Service
### Goal
Implement local media upload, image metadata, listing images, Angular file upload component, image preview, and validation requiring 3 to 20 images.
### Why this phase matters
Real-estate listings need images. Local upload first keeps the MVP simple while preserving a path to S3-compatible storage later.
### Backend services involved
- api-gateway
- media-service
- listing-service
### Frontend areas involved
- Listing image upload step.
- File upload component.
- Image preview grid.
- Image reorder placeholder.
- Image validation messages.
### Database changes
- media_files
- listing_images
- Flyway migration V1__create_media_tables.sql.
- Local upload directory mounted as Docker volume.
### API endpoints
- POST /api/media/listings/{listingId}/images uploads listing images.
- GET /api/media/listings/{listingId}/images returns listing image metadata.
- DELETE /api/media/images/{imageId} deletes image.
- PUT /api/media/listings/{listingId}/images/{imageId}/primary sets primary image.
- GET /api/media/files/{fileId} serves local file or redirects to file URL.
- GET /api/media/listings/{listingId}/validation returns image count validation.
### Events
- media.uploaded is published after successful upload.
- listing.media.updated can be planned if needed.
- audit.event.created can be planned for media changes.
### Backend tasks
- [ ] Create Spring Boot project for media-service.
- [ ] Configure datasource and Flyway.
- [ ] Create media migrations.
- [ ] Configure local storage path.
- [ ] Implement image metadata entity.
- [ ] Implement listing image relation entity.
- [ ] Implement upload endpoint.
- [ ] Validate content type.
- [ ] Validate file size.
- [ ] Generate safe stored file names.
- [ ] Prevent path traversal.
- [ ] Implement list images endpoint.
- [ ] Implement delete image endpoint.
- [ ] Implement set primary image endpoint.
- [ ] Implement image count validation.
- [ ] Integrate with Listing Service by REST to verify listing ownership.
- [ ] Publish media.uploaded event.
- [ ] Add Swagger multipart documentation.
### Frontend tasks
- [ ] Add image upload step to create listing wizard.
- [ ] Build reusable file upload component.
- [ ] Build drag-and-drop upload area if time allows.
- [ ] Show selected image previews before upload.
- [ ] Show uploaded image grid.
- [ ] Show primary image badge.
- [ ] Allow setting primary image.
- [ ] Allow deleting uploaded image.
- [ ] Show upload progress if practical.
- [ ] Enforce 3 to 20 image validation in UI.
- [ ] Show backend validation errors.
### DevOps tasks
- [ ] Add media-service to Docker Compose.
- [ ] Add media database.
- [ ] Add media upload volume.
- [ ] Add gateway route /api/media/**.
- [ ] Add maximum upload size environment variables.
- [ ] Document local media folder behavior.
- [ ] Ensure uploaded files are ignored by Git.
### Security rules
- [ ] Only listing owner can upload images for their listing.
- [ ] Admin can view images for moderation.
- [ ] Unauthenticated users can view approved listing images later.
- [ ] File names from users must not be trusted.
- [ ] Only image MIME types are accepted.
- [ ] File size limit must be enforced.
- [ ] File paths must not expose server internals.
- [ ] Uploaded files must not be executable.
### Validation rules
- [ ] Minimum 3 images before listing can be considered complete.
- [ ] Maximum 20 images per listing.
- [ ] Each image must be JPEG, PNG, or WebP.
- [ ] Each image must not exceed configured size.
- [ ] Listing ID must be valid UUID.
- [ ] Primary image must belong to the listing.
- [ ] Cannot delete image if it causes approved listing to violate minimum image rule unless business allows unpublishing.
### Mocked parts
- S3 or cloud storage is mocked by local filesystem.
- Image resizing is optional or placeholder.
- Virus scanning is placeholder.
- CDN delivery is placeholder.
- Reorder images can be placeholder.
### Real parts
- Local image upload.
- Metadata persistence.
- Listing image association.
- Image preview in Angular.
- Image count validation.
### Manual testing checklist
- [ ] Login as landlord.
- [ ] Create listing draft.
- [ ] Upload valid images.
- [ ] Upload fewer than 3 images and verify warning.
- [ ] Upload more than 20 images and verify rejection.
- [ ] Upload unsupported file type and verify rejection.
- [ ] Delete an image.
- [ ] Set primary image.
- [ ] Refresh page and confirm images persist.
- [ ] Try uploading to another landlord listing and verify denied.
### Automated testing checklist
- [ ] Unit test file type validation.
- [ ] Unit test file size validation.
- [ ] Unit test image count validation.
- [ ] Integration test image upload.
- [ ] Integration test image list.
- [ ] Integration test delete image.
- [ ] Integration test ownership check.
- [ ] Frontend test upload component validation.
- [ ] Frontend test preview rendering.
### Completion criteria
- [ ] Listings can have real uploaded images.
- [ ] Image count rule is enforced.
- [ ] Images persist locally.
- [ ] Angular upload flow works.
- [ ] Media Service owns its own database.
### Suggested Git commit
feat(media): add local listing image upload and validation
## Phase 7 — AI Review Service Mock
### Goal
Implement a mocked AI Review Service that produces trust scores, flags, listing review lifecycle data, admin review integration points, and trust score UI.
### Why this phase matters
AI review is a strong graduation demo feature, but building a real model too early is risky. A mock service allows the full review workflow to work first.
### Backend services involved
- api-gateway
- ai-review-service
- listing-service
- admin-moderation-service placeholder
### Frontend areas involved
- Listing trust score UI.
- Admin review preview placeholder.
- Landlord listing review status display.
### Database changes
- listing_reviews
- review_flags
- Flyway migration V1__create_ai_review_tables.sql.
### API endpoints
- POST /api/ai-review/listings/{listingId}/review triggers mock review.
- GET /api/ai-review/listings/{listingId} returns review result.
- GET /api/ai-review/listings/{listingId}/flags returns flags.
- POST /api/ai-review/listings/{listingId}/rerun reruns mock review for admin.
### Events
- listing.submitted is consumed to start mock AI review.
- listing.reviewed is published after review result is created.
- audit.event.created can be planned for review reruns.
### Backend tasks
- [ ] Create Spring Boot project for ai-review-service.
- [ ] Configure datasource and Flyway.
- [ ] Create review migrations.
- [ ] Implement review result entity.
- [ ] Implement review flag entity.
- [ ] Implement mock scoring algorithm.
- [ ] Generate trust score from listing completeness.
- [ ] Generate mock flags for missing images or suspicious price.
- [ ] Consume listing.submitted event if Kafka is ready.
- [ ] Add manual trigger endpoint.
- [ ] Add rerun endpoint for admin.
- [ ] Publish listing.reviewed event.
- [ ] Integrate with Listing Service by REST to fetch listing summary.
- [ ] Add Swagger documentation.
### Frontend tasks
- [ ] Add trust score display component.
- [ ] Add flags display component.
- [ ] Show review status on landlord listing details.
- [ ] Show review result placeholder in admin moderation UI.
- [ ] Add loading and error states.
- [ ] Add explanatory text that AI review is simulated for graduation MVP.
### DevOps tasks
- [ ] Add ai-review-service to Docker Compose.
- [ ] Add AI review database.
- [ ] Add gateway route /api/ai-review/**.
- [ ] Add Kafka topic listing.reviewed.
- [ ] Add service health check.
- [ ] Document mock review behavior.
### Security rules
- [ ] Landlord can view review result for own listing.
- [ ] Admin can view all review results.
- [ ] Only admin can rerun review manually.
- [ ] AI score must not directly approve listing without admin decision.
- [ ] Mock logic must be clearly documented to avoid pretending it is real AI.
### Validation rules
- [ ] Listing ID must be valid UUID.
- [ ] Listing must exist.
- [ ] Listing must be submitted before review.
- [ ] Trust score must be between 0 and 100.
- [ ] Flags must use known flag types.
- [ ] Rerun reason is required if admin reruns review.
### Mocked parts
- AI model is mocked.
- Image analysis is mocked.
- Fraud detection is mocked.
- Natural language analysis is mocked.
- External AI API integration is not implemented.
### Real parts
- Review lifecycle.
- Trust score persistence.
- Review flags persistence.
- Kafka event integration if ready.
- Angular trust score UI.
### Manual testing checklist
- [ ] Submit listing for review.
- [ ] Confirm mock AI review is generated.
- [ ] View trust score as landlord.
- [ ] View flags as admin placeholder.
- [ ] Rerun review as admin.
- [ ] Try rerun as landlord and verify denied.
- [ ] Confirm trust score is between 0 and 100.
- [ ] Confirm review result persists after restart.
### Automated testing checklist
- [ ] Unit test mock scoring.
- [ ] Unit test flag generation.
- [ ] Integration test manual review trigger.
- [ ] Integration test get review result.
- [ ] Integration test admin rerun authorization.
- [ ] Event consumer test for listing.submitted.
- [ ] Frontend test trust score component.
- [ ] Frontend test flags component.
### Completion criteria
- [ ] Submitted listings receive mock trust scores.
- [ ] Flags are generated and stored.
- [ ] Admin integration point exists.
- [ ] Landlord can see review status.
- [ ] AI review is clearly documented as mocked.
### Suggested Git commit
feat(ai-review): add mock listing trust score workflow
## Phase 8 — Admin/Moderation Service
### Goal
Implement admin dashboard, listing moderation, user management summary, platform stats, and Angular admin tables.
### Why this phase matters
Listings should not become public immediately. Admin moderation creates a realistic marketplace workflow and supports the graduation demo approval scenario.
### Backend services involved
- api-gateway
- admin-moderation-service
- listing-service
- ai-review-service
- user-service
### Frontend areas involved
- Admin dashboard.
- Listing moderation table.
- Listing review details page.
- User management table.
- Platform stats cards.
### Database changes
- moderation_cases
- moderation_decisions
- admin_notes
- Flyway migration V1__create_moderation_tables.sql.
### API endpoints
- GET /api/admin/dashboard/stats returns basic platform stats.
- GET /api/admin/listings/pending returns pending listings.
- GET /api/admin/listings/{listingId}/review returns moderation details.
- POST /api/admin/listings/{listingId}/approve approves listing.
- POST /api/admin/listings/{listingId}/reject rejects listing.
- GET /api/admin/users returns users summary.
- GET /api/admin/users/{userId} returns user summary.
- POST /api/admin/users/{userId}/disable placeholder disables user.
- POST /api/admin/users/{userId}/enable placeholder enables user.
### Events
- listing.reviewed is consumed to create or update moderation case.
- listing.approved is published after admin approval.
- listing.rejected is published after admin rejection.
- audit.event.created is published for admin actions.
### Backend tasks
- [ ] Create Spring Boot project for admin-moderation-service.
- [ ] Configure datasource and Flyway.
- [ ] Create moderation migrations.
- [ ] Implement moderation case entity.
- [ ] Implement moderation decision entity.
- [ ] Implement admin note entity.
- [ ] Consume listing.reviewed event if Kafka is ready.
- [ ] Implement pending listings endpoint.
- [ ] Implement moderation detail endpoint.
- [ ] Fetch listing details from Listing Service by REST.
- [ ] Fetch AI review details from AI Review Service by REST.
- [ ] Implement approve endpoint.
- [ ] Implement reject endpoint with reason.
- [ ] Update Listing Service status by REST.
- [ ] Publish approval and rejection events.
- [ ] Implement user management summary via User Service or Auth Service REST.
- [ ] Implement basic stats endpoint.
- [ ] Add Swagger documentation.
### Frontend tasks
- [ ] Create admin layout.
- [ ] Create admin dashboard page.
- [ ] Create stats cards.
- [ ] Create pending listings table.
- [ ] Create moderation details page.
- [ ] Show listing data.
- [ ] Show uploaded images.
- [ ] Show AI trust score.
- [ ] Show AI flags.
- [ ] Add approve action.
- [ ] Add reject action with reason modal.
- [ ] Create user management table.
- [ ] Add admin-only navigation.
- [ ] Add pagination and filters to admin tables.
### DevOps tasks
- [ ] Add admin-moderation-service to Docker Compose.
- [ ] Add moderation database.
- [ ] Add gateway route /api/admin/**.
- [ ] Add Kafka topics for moderation events.
- [ ] Add service health check.
- [ ] Seed admin account through Auth Service migration or documented script.
### Security rules
- [ ] All admin endpoints require ROLE_ADMIN.
- [ ] Admin actions must be logged.
- [ ] Rejection requires reason.
- [ ] Admin cannot approve listing if required listing data is incomplete.
- [ ] Admin cannot approve listing with fewer than 3 images.
- [ ] Admin user management actions must not expose password hashes.
- [ ] Admin APIs must not be accessible by landlord or renter.
### Validation rules
- [ ] Listing ID must be valid UUID.
- [ ] Rejection reason is required.
- [ ] Rejection reason has maximum length.
- [ ] Approval is allowed only for pending review listings.
- [ ] Rejection is allowed only for pending review listings.
- [ ] Admin notes have maximum length.
- [ ] Pagination parameters must be valid.
### Mocked parts
- Full user disabling can be placeholder.
- Advanced platform analytics can be mocked.
- Audit persistence can be mocked until Audit Service.
- Notification sending can be mocked until Notification Service.
### Real parts
- Admin dashboard.
- Listing moderation.
- Approval and rejection.
- Admin tables.
- Platform stats basics.
- Listing status update integration.
### Manual testing checklist
- [ ] Login as admin.
- [ ] Open admin dashboard.
- [ ] View pending listings.
- [ ] Open listing review details.
- [ ] View AI trust score.
- [ ] Approve listing.
- [ ] Confirm listing status changes to approved.
- [ ] Reject listing with reason.
- [ ] Confirm landlord sees rejected status.
- [ ] Try admin endpoint as landlord and verify denied.
### Automated testing checklist
- [ ] Unit test moderation status transitions.
- [ ] Unit test rejection reason validation.
- [ ] Integration test pending listings endpoint.
- [ ] Integration test approve endpoint.
- [ ] Integration test reject endpoint.
- [ ] Authorization test for admin endpoints.
- [ ] Frontend test admin table rendering.
- [ ] Frontend test reject modal validation.
### Completion criteria
- [ ] Admin can approve or reject listings.
- [ ] Listing status updates correctly.
- [ ] Admin dashboard exists.
- [ ] Pending moderation workflow works.
- [ ] Non-admin users cannot access admin features.
### Suggested Git commit
feat(admin): add listing moderation dashboard and approval flow
## Phase 9 — Verification/KYC Service
### Goal
Implement KYC document submission, verification statuses, admin KYC review, rejection reason, and Angular verification page.
### Why this phase matters
Verification adds trust to the marketplace and gives admins another important workflow for the graduation demo.
### Backend services involved
- api-gateway
- verification-service
- user-service
- admin-moderation-service
- media-service optional for document storage
### Frontend areas involved
- User verification page.
- KYC document upload form.
- Verification status card.
- Admin KYC review page.
- Admin KYC table.
### Database changes
- kyc_submissions
- kyc_documents
- kyc_decisions
- Flyway migration V1__create_kyc_tables.sql.
### API endpoints
- POST /api/verification/me/submissions submits KYC request.
- GET /api/verification/me/status returns current verification status.
- GET /api/verification/me/submissions returns user submission history.
- GET /api/admin/verification/submissions returns pending KYC submissions.
- GET /api/admin/verification/submissions/{submissionId} returns submission details.
- POST /api/admin/verification/submissions/{submissionId}/approve approves KYC.
- POST /api/admin/verification/submissions/{submissionId}/reject rejects KYC.
### Events
- kyc.submitted is published after user submits documents.
- kyc.approved is published after admin approval.
- kyc.rejected is published after admin rejection.
- audit.event.created is published for admin KYC decisions.
### Backend tasks
- [ ] Create Spring Boot project for verification-service.
- [ ] Configure datasource and Flyway.
- [ ] Create KYC migrations.
- [ ] Implement KYC submission entity.
- [ ] Implement KYC document entity.
- [ ] Implement KYC decision entity.
- [ ] Implement document upload or integrate with Media Service.
- [ ] Implement submit KYC endpoint.
- [ ] Implement current status endpoint.
- [ ] Implement admin pending submissions endpoint.
- [ ] Implement admin submission detail endpoint.
- [ ] Implement approve endpoint.
- [ ] Implement reject endpoint with reason.
- [ ] Update User Service verification summary by event or REST.
- [ ] Publish KYC events.
- [ ] Add Swagger documentation.
### Frontend tasks
- [ ] Create verification page.
- [ ] Add verification status card.
- [ ] Add KYC submission form.
- [ ] Add document upload fields.
- [ ] Add accepted document type notes.
- [ ] Add submission history.
- [ ] Create admin KYC table.
- [ ] Create admin KYC detail page.
- [ ] Add approve button.
- [ ] Add reject modal with reason.
- [ ] Show verification badge in profile.
- [ ] Show verification summary in dashboard.
### DevOps tasks
- [ ] Add verification-service to Docker Compose.
- [ ] Add verification database.
- [ ] Add gateway route /api/verification/**.
- [ ] Add admin route /api/admin/verification/**.
- [ ] Add document storage volume if local storage is used.
- [ ] Add Kafka topics for KYC events.
- [ ] Add service health check.
### Security rules
- [ ] Users can submit and view only their own KYC data.
- [ ] Admin can review all KYC submissions.
- [ ] KYC documents must not be publicly accessible.
- [ ] Document downloads require admin role or owner access.
- [ ] Sensitive document data must not appear in logs.
- [ ] Rejection requires reason.
- [ ] Only pending submissions can be approved or rejected.
### Validation rules
- [ ] Document type is required.
- [ ] Document file is required.
- [ ] Document file must be image or PDF.
- [ ] File size limit must be enforced.
- [ ] User cannot submit new KYC while one is pending.
- [ ] Rejection reason is required.
- [ ] Rejection reason has maximum length.
- [ ] Submission ID must be valid UUID.
### Mocked parts
- Government ID verification is mocked.
- OCR is mocked.
- Face matching is mocked.
- External KYC provider integration is not implemented.
- Document encryption can be documented but deferred if time is limited.
### Real parts
- KYC submission workflow.
- Admin KYC review.
- Status persistence.
- Verification badge/status display.
- KYC events.
### Manual testing checklist
- [ ] Login as landlord or renter.
- [ ] Open verification page.
- [ ] Submit KYC documents.
- [ ] Confirm status becomes pending.
- [ ] Login as admin.
- [ ] Open KYC review table.
- [ ] Approve submission.
- [ ] Confirm user status becomes verified.
- [ ] Submit another user and reject with reason.
- [ ] Confirm rejection reason appears to user.
- [ ] Try viewing another user’s KYC and verify denied.
### Automated testing checklist
- [ ] Unit test KYC status transitions.
- [ ] Unit test pending submission rule.
- [ ] Unit test rejection reason validation.
- [ ] Integration test submit KYC.
- [ ] Integration test user status endpoint.
- [ ] Integration test admin approve.
- [ ] Integration test admin reject.
- [ ] Authorization test for KYC document access.
- [ ] Frontend test KYC form validation.
- [ ] Frontend test admin KYC review actions.
### Completion criteria
- [ ] Users can submit KYC.
- [ ] Admins can approve or reject KYC.
- [ ] Verification status appears in user profile.
- [ ] KYC data is protected.
- [ ] KYC events are published or mocked.
### Suggested Git commit
feat(verification): add kyc submission and admin review workflow
## Phase 10 — Search Service
### Goal
Implement public listing search using database search first, filters, listing cards, listing detail page, pagination, and a later Elasticsearch/OpenSearch plan.
### Why this phase matters
Renters need to discover approved listings. Database search is enough for MVP and keeps delivery realistic before adding OpenSearch.
### Backend services involved
- api-gateway
- search-service
- listing-service
- media-service
- admin-moderation-service
### Frontend areas involved
- Search page.
- Listing cards.
- Listing detail page.
- Filter sidebar.
- Pagination.
- Sort controls.
- Favorite button placeholder.
### Database changes
- search_listings
- search_listing_amenities
- search_index_sync_log
- Flyway migration V1__create_search_tables.sql.
- Database indexes for city, area, price, status, bedrooms, and property type.
### API endpoints
- GET /api/search/listings searches approved listings.
- GET /api/search/listings/{listingId} returns public listing details.
- GET /api/search/filters/options returns filter options.
- POST /api/search/reindex/{listingId} admin-only placeholder for reindexing.
- POST /api/search/reindex/all admin-only placeholder for full reindexing.
### Events
- listing.approved is consumed to add or update searchable listing.
- listing.rejected is consumed to remove or hide listing from search.
- listing.updated can be planned to refresh search data.
- media.uploaded can be consumed to update primary image if needed.
### Backend tasks
- [ ] Create Spring Boot project for search-service.
- [ ] Configure datasource and Flyway.
- [ ] Create search tables.
- [ ] Implement searchable listing entity.
- [ ] Implement event consumer for listing.approved.
- [ ] Implement event consumer for listing.rejected.
- [ ] Add manual sync endpoint for development.
- [ ] Implement search endpoint.
- [ ] Add filters for city.
- [ ] Add filters for area.
- [ ] Add filters for price range.
- [ ] Add filters for bedrooms.
- [ ] Add filters for bathrooms.
- [ ] Add filters for property type.
- [ ] Add filters for amenities.
- [ ] Add pagination.
- [ ] Add sorting by newest.
- [ ] Add sorting by price.
- [ ] Add listing detail endpoint.
- [ ] Fetch image URLs from Media Service or store public image summary.
- [ ] Document OpenSearch migration plan.
### Frontend tasks
- [ ] Create search page.
- [ ] Create listing card component using real data.
- [ ] Create filter sidebar.
- [ ] Create mobile filter drawer.
- [ ] Create sort dropdown.
- [ ] Create pagination component.
- [ ] Create listing detail page.
- [ ] Show image gallery.
- [ ] Show amenities.
- [ ] Show address summary.
- [ ] Show landlord public profile summary.
- [ ] Add favorite button placeholder.
- [ ] Add loading skeletons.
- [ ] Add empty search state.
- [ ] Add query parameter synchronization for filters.
- [ ] Add responsive layout.
### DevOps tasks
- [ ] Add search-service to Docker Compose.
- [ ] Add search database.
- [ ] Add gateway route /api/search/**.
- [ ] Add Kafka topics for search sync.
- [ ] Add health check.
- [ ] Document OpenSearch as post-MVP option.
- [ ] Add optional OpenSearch placeholder service disabled by default.
### Security rules
- [ ] Search endpoint is public.
- [ ] Only approved listings are searchable.
- [ ] Draft, pending, rejected, and suspended listings are hidden.
- [ ] Admin reindex endpoints require ROLE_ADMIN.
- [ ] Public listing details must not expose private landlord contact unless intended.
- [ ] Search input must be sanitized and parameterized.
### Validation rules
- [ ] Page must be zero or positive.
- [ ] Size must be within allowed range.
- [ ] Minimum price must not exceed maximum price.
- [ ] Bedrooms must be non-negative.
- [ ] Bathrooms must be non-negative.
- [ ] Sort value must be allowed.
- [ ] City and area filters have maximum length.
- [ ] Amenity IDs must be valid.
### Mocked parts
- OpenSearch is not implemented in MVP.
- Advanced ranking is mocked by simple sorting.
- Favorites button can be placeholder.
- Map search can be placeholder.
- Recommendation engine is not implemented.
### Real parts
- Public database search.
- Approved listing indexing.
- Listing cards.
- Listing detail page.
- Filters and pagination.
### Manual testing checklist
- [ ] Approve a listing as admin.
- [ ] Search as guest.
- [ ] Search as renter.
- [ ] Filter by city.
- [ ] Filter by price.
- [ ] Filter by bedrooms.
- [ ] Filter by amenities.
- [ ] Open listing detail page.
- [ ] Confirm rejected listings do not appear.
- [ ] Confirm pending listings do not appear.
- [ ] Test pagination.
- [ ] Test mobile search layout.
### Automated testing checklist
- [ ] Unit test filter query building.
- [ ] Unit test approved-only rule.
- [ ] Integration test listing approved event indexing.
- [ ] Integration test search endpoint.
- [ ] Integration test listing detail endpoint.
- [ ] Integration test admin reindex authorization.
- [ ] Frontend test search filters.
- [ ] Frontend test listing card rendering.
- [ ] Frontend test empty state.
### Completion criteria
- [ ] Approved listings appear in search.
- [ ] Filters work.
- [ ] Pagination works.
- [ ] Listing detail page works.
- [ ] Search Service owns its read database.
- [ ] OpenSearch migration plan is documented.
### Suggested Git commit
feat(search): add public listing search and detail pages
## Phase 11 — Booking Service
### Goal
Implement renter booking requests, landlord accept/reject actions, booking statuses, and renter/landlord booking dashboards.
### Why this phase matters
Booking is the main transaction workflow of the rental marketplace. It connects renters, landlords, listings, payments, chat, and notifications.
### Backend services involved
- api-gateway
- booking-service
- listing-service
- search-service
- user-service
- notification-service placeholder
- payment-service placeholder
### Frontend areas involved
- Booking request form.
- Renter bookings page.
- Landlord booking requests page.
- Booking status badges.
- Listing detail booking panel.
### Database changes
- bookings
- booking_status_history
- Flyway migration V1__create_booking_tables.sql.
### API endpoints
- POST /api/bookings creates booking request.
- GET /api/bookings/my returns renter bookings.
- GET /api/bookings/landlord returns landlord booking requests.
- GET /api/bookings/{bookingId} returns booking details.
- POST /api/bookings/{bookingId}/accept landlord accepts booking.
- POST /api/bookings/{bookingId}/reject landlord rejects booking.
- POST /api/bookings/{bookingId}/cancel renter cancels booking.
- GET /api/bookings/listings/{listingId}/availability-check checks availability.
### Events
- booking.requested is published after renter creates request.
- booking.accepted is published after landlord accepts.
- booking.rejected is published after landlord rejects.
- booking.cancelled is published after renter cancels.
- notification.requested can be published for booking updates.
- audit.event.created can be published for status changes.
### Backend tasks
- [ ] Create Spring Boot project for booking-service.
- [ ] Configure datasource and Flyway.
- [ ] Create booking migrations.
- [ ] Implement booking entity.
- [ ] Implement booking status history entity.
- [ ] Implement create booking request endpoint.
- [ ] Verify listing exists and is approved through Listing Service or Search Service REST.
- [ ] Prevent landlord from booking own listing.
- [ ] Implement renter bookings endpoint.
- [ ] Implement landlord booking requests endpoint.
- [ ] Implement accept endpoint.
- [ ] Implement reject endpoint with reason.
- [ ] Implement cancel endpoint.
- [ ] Implement basic availability overlap check.
- [ ] Publish booking events.
- [ ] Add Swagger documentation.
- [ ] Add indexes for renter ID, landlord ID, listing ID, and status.
### Frontend tasks
- [ ] Add booking panel to listing detail page.
- [ ] Create booking request form.
- [ ] Add date range inputs.
- [ ] Add guest count if relevant.
- [ ] Add booking summary preview.
- [ ] Create renter bookings page.
- [ ] Create landlord booking requests page.
- [ ] Add accept button for landlord.
- [ ] Add reject button with reason modal.
- [ ] Add cancel button for renter.
- [ ] Add booking status badges.
- [ ] Add loading and empty states.
- [ ] Add validation messages.
### DevOps tasks
- [ ] Add booking-service to Docker Compose.
- [ ] Add booking database.
- [ ] Add gateway route /api/bookings/**.
- [ ] Add Kafka topics for booking events.
- [ ] Add service health check.
- [ ] Document booking status flow.
### Security rules
- [ ] Only renters can create booking requests.
- [ ] Landlords cannot book their own listings.
- [ ] Landlords can only accept or reject bookings for their own listings.
- [ ] Renters can only view and cancel their own bookings.
- [ ] Admin viewing can be deferred.
- [ ] Booking status transitions must be enforced.
- [ ] User IDs must come from JWT.
### Validation rules
- [ ] Listing ID is required.
- [ ] Start date is required.
- [ ] End date is required.
- [ ] End date must be after start date.
- [ ] Booking dates must be in the future.
- [ ] Guest count must be positive if used.
- [ ] Reject reason is required.
- [ ] Booking is allowed only for approved listing.
- [ ] Duplicate overlapping accepted bookings should be prevented.
### Mocked parts
- Payment hold is mocked until Payment Service.
- Notifications are mocked until Notification Service.
- Calendar availability can be basic.
- Contract generation is not implemented.
- Admin booking dispute handling is not implemented.
### Real parts
- Booking request workflow.
- Landlord accept/reject.
- Renter booking dashboard.
- Landlord booking dashboard.
- Booking status history.
- Booking events.
### Manual testing checklist
- [ ] Login as renter.
- [ ] Open approved listing.
- [ ] Create booking request.
- [ ] Confirm booking appears in renter dashboard.
- [ ] Login as landlord.
- [ ] Confirm request appears in landlord dashboard.
- [ ] Accept booking.
- [ ] Confirm renter sees accepted status.
- [ ] Create another booking and reject it.
- [ ] Confirm rejection reason appears.
- [ ] Try booking own listing as landlord and verify denied.
- [ ] Try accepting another landlord’s booking and verify denied.
### Automated testing checklist
- [ ] Unit test booking status transitions.
- [ ] Unit test date validation.
- [ ] Unit test ownership checks.
- [ ] Unit test overlapping booking rule.
- [ ] Integration test create booking.
- [ ] Integration test accept booking.
- [ ] Integration test reject booking.
- [ ] Integration test cancel booking.
- [ ] Frontend test booking form validation.
- [ ] Frontend test booking dashboard rendering.
### Completion criteria
- [ ] Renters can request bookings.
- [ ] Landlords can accept or reject.
- [ ] Booking dashboards work.
- [ ] Booking status rules are enforced.
- [ ] Booking events are published or mocked.
### Suggested Git commit
feat(booking): add renter booking requests and landlord decisions
## Phase 12 — Payment Service Mock
### Goal
Implement payment summary, mock payment flow, escrow records, refund placeholder, and later Stripe integration plan.
### Why this phase matters
Payments complete the rental transaction flow. A mock payment is enough for the graduation demo and avoids legal, security, and integration complexity.
### Backend services involved
- api-gateway
- payment-service
- booking-service
- notification-service placeholder
- audit-service placeholder
### Frontend areas involved
- Payment summary page.
- Mock checkout page.
- Payment success page.
- Payment failed state.
- Booking payment status display.
### Database changes
- payments
- escrow_records
- refunds
- Flyway migration V1__create_payment_tables.sql.
### API endpoints
- GET /api/payments/bookings/{bookingId}/summary returns payment summary.
- POST /api/payments/bookings/{bookingId}/mock-pay completes mock payment.
- GET /api/payments/{paymentId} returns payment details.
- GET /api/payments/my returns renter payment history.
- POST /api/payments/{paymentId}/refund refund placeholder for admin.
- GET /api/payments/{paymentId}/escrow returns escrow record.
### Events
- booking.accepted is consumed to make payment available.
- payment.mock.completed is published after mock payment.
- payment.refund.requested can be planned.
- notification.requested can be published for payment updates.
- audit.event.created can be published for payment actions.
### Backend tasks
- [ ] Create Spring Boot project for payment-service.
- [ ] Configure datasource and Flyway.
- [ ] Create payment migrations.
- [ ] Implement payment entity.
- [ ] Implement escrow record entity.
- [ ] Implement refund placeholder entity.
- [ ] Consume booking.accepted event if Kafka is ready.
- [ ] Implement payment summary endpoint.
- [ ] Implement mock payment endpoint.
- [ ] Verify booking belongs to renter.
- [ ] Verify booking is accepted before payment.
- [ ] Generate mock transaction reference.
- [ ] Create escrow record after payment.
- [ ] Publish payment.mock.completed event.
- [ ] Add refund placeholder endpoint for admin.
- [ ] Document Stripe integration plan.
- [ ] Add Swagger documentation.
### Frontend tasks
- [ ] Add payment button to accepted booking.
- [ ] Create payment summary page.
- [ ] Create mock checkout form.
- [ ] Add clear message that payment is simulated.
- [ ] Create payment success page.
- [ ] Create payment failed state.
- [ ] Add payment status to booking cards.
- [ ] Create payment history page.
- [ ] Add escrow status display.
- [ ] Add loading and error states.
### DevOps tasks
- [ ] Add payment-service to Docker Compose.
- [ ] Add payment database.
- [ ] Add gateway route /api/payments/**.
- [ ] Add Kafka topics for payment events.
- [ ] Add service health check.
- [ ] Document mock payment behavior.
- [ ] Document future Stripe environment variables without enabling real payments.
### Security rules
- [ ] Only renter who owns booking can pay.
- [ ] Payment is allowed only for accepted booking.
- [ ] Mock payment must not collect real card details.
- [ ] Admin refund placeholder requires ROLE_ADMIN.
- [ ] Payment amount must be calculated on backend.
- [ ] Frontend must not send trusted amount.
- [ ] Payment records must not expose sensitive data.
### Validation rules
- [ ] Booking ID is required.
- [ ] Booking must exist.
- [ ] Booking must be accepted.
- [ ] Payment must not already be completed.
- [ ] Amount must be positive.
- [ ] Currency must be supported.
- [ ] Refund reason is required for refund placeholder.
### Mocked parts
- Real payment gateway is mocked.
- Card processing is not implemented.
- Stripe integration is planned only.
- Escrow release is placeholder.
- Refund execution is placeholder.
### Real parts
- Payment records.
- Mock payment status transition.
- Escrow record creation.
- Payment summary.
- Angular mock checkout.
### Manual testing checklist
- [ ] Create booking as renter.
- [ ] Accept booking as landlord.
- [ ] Open payment summary.
- [ ] Complete mock payment.
- [ ] Confirm payment success page.
- [ ] Confirm payment status appears in booking.
- [ ] Try paying twice and verify blocked.
- [ ] Try paying for another renter booking and verify denied.
- [ ] Open payment history.
- [ ] Review escrow record.
### Automated testing checklist
- [ ] Unit test payment amount calculation.
- [ ] Unit test payment status transition.
- [ ] Unit test duplicate payment prevention.
- [ ] Integration test payment summary.
- [ ] Integration test mock payment.
- [ ] Integration test payment history.
- [ ] Authorization test payment ownership.
- [ ] Frontend test payment summary rendering.
- [ ] Frontend test mock payment success flow.
### Completion criteria
- [ ] Accepted bookings can be paid through mock payment.
- [ ] Payment records persist.
- [ ] Escrow records persist.
- [ ] Frontend payment flow works.
- [ ] Real payment integration plan is documented.
### Suggested Git commit
feat(payment): add mock payment and escrow workflow
## Phase 13 — Chat Service
### Goal
Implement chat threads, messages, REST chat first, WebSocket later, and Angular chat UI.
### Why this phase matters
Chat improves marketplace realism and supports the final demo after booking. REST first keeps the feature stable before adding WebSocket.
### Backend services involved
- api-gateway
- chat-service
- booking-service
- user-service
- notification-service placeholder
### Frontend areas involved
- Chat inbox.
- Chat thread page.
- Message composer.
- Unread badge placeholder.
- Booking-related chat entry point.
### Database changes
- chat_threads
- chat_participants
- chat_messages
- message_read_receipts
- Flyway migration V1__create_chat_tables.sql.
### API endpoints
- POST /api/chat/threads creates or gets chat thread.
- GET /api/chat/threads returns current user threads.
- GET /api/chat/threads/{threadId} returns thread details.
- GET /api/chat/threads/{threadId}/messages returns messages.
- POST /api/chat/threads/{threadId}/messages sends message.
- POST /api/chat/threads/{threadId}/read marks messages as read.
- GET /api/chat/unread-count returns unread count.
- WS /ws/chat planned WebSocket endpoint for later real-time chat.
### Events
- chat.message.sent is published after message send.
- notification.requested can be published for new message.
- booking.accepted can be consumed to allow booking-related chat.
- audit.event.created can be planned for moderation-sensitive actions.
### Backend tasks
- [ ] Create Spring Boot project for chat-service.
- [ ] Configure datasource and Flyway.
- [ ] Create chat migrations.
- [ ] Implement chat thread entity.
- [ ] Implement participant entity.
- [ ] Implement message entity.
- [ ] Implement read receipt entity.
- [ ] Implement create or get thread endpoint.
- [ ] Implement threads list endpoint.
- [ ] Implement messages list endpoint.
- [ ] Implement send message endpoint.
- [ ] Implement mark as read endpoint.
- [ ] Implement unread count endpoint.
- [ ] Validate participants are allowed to chat.
- [ ] Connect chat to booking or listing context.
- [ ] Publish chat.message.sent event.
- [ ] Add WebSocket design document.
- [ ] Add REST polling as MVP.
- [ ] Add Swagger documentation.
### Frontend tasks
- [ ] Create chat inbox page.
- [ ] Create chat thread page.
- [ ] Create message bubble component.
- [ ] Create message composer.
- [ ] Add send message action.
- [ ] Add read state update.
- [ ] Add unread badge placeholder.
- [ ] Add polling refresh if needed.
- [ ] Add chat button from booking details.
- [ ] Add loading and empty states.
- [ ] Add mobile-friendly chat layout.
- [ ] Prepare WebSocket service placeholder.
### DevOps tasks
- [ ] Add chat-service to Docker Compose.
- [ ] Add chat database.
- [ ] Add gateway route /api/chat/**.
- [ ] Add future gateway route /ws/chat.
- [ ] Add Kafka topics for chat events.
- [ ] Add service health check.
- [ ] Document WebSocket upgrade plan.
### Security rules
- [ ] Users can only see threads they participate in.
- [ ] Users can only send messages to threads they participate in.
- [ ] Message sender ID must come from JWT.
- [ ] Admin access to chat moderation can be deferred.
- [ ] Messages must be sanitized for display.
- [ ] WebSocket later must validate JWT during connection.
- [ ] Chat should not expose private user data beyond needed profile summary.
### Validation rules
- [ ] Thread participants are required.
- [ ] Message text is required.
- [ ] Message text has maximum length.
- [ ] Thread ID must be valid UUID.
- [ ] Booking-related chat requires valid accepted booking if enforced.
- [ ] Empty messages are rejected.
- [ ] Whitespace-only messages are rejected.
### Mocked parts
- WebSocket is placeholder.
- Typing indicators are not implemented.
- Attachments are not implemented.
- Message moderation is not implemented.
- Push notifications are mocked until Notification Service.
### Real parts
- REST chat threads.
- REST messages.
- Angular chat UI.
- Read status basics.
- Chat message event.
### Manual testing checklist
- [ ] Login as renter.
- [ ] Open accepted booking.
- [ ] Start chat with landlord.
- [ ] Send message.
- [ ] Login as landlord.
- [ ] Open chat inbox.
- [ ] Reply to renter.
- [ ] Confirm renter sees reply.
- [ ] Mark thread as read.
- [ ] Try opening thread as unrelated user and verify denied.
- [ ] Test chat on mobile width.
### Automated testing checklist
- [ ] Unit test participant authorization.
- [ ] Unit test message validation.
- [ ] Integration test create thread.
- [ ] Integration test send message.
- [ ] Integration test list messages.
- [ ] Integration test unread count.
- [ ] Authorization test unrelated user access.
- [ ] Frontend test message composer validation.
- [ ] Frontend test chat thread rendering.
### Completion criteria
- [ ] Renter and landlord can chat through REST.
- [ ] Messages persist.
- [ ] Unauthorized users cannot access threads.
- [ ] Angular chat UI works.
- [ ] WebSocket upgrade plan exists.
### Suggested Git commit
feat(chat): add rest-based chat threads and messages
## Phase 14 — Notification Service
### Goal
Implement in-app notifications, notification dropdown, mark as read, and event-based notification plan.
### Why this phase matters
Notifications connect cross-service workflows and make the system feel integrated. They also demonstrate Kafka usage clearly.
### Backend services involved
- api-gateway
- notification-service
- booking-service
- payment-service
- chat-service
- admin-moderation-service
- verification-service
### Frontend areas involved
- Notification dropdown.
- Notification list page.
- Unread count badge.
- Mark as read action.
- Dashboard notification cards.
### Database changes
- notifications
- notification_preferences
- Flyway migration V1__create_notification_tables.sql.
### API endpoints
- GET /api/notifications returns current user notifications.
- GET /api/notifications/unread-count returns unread count.
- POST /api/notifications/{notificationId}/read marks one notification as read.
- POST /api/notifications/read-all marks all notifications as read.
- GET /api/notifications/preferences returns preferences.
- PUT /api/notifications/preferences updates preferences.
### Events
- notification.requested is consumed to create notification.
- booking.requested can trigger landlord notification.
- booking.accepted can trigger renter notification.
- booking.rejected can trigger renter notification.
- payment.mock.completed can trigger landlord and renter notification.
- chat.message.sent can trigger receiver notification.
- listing.approved can trigger landlord notification.
- listing.rejected can trigger landlord notification.
- kyc.approved can trigger user notification.
- kyc.rejected can trigger user notification.
### Backend tasks
- [ ] Create Spring Boot project for notification-service.
- [ ] Configure datasource and Flyway.
- [ ] Create notification migrations.
- [ ] Implement notification entity.
- [ ] Implement preferences entity.
- [ ] Implement notification requested event consumer.
- [ ] Implement direct consumers for important events if desired.
- [ ] Implement list notifications endpoint.
- [ ] Implement unread count endpoint.
- [ ] Implement mark one as read endpoint.
- [ ] Implement mark all as read endpoint.
- [ ] Implement preferences endpoints.
- [ ] Add notification type enum.
- [ ] Add notification target URL field.
- [ ] Add Swagger documentation.
- [ ] Add indexes for user ID and read status.
### Frontend tasks
- [ ] Create notification service.
- [ ] Add notification bell to navbar.
- [ ] Add unread count badge.
- [ ] Create notification dropdown.
- [ ] Create notification list page.
- [ ] Add mark one as read.
- [ ] Add mark all as read.
- [ ] Add notification preferences page or section.
- [ ] Link notifications to relevant pages.
- [ ] Add empty state.
- [ ] Add polling refresh or manual refresh.
- [ ] Prepare WebSocket notification upgrade placeholder.
### DevOps tasks
- [ ] Add notification-service to Docker Compose.
- [ ] Add notification database.
- [ ] Add gateway route /api/notifications/**.
- [ ] Add Kafka topics for notification events.
- [ ] Add service health check.
- [ ] Document notification event contracts.
### Security rules
- [ ] Users can only read their own notifications.
- [ ] Notification target user ID must come from event payload created by trusted service.
- [ ] Mark as read requires notification ownership.
- [ ] Notification content must not contain sensitive data.
- [ ] Admin notifications should not leak admin-only URLs to normal users.
### Validation rules
- [ ] Notification ID must be valid UUID.
- [ ] Notification type must be known.
- [ ] Target user ID is required.
- [ ] Title is required.
- [ ] Message is required.
- [ ] Target URL must be internal or safe.
- [ ] Preference values must be valid booleans.
### Mocked parts
- Email notifications are mocked.
- SMS notifications are mocked.
- Push notifications are mocked.
- Real-time WebSocket notification delivery is placeholder.
- Notification templates can be simple.
### Real parts
- In-app notifications.
- Unread count.
- Notification dropdown.
- Mark as read.
- Event-driven notification creation.
### Manual testing checklist
- [ ] Trigger booking request.
- [ ] Confirm landlord receives notification.
- [ ] Accept booking.
- [ ] Confirm renter receives notification.
- [ ] Send chat message.
- [ ] Confirm receiver receives notification.
- [ ] Approve listing.
- [ ] Confirm landlord receives notification.
- [ ] Mark notification as read.
- [ ] Mark all as read.
- [ ] Confirm unread count updates.
### Automated testing checklist
- [ ] Unit test notification creation.
- [ ] Unit test mark as read ownership.
- [ ] Integration test list notifications.
- [ ] Integration test unread count.
- [ ] Integration test mark as read.
- [ ] Event consumer test for notification requested.
- [ ] Frontend test notification dropdown.
- [ ] Frontend test unread badge update.
### Completion criteria
- [ ] Important user actions create notifications.
- [ ] Users can view and mark notifications as read.
- [ ] Notification dropdown works.
- [ ] Kafka event usage is demonstrated.
- [ ] Notification Service owns its database.
### Suggested Git commit
feat(notification): add in-app notifications and unread counts
## Phase 15 — Audit Service
### Goal
Implement audit events, admin action logging, status changes logging, and admin audit page.
### Why this phase matters
Audit logs demonstrate professional system governance and help explain cross-service event tracking during the graduation demo.
### Backend services involved
- api-gateway
- audit-service
- admin-moderation-service
- verification-service
- listing-service
- booking-service
- payment-service
### Frontend areas involved
- Admin audit log page.
- Audit filters.
- Audit details modal.
- Admin dashboard recent activity widget.
### Database changes
- audit_events
- Flyway migration V1__create_audit_events_table.sql.
- Indexes for actor ID, action type, entity type, entity ID, and created date.
### API endpoints
- GET /api/admin/audit/events returns audit events with filters.
- GET /api/admin/audit/events/{eventId} returns audit event details.
- GET /api/admin/audit/recent returns recent activity.
### Events
- audit.event.created is consumed to store audit events.
- Admin approval creates audit event.
- Admin rejection creates audit event.
- KYC approval creates audit event.
- KYC rejection creates audit event.
- Listing status change creates audit event.
- Booking status change creates audit event.
- Payment mock completion creates audit event.
### Backend tasks
- [ ] Create Spring Boot project for audit-service.
- [ ] Configure datasource and Flyway.
- [ ] Create audit migrations.
- [ ] Implement audit event entity.
- [ ] Implement audit event consumer.
- [ ] Implement audit query endpoint.
- [ ] Implement audit details endpoint.
- [ ] Implement recent activity endpoint.
- [ ] Add filters by actor ID.
- [ ] Add filters by action type.
- [ ] Add filters by entity type.
- [ ] Add filters by date range.
- [ ] Add pagination.
- [ ] Add sorting by newest.
- [ ] Add Swagger documentation.
- [ ] Update other services to publish audit events.
### Frontend tasks
- [ ] Create admin audit page.
- [ ] Create audit table.
- [ ] Add filters.
- [ ] Add date range filter.
- [ ] Add audit details modal.
- [ ] Add recent activity widget to admin dashboard.
- [ ] Add loading and empty states.
- [ ] Add pagination.
- [ ] Add role guard for admin route.
### DevOps tasks
- [ ] Add audit-service to Docker Compose.
- [ ] Add audit database.
- [ ] Add gateway route /api/admin/audit/**.
- [ ] Add Kafka topic audit.event.created.
- [ ] Add service health check.
- [ ] Document audit event payload format.
### Security rules
- [ ] Audit APIs require ROLE_ADMIN.
- [ ] Audit logs are append-only from application perspective.
- [ ] Normal users cannot view audit logs.
- [ ] Audit event details must not include passwords or tokens.
- [ ] Events must include actor ID when available.
- [ ] System-generated events must identify actor as SYSTEM.
### Validation rules
- [ ] Event ID must be valid UUID.
- [ ] Date range must be valid.
- [ ] Page and size must be valid.
- [ ] Action type filter must be known.
- [ ] Entity type filter must be known.
- [ ] Event payload must be valid JSON if stored as JSON.
### Mocked parts
- Tamper-proof audit storage is not implemented.
- External SIEM integration is not implemented.
- Long-term archival is not implemented.
- Advanced compliance reporting is not implemented.
### Real parts
- Audit event persistence.
- Admin audit search.
- Recent activity widget.
- Cross-service audit publishing.
- Audit event consumer.
### Manual testing checklist
- [ ] Approve listing as admin.
- [ ] Confirm audit event appears.
- [ ] Reject listing as admin.
- [ ] Confirm rejection audit event appears.
- [ ] Approve KYC.
- [ ] Confirm KYC audit event appears.
- [ ] Create booking.
- [ ] Confirm booking audit event appears if enabled.
- [ ] Filter audit by action type.
- [ ] Filter audit by date.
- [ ] Try audit page as non-admin and verify denied.
### Automated testing checklist
- [ ] Unit test audit event creation.
- [ ] Unit test filter validation.
- [ ] Integration test audit event consumer.
- [ ] Integration test audit list endpoint.
- [ ] Integration test audit details endpoint.
- [ ] Authorization test admin-only audit access.
- [ ] Frontend test audit table rendering.
- [ ] Frontend test audit filters.
### Completion criteria
- [ ] Audit events are stored.
- [ ] Admin can browse audit logs.
- [ ] Important admin actions are logged.
- [ ] Important status changes are logged.
- [ ] Audit Service owns its database.
### Suggested Git commit
feat(audit): add audit event logging and admin audit page
## Phase 16 — Integration and End-to-End Flows
### Goal
Connect services into complete renter, landlord, and admin journeys with cross-service testing, event testing, and final business flow validation.
### Why this phase matters
Features built separately can fail when combined. This phase proves that RentSphere works as a real system.
### Backend services involved
- api-gateway
- auth-service
- user-service
- listing-service
- media-service
- ai-review-service
- admin-moderation-service
- verification-service
- search-service
- booking-service
- payment-service
- chat-service
- notification-service
- audit-service
### Frontend areas involved
- Public website.
- Auth pages.
- Renter dashboard.
- Landlord dashboard.
- Admin dashboard.
- Listing flow.
- Search flow.
- Booking flow.
- Payment flow.
- Chat flow.
- Notification flow.
- Audit flow.
### Database changes
- Add missing indexes discovered during integration.
- Add seed data migrations or seed scripts.
- Add test data scripts for demo.
- Add migration fixes only through Flyway.
### API endpoints
- No major new endpoints expected.
- Fix and complete existing endpoints.
- Add internal health endpoint checks if missing.
- Add frontend /status or admin system health page if useful.
### Events
- Validate all previously defined events.
- Validate user.registered.
- Validate listing.submitted.
- Validate listing.reviewed.
- Validate listing.approved.
- Validate booking.requested.
- Validate booking.accepted.
- Validate payment.mock.completed.
- Validate chat.message.sent.
- Validate notification.requested.
- Validate audit.event.created.
### Backend tasks
- [ ] Review all REST contracts.
- [ ] Review all Kafka event contracts.
- [ ] Ensure every service handles missing downstream services gracefully where practical.
- [ ] Add correlation IDs across logs.
- [ ] Add consistent error responses to all services.
- [ ] Add missing authorization checks.
- [ ] Add missing validation checks.
- [ ] Add missing Swagger annotations.
- [ ] Add seed data for demo accounts.
- [ ] Add seed data for listings.
- [ ] Fix cross-service ID mismatches.
- [ ] Fix status transition mismatches.
- [ ] Confirm each service owns its own database.
- [ ] Remove accidental direct database access between services.
- [ ] Add integration test profiles.
- [ ] Add basic contract tests or documented contracts.
### Frontend tasks
- [ ] Test complete renter journey.
- [ ] Test complete landlord journey.
- [ ] Test complete admin journey.
- [ ] Fix route guards.
- [ ] Fix broken redirects.
- [ ] Fix inconsistent loading states.
- [ ] Fix inconsistent error messages.
- [ ] Ensure all dashboard links work.
- [ ] Ensure mobile layouts work.
- [ ] Ensure forms reset or preserve state correctly.
- [ ] Ensure token expiration behavior is acceptable.
- [ ] Add final empty states.
- [ ] Add final confirmation modals.
### DevOps tasks
- [ ] Run all services together through Docker Compose.
- [ ] Verify service startup order.
- [ ] Add health checks where missing.
- [ ] Add local troubleshooting guide.
- [ ] Add event topic creation notes.
- [ ] Add database reset instructions for demo.
- [ ] Add logs inspection instructions.
- [ ] Add full system run command.
- [ ] Add integration environment .env.example.
### Security rules
- [ ] All protected APIs require JWT.
- [ ] All role-specific APIs enforce role checks.
- [ ] Ownership checks are tested across services.
- [ ] Admin APIs require admin role.
- [ ] Sensitive files and documents are protected.
- [ ] No raw stack traces are returned.
- [ ] No secrets are logged.
- [ ] CORS is restricted.
- [ ] Public APIs expose only approved data.
### Validation rules
- [ ] Validate end-to-end form inputs.
- [ ] Validate backend errors display correctly in frontend.
- [ ] Validate all UUID path variables.
- [ ] Validate pagination parameters.
- [ ] Validate status transitions.
- [ ] Validate file upload limits.
- [ ] Validate date rules.
- [ ] Validate payment rules.
### Mocked parts
- Real AI model remains mocked.
- Real payment remains mocked.
- Real email/SMS remains mocked.
- WebSocket chat may remain placeholder if REST chat is sufficient.
- OpenSearch may remain planned.
- Cloud media storage may remain planned.
### Real parts
- Complete MVP journey.
- Cross-service REST communication.
- Kafka event-driven workflows.
- Role-based dashboards.
- End-to-end demo flow.
- Integrated Docker Compose environment.
### Manual testing checklist
- [ ] Register landlord.
- [ ] Register renter.
- [ ] Login as admin.
- [ ] Landlord creates listing.
- [ ] Landlord uploads images.
- [ ] Landlord submits listing.
- [ ] AI mock review runs.
- [ ] Admin approves listing.
- [ ] Renter searches listing.
- [ ] Renter opens listing details.
- [ ] Renter requests booking.
- [ ] Landlord accepts booking.
- [ ] Renter completes mock payment.
- [ ] Renter sends chat message.
- [ ] Landlord receives notification.
- [ ] Admin views audit logs.
- [ ] Repeat flow after restarting services.
### Automated testing checklist
- [ ] Run all backend unit tests.
- [ ] Run all backend integration tests.
- [ ] Run frontend tests.
- [ ] Run Angular production build.
- [ ] Add smoke test for gateway health.
- [ ] Add smoke test for auth login.
- [ ] Add smoke test for listing search.
- [ ] Add smoke test for booking flow if practical.
- [ ] Add event consumer tests for critical flows.
- [ ] Add CI workflow for tests and builds.
### Completion criteria
- [ ] Complete renter journey works.
- [ ] Complete landlord journey works.
- [ ] Complete admin journey works.
- [ ] Core events are verified.
- [ ] Frontend and backend work together through gateway.
- [ ] System can be demonstrated reliably.
### Suggested Git commit
test(integration): validate complete rentsphere user journeys
## Phase 17 — Deployment and DevOps
### Goal
Prepare production-style deployment with Dockerfiles for all services, Docker Compose, Angular production build, Nginx config, staging deployment, VPS option, Kubernetes/cloud option, CI/CD, secrets management, backups, and monitoring.
### Why this phase matters
A graduation project is stronger when it can be deployed, not just run locally. Deployment also exposes configuration, networking, and reliability issues early.
### Backend services involved
- All backend services.
### Frontend areas involved
- Angular production build.
- Static hosting behind Nginx.
- Runtime API base URL configuration if needed.
### Database changes
- Production database initialization scripts.
- Backup scripts.
- Migration execution strategy.
- No business schema changes unless required by deployment.
### API endpoints
- GET /actuator/health for every service.
- GET /actuator/info optional for every service.
- Gateway health endpoint.
- Optional admin system health page.
### Events
- Kafka topics must be created or auto-created in deployment.
- Event retention policy must be documented.
- Consumer group names must be configured.
### Backend tasks
- [ ] Add Dockerfile for api-gateway.
- [ ] Add Dockerfile for auth-service.
- [ ] Add Dockerfile for user-service.
- [ ] Add Dockerfile for listing-service.
- [ ] Add Dockerfile for media-service.
- [ ] Add Dockerfile for ai-review-service.
- [ ] Add Dockerfile for admin-moderation-service.
- [ ] Add Dockerfile for verification-service.
- [ ] Add Dockerfile for search-service.
- [ ] Add Dockerfile for booking-service.
- [ ] Add Dockerfile for payment-service.
- [ ] Add Dockerfile for chat-service.
- [ ] Add Dockerfile for notification-service.
- [ ] Add Dockerfile for audit-service.
- [ ] Configure production profiles.
- [ ] Configure actuator health checks.
- [ ] Configure structured logging.
- [ ] Ensure Flyway runs on startup or through deployment step.
- [ ] Verify services use environment variables only.
- [ ] Reduce exposed ports to gateway only in production.
### Frontend tasks
- [ ] Add Angular production build configuration.
- [ ] Add frontend Dockerfile.
- [ ] Add Nginx config for Angular routing fallback.
- [ ] Configure gateway API URL.
- [ ] Test production build locally.
- [ ] Test refresh on Angular routes.
- [ ] Verify static assets load correctly.
- [ ] Verify responsive UI in production build.
### DevOps tasks
- [ ] Create production-like docker-compose.prod.yml.
- [ ] Configure Nginx reverse proxy.
- [ ] Configure HTTPS plan using Let’s Encrypt.
- [ ] Configure service health checks.
- [ ] Configure PostgreSQL volumes.
- [ ] Configure media upload volume.
- [ ] Configure Redis persistence if needed.
- [ ] Configure Kafka data volume.
- [ ] Create .env.prod.example.
- [ ] Document VPS deployment option.
- [ ] Document Kubernetes/cloud option.
- [ ] Add GitHub Actions workflow for backend tests.
- [ ] Add GitHub Actions workflow for frontend tests.
- [ ] Add GitHub Actions workflow for Docker builds if practical.
- [ ] Add secrets management instructions.
- [ ] Add database backup script.
- [ ] Add database restore instructions.
- [ ] Add log viewing instructions.
- [ ] Add monitoring plan using Actuator, Prometheus, Grafana, or simple health checks.
- [ ] Add deployment checklist.
### Security rules
- [ ] Production secrets must not be committed.
- [ ] JWT secret must be strong.
- [ ] Database passwords must be strong.
- [ ] CORS must use production domain only.
- [ ] Internal services must not be publicly exposed.
- [ ] Nginx must route only expected paths.
- [ ] File upload size must be limited.
- [ ] Swagger should be restricted or disabled in production if needed.
- [ ] HTTPS should be used for public deployment.
- [ ] Admin seed password must be changed.
### Validation rules
- [ ] All required environment variables must be present.
- [ ] Containers must restart on failure.
- [ ] Health checks must pass.
- [ ] Migrations must run successfully.
- [ ] Angular production build must complete.
- [ ] Gateway must reach all services.
- [ ] Nginx must serve Angular routes.
- [ ] Backup script must create restorable backup.
### Mocked parts
- Kubernetes deployment can be documented instead of implemented.
- Cloud managed services can be documented instead of provisioned.
- Full Prometheus/Grafana can be optional.
- Real domain and HTTPS can be optional if no VPS is available.
- Real payment and AI remain mocked.
### Real parts
- Dockerfiles.
- Docker Compose deployment.
- Angular production serving.
- Nginx configuration.
- CI/CD basics.
- Secrets documentation.
- Backup documentation.
- Monitoring plan.
### Manual testing checklist
- [ ] Build all backend Docker images.
- [ ] Build frontend Docker image.
- [ ] Start production Compose stack.
- [ ] Open Angular through Nginx.
- [ ] Login through deployed gateway.
- [ ] Run final demo flow on deployed stack.
- [ ] Restart services and verify data persists.
- [ ] Test health endpoints.
- [ ] Test database backup.
- [ ] Test Angular route refresh.
- [ ] Confirm only expected ports are exposed.
### Automated testing checklist
- [ ] CI runs backend tests.
- [ ] CI runs frontend tests.
- [ ] CI runs Angular production build.
- [ ] CI builds Docker images if configured.
- [ ] Add smoke test script for deployment.
- [ ] Add container health check verification.
- [ ] Add migration verification step if practical.
### Completion criteria
- [ ] Project can run through production-like Docker Compose.
- [ ] Angular production build is served through Nginx.
- [ ] Gateway routes work in deployment.
- [ ] Environment variables are documented.
- [ ] CI/CD workflows exist.
- [ ] Backup and monitoring plans exist.
### Suggested Git commit
chore(devops): add production docker deployment and ci workflows
## Phase 18 — Final Testing, Documentation, and Graduation Demo
### Goal
Finalize bug fixing, seed data, demo accounts, presentation script, screenshots, README, API docs, and final checklist.
### Why this phase matters
The project must be stable and easy to present. Final polishing often determines how professional the project appears during evaluation.
### Backend services involved
- All backend services.
### Frontend areas involved
- All Angular pages.
- Demo-focused flows.
- Screenshots.
- Error-free navigation.
- Responsive verification.
### Database changes
- Demo seed data.
- Demo reset scripts.
- No risky schema changes unless absolutely necessary.
- Final Flyway migration verification.
### API endpoints
- No new core endpoints expected.
- Ensure Swagger/OpenAPI is available for services.
- Ensure demo endpoints are not added unless clearly safe and local-only.
### Events
- Verify demo-critical events.
- Verify notification events.
- Verify audit events.
- Verify listing approval events.
- Verify booking and payment events.
### Backend tasks
- [ ] Fix final backend bugs.
- [ ] Review all service READMEs.
- [ ] Review Swagger documentation.
- [ ] Add demo seed data.
- [ ] Add demo accounts.
- [ ] Add final service port table.
- [ ] Add final database table summary.
- [ ] Add event topic documentation.
- [ ] Add REST communication documentation.
- [ ] Add Kafka communication documentation.
- [ ] Add known limitations section.
- [ ] Add post-MVP roadmap section.
- [ ] Verify no secrets are committed.
- [ ] Verify migrations run from empty databases.
- [ ] Verify logs are clean during demo flow.
### Frontend tasks
- [ ] Fix final frontend bugs.
- [ ] Verify all routes.
- [ ] Verify responsive layouts.
- [ ] Add final text polish.
- [ ] Add screenshots.
- [ ] Add loading states where missing.
- [ ] Add empty states where missing.
- [ ] Add demo-friendly sample images.
- [ ] Verify all buttons in demo path work.
- [ ] Verify admin dashboard looks complete.
- [ ] Verify landlord dashboard looks complete.
- [ ] Verify renter dashboard looks complete.
### DevOps tasks
- [ ] Verify local setup from clean clone.
- [ ] Verify Docker Compose setup from clean clone.
- [ ] Verify production Compose setup if available.
- [ ] Verify README commands.
- [ ] Verify backup script.
- [ ] Verify CI status.
- [ ] Prepare final release tag if required.
- [ ] Prepare demo machine setup checklist.
- [ ] Prepare offline fallback screenshots or video if required.
- [ ] Export final API documentation if needed.
### Security rules
- [ ] Demo accounts use non-sensitive passwords.
- [ ] Production secrets are not included.
- [ ] Admin account password is documented only for demo environment.
- [ ] User documents used in demo are fake.
- [ ] Payment is clearly marked as mock.
- [ ] AI review is clearly marked as mock.
- [ ] Uploaded demo images are safe to use.
- [ ] Swagger exposure is acceptable for demo environment only.
### Validation rules
- [ ] All demo forms must pass validation with seed data.
- [ ] All invalid demo examples should show friendly errors.
- [ ] Demo data must be realistic.
- [ ] Demo accounts must have correct roles.
- [ ] Demo listings must have required images.
- [ ] Demo booking dates must be valid.
- [ ] Demo payment amount must be consistent.
### Mocked parts
- AI review remains mocked.
- Payment remains mocked.
- Email/SMS remain mocked.
- WebSocket may remain planned if not implemented.
- OpenSearch may remain planned if not implemented.
- Cloud storage may remain planned if not implemented.
### Real parts
- Complete MVP application.
- Final documentation.
- Final demo data.
- Final presentation flow.
- Dockerized deployment.
- API docs.
- Testing evidence.
### Manual testing checklist
- [ ] Run project from clean clone.
- [ ] Run full demo flow twice.
- [ ] Test admin login.
- [ ] Test landlord login.
- [ ] Test renter login.
- [ ] Test listing creation.
- [ ] Test image upload.
- [ ] Test AI review mock.
- [ ] Test admin approval.
- [ ] Test search.
- [ ] Test booking.
- [ ] Test mock payment.
- [ ] Test chat.
- [ ] Test notifications.
- [ ] Test audit logs.
- [ ] Test mobile layout.
- [ ] Test after service restart.
### Automated testing checklist
- [ ] Run all backend tests.
- [ ] Run all frontend tests.
- [ ] Run Angular production build.
- [ ] Run Docker build.
- [ ] Run integration smoke tests.
- [ ] Verify CI passes.
- [ ] Verify no high-risk lint errors.
- [ ] Verify no secrets in repository.
- [ ] Verify migrations from empty database.
### Completion criteria
- [ ] Final demo flow works reliably.
- [ ] Documentation is complete.
- [ ] Setup instructions are accurate.
- [ ] Demo data is ready.
- [ ] Deployment instructions are ready.
- [ ] All MVP features are tested.
- [ ] Team can present the project confidently.
### Suggested Git commit
docs: finalize graduation demo documentation and checklist
## 6. Recommended Sprint Plan
| Week | Sprint Focus | Main Deliverables |
| --- | --- | --- |
| Week 1 | Foundation | Repository, Docker Compose, Angular app, gateway, standards |
| Week 2 | Authentication | Auth Service, JWT, login/register, guards, interceptor |
| Week 3 | Profiles and UI | User Service, profile/settings, public website, UI system |
| Week 4 | Listings | Listing Service, landlord dashboard, create listing wizard |
| Week 5 | Media and AI Mock | Media upload, image validation, mock AI review |
| Week 6 | Admin Moderation | Admin dashboard, listing approval/rejection, platform stats |
| Week 7 | KYC and Search | Verification workflow, DB search, listing detail page |
| Week 8 | Booking and Payment Mock | Booking requests, landlord decisions, mock payment, escrow |
| Week 9 | Chat and Notifications | REST chat, in-app notifications, unread counts |
| Week 10 | Audit and Integration | Audit Service, full cross-service flows, event testing |
| Week 11 | Deployment | Dockerfiles, production Compose, Nginx, CI/CD, backup |
| Week 12 | Final Demo | Bug fixing, seed data, documentation, presentation rehearsal |
## 7. Daily Work Plan for Developer
### Daily Startup Checklist
- Pull latest code.
- Check current branch.
- Start infrastructure.
- Run affected backend services.
- Run Angular app.
- Check failing tests from previous day.
- Review current phase checklist.
- Pick one small task.
- Finish and test before starting another task.
### Day-by-Day Style Checklist
| Day Type | Work Checklist |
| --- | --- |
| Backend feature day | [ ] Create migration, [ ] Implement entity, [ ] Implement DTOs, [ ] Implement service logic, [ ] Implement controller, [ ] Add security, [ ] Add validation, [ ] Add tests, [ ] Test through Swagger |
| Frontend feature day | [ ] Create route, [ ] Create component, [ ] Create service method, [ ] Connect form, [ ] Add validation, [ ] Add loading state, [ ] Add error state, [ ] Test desktop, [ ] Test mobile |
| Integration day | [ ] Test frontend through gateway, [ ] Test JWT flow, [ ] Test service-to-service REST, [ ] Test Kafka event, [ ] Check logs, [ ] Fix contract mismatches |
| DevOps day | [ ] Update Docker Compose, [ ] Add environment variables, [ ] Test clean startup, [ ] Update README, [ ] Verify health endpoints |
| Testing day | [ ] Run backend tests, [ ] Run frontend tests, [ ] Add missing tests, [ ] Run manual checklist, [ ] Record bugs, [ ] Fix critical bugs |
| Documentation day | [ ] Update README, [ ] Update API docs, [ ] Update environment docs, [ ] Update demo script, [ ] Add screenshots |
### End-of-Day Checklist
- Code compiles.
- Angular app builds or affected page runs.
- Database migrations run.
- Manual test for completed task passes.
- Tests for affected code pass.
- README or docs updated if setup changed.
- Commit message follows convention.
- Known issue is written down if not fixed.
## 8. MVP vs Post-MVP
| Feature | MVP / Post-MVP | Reason |
| --- | --- | --- |
| JWT authentication | MVP | Required for all protected flows |
| Role-based dashboards | MVP | Required for renter, landlord, and admin journeys |
| User profiles | MVP | Required for account management and verification display |
| Public website | MVP | Required for professional presentation |
| Listing CRUD | MVP | Core marketplace feature |
| Listing image upload | MVP | Real-estate listings need images |
| Mock AI trust score | MVP | Strong demo feature with controlled scope |
| Admin listing moderation | MVP | Required before listings become public |
| KYC submission and review | MVP | Important trust workflow |
| Database search | MVP | Search is required for renter journey |
| Elasticsearch/OpenSearch | Post-MVP | Useful but not required for graduation MVP |
| Booking request workflow | MVP | Core transaction flow |
| Mock payment | MVP | Completes booking flow without payment risk |
| Real Stripe integration | Post-MVP | Requires security, legal, and financial complexity |
| REST chat | MVP | Demonstrates communication feature simply |
| WebSocket chat | Post-MVP | Better UX but REST chat is enough for MVP |
| In-app notifications | MVP | Connects workflows and shows event-driven behavior |
| Email/SMS notifications | Post-MVP | Requires external providers |
| Audit logs | MVP | Professional admin feature and useful for demo |
| Local media storage | MVP | Simple and reliable for local/demo deployment |
| S3 or Cloudinary storage | Post-MVP | Better production design but not required for MVP |
| Docker Compose deployment | MVP | Required for reliable local and staging deployment |
| Kubernetes deployment | Post-MVP | Advanced deployment |
## 9. Risk Management

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Trying to build all microservices at once | High delay and confusion | Build phase by phase and keep each phase runnable |
| Kafka complexity early | Integration delays | Use REST first where synchronous response is needed; add Kafka when the core service works |
| Payment integration complexity | Legal/security risk | Use mock payment for MVP and document Stripe as post-MVP |
| Real AI complexity | Unstable delivery | Use mock AI trust score first, then replace later |
| Deployment delayed to final week | Demo failure risk | Add Docker Compose and deployment checks from early phases |
| Frontend becomes inconsistent | Poor presentation quality | Build shared UI components and design system early |
| Cross-service data mismatch | Broken flows | Use stable DTOs, event schemas, and integration tests |
| Secret leakage | Security issue | Use `.env.example`, ignore real `.env`, and never commit secrets |
| Scope creep | Graduation project delay | Keep MVP strict and move advanced features to post-MVP |

## 10. Final Graduation Demo Flow

Use this exact scenario for the final presentation:

1. Login as Admin and show dashboard overview.
2. Login as Landlord and complete/update profile.
3. Landlord creates a rental listing draft.
4. Landlord uploads 3–20 listing images.
5. Landlord submits listing for review.
6. AI Review Service generates mock trust score and flags.
7. Admin opens moderation queue and reviews listing details.
8. Admin approves the listing.
9. Renter opens public search page and filters listings.
10. Renter opens approved listing details.
11. Renter sends booking request.
12. Landlord accepts booking request.
13. Renter completes mock payment.
14. Renter and landlord exchange chat messages.
15. Notifications appear for booking/payment/chat events.
16. Admin opens audit logs and shows recorded actions.
17. End by showing Docker Compose/deployment readiness and API documentation.

## 11. First Command To Start Building

After this Markdown file is created, give your AI coding assistant this instruction:

```text
Use this Markdown roadmap as the source of truth. Start implementing Phase 0 only. Do not continue to Phase 1 until I say continue. Generate complete files, commands, and testing steps for Phase 0.
```