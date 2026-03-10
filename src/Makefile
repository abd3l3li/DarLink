build:
	docker compose build

up:
	docker compose up

run: build
	docker compose up

up-d:
	docker compose up

down:
	docker compose down

clean:
	docker compose down -v
	docker volume prune

fclean: clean
	docker compose down --rmi 'all' -v
	docker image prune

ps:
	docker compose ps -a

logs:
	docker compose logs $(sr)