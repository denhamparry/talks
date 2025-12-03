# Security Policy

## Supported Versions

This repository contains presentation slides and related tooling. Security updates are provided for the following:

| Component | Version | Supported |
| --------- | ------- | --------- |
| MARP CLI | Latest | ✅ |
| Node.js | >= 20.0.0 | ✅ |
| Docker Images | latest, sha tags | ✅ |
| GitHub Actions Workflows | Current | ✅ |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this repository, please report it responsibly.

### Reporting Process

**For security vulnerabilities, please use GitHub's private vulnerability reporting:**

1. Go to the [Security tab](https://github.com/denhamparry/talks/security) of this repository
2. Click "Report a vulnerability"
3. Provide a detailed description of the vulnerability

**Alternatively, you can email security reports to:**

📧 **<lewis@denhamparry.co.uk>**

### What to Include

Please include the following information in your report:

- **Description** - Clear description of the vulnerability
- **Impact** - Potential impact and severity assessment
- **Reproduction Steps** - Step-by-step instructions to reproduce
- **Proof of Concept** - Code or screenshots demonstrating the issue
- **Suggested Fix** - (Optional) Proposed remediation approach
- **Affected Versions** - Which versions/components are affected

### Response Timeline

We are committed to responding to security reports promptly:

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Varies based on severity (see below)

### Severity Guidelines

**Critical (Fix within 24-48 hours):**

- Remote code execution
- Authentication bypass
- Exposed credentials or secrets
- Data breach or leak

**High (Fix within 1 week):**

- Privilege escalation
- Cross-site scripting (XSS)
- SQL injection
- Significant data exposure

**Medium (Fix within 2 weeks):**

- CSRF vulnerabilities
- Information disclosure
- Denial of service (DoS)

**Low (Fix when possible):**

- Security misconfigurations
- Best practice violations
- Minor information leaks

## Security Measures

This repository implements multiple layers of security:

### Automated Scanning

- ✅ **Gitleaks** - Pre-commit secret detection
- ✅ **GitHub Secret Scanning** - Push protection enabled
- ✅ **Dependabot** - Automated dependency updates
- ✅ **Private Key Detection** - Pre-commit hook

### Authentication & Authorization

- ✅ **OIDC Workload Identity** - GCP authentication (no service account keys)
- ✅ **GitHub Secrets** - All credentials stored securely
- ✅ **Minimal Permissions** - Principle of least privilege for workflows
- ✅ **Auto-generated Tokens** - `GITHUB_TOKEN` per workflow run

### Infrastructure Security

- ✅ **Multi-stage Docker Builds** - Minimal production images
- ✅ **Pinned Base Images** - SHA256 digests for reproducibility
- ✅ **Security Headers** - nginx configured with best practices
- ✅ **Non-root Containers** - nginx runs as unprivileged user

### Development Workflow

- ✅ **Pre-commit Hooks** - Mandatory secret scanning
- ✅ **Protected Branches** - Main branch requires PR review
- ✅ **Signed Commits** - SSH signing with 1Password agent
- ✅ **Audit Trail** - Git history tracked and reviewed

## Security Best Practices

### For Contributors

When contributing to this repository:

1. **Never commit secrets** - Use `.env` files (gitignored) for local development
2. **Install pre-commit hooks** - Run `pre-commit install` before committing
3. **Review before pushing** - Check diffs for sensitive information
4. **Use GitHub Secrets** - Store credentials in repository/organization secrets
5. **Keep dependencies updated** - Merge Dependabot PRs promptly
6. **Sign your commits** - Configure GPG or SSH signing

### For Deployment

When deploying presentations:

1. **Use OIDC authentication** - Avoid long-lived service account keys
2. **Rotate secrets regularly** - Update GitHub Secrets periodically
3. **Monitor access logs** - Review Cloud Run and GHCR access patterns
4. **Enable budget alerts** - Set GCP billing alerts to prevent surprise costs
5. **Verify image signatures** - Use SHA256 tags for production deployments

## Known Security Considerations

### Public Presentation Content

This repository contains **public presentation slides** intended for conference talks and meetups. All content is designed to be shared publicly and should not contain:

- ❌ Confidential business information
- ❌ Internal infrastructure details
- ❌ Private customer data
- ❌ Unreleased product information

### Container Images

Container images are published to **public registries**:

- `ghcr.io/denhamparry/talks` - GitHub Container Registry (public)
- `europe-west1-docker.pkg.dev/denhamparry-talks/talks/talks` - GCP Artifact Registry (access controlled)

**Note:** Anyone can pull images from GHCR. Ensure no sensitive data is included in images.

### Cloud Run Service

The Cloud Run service is **publicly accessible** at:

- `https://talks.denhamparry.co.uk` (custom domain)
- Auto-generated Cloud Run URL (publicly routable)

This is intentional - presentations are meant to be viewed by anyone.

## Security Audit History

### 2025-12-03 - Pre-Release Security Audit

**Conducted by:** Lewis Denham-Parry (with Claude Code assistance)
**Scope:** Comprehensive audit before public repository release

**Findings:**

- ✅ No secrets detected (gitleaks scan - 105 commits)
- ✅ GitHub Secrets properly configured
- ✅ OIDC authentication implemented (no service account keys)
- ✅ Git history clean (no sensitive commits)
- ✅ Pre-commit hooks operational
- ✅ Documentation appropriate for public release

**Risk Level:** LOW - Approved for public release

**Report:** See `docs/plan/issues/37_security_audit_check_for_sensitive_data_and_credentials.md`

## Disclosure Policy

### Responsible Disclosure

We follow a **coordinated disclosure** approach:

1. **Private Reporting** - Security issues reported privately first
2. **Fix Development** - Patches developed and tested
3. **Coordinated Release** - Fix released with advisory (if applicable)
4. **Public Disclosure** - Issue details published after fix is available
5. **Credit** - Reporter credited (unless they prefer anonymity)

### Public Disclosure Timeline

- **Critical:** Fix first, disclose after deployment (0-48 hours)
- **High:** Fix within 1 week, disclose after fix available
- **Medium/Low:** Fix within 2-4 weeks, batch disclosure

## Security Contacts

- **Primary Contact:** <lewis@denhamparry.co.uk>
- **GitHub Security:** Use [private vulnerability reporting](https://github.com/denhamparry/talks/security)
- **General Issues:** Public issues (non-security) via [GitHub Issues](https://github.com/denhamparry/talks/issues)

## Acknowledgments

We appreciate the security community's efforts to improve the security of our projects. Contributors who report valid security vulnerabilities will be:

- Credited in release notes (unless anonymity requested)
- Listed in this SECURITY.md (with permission)
- Acknowledged in the vulnerability advisory

Thank you for helping keep this project secure! 🔒

---

**Last Updated:** 2025-12-03
**Next Review:** 2026-03-03 (quarterly)
