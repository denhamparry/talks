# GitHub Issue #70: Add QR code to final slide of Road to Multitenancy presentation

**Issue:** [#70](https://github.com/denhamparry/talks/issues/70)
**Status:** Open
**Date:** 2026-01-14
**Labels:** documentation, enhancement

## Problem Statement

The "Road to Multitenancy" presentation (slides/2026-01-14-road-to-multitenancy.md) currently has a final "Thank You" slide with resources but no easy way for attendees to access the slide deck from their mobile devices.

### Current Behavior

- Final slide lists resources as text links
- Attendees must manually type URLs to access the deck later
- No mobile-friendly way to save the presentation URL
- Attendees may miss the opportunity to review content after the presentation

### Expected Behavior

- QR code displayed on final slide linking to: https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html
- Attendees can scan QR code with their phones to instantly access the deck
- QR code is prominently displayed and easily scannable
- Maintains the existing slide layout and resources

## Current State Analysis

### Presentation File

**File:** `slides/2026-01-14-road-to-multitenancy.md`
**Lines:** 717 lines total
**Final slide:** Lines 675-717

**Current final slide structure:**

```markdown
<!-- _class: title -->

## Thank You, Questions?

Lewis Denham-Parry
[Edera.dev](https://edera.dev)

### Resources:

🌐 [edera.dev](https://edera.dev)
⌨️ [demo.edera.dev](https://demo.edera.dev)
💻 [github.com/edera-dev](https://github.com/edera-dev)
🔒 [github.com/edera-dev/am-i-isolated](https://github.com/edera-dev/am-i-isolated)
```

**Slide class:** `.title` (dark teal background with cyan/light mint text)

### Existing QR Code Pattern

The project already has an example of QR code usage in `slides/2025-12-04-cloud-native-manchester.md:104-108`:

```markdown
<div style="text-align: center; margin-top: 1rem;">
  <img src="./assets/2025-12-04-cloud-native-manchester/ivysketch-qr.png" alt="IvySketch QR Code" style="width: 200px; height: 200px;">
</div>
```

**Pattern identified:**
- QR code images stored in `slides/assets/<presentation-date-name>/`
- Embedded using HTML `<img>` tag with inline styles
- Fixed size: 200x200 pixels
- Centered with margin-top spacing

### Assets Directory Structure

```
slides/assets/
├── 2025-12-04-cloud-native-manchester/
│   ├── ivy-train-to-manchester.png
│   ├── ivysketch-qr.png
│   └── supremacy-book-cover.png
└── ederav2/
    └── edera-logo.png
```

**Required directory:** `slides/assets/2026-01-14-road-to-multitenancy/`
**Required file:** `road-to-multitenancy-qr.png` (200x200 PNG)

### Theme Considerations

**Theme:** Edera V2 (defined in themes/edera-v2.css)

**Title slide styling:**
- Dark teal background (#013a3b)
- Light mint text (#d0fdf2) for body
- Cyan accent (#02f4d5) for headings and links
- Centered content (vertical and horizontal)

**Contrast considerations:**
- QR code should be white background with black pattern (standard QR format)
- Will contrast well against dark teal background
- 200x200px size is sufficient for scanability in presentations

### Build Process

**Build script:** `package.json:14`
```json
"build": "marp -I slides/ -o dist/ && npm run copy-assets && npm run generate-index && npm run generate-favicon"
```

**Asset copying:** `package.json:12`
```json
"copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/ && [ -d slides/assets ] && cp -r slides/assets/* dist/assets/ || true"
```

**Process:**
1. MARP converts markdown to HTML in `dist/`
2. Assets from `slides/assets/` are copied to `dist/assets/`
3. Images referenced as `./assets/<dir>/<file>` resolve correctly in both dev and production

## Solution Design

### Approach

Add a QR code to the final slide using the established pattern from the Cloud Native Manchester presentation. The QR code will link to the deployed presentation URL and be positioned below the resources list.

### Rationale

1. **Proven pattern:** Reuse existing QR code implementation from 2025-12-04-cloud-native-manchester.md
2. **Mobile-friendly:** QR codes provide instant access from phones without typing
3. **Scanability:** 200x200px size is sufficient for presentation display and scanning
4. **Theme compatibility:** White QR code on dark background provides excellent contrast
5. **No breaking changes:** Uses standard HTML/CSS within markdown, supported by MARP

### Implementation Details

#### Step 1: Generate QR Code Image

**Target URL:** https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html

**QR Code Requirements:**
- Format: PNG
- Size: 200x200 pixels
- Content: URL to deployed presentation
- Background: White (for contrast on dark slide)
- Foreground: Black (standard QR pattern)
- Error correction: Medium (15% - M level is standard for URLs)

**Generation options:**
- Online tool: qr-code-generator.com, qrcode-monkey.com
- CLI tool: `qrencode` (if installed)
- Node.js package: `qrcode` (can be added to project)

**Filename:** `road-to-multitenancy-qr.png`
**Storage path:** `slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png`

#### Step 2: Create Assets Directory

Create directory for presentation-specific assets:

```bash
mkdir -p slides/assets/2026-01-14-road-to-multitenancy
```

#### Step 3: Update Final Slide

**File:** `slides/2026-01-14-road-to-multitenancy.md`
**Lines to modify:** 675-717 (final slide)

**Current markdown:**
```markdown
<!-- _class: title -->

## Thank You, Questions?

Lewis Denham-Parry
[Edera.dev](https://edera.dev)

### Resources:

🌐 [edera.dev](https://edera.dev)
⌨️ [demo.edera.dev](https://demo.edera.dev)
💻 [github.com/edera-dev](https://github.com/edera-dev)
🔒 [github.com/edera-dev/am-i-isolated](https://github.com/edera-dev/am-i-isolated)

<!--
Speaker Notes:
...
-->
```

**Updated markdown:**
```markdown
<!-- _class: title -->

## Thank You, Questions?

Lewis Denham-Parry
[Edera.dev](https://edera.dev)

### Resources:

🌐 [edera.dev](https://edera.dev)
⌨️ [demo.edera.dev](https://demo.edera.dev)
💻 [github.com/edera-dev](https://github.com/edera-dev)
🔒 [github.com/edera-dev/am-i-isolated](https://github.com/edera-dev/am-i-isolated)

<div style="text-align: center; margin-top: 2rem;">
  <img src="./assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png" alt="Scan to access slides" style="width: 200px; height: 200px;">
</div>

<!--
Speaker Notes:
...
-->
```

**Changes:**
- Add QR code after resources list
- Use consistent styling from existing QR code pattern
- Set `margin-top: 2rem` for spacing from resources
- Alt text: "Scan to access slides" (clear, descriptive)
- Inline CSS maintains MARP compatibility

### Benefits

✅ **User Experience:** Attendees can quickly save presentation URL from their phones
✅ **Scanability:** 200x200px size ensures reliable scanning from presentation screens
✅ **Theme Integration:** White QR code contrasts perfectly with dark teal title slide background
✅ **Consistency:** Follows established pattern from Cloud Native Manchester presentation
✅ **Mobile-Friendly:** QR codes are the standard way to bridge physical presentations to digital devices
✅ **Low Risk:** No code changes required, only asset addition and markdown update

## Implementation Plan

### Step 1: Create Assets Directory

**Command:**
```bash
mkdir -p slides/assets/2026-01-14-road-to-multitenancy
```

**Verification:**
```bash
ls -la slides/assets/2026-01-14-road-to-multitenancy
```

### Step 2: Generate QR Code Image

**URL to encode:** `https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html`

**Option A: Using online tool (recommended for quick generation)**
1. Visit: https://qrcode-monkey.com or https://www.qr-code-generator.com
2. Enter URL: `https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html`
3. Set size: 200x200 pixels
4. Download as PNG
5. Save to: `slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png`

**Option B: Using qrencode CLI (if installed)**
```bash
qrencode -o slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png \
  -s 10 \
  -m 2 \
  -l M \
  "https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html"
```

**Option C: Using Node.js qrcode package**
```bash
npm install --save-dev qrcode
node -e "const QRCode = require('qrcode'); QRCode.toFile('slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png', 'https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html', { width: 200, margin: 2, errorCorrectionLevel: 'M' }, (err) => { if (err) throw err; console.log('QR code generated'); });"
```

**Verification:**
```bash
file slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png
# Expected: PNG image data, 200 x 200
```

### Step 3: Update Final Slide with QR Code

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Edit location:** After line 689 (after the resources list, before speaker notes)

**Add the following markdown:**
```markdown

<div style="text-align: center; margin-top: 2rem;">
  <img src="./assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png" alt="Scan to access slides" style="width: 200px; height: 200px;">
</div>
```

**Context:** Insert between the resources list and the speaker notes comment block.

### Step 4: Build and Test Locally

**Build HTML:**
```bash
npm run build
```

**Verify build output:**
```bash
ls -la dist/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png
```

**Serve locally:**
```bash
npm run serve:dist
```

**Manual testing:**
1. Open browser to http://localhost:8080
2. Click on "2026-01-14-road-to-multitenancy.html"
3. Navigate to final slide (press End key or click through)
4. Verify QR code is visible below resources
5. Verify QR code is centered
6. Verify spacing looks appropriate (2rem margin-top)

### Step 5: Test QR Code Scanning

**Using mobile device:**
1. Open camera app on phone (iPhone/Android)
2. Point at QR code on computer screen
3. Verify URL appears: https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html
4. Tap URL to verify it opens correctly (if site is already deployed)

**Alternative: Using QR decoder tool**
```bash
# If zbarimg is installed
zbarimg slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png
```

Expected output:
```
QR-Code:https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html
```

### Step 6: Visual Inspection

**Checklist:**
- [ ] QR code is visible on final slide
- [ ] QR code is centered horizontally
- [ ] QR code has appropriate spacing from resources list (2rem margin-top)
- [ ] QR code size is 200x200px (neither too large nor too small)
- [ ] QR code contrasts well against dark teal background
- [ ] QR code does not obscure speaker notes or other content
- [ ] Slide layout remains balanced and professional

### Step 7: Test in PDF Export

**Generate PDF:**
```bash
npm run build:pdf
```

**Verify PDF:**
```bash
open dist/2026-01-14-road-to-multitenancy.pdf
```

**PDF testing:**
- [ ] Navigate to final page
- [ ] QR code is visible in PDF
- [ ] QR code is scannable from PDF (test with phone camera)
- [ ] Layout is preserved in PDF format

## Testing Strategy

### Unit Testing

**Not applicable** - This is a content/asset change, not code functionality.

### Integration Testing

**Test 1: Asset Copy Process**

1. Clean build artifacts: `npm run clean`
2. Generate QR code: (execute Step 2 from implementation plan)
3. Build slides: `npm run build`
4. Verify asset copied: `ls dist/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png`

**Expected result:** Asset exists in dist/ after build.

**Test 2: HTML Rendering**

1. Build slides: `npm run build`
2. Serve locally: `npm run serve:dist`
3. Open http://localhost:8080/2026-01-14-road-to-multitenancy.html
4. Navigate to final slide
5. Inspect element to verify `<img>` tag rendered

**Expected result:**
```html
<div style="text-align: center; margin-top: 2rem;">
  <img src="./assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png" alt="Scan to access slides" style="width: 200px; height: 200px;">
</div>
```

**Test 3: QR Code Scanability**

1. Display final slide on computer screen
2. Open camera app on mobile device
3. Point camera at QR code
4. Verify URL detected: https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html

**Expected result:** Camera app recognizes QR code and displays URL.

**Test 4: Cross-Browser Testing**

Test on multiple browsers to ensure consistent rendering:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

**Expected result:** QR code displays consistently across all browsers.

**Test 5: Mobile Responsive**

1. Open presentation on mobile browser (or use browser dev tools mobile emulation)
2. Navigate to final slide
3. Verify QR code is visible and appropriately sized

**Expected result:** QR code scales appropriately on mobile devices.

### Regression Testing

**Verify existing functionality not broken:**

1. **Build process:**
   ```bash
   npm run build
   npm run build:pdf
   ```
   Expected: Both commands succeed without errors

2. **All slides render:**
   - Open http://localhost:8080/2026-01-14-road-to-multitenancy.html
   - Navigate through all slides (1-19)
   - Verify no layout issues or missing images

3. **Other presentations unaffected:**
   ```bash
   ls dist/*.html
   ```
   Verify all existing presentations still build correctly

4. **Speaker notes preserved:**
   - View final slide
   - Check browser dev tools or PDF export
   - Verify speaker notes still present and formatted correctly

### Manual Testing Checklist

**Before committing:**

- [ ] QR code file exists at correct path
- [ ] QR code is 200x200 PNG
- [ ] QR code encodes correct URL
- [ ] Build succeeds without errors
- [ ] HTML output includes QR code on final slide
- [ ] PDF output includes QR code on final page
- [ ] QR code scans correctly with mobile device
- [ ] No layout issues introduced
- [ ] Spacing and alignment look professional
- [ ] Other presentations still build correctly

## Success Criteria

- [x] QR code generated for URL: https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html
- [ ] QR code image saved to: `slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png`
- [ ] Final slide updated with QR code HTML
- [ ] Build process succeeds (HTML and PDF)
- [ ] QR code is visible on final slide in browser
- [ ] QR code is visible in PDF export
- [ ] QR code scans correctly on mobile devices
- [ ] QR code layout is centered and professional
- [ ] Spacing from resources list is appropriate (2rem)
- [ ] No breaking changes to other slides or presentations
- [ ] Speaker notes remain intact

## Files Modified

1. `slides/2026-01-14-road-to-multitenancy.md` - Add QR code HTML to final slide (line ~690)
2. `slides/assets/2026-01-14-road-to-multitenancy/road-to-multitenancy-qr.png` - New QR code image file

## Related Issues and Tasks

### Depends On

- None - This is a standalone enhancement

### Blocks

- None - This is a final polish before presentation

### Related

- Issue #58: Review and update IvySketch talk - Similar QR code pattern used
- Issue #21: Add Cloud Native Manchester talk - Established QR code pattern
- Issue #68: Update Road to Multitenancy slide deck - This is a follow-up enhancement

### Enables

- Attendees can easily access slides from mobile devices during/after presentation
- Increased engagement with presentation content post-talk
- Easy sharing of presentation URL via QR code scanning

## References

- [GitHub Issue #70](https://github.com/denhamparry/talks/issues/70)
- [QR Code specification](https://en.wikipedia.org/wiki/QR_code)
- [Example: Cloud Native Manchester QR code](slides/2025-12-04-cloud-native-manchester.md:104-108)
- [MARP HTML support](https://marpit.marp.app/markdown)
- [Deployed presentation URL](https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html)

## Notes

### Key Insights

1. **Established pattern exists:** The project already has a QR code implementation in the Cloud Native Manchester presentation, providing a proven template to follow.

2. **MARP HTML compatibility:** MARP supports inline HTML and CSS in markdown, making QR code integration straightforward without theme modifications.

3. **Theme contrast is ideal:** The Edera V2 title slide (dark teal background) provides excellent contrast for a standard white QR code with black pattern.

4. **Asset management is automated:** The build process already handles copying assets from `slides/assets/` to `dist/assets/`, so no build script changes needed.

5. **Size matters for scanability:** 200x200px is the established standard in the project and provides sufficient resolution for reliable QR code scanning from presentation screens.

### Alternative Approaches Considered

1. **Plain text URL instead of QR code**
   - Why not chosen: ❌ Requires manual typing, error-prone, not mobile-friendly
   - QR codes provide instant mobile access without typing

2. **Larger QR code (300x300 or 400x400)**
   - Why not chosen: ❌ May dominate the slide, reduce visual balance
   - 200x200px is proven sufficient in existing presentations

3. **QR code with custom styling (colored, logo in center)**
   - Why not chosen: ❌ Adds complexity, may reduce scanability
   - Standard black/white QR codes are most reliable

4. **Dynamic QR code generation in build script**
   - Why not chosen: ❌ Over-engineering for a single QR code
   - ✅ Manual generation is simpler and sufficient
   - Could be revisited if many QR codes needed in future

5. **QR code in slide footer/header**
   - Why not chosen: ❌ Would require theme modification
   - ✅ Inline HTML is simpler and localized to one slide

### Best Practices Applied

1. **Reuse established patterns:** Follow existing QR code implementation from Cloud Native Manchester talk
2. **Minimal changes:** Only modify the specific slide that needs the QR code
3. **No breaking changes:** Use inline HTML/CSS, no theme or build process modifications
4. **Test thoroughly:** Verify scanability with actual mobile devices before presenting
5. **Consistent sizing:** Use 200x200px to match existing QR code patterns in project
6. **Descriptive alt text:** "Scan to access slides" clearly describes the action

### QR Code Generation Options

**Recommendation:** Use online tool (qrcode-monkey.com or qr-code-generator.com) for quick one-off generation.

**Future enhancement:** If multiple presentations need QR codes, consider adding `qrcode` npm package and automating generation in build script.

### Presentation Considerations

1. **Test on actual presentation hardware:** QR code scanability depends on screen quality, room lighting, and viewing distance
2. **Mention the QR code:** In speaker notes, remind to tell attendees about the QR code
3. **Pause for scanning:** Give attendees 10-15 seconds to scan the QR code before moving on
4. **Alternative access:** Still provide verbal URL for attendees without mobile devices

### Monitoring and Feedback

After presenting with QR code:
- Observe how many attendees scan the QR code
- Ask for feedback on QR code visibility and scanability
- Consider adding QR codes to other presentations if successful

## Version

**Plan Version:** 1.0
**Created:** 2026-01-14
**Last Updated:** 2026-01-14
