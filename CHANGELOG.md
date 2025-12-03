# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation review and updates for public release
- CODE_OF_CONDUCT.md following Contributor Covenant 2.1
- CHANGELOG.md to track version history
- LICENSE file (MIT License)
- Automated link verification script

### Changed
- Updated README.md with current date and metadata
- Updated CLAUDE.md with maintainer information
- Enhanced CONTRIBUTING.md with project-specific setup instructions
- Updated docs/setup.md with current project information

### Fixed
- Fixed placeholder text in core documentation files
- Fixed date inconsistencies in documentation
- Fixed Docker workflow smoke test timing issue with retry logic (#47)
  - Added health check retry loop (5 attempts, 2-second intervals)
  - Eliminates race condition in container startup verification
  - Total timeout: ~15 seconds maximum

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

[Unreleased]: https://github.com/denhamparry/talks/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/denhamparry/talks/releases/tag/v1.0.0
