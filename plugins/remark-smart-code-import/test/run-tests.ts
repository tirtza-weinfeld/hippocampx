#!/usr/bin/env tsx

// Test runner for remark-smart-code-import plugin
// Note: This uses tsx from the main project, not from the plugin's dependencies

import { runTests as runMetaTests } from './unit/meta-parsing.test';

console.log('🧪 Running remark-smart-code-import tests...\n');

// Run meta parsing tests
console.log('📋 Meta Parsing Tests:');
const metaTestsPassed = runMetaTests();

console.log('\n' + '='.repeat(50));

if (metaTestsPassed) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
} 