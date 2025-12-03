# Docker Deployment Guide

## Quick Start

### Local Development

```bash
docker-compose up dev
```

Visit <http://localhost:8080>

### Local Production

```bash
docker-compose --profile production up prod
```

Visit <http://localhost:8081>

## Cloud Deployment

### Google Cloud Run

```bash
gcloud run deploy talks \
  --image ghcr.io/denhamparry/talks:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Fly.io

```bash
fly launch --image ghcr.io/denhamparry/talks:latest
```

### Generic Container Platform

```bash
docker pull ghcr.io/denhamparry/talks:latest
docker run -p 80:80 ghcr.io/denhamparry/talks:latest
```

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
