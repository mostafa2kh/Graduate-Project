# Search Service

Public listing search with database-level filtering and pagination.

- **Port:** 8088
- **Database:** rentsphere_search_db
- **Dependencies:** Listing Service (via events)

## Key Features

- Search approved listings by city, price, bedrooms, amenities
- Database-level search (PostgreSQL)
- Pagination and sorting
- Listing detail view
- Event consumer for listing approval/rejection
- Post-MVP: OpenSearch migration documented
