# Makefile for denhamparry/talks
# Provides consistent command-line interface for repository operations

.PHONY: help
help: ## Display available commands
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

# Build Commands
# ---------------

.PHONY: build
build: ## Build all output formats (HTML + PDF)
	@echo "Building HTML presentations..."
	@npm run build
	@echo "Building PDF presentations..."
	@npm run build:pdf
	@echo "Build complete! Check dist/ directory"

.PHONY: build-html
build-html: ## Build HTML presentations only
	npm run build

.PHONY: build-pdf
build-pdf: ## Build PDF presentations only
	npm run build:pdf

# Development Commands
# --------------------

.PHONY: serve
serve: ## Serve presentations locally with live reload
	npm run serve

.PHONY: watch
watch: ## Watch mode for auto-rebuild on changes
	npm run watch

# Quality Commands
# ----------------

.PHONY: lint
lint: ## Run linting checks
	@echo "Running markdownlint..."
	@npx markdownlint-cli '**/*.md' --ignore node_modules --ignore dist || echo "Lint warnings found (non-blocking)"

.PHONY: format
format: ## Format code/markdown files
	@echo "Running formatting via pre-commit..."
	@pre-commit run trailing-whitespace --all-files || true
	@pre-commit run end-of-file-fixer --all-files || true
	@echo "Formatting complete"

.PHONY: precommit
precommit: ## Run pre-commit hooks on all files
	pre-commit run --all-files

# Utility Commands
# ----------------

.PHONY: clean
clean: ## Remove build artifacts (dist/ directory)
	@echo "Cleaning build artifacts..."
	@npm run clean
	@echo "Clean complete"

.PHONY: install
install: ## Install dependencies
	@echo "Installing npm dependencies..."
	@npm install
	@echo "Installing pre-commit hooks..."
	@pre-commit install || echo "pre-commit not available (optional)"
	@echo "Installation complete"

.PHONY: ci
ci: install build ## CI workflow: install dependencies and build all formats
	@echo "CI workflow complete"
