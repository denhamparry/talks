# Project: GitHub Template for Claude Code Projects

## Repository Purpose

This is a **GitHub template repository** designed to provide a standardized foundation for new projects that will be developed with Claude Code. It includes setup documentation and best practices for TDD-driven development with AI assistance.

## Using This Template

### For New Projects

1. Click "Use this template" on GitHub to create a new repository
2. Clone your new repository locally
3. Open Claude Code in the project directory: `claude`
4. **Run `/setup-repo`** - Interactive wizard that will:
   - Gather your project information (name, tech stack, commands)
   - Customize CLAUDE.md with your project details
   - Configure pre-commit hooks for your language
   - Set up GitHub PR review automation
   - Install and verify all configurations
5. Commit the configured files and start building with TDD!

Alternatively, you can manually follow the setup checklist in `docs/setup.md`.

### Template Contents

- `README.md` - Template overview and quick start guide
- `docs/setup.md` - Comprehensive Claude Code setup checklist
- `CLAUDE.md` - This file (customize for your project)
- `.claude/commands/` - Custom slash commands for workflows
  - `setup-repo.md` - **Interactive setup wizard (start here!)**
  - `review.md` - Comprehensive code review workflow
  - `tdd-check.md` - TDD compliance verification
  - `precommit.md` - Pre-commit hooks runner
- `.github/claude-code-review.yml` - Automated PR review configuration
- `.pre-commit-config.yaml` - Code quality hooks configuration

## Development Philosophy

### Test-Driven Development (TDD)

All projects created from this template should follow TDD:

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Improve code while keeping tests green

### Claude Code Best Practices

- Use 3-step process: Research → Plan → Implement
- Write tests before implementation
- Commit frequently with clear messages
- Use @-mentions to include relevant files in context
- Leverage custom slash commands for common workflows

### Custom Slash Commands

This template includes custom slash commands in `.claude/commands/`:

- **`/setup-repo`** - Interactive setup wizard for new projects (run this first!)
- **`/review`** - Comprehensive code review covering quality, tests, security, performance, and documentation
- **`/tdd-check`** - Verify TDD workflow compliance (tests written before implementation)
- **`/precommit`** - Run pre-commit hooks on all files to catch quality issues

Customize these commands or add new ones for your project-specific workflows.

## Customization Checklist

When creating a new project from this template:

- [ ] Update this CLAUDE.md with project-specific information
- [ ] Add Quick Commands section with your build/test/lint commands
- [ ] Define Code Style Guidelines for your language/framework
- [ ] Document Project Structure
- [ ] Set up Testing Requirements and framework
- [ ] Configure Git Workflow and branching strategy
- [ ] Add Environment Setup instructions
- [ ] Document Common Patterns specific to your project
- [ ] List Known Issues/Gotchas
- [ ] Add Dependencies Notes
- [ ] Customize `.pre-commit-config.yaml` for your language (uncomment relevant hooks)
- [ ] Update `.github/claude-code-review.yml` with project-specific review criteria
- [ ] Modify or add custom slash commands in `.claude/commands/` as needed
- [ ] Install and configure pre-commit: `pip install pre-commit && pre-commit install`
- [ ] Set up GitHub App for PR reviews: run `/install-github-app` in Claude Code

## Quick Commands

### Development Commands (via Makefile)

```bash
# Show all available commands
make help

# Install dependencies
make install

# Build all formats
make build

# Build specific formats
make build-html
make build-pdf

# Development workflow
make watch          # Auto-rebuild on changes
make serve          # MARP dev server (file browser)
make serve-dist     # Build and serve complete site with themed index

# Quality checks
make lint           # Run linting
make format         # Format files
make precommit      # Run pre-commit hooks
make test-smoke     # Run smoke tests to verify build output

# Cleanup
make clean          # Remove build artifacts

# CI workflow
make ci             # Install + build all
```

### Underlying npm Scripts

The Makefile delegates to these npm scripts:

```bash
npm run build       # Build HTML
npm run build:pdf   # Build PDF
npm run watch       # Watch mode
npm run serve       # MARP dev server (file browser)
npm run serve:dist  # Build and serve complete site with themed index
npm run test:smoke  # Run smoke tests to verify build output
npm run clean       # Clean dist/
```

Use `make` commands for consistency across projects. Use npm scripts directly if preferred.

## Code Style Guidelines (Customize)

- Follow TDD: Write tests first, then implementation
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- [Add language-specific conventions]

## Testing Requirements

- **TDD is mandatory**: All features must start with tests
- Write unit tests for all business logic
- Add integration tests for critical paths
- Maintain >80% code coverage
- Run tests before every commit

## Git Workflow

- Branch naming: `feature/*`, `bugfix/*`, `hotfix/*`
- Commit message format: `type: description`
  - Types: feat, fix, docs, style, refactor, test, chore
- Always create PR for review
- Rebase before merging

## Pre-commit Hooks

This template includes `.pre-commit-config.yaml` with generic code quality hooks:

- File formatting (trailing whitespace, end-of-file, line endings)
- Syntax validation (YAML, JSON, TOML, XML)
- Secret detection (gitleaks)
- Large file detection
- Merge conflict detection

**Setup:**

```bash
pip install pre-commit
pre-commit install
```

**Run manually:**

```bash
pre-commit run --all-files
```

Customize `.pre-commit-config.yaml` for your language-specific needs (Python, Go, JavaScript, etc.).

## GitHub Integration

This template includes `.github/claude-code-review.yml` for automated PR reviews.

**Setup:**

1. Run `/install-github-app` in Claude Code session
2. Customize review criteria in `.github/claude-code-review.yml`
3. Claude will automatically review PRs based on configured rules

The default configuration checks for:

- Code quality and style compliance
- TDD compliance (tests written first)
- Bugs and edge cases
- Security vulnerabilities
- Performance issues
- Documentation updates

## Presentation Workflow (MARP)

This repository includes a complete MARP presentation system with the Edera V2 theme.

### Build Process

The build process (`npm run build`) performs these steps:

1. **Generate HTML** - MARP converts markdown to HTML
2. **Copy Assets** - Theme assets copied to `dist/assets/`
3. **Generate Index** - Creates `index.html` listing all presentations
4. **Generate Favicon** - Converts Edera logo to `favicon.ico`

**Build output structure:**

```text
dist/
├── assets/
│   └── ederav2/
│       └── edera-logo.png    # Edera logo for slides
├── favicon.ico                # Browser tab icon
├── index.html                 # Presentation listing
└── *.html                     # Individual presentations
```

**Static Assets:**

- **Logo:** `dist/assets/ederav2/edera-logo.png` - Appears in top right of content slides
- **Favicon:** `dist/favicon.ico` - Browser tab icon
- **CSS:** Inlined in HTML files by MARP
- All assets served by nginx in production

### Local Development Options

There are two ways to preview presentations locally:

**Option 1: MARP Dev Server (Quick Preview)**

```bash
make serve          # or npm run serve
# Visit http://localhost:8080
```

- Shows MARP's default file browser interface
- Plain white background with simple file listing
- Serves slides directly from `slides/` directory
- Good for quick slide editing with live reload
- **Does NOT show the custom Edera V2 themed index page**

**Option 2: Production-Like Preview (Complete Site)**

```bash
make serve-dist     # or npm run serve:dist
# Visit http://localhost:8080
```

- Shows the complete site with Edera V2 themed landing page
- Light mint gradient background with styled presentation cards
- Serves the built `dist/` directory (same as production)
- Includes all assets, favicon, and proper index page
- **This is what production looks like** (talks.denhamparry.co.uk)

**When to use each:**

- Use `make serve` for rapid slide editing during development
- Use `make serve-dist` to preview the final site before deploying
- Use `make serve-dist` to verify the themed index page displays correctly

### Docker Development Options

If using Docker, there are two services available:

**Option 1: Development Service (Quick Preview)**

```bash
make docker-dev
# or
docker-compose up dev
# Visit http://localhost:8080
```

- Shows MARP's default file browser interface
- Plain white background with simple file listing
- Live reload for rapid slide editing
- **Does NOT show the custom Edera V2 themed index page**

**Option 2: Production Service (Complete Site)**

```bash
make docker-prod
# or
docker-compose --profile production up prod
# Visit http://localhost:8081  (note: different port!)
```

- Shows the complete site with Edera V2 themed landing page
- Light mint gradient background with styled presentation cards
- Serves the built `dist/` directory (same as production)
- **This is what production looks like** (talks.denhamparry.co.uk)

**Important:** The production service runs on **port 8081**, not 8080.

### Creating New Presentations

1. **Copy Template:**

   ```bash
   cp templates/basic-presentation.md slides/my-talk.md
   ```

2. **Edit Content:**
   Edit `slides/my-talk.md` using Markdown syntax with MARP directives

3. **Build Slides:**

   ```bash
   npm run build       # Build HTML with assets
   npm run build:pdf   # Generate PDF
   # or
   npm run watch       # Auto-rebuild during development
   ```

4. **Output:**
   Find generated files in `dist/my-talk.pdf` or `dist/my-talk.html`

### Available Slide Layouts

Apply layouts using HTML comments in your markdown:

- `<!-- _class: title -->` - Opening/closing slides with dark background
- `<!-- _class: content -->` - Standard content slides (default)
- `<!-- _class: dark -->` - Dark background variant for emphasis
- `<!-- _class: two-columns -->` - Side-by-side content layout
- `<!-- _class: image -->` - Full-screen image slides
- `<!-- _class: image-overlay -->` - Text over background image

### Theme Customization

- **Colors:** Edit `themes/edera-v2.css` CSS variables
- **Fonts:** Modify font-family declarations
- **Layouts:** Add custom section classes
- **New Themes:** Copy edera-v2.css and customize

See `docs/theme-guide.md` for detailed customization instructions.

### Edera V2 Theme Colors

- **Dark Teal (#013a3b):** Title slide backgrounds, body text
- **Light Mint (#d0fdf2):** Content slide backgrounds
- **Cyan Accent (#02f4d5):** Headings, links, emphasis
- All color combinations meet WCAG AA accessibility standards

### Documentation

- **Usage Guide:** `docs/marp-usage.md` - Complete MARP instructions
- **Theme Guide:** `docs/theme-guide.md` - Customization and best practices
- **Theme Analysis:** `docs/theme-analysis.md` - Design specifications from SVG exports
- **Templates:** `templates/` directory - Example layouts and presentations

### CI/CD

GitHub Actions automatically builds presentations:

- Workflow: `.github/workflows/build-slides.yml`
- Triggered by changes to `slides/`, `themes/`, or `templates/`
- Generates HTML and PDF artifacts
- Artifacts downloadable from Actions tab

### Best Practices

1. **One idea per slide** - Keep focused
2. **Use visuals** - Images enhance understanding
3. **Limit text** - 5-7 bullet points maximum
4. **Consistent style** - Stick to theme layouts
5. **Version control** - Commit slides to Git
6. **Test output** - Build PDF early and often

## Notes for Template Maintainers

- Keep `docs/setup.md` updated with latest Claude Code best practices
- This template should remain language-agnostic
- Focus on Claude Code integration patterns
- Update checklist based on user feedback

---

**Template Version:** 1.0
**Last Updated:** 2025-12-03
**Maintained By:** Lewis Denham-Parry
