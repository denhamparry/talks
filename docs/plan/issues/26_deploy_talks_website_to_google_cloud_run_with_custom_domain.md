# GitHub Issue #26: Deploy talks website to Google Cloud Run with custom domain

**Issue:** [#26](https://github.com/denhamparry/talks/issues/26)
**Status:** ✅ Complete - Deployed to Cloud Run
**Date:** 2025-12-03
**Labels:** enhancement, ci, docker, infrastructure
**Commits:** ef379b4, 8a7dcc8, 6eb0c6c
**Live URL:** https://talks-192861381104.europe-west1.run.app

## Problem Statement

MARP presentation slides are currently only available locally or as build artifacts. There's no public hosting solution, making it difficult to share presentations with conference attendees and remote viewers.

### Current Behavior
- Presentations can only be viewed locally via `npm run serve` or Docker
- Docker images published to GHCR (ghcr.io/denhamparry/talks:latest) but not deployed
- No public URL for accessing presentations
- Manual sharing requires sending files or setting up personal hosting

### Expected Behavior
- Presentations publicly accessible at `talks.denhamparry.co.uk`
- Automatic deployments when slides are updated on main branch
- Low-cost serverless hosting (utilizing Cloud Run free tier)
- Custom domain with HTTPS managed certificates
- Fast global access to presentations

## Current State Analysis

### Relevant Code/Config

**Existing Docker Infrastructure (Issue #8 - Complete):**

The repository already has a complete containerization setup:

1. **Dockerfile** (lines 1-109) - Multi-stage build with production target
   - Stage 1: Builder (node:20-alpine) - Builds slides with MARP CLI
   - Stage 2: Development - Live reload server (port 8080)
   - Stage 3: Production (nginx:alpine) - Static file serving (port 80)
   - Health check endpoint at /health (nginx.conf:90-94)
   - Production image ~40-60MB

2. **nginx.conf** (lines 1-96) - Production-ready nginx configuration
   - Static file serving from /usr/share/nginx/html
   - Gzip compression enabled (6:1 compression ratio)
   - Security headers (X-Frame-Options, CSP, X-Content-Type-Options)
   - Cache headers (1-year for immutable assets, no-cache for HTML)
   - Health check endpoint: `GET /health` returns 200 "healthy"

3. **docker-compose.yml** (lines 1-28) - Local development and testing
   - Dev service: Port 8080 with volume mounting
   - Prod service: Port 8081 for production testing

4. **GitHub Actions - Docker Publish** (.github/workflows/docker-publish.yml, lines 1-155)
   - Builds and publishes to ghcr.io/denhamparry/talks:latest
   - Multi-architecture (amd64, arm64)
   - Triggers on main branch pushes to slides/themes/templates
   - Security attestations and SBOM generation
   - Image verification and smoke tests
   - Latest image available: ghcr.io/denhamparry/talks:latest

**Missing Infrastructure for Cloud Run Deployment:**

1. **No Cloud Run deployment workflow** - No GitHub Actions workflow to deploy to Cloud Run
2. **No Google Cloud authentication** - No Workload Identity Federation or service account setup
3. **No domain mapping configuration** - No Cloud Run domain mapping for talks.denhamparry.co.uk
4. **No DNS configuration** - No DNS records for subdomain
5. **No Cloud Run service configuration** - No service YAML or gcloud commands

### Related Context

**Google Cloud Run Requirements:**

- **Container compatibility**: Cloud Run requires containers that:
  - Listen on port defined by $PORT environment variable (default: 8080)
  - Start within 240 seconds
  - Respond to HTTP health checks
  - Run as non-root user (recommended)

- **Current Dockerfile assessment**:
  - ✅ Production target uses nginx:alpine
  - ✅ Health check endpoint at /health
  - ❌ Hardcoded to port 80 (needs $PORT support)
  - ✅ Runs as nginx user (non-root)

**Google Cloud Run Free Tier (2025):**
- 2 million requests/month
- 360,000 GB-seconds/month compute time
- 180,000 vCPU-seconds/month
- 100 GB egress/month to North America
- First container instance always free
- **Expected cost**: $0/month for low-traffic presentation site

**Domain Requirements:**
- Domain: talks.denhamparry.co.uk
- DNS provider access needed (to create CNAME/A records)
- Domain verification in Google Cloud Console
- Managed SSL certificate (automatic via Cloud Run)

**Deployment Strategy Options:**

1. **GitHub Actions with Workload Identity Federation** (recommended)
   - No service account keys stored in GitHub
   - OIDC-based authentication
   - More secure, Google-recommended approach

2. **GitHub Actions with Service Account Key** (simpler but less secure)
   - Store service account key JSON in GitHub Secrets
   - Easier initial setup
   - Security risk if repository compromised

### Research Findings (2025 Best Practices)

**Cloud Run Port Configuration:**
- Cloud Run injects $PORT environment variable (typically 8080)
- Container must listen on $PORT, not hardcoded port 80
- nginx needs configuration to read $PORT from environment
- Common pattern: envsubst to replace port in nginx config at startup

**GitHub Actions for Cloud Run Deployment:**
- Use google-github-actions/auth@v2 for Workload Identity Federation
- Use google-github-actions/deploy-cloudrun@v2 for deployment
- Requires OIDC token permissions: id-token: write
- Service must be created first (gcloud run deploy or Console)

**Domain Mapping Steps:**
1. Verify domain ownership in Google Cloud Console
2. Create Cloud Run domain mapping: gcloud run domain-mappings create
3. Add DNS records (CNAME or A/AAAA) to domain provider
4. Wait for certificate provisioning (5-15 minutes)

## Solution Design

### Approach

Implement **automated Cloud Run deployment** with custom domain mapping:

1. **Modify Dockerfile** to support dynamic port configuration for Cloud Run
2. **Create Cloud Run deployment workflow** using GitHub Actions with Workload Identity Federation
3. **Configure Google Cloud infrastructure** (service account, Workload Identity, domain mapping)
4. **Update DNS records** to point talks.denhamparry.co.uk to Cloud Run
5. **Document deployment process** for future reference

**Rationale:**
- Cloud Run is serverless - no infrastructure to manage, automatic scaling
- Free tier covers expected low traffic (conference attendees)
- Existing Docker infrastructure requires minimal changes
- GitHub Actions automates deployment on every main branch push
- Custom domain provides professional, memorable URL

### Trade-offs Considered

**Cloud Run vs Alternatives:**

1. **Cloud Run** (chosen) ✅
   - Pros: Serverless, scales to zero, generous free tier, automatic HTTPS
   - Cons: Cold start latency (2-5s), requires $PORT support
   - Cost: $0/month (within free tier)

2. **Vercel/Netlify** ❌
   - Pros: Simple deployment, built for static sites
   - Cons: Less control, vendor lock-in, requires rebuilding in their platform
   - Why not chosen: Already have Docker images in GHCR, prefer portable solution

3. **Cloud Storage + Load Balancer** ❌
   - Pros: Extremely low cost, no compute
   - Cons: More complex setup, separate load balancer costs, no container reuse
   - Why not chosen: Overkill for this use case, Cloud Run simpler

4. **GitHub Pages** ❌
   - Pros: Free, simple, integrated with GitHub
   - Cons: Must be on github.io subdomain or apex domain, no custom subdomain support easily
   - Why not chosen: Want custom subdomain talks.denhamparry.co.uk

### Implementation Details

#### 1. Modify Dockerfile for Cloud Run Port Support

**File:** `Dockerfile`

**Changes to production stage (lines 77-108):**

```dockerfile
# Stage 3: Production - Serve static files with nginx
FROM nginx:alpine@sha256:b3c656d55d7ad751196f21b7fd2e8d4da9cb430e32f646adcf92441b72f82b14 AS production

# ... (existing labels and file copying) ...

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Ensure proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Cloud Run sets $PORT environment variable (default to 8080)
ENV PORT=8080

# Expose port (documentation only, Cloud Run uses $PORT)
EXPOSE 8080

# Health check (adjusted for dynamic port)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Start script to substitute environment variables and start nginx
CMD ["/bin/sh", "-c", "envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

**Changes to nginx.conf (lines 1-2):**

```nginx
server {
    listen ${PORT};
    server_name localhost;
    # ... (rest of config unchanged) ...
}
```

**Why this approach:**
- Cloud Run requires listening on $PORT (injected at runtime)
- envsubst replaces ${PORT} in nginx config at container startup
- Maintains compatibility with local Docker (defaults to 8080)
- No code changes needed, only configuration

#### 2. Create Google Cloud Infrastructure

**Prerequisites:**
- gcloud CLI installed and authenticated
- Google Cloud billing account
- Domain ownership of denhamparry.co.uk

**Step 2.0: Create Google Cloud Project with Billing Alerts**

```bash
# Create new project
gcloud projects create denhamparry-talks \
  --name="Denhamparry Talks" \
  --set-as-default

# Link billing account (get billing account ID first)
gcloud billing accounts list
export BILLING_ACCOUNT_ID="<your-billing-account-id>"

gcloud billing projects link denhamparry-talks \
  --billing-account=$BILLING_ACCOUNT_ID

# Create budget alert for £10/month (~$12)
gcloud billing budgets create \
  --billing-account=$BILLING_ACCOUNT_ID \
  --display-name="Talks Monthly Budget" \
  --budget-amount=12.00 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100 \
  --threshold-rule=percent=110

# Enable cost tracking
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbilling.googleapis.com
```

**Step 2.1: Create Service Account for Cloud Run**

```bash
# Set project ID (new project)
export PROJECT_ID="denhamparry-talks"
export SERVICE_NAME="talks"
export REGION="europe-west2"  # London

# Create service account for Cloud Run service
gcloud iam service-accounts create cloudrun-talks-sa \
  --display-name="Cloud Run Talks Service Account" \
  --project=$PROJECT_ID

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:cloudrun-talks-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

**Step 2.2: Create Service Account for GitHub Actions Deployment**

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions-cloudrun \
  --display-name="GitHub Actions Cloud Run Deployer" \
  --project=$PROJECT_ID

# Grant Cloud Run permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User role (required to deploy as service account)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Grant Artifact Registry read access (to pull from ghcr.io via Cloud Run)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.reader"
```

**Step 2.3: Configure Workload Identity Federation**

```bash
# Create Workload Identity Pool
gcloud iam workload-identity-pools create github-pool \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  --project=$PROJECT_ID

# Create Workload Identity Provider for GitHub
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='denhamparry/talks'" \
  --project=$PROJECT_ID

# Bind service account to GitHub repository
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/denhamparry/talks" \
  --project=$PROJECT_ID

# Get Workload Identity Provider resource name (needed for GitHub Actions)
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)" \
  --project=$PROJECT_ID
```

**Step 2.4: Enable Required APIs**

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com --project=$PROJECT_ID

# Enable Compute Engine API (required for domain mapping)
gcloud services enable compute.googleapis.com --project=$PROJECT_ID

# Enable Cloud Domains API (for domain verification)
gcloud services enable domains.googleapis.com --project=$PROJECT_ID
```

**Step 2.5: Create Initial Cloud Run Service**

```bash
# Deploy initial service (can be updated by GitHub Actions later)
gcloud run deploy $SERVICE_NAME \
  --image=ghcr.io/denhamparry/talks:latest \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --port=8080 \
  --min-instances=0 \
  --max-instances=10 \
  --memory=256Mi \
  --cpu=1 \
  --timeout=60s \
  --service-account=cloudrun-talks-sa@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID
```

#### 3. Create GitHub Actions Deployment Workflow

**File:** `.github/workflows/cloudrun-deploy.yml`

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - 'slides/**'
      - 'themes/**'
      - 'templates/**'
      - 'Dockerfile'
      - 'nginx.conf'
      - 'package.json'
      - 'marp.config.js'
      - '.github/workflows/cloudrun-deploy.yml'
  workflow_dispatch:

env:
  PROJECT_ID: 'denhamparry-talks'  # New GCP project
  REGION: 'europe-west2'  # London region
  SERVICE_NAME: 'talks'
  IMAGE_NAME: 'ghcr.io/denhamparry/talks:latest'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write  # Required for OIDC authentication

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'github-actions-cloudrun@${{ env.PROJECT_ID }}.iam.gserviceaccount.com'

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Deploy to Cloud Run
        id: deploy
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: ${{ env.SERVICE_NAME }}
          region: ${{ env.REGION }}
          image: ${{ env.IMAGE_NAME }}
          flags: |
            --platform=managed
            --allow-unauthenticated
            --port=8080
            --min-instances=0
            --max-instances=10
            --memory=256Mi
            --cpu=1
            --timeout=60s
            --service-account=cloudrun-talks-sa@${{ env.PROJECT_ID }}.iam.gserviceaccount.com

      - name: Verify deployment
        run: |
          SERVICE_URL=$(gcloud run services describe ${{ env.SERVICE_NAME }} \
            --region=${{ env.REGION }} \
            --format='value(status.url)')

          echo "Service deployed to: $SERVICE_URL"

          # Test health endpoint
          curl -f "$SERVICE_URL/health" || (echo "Health check failed" && exit 1)

          # Test homepage
          curl -f -I "$SERVICE_URL/" || (echo "Homepage check failed" && exit 1)

          echo "::notice::Deployment successful to $SERVICE_URL"

      - name: Output deployment URL
        run: |
          echo "### Deployment Successful! 🚀" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**Service URL:** ${{ steps.deploy.outputs.url }}" >> $GITHUB_STEP_SUMMARY
          echo "**Region:** ${{ env.REGION }}" >> $GITHUB_STEP_SUMMARY
          echo "**Image:** ${{ env.IMAGE_NAME }}" >> $GITHUB_STEP_SUMMARY
```

**Required GitHub Secrets/Variables:**

Add to repository settings → Secrets and variables → Actions:

- `GCP_PROJECT_ID` - Google Cloud project ID
- `GCP_WORKLOAD_IDENTITY_PROVIDER` - Workload Identity Provider resource name

#### 4. Configure Custom Domain Mapping

**Step 4.1: Verify Domain Ownership**

```bash
# Verify domain in Google Cloud Console
# Navigate to: Cloud Console → Cloud Run → Manage Custom Domains → Verify Domain
# Follow DNS verification instructions for denhamparry.co.uk
```

**Step 4.2: Map Custom Domain to Cloud Run Service**

```bash
# Create domain mapping
gcloud run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=talks.denhamparry.co.uk \
  --region=$REGION \
  --project=$PROJECT_ID

# Get DNS record details
gcloud run domain-mappings describe \
  --domain=talks.denhamparry.co.uk \
  --region=$REGION \
  --project=$PROJECT_ID
```

**Step 4.3: Update DNS Records (Cloudflare)**

Output from previous command will show required DNS records. Add to Cloudflare DNS for denhamparry.co.uk:

```
Type: CNAME
Name: talks
Target: ghs.googlehosted.com
TTL: Auto
Proxy status: DNS only (disable orange cloud initially)
```

**Important for Cloudflare:**
1. Initially disable Cloudflare proxy (grey cloud icon) during certificate provisioning
2. After SSL certificate active (5-15 minutes), optionally enable proxy (orange cloud) for:
   - DDoS protection
   - Additional CDN caching
   - Cloudflare analytics
3. Cloudflare's flexible SSL mode works with Cloud Run's managed certificates

**Step 4.4: Wait for Certificate Provisioning**

```bash
# Check certificate status
gcloud run domain-mappings describe \
  --domain=talks.denhamparry.co.uk \
  --region=$REGION \
  --project=$PROJECT_ID \
  --format="value(status.conditions)"

# Certificate provisioning takes 5-15 minutes
# Status will change from "CertificateProvisioning" to "Ready"
```

#### 5. Update Documentation

**File:** `README.md` - Add deployment section

```markdown
## Deployment

This repository automatically deploys to Google Cloud Run at [talks.denhamparry.co.uk](https://talks.denhamparry.co.uk) when changes are pushed to the main branch.

### Viewing Presentations

All presentations are available at:
- **Production:** https://talks.denhamparry.co.uk
- **Cloud Run URL:** https://talks-<hash>-uc.a.run.app

### Deployment Pipeline

1. Push slides to main branch
2. GitHub Actions builds Docker image (`.github/workflows/docker-publish.yml`)
3. Image published to ghcr.io/denhamparry/talks:latest
4. GitHub Actions deploys to Cloud Run (`.github/workflows/cloudrun-deploy.yml`)
5. Available at talks.denhamparry.co.uk within 2-3 minutes

### Manual Deployment

```bash
# Deploy latest image
gcloud run deploy talks \
  --image=ghcr.io/denhamparry/talks:latest \
  --region=us-central1 \
  --project=your-project-id
```
```

**New File:** `docs/deployment-guide.md`

```markdown
# Cloud Run Deployment Guide

## Overview

This repository deploys MARP presentations to Google Cloud Run with custom domain `talks.denhamparry.co.uk`.

## Architecture

```
GitHub → Docker Build → GHCR → Cloud Run → talks.denhamparry.co.uk
```

1. **GitHub Actions** builds Docker image on main branch push
2. **GHCR** (GitHub Container Registry) stores image at ghcr.io/denhamparry/talks:latest
3. **Cloud Run** pulls image and deploys to us-central1 region
4. **Custom domain** talks.denhamparry.co.uk mapped with managed SSL certificate

## Infrastructure Components

### Google Cloud Run Service
- **Name:** talks
- **Region:** us-central1
- **Image:** ghcr.io/denhamparry/talks:latest
- **Resources:** 256Mi memory, 1 vCPU
- **Scaling:** 0-10 instances (scales to zero when idle)
- **Port:** 8080 (dynamic via $PORT)

### Authentication
- **Method:** Workload Identity Federation (OIDC)
- **Service Account:** github-actions-cloudrun@PROJECT_ID.iam.gserviceaccount.com
- **Permissions:** roles/run.admin, roles/iam.serviceAccountUser

### Domain Configuration
- **Domain:** talks.denhamparry.co.uk
- **DNS Record:** CNAME → ghs.googlehosted.com
- **SSL Certificate:** Managed by Google Cloud (automatic renewal)

## Cost Estimate

**Expected: $0/month** (within Cloud Run free tier)

- Requests: ~1,000/month (conference attendees)
- Compute time: ~10 GB-seconds/month
- Free tier: 2,000,000 requests/month, 360,000 GB-seconds/month

## Troubleshooting

### Deployment fails with authentication error
- Verify Workload Identity Provider is configured correctly
- Check service account has roles/run.admin permission
- Ensure repository name matches in attribute-condition

### Domain not accessible
- Verify DNS records propagated (use `dig talks.denhamparry.co.uk`)
- Check certificate status: `gcloud run domain-mappings describe`
- Wait 5-15 minutes for certificate provisioning

### Health check fails
- Verify /health endpoint works locally: `curl http://localhost:8080/health`
- Check Cloud Run logs: `gcloud run services logs read talks --region=us-central1`
- Ensure $PORT is correctly substituted in nginx.conf

### Cold start latency
- First request after idle takes 2-5 seconds (Cloud Run starts container)
- Consider setting --min-instances=1 for always-on (costs ~$5/month)

## Monitoring

### View logs
```bash
gcloud run services logs read talks --region=us-central1 --limit=50
```

### View metrics
```bash
# Request count
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"'

# Container CPU utilization
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/container/cpu/utilizations"'
```

### Access Cloud Console
- **Service:** https://console.cloud.google.com/run/detail/us-central1/talks
- **Metrics:** https://console.cloud.google.com/run/detail/us-central1/talks/metrics
- **Logs:** https://console.cloud.google.com/run/detail/us-central1/talks/logs

## Rollback

### Rollback to previous revision
```bash
# List revisions
gcloud run revisions list --service=talks --region=us-central1

# Rollback to specific revision
gcloud run services update-traffic talks \
  --to-revisions=talks-00001-abc=100 \
  --region=us-central1
```

## Manual Updates

### Update service configuration
```bash
# Increase memory
gcloud run services update talks \
  --memory=512Mi \
  --region=us-central1

# Set minimum instances (always-on)
gcloud run services update talks \
  --min-instances=1 \
  --region=us-central1
```

### Re-deploy latest image
```bash
gcloud run deploy talks \
  --image=ghcr.io/denhamparry/talks:latest \
  --region=us-central1
```
```

## Implementation Plan

### Step 1: Modify Dockerfile for Cloud Run Port Support

**File:** `Dockerfile`

**Changes:**
- Install gettext (provides envsubst) in production stage
- Change nginx.conf to template with ${PORT} placeholder
- Update CMD to substitute $PORT and start nginx
- Update HEALTHCHECK to use ${PORT}
- Change EXPOSE to 8080 (Cloud Run default)

**Testing:**
```bash
# Build production image
docker build --target production -t talks:cloudrun .

# Test with custom port
docker run -p 9000:9000 -e PORT=9000 talks:cloudrun

# Verify health endpoint
curl http://localhost:9000/health

# Verify presentation loads
curl -I http://localhost:9000/
```

### Step 2: Rename nginx.conf to Template

**File:** `nginx.conf` → `nginx.conf` (content change only)

**Changes:**
- Change `listen 80;` to `listen ${PORT};`
- Everything else remains the same

**Testing:**
```bash
# Test envsubst locally
PORT=8080 envsubst '$$PORT' < nginx.conf > /tmp/test.conf
grep "listen 8080" /tmp/test.conf  # Should exist
```

### Step 3: Set Up Google Cloud Infrastructure

**Prerequisites:**
- Google Cloud billing account
- gcloud CLI installed
- Authenticated: `gcloud auth login`

**Tasks:**
1. Create new Google Cloud project with billing alerts
2. Link billing account
3. Create service accounts (cloudrun-talks-sa, github-actions-cloudrun)
4. Configure Workload Identity Federation (github-pool, github-provider)
5. Grant IAM permissions (roles/run.admin, roles/iam.serviceAccountUser)
6. Enable APIs (run.googleapis.com, compute.googleapis.com)
7. Deploy initial Cloud Run service

**Testing:**
```bash
# Verify service deployed
gcloud run services describe talks --region=us-central1

# Test service URL
SERVICE_URL=$(gcloud run services describe talks --region=us-central1 --format='value(status.url)')
curl $SERVICE_URL/health
```

### Step 4: Create GitHub Actions Deployment Workflow

**File:** `.github/workflows/cloudrun-deploy.yml`

**Changes:**
- Add new workflow file with Cloud Run deployment steps
- Use google-github-actions/auth@v2 for Workload Identity
- Use google-github-actions/deploy-cloudrun@v2 for deployment
- Add verification and health checks

**Testing:**
```bash
# Push to main branch and monitor GitHub Actions
git push origin main

# Check workflow run
gh run list --workflow=cloudrun-deploy.yml

# View logs
gh run view --log
```

### Step 5: Configure Custom Domain Mapping

**Tasks:**
1. Verify domain ownership in Google Cloud Console
2. Create domain mapping: `gcloud run domain-mappings create`
3. Get DNS record requirements
4. Update DNS provider with CNAME record
5. Wait for certificate provisioning (5-15 minutes)
6. Verify HTTPS access at talks.denhamparry.co.uk

**Testing:**
```bash
# Check certificate status
gcloud run domain-mappings describe \
  --domain=talks.denhamparry.co.uk \
  --region=us-central1

# Test DNS resolution
dig talks.denhamparry.co.uk

# Test HTTPS access
curl https://talks.denhamparry.co.uk/health
```

### Step 6: Update Documentation

**Files:** `README.md`, new `docs/deployment-guide.md`

**Changes to README.md:**
- Add "Deployment" section with production URL
- Document automatic deployment pipeline
- Add link to deployment guide

**New File: docs/deployment-guide.md:**
- Architecture overview
- Infrastructure components
- Cost estimate
- Troubleshooting guide
- Monitoring instructions
- Rollback procedures

**Testing:**
```bash
# Verify links work
grep -o 'https://[^ ]*' README.md | while read url; do
  curl -f -I "$url" || echo "Broken: $url"
done
```

### Step 7: Test End-to-End Deployment

**Test Case 1: New Slide Deployment**
1. Create new slide in slides/test-deployment.md
2. Commit and push to main branch
3. Wait for docker-publish.yml to build image
4. Wait for cloudrun-deploy.yml to deploy
5. Access https://talks.denhamparry.co.uk/test-deployment.html
6. Verify slide renders correctly

**Test Case 2: Theme Update**
1. Modify themes/edera-v2.css
2. Push to main branch
3. Wait for deployment
4. Hard refresh browser (Ctrl+Shift+R)
5. Verify theme changes applied

**Test Case 3: Domain and SSL**
1. Access https://talks.denhamparry.co.uk
2. Verify SSL certificate valid (green lock icon)
3. Check certificate issuer: Google Trust Services
4. Verify no mixed content warnings

## Testing Strategy

### Unit Testing

**Test Dockerfile Changes:**
```bash
# Build with different ports
docker build --target production -t talks:test .
docker run -p 8080:8080 -e PORT=8080 talks:test &
curl http://localhost:8080/health

docker run -p 9000:9000 -e PORT=9000 talks:test &
curl http://localhost:9000/health
```

**Test nginx Configuration:**
```bash
# Verify envsubst works correctly
docker run --rm talks:test /bin/sh -c 'envsubst "$$PORT" < /etc/nginx/templates/default.conf.template'
# Should show "listen 8080;" not "listen ${PORT};"
```

### Integration Testing

**Test Case 1: Local Cloud Run Simulation**
1. Build production image: `docker build --target production -t talks:test .`
2. Run with Cloud Run port: `docker run -p 8080:8080 -e PORT=8080 talks:test`
3. Test health check: `curl http://localhost:8080/health`
4. Test presentation: `curl http://localhost:8080/example-presentation.html`
5. Verify gzip compression: `curl -H "Accept-Encoding: gzip" -I http://localhost:8080/example-presentation.html | grep gzip`
**Expected:** All endpoints respond with 200, gzip header present

**Test Case 2: Google Cloud Run Deployment**
1. Deploy manually: `gcloud run deploy talks --image=ghcr.io/denhamparry/talks:latest --region=us-central1`
2. Get service URL: `gcloud run services describe talks --region=us-central1 --format='value(status.url)'`
3. Test health endpoint: `curl $SERVICE_URL/health`
4. Test homepage: `curl -I $SERVICE_URL/`
5. Check logs: `gcloud run services logs read talks --limit=20`
**Expected:** Service responds, logs show successful requests

**Test Case 3: Automated GitHub Actions Deployment**
1. Make trivial change to slides/example-presentation.md
2. Commit and push to main branch
3. Monitor GitHub Actions: `gh run watch`
4. Wait for both workflows to complete (docker-publish, cloudrun-deploy)
5. Access https://talks.denhamparry.co.uk and verify changes
**Expected:** Changes live within 5 minutes, no errors in workflows

**Test Case 4: Custom Domain and SSL**
1. Wait for certificate provisioning (first time only)
2. Test DNS: `dig talks.denhamparry.co.uk` (should return CNAME or A record)
3. Test HTTP redirect: `curl -I http://talks.denhamparry.co.uk` (should redirect to HTTPS)
4. Test HTTPS: `curl https://talks.denhamparry.co.uk/health`
5. Verify certificate: `openssl s_client -connect talks.denhamparry.co.uk:443 -servername talks.denhamparry.co.uk`
**Expected:** Valid SSL certificate, HTTPS accessible, HTTP redirects to HTTPS

### Regression Testing

**Existing Functionality:**
- [ ] Local development still works: `docker-compose up dev`
- [ ] Local production testing still works: `docker-compose --profile production up prod`
- [ ] Makefile commands still work: `make docker-build`, `make docker-prod`
- [ ] Docker publish workflow still works (GHCR image published)
- [ ] Health check endpoint responds: `/health`
- [ ] nginx security headers present
- [ ] gzip compression enabled

**Edge Cases:**
- [ ] Cold start: First request after idle (should work, ~2-5s delay)
- [ ] Large presentations: Slides with many images (verify memory limits)
- [ ] Concurrent requests: 10+ simultaneous users (verify scaling)
- [ ] Invalid URLs: 404 error pages rendered
- [ ] Missing slides: Proper 404 response

**Performance:**
- [ ] Page load time: <2s for typical presentation
- [ ] Cold start time: <5s from idle
- [ ] Image size: Still <100MB (no regression)
- [ ] gzip compression: HTML files 60-80% smaller

## Success Criteria

### Code Implementation (Completed ✅)

- [x] Dockerfile modified to support Cloud Run $PORT environment variable
- [x] nginx.conf uses ${PORT} template variable
- [x] GitHub Actions workflow created (.github/workflows/cloudrun-deploy.yml)
- [x] Documentation updated (README.md, docs/deployment-guide.md)
- [x] Implementation plan completed
- [x] Pre-commit hooks passing
- [x] Changes committed to branch denhamparry.co.uk/feat/gh-issue-026

### Infrastructure Setup (Pending - User Action Required)

- [ ] Google Cloud project created (denhamparry-talks)
- [ ] Billing account linked with budget alerts (£10/month)
- [ ] Service accounts created (cloudrun-talks-sa, github-actions-cloudrun)
- [ ] Workload Identity Federation configured
- [ ] Required APIs enabled (run.googleapis.com, compute.googleapis.com)
- [ ] Cloud Run service deployed and accessible
- [ ] GitHub Secrets configured (GCP_WORKLOAD_IDENTITY_PROVIDER, GCP_SERVICE_ACCOUNT)
- [ ] Custom domain talks.denhamparry.co.uk mapped to Cloud Run
- [ ] Domain verified in Google Cloud Console
- [ ] DNS records configured in Cloudflare
- [ ] SSL certificate provisioned and valid
- [ ] All presentations accessible at https://talks.denhamparry.co.uk
- [ ] Deployment cost within Cloud Run free tier ($0/month)

### Testing (Pending - After Infrastructure Setup)

- [ ] Existing local Docker functionality still works
- [ ] Docker build successful with dynamic port
- [ ] Health check endpoint responds
- [ ] Automatic deployment triggered on main branch push
- [ ] Custom domain accessible via HTTPS
- [ ] SSL certificate valid (Google Trust Services)

## Files Modified

1. `Dockerfile` - Add envsubst, update CMD for $PORT substitution, change port to 8080
2. `nginx.conf` - Change port to ${PORT} template variable
3. `.github/workflows/cloudrun-deploy.yml` - New Cloud Run deployment workflow
4. `README.md` - Add deployment section with production URL
5. `docs/deployment-guide.md` - New comprehensive deployment guide

## Related Issues and Tasks

### Depends On
- Issue #8 (Containerize MARP slides) ✅ - **Complete** - Docker infrastructure exists
- `.github/workflows/docker-publish.yml` ✅ - **Complete** - Image published to GHCR

### Blocks
- Future: Analytics/monitoring integration
- Future: Multiple presentation versions (staging/production)
- Future: Custom error pages (404, 500)

### Related
- Docker infrastructure (Dockerfile, nginx.conf, docker-compose.yml)
- GitHub Container Registry (ghcr.io/denhamparry/talks)
- Issue #7 (Makefile) - Could add `make deploy-cloudrun` command

### Enables
- **Public presentation sharing** - Conference attendees can access via URL
- **Automated deployments** - No manual intervention for updates
- **Professional branding** - Custom domain talks.denhamparry.co.uk
- **Global availability** - HTTPS with CDN for fast worldwide access
- **Zero infrastructure management** - Serverless platform handles scaling

## References

### Issue and Documentation
- [GitHub Issue #26](https://github.com/denhamparry/talks/issues/26) - Original deployment request
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs) - Official Cloud Run docs
- [Cloud Run Pricing](https://cloud.google.com/run/pricing) - Free tier details

### Cloud Run Best Practices (2025)
- [Deploying to Cloud Run from GitHub Actions](https://cloud.google.com/blog/products/devops-sre/deploy-to-cloud-run-with-github-actions) - Official guide
- [Building containers for Cloud Run](https://cloud.google.com/run/docs/building/containers) - Container requirements
- [Mapping custom domains](https://cloud.google.com/run/docs/mapping-custom-domains) - Domain setup guide
- [Cloud Run Authentication Best Practices](https://cloud.google.com/blog/products/identity-security/enable-keyless-access-to-gcp-with-workload-identity-federation) - Workload Identity Federation

### GitHub Actions Integration
- [google-github-actions/auth](https://github.com/google-github-actions/auth) - Authentication action with OIDC
- [google-github-actions/deploy-cloudrun](https://github.com/google-github-actions/deploy-cloudrun) - Deployment action
- [google-github-actions/setup-gcloud](https://github.com/google-github-actions/setup-gcloud) - gcloud CLI setup

### nginx Dynamic Port Configuration
- [nginx Environment Variables](https://stackoverflow.com/questions/32813447/nginx-read-environment-variables) - envsubst pattern
- [Cloud Run nginx Example](https://github.com/GoogleCloudPlatform/cloud-run-samples/tree/main/hello-nginx) - Official example

## Implementation Updates

### Index Page Generation (December 3, 2025)

**Problem Identified:**
After initial deployment, Cloud Run showed nginx default welcome page instead of presentation index.

**Root Cause:**
- MARP build process created individual HTML files for each presentation
- No landing page (index.html) was generated
- nginx served its default index.html from the base image

**Solution Implemented (Commits 8a7dcc8, 6eb0c6c):**

1. **Created `scripts/generate-index.js`:**
   - Scans `slides/` directory for markdown files
   - Extracts metadata: title (first H1), date (from filename or frontmatter), event info
   - Generates responsive HTML index with card-based layout
   - Styled using Edera V2 theme colors for consistency
   - Sorts presentations by date (newest first)

2. **Updated `package.json`:**
   - Added `generate-index` script
   - Modified `build` command to run index generation after MARP build: `marp -I slides/ -o dist/ && npm run generate-index`

3. **Updated `Dockerfile`:**
   - Added `COPY scripts/ ./scripts/` to builder stage
   - Ensures script available during Docker build

**Verification:**
- Local test: index page displays correctly with all presentations
- Cloud Run deployment: ✅ https://talks-192861381104.europe-west1.run.app shows custom index
- Individual presentations accessible: ✅ All HTML files serve correctly

**Current Status:**
- ✅ Index page generation automated in build process
- ✅ Deployed to Cloud Run (revision talks-00004-6fh)
- ✅ Service URL active and serving presentations
- ⏳ Custom domain (talks.denhamparry.co.uk) - awaiting DNS configuration

## Notes

### Key Insights

1. **Minimal Dockerfile changes required**: Only need envsubst and $PORT substitution, existing nginx config works as-is

2. **Workload Identity Federation is more secure**: No service account keys stored in GitHub, OIDC-based authentication preferred

3. **Cloud Run free tier is generous**: 2M requests/month easily covers low-traffic presentation site

4. **Cold start acceptable for this use case**: 2-5s latency acceptable for conference presentations, not mission-critical

5. **Domain mapping is straightforward**: Simple CNAME record, Google handles SSL certificate automatically

### Alternative Approaches Considered

1. **Cloud Storage + Load Balancer** ❌
   - Pros: Extremely low cost ($0.01/GB storage, no compute)
   - Cons: More complex setup, separate load balancer costs $18/month, can't reuse Docker images
   - Why not chosen: Cloud Run simpler and within free tier

2. **Vercel/Netlify** ❌
   - Pros: Simple git-based deployment, built for static sites
   - Cons: Vendor lock-in, can't reuse existing Docker images, less control
   - Why not chosen: Already have GHCR images, prefer portable Docker solution

3. **Google Kubernetes Engine (GKE)** ❌
   - Pros: More control, Kubernetes-native
   - Cons: Minimum $75/month for cluster, overkill for static site, requires cluster management
   - Why not chosen: Cloud Run provides same container deployment without cluster overhead

4. **Chosen: Google Cloud Run** ✅
   - Pros: Serverless, $0/month within free tier, reuses Docker images, automatic HTTPS, simple domain mapping
   - Cons: Cold start latency (2-5s), proprietary platform
   - Why chosen: Best balance of simplicity, cost, and feature set for this use case

### Best Practices

1. **Use Workload Identity Federation**: More secure than service account keys, Google-recommended

2. **Set resource limits conservatively**: Start with 256Mi memory, increase if needed

3. **Scale to zero**: For low-traffic sites, min-instances=0 saves costs

4. **Monitor with Cloud Monitoring**: Set up alerts for error rates, latency

5. **Use latest action versions**: Keep GitHub Actions up to date (auth@v2, deploy-cloudrun@v2)

6. **Test locally first**: Use `docker run -e PORT=8080` to simulate Cloud Run environment

7. **Document manual procedures**: Keep deployment guide for troubleshooting

### User Requirements (Confirmed)

1. **Google Cloud project**: ✅ Create new project for cost tracking
   - Project naming: `denhamparry-talks` or similar
   - Billing alert: Set up at £10/month threshold

2. **DNS provider**: ✅ Cloudflare
   - Will need to add CNAME record for talks.denhamparry.co.uk
   - Cloudflare proxy can be enabled after SSL certificate provisioned

3. **Cost budget**: ✅ Free to less than £10/month (~$12/month)
   - Target: $0/month within Cloud Run free tier
   - Acceptable: Up to $12/month if traffic exceeds free tier
   - Set up billing alerts and budget caps

4. **Region preference**: ✅ UK-based with global access
   - Primary region: **europe-west2** (London) - lowest latency for UK users
   - Cloud Run global load balancing provides worldwide access
   - Consider: europe-west1 (Belgium) as backup if London unavailable

5. **Scaling preference**: ✅ Cold start acceptable (2-5s latency)
   - Configuration: min-instances=0 (scale to zero when idle)
   - Saves ~£5/month compared to always-on
   - Acceptable for conference presentation use case
