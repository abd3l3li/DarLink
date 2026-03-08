FROM eclipse-temurin:21

#update java version

# this ARG geve the use the option to specify the jar file to be copied into the image, it defaults to target/*.jar
# e.g. docker build --build-arg FILESPATH=target/myapp.jar -t myapp:latest .
ARG FILESPATH=.

WORKDIR /app

COPY ${FILESPATH} .

RUN ./mvnw clean -DskipTests -f ./pom.xml
RUN ./mvnw package -DskipTests -f ./pom.xml

RUN mv target/*.jar /app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
