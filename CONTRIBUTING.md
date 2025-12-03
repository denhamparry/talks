# Contributing

Thank you for considering contributing to this project! This document outlines the process and guidelines for contributing.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### Contributing Slide Content

Want to contribute presentation content without writing code? We welcome slide submissions!

**No MARP knowledge required!** Use our contributor-friendly template to create professional slide decks.

See our [Slide Contribution Guide](docs/CONTRIBUTING_SLIDES.md) for:

- Using the contributor template
- Submitting slides from external projects
- Best practices for slide content
- Step-by-step submission workflow

**Quick start:**

```bash
# Copy the template
cp templates/contributor-template.md slides/your-talk.md

# Fill in your content and submit a PR
```

Check out `slides/example-contribution.md` for a complete example.

### Speaker Notes

Speaker notes are hidden comments in your slides that only you (the presenter) see. They're incredibly useful for live presentations!

**When to use speaker notes:**

- Adding timing cues ("spend 2 minutes here")
- Including talking points you don't want on slides
- Noting questions to ask the audience
- Remembering key statistics or quotes
- Adding pronunciation guides for technical terms

**How to add speaker notes:**

Use HTML comments in your markdown:

```markdown
# My Slide Title

Content visible to audience

<!--
Speaker Notes:
- This text is only visible to you
- Great for timing cues
- Add talking points
- Remember key statistics
-->
```

**Best practices:**

- Keep notes concise and bullet-pointed
- Add timing estimates (e.g., "Spend 2 minutes here")
- Include questions to engage audience
- Note common Q&A topics
- Add pronunciation guides for technical terms

**Viewing your speaker notes:**

When presenting from HTML (not PDF):

1. Open the HTML file in a browser
2. View page source (Ctrl+U / Cmd+Option+U)
3. Look for HTML comments containing your notes
4. Or use browser developer tools (F12)

**Complete examples:**

See `slides/example-presentation.md` for real-world examples of speaker notes throughout a presentation.

**Detailed documentation:**

For advanced speaker notes features and troubleshooting, see the [Speaker Notes section in the MARP Usage Guide](docs/marp-usage.md#adding-speaker-notes).

### Presenter Attribution

All presentations in this repository should include proper attribution.

**Default Presenter:**

- **Name:** Lewis Denham-Parry
- **Email:** <lewis@denhamparry.co.uk>

**Where to include attribution:**

1. **Title slide** (opening slide):

   ```markdown
   <!-- _class: title -->

   # Your Talk Title

   ## Your Subtitle

   Lewis Denham-Parry | Event Name | Date
   ```

2. **Closing slide** (thank you slide):

   ```markdown
   <!-- _class: title -->

   # Thank You

   ## Questions?

   Lewis Denham-Parry
   lewis@denhamparry.co.uk
   @denhamparry
   ```

**For external contributors:**

If you're contributing slides from your own presentations:

- Use your own name and contact information
- Follow the same attribution format
- Include your preferred contact method (email, social handle, website)

**Template reference:**

All presentation templates include attribution placeholders. Replace the placeholder text with the appropriate presenter information.

---

### Reporting Bugs

Before creating a bug report:

- Check the existing issues to avoid duplicates
- Collect relevant information (OS, version, steps to reproduce)

When creating a bug report, use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Any relevant logs or screenshots

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use the feature request template
- Provide a clear description of the problem and proposed solution
- Explain why this enhancement would be useful
- Include examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow TDD workflow**: Write tests before implementation
3. **Make your changes**:
   - Follow the project's code style
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass
4. **Run pre-commit hooks**: `pre-commit run --all-files`
5. **Commit your changes** using conventional commit format:
   - `feat: add new feature`
   - `fix: resolve bug in component`
   - `docs: update README`
   - `test: add tests for feature`
   - `refactor: improve code structure`
6. **Push to your fork** and submit a pull request
7. **Fill out the PR template** completely
8. **Wait for review** and address any feedback

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- (Optional) Docker for containerized development

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/talks.git
cd talks

# Install dependencies
npm install

# Install pre-commit hooks
pip install pre-commit
pre-commit install
```

### Running Tests

```bash
# Build all presentations to verify they compile
npm run build
npm run build:pdf

# Run pre-commit hooks
pre-commit run --all-files
```

### Running Locally

```bash
# Build presentations
npm run build

# Start local server with live reload
npm run serve
# Visit http://localhost:8080

# Or watch mode for auto-rebuild
npm run watch
```

## Testing Requirements

- **TDD is mandatory**: Write tests before implementation
- All new features must include tests
- All tests must pass before submitting PR
- Aim for >80% code coverage
- Include both unit and integration tests where appropriate

## Code Style Guidelines

- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Run linters before committing

## Git Commit Messages

- Use conventional commit format: `type: description`
- Keep the first line under 72 characters
- Use present tense ("add feature" not "added feature")
- Reference issues and PRs where applicable

## Review Process

1. A maintainer will review your PR
2. Changes may be requested
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Questions?

- Open a discussion in GitHub Discussions
- Check existing documentation
- Review closed issues for similar questions

## Recognition

Contributors are recognized in the project. Thank you for your contributions!
