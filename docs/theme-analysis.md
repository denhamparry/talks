# Edera V2 Theme Analysis

## Source Files

- **Location:** `docs/theme-resources/slides-export/edera/v2/svg/`
- **Format:** SVG (Scalable Vector Graphics)
- **Slides:** 26 total (slide001.svg through slide026.svg)
- **Export Date:** December 3, 2025

## Color Palette

Based on analysis of slide001.svg and slide002.svg:

### Primary Colors
- **Dark Teal Background (Title Slide):** `#013a3b` - Used as background for title slide
- **Light Mint Background (Content Slides):** `#d0fdf2` - Used as background for content slides
- **Cyan Accent:** `#02f4d5` - Used for headings, emphasis, and brand elements
- **Dark Teal Text:** `#013a3b` - Used for body text on light backgrounds
- **Light Mint Text:** `#d0fdf2` - Used for secondary text and labels

### Background Colors
- **Title Slide:** `#013a3b` (dark teal)
- **Content Slides:** `#d0fdf2` (light mint/cyan)
- **White:** `#ffffff` - Used for clean sections

## Typography

### Fonts
Based on SVG text elements:
- **Sans-serif family** - Standard sans-serif fonts used throughout
- No custom font families detected in SVG exports
- Recommended fallback: `'Arial', 'Helvetica', sans-serif`

### Text Sizes (from SVG)
- **Main Title (slide001):** Large text elements (~48-60px equivalent)
- **Section Numbers:** Medium-large (~24-32px equivalent)
- **Body Text:** Standard reading size (~16-20px equivalent)
- **Labels/Captions:** Smaller text (~12-16px equivalent)

## Layout Patterns

### Slide 001 - Title Slide
- **Background:** Dark teal (`#013a3b`)
- **Layout:** Centered vertical alignment
- **Content:**
  - Large title text in cyan (`#02f4d5`)
  - Subtitle/tagline in light mint (`#d0fdf2`)
  - Logo/brand element in top-right corner
  - Decorative element: Rounded rectangle accent (`#02f4d5`)

### Slide 002 - Content Slide (Light Background)
- **Background:** Light mint (`#d0fdf2`)
- **Layout:** Left-aligned with right content area
- **Content:**
  - Section number in dark teal (`#013a3b`) - top left
  - Section title in dark teal
  - "Index" label at bottom

### Common Elements
- **Section Numbering:** Consistent numbering format (e.g., "1.", "2.", "3.")
- **Slide Numbers:** Positioned consistently across slides
- **Logo Placement:** Top-right corner with consistent positioning
- **Brand Badge:** October 2025 badge in top-right

## Spacing & Dimensions

### Slide Dimensions
- **Width:** 960px
- **Height:** 540px
- **Aspect Ratio:** 16:9 (standard presentation format)

### Margins (estimated from SVG coordinates)
- **Left Margin:** ~84px (~8.75% of width)
- **Right Margin:** ~40-80px (varies by content)
- **Top Margin:** ~60-90px
- **Bottom Margin:** ~40-60px

### Content Areas
- **Title Safe Area:** Content generally stays within 10% margins
- **Text Blocks:** Left-aligned with consistent left margin
- **Two-Column Potential:** Right side often has space for secondary content

## Design Elements

### Logo
- **Format:** Embedded PNG image in SVG
- **Position:** Top-right corner
- **Size:** ~73px × 66px
- **Background:** Rounded rectangle with cyan fill (`#02f4d5`)

### Decorative Elements
- **Rounded rectangles** with brand colors
- **Clean, minimal design** aesthetic
- **High contrast** between backgrounds and text

## MARP Theme Recommendations

### CSS Variables to Define
```css
:root {
  --edera-dark-teal: #013a3b;
  --edera-light-mint: #d0fdf2;
  --edera-cyan-accent: #02f4d5;
  --edera-white: #ffffff;

  /* Semantic colors */
  --color-background-title: var(--edera-dark-teal);
  --color-background-content: var(--edera-light-mint);
  --color-primary: var(--edera-cyan-accent);
  --color-text-dark: var(--edera-dark-teal);
  --color-text-light: var(--edera-light-mint);
}
```

### Layout Classes Needed
1. **`section.title`** - Title slide with dark background
2. **`section.content`** - Standard content slide with light background
3. **`section.dark`** - Dark background variant
4. **`section.light`** - Light background variant

### Typography Scale
- **h1:** 3.5rem (56px) - Main titles
- **h2:** 2.5rem (40px) - Section headings
- **h3:** 1.75rem (28px) - Sub-headings
- **body:** 1.5rem (24px) - Standard text
- **small:** 1.125rem (18px) - Captions, labels

## Implementation Notes

### Slide Transitions
- Clean, minimal transitions work best with this design
- Consider fade or slide transitions between sections

### Code Blocks
- Use dark teal background (`#013a3b`) with light mint text
- Or light mint background with dark teal text for contrast

### Tables & Lists
- Maintain clean, minimal styling
- Use cyan accent for bullets or emphasis
- Adequate spacing between list items

### Images & Media
- Allow images to use available space effectively
- Consider full-bleed image slides with overlay text

## Accessibility Considerations

### Contrast Ratios
- **Dark teal on light mint:** Excellent contrast (~12:1)
- **Cyan on dark teal:** Good contrast (~8:1)
- **Light mint on dark teal:** Excellent contrast (~12:1)

### Recommendations
- Ensure all text meets WCAG AA standards (4.5:1 minimum)
- Provide alternative layouts for users with visual impairments
- Use semantic HTML in MARP markdown

## Future Enhancements

1. **Logo Integration:** Extract logo from SVG and use as background image
2. **Animation Support:** Add subtle animations for title reveals
3. **Dark Mode Variant:** Create inverse color scheme option
4. **Multi-column Layouts:** Implement responsive two-column layouts
5. **Chart Styling:** Custom styles for data visualization

## SVG Analysis Details

### File Sizes
- Smallest file: slide001.svg (~30-31KB)
- Largest file: slide003.svg (~2.2MB - likely contains images)
- Average: ~50-200KB

### Content Types Found
- Vector graphics (paths, shapes)
- Embedded images (base64 encoded PNGs)
- Text elements with specific positioning
- Clipping paths for masking

## Version History

- **v2.0** - Current version (Edera V2 theme)
- **Created:** December 3, 2025
- **Analyzed by:** Claude Code automation

## References

- Original Google Slides template location: (to be added)
- SVG export methodology: Google Slides → Download as SVG
- Theme naming: "Edera V2" to support multiple theme versions
