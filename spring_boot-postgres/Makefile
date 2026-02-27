#To-do make build, make up and make down
FILEPATH=backend/src/postgres-spring_b-restAPI/

# make build
build:
	./$(FILEPATH)mvnw clean package -DskipTests -f ./$(FILEPATH)pom.xml
	./$(FILEPATH)mvnw package -DskipTests -f ./$(FILEPATH)pom.xml
	docker compose -f compose.yml build

# make up
up: build
	docker compose -f compose.yml up -d

# make down
down:
	docker compose -f compose.yml down
ps:
	@docker compose ps -a
	@echo "list all containers"
clean:
	docker compose -f compose.yml down --rmi 'all' -v
