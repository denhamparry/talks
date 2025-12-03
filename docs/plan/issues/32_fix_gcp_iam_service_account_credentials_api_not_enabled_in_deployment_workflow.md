# GitHub Issue #32: Fix GCP IAM Service Account Credentials API not enabled in deployment workflow

**Issue:** [#32](https://github.com/denhamparry/talks/issues/32)
**Status:** Documentation Complete - Awaiting Manual Infrastructure Setup
**Labels:** bug, ci, github_actions, high-priority
**Date:** 2025-12-03
**Documentation Updated:** 2025-12-03

## Problem Statement

The GitHub Actions deployment workflow is failing during the "Push to Artifact Registry" step with an authentication error. The Workload Identity Federation cannot acquire impersonated credentials because the IAM Service Account Credentials API is not enabled in the GCP project.

### Current Behavior
- Deployment workflow fails at step "Push to Artifact Registry" (`.github/workflows/cloudrun-deploy.yml:60-63`)
- Error message indicates `PERMISSION_DENIED` with reason `SERVICE_DISABLED`
- GCP Project ID: `192861381104`
- API endpoint: `iamcredentials.googleapis.com`

**Failed Run:** https://github.com/denhamparry/talks/actions/runs/19903865129/job/57054810845

**Error Message:**
```
ERROR: (gcloud.auth.docker-helper) There was a problem refreshing your current auth tokens:
('Unable to acquire impersonated credentials',
'{
  "error": {
    "code": 403,
    "message": "IAM Service Account Credentials API has not been used in project 192861381104 before or it is disabled.
    Enable it by visiting https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=192861381104
    then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.",
    "status": "PERMISSION_DENIED",
    "reason": "SERVICE_DISABLED"
  }
}')
```

### Expected Behavior
- Workload Identity Federation should successfully authenticate with GCP
- Docker should successfully push images to Artifact Registry
- Cloud Run deployment should proceed without authentication errors
- Deployment workflow completes successfully

### Impact
- **Current:** Cannot push Docker images to Artifact Registry (`europe-west1-docker.pkg.dev/denhamparry-talks/talks/talks`)
- **Blocking:** All deployments to Cloud Run service `talks` in region `europe-west1`
- **Priority:** High - affects production deployment pipeline
- **Scope:** Affects all pushes to `main` branch that modify presentation files, Dockerfile, or workflow configuration

## Current State Analysis

### Relevant Code/Config

**Workflow File:** `.github/workflows/cloudrun-deploy.yml`

The deployment workflow uses Workload Identity Federation for authentication:

```yaml
# Lines 37-42
- name: Authenticate to Google Cloud
  id: auth
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
    service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}
```

Then configures Docker authentication and attempts to push to Artifact Registry:

```yaml
# Lines 47-48
- name: Configure Docker for Artifact Registry
  run: gcloud auth configure-docker ${{ env.ARTIFACT_REGISTRY }}

# Lines 60-63
- name: Push to Artifact Registry
  run: |
    docker push ${{ env.ARTIFACT_REGISTRY }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/${{ env.IMAGE_NAME }}:latest
    docker push ${{ env.ARTIFACT_REGISTRY }}/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

**Environment Variables:**
- `PROJECT_ID`: `denhamparry-talks`
- `REGION`: `europe-west1`
- `ARTIFACT_REGISTRY`: `europe-west1-docker.pkg.dev`
- `REPOSITORY`: `talks`
- `IMAGE_NAME`: `talks`

### Related Context

**Dependencies:**
- GCP Workload Identity Federation configured with GitHub OIDC provider
- Service Account with permissions to push to Artifact Registry
- GitHub secrets: `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`

**Workflow Chain:**
1. `.github/workflows/docker-publish.yml` - Builds image and pushes to GHCR (working)
2. `.github/workflows/cloudrun-deploy.yml` - Pulls from GHCR, pushes to Artifact Registry, deploys to Cloud Run (failing at push step)

**Related Issues:**
- This is a GCP project configuration issue, not a code issue
- Similar to common Workload Identity Federation setup problems
- API enablement is required before service account impersonation can work

## Solution Design

### Approach

Enable the IAM Service Account Credentials API (`iamcredentials.googleapis.com`) in GCP project `192861381104`. This API is required for Workload Identity Federation to impersonate service accounts, which is the mechanism used by the GitHub Actions workflow to authenticate with GCP services.

**Rationale:**
- This is an infrastructure prerequisite for Workload Identity Federation
- One-time configuration change with no code modifications needed
- No workflow or application code changes required
- Industry standard approach for GitHub Actions → GCP authentication

**Trade-offs Considered:**
1. **Service Account Key File (Alternative)** ❌
   - Less secure - requires storing long-lived credentials
   - Requires key rotation management
   - Not recommended by Google Cloud

2. **Enable API via gcloud CLI (Chosen)** ✅
   - Secure - uses Workload Identity Federation (short-lived tokens)
   - Infrastructure-as-code approach
   - Reproducible and documentable
   - Aligns with Google Cloud best practices

### Implementation

**Step 1: Enable the API**

Use `gcloud` CLI to enable the IAM Service Account Credentials API:

```bash
gcloud services enable iamcredentials.googleapis.com --project=192861381104
```

Or via GCP Console:
- Navigate to: https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=192861381104
- Click "Enable"

**Step 2: Wait for Propagation**

GCP API enablement requires 2-5 minutes to propagate across Google's distributed systems. Do not retry immediately.

**Step 3: Verify API Status**

```bash
gcloud services list --enabled --project=192861381104 --filter="name:iamcredentials.googleapis.com"
```

Expected output:
```
NAME                             TITLE
iamcredentials.googleapis.com    IAM Service Account Credentials API
```

### Benefits

- **Unblocks deployments:** Allows Cloud Run deployments to proceed
- **No code changes:** Pure infrastructure fix
- **Secure authentication:** Maintains Workload Identity Federation security model
- **Reproducible:** Can be documented and scripted for future projects
- **Minimal downtime:** Quick fix with near-immediate effect after propagation

## Implementation Plan

### Step 1: Enable IAM Service Account Credentials API

**Approach:** Use `gcloud` CLI for reproducibility and documentation

**Command:**
```bash
gcloud services enable iamcredentials.googleapis.com --project=192861381104
```

**Verification:**
```bash
gcloud services list --enabled --project=192861381104 --filter="name:iamcredentials.googleapis.com"
```

**Expected Output:**
```
NAME                             TITLE
iamcredentials.googleapis.com    IAM Service Account Credentials API
```

**Alternative (Console):**
If CLI access is unavailable, use GCP Console:
1. Navigate to: https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=192861381104
2. Click "Enable" button
3. Wait for confirmation message

**Time Required:** 1-2 minutes for enablement, 2-5 minutes for propagation

### Step 2: Wait for API Propagation

**Duration:** 2-5 minutes

**Verification Command:**
```bash
# Check API status every 30 seconds
while true; do
  gcloud services list --enabled --project=192861381104 --filter="name:iamcredentials.googleapis.com" --format="value(name)"
  sleep 30
done
```

**Exit Condition:** Command returns `iamcredentials.googleapis.com`

### Step 3: Re-run Failed Workflow

**File:** `.github/workflows/cloudrun-deploy.yml`

**Action:** Trigger workflow re-run

**Methods:**
1. Via GitHub UI:
   - Navigate to: https://github.com/denhamparry/talks/actions/runs/19903865129
   - Click "Re-run failed jobs"

2. Via GitHub CLI:
   ```bash
   gh run rerun 19903865129 --failed
   ```

3. Via Git Push (triggers workflow):
   ```bash
   git commit --allow-empty -m "chore: trigger deployment after API enablement"
   git push origin main
   ```

**Expected Result:** Workflow completes successfully through all steps:
- ✅ Authenticate to Google Cloud
- ✅ Configure Docker for Artifact Registry
- ✅ Push to Artifact Registry
- ✅ Deploy to Cloud Run
- ✅ Verify deployment

### Step 4: Verify Deployment Success

**Test Commands:**

1. **Check workflow run status:**
   ```bash
   gh run view 19903865129 --log
   ```

2. **Verify image in Artifact Registry:**
   ```bash
   gcloud artifacts docker images list \
     europe-west1-docker.pkg.dev/denhamparry-talks/talks \
     --project=192861381104
   ```

3. **Check Cloud Run service status:**
   ```bash
   gcloud run services describe talks \
     --region=europe-west1 \
     --project=192861381104 \
     --format="value(status.url)"
   ```

4. **Test deployed service:**
   ```bash
   SERVICE_URL=$(gcloud run services describe talks \
     --region=europe-west1 \
     --project=192861381104 \
     --format="value(status.url)")

   curl -f "$SERVICE_URL/health"
   curl -f -I "$SERVICE_URL/"
   ```

**Expected Results:**
- Artifact Registry lists images with tags: `latest`, `<commit-sha>`
- Cloud Run service status shows `READY`
- Health endpoint returns 200 OK
- Homepage returns 200 OK

## Testing Strategy

### Unit Testing
Not applicable - this is an infrastructure configuration change with no code modifications.

### Integration Testing

**Test Case 1: Workload Identity Federation Authentication**
1. Trigger workflow manually: `gh workflow run cloudrun-deploy.yml`
2. Monitor "Authenticate to Google Cloud" step
3. **Expected:** Step completes successfully with green checkmark
4. **Validation:** No authentication errors in logs

**Test Case 2: Docker Push to Artifact Registry**
1. Workflow proceeds to "Push to Artifact Registry" step
2. Monitor Docker push operations for both tags (`:latest`, `:sha`)
3. **Expected:** Both images push successfully
4. **Validation:**
   ```bash
   gcloud artifacts docker images list \
     europe-west1-docker.pkg.dev/denhamparry-talks/talks
   ```
   Shows both image tags with correct digest

**Test Case 3: Cloud Run Deployment**
1. Workflow proceeds to "Deploy to Cloud Run" step
2. Service updates with new image
3. **Expected:** Deployment completes with revision successfully serving traffic
4. **Validation:**
   ```bash
   gcloud run services describe talks --region=europe-west1 --format="value(status.latestReadyRevisionName)"
   ```
   Shows new revision name

**Test Case 4: End-to-End Service Availability**
1. Access deployed service URL
2. Test health endpoint: `curl https://<service-url>/health`
3. Test homepage: `curl https://<service-url>/`
4. **Expected:** Both endpoints return 200 OK
5. **Validation:** Service serves presentation slides correctly

### Regression Testing

**Verify these existing functionalities remain intact:**

1. **Docker Build and GHCR Push** (`.github/workflows/docker-publish.yml`)
   - Workflow still builds multi-platform images
   - Images still push to `ghcr.io/denhamparry/talks:latest`
   - Verification steps still pass

2. **Presentation Slide Building**
   - MARP slides still generate HTML correctly
   - Dockerfile build includes all slides in `dist/`
   - Nginx serves slides from `/usr/share/nginx/html`

3. **CI Workflow** (`.github/workflows/ci.yml`)
   - Build and test steps unaffected
   - Pre-commit hooks continue to run

4. **Cloud Run Service Configuration**
   - Memory: 256Mi
   - CPU: 1
   - Min instances: 0
   - Max instances: 10
   - Port: 8080
   - Timeout: 60s
   - Allow unauthenticated: true

**Edge Cases:**

1. **API Enablement Propagation Delay**
   - If re-run immediately after enablement, may still fail
   - Solution: Wait 5 minutes before retry

2. **Multiple GCP Projects**
   - Ensure correct project ID used in commands
   - Verify `GCP_SERVICE_ACCOUNT` secret matches project

3. **Service Account Permissions**
   - If still fails after API enablement, check service account has `roles/artifactregistry.writer`
   - Check Workload Identity binding is correct

## Success Criteria

### Immediate Fix (High Priority)
- [ ] IAM Service Account Credentials API enabled in GCP project 192861381104
- [ ] API shows as enabled when listing services
- [ ] Workflow re-run completes successfully (all steps green)
- [ ] Docker images successfully pushed to Artifact Registry with both tags (`:latest`, `:sha`)
- [ ] Cloud Run service deploys new revision successfully
- [ ] Health endpoint returns 200 OK: `curl https://<service-url>/health`
- [ ] Homepage returns 200 OK: `curl https://<service-url>/`
- [ ] Service URL accessible and serves presentation slides
- [ ] No authentication errors in workflow logs
- [ ] Future commits to `main` branch trigger successful deployments

### Follow-up Documentation (Medium Priority)
- [ ] Update `docs/deployment-guide.md` Step 4 to include `iamcredentials.googleapis.com`
- [ ] Add note about Workload Identity Federation requiring this API
- [ ] Update troubleshooting section with this specific authentication error

## Files Modified

**No files in the repository require modification.** This is a GCP infrastructure configuration change.

**Related Files (for context):**
1. `.github/workflows/cloudrun-deploy.yml` - Deployment workflow (no changes needed)
2. `.github/workflows/docker-publish.yml` - Docker build workflow (no changes needed)

## Related Issues and Tasks

### Depends On
- GCP project `192861381104` exists and is accessible
- Workload Identity Federation already configured between GitHub and GCP
- GitHub secrets `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` are correctly set

### Blocks
- All Cloud Run deployments for the `talks` service
- Production release of presentation slides
- Testing deployment workflow changes

### Related
- Workload Identity Federation setup documentation
- GCP IAM and service account configuration
- Artifact Registry repository creation and permissions

### Enables
- Automated deployments to Cloud Run on every push to `main`
- Continuous delivery pipeline for presentation slides
- Testing of deployment workflow improvements
- Custom domain mapping setup (once deployments work)

## References

### Issue and Workflow Documentation
- [GitHub Issue #32](https://github.com/denhamparry/talks/issues/32)
- [Failed Workflow Run](https://github.com/denhamparry/talks/actions/runs/19903865129/job/57054810845)
- [GitHub Issue #26](https://github.com/denhamparry/talks/issues/26) - Original Cloud Run deployment setup (completed)
- [Issue #26 Implementation Plan](docs/plan/issues/26_deploy_talks_website_to_google_cloud_run_with_custom_domain.md) - Complete infrastructure setup guide

### Repository Documentation
- [Deployment Guide](docs/deployment-guide.md) - Complete Google Cloud Run deployment documentation
  - Step 4: Enable Required APIs (lines 114-127) - **Includes enabling required APIs** ⚠️
  - Step 6: Configure Workload Identity Federation (lines 183-222) - Context for authentication setup
  - Troubleshooting section (lines 517-575) - Deployment authentication errors

### Google Cloud Documentation
- [GCP IAM Service Account Credentials API Documentation](https://cloud.google.com/iam/docs/reference/credentials/rest)
- [GCP API Enablement Console](https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=192861381104)
- [Workload Identity Federation for GitHub Actions](https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines)
- [Google Cloud Auth Action Documentation](https://github.com/google-github-actions/auth)

## Notes

### Key Insights

1. **Infrastructure vs Code Issue**
   - This is a GCP project configuration prerequisite, not a bug in workflow code
   - No code changes required - purely administrative action
   - Common setup step that's easy to miss during initial Workload Identity Federation configuration

2. **Workload Identity Federation Requirements**
   - Requires IAM Service Account Credentials API for service account impersonation
   - This is separate from the IAM API itself
   - API must be enabled in the GCP project where the service account lives

3. **Error Message Clarity**
   - GCP error message provides exact solution with API enablement URL
   - Error appears during Docker authentication, not during initial GCP auth step
   - This is because service account impersonation happens during credential helper execution

4. **Propagation Time**
   - API enablement is not instant - requires 2-5 minutes for Google's distributed systems to sync
   - Immediate retry after enablement will likely still fail
   - This is expected behavior for GCP API management

5. **Deployment Guide Discrepancy**
   - The `docs/deployment-guide.md` (lines 114-127) documents enabling required APIs
   - **However**, it only lists: `run.googleapis.com`, `compute.googleapis.com`, `artifactregistry.googleapis.com`
   - **Missing**: `iamcredentials.googleapis.com` - which is critical for Workload Identity Federation
   - This is why the initial setup appeared successful but deployment failed
   - The deployment guide should be updated to include this API in the prerequisites

### Alternative Approaches Considered

1. **Service Account Key File Authentication** ❌
   - **How:** Download service account JSON key, store in GitHub secrets, use `google-github-actions/auth@v2` with `credentials_json`
   - **Why not chosen:**
     - Less secure - long-lived credentials
     - Requires key rotation management
     - Violates Google Cloud security best practices
     - Not recommended by Google for CI/CD pipelines

2. **Enable API via Terraform/IaC** ❌
   - **How:** Use Terraform `google_project_service` resource to enable API
   - **Why not chosen:**
     - Overkill for one-time setup
     - Adds infrastructure-as-code complexity
     - No evidence of existing Terraform setup in repository
     - Manual enablement is faster for immediate fix

3. **Enable API via gcloud CLI (Chosen)** ✅
   - **How:** `gcloud services enable iamcredentials.googleapis.com --project=192861381104`
   - **Why selected:**
     - Quick and immediate fix
     - Reproducible and documentable
     - No additional tooling required
     - Aligns with Google Cloud best practices for Workload Identity
     - Can be documented for future reference

### Best Practices

1. **Pre-deployment Checklist**
   - When setting up Workload Identity Federation in future projects, verify these APIs are enabled:
     - `iamcredentials.googleapis.com` (IAM Service Account Credentials API)
     - `iam.googleapis.com` (IAM API)
     - `artifactregistry.googleapis.com` (Artifact Registry API)
     - `run.googleapis.com` (Cloud Run API)

2. **Monitoring Approach**
   - Monitor workflow runs for authentication errors
   - Set up alerts for deployment failures in GitHub Actions
   - Consider adding a pre-deployment verification step that checks API enablement status

3. **Documentation**
   - Document required GCP APIs in repository README or setup guide
   - Include API enablement in onboarding documentation for new team members
   - Create runbook for common Workload Identity Federation issues

4. **Security Considerations**
   - Keep using Workload Identity Federation (not service account keys)
   - Regularly audit service account permissions
   - Use least-privilege IAM roles (e.g., `roles/artifactregistry.writer` instead of `roles/editor`)
   - Rotate Workload Identity Provider configurations periodically

5. **Error Handling**
   - Workflow should fail fast with clear error messages
   - Consider adding a preflight check step that validates API enablement before attempting Docker operations
   - Add workflow summary with troubleshooting links on failure

## Implementation Summary

### Documentation Updates Completed (2025-12-03)

To prevent this issue in future GCP Cloud Run deployments, the following documentation has been updated:

#### 1. Deployment Guide - Step 4: Enable Required APIs

**File:** `docs/deployment-guide.md` (lines 114-132)

**Changes:**
- Added `iamcredentials.googleapis.com` to the list of required APIs
- Added command: `gcloud services enable iamcredentials.googleapis.com --project=$PROJECT_ID`
- Added explanation note: "The IAM Service Account Credentials API is critical for Workload Identity Federation to impersonate service accounts"

**Impact:** Future deployments will include this API in the initial setup checklist, preventing the authentication error encountered in issue #32.

#### 2. Deployment Guide - Troubleshooting Section

**File:** `docs/deployment-guide.md` (lines 553-594)

**Changes:**
- Added new troubleshooting entry: "Unable to Acquire Impersonated Credentials"
- Documents symptoms: workflow fails at "Push to Artifact Registry" step
- Explains root cause: missing `iamcredentials.googleapis.com` API
- Provides solution: `gcloud services enable` command with verification steps
- Includes re-run instructions: `gh run rerun <RUN_ID> --failed`

**Impact:** Developers encountering this error can quickly diagnose and resolve the issue without needing to research GCP Workload Identity Federation internals.

### Manual Infrastructure Steps (User Action Required)

The following steps still need to be executed manually by someone with GCP project access:

1. **Enable the API:**
   ```bash
   gcloud services enable iamcredentials.googleapis.com --project=192861381104
   ```

2. **Wait for propagation:** 2-5 minutes

3. **Verify API enabled:**
   ```bash
   gcloud services list --enabled --project=192861381104 --filter="name:iamcredentials.googleapis.com"
   ```

4. **Re-run failed workflow:**
   ```bash
   gh run rerun 19903865129 --failed
   ```

5. **Verify deployment succeeds:** Check that all workflow steps complete successfully

### Success Criteria Status

**Documentation Tasks (Complete):**
- ✅ Updated `docs/deployment-guide.md` Step 4 to include `iamcredentials.googleapis.com`
- ✅ Added note about Workload Identity Federation requiring this API
- ✅ Added troubleshooting section with this specific authentication error
- ✅ Plan document updated with implementation summary

**Infrastructure Tasks (Pending - User Action):**
- ⏳ IAM Service Account Credentials API enabled in GCP project 192861381104
- ⏳ API shows as enabled when listing services
- ⏳ Workflow re-run completes successfully (all steps green)
- ⏳ Docker images successfully pushed to Artifact Registry
- ⏳ Cloud Run service deploys new revision successfully
- ⏳ Service URL accessible and serves presentation slides

Once the manual infrastructure steps are completed, issue #32 can be fully closed.
