#!/usr/bin/env node

/**
 * Smoke test for serve:dist build output
 * Verifies that all required files and assets are present after build
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const REQUIRED_FILES = [
  'index.html',
  'favicon.ico'
];
const REQUIRED_DIRS = [
  'assets',
  'assets/ederav2'
];
const REQUIRED_ASSETS = [
  'assets/ederav2/edera-logo.png'
];

let exitCode = 0;
let passed = 0;
let failed = 0;

console.log('🔍 Running smoke tests for serve:dist build output...\n');

// Check if dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ FAIL: dist/ directory does not exist');
  console.error('   Run: npm run build\n');
  process.exit(1);
}

console.log('✓ dist/ directory exists\n');

// Check required files
console.log('Checking required files:');
REQUIRED_FILES.forEach(file => {
  const filePath = path.join(DIST_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file}`);
    passed++;
  } else {
    console.error(`  ❌ ${file} - MISSING`);
    failed++;
    exitCode = 1;
  }
});

console.log('');

// Check required directories
console.log('Checking required directories:');
REQUIRED_DIRS.forEach(dir => {
  const dirPath = path.join(DIST_DIR, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`  ✓ ${dir}/`);
    passed++;
  } else {
    console.error(`  ❌ ${dir}/ - MISSING`);
    failed++;
    exitCode = 1;
  }
});

console.log('');

// Check required assets
console.log('Checking required assets:');
REQUIRED_ASSETS.forEach(asset => {
  const assetPath = path.join(DIST_DIR, asset);
  if (fs.existsSync(assetPath)) {
    console.log(`  ✓ ${asset}`);
    passed++;
  } else {
    console.error(`  ❌ ${asset} - MISSING`);
    failed++;
    exitCode = 1;
  }
});

console.log('');

// Check for at least one HTML presentation file
console.log('Checking for presentation files:');
const files = fs.readdirSync(DIST_DIR);
const htmlFiles = files.filter(f => f.endsWith('.html') && f !== 'index.html');

if (htmlFiles.length > 0) {
  console.log(`  ✓ Found ${htmlFiles.length} presentation file(s):`);
  htmlFiles.slice(0, 5).forEach(file => {
    console.log(`    - ${file}`);
  });
  if (htmlFiles.length > 5) {
    console.log(`    ... and ${htmlFiles.length - 5} more`);
  }
  passed++;
} else {
  console.error('  ❌ No presentation HTML files found');
  console.error('     Expected: At least one .html file (besides index.html)');
  failed++;
  exitCode = 1;
}

console.log('');

// Verify index.html content
console.log('Verifying index.html content:');
const indexPath = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  const checks = [
    { name: 'Has DOCTYPE', test: () => indexContent.includes('<!DOCTYPE html>') },
    { name: 'Has title', test: () => indexContent.includes('<title>') },
    { name: 'Has favicon link', test: () => indexContent.includes('favicon.ico') },
    { name: 'Has presentation links', test: () => indexContent.includes('.html') && indexContent.includes('href=') }
  ];

  checks.forEach(check => {
    if (check.test()) {
      console.log(`  ✓ ${check.name}`);
      passed++;
    } else {
      console.error(`  ❌ ${check.name} - FAIL`);
      failed++;
      exitCode = 1;
    }
  });
} else {
  console.error('  ❌ Cannot verify index.html - file missing');
  failed++;
  exitCode = 1;
}

console.log('');

// Check slide-specific assets
console.log('Checking slide-specific assets:');
const slideAssetsDir = path.join(__dirname, '..', 'slides', 'assets');
const distAssetsDir = path.join(DIST_DIR, 'assets');

if (!fs.existsSync(slideAssetsDir)) {
  console.log('  ℹ  No slides/assets/ directory found, skipping');
} else {
  // Get all asset directories in slides/assets/
  const assetDirs = fs.readdirSync(slideAssetsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (assetDirs.length === 0) {
    console.log('  ℹ  No asset directories in slides/assets/, skipping');
  } else {
    assetDirs.forEach(dir => {
      const sourceDir = path.join(slideAssetsDir, dir);
      const destDir = path.join(distAssetsDir, dir);

      if (!fs.existsSync(destDir)) {
        console.error(`  ❌ Asset directory not copied: ${dir}/`);
        failed++;
        exitCode = 1;
      } else {
        // Verify all files were copied
        const sourceFiles = fs.readdirSync(sourceDir);
        const allFilesCopied = sourceFiles.every(file => {
          const destFile = path.join(destDir, file);
          return fs.existsSync(destFile);
        });

        if (allFilesCopied) {
          console.log(`  ✓ Assets copied: ${dir}/ (${sourceFiles.length} file(s))`);
          passed++;
        } else {
          console.error(`  ❌ Some files not copied in: ${dir}/`);
          sourceFiles.forEach(file => {
            const destFile = path.join(destDir, file);
            if (!fs.existsSync(destFile)) {
              console.error(`     Missing: ${file}`);
            }
          });
          failed++;
          exitCode = 1;
        }
      }
    });
  }
}

console.log('');

// Summary
console.log('─'.repeat(50));
if (exitCode === 0) {
  console.log(`✅ All smoke tests passed! (${passed} checks)`);
  console.log('');
  console.log('Ready to run: npm run serve:dist');
} else {
  console.error(`❌ Smoke tests failed: ${failed} issue(s) found, ${passed} passed`);
  console.log('');
  console.log('Fix issues by running:');
  console.log('  npm run build');
  console.log('');
  console.log('Then run smoke tests again:');
  console.log('  npm run test:smoke');
}
console.log('─'.repeat(50));

process.exit(exitCode);
