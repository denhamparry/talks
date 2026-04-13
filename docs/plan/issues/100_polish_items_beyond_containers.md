---
issue: 100
title: Polish items for Beyond Containers (2026-04-14)
status: Reviewed (Approved)
branch: denhamparry.co.uk/fix/gh-issue-100
---

# Plan: Polish items for Beyond Containers talk

Issue: denhamparry/talks#100

## Scope

Addresses items #1, #2, #4, #8, #9 from the review issue. These are the
concrete, high-impact polish items that can be verified visually before the
talk on 2026-04-14. Items #3, #5, #6, #7, #10 are deferred — they are either
subjective, upstream (MARP), or low-value.

## Changes

### 1. Fix `two-columns` layout — `themes/edera-v2.css`

**Problem:** `section.two-columns` uses `grid-template-columns: 1fr 1fr` but
doesn't explicitly place children. CSS auto-places h2 → col 1, ul → col 2,
next h2 → col 1, next ul → col 2 — producing a 2×2 stacked layout instead of
side-by-side columns. Both h2 sub-sections end up in the same column pair,
which defeats the comparison.

**Fix:** Explicit grid placement so first `h2` + first content block land in
column 1, second `h2` + second content block land in column 2. h1 spans both
columns in row 1.

```css
section.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 1fr;
  column-gap: var(--spacing-lg);
  row-gap: var(--spacing-sm);
  align-items: start;
}

section.two-columns > h1 { grid-column: 1 / -1; grid-row: 1; }
section.two-columns > h2:nth-of-type(1) { grid-column: 1; grid-row: 2; }
section.two-columns > h2:nth-of-type(2) { grid-column: 2; grid-row: 2; }
section.two-columns > ul:nth-of-type(1),
section.two-columns > ol:nth-of-type(1),
section.two-columns > p:nth-of-type(1),
section.two-columns > pre:nth-of-type(1) { grid-column: 1; grid-row: 3; }
section.two-columns > ul:nth-of-type(2),
section.two-columns > ol:nth-of-type(2),
section.two-columns > p:nth-of-type(2),
section.two-columns > pre:nth-of-type(2) { grid-column: 2; grid-row: 3; }
```

Verified that the two-column template (`templates/layouts/two-column.md`)
covers all three shapes: ul+ul, ul+ul, pre+ul. `pre` added for the code
example.

### 2. Title slide logo + footer — `slides/2026-04-14-beyond-containers.md`

**Problem (#2):** inline Edera PNG has an opaque white background that clashes
with the dark teal title slide.

**Problem (#4):** title slide repeats the meetup/date in both the slide body
and the MARP footer.

**Fix:** remove the inline `<img>` block and suppress the footer on the title
slide using Marp's `_footer: ''` directive.

### 3. Clean up speaker notes — `slides/2026-04-14-beyond-containers.md`

Remove obsolete `HOLDING IMAGE: refine or replace before the talk` lines at
markdown lines 147, 284, and 432 — the diagrams have been produced.

Also remove the leftover `Update [Event Name] placeholder before the talk`
line at 28 — the event is set.

### 4. CVE table row tweak — `slides/2026-04-14-beyond-containers.md`

Shorten CVE-2026-5747 Impact cell to reduce wrapping:
`Guest root → host VMM OOB write (potential RCE)`

## Files Modified

- `themes/edera-v2.css`
- `slides/2026-04-14-beyond-containers.md`
- `docs/plan/issues/100_polish_items_beyond_containers.md` (this file)

## Verification

1. `npm run build` — build succeeds, no errors
2. Open `dist/2026-04-14-beyond-containers.html` in a browser, navigate to:
   - Slide 4 (Namespaces ≠ Isolation) — h2s side-by-side, bullets under each
   - Slide 12 (Shared Kernel vs MicroVM) — same shape
   - Slide 1 (title) — no logo frame, no duplicate footer
   - Slide 7 (CVE table) — last row reads on one line
3. `make test-smoke` — smoke tests pass
4. `pre-commit run --all-files`

## Self-review

- Risk: two-columns CSS change may affect `security-in-cloud-native-landscape`
  or any other deck using the class. Mitigation: change is a structural
  improvement; existing decks following the h2+content pattern will benefit
  from the fix. No slide today relies on the current (broken) auto-flow order.
- Risk: `_footer: ''` is slide-scoped in MARP — verified syntactically
  correct.
- Risk: removing the title-slide logo reduces branding on the opening frame.
  Mitigation: presenter says "Lewis from Edera" in the opening hook; the
  URL `Edera.dev` is still visible. The header badge appears on every content
  slide.
