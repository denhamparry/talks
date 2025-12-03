# CI/CD Test Plan

Test plan for verifying GitHub Actions workflows and deployment configuration.

## Local Build Tests

- [x] make install - Dependencies installed successfully
- [x] make build - HTML slides generated correctly
- [x] make ci - Full CI workflow completed
- [ ] make docker-build - Docker image builds successfully
- [ ] scripts/check-links.sh - Documentation links verified

## Workflow Tests

- [ ] build-slides.yml (manual dispatch) - Artifacts uploaded
- [ ] docker-publish.yml (test on PR) - Image published to GHCR
- [ ] cloudrun-deploy.yml (verify main push) - Deployment successful
- [ ] claude.yml (comment on issue) - @claude responds

## Verification Checks

- [ ] Artifacts uploaded correctly (HTML and PDF)
- [ ] Docker images published to GHCR
- [ ] Cloud Run deployment successful
- [ ] Health checks passing (<https://talks.denhamparry.co.uk/health>)
- [ ] Custom domain accessible (<https://talks.denhamparry.co.uk>)

## Test Commands

```bash
# Local build test
make clean
make ci

# Docker build test
make docker-build

# Verify all make targets
make help

# Link verification
bash scripts/check-links.sh

# Verify secrets (maintainer only)
gh secret list

# Test workflows
gh workflow run build-slides.yml
gh workflow view cloudrun-deploy.yml
```

## Test Results

### Build Process

**Date:** 2025-12-03

**Results:**

- ✅ Dependencies install successfully (168 packages)
- ✅ HTML slides generated (3 files: 185k, 126k, 143k)
- ✅ index.html generated (4.7k)
- ✅ No build errors
- ⚠️ Pre-commit hook installation skipped (core.hooksPath set globally)

**Issue Fixed:**

- 🐛 MARP config had `pdf: true` causing HTML build to generate PDFs
- ✅ Changed to `pdf: false` in marp.config.js
- ✅ HTML files now generated correctly

### Docker Build

**Status:** Pending

### Workflow Execution Tests

**Status:** Pending - To be tested after workflow updates

## Notes

- Pre-commit hooks managed globally via ~/.git-hooks/
- Local build verification passed
- Ready to test workflows after configuration updates
