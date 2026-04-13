---
issue: 103
title: "enhancement: add CHANGELOG entry workflow for slide polish changes"
status: Planning
---

# Plan: CHANGELOG entry workflow for build-system / slide polish changes

## Problem

The repo's `CHANGELOG.md` documents the build chain (line 51:
`marp → copy-assets → generate-index → generate-favicon`) but this is now stale.
Issue #102 added a new build step `fix-meta-tags` (see `package.json` line 14-15)
and updated the build chain, yet `CHANGELOG.md` was never updated. There is no
mechanism that reminds contributors to update `CHANGELOG.md` when
build-system-relevant files change.

Issue #103 proposes either:

1. Require CHANGELOG updates whenever `package.json` build scripts change, **or**
2. Auto-generate a CHANGELOG diff section from conventional-commit messages.

We will implement **option 1** (a lightweight pre-commit warning hook). Option 2
is heavier and better left to a release-time tool like `git-cliff` — out of
scope for a nice-to-have.

## Approach

Three focused changes:

1. **`scripts/check-changelog.sh`** — a local pre-commit hook script. When
   staged changes touch build-system files (`package.json` scripts section,
   `scripts/*.js`, `Dockerfile`, `nginx.conf`, `docker-compose.yml`), the hook
   checks that `CHANGELOG.md` is also staged. If not, it prints a warning and
   exits **0** (non-blocking reminder — does not fail the commit). Rationale:
   solo-maintainer repo; a hard block would be annoying for trivial refactors.
   The warning is enough to trigger memory.

2. **`.pre-commit-config.yaml`** — register the script as a `local` hook so it
   runs alongside the existing hooks on every commit.

3. **`CHANGELOG.md`** — add an `[Unreleased]` section populating the missing
   entries (at minimum the `fix-meta-tags` build step from #102). Keeps the
   changelog honest from this point forward without rewriting history.

4. **`CLAUDE.md`** — add a short "Changelog convention" section under the
   project instructions so Claude Code (and humans) know when a CHANGELOG entry
   is required.

## Files Modified

- `scripts/check-changelog.sh` (new)
- `.pre-commit-config.yaml`
- `CHANGELOG.md`
- `CLAUDE.md`

## Implementation Tasks

1. Write `scripts/check-changelog.sh` with the "staged build files imply staged
   CHANGELOG" check. Use `git diff --cached --name-only` so it only considers
   the current commit's staged files. Make it executable.
2. Add a `local` hook entry to `.pre-commit-config.yaml` pointing at the script,
   with `stages: [pre-commit]` and `pass_filenames: false`.
3. Update `CHANGELOG.md` `[Unreleased]` section with an entry documenting the
   `fix-meta-tags` build step and the new check-changelog tooling.
4. Add a "Changelog convention" section to `CLAUDE.md` (under Git Workflow).
5. Run pre-commit locally and confirm the new hook runs and the existing hooks
   still pass.

## Acceptance Criteria

- [ ] `scripts/check-changelog.sh` exists and is executable.
- [ ] Pre-commit runs the new hook alongside the existing hooks.
- [ ] Modifying `package.json` without touching `CHANGELOG.md` produces a
      visible warning (but does not block the commit).
- [ ] `CHANGELOG.md` `[Unreleased]` section lists the `fix-meta-tags` addition.
- [ ] `CLAUDE.md` documents when a CHANGELOG entry is expected.
- [ ] All pre-commit hooks pass.

## Non-goals

- Auto-generating CHANGELOG entries from commit messages (suggested option 2).
- Blocking commits hard on CHANGELOG absence (friction too high for a solo
  repo).
- Backfilling every missing CHANGELOG entry since v1.0.4.
