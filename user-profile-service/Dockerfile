# Dockerfile for User Profile Service
FROM openjdk:17-jdk-alpine
# Set the working directory
WORKDIR /usr/src
# Set environment variables for MySQL configurations
ENV MYSQL_USERNAME=root
ENV MYSQL_PASSWORD=1234
ENV MYSQL_URL=jdbc:mysql://mysql:3306/newsapp?allowPublicKeyRetrieval=true&useSSL=false

# Create a temporary volume for the application
VOLUME /tmp

# Copy the JAR file to the container
COPY target/demo-0.0.1-SNAPSHOT.jar /usr/src/user-profile-service.jar

# Specify the entry point for the application
ENTRYPOINT ["java", "-jar", "/usr/src/user-profile-service.jar"]

# Expose the port the service will run on
EXPOSE 8081
