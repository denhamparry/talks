# Edera V2 Theme Customization Guide

Complete guide to understanding and customizing the Edera V2 MARP theme.

## Table of Contents

- [Overview](#overview)
- [Color Scheme](#color-scheme)
- [Typography](#typography)
- [Layout System](#layout-system)
- [Customizing the Theme](#customizing-the-theme)
- [Creating New Themes](#creating-new-themes)
- [Best Practices](#best-practices)

## Overview

The **Edera V2** theme is a professional presentation theme featuring:

- Dark teal and light mint color palette
- Clean, minimal design aesthetic
- High contrast for excellent readability
- Multiple layout options
- Responsive typography
- Accessible color combinations

**Theme File:** `themes/edera-v2.css`

## Color Scheme

### Primary Colors

```css
--edera-dark-teal: #013a3b     /* Main brand color */
--edera-light-mint: #d0fdf2    /* Secondary background */
--edera-cyan-accent: #02f4d5   /* Accent and highlights */
--edera-white: #ffffff         /* Clean backgrounds */
--edera-black: #000000         /* Text on light */
```

### Semantic Usage

| Color | Used For |
|-------|----------|
| Dark Teal | Title slide background, body text, dark slides |
| Light Mint | Content slide background, light text |
| Cyan Accent | Headings, links, emphasis, bullets |
| White | Alternate backgrounds |
| Black | High contrast text |

### Color Accessibility

All color combinations meet WCAG AA standards:

- **Dark teal on light mint:** ~12:1 contrast ratio ✅
- **Cyan on dark teal:** ~8:1 contrast ratio ✅
- **Light mint on dark teal:** ~12:1 contrast ratio ✅

## Typography

### Font Family

Default sans-serif stack:

```css
font-family: 'Arial', 'Helvetica', sans-serif;
```

**Recommendation:** Keep the default for maximum compatibility, or replace with web-safe fonts.

### Type Scale

| Element | Size | Usage |
|---------|------|-------|
| Title | 4rem (64px) | Title slides only |
| H1 | 3.5rem (56px) | Main slide headings |
| H2 | 2.5rem (40px) | Section headings |
| H3 | 1.75rem (28px) | Sub-headings |
| Body | 1.5rem (24px) | Standard text |
| Small | 1.125rem (18px) | Captions, labels |

### Font Weights

- **Headings:** 600-700 (Semi-bold to Bold)
- **Body:** 400 (Regular)
- **Emphasis:** 700 (Bold)

## Layout System

### Slide Dimensions

- **Width:** 960px
- **Height:** 540px
- **Aspect Ratio:** 16:9
- **Margins:** 60px vertical, 84px horizontal

### Available Classes

#### 1. `.title` - Title Slide

**Purpose:** Opening and closing slides

```markdown
<!-- _class: title -->
# Main Title
## Subtitle
```

**Styling:**
- Dark teal background
- Centered content (vertical & horizontal)
- Large typography
- Minimal padding

**Best for:**
- Conference talk titles
- Section breaks
- Thank you slides

#### 2. `.content` - Content Slide (Default)

**Purpose:** Standard presentation content

```markdown
<!-- _class: content -->
# Slide Title
Content here
```

**Styling:**
- Light mint background
- Left-aligned content
- Standard margins
- Dark teal text

**Best for:**
- Bullet points
- Paragraphs
- Mixed content

#### 3. `.dark` - Dark Variant

**Purpose:** High-impact slides

```markdown
<!-- _class: dark -->
# Dark Slide
```

**Styling:**
- Dark teal background
- Light mint text
- Cyan accents
- High contrast

**Best for:**
- Emphasis
- Visual variety
- Code-heavy slides

#### 4. `.two-columns` - Two-Column Layout

**Purpose:** Side-by-side content

```markdown
<!-- _class: two-columns -->
# Title Spans Both Columns
## Left      ## Right
Content      Content
```

**Styling:**
- CSS Grid layout
- Equal width columns
- Gap between columns
- Responsive alignment

**Best for:**
- Comparisons
- Before/After
- Code + Explanation

#### 5. `.image` - Full-Screen Image

**Purpose:** Visual impact

```markdown
<!-- _class: image -->
![](image.jpg)
```

**Styling:**
- No padding
- Full-screen coverage
- Centered image
- Object-fit: cover

**Best for:**
- Diagrams
- Screenshots
- Hero images

#### 6. `.image-overlay` - Image with Text

**Purpose:** Text over background image

```markdown
<!-- _class: image-overlay -->
![](bg.jpg)
# Title
```

**Styling:**
- Background image
- Dark overlay (70% opacity)
- White/cyan text
- Centered content

**Best for:**
- Conference branding
- Visual storytelling
- Section breaks

## Customizing the Theme

### Method 1: CSS Variables

Easiest way to customize colors. Edit `themes/edera-v2.css`:

```css
:root {
  /* Change brand colors */
  --edera-dark-teal: #your-color;
  --edera-light-mint: #your-color;
  --edera-cyan-accent: #your-color;
}
```

### Method 2: Override Styles

Add custom styles in your markdown:

```markdown
---
marp: true
theme: edera-v2
---

<style>
section {
  font-family: 'Georgia', serif;
}

h1 {
  color: #ff0000;
}
</style>
```

### Method 3: Create New Class

Add to `themes/edera-v2.css`:

```css
section.custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

Use in slides:

```markdown
<!-- _class: custom -->
# Custom Styled Slide
```

## Creating New Themes

### Step 1: Copy Edera V2

```bash
cp themes/edera-v2.css themes/my-theme.css
```

### Step 2: Change Theme Name

Edit the first line:

```css
/*
 * @theme my-theme
 * @author Your Name
 */
```

### Step 3: Customize Colors

Update CSS variables:

```css
:root {
  --primary-color: #your-color;
  --background-color: #your-bg;
  --text-color: #your-text;
  /* ... */
}
```

### Step 4: Adjust Typography

```css
:root {
  --font-family: 'Your Font', sans-serif;
  --font-size-base: 1.5rem;
  /* ... */
}
```

### Step 5: Modify Layouts

Customize section classes:

```css
section.title {
  background: your-custom-styles;
}
```

### Step 6: Use Your Theme

```markdown
---
marp: true
theme: my-theme
---
```

## Best Practices

### Colors

1. **Maintain contrast** - Test with contrast checkers
2. **Limit palette** - 3-4 colors maximum
3. **Brand consistency** - Match company colors
4. **Test projectors** - Colors look different on screens
5. **Avoid pure colors** - Slightly muted looks better

### Typography

1. **Readable sizes** - Minimum 24px for body text
2. **Line height** - 1.5-1.6 for paragraphs
3. **Font pairing** - Use max 2 font families
4. **Hierarchy** - Clear size differences
5. **Weight variation** - Use for emphasis

### Layout

1. **White space** - Don't fill every pixel
2. **Alignment** - Be consistent
3. **Grid system** - Use structured layouts
4. **Responsive** - Test at different sizes
5. **Simple** - Clarity over complexity

### Content

1. **One idea per slide** - Keep focused
2. **Visual hierarchy** - Guide the eye
3. **Consistency** - Use same layouts
4. **Breathing room** - Generous margins
5. **Balance** - Distribute content evenly

## Advanced Customization

### Custom Fonts

Use web fonts (requires internet):

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

section {
  font-family: 'Roboto', sans-serif;
}
```

Or use local fonts:

```css
@font-face {
  font-family: 'CustomFont';
  src: url('./fonts/custom-font.woff2') format('woff2');
}

section {
  font-family: 'CustomFont', sans-serif;
}
```

### Animations

Add subtle animations:

```css
section {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Background Patterns

Add texture:

```css
section {
  background-image:
    linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)),
    url('pattern.svg');
}
```

### Logo Integration

Add persistent logo:

```css
section::before {
  content: '';
  position: absolute;
  top: 20px;
  right: 20px;
  width: 100px;
  height: 50px;
  background: url('logo.svg') no-repeat center;
  background-size: contain;
}

section.title::before {
  display: none;  /* Hide on title slides */
}
```

## Troubleshooting

### Colors Look Different

- Test on target display (projector, screen)
- Check color space (sRGB recommended)
- Adjust brightness/contrast
- Provide both light and dark slides

### Text Not Readable

- Increase font size
- Improve contrast
- Add text shadows
- Use solid backgrounds

### Layout Breaks

- Check content length
- Verify CSS specificity
- Test with different content
- Use responsive units (rem, em)

### PDF Export Issues

- Simplify complex layouts
- Remove animations
- Use standard fonts
- Check marp.config.js settings

## Examples

### Corporate Theme

```css
:root {
  --primary: #003366;    /* Corporate blue */
  --secondary: #ffffff;  /* White */
  --accent: #ff6600;     /* Brand orange */
}
```

### Minimalist Theme

```css
:root {
  --primary: #000000;    /* Black */
  --secondary: #ffffff;  /* White */
  --accent: #666666;     /* Gray */
}

section {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 300;
}
```

### Academic Theme

```css
:root {
  --primary: #2c3e50;    /* Navy */
  --secondary: #ecf0f1;  /* Light gray */
  --accent: #e74c3c;     /* Red */
}

section {
  font-family: 'Georgia', serif;
}
```

## Resources

- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MARP Theme CSS Spec](https://marpit.marp.app/theme-css)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts](https://fonts.google.com/)
- [Theme Analysis Document](./theme-analysis.md)

## Support

For theme-related issues:
1. Check this guide
2. Review `docs/theme-analysis.md`
3. Inspect `themes/edera-v2.css`
4. Test with example templates
5. Open GitHub issue

## Version

**Guide Version:** 1.0
**Theme Version:** 2.0.0
**Last Updated:** December 3, 2025
