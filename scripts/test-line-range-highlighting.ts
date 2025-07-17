#!/usr/bin/env tsx

/**
 * Simple test script for line range highlighting functionality
 * 
 * This script helps you verify that the line range highlighting system is working.
 * 
 * Run with: pnpm tsx scripts/test-line-range-highlighting.ts
 */

console.log('🧪 Testing Line Range Highlighting System...\n');

// Test 1: Check if required files exist
console.log('Test 1: Checking required files...');

import fs from 'fs';
import path from 'path';

const requiredFiles = [
  'components/mdx/code/tooltipify-jsx.tsx',
  'components/mdx/code/transformers/meta-tooltip.ts',
  'styles/components/code-block.css'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Test 2: Check CSS for line range highlighting styles
console.log('\nTest 2: Checking CSS styles...');

const cssPath = path.join(process.cwd(), 'styles/components/code-block.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

const requiredCSSSelectors = [
  '.line-range-highlight',
  '.line-range-highlight + .line-range-highlight',
  '[data-expression="'
];

requiredCSSSelectors.forEach(selector => {
  const found = cssContent.includes(selector);
  console.log(`  ${found ? '✅' : '❌'} CSS selector: ${selector}`);
});

// Test 3: Check TypeScript compilation
console.log('\nTest 3: Checking TypeScript compilation...');

try {
  // Try to import the main component
  const { tooltipifyJSX } = await import('@/components/mdx/code/tooltipify-jsx');
  console.log('  ✅ tooltipifyJSX function imported successfully');
  
  // Check if it's a function
  if (typeof tooltipifyJSX === 'function') {
    console.log('  ✅ tooltipifyJSX is a function');
  } else {
    console.log('  ❌ tooltipifyJSX is not a function');
  }
} catch (error) {
  console.log(`  ❌ Failed to import tooltipifyJSX: ${error}`);
}

// Test 4: Check transformer
console.log('\nTest 4: Checking transformer...');

try {
  const { transformerCodeTooltipWords } = await import('@/components/mdx/code/transformers/meta-tooltip');
  console.log('  ✅ transformerCodeTooltipWords function imported successfully');
  
  if (typeof transformerCodeTooltipWords === 'function') {
    console.log('  ✅ transformerCodeTooltipWords is a function');
  } else {
    console.log('  ❌ transformerCodeTooltipWords is not a function');
  }
} catch (error) {
  console.log(`  ❌ Failed to import transformer: ${error}`);
}

// Test 5: Check package.json scripts
console.log('\nTest 5: Checking package.json scripts...');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const requiredScripts = ['test', 'dev', 'build'];
requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`  ${exists ? '✅' : '❌'} Script: ${script}`);
});

console.log('\n🎉 Basic system check completed!');
console.log('\n📋 Next Steps:');
console.log('1. Run: pnpm dev');
console.log('2. Navigate to: http://localhost:3000/notes/binary-search');
console.log('3. Look for purple rectangular blocks around lines 6-7 and 8-9');
console.log('4. Click on tooltip symbols like "mid" to verify tooltips work');
console.log('\n💡 If you see issues:');
console.log('- Check browser console for errors');
console.log('- Inspect HTML elements for correct classes and attributes');
console.log('- Verify CSS is loading properly');
console.log('- Run: pnpm test for full test suite'); 