// Manual test for class extraction functionality
import fs from 'fs';
import path from 'path';

// Import the extractClass function directly from the plugin
function extractClass(code: string, className: string, stripDocstring = false): string {
  const lines = code.split('\n');
  let classStart = -1;
  let classEnd = -1;
  let docstringStart = -1;
  let docstringEnd = -1;

  // Find the class start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith(`class ${className}`)) {
      classStart = i;
      break;
    }
  }

  if (classStart === -1) {
    return '';
  }

  // Find the class end by looking for the next function/class at the same or lower indentation
  const startIndent = lines[classStart].search(/\S/);
  
  for (let i = classStart + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      continue;
    }
    
    const currentIndent = line.search(/\S/);
    
    // If we find a line at the same or lower indentation that starts with def, class, or async def
    if (currentIndent <= startIndent && 
        (trimmedLine.startsWith('def ') || 
         trimmedLine.startsWith('class ') || 
         trimmedLine.startsWith('async def '))) {
      classEnd = i - 1;
      break;
    }
  }

  // If we didn't find an end, use the last line
  if (classEnd === -1) {
    classEnd = lines.length - 1;
  }

  // Find docstring if it exists
  if (stripDocstring) {
    for (let i = classStart; i <= classEnd; i++) {
      const line = lines[i];
      if (line.includes('"""') || line.includes("'''")) {
        if (docstringStart === -1) {
          docstringStart = i;
        } else {
          docstringEnd = i;
          break;
        }
      }
    }
  }

  // Extract the class
  let classCode = lines.slice(classStart, classEnd + 1).join('\n');

  // Strip docstring if requested and found
  if (stripDocstring && docstringStart !== -1 && docstringEnd !== -1) {
    const beforeDocstring = lines.slice(classStart, docstringStart).join('\n');
    const afterDocstring = lines.slice(docstringEnd + 1, classEnd + 1).join('\n');
    classCode = beforeDocstring + (afterDocstring ? '\n' + afterDocstring : '');
  }

  return classCode.trim();
}

function extractClassMethod(code: string, className: string, methodName: string, stripDocstring = false): string {
  const lines = code.split('\n');
  let classStart = -1;
  let classEnd = -1;

  // Find the class start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith(`class ${className}`)) {
      classStart = i;
      break;
    }
  }

  if (classStart === -1) {
    return '';
  }

  // Find the class end by looking for the next class at the same or lower indentation
  const startIndent = lines[classStart].search(/\S/);
  for (let i = classStart + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    if (trimmedLine === '') continue;
    const currentIndent = line.search(/\S/);
    if (currentIndent <= startIndent && trimmedLine.startsWith('class ')) {
      classEnd = i - 1;
      break;
    }
  }
  if (classEnd === -1) classEnd = lines.length - 1;

  // Now search for the method inside the class
  let methodStart = -1;
  let methodEnd = -1;
  let docstringStart = -1;
  let docstringEnd = -1;
  for (let i = classStart + 1; i <= classEnd; i++) {
    const line = lines[i].trim();
    if (line.startsWith(`def ${methodName}(`)) {
      methodStart = i;
      break;
    }
  }
  if (methodStart === -1) return '';
  const methodIndent = lines[methodStart].search(/\S/);
  for (let i = methodStart + 1; i <= classEnd; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const currentIndent = line.search(/\S/);
    if (currentIndent <= methodIndent && line.trim().startsWith('def ')) {
      methodEnd = i - 1;
      break;
    }
  }
  if (methodEnd === -1) methodEnd = classEnd;

  // Find docstring if requested
  if (stripDocstring) {
    let inDocstring = false;
    for (let i = methodStart; i <= methodEnd; i++) {
      const line = lines[i].trim();
      if ((line.startsWith('"""') || line.startsWith("'''")) && docstringStart === -1) {
        docstringStart = i;
        inDocstring = true;
        if (line.endsWith('"""') && line.length > 3) {
          docstringEnd = i;
          break;
        }
      } else if (inDocstring && (line.endsWith('"""') || line.endsWith("'''"))) {
        docstringEnd = i;
        break;
      }
    }
  }
  let methodCode = lines.slice(methodStart, methodEnd + 1).join('\n');
  if (stripDocstring && docstringStart !== -1 && docstringEnd !== -1) {
    const beforeDocstring = lines.slice(methodStart, docstringStart).join('\n');
    const afterDocstring = lines.slice(docstringEnd + 1, methodEnd + 1).join('\n');
    methodCode = beforeDocstring + (afterDocstring ? '\n' + afterDocstring : '');
  }
  return methodCode.trim();
}

function runManualClassTests() {
  console.log('🧪 Running manual class extraction tests...\n');

  // Read the sample code files
  const sampleCodePath = path.join(__dirname, 'fixtures', 'sample-code.py');
  const cacheCodePath = path.join(__dirname, '../../../examples/code/cache.py');
  const sampleCode = fs.readFileSync(sampleCodePath, 'utf8');
  const cacheCode = fs.readFileSync(cacheCodePath, 'utf8');

  const tests = [
    {
      name: 'Basic class extraction',
      className: 'Calculator',
      stripDocstring: false,
      expectedContains: ['class Calculator', 'def add(self, a: float, b: float) -> float:', 'def multiply(self, a: float, b: float) -> float:'],
      expectedNotContains: []
    },
    {
      name: 'Class extraction with docstring stripping',
      className: 'Calculator',
      stripDocstring: true,
      expectedContains: ['class Calculator', 'def add(self, a: float, b: float) -> float:'],
      expectedNotContains: ['"""A simple calculator class"""']
    },
    {
      name: 'Nested class extraction',
      className: 'NestedClass',
      stripDocstring: false,
      expectedContains: ['class NestedClass', 'def outer_method(self):', 'def inner_method(self):'],
      expectedNotContains: []
    },
    {
      name: 'PrefixSumCalculator extraction',
      className: 'PrefixSumCalculator',
      stripDocstring: false,
      expectedContains: ['class PrefixSumCalculator', 'def range_sum(self, left: int, right: int) -> int:'],
      expectedNotContains: []
    },
    {
      name: 'LFUCache._bump extraction',
      className: undefined,
      stripDocstring: false,
      classMethod: 'LFUCache',
      classMethodName: '_bump',
      expectedContains: ['def _bump(self, key: int):', 'self.freq[key] +=1'],
      expectedNotContains: []
    },
    {
      name: 'LFUCache._bump extraction with docstring stripping',
      className: undefined,
      stripDocstring: true,
      classMethod: 'LFUCache',
      classMethodName: '_bump',
      expectedContains: ['def _bump(self, key: int):', 'self.freq[key] +=1'],
      expectedNotContains: ['"""Move key from freq f to f+1."""']
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      let extractedCode = '';
      let codeSource = sampleCode;
      if (test.classMethod === 'LFUCache') {
        codeSource = cacheCode;
      }
      if (test.classMethod && test.classMethodName) {
        extractedCode = extractClassMethod(codeSource, test.classMethod, test.classMethodName, test.stripDocstring);
      } else if (test.className) {
        extractedCode = extractClass(codeSource, test.className, test.stripDocstring);
      } else {
        extractedCode = '';
      }
      
      if (!extractedCode) {
        console.log(`❌ ${test.name} - Not found`);
        failed++;
        continue;
      }

      let success = true;
      let errorMessage = '';

      // Check for expected content
      for (const expected of test.expectedContains) {
        if (!extractedCode.includes(expected)) {
          success = false;
          errorMessage += `Missing expected content: "${expected}"\n`;
        }
      }

      // Check for content that should not be present
      for (const notExpected of test.expectedNotContains) {
        if (extractedCode.includes(notExpected)) {
          success = false;
          errorMessage += `Found unexpected content: "${notExpected}"\n`;
        }
      }

      if (success) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   ${errorMessage}`);
        console.log(`   Extracted code:\n${extractedCode}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Run the test if this file is executed directly
if (require.main === module) {
  const success = runManualClassTests();
  process.exit(success ? 0 : 1);
}

export { runManualClassTests };
