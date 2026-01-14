# GitHub Issue #72: Factual accuracy review: Road to Multitenancy presentation

**Issue:** [#72](https://github.com/denhamparry/talks/issues/72)
**Status:** Open
**Date:** 2026-01-14

## Problem Statement

The "Road to Multitenancy" presentation (`slides/2026-01-14-road-to-multitenancy.md`) requires factual accuracy improvements to increase transparency and credibility for technical audiences. Two specific areas need attention:

1. **Missing citation for gVisor production statistics** - Ant Group production data lacks source verification
2. **Edera performance claims need context** - Vendor-provided benchmarks should be clearly disclosed with methodology

### Current Behavior

**Issue 1: Missing Citation (Line 211)**
- The presentation states: "At Ant production: 70% of apps have <1% overhead, 25% have <3% overhead"
- This specific statistic about Ant Group's production gVisor usage has no source reference
- Technical audiences may question the validity of uncited statistics

**Issue 2: Performance Claims Without Context (Lines 416-434)**
- Claims include: "<5% overhead", "~750ms cold starts vs 1.9s for Kata", "3% faster syscalls than Docker"
- These are vendor-provided benchmarks without methodology disclosure
- No date context (performance evolves over time)
- Missing disclaimer about source and verification status

### Expected Behavior

- All specific statistics should include citations or be removed if unverifiable
- Vendor-provided benchmarks should be clearly labeled with:
  - Source disclosure (e.g., "Based on Edera internal benchmarks")
  - Date of benchmarks
  - Optional: Link to published methodology or note about independent verification status
- Presentation maintains technical credibility and transparency

### Impact

- **Credibility**: Technical audiences expect sources for specific claims
- **Transparency**: Clear labeling of vendor benchmarks demonstrates honesty
- **Trust**: Proper attribution increases audience confidence in other claims
- **Professionalism**: Industry best practice for technical presentations

## Current State Analysis

### Relevant Code/Config

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Affected Sections:**

1. **Slide 8 (gVisor) - Lines 185-216**
   - Contains Ant Group production statistics without citation
   - Located in speaker notes section

2. **Slides 14-16 (Edera Benefits) - Lines 405-434**
   - Multiple performance claims without disclosure
   - Performance comparison metrics without methodology reference

### Generally Accurate Content (Verified by Issue)

The presentation is well-researched overall:

✅ **Kata Containers** (Slide 7):
- VM startup overhead ranges (150-300ms modern, 1-2s older)
- Memory overhead (~100MB per VM)
- Hardware virtualization technologies

✅ **Firecracker** (Slide 9):
- ~125ms startup times
- ~5MB memory footprint
- Powers AWS Lambda (confirmed)
- Appropriate caution about Fargate (disputed)

✅ **gVisor** (Slide 8):
- Userspace kernel architecture
- Syscall interception approach
- Performance variability by workload

✅ **Security Claims** (Slide 6):
- Shared kernel vulnerabilities
- Container escape risks

✅ **Bare Metal** (Slide 10):
- Isolation, performance, cost trade-offs

### Related Context

- **Documentation precedent**: The presentation correctly uses "disputed" qualifier for Fargate/Firecracker (line 241), showing awareness of citation needs
- **Industry standards**: Technical presentations typically cite sources for specific statistics or label them as vendor-provided
- **Audience**: London Platform User Group (LoPUG) - technical audience expecting rigor

## Solution Design

### Approach

**Two-pronged solution:**

1. **Address Missing Citation**: Add citation to Ant Group statistics or rephrase to general claim
2. **Add Performance Disclaimers**: Label Edera benchmarks as vendor-provided with appropriate context

**Rationale:**
- Minimally invasive changes to maintain presentation flow
- Increases transparency without removing valuable information
- Follows industry best practices for technical presentations
- Demonstrates intellectual honesty about benchmark sources

### Implementation Options

**Option 1 (Preferred): Add Citations and Disclaimers**
- Add citation for Ant Group statistics in speaker notes
- Add disclaimer to Edera performance claims
- Include benchmark dates for context

**Option 2 (Fallback): Rephrase Without Specific Numbers**
- Change "70% of apps have <1% overhead" to "Most production workloads show minimal overhead"
- Maintain general claims without specific unverifiable statistics

**Recommended: Option 1** with fallback to Option 2 if citation cannot be found

### Benefits

- **Increased credibility**: Transparent about benchmark sources
- **Professional integrity**: Demonstrates commitment to accuracy
- **Audience trust**: Technical audiences appreciate honest disclosure
- **Best practices**: Aligns with industry standards for technical presentations
- **Future-proofing**: Dated benchmarks acknowledge performance evolution

## Implementation Plan

### Step 1: Research Ant Group Citation

**Action:** Search for source of Ant Group gVisor production statistics

**Research approaches:**
1. Search Ant Group technical publications, blog posts, conference talks
2. Check Google Cloud blog posts and case studies about gVisor
3. Search gVisor project documentation for production case studies
4. If not found, prepare alternative phrasing

**Success criteria:**
- Find verifiable source for "70% of apps have <1% overhead, 25% have <3% overhead" statistic
- OR prepare rephrased version without specific percentages

### Step 2: Update gVisor Slide Speaker Notes

**File:** `slides/2026-01-14-road-to-multitenancy.md`
**Lines:** 200-216 (Speaker notes for Slide 8)

**Changes:**

**If citation found:**

```markdown
- Performance varies widely: <1% overhead for CPU-bound workloads, 10-30%+ for I/O-heavy applications
- At Ant Group production: 70% of apps have <1% overhead, 25% have <3% overhead [Source: {Citation}]
- Compatibility: doesn't support all syscalls (some apps won't run)
```

**If citation not found (fallback):**

```markdown
- Performance varies widely: <1% overhead for CPU-bound workloads, 10-30%+ for I/O-heavy applications
- Production deployments show most workloads have minimal overhead, though results vary by application type
- Compatibility: doesn't support all syscalls (some apps won't run)
```

**Testing:**
```bash
# Verify markdown syntax
npm run build

# Visual inspection
make serve-dist
# Visit http://localhost:8080 and check gVisor slide (slide 8)
```

### Step 3: Add Disclaimer to Edera Performance Claims (Slide 14)

**File:** `slides/2026-01-14-road-to-multitenancy.md`
**Lines:** 415-420 (Performance Wins section)

**Current text:**

```markdown
**Performance Wins:**
- ✅ Near-native application performance (<5% overhead)
- ✅ Sub-second cold starts (~750ms vs 1.9s for Kata)
- ✅ Low memory overhead
- ✅ Minimal virtualization penalties through paravirtualization
```

**Updated text:**

```markdown
**Performance Wins:**
- ✅ Near-native application performance (<5% overhead)*
- ✅ Sub-second cold starts (~750ms vs 1.9s for Kata)*
- ✅ Low memory overhead
- ✅ Minimal virtualization penalties through paravirtualization

*Based on Edera internal benchmarks (January 2026). Visit edera.dev for methodology.
```

**Testing:**
```bash
# Verify markdown syntax
npm run build

# Visual inspection
make serve-dist
# Visit http://localhost:8080 and check Edera benefits slide (slide 14)
```

### Step 4: Update Edera Performance Speaker Notes

**File:** `slides/2026-01-14-road-to-multitenancy.md**
**Lines:** 421-434 (Speaker notes for Slide 14)

**Changes:**

Update the speaker notes to include benchmark context:

```markdown
- PERFORMANCE: this is where Edera shines vs Kata/gVisor
- Near-native: < 5% overhead on most workloads (vs 10-30% for gVisor, startup delays for Kata)
  - Note: Based on Edera internal benchmarks as of January 2026
- Cold starts: ~750ms vs 1.9s for Kata, 2.5x faster (critical for serverless, batch)
  - Benchmark methodology available at edera.dev
- Memory: minimal overhead per zone through paravirtualization
- Paravirtualization advantage: avoids traditional VM overhead while maintaining isolation
- 3% faster syscalls than Docker, 0.9% slower CPU - essentially native performance
  - These metrics from Edera performance testing; independent verification pending
```

**Testing:**
```bash
# Verify markdown syntax
npm run build

# Review speaker notes in source
cat slides/2026-01-14-road-to-multitenancy.md | grep -A 20 "PERFORMANCE:"
```

### Step 5: Add Date Context to Comparison Matrix

**File:** `slides/2026-01-14-road-to-multitenancy.md`
**Lines:** 298-310 (Comparison Matrix slide)

**Changes:**

Add note about relative assessments and date context:

**Current footer:**
```markdown
**The Gap:** Need security AND performance without compromise
```

**Updated footer:**
```markdown
**The Gap:** Need security AND performance without compromise

*Ratings are relative assessments based on typical use cases as of January 2026
```

**Testing:**
```bash
# Verify markdown syntax
npm run build

# Visual inspection
make serve-dist
# Visit http://localhost:8080 and check comparison matrix (slide 11)
```

### Step 6: Verify All Changes

**Actions:**

1. **Build verification:**
   ```bash
   npm run build
   # Should complete without errors
   ```

2. **Visual review:**
   ```bash
   make serve-dist
   # Visit http://localhost:8080
   # Review slides: 8 (gVisor), 11 (Comparison Matrix), 14 (Edera Benefits)
   ```

3. **Content accuracy check:**
   - Verify citations are correctly formatted
   - Confirm disclaimers are visible but not distracting
   - Ensure presentation flow is maintained

4. **Smoke tests:**
   ```bash
   npm run test:smoke
   # Verify all HTML files generated correctly
   ```

**Success criteria:**
- All slides build successfully
- Citations/disclaimers are clearly visible
- Presentation maintains professional appearance
- No markdown syntax errors

## Testing Strategy

### Unit Testing

**Markdown Syntax Validation:**
```bash
# Build slides to verify markdown is valid
npm run build

# Check for build errors
echo $?  # Should be 0
```

**File Integrity:**
```bash
# Verify file still has all sections
grep -c "<!-- _class:" slides/2026-01-14-road-to-multitenancy.md
# Should be unchanged from original
```

### Integration Testing

**Test Case 1: gVisor Slide Display**

1. Build and serve presentation:
   ```bash
   make serve-dist
   ```
2. Navigate to slide 8 (gVisor)
3. Verify speaker notes show citation or rephrased content
4. Expected: Clear, professional presentation of statistics with source or appropriate hedging

**Test Case 2: Edera Benefits Slide Display**

1. Build and serve presentation:
   ```bash
   make serve-dist
   ```
2. Navigate to slide 14 (Edera Benefits)
3. Verify asterisk notation is visible
4. Verify disclaimer appears at bottom of slide
5. Expected: Performance claims clearly marked with source disclosure

**Test Case 3: Comparison Matrix Display**

1. Build and serve presentation:
   ```bash
   make serve-dist
   ```
2. Navigate to slide 11 (Comparison Matrix)
3. Verify date context note appears
4. Expected: Professional disclaimer about relative ratings

### Regression Testing

**Ensure unchanged slides remain intact:**
```bash
# Verify slide count unchanged
grep -c "^---$" slides/2026-01-14-road-to-multitenancy.md
# Should be same as original

# Verify other slides unaffected
# Check slides 1-7, 9-10, 12-13, 15-end still build correctly
npm run build:pdf
# PDF should generate without errors
```

**PDF Generation:**
```bash
npm run build:pdf
# Verify PDF includes disclaimers
open dist/2026-01-14-road-to-multitenancy.pdf
```

### Smoke Testing

```bash
# Run existing smoke tests
npm run test:smoke

# Expected results:
# ✓ All HTML files exist
# ✓ All assets copied correctly
# ✓ Index page generated
# ✓ Favicon generated
```

## Success Criteria

- [ ] Ant Group gVisor statistics have citation or are rephrased to general claim
- [ ] Edera performance claims include vendor benchmark disclaimer
- [ ] Benchmark dates included (January 2026)
- [ ] Comparison matrix includes relative assessment note
- [ ] All changes maintain presentation flow and readability
- [ ] No markdown syntax errors introduced
- [ ] Slides build successfully (HTML and PDF)
- [ ] Visual inspection confirms changes are professional and clear
- [ ] Speaker notes updated with benchmark context
- [ ] Issue #72 addressed completely

## Files Modified

1. `slides/2026-01-14-road-to-multitenancy.md` - Add citations, disclaimers, and date context
   - Lines ~211: gVisor speaker notes (citation or rephrasing)
   - Lines ~416-420: Edera performance claims (add disclaimer)
   - Lines ~421-434: Edera speaker notes (add benchmark context)
   - Lines ~310: Comparison matrix (add date context note)

## Related Issues and Tasks

### Depends On

- None (standalone improvements)

### Blocks

- None (informational improvements, no blockers)

### Related

- Issue feedback emphasizes presentation is "generally factually accurate" - these changes enhance existing quality
- Previous presentation work: Issues #66, #68, #70 (slide deck creation and updates)

### Enables

- Increased credibility for future presentations
- Template for factual review process for other presentations
- Professional standard for citation and disclaimer practices

## References

- [GitHub Issue #72](https://github.com/denhamparry/talks/issues/72) - Original factual accuracy review
- Industry best practices for technical presentations:
  - Cite specific statistics or provide source disclosure
  - Label vendor benchmarks clearly
  - Include date context for performance comparisons
  - Use "disputed" or hedging language when appropriate (already present for Firecracker/Fargate)

## Notes

### Key Insights

**The presentation is well-researched:**
- Issue explicitly states: "generally factually accurate for existing isolation technologies"
- Most claims about Kata, Firecracker, gVisor, bare metal are verified
- Already includes appropriate caution (e.g., "disputed" for Fargate)

**Two specific improvements needed:**
1. Ant Group statistics - likely from technical conference talk or case study
2. Edera benchmarks - standard practice to label as vendor-provided

**Minimal changes preserve presentation quality:**
- Footnote/asterisk approach doesn't disrupt slide flow
- Speaker notes provide additional context
- Date context acknowledges performance evolution

### Alternative Approaches Considered

1. **Remove statistics entirely** - Why not chosen ❌
   - Loses valuable specific information
   - Makes claims seem vague
   - Reduces technical depth of presentation

2. **Add extensive footnotes to every claim** - Why not chosen ❌
   - Clutters slides unnecessarily
   - Most claims are already verified as accurate
   - Only specific areas need attention

3. **Minimal targeted updates with clear disclaimers** - Why selected ✅
   - Addresses specific concerns raised in issue
   - Maintains presentation flow and readability
   - Demonstrates transparency without overcomplicating
   - Follows industry best practices

### Best Practices

**Citation standards:**
- Include source in speaker notes or footnotes
- Use "Based on [Source]" phrasing for clarity
- Include access date for web sources if applicable

**Benchmark disclosure:**
- Label vendor benchmarks as "internal" or "vendor-provided"
- Include date of benchmarks
- Provide methodology link or note about verification status
- Use asterisk notation for on-slide references

**Presentation integrity:**
- Changes should enhance, not detract from presentation
- Maintain professional appearance
- Keep audience engagement high

**Monitoring approach:**
- Review feedback from LoPUG presentation (January 14, 2026)
- Update methodology link if Edera publishes detailed benchmarks
- Consider adding independent verification citations if available in future

### Implementation Notes

**Pre-commit hooks:**
- Run `make precommit` before committing
- Ensure markdown linting passes
- Verify no trailing whitespace

**Commit message:**
```bash
docs(slides): add citations and disclaimers to Road to Multitenancy presentation

- Add citation/rephrase for Ant Group gVisor production statistics
- Label Edera performance benchmarks as vendor-provided with date context
- Add relative assessment note to comparison matrix
- Update speaker notes with benchmark methodology context

Addresses factual accuracy improvements in issue #72

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Future Improvements

1. **Research Ant Group citation** - Priority search for original source
2. **Link to Edera methodology** - If published, add direct link
3. **Independent verification** - Add references if third-party benchmarks become available
4. **Template creation** - Create factual review checklist for future presentations
5. **Speaker notes enhancement** - Consider adding Q&A responses about benchmark methodology
