---
issue: 96
title: Add CVE-2026-5747 (Firecracker virtio-pci) to Beyond Containers talk
status: Complete
branch: denhamparry.co.uk/feat/gh-issue-096
worktree: ~/git/denhamparry/talks/gh-issue-096
---

# Plan: Add CVE-2026-5747 to Beyond Containers talk

## Context

Issue denhamparry/talks#96 asks for the *Beyond Containers* talk
(`slides/2026-04-14-beyond-containers.md`, delivered **2026-04-14** at
Cloud Native Edinburgh) to cover **CVE-2026-5747** — a HIGH-severity
guest-to-host out-of-bounds write in Firecracker's virtio-pci transport,
disclosed 2026-04-07 and reported by Anthropic via AWS's VDP.

The CVE is a textbook instance of the VMM-in-host-userspace attack class
the talk's blast-radius argument is built around. It fits two existing
slides without any structural change to the deck:

1. The "Recent CVEs" table on slide 6 (currently ends at CVE-2025-38617)
2. The "Open-Source Landscape" slide (currently lists Firecracker)
3. The closing Q&A speaker notes (this CVE will almost certainly come up)

Full KB research is already written — no fresh research needed:

- `edera-kb/docs/knowledge-base/reference/cve-2026-5747-advisory.md`

## Relevant code

- `slides/2026-04-14-beyond-containers.md:156-165` — "This Isn't
  Theoretical — Recent CVEs" table. Append one row.
- `slides/2026-04-14-beyond-containers.md:311-330` — "Open-Source
  Landscape" slide. Firecracker is row 1 of the table. Speaker notes
  live at lines 322-330.
- `slides/2026-04-14-beyond-containers.md:467-520` — closing slide
  speaker notes with Q&A prep. Add one prepared answer.

## Approach

### Edit 1 — Append CVE-2026-5747 to the Recent CVEs table

Insert one row at the bottom of the table (after CVE-2025-38617):

```markdown
| **CVE-2026-5747** | 2026 | Firecracker virtio-pci | Guest root → OOB write in host VMM process (potential RCE) |
```

Update one speaker-notes bullet on the same slide to reflect that the
cadence argument now spans kernel, runtime, GPU toolkit, **and VMM**
surfaces — reinforcing the "every layer keeps producing this class of
bug" point. Keep the source attribution to Beganović intact but add a
one-liner about CVE-2026-5747 as a this-week example.

### Edit 2 — Speaker notes on the Open-Source Landscape slide

Add a single bullet to the speaker notes acknowledging CVE-2026-5747 as
a timely Firecracker example. Keep the tone neutral — the KB advisory is
explicit that the remediation is "upgrade Firecracker" and that Edera
does not "prevent" this CVE; the architectural point is about *where a
bug lands*, not whether any given VMM has bugs.

Proposed bullet:

```text
- Firecracker shipped CVE-2026-5747 (virtio-pci OOB write, HIGH) on
  2026-04-07 — reported by Anthropic via AWS VDP. Upgrade is 1.14.4 /
  1.15.1 if you run --enable-pci. Good example of the
  VMM-in-userspace class: a device-model bug lands in a host userspace
  process with privileged guest memory access. The architectural point
  is where the bug *lands*, not that any given VMM has bugs.
```

### Edit 3 — Q&A prep on closing slide

Add one prepared Q&A answer near the existing list (lines ~497-517) so
the question doesn't catch the speaker flat-footed:

```text
Q: "What about the Firecracker virtio-pci CVE from last week?"
A: CVE-2026-5747. Guest-to-host OOB write in Firecracker's PCI
   transport. Anthropic reported it via AWS's VDP. Fix is Firecracker
   1.14.4 / 1.15.1 — upgrade if you run --enable-pci. The broader
   point is architectural: a VMM in host userspace means a
   device-model bug is a host-userspace bug, which is one mitigation
   step from host RCE. A Type-1 boundary puts that same class of bug
   in a different, smaller trust domain.
```

## Non-goals

- **No new slide.** The issue is additive within existing slides only.
  The talk is 25 minutes + 5 Q&A and the pacing is already tight — no
  new content slides.
- **No extra citations slide.** References live in the KB, not the deck.
- **No diagram changes.** The existing "Shape of the Problem" /
  "Shape of the Solution" / "Blast Radius" SVGs already carry the
  architectural argument visually.
- **No tone change.** The deck does not dunk on Firecracker; neither
  should this edit. Keep the KB advisory's careful framing.

## Files Modified

- `slides/2026-04-14-beyond-containers.md` — three small edits
  (one table row + two speaker-notes additions)

No other files need to change. No assets, no theme changes, no build
config changes.

## Validation

1. `make build` — confirm HTML renders without MARP errors.
2. `make test-smoke` — confirm smoke tests still pass.
3. Visual check of the rendered HTML:
   - CVE table row renders with bold CVE ID and correct alignment
   - Open-Source Landscape slide unchanged visually (speaker notes
     only)
   - Closing slide Q&A speaker notes unchanged visually
4. `pre-commit run --all-files` — confirm prettier/markdownlint pass.

## Risks / notes

- **Delivery is 2026-04-14 (tomorrow).** This is additive and
  low-risk — only one markdown file is touched — but it should land
  today.
- **Tone discipline.** CVE-2026-5747 is a gift of an example, but the
  talk's credibility depends on not overclaiming. The KB advisory's
  language ("class not instance", "where the bug lands", "hypervisors
  are not bug-free") is the model to follow.
- **The table already has 6 rows.** Adding a 7th keeps it within one
  page. If it overflows at the target projection size, drop the
  oldest (CVE-2024-0132) rather than shrinking the font — the cadence
  argument is strongest with recent CVEs anyway. Validate visually.
