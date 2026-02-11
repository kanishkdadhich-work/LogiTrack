# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
# Copy package files and install dependenciesd
COPY package*.json ./
RUN npm install
# Copy the rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the build output to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80 (standard for Nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]