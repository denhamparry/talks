# Stage 1: Builder - Build slides from source
# Pinned to specific digest for reproducible builds (node:20-alpine as of 2025-12-03)
FROM node:20-alpine@sha256:16858294071a56ffd4cce9f17b57136cc39e41507b40e245b4f8e906f7a19463 AS builder

# Set working directory
WORKDIR /app

# Install Chromium for MARP PDF generation
RUN apk add --no-cache chromium

# Set Chromium path for Puppeteer and enable no-sandbox mode (required for Docker)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/bin/chromium-browser \
    CHROME_BIN=/usr/bin/chromium-browser

# Install dependencies with cache mount for faster builds (BuildKit feature)
# Copy package files first for better layer caching
COPY package*.json ./

# Use npm ci for deterministic builds and cache mount for npm cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production=false

# Copy source files (separated for better layer caching)
COPY marp.config.js ./
COPY themes/ ./themes/
COPY slides/ ./slides/
COPY templates/ ./templates/
COPY scripts/ ./scripts/

# Build HTML slides
# Temporarily disable PDF in config for Docker build (PDF requires sandbox)
RUN sed -i "s/pdf: true,/pdf: false,/" marp.config.js

# Build slides (HTML only, no PDF)
RUN npm run build

# Optional: Build PDFs separately if needed (adds ~170MB Chromium to image)
# RUN npm run build:pdf -- --allow-local-files -- --no-sandbox

# Stage 2: Development - Serve with live reload
# Pinned to specific digest for reproducible builds (node:20-alpine as of 2025-12-03)
FROM node:20-alpine@sha256:16858294071a56ffd4cce9f17b57136cc39e41507b40e245b4f8e906f7a19463 AS development

# Add labels for metadata
LABEL org.opencontainers.image.title="MARP Slides Development Server"
LABEL org.opencontainers.image.description="Development environment for MARP presentations with live reload"
LABEL org.opencontainers.image.source="https://github.com/denhamparry/talks"

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production=false

# Copy configuration (source files will be mounted via volumes)
COPY marp.config.js ./
COPY themes/ ./themes/

# Create directories for volume mounts
RUN mkdir -p slides templates dist

# Set NODE_ENV for development
ENV NODE_ENV=development

# Expose MARP dev server port
EXPOSE 8080

# Health check for development server
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1

# Default to serve mode with live reload
CMD ["npm", "run", "serve", "--", "--port", "8080", "--host", "0.0.0.0"]

# Stage 3: Production - Serve static files with nginx
# Pinned to specific digest for reproducible builds (nginx:alpine as of 2025-12-03)
FROM nginx:alpine@sha256:b3c656d55d7ad751196f21b7fd2e8d4da9cb430e32f646adcf92441b72f82b14 AS production

# Add labels for metadata
LABEL org.opencontainers.image.title="MARP Slides Production Server"
LABEL org.opencontainers.image.description="Production-ready nginx server for MARP presentations"
LABEL org.opencontainers.image.source="https://github.com/denhamparry/talks"

# Copy built slides from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Ensure proper permissions for nginx files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Cloud Run sets $PORT environment variable (default to 8080 for local use)
ENV PORT=8080

# Expose port (Cloud Run ignores this, uses $PORT)
EXPOSE 8080

# Health check for nginx (uses $PORT environment variable)
# interval=5s allows workflow to detect healthy status quickly (vs 30s)
# Use 127.0.0.1 instead of localhost to avoid IPv6 resolution issues with BusyBox wget
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/health || exit 1

# Start script: substitute $PORT in nginx config template and start nginx
# The /docker-entrypoint.sh script automatically processes templates in /etc/nginx/templates/
CMD ["nginx", "-g", "daemon off;"]
