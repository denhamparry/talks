# v1.0.0 - Initial Public Release

## Overview

Professional MARP presentation system with Edera V2 theme, Docker support, and automated Cloud Run deployment. This template repository provides everything needed to create, version control, and deploy professional technical presentations using Markdown.

## What is this?

A GitHub template repository for creating and deploying professional presentations using Markdown with MARP. Perfect for developers, speakers, and teams who want to:

- Version control presentation slides in Git
- Collaborate on presentations with pull requests
- Deploy slides automatically to the web
- Create consistent, professional-looking presentations

## Key Features

### MARP Presentation System

- **Edera V2 Theme** - Professional dark teal and light mint color scheme
- **6 Slide Layouts** - Title, content, dark, two-column, image, and image-overlay
- **WCAG AA Compliant** - Accessible color contrasts for all audiences
- **Markdown-Based** - Simple syntax for creating slides

### Development Tools

- **Makefile Commands** - Simple commands for build, watch, serve
- **Live Reload** - Auto-rebuild on changes during development
- **PDF Generation** - Automated PDF export from markdown
- **Example Templates** - Ready-to-use presentation templates

### Deployment & CI/CD

- **Docker Support** - Multi-stage builds for development and production
- **Multi-Architecture** - Supports amd64 and arm64 (Apple Silicon, AWS Graviton)
- **Cloud Run Deployment** - Automated deployment to Google Cloud Run
- **GitHub Actions** - Complete CI/CD pipeline with automated builds
- **Custom Domain** - Production deployment at talks.denhamparry.co.uk

### Claude Code Integration

- **Custom Slash Commands** - `/setup-repo`, `/review`, `/tdd-check`, `/precommit`
- **Automated PR Reviews** - Claude Code reviews configured out of the box
- **TDD Workflow** - Best practices built into the template
- **Comprehensive Documentation** - CLAUDE.md with project-specific guidance

### Quality & Security

- **Pre-commit Hooks** - Automated code quality checks
- **Secret Detection** - Gitleaks integration to prevent credential leaks
- **Markdown Linting** - Consistent formatting and style
- **Security Headers** - nginx configuration with security best practices

## Installation

### Using the Template

1. Click "Use this template" on GitHub to create your repository
2. Clone your new repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the setup wizard in Claude Code:

   ```bash
   claude
   /setup-repo
   ```

### Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
npm install

# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Copy template and create your first presentation
cp templates/basic-presentation.md slides/my-talk.md

# Build slides
npm run build
```

## Quick Start

### Creating Your First Presentation

```bash
# Copy the basic template
cp templates/basic-presentation.md slides/my-presentation.md

# Edit your slides
# Add your content to slides/my-presentation.md

# Build HTML
npm run build

# Build PDF
npm run build:pdf

# Development mode with live reload
npm run watch

# Serve locally
npm run serve
# Visit http://localhost:8080
```

### Using Make Commands

```bash
# View all available commands
make help

# Build all formats
make build

# Development workflow
make watch
make serve

# Run quality checks
make precommit

# CI workflow
make ci
```

## Live Demo

- **Production Site:** <https://talks.denhamparry.co.uk>
- **Example Presentation:** <https://talks.denhamparry.co.uk/example-presentation.html>
- **Contributor Guide:** <https://talks.denhamparry.co.uk/example-contribution.html>

## Documentation

- **Setup Guide:** [docs/setup.md](docs/setup.md) - Comprehensive setup instructions
- **MARP Usage:** [docs/marp-usage.md](docs/marp-usage.md) - Complete MARP guide
- **Theme Customization:** [docs/theme-guide.md](docs/theme-guide.md) - Customize colors and layouts
- **Deployment Guide:** [docs/deployment-guide.md](docs/deployment-guide.md) - Cloud Run setup
- **Contributing Slides:** [docs/CONTRIBUTING_SLIDES.md](docs/CONTRIBUTING_SLIDES.md) - Submit presentations without code
- **Project Context:** [CLAUDE.md](CLAUDE.md) - Claude Code integration details

## Technology Stack

- **MARP CLI:** 4.2.3 - Markdown presentation framework
- **Node.js:** ≥20.0.0 - JavaScript runtime
- **Docker:** Multi-stage, multi-architecture builds
- **nginx:** 1.29.3 - Production web server
- **Google Cloud Run:** Serverless container platform
- **GitHub Actions:** CI/CD automation

## Known Limitations

- **Cloud Run Deployment:** Requires GCP secrets (maintainer only)
- **Custom Domain Setup:** Requires DNS configuration (Cloudflare or similar)
- **Docker Workflow:** Smoke test timing issue (non-blocking, image builds successfully)
- **PDF Generation:** Requires Node.js and npm installed locally

## Credits

- **Theme:** Based on Edera V2 design system
- **Template:** Claude Code project template
- **MARP:** Maintained by @marp-team
- **Maintained by:** Lewis Denham-Parry

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Lewis Denham-Parry

## Next Steps

After installation:

1. **Run Setup Wizard** (recommended):

   ```bash
   claude
   /setup-repo
   ```

2. **Create Your First Presentation:**

   ```bash
   cp templates/basic-presentation.md slides/my-talk.md
   ```

3. **Build and View:**

   ```bash
   npm run build
   open dist/my-talk.html
   ```

4. **Deploy to Cloud Run** (optional):
   - Follow the [Deployment Guide](docs/deployment-guide.md)
   - Set up GCP project and Workload Identity Federation
   - Configure GitHub secrets for automated deployment

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Contributing Presentations

Want to contribute slide content without code? Use our simple contributor template:

```bash
cp templates/contributor-template.md slides/your-talk.md
# Fill in your content and submit a PR
```

See [docs/CONTRIBUTING_SLIDES.md](docs/CONTRIBUTING_SLIDES.md) for details.

## Support

For issues with:

- **This template:** Open an issue at <https://github.com/denhamparry/talks/issues>
- **Claude Code:** Visit <https://docs.claude.com/en/docs/claude-code>
- **MARP:** Visit <https://marp.app>

## What's New in v1.0.0

This is the initial public release. Key highlights:

- Complete MARP presentation system with professional theme
- Full Docker containerization for development and production
- Automated CI/CD with GitHub Actions
- Cloud Run deployment with custom domain
- Comprehensive documentation and examples
- Claude Code integration with custom workflows
- Pre-commit hooks and quality checks
- Accessibility audit (WCAG AA compliance)
- Example presentations and contributor templates

## Roadmap

Future releases may include:

- **v1.1.0:** Additional slide layouts and theme variants
- **v1.2.0:** Improved mobile presentation experience
- **v2.0.0:** Multi-theme support and theme marketplace

See [GitHub Issues](https://github.com/denhamparry/talks/issues) for planned features.

---

**Release Date:** December 3, 2025
**Git Tag:** v1.0.0
**Built with:** Claude Code
