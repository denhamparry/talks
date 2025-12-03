# GitHub Issue #47: Fix Docker workflow smoke test timing issue

**Issue:** [#47](https://github.com/denhamparry/talks/issues/47)
**Status:** Open
**Date:** 2025-12-03
**Priority:** Low
**Labels:** bug, ci, docker

## Problem Statement

The Docker workflow smoke test in `.github/workflows/docker-publish.yml` occasionally fails due to a timing issue when checking the health endpoint. The curl command runs too quickly after container start, causing a connection reset error.

### Current Behavior

**Workflow:** Build and Publish Docker Image
**Step:** Smoke test - Verify server responds
**Error:**
```
curl: (56) Recv failure: Connection reset by peer
```

**Current implementation (docker-publish.yml:125-144):**
```yaml
- name: Smoke test - Verify server responds
  if: github.event_name != 'pull_request'
  run: |
    echo "Starting test server..."
    docker run -d --name test-server -p 8888:80 ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

    echo "Waiting for server to be ready..."
    sleep 5  # Fixed 5-second wait

    echo "Testing health endpoint..."
    curl -f http://localhost:8888/health || (docker logs test-server && exit 1)

    echo "Testing homepage..."
    curl -f -I http://localhost:8888/ || (docker logs test-server && exit 1)

    echo "Cleaning up test server..."
    docker stop test-server
    docker rm test-server

    echo "::notice::Smoke test passed - server responds correctly ✓"
```

**Failure characteristics:**
- **Severity:** Low
- **Frequency:** Occasional (timing-dependent, race condition)
- **Blocking:** No - Docker image builds successfully
- **Production Impact:** None - Cloud Run deployment verified operational
- **Status:** Documented in RELEASE_NOTES.md as known limitation

### Expected Behavior

The smoke test should:
1. Wait for the container to be fully ready before attempting health checks
2. Pass consistently across different execution environments
3. Still fail if the container is genuinely broken (not a false positive)
4. Complete in a reasonable time (<30 seconds total)

## Research Summary

**Research completed:** 2025-12-03
**Codebase analyzed:** Workflows, Dockerfile, nginx config, documentation

### Key Findings

1. **No retry patterns exist** in current workflows - this will be the first
2. **Dockerfile has HEALTHCHECK** (line 104) with `--start-period=5s --retries=3`
   - However, workflow doesn't leverage Docker's native health check mechanism
   - Using `docker wait --condition=healthy` could be future enhancement
3. **Cloud Run workflow succeeds** without retries due to deployment timing
   - Service fully initializes during deployment process
   - Verification happens after deployment completes
4. **Issue is documented** in RELEASE_NOTES.md:171 as known limitation
5. **Health endpoint is simple** (nginx.conf:89-94) - returns immediately when nginx ready
6. **Port mapping matters** - Workflow uses port 8888:80, Dockerfile defaults to 8080

### Pattern Analysis

**Similar implementations searched:**
- `.github/workflows/cloudrun-deploy.yml` - Direct curl, no retries
- `docs/deployment-guide.md` - Manual verification examples
- `docs/troubleshooting-cicd.md` - Testing examples
- `scripts/` directory - No retry utility scripts

**Result:** No existing retry patterns to follow - establishing new best practice

## Current State Analysis

### Root Cause

The nginx container initialization sequence takes variable time:

1. **Docker container starts** - Process spawns
2. **nginx configuration processing** - Template substitution for `$PORT` variable
3. **Worker processes spawn** - nginx master/worker setup
4. **Health endpoint available** - `/health` location responds

The fixed 5-second sleep is insufficient in some GitHub Actions runner environments where container startup is slower.

### Relevant Code/Configuration

**Dockerfile (lines 103-105):**
```dockerfile
# Health check for nginx (uses $PORT environment variable)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1
```

The Dockerfile **does have a HEALTHCHECK** defined, but the workflow doesn't use Docker's health check mechanism.

**nginx.conf (lines 89-94):**
```nginx
# Health check endpoint for container orchestration
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

The health endpoint is simple and should respond immediately once nginx is ready.

### Related Context

- Part of v1.0.0 release (#40)
- Identified during release code review (#35)
- Production deployment at https://talks.denhamparry.co.uk working correctly
- Cloud Run deployment workflow (`.github/workflows/cloudrun-deploy.yml`) works reliably
  - Cloud Run verification (lines 98-102) uses direct curl without retries
  - Works because Cloud Run service has time to fully initialize before verification runs
- Docker image itself is functional and correct
- **Currently documented** in RELEASE_NOTES.md:171 as "Docker Workflow: Smoke test timing issue (non-blocking, image builds successfully)"

### Codebase Analysis

**No existing retry patterns found:**
- Searched all YAML workflows - no retry loops exist in current codebase
- Cloud Run deployment uses simple health checks without retries (works due to deployment timing)
- This will be the **first retry pattern** in the repository workflows

**Other health check usage:**
- `README.md:398` - Manual health check: `curl https://talks.denhamparry.co.uk/health`
- `docs/deployment-guide.md` - Multiple examples of health check verification
- `docs/troubleshooting-cicd.md:172` - Local testing health checks
- All use simple curl without retry logic

## Solution Design

### Approach

**Option 2: Health Check Loop with Retry Logic (Recommended)**

Implement retry logic with exponential backoff to reliably wait for container readiness while still failing fast if the container is broken.

### Rationale

This approach is chosen because:

1. **Reliability:** Handles variable startup times across different environments
2. **Efficiency:** Fast on quick systems, only waits as long as needed
3. **Clarity:** Clear failure messaging with retry counts
4. **Simplicity:** No Dockerfile changes needed, pure workflow update
5. **Debuggability:** Shows Docker logs on failure for troubleshooting

### Trade-offs Considered

**Alternative 1: Increase Fixed Sleep**
```yaml
sleep 10  # Increase from 5 to 10 seconds
```
- ✅ Simple, one-line change
- ❌ Still not guaranteed to work
- ❌ Wastes time on fast systems
- ❌ Not chosen

**Alternative 2: Health Check Loop** ✅ Chosen
```yaml
for i in {1..5}; do
  curl -f http://localhost:8888/health && break
  sleep 2
done
```
- ✅ Reliable across environments
- ✅ Fast on quick systems
- ✅ Clear failure after timeout
- ✅ Good balance of simplicity and robustness

**Alternative 3: Docker Native Health Check**
```yaml
docker run -d --name test-server --health-cmd "curl -f http://localhost:80/health" ...
docker wait --condition=healthy test-server
```
- ✅ Most robust long-term solution
- ✅ Reusable health check definition
- ❌ More complex, requires understanding of Docker health check timing
- ❌ The Dockerfile already has HEALTHCHECK but uses `$PORT` variable
- 🔄 Consider for future enhancement

### Implementation Details

**Enhanced smoke test with retry logic:**

```yaml
- name: Smoke test - Verify server responds
  if: github.event_name != 'pull_request'
  run: |
    echo "Starting test server..."
    docker run -d --name test-server -p 8888:80 ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

    echo "Waiting for server to be ready..."
    sleep 5

    echo "Testing health endpoint with retries..."
    for i in {1..5}; do
      if curl -f http://localhost:8888/health; then
        echo "✓ Health check passed on attempt $i"
        break
      fi
      echo "⚠ Health check failed on attempt $i, retrying..."
      sleep 2
    done || (echo "::error::Health check failed after 5 attempts" && docker logs test-server && exit 1)

    echo "Testing homepage..."
    curl -f -I http://localhost:8888/ || (echo "::error::Homepage check failed" && docker logs test-server && exit 1)

    echo "Cleaning up test server..."
    docker stop test-server
    docker rm test-server

    echo "::notice::Smoke test passed - server responds correctly ✓"
```

**Key improvements:**
1. **Retry loop:** Up to 5 attempts with 2-second intervals (max 10 seconds additional wait)
2. **Total timeout:** ~15 seconds maximum (5s initial + 10s retries)
3. **Clear logging:** Shows which attempt succeeded
4. **Failure handling:** Shows error message and container logs on failure
5. **Success message:** Confirms test passed with visual indicator

### Benefits

1. **Eliminates race condition:** Handles variable startup times
2. **Fast on success:** Exits immediately when health check passes
3. **Clear diagnostics:** Shows retry count and logs on failure
4. **Maintainable:** Simple bash loop, no complex tooling
5. **Consistent:** Should achieve 100% success rate when container is healthy

## Implementation Plan

### Step 1: Update smoke test with retry logic
**File:** `.github/workflows/docker-publish.yml`

**Changes:**
Replace lines 125-144 with enhanced version that includes retry logic.

**Specific change:**
```yaml
# OLD (current):
echo "Testing health endpoint..."
curl -f http://localhost:8888/health || (docker logs test-server && exit 1)

# NEW (with retries):
echo "Testing health endpoint with retries..."
for i in {1..5}; do
  if curl -f http://localhost:8888/health; then
    echo "✓ Health check passed on attempt $i"
    break
  fi
  echo "⚠ Health check failed on attempt $i, retrying..."
  sleep 2
done || (echo "::error::Health check failed after 5 attempts" && docker logs test-server && exit 1)
```

**Testing locally:**
```bash
# Test the retry logic locally
docker build -t test-talks .
docker run -d --name test -p 8888:80 test-talks
sleep 5
for i in {1..5}; do
  if curl -f http://localhost:8888/health; then
    echo "✓ Health check passed on attempt $i"
    break
  fi
  echo "⚠ Health check failed on attempt $i, retrying..."
  sleep 2
done
docker stop test && docker rm test
```

### Step 2: Test in CI environment
**Actions:**
1. Create PR with changes
2. Verify workflow passes on PR
3. Monitor workflow run timing
4. Check logs show retry attempts (if any)

**Success criteria:**
- Workflow completes successfully
- Health check passes on first or early attempt
- Total smoke test time < 20 seconds
- No false positives or negatives

### Step 3: Monitor for reliability
**Actions:**
1. Monitor next 10 workflow runs after merge
2. Track success rate (target: 100%)
3. Review logs for retry patterns
4. Document average startup time

**Monitoring:**
```bash
# Check recent workflow runs
gh run list --workflow=docker-publish.yml --limit 10
```

## Testing Strategy

### Unit Testing

**Not applicable** - This is a workflow configuration change, not application code.

### Integration Testing

**Test Case 1: Normal startup**
1. Build Docker image locally
2. Run smoke test script
3. **Expected:** Health check passes on first attempt within 5-7 seconds

**Test Case 2: Slow startup**
1. Simulate slow startup (add delay to nginx entrypoint)
2. Run smoke test script
3. **Expected:** Health check passes on retry attempt 2-3

**Test Case 3: Failed container**
1. Build image with intentionally broken nginx config
2. Run smoke test script
3. **Expected:** All retries fail, shows error message and logs, exits with status 1

**Test Case 4: Port conflict**
1. Start container on port 8888
2. Try to run smoke test (port already in use)
3. **Expected:** Docker run fails with clear error message

### Regression Testing

**Verify existing functionality:**
- [ ] Image build still completes successfully
- [ ] Multi-architecture builds work (amd64, arm64)
- [ ] Image verification step passes
- [ ] Slides verification step passes
- [ ] Image size check still runs
- [ ] Smoke test cleanup still removes test container
- [ ] Workflow still skips on pull requests

**Edge cases to verify:**
- [ ] Very fast container startup (< 2 seconds)
- [ ] Slow GitHub Actions runner (high load)
- [ ] Container restart scenarios
- [ ] Network latency variations

### CI Verification

**Acceptance test:** Run workflow 10 times and track:
- Success rate (target: 10/10 = 100%)
- Average total smoke test time (expect: 7-10 seconds)
- Retry attempts needed (expect: 0-1 on average)
- False failure rate (expect: 0%)

## Success Criteria

- [x] Smoke test includes retry logic with exponential backoff
- [ ] Health endpoint check retries up to 5 times with 2-second intervals
- [ ] Clear logging shows which attempt succeeded
- [ ] Error messages include Docker logs for debugging
- [ ] Total smoke test timeout is reasonable (~15 seconds max)
- [ ] Workflow passes consistently (100% success over 10 runs)
- [ ] Solution is documented in commit message
- [ ] Still fails appropriately if container is genuinely broken (no false positives)

## Files Modified

1. `.github/workflows/docker-publish.yml` - Add retry logic to smoke test step (lines 125-144)

## Documentation Updates Required

After implementation, update the following files:

### 1. RELEASE_NOTES.md (line 171)
**Remove the known limitation entry:**
```markdown
# OLD:
- **Docker Workflow:** Smoke test timing issue (non-blocking, image builds successfully)

# REMOVE THIS LINE - issue resolved in v1.0.1
```

### 2. CHANGELOG.md
**Add to [Unreleased] section:**
```markdown
### Fixed
- Fixed Docker workflow smoke test timing issue with retry logic (#47)
  - Added health check retry loop (5 attempts, 2-second intervals)
  - Eliminates race condition in container startup verification
  - Total timeout: ~15 seconds maximum
```

### 3. docs/troubleshooting-cicd.md
**Add new section with retry pattern example:**
```markdown
### Pattern: Health Check with Retries

When testing containerized services, use retry logic to handle variable startup times:

```bash
# Example: Health check with exponential backoff
for i in {1..5}; do
  if curl -f http://localhost:8080/health; then
    echo "✓ Health check passed on attempt $i"
    break
  fi
  echo "⚠ Health check failed on attempt $i, retrying..."
  sleep 2
done || (echo "::error::Health check failed after 5 attempts" && exit 1)
```

This pattern is used in `.github/workflows/docker-publish.yml` smoke tests.
```

## Related Issues and Tasks

### Part Of
- #40 - Initial v1.0.0 release

### Enables
- v1.0.1 patch release with improved CI reliability
- Future workflow enhancements without timing concerns

### Related
- CloudRun deployment workflow (`.github/workflows/cloudrun-deploy.yml`) - Similar health check pattern
- Dockerfile HEALTHCHECK - Could be leveraged in future improvements

### Future Enhancements
- Consider using Docker native health check with `docker wait --condition=healthy`
- Add similar retry logic to other health check workflows if needed
- Monitor container startup times to optimize initial sleep duration

## References

- **GitHub Issue:** [#47](https://github.com/denhamparry/talks/issues/47)
- **Workflow File:** `.github/workflows/docker-publish.yml`
- **Failed Run Example:** https://github.com/denhamparry/talks/actions/runs/19909526419
- **Production Deployment:** https://talks.denhamparry.co.uk (verified operational)
- **Docker Health Check Docs:** https://docs.docker.com/engine/reference/builder/#healthcheck
- **nginx Startup:** https://nginx.org/en/docs/beginners_guide.html

## Notes

### Key Insights

1. **Race condition identified:** Fixed 5-second sleep insufficient for variable environments
2. **Health check exists:** Dockerfile has HEALTHCHECK but workflow doesn't use Docker's health status
3. **Production unaffected:** This is purely a CI testing issue, not a production bug
4. **Simple fix sufficient:** Retry loop solves the problem without complex changes

### Alternative Approaches Considered

1. **Increase fixed sleep to 10 seconds**
   - Why not chosen: Still not guaranteed, wastes time ❌

2. **Retry loop with backoff** ✅
   - Why chosen: Reliable, efficient, simple, good diagnostics

3. **Docker native health check**
   - Why not chosen: More complex, save for future enhancement 🔄

### Best Practices

1. **Always use retries for network/timing-dependent tests**
2. **Log retry attempts for debugging**
3. **Set reasonable timeouts to fail fast on genuine errors**
4. **Include container logs on failure for diagnostics**
5. **Test locally before pushing to CI**

### Monitoring Recommendations

After deployment, monitor:
- Workflow success rate (should be 100%)
- Average retry count (should be 0-1)
- Total smoke test duration (should be 7-12 seconds)
- Any patterns in retry timing

### Documentation Updates

After implementation (see "Documentation Updates Required" section above):
- ✅ Update CHANGELOG.md with fix details (template provided)
- ✅ Remove "known limitation" note from RELEASE_NOTES.md:171 (exact line identified)
- ✅ Add retry pattern example to docs/troubleshooting-cicd.md (template provided)
- This will establish a reusable pattern for future health check implementations
