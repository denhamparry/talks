# Google Slides Theme Resources

This directory contains resources from the original Google Slides template used to create the MARP theme.

## Directory Structure

```
docs/theme-resources/
├── README.md                    # This file
├── slides-export/               # PDF and HTML exports
│   ├── template.pdf            # Full Google Slides export as PDF
│   ├── template.html           # Full Google Slides export as HTML (RECOMMENDED)
│   ├── slide-01-title.png      # Screenshot of title slide
│   ├── slide-02-content.png    # Screenshot of content slide
│   ├── slide-03-layout.png     # Screenshot of special layout (if any)
│   └── ...                     # Additional slide screenshots
└── devtools-screenshots/        # Browser DevTools color/font analysis (OPTIONAL if using HTML)
    ├── colors-primary.png      # DevTools showing primary colors
    ├── colors-background.png   # DevTools showing background colors
    ├── fonts-heading.png       # DevTools showing heading fonts/sizes
    ├── fonts-body.png          # DevTools showing body text fonts/sizes
    └── spacing-margins.png     # DevTools showing spacing/padding values
```

## How to Capture Resources

### Recommended Approach: HTML + PDF Export

**This is the easiest and most accurate method!**

#### Step 1A: Export Google Slides as SVG (BEST OPTION) 🌟

1. Open your Google Slides template
2. Go to **File → Download → Scalable Vector Graphics (.svg)**
3. This will download one SVG file per slide
4. Copy all SVG files to `slides-export/` with descriptive names:
   - `slide-01-title.svg`
   - `slide-02-content.svg`
   - `slide-03-layout.svg`

**Why SVG is the BEST:**
- **Vector format** - Perfect scalability, no pixelation
- **Embedded styling** - All colors, fonts, and layout in XML
- **Most accurate** - Exact reproduction of Google Slides rendering
- **Text is selectable** - I can extract font properties directly
- **Clean structure** - Easy to parse for design values
- **Per-slide files** - Easy to identify different layout types

#### Step 1B: Export Google Slides as HTML (Alternative) ⭐

1. Open your Google Slides template
2. Go to **File → Download → Web Page (.html, zipped)**
3. Extract the ZIP file
4. Copy the main HTML file to `slides-export/template.html`
5. Copy any associated files/folders (images, CSS) to `slides-export/`

**Why HTML is good:**
- Contains inline CSS with exact color values, fonts, and spacing
- I can parse it directly without screenshots
- More accurate than manual DevTools inspection
- Includes all slides in one file

#### Step 2: Export Google Slides as PDF

1. Open your Google Slides template
2. Go to **File → Download → PDF Document (.pdf)**
3. Save as `slides-export/template.pdf`

**Why PDF is useful:**
- Shows final visual output
- Good for visual reference
- I can read and display PDFs directly

#### Step 3: Take Slide Screenshots (Optional)

**Note:** If you provide HTML export, screenshots are optional but still helpful for visual reference.

For each important slide type (title, content, two-column, image, etc.):

1. Open the slide in Google Slides
2. Take a full-screen screenshot
3. Save to `slides-export/` with descriptive names:
   - `slide-01-title.png` - Title slide
   - `slide-02-content.png` - Content slide with bullets
   - `slide-03-two-column.png` - Two-column layout
   - `slide-04-image.png` - Image-focused slide
   - `slide-05-code.png` - Code example slide (if applicable)

### Alternative Approach: DevTools Screenshots (Only if HTML export is not available)

**Note:** If you provide the HTML export, you can skip this entire section! The HTML contains all the design values I need.

#### Colors

1. Open Google Slides in Chrome or Firefox
2. Right-click on slide element → **Inspect** (or press F12)
3. In DevTools, select the element (title, background, text)
4. Look for computed styles showing color values (hex codes)
5. Screenshot the DevTools panel showing:
   - `background-color: #XXXXXX`
   - `color: #XXXXXX`
   - Any other color properties

Save screenshots as:
- `devtools-screenshots/colors-primary.png` - Primary/brand colors
- `devtools-screenshots/colors-background.png` - Background colors
- `devtools-screenshots/colors-accent.png` - Accent/highlight colors
- `devtools-screenshots/colors-text.png` - Text colors

#### Fonts

1. Select text elements (headings, body text)
2. In DevTools, find computed styles for:
   - `font-family: "Font Name", sans-serif`
   - `font-size: XXpx`
   - `font-weight: XXX`
   - `line-height: X.X`

Save screenshots as:
- `devtools-screenshots/fonts-heading.png` - Heading (h1) font properties
- `devtools-screenshots/fonts-subheading.png` - Subheading (h2/h3) properties
- `devtools-screenshots/fonts-body.png` - Body text properties
- `devtools-screenshots/fonts-code.png` - Code/monospace font (if used)

#### Spacing and Layout

1. Select container elements (slide sections, content areas)
2. In DevTools, find:
   - `padding: XXpx`
   - `margin: XXpx`
   - `width: XXXpx` or `XX%`
   - Layout properties

Save screenshots as:
- `devtools-screenshots/spacing-margins.png` - Margin values
- `devtools-screenshots/spacing-padding.png` - Padding values
- `devtools-screenshots/layout-dimensions.png` - Width/height values

## Tips for DevTools Screenshots

### Finding Color Values

1. **Background colors**: Select the slide container
2. **Text colors**: Select heading or paragraph elements
3. **Accent colors**: Select buttons, links, or highlighted elements
4. Look for hex values like `#1a73e8` or RGB like `rgb(26, 115, 232)`

### Finding Font Values

1. Select text elements in the slide
2. Look in **Computed** tab (not Styles) for actual rendered values
3. `font-family` shows the exact font stack
4. `font-size` shows size in pixels (convert to rem/em for MARP)
5. `font-weight` shows boldness (400 = normal, 700 = bold)

### Browser DevTools Shortcuts

- **Chrome/Firefox**: F12 or Cmd+Opt+I (Mac) / Ctrl+Shift+I (Windows)
- **Element Picker**: Cmd+Shift+C (Mac) / Ctrl+Shift+C (Windows)
- **Computed Styles**: DevTools → Computed tab (shows final rendered values)

## After Capturing Resources

Once you've added all files to this directory:

1. Let Claude know the resources are ready
2. Claude will analyze the PDF, screenshots, and DevTools images
3. Claude will extract:
   - Color palette (hex codes)
   - Font families and sizes
   - Spacing and layout values
   - Design patterns for each slide type
4. Claude will create `docs/theme-analysis.md` with findings
5. Claude will implement the MARP theme CSS based on analysis

## Example Directory After Population

### Option A: SVG Export (BEST) 🌟

```
docs/theme-resources/
├── README.md
├── slides-export/
│   ├── slide-01-title.svg            # ✅ SVG export (perfect accuracy!)
│   ├── slide-02-content.svg          # ✅ SVG with bullet points
│   ├── slide-03-layout.svg           # ✅ SVG with special layout
│   └── template.pdf                  # ✅ Optional: PDF for visual reference
└── devtools-screenshots/              # ❌ Not needed if SVG provided
```

**What I'll extract from SVG:**
- Exact color values from fill/stroke attributes
- Font families, sizes, weights from text elements
- Precise spacing and positioning (x, y coordinates)
- Layout dimensions (viewBox, width, height)
- Text content and styling
- Shape properties (rectangles, circles, paths)

### Option B: HTML Export (Great) ⭐

```
docs/theme-resources/
├── README.md
├── slides-export/
│   ├── template.html                  # ✅ HTML export (contains all CSS!)
│   ├── template.pdf                   # ✅ PDF export (visual reference)
│   ├── images/                        # ✅ Images folder (if extracted from ZIP)
│   ├── slide-01-title.png            # ✅ Optional: Title slide screenshot
│   └── slide-02-content.png          # ✅ Optional: Content slide screenshot
└── devtools-screenshots/              # ❌ Not needed if HTML provided
```

### Option C: Manual Screenshots (Fallback)

```
docs/theme-resources/
├── README.md
├── slides-export/
│   ├── template.pdf                    # ✅ Full PDF export
│   ├── slide-01-title.png             # ✅ Title slide
│   ├── slide-02-content.png           # ✅ Content slide
│   └── slide-03-two-column.png        # ✅ Two-column layout
└── devtools-screenshots/
    ├── colors-primary.png             # ✅ Primary brand color
    ├── colors-background.png          # ✅ Background colors
    ├── colors-text.png                # ✅ Text colors
    ├── fonts-heading.png              # ✅ H1 font properties
    ├── fonts-body.png                 # ✅ Body text properties
    └── spacing-margins.png            # ✅ Spacing values
```

## Comparison: SVG vs HTML vs Screenshots

| Feature | SVG 🌟 | HTML ⭐ | Screenshots |
|---------|--------|---------|-------------|
| **Accuracy** | Perfect (vector) | Excellent | Good |
| **Color extraction** | Exact hex/RGB | Exact hex/RGB | Manual/approximate |
| **Font details** | Exact families/sizes | Exact families/sizes | Manual measurement |
| **Spacing/layout** | Precise coordinates | CSS values | Manual measurement |
| **Ease of parsing** | XML structure | HTML/CSS | Visual only |
| **Per-slide detail** | Yes (one file per slide) | All in one | Manual per slide |
| **Time required** | 2 min (download) | 2 min (download + extract) | 30+ min (screenshots) |

**Recommendation:** Use **SVG export** if available. It's the most accurate and easiest to work with!

## Notes

- This directory is **temporary** and used for theme analysis only
- After theme creation, these files can be archived or removed
- Add to `.gitignore` if you don't want to commit large images/PDFs
- SVG files are text-based and can be viewed in any browser
- Screenshots should be high-resolution for accurate color picking (if using fallback option)
- DevTools screenshots should clearly show the property names and values (if using fallback option)

## Questions?

If you're unsure about any step, just ask! The more accurate the resource captures, the better the MARP theme will match your Google Slides design.
