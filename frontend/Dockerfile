# Build stage
FROM node:20-alpine AS builder

ARG VITE_API_URL
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (ignoring native scripts)
RUN npm install --ignore-scripts

# Copy application source
COPY . .

# Set build-time env variable for Vite compiler
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundles
RUN npm run build

# Production server stage (Nginx)
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
