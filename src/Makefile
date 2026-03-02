#To-do make build, make up and make down
FILESPATH_PATH=.
# make build
build:
	@FILESPATH="$(FILESPATH_PATH)" docker compose -f compose.yml build
	@echo "Build completed successfully."

# make up
up: 
	@FILESPATH="$(FILESPATH_PATH)" docker compose -f compose.yml up

# make down
down:
	@FILESPATH="$(FILESPATH_PATH)" docker compose -f compose.yml down
ps:
	@FILESPATH="$(FILESPATH_PATH)" docker compose ps -a
	@echo "list all containers"
clean:
	@FILESPATH="$(FILESPATH_PATH)" docker compose -f compose.yml down --rmi 'all' -v
