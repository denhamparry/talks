# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2025-12-04

### Added

- Cloud-Native Manchester talk (December 4th, 2025) comprehensive review and updates ([#58](https://github.com/denhamparry/talks/issues/58))
  - Personal introduction section with background and motivations
  - "Lessons Learned" section with human perspective on AI development
  - QR code for IvySketch live demo at https://ivysketch.me
  - Speaker notes for Chi router middleware chain explanation
  - Responsive two-column image layouts for book cover and IvySketch demo
  - Conclusion section with F&%K LUCK philosophy and Edera branding
  - Reference to upcoming am-i-isolated project
  - Presentation assets (book cover, QR code, train image) - optimized under 1MB
- Edera logo in top right corner of slides for Edera V2 theme ([#51](https://github.com/denhamparry/talks/issues/51))
  - Logo displays on content, dark, two-column, and image slides
  - Hidden on title slides for clean aesthetic
  - Responsive sizing maintains aspect ratio (110px width default)
  - Customizable via CSS (position, size, visibility)
  - Logo asset: `themes/assets/edera-logo.png` (4.2KB)

### Changed

- Enhanced Edera V2 theme typography for better readability
  - Base font size: 24px → 44px (83% increase)
  - List items: MARP-relative sizing `calc(var(--marpit-root-font-size) * 1.25)` (~55px)
  - Code blocks: Fixed at 18px (prevents overflow on slides)
  - Footer/header/pagination: Fixed at 18px (consistent metadata sizing)
  - MARP-relative font sizing enables flexible scaling across presentations

### Fixed

- Fixed spelling in Cloud-Native Manchester talk: "excentuates" → "accentuates"
- Fixed grammar in Cloud-Native Manchester talk: "Its" → "It's" (contraction)
- Fix 404 errors for edera-logo.png and favicon.ico on talks.denhamparry.co.uk ([#56](https://github.com/denhamparry/talks/issues/56))
  - Updated build process to copy theme assets to dist directory
  - Added favicon generation from Edera logo using ImageMagick
  - Created `scripts/generate-favicon.js` for graceful fallback
  - Installed ImageMagick in Docker builder stage
  - Static assets now available at `/assets/ederav2/edera-logo.png` and `/favicon.ico`
  - Edera logo now displays correctly in top right of slides
  - Browser tabs now show Edera favicon
  - Build chain: marp → copy-assets → generate-index → generate-favicon

### Documentation

- Created comprehensive implementation plan at `docs/plan/issues/58_review_and_update_ivysketch_talk_design_patterns_ai_workflow.md`
  - Systematic review approach with detailed checklists
  - Testing strategy (unit, integration, regression)
  - Success criteria (25+ measurable items)
  - Cross-platform testing matrix

## [1.0.3] - 2025-12-03

### Fixed

- Fixed Docker HEALTHCHECK IPv6 resolution and port mapping issues
  - Root cause #1: BusyBox wget resolves localhost to IPv6 first, connection refused
  - Root cause #2: Workflow mapped port 8888:80 but nginx listens on 8080
  - Solution: Use 127.0.0.1 instead of localhost in HEALTHCHECK
  - Solution: Changed workflow port mapping to 8888:8080
  - Health check now passes consistently in ~6 seconds
  - Verified with local testing before deployment

## [1.0.2] - 2025-12-03

### Fixed

- Fixed Docker workflow smoke test to use native health check (#50)
  - Root cause: Docker network bridge initialization delay (13+ seconds)
  - Solution: Use Docker's internal HEALTHCHECK (runs inside container)
  - Avoids network bridge delay by checking container health status
  - Expected timing: 7-15 seconds depending on system speed
  - Leverages existing Dockerfile HEALTHCHECK definition

## [1.0.1] - 2025-12-03

### Fixed

- Fixed Docker workflow smoke test timing issue with retry logic (#47)
  - Added health check retry loop (5 attempts, 2-second intervals)
  - Eliminates race condition in container startup verification
  - Total timeout: ~15 seconds maximum
  - Note: This was replaced by v1.0.2 which addresses the root cause

## [1.0.0] - 2025-12-03

### Added
- Initial public release
- MARP presentation system with Edera V2 theme
- Docker support for containerized development and deployment
- Cloud Run deployment configuration
- Comprehensive documentation (setup, usage, theme customization)
- GitHub Actions CI/CD workflows
- Pre-commit hooks for code quality
- Accessibility audit and WCAG AA compliance
- Example presentations and contributor templates
- Makefile for convenient command-line operations

### Features
- Professional Edera V2 theme with multiple slide layouts
- Automated HTML and PDF generation
- Live reload development server
- Custom domain support (talks.denhamparry.co.uk)
- Multi-architecture Docker images (amd64, arm64)
- Automated deployment to Google Cloud Run
- Comprehensive contributor guides

[Unreleased]: https://github.com/denhamparry/talks/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/denhamparry/talks/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/denhamparry/talks/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/denhamparry/talks/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/denhamparry/talks/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/denhamparry/talks/releases/tag/v1.0.0
