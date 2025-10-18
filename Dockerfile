# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Copy environment variables for build
COPY .env* ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build files to Nginx
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom Nginx configuration if exists
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Default Nginx command
CMD ["nginx", "-g", "daemon off;"]
