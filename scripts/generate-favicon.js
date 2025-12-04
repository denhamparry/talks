#!/usr/bin/env node

/**
 * Generate favicon from Edera logo
 * Falls back gracefully if ImageMagick is not available
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOGO_PATH = 'themes/assets/ederav2/edera-logo.png';
const FAVICON_PATH = 'dist/favicon.ico';
const FAVICON_SIZE = '32x32';

function main() {
  // Check if logo exists
  if (!fs.existsSync(LOGO_PATH)) {
    console.warn('⚠️  Logo not found at', LOGO_PATH, '- skipping favicon generation');
    process.exit(0);
  }

  // Ensure dist directory exists
  const distDir = path.dirname(FAVICON_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Try to generate favicon with ImageMagick
  try {
    execSync('command -v convert >/dev/null 2>&1', { stdio: 'ignore' });
    execSync(`convert ${LOGO_PATH} -resize ${FAVICON_SIZE} ${FAVICON_PATH}`, { stdio: 'inherit' });
    console.log('✅ Favicon generated successfully');
  } catch (error) {
    console.warn('⚠️  ImageMagick not found - skipping favicon generation');
    console.warn('   Install ImageMagick to enable favicon generation:');
    console.warn('   - macOS: brew install imagemagick');
    console.warn('   - Ubuntu/Debian: sudo apt-get install imagemagick');
    console.warn('   - Alpine: apk add imagemagick');
  }
}

main();
