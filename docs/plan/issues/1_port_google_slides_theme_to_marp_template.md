# GitHub Issue #1: Port Google Slides theme to MARP template

**Issue:** [#1](https://github.com/denhamparry/talks/issues/1)
**Status:** Complete
**Labels:** documentation, enhancement, template
**Date:** 2025-12-03

## Problem Statement

Create a MARP slide deck template that replicates the design and theme from an existing Google Slides template. This will enable consistent, version-controlled presentations using Markdown while maintaining the visual style of current presentation materials.

### Current Behavior

- Presentations are created using Google Slides
- Version control is limited or non-existent for slide content
- Design consistency depends on manually copying styles
- Markdown-based presentation workflow is not available

### Expected Behavior

- MARP templates that visually match the Google Slides design
- Markdown-based slide creation with familiar brand styling
- Version-controlled presentation source files
- Reusable templates that are easy to customize

## Current State Analysis

### Relevant Code/Config

- **Project Structure:** This is a GitHub template repository focused on Claude Code project setup
- **No MARP Configuration:** No existing MARP setup, CSS themes, or presentation files found
- **No Package.json:** No Node.js dependencies or MARP CLI tooling configured
- **Documentation Structure:** `docs/` directory exists with plan.md, progress.md, and setup.md
- **Theme Resources Available:** ✅ SVG exports of Google Slides template located at `docs/theme-resources/slides-export/edera/v2/svg/`
  - 26 SVG files (slide001.svg through slide026.svg)
  - Contains complete design information (colors, fonts, layouts, spacing)
  - Edera V2 theme ready for analysis and MARP conversion

### Related Context

- Repository is currently a template for Claude Code projects
- No presentation-specific tooling or dependencies are currently installed
- Need to establish MARP infrastructure from scratch
- **Source Material:** Edera V2 Google Slides template exported as SVG files
- **Theme Name:** Will be named "Edera V2" to support multiple themes in the future
- **Design Source:** All design elements can be extracted from SVG files (no manual screenshots needed)

## Solution Design

### Approach

Implement a complete MARP presentation system with the "Edera V2" custom theme that matches the Google Slides design. This involves:

1. **Setup MARP tooling** - Install MARP CLI and configure build process
2. **Extract design elements** - Analyze SVG files to document colors, fonts, spacing from Edera V2 theme
3. **Create custom CSS theme** - Build MARP theme CSS named "edera-v2" that replicates the visual style
4. **Build template files** - Create reusable MARP templates for common slide layouts using Edera V2 theme
5. **Document usage** - Provide clear instructions for using and customizing templates

**Theme Naming Strategy:**

- Primary theme: `edera-v2` (based on Edera V2 Google Slides template)
- Future themes can be added: `edera-v3`, `custom-theme`, etc.
- Theme files organized in `themes/` directory for easy management

### Implementation

#### 1. MARP Tooling Setup

**Files to create:**

- `package.json` - Node.js dependencies for MARP CLI
- `marp.config.js` - MARP configuration file
- `.github/workflows/build-slides.yml` - CI/CD for building PDFs

**Dependencies needed:**

```json
{
  "@marp-team/marp-cli": "^3.x",
  "@marp-team/marp-core": "^3.x"
}
```

#### 2. Theme CSS Architecture

**File:** `themes/edera-v2.css`

MARP themes use CSS with special directives:

```css
/* @theme edera-v2 */
/* @import default */

section {
  /* Base styling extracted from Edera V2 SVG files */
  background-color: #ffffff;
  color: #333333;
  font-family: 'Arial', sans-serif;
}

section.title {
  /* Title slide layout from slide001.svg */
}

section.content {
  /* Content slide layout from slide002.svg */
}
```

**Theme Source Files:**

- SVG files in `docs/theme-resources/slides-export/edera/v2/svg/`
- 26 slides containing various layouts and design patterns
- Design elements will be extracted and documented in `docs/theme-analysis.md`

#### 3. Template Structure

**Files to create:**

- `templates/basic-presentation.md` - Starter template
- `templates/layouts/title-slide.md` - Title slide example
- `templates/layouts/content-slide.md` - Content slide example
- `templates/layouts/two-column.md` - Two-column layout
- `templates/layouts/image-slide.md` - Image-focused layout

#### 4. Documentation

**Files to create:**

- `docs/marp-usage.md` - How to use MARP templates
- `docs/theme-guide.md` - Theme customization guide
- `README.md` updates - Add MARP build instructions

### Benefits

- Version-controlled presentations (Git-based workflow)
- Markdown simplicity with professional design
- Easy collaboration and review process
- Automated PDF generation via CI/CD
- Consistent branding across all presentations
- Template reusability for future talks

## Implementation Plan

### Step 1: Create MARP Project Structure

**Files:** `package.json`, `.gitignore` updates

**Changes:**

- Initialize Node.js project with MARP dependencies
- Add MARP CLI and core packages
- Configure npm scripts for building presentations
- Update `.gitignore` to exclude `node_modules/` and build artifacts

**Commands:**

```bash
npm init -y
npm install --save-dev @marp-team/marp-cli @marp-team/marp-core
```

**package.json scripts:**

```json
{
  "scripts": {
    "build": "marp slides/ -o dist/",
    "build:pdf": "marp slides/ --pdf -o dist/",
    "watch": "marp -w slides/ -o dist/",
    "serve": "marp -s slides/"
  }
}
```

**Testing:**

```bash
npm run build
```

### Step 2: Analyze Edera V2 Theme from SVG Files

**File:** `docs/theme-analysis.md`

**Changes:**

- Create documentation file for Edera V2 theme analysis
- Parse SVG files to extract design elements
- Document color palette (primary, secondary, accent, backgrounds) from fill/stroke attributes
- List font families and sizes from text elements
- Analyze layout patterns from 26 slide SVGs
- Note spacing, margins, and alignment conventions from SVG coordinates
- Identify reusable layout types across the 26 slides

**SVG Analysis Process:**

- Read SVG files from `docs/theme-resources/slides-export/edera/v2/svg/`
- Extract color values from `fill=""` and `stroke=""` attributes
- Extract font properties from `<text>` elements
- Measure spacing from `x=""`, `y=""`, `width=""`, `height=""` attributes
- Document patterns found across multiple slides

**Structure:**

```markdown
# Edera V2 Theme Analysis

## Source Files
- Location: `docs/theme-resources/slides-export/edera/v2/svg/`
- Format: SVG (Scalable Vector Graphics)
- Slides: 26 total (slide001.svg through slide026.svg)

## Color Palette
- Primary: #XXXXXX (extracted from SVG fill attributes)
- Secondary: #XXXXXX
- Accent: #XXXXXX
- Background: #XXXXXX
- Text: #XXXXXX

## Typography
- Headings: Font family, sizes (from SVG text elements)
- Body text: Font family, sizes
- Code blocks: Font family (if present)

## Layouts
- Title slide pattern (slide001.svg)
- Content slide pattern (slide002.svg, etc.)
- Two-column layout (if found in slides)
- Image-focused slides (if found in slides)
- Special layouts (to be identified)

## Spacing & Dimensions
- Margins (from SVG coordinates)
- Padding (from element positioning)
- Line height (from text element spacing)
```

**Testing:**

- Compare SVG analysis with visual inspection of slides
- Verify extracted colors match the original theme
- User reviews and confirms theme analysis is accurate

### Step 3: Create Edera V2 MARP Theme CSS

**File:** `themes/edera-v2.css`

**Changes:**

- Create custom MARP theme CSS file
- Implement base section styling (colors, fonts, backgrounds)
- Define title slide class with specific layout
- Define content slide class with appropriate spacing
- Add heading styles (h1, h2, h3) matching Google Slides
- Style lists, code blocks, and tables
- Implement footer and header styling

**Example structure:**

```css
/* @theme edera-v2 */

@import 'default';

:root {
  --primary-color: #XXXXXX;    /* Extracted from SVG analysis */
  --secondary-color: #XXXXXX;
  --accent-color: #XXXXXX;
  --background-color: #XXXXXX;
  --text-color: #XXXXXX;
}

section {
  background: var(--background-color);
  color: var(--text-color);
  font-family: 'Font Name', sans-serif;  /* From SVG text elements */
  padding: 60px;
}

section.title {
  /* Layout based on slide001.svg analysis */
  text-align: center;
  justify-content: center;
}

h1 {
  color: var(--primary-color);
  font-size: 3em;  /* Size from SVG font-size attributes */
}

/* Additional styling based on 26 SVG slides... */
```

**Testing:**

- Create test slide deck using the edera-v2 theme
- Compare rendered output with original SVG files
- Adjust CSS until visual match is achieved
- Test with different slide layouts found in the 26 SVGs

### Step 4: Create MARP Configuration

**File:** `marp.config.js`

**Changes:**

- Create MARP configuration file
- Specify custom theme path
- Configure PDF export options
- Set HTML export options
- Define input/output directories

**Content:**

```javascript
module.exports = {
  inputDir: './slides',
  output: './dist',
  themeSet: './themes',
  html: true,
  pdf: true,
  pdfOptions: {
    format: 'A4',
    landscape: true,
  },
  engine: '@marp-team/marp-core',
};
```

**Testing:**

```bash
marp --config-file marp.config.js
```

### Step 5: Build Template Slide Decks

**Files:**

- `templates/basic-presentation.md`
- `templates/layouts/title-slide.md`
- `templates/layouts/content-slide.md`
- `templates/layouts/two-column.md`
- `templates/layouts/image-slide.md`

**Changes:**

- Create basic presentation template with frontmatter
- Implement title slide example with theme class
- Create content slide with bullet points and code example
- Build two-column layout using MARP's `_class: cols-2` directive
- Create image-focused slide template

**Basic presentation structure:**

```markdown
---
marp: true
theme: edera-v2
paginate: true
---

<!-- _class: title -->

# Presentation Title
## Subtitle
Your Name | Date

---

<!-- _class: content -->

# Slide Title

- Bullet point 1
- Bullet point 2
- Bullet point 3

---

<!-- _class: content -->

# Code Example

\`\`\`javascript
function example() {
  console.log("Hello MARP!");
}
\`\`\`
```

**Testing:**

- Build each template individually
- Verify layouts match Google Slides patterns
- Test PDF export quality

### Step 6: Create GitHub Actions Workflow

**File:** `.github/workflows/build-slides.yml`

**Changes:**

- Create CI/CD workflow for building presentations
- Configure workflow to trigger on push to slides or themes
- Install Node.js and dependencies
- Run MARP build for HTML and PDF
- Upload artifacts for download
- Optional: Deploy HTML to GitHub Pages

**Workflow structure:**

```yaml
name: Build MARP Slides

on:
  push:
    paths:
      - 'slides/**'
      - 'themes/**'
      - 'templates/**'
  pull_request:
    paths:
      - 'slides/**'
      - 'themes/**'
      - 'templates/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build slides
        run: npm run build:pdf

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: slides
          path: dist/
```

**Testing:**

- Push changes and verify workflow runs
- Check artifact downloads
- Verify PDF quality

### Step 7: Create Documentation

**Files:**

- `docs/marp-usage.md`
- `docs/theme-guide.md`
- Update `README.md`

**Changes:**

**docs/marp-usage.md:**

```markdown
# MARP Usage Guide

## Quick Start
1. Copy `templates/basic-presentation.md` to `slides/your-talk.md`
2. Edit content using Markdown
3. Build: `npm run build`
4. Output: `dist/your-talk.html` and `dist/your-talk.pdf`

## Available Layouts
- Title slides: `<!-- _class: title -->`
- Content slides: `<!-- _class: content -->`
- Two-column: `<!-- _class: cols-2 -->`
- Image slides: `<!-- _class: image -->`

## MARP Directives
- `---` - New slide separator
- `marp: true` - Enable MARP
- `theme: custom` - Use custom theme
- `paginate: true` - Show page numbers

## Building
- Development: `npm run serve`
- Watch mode: `npm run watch`
- Production: `npm run build:pdf`
```

**docs/theme-guide.md:**

```markdown
# Theme Customization Guide

## Edera V2 Theme
The default theme is `edera-v2`, based on the Edera V2 Google Slides template.

## Color Scheme
Colors are defined in `themes/edera-v2.css` as CSS variables:
- `--primary-color` - Main brand color (from Edera V2 theme)
- `--secondary-color` - Secondary elements
- `--accent-color` - Highlights and emphasis

## Modifying Fonts
Edit the `font-family` in section styling in `themes/edera-v2.css`...

## Creating New Themes
1. Copy `themes/edera-v2.css` to `themes/your-theme-name.css`
2. Change `/* @theme edera-v2 */` to `/* @theme your-theme-name */`
3. Customize colors, fonts, and layouts
4. Use in slides with `theme: your-theme-name`

## Creating New Layouts
1. Define CSS class in theme file
2. Apply with `<!-- _class: your-class -->`
```

**README.md updates:**

- Add "Building Presentations" section
- Document npm scripts
- Link to MARP documentation

**Testing:**

- Follow documentation to create a test presentation
- Verify all commands work as documented
- Check for clarity and completeness

### Step 8: Create Example Presentation

**File:** `slides/example-presentation.md`

**Changes:**

- Create full example presentation using all layouts
- Demonstrate title slide
- Show content slides with various elements (lists, code, images)
- Include two-column layout example
- Add image-focused slide
- Demonstrate all theme features

**Content includes:**

- Title slide with conference/talk info
- About/bio slide
- Technical content with code examples
- Diagrams or images
- Conclusion/thank you slide

**Testing:**

- Build example: `npm run build:pdf`
- Review PDF output for quality
- Compare with Google Slides version
- Share with stakeholders for feedback

### Step 9: Update Project Documentation

**Files:**

- `CLAUDE.md`
- `CONTRIBUTING.md` (if applicable)

**Changes:**

**CLAUDE.md updates:**

```markdown
## Presentation Workflow

### Quick Commands
- Build slides: `npm run build`
- Build PDFs: `npm run build:pdf`
- Watch mode: `npm run watch`
- Serve locally: `npm run serve`

### Creating New Presentations
1. Copy template: `cp templates/basic-presentation.md slides/my-talk.md`
2. Edit content in Markdown
3. Build: `npm run build:pdf`
4. Output in `dist/my-talk.pdf`

### Theme Customization
- Theme CSS: `themes/custom-theme.css`
- Modify colors, fonts, layouts
- Rebuild to see changes

### Common Patterns
- Use `<!-- _class: title -->` for title slides
- Use `<!-- _class: content -->` for content slides
- Separate slides with `---`
- Enable pagination with `paginate: true` in frontmatter
```

**Testing:**

- Verify documentation is clear and complete
- Test commands listed in documentation

### Step 10: Add .gitignore Entries

**File:** `.gitignore`

**Changes:**

- Add `node_modules/` to ignore Node dependencies
- Add `dist/` to ignore build outputs (or commit them based on preference)
- Add `.marp/` if MARP creates cache directories
- Add OS-specific files (`.DS_Store`, `Thumbs.db`)

**Content to add:**

```gitignore
# Node.js
node_modules/
npm-debug.log*

# MARP build outputs
dist/
*.pdf
*.html

# MARP cache
.marp/

# OS files
.DS_Store
Thumbs.db
```

**Testing:**

- Run `git status` to verify ignored files don't appear

## Testing Strategy

### Unit Testing

Not applicable for this implementation (CSS and Markdown templates)

### Integration Testing

**Test Case 1: Build Process**

1. Run `npm install` to install dependencies
2. Run `npm run build` to build slides
3. Verify HTML output in `dist/`
4. Run `npm run build:pdf` to generate PDFs
5. Verify PDF output in `dist/`
6. Check PDF renders correctly with theme applied

**Expected Result:** All builds complete successfully, outputs match theme design

**Test Case 2: Theme Application**

1. Create test slide deck with all layout types
2. Apply custom theme via frontmatter
3. Build slides
4. Compare output with Google Slides screenshots
5. Verify colors, fonts, spacing match

**Expected Result:** Visual parity between MARP output and Google Slides design

**Test Case 3: Template Usability**

1. Copy `templates/basic-presentation.md` to `slides/test.md`
2. Customize content (title, bullets, code)
3. Build: `npm run build:pdf`
4. Open PDF and review
5. Verify ease of customization

**Expected Result:** Template is intuitive and produces professional output

**Test Case 4: CI/CD Pipeline**

1. Commit changes to slides or theme
2. Push to GitHub
3. Verify GitHub Actions workflow triggers
4. Check workflow completes successfully
5. Download artifacts and verify PDF quality

**Expected Result:** Automated builds work correctly, PDFs are downloadable

### Regression Testing

- After theme CSS changes, rebuild all example slides and verify no breaking changes
- Test with different content types (long text, large images, many code blocks)
- Verify PDF export quality across different slide types
- Test on different operating systems (macOS, Linux, Windows)

### Edge Cases

- **Very long content:** Test slides with excessive text to verify overflow handling
- **Large images:** Test with high-resolution images to check scaling
- **Complex code blocks:** Test syntax highlighting with various languages
- **Special characters:** Test with emoji, Unicode, special symbols
- **Empty slides:** Verify theme handles minimal content gracefully

## Success Criteria

- [x] MARP CLI installed and configured
- [x] Custom theme CSS created matching Google Slides design
- [x] Color palette documented and implemented
- [x] Typography matches original design
- [x] Template files created for common layouts:
  - [x] Title slide
  - [x] Content slide
  - [x] Two-column layout
  - [x] Image-focused slide
- [x] `package.json` with build scripts configured
- [x] `marp.config.js` configuration file created
- [x] GitHub Actions workflow for automated builds
- [x] Documentation completed:
  - [x] `docs/marp-usage.md`
  - [x] `docs/theme-guide.md`
  - [x] `docs/theme-analysis.md`
  - [x] README.md updated
  - [x] CLAUDE.md updated
- [x] Example presentation created and builds successfully
- [x] PDF export works with correct styling
- [x] HTML export works with correct styling
- [x] Templates are reusable and customizable
- [x] Visual parity with Google Slides design confirmed
- [x] `.gitignore` updated for MARP artifacts

## Files Modified/Created

1. `package.json` - Node.js project configuration with MARP dependencies
2. `marp.config.js` - MARP build configuration
3. `themes/edera-v2.css` - Edera V2 CSS theme matching Google Slides template
4. `templates/basic-presentation.md` - Basic presentation template using edera-v2 theme
5. `templates/layouts/title-slide.md` - Title slide example (based on slide001.svg)
6. `templates/layouts/content-slide.md` - Content slide example (based on slide002.svg)
7. `templates/layouts/two-column.md` - Two-column layout example (if found in SVGs)
8. `templates/layouts/image-slide.md` - Image-focused slide example (if found in SVGs)
9. `slides/example-presentation.md` - Full example presentation using edera-v2 theme
10. `.github/workflows/build-slides.yml` - CI/CD workflow for building slides
11. `docs/marp-usage.md` - Usage documentation
12. `docs/theme-guide.md` - Theme customization guide (mentions edera-v2 and future themes)
13. `docs/theme-analysis.md` - Edera V2 theme analysis from SVG files
14. `README.md` - Updated with MARP instructions
15. `CLAUDE.md` - Updated with presentation workflow
16. `.gitignore` - Updated to exclude MARP artifacts
17. `docs/theme-resources/` - Theme source files (SVG exports) - Already created ✅

## Related Issues and Tasks

### Depends On

- ✅ Access to Google Slides template for design analysis (SVG files available)
- ✅ SVG exports of Edera V2 theme (26 slides in `docs/theme-resources/slides-export/edera/v2/svg/`)

### Blocks

- Creating actual presentation content for talks
- Setting up GitHub Pages deployment (optional enhancement)

### Related

- Issue #1 (this issue) - Port Google Slides theme to MARP template

### Enables

- Version-controlled presentation workflow
- Markdown-based slide creation
- Automated PDF generation in CI/CD
- Consistent branding across presentations
- Future talk/presentation projects

## References

- [GitHub Issue #1](https://github.com/denhamparry/talks/issues/1)
- [MARP Official Documentation](https://marp.app/)
- [MARP CLI GitHub](https://github.com/marp-team/marp-cli)
- [MARP Themes Guide](https://marpit.marp.app/theme-css)
- [MARP Directives Reference](https://marpit.marp.app/directives)

## Notes

### Key Insights

- MARP uses Marpit framework for theme CSS with special directives (`/* @theme */`)
- Themes can extend default theme using `@import default`
- Slide classes are applied via HTML comments: `<!-- _class: title -->`
- PDF generation requires Chromium (handled by MARP CLI automatically)
- GitHub Actions can automate builds and create downloadable artifacts
- **SVG exports provide perfect accuracy** for theme extraction (colors, fonts, spacing)
- **Theme naming convention**: Use descriptive names (edera-v2) to support multiple themes
- **26 SVG slides** provide comprehensive view of all layout types and design patterns

### Design Decisions

**Why MARP over alternatives (Reveal.js, Slidev)?**

- **Chosen: MARP** ✅
  - Simpler Markdown syntax
  - Excellent PDF export out of the box
  - Lightweight and fast
  - CSS-based theming is straightforward
  - Good CLI tooling for automation

- **Alternative: Reveal.js** ❌
  - More complex HTML/JavaScript setup
  - Heavier dependency footprint
  - Better for interactive presentations (not the requirement)

- **Alternative: Slidev** ❌
  - Vue.js dependency adds complexity
  - More suited for developer-focused talks with live coding
  - Steeper learning curve

**Theme Analysis Approach:**

1. ✅ User provided SVG exports of Edera V2 Google Slides template (26 slides)
2. Parse SVG XML to extract color values from `fill` and `stroke` attributes
3. Extract font properties from `<text>` elements (family, size, weight)
4. Measure spacing/positioning from SVG coordinates (`x`, `y`, `width`, `height`)
5. Identify layout patterns by analyzing multiple slides
6. Document all findings in `docs/theme-analysis.md`
7. Implement CSS incrementally as `themes/edera-v2.css`, testing visual match after each element
8. Compare MARP output with original SVG files for accuracy

### Best Practices

- **Version control themes:** Track CSS changes in Git for easy rollback
- **Use CSS variables:** Define colors/fonts as variables for easy customization
- **Test PDF output early:** PDF rendering can differ from HTML preview
- **Modular templates:** Keep layout examples separate for easy copying
- **Document theme conventions:** Make it easy for others to maintain and extend
- **Automate builds:** CI/CD ensures presentations always build correctly
- **Example-driven documentation:** Provide working examples for each feature

### Monitoring and Maintenance

- Review PDF output quality after MARP CLI updates
- Check for breaking changes in MARP core releases
- Update documentation when adding new layouts or features
- Maintain theme analysis document if Google Slides design changes
- Monitor GitHub Actions workflow for build failures

### Future Enhancements (Out of Scope)

- GitHub Pages deployment for HTML versions
- Speaker notes support
- Live reload during development
- Custom MARP plugins for advanced features
- Multiple theme variants (light/dark mode)
- Interactive elements for web version
- Video embedding support
- Chart/diagram generation integration
