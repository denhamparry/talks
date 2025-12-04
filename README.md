# Talks

[![CI](https://github.com/denhamparry/talks/workflows/CI/badge.svg)](https://github.com/denhamparry/talks/actions/workflows/ci.yml)
[![Build Slides](https://github.com/denhamparry/talks/workflows/Build%20MARP%20Slides/badge.svg)](https://github.com/denhamparry/talks/actions/workflows/build-slides.yml)
[![Docker Build](https://github.com/denhamparry/talks/workflows/Build%20and%20Publish%20Docker%20Image/badge.svg)](https://github.com/denhamparry/talks/actions/workflows/docker-publish.yml)
[![Deploy to Cloud Run](https://github.com/denhamparry/talks/workflows/Deploy%20to%20Cloud%20Run/badge.svg)](https://github.com/denhamparry/talks/actions/workflows/cloudrun-deploy.yml)
[![Pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Professional presentations built with MARP and the Edera V2 theme

A modern presentation system for creating beautiful slide decks using Markdown. Built with MARP and featuring the professional Edera V2 theme, this project makes it easy to create, version control, and deploy presentations.

**Live Presentations:** [talks.denhamparry.co.uk](https://talks.denhamparry.co.uk)

## ✨ Features

- **Markdown-based** - Write slides in simple, version-controllable Markdown
- **Professional Theme** - Edera V2 theme with 6 pre-built layouts (title, content, dark, two-column, image, image-overlay)
- **Multiple Formats** - Export to HTML and PDF automatically
- **Live Development** - Hot reload server for rapid iteration
- **Docker Ready** - Containerized development and production deployment
- **CI/CD Pipeline** - Automated builds and deployment to Google Cloud Run
- **Accessible** - WCAG AA compliant color contrasts
- **Open Source** - MIT licensed, free to use and customize

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (or use Docker - see below)
- npm or yarn
- Git

### Create Your First Presentation

1. **Clone the repository**

   ```bash
   git clone https://github.com/denhamparry/talks.git
   cd talks
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy a template**

   ```bash
   cp templates/basic-presentation.md slides/my-first-talk.md
   ```

4. **Edit your slides**

   Open `slides/my-first-talk.md` in your editor and customize the content

5. **Build and preview**

   ```bash
   # Option 1: Quick preview (MARP file browser)
   npm run serve
   # Visit http://localhost:8080

   # Option 2: Full site preview with themed index (like production)
   npm run serve:dist
   # Visit http://localhost:8080

   # Or build HTML/PDF
   npm run build
   npm run build:pdf
   ```

That's it! Your presentation is ready at `dist/my-first-talk.html` and `dist/my-first-talk.pdf`.

**Note:** `npm run serve` shows MARP's file browser, while `npm run serve:dist` shows the complete site with the Edera V2 themed landing page (same as production).

### Using Docker (No Node.js Required)

Prefer containers? Use Docker instead:

```bash
# Development server (MARP file browser)
make docker-dev
# Visit http://localhost:8080

# Production server (themed index page)
make docker-prod
# Visit http://localhost:8081

# Or build production image only
make docker-build
```

**Note:** The dev service shows MARP's file browser. To see the Edera V2 themed landing page (like production), use `make docker-prod`.

## 📺 Example Presentations

### Upcoming Talks

#### IvySketch: Design Patterns & AI Workflow

**Cloud-Native Manchester** | December 4th, 2025

Building GenAI applications with Kubernetes and AI-assisted development workflows.

- **Topic:** IvySketch - AI-powered Axolotl character designer
- **Focus:** Architecture, Kubernetes deployment, development workflow
- **Slides:** [HTML](https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html) | [PDF](https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.pdf)
- **Source:** [slides/2025-12-04-cloud-native-manchester.md](slides/2025-12-04-cloud-native-manchester.md)

### Example Slides

- **[Basic Presentation](templates/basic-presentation.md)** - Simple starter template
- **[Contributor Template](templates/contributor-template.md)** - Simplified template for external contributors
- **[Example Contribution](slides/example-contribution.md)** - Complete example presentation

### Layout Examples

See `templates/layouts/` for examples of all 6 available slide layouts:

- Title slides (dark backgrounds)
- Content slides (default)
- Dark emphasis slides
- Two-column layouts
- Image slides
- Image overlay slides

## 🛠️ Quick Commands

This repository includes a Makefile for convenient command-line operations.

### View All Commands

```bash
make help
```

### Common Operations

```bash
# Install dependencies
make install

# Build presentations (HTML + PDF)
make build

# Build HTML only
make build-html

# Build PDF only
make build-pdf

# Development mode with auto-rebuild
make watch

# Serve with MARP dev server (file browser)
make serve

# Serve complete site with themed index (production-like)
make serve-dist

# Run pre-commit hooks
make precommit

# Clean build artifacts
make clean
```

### Quality Checks

```bash
# Run linting
make lint

# Format files
make format

# Run all pre-commit hooks
make precommit

# Run smoke tests to verify build output
make test-smoke
```

### CI Workflow

```bash
# Run complete CI workflow (install + build)
make ci
```

**Alternative:** You can still use npm scripts directly:

```bash
npm run build        # Build HTML
npm run build:pdf    # Build PDF
npm run watch        # Watch mode
npm run serve        # MARP dev server (file browser)
npm run serve:dist   # Build and serve complete site with themed index
npm run test:smoke   # Run smoke tests to verify build output
```

## 🐳 Running with Docker

This repository includes full Docker support for containerized development and deployment.

### Docker Quick Start

There are two Docker services available:

**Development Service (MARP File Browser)**

```bash
make docker-dev
# or
docker-compose up dev
# Visit http://localhost:8080
```

- Shows MARP's default file browser interface
- Live reload for rapid slide editing
- **Does NOT show the themed index page**

**Production Service (Themed Index Page)**

```bash
make docker-prod
# or
docker-compose --profile production up prod
# Visit http://localhost:8081  (note: different port!)
```

- Shows the complete site with Edera V2 themed landing page
- Same as production deployment (talks.denhamparry.co.uk)
- **Use this to preview the final site**

### Using docker-compose Directly

```bash
# Development mode (file browser, port 8080)
docker-compose up dev

# Production mode (themed index, port 8081)
docker-compose --profile production up prod
```

**Important:** The production service requires the `--profile production` flag and runs on port **8081**.

### Building Images

```bash
# Build production image
make docker-build

# Or using docker directly
docker build --target production -t talks:latest .
```

### Docker Features

- **Multi-stage builds** - Optimized for size (production <60MB)
- **Live reload** - Development server with volume mounts
- **Production-ready** - nginx with gzip compression and security headers
- **Multi-architecture** - Supports amd64 and arm64 (Apple Silicon, AWS Graviton)
- **Cloud deployment** - Ready for Cloud Run, Fly.io, or any container platform

### Cloud Deployment

Presentations are automatically deployed to **Google Cloud Run** when changes are pushed to the main branch.

- **Production URL:** [talks.denhamparry.co.uk](https://talks.denhamparry.co.uk)
- **Region:** europe-west1 (Belgium)
- **Platform:** Google Cloud Run (serverless)
- **Cost:** $0/month (within free tier)

**How it works:**

1. Push slides to `main` branch
2. GitHub Actions builds Docker image → `ghcr.io/denhamparry/talks:latest`
3. GitHub Actions deploys to Cloud Run → `talks.denhamparry.co.uk`
4. Available globally within 2-3 minutes

**Manual deployment:**

```bash
# Deploy latest image to Cloud Run
gcloud run deploy talks \
  --image=ghcr.io/denhamparry/talks:latest \
  --region=europe-west1 \
  --project=denhamparry-talks
```

See [Deployment Guide](docs/deployment-guide.md) for complete setup instructions, including:

- Google Cloud project setup and Workload Identity Federation
- Custom domain configuration (Cloudflare DNS)
- Billing alerts and cost management
- Troubleshooting and monitoring

### GitHub Container Registry

Container images are automatically published to GHCR on every main branch push:

```bash
# Pull latest image
docker pull ghcr.io/denhamparry/talks:latest

# Run locally
docker run -p 8080:8080 -e PORT=8080 ghcr.io/denhamparry/talks:latest
```

## 📚 Documentation

### Getting Started

- **[Quick Start](#-quick-start)** - Get your first presentation running
- **[MARP Usage Guide](docs/marp-usage.md)** - Complete MARP syntax and features
- **[Examples](templates/)** - Ready-to-use templates and layouts

### Customization

- **[Theme Guide](docs/theme-guide.md)** - Customize the Edera V2 theme
- **[Theme Analysis](docs/theme-analysis.md)** - Design specifications and colors
- **[Slide Layouts](templates/layouts/)** - All available layout examples

### Deployment

- **[Docker Deployment](docs/docker-deployment.md)** - Containerized deployment guide
- **[Cloud Run Guide](docs/deployment-guide.md)** - Google Cloud Run deployment
- **[CI/CD Setup](docs/troubleshooting-cicd.md)** - GitHub Actions troubleshooting

### Contributing

- **[Slide Contribution Guide](docs/CONTRIBUTING_SLIDES.md)** - Submit your own presentations
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribute to the project

## 🤝 Contributing

### Submit Your Presentations

**Want to share your talks?** We welcome slide contributions!

No MARP knowledge required - use our simple template:

```bash
# Get the contributor template
cp templates/contributor-template.md slides/your-talk-name.md

# Fill in your content (the template has inline instructions)

# Submit a pull request
```

**Features:**

- ✅ Simple Markdown template with inline instructions
- ✅ No need to understand MARP or presentation tools
- ✅ Automatic professional formatting with Edera V2 theme
- ✅ CI/CD builds HTML and PDF automatically
- ✅ Great for sharing conference talks and meetup presentations

**See:** [Slide Contribution Guide](docs/CONTRIBUTING_SLIDES.md) for complete instructions.

**Example:** Check out `slides/example-contribution.md` for a complete working example!

### Improve the Project

Want to improve the presentation system itself?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally (`make ci`)
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🔐 GitHub Secrets Configuration

### Required Secrets (Maintainer Only)

These secrets are configured for the main repository and required for full CI/CD functionality:

1. **`GCP_WORKLOAD_IDENTITY_PROVIDER`** - Google Cloud Workload Identity Provider
   - Used by: `.github/workflows/cloudrun-deploy.yml`
   - Format: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID`
   - Required for: Cloud Run deployment
   - Setup: See `docs/deployment-guide.md`

2. **`GCP_SERVICE_ACCOUNT`** - Google Cloud Service Account
   - Used by: `.github/workflows/cloudrun-deploy.yml`
   - Format: `SERVICE_ACCOUNT_NAME@PROJECT_ID.iam.gserviceaccount.com`
   - Required for: Cloud Run deployment
   - Setup: See `docs/deployment-guide.md`

3. **`CLAUDE_CODE_OAUTH_TOKEN`** - Claude Code OAuth Token
   - Used by: `.github/workflows/claude.yml`
   - Format: OAuth token from Claude Code
   - Required for: @claude mentions in issues/PRs
   - Setup: Run `/install-github-app` in Claude Code

### Optional Secrets

- **`GITHUB_TOKEN`** - Automatically provided by GitHub Actions (no setup needed)

### For Contributors and Forks

If you fork this repository:

- ✅ **Build workflows work without secrets** - `build-slides.yml`, `ci.yml`, `docker-publish.yml`
- ✅ **Local development works** - All make targets work locally
- ❌ **Cloud Run deployment disabled** - Requires GCP secrets (maintainer only)
- ❌ **Claude automation disabled** - Requires Claude token (maintainer only)

**To test your fork:**

```bash
# Clone your fork
git clone https://github.com/your-username/talks.git
cd talks

# Run full CI locally
make ci

# Build Docker image
make docker-build

# All workflows will run on PRs except deployment
```

### Verifying Secrets

Maintainers can verify secrets are configured:

```bash
# Using gh CLI
gh secret list

# Expected output:
# CLAUDE_CODE_OAUTH_TOKEN            Updated YYYY-MM-DD
# GCP_SERVICE_ACCOUNT                Updated YYYY-MM-DD
# GCP_WORKLOAD_IDENTITY_PROVIDER     Updated YYYY-MM-DD
```

## 🔍 CI/CD Status and Monitoring

### Workflow Status

Check the status badges at the top of this README or visit the [Actions tab](https://github.com/denhamparry/talks/actions) to see workflow runs.

### Verifying Deployment

After pushing to main:

1. **Build Slides** completes (~2-3 minutes)
2. **Docker Build** publishes to GHCR (~3-5 minutes)
3. **Cloud Run Deploy** updates service (~2-3 minutes)

**Total time:** 7-11 minutes from push to live deployment

**Check deployment:**

```bash
# Using curl
curl https://talks.denhamparry.co.uk/health

# Using gh CLI
gh workflow view cloudrun-deploy.yml

# Using gcloud
gcloud run services describe talks \
  --region=europe-west1 \
  --format='value(status.url)'
```

### Monitoring and Costs

- **Cloud Run Dashboard:** [Console](https://console.cloud.google.com/run?project=denhamparry-talks)
- **Budget Alerts:** Configured at 50%, 90%, 100%, 110% of $12/month
- **Current Cost:** $0/month (within free tier)

### Troubleshooting

#### Missing Logo or Favicon (404 errors)

If you see 404 errors for `edera-logo.png` or `favicon.ico`:

**Cause:** Static assets not copied during build

**Solution:**

```bash
# Rebuild with asset copying
npm run clean
npm run build

# Verify assets exist
ls dist/assets/ederav2/edera-logo.png
ls dist/favicon.ico
```

#### Favicon Not Generating

**Cause:** ImageMagick not installed

**Solution:**

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Alpine (Docker)
apk add imagemagick
```

The build will continue without favicon if ImageMagick is unavailable (non-blocking).

#### General CI/CD Issues

If workflows fail, see:

- **General Issues:** `docs/troubleshooting-cicd.md`
- **Deployment Issues:** `docs/deployment-guide.md`
- **Repository Settings:** `docs/repository-settings.md`

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Lewis Denham-Parry

## 🙋 Support

For questions or issues:

- **Presentation Help:** Check [MARP Usage Guide](docs/marp-usage.md) or [Theme Guide](docs/theme-guide.md)
- **Bugs/Features:** Open an issue in this repository
- **Slide Contributions:** See [Contribution Guide](docs/CONTRIBUTING_SLIDES.md)
- **General Questions:** Open a discussion on GitHub

### Useful Resources

- **MARP Documentation:** [https://marpit.marp.app/](https://marpit.marp.app/)
- **Markdown Guide:** [https://www.markdownguide.org/](https://www.markdownguide.org/)
- **Project Issues:** [https://github.com/denhamparry/talks/issues](https://github.com/denhamparry/talks/issues)

---

**Version:** 1.0.0 (preparing for public release)
**Last Updated:** 2025-12-03
**Maintainer:** [Lewis Denham-Parry](https://github.com/denhamparry)

Built with ❤️ using [MARP](https://marp.app/) and the Edera V2 theme.
