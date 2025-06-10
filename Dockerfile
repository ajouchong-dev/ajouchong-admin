# Step 1: Build React App
FROM node:lts AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json separately to optimize caching
COPY package.json package-lock.json ./

# Install dependencies using frozen-lockfile to ensure consistency
RUN npm ci

# Copy only necessary files to avoid unnecessary rebuilds
COPY public public
COPY src src
COPY .env ./

# Set environment variables at build time
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_BASE_URL

ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

# Build the React application
RUN npm run build

# Step 2: Use lightweight Nginx Alpine for serving the React App
FROM nginx:alpine

# Set working directory for nginx
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy the React build output from the build stage
COPY --from=build /app/build .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
