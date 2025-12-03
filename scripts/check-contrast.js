#!/usr/bin/env node

/**
 * Edera V2 Theme - WCAG Contrast Audit Script
 *
 * This script verifies the contrast ratios of color combinations used in the
 * Edera V2 MARP theme against WCAG 2.1 AA and AAA standards.
 *
 * Usage: node scripts/check-contrast.js
 */

const wcag = require('wcag-contrast');

// Edera V2 theme colors (from themes/edera-v2.css)
const colors = {
  darkTeal: '#013a3b',
  lightMint: '#d0fdf2',
  cyanAccent: '#02f4d5',
  white: '#ffffff',
  black: '#000000'
};

// Color combinations used in the theme
const combinations = [
  {
    name: 'Body text on light mint background',
    fg: colors.darkTeal,
    bg: colors.lightMint,
    usage: 'Main content slides - paragraphs, lists, normal text',
    textSize: 'normal'
  },
  {
    name: 'Cyan accent on dark teal background',
    fg: colors.cyanAccent,
    bg: colors.darkTeal,
    usage: 'Title slides - headings, emphasis on dark backgrounds',
    textSize: 'large'
  },
  {
    name: 'Light mint text on dark teal background',
    fg: colors.lightMint,
    bg: colors.darkTeal,
    usage: 'Title slides - body text, subtitles',
    textSize: 'normal'
  },
  {
    name: 'White text on dark teal background',
    fg: colors.white,
    bg: colors.darkTeal,
    usage: 'Image overlay slides - text over dark overlay',
    textSize: 'normal'
  },
  {
    name: 'Cyan accent on light mint background',
    fg: colors.cyanAccent,
    bg: colors.lightMint,
    usage: 'Content slides - headings (H1), links, emphasis, bullet markers',
    textSize: 'large'
  },
  {
    name: 'Dark teal on white background',
    fg: colors.darkTeal,
    bg: colors.white,
    usage: 'Alternative light background slides',
    textSize: 'normal'
  }
];

// WCAG 2.1 Standards
const WCAG_STANDARDS = {
  AA: {
    normalText: 4.5,    // < 18pt or < 14pt bold
    largeText: 3.0      // >= 18pt or >= 14pt bold
  },
  AAA: {
    normalText: 7.0,
    largeText: 4.5
  }
};

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║         Edera V2 Theme - WCAG Contrast Audit Report          ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('Audit Date:', new Date().toISOString().split('T')[0]);
console.log('Standard: WCAG 2.1\n');

console.log('Color Palette:');
console.log('  • Dark Teal:   ', colors.darkTeal);
console.log('  • Light Mint:  ', colors.lightMint);
console.log('  • Cyan Accent: ', colors.cyanAccent);
console.log('  • White:       ', colors.white);
console.log('  • Black:       ', colors.black);
console.log('\n' + '═'.repeat(67) + '\n');

let passCount = 0;
let failCount = 0;
const results = [];

combinations.forEach((combo, index) => {
  const ratio = wcag.hex(combo.fg, combo.bg);
  const aaThreshold = combo.textSize === 'large' ? WCAG_STANDARDS.AA.largeText : WCAG_STANDARDS.AA.normalText;
  const aaaThreshold = combo.textSize === 'large' ? WCAG_STANDARDS.AAA.largeText : WCAG_STANDARDS.AAA.normalText;

  const passAA = ratio >= aaThreshold;
  const passAAA = ratio >= aaaThreshold;

  if (passAA) passCount++;
  else failCount++;

  console.log(`${index + 1}. ${combo.name}`);
  console.log(`   Foreground: ${combo.fg} │ Background: ${combo.bg}`);
  console.log(`   Usage: ${combo.usage}`);
  console.log(`   Text Size: ${combo.textSize === 'large' ? 'Large (≥18pt)' : 'Normal (<18pt)'}`);
  console.log(`   Contrast Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`   WCAG AA  (${aaThreshold}:1 required):  ${passAA ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   WCAG AAA (${aaaThreshold}:1 required): ${passAAA ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  results.push({
    combination: combo.name,
    foreground: combo.fg,
    background: combo.bg,
    ratio: ratio.toFixed(2),
    aa: passAA,
    aaa: passAAA,
    usage: combo.usage
  });
});

console.log('═'.repeat(67) + '\n');
console.log('Summary:');
console.log(`  Total combinations tested: ${combinations.length}`);
console.log(`  WCAG AA Pass: ${passCount}/${combinations.length} (${Math.round(passCount/combinations.length*100)}%)`);
console.log(`  WCAG AA Fail: ${failCount}/${combinations.length}`);
console.log('');

const allAA = results.filter(r => r.aa).length;
const allAAA = results.filter(r => r.aaa).length;

if (allAA === results.length) {
  console.log('✅ CONCLUSION: All color combinations meet WCAG 2.1 Level AA standards!');
} else {
  console.log('⚠️  CONCLUSION: Some combinations do not meet WCAG 2.1 Level AA standards.');
  console.log('   Action required: Review and adjust colors that failed AA compliance.');
}

if (allAAA === results.length) {
  console.log('🌟 BONUS: All combinations also meet WCAG 2.1 Level AAA standards!');
} else {
  console.log(`ℹ️  Note: ${allAAA}/${results.length} combinations meet WCAG 2.1 Level AAA (enhanced).`);
}

console.log('\n' + '═'.repeat(67));

// Export results for documentation
if (process.env.JSON_OUTPUT) {
  console.log('\nJSON Results:');
  console.log(JSON.stringify(results, null, 2));
}

// Exit with error code if any tests failed
process.exit(failCount > 0 ? 1 : 0);
