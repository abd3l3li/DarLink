#this is the starge number 1 :)
FROM eclipse-temurin:21 AS builder

RUN apt-get update \
 && apt-get install -y maven \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

Copy pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

#this is the stage number 2 :)
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre

COPY --from=builder /app/target/*.jar /app.jar

COPY .env .

ENTRYPOINT ["java","-jar","/app.jar"]

#I use both concept [Layer Caching] and [Multi-Stage Builds]
#   So the final image only has the jre and the .jar file
