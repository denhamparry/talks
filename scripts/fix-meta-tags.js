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
  const content = fs.readFileSync(filePath, 'utf-8');

  // Skip files without the legacy tag and files already patched.
  if (!LEGACY_TAG_RE.test(content)) return false;
  if (content.includes(MODERN_TAG)) return false;

  const patched = content.replace(
    LEGACY_TAG_RE,
    (match) => `${match}${MODERN_TAG}`,
  );
  fs.writeFileSync(filePath, patched, 'utf-8');
  return true;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.log(`fix-meta-tags: ${DIST_DIR} not found, nothing to do`);
    return;
  }

  const entries = fs.readdirSync(DIST_DIR);
  const htmlFiles = entries.filter((name) => name.endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.log('fix-meta-tags: no HTML files in dist/, nothing to do');
    return;
  }

  let patched = 0;
  for (const name of htmlFiles) {
    if (fixFile(path.join(DIST_DIR, name))) patched += 1;
  }
  console.log(
    `fix-meta-tags: patched ${patched}/${htmlFiles.length} HTML file(s)`,
  );
}

main();
