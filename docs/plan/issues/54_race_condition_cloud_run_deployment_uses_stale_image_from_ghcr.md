# GitHub Issue #54: Race condition: Cloud Run deployment uses stale image from GHCR

**Issue:** [#54](https://github.com/denhamparry/talks/issues/54)
**Status:** Open
**Date:** 2025-12-03
**Labels:** bug, ci, cloud-run, priority-high

## Problem Statement

Cloud Run deployments are not reflecting the latest code changes despite GitHub Actions showing successful builds and deployments. This is a critical production issue affecting every deployment.

### Current Behavior

**The Problem:**
- Code changes pushed to `main` branch
- GitHub Actions reports successful build and deployment
- Cloud Run service shows outdated content/features
- Users see stale code in production

**Root Cause:**
Race condition between two parallel workflows that trigger simultaneously on push to `main`:

1. `.github/workflows/docker-publish.yml` - Build and push to GHCR
2. `.github/workflows/cloudrun-deploy.yml` - Deploy to Cloud Run

The Cloud Run deployment workflow completes **before** the Docker build workflow finishes pushing the new image to GHCR.

**Evidence from commit f8af4c1 deployment:**

| Workflow | Event | Timestamp | Details |
|----------|-------|-----------|---------|
| Docker Build & Push | Started | 23:44:34 | Building new image |
| Cloud Run Deploy | Started | 23:44:34 | Parallel start (race begins) |
| Cloud Run Deploy | **Pulled from GHCR** | **23:45:06** | **⚠️ OLD image pulled** |
| Cloud Run Deploy | Pushed to Artifact Registry | 23:45:11 | Old image cached |
| Cloud Run Deploy | Deployed to Cloud Run | 23:45:24 | Old image live |
| Cloud Run Deploy | Finished | 23:45:46 | Stale deployment complete |
| Docker Build & Push | **Image pushed to GHCR** | **23:45:46** | **⚠️ NEW image available (40s too late!)** |
| Docker Build & Push | Finished | 23:46:06 | New image ready but not deployed |

**The 40-second gap:**
- Deployment pulls from GHCR at **23:45:06**
- New image isn't available until **23:45:46** (40 seconds later)
- Result: Stale code deployed to production

### Expected Behavior

- Code pushed to `main` triggers workflows
- Docker build completes and pushes new image to GHCR
- Cloud Run deployment waits for build completion
- Deployment pulls latest image from registry
- Production reflects latest code changes

### Impact

- **Severity:** High - Production deployments do not reflect latest code
- **Frequency:** Every deployment to `main` branch
- **User Impact:** Users see outdated content/features, breaking user trust
- **Development Impact:** Confusion, debugging time, manual interventions needed

## Current State Analysis

### Relevant Workflows

**1. Docker Build & Push** (`.github/workflows/docker-publish.yml`)
- **Trigger:** `on.push.branches: [main]` and path filters
- **Job:** `build-and-push`
- **Duration:** ~90 seconds (builds multi-arch: amd64, arm64)
- **Actions:**
  - Build Docker image
  - Push to GHCR with tags (latest, sha, etc.)
  - Verify image
  - Run smoke tests
- **Output:** Image at `ghcr.io/denhamparry/talks:latest`

**2. Cloud Run Deployment** (`.github/workflows/cloudrun-deploy.yml`)
- **Trigger:** `on.push.branches: [main]` and path filters (same as build)
- **Job:** `deploy`
- **Duration:** ~70 seconds
- **Actions:**
  - Authenticate to GCP
  - **Pull from GHCR** (line 59) ⚠️ **Race condition point**
  - Tag for Artifact Registry (lines 61-66)
  - Push to Artifact Registry (lines 68-71)
  - Deploy to Cloud Run from Artifact Registry
  - Verify deployment
- **Output:** Service at `https://talks.denhamparry.co.uk`

### Key Code Locations

**`.github/workflows/docker-publish.yml`:**
- Lines 3-13: Trigger on push to main with path filters
- Lines 80-93: Build and push step (critical timing)
- Lines 105-110: Image verification (confirms push completion)

**`.github/workflows/cloudrun-deploy.yml`:**
- Lines 3-15: Trigger on push to main (same paths as build workflow)
- Lines 51-59: GHCR login and pull ⚠️ **RACE CONDITION**
- Lines 61-71: Tag and push to Artifact Registry (caches old image)
- Lines 73-88: Deploy to Cloud Run (deploys old image)

### Architecture Observations

**Current Multi-Registry Setup:**
1. **GHCR (GitHub Container Registry):** Primary build target
   - Public access, GitHub integration
   - Built by `docker-publish.yml`
   - Source for Cloud Run deployment (race condition here)

2. **GCP Artifact Registry (europe-west1):**
   - Secondary cache/mirror
   - Cloud Run deployment source
   - Same region as Cloud Run service (faster pulls)
   - Currently just a relay from GHCR (line 59-71)

**Why Artifact Registry exists:**
- Co-located with Cloud Run (europe-west1) for faster pulls
- GCP-native integration benefits
- Already configured and working (just fed by wrong source timing)

### Dependencies and Constraints

**Shared Path Filters:**
Both workflows trigger on identical paths:
```yaml
paths:
  - 'slides/**'
  - 'themes/**'
  - 'templates/**'
  - 'Dockerfile'
  - 'nginx.conf'
  - 'package.json'
  - 'marp.config.js'
```

This guarantees both workflows start simultaneously, creating the race condition.

## Solution Design

### Recommended Approach: Sequential Workflows (Option 1)

Use GitHub Actions `workflow_run` trigger to create a dependency chain, ensuring Cloud Run deployment only starts after Docker build completes successfully.

**Why This Approach:**
- ✅ Simple, minimal code changes
- ✅ Guarantees correct ordering (build → deploy)
- ✅ No architecture changes needed
- ✅ Preserves existing GHCR + Artifact Registry setup
- ✅ Easy to understand and maintain
- ✅ No additional GCP permissions needed
- ⚠️ Slightly longer total time (sequential vs parallel, but correctness > speed)

### Implementation Details

**Change Required:**
Modify `.github/workflows/cloudrun-deploy.yml` trigger from `on.push` to `on.workflow_run`:

```yaml
# BEFORE (creates race condition):
on:
  push:
    branches:
      - main
    paths:
      - 'slides/**'
      # ... other paths

# AFTER (ensures sequential execution):
on:
  workflow_run:
    workflows: ["Build and Publish Docker Image"]
    types:
      - completed
    branches:
      - main
  workflow_dispatch:  # Keep manual trigger
```

**How It Works:**
1. Push to `main` → Only Docker build workflow starts
2. Docker build completes → Triggers Cloud Run deployment workflow
3. Cloud Run deployment pulls from GHCR → Gets latest image (guaranteed)
4. Deployment succeeds with current code

**Workflow Name Verification:**
The workflow name `"Build and Publish Docker Image"` must match exactly:
- Source: `.github/workflows/docker-publish.yml:1`
- Current value: `name: Build and Publish Docker Image`

### Alternative Approaches Considered

**Option 2: Use Artifact Registry as Primary Build Target**

Have `docker-publish.yml` push directly to both GHCR and Artifact Registry:

**Pros:**
- Eliminates GHCR as intermediary
- Artifact Registry is same region as Cloud Run (faster)
- More GCP-native architecture

**Cons:**
- Requires GCP authentication in build workflow
- More complex permission management
- Larger workflow changes
- GHCR might be preferred for GitHub ecosystem integration
- Still needs `workflow_run` trigger to avoid race

**Verdict:** ❌ Not recommended - adds complexity without solving root cause

**Option 3: Combined Workflow**

Merge both workflows into single file with job dependencies:

```yaml
jobs:
  build-and-push:
    # Build and push to registries

  deploy:
    needs: build-and-push
    # Deploy from registry
```

**Pros:**
- Clear dependency in single file
- Guaranteed ordering
- Easy to understand

**Cons:**
- Loses modularity (can't trigger build without deploy)
- Can't reuse build workflow for PRs
- Harder to maintain separate concerns
- No independent manual triggers

**Verdict:** ❌ Not recommended - reduces flexibility

**Option 4: Manual Delay/Sleep**

Add `sleep 60` before pulling from GHCR:

**Verdict:** ❌ Terrible idea - brittle, unreliable, wastes CI time

### Why Option 1 (workflow_run) is Best

1. **Correctness:** Mathematically guarantees no race condition
2. **Simplicity:** One trigger change, no logic changes
3. **Maintainability:** Clear intent, easy to debug
4. **Flexibility:** Preserves independent workflow triggers
5. **No New Dependencies:** Uses existing GitHub Actions features
6. **Preserves Architecture:** Keeps GHCR and Artifact Registry roles intact

## Implementation Plan

### Prerequisites

- [ ] Verify workflow name in `docker-publish.yml` matches exactly
- [ ] Ensure no other workflows depend on current cloud-run trigger timing
- [ ] Backup current workflow files (git handles this)

### Step 1: Update Cloud Run Deployment Trigger

**File:** `.github/workflows/cloudrun-deploy.yml`

**Changes:**
Replace the `on` trigger section (lines 3-16) with workflow_run trigger:

```yaml
on:
  workflow_run:
    workflows: ["Build and Publish Docker Image"]
    types:
      - completed
    branches:
      - main
  workflow_dispatch:
```

**Rationale:**
- `workflows: ["Build and Publish Docker Image"]` - References exact name from docker-publish.yml:1
- `types: [completed]` - Triggers only after build workflow finishes (success or failure)
- `branches: [main]` - Only for main branch completions
- `workflow_dispatch` - Preserves manual trigger capability

**Testing after change:**
```bash
# Push a small change to main
git commit --allow-empty -m "test: verify sequential workflow execution"
git push origin main

# Monitor workflow execution order
gh run list --limit 5
gh run watch  # Watch latest run
```

**Expected behavior:**
- `Build and Publish Docker Image` starts immediately
- `Deploy to Cloud Run` starts only after build completes
- Deployment pulls latest image from GHCR (no race condition)

### Step 2: Add Workflow Status Check (Optional Enhancement)

**File:** `.github/workflows/cloudrun-deploy.yml`

**Changes:**
Add conditional deployment based on build success (insert after checkout step, line 36):

```yaml
- name: Check build workflow status
  if: github.event.workflow_run.conclusion != 'success'
  run: |
    echo "::error::Build workflow failed or was cancelled - skipping deployment"
    exit 1
```

**Rationale:**
- `workflow_run` triggers on completion (success, failure, or cancelled)
- This check ensures we only deploy when build succeeded
- Prevents deploying outdated image if build fails

**Alternative (simpler):**
Add job-level condition:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    # ... rest of job
```

### Step 3: Update Workflow Documentation

**File:** `.github/workflows/cloudrun-deploy.yml`

**Changes:**
Add comment explaining the workflow_run trigger (insert at line 2):

```yaml
name: Deploy to Cloud Run

# Triggered after Docker build completes to avoid race condition
# See: https://github.com/denhamparry/talks/issues/54
on:
  workflow_run:
    workflows: ["Build and Publish Docker Image"]
    types:
      - completed
    branches:
      - main
  workflow_dispatch:
```

**Rationale:**
- Future maintainers understand why workflow_run is used
- Links to issue for full context
- Documents the dependency relationship

### Step 4: Consider Path Filter Removal (Optional)

**File:** `.github/workflows/cloudrun-deploy.yml`

**Current state:**
- Has `paths` filter (lines 7-14)
- Now redundant since workflow_run inherits build trigger paths

**Decision:**
- **Keep paths filter:** No harm, provides documentation
- **Remove paths filter:** Simplifies workflow (workflow_run controls triggering)

**Recommendation:** Remove paths filter (clean up):

```yaml
on:
  workflow_run:
    workflows: ["Build and Publish Docker Image"]
    types:
      - completed
    branches:
      - main
  workflow_dispatch:  # No paths needed - inherited from build workflow
```

## Testing Strategy

### Unit Testing (Workflow Validation)

**Test 1: Workflow Trigger Validation**

```bash
# Validate workflow YAML syntax
gh workflow view "Deploy to Cloud Run" --yaml
```

**Expected result:**
- Valid YAML syntax
- `workflow_run` trigger present
- References correct workflow name

**Test 2: Workflow Name Reference**

```bash
# Verify referenced workflow exists
gh workflow list | grep "Build and Publish Docker Image"
```

**Expected result:**
- Workflow found with exact name match

### Integration Testing

**Test Case 1: Normal Push to Main (Fresh Deployment)**

**Setup:**
1. Make small content change (e.g., edit slide)
2. Commit and push to main

**Test steps:**
```bash
# 1. Push change
echo "# Test Slide" >> slides/test.md
git add slides/test.md
git commit -m "test: verify sequential workflow"
git push origin main

# 2. Monitor workflows
gh run list --limit 5 --json name,status,conclusion,createdAt

# 3. Wait and check order
gh run watch
```

**Expected results:**
- ✅ `Build and Publish Docker Image` starts immediately
- ✅ `Build and Publish Docker Image` completes successfully
- ✅ `Deploy to Cloud Run` starts AFTER build completes
- ✅ `Deploy to Cloud Run` pulls latest image (log check)
- ✅ Cloud Run service shows new content

**Validation:**
```bash
# Check workflow run order by timestamps
gh api /repos/denhamparry/talks/actions/runs \
  --jq '.workflow_runs | sort_by(.created_at) | .[] | select(.head_branch=="main") | {name: .name, created: .created_at, conclusion: .conclusion}' \
  | head -10

# Verify image digest deployed matches latest build
gh run view --log | grep "Image digest"
```

**Test Case 2: Build Failure Scenario**

**Setup:**
1. Introduce build failure (invalid Dockerfile syntax)
2. Push to main

**Test steps:**
```bash
# 1. Break Dockerfile temporarily
echo "INVALID SYNTAX" >> Dockerfile
git add Dockerfile
git commit -m "test: verify deployment skips on build failure"
git push origin main

# 2. Monitor workflows
gh run watch
```

**Expected results:**
- ✅ `Build and Publish Docker Image` starts
- ✅ `Build and Publish Docker Image` fails
- ✅ `Deploy to Cloud Run` either:
  - Doesn't start at all (if job-level condition used), OR
  - Starts but exits immediately (if step-level check used)
- ✅ No deployment to Cloud Run
- ✅ Cloud Run continues serving last good deployment

**Cleanup:**
```bash
git revert HEAD
git push origin main
```

**Test Case 3: Manual Workflow Dispatch**

**Test steps:**
```bash
# Trigger deployment manually (should still work)
gh workflow run "Deploy to Cloud Run"
gh run watch
```

**Expected results:**
- ✅ Deployment workflow starts
- ✅ Pulls latest image from GHCR
- ✅ Deploys successfully

**Test Case 4: Rapid Successive Pushes**

**Test steps:**
```bash
# Push multiple commits quickly
for i in {1..3}; do
  echo "Change $i" >> slides/test.md
  git add slides/test.md
  git commit -m "test: rapid push $i"
  git push origin main
  sleep 5
done

# Monitor all workflow runs
gh run list --limit 10
```

**Expected results:**
- ✅ Each build workflow completes independently
- ✅ Each deployment waits for its corresponding build
- ✅ No race conditions
- ✅ Final deployment reflects last commit

### Regression Testing

**Existing Functionality Verification:**

1. **PR Builds (Should Not Deploy)**
   ```bash
   # Create test PR
   git checkout -b test/pr-no-deploy
   echo "PR change" >> slides/test.md
   git add slides/test.md
   git commit -m "test: PR should build but not deploy"
   git push origin test/pr-no-deploy
   gh pr create --fill

   # Verify
   gh run list --limit 5
   ```

   **Expected:**
   - ✅ `Build and Publish Docker Image` runs (with push: false)
   - ✅ `Deploy to Cloud Run` does NOT run
   - ✅ No deployment triggered

2. **Path Filter Behavior**
   ```bash
   # Change non-triggering file
   echo "update" >> README.md
   git add README.md
   git commit -m "docs: update readme"
   git push origin main
   ```

   **Expected:**
   - ✅ Neither workflow runs (paths not matched)

3. **Artifact Registry Push**
   ```bash
   # After successful deployment, verify Artifact Registry
   gcloud artifacts docker images list \
     europe-west1-docker.pkg.dev/denhamparry-talks/talks
   ```

   **Expected:**
   - ✅ Latest image present with correct digest
   - ✅ SHA-tagged image present

4. **Cloud Run Service Health**
   ```bash
   # Verify deployment health
   curl -f https://talks.denhamparry.co.uk/health
   curl -f -I https://talks.denhamparry.co.uk/
   ```

   **Expected:**
   - ✅ Health endpoint returns 200
   - ✅ Homepage accessible

### Performance Comparison

**Before Fix (Parallel Workflows):**
- Total time: ~90 seconds (overlapping execution)
- Result: Stale deployment (wrong image)

**After Fix (Sequential Workflows):**
- Build time: ~90 seconds
- Deploy time: ~70 seconds
- Total time: ~160 seconds (sequential execution)
- Result: Correct deployment (latest image)

**Trade-off Analysis:**
- ⏱️ Additional ~70 seconds per deployment
- ✅ 100% reliability vs 0% reliability
- ✅ User sees correct code
- ✅ No manual interventions needed
- ✅ Developer confidence restored

**Verdict:** Extra time is acceptable for correctness.

## Success Criteria

### Functional Requirements
- [x] Cloud Run deployment workflow uses `workflow_run` trigger
- [ ] Deployment only starts after Docker build completes
- [ ] Deployment pulls latest image from GHCR (verified in logs)
- [ ] Cloud Run service reflects latest code changes
- [ ] Manual workflow dispatch still works
- [ ] Build failures prevent deployment (optional enhancement)

### Testing Requirements
- [ ] Test Case 1 passes: Normal deployment with latest code
- [ ] Test Case 2 passes: Build failure scenario handled correctly
- [ ] Test Case 3 passes: Manual dispatch works
- [ ] Test Case 4 passes: Rapid pushes don't create race conditions
- [ ] Regression tests pass: PRs, path filters, health checks all work

### Documentation Requirements
- [ ] Workflow file includes explanatory comments
- [ ] Issue #54 linked in workflow comments
- [ ] This plan document created and committed

### Monitoring Requirements
- [ ] First deployment after fix monitored in real-time
- [ ] Workflow run timestamps verified (build → deploy order)
- [ ] Image digest comparison (build output vs deployed image)
- [ ] Cloud Run service content verified (matches latest commit)

### Deployment Validation
- [ ] Health endpoint responds: `https://talks.denhamparry.co.uk/health`
- [ ] Homepage accessible: `https://talks.denhamparry.co.uk/`
- [ ] Latest slide changes visible in production
- [ ] No errors in Cloud Run logs

## Files Modified

1. `.github/workflows/cloudrun-deploy.yml` - Update trigger from `push` to `workflow_run`
   - Lines 3-16: Replace trigger section
   - Line 2: Add explanatory comment
   - Lines 7-14: Remove paths filter (optional cleanup)
   - After line 36: Add build status check (optional enhancement)

2. `docs/plan/issues/54_race_condition_cloud_run_deployment_uses_stale_image_from_ghcr.md` - This plan document

## Related Issues and Tasks

### Depends On
- None - standalone fix

### Blocks
- Future deployment reliability improvements
- Automated rollback strategies
- Multi-environment deployment workflows

### Related
- Issue #54 - Original bug report
- Commit f8af4c1 - Evidence of race condition
- `.github/workflows/docker-publish.yml` - Build workflow (no changes needed)

### Enables
- Reliable CI/CD pipeline
- Faster development iteration (no manual re-deployments)
- Future enhancements:
  - Automated rollback on deployment failure
  - Blue-green deployments
  - Canary releases

## Future Improvements (Out of Scope)

### 1. Optimize Artifact Registry Usage
**Idea:** Have build workflow push directly to Artifact Registry
**Benefits:**
- Faster Cloud Run deployments (same region)
- Reduced network transfers
- More GCP-native

**Considerations:**
- Requires GCP authentication in build workflow
- Permission management complexity
- GHCR might still be valuable for GitHub ecosystem

**Decision:** Defer until current fix is validated

### 2. Deployment Verification Enhancements
**Ideas:**
- Smoke tests post-deployment
- Automated rollback on failure
- Slack/Discord notifications

**Decision:** Separate issue/PR

### 3. Multi-Environment Support
**Ideas:**
- Staging environment (workflow_run from PRs)
- Production environment (workflow_run from main)
- Environment-specific configurations

**Decision:** Future enhancement

## References

- [GitHub Issue #54](https://github.com/denhamparry/talks/issues/54) - Original bug report with detailed analysis
- [GitHub Actions: workflow_run](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run) - Official documentation
- [Cloud Run Documentation](https://cloud.google.com/run/docs) - GCP Cloud Run reference
- [Artifact Registry](https://cloud.google.com/artifact-registry/docs) - GCP container registry
- Commit f8af4c1 - Evidence commit showing 40-second race condition gap

## Notes

### Key Insights

1. **Race conditions are subtle:** Both workflows succeeded, logs looked clean, but timing was wrong
2. **Parallel execution isn't always better:** Sequential guarantees correctness
3. **Artifact Registry was already set up:** The infrastructure was ready, just fed by wrong timing
4. **Evidence-based debugging:** Timestamp analysis (23:45:06 vs 23:45:46) identified the exact problem
5. **Simple fixes are best:** One trigger change solves the entire issue

### Design Decisions

**Why workflow_run over needs:**
- `needs` only works within same workflow file
- `workflow_run` enables cross-workflow dependencies
- Preserves workflow modularity and independent triggers

**Why not add delays/sleep:**
- Brittle (build time varies)
- Wastes CI minutes
- Doesn't guarantee correctness
- Professional solutions use dependencies, not timing hacks

**Why keep Artifact Registry:**
- Already configured and working
- Co-located with Cloud Run (performance benefit)
- GCP-native integration advantages
- No reason to remove working infrastructure

### Alternative Approaches Considered

1. **Merge workflows** - Rejected (loses modularity)
2. **Direct Artifact Registry builds** - Deferred (unnecessary complexity)
3. **Manual delays** - Rejected (unprofessional, unreliable)
4. **Polling/checking** - Rejected (complexity, wasted resources)

### Best Practices Applied

- **Evidence-based debugging:** Used actual timestamps to identify root cause
- **Minimal changes:** One trigger change solves the problem
- **Preserve flexibility:** Manual triggers still work
- **Document thoroughly:** Future maintainers understand the why
- **Test comprehensively:** Multiple scenarios covered
- **Monitor metrics:** Time trade-off analyzed and accepted

### Monitoring and Observability

**Pre-deployment:**
```bash
# Check current workflow configuration
gh workflow view "Deploy to Cloud Run" --yaml

# Review recent runs
gh run list --workflow="Deploy to Cloud Run" --limit 10
```

**Post-deployment:**
```bash
# Monitor first deployment after fix
gh run watch

# Compare timestamps (verify sequential execution)
gh run list --limit 5 --json name,createdAt,conclusion

# Verify deployed image digest
gcloud run services describe talks --region=europe-west1 --format='value(status.imageDigest)'

# Compare with built image digest
gh run view <run-id> --log | grep digest
```

**Ongoing monitoring:**
- GitHub Actions workflow duration trends
- Cloud Run deployment success rate
- Time between code push and production availability

### Risk Assessment

**Low Risk Change:**
- ✅ No code changes to application
- ✅ No infrastructure changes
- ✅ Only workflow trigger modification
- ✅ Easy to revert (git revert)
- ✅ Manual dispatch preserved (escape hatch)

**Rollback Plan:**
If sequential execution causes issues:
```bash
# Revert commit
git revert HEAD
git push origin main

# Or manual emergency deploy
gh workflow run "Deploy to Cloud Run"
```

**Testing reduces risk:**
- Non-production testing via PRs
- Monitoring first main deployment
- Gradual validation approach
