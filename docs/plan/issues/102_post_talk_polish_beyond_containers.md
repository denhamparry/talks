# GitHub Issue #102: Post-talk polish for Beyond Containers (deferred from #100)

**Issue:** [#102](https://github.com/denhamparry/talks/issues/102)
**Status:** Reviewed (Approved)
**Date:** 2026-04-13

## Problem Statement

Five nice-to-have polish items were identified in the pre-talk review of the
Beyond Containers deck (#100) and deferred from PR #101 because they are
subjective, low-impact, or upstream. None block the 2026-04-14 delivery. This
plan addresses all five so they are resolved on the next pass over the
`edera-v2` theme and the Beyond Containers slide file.

### Current Behavior

1. Header Edera badge sits flush against the slide edge — `right:
   var(--spacing-sm)` (~16px) in `themes/edera-v2.css:572` makes the black
   border visually touch the slide edge at typical render scales.
2. Final slide (#20) "Thank You — Questions?" uses `h2`, the same visual weight
   as the "Try it tonight" `h3`. The closing headline does not dominate.
3. The 🚀 🔒 🌐 💻 emoji prefixes on the final slide clash with the Edera V2
   visual language (no emojis elsewhere in the theme).
4. MARP's default HTML template emits `<meta
   name="apple-mobile-web-app-capable">`, which the browser console flags as
   deprecated in favour of `<meta name="mobile-web-app-capable">`.
5. The `footer:` frontmatter contains a Markdown link, so the meetup URL
   renders underlined on every content slide — slightly noisy given the
   meetup link is also in the title-slide body.

### Expected Behavior

1. The badge has clear breathing room from the slide edge.
2. "Thank You — Questions?" is the dominant headline on the closing slide.
3. The closing slide uses plain list items consistent with the rest of the
   deck.
4. The modern `mobile-web-app-capable` meta tag is present in built HTML
   alongside the legacy tag, silencing the console warning.
5. The footer is plain text; the meetup link survives on the title slide
   where it already lives.

## Current State Analysis

### Relevant Code/Config

- `themes/edera-v2.css:569-594` — `header .logo-link` and the
  `section:not(:has(header .logo-link))::before` fallback at lines 597-606
  both use `right: var(--spacing-sm)` (1rem ≈ 16px).
- `themes/edera-v2.css:50-51` — spacing tokens:
  `--spacing-sm: calc(var(--spacing-unit) * 1);`
  `--spacing-md: calc(var(--spacing-unit) * 1.5);` — bumping to `--spacing-md`
  gives ~24px, an 8px loosening that matches the issue's "~8–12px" suggestion
  without introducing a new token.
- `slides/2026-04-14-beyond-containers.md:5` — `footer:` frontmatter with a
  Markdown link.
- `slides/2026-04-14-beyond-containers.md:475-486` — final slide structure
  with `## Thank You — Questions?` (h2), `### Try it tonight` (h3), and an
  emoji-prefixed list.
- `scripts/generate-index.js` — existing post-build Node script pattern;
  suitable blueprint for a new `scripts/fix-meta-tags.js` step wired into
  `npm run build`.
- `package.json:13` — build chain:
  `marp ... && npm run copy-assets && npm run generate-index && npm run
  generate-favicon` — the meta-tag fix slots naturally at the end of this
  chain.

### Related Context

- Original review: #100
- PR that landed high/medium fixes: #101
- Talk delivery date: 2026-04-14 (tomorrow) — items here are follow-up polish
  and should not destabilise the tested build.

## Solution Design

### Approach

Minimal, targeted changes per item — no structural refactors. Where there are
two options in the issue, pick the lower-risk one:

- Item 1: Use existing `--spacing-md` token rather than inventing a new
  offset. One token swap, two call sites.
- Item 2: Promote `##` to `#` in the slide Markdown. No CSS change, so other
  title slides using `h2` are unaffected.
- Item 3: Remove emoji prefixes. Simpler than inline SVG icons and consistent
  with the rest of the deck.
- Item 4: Add a tiny post-build Node script that rewrites built HTML to
  include the modern meta tag alongside the legacy one (additive — safe for
  older iOS).
- Item 5: Strip the Markdown link from `footer:` frontmatter; keep the
  meetup link in the title-slide body where it already appears
  (line 16).

### Implementation

See Implementation Plan below for exact diffs.

### Benefits

- Visual polish across the deck without theme-wide risk.
- Console warning resolved; keeps behaviour for legacy iOS (both tags
  emitted).
- Footer becomes visually quieter across all content slides in every talk
  using this theme.

## Implementation Plan

### Step 1: Loosen header badge offset

**File:** `themes/edera-v2.css`

**Changes:**

- Line 572: `right: var(--spacing-sm);` → `right: var(--spacing-md);`
- Line 601: same change in the `::before` fallback selector.
- Update the trailing comment on both lines to reflect the new value
  (~24px).

**Testing:** Rebuild and open `dist/2026-04-14-beyond-containers.html`;
confirm the badge no longer touches the slide edge.

### Step 2: Promote "Thank You" to h1

**File:** `slides/2026-04-14-beyond-containers.md`

**Changes:**

- Line 477: `## Thank You — Questions?` → `# Thank You — Questions?`

**Testing:** Rebuild; confirm "Thank You" clearly dominates the "Try it
tonight" subheading on the final slide.

### Step 3: Remove emoji bullets on the final slide

**File:** `slides/2026-04-14-beyond-containers.md`

**Changes:**

- Lines 484-486: strip leading emoji from each bullet. Keep the link
  targets and descriptions intact:

  ```markdown
  - [github.com/edera-dev/on](https://github.com/edera-dev/on) — run Edera locally
  - [github.com/edera-dev/am-i-isolated](https://github.com/edera-dev/am-i-isolated) — test your cluster
  - [edera.dev](https://edera.dev) · [github.com/edera-dev](https://github.com/edera-dev)
  ```

**Testing:** Rebuild; confirm bullets render consistently with other content
slides (no emoji, Edera cyan link colour).

### Step 4: Add post-build meta-tag fix script

**Files:**

- New: `scripts/fix-meta-tags.js`
- Modified: `package.json` (build script chain)

**`scripts/fix-meta-tags.js` behaviour:**

- Read every `.html` in `dist/`
- For each file containing
  `<meta name="apple-mobile-web-app-capable" content="yes">`, insert
  `<meta name="mobile-web-app-capable" content="yes">` immediately after
  (idempotent — skip if already present).
- Skip files that don't have either tag.

**`package.json` change:**

```diff
-"build": "marp -I slides/ -o dist/ && npm run copy-assets && npm run generate-index && npm run generate-favicon",
+"build": "marp -I slides/ -o dist/ && npm run copy-assets && npm run generate-index && npm run generate-favicon && npm run fix-meta-tags",
+"fix-meta-tags": "node scripts/fix-meta-tags.js",
```

**Testing:**

```bash
npm run build
grep -c 'mobile-web-app-capable' dist/2026-04-14-beyond-containers.html
# Expect: 2 (legacy + modern)
```

Also run `npm run test:smoke` to confirm no regression.

### Step 5: Strip Markdown link from footer frontmatter

**File:** `slides/2026-04-14-beyond-containers.md`

**Changes:**

- Line 5: replace the Markdown-linked meetup reference with plain text:

  ```yaml
  footer: 'April 14th, 2026 · Cloud Native and Kubernetes Edinburgh'
  ```

- Line 16 in the title slide body already carries the Markdown link — leave
  it untouched.

**Testing:** Rebuild; confirm content-slide footers render without an
underline, and the title slide still shows the clickable meetup link.

## Testing Strategy

### Unit Testing

N/A — theme CSS and Markdown slide changes; no unit-testable code beyond the
new `fix-meta-tags.js` script.

For `fix-meta-tags.js`:

- Manual smoke check via `grep` on a built HTML file (above).
- Script is idempotent by design; running it twice must not double-insert.

### Integration Testing

**Test Case 1: Build succeeds end-to-end**

1. `npm run clean && npm run build`
2. Expect exit code 0 and `dist/` populated as before.

**Test Case 2: Smoke tests still pass**

1. `npm run test:smoke`
2. Expect: no failures (the existing suite exercises all built HTML).

**Test Case 3: Visual verification of the Beyond Containers deck**

1. `npm run serve:dist`
2. Open `dist/2026-04-14-beyond-containers.html`.
3. Verify:
   - Header badge has visible breathing room from the slide edge on content
     slides.
   - Title slide unchanged (badge hidden there already).
   - Final slide: "Thank You — Questions?" dominates; "Try it tonight"
     subordinate; bullets plain (no emoji).
   - Content-slide footer is plain text (no underline).
   - Title-slide meetup link still underlined/clickable.
4. Open DevTools console: no `apple-mobile-web-app-capable` deprecation
   warning.

### Regression Testing

- Other talks built from the same theme (e.g.
  `2026-01-14-road-to-multitenancy.md`) should render identically, except:
  - Header badge slightly further from the right edge (expected — theme-wide
    change).
  - Modern meta tag added to all built HTML (harmless; additive).
  - No emoji changes (scoped to final slide of Beyond Containers only).
  - Footer changes scoped to `2026-04-14-beyond-containers.md` frontmatter
    only.

## Success Criteria

- [ ] Header badge offset loosened to `--spacing-md` in both CSS rules
- [ ] "Thank You — Questions?" promoted to `h1` on final slide
- [ ] Emoji prefixes removed from final-slide bullets
- [ ] `scripts/fix-meta-tags.js` created and wired into `npm run build`
- [ ] Built HTML contains both legacy and modern mobile-web-app meta tags
- [ ] Footer frontmatter in Beyond Containers is plain text
- [ ] `npm run build` succeeds
- [ ] `npm run test:smoke` passes
- [ ] Pre-commit hooks pass on all changes

## Files Modified

1. `themes/edera-v2.css` — loosen header badge right offset in two rules
   (Step 1)
2. `slides/2026-04-14-beyond-containers.md` — promote final slide heading,
   remove emoji bullets, de-link footer frontmatter (Steps 2, 3, 5)
3. `scripts/fix-meta-tags.js` — new post-build script (Step 4)
4. `package.json` — add `fix-meta-tags` npm script and wire into `build`
   (Step 4)
5. `docs/plan/issues/102_post_talk_polish_beyond_containers.md` — this plan
   (committed by the planning step)

## Related Issues and Tasks

### Depends On

- None.

### Blocks

- None (nice-to-have polish).

### Related

- #100 — original pre-talk review where these items were identified
- #101 — PR that landed the high/medium fixes and deferred these

### Enables

- Cleaner baseline for the next talk built on `edera-v2` (CSS improvements
  are theme-wide).

## References

- [GitHub Issue #102](https://github.com/denhamparry/talks/issues/102)
- [MARP CLI](https://github.com/marp-team/marp-cli) — HTML template source
  of the deprecated meta tag
- MDN: [`mobile-web-app-capable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name)

## Notes

### Key Insights

- Using an existing spacing token (`--spacing-md`) instead of hand-tuning a
  pixel value keeps the theme internally consistent.
- Promoting the heading via Markdown (Step 2) avoids CSS changes that would
  affect other talks' title slides using `h2`.
- The meta-tag fix is additive — keeping the legacy tag preserves behaviour
  on older iOS Safari while silencing the console warning in modern
  browsers.

### Alternative Approaches Considered

1. **Inline SVG icons replacing emoji (Item 3)** — more work, risks visual
   inconsistency across renderers; chose plain text for simplicity ❌
2. **CSS-only fix for Item 2 (`section.title h2` larger)** — would affect
   other title slides that legitimately use `h2`; chose per-slide Markdown
   promotion ✅
3. **Patch MARP template upstream (Item 4)** — valuable but out of scope
   for this talk's polish; post-build rewrite is a pragmatic local fix ❌
4. **Keep emoji, style with CSS (Item 3)** — rejected: emoji rendering is
   font-dependent and inconsistent across OSes ❌

### Best Practices

- Keep theme-wide changes (CSS) minimal and use design tokens.
- Prefer Markdown-local fixes for slide-specific issues.
- Post-build transforms should be idempotent and additive where possible.

## Plan Review

**Reviewer:** Claude Code (workflow-research-plan)
**Review Date:** 2026-04-13
**Original Plan Date:** 2026-04-13

### Review Summary

- **Overall Assessment:** Approved
- **Confidence Level:** High
- **Recommendation:** Proceed to implementation

### Strengths

- Every referenced line/file verified against the codebase:
  `themes/edera-v2.css:572` and `:601` both use `right: var(--spacing-sm)`;
  `--spacing-md` exists at line 51 (1.5rem = 24px, an exact 8px loosening);
  slide #20 structure at `slides/2026-04-14-beyond-containers.md:477-486`
  matches the plan.
- Uses an existing design token instead of a hand-tuned pixel value — keeps
  the theme internally consistent.
- Item 2 chose the Markdown-local fix (`## → #`) over a theme-wide CSS
  change, avoiding collateral impact on other title slides.
- Item 4 is additive (keeps the legacy tag alongside the modern one) and
  idempotent by design — safe to rerun.
- Item 5 correctly notes that `<!-- _footer: '' -->` on line 9 already
  hides the footer on the title slide, so the frontmatter change only
  affects content slides.

### Gaps Identified

1. **Theme-wide scope of Item 1 not flagged for visual verification on the
   other two talks**
   - **Impact:** Low
   - **Recommendation:** During implementation, spot-check
     `2025-12-04-cloud-native-manchester.html` and
     `2026-01-14-road-to-multitenancy.html` after the CSS change to
     confirm no layout regression (24px right offset should be
     unambiguously better, but worth a glance).

### Edge Cases Not Covered

1. **Non-Beyond-Containers decks with an emoji-heavy style**
   - **Current Plan:** Item 3 is scoped to the Beyond Containers final
     slide only.
   - **Recommendation:** No action — other decks are out of scope for this
     issue. Noted for completeness.

2. **`fix-meta-tags.js` running when `dist/` is empty or absent**
   - **Current Plan:** Doesn't specify behaviour.
   - **Recommendation:** Script should no-op gracefully if `dist/`
     is missing or empty (e.g. wrap the glob/readdir in a try/catch or
     existence check). Low-impact but avoids noisy errors on clean builds
     that skip steps.

### Alternative Approaches Considered

1. **Hand-tuned pixel offset for Item 1 (e.g. `right: 1.75rem`)**
   - **Pros:** Finer control over exact gap.
   - **Cons:** Diverges from the token system; ad-hoc value.
   - **Verdict:** Plan's use of `--spacing-md` is better — consistent and
     within the issue's "~8–12px" target at 8px.

2. **HTML post-processing via a regex in `generate-index.js` rather than
   a new script**
   - **Pros:** One less file.
   - **Cons:** Conflates concerns (index generation vs meta-tag fix); the
     index generator already has a clear single responsibility.
   - **Verdict:** Plan's separate script is cleaner.

### Risks and Concerns

1. **CSS change lands the day before delivery (2026-04-14)**
   - **Likelihood:** Medium (timing)
   - **Impact:** Low (visual-only)
   - **Mitigation:** Integration Test Case 3 in the plan covers visual
     verification. Run `npm run serve:dist` and eyeball all three decks
     before merging.

2. **Post-build script adds a new failure point in `npm run build`**
   - **Likelihood:** Low
   - **Impact:** Medium (would break CI if script throws)
   - **Mitigation:** Keep the script defensive (see Edge Case 2 above);
     `npm run test:smoke` in the plan's testing strategy will catch any
     regression.

### Required Changes

None.

### Optional Improvements

- [ ] Add a defensive guard in `fix-meta-tags.js` so it no-ops on missing
      `dist/` — see Edge Case 2.
- [ ] Spot-check the two other talks visually after the CSS change — see
      Gap 1.

### Verification Checklist

- [x] Solution addresses root cause identified in GitHub issue
- [x] All acceptance criteria from issue are covered (all 5 items)
- [x] Implementation steps are specific and actionable
- [x] File paths and code references are accurate (verified against the
      codebase)
- [x] Security implications considered and addressed (no attack surface
      introduced; meta-tag change is additive; no user input handled)
- [x] Performance impact assessed (negligible — CSS diff + one extra
      post-build pass on a small set of HTML files)
- [x] Test strategy covers critical paths and edge cases
- [x] Documentation updates planned (plan doc itself; no user-facing docs
      require changes)
- [x] Related issues/dependencies identified (#100, #101)
- [x] Breaking changes documented (none — purely additive/visual)
