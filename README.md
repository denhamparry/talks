# Claude Code Project Template

A GitHub template repository that provides a standardized, fully-configured foundation for new projects developed with Claude Code. Includes built-in support for Test-Driven Development (TDD), automated code quality checks, and AI-assisted workflows.

## 🚀 Quick Start

### 1. Create Your Project

Click the **"Use this template"** button above to create a new repository from this template.

### 2. Clone and Setup

```bash
# Clone your new repository
git clone https://github.com/your-username/your-new-project.git
cd your-new-project

# Open Claude Code
claude
```

### 3. Run the Setup Wizard

In Claude Code, run:

```text
/setup-repo
```

The interactive wizard will:

- ✅ Gather your project information (name, tech stack, commands)
- ✅ Customize configuration files for your specific project
- ✅ Configure pre-commit hooks for your language
- ✅ Set up automated GitHub PR reviews
- ✅ Install and verify all configurations

### 4. Start Building

```bash
# Commit the configured files
git add .
git commit -m "chore: configure Claude Code for project"

# Start developing with TDD!
```

## 📦 What's Included

### Core Configuration

- **`CLAUDE.md`** - Project context for Claude Code with TDD guidelines
- **`docs/setup.md`** - Comprehensive setup checklist and best practices
- **`.pre-commit-config.yaml`** - Code quality hooks (formatting, linting, security)
- **`.github/claude-code-review.yml`** - Automated PR review configuration

### Presentation System (MARP)

- **`themes/edera-v2.css`** - Professional Edera V2 presentation theme
- **`templates/`** - Ready-to-use slide deck templates
- **`marp.config.js`** - MARP build configuration
- **`docs/marp-usage.md`** - Complete MARP usage guide
- **`docs/theme-guide.md`** - Theme customization documentation

### Custom Slash Commands

Located in `.claude/commands/`:

- **`/setup-repo`** - Interactive setup wizard (run this first!)
- **`/review`** - Comprehensive code review (quality, tests, security, performance)
- **`/tdd-check`** - Verify TDD workflow compliance
- **`/precommit`** - Run pre-commit hooks on all files

## 🎯 Key Features

### Test-Driven Development (TDD)

This template enforces TDD workflow:

1. **Red** - Write a failing test first
2. **Green** - Write minimal code to make it pass
3. **Refactor** - Improve code while keeping tests green

Use `/tdd-check` to verify you're following TDD principles.

### Automated Code Quality

- Pre-commit hooks for consistent formatting and linting
- Secret detection to prevent credential leaks
- Language-specific quality checks (Python, Go, JavaScript/TypeScript)
- Automated PR reviews with Claude Code

### Claude Code Optimized

- Project-specific context in CLAUDE.md
- Custom slash commands for common workflows
- Automated PR reviews configured out of the box
- Best practices built into the template

## 🛠️ Supported Languages

The template is language-agnostic but includes pre-configured hooks for:

- **Python** - Black, Flake8, isort
- **Go** - gofmt, go vet, go imports
- **JavaScript/TypeScript** - Prettier, ESLint
- **Generic** - File formatting, YAML/JSON validation, secret detection

Simply uncomment the relevant hooks in `.pre-commit-config.yaml` during setup.

## 🎤 Building Presentations

This repository includes a complete MARP setup with the Edera V2 theme for creating professional presentations.

### Quick Start

```bash
# Install dependencies
npm install

# Create a new presentation
cp templates/basic-presentation.md slides/my-talk.md

# Build slides
npm run build        # HTML output
npm run build:pdf    # PDF output

# Development mode
npm run watch        # Auto-rebuild on changes
npm run serve        # Local server with live reload
```

### Features

- **Edera V2 Theme** - Professional dark teal and light mint color scheme
- **6 Slide Layouts** - Title, content, dark, two-column, image, and image-overlay
- **Version Control** - Markdown-based slides in Git
- **CI/CD Ready** - Automated builds via GitHub Actions
- **Accessible** - WCAG AA compliant color contrasts

### Documentation

- **[MARP Usage Guide](docs/marp-usage.md)** - Complete usage instructions
- **[Theme Guide](docs/theme-guide.md)** - Customization and best practices
- **[Theme Analysis](docs/theme-analysis.md)** - Design specifications
- **[Templates](templates/)** - Example slide decks and layouts

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

# Serve locally with live reload
make serve

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
```

### CI Workflow

```bash
# Run complete CI workflow (install + build)
make ci
```

**Alternative:** You can still use npm scripts directly:

```bash
npm run build
npm run build:pdf
npm run watch
npm run serve
```

## 🐳 Running with Docker

This repository includes full Docker support for containerized development and deployment.

### Docker Quick Start

```bash
# Development server with live reload
make docker-dev
# Visit http://localhost:8080

# Production server
make docker-prod
# Visit http://localhost:8081
```

### Using docker-compose Directly

```bash
# Development mode
docker-compose up dev

# Production mode
docker-compose --profile production up prod
```

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

### Deployment

See [Docker Deployment Guide](docs/docker-deployment.md) for detailed instructions on:

- Local development and production workflows
- Deploying to Google Cloud Run
- Deploying to Fly.io
- Running on generic container platforms
- Troubleshooting

### GitHub Container Registry

The project automatically publishes container images to GitHub Container Registry when changes are pushed to main:

```bash
docker pull ghcr.io/denhamparry/talks:latest
docker run -p 80:80 ghcr.io/denhamparry/talks:latest
```

## 📚 Documentation

- **`CLAUDE.md`** - Main project context for Claude Code
- **`docs/setup.md`** - Detailed setup instructions and best practices
- **`docs/marp-usage.md`** - MARP presentation guide
- **`docs/theme-guide.md`** - Theme customization guide
- **`.claude/commands/`** - Custom command documentation

## 🔧 Manual Setup (Alternative)

If you prefer not to use the interactive wizard, follow the manual checklist in `docs/setup.md`.

## 🤝 Contributing

### Contributing Slide Content

**Want to contribute presentations without code?** You can!

No MARP knowledge required - just use our simple template:

```bash
# Get the template
cp templates/contributor-template.md slides/your-talk.md

# Fill in your content
# Submit a pull request
```

See our [Slide Contribution Guide](docs/CONTRIBUTING_SLIDES.md) for complete instructions.

**Features:**

- Simple markdown template with inline instructions
- No need to understand MARP or presentation tools
- Automatic professional formatting with Edera V2 theme
- CI/CD builds HTML and PDF automatically
- Great for external projects and teams

**Check out:** `slides/example-contribution.md` for a complete example!

---

### Contributing to the Template

To improve this template:

1. Make your changes
2. Test with a new project
3. Update documentation
4. Submit a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

[Add your license here]

## 🙋 Support

For issues with:

- **This template**: Open an issue in this repository
- **Claude Code**: Visit <https://docs.claude.com/en/docs/claude-code>
- **Feedback**: <https://github.com/anthropics/claude-code/issues>

---

**Template Version:** 1.0
**Last Updated:** 2025-10-02

Built with ❤️ for Claude Code development
