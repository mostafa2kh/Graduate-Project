# RentSphere Port Map

## Infrastructure

| Service | Port | Container Name |
|---------|------|----------------|
| PostgreSQL | 5432 | rentsphere-postgres |
| Redis | 6379 | rentsphere-redis |
| Redpanda (Kafka) | 9092 | rentsphere-redpanda |
| Redpanda Console | 8080 | rentsphere-redpanda-console |

## Backend Services

| Service | Port |
|---------|------|
| API Gateway | 8080 |
| Auth Service | 8081 |
| User Service | 8082 |
| Listing Service | 8083 |
| Media Service | 8084 |
| AI Review Service | 8085 |
| Moderation Service | 8086 |
| Verification Service | 8087 |
| Search Service | 8088 |
| Booking Service | 8089 |
| Payment Service | 8090 |
| Chat Service | 8091 |
| Notification Service | 8092 |
| Audit Service | 8093 |

## Frontend

| Service | Port |
|---------|------|
| Angular Dev Server | 4200 |

## Notes

- The API Gateway runs on port 8080 and routes requests to internal services.
- Internal services are NOT exposed directly in production; only the gateway is public.
- In local development, each service can be started independently on its port.
- Port conflicts can be resolved by editing `.env` or `docker-compose.yml`.
