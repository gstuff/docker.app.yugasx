# Stage 1: Build the Vue.js application
FROM node:16 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# # Check if the dist directory is created
# RUN ls -l /app

# Stage 2: Serve the built application
FROM node:16 AS serve-stage
WORKDIR /www
COPY --from=build-stage /app/dist .

# # Check if the dist directory is created
# RUN ls -l /www

RUN npm install -g http-server
EXPOSE 8080
CMD ["http-server", "-p", "8080"]


# FROM node:14-slim as build-stage

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install
# # Install http-server globally
# RUN npm install -g http-server

# # Copy the rest of the application code
# COPY . .

# # Build the Vue.js application for production
# RUN npm run build

# WORKDIR /app/dist

# EXPOSE 8080

# CMD [ "http-server", "-p", "8080"]