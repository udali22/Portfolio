# ========================================================
# Stage 1: Build the Vite React Application
# Uses Alpine Node; npm ci for reproducible installs
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first to exploit Docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application source code
COPY . .

# Compile production-ready static assets into /app/dist
RUN npm run build

# ========================================================
# Stage 2: Serve the production build with 'serve'
# - No Nginx inside this container.
# - 'serve' handles SPA routing (--single / -s flag).
# - Runs on port 3000 as the non-root 'node' user.
# - Image size: ~175 MB (Node.js runtime is larger than
#   nginx:alpine but this removes the duplicate Nginx layer).
# - Host Nginx (to be configured on Azure) will sit in
#   front and handle TLS, routing /api/* to backend:8000,
#   and routing / to this container on port 3000.
# ========================================================
FROM node:20-alpine AS runtime

# Install 'serve' globally (Vercel's static-file server).
# Pin to major version 14 for stability.
RUN npm install -g serve@14 \
    && npm cache clean --force

WORKDIR /app

# Copy only the compiled static assets from the builder stage.
# No source code, no node_modules from the build stage.
COPY --from=builder /app/dist ./dist

# node:20-alpine ships with a non-root 'node' user (uid 1000).
USER node

# serve listens on 3000 inside the container.
EXPOSE 3000

# Healthcheck: confirm serve is responding.
# wget is included in Alpine via busybox.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000 || exit 1

# -s  : SPA mode — unknown routes fall back to index.html
# -l  : listen port
CMD ["serve", "-s", "dist", "-l", "3000"]
