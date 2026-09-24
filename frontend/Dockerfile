# ========================================================
# Stage 1: Build the Vite React Application
# Uses Alpine Node to keep builder layer lightweight
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy application source code
COPY . .

# Compile production-ready static assets into /app/dist
RUN npm run build

# ========================================================
# Stage 2: Serve static assets with ultra-lightweight Nginx
# Final image size is ~25MB with minimal RAM usage (~5-10MB)
# ========================================================
FROM nginx:1.27-alpine AS runtime

# Remove default boilerplate nginx HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration for SPA routing & Docker network proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose internal HTTP port
EXPOSE 80

# Production healthcheck to ensure the web server is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/healthz || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
