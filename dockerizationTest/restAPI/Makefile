run:
	@echo "Running the Docker container 'darlink-restapi' on port 8080..."
	docker run --name darlink-restapi -p 8080:8080 darlink-restapi:0.1

package:
	@echo "Packaging the Spring Boot application using Maven..."
	./src/mvnw package -DskipTests --file=./src/pom.xml
	@echo "Application packaged successfully."

build:
	@echo "Building the Docker image 'darlink-restapi'..."
	docker build -t darlink-restapi:0.1 .
	@echo "Docker image 'darlink-restapi' built successfully."