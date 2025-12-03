# GitHub Issue #4: Slide decks not displaying full-page or centered in browser

**Issue:** [#4](https://github.com/denhamparry/talks/issues/4)
**Status:** Complete
**Date:** 2025-12-03
**Labels:** bug, marp, css, ui

## Problem Statement

When viewing MARP slide presentations in a web browser (HTML output), slides appear in a smaller container with large borders/margins on all sides, instead of filling the viewport and being properly centered.

### Current Behavior

- Slides display with significant unused screen space around them
- Large borders/margins visible on all sides
- Content not centered properly in browser viewport
- Presentation doesn't fill available screen real estate
- Suboptimal viewing experience for presentations

### Expected Behavior

- Slides should fill the browser viewport (full-page display)
- Slides should be properly centered
- Presentation should utilize available screen space efficiently
- Professional presentation viewing experience similar to other slide tools

### Visual Impact

The issue affects both title slides and content slides, creating an unprofessional appearance with wasted screen space. Users expect full-screen presentation mode when viewing HTML slide decks.

## Root Cause Analysis

### Investigation Summary

After building the HTML output and analyzing the generated CSS, the root cause has been identified:

**The Edera V2 theme CSS defines fixed pixel dimensions that override MARP's responsive sizing system.**

### Specific Issues in `themes/edera-v2.css`

**Lines 50-54:**

```css
:root {
  --slide-width: 960px;
  --slide-height: 540px;
  --margin-horizontal: 84px;
  --margin-vertical: 60px;
}
```

**Lines 60-72:**

```css
section {
  background-color: var(--color-background-content);
  color: var(--color-text-dark);
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: var(--font-size-base);
  line-height: 1.6;
  padding: var(--margin-vertical) var(--margin-horizontal);
  width: var(--slide-width);   /* ← Fixed 960px */
  height: var(--slide-height);  /* ← Fixed 540px */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
```

### How MARP Sizing Works

MARP's Bespoke framework uses a responsive system:

1. **HTML/Body:** `height: 100%; margin: 0`
2. **SVG Container:** `svg.bespoke-marp-slide { height: 100%; width: 100%; position: absolute; }`
3. **Section Sizing:** MARP's default CSS sets: `div#\:\$p > svg > foreignObject > section { width: 1280px; height: 720px; }`

The theme's fixed dimensions (960x540px) conflict with MARP's sizing system, preventing the responsive scaling from working properly.

### Why This Happens

1. Theme CSS defines explicit `width` and `height` on `section` elements
2. These fixed pixel values override MARP's responsive sizing
3. Browser displays slides at the fixed theme size (960x540px) rather than viewport-filling
4. Result: Small slides with large margins/borders

## Solution Design

### Approach

**Remove fixed dimensions from the theme CSS and rely on MARP's native responsive sizing system.**

The Edera V2 theme should define visual styling (colors, typography, spacing) but NOT override structural layout dimensions that MARP handles. This allows MARP's Bespoke framework to manage viewport-responsive scaling.

### Key Principles

1. **Separation of concerns:** Theme handles visual design, MARP handles layout/sizing
2. **Responsive by default:** Remove fixed width/height constraints
3. **Preserve aspect ratio:** Use MARP's built-in 16:9 sizing system
4. **Maintain visual design:** Keep all colors, typography, spacing ratios

### Implementation Strategy

**Option 1: Remove dimension overrides (Recommended)**

- Remove `width` and `height` from `section` selector
- Keep `--slide-width` and `--slide-height` CSS variables for reference only
- Let MARP's responsive system handle actual sizing
- Preserve padding/margin using percentage or viewport units

**Option 2: Use max-width instead of width**

- Change `width: var(--slide-width)` to `max-width: var(--slide-width)`
- Change `height: var(--slide-height)` to `max-height: var(--slide-height)`
- Allows slides to scale down but not exceed theme dimensions

**Option 3: Add responsive scaling CSS**

- Use CSS transforms to scale slides to viewport
- Add media queries for different screen sizes
- More complex, may conflict with MARP's system

**Recommended: Option 1** - Cleanest solution that works with MARP's design

### Benefits

- Slides fill browser viewport automatically
- Proper centering via MARP's positioning system
- Responsive to different screen sizes
- Professional full-screen presentation mode
- No conflicts with MARP's built-in features (fullscreen, presenter mode, etc.)

## Implementation Plan

### Step 1: Update Section Base Styles

**File:** `themes/edera-v2.css`

**Changes:** Remove fixed dimensions from section selector (lines 60-72)

**Before:**

```css
section {
  background-color: var(--color-background-content);
  color: var(--color-text-dark);
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: var(--font-size-base);
  line-height: 1.6;
  padding: var(--margin-vertical) var(--margin-horizontal);
  width: var(--slide-width);    /* Remove this */
  height: var(--slide-height);  /* Remove this */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
```

**After:**

```css
section {
  background-color: var(--color-background-content);
  color: var(--color-text-dark);
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: var(--font-size-base);
  line-height: 1.6;
  padding: var(--margin-vertical) var(--margin-horizontal);
  /* width and height managed by MARP framework */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
```

**Testing:**

```bash
# Build HTML output
npx marp slides/example-presentation.md --html --theme-set themes -o /tmp/test-slides.html

# Open in browser and verify:
# 1. Slides fill viewport
# 2. Slides are centered
# 3. No large margins/borders
# 4. Fullscreen button works correctly
```

### Step 2: Update CSS Variable Documentation

**File:** `themes/edera-v2.css`

**Changes:** Update comments for `--slide-width` and `--slide-height` variables (lines 50-54)

**Before:**

```css
:root {
  /* ... other variables ... */

  /* Layout */
  --slide-width: 960px;
  --slide-height: 540px;
  --margin-horizontal: 84px;
  --margin-vertical: 60px;
}
```

**After:**

```css
:root {
  /* ... other variables ... */

  /* Layout - Reference values only (actual sizing managed by MARP) */
  --slide-width: 960px;   /* Design reference for 16:9 aspect ratio */
  --slide-height: 540px;  /* Design reference for 16:9 aspect ratio */
  --margin-horizontal: 84px;
  --margin-vertical: 60px;
}
```

**Note:** Keep the variables for potential future use or documentation, but clarify they don't control actual slide dimensions.

### Step 3: Verify Layout Classes Still Work

**File:** `themes/edera-v2.css`

**Changes:** Ensure layout classes (title, content, dark, two-columns, etc.) don't rely on fixed dimensions

**Check these selectors:** (lines 239-331)

- `section.title`
- `section.content`
- `section.dark`
- `section.two-columns`
- `section.image`
- `section.image-overlay`

**Validation:**

- Verify none of these override width/height
- Confirm padding/spacing still works correctly
- Test that centering/alignment still functions

**Testing:**

```bash
# Test all layout classes
npx marp slides/example-presentation.md --html --theme-set themes -o /tmp/test-layouts.html
```

Expected: All layouts (title, content, two-column, image) display correctly at full viewport size.

### Step 4: Update Theme Documentation

**File:** `docs/theme-guide.md`

**Changes:** Update documentation to reflect responsive sizing behavior

**Add section:**

```markdown
## Responsive Sizing

The Edera V2 theme uses MARP's native responsive sizing system:

- **Viewport-responsive:** Slides automatically scale to fill the browser viewport
- **Aspect ratio:** Maintains 16:9 aspect ratio (1280x720 default)
- **Fullscreen support:** Works seamlessly with MARP's fullscreen mode
- **Print support:** Maintains proper dimensions when exporting to PDF

### Design Dimensions

The theme is designed for 16:9 slides with these reference dimensions:
- **Reference Width:** 960px (design canvas)
- **Reference Height:** 540px (design canvas)
- **Actual Display:** Scales responsively to viewport size

When building presentations, content will scale proportionally to fit any screen size.
```

**Testing:** Review documentation for accuracy and completeness.

### Step 5: Test All Output Formats

**HTML Output:**

```bash
npx marp slides/example-presentation.md --html --theme-set themes -o /tmp/test.html
# Open in browser, test:
# - Full viewport display
# - Centered slides
# - Fullscreen button works
# - Navigation buttons work
# - Presenter mode works
```

**PDF Output:**

```bash
npx marp slides/example-presentation.md --pdf --theme-set themes -o /tmp/test.pdf
# Open PDF, verify:
# - Page dimensions correct (16:9)
# - No cropping or scaling issues
# - Content properly positioned
```

**Server Mode:**

```bash
npx marp -s slides/example-presentation.md --theme-set themes
# Open http://localhost:8080, test:
# - Live reload works
# - Slides display full-page
# - Hot module replacement preserves state
```

### Step 6: Regression Testing

**Test existing presentations:**

```bash
# Test the example presentation
npx marp slides/example-presentation.md --html --pdf --theme-set themes -o dist/

# Verify all slide layouts:
# ✓ Title slides (dark background, centered)
# ✓ Content slides (light background, normal flow)
# ✓ Dark variant slides
# ✓ Two-column layouts
# ✓ Image slides
# ✓ Code blocks and syntax highlighting
# ✓ Lists, tables, blockquotes
# ✓ Headers and footers
# ✓ Pagination
```

Expected: All layouts render correctly without visual regressions.

## Testing Strategy

### Unit Testing (CSS Validation)

**Test 1: Section has no fixed dimensions**

```css
/* Expected: section selector should NOT have width/height properties */
section {
  /* Should contain styling properties only */
  background-color: ...;
  color: ...;
  padding: ...;
  /* Should NOT contain: */
  /* width: ...; */
  /* height: ...; */
}
```

**Validation:**

```bash
grep -E "^section \{" -A 20 themes/edera-v2.css | grep -E "width:|height:"
# Should return NO results (except for max-width if using Option 2)
```

### Integration Testing

**Test Case 1: HTML Output - Full Viewport Display**

**Steps:**

1. Build HTML: `npx marp slides/example-presentation.md --html --theme-set themes -o /tmp/test.html`
2. Open `/tmp/test.html` in browser (Chrome, Firefox, Safari)
3. Measure slide container dimensions using browser DevTools
4. Compare to viewport dimensions

**Expected Result:**

- Slide container fills viewport (minus MARP controls at bottom)
- Slides are centered horizontally and vertically
- No large margins or borders around slide content
- Aspect ratio maintains 16:9

**Test Case 2: Fullscreen Mode**

**Steps:**

1. Open HTML presentation in browser
2. Click fullscreen button (bottom-right control)
3. Verify slide display

**Expected Result:**

- Slides fill entire screen in fullscreen mode
- No borders or margins visible
- Exit fullscreen returns to normal full-viewport display

**Test Case 3: PDF Export Dimensions**

**Steps:**

1. Build PDF: `npx marp slides/example-presentation.md --pdf --theme-set themes -o /tmp/test.pdf`
2. Open PDF in viewer
3. Check page properties (File > Properties or equivalent)

**Expected Result:**

- Page size: 1280 x 720 px (or 13.33 x 7.5 inches at 96 DPI)
- Aspect ratio: 16:9
- No cropping or scaling artifacts

**Test Case 4: Multiple Screen Sizes**

**Steps:**

1. Open HTML presentation
2. Test on multiple viewport sizes:
   - Desktop: 1920x1080, 1366x768, 1280x720
   - Tablet: 1024x768, 768x1024
   - Mobile: 375x667, 414x896

**Expected Result:**

- Slides scale appropriately for each viewport
- Content remains readable
- Aspect ratio preserved
- No horizontal scrolling required

**Test Case 5: All Layout Classes**

**Steps:**

1. Build example presentation with all layouts
2. Verify each layout displays correctly:
   - `<!-- _class: title -->` - Dark background, centered
   - `<!-- _class: content -->` - Default light background
   - `<!-- _class: dark -->` - Dark variant
   - `<!-- _class: two-columns -->` - Side-by-side layout
   - `<!-- _class: image -->` - Full-screen image
   - `<!-- _class: image-overlay -->` - Image with text overlay

**Expected Result:**

- All layouts render correctly at full viewport size
- No layout breaks or overflow issues
- Responsive behavior works for all classes

### Regression Testing

**Test Case 6: Existing Presentation Content**

**Steps:**

1. Build existing presentation: `slides/example-presentation.md`
2. Compare visual output before and after changes
3. Take screenshots of each slide

**Expected Result:**

- Typography unchanged (font sizes, colors, weights)
- Spacing unchanged (padding, margins, line heights)
- Colors unchanged (backgrounds, text, accents)
- Only difference: slides now fill viewport instead of fixed size

**Test Case 7: CI Build Process**

**Steps:**

1. Commit changes to branch
2. Push to GitHub
3. Monitor GitHub Actions workflow: `.github/workflows/build-slides.yml`
4. Download artifacts from workflow run

**Expected Result:**

- CI build completes successfully
- HTML and PDF artifacts generated
- No build errors or warnings
- Artifacts downloadable and functional

## Success Criteria

- [x] Research completed - Root cause identified in theme CSS
- [x] Fixed dimensions removed from `section` selector in `themes/edera-v2.css`
- [x] CSS variable comments updated for clarity
- [x] HTML output displays slides full-viewport in browser
- [x] Slides are properly centered horizontally and vertically
- [x] No large margins/borders visible around slide content
- [x] Fullscreen mode works correctly
- [x] PDF export maintains correct dimensions (16:9 aspect ratio)
- [x] All layout classes (title, content, dark, two-columns, image, image-overlay) work correctly
- [x] No visual regressions in typography, colors, or spacing
- [x] Theme documentation updated in `docs/theme-guide.md`
- [x] All tests pass (HTML, PDF, server mode, multiple viewports)
- [ ] CI/CD builds successfully generate artifacts
- [ ] Issue #4 closed with verification screenshots

## Files Modified

1. `themes/edera-v2.css` - Remove fixed dimensions from section selector, update comments
2. `docs/theme-guide.md` - Add responsive sizing documentation section

## Related Issues and Tasks

### Depends On

None - This is a standalone CSS fix

### Blocks

None identified

### Related

- **Issue #1:** Port Google Slides theme to MARP template (completed) - This fix improves the theme created in that work
- **PR #2 feedback:** General presentation system improvements - This fix addresses a core UX issue

### Enables

- Better presentation viewing experience
- Professional full-screen display mode
- Responsive presentations that work on all devices
- Improved usability for presentation audiences

## References

- [GitHub Issue #4](https://github.com/denhamparry/talks/issues/4)
- [MARP Documentation - Themes](https://marpit.marp.app/theme-css)
- [MARP Bespoke Framework](https://github.com/marp-team/marp-cli/blob/main/docs/bespoke-templates/README.md)
- [Edera V2 Theme File](themes/edera-v2.css)
- [Theme Guide Documentation](docs/theme-guide.md)

## Notes

### Key Insights

1. **Theme responsibility:** Themes should handle visual design (colors, typography) but not override MARP's structural layout system
2. **MARP sizing:** MARP's Bespoke framework has a sophisticated responsive sizing system - themes should work with it, not against it
3. **Fixed dimensions are problematic:** Hard-coded pixel dimensions prevent responsive behavior and cause poor UX
4. **CSS variables for reference:** Keeping `--slide-width` and `--slide-height` as documentation is fine, but don't use them to set actual dimensions on elements

### Alternative Approaches Considered

1. **Keep fixed dimensions, add scaling JavaScript** - More complex, conflicts with MARP's system ❌
2. **Use max-width/max-height instead of width/height** - Partial solution, but still limits responsiveness ❌
3. **Remove dimensions and rely on MARP** - Cleanest solution, leverages existing framework ✅ **CHOSEN**

### Technical Decisions

- **Remove vs. Comment:** Remove the dimension properties entirely rather than commenting them out, for cleaner code
- **Keep CSS variables:** Retain `--slide-width` and `--slide-height` for documentation purposes with updated comments
- **No responsive media queries needed:** MARP's framework handles responsiveness automatically once fixed dimensions are removed

### Best Practices

1. **Test across browsers:** Chrome, Firefox, Safari, Edge
2. **Test across devices:** Desktop, tablet, mobile viewports
3. **Test all output formats:** HTML, PDF, server mode
4. **Verify existing content:** Ensure no regressions in existing presentations
5. **Document the change:** Update theme documentation to explain responsive behavior

### Browser Compatibility

The fix relies on standard CSS and MARP's framework:

- ✅ Chrome/Chromium (primary MARP target)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

No browser-specific workarounds needed.

### Monitoring

After deployment:

- Monitor issue #4 for user feedback
- Check if any new issues are filed related to slide sizing
- Verify CI/CD builds continue to succeed
- Collect feedback on presentation viewing experience

### Future Enhancements

Potential follow-up improvements (not in scope for this issue):

- Add optional theme variants for different aspect ratios (4:3, 16:10)
- Create responsive font sizing that scales with viewport
- Add theme customization guide for dimension-related variables
- Document best practices for theme development with MARP
