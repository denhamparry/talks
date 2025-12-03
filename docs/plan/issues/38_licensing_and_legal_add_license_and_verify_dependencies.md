# GitHub Issue #38: Licensing and Legal: Add LICENSE and verify dependencies

**Issue:** [#38](https://github.com/denhamparry/talks/issues/38)
**Status:** Open
**Labels:** documentation, enhancement
**Date:** 2025-12-03
**Related To:** Part of #34 - Prepare repository for public release

## Problem Statement

Ensure proper licensing is in place and all dependencies are compatible with the chosen license before public release of the repository.

### Current Behavior

✅ **License File:** LICENSE already exists at repository root
- **License Type:** MIT License
- **Copyright:** Copyright (c) 2025 Lewis Denham-Parry
- **Status:** Complete and properly formatted

❌ **License Documentation:** README.md has placeholder text `[Add your license here]` at README.md:387
- Needs to be updated to reference MIT License

✅ **Dependencies Reviewed:**
- All npm dependencies have compatible licenses (MIT, Apache-2.0, ISC, BSD)
- Package.json already declares `"license": "MIT"` at package.json:25

❌ **Third-Party Attribution:**
- Edera V2 theme attribution needs to be documented
- Theme was created from Google Slides SVG exports (original source by Lewis Denham-Parry)
- No external third-party code requiring attribution

❌ **Theme Licensing:**
- Edera V2 theme needs copyright notice in CSS file
- Theme attribution should be documented in theme-guide.md

### Expected Behavior

- LICENSE file exists and is complete ✅ **DONE**
- License choice documented in README ❌ **TODO**
- All dependencies reviewed for compatibility ✅ **DONE**
- Third-party attributions documented ❌ **TODO**
- No licensing conflicts identified ✅ **VERIFIED**
- Theme licensing clearly stated ❌ **TODO**

## Current State Analysis

### Relevant Code/Config

**1. LICENSE File (Already Complete)**
- **Location:** `/LICENSE`
- **Type:** MIT License
- **Copyright:** Copyright (c) 2025 Lewis Denham-Parry
- **Status:** ✅ Complete and properly formatted

**2. Package.json Dependencies**
- **Location:** `/package.json`
- **License Declaration:** `"license": "MIT"` at line 25
- **Dependencies:** 3 packages (all compatible with MIT)
  - `@marp-team/marp-cli@^4.2.3`
  - `@marp-team/marp-core@^3.9.0`
  - `wcag-contrast@3.0.0`

**3. Dependency License Summary (via npm license-checker)**
```
├─ MIT: 118 packages
├─ Apache-2.0: 17 packages
├─ ISC: 11 packages
├─ BSD-2-Clause: 9 packages
├─ BSD-3-Clause: 5 packages
├─ MIT-0: 4 packages
├─ Python-2.0: 1 package
└─ 0BSD: 1 package
```

**All licenses are compatible with MIT.**

**4. Edera V2 Theme**
- **Location:** `/themes/edera-v2.css`
- **Created From:** Google Slides SVG exports (original design by Lewis Denham-Parry)
- **Source Documentation:** `docs/plan/issues/1_port_google_slides_theme_to_marp_template.md`
- **Current Header:**
```css
/*
 * @theme edera-v2
 * @author Edera
 * @description Edera V2 presentation theme with dark teal and light mint colors
 * @version 2.0.0
 */
```

**5. README.md License Section**
- **Location:** `/README.md` line 387
- **Current Text:** `[Add your license here]`
- **Needs Update:** Should reference MIT License

### Related Context

- Repository is being prepared for public release (issue #34)
- This is a GitHub template repository for presentations
- All code was created as part of this project (no external code copied)
- Edera V2 theme was designed from original Google Slides by Lewis Denham-Parry
- MARP dependencies (@marp-team packages) are well-established open source projects

### License Compatibility Analysis

**MIT License (Chosen):**
- ✅ Simple and permissive
- ✅ Widely used and understood
- ✅ Allows commercial use
- ✅ Compatible with all dependency licenses
- ✅ No patent clause conflicts
- ✅ No copyleft requirements

**Dependency License Compatibility:**

| License Type | Count | Compatible with MIT? | Notes |
|--------------|-------|----------------------|-------|
| MIT | 118 | ✅ Yes | Same license, perfect compatibility |
| Apache-2.0 | 17 | ✅ Yes | Permissive, includes patent grant |
| ISC | 11 | ✅ Yes | Simplified MIT, fully compatible |
| BSD-2-Clause | 9 | ✅ Yes | Permissive, compatible |
| BSD-3-Clause | 5 | ✅ Yes | Permissive, compatible |
| MIT-0 | 4 | ✅ Yes | Public domain-like, compatible |
| Python-2.0 | 1 | ✅ Yes | Historical Python license, compatible |
| 0BSD | 1 | ✅ Yes | Public domain-like, compatible |

**Conclusion:** ✅ No licensing conflicts. All dependencies are compatible with MIT License.

## Solution Design

### Approach

Since the LICENSE file is already complete and all dependencies are compatible, this task focuses on:

1. **Documentation Updates:** Update README.md to properly reference MIT License
2. **Theme Attribution:** Add copyright notice to Edera V2 theme CSS
3. **Theme Documentation:** Document theme licensing in theme-guide.md
4. **Verification:** Create LICENSES.md documenting all dependency licenses

This approach ensures:
- Clear license communication in primary documentation
- Proper attribution for the custom theme
- Transparency about dependency licenses
- Compliance with open source best practices

### Implementation

**1. Update README.md License Section**

Replace placeholder text at line 387:

```markdown
## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Lewis Denham-Parry
```

**2. Add Copyright Notice to Edera V2 Theme**

Update CSS header in `themes/edera-v2.css`:

```css
/*
 * @theme edera-v2
 * @author Lewis Denham-Parry
 * @description Edera V2 presentation theme with dark teal and light mint colors
 * @version 2.0.0
 * @license MIT
 *
 * Copyright (c) 2025 Lewis Denham-Parry
 *
 * Original design created from Google Slides template.
 * Ported to MARP CSS theme for this project.
 */
```

**3. Document Theme Licensing in Theme Guide**

Add licensing section to `docs/theme-guide.md` after "Overview" section:

```markdown
## Licensing

**License:** MIT License
**Copyright:** Copyright (c) 2025 Lewis Denham-Parry

The Edera V2 theme is original work created for this project:
- Original design: Google Slides template by Lewis Denham-Parry
- MARP CSS implementation: Ported from SVG exports for this repository
- License: MIT (same as parent project)

You are free to:
- Use the theme in your own presentations
- Modify and customize the theme
- Distribute the theme with your projects
- Use commercially

See [LICENSE](../../LICENSE) file for complete terms.
```

**4. Create LICENSES.md for Dependency Attribution**

Create new file documenting all dependency licenses:

```markdown
# Third-Party Licenses

This project uses the following third-party dependencies:

## Direct Dependencies

### @marp-team/marp-cli (MIT)
- Version: ^4.2.3
- License: MIT
- Repository: https://github.com/marp-team/marp-cli

### @marp-team/marp-core (MIT)
- Version: ^3.9.0
- License: MIT
- Repository: https://github.com/marp-team/marp-core

### wcag-contrast (ISC)
- Version: 3.0.0
- License: ISC
- Repository: https://github.com/tmcw/wcag-contrast

## Dependency License Summary

This project includes 166 total dependencies (direct and transitive).

All dependency licenses are compatible with the MIT License of this project.

### License Distribution
- MIT: 118 packages (71%)
- Apache-2.0: 17 packages (10%)
- ISC: 11 packages (7%)
- BSD-2-Clause: 9 packages (5%)
- BSD-3-Clause: 5 packages (3%)
- MIT-0: 4 packages (2%)
- Python-2.0: 1 package (<1%)
- 0BSD: 1 package (<1%)

For a complete list of all dependencies and their licenses, run:

```bash
npm install
npx license-checker --summary
```

## Edera V2 Theme

**License:** MIT
**Copyright:** Copyright (c) 2025 Lewis Denham-Parry

The Edera V2 theme (`themes/edera-v2.css`) is original work created for this project:
- Original design by Lewis Denham-Parry (Google Slides)
- MARP CSS implementation by Lewis Denham-Parry
- No third-party code or assets

## License Compatibility

All third-party licenses used in this project are permissive and compatible with the MIT License:

- ✅ MIT - Fully compatible (same license)
- ✅ Apache-2.0 - Permissive, includes patent grant, compatible
- ✅ ISC - Simplified MIT, fully compatible
- ✅ BSD (2-Clause and 3-Clause) - Permissive, compatible
- ✅ MIT-0 - Public domain-like, compatible
- ✅ Python-2.0 - Historical license, compatible
- ✅ 0BSD - Public domain-like, compatible

## Notes

- This project contains no GPL, LGPL, or other copyleft licenses
- All dependencies allow commercial use and redistribution
- No special attribution requirements beyond standard MIT terms
- Font licenses: Using system fonts only (no custom font files)
```

### Benefits

- **Compliance:** Meets open source licensing requirements for public release
- **Transparency:** Clear documentation of all licenses and dependencies
- **Attribution:** Proper credit given to theme author and dependency authors
- **Usability:** Others can confidently use and fork the template
- **Best Practice:** Follows industry standards for license documentation

## Implementation Plan

### Step 1: Update README.md License Section
**File:** `README.md`

**Changes:**
Replace line 387 placeholder `[Add your license here]` with:

```markdown
## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Lewis Denham-Parry
```

**Testing:**
```bash
# Verify README renders correctly
cat README.md | grep -A 3 "## 📝 License"
```

### Step 2: Add Copyright Notice to Edera V2 Theme
**File:** `themes/edera-v2.css`

**Changes:**
Replace lines 1-6 (theme header comment) with:

```css
/*
 * @theme edera-v2
 * @author Lewis Denham-Parry
 * @description Edera V2 presentation theme with dark teal and light mint colors
 * @version 2.0.0
 * @license MIT
 *
 * Copyright (c) 2025 Lewis Denham-Parry
 *
 * Original design created from Google Slides template.
 * Ported to MARP CSS theme for this project.
 */
```

**Note:** Version number kept at 2.0.0 as this is a documentation-only change. Optionally, you could bump to 2.0.1 to track licensing documentation updates.

**Testing:**
```bash
# Verify theme header
head -12 themes/edera-v2.css

# Verify theme still works in MARP
npm run build
```

### Step 3: Document Theme Licensing in Theme Guide
**File:** `docs/theme-guide.md`

**Changes:**
Add new "Licensing" section after line 27 (after "Overview" section):

```markdown
## Licensing

**License:** MIT License
**Copyright:** Copyright (c) 2025 Lewis Denham-Parry

The Edera V2 theme is original work created for this project:
- Original design: Google Slides template by Lewis Denham-Parry
- MARP CSS implementation: Ported from SVG exports for this repository
- License: MIT (same as parent project)

You are free to:
- Use the theme in your own presentations
- Modify and customize the theme
- Distribute the theme with your projects
- Use commercially

See [LICENSE](../../LICENSE) file for complete terms.

```

**Testing:**
```bash
# Verify section added correctly
grep -A 10 "## Licensing" docs/theme-guide.md
```

### Step 4: Create LICENSES.md for Dependencies
**File:** `LICENSES.md` (new file at repository root)

**Changes:**
Create new file with complete dependency license documentation (see content in Solution Design section above).

**Testing:**
```bash
# Verify file created
ls -la LICENSES.md

# Verify license checker command works
npm install
npx license-checker --summary
```

### Step 5: Update Table of Contents
**File:** `docs/theme-guide.md`

**Changes:**
Add link to new Licensing section in Table of Contents at line 8 (after Overview, before Color Scheme):

```markdown
- [Overview](#overview)
- [Licensing](#licensing)  <!-- ADD THIS LINE -->
- [Color Scheme](#color-scheme)
```

**Testing:**
```bash
# Verify TOC updated correctly
grep -A 2 "- \[Overview\]" docs/theme-guide.md
```

## Testing Strategy

### Unit Testing

**Test 1: Verify LICENSE file is complete**
```bash
# Should show MIT License header
head -1 LICENSE | grep "MIT License"

# Should show copyright year 2025
grep "Copyright (c) 2025" LICENSE
```

**Test 2: Verify package.json license declaration**
```bash
# Should show "license": "MIT"
grep '"license": "MIT"' package.json
```

**Test 3: Verify all dependency licenses**
```bash
npm install
npx license-checker --summary
# All licenses should be compatible with MIT
```

### Integration Testing

**Test Case 1: README License Section**
1. Open README.md in GitHub preview
2. Scroll to License section (line ~387)
3. **Expected:** MIT License statement visible (no placeholder text)
4. **Expected:** Link to LICENSE file works

**Test Case 2: Theme Copyright Notice**
1. Open themes/edera-v2.css
2. Check header comment (lines 1-12)
3. **Expected:** Copyright (c) 2025 Lewis Denham-Parry visible
4. **Expected:** MIT license mentioned
5. **Expected:** @author shows "Lewis Denham-Parry"

**Test Case 3: Theme Still Builds**
1. Run `npm run build`
2. **Expected:** Build succeeds without errors
3. **Expected:** Slides render with Edera V2 theme correctly
4. **Expected:** No CSS parsing errors

**Test Case 4: LICENSES.md is Complete**
1. Open LICENSES.md
2. **Expected:** All 3 direct dependencies listed
3. **Expected:** License summary shows 166 packages
4. **Expected:** Edera V2 theme attribution included
5. **Expected:** License compatibility section present

**Test Case 5: Theme Guide Documentation**
1. Open docs/theme-guide.md
2. Check for "Licensing" section
3. **Expected:** MIT License clearly stated
4. **Expected:** Copyright notice present
5. **Expected:** Usage rights explained

### Regression Testing

**Verify existing functionality still works:**
- [ ] MARP builds complete successfully (HTML and PDF)
- [ ] Theme CSS loads without errors
- [ ] Slide rendering is unchanged
- [ ] No broken links in documentation
- [ ] README.md renders correctly on GitHub
- [ ] All existing documentation links work

### Documentation Verification

**Check all documentation files:**
```bash
# Verify no more placeholder text
grep -r "\[Add your license here\]" .
# Expected: No results

# Verify copyright notices
grep -r "Copyright (c) 2025 Lewis Denham-Parry" .
# Expected: LICENSE, themes/edera-v2.css, README.md, docs/theme-guide.md, LICENSES.md

# Verify MIT License references
grep -r "MIT License" .
# Expected: Multiple files reference MIT License correctly
```

## Success Criteria

### Already Complete ✅

- [x] LICENSE file exists and is complete
- [x] Package.json declares MIT License
- [x] All dependencies reviewed for compatibility (verified - no conflicts)
- [x] No licensing conflicts identified (verified)

### To Be Completed 📝

- [ ] README.md references MIT License (no placeholder text)
- [ ] Edera V2 theme has copyright notice in CSS file
- [ ] Theme licensing documented in theme-guide.md
- [ ] LICENSES.md created with dependency attributions
- [ ] Theme still builds successfully after changes
- [ ] All documentation links working

## Files Modified

1. `README.md` - Update license section (line 387)
2. `themes/edera-v2.css` - Add copyright notice to header comment (lines 1-12)
3. `docs/theme-guide.md` - Add licensing section after Overview
4. `LICENSES.md` - Create new file documenting all dependency licenses

## Related Issues and Tasks

### Depends On
- None (can be completed independently)

### Blocks
- #34 - Prepare repository for public release (this is a subtask)

### Related
- #35 - Code review audit for public release
- Issue #1 - Original theme creation (provides context on Edera V2 origin)

### Enables
- Public release of repository
- Forking and reuse of template by others
- Commercial use of presentations
- Distribution of presentations

## References

- [GitHub Issue #38](https://github.com/denhamparry/talks/issues/38)
- [GitHub Issue #34](https://github.com/denhamparry/talks/issues/34) - Parent issue (public release)
- [Choose a License](https://choosealicense.com/)
- [SPDX License List](https://spdx.org/licenses/)
- [npm license-checker](https://www.npmjs.com/package/license-checker)
- [MIT License Text](https://opensource.org/licenses/MIT)

## Notes

### Key Insights

1. **Most work already done:** LICENSE file is complete and properly formatted
2. **No conflicts:** All 166 dependencies are compatible with MIT License
3. **Original work:** Edera V2 theme is original (no third-party attribution needed)
4. **Documentation focus:** Remaining work is primarily documentation updates
5. **Low risk:** Changes are documentation-only (no code changes required)

### Alternative Approaches Considered

1. **NOTICE file instead of LICENSES.md** ❌
   - Not chosen: NOTICE files are typically for Apache-2.0 projects
   - MIT projects commonly use LICENSES.md or LICENSE-THIRD-PARTY.md
   - LICENSES.md is more descriptive for this use case

2. **License headers in all source files** ❌
   - Not chosen: Not common for small template repositories
   - MIT License doesn't require per-file headers
   - Project LICENSE file is sufficient
   - Would add unnecessary boilerplate to markdown files

3. **Separate theme license file** ❌
   - Not chosen: Theme is original work by same author
   - Keeping under project MIT License is simpler
   - No need to manage multiple licenses
   - CSS header comment is sufficient attribution

4. **Chosen Approach: Documentation-focused updates** ✅
   - Update README.md to reference existing LICENSE
   - Add copyright notice to theme CSS header
   - Create LICENSES.md for transparency
   - Document theme licensing in guide
   - Minimal changes, maximum clarity

### Best Practices

**License Documentation:**
- Always include LICENSE file at repository root ✅
- Reference license clearly in README ✅
- Include copyright year and holder ✅
- Use SPDX license identifiers (MIT) ✅

**Theme Attribution:**
- Add copyright notice to CSS files
- Document theme licensing in guides
- Credit original designers
- Specify license terms clearly

**Dependency Management:**
- Review all dependency licenses before release
- Document third-party licenses
- Verify license compatibility
- Use license-checker tools for verification

**Public Release Checklist:**
- LICENSE file present ✅
- README references license ⏳
- Dependencies reviewed ✅
- Third-party attributions documented ⏳
- No licensing conflicts ✅
- Copyright notices added ⏳
