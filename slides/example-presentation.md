---
marp: true
theme: edera-v2
paginate: true
header: 'Edera V2 Theme Demo'
footer: 'December 2025'
---

<!-- _class: title -->

# Edera V2 Theme

## A Modern MARP Presentation Theme

Demo Presentation | December 3, 2025

<!--
Speaker Notes:
- Welcome everyone to this demo of the Edera V2 MARP theme
- This is a title slide - great for opening and closing presentations
- The dark teal background with cyan accent creates professional impact
- Introduce yourself and set expectations for the presentation
-->

---

<!-- _class: content -->

# Welcome to Edera V2

This presentation demonstrates all the features of the Edera V2 MARP theme.

**What you'll see:**

- Color palette and typography
- Available slide layouts
- Code syntax highlighting
- Tables and lists
- Best practices

<!--
Speaker Notes:
- This is an agenda slide - sets clear expectations
- Mention this is a comprehensive demo covering all theme features
- Estimated time: 15-20 minutes for full walkthrough
- Encourage questions at any point
- Highlight that all slides are version-controlled in Markdown
-->

---

<!-- _class: content -->

# Color Palette

The Edera V2 theme uses a carefully chosen color scheme:

- **Dark Teal (#013a3b)** - Main brand color for backgrounds and text
- **Light Mint (#d0fdf2)** - Secondary background for content slides
- **Cyan Accent (#02f4d5)** - Highlights, links, and emphasis
- White and black for maximum contrast

All combinations meet WCAG AA accessibility standards.

<!--
Speaker Notes:
- Color palette was extracted from SVG exports of Google Slides template
- Dark teal provides professional, trustworthy feel
- Light mint creates calm, readable content background
- Cyan accent draws attention without overwhelming
- WCAG AA compliance means 12:1 contrast ratio - excellent for accessibility
- Colors work well on projectors and in various lighting conditions
-->

---

<!-- _class: content -->

# Typography Scale

The theme uses a clear typographic hierarchy:

## H2: Section Headings (40px)

### H3: Sub-headings (28px)

Regular paragraph text is set at 24px for excellent readability from a distance.

**Bold text** uses the cyan accent color for emphasis.

---

<!-- _class: content -->

# Lists and Bullets

Unordered lists use cyan bullets:

- First point explaining a concept
- Second point with additional details
- Third point summarizing the idea
  - Nested items work too
  - Multiple levels supported

---

<!-- _class: content -->

# Ordered Lists

Numbered lists for sequential content:

1. **Install** dependencies with `npm install`
2. **Create** your presentation in markdown
3. **Build** slides with `npm run build`
4. **Present** your content with confidence

---

<!-- _class: content -->

# Code Highlighting

Inline code looks like this: `npm install @marp-team/marp-cli`

Code blocks have syntax highlighting:

```javascript
function createPresentation() {
  const slides = loadMarkdown('slides.md');
  const theme = applyTheme('edera-v2');
  return render(slides, theme);
}

createPresentation();
```

<!--
Speaker Notes:
- Code blocks use dark teal background with light text for high contrast
- Syntax highlighting works automatically for most languages
- Inline code has subtle background to distinguish from regular text
- This is actual JavaScript that demonstrates the MARP workflow
- Perfect for technical presentations and workshops
- Consider using larger font sizes for code in large venues
-->

---

<!-- _class: content -->

# More Code Examples

Python example:

```python
def generate_slides(markdown_file):
    """Convert markdown to presentation"""
    with open(markdown_file, 'r') as f:
        content = f.read()
    return marp.build(content, theme='edera-v2')

generate_slides('presentation.md')
```

---

<!-- _class: content -->

# Tables for Data

| Feature | Edera V2 | Other Themes |
|---------|----------|--------------|
| Color Scheme | ✅ Custom | ❌ Limited |
| Layouts | ✅ 6 Types | ⚠️ 2-3 Types |
| Typography | ✅ Scaled | ⚠️ Basic |
| Accessibility | ✅ WCAG AA | ❌ Variable |
| Documentation | ✅ Complete | ⚠️ Limited |

---

<!-- _class: two-columns -->

# Two-Column Layout

## Left Column

Use two-column layouts for:

- Comparisons
- Before/After
- Code + Explanation
- Pros and Cons

## Right Column

Benefits of this layout:

- Better space usage
- Side-by-side content
- Visual balance
- Clear separation

---

<!-- _class: two-columns -->

# Comparison Example

## Traditional Slides

- PowerPoint or Google Slides
- Binary file formats
- No version control
- Manual collaboration
- Proprietary formats

## MARP with Edera V2

- Markdown-based
- Plain text files
- Git versioning
- Pull request workflow
- Open standards

<!--
Speaker Notes:
- Two-column layout perfect for side-by-side comparisons
- This slide demonstrates why MARP is superior for technical content
- Traditional tools: binary formats make diff/merge impossible
- MARP approach: plain text enables standard development workflows
- Pull requests for presentations = review process just like code
- Teams already using Git benefit immediately
- Pause here to let audience absorb the differences
-->

---

<!-- _class: content -->

# Blockquotes and Callouts

Use blockquotes for important points:

> "The best presentations are simple, focused, and visually appealing. Use MARP to create content that audiences remember."
> — Presentation Design Principles

Additional context can follow the quote to provide more detail.

---

<!-- _class: content -->

# Links and References

Links are styled with the cyan accent color:

- [MARP Official Website](https://marp.app/)
- [Marpit Framework Documentation](https://marpit.marp.app/)
- [Edera V2 Theme Guide](../docs/theme-guide.md)
- [Usage Documentation](../docs/marp-usage.md)

---

<!-- _class: dark -->

# Dark Slide Variant

This slide uses the dark background for visual variety.

**Features:**

- Dark teal background
- Light mint text
- Cyan accents
- High contrast

Great for emphasizing important sections or providing visual breaks.

<!--
Speaker Notes:
- Dark slides provide visual rhythm and prevent "slide blindness"
- Use strategically: section transitions, key points, dramatic emphasis
- Dark background is less fatiguing in dim rooms
- Perfect for code-heavy slides (shown on next slide)
- Cyan accent color pops beautifully against dark teal
- Limit to 20-30% of total slides for maximum impact
- Audience attention naturally increases when slide style changes
-->

---

<!-- _class: dark -->

# Code on Dark Background

Dark slides work well for code-heavy content:

```go
func main() {
    slides := LoadMarkdown("presentation.md")
    theme := NewTheme("edera-v2")

    err := BuildPresentation(slides, theme)
    if err != nil {
        log.Fatal(err)
    }
}
```

---

<!-- _class: content -->

# Building Your Presentation

## Quick Commands

```bash
# Watch mode (auto-rebuild)
npm run watch

# Build HTML
npm run build

# Build PDF
npm run build:pdf

# Serve locally
npm run serve
```

---

<!-- _class: content -->

# Available Templates

Copy from `templates/` directory:

- **basic-presentation.md** - Full template
- **layouts/title-slide.md** - Title variations
- **layouts/content-slide.md** - Content examples
- **layouts/two-column.md** - Two-column layouts
- **layouts/image-slide.md** - Image layouts

---

<!-- _class: content -->

# Best Practices

1. **One idea per slide** - Keep focused
2. **Use visuals** - Images enhance understanding
3. **Limit text** - 5-7 bullet points maximum
4. **Consistent style** - Stick to theme layouts
5. **Practice timing** - ~2 minutes per slide
6. **Test output** - Check PDF and HTML
7. **Version control** - Commit to Git

---

<!-- _class: content -->

# Accessibility Features

The Edera V2 theme is designed for accessibility:

- ✅ High contrast ratios (12:1 for main text)
- ✅ Large, readable fonts (minimum 24px)
- ✅ Clear visual hierarchy
- ✅ Meaningful color usage
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

---

<!-- _class: content -->

# Layout Summary

All available slide classes:

1. `.title` - Opening/closing slides (dark background)
2. `.content` - Standard content (light background)
3. `.dark` - Dark variant for emphasis
4. `.two-columns` - Side-by-side layout
5. `.image` - Full-screen images
6. `.image-overlay` - Text over background image

---

<!-- _class: content -->

# Creating New Slides

Basic workflow:

1. Create markdown file in `slides/`
2. Add frontmatter (marp: true, theme: edera-v2)
3. Write content using markdown
4. Apply layout classes with `<!-- _class: name -->`
5. Build with `npm run build`
6. Present `dist/your-file.html` or `.pdf`

---

<!-- _class: content -->

# Getting Help

Resources:

- 📖 [MARP Usage Guide](../docs/marp-usage.md)
- 🎨 [Theme Customization](../docs/theme-guide.md)
- 🔍 [Theme Analysis](../docs/theme-analysis.md)
- 💻 [GitHub Repository](https://github.com/denhamparry/talks)
- 🌐 [MARP Documentation](https://marp.app/)

---

<!-- _class: content -->

# Customization

Want to modify the theme?

- **Colors:** Edit CSS variables in `themes/edera-v2.css`
- **Fonts:** Change font-family declarations
- **Spacing:** Adjust margin and padding values
- **Layouts:** Add custom section classes
- **New Themes:** Copy edera-v2.css and modify

See `docs/theme-guide.md` for detailed instructions.

---

<!-- _class: content -->

# CI/CD Integration

GitHub Actions workflow included:

- Automatically builds on push
- Generates HTML and PDF
- Uploads artifacts
- Triggered by changes to slides/themes
- Located at `.github/workflows/build-slides.yml`

---

<!-- _class: content -->

# Key Takeaways

What makes Edera V2 great:

1. **Professional Design** - Clean, modern aesthetic
2. **Excellent Readability** - High contrast, large text
3. **Flexible Layouts** - Six slide types to choose from
4. **Well Documented** - Complete guides and examples
5. **Version Controlled** - Markdown in Git
6. **Automated Builds** - CI/CD ready

<!--
Speaker Notes:
- Summarize the core value propositions
- Professional design: matches Google Slides quality in Markdown
- Readability: WCAG AA compliant, works on any projector
- Flexibility: 6 layouts cover 90% of presentation needs
- Documentation: reduces onboarding time for new users
- Version control: treat presentations like code
- CI/CD: automated builds save time and prevent errors
- This is the "remember these 6 things" slide
-->

---

<!-- _class: title -->

# Questions?

## Thank You

For more information:

- Review the documentation in `docs/`
- Explore templates in `templates/`
- Check out example slides

<!--
Speaker Notes:
- Open the floor for questions
- Common questions to expect:
  * Can I use my company's fonts? Yes, modify the CSS
  * Does it work with PowerPoint? Export to PDF, then import
  * Can I add animations? Limited, but transition effects work
  * What about presenter notes? They're in HTML comments like this!
- Thank the audience for their time
- Mention you're available after for one-on-one questions
- Point them to documentation for self-service learning
-->

---

<!-- _class: title -->

# Start Building

Your next presentation awaits!

```bash
cp templates/basic-presentation.md slides/my-talk.md
npm run serve
```

<!--
Speaker Notes:
- End with a clear call to action
- Show them exactly how to get started (copy-paste ready)
- Emphasize the simplicity: 2 commands and they're presenting
- npm run serve gives instant feedback loop
- Encourage them to start with templates, not blank slides
- Remind them documentation is comprehensive if they get stuck
- Final encouragement: if they can write Markdown, they can make great slides
- Thank them one more time and dismiss
-->
