#!/usr/bin/env bash
# =============================================================================
# backup.sh — DarLink PostgreSQL backup script
#
# Usage (called via `make backup` from src/):
#   ./scripts/backup.sh
#
# What it does:
#   1. Runs pg_dump inside the running `db` container
#   2. Compresses the dump to a timestamped .tar.gz in the backup volume
#   3. Writes a last_backup timestamp file for BackupHealthIndicator
#
# Output path (inside the db-backups named volume, mounted at /var/backups/darlink):
#   /var/backups/darlink/darlink_YYYY-MM-DD_HH-MM-SS.tar.gz
# =============================================================================

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
DB_CONTAINER="${DB_CONTAINER:-src-db-1}"        # docker compose service container name
DB_NAME="${DB_NAME:-DarLink}"
DB_USER="${DB_USER:-DarLink}"
BACKUP_DIR="/var/backups/darlink"               # path INSIDE the db container
TIMESTAMP="$(date -u +"%Y-%m-%dT%H-%M-%SZ")"
DUMP_FILE="${BACKUP_DIR}/darlink_${TIMESTAMP}.tar.gz"
STAMP_FILE="${BACKUP_DIR}/last_backup"

# ── Check that the db container is running ────────────────────────────────────
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  echo "❌  Container '${DB_CONTAINER}' is not running."
  echo "    Run 'make up' first, or set DB_CONTAINER= to the correct name."
  exit 1
fi

echo "📦  Starting backup of '${DB_NAME}' → ${DUMP_FILE}"

# ── Run pg_dump inside the container and pipe into gzip ──────────────────────
docker exec "${DB_CONTAINER}" bash -c \
  "pg_dump -U ${DB_USER} -d ${DB_NAME} --format=custom \
   | gzip > ${DUMP_FILE}"

echo "✅  Backup written: ${DUMP_FILE}"

# ── Write ISO-8601 timestamp for BackupHealthIndicator ───────────────────────
docker exec "${DB_CONTAINER}" bash -c \
  "echo '$(date -u +"%Y-%m-%dT%H:%M:%SZ")' > ${STAMP_FILE}"

echo "🕒  Timestamp updated: ${STAMP_FILE}"
echo ""
echo "Done. Backup size: $(docker exec "${DB_CONTAINER}" du -sh "${DUMP_FILE}" | cut -f1)"
