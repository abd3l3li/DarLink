#To-do make build, make up and make down
FILEPATH=backend/src/chat/
JAR_FILE_PATH=src/chat/target/*.jar
# make build
build:
	./$(FILEPATH)mvnw clean -DskipTests -f ./$(FILEPATH)pom.xml
	./$(FILEPATH)mvnw package -DskipTests -f ./$(FILEPATH)pom.xml
	@JAR_FILE="$(JAR_FILE_PATH)" docker compose -f compose.yml build
	@echo "Build completed successfully."

# make up
up: 
	@JAR_FILE="$(JAR_FILE_PATH)" docker compose -f compose.yml up

# make down
down:
	@JAR_FILE="$(JAR_FILE_PATH)" docker compose -f compose.yml down
ps:
	@JAR_FILE="$(JAR_FILE_PATH)" docker compose ps -a
	@echo "list all containers"
clean:
	./$(FILEPATH)mvnw clean -DskipTests -f ./$(FILEPATH)pom.xml
	@JAR_FILE="$(JAR_FILE_PATH)" docker compose -f compose.yml down --rmi 'all' -v
