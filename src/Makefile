help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  build       Build the Docker images"
	@echo "  up          Start the containers in detached mode"
	@echo "  run         Build and start the containers in detached mode"
	@echo "  up-d        Start the containers in detached mode"
	@echo "  down        Stop the containers"
	@echo "  clean       Stop and remove containers, networks, volumes"
	@echo "  fclean      Stop and remove containers, images, networks, volumes"
	@echo "  ps          List all containers"
	@echo "  logs        Show logs for a specific service (set SERVICE variable)"

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