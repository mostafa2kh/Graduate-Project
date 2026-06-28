#!/usr/bin/env bash
# RentSphere Database Backup Script
# Usage: ./scripts/backup.sh [output-dir]

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_USER="${POSTGRES_USER:-rentsphere}"
DB_PASS="${POSTGRES_PASSWORD:-rentsphere}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DATABASES=(
  rentsphere_auth_db
  rentsphere_user_db
  rentsphere_listing_db
  rentsphere_media_db
  rentsphere_ai_review_db
  rentsphere_moderation_db
  rentsphere_verification_db
  rentsphere_search_db
  rentsphere_booking_db
  rentsphere_payment_db
  rentsphere_chat_db
  rentsphere_notification_db
  rentsphere_audit_db
)

mkdir -p "$BACKUP_DIR"
echo "📦 Backing up all RentSphere databases to $BACKUP_DIR"

for db in "${DATABASES[@]}"; do
  echo "  → Backing up $db..."
  PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$db" \
    --format=custom \
    --file="$BACKUP_DIR/${db}_${TIMESTAMP}.dump" \
    --verbose 2>&1 | tail -1
done

echo "✅ Backup complete — $(du -sh "$BACKUP_DIR" | cut -f1) total"
echo ""
echo "To restore a database:"
echo "  pg_restore -h $DB_HOST -U $DB_USER -d <db_name> ${BACKUP_DIR}/<db_name>_${TIMESTAMP}.dump"
