#!/usr/bin/env bash
# =============================================================================
# restore.sh — DarLink PostgreSQL restore script
#
# Usage:
#   ./scripts/restore.sh <backup-filename>
#
# Example:
#   ./scripts/restore.sh darlink_2025-06-01T12-00-00Z.tar.gz
#
# The file must exist inside the db-backups volume at /var/backups/darlink/.
# =============================================================================

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
DB_CONTAINER="${DB_CONTAINER:-src-db-1}"
DB_NAME="${DB_NAME:-DarLink}"
DB_USER="${DB_USER:-DarLink}"
BACKUP_DIR="/var/backups/darlink"

# ── Argument validation ───────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-filename>"
  echo ""
  echo "Available backups:"
  docker exec "${DB_CONTAINER}" ls -lh "${BACKUP_DIR}"/*.tar.gz 2>/dev/null \
    || echo "  (no backups found)"
  exit 1
fi

BACKUP_FILE="${1}"
FULL_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# ── Check container is running ────────────────────────────────────────────────
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  echo "❌  Container '${DB_CONTAINER}' is not running."
  exit 1
fi

# ── Check the backup file exists inside the container ────────────────────────
if ! docker exec "${DB_CONTAINER}" test -f "${FULL_PATH}"; then
  echo "❌  Backup file not found inside container: ${FULL_PATH}"
  echo ""
  echo "Available backups:"
  docker exec "${DB_CONTAINER}" ls -lh "${BACKUP_DIR}"/*.tar.gz 2>/dev/null \
    || echo "  (none)"
  exit 1
fi

# ── Safety confirmation ───────────────────────────────────────────────────────
echo "⚠️   WARNING: This will REPLACE all data in '${DB_NAME}'."
echo "    Backup file: ${FULL_PATH}"
echo ""
read -r -p "Type 'yes' to confirm restore: " CONFIRM
if [[ "${CONFIRM}" != "yes" ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "🔄  Restoring '${DB_NAME}' from ${BACKUP_FILE}…"

# ── Drop & recreate the database, then restore ────────────────────────────────
docker exec "${DB_CONTAINER}" bash -c "
  psql -U ${DB_USER} -d postgres -c 'DROP DATABASE IF EXISTS \"${DB_NAME}\" WITH (FORCE);'
  psql -U ${DB_USER} -d postgres -c 'CREATE DATABASE \"${DB_NAME}\";'
  gunzip -c ${FULL_PATH} | pg_restore -U ${DB_USER} -d ${DB_NAME} --no-owner --role=${DB_USER}
"

echo ""
echo "✅  Restore complete. Database '${DB_NAME}' has been restored from:"
echo "    ${FULL_PATH}"
