# Audit Service

Stores and serves audit events for admin governance.

- **Port:** 8093
- **Database:** rentsphere_audit_db
- **Dependencies:** All services (via events)

## Key Features

- Audit event storage from Kafka
- Admin audit log browsing with filters
- Recent activity widget
- Actor, action, entity type, and date range filters
- Append-only event log
