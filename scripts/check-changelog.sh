#!/usr/bin/env bash
# Warn (do not block) when build-system files change without a CHANGELOG update.
#
# Rationale: keeps CHANGELOG.md in sync with build-chain changes (see #103).
# The hook is deliberately non-blocking — a hard block would punish trivial
# refactors in a solo-maintainer repo. The visible warning is enough to jog
# memory for entries that actually matter.

set -euo pipefail

# Files whose changes typically warrant a CHANGELOG entry.
# Leaf-name patterns are anchored with `(^|/)...$` so `package.json` does not
# match `slides/assets/some-package.json`. Directory patterns use `^dir/`.
build_patterns=(
  '(^|/)package\.json$'
  '(^|/)package-lock\.json$'
  '^scripts/'
  '(^|/)Dockerfile$'
  '(^|/)docker-compose\.yml$'
  '(^|/)nginx\.conf$'
  '^themes/'
  '^\.github/workflows/'
)

# Non-blocking contract: if `git diff` itself fails (corrupt index, detached
# state, etc.) we must NOT abort with set -e exit 1 — that would block the
# commit. Swallow the failure and exit 0 with a diagnostic instead. We also
# drop --diff-filter so deletions (D) of build files are detected too — removing
# a workflow or script is a build-surface change worth a CHANGELOG entry.
staged=$(git diff --cached --name-only 2>/dev/null) || {
  echo "check-changelog: skipping (git diff failed)" >&2
  exit 0
}
if [ -z "$staged" ]; then
  exit 0
fi

build_changed=0
for pattern in "${build_patterns[@]}"; do
  if printf '%s\n' "$staged" | grep -Eq "$pattern"; then
    build_changed=1
    break
  fi
done

if [ "$build_changed" -eq 0 ]; then
  exit 0
fi

if printf '%s\n' "$staged" | grep -qx 'CHANGELOG.md'; then
  exit 0
fi

cat >&2 <<'EOF'
⚠️  check-changelog: build-system files are staged but CHANGELOG.md is not.

Consider adding an entry under [Unreleased] in CHANGELOG.md describing the
change. If this commit genuinely does not need a CHANGELOG entry (e.g. pure
refactor, typo fix, CI-only tweak), you can ignore this warning.

This hook does not block the commit.
EOF

exit 0
