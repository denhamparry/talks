---
issue: 106
title: Correct open-source claim on Beyond Containers slide 13
status: Complete
branch: denhamparry.co.uk/fix/gh-issue-106
worktree: ~/git/denhamparry/talks/gh-issue-106
---

# Plan: Correct open-source claim on Beyond Containers slide 13

## Context

Issue denhamparry/talks#106 reports a factual error on slide 13 of the
*Beyond Containers* talk (`slides/2026-04-14-beyond-containers.md`):

- Slide title: **"The Open-Source Landscape"**
- Closing line: **"All four are open source. All four give you a per-workload kernel."**
- Table rows: Firecracker, Cloud Hypervisor, Kata Containers, **Edera**

Edera is not open source, so both the heading framing and the closing
assertion are inaccurate. Speaker already discloses employment at Edera
in the existing speaker notes, so the fix is about aligning the on-slide
text with what's said verbally.

The talk was already delivered (2026-04-14). This is a post-talk content
correction so the published deck remains accurate as a reference.

## Relevant code

- `slides/2026-04-14-beyond-containers.md` — the "Open-Source Landscape"
  slide. Contains the title, the four-row table, the closing assertion
  line, and speaker notes.

## Approach

### Edit 1 — Retitle the slide

Replace `# The Open-Source Landscape` with `# The MicroVM Landscape`.
This removes the licensing claim from the frame, keeps the focus on the
architectural point (per-workload kernels), and matches how the talk
positions this section in practice.

### Edit 2 — Revise the closing line

Replace:

> All four are open source. All four give you a per-workload kernel.

with something that preserves the shared technical point while
accurately distinguishing licensing:

> Firecracker, Cloud Hypervisor, and Kata are open source; Edera is a
> commercial product built on open-source components. All four give you
> a per-workload kernel.

### Edit 3 — Clarify the Edera table row (Notes column)

Update the **Notes** column for the Edera row to reflect the licensing
posture explicitly. Current text: `Paravirtualized, near-native perf`.
Proposed: `Paravirtualized, near-native perf; commercial (uses OSS components)`.

### Edit 4 — Speaker notes tweak (minor)

The existing speaker note already says "Edera is the one I work on — be
upfront about that". Keep that line intact and reinforce it with a
parallel note: "Be explicit that Edera is commercial, unlike the other
three." No other speaker-notes changes.

## Files Modified

- `slides/2026-04-14-beyond-containers.md`

## Acceptance criteria (from issue)

- [x] Slide title no longer asserts all listed tools are open source
- [x] Closing line accurately represents each tool's licensing
- [x] Speaker notes remain consistent with the revised framing

## Out of scope

- Any changes to other slides in the deck
- Rebuilding / redeploying the site (CI will handle the PR preview; the
  merge to `main` triggers production build via existing workflow)
- Broader factual review of other claims in the talk

## Risks

- **Low**: pure content edit, no build or runtime surface change.
- No `CHANGELOG.md` entry needed — slide content edits are explicitly
  listed as "skip CHANGELOG" in `CLAUDE.md`.

## Review Summary

**Overall Assessment:** Approved (iteration 1/3)

**Factual checks:**

- Firecracker, Cloud Hypervisor, Kata Containers are all Apache-2.0
  licensed — the "three are open source" framing is accurate.
- Edera's commercial product (Edera Protect) is proprietary, though the
  company has open-sourced components historically. "Commercial product
  built on open-source components" is a safe, accurate characterisation
  that doesn't overclaim in either direction.

**Scope checks:**

- Single-file change confined to one slide — matches repo norms for
  post-talk content fixes (see plans #96, #100, #102).
- No build surface or theme changes → no CHANGELOG entry required.
- No redeploy concern — production rebuild happens via existing CI on
  merge to `main`.

**Nits (non-blocking, resolved during implementation):**

- Edit 4 phrasing ("No other speaker-notes changes") conflicts with the
  proposed *addition* of a parallel note. Treat the added line as an
  augmentation, not a replacement — the existing "Edera is the one I
  work on" line stays intact.
- "MicroVM Landscape" title is defensible despite Kata being an
  orchestrator rather than a VMM — Kata's reason-to-exist is running
  microVMs, so the category fits.

**Required Changes:** None.

**Ready for implementation.**
