# Dockerfile for News Service
FROM openjdk:17-jdk-alpine
VOLUME /tmp
COPY target/news-service-0.0.1-SNAPSHOT.jar news-service.jar
ENTRYPOINT ["java","-jar","/news-service.jar"]
EXPOSE 8083
