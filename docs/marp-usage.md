# MARP Usage Guide

Complete guide to using MARP for creating presentations with the Edera V2 theme.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a New Presentation

Copy the basic template:

```bash
cp templates/basic-presentation.md slides/my-talk.md
```

### 3. Edit Your Content

Edit `slides/my-talk.md` using Markdown syntax:

```markdown
---
marp: true
theme: edera-v2
paginate: true
---

<!-- _class: title -->

# My Talk Title

Your Name | Conference | Date
```

### 4. Build Your Slides

Generate HTML and PDF output:

```bash
# Build HTML
npm run build

# Build PDF
npm run build:pdf

# Watch mode (auto-rebuild on save)
npm run watch

# Serve locally with live reload
npm run serve
```

### 5. View Your Presentation

Open `dist/my-talk.html` in your browser or `dist/my-talk.pdf` in a PDF viewer.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build all slides to HTML in `dist/` |
| `npm run build:pdf` | Build all slides to PDF in `dist/` |
| `npm run watch` | Watch for changes and auto-rebuild |
| `npm run serve` | Start local server with live reload |

## MARP Directives

Directives control slide behavior and appearance. Add them to the frontmatter or inline.

### Frontmatter Directives

At the top of your markdown file:

```markdown
---
marp: true                # Enable MARP
theme: edera-v2           # Use Edera V2 theme
paginate: true            # Show page numbers
header: 'My Talk'         # Header text on all slides
footer: 'Copyright 2025'  # Footer text on all slides
---
```

### Inline Directives

Apply to specific slides using HTML comments:

```markdown
<!-- _class: title -->
# This is a title slide

---

<!-- _class: content -->
# This is a content slide
```

## Available Layouts

The Edera V2 theme includes several pre-built slide layouts:

### 1. Title Slide

```markdown
<!-- _class: title -->

# Main Title

## Subtitle

Speaker Name | Date | Location
```

**Features:**

- Dark teal background
- Centered content
- Large, prominent title
- Perfect for opening and closing slides

### 2. Content Slide (Default)

```markdown
<!-- _class: content -->

# Slide Title

- Bullet point one
- Bullet point two
- Bullet point three
```

**Features:**

- Light mint background
- Standard layout for most content
- Good readability

### 3. Dark Slide

```markdown
<!-- _class: dark -->

# Dark Background

Content with light text on dark background.
```

**Features:**

- Dark teal background
- Light text
- Great for emphasis or variety

### 4. Two-Column Layout

```markdown
<!-- _class: two-columns -->

# Two Columns

## Left Column

- Item 1
- Item 2

## Right Column

- Item A
- Item B
```

**Features:**

- Side-by-side content
- Perfect for comparisons
- Flexible column content

### 5. Image Slide

```markdown
<!-- _class: image -->

![Full-screen image](path/to/image.jpg)
```

**Features:**

- Full-screen image display
- No padding
- Great for visual impact

### 6. Image with Overlay

```markdown
<!-- _class: image-overlay -->

![Background](path/to/image.jpg)

# Text Over Image

Content appears over the image with dark overlay.
```

**Features:**

- Background image
- Semi-transparent overlay
- Text remains readable

## Markdown Syntax

### Headings

```markdown
# H1 - Main Title (56px)
## H2 - Section Heading (40px)
### H3 - Sub-heading (28px)
```

### Text Formatting

```markdown
**Bold text** - Highlights in cyan accent color
*Italic text* - Standard italic
***Bold italic***

[Link text](https://example.com) - Cyan underline
```

### Lists

```markdown
- Unordered list item (cyan bullets)
- Another item
  - Nested item

1. Ordered list item (cyan numbers)
2. Another item
   1. Nested item
```

### Code Blocks

Inline code:

```markdown
Use `inline code` for short snippets.
```

Code blocks with syntax highlighting:

````markdown
```javascript
function example() {
  console.log("Hello MARP!");
}
```
````

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Blockquotes

```markdown
> Important quote or callout
> — Author Name
```

### Images

```markdown
![Alt text](path/to/image.jpg)

<!-- With caption -->
![Alt text](image.jpg)
*Image caption here*
```

## Utility Classes

Add CSS classes to customize individual elements:

```markdown
<!-- Center text -->
<div class="text-center">

Centered content

</div>

<!-- Highlight text -->
<span class="highlight">Important text</span>

<!-- Adjust spacing -->
<div class="mt-4 mb-4">

Content with extra spacing

</div>
```

Available utility classes:

- `.text-center` - Center align text
- `.text-right` - Right align text
- `.text-small` - Smaller text
- `.text-large` - Larger text
- `.highlight` - Highlight background
- `.mt-{0-4}` - Margin top
- `.mb-{0-4}` - Margin bottom

## Tips & Best Practices

### Content Guidelines

1. **One idea per slide** - Keep slides focused
2. **Use visuals** - Images enhance understanding
3. **Limit text** - Aim for 5-7 bullet points max
4. **Consistent style** - Stick to theme layouts
5. **Practice timing** - ~2 minutes per slide

### Performance Tips

1. **Optimize images** - Compress before adding
2. **Use local files** - Faster than remote URLs
3. **Test PDF export** - May differ from HTML
4. **Version control** - Commit slides to Git

### Accessibility

1. **High contrast** - Theme provides good contrast
2. **Alt text** - Add descriptions to images
3. **Font size** - Keep text large and readable
4. **Color meaning** - Don't rely solely on color

## Troubleshooting

### Build Failures

**Problem:** `marp: command not found`

**Solution:**

```bash
# Install dependencies first
npm install

# Or install MARP CLI globally
npm install -g @marp-team/marp-cli
```

**Problem:** Build fails with dependency errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Build fails with "Cannot find theme"

**Solution:**

- Verify `themes/` directory exists
- Check `marp.config.js` has correct `themeSet` path
- Ensure theme file is named correctly (e.g., `edera-v2.css`)

**Problem:** Build succeeds but output directory is empty

**Solution:**

- Check `marp.config.js` output path is correct
- Ensure slides directory (`slides/`) contains `.md` files
- Verify file permissions on output directory

### Theme Not Applied

Check frontmatter:

```markdown
---
marp: true
theme: edera-v2  # Must match theme filename
---
```

**Additional checks:**

1. Verify theme file location: `themes/edera-v2.css`
2. Check `marp.config.js` themeSet path
3. Clear cache and rebuild:

```bash
npm run clean
npm run build
```

**Problem:** Custom CSS classes not working

**Solution:**

- Ensure HTML is enabled: `html: true` in config
- Use HTML comment syntax for classes: `<!-- _class: content -->`
- Check class is defined in theme CSS

### Images Not Showing

Use relative or absolute paths:

```markdown
![Image](./images/photo.jpg)  # Relative
![Image](/images/photo.jpg)    # Absolute from root
```

### PDF Export Issues

**Problem:** PDF export hangs or fails

**Solution:**

```bash
# Try with explicit chromium path
marp --pdf --allow-local-files slides/presentation.md

# Or rebuild with verbose output
npm run build:pdf -- --verbose
```

**Problem:** PDF has broken fonts or missing styles

**Solution:**

- Ensure `printBackground: true` in `marp.config.js`
- Check theme CSS has proper print media queries
- Try different PDF options in config:

```javascript
pdfOptions: {
  format: 'A4',
  landscape: true,
  printBackground: true,
  preferCSSPageSize: true,
}
```

**Problem:** PDF file size is too large

**Solution:**

- Optimize images before embedding
- Use web-optimized image formats (WebP, optimized PNG/JPG)
- Consider linking images instead of embedding

**Additional common issues:**

- Ensure Chromium dependencies are installed
- Check `marp.config.js` PDF options
- Try building HTML first to verify content

### Speaker Notes Issues

**Problem:** Speaker notes don't appear in output

**Solution:**

- Notes are HTML comments - only visible in HTML source
- For PDF: Notes won't be visible in final PDF
- For HTML: View page source or use browser dev tools (F12)
- Consider using MARP presenter mode for live presentations

**Problem:** Notes syntax not recognized

**Solution:**

Use correct HTML comment syntax:

```markdown
<!-- This is a speaker note -->

NOT:

// This is not a speaker note
```

### CI/CD Workflow Failures

**Problem:** GitHub Actions build fails

**Solution:**

1. Check Node.js version in workflow matches `package.json` engines
2. Ensure `package-lock.json` is committed
3. Verify workflow has proper permissions

**Problem:** Artifacts not uploading

**Solution:**

- Check workflow `actions/upload-artifact` step
- Verify `dist/` directory is created
- Check artifact name doesn't contain invalid characters

**Problem:** Build succeeds locally but fails in CI

**Solution:**

```bash
# Ensure dependencies match
npm ci  # Use clean install like CI does

# Check Node version matches
node --version  # Should be >=20.0.0

# Test build exactly as CI does
npm run clean
npm run build
npm run build:pdf
```

### Common Issues

**Problem:** Watch mode not detecting changes

**Solution:**

```bash
# Kill existing watch process
# Restart with:
npm run watch
```

**Problem:** Serve mode port already in use

**Solution:**

```bash
# Find and kill process on port
lsof -ti:8080 | xargs kill -9

# Or specify different port
marp -s -I slides/ --port 8081
```

**Problem:** Colors look different in PDF vs HTML

**Solution:**

- This is expected due to PDF rendering
- Ensure `printBackground: true` in config
- Test theme colors in both formats
- Consider PDF-specific color adjustments in theme CSS

### Getting More Help

If you're still experiencing issues:

1. Check the [MARP CLI documentation](https://github.com/marp-team/marp-cli)
2. Review theme customization in `docs/theme-guide.md`
3. Search existing issues on GitHub
4. Open a new issue with:
   - Error message (full output)
   - Your configuration files
   - Steps to reproduce
   - Environment details (Node version, OS)

## Examples

See `templates/` directory for complete examples:

- `basic-presentation.md` - Full presentation template
- `layouts/title-slide.md` - Title slide variations
- `layouts/content-slide.md` - Content layouts
- `layouts/two-column.md` - Two-column examples
- `layouts/image-slide.md` - Image slide types

## Advanced Features

### Custom CSS

Add custom styles to individual slides:

```markdown
<!-- _class: content custom-style -->
<style scoped>
h1 { color: #ff0000; }
</style>

# Custom Styled Title
```

### Speaker Notes

Add notes that don't appear in presentation:

```markdown
---

<!-- This is a speaker note -->
<!-- Only visible in markdown, not in slides -->
```

### Adding Speaker Notes

Add notes visible only to the presenter using HTML comments:

```markdown
# My Slide Title

Content visible to audience

<!--
Speaker Notes:
- This text is only visible to you
- Great for timing cues
- Add talking points
- Remember key statistics
- Note questions to ask audience
-->
```

**Viewing Speaker Notes:**

When presenting from HTML (not PDF):

1. Open the HTML file in a browser
2. The HTML contains your notes in comments
3. Use browser developer tools (F12) to view comments
4. Or use MARP's presenter mode if available

**Best Practices:**

- Keep notes concise and bullet-pointed
- Add timing estimates (e.g., "Spend 2 minutes here")
- Include questions to engage audience
- Note common Q&A topics
- Add pronunciation guides for technical terms

**Example from our demo:**

See `slides/example-presentation.md` for complete examples of speaker notes throughout a presentation.

### Fragments (Incremental Reveal)

MARP doesn't natively support fragments, but you can:

1. Duplicate slides with progressive content
2. Use presenter mode features
3. Export to PDF and use PDF presenter tools

## Resources

- [MARP Official Documentation](https://marp.app/)
- [Marpit Framework](https://marpit.marp.app/)
- [MARP CLI GitHub](https://github.com/marp-team/marp-cli)
- [Theme Customization Guide](./theme-guide.md)
- [Theme Analysis](./theme-analysis.md)

## Getting Help

1. Check this documentation
2. Review example templates
3. Read [MARP documentation](https://marp.app/)
4. Open an issue on GitHub

## Version

**Guide Version:** 1.0
**MARP CLI:** 3.4.0
**Theme:** Edera V2
**Last Updated:** December 3, 2025
