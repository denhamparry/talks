#!/usr/bin/env node

/**
 * Inject the modern `mobile-web-app-capable` meta tag alongside the legacy
 * `apple-mobile-web-app-capable` tag emitted by MARP's HTML template.
 *
 * Idempotent: safe to run multiple times. Additive: the legacy tag is
 * preserved for older iOS Safari; the modern tag silences the console
 * deprecation warning in recent Chromium.
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const LEGACY_TAG_RE =
  /<meta name="apple-mobile-web-app-capable" content="yes">/;
const MODERN_TAG = '<meta name="mobile-web-app-capable" content="yes">';

function fixFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new Error(`fix-meta-tags: failed to read ${filePath}: ${err.message}`);
  }

  // Skip files without the legacy tag and files already patched.
  if (!LEGACY_TAG_RE.test(content)) return false;
  if (content.includes(MODERN_TAG)) return false;

  const patched = content.replace(
    LEGACY_TAG_RE,
    (match) => `${match}\n    ${MODERN_TAG}`,
  );
  try {
    fs.writeFileSync(filePath, patched, 'utf-8');
  } catch (err) {
    throw new Error(`fix-meta-tags: failed to write ${filePath}: ${err.message}`);
  }
  return true;
}

function main() {
  // Wired into `npm run build` after MARP + copy-assets, so dist/ must
  // exist by this point. If it doesn't, an upstream step failed silently —
  // fail loud rather than masking the real problem.
  if (!fs.existsSync(DIST_DIR)) {
    console.error(
      `fix-meta-tags: ${DIST_DIR} does not exist — upstream build step likely failed`,
    );
    process.exit(1);
  }

  const entries = fs.readdirSync(DIST_DIR);
  const htmlFiles = entries.filter((name) => name.endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.error('fix-meta-tags: no HTML files in dist/ — MARP did not produce output');
    process.exit(1);
  }

  let patched = 0;
  let alreadyHad = 0;
  for (const name of htmlFiles) {
    const filePath = path.join(DIST_DIR, name);
    if (fixFile(filePath)) {
      patched += 1;
    } else {
      // File either had no legacy tag, or already contained the modern tag.
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes(MODERN_TAG)) alreadyHad += 1;
    }
  }

  console.log(
    `fix-meta-tags: patched ${patched}/${htmlFiles.length} HTML file(s) ` +
      `(${alreadyHad} already had the modern tag)`,
  );

  // Drift warning: if we have HTML files but patched nothing and none
  // already had it, MARP's template likely changed shape. Non-fatal, but
  // surface it so the script doesn't quietly become a no-op.
  if (patched === 0 && alreadyHad === 0) {
    console.warn(
      'fix-meta-tags: WARNING — no files matched the legacy tag pattern. ' +
        'MARP template may have changed; review the regex.',
    );
  }
}

main();
