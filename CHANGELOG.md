# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/denhamparry/talks/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/denhamparry/talks/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/denhamparry/talks/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/denhamparry/talks/releases/tag/v1.0.0
