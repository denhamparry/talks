#!/usr/bin/env node

/**
 * Copy favicon from themes/assets to dist/
 * Uses the denhamparry.co.uk favicon
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FAVICON = 'themes/assets/favicon.ico';
const DEST_FAVICON = 'dist/favicon.ico';

function main() {
  // Check if source favicon exists
  if (!fs.existsSync(SOURCE_FAVICON)) {
    console.warn('⚠️  Favicon not found at', SOURCE_FAVICON, '- skipping favicon copy');
    process.exit(0);
  }

  // Ensure dist directory exists
  const distDir = path.dirname(DEST_FAVICON);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy favicon
  try {
    fs.copyFileSync(SOURCE_FAVICON, DEST_FAVICON);
    console.log('✅ Favicon copied successfully');
  } catch (error) {
    console.error('❌ Failed to copy favicon:', error.message);
    process.exit(1);
  }
}

main();
