#To-do make build, make up and make down
FILEPATH=backend/src/simple_restAPI/
JAR_FILE_PATH=src/simple_restAPI/target/*.jar
# make build
build:
	./$(FILEPATH)mvnw clean package -DskipTests -f ./$(FILEPATH)pom.xml
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
	@JAR_FILE="$(JAR_FILE_PATH)" docker compose -f compose.yml down --rmi 'all' -v
