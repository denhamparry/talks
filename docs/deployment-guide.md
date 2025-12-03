# Google Cloud Run Deployment Guide

Complete guide for deploying MARP presentations to Google Cloud Run with custom domain `talks.denhamparry.co.uk`.

## Overview

This repository automatically deploys presentations to Google Cloud Run using GitHub Actions when changes are pushed to the main branch.

**Architecture:**

```text
GitHub → Docker Build → GHCR → Cloud Run → talks.denhamparry.co.uk
   ↓           ↓           ↓         ↓              ↓
 Push      Build Image  Store    Deploy        Custom Domain
 main      (MARP)      ghcr.io  (London)      (Cloudflare)
```

## Production Deployment

### Quick Access

- **Production URL:** <https://talks.denhamparry.co.uk>
- **Cloud Run Service:** `https://talks-HASH-nw.a.run.app` (auto-generated)
- **Region:** europe-west1 (Belgium) - supports domain mappings
- **Platform:** Google Cloud Run (serverless)
- **Cost:** $0/month (within free tier)

### Automatic Deployment Pipeline

1. **Push slides to main branch**
   - Triggers `.github/workflows/docker-publish.yml`
   - Builds Docker image with MARP slides

2. **Publish to GitHub Container Registry**
   - Image tagged as `ghcr.io/denhamparry/talks:latest`
   - Multi-architecture (amd64, arm64)

3. **Deploy to Cloud Run**
   - Triggers `.github/workflows/cloudrun-deploy.yml`
   - Deploys to europe-west1 (Belgium)
   - Scales 0-10 instances automatically

4. **Available globally**
   - HTTPS with managed SSL certificate
   - Custom domain: talks.denhamparry.co.uk
   - Global CDN via Cloudflare (optional)

## Initial Setup

This guide assumes you're setting up Cloud Run deployment from scratch. If already configured, skip to [Usage](#usage).

### Prerequisites

- Google Cloud billing account
- gcloud CLI installed (`brew install google-cloud-sdk` on macOS)
- Cloudflare account with denhamparry.co.uk domain
- GitHub repository with admin access

### Step 1: Install gcloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Authenticate
gcloud auth login

# Verify installation
gcloud --version
```

### Step 2: Create Google Cloud Project

```bash
# Create new project
gcloud projects create denhamparry-talks \
  --name="Denhamparry Talks" \
  --set-as-default

# Get billing account ID
gcloud billing accounts list

# Link billing account (replace with your account ID)
export BILLING_ACCOUNT_ID="XXXXXX-YYYYYY-ZZZZZZ"
gcloud billing projects link denhamparry-talks \
  --billing-account=$BILLING_ACCOUNT_ID
```

### Step 3: Set Up Budget Alerts

```bash
# Create budget alert for £10/month (~$12)
gcloud billing budgets create \
  --billing-account=$BILLING_ACCOUNT_ID \
  --display-name="Talks Monthly Budget" \
  --budget-amount=12.00 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100 \
  --threshold-rule=percent=110

# Enable cost tracking APIs
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbilling.googleapis.com
```

**Budget alerts will notify you at:**

- 50% ($6) - Warning
- 90% ($10.80) - Critical
- 100% ($12) - Budget exceeded
- 110% ($13.20) - Over budget

### Step 4: Enable Required APIs

```bash
export PROJECT_ID="denhamparry-talks"

# Enable Cloud Run API
gcloud services enable run.googleapis.com --project=$PROJECT_ID

# Enable Compute Engine API (required for domain mapping)
gcloud services enable compute.googleapis.com --project=$PROJECT_ID

# Enable Artifact Registry API
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID

# Enable IAM Service Account Credentials API (required for Workload Identity Federation)
gcloud services enable iamcredentials.googleapis.com --project=$PROJECT_ID
```

**Important:** The IAM Service Account Credentials API (`iamcredentials.googleapis.com`) is critical for Workload Identity Federation to impersonate service accounts. Without this API enabled, GitHub Actions authentication will succeed but Docker pushes to Artifact Registry will fail with a "Unable to acquire impersonated credentials" error.

### Step 4.5: Create Artifact Registry Repository

Google Cloud Run requires images to be in Google Artifact Registry, not GitHub Container Registry.

```bash
export REGION="europe-west1"  # Belgium (supports domain mappings)
# Note: europe-west2 (London) does NOT support domain mappings
# Use europe-west1 (Belgium) or us-central1 (Iowa) instead

# Create Artifact Registry repository
gcloud artifacts repositories create talks \
  --repository-format=docker \
  --location=$REGION \
  --description="MARP presentation slides container images" \
  --project=$PROJECT_ID

# Verify repository created
gcloud artifacts repositories describe talks \
  --location=$REGION \
  --project=$PROJECT_ID
```

### Step 5: Create Service Accounts

```bash
export REGION="europe-west1"  # Belgium (supports domain mappings)
export SERVICE_NAME="talks"

# Service account for Cloud Run service (runs the container)
gcloud iam service-accounts create cloudrun-talks-sa \
  --display-name="Cloud Run Talks Service Account" \
  --project=$PROJECT_ID

# Service account for GitHub Actions (deploys the service)
gcloud iam service-accounts create github-actions-cloudrun \
  --display-name="GitHub Actions Cloud Run Deployer" \
  --project=$PROJECT_ID

# Grant Cloud Run Admin permission to GitHub Actions service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User permission (required to deploy as service account)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Grant Artifact Registry Writer permission (required to push images)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

### Step 6: Configure Workload Identity Federation

Workload Identity Federation allows GitHub Actions to authenticate to Google Cloud without storing service account keys.

```bash
# Get project number (needed for Workload Identity)
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

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
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/denhamparry/talks" \
  --project=$PROJECT_ID

# Get Workload Identity Provider resource name (save this for GitHub Secrets)
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)" \
  --project=$PROJECT_ID
```

**Save the output** (format: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider`)

### Step 7: Build and Deploy to Cloud Run

Cloud Run requires images in Artifact Registry (not GHCR) and must be built for **amd64** architecture.

**Important:** If you're on Apple Silicon (M1/M2/M3), you must build for `linux/amd64`, not `arm64`.

```bash
# Configure Docker authentication for Artifact Registry
gcloud auth configure-docker $REGION-docker.pkg.dev

# Build image for amd64 architecture (required for Cloud Run)
docker build --platform linux/amd64 --target production -t talks:cloudrun .

# Tag for Artifact Registry
docker tag talks:cloudrun \
  $REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest

# Verify architecture is amd64 (not arm64)
docker inspect $REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest --format='Architecture: {{.Architecture}}'
# Should output: Architecture: amd64

# Push to Artifact Registry
docker push $REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest

# Deploy to Cloud Run from Artifact Registry
gcloud run deploy $SERVICE_NAME \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --port=8080 \
  --min-instances=0 \
  --max-instances=10 \
  --memory=256Mi \
  --cpu=1 \
  --timeout=60s \
  --project=$PROJECT_ID

# Get service URL
gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format='value(status.url)' \
  --project=$PROJECT_ID
```

**Test the service:**

```bash
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
curl "$SERVICE_URL/health"
# Should return: healthy

# Test a presentation
curl -I "$SERVICE_URL/"
# Should return: HTTP 200
```

**Common Issue:** If you get "exec format error" or container fails to start, you pushed the wrong architecture. Fix it:

```bash
# Remove incorrect tag
docker rmi $REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest

# Re-tag with correct amd64 image
docker tag talks:cloudrun $REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest

# Push again
docker push $REGION-docker.pkg.dev/$PROJECT_ID/talks/talks:latest
```

**Note:** After GitHub Actions is configured, the workflow will automatically build multi-architecture images and push to Artifact Registry on every deployment.

### Step 8: Configure GitHub Secrets

Add secrets to GitHub repository: Settings → Secrets and variables → Actions → New repository secret

1. **GCP_WORKLOAD_IDENTITY_PROVIDER**
   - Value: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider`
   - Get from Step 6 output

2. **GCP_SERVICE_ACCOUNT**
   - Value: `github-actions-cloudrun@denhamparry-talks.iam.gserviceaccount.com`

### Step 9: Map Custom Domain

**Important:** Domain mappings are only supported in certain regions. If you deployed to **europe-west2 (London)**, you must redeploy to **europe-west1 (Belgium)** or **us-central1 (Iowa)** first.

#### 9.1 Verify Domain Ownership

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Cloud Run** → **Manage Custom Domains**
3. Click **Verify Domain**
4. Enter `denhamparry.co.uk` (root domain)
5. Add verification TXT record to Cloudflare DNS:
   - Type: TXT
   - Name: @ (root)
   - Value: `google-site-verification=...` (from Console)
   - TTL: Auto

#### 9.2 Create Domain Mapping

**Note:** Domain mapping commands require `gcloud beta` (not the stable GA version).

```bash
# Create domain mapping (use gcloud beta)
gcloud beta run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=talks.denhamparry.co.uk \
  --region=$REGION \
  --project=$PROJECT_ID

# Get DNS record requirements
gcloud beta run domain-mappings describe \
  --domain=talks.denhamparry.co.uk \
  --region=$REGION \
  --format="value(status.resourceRecords)" \
  --project=$PROJECT_ID
```

#### 9.3 Configure Cloudflare DNS

Add DNS record in Cloudflare for denhamparry.co.uk:

```text
Type: CNAME
Name: talks
Target: ghs.googlehosted.com
TTL: Auto
Proxy status: DNS only (grey cloud) ← Important during setup
```

**Important:**

- Initially disable Cloudflare proxy (grey cloud icon)
- Wait for SSL certificate provisioning (5-15 minutes)
- After certificate is active, optionally enable proxy (orange cloud) for DDoS protection and CDN

#### 9.4 Wait for Certificate Provisioning

```bash
# Check certificate status (repeat until Ready)
gcloud beta run domain-mappings describe \
  --domain=talks.denhamparry.co.uk \
  --region=$REGION \
  --format="value(status.conditions)" \
  --project=$PROJECT_ID

# When status shows "Ready", test the domain
curl https://talks.denhamparry.co.uk/health
```

**Certificate provisioning typically takes 5-15 minutes.**

### Step 10: Test End-to-End Deployment

1. Make a change to a slide file (e.g., `slides/example-presentation.md`)
2. Commit and push to main branch
3. Monitor GitHub Actions:
   - `docker-publish.yml` builds and publishes image
   - `cloudrun-deploy.yml` deploys to Cloud Run
4. Access <https://talks.denhamparry.co.uk>
5. Verify changes appear

## Usage

### Viewing Presentations

All presentations are available at:

- **Production:** <https://talks.denhamparry.co.uk>
- **Direct Cloud Run URL:** `https://talks-HASH-nw.a.run.app`

**Example presentations:**

- <https://talks.denhamparry.co.uk/example-presentation.html>
- <https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html>

### Deploying Updates

**Automatic deployment:**

```bash
# Edit slides
vim slides/my-talk.md

# Commit and push
git add slides/my-talk.md
git commit -m "feat(slides): add new presentation"
git push origin main

# Wait 2-3 minutes for deployment
# Access at https://talks.denhamparry.co.uk/my-talk.html
```

**Manual deployment:**

```bash
# Deploy specific image tag
gcloud run deploy talks \
  --image=ghcr.io/denhamparry/talks:main \
  --region=europe-west1 \
  --project=denhamparry-talks
```

### Monitoring Deployments

**GitHub Actions:**

```bash
# List recent workflow runs
gh run list --workflow=cloudrun-deploy.yml --limit=5

# View logs for latest run
gh run view --log
```

**Cloud Run Console:**

- **Service Dashboard:** <https://console.cloud.google.com/run/detail/europe-west1/talks>
- **Metrics:** <https://console.cloud.google.com/run/detail/europe-west1/talks/metrics>
- **Logs:** <https://console.cloud.google.com/run/detail/europe-west1/talks/logs>

**Command line:**

```bash
# View logs
gcloud run services logs read talks \
  --region=europe-west1 \
  --limit=50

# View service status
gcloud run services describe talks \
  --region=europe-west1 \
  --format="table(status.url,status.conditions)"
```

## Cost Management

### Expected Costs

**Current configuration:**

- **Target:** $0/month (within Cloud Run free tier)
- **Free tier:** 2 million requests/month, 360,000 GB-seconds/month
- **Expected usage:** ~1,000 requests/month (conference attendees)
- **Budget limit:** £10/month (~$12/month)

**Cost breakdown:**

| Resource | Usage | Cost |
| -------- | ----- | ---- |
| Cloud Run requests | 1,000/month | $0 (free tier) |
| Cloud Run compute | ~10 GB-seconds/month | $0 (free tier) |
| Network egress | ~1 GB/month | $0 (free tier) |
| SSL certificate | Managed | $0 (included) |
| **Total** |  | **$0/month** |

### Viewing Costs

**Cloud Console:**

1. Go to [Billing Reports](https://console.cloud.google.com/billing)
2. Select "denhamparry-talks" project
3. View cost breakdown by service

**Command line:**

```bash
# View current month costs
gcloud billing projects describe denhamparry-talks \
  --format="value(billingAccountName)"
```

### Budget Alerts

Budget alerts configured at:

- 50% ($6) - Email notification
- 90% ($10.80) - Email notification
- 100% ($12) - Email notification
- 110% ($13.20) - Email notification

**Modify budget:**

```bash
# List budgets
gcloud billing budgets list --billing-account=$BILLING_ACCOUNT_ID

# Update budget (if costs exceed expectations)
gcloud billing budgets update BUDGET_ID \
  --billing-account=$BILLING_ACCOUNT_ID \
  --budget-amount=20.00
```

## Troubleshooting

### Deployment Fails with Authentication Error

**Symptoms:**

- GitHub Actions workflow fails with "Permission denied" or "Authentication failed"

**Solution:**

1. Verify Workload Identity Provider is configured:

   ```bash
   gcloud iam workload-identity-pools providers describe github-provider \
     --location=global \
     --workload-identity-pool=github-pool \
     --project=denhamparry-talks
   ```

2. Check service account has correct permissions:

   ```bash
   gcloud projects get-iam-policy denhamparry-talks \
     --flatten="bindings[].members" \
     --filter="bindings.members:github-actions-cloudrun@denhamparry-talks.iam.gserviceaccount.com"
   ```

3. Verify GitHub Secrets are correct:
   - Go to repository Settings → Secrets → Actions
   - Ensure `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` are set

### Unable to Acquire Impersonated Credentials

**Symptoms:**

- GitHub Actions workflow fails at "Push to Artifact Registry" step
- Error message: "Unable to acquire impersonated credentials"
- Error includes: "IAM Service Account Credentials API has not been used in project... or it is disabled"
- Error code: 403 PERMISSION_DENIED, reason: SERVICE_DISABLED

**Root Cause:**

The IAM Service Account Credentials API (`iamcredentials.googleapis.com`) is not enabled in your GCP project. This API is required for Workload Identity Federation to impersonate service accounts.

**Solution:**

1. Enable the IAM Service Account Credentials API:

   ```bash
   gcloud services enable iamcredentials.googleapis.com --project=denhamparry-talks
   ```

   Or via GCP Console:
   - Visit: <https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=YOUR_PROJECT_ID>
   - Click "Enable"

2. Wait 2-5 minutes for API enablement to propagate across GCP systems

3. Verify the API is enabled:

   ```bash
   gcloud services list --enabled --project=denhamparry-talks --filter="name:iamcredentials.googleapis.com"
   ```

4. Re-run the failed GitHub Actions workflow:

   ```bash
   gh run rerun <RUN_ID> --failed
   ```

**Prevention:**

Ensure this API is included in Step 4 of the initial setup. This is now documented in the deployment guide.

### Domain Not Accessible (talks.denhamparry.co.uk)

**Symptoms:**

- `curl https://talks.denhamparry.co.uk` returns connection error or certificate error

**Solution:**

1. Check DNS propagation:

   ```bash
   dig talks.denhamparry.co.uk
   # Should return CNAME to ghs.googlehosted.com
   ```

2. Check certificate status:

   ```bash
   gcloud beta run domain-mappings describe \
     --domain=talks.denhamparry.co.uk \
     --region=europe-west1 \
     --format="value(status.conditions)"
   ```

3. Wait 5-15 minutes for certificate provisioning if status is "CertificateProvisioning"

4. Ensure Cloudflare proxy is disabled (grey cloud) during initial setup

5. Check certificate via browser:
   - Open <https://talks.denhamparry.co.uk> in browser
   - Click lock icon → Certificate
   - Issuer should be "Google Trust Services"

### Health Check Fails

**Symptoms:**

- Deployment succeeds but `/health` endpoint returns 502 or 404

**Solution:**

1. Test health endpoint locally:

   ```bash
   docker run -p 8080:8080 -e PORT=8080 ghcr.io/denhamparry/talks:latest &
   sleep 5
   curl http://localhost:8080/health
   ```

2. Check Cloud Run logs:

   ```bash
   gcloud run services logs read talks \
     --region=europe-west1 \
     --limit=50
   ```

3. Verify nginx configuration uses `${PORT}`:

   ```bash
   grep "listen \${PORT}" nginx.conf
   ```

### Cold Start Latency

**Symptoms:**

- First request after idle takes 2-5 seconds to respond

**Explanation:**

- This is expected behavior with `min-instances=0` (scale to zero)
- Saves costs by not running containers when idle

**Solutions:**

**Option A: Accept cold start (recommended for low cost)**

- No changes needed
- Acceptable for conference presentations

**Option B: Always-on (costs ~£5/month)**

```bash
gcloud run services update talks \
  --min-instances=1 \
  --region=europe-west1
```

### Image Size Too Large

**Symptoms:**

- Build time >5 minutes
- Deployment slow

**Solution:**

1. Verify `.dockerignore` excludes unnecessary files:

   ```bash
   cat .dockerignore
   ```

2. Check production image size:

   ```bash
   docker images ghcr.io/denhamparry/talks:latest
   # Should be <100MB
   ```

3. If image is large, rebuild with `--no-cache`:

   ```bash
   docker build --target production --no-cache -t talks:test .
   ```

## Advanced Configuration

### Increasing Memory/CPU

If presentations are large or complex:

```bash
# Update service resources
gcloud run services update talks \
  --memory=512Mi \
  --cpu=2 \
  --region=europe-west1
```

**Cost impact:** Increases compute costs, but still likely within free tier.

### Adding Custom Environment Variables

```bash
# Add environment variables
gcloud run services update talks \
  --set-env-vars="CUSTOM_VAR=value" \
  --region=europe-west1
```

### Enabling Cloudflare CDN

After SSL certificate is provisioned:

1. Go to Cloudflare DNS settings
2. Click the cloud icon for `talks` record
3. Change from grey (DNS only) to orange (Proxied)
4. Cloudflare now provides:
   - DDoS protection
   - Additional CDN caching
   - Analytics
   - Page Rules (optional)

**Note:** Cloudflare's "Flexible" SSL mode works with Cloud Run's managed certificates.

### Rolling Back to Previous Version

```bash
# List all revisions
gcloud run revisions list \
  --service=talks \
  --region=europe-west1

# Rollback to specific revision
gcloud run services update-traffic talks \
  --to-revisions=talks-00001-abc=100 \
  --region=europe-west1
```

## Security

### Managed SSL Certificates

- Automatically provisioned by Google Cloud
- Auto-renewal (no manual intervention)
- Issuer: Google Trust Services
- Validity: 90 days (renewed automatically)

### Security Headers

nginx configuration includes:

- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Content-Security-Policy` - Restricts resource loading
- `Referrer-Policy` - Privacy protection

### Authentication

Current configuration: **Unauthenticated access** (`--allow-unauthenticated`)

**To require authentication:**

```bash
# Require authentication
gcloud run services update talks \
  --no-allow-unauthenticated \
  --region=europe-west1

# Grant access to specific users
gcloud run services add-iam-policy-binding talks \
  --member="user:email@example.com" \
  --role="roles/run.invoker" \
  --region=europe-west1
```

## References

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [GitHub Actions for Google Cloud](https://github.com/google-github-actions)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)

## Support

For issues with deployment:

1. Check [Troubleshooting](#troubleshooting) section
2. Review Cloud Run logs: `gcloud run services logs read talks --region=europe-west1`
3. Check GitHub Actions logs: `gh run view --log`
4. Open an issue in the repository

---

**Last Updated:** 2025-12-03
**Deployment Region:** europe-west1 (Belgium)
**Platform:** Google Cloud Run
**Note:** Use europe-west1 or us-central1 for domain mapping support
