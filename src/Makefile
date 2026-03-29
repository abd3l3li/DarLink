help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  build          Build the Docker images"
	@echo "  up             Start the containers in detached mode"
	@echo "  run            Build and start the containers in detached mode"
	@echo "  up-d           Start the containers in detached mode"
	@echo "  down           Stop the containers"
	@echo "  clean          Stop and remove containers, networks, volumes"
	@echo "  fclean         Stop and remove containers, images, networks, volumes"
	@echo "  ps             List all containers"
	@echo "  logs           Show logs for a specific service (set SERVICE variable)"
	@echo "  ── Ops / Backup ──────────────────────────────────────────────────"
	@echo "  backup         Dump & compress the PostgreSQL database"
	@echo "  restore        Restore a backup (usage: make restore FILE=<filename>)"
	@echo "  backup-prune   Delete backups older than 7 days"

build:
	@docker compose build

up:
	@docker compose up

run: build
	@docker compose up -d
	@echo "\033[32mContainers are up and running!\033[0m"
	@echo "\033[32mProduction: https://localhost:1337\033[0m"
	@echo "\033[32mDevelopment: http://localhost:5173\033[0m"

up-d:
	@docker compose up -d

down:
	@docker compose down

clean:
	@docker compose down -v
	@docker volume prune -f

fclean: clean
	@docker compose down --rmi 'all' -v
	@docker image prune -f

ps:
	@docker compose ps -a

logs:
	@docker compose logs $(SERVICE)

re: down run

# ── Ops: Backup & Restore ──────────────────────────────────────────────────────

## Create a timestamped, compressed .tar.gz dump of the PostgreSQL database.
backup:
	@bash scripts/backup.sh

## Restore a specific backup into the database.
## Usage: make restore FILE=darlink_2025-06-01T12-00-00Z.tar.gz
restore:
	@if [ -z "$(FILE)" ]; then \
		echo "Error: FILE is required. Usage: make restore FILE=<backup-filename>"; \
		exit 1; \
	fi
	@bash scripts/restore.sh "$(FILE)"

## Prune backups older than 7 days from the backup volume.
backup-prune:
	@echo "🗑️   Pruning backups older than 7 days…"
	@docker exec "$${DB_CONTAINER:-src-db-1}" bash -c \
		"find /var/backups/darlink -name '*.tar.gz' -mtime +7 -print -delete"
	@echo "✅  Prune complete."