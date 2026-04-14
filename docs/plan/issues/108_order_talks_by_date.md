# Plan: Order talks by date (newest first) on index page

**Issue:** #108
**Status:** Reviewed (Approved)
**Type:** Bug fix

## Problem

The index page at `https://talks.denhamparry.co.uk/` sorts presentations
alphabetically by their human-readable footer date string (e.g., "April" <
"December" < "January") instead of chronologically. The sort in
`scripts/generate-index.js:117` uses `b.date.localeCompare(a.date)` where
`date` is the full footer string.

## Solution

Add a `sortDate` field to each presentation metadata object, extracted from the
`YYYY-MM-DD` prefix in the filename. Use `sortDate` for sorting (ISO dates sort
correctly as strings) and keep the existing `date` field for display.

Talks without a date in the filename sort to the bottom (empty string sorts
last in descending order when handled explicitly).

## Implementation Tasks

### Task 1: Add `sortDate` field to `extractMetadata` return value

**File:** `scripts/generate-index.js`
**Lines:** ~84–96

Extract the ISO date from the filename and return it as a separate `sortDate`
field alongside the existing `date` (display) field.

```javascript
const dateMatch = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/);
const sortDate = dateMatch ? dateMatch[1] : '';
```

Add `sortDate` to the returned object.

### Task 2: Update sort comparator to use `sortDate`

**File:** `scripts/generate-index.js`
**Line:** 117

Change:

```javascript
.sort((a, b) => b.date.localeCompare(a.date));
```

To:

```javascript
.sort((a, b) => b.sortDate.localeCompare(a.sortDate));
```

This ensures ISO date string comparison (`2026-04-14` > `2026-01-14` >
`2025-12-04`), which is chronologically correct.

### Task 3: Verify with build and smoke test

Run `npm run build` and `npm run test:smoke` to confirm the index generates
correctly with the new ordering.

## Files Modified

- `scripts/generate-index.js`

## Expected Result

Index page order (newest first):

1. Beyond Containers (April 14th, 2026)
2. The Road to Multitenancy (January 14th, 2026)
3. What I wish I knew about AI... (December 4th, 2025)
4. Security in Cloud Native Landscape (no date — sorts to bottom)

## Acceptance Criteria

- [ ] Talks with ISO dates in filenames sort newest-first
- [ ] Talks without dates in filenames appear at the bottom
- [ ] Display dates (footer strings) remain unchanged
- [ ] `npm run build` succeeds
- [ ] `npm run test:smoke` passes
