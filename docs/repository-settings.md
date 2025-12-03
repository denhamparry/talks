# Repository Settings for CI/CD

Complete guide for configuring GitHub repository settings for CI/CD workflows.

## Required GitHub Repository Settings

### Actions Permissions

**Settings → Actions → General:**

- [x] Allow all actions and reusable workflows
- [x] Read and write permissions for GITHUB_TOKEN
- [x] Allow GitHub Actions to create and approve pull requests

### Branch Protection (Recommended)

**Settings → Branches → Add rule for `main`:**

- [x] Require pull request reviews before merging
- [x] Require status checks to pass before merging
  - CI (build verification)
  - Build MARP Slides
  - Build and Publish Docker Image
- [x] Require branches to be up to date before merging
- [ ] Require conversation resolution before merging (optional)
- [x] Include administrators (recommended)

### Secrets Configuration

**Settings → Secrets and variables → Actions:**

Required secrets documented in README.md:

- `GCP_WORKLOAD_IDENTITY_PROVIDER` - Google Cloud Workload Identity Provider
- `GCP_SERVICE_ACCOUNT` - Google Cloud Service Account for deployment
- `CLAUDE_CODE_OAUTH_TOKEN` - Claude Code OAuth token for automation

See README.md "GitHub Secrets Configuration" section for detailed setup instructions.

### Package Settings (GHCR)

**Settings → Packages:**

The repository publishes Docker images to GitHub Container Registry:

- Package: `ghcr.io/denhamparry/talks`
- Visibility: Public (for public repository)
- Permissions: Inherited from repository

### Pages (Not Used)

GitHub Pages is not used. Deployment is to Cloud Run at talks.denhamparry.co.uk.

## Workflow Permissions

Each workflow has specific permissions defined:

### build-slides.yml

```yaml
permissions:
  contents: read
  actions: read
```

**Purpose:** Build MARP presentations and upload artifacts

### ci.yml

```yaml
# Inherits default permissions (contents: read)
```

**Purpose:** Build verification, lint checks, link validation

### docker-publish.yml

```yaml
permissions:
  contents: read
  packages: write
  attestations: write
  id-token: write
```

**Purpose:** Build and publish Docker images to GHCR with SBOM and provenance

### cloudrun-deploy.yml

```yaml
permissions:
  contents: read
  id-token: write
  packages: read
```

**Purpose:** Deploy to Google Cloud Run using Workload Identity Federation

### claude.yml

```yaml
permissions:
  contents: read
  pull-requests: read
  issues: read
  id-token: write
  actions: read
```

**Purpose:** Claude Code automation for issue and PR comments

## Verification Checklist

- [ ] Actions enabled for repository
- [ ] Secrets configured (verify with `gh secret list`)
- [ ] Branch protection enabled (optional but recommended)
- [ ] GHCR package published successfully
- [ ] Cloud Run deployment working
- [ ] Status badges displaying in README

## Verifying Settings

### Check Actions Permissions

```bash
# View workflow runs
gh run list --limit 10

# View specific workflow
gh workflow view ci.yml
```

### Check Secrets

```bash
# List configured secrets (names only, values hidden)
gh secret list

# Expected output:
# CLAUDE_CODE_OAUTH_TOKEN            Updated YYYY-MM-DD
# GCP_SERVICE_ACCOUNT                Updated YYYY-MM-DD
# GCP_WORKLOAD_IDENTITY_PROVIDER     Updated YYYY-MM-DD
```

### Check Branch Protection

```bash
# View branch protection rules
gh api repos/denhamparry/talks/branches/main/protection | jq '.required_status_checks'
```

### Check Package Visibility

```bash
# Check if package is public
gh api users/denhamparry/packages/container/talks | jq '.visibility'
```

## Common Issues

### Workflow Not Running

**Problem:** Workflow doesn't trigger on push/PR

**Solution:** Check Actions permissions are enabled in repository settings

### Secret Not Found

**Problem:** Workflow fails with "secret not found" error

**Solution:** Verify secret is configured with `gh secret list`

### Permission Denied

**Problem:** Workflow fails with "permission denied" error

**Solution:** Check workflow permissions block matches required permissions

### GHCR Push Failed

**Problem:** Docker push to GHCR fails with authentication error

**Solution:** Verify `packages: write` permission is granted to workflow

## Security Best Practices

1. **Minimal Permissions** - Each workflow uses only the permissions it needs
2. **No Long-Lived Tokens** - Use Workload Identity Federation for GCP access
3. **Secrets Management** - No secrets in code, only in GitHub Secrets
4. **Branch Protection** - Require status checks before merging to main
5. **Review PRs** - Require pull request reviews before merging

## References

- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GHCR Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
