# Auth Service

Handles user registration, login, JWT authentication, and role management.

- **Port:** 8081
- **Database:** rentsphere_auth_db
- **Dependencies:** None

## Key Features

- Register (renter/landlord) and login
- JWT access token generation and validation
- BCrypt password hashing
- Role-based authorization (ROLE_RENTER, ROLE_LANDLORD, ROLE_ADMIN)
- Refresh token placeholder
