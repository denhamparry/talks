# GitHub Issue #14: Update contributing guidelines with speaker notes and presenter attribution

**Issue:** [#14](https://github.com/denhamparry/talks/issues/14)
**Status:** Complete
**Date:** 2025-12-03

## Problem Statement

The contributing guidelines need to be enhanced to include two critical aspects for presentation contributions:

1. **Speaker Notes Guidelines**: Contributors need clear instructions on how to add speaker notes to their presentations, including best practices and examples.
2. **Presenter Attribution**: All documentation must consistently reference the correct presenter information (Lewis Denham-Parry, lewis@denhamparry.co.uk) to ensure proper attribution across all presentations.

### Current Behavior

- CONTRIBUTING.md exists but lacks speaker notes guidance
- docs/marp-usage.md contains some speaker notes information (lines 605-654) but it's buried in the advanced features section
- Presenter attribution is inconsistent across templates
- No clear best practices or examples for writing effective speaker notes

### Expected Behavior

- CONTRIBUTING.md has a dedicated section on speaker notes with clear examples
- Presenter attribution is clearly documented and consistently applied
- Templates include proper attribution placeholders
- Contributors understand when and how to use speaker notes effectively

## Current State Analysis

### Relevant Code/Config

**CONTRIBUTING.md** (`/Users/lewis/git/denhamparry/talks/gh-issue-014/CONTRIBUTING.md`)
- Lines 1-167: General contributing guidelines
- Lines 12-34: Slide contribution section exists
- **Missing**: Speaker notes section
- **Missing**: Presenter attribution guidelines

**docs/marp-usage.md** (`/Users/lewis/git/denhamparry/talks/gh-issue-014/docs/marp-usage.md`)
- Lines 605-654: Speaker notes section exists (GOOD EXAMPLE)
- Contains proper syntax, best practices, and examples
- Needs to be referenced from CONTRIBUTING.md

**templates/basic-presentation.md** (`/Users/lewis/git/denhamparry/talks/gh-issue-014/templates/basic-presentation.md`)
- Lines 12-13: Generic attribution "Your Name | Event/Conference | Date"
- Lines 126-128: Generic contact info in closing slide
- **Needs**: Reference to presenter attribution guidelines

**templates/contributor-template.md** (`/Users/lewis/git/denhamparry/talks/gh-issue-014/templates/contributor-template.md`)
- Lines 26-30: Generic attribution placeholder
- Lines 288-290: Generic contact info
- **Missing**: Speaker notes examples in inline instructions
- **Needs**: Reference to presenter attribution guidelines

**slides/example-presentation.md**
- Contains excellent speaker notes examples throughout (lines 18-23, 42-47, 66-71, etc.)
- Uses format:
  ```markdown
  <!--
  Speaker Notes:
  - Point 1
  - Point 2
  -->
  ```

### Related Context

- Issue #14 is labeled "documentation"
- Directly relates to contributor experience
- Impacts all presentation submissions
- Builds on existing MARP documentation
- Presenter: Lewis Denham-Parry (lewis@denhamparry.co.uk)

## Solution Design

### Approach

Add comprehensive speaker notes guidance to CONTRIBUTING.md by:

1. **Create dedicated speaker notes section** in CONTRIBUTING.md with:
   - Clear explanation of what speaker notes are
   - When to use them (live presentations vs. shared slides)
   - How to add them in MARP (HTML comment syntax)
   - Best practices for writing effective notes
   - Complete examples from example-presentation.md
   - Reference to detailed docs/marp-usage.md section

2. **Add presenter attribution section** in CONTRIBUTING.md with:
   - Clear specification: Lewis Denham-Parry (lewis@denhamparry.co.uk)
   - Where to include attribution (templates, slides)
   - Consistency requirements across documentation

3. **Update templates** to reference guidelines:
   - Add inline comments in templates pointing to CONTRIBUTING.md speaker notes section
   - Include attribution guidance in template instructions
   - Maintain existing template structure

4. **Cross-reference documentation**:
   - Link CONTRIBUTING.md to docs/marp-usage.md speaker notes section
   - Ensure consistent terminology across all docs

### Rationale

- Leverage existing excellent speaker notes examples from example-presentation.md
- Reference detailed technical documentation in marp-usage.md instead of duplicating
- Keep CONTRIBUTING.md as the single source of truth for contributors
- Maintain focus on contributor-friendly instructions
- Ensure proper attribution is documented and applied consistently

### Benefits

- Contributors know exactly how to add speaker notes
- Reduces maintainer burden answering "how do I add speaker notes?"
- Ensures consistency in speaker notes format across presentations
- Proper presenter attribution across all documentation
- Improves quality of submitted presentations
- Makes presentations more useful for live delivery

## Implementation Plan

### Step 1: Add Speaker Notes Section to CONTRIBUTING.md

**File:** `CONTRIBUTING.md`

**Changes:**

Add new section after "Contributing Slide Content" (after line 34):

```markdown
### Speaker Notes

Speaker notes are hidden comments in your slides that only you (the presenter) see. They're incredibly useful for live presentations!

**When to use speaker notes:**
- Adding timing cues ("spend 2 minutes here")
- Including talking points you don't want on slides
- Noting questions to ask the audience
- Remembering key statistics or quotes
- Adding pronunciation guides for technical terms

**How to add speaker notes:**

Use HTML comments in your markdown:

\```markdown
# My Slide Title

Content visible to audience

<!--
Speaker Notes:
- This text is only visible to you
- Great for timing cues
- Add talking points
- Remember key statistics
-->
\```

**Best practices:**
- Keep notes concise and bullet-pointed
- Add timing estimates (e.g., "Spend 2 minutes here")
- Include questions to engage audience
- Note common Q&A topics
- Add pronunciation guides for technical terms

**Viewing your speaker notes:**

When presenting from HTML (not PDF):
1. Open the HTML file in a browser
2. View page source (Ctrl+U / Cmd+Option+U)
3. Look for HTML comments containing your notes
4. Or use browser developer tools (F12)

**Complete examples:**

See `slides/example-presentation.md` for real-world examples of speaker notes throughout a presentation.

**Detailed documentation:**

For advanced speaker notes features and troubleshooting, see the [Speaker Notes section in the MARP Usage Guide](docs/marp-usage.md#adding-speaker-notes).
```

**Testing:**
```bash
# Verify markdown renders correctly
npm run build
# Check that section appears in CONTRIBUTING.md
```

### Step 2: Add Presenter Attribution Section to CONTRIBUTING.md

**File:** `CONTRIBUTING.md`

**Changes:**

Add new section after Speaker Notes section:

```markdown
### Presenter Attribution

All presentations in this repository should include proper attribution.

**Default Presenter:**
- **Name:** Lewis Denham-Parry
- **Email:** lewis@denhamparry.co.uk

**Where to include attribution:**

1. **Title slide** (opening slide):
   ```markdown
   <!-- _class: title -->

   # Your Talk Title

   ## Your Subtitle

   Lewis Denham-Parry | Event Name | Date
   ```

2. **Closing slide** (thank you slide):
   ```markdown
   <!-- _class: title -->

   # Thank You

   ## Questions?

   Lewis Denham-Parry
   lewis@denhamparry.co.uk
   @denhamparry
   ```

**For external contributors:**

If you're contributing slides from your own presentations:
- Use your own name and contact information
- Follow the same attribution format
- Include your preferred contact method (email, social handle, website)

**Template reference:**

All presentation templates include attribution placeholders. Replace the placeholder text with the appropriate presenter information.
```

**Testing:**
```bash
# Verify attribution format is clear
cat CONTRIBUTING.md | grep -A 5 "Presenter Attribution"
```

### Step 3: Update contributor-template.md with Speaker Notes Example

**File:** `templates/contributor-template.md`

**Changes:**

Add speaker notes example after the "Introduction" slide (after line 56):

```markdown
# Introduction

- [First key point about your topic]
- [Second important concept to introduce]
- [Third main theme you'll cover]

<!--
Speaker Notes:
- Welcome the audience
- Introduce yourself briefly
- Set expectations for talk length (e.g., "This will take about 20 minutes")
- Mention when to ask questions (during or after)

DELETE THIS EXAMPLE and replace with your own notes, or remove entirely if not needed.
-->

<!--
INSTRUCTIONS: Introduce your topic
- Use 3-5 bullet points
- Keep each point to one line
- Focus on what you'll cover

SPEAKER NOTES (Optional):
Add speaker notes in HTML comments like the example above. These are only visible
to you when presenting. See CONTRIBUTING.md for speaker notes best practices.
-->
```

**Reference to guidelines:**

Update the header section (around line 4) to reference CONTRIBUTING.md:

```markdown
> **For Content Contributors:** This template is designed for you! You don't need to know MARP or any technical details about presentations. Just fill in your content following the examples below, and the system will automatically format it into professional slides.
>
> **Important:** See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
> - Speaker notes guidelines (how to add notes for live presentations)
> - Presenter attribution (how to include your contact information)
```

**Testing:**
```bash
# Build the template to ensure no syntax errors
marp templates/contributor-template.md -o /tmp/test-contributor.html
```

### Step 4: Update basic-presentation.md with Attribution Guidance

**File:** `templates/basic-presentation.md`

**Changes:**

Update title slide (lines 12-13):

```markdown
# Your Presentation Title

## Subtitle or Tagline

Your Name | Event/Conference | Date

<!-- See CONTRIBUTING.md for presenter attribution guidelines -->
```

Update closing slide (lines 126-128):

```markdown
# Thank You

## Questions?

Your Name
<your.email@example.com>
@yourhandle

<!-- See CONTRIBUTING.md for presenter attribution guidelines -->
```

**Testing:**
```bash
# Build the template to ensure no syntax errors
marp templates/basic-presentation.md -o /tmp/test-basic.html
```

### Step 5: Update README.md Attribution References (if needed)

**File:** `README.md`

**Changes:**

Verify that README.md references CONTRIBUTING.md for slide contributions (already done at lines 168-176).

No changes needed - README.md already properly references CONTRIBUTING.md.

**Verification:**
```bash
# Confirm reference exists
grep -n "CONTRIBUTING" README.md
```

### Step 6: Verify Cross-References and Consistency

**Files:** All documentation files

**Verification steps:**

1. Check that speaker notes terminology is consistent:
   ```bash
   grep -ri "speaker note" --include="*.md" .
   ```

2. Verify all attribution references use correct format:
   ```bash
   grep -ri "Lewis Denham-Parry\|lewis@denhamparry.co.uk" --include="*.md" .
   ```

3. Check that all cross-references are valid:
   ```bash
   # Verify links in CONTRIBUTING.md
   grep -o '\[.*\](.*\.md[^)]*)' CONTRIBUTING.md
   ```

4. Build all documentation to ensure no broken links:
   ```bash
   npm run build
   ```

**Expected results:**
- Consistent terminology across all docs
- All cross-references resolve correctly
- No broken links in documentation
- Attribution format is uniform

## Testing Strategy

### Documentation Review

**Test Case 1: Contributor reads CONTRIBUTING.md**
1. Open CONTRIBUTING.md
2. Locate "Speaker Notes" section
3. Verify clear explanation of what/when/how
4. Verify working example is provided
5. Verify link to marp-usage.md works
6. Expected: Contributor understands how to add speaker notes

**Test Case 2: Contributor uses contributor-template.md**
1. Copy templates/contributor-template.md
2. Follow inline instructions
3. Locate speaker notes example
4. Add own speaker notes following example
5. Build slides: `marp slide.md -o output.html`
6. View HTML source and locate speaker notes
7. Expected: Speaker notes appear in HTML comments

**Test Case 3: Presenter attribution is clear**
1. Read CONTRIBUTING.md presenter attribution section
2. Verify Lewis Denham-Parry contact info is correct
3. Check templates have attribution placeholders
4. Verify external contributor guidance is clear
5. Expected: No ambiguity about attribution format

### Integration Testing

**Test Case 4: Build all templates**
```bash
# Build basic template
marp templates/basic-presentation.md -o /tmp/basic.html

# Build contributor template
marp templates/contributor-template.md -o /tmp/contributor.html

# Verify both build successfully
ls -lh /tmp/basic.html /tmp/contributor.html
```

**Test Case 5: Cross-reference validation**
```bash
# Check all markdown links are valid
find . -name "*.md" -exec grep -H '\[.*\](.*\.md' {} \; | \
while read line; do
  # Verify linked files exist
  echo "$line"
done
```

### Regression Testing

**Test Case 6: Existing functionality preserved**
1. Verify existing templates still work
2. Build all existing slides: `npm run build`
3. Check example-presentation.md still builds correctly
4. Verify no formatting changes to existing content
5. Expected: All existing slides build without errors

**Test Case 7: Documentation completeness**
1. Search for "TODO", "FIXME", "XXX" in CONTRIBUTING.md
2. Verify all sections are complete
3. Check for any placeholder text
4. Expected: No incomplete sections

## Success Criteria

- [x] CONTRIBUTING.md includes dedicated "Speaker Notes" section
- [x] Speaker notes section includes:
  - [x] Clear explanation of what speaker notes are
  - [x] When to use them
  - [x] How to add them (HTML comment syntax with example)
  - [x] Best practices (bullet-pointed)
  - [x] How to view notes when presenting
  - [x] Reference to slides/example-presentation.md
  - [x] Link to docs/marp-usage.md detailed section
- [x] CONTRIBUTING.md includes "Presenter Attribution" section
- [x] Presenter attribution section includes:
  - [x] Lewis Denham-Parry name and email
  - [x] Where to include attribution (title/closing slides)
  - [x] Format examples for both slides
  - [x] External contributor guidance
- [x] templates/contributor-template.md updated with:
  - [x] Speaker notes example in at least one slide
  - [x] Reference to CONTRIBUTING.md in header
- [x] templates/basic-presentation.md updated with:
  - [x] Reference to CONTRIBUTING.md for attribution
- [x] All documentation cross-references are valid
- [x] All templates build successfully without errors
- [x] Terminology is consistent across all documentation
- [x] No regression in existing functionality

## Files Modified

1. `CONTRIBUTING.md` - Add speaker notes and presenter attribution sections
2. `templates/contributor-template.md` - Add speaker notes example and references
3. `templates/basic-presentation.md` - Add attribution guidance references
4. `README.md` - Verify references (no changes needed)

## Related Issues and Tasks

### Depends On

None - this is a standalone documentation task

### Blocks

None - this is a documentation enhancement

### Related

- Example presentation (`slides/example-presentation.md`) - Contains excellent speaker notes examples
- MARP Usage Guide (`docs/marp-usage.md`) - Contains detailed speaker notes documentation
- Contributing Slides Guide (`docs/CONTRIBUTING_SLIDES.md`) - Related contributor documentation

### Enables

- Better quality presentation contributions
- Clearer contributor guidelines
- Consistent presenter attribution
- Improved live presentation delivery
- Reduced maintainer burden (fewer "how do I" questions)

## References

- [GitHub Issue #14](https://github.com/denhamparry/talks/issues/14)
- [MARP Documentation - HTML Comments](https://marpit.marp.app/directives)
- [Example Presentation with Speaker Notes](slides/example-presentation.md)
- [MARP Usage Guide - Speaker Notes Section](docs/marp-usage.md#adding-speaker-notes)

## Notes

### Key Insights

1. **Excellent examples already exist**: `slides/example-presentation.md` has comprehensive speaker notes that can be referenced
2. **Technical documentation exists**: `docs/marp-usage.md` has detailed speaker notes section (lines 605-654)
3. **Need for contributor-focused summary**: CONTRIBUTING.md should provide quick guidance with links to detailed docs
4. **Attribution is critical**: Proper presenter attribution ensures credit and contact information is consistent

### Alternative Approaches Considered

1. **Duplicate all speaker notes documentation in CONTRIBUTING.md** ❌
   - Would create maintenance burden
   - Risk of documentation drift
   - Chosen approach: Reference existing detailed docs

2. **Add speaker notes examples to every template slide** ❌
   - Would clutter templates
   - Might confuse contributors
   - Chosen approach: Add one clear example with reference to docs

3. **Create separate attribution config file** ❌
   - Adds complexity
   - Contributors would need to know about it
   - Chosen approach: Document in CONTRIBUTING.md with template placeholders

4. **Chosen Approach: Layered documentation** ✅
   - CONTRIBUTING.md: Quick guidance for contributors
   - docs/marp-usage.md: Detailed technical documentation
   - Templates: Inline examples with references
   - Clear cross-references between docs

### Best Practices

- Keep contributor-facing documentation concise and actionable
- Provide examples wherever possible
- Link to detailed docs for advanced use cases
- Maintain consistency in terminology and format
- Test all examples to ensure they work
- Use HTML comments for speaker notes (MARP standard)
- Include timing, talking points, and Q&A notes in speaker notes

### Implementation Considerations

- Speaker notes only visible in HTML source, not in PDF
- HTML comments are standard MARP approach
- Format: `<!-- Speaker Notes: ... -->` or `<!-- ... -->`
- Presenter attribution should be in both title and closing slides
- External contributors can use their own attribution
- Templates serve as both examples and starting points
