# GitHub Issue #30: Fix Cloud Run deployment: GHCR image pull authentication failure

**Issue:** [#30](https://github.com/denhamparry/talks/issues/30)
**Status:** Open
**Date:** 2025-12-03
**Labels:** bug, ci

## Problem Statement

The GitHub Action that deploys to Cloud Run is failing when attempting to pull the Docker image from GitHub Container Registry (GHCR). The deployment workflow fails at the "Pull image from GHCR" step with an authentication error.

### Current Behavior
- Cloud Run deployment workflow fails at step "Pull image from GHCR"
- Error: `Error response from daemon: Head "https://ghcr.io/v2/denhamparry/talks/manifests/latest": unauthorized`
- The workflow attempts to pull `ghcr.io/denhamparry/talks:latest` without authentication
- This breaks the deployment pipeline, preventing latest changes from reaching production
- Failed run: https://github.com/denhamparry/talks/actions/runs/19903316401/job/57052876051

### Expected Behavior
- Workflow should authenticate with GHCR before pulling images
- Docker pull should succeed and retrieve the latest image
- Image should be re-tagged for Artifact Registry
- Deployment to Cloud Run should complete successfully
- Latest presentations should be available at the production URL

## Root Cause Analysis

### The Authentication Gap

The cloudrun-deploy.yml workflow (lines 50-51) attempts to pull from GHCR without prior authentication:

```yaml
- name: Pull image from GHCR
  run: docker pull ghcr.io/denhamparry/talks:latest
```

**Why this fails:**
1. **GHCR requires authentication** even for public packages in some contexts
2. **No login step exists** before the pull command
3. **GITHUB_TOKEN not automatically available** to Docker CLI
4. The workflow authenticates with GCP (lines 37-48) but not with GHCR

### Workflow Architecture

The current deployment strategy uses a **two-step publishing approach**:

1. **docker-publish.yml** (lines 1-157)
   - Builds image and publishes to `ghcr.io/denhamparry/talks:latest`
   - Uses `docker/login-action@v3` to authenticate (lines 56-61)
   - Successfully pushes to GHCR with proper authentication

2. **cloudrun-deploy.yml** (lines 1-112)
   - Pulls image from GHCR
   - Re-tags for Artifact Registry
   - Pushes to `europe-west1-docker.pkg.dev`
   - Deploys to Cloud Run

**The problem:** Step 2 pulls from GHCR without authenticating, causing the failure.

### Why Not Direct Build?

The workflow intentionally pulls from GHCR instead of rebuilding because:
- **Build consistency**: Ensures the exact same image tested in docker-publish is deployed
- **Faster deployments**: Avoids rebuilding slides (can take 2-3 minutes)
- **Separation of concerns**: Build/test in one workflow, deploy in another
- **Artifact immutability**: The GHCR image is the verified artifact

## Current State Analysis

### Relevant Code/Config

**File: `.github/workflows/cloudrun-deploy.yml`**

**Problem area (lines 50-51):**
```yaml
- name: Pull image from GHCR
  run: docker pull ghcr.io/denhamparry/talks:latest
```

**Permissions declared (lines 29-31):**
```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC authentication
```

**Missing:** `packages: read` permission for GHCR access

**Authentication steps present:**
- Lines 37-48: Google Cloud authentication (works correctly)
- Lines 47-48: Artifact Registry Docker authentication (works correctly)
- **Missing:** GHCR authentication

**Working example in docker-publish.yml (lines 56-61):**
```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

### Related Context

**GHCR Authentication Requirements:**
- Requires GitHub token with `packages:read` permission
- Token available as `secrets.GITHUB_TOKEN` in GitHub Actions
- Must authenticate before `docker pull` commands
- Authentication persists for the duration of the job

**GITHUB_TOKEN Permissions:**
- Automatically provided by GitHub Actions
- Permissions must be explicitly declared in workflow
- Default permissions vary by repository settings
- Needs `packages: read` for pulling images from GHCR

**Alternative Solutions Considered:**
1. ✅ **Add GHCR authentication** (Recommended)
   - Minimal change to existing workflow
   - Maintains two-step build/deploy architecture
   - Uses existing GITHUB_TOKEN

2. ❌ **Rebuild image in deployment workflow**
   - Duplicates build logic
   - Slower deployments
   - Doesn't guarantee same artifact is deployed
   - Requires maintaining build steps in two places

3. ❌ **Make GHCR package public**
   - Security concern (exposes image publicly)
   - Still may require authentication in some contexts
   - Not a reliable long-term solution

## Solution Design

### Approach

Add GHCR authentication step before pulling the image. This is a **2-line change** plus permissions update.

**Strategy:**
1. Add `packages: read` to workflow permissions
2. Insert GHCR login step before the pull command
3. Use the same authentication pattern as docker-publish.yml
4. Leverage existing `GITHUB_TOKEN` (no new secrets needed)

### Implementation

**Change 1: Update permissions (lines 29-31)**

```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC authentication
  packages: read   # Required for pulling from GHCR
```

**Change 2: Add GHCR login step (insert after line 48, before line 50)**

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Pull image from GHCR
  run: docker pull ghcr.io/denhamparry/talks:latest
```

### Benefits

1. **Minimal change**: Only 3 lines added (1 permission, 1 action with 4 parameters)
2. **No new secrets**: Uses existing `GITHUB_TOKEN`
3. **Consistent pattern**: Matches docker-publish.yml authentication
4. **Secure**: Maintains private package access control
5. **Standard practice**: Uses official `docker/login-action@v3`
6. **Future-proof**: Will work for any GHCR pulls in this workflow

### Why docker/login-action@v3?

- **Official Docker action**: Maintained by Docker organization
- **Secure credential handling**: Doesn't expose tokens in logs
- **Automatic cleanup**: Logs out after job completes
- **Already used**: Proven working in docker-publish.yml (line 57)
- **Latest version**: v3 is current stable release

## Implementation Plan

### Step 1: Update workflow permissions

**File:** `.github/workflows/cloudrun-deploy.yml`

**Location:** Lines 29-31

**Change:** Add `packages: read` permission

**Before:**
```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC authentication
```

**After:**
```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC authentication
  packages: read   # Required for pulling from GHCR
```

**Rationale:** Grants the workflow permission to read packages from GHCR

### Step 2: Add GHCR authentication step

**File:** `.github/workflows/cloudrun-deploy.yml`

**Location:** Insert new step after line 48 (after "Configure Docker for Artifact Registry")

**Change:** Add GHCR login step

**Insert between lines 48-50:**
```yaml
      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker ${{ env.ARTIFACT_REGISTRY }}

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Pull image from GHCR
        run: docker pull ghcr.io/denhamparry/talks:latest
```

**Rationale:** Authenticates Docker with GHCR before attempting to pull the image

**Testing:**
```bash
# Verify the action can pull the image
# This will be tested when the workflow runs
```

## Testing Strategy

### Pre-deployment Verification

**Manual test (optional):**
```bash
# Test GHCR authentication locally
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/denhamparry/talks:latest
```

### Automated Testing

The workflow itself provides comprehensive testing:

**Test Case 1: GHCR Authentication**
1. Workflow runs `docker/login-action@v3` with GITHUB_TOKEN
2. Action logs in to ghcr.io
3. Authentication succeeds (no error output)

**Test Case 2: Image Pull**
1. Workflow runs `docker pull ghcr.io/denhamparry/talks:latest`
2. Docker pulls image layers
3. Pull completes successfully
4. Image is available locally for tagging

**Test Case 3: Complete Deployment**
1. Image is tagged for Artifact Registry
2. Image is pushed to Artifact Registry
3. Cloud Run deployment succeeds
4. Service URL responds to health check
5. Homepage is accessible

**Test Case 4: Verification Steps (lines 82-96)**
1. Health endpoint returns 200 status
2. Homepage returns successful response
3. Deployment URL is output in summary

### Regression Testing

**Existing functionality to verify:**
- ✅ Docker publish workflow still works (unchanged)
- ✅ Image tagging works (unchanged)
- ✅ Artifact Registry push works (unchanged)
- ✅ Cloud Run deployment works (unchanged)
- ✅ Health checks work (unchanged)
- ✅ Domain mapping works (unchanged)

**Edge cases:**
- **Invalid token**: Workflow will fail fast at login step (clear error)
- **Missing permissions**: GitHub will report permission error (clear error)
- **Image doesn't exist**: Docker pull will fail with clear error message
- **Network issues**: Login action will retry automatically

### Success Criteria

- [ ] Workflow permissions include `packages: read`
- [ ] GHCR login step added before pull command
- [ ] Workflow run completes without authentication errors
- [ ] Image successfully pulled from GHCR
- [ ] Image successfully tagged for Artifact Registry
- [ ] Image successfully pushed to Artifact Registry
- [ ] Cloud Run service deploys successfully
- [ ] Health check passes
- [ ] Service URL accessible at https://talks-192861381104.europe-west1.run.app
- [ ] Custom domain accessible at https://talks.denhamparry.co.uk
- [ ] No new secrets required
- [ ] Deployment time not significantly increased

## Files Modified

1. `.github/workflows/cloudrun-deploy.yml` - Add GHCR authentication
   - Line 31: Add `packages: read` permission
   - After line 48: Add GHCR login step using docker/login-action@v3

## Related Issues and Tasks

### Depends On
- None (standalone fix)

### Blocks
- Cloud Run deployments are currently blocked by this issue
- Any updates to presentations cannot be deployed

### Related
- Issue #26: Deploy talks website to Google Cloud Run with custom domain (✅ Complete)
  - This issue created the deployment workflow that now needs the auth fix
- `.github/workflows/docker-publish.yml` (lines 56-61)
  - Working example of GHCR authentication pattern

### Enables
- Automatic deployments on main branch pushes
- Continuous delivery of presentation updates
- Reliable Cloud Run deployment pipeline

## References

- [GitHub Issue #30](https://github.com/denhamparry/talks/issues/30)
- [Failed workflow run](https://github.com/denhamparry/talks/actions/runs/19903316401/job/57052876051)
- [docker/login-action documentation](https://github.com/docker/login-action)
- [GitHub Container Registry authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions permissions](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)

## Notes

### Key Insights

1. **Minimal change principle**: The fix requires only 3 lines of changes (1 permission + 1 action)
2. **No secrets needed**: Uses existing GITHUB_TOKEN provided by GitHub Actions
3. **Consistent patterns**: Follows the same authentication approach as docker-publish.yml
4. **Clear separation**: Maintains the two-step architecture (build in one workflow, deploy in another)
5. **Future-proof**: Any future GHCR pulls will also work with this authentication

### Alternative Approaches Considered

1. **Rebuild image in deployment workflow** ❌
   - Why not: Duplicates build logic, slower deployments, doesn't guarantee same artifact
   - Trade-off: Would eliminate GHCR dependency but adds complexity

2. **Use personal access token** ❌
   - Why not: Requires creating and managing a PAT secret
   - Trade-off: GITHUB_TOKEN is automatically provided and scoped to the workflow

3. **Make GHCR package public** ❌
   - Why not: Security concern, not a reliable solution
   - Trade-off: Would work but exposes package publicly unnecessarily

4. **Use docker/build-push-action with pull** ❌
   - Why not: Over-engineered for a simple pull operation
   - Trade-off: Adds unnecessary complexity

5. **Switch to Artifact Registry for builds** ❌
   - Why not: Requires significant refactoring, GCP authentication in docker-publish workflow
   - Trade-off: Would eliminate GHCR entirely but adds GCP dependency to build workflow

### Best Practices

**Authentication:**
- Always authenticate before pulling from registries
- Use official Docker actions for login (docker/login-action)
- Declare required permissions explicitly in workflow

**Deployment:**
- Use verified artifacts from build workflow (pull from GHCR)
- Don't rebuild in deployment workflows
- Maintain separation between build and deploy stages

**Monitoring:**
- Check workflow run logs for authentication success
- Monitor Cloud Run deployment status
- Verify service health after deployment
- Check custom domain accessibility

**Security:**
- Use GITHUB_TOKEN instead of personal access tokens
- Limit permissions to minimum required (`packages: read`)
- Don't expose tokens in logs or error messages
- Keep packages private unless intentionally public

### Implementation Notes

**Line numbers reference:** Based on current cloudrun-deploy.yml (112 lines)

**After fix, new line numbers will be:**
- Permissions block: lines 29-32 (was 29-31)
- GHCR login: lines 50-54 (new)
- GHCR pull: lines 56-57 (was 50-51)

**Commit message:**
```
fix(ci): add GHCR authentication to Cloud Run deployment

- Add packages:read permission to workflow
- Add docker/login-action step before GHCR pull
- Use existing GITHUB_TOKEN for authentication

Fixes #30
```

**Testing approach:**
- Push changes to a feature branch first
- Test workflow run on feature branch
- Verify authentication and pull succeed
- Merge to main after successful test
- Monitor main branch deployment

**Rollback plan:**
- If deployment fails, revert the commit
- Previous state: deployment failing at GHCR pull (broken)
- This fix: deployment should complete (working)
- Worst case: still failing at same step (no worse than before)
