# GitHub Issue #78: Add architecture diagrams to Road to Multitenancy presentation

**Issue:** [#78](https://github.com/denhamparry/talks/issues/78)
**Status:** Reviewed (Approved)
**Date:** 2026-02-27

## Problem Statement

The Road to Multitenancy presentation (`slides/2026-01-14-road-to-multitenancy.md`)
needs three new visual architecture diagrams to help the audience better understand
multitenancy concepts and implementation patterns.

### Current Behavior

- No dedicated architecture diagrams exist for:
  - High-level multitenancy system component layout
  - Tenant data isolation pattern comparisons
  - Deployment topology and infrastructure overview
- Issue #75 (Complete) added existing Edera performance/architecture assets but did
  not create new purpose-built multitenancy diagrams
- The presentation is strong on text and existing Edera branding diagrams but lacks
  original architecture illustrations

### Expected Behavior

Three new SVG diagram files created and integrated into the presentation:

1. **System Architecture Overview** — high-level multitenancy system components
2. **Data Isolation Patterns** — tenant data segregation strategies
3. **Deployment Architecture** — infrastructure and deployment topology

## Current State Analysis

### Relevant Files

- **Presentation:** `slides/2026-01-14-road-to-multitenancy.md` (740 lines, 22 slides)
- **Existing assets:** `slides/assets/diagrams/` — 22 Edera brand/benchmark diagrams
- **Tenant assets:** `slides/assets/2026-01-14-road-to-multitenancy/` — QR code only
- **Theme:** `themes/edera-v2.css` — Edera V2 colours confirmed
- **Build:** `Makefile` + npm scripts (`make build`, `make build-pdf`)

### Theme Colours (from `themes/edera-v2.css`)

```css
--edera-dark-teal:   #013a3b   /* backgrounds, text */
--edera-light-mint:  #d0fdf2   /* content slide backgrounds */
--edera-cyan-accent: #02f4d5   /* headings, emphasis */
--edera-white:       #ffffff
```

### Presentation Structure

| Slide | Class   | Content |
|-------|---------|---------|
| 1     | title   | Title |
| 2–3   | content | Multi-tenancy problem |
| 4     | content | Scale vs Isolation + attack diagram |
| 5–10  | content | Six current approaches |
| 11    | content | Comparison matrix |
| 12    | dark    | Enter Edera |
| 13    | content | How Edera works (architecture) |
| 14–15 | dark    | Benefits |
| 16    | content | Platform engineering impact |
| 17–18 | dark    | Use cases |
| 19    | content | Conclusion |
| 20    | title   | Q&A |

### Asset Directory Convention

The issue requests `slides/assets/road-to-multitenancy/`. However, the existing
convention for talk-specific assets uses date-prefix directories, e.g.
`slides/assets/2026-01-14-road-to-multitenancy/`. To respect the issue request while
noting the convention, new files go in `slides/assets/road-to-multitenancy/` as
specified.

## Solution Design

### Approach

Create three new **SVG diagram files** and add corresponding slides to the
presentation. SVG is chosen because:

- Vector format: crisp at any slide resolution/scale
- CSS-compatible: can use Edera V2 hex colours directly
- Code-as-text: version-controllable, no binary tools required
- MARP support: renders via standard `![alt](path)` markdown image syntax

### Diagram 1: System Architecture Overview

**File:** `slides/assets/road-to-multitenancy/system-architecture-overview.svg`

**Content:** High-level view of a Kubernetes multi-tenant cluster showing:

- Kubernetes control plane
- Worker nodes running Edera
- Multiple tenant workloads (Pod icons) isolated in their own zones
- External traffic entering through an ingress/gateway
- Edera hypervisor layer between host OS and tenant zones

**Placement in slides:** New slide after slide 13 ("How Edera Works: Technical
Overview"), as the diagram directly visualises what is described there.

**Colours:**
- Background: `#d0fdf2` (light mint)
- Kubernetes/cluster border: `#013a3b` (dark teal)
- Edera zone boxes: `#02f4d5` (cyan accent)
- Labels: `#013a3b`

### Diagram 2: Data Isolation Patterns

**File:** `slides/assets/road-to-multitenancy/data-isolation-patterns.svg`

**Content:** Three-column comparison of tenant data isolation strategies:

- Column 1 — **Database-per-tenant**: separate database icons per tenant
- Column 2 — **Schema-per-tenant**: single database, multiple schemas
- Column 3 — **Row-level security**: single schema, rows labelled with tenant IDs

This provides context on the SaaS platform use case mentioned in slides 16–18
("Platform Engineering Impact", "Edera for Containers: Use Cases").

**Placement in slides:** New slide inserted before or as part of the "Platform
Engineering Impact" section (after current slide 16), to set context for SaaS
multi-tenancy data isolation alongside container isolation.

**Colours:** Same palette as above; column headers in `#013a3b`, column backgrounds
alternating between `#d0fdf2` and `#013a3b` with white text.

### Diagram 3: Deployment Architecture

**File:** `slides/assets/road-to-multitenancy/deployment-architecture.svg`

**Content:** Infrastructure topology showing:

- Cloud provider layer (or on-prem) at the bottom
- VM/bare metal nodes running Edera hypervisor
- Kubernetes control plane on a separate node
- Worker nodes with multiple Edera zones (one per tenant workload)
- Networking layer: external ingress → gateway → zone → container
- Labels: "Tenant A", "Tenant B", "Tenant C" in separate zones

**Placement in slides:** New slide after the System Architecture Overview slide,
forming a "how it deploys" follow-on to "how it works".

**Colours:** Same palette; zone boundaries highlighted in `#02f4d5`.

### Slide Additions

Three new slides to be inserted after slide 13 (How Edera Works):

```markdown
---

<!-- _class: content -->

# Multi-Tenant System Architecture

![System architecture overview](./assets/road-to-multitenancy/system-architecture-overview.svg)

---

<!-- _class: content -->

# Deployment Architecture

![Deployment architecture](./assets/road-to-multitenancy/deployment-architecture.svg)

---

<!-- _class: content -->

# Data Isolation Patterns

![Data isolation patterns](./assets/road-to-multitenancy/data-isolation-patterns.svg)
```

### Benefits

- Provides visual anchors for key discussion points
- Audiences with varying technical backgrounds can follow the architecture
- Diagrams serve as reference material post-presentation
- Reuses Edera V2 colour palette for brand consistency

## Implementation Plan

### Step 1: Create asset directory

**Command:**

```bash
mkdir -p slides/assets/road-to-multitenancy
```

### Step 2: Create System Architecture Overview SVG

**File:** `slides/assets/road-to-multitenancy/system-architecture-overview.svg`

**SVG structure:**

- Canvas: 1200×675 (16:9, matches MARP default)
- Top section: Kubernetes control plane box (dark teal)
- Middle section: two worker nodes side by side
- Each worker node: Edera hypervisor layer, two zone boxes (cyan accent)
- Bottom: shared host OS bar (dark teal)
- Right side: external traffic arrow pointing to ingress
- Legend: zone = "Tenant Workload"

**Testing:**

```bash
make build
# verify SVG renders on slide
```

### Step 3: Create Deployment Architecture SVG

**File:** `slides/assets/road-to-multitenancy/deployment-architecture.svg`

**SVG structure:**

- Top: Cloud/on-prem bar
- Second row: control plane VM + 3 worker VMs
- Inside each worker VM: Edera hypervisor label + 2 zones
- Each zone: Container icon + "Tenant N" label
- Arrows: external ingress → gateway → zones
- Labels for each layer

### Step 4: Create Data Isolation Patterns SVG

**File:** `slides/assets/road-to-multitenancy/data-isolation-patterns.svg`

**SVG structure:**

- Three equal columns with headers
- Column 1 (DB-per-tenant): three separate database cylinders, each labelled
  "Tenant A DB", "Tenant B DB", "Tenant C DB"
- Column 2 (Schema-per-tenant): one database cylinder with three inner sections
  labelled "Schema A", "Schema B", "Schema C"
- Column 3 (Row-level security): one database cylinder with rows coloured and
  labelled "Tenant A Row", "Tenant B Row", "Tenant C Row"
- Dividers between columns in dark teal
- Title row: "Database-per-Tenant", "Schema-per-Tenant", "Row-Level Security"

### Step 5: Add new slides to presentation

**File:** `slides/2026-01-14-road-to-multitenancy.md`

Insert three new slides immediately after the "How Edera Works: Technical Overview"
slide (after line ~422 in current file). The new slides reference the SVGs via
relative paths and include speaker notes.

**Speaker notes for System Architecture slide:**

```
- Point to the Edera hypervisor layer between host OS and tenant zones
- Each cyan box is a "zone" — a lightweight VM with its own kernel
- No shared kernel means no shared attack surface
- This is what enables true multi-tenancy without trade-offs
```

**Speaker notes for Deployment Architecture slide:**

```
- Show infrastructure from cloud provider to tenant container
- Each level provides isolation: cloud VMs → Edera zones → containers
- A single cluster can serve many tenants safely
- Kubernetes manages the orchestration; Edera handles the isolation
```

**Speaker notes for Data Isolation slide:**

```
- Three common SaaS data isolation strategies
- DB-per-tenant: strongest isolation, highest cost
- Schema-per-tenant: moderate isolation, shared infrastructure
- Row-level: cheapest, requires careful application-level controls
- Edera operates at the infrastructure layer, complementing all three
```

### Step 6: Build and verify

**Commands:**

```bash
make build
make build-pdf
make test-smoke
```

**Verification:**

```bash
# Confirm SVG files exist
ls slides/assets/road-to-multitenancy/

# Confirm images render in HTML
grep -c '<img' dist/2026-01-14-road-to-multitenancy.html

# Check for broken image refs
grep '!\[' slides/2026-01-14-road-to-multitenancy.md
```

### Step 7: Run pre-commit hooks

```bash
pre-commit run --all-files
```

Fix any trailing whitespace, end-of-file, or markdown lint issues before commit.

## Testing Strategy

### Unit Testing

**Image link validation:**

```bash
grep -o '\./assets/road-to-multitenancy/[^)]*' \
  slides/2026-01-14-road-to-multitenancy.md | while read p; do
  f="slides/${p#./}"
  [ -f "$f" ] || echo "Missing: $f"
done
```

**Expected:** No missing files reported.

### Integration Testing

**Test Case 1: HTML Build**

1. `make clean`
2. `make build`
3. Open `dist/2026-01-14-road-to-multitenancy.html`
4. Navigate to new slides (14–16), verify SVG diagrams render
5. Check all existing slides still display correctly

**Expected:** All three new diagram slides visible, no broken images.

**Test Case 2: PDF Build**

1. `make build-pdf`
2. Open `dist/2026-01-14-road-to-multitenancy.pdf`
3. Check pages for the three new diagram slides

**Expected:** SVGs render in PDF, total file size <25MB.

**Test Case 3: Smoke Tests**

```bash
make test-smoke
```

**Expected:** All smoke tests pass.

### Regression Testing

- [ ] QR code slide still displays
- [ ] Footer with event details appears on all slides
- [ ] Edera V2 theme applies correctly
- [ ] Speaker notes preserved
- [ ] Existing diagrams (from issue #75) still render
- [ ] Comparison matrix table still displays
- [ ] Pagination correct (slide count increases by 3)

## Success Criteria

- [ ] `slides/assets/road-to-multitenancy/system-architecture-overview.svg` created
- [ ] `slides/assets/road-to-multitenancy/data-isolation-patterns.svg` created
- [ ] `slides/assets/road-to-multitenancy/deployment-architecture.svg` created
- [ ] Diagrams follow Edera V2 colour scheme (#013a3b, #d0fdf2, #02f4d5)
- [ ] Three new slides added to presentation referencing the diagrams
- [ ] Diagrams placed in appropriate sections of the presentation
- [ ] Image files stored in `slides/assets/road-to-multitenancy/`
- [ ] Build process successfully generates HTML with new diagrams
- [ ] Build process successfully generates PDF with new diagrams
- [ ] All smoke tests pass
- [ ] Pre-commit hooks pass
- [ ] Speaker notes reference diagrams appropriately

## Files Modified

1. `slides/2026-01-14-road-to-multitenancy.md` — add 3 new slides with diagram refs
   and speaker notes

## Files Created

1. `slides/assets/road-to-multitenancy/system-architecture-overview.svg`
2. `slides/assets/road-to-multitenancy/data-isolation-patterns.svg`
3. `slides/assets/road-to-multitenancy/deployment-architecture.svg`

## Related Issues and Tasks

### Depends On

- Issue #75 (Complete) — integrated existing Edera diagram assets; this issue creates
  new originals

### Blocks

- None

### Related

- Issue #75 — previous diagram integration
- Issue #68 — earlier slide deck update
- Issue #72 — factual accuracy review

### Enables

- Better audience engagement during live presentation
- More effective communication of multitenancy concepts
- Complete visual coverage of system architecture topics

## References

- [GitHub Issue #78](https://github.com/denhamparry/talks/issues/78)
- Presentation: `slides/2026-01-14-road-to-multitenancy.md`
- Theme: `themes/edera-v2.css`
- Prior diagrams: `slides/assets/diagrams/README.md`
- MARP image syntax: https://marpit.marp.app/image-syntax

## Notes

### Key Insights

1. **SVG is the right format** — vector, version-controllable, themed with CSS colours
2. **Three new slides** — one per diagram, inserted after "How Edera Works"
3. **Directory naming** — using `road-to-multitenancy/` as specified in issue, not
   date-prefixed variant
4. **Data Isolation Patterns** — SaaS-level data isolation is a complement to
   Edera's container-level isolation; both dimensions are relevant to platform
   engineering use cases

### Alternative Approaches Considered

1. **Reuse existing Edera diagrams** — Already done in issue #75; issue #78 specifically
   requests new architecture diagrams ❌
2. **Mermaid diagrams inline** — MARP supports Mermaid but renders inconsistently across
   PDF/HTML outputs; SVG files are more reliable ❌
3. **Chosen: SVG files** — Reliable rendering in both HTML and PDF, themed with Edera V2
   colours, stored as version-controlled text ✅

### Best Practices

- **Alt text:** Always include descriptive alt text for accessibility
- **Viewbox:** Set SVG `viewBox` to match 16:9 ratio (1200×675 or 800×450)
- **Font:** Use system fonts (sans-serif) to avoid font-loading issues in MARP
- **Path references:** Use relative paths (`./assets/road-to-multitenancy/`) not absolute

---

## Plan Review

**Reviewer:** Claude Code (workflow-research-plan)
**Review Date:** 2026-02-27
**Original Plan Date:** 2026-02-27

### Review Summary

- **Overall Assessment:** Approved
- **Confidence Level:** High
- **Recommendation:** Proceed to implementation

### Strengths

1. **Correct format choice** — SVG is the right format for MARP slides. Vector
   format stays crisp at all resolutions, is version-controllable as text, and
   renders reliably in both HTML and PDF output via Chromium.

2. **Asset pipeline validated** — The `copy-assets` script (`"cp -r slides/assets/*
   dist/assets/"` in `package.json`) will automatically copy
   `slides/assets/road-to-multitenancy/` to `dist/assets/road-to-multitenancy/`
   after the HTML build, matching how all existing diagrams are served.

3. **Smoke tests will self-validate** — `scripts/smoke-test.js` dynamically reads
   every subdirectory of `slides/assets/` and verifies its contents are present in
   `dist/assets/`. The new directory will be covered automatically with no changes
   to the test script.

4. **All acceptance criteria covered** — All seven acceptance criteria from issue
   #78 are explicitly addressed in the Success Criteria section.

5. **Theme colours verified** — Colours were cross-checked against
   `themes/edera-v2.css` and match exactly.

6. **Convention decision is justified** — Using `slides/assets/road-to-multitenancy/`
   (as requested by the issue) rather than the date-prefixed convention is a
   conscious, documented choice.

### Gaps Identified

1. **Gap: Slide placement inconsistency**
   - **Impact:** Low
   - **Detail:** The Slide Additions section says all three slides are inserted
     "after slide 13 (How Edera Works)", but the Diagram 2 description places the
     Data Isolation slide "after slide 16 (Platform Engineering Impact)". These
     contradict each other.
   - **Recommendation:** Pick one consistent ordering. The logical narrative flow
     is: Architecture Overview → Deployment Architecture (both after slide 13),
     then Data Isolation Patterns after slide 16 (where SaaS use cases are
     discussed). Update Step 5 of the implementation plan to reflect this split
     insertion.

2. **Gap: PDF build path resolution not explicitly verified**
   - **Impact:** Low
   - **Detail:** `build:pdf` runs `marp -I slides/ --pdf -o dist/` without
     running `copy-assets` first. For PDF mode, MARP's Chromium instance resolves
     image paths relative to the source markdown file location (`slides/`), so
     `./assets/road-to-multitenancy/` resolves to `slides/assets/road-to-multitenancy/`
     — which is correct. However, this is not explicitly verified in the plan.
   - **Recommendation:** Add a note to Step 6 confirming that PDF builds read
     images from `slides/assets/` (source path), not `dist/assets/`, so the
     directory just needs to exist before `build:pdf` runs.

### Edge Cases Not Covered

1. **SVG font rendering variation**
   - **Current Plan:** Advises using `sans-serif` system fonts, which is correct.
   - **Scenario:** Different environments (CI vs local) may render fonts slightly
     differently. Text in SVGs can overflow boxes if font metrics differ.
   - **Recommendation:** Keep SVG labels short (< 20 chars per label), and use
     explicit `font-size` attributes on all `<text>` elements. Test PDF output
     after creating the SVGs.

2. **MARP image sizing on slides with only a diagram**
   - **Current Plan:** Slides contain only a heading and the image reference.
   - **Scenario:** MARP will size the image to available space, but very wide or
     very tall SVGs may not fill the slide as expected. Using `width: 100%` inside
     the SVG `<image>` markdown hint may be needed.
   - **Recommendation:** Consider using MARP image sizing syntax:
     `![System architecture overview w:900](./assets/...)` to explicitly control
     image width.

### Alternative Approaches Considered

1. **Mermaid inline diagrams**
   - **Pros:** No separate files needed, diagrams live in the markdown
   - **Cons:** MARP Mermaid support renders via JavaScript at runtime, which is
     inconsistent in PDF mode; Mermaid diagrams cannot use custom brand colours
     as easily
   - **Verdict:** SVG files are the better choice ✅ (plan's choice is correct)

2. **PNG raster images (generated externally)**
   - **Pros:** Predictable rendering, any tool can produce them
   - **Cons:** Not version-controllable as text, lose crispness if slide
     dimensions change, require binary files in git
   - **Verdict:** SVG files are superior for this use case ✅

### Risks and Concerns

1. **Data Isolation Patterns diagram — narrative fit**
   - **Likelihood:** Medium
   - **Impact:** Low
   - **Detail:** The presentation focuses entirely on _container/infrastructure_
     isolation (Kata, gVisor, Edera zones). Introducing a diagram about
     _data-layer_ isolation (database-per-tenant, schema-per-tenant, row-level
     security) is a different abstraction level. It may confuse the audience by
     appearing to shift the topic. The issue explicitly requests this diagram, so
     it must be included — but placement and speaker notes need to make the
     connection clear.
   - **Mitigation:** The speaker notes in the plan already address this: "Edera
     operates at the infrastructure layer, complementing all three [data isolation
     strategies]." Keep this framing. Place this slide in the use-cases section
     (after slide 16/17) rather than after the technical architecture slides, so
     it reads as "here's the broader multi-tenancy picture" rather than a
     technical deep-dive.

2. **Issue references wrong asset directory**
   - **Likelihood:** N/A (informational)
   - **Detail:** The issue body says "Existing Edera diagrams are available in
     `slides/assets/ederav2/`" but that directory only contains the logo PNG.
     The actual architecture diagrams are in `slides/assets/diagrams/`. The plan
     correctly identifies the diagrams directory — this is not a risk but worth
     noting as confirmation.

### Required Changes

No blocking changes required. The plan is implementable as written with the
following clarification recommended before coding:

- [ ] **Clarify slide insertion points** — Decide whether to insert all three
  slides after slide 13, or split (Architecture Overview + Deployment after 13,
  Data Isolation after 16). Update Step 5 to be unambiguous.

### Optional Improvements

- [ ] Use MARP image width hints (e.g. `w:900`) on diagram slides to control
  sizing explicitly
- [ ] Keep SVG text labels short and use explicit `font-size` on all `<text>`
  elements to ensure consistent rendering across environments
- [ ] Add a note in Step 6 confirming PDF builds read from `slides/assets/` path

### Verification Checklist

- [x] Solution addresses root cause identified in GitHub issue
- [x] All acceptance criteria from issue are covered
- [x] Implementation steps are specific and actionable
- [x] File paths and code references are accurate
- [x] Asset copy pipeline verified in `package.json`
- [x] Smoke test coverage confirmed in `scripts/smoke-test.js`
- [x] SVG format choice validated for MARP HTML and PDF output
- [x] Theme colours cross-checked against `themes/edera-v2.css`
- [x] Directory naming decision documented
- [x] Regression testing covers existing slides
