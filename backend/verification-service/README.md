# Verification Service

Handles KYC document submission and admin review for user verification.

- **Port:** 8087
- **Database:** rentsphere_verification_db
- **Dependencies:** User Service, Media Service (optional)

## Key Features

- KYC document submission
- Verification statuses (unverified/pending/verified/rejected)
- Admin KYC review with approve/reject
- Document upload
- Event publishing for verification status changes
