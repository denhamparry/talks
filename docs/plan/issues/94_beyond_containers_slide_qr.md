---
issue: 94
title: Add QR code to final slide of Beyond Containers deck
status: Complete
branch: denhamparry.co.uk/feat/gh-issue-094
worktree: ~/git/denhamparry/talks/gh-issue-094
---

# Plan: Add slide-deck QR code to final slide of Beyond Containers

## Context

Issue denhamparry/talks#94 asks for a QR code on the final slide of the
Beyond Containers talk so attendees at Cloud Native Edinburgh
(2026-04-14) can grab the deck without typing the URL.

The final slide already contains **one** QR code pointing at
`github.com/edera-dev/on` (the "Try it tonight" CTA). We need to add a
**second** QR pointing at the hosted deck:

`https://talks.denhamparry.co.uk/2026-04-14-beyond-containers.html`

Keeping both QRs preserves the existing "hands-on tonight" CTA while
adding the "get the slides" CTA.

## Relevant code

- `slides/2026-04-14-beyond-containers.md:467-482` — closing "Thank
  You" slide (`_class: title`). Contains the existing `edera-on-qr.png`
  in a centred `<div>`.
- `slides/assets/2026-04-14-beyond-containers/edera-on-qr.png` —
  existing QR, `290x290`, 1-bit colormap PNG. Displayed at `200x200` px
  via inline HTML.
- `CLAUDE.md` (project) — asset convention: per-talk images live under
  `slides/assets/<talk-name>/` and are copied to `dist/assets/` at
  build time by `npm run build`.

## Approach

1. **Generate a new QR PNG** for the hosted slide URL using `qrencode`
   via `nix-shell` (no persistent install — matches the repo's
   language-agnostic, tooling-on-demand posture):

   ```bash
   nix-shell -p qrencode --run \
     "qrencode -o slides/assets/2026-04-14-beyond-containers/slides-qr.png \
       -s 10 -m 2 \
       'https://talks.denhamparry.co.uk/2026-04-14-beyond-containers.html'"
   ```

   Output: `~290x290` 1-bit PNG, matching the style of the existing
   `edera-on-qr.png`.

2. **Replace the single centred `<div>` on the Thank You slide** with
   a two-column layout that places the two QRs side-by-side, each
   with its own label:

   - Left QR: **Get the slides** → `talks.denhamparry.co.uk/...`
   - Right QR: **Try Edera On** → `github.com/edera-dev/on`

   Use inline CSS with flexbox so the layout stays self-contained in
   the markdown (the theme doesn't need changing).

3. **Verify the build** locally:

   ```bash
   make build
   make test-smoke
   ```

   Open `dist/2026-04-14-beyond-containers.html#20` in a browser and
   confirm both QRs render at a scannable size on the final slide.

4. **Scan-test** the new QR with a phone camera (or `zbarimg` if
   available) to confirm it resolves to the correct URL before
   committing.

## Files modified

- `slides/2026-04-14-beyond-containers.md` — update final slide markup
  to show two QRs with labels
- `slides/assets/2026-04-14-beyond-containers/slides-qr.png` — **new
  file**, generated QR for the deck URL

## Out of scope

- Generalising the "QR on the closing slide" pattern into a reusable
  template. Noted in the issue as a nice-to-have; leave for a
  follow-up so this PR stays minimal and focused on the talk that's
  happening tomorrow.
- Changing the existing `edera-on-qr.png` or its caption.

## Acceptance criteria

- [ ] `slides/assets/2026-04-14-beyond-containers/slides-qr.png`
      committed, scannable, resolves to
      `https://talks.denhamparry.co.uk/2026-04-14-beyond-containers.html`
- [ ] Final slide displays both QRs with clear, readable captions
- [ ] Layout works in HTML build (primary delivery format) — PDF build
      is nice-to-have but not blocking
- [ ] `make build` succeeds
- [ ] `make test-smoke` passes
- [ ] No unrelated files modified

## Risks / unknowns

- **Vertical space on the title-class slide.** The closing slide
  already has the heading, name/links, three bullet points, and a QR.
  Two QRs + labels may tip it past the slide height. Mitigation: keep
  each QR at ~160-180 px (slightly smaller than the current 200 px)
  and verify visually before committing. If it still overflows, fall
  back to smaller QRs (140 px) — QR codes remain scannable down to
  ~120 px at typical viewing distance.
- **`nix-shell` cold-fetch time.** First `qrencode` invocation will
  fetch the package from the cache. Subsequent runs are instant.
  Documented in the approach.

## Test plan

1. Generate QR, confirm file is a valid PNG
2. Decode the QR (phone camera or `zbarimg`) → expect deck URL
3. `make build` — HTML build succeeds
4. `make test-smoke` — smoke tests pass
5. Visually verify final slide in
   `dist/2026-04-14-beyond-containers.html#20` — both QRs visible,
   captioned, not overflowing
