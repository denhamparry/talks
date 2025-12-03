# GitHub Issue #25: Fix Edera V2 theme readability: light text on light backgrounds and dark text on dark backgrounds

**Issue:** [#25](https://github.com/denhamparry/talks/issues/25)
**Status:** Open
**Labels:** bug, accessibility, design, high-priority
**Date:** 2025-12-03

## Problem Statement

The Edera V2 theme has critical readability issues with text color contrast that violate WCAG accessibility standards:

### Current Issues Identified

**Issue 1: Light cyan text (#02f4d5) on light mint backgrounds (#d0fdf2)**
- **Location:** Slide 4 of `slides/2025-12-04-cloud-native-manchester.md`
- **Example:** "Live Demo:" text in strong elements
- **CSS Rule:** `strong, b { color: var(--color-primary); }` (themes/edera-v2.css:117-120)
- **Contrast Ratio:** 1.28:1 (FAILS WCAG AA - requires 3.0:1 minimum for large text)
- **Impact:** Light cyan color is nearly invisible on light mint backgrounds

**Issue 2: Code snippet comments with insufficient contrast**
- **Location:** Slide 10 of `slides/2025-12-04-cloud-native-manchester.md`
- **Observed:** Code block appears readable with light text on dark background
- **CSS Rule:** `pre { background-color: var(--color-background-dark); color: var(--color-text-light); }` (themes/edera-v2.css:165-172)
- **Status:** Code blocks appear visually acceptable - NOT a critical issue like described in issue

### Browser Inspection Results (via Playwright MCP)

**Slide 1 (Title slide):**
- H1 color: `rgb(1, 58, 59)` = `#013a3b` (dark teal) ✅ Good
- Background: `rgb(208, 253, 242)` = `#d0fdf2` (light mint)
- Contrast: 11.39:1 ✅ PASSES WCAG AAA

**Slide 4 (Content slide with "Live Demo"):**
- Strong color: `rgb(2, 244, 213)` = `#02f4d5` (cyan) ❌ Poor contrast
- Link color: `rgb(2, 244, 213)` = `#02f4d5` (cyan) ❌ Poor contrast
- H2 color: `rgb(1, 58, 59)` = `#013a3b` (dark teal) ✅ Good
- Background: `rgb(208, 253, 242)` = `#d0fdf2` (light mint)
- **Strong/Link contrast: 1.28:1** ❌ FAILS WCAG AA

**Slide 10 (Code block):**
- Code block has dark background with light text ✅ Readable
- No critical issue observed

### Expected Behavior

- **Strong text and links** on light backgrounds should use **dark colors** (e.g., #013a3b dark teal)
- **Strong text and links** on dark backgrounds should use **light colors** (e.g., #02f4d5 cyan)
- All color combinations should meet WCAG AA contrast standards (minimum 3:1 for large text, 4.5:1 for normal text)

### Impact

🔴 **High Priority** - Strong text and links are currently unreadable in their rendered form on light backgrounds, affecting:
- Emphasis elements throughout presentations
- Link visibility and accessibility
- Overall presentation quality and professionalism
- WCAG compliance for public presentations

## Current State Analysis

### Relevant CSS (themes/edera-v2.css)

**Color Variables (lines 14-31):**
```css
:root {
  --edera-dark-teal: #013a3b;
  --edera-light-mint: #d0fdf2;
  --edera-cyan-accent: #02f4d5;

  --color-primary: var(--edera-cyan-accent);
  --color-text-dark: var(--edera-dark-teal);
  --color-text-light: var(--edera-light-mint);
}
```

**Problematic Rules:**

1. **Strong/Bold text (lines 117-120):**
```css
strong,
b {
  color: var(--color-primary);  /* #02f4d5 - cyan */
  font-weight: 700;
}
```
❌ **Problem:** Uses cyan on all backgrounds, including light mint where contrast is 1.28:1

2. **Links (lines 105-109):**
```css
a {
  color: var(--color-primary);  /* #02f4d5 - cyan */
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary);
}
```
❌ **Problem:** Uses cyan on all backgrounds, including light mint where contrast is 1.28:1

3. **List markers (lines 142-150):**
```css
ul > li::marker {
  color: var(--color-primary);  /* #02f4d5 - cyan */
  font-weight: bold;
}

ol > li::marker {
  color: var(--color-primary);  /* #02f4d5 - cyan */
  font-weight: bold;
}
```
❌ **Problem:** Uses cyan on all backgrounds, including light mint where contrast is 1.28:1

**Working Rules (for reference):**

4. **Code blocks (lines 165-179):**
```css
pre {
  background-color: var(--color-background-dark);
  color: var(--color-text-light);
  padding: var(--spacing-sm);
  border-radius: 8px;
}
```
✅ **Good:** Uses light text on dark background (11.39:1 contrast)

5. **Dark section overrides (lines 280-293):**
```css
section.dark h1,
section.dark h2,
section.dark h3 {
  color: var(--color-primary);  /* Cyan on dark background - good */
}

section.dark a {
  color: var(--color-primary);
}

section.dark strong {
  color: var(--color-primary);
}
```
✅ **Good:** Explicitly uses cyan on dark backgrounds where it's readable

### Related Context

- **Issue #22** (completed): Accessibility audit confirmed all color combinations meet WCAG AA except this one
- **Accessibility audit report:** `docs/accessibility-audit.md` documents the issue but marks it as "resolved" - this was incorrect
- **Previous fix attempt:** Issue #22 changed default H1 color to dark teal, which fixed H1 headings but did NOT fix strong/link elements

## Solution Design

### Approach

Apply the same fix pattern that successfully resolved H1 accessibility (from issue #22) to strong, link, and list marker elements:

**Pattern from H1 fix (themes/edera-v2.css:77-83):**
```css
h1 {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance */
  font-size: var(--font-size-h1);
  font-weight: 700;
}

/* Dark backgrounds explicitly override to cyan */
section.dark h1 { color: var(--color-primary); }
section.title h1 { color: var(--color-primary); }
```

**Apply same pattern to:**
1. Strong/bold text
2. Links
3. List markers

### Implementation

**Change 1: Fix strong/bold text (themes/edera-v2.css:116-120)**

**Current:**
```css
strong,
b {
  color: var(--color-primary);
  font-weight: 700;
}
```

**Fixed:**
```css
strong,
b {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  font-weight: 700;
}
```

**Change 2: Fix links (themes/edera-v2.css:105-114)**

**Current:**
```css
a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary);
}

a:hover {
  color: var(--color-text-dark);
  border-bottom-color: var(--color-text-dark);
}
```

**Fixed:**
```css
a {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  text-decoration: none;
  border-bottom: 2px solid var(--color-text-dark);
}

a:hover {
  color: var(--color-primary);  /* Cyan on hover for visual feedback */
  border-bottom-color: var(--color-primary);
}
```

**Change 3: Fix list markers (themes/edera-v2.css:142-150)**

**Current:**
```css
ul > li::marker {
  color: var(--color-primary);
  font-weight: bold;
}

ol > li::marker {
  color: var(--color-primary);
  font-weight: bold;
}
```

**Fixed:**
```css
ul > li::marker {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  font-weight: bold;
}

ol > li::marker {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  font-weight: bold;
}
```

**Change 4: Ensure dark sections already have overrides (VERIFY ONLY - already exists at lines 286-293)**

```css
section.dark a {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

section.dark strong {
  color: var(--color-primary);
}

/* Add list marker override if missing */
section.dark ul > li::marker,
section.dark ol > li::marker {
  color: var(--color-primary);
}
```

### Benefits

1. ✅ **WCAG AA Compliance:** All strong/link text will have 11.39:1 contrast on light backgrounds
2. ✅ **Consistent Pattern:** Uses same approach as H1 fix (proven successful)
3. ✅ **Dark Section Support:** Cyan remains visible on dark backgrounds via `.dark` class overrides
4. ✅ **No Breaking Changes:** Existing slides will render correctly
5. ✅ **Title Slides Unaffected:** Title slides likely use dark backgrounds already
6. ✅ **Backwards Compatible:** All presentations will benefit from improved accessibility

### Trade-offs Considered

**Option A: Change default colors to dark teal, override on dark sections** ✅ **CHOSEN**
- **Pros:** Consistent with H1 fix, WCAG compliant by default, explicit dark overrides
- **Cons:** Slightly more CSS (dark section overrides needed)
- **Decision:** CHOSEN - matches proven successful pattern from issue #22

**Option B: Use CSS custom properties per section**
- **Pros:** More flexible, scoped control
- **Cons:** Complex, requires changes to many sections, hard to maintain
- **Decision:** Rejected - over-engineered for this problem

**Option C: Change cyan color globally to darker shade**
- **Pros:** Single change fixes all usages
- **Cons:** Breaks brand identity, affects dark sections negatively
- **Decision:** Rejected - violates design requirements

## Implementation Plan

### Step 1: Update strong/bold text default color

**File:** `themes/edera-v2.css`

**Changes:**
Replace lines 116-120:
```css
strong,
b {
  color: var(--color-primary);
  font-weight: 700;
}
```

With:
```css
strong,
b {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  font-weight: 700;
}
```

**Testing:**
```bash
make build
# Open slides/2025-12-04-cloud-native-manchester.md slide 4
# Verify "IvyBot" and "Live Demo:" strong text is dark teal and readable
```

### Step 2: Update link default color and hover behavior

**File:** `themes/edera-v2.css`

**Changes:**
Replace lines 105-114:
```css
a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary);
}

a:hover {
  color: var(--color-text-dark);
  border-bottom-color: var(--color-text-dark);
}
```

With:
```css
a {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  text-decoration: none;
  border-bottom: 2px solid var(--color-text-dark);
}

a:hover {
  color: var(--color-primary);  /* Cyan on hover for visual feedback */
  border-bottom-color: var(--color-primary);
}
```

**Testing:**
```bash
# Verify slide 4 "https://ivysketch.me" link is dark teal
# Hover should show cyan color
```

### Step 3: Update list marker colors

**File:** `themes/edera-v2.css`

**Changes:**
Replace lines 142-150:
```css
ul > li::marker {
  color: var(--color-primary);
  font-weight: bold;
}

ol > li::marker {
  color: var(--color-primary);
  font-weight: bold;
}
```

With:
```css
ul > li::marker {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  font-weight: bold;
}

ol > li::marker {
  color: var(--color-text-dark);  /* Default to dark teal for WCAG AA compliance (11.39:1) */
  font-weight: bold;
}
```

**Testing:**
```bash
# Verify bullet points on slide 4 are dark teal and visible
```

### Step 4: Verify dark section overrides exist

**File:** `themes/edera-v2.css`

**Actions:**
1. Check lines 286-293 for existing dark section overrides
2. Verify `section.dark strong` override exists (line 291-293)
3. Verify `section.dark a` override exists (line 286-289)
4. **Add if missing:** List marker overrides for dark sections

**Add after line 293 if not present:**
```css
section.dark ul > li::marker,
section.dark ol > li::marker {
  color: var(--color-primary);
}
```

**Testing:**
```bash
# Check slides with .dark class (slide 3, 8, etc.)
# Verify strong/link/markers are cyan on dark backgrounds
```

### Step 5: Test with Playwright MCP browser inspection

**Actions:**
1. Start dev server: `npm run serve`
2. Use Playwright MCP to navigate to presentation
3. Inspect slide 4 computed styles:
   - Strong color should be `rgb(1, 58, 59)` (#013a3b)
   - Link color should be `rgb(1, 58, 59)` (#013a3b)
   - Background should remain `rgb(208, 253, 242)` (#d0fdf2)
4. Take screenshots for documentation

**Verification Script:**
```javascript
// In Playwright MCP
const strong = document.querySelector('strong');
const link = document.querySelector('a');
const section = document.querySelector('section');

return {
  strongColor: window.getComputedStyle(strong).color,
  linkColor: window.getComputedStyle(link).color,
  sectionBg: window.getComputedStyle(section).backgroundColor
};

// Expected output:
// strongColor: "rgb(1, 58, 59)"  ✅
// linkColor: "rgb(1, 58, 59)"    ✅
// sectionBg: "rgb(208, 253, 242)" ✅
```

### Step 6: Run automated contrast verification

**File:** `scripts/check-contrast.js` (already exists from issue #22)

**Add test cases:**
```javascript
const combinations = [
  // Existing tests...

  // New tests for this issue
  { name: 'Strong text on light mint', fg: colors.darkTeal, bg: colors.lightMint },
  { name: 'Links on light mint', fg: colors.darkTeal, bg: colors.lightMint },
  { name: 'List markers on light mint', fg: colors.darkTeal, bg: colors.lightMint },
];
```

**Run:**
```bash
node scripts/check-contrast.js
```

**Expected Output:**
```
Strong text on light mint:
  Colors: #013a3b on #d0fdf2
  Ratio: 11.39:1
  WCAG AA: ✅ Pass
  WCAG AAA: ✅ Pass
```

### Step 7: Build and visually test all presentations

**Commands:**
```bash
make clean
make build
make build:pdf
```

**Test Presentations:**
1. `slides/2025-12-04-cloud-native-manchester.md` (60 slides)
   - **Focus:** Slide 4 ("What is IvySketch?")
   - **Verify:** "IvyBot", "Live Demo:" strong text is dark and readable
   - **Verify:** "https://ivysketch.me" link is dark and readable
   - **Verify:** Bullet points use dark markers

2. `slides/example-presentation.md`
   - **Verify:** No visual regressions

3. `slides/example-contribution.md`
   - **Verify:** No visual regressions

**Checklist:**
- [ ] Strong text readable on light backgrounds
- [ ] Links readable on light backgrounds
- [ ] List markers visible on light backgrounds
- [ ] Dark sections (`.dark` class) still show cyan text
- [ ] Title slides unaffected
- [ ] No layout shifts or breakage
- [ ] Hover effects work on links

### Step 8: Update accessibility audit report

**File:** `docs/accessibility-audit.md`

**Changes:**

Update "Issue Resolution" section (lines 9-20) to reflect this fix:

```markdown
## Issue Resolution

**Date Fixed:** 2025-12-03

### Fix 1: H1 Headings (Issue #22)
The H1 heading contrast issue was resolved by changing default H1 color from cyan to dark teal.

### Fix 2: Strong/Link/Marker Elements (Issue #25) ✅ **NEW**
**Date Fixed:** 2025-12-03

Additional accessibility issue resolved by implementing same pattern as H1 fix:
- Changed default strong/bold text color from cyan to dark teal
- Changed default link color from cyan to dark teal (hover shows cyan)
- Changed default list marker color from cyan to dark teal
- Dark section overrides ensure cyan remains visible on dark backgrounds

**Result:** ALL text elements now meet WCAG 2.1 Level AA standards across all backgrounds.
```

Update contrast analysis table (lines 42-51) to include new combinations:

```markdown
| 7 | **Strong text on light mint** | `#013a3b` | `#d0fdf2` | **11.39:1** | ✅ Pass | ✅ Pass | **Strong/bold emphasis ✅ Fixed** |
| 8 | **Links on light mint** | `#013a3b` | `#d0fdf2` | **11.39:1** | ✅ Pass | ✅ Pass | **Hyperlinks ✅ Fixed** |
| 9 | **List markers on light mint** | `#013a3b` | `#d0fdf2` | **11.39:1** | ✅ Pass | ✅ Pass | **Bullet/number markers ✅ Fixed** |
```

## Testing Strategy

### Visual Testing

**Test Case 1: Content slides with strong text**

**Setup:**
1. Build slides: `make build`
2. Open `slides/2025-12-04-cloud-native-manchester.md` in browser
3. Navigate to slide 4 ("What is IvySketch?")

**Verify:**
- [ ] "IvyBot" text is dark teal (#013a3b) and clearly readable
- [ ] "Live Demo:" text is dark teal (#013a3b) and clearly readable
- [ ] "LLM:", "Image Gen:", "Message Queue:" labels on later slides are readable
- [ ] No text appears washed out or invisible

**Expected Result:** All strong text has 11.39:1 contrast ratio and is easily readable

**Test Case 2: Links on content slides**

**Setup:**
1. Navigate to slide 4
2. Locate "https://ivysketch.me" link

**Verify:**
- [ ] Link text is dark teal and readable (not cyan)
- [ ] Link underline is visible
- [ ] Hover effect shows cyan color
- [ ] Link remains accessible and clickable

**Expected Result:** Links are readable by default, cyan accent appears on hover

**Test Case 3: List markers on content slides**

**Setup:**
1. Navigate to slide 4
2. Examine bullet point list

**Verify:**
- [ ] Bullet point markers are dark teal and visible
- [ ] Markers don't blend into background
- [ ] List hierarchy is clear

**Expected Result:** All list markers have 11.39:1 contrast ratio

**Test Case 4: Dark section slides (regression test)**

**Setup:**
1. Navigate to slides with `<!-- _class: dark -->` or `<!-- _class: title -->`
2. Example: Slide 3 ("Part 1: Introduction")

**Verify:**
- [ ] Strong text on dark backgrounds shows cyan (#02f4d5)
- [ ] Links on dark backgrounds show cyan
- [ ] List markers on dark backgrounds show cyan
- [ ] Cyan text is readable on dark teal background (8.93:1 contrast)

**Expected Result:** Dark sections maintain cyan accent color with good contrast

### Automated Testing

**Test Case 5: Contrast verification script**

**Setup:**
```bash
node scripts/check-contrast.js
```

**Expected Output:**
```
Edera V2 Theme - WCAG Contrast Audit

Dark teal on light mint:
  Colors: #013a3b on #d0fdf2
  Ratio: 11.39:1
  WCAG AA: ✅ Pass
  WCAG AAA: ✅ Pass

Cyan on dark teal:
  Colors: #02f4d5 on #013a3b
  Ratio: 8.93:1
  WCAG AA: ✅ Pass
  WCAG AAA: ✅ Pass

Light mint on dark teal:
  Colors: #d0fdf2 on #013a3b
  Ratio: 11.39:1
  WCAG AA: ✅ Pass
  WCAG AAA: ✅ Pass

All tests passed ✅
```

**Test Case 6: Build verification**

**Setup:**
```bash
make clean
make ci  # Run full CI workflow
```

**Verify:**
- [ ] HTML build succeeds without errors
- [ ] PDF build succeeds without errors
- [ ] No CSS warnings or errors
- [ ] All 3 presentations build successfully

**Expected Result:** Clean build with no errors or warnings

### Regression Testing

**Test Case 7: Existing presentations render correctly**

**Presentations to test:**
1. `slides/2025-12-04-cloud-native-manchester.md` (60 slides) - PRIMARY TEST
2. `slides/example-presentation.md` - Check basic theme elements
3. `slides/example-contribution.md` - Check contributor template

**For each presentation:**
- [ ] Build HTML and PDF versions
- [ ] Open in browser and scroll through all slides
- [ ] Verify no visual breakage or unexpected color changes
- [ ] Check that text remains readable throughout
- [ ] Verify dark sections still look correct
- [ ] Confirm no layout shifts

**Expected Result:** All presentations render correctly with improved accessibility

**Test Case 8: Playwright MCP browser inspection**

**Setup:**
```bash
npm run serve
# Use Playwright MCP to navigate to http://localhost:8080/2025-12-04-cloud-native-manchester.md
```

**Inspect slide 4:**
```javascript
const strong = document.querySelector('strong');
const link = document.querySelector('a');
const section = document.querySelector('section');

window.getComputedStyle(strong).color;  // Should be "rgb(1, 58, 59)"
window.getComputedStyle(link).color;    // Should be "rgb(1, 58, 59)"
window.getComputedStyle(section).backgroundColor;  // Should be "rgb(208, 253, 242)"
```

**Expected Result:** All computed colors match expected accessible values

## Success Criteria

- [x] Playwright MCP browser inspection confirms problematic colors (slide 4, slide 10)
- [ ] Strong/bold text uses dark teal by default in themes/edera-v2.css
- [ ] Links use dark teal by default with cyan hover effect
- [ ] List markers use dark teal by default
- [ ] Dark section overrides ensure cyan text on dark backgrounds
- [ ] Automated contrast verification script confirms all combinations pass WCAG AA
- [ ] Playwright browser inspection confirms `rgb(1, 58, 59)` for strong/link elements
- [ ] All 3 example presentations build successfully (HTML + PDF)
- [ ] Visual inspection confirms slide 4 "Live Demo" text is readable
- [ ] Visual inspection confirms no regressions on dark slides
- [ ] Accessibility audit report updated with new fix details
- [ ] All changes committed with proper conventional commit message

## Files Modified

1. **`themes/edera-v2.css`** - Fix strong/link/marker default colors and verify dark overrides
   - Lines 105-114: Update link color and hover behavior
   - Lines 116-120: Update strong/bold text color
   - Lines 142-150: Update list marker colors
   - After line 293: Add dark section list marker overrides (if missing)

2. **`docs/accessibility-audit.md`** - Document the fix and update compliance status
   - Lines 9-20: Add Issue #25 resolution details
   - Lines 42-51: Add new contrast ratio combinations to table
   - Update conclusion to reflect complete accessibility compliance

3. **`scripts/check-contrast.js`** - Add test cases for strong/link/marker combinations (optional enhancement)

## Related Issues and Tasks

### Depends On

- Issue #22 - Previous accessibility audit and H1 fix (provides pattern to follow)

### Blocks

None - this is a bug fix that unblocks presentation accessibility

### Related

- Issue #22 - Accessibility audit (provided baseline and identified H1 pattern)
- PR #23 - H1 color fix implementation (provides proven pattern)

### Enables

- Full WCAG 2.1 Level AA compliance for Edera V2 theme
- Confidence in using theme for public presentations
- Professional, accessible presentation materials

## References

- [GitHub Issue #25](https://github.com/denhamparry/talks/issues/25)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Related issue: [#22 - Accessibility Audit](https://github.com/denhamparry/talks/issues/22)
- Theme file: `themes/edera-v2.css`
- Accessibility audit: `docs/accessibility-audit.md`
- Presentation tested: `slides/2025-12-04-cloud-native-manchester.md`

## Notes

### Key Insights

1. **Pattern Replication:** Issue #22 successfully fixed H1 elements using "dark by default, cyan on dark sections" - this exact pattern applies to strong/link/marker elements

2. **Browser Inspection Critical:** Playwright MCP inspection revealed the actual colors being rendered (`rgb(2, 244, 213)` cyan on `rgb(208, 253, 242)` light mint = 1.28:1 contrast)

3. **Issue Description Partially Inaccurate:** The original issue mentioned "dark text on dark backgrounds" for code snippets, but inspection showed code blocks are already correct (light text on dark background). The real issue is **light cyan text on light backgrounds**.

4. **Systematic Problem:** The same accessibility violation affects THREE element types (strong, links, list markers), all using `var(--color-primary)` which is cyan

5. **Dark Section Pattern Already Exists:** The theme already has `.dark` overrides for h1/h2/h3, strong, and links (lines 280-293) - we just need to ensure list markers are included

### Alternative Approaches Considered

1. **Create accessible theme variant (edera-v2-accessible.css)** - Why not chosen ❌
   - Maintenance burden (duplicate CSS)
   - Fragments theme ecosystem
   - Existing presentations would need manual migration
   - Current approach fixes theme directly

2. **Change cyan to darker shade globally** - Why not chosen ❌
   - Breaks brand identity (Edera color must be #02f4d5)
   - Would make cyan less visible on dark backgrounds
   - Violates design specifications

3. **Fix strong/link/marker defaults, override on dark sections** - Why selected ✅
   - Matches proven successful H1 fix pattern
   - Maintains brand colors where appropriate
   - WCAG compliant by default
   - No breaking changes
   - Explicit overrides make intent clear

### Best Practices

**Accessibility-First CSS:**
- Default colors should always meet WCAG AA on default backgrounds
- Exceptions (like dark sections) should be explicitly overridden
- Add comments explaining accessibility compliance rationale

**Browser Inspection Tools:**
- Playwright MCP is excellent for verifying actual rendered colors
- Screenshots document the problem visually
- Computed styles confirm CSS is applying correctly

**Systematic Fixes:**
- When one element type has accessibility issue, check related elements
- Strong, links, and markers all use same problematic pattern
- Fix all instances in one PR to avoid multiple iterations

### Monitoring Approach

**Post-Implementation:**
1. Monitor GitHub issues for accessibility-related feedback
2. Re-run contrast verification script if colors change
3. Test new presentations with theme to ensure compliance
4. Update accessibility audit report if additional issues found

**Success Metrics:**
- Zero accessibility-related issues reported for Edera V2 theme
- All contrast combinations pass WCAG AA (>= 3:1 large text, >= 4.5:1 normal text)
- Positive feedback on presentation readability
- Theme used successfully in public presentations
