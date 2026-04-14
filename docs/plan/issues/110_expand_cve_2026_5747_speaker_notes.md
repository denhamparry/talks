# Plan: Expand Speaker Notes for CVE-2026-5747 on Slide 7

**Issue:** #110 — Expand speaker notes for CVE-2026-5747 on slide 7 (Beyond
Containers)
**Status:** Complete
**Type:** fix (content)

## Context

Slide 7 ("This Isn't Theoretical — Recent CVEs") in
`slides/2026-04-14-beyond-containers.md` has compressed speaker notes covering
CVE-2026-5747. The speaker wants fuller, narrative-ready notes for two key
talking points so they can speak from them naturally without reading CVE IDs from
the slide.

## Scope

- **Single file change:** `slides/2026-04-14-beyond-containers.md`
- **Lines affected:** 163–182 (the `<!-- Speaker Notes: ... -->` block for
  slide 7)
- **No changes to slide content** (table, heading, footer quote remain
  untouched)

## Implementation Tasks

### Task 1: Expand CVE-2026-5747 VMM-layer talking point

Replace the current compressed bullet (lines 173–177) with a fuller narrative
block that covers:

- What the bug is: OOB write in Firecracker's virtio-pci transport, guest root
  can write past bounds into host VMM process memory
- Why it matters for the talk's argument: the class of shared-resource bug isn't
  confined to kernel + runtime + GPU toolkit — it appears in the VMM layer too
- The disclosure context: reported by Anthropic via AWS VDP, disclosed
  2026-04-07
- The architectural lesson: even microVM sandboxes have host-userspace attack
  surface; the argument is about where bugs land (blast radius), not whether
  they exist

### Task 2: Expand cadence-over-memorisation talking point

Replace the current one-liner (lines 178–179) with speaker-ready notes that
help land the message:

- Don't read CVE numbers from the slide — gesture at the table
- The point is the pattern: every few months, another shared-resource escape
- Frame it as "this is the new normal" — not a one-off, but a recurring class
- This sets up the second half of the talk (microVM solution)

### Task 3: Preserve source attributions and pacing

Keep the existing source references and time check intact:

- Source: Beganović, "Your Container Is Not a Sandbox" (March 2026)
- CVE-2026-5747 via GHSA-776c-mpj7-jm3r / AWS-2026-015
- Time check: ~7 minutes in

### Task 4: Verify build

Run `make build` to confirm the change doesn't break the MARP build.

## Files Modified

- `slides/2026-04-14-beyond-containers.md` (speaker notes only, lines 163–182)

## Acceptance Criteria

- [ ] Speaker notes for slide 7 expanded with narrative detail for both sections
- [ ] Notes remain in `<!-- Speaker Notes: ... -->` HTML comment format
- [ ] No changes to slide content (table, heading, footer quote)
- [ ] Build passes (`make build`)

## Risk Assessment

- **Low risk** — changes are inside HTML comments (invisible to rendered slides)
- **No functional impact** — speaker notes don't affect build output
- **Build verification** is the only gate needed
