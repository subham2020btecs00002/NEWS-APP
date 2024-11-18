# Dockerfile for Wishlist Service
FROM openjdk:17-jdk-alpine
VOLUME /tmp
COPY target/wishlist-service-0.0.1-SNAPSHOT.jar wishlist-service.jar
ENTRYPOINT ["java","-jar","/wishlist-service.jar"]
EXPOSE 8090
