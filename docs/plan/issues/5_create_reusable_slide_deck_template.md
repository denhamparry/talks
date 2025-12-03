# GitHub Issue #5: Create reusable slide deck template

**Issue:** [#5](https://github.com/denhamparry/talks/issues/5)
**Status:** Open
**Date:** 2025-12-03
**Labels:** documentation, enhancement, template, marp

## Problem Statement

External contributors and other projects need a simple way to submit slide deck content to this repository without requiring knowledge of MARP or the presentation system infrastructure. Currently, contributors would need to understand MARP syntax, theme directives, and layout classes to create compatible content.

### Current Behavior

- Existing templates (`templates/basic-presentation.md`, layout examples) assume MARP knowledge
- Documentation (`docs/marp-usage.md`) is comprehensive but technical
- No clear "content creation only" template exists for non-technical contributors
- Submission workflow for external content is not documented

### Expected Behavior

- Content creators can fill in a simple markdown template without MARP knowledge
- Template includes clear instructions and examples
- Generated content can be directly converted to slides using existing infrastructure
- Documented workflow for submitting content from external projects

## Current State Analysis

### Relevant Templates

**Location:** `templates/` directory

**Existing files:**

- `templates/basic-presentation.md` - Full MARP presentation with frontmatter and class directives
- `templates/layouts/title-slide.md` - Individual layout examples
- `templates/layouts/content-slide.md` - Content slide examples
- `templates/layouts/two-column.md` - Two-column layout examples
- `templates/layouts/image-slide.md` - Image slide examples

**Issue:** These templates are designed for users who understand MARP. They include:

- MARP frontmatter directives (`marp: true`, `theme: edera-v2`)
- HTML comments for class selection (`<!-- _class: title -->`)
- Technical references to theme system

### Relevant Documentation

**Files:**

- `docs/marp-usage.md` - Complete MARP guide (685 lines, technical)
- `docs/theme-guide.md` - Theme customization guide (technical)
- `CLAUDE.md` - Project documentation (includes MARP workflow)
- `CONTRIBUTING.md` - General contribution guide (doesn't cover slide submissions)

**Issue:** Documentation assumes technical knowledge and MARP familiarity.

### Build Infrastructure

**Files:**

- `.github/workflows/build-slides.yml` - Automated slide building
- `package.json` - NPM scripts for building slides
- `marp.config.js` - MARP configuration (assumed to exist)

**Current workflow:**

1. Contributors create `.md` file in `slides/` directory
2. CI/CD automatically builds HTML and PDF
3. Artifacts available in GitHub Actions

### Related Context

**Issue #1:** Port Google Slides theme to MARP (completed)

- Created Edera V2 theme with layouts
- Established color scheme and design system

**PR #2:** MARP presentation system feedback

- Addressed viewport/responsive issues
- Refined theme implementation

## Solution Design

### Approach

Create a **contributor-friendly template** that:

1. **Abstracts MARP complexity** - Hides technical directives in instructions
2. **Provides clear structure** - Section-based template with examples
3. **Includes inline guidance** - Help text and examples for each section
4. **Documents submission workflow** - Step-by-step contribution process
5. **Maintains compatibility** - Output works with existing build system

### Implementation

**File:** `templates/contributor-template.md`

This template will:

- Use clear section markers (e.g., "Title Slide", "Content Slide")
- Include placeholder text showing what to write
- Provide examples of different content types (lists, code, tables, images)
- Hide MARP-specific syntax in comments/instructions
- Include comprehensive submission instructions

**Supporting file:** `docs/CONTRIBUTING_SLIDES.md`

Document the slide contribution workflow:

- How to get the template
- How to fill it out
- How to submit content
- What happens after submission
- Examples of good slide content

### Benefits

1. **Lower barrier to entry** - Non-technical contributors can participate
2. **Consistent format** - Template ensures compatible output
3. **Faster content creation** - Contributors focus on content, not syntax
4. **Scalable process** - Other projects can easily submit content
5. **Maintains quality** - Template guides best practices

## Implementation Plan

### Step 1: Create Contributor Template

**File:** `templates/contributor-template.md`

**Changes:**

- Create markdown template with clear section structure
- Include MARP frontmatter (pre-filled, commented)
- Add section markers for each slide type:
  - Title slide
  - Content slides (multiple examples)
  - Two-column slides
  - Image slides
  - Closing slide
- Provide inline instructions and placeholders
- Include examples of all content types (lists, code, tables, images)
- Add comments explaining what each section does

**Testing:**

```bash
# Copy template to slides directory
cp templates/contributor-template.md slides/test-contribution.md

# Edit with sample content
# Build to verify output
npm run build

# Check generated HTML/PDF
open dist/test-contribution.html
```

### Step 2: Create Slide Contribution Guide

**File:** `docs/CONTRIBUTING_SLIDES.md`

**Changes:**

- Document step-by-step submission workflow
- Explain how to access and use the template
- Provide examples of good slide content
- Include best practices (one idea per slide, text limits, image optimization)
- Document submission methods:
  - GitHub PR workflow
  - Issue submission with content
  - External project collaboration
- Add troubleshooting section
- Include links to examples and resources

**Testing:**

```bash
# Read through guide as new contributor
# Verify all links work
# Test workflow end-to-end
```

### Step 3: Update CONTRIBUTING.md

**File:** `CONTRIBUTING.md`

**Changes:**

- Add new section: "Contributing Slide Content"
- Link to `docs/CONTRIBUTING_SLIDES.md`
- Briefly explain slide contribution workflow
- Differentiate from code contributions

**Example addition:**

```markdown
### Contributing Slide Content

Want to contribute presentation content without writing code? See our [Slide Contribution Guide](docs/CONTRIBUTING_SLIDES.md) for details on:

- Using the contributor template
- Submitting slides from external projects
- Best practices for slide content

No MARP knowledge required!
```

**Testing:**

```bash
# Verify links work
# Check formatting
```

### Step 4: Update README.md

**File:** `README.md`

**Changes:**

- Add section about contributing content
- Link to slide contribution guide
- Highlight that MARP knowledge is not required
- Include example workflow

**Testing:**

```bash
# Verify links
# Check rendering
```

### Step 5: Create Example Contribution

**File:** `slides/example-contribution.md`

**Changes:**

- Create example slide deck using contributor template
- Include diverse content (lists, code, images, tables)
- Demonstrate best practices
- Add speaker notes showing thought process

**Purpose:** Reference example for contributors

**Testing:**

```bash
npm run build:pdf
# Verify example renders correctly
```

### Step 6: Add Template to Shareable Location

**Changes:**

- Ensure `templates/contributor-template.md` is in version control
- Add download link in documentation
- Consider creating GitHub release with template
- Update `.github/workflows/build-slides.yml` to build example

**Testing:**

```bash
# Verify template is accessible
# Test download workflow
```

### Step 7: Document External Project Workflow

**File:** `docs/CONTRIBUTING_SLIDES.md` (addition)

**Changes:**

- Add section: "Submitting from External Projects"
- Document workflow for teams using this as a service
- Explain options:
  1. Fork repository, add content, submit PR
  2. Submit content via GitHub issue
  3. Coordinate with maintainers for bulk submissions
- Include collaboration best practices

**Testing:**

```bash
# Walk through each workflow option
# Verify feasibility
```

## Testing Strategy

### Unit Testing

**Not applicable** - This is primarily documentation and templates.

### Integration Testing

**Test Case 1: New Contributor Uses Template**

1. Download `templates/contributor-template.md`
2. Fill in with sample presentation content
3. Follow submission instructions in `docs/CONTRIBUTING_SLIDES.md`
4. Create PR with filled template
5. Verify CI/CD builds slides successfully
6. Check generated HTML and PDF quality

**Expected Result:**

- Template is easy to understand
- Sample content converts correctly
- CI/CD workflow succeeds
- Output matches theme and formatting

**Test Case 2: External Project Submission**

1. Simulate external team creating content
2. Use contributor template
3. Submit via GitHub issue or PR
4. Maintainer processes submission
5. Content builds successfully

**Expected Result:**

- Process is clear and documented
- Content integrates smoothly
- No MARP knowledge required
- Output meets quality standards

**Test Case 3: Template Coverage**

1. Test each slide type in template:
   - Title slide
   - Content slides (text, lists)
   - Code examples
   - Tables
   - Images
   - Two-column layout
   - Closing slide
2. Verify each builds correctly
3. Check for missing layouts or features

**Expected Result:**

- All layout types represented
- Examples are clear and accurate
- No missing features

### Regression Testing

**Test Case 1: Existing Templates Still Work**

1. Verify `templates/basic-presentation.md` still builds
2. Check layout examples in `templates/layouts/`
3. Ensure `slides/example-presentation.md` builds
4. Confirm no breaking changes to existing workflow

**Expected Result:**

- All existing templates unchanged
- No regression in build process
- Documentation remains accurate

**Test Case 2: CI/CD Workflow Unchanged**

1. Verify `.github/workflows/build-slides.yml` still works
2. Test with both old and new templates
3. Ensure artifacts are generated correctly

**Expected Result:**

- CI/CD workflow unchanged
- Both template types build successfully
- Artifacts available as expected

## Success Criteria

- [x] `templates/contributor-template.md` created with clear instructions
- [x] `docs/CONTRIBUTING_SLIDES.md` documents submission workflow
- [x] `CONTRIBUTING.md` updated with link to slide contribution guide
- [x] `README.md` highlights content contribution option
- [x] Example contribution created in `slides/example-contribution.md`
- [x] Template is shareable and accessible
- [x] External project workflow documented
- [x] All templates build successfully with existing CI/CD
- [x] Documentation is clear for non-technical contributors
- [x] Template includes examples of all available layouts

## Files Modified

1. `templates/contributor-template.md` - New contributor-friendly template
2. `docs/CONTRIBUTING_SLIDES.md` - New slide contribution guide
3. `CONTRIBUTING.md` - Add section linking to slide guide
4. `README.md` - Add content contribution section
5. `slides/example-contribution.md` - Example using contributor template

## Related Issues and Tasks

### Depends On

- Issue #1 (Port Google Slides theme to MARP) - ✅ Completed
- PR #2 (MARP presentation system feedback) - ✅ Completed

### Blocks

- None

### Related

- Documentation improvements for MARP usage
- Future: Consider web form for content submission
- Future: Template variations for different talk lengths

### Enables

- External contributor participation
- Other projects to leverage this presentation system
- Faster content creation workflow
- Scalable slide deck production

## References

- [GitHub Issue #5](https://github.com/denhamparry/talks/issues/5)
- Existing templates: `templates/basic-presentation.md`
- MARP documentation: `docs/marp-usage.md`
- Theme guide: `docs/theme-guide.md`
- Contributing guide: `CONTRIBUTING.md`
- [MARP Official Documentation](https://marp.app/)

## Notes

### Key Insights

1. **Two audiences:** Technical contributors (use MARP directly) vs. content contributors (use simplified template)
2. **Template vs. tutorial:** Template should be usable without reading extensive documentation
3. **Inline help:** Instructions within the template are more effective than external docs
4. **Example-driven:** Show, don't just tell - examples for every content type
5. **Scalability:** Design for external projects, not just individual contributors

### Alternative Approaches Considered

1. **Web form for submissions** ❌
   - More complex to build and maintain
   - Requires additional infrastructure
   - Template-based approach is simpler

2. **Separate simplified MARP syntax** ❌
   - Would require custom parser/converter
   - Adds complexity and maintenance burden
   - Standard markdown with template is sufficient

3. **Google Docs to MARP converter** ❌
   - Complex conversion logic
   - Formatting inconsistencies
   - Template approach is more reliable

4. **Markdown template (chosen approach)** ✅
   - Familiar format (markdown)
   - Works with existing build system
   - Easy to version control and share
   - Clear structure with examples
   - No additional tooling required

### Best Practices

**For template design:**

- Use clear section headings
- Include placeholder text showing format
- Provide multiple examples of each content type
- Add helpful comments explaining purpose
- Keep instructions concise and actionable

**For documentation:**

- Step-by-step workflow instructions
- Visual examples where helpful
- Link to existing resources
- Include troubleshooting section
- Provide contact info for questions

**For contribution workflow:**

- Make process as simple as possible
- Multiple submission methods (PR, issue, collaboration)
- Clear acceptance criteria
- Fast feedback loop
- Recognition for contributors

### Testing Notes

**Manual testing required:**

- Have non-technical person try the template
- Verify instructions are clear
- Test submission workflow end-to-end
- Check all examples build correctly
- Validate documentation completeness

**Automated testing:**

- CI/CD should build example contribution
- Add test for contributor-template.md build
- Verify all links in documentation

### Future Enhancements

1. **Template variations:**
   - 5-minute lightning talk template
   - 30-minute talk template
   - Workshop/tutorial template
   - Conference keynote template

2. **Submission automation:**
   - GitHub action to validate submitted content
   - Auto-generate preview links
   - Notify maintainers of new submissions

3. **Content library:**
   - Catalog of reusable slide snippets
   - Common patterns (intro, demo, Q&A)
   - Stock images and assets

4. **Collaboration features:**
   - Template for multi-speaker presentations
   - Section attribution
   - Version tracking for iterative development
