# CI/CD Troubleshooting Guide

Common issues and solutions for GitHub Actions workflows and deployment.

## Build Failures

### Issue: "dist directory not created"

**Symptoms:**

```text
Error: dist directory not created
```

**Cause:** MARP build failed before creating output directory

**Solution:**

```bash
# Check for syntax errors in slides
npx markdownlint slides/

# Try building locally
npm run build

# Check logs for specific error
```

### Issue: "No slides built" or "Found 0 HTML files"

**Symptoms:**

```text
Error: No slides built
Found 0 HTML files
```

**Cause:** MARP config has `pdf: true` which generates PDFs instead of HTML

**Solution:**

Check `marp.config.js`:

```javascript
module.exports = {
  inputDir: './slides',
  output: './dist',
  pdf: false,  // Should be false for HTML build
  // ...
};
```

**Fixed:** This was corrected in marp.config.js (changed from `pdf: true` to `pdf: false`)

### Issue: "npm ci" fails with dependency errors

**Symptoms:**

```text
npm ERR! code ENOTFOUND
npm ERR! network request failed
```

**Cause:** Network issues or corrupted package-lock.json

**Solution:**

```bash
# Clean npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
npm ci
```

## Docker Build Failures

### Issue: "COPY failed: stat ... no such file or directory"

**Symptoms:**

```text
ERROR [builder 6/6] COPY slides/ ./slides/
failed to solve: failed to compute cache key
```

**Cause:** Referenced file doesn't exist in build context

**Solution:**

```bash
# Check .dockerignore isn't excluding required files
cat .dockerignore

# Verify files exist
ls -la slides/
ls -la themes/
ls -la templates/
```

### Issue: "Image size exceeds 100MB"

**Symptoms:**

```text
Warning: Image size 120MB exceeds 100MB target
```

**Cause:** Large images or unnecessary files in slides

**Solution:**

```bash
# Check for large files
find slides/ -type f -size +1M

# Optimize images
# - Use compressed formats (WebP, optimized PNG)
# - Remove unused assets
# - Compress existing images
```

## Deployment Failures

### Issue: "Unable to acquire impersonated credentials"

**Symptoms:**

```text
Error: Unable to acquire impersonated credentials for service account
```

**Cause:** IAM Service Account Credentials API not enabled

**Solution:**

```bash
gcloud services enable iamcredentials.googleapis.com \
  --project=denhamparry-talks
```

See: `docs/deployment-guide.md` Step 4

### Issue: "Health check failed"

**Symptoms:**

```text
Error: Health check failed
curl: (22) The requested URL returned error: 503
```

**Cause:** Service not responding on expected port

**Solution:**

```bash
# Check Cloud Run logs
gcloud run services logs read talks \
  --region=europe-west1 \
  --project=denhamparry-talks

# Verify container starts locally
docker run -p 8080:8080 -e PORT=8080 \
  ghcr.io/denhamparry/talks:latest

# Test health endpoint
curl http://localhost:8080/health
```

### Issue: "Domain mapping not supported in region"

**Symptoms:**

```text
Error: Domain mapping is not supported in region europe-west2
```

**Cause:** Wrong region selected (london doesn't support domain mappings)

**Solution:**

Change region to europe-west1 (Belgium) in `.github/workflows/cloudrun-deploy.yml`:

```yaml
env:
  REGION: 'europe-west1'  # Not europe-west2
```

## Secrets Issues

### Issue: "secret not found: GCP_WORKLOAD_IDENTITY_PROVIDER"

**Symptoms:**

```text
Error: Required secret GCP_WORKLOAD_IDENTITY_PROVIDER not found
```

**Cause:** Secret not configured in repository

**Solution:**

```bash
# Verify secrets exist (maintainer only)
gh secret list

# Add secret if missing
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER < value.txt

# Or interactively
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER
```

See README.md "GitHub Secrets Configuration" for complete setup instructions.

## Workflow Not Triggering

### Issue: Workflow doesn't run on push

**Symptoms:**

- Changes pushed to main
- No workflow run appears in Actions tab

**Cause:** Changed files not in workflow `paths` filter

**Solution:**

Check workflow file:

```yaml
on:
  push:
    paths:
      - 'slides/**'        # Only triggers if these paths change
      - 'themes/**'
      # ...
```

If you changed a different file, workflow won't trigger (by design).

To trigger manually, workflows include:

```yaml
on:
  workflow_dispatch:  # Allows manual trigger
  push:
    paths: ...
```

Use "Run workflow" button in Actions tab to manually trigger.

### Issue: Workflow pending but not starting

**Symptoms:**

- Workflow shows as "Queued" for long time
- No runner picked up the job

**Cause:** GitHub Actions queue delay or runner availability

**Solution:**

- Wait a few minutes (GitHub Actions can have delays)
- Check GitHub Status page: <https://www.githubstatus.com/>
- Verify Actions are enabled in repository settings

## Badge Not Displaying

### Issue: Status badge shows "unknown" or broken image

**Symptoms:**

Badge displays as "unknown" or shows broken image icon

**Cause:** Workflow name doesn't match badge URL

**Solution:**

Badge URL must match workflow `name`:

```yaml
name: CI  # Must match badge URL exactly
```

Badge markdown:

```markdown
[![CI](https://github.com/USER/REPO/workflows/CI/badge.svg)](...)
```

**Note:** Spaces in workflow names are encoded as `%20` in URL:

- Workflow name: `Build MARP Slides`
- Badge URL: `workflows/Build%20MARP%20Slides/badge.svg`

## Pre-commit Hook Issues

### Issue: "pre-commit not available"

**Symptoms:**

```text
[ERROR] Cowardly refusing to install hooks with `core.hooksPath` set.
pre-commit not available (optional)
```

**Cause:** Global git hooks configured via `core.hooksPath`

**Solution:**

This is expected if you have global git hooks configured (like 1Password validation). Pre-commit is optional and doesn't block builds.

To install anyway:

```bash
# Temporarily unset global hooks path
git config --unset-all core.hooksPath

# Install pre-commit
pre-commit install

# Restore global hooks path
git config --global core.hooksPath ~/.git-hooks
```

### Issue: Markdownlint failures

**Symptoms:**

```text
slides/example.md:45 MD013/line-length Line length [Expected: 80, Actual: 120]
```

**Cause:** Line exceeds maximum length

**Solution:**

Break long lines or add markdownlint ignore comment:

```markdown
<!-- markdownlint-disable MD013 -->
This is a very long line that exceeds 80 characters...
<!-- markdownlint-enable MD013 -->
```

## Link Verification Issues

### Issue: "Internal broken links"

**Symptoms:**

```text
❌ docs/setup.md -> ../nonexistent.md
```

**Cause:** Markdown file links to non-existent file

**Solution:**

```bash
# Run link checker locally
bash scripts/check-links.sh

# Fix broken links in markdown files
```

### Issue: "External broken links"

**Symptoms:**

```text
❌ https://example.com/page
```

**Cause:** External URL returns error (404, timeout, etc.)

**Solution:**

- Verify URL is correct
- Check if site is temporarily down
- Update URL if page moved
- Consider if link is optional (external links may fail temporarily)

## Getting Help

If you encounter an issue not listed here:

1. **Check workflow logs** - Actions tab → Select workflow → View logs
2. **Search existing issues** - Check if someone else encountered this
3. **Review documentation**:
   - `docs/deployment-guide.md` - Cloud Run deployment
   - `docs/repository-settings.md` - Repository configuration
   - `docs/marp-usage.md` - MARP presentation guide
4. **Create new issue** with:
   - Workflow name
   - Complete error message
   - Steps to reproduce
   - Environment details (if relevant)

## Useful Commands

```bash
# View workflow runs
gh run list --limit 10

# Watch specific workflow run
gh run watch <run-id>

# View workflow logs
gh run view <run-id> --log

# List repository secrets
gh secret list

# Trigger workflow manually
gh workflow run build-slides.yml

# Check git status
git status

# View recent commits
git log --oneline -10

# Test build locally
make clean && make ci
```

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [MARP CLI Documentation](https://github.com/marp-team/marp-cli)
- [Deployment Guide](deployment-guide.md)
- [Repository Settings](repository-settings.md)
