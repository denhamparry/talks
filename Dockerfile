# Stage 1: Builder - Build slides from source
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

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

# Build HTML slides (PDF generation excluded for smaller image)
RUN npm run build

# Optional: Build PDFs if needed (adds build time but useful for downloads)
# RUN npm run build:pdf

# Stage 2: Development - Serve with live reload
FROM node:20-alpine AS development

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
FROM nginx:alpine AS production

# Add labels for metadata
LABEL org.opencontainers.image.title="MARP Slides Production Server"
LABEL org.opencontainers.image.description="Production-ready nginx server for MARP presentations"
LABEL org.opencontainers.image.source="https://github.com/denhamparry/talks"

# Copy built slides from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user (nginx alpine already runs as nginx user)
# Verify permissions on served files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check for nginx
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Switch to non-root user
USER nginx

# nginx runs in foreground by default
CMD ["nginx", "-g", "daemon off;"]
