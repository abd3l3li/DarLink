FROM eclipse-temurin:21

#update java version

# this ARG geve the use the option to specify the jar file to be copied into the image, it defaults to target/*.jar
# e.g. docker build --build-arg JAR_FILE=target/myapp.jar -t myapp:latest .
ARG JAR_FILE=src/simple_restAPI/target/*.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]