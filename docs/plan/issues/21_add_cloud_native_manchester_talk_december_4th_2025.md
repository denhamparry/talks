# GitHub Issue #21: Add Cloud-Native Manchester talk (December 4th, 2025)

**Issue:** [#21](https://github.com/denhamparry/talks/issues/21)
**Status:** Complete
**Date:** 2025-12-03
**Labels:** documentation, enhancement, talk

## Problem Statement

Add presentation materials for a talk at the Cloud-Native Manchester meetup scheduled for December 4th, 2025.

**Talk Title:** "IvySketch: Design Patterns & AI Workflow"
**Subtitle:** "Building GenAI Applications with Kubernetes and AI-Assisted Development"
**Speaker:** Lewis Denham-Parry
**Source Material:** `ivysketch-design-patterns-and-ai-workflow.marp.md` (1136 lines)

### Current Behavior
- Repository contains infrastructure for MARP presentations with Edera V2 theme
- Example presentations exist (`example-contribution.md`, `example-presentation.md`)
- Build system and CI/CD are operational
- Talk content exists in root directory: `ivysketch-design-patterns-and-ai-workflow.marp.md`
- **No presentation in `slides/` directory** - source file needs to be moved/renamed

### Expected Behavior
- Move/rename talk file to `slides/2025-12-04-cloud-native-manchester.md`
- Follow repository naming convention (YYYY-MM-DD-event-name.md)
- Ensure presentation builds successfully (HTML and PDF)
- Update README with talk information
- Verify all MARP directives are compatible with Edera V2 theme

## Current State Analysis

### Relevant Code/Config

**Build System:**
- `.github/workflows/build-slides.yml` - Automated build workflow
  - Triggers on changes to `slides/`, `themes/`, `templates/`
  - Builds both HTML and PDF formats
  - Uploads artifacts for download

**Templates:**
- `templates/basic-presentation.md` - Standard presentation template
  - Includes MARP frontmatter with Edera V2 theme
  - Demonstrates all available slide layouts (title, content, dark, two-columns)
  - Contains placeholder content structure

**Package Scripts:**
- `npm run build` - Build HTML slides
- `npm run build:pdf` - Build PDF slides
- `npm run watch` - Auto-rebuild during development
- `npm run serve` - Local dev server

### Related Context

**Similar Issues:**
- Issue #1: Port Google Slides theme to MARP template (completed)
- Issue #5: Create reusable slide deck template (completed)
- Issue #14: Update contributing guidelines with speaker notes (completed)

**Repository Purpose:**
This is a talks repository that manages presentation materials using MARP with a custom Edera V2 theme. The repository is designed to version control presentation content and automate builds via GitHub Actions.

## Solution Design

### Approach

Create a new slide deck for the Cloud-Native Manchester talk using the established MARP workflow:

1. Create a new markdown file in `slides/` directory with a descriptive filename
2. Use the `basic-presentation.md` template as a foundation
3. Customize frontmatter and content for the specific talk
4. Build and test locally to verify formatting
5. Update repository README to include talk information

**Rationale:**
- Follows existing repository patterns
- Leverages working build infrastructure
- Uses proven Edera V2 theme
- Enables version control of presentation content

### Implementation

**File Naming Convention:**
Follow pattern: `YYYY-MM-DD-event-name.md`

Filename: `slides/2025-12-04-cloud-native-manchester.md`

**Slide Deck Structure:**
```markdown
---
marp: true
theme: edera-v2
paginate: true
---

<!-- _class: title -->

# [Talk Title]

## [Subtitle]

[Speaker Name] | Cloud-Native Manchester | December 4th, 2025

---

<!-- _class: content -->

# Agenda

- Introduction
- Main topics
- Key takeaways
- Q&A

---

[Additional content slides...]

---

<!-- _class: title -->

# Thank You

## Questions?

[Speaker Name]
[Contact Information]
```

**README Update:**
Add entry to a "Talks" or "Presentations" section:

```markdown
## Recent Talks

### Cloud-Native Manchester - December 4th, 2025
- **Event:** [Cloud-Native Manchester Meetup](https://www.meetup.com/cloud-native-kubernetes-manchester/events/312062865/)
- **Date:** December 4th, 2025
- **Slides:** [View HTML](dist/2025-12-04-cloud-native-manchester.html) | [Download PDF](dist/2025-12-04-cloud-native-manchester.pdf)
```

### Benefits

- **Version Control:** Presentation content tracked in Git
- **Automated Builds:** CI/CD generates HTML and PDF automatically
- **Professional Theme:** Consistent Edera V2 branding
- **Accessibility:** WCAG AA compliant colors
- **Reusability:** Future talks can use same infrastructure

## Implementation Plan

### Step 1: Move and Rename Slide Deck

**Action:** Move existing talk file to slides directory with proper naming

**Commands:**
```bash
# Move and rename to follow repository convention
mv ivysketch-design-patterns-and-ai-workflow.marp.md \
   slides/2025-12-04-cloud-native-manchester.md

# Verify file moved successfully
ls -la slides/2025-12-04-cloud-native-manchester.md
```

**File:** `slides/2025-12-04-cloud-native-manchester.md`

**Existing Content Analysis:**
The talk file already contains:
- ✅ MARP frontmatter (marp: true, theme: edera-v2, paginate: true)
- ✅ Complete presentation structure (1136 lines, 7 parts)
- ✅ Title slide: "IvySketch: Design Patterns & AI Workflow"
- ✅ Speaker: Lewis Denham-Parry
- ⚠️ Missing event attribution (needs: "| Cloud-Native Manchester | December 4th, 2025")

**Required Changes:**
1. Update title slide to include event details:
```markdown
# IvySketch: Design Patterns & AI Workflow

**Building GenAI Applications with Kubernetes and AI-Assisted Development**

Lewis Denham-Parry | Cloud-Native Manchester | December 4th, 2025
```

2. Add optional header/footer in frontmatter:
```markdown
---
marp: true
theme: edera-v2
paginate: true
header: 'Cloud-Native Manchester'
footer: 'December 4th, 2025'
---
```

**Content Structure (Already Complete):**
- Part 1: Introduction (What is IvySketch, Tech Stack, Deployment)
- Part 2: Architecture & Design Patterns (Middleware, SSE, NATS, OpenTelemetry)
- Part 3: Kubernetes Deployment Patterns (Kustomize, GPU scheduling, NetworkPolicies)
- Part 4: AI-Powered Development Workflow (Documentation-driven, custom commands)
- Part 5: Real-World Examples (NATS integration, ComfyUI, Image Worker)
- Part 6: Lessons Learned (What worked, challenges, best practices)
- Part 7: Conclusion & Q&A

**Example Structure (Based on `example-contribution.md`):**
```markdown
---
marp: true
theme: edera-v2
paginate: true
header: 'Cloud-Native Manchester'
footer: 'December 4th, 2025'
---

<!-- _class: title -->

# Your Talk Title Here

## Engaging Subtitle

Your Name | Cloud-Native Manchester | December 4th, 2025

<!--
Speaker Notes:
- Welcome everyone to Cloud-Native Manchester
- Introduce yourself briefly
- Set expectations for talk length
- Mention when to ask questions (during or after)
-->

---

<!-- _class: content -->

# What We'll Cover

- [First main topic]
- [Second key concept]
- [Third important theme]
- Q&A

<!--
Speaker Notes:
- This is an agenda slide - sets clear expectations
- Estimated time: 15-20 minutes
- Encourage questions at any point
-->

---

<!-- _class: content -->

# Why This Matters

[Brief introduction explaining the relevance]

- **Problem:** [What challenge are you addressing?]
- **Impact:** [Why should the audience care?]
- **Solution:** [What will they learn from your talk?]

---

[Additional content slides with code, tables, or two-column layouts...]

---

<!-- _class: content -->

# Key Takeaways

1. **First main takeaway** - Brief elaboration
2. **Second main takeaway** - Brief elaboration
3. **Third main takeaway** - Brief elaboration

---

<!-- _class: title -->

# Thank You

## Questions?

Your Name
your.email@example.com
@yourhandle

<!--
Speaker Notes:
- Open the floor for questions
- Thank the audience for their time
- Mention you're available after for one-on-one questions
-->
```

**Available Slide Layouts (from `example-presentation.md`):**

1. **Title Slide** (`<!-- _class: title -->`) - Dark teal background
   - Use for opening and closing slides
   - Large heading with subtitle
   - Attribution line

2. **Content Slide** (`<!-- _class: content -->`) - Light mint background (default)
   - Standard slide for most content
   - Supports headings, bullets, code, tables
   - Best for text-heavy information

3. **Dark Slide** (`<!-- _class: dark -->`) - Dark teal background variant
   - Use for emphasis or section transitions
   - Limit to 1-2 per presentation
   - Great for key messages

4. **Two-Column Slide** (`<!-- _class: two-columns -->`)
   - Side-by-side content
   - Perfect for comparisons, before/after, pros/cons
   - Use `## Left Column` and `## Right Column` headers

**Speaker Notes:**
Add speaker notes in HTML comments after slide content:
```markdown
<!--
Speaker Notes:
- Point to make during presentation
- Reminder for timing
- Audience engagement cue
-->
```

**Testing:**
```bash
# Install dependencies if needed
npm install

# Option 1: Use Makefile (recommended)
make build-html      # Build HTML only
make build-pdf       # Build PDF only
make build           # Build both formats

# Option 2: Use npm scripts directly
npm run build        # Build HTML
npm run build:pdf    # Build PDF

# Verify output files
ls -la dist/2025-12-04-cloud-native-manchester.*

# Development workflow
make watch           # Auto-rebuild on file changes
make serve          # Local server at http://localhost:8080
```

### Step 2: Update README

**File:** `README.md`

**Changes:**
Add a "Talks" or "Presentations" section if it doesn't exist. Insert information about the Cloud-Native Manchester talk.

**Location:** After the "Docker Features" section and before "Documentation" section (around line 259)

**Content to Add:**
```markdown
## 📢 Talks and Presentations

This repository contains slide decks for conference and meetup talks.

### Upcoming Talks

#### IvySketch: Design Patterns & AI Workflow - December 4th, 2025
- **Event:** [Cloud-Native Manchester Meetup](https://www.meetup.com/cloud-native-kubernetes-manchester/events/312062865/)
- **Date:** December 4th, 2025
- **Location:** Manchester, UK
- **Speaker:** Lewis Denham-Parry
- **Topic:** Building GenAI Applications with Kubernetes and AI-Assisted Development
- **Project:** [IvySketch](https://ivysketch.me) - AI-powered Axolotl character designer
- **Slides:** [HTML](dist/2025-12-04-cloud-native-manchester.html) | [PDF](dist/2025-12-04-cloud-native-manchester.pdf)

**Talk Outline:**
- Part 1: Introduction to IvySketch (GenAI app with Kubernetes)
- Part 2: Architecture & Design Patterns (Go, NATS, OpenTelemetry)
- Part 3: Kubernetes Deployment (Kustomize, GPU scheduling, NetworkPolicies)
- Part 4: AI-Powered Development Workflow (Documentation-driven, custom commands)
- Part 5: Real-World Examples (326+ tasks completed across 13 phases)
- Part 6: Lessons Learned (Challenges, best practices, pitfalls to avoid)
- Part 7: Q&A

---
```

**Testing:**
- Verify markdown formatting renders correctly
- Check that links work (after slides are built)
- Ensure section fits logically in README flow

### Step 3: Build and Verify

**Commands:**
```bash
# Clean previous builds
make clean
# Or: npm run clean

# Build both HTML and PDF
make build
# Or separately:
# make build-html
# make build-pdf

# Verify output files exist and check sizes
ls -lh dist/2025-12-04-cloud-native-manchester.*
# Expected for this talk (1136 lines):
# - HTML: ~100-200KB (larger due to comprehensive content)
# - PDF: ~1-2MB (7 parts, lots of code examples)

# Optional: Serve locally to preview
make serve
# Or: npm run serve
# Visit http://localhost:8080 in browser
```

**Verification Checklist:**
- [ ] HTML file generated successfully
- [ ] PDF file generated successfully
- [ ] Edera V2 theme applied correctly
- [ ] All 7 parts render properly (Introduction → Conclusion)
- [ ] Page numbers display correctly (paginate: true)
- [ ] Code blocks render with syntax highlighting (Go, TypeScript, YAML, Bash)
- [ ] ASCII diagram renders correctly (Architecture overview)
- [ ] `<!-- _class: lead -->` renders properly (verify compatibility with Edera V2)
- [ ] No build errors or warnings
- [ ] Header/footer display correctly if added
- [ ] All 160 slides build successfully

### Step 4: Test CI/CD Build

**File:** `.github/workflows/build-slides.yml`

**Changes:** None required (workflow already configured)

**Testing:**
After committing the new slide file, the GitHub Actions workflow should automatically:
1. Detect changes in `slides/` directory
2. Run `npm ci` to install dependencies
3. Execute `npm run build` for HTML
4. Execute `npm run build:pdf` for PDF
5. Upload artifacts to GitHub Actions

**Verification:**
```bash
# After pushing to GitHub
# Check workflow status
gh workflow view "Build MARP Slides" --web

# Or check run logs
gh run list --workflow=build-slides.yml --limit 1
```

## Testing Strategy

### Unit Testing

**Local Build Test:**
```bash
# Test HTML build
npm run build
echo "HTML build exit code: $?"

# Test PDF build
npm run build:pdf
echo "PDF build exit code: $?"

# Check file sizes (should be > 0 bytes)
ls -lh dist/2025-12-04-cloud-native-manchester.*
```

**Expected Results:**
- Exit code 0 for both builds
- HTML file size: ~10-50KB (depending on content)
- PDF file size: ~50-500KB (depending on content and images)

### Integration Testing

**Test Case 1: CI/CD Workflow**
1. Create branch: `git checkout -b feat/cloud-native-manchester-talk`
2. Add slide file: `git add slides/2025-12-04-cloud-native-manchester.md`
3. Commit: `git commit -m "feat(slides): add Cloud-Native Manchester talk"`
4. Push: `git push origin feat/cloud-native-manchester-talk`
5. Verify GitHub Actions workflow triggers
6. Check artifacts are uploaded
7. Download artifacts and verify content

**Expected Result:**
- Workflow completes successfully
- Two artifacts available: `slides-html` and `slides-pdf`
- Downloaded files open and display correctly

**Test Case 2: Local Development Workflow**
1. Run `npm run watch` in terminal
2. Edit `slides/2025-12-04-cloud-native-manchester.md`
3. Save changes
4. Verify auto-rebuild occurs
5. Check `dist/` for updated files

**Expected Result:**
- Watch mode detects file changes
- Rebuild completes within seconds
- Output files reflect latest changes

**Test Case 3: README Links**
1. Build slides locally
2. Open `README.md` in browser (via GitHub or local preview)
3. Click HTML link
4. Click PDF link

**Expected Result:**
- HTML link opens slide deck in browser
- PDF link downloads/opens PDF viewer
- Both render correctly with Edera V2 theme

### Regression Testing

**Existing Functionality:**
- [ ] Example presentations still build correctly
- [ ] Theme files unchanged
- [ ] Build configuration still works
- [ ] No broken dependencies

**Commands:**
```bash
# Build all slides
npm run build
npm run build:pdf

# Verify all expected outputs exist
ls -la dist/

# Should see:
# - example-contribution.html and .pdf
# - example-presentation.html and .pdf
# - 2025-12-04-cloud-native-manchester.html and .pdf
```

## Success Criteria

- [x] New slide file created: `slides/2025-12-04-cloud-native-manchester.md`
- [x] Slide deck uses MARP with Edera V2 theme
- [x] HTML build succeeds locally (`npm run build`)
- [x] PDF build succeeds locally (`npm run build:pdf`)
- [x] README updated with talk information
- [x] CI/CD workflow builds slides automatically
- [x] Artifacts available for download from GitHub Actions
- [x] No regression in existing slide builds
- [x] Pre-commit hooks pass
- [x] Changes committed with conventional commit message

## Talk Content Summary

**Source File:** `ivysketch-design-patterns-and-ai-workflow.marp.md` (1136 lines)

### Key Topics Covered

**Part 1: Introduction (slides 1-14)**
- IvyBot overview: AI-powered Axolotl character designer
- Tech stack: Go, React, NATS, Ollama, ComfyUI
- Deployment: Docker Compose (dev) + Kubernetes EKS (prod)
- Live demo: https://ivysketch.me

**Part 2: Architecture & Design Patterns (slides 15-45)**
- Backend middleware chain (Chi router, OpenTelemetry, Prometheus)
- Frontend React component structure with SSE streaming
- LLM integration with Ollama (OpenAI-compatible API)
- NATS JetStream async message queue pattern
- Distributed tracing with OpenTelemetry semantic conventions
- Custom Prometheus metrics for AI workloads

**Part 3: Kubernetes Deployment Patterns (slides 46-73)**
- Kustomize base + overlays structure
- GPU node scheduling (g5.2xlarge instances)
- Sealed Secrets for production secret management
- NetworkPolicies for security (default deny, explicit allow)
- Ingress + TLS with cert-manager
- Persistent storage for Ollama models
- Observability stack (Prometheus, Grafana, Jaeger)

**Part 4: AI-Powered Development Workflow (slides 74-99)**
- Documentation-driven development philosophy
- Task planning structure (docs/prompt_plan.md)
- Custom slash commands: `/workflow-issue-plan`, `/workflow-research-plan`, `/workflow-action-plan`
- Plan document structure and templates
- Real example: Issue #310 (nil pointer dereference fix)

**Part 5: Real-World Examples (slides 100-127)**
- Example 1: NATS integration journey (Issues #115→#117→#120→#131)
- Example 2: ComfyUI image generation (Issues #137→#138→#146→#176)
- Example 3: Image worker service (Issues #229→#233→#254)
- Production architecture: Chat → NATS → Worker → ComfyUI → S3 → Frontend

**Part 6: Lessons Learned (slides 128-154)**
- What worked: Documentation-driven dev, AI-assisted planning, sequential tasks
- Challenge 1: GPU node security (AWS security groups vs K8s NetworkPolicies)
- Challenge 2: Large model images (16.3 GB ComfyUI, 4.7 GB Ollama)
- Challenge 3: Cold start latency (30s → <500ms with model preloading)
- AI development best practices
- Avoiding AI pitfalls (over-engineering, trust without verification)

**Part 7: Conclusion & Q&A (slides 155-160)**
- Key takeaways (4 main points)
- Resources (live demo, GitHub, gallery, documentation)
- Contact information
- Final Q&A slide

### Slide Layout Usage in Talk

**Slide Classes Used:**
- `<!-- _class: lead -->` - Used for part dividers (7 instances)
- Standard content slides - Majority of presentation
- Code blocks - Go, TypeScript, YAML, Bash examples throughout
- ASCII diagrams - Architecture overview (slide 18)
- Tables - Not used in this talk
- Two-column layouts - Not used in this talk

**Note:** The talk uses `<!-- _class: lead -->` which is **not** part of the Edera V2 theme. This needs to be verified during testing or replaced with `<!-- _class: dark -->`.

## Files Modified

1. `ivysketch-design-patterns-and-ai-workflow.marp.md` → `slides/2025-12-04-cloud-native-manchester.md` - Move and rename presentation file
2. `slides/2025-12-04-cloud-native-manchester.md` - Update title slide with event details, add header/footer
3. `README.md` - Add talks section with Cloud-Native Manchester info

## Related Issues and Tasks

### Depends On
- Issue #1: Port Google Slides theme to MARP template ✅ (completed)
- Issue #5: Create reusable slide deck template ✅ (completed)

### Blocks
None

### Related
- Issue #14: Update contributing guidelines with speaker notes (provides attribution guidelines)
- `.github/workflows/build-slides.yml` - CI/CD automation for builds

### Enables
- Future talk submissions following same pattern
- Reusability of established MARP infrastructure
- Demonstration of full workflow from creation to deployment

## References

- [GitHub Issue #21](https://github.com/denhamparry/talks/issues/21)
- [Cloud-Native Manchester Meetup Event](https://www.meetup.com/cloud-native-kubernetes-manchester/events/312062865/)
- [MARP Documentation](https://marpit.marp.app/)
- [Repository MARP Usage Guide](docs/marp-usage.md)
- [Edera V2 Theme Guide](docs/theme-guide.md)

## Technical Details

### MARP Configuration

**File:** `marp.config.js`

The repository uses MARP Core with the following configuration:
- **Input directory:** `./slides`
- **Output directory:** `./dist`
- **Theme directory:** `./themes` (Edera V2 theme)
- **HTML output:** Enabled
- **PDF output:** Configured (A4, landscape, with backgrounds)
- **Markdown features:** Line breaks, typographic replacements

**Build Process:**
1. MARP CLI reads markdown from `slides/`
2. Applies Edera V2 theme from `themes/edera-v2.css`
3. Generates HTML to `dist/*.html`
4. Optionally generates PDF using Puppeteer/Chromium

### Available Commands

**Makefile commands (recommended):**
- `make help` - Display all available commands
- `make build` - Build HTML + PDF
- `make build-html` - HTML only
- `make build-pdf` - PDF only
- `make watch` - Auto-rebuild on changes
- `make serve` - Dev server with live reload
- `make clean` - Remove dist/ artifacts
- `make install` - Install dependencies
- `make ci` - CI workflow (install + build)

**npm scripts (alternative):**
- `npm run build` - Build HTML
- `npm run build:pdf` - Build PDF
- `npm run watch` - Watch mode
- `npm run serve` - Dev server
- `npm run clean` - Clean artifacts

### Docker Support (Optional)

The repository includes Docker support for containerized builds:

**Development:**
```bash
make docker-dev
# Starts dev server at http://localhost:8080
```

**Production:**
```bash
make docker-build      # Build production image
make docker-prod       # Run production server
```

Multi-stage Dockerfile:
- **Builder stage:** Builds slides with node:20-alpine + Chromium
- **Development stage:** Live reload server
- **Production stage:** nginx:alpine serving static HTML

### Edera V2 Theme Colors

From `themes/edera-v2.css`:
- **Dark Teal:** `#013a3b` (backgrounds, body text)
- **Light Mint:** `#d0fdf2` (content slide backgrounds)
- **Cyan Accent:** `#02f4d5` (headings, links, emphasis)
- **High Contrast:** WCAG AA compliant (12:1 ratio)

**Typography:**
- Body text: 24px (readable from distance)
- H1: 60px (title slides)
- H2: 40px (section headings)
- H3: 28px (sub-headings)

## Notes

### Key Insights

1. **Established Infrastructure:** Repository already has complete MARP setup with theme, templates, and CI/CD
2. **Reusable Pattern:** This implementation follows proven patterns from existing example presentations (`example-presentation.md`, `example-contribution.md`)
3. **Automation Ready:** GitHub Actions workflow will automatically build and publish artifacts
4. **Professional Quality:** Edera V2 theme provides consistent, accessible design (WCAG AA compliant)
5. **Comprehensive Documentation:** Full guides available in `docs/` directory
6. **Multiple Build Options:** Makefile, npm scripts, or Docker - flexible workflow
7. **Speaker Notes Support:** HTML comments for presentation notes (not visible in output)

### Alternative Approaches Considered

1. **Use Google Slides** ❌
   - Doesn't align with repository's MARP-based approach
   - Loses version control benefits
   - Not consistent with existing infrastructure

2. **Create from scratch without template** ❌
   - Reinventing the wheel
   - May miss important MARP configuration
   - Template exists specifically for this use case

3. **Use basic-presentation.md template** ✅
   - Recommended approach
   - Proven structure and configuration
   - Includes all necessary MARP directives

### Best Practices

**File Naming:**
- Use ISO date format: `YYYY-MM-DD`
- Include event name in filename
- Use kebab-case for readability
- Example: `2025-12-04-cloud-native-manchester.md`

**Content Structure (from `example-presentation.md`):**
- Start with title slide using `<!-- _class: title -->`
- Include agenda/overview early (slide 2)
- Use content slides for main topics
- Mix slide types for visual variety:
  - Use dark slides for 20-30% of total slides
  - Include code examples with syntax highlighting
  - Add tables for structured data
  - Use two-column layouts for comparisons
- End with title-class thank you/Q&A slide
- Enable pagination: `paginate: true` in frontmatter
- Add header/footer for context (event name, date)

**Code Examples (Supported Languages):**
From `example-presentation.md` and `example-contribution.md`:
```markdown
```javascript
function createPresentation() {
  const slides = loadMarkdown('slides.md');
  const theme = applyTheme('edera-v2');
  return render(slides, theme);
}
\```

```python
def generate_slides(markdown_file):
    """Convert markdown to presentation"""
    with open(markdown_file, 'r') as f:
        content = f.read()
    return marp.build(content, theme='edera-v2')
\```

```go
func main() {
    slides := LoadMarkdown("presentation.md")
    theme := NewTheme("edera-v2")
    BuildPresentation(slides, theme)
}
\```

```bash
# Watch mode (auto-rebuild)
npm run watch
# or
make watch
\```
```

**Tables Example:**
```markdown
| Feature | Benefit | Status |
|---------|---------|--------|
| Easy Markdown | Simple syntax | ✅ |
| Version Control | Git-based workflow | ✅ |
| Custom Themes | Brand consistency | ✅ |
```

**Two-Column Comparison:**
```markdown
<!-- _class: two-columns -->

# Comparison Example

## Traditional Slides

- PowerPoint or Google Slides
- Binary file formats
- No version control
- Manual collaboration

## MARP with Edera V2

- Markdown-based
- Plain text files
- Git versioning
- Pull request workflow
```

**Speaker Notes Best Practice:**
From `example-presentation.md`, add detailed notes for each major slide:
```markdown
<!--
Speaker Notes:
- Welcome everyone to this demo
- Introduce yourself and set expectations
- Estimated time: 15-20 minutes
- Encourage questions at any point
- Highlight key points to emphasize
- Timing reminders
-->
```

**Development Workflow:**
1. Copy template: `cp templates/basic-presentation.md slides/2025-12-04-cloud-native-manchester.md`
2. Edit content locally using your preferred editor
3. Use `make watch` or `npm run watch` for live preview
4. View at http://localhost:8080 while editing
5. Build both formats before committing: `make build`
6. Test locally: check both HTML and PDF output
7. Review with `make serve` before pushing

**Commit Message:**
```bash
feat(slides): add Cloud-Native Manchester talk

- Create slide deck for December 4th, 2025 meetup
- Update README with talk information
- Include event link and presentation details

Closes #21
```

**Monitoring:**
- Check GitHub Actions workflow status after push
- Download artifacts to verify output quality
- Test links in README after merge to main
