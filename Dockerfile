# Step 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy the project files
COPY pom.xml .
COPY src ./src
# Compile and package the JAR file
RUN mvn clean package -DskipTests

# Step 2: Create the final image to run the app
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]