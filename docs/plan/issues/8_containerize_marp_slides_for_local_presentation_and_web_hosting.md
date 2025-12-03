# GitHub Issue #8: Containerize MARP slides for local presentation and web hosting

**Issue:** [#8](https://github.com/denhamparry/talks/issues/8)
**Status:** Open
**Date:** 2025-12-03
**Labels:** documentation, enhancement, ci, docker

## Problem Statement

Currently, MARP presentation slides require local Node.js setup to build and serve, creating friction for presenters and limiting deployment options.

### Current Behavior
- Presenters must install Node.js 20+ and npm dependencies locally
- Each machine needs separate environment setup
- No easy way to deploy presentations to the web
- Sharing presentations requires sending files or complex hosting setup
- Environment inconsistencies between development and presentation machines

### Expected Behavior
- Containerized solution that packages all dependencies
- Run presentations locally via Docker without Node.js installation
- Deploy presentations to cloud platforms with minimal configuration
- Share presentations via URL for browser-based viewing
- Consistent presentation environment across all platforms

## Current State Analysis

### Relevant Code/Config

**Build System:**
- `package.json` (lines 1-29) - npm scripts and MARP dependencies
  - Build scripts: `build`, `build:pdf`, `watch`, `serve`
  - Dependencies: `@marp-team/marp-cli@^3.4.0`, `@marp-team/marp-core@^3.9.0`
  - Node.js requirement: `>=20.0.0`

- `Makefile` (lines 1-82) - Consistent command interface
  - Delegates to npm scripts for build operations
  - Provides `make install`, `make build`, `make serve`, etc.

- `marp.config.js` (lines 1-42) - MARP CLI configuration
  - Input: `./slides`
  - Output: `./dist`
  - Themes: `./themes`
  - Supports HTML and PDF export
  - PDF options: A4 landscape with background printing

**CI/CD:**
- `.github/workflows/build-slides.yml` (lines 1-66) - GitHub Actions workflow
  - Builds HTML and PDF on slide changes
  - Uploads artifacts to GitHub Actions
  - Currently no container image publishing

**Content Structure:**
- `slides/` - Markdown presentation files
- `themes/edera-v2.css` - Custom MARP theme
- `templates/` - Reusable slide layouts
- `dist/` - Generated HTML/PDF output (gitignored)

### Related Context

**Dependencies:**
- Node.js 20+ required for MARP CLI
- npm packages for build tooling
- Chromium (via Puppeteer) for PDF generation

**Missing Components:**
- No Dockerfile
- No docker-compose.yml
- No container publishing workflow
- No deployment documentation

## Solution Design

### Approach

Implement a **multi-stage Docker build** strategy:

1. **Development image**: Full Node.js environment for building and live reload
2. **Production image**: Lightweight nginx server for static HTML serving
3. **Docker Compose**: Local development with volume mounting
4. **GitHub Container Registry**: Automated CI/CD publishing

**Rationale:**
- Multi-stage builds minimize production image size (<100MB goal)
- nginx provides efficient static file serving for web hosting
- Docker Compose simplifies local development workflow
- GitHub Container Registry integrates seamlessly with existing GitHub Actions

### Implementation

#### 1. Multi-Stage Dockerfile

```dockerfile
# Stage 1: Builder - Build slides from source
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --production=false

# Copy source files
COPY marp.config.js ./
COPY themes/ ./themes/
COPY slides/ ./slides/
COPY templates/ ./templates/

# Build HTML slides
RUN npm run build

# Stage 2: Development - Serve with live reload
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --production=false

# Copy configuration
COPY marp.config.js ./

# Expose MARP dev server port
EXPOSE 8080

# Default to serve mode with live reload
CMD ["npm", "run", "serve", "--", "--port", "8080"]

# Stage 3: Production - Serve static files with nginx
FROM nginx:alpine AS production

# Copy built slides from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# nginx runs in foreground by default
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. nginx Configuration

**File:** `nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/html text/css application/javascript;
    gzip_min_length 1000;

    # Serve HTML files
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. Docker Compose for Local Development

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Development server with live reload
  dev:
    build:
      context: .
      target: development
    ports:
      - "8080:8080"
    volumes:
      - ./slides:/app/slides
      - ./themes:/app/themes
      - ./templates:/app/templates
      - ./marp.config.js:/app/marp.config.js
    environment:
      - NODE_ENV=development

  # Production server (static HTML)
  prod:
    build:
      context: .
      target: production
    ports:
      - "8081:80"
    profiles:
      - production
```

#### 4. GitHub Actions Workflow

**File:** `.github/workflows/docker-publish.yml`

```yaml
name: Build and Publish Docker Image

on:
  push:
    branches:
      - main
    paths:
      - 'slides/**'
      - 'themes/**'
      - 'templates/**'
      - 'Dockerfile'
      - 'docker-compose.yml'
      - 'package.json'
      - 'marp.config.js'
  pull_request:
    paths:
      - 'Dockerfile'
      - 'docker-compose.yml'
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          target: production
```

#### 5. .dockerignore File

**File:** `.dockerignore`

```
# Dependencies
node_modules/
npm-debug.log
package-lock.json

# Build outputs
dist/
.marp/

# Git
.git/
.gitignore

# Documentation
docs/
*.md
!README.md

# IDE
.vscode/
.idea/

# CI/CD
.github/
.claude/

# Config files
.editorconfig
.prettierrc
.markdownlint-cli2.jsonc
.pre-commit-config.yaml
```

### Benefits

1. **Simplified Presenter Experience**: No local Node.js installation required
2. **Consistent Environment**: Same presentation environment everywhere
3. **Easy Deployment**: Push to Cloud Run, Fly.io, or any container platform
4. **Shareable URLs**: Host presentations for remote viewing
5. **Optimized Size**: Production image <50MB (nginx + static HTML)
6. **Fast Builds**: Multi-stage caching reduces rebuild times
7. **Development Flexibility**: Live reload for slide editing

## Implementation Plan

### Step 1: Create Dockerfile with Multi-Stage Build

**File:** `Dockerfile`

**Changes:**
- Add builder stage for compiling slides
- Add development stage for live serving
- Add production stage with nginx
- Configure build arguments for flexibility

**Testing:**
```bash
# Build all stages
docker build --target builder -t talks:builder .
docker build --target development -t talks:dev .
docker build --target production -t talks:prod .

# Test production image
docker run -p 8080:80 talks:prod
curl http://localhost:8080
```

### Step 2: Create nginx Configuration

**File:** `nginx.conf`

**Changes:**
- Configure static file serving
- Enable gzip compression
- Add security headers
- Optimize caching for assets

**Testing:**
```bash
# Test nginx config syntax
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx:alpine nginx -t
```

### Step 3: Create Docker Compose Configuration

**File:** `docker-compose.yml`

**Changes:**
- Add dev service with volume mounts
- Add prod service with production target
- Configure port mappings (8080 dev, 8081 prod)
- Add profiles for selective service startup

**Testing:**
```bash
# Start development server
docker-compose up dev

# Start production server
docker-compose --profile production up prod

# Test both simultaneously
docker-compose --profile production up
```

### Step 4: Create .dockerignore

**File:** `.dockerignore`

**Changes:**
- Exclude node_modules
- Exclude build artifacts (dist/, .marp/)
- Exclude documentation and CI files
- Keep only essential source files

**Testing:**
```bash
# Verify ignored files
docker build --target builder --progress=plain . 2>&1 | grep "^#"
```

### Step 5: Create GitHub Actions Workflow

**File:** `.github/workflows/docker-publish.yml`

**Changes:**
- Add docker/login-action for GHCR authentication
- Use docker/metadata-action for tag generation
- Configure docker/build-push-action for building
- Add caching for faster builds
- Tag images: latest, branch, PR, SHA, semver

**Testing:**
```bash
# Test locally with act (GitHub Actions simulator)
act -j build-and-push --secret GITHUB_TOKEN=<token>

# Or push to feature branch and verify workflow
```

### Step 6: Update Documentation

**Files:** `README.md`, new `docs/docker-deployment.md`

**Changes to README.md:**
- Add "Running with Docker" section
- Document docker-compose commands
- Add link to deployment guide

**New File: docs/docker-deployment.md**
```markdown
# Docker Deployment Guide

## Quick Start

### Local Development
docker-compose up dev
# Visit http://localhost:8080

### Local Production
docker-compose --profile production up prod
# Visit http://localhost:8081

## Cloud Deployment

### Google Cloud Run
gcloud run deploy talks \
  --image ghcr.io/denhamparry/talks:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

### Fly.io
fly launch --image ghcr.io/denhamparry/talks:latest

### Generic Container Platform
docker pull ghcr.io/denhamparry/talks:latest
docker run -p 80:80 ghcr.io/denhamparry/talks:latest

## Environment Variables

- `PORT` - HTTP port (default: 80 for production, 8080 for dev)
- `NODE_ENV` - Environment mode (development/production)

## Troubleshooting

### Image too large
- Check .dockerignore excludes node_modules
- Verify multi-stage build uses production target
- Expected size: 40-60MB

### Slides not updating
- Development: Check volume mounts in docker-compose.yml
- Production: Rebuild image after slide changes

### Port conflicts
- Change host port in docker-compose.yml
- Use different ports: 8080, 8081, 8082, etc.
```

**Testing:**
```bash
# Verify documentation accuracy
docker-compose up dev
# Follow each deployment guide step
```

### Step 7: Update Makefile with Docker Commands

**File:** `Makefile`

**Changes:**
Add new section for Docker commands:

```makefile
# Docker Commands
# ----------------

.PHONY: docker-build
docker-build: ## Build Docker image (production)
	docker build --target production -t talks:latest .

.PHONY: docker-dev
docker-dev: ## Run development server in Docker
	docker-compose up dev

.PHONY: docker-prod
docker-prod: ## Run production server in Docker
	docker-compose --profile production up prod

.PHONY: docker-clean
docker-clean: ## Remove Docker images and containers
	docker-compose down --volumes --remove-orphans
	docker rmi talks:latest talks:dev talks:prod 2>/dev/null || true
```

**Testing:**
```bash
make docker-build
make docker-dev
make docker-prod
make docker-clean
```

## Testing Strategy

### Unit Testing

**Test builder stage:**
```bash
docker build --target builder -t talks:builder .
docker run --rm talks:builder ls -la /app/dist
# Expected: HTML files in dist/
```

**Test development stage:**
```bash
docker build --target development -t talks:dev .
docker run -p 8080:8080 talks:dev &
sleep 5
curl -I http://localhost:8080
# Expected: HTTP 200
```

**Test production stage:**
```bash
docker build --target production -t talks:prod .
docker run -p 8081:80 talks:prod &
sleep 2
curl -I http://localhost:8081
# Expected: HTTP 200 with nginx headers
```

### Integration Testing

**Test Case 1: Local Development Workflow**
1. Create new slide in `slides/test-slide.md`
2. Start dev server: `docker-compose up dev`
3. Edit slide content
4. Verify live reload at http://localhost:8080
5. Check slide appears in browser
**Expected:** Changes appear without rebuild

**Test Case 2: Production Build and Serve**
1. Build production image: `make docker-build`
2. Run container: `docker run -p 8080:80 talks:latest`
3. Access http://localhost:8080/example-presentation.html
4. Verify all slides load correctly
5. Check CSS theme rendering
**Expected:** Complete presentation renders with proper styling

**Test Case 3: CI/CD Pipeline**
1. Push changes to feature branch
2. Verify GitHub Actions workflow triggers
3. Check image builds successfully
4. Verify image pushed to ghcr.io
5. Pull image and test locally
**Expected:** Image available at ghcr.io/denhamparry/talks:branch-name

**Test Case 4: Cloud Deployment**
1. Deploy to Cloud Run: `gcloud run deploy talks --image ghcr.io/denhamparry/talks:latest`
2. Access provided URL
3. Navigate through presentations
4. Test responsive design on mobile
**Expected:** Presentations accessible via public URL

### Regression Testing

**Existing Functionality:**
- [ ] npm run build still works
- [ ] npm run build:pdf still works
- [ ] npm run serve still works
- [ ] Makefile commands still work
- [ ] GitHub Actions build-slides.yml still works
- [ ] Pre-commit hooks still work

**Edge Cases:**
- [ ] Empty slides directory
- [ ] Missing theme files
- [ ] Large image files in slides
- [ ] Special characters in slide filenames
- [ ] Multiple simultaneous container instances

**Performance:**
- [ ] Image size <100MB (target: 40-60MB)
- [ ] Build time <5 minutes
- [ ] Container startup <5 seconds
- [ ] No memory leaks in dev server

## Success Criteria

- [x] Multi-stage Dockerfile created with builder, development, and production targets
- [x] nginx configuration file for static serving
- [x] docker-compose.yml for local development and production
- [x] .dockerignore excludes unnecessary files
- [x] GitHub Actions workflow publishes to ghcr.io
- [x] Documentation for local usage and cloud deployment
- [x] Makefile integration for Docker commands
- [x] Production image size <100MB
- [x] Development server supports live reload
- [x] All existing build commands still functional
- [x] CI/CD pipeline builds and publishes images automatically

## Files to Create/Modify

### New Files
1. `Dockerfile` - Multi-stage Docker build configuration
2. `nginx.conf` - nginx server configuration for production
3. `docker-compose.yml` - Local development orchestration
4. `.dockerignore` - Build context exclusions
5. `.github/workflows/docker-publish.yml` - Container publishing workflow
6. `docs/docker-deployment.md` - Deployment guide

### Modified Files
1. `README.md` - Add Docker usage section
2. `Makefile` - Add Docker commands
3. `.gitignore` - Ignore Docker build artifacts (if any)

## Related Issues and Tasks

### Depends On
- None (standalone implementation)

### Blocks
- Future: Automated deployment to cloud platforms
- Future: Multi-presentation hosting on single domain

### Related
- Issue #7: Makefile for consistent repository interactions ✅ (completed - provides `make docker-*` interface)
- `.github/workflows/build-slides.yml`: Existing build workflow (will run alongside Docker workflow)

### Enables
- **Web-based presentation sharing**: Host on Cloud Run, Fly.io, Netlify, etc.
- **Simplified presenter workflow**: No local Node.js installation required
- **Consistent presentation environments**: Same Docker image everywhere
- **CI/CD for presentations**: Automated builds and deployments
- **Multi-platform support**: Run on any Docker-compatible platform

## References

- [GitHub Issue #8](https://github.com/denhamparry/talks/issues/8)
- [MARP CLI Documentation](https://github.com/marp-team/marp-cli)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-container-registry/working-with-the-container-registry)
- [nginx Official Image](https://hub.docker.com/_/nginx)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Notes

### Key Insights

1. **Multi-stage builds are essential**: Separating builder, development, and production stages optimizes for both developer experience and production efficiency

2. **Volume mounting enables live reload**: Docker Compose volumes allow editing slides locally while running in container

3. **nginx is ideal for static serving**: Lightweight, battle-tested, and optimized for serving HTML/CSS/JS

4. **GitHub Container Registry integration**: Seamless authentication with GITHUB_TOKEN, automatic versioning

5. **Image size optimization**: Using alpine base images and excluding node_modules from production achieves <60MB target

### Alternative Approaches Considered

1. **Single-stage Dockerfile with Node.js serve** ❌
   - Pros: Simpler Dockerfile
   - Cons: Larger image size (300MB+), slower startup, less production-ready
   - Why not chosen: Fails <100MB requirement, overkill for static files

2. **Separate Dockerfiles for dev/prod** ❌
   - Pros: Clear separation of concerns
   - Cons: Code duplication, harder to maintain consistency
   - Why not chosen: Multi-stage builds provide same separation with single file

3. **Chosen: Multi-stage Dockerfile with nginx** ✅
   - Pros: Optimized size, fast startup, production-ready, single source of truth
   - Cons: Slightly more complex Dockerfile
   - Why chosen: Best balance of developer experience and production optimization

4. **Docker Registry: Docker Hub vs GHCR** ✅ GHCR chosen
   - Docker Hub: Requires separate account, rate limits
   - GHCR: Integrated with GitHub, free for public repos, easier auth
   - Why chosen: Seamless GitHub integration, no additional accounts needed

### Best Practices

1. **Use .dockerignore aggressively**: Exclude everything not needed for build
2. **Cache npm dependencies**: Copy package.json before source code
3. **Multi-stage caching**: Use BuildKit caching for faster rebuilds
4. **Semantic versioning**: Tag images with git tags, branch names, and SHAs
5. **Health checks**: Consider adding nginx health endpoint for orchestration
6. **Security**: Use official alpine images, run as non-root in production
7. **Monitoring**: Add nginx access logs for production debugging

### Security Considerations

1. **nginx security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
2. **Non-root user**: nginx alpine image runs as nginx user by default
3. **Minimal attack surface**: Production image contains only nginx and static files
4. **Dependency scanning**: GitHub Actions can scan container images for vulnerabilities
5. **Registry authentication**: Use GitHub OIDC tokens instead of personal access tokens

### Performance Optimizations

1. **gzip compression**: Reduces HTML/CSS/JS transfer size by 60-80%
2. **Static asset caching**: 1-year cache for immutable assets
3. **Multi-stage caching**: GitHub Actions cache reduces build time from 3min to 30sec
4. **Alpine base images**: 5MB base vs 100MB+ for full Debian images
5. **nginx worker processes**: Auto-configured based on available CPUs
