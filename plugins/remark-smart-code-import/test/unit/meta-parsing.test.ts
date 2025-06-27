// Unit tests for meta parsing functionality
function parseMeta(meta: string) {
  const metaParts = meta.split(/\s+/);
  let filePath = '';
  let lineStart: number | undefined;
  let lineEnd: number | undefined;
  let functionName: string | undefined;
  let stripDocstring = false;
  const preservedMeta: string[] = [];

  for (const part of metaParts) {
    if (part.startsWith('file=')) {
      const fileMatch = part.match(/file=([^#]+)(#.*)?/);
      if (fileMatch) {
        filePath = fileMatch[1];
        
        if (fileMatch[2]) {
          const hash = fileMatch[2];
          
          const lineMatch = hash.match(/#L(\d+)-L(\d+)/);
          if (lineMatch) {
            lineStart = parseInt(lineMatch[1], 10);
            lineEnd = parseInt(lineMatch[2], 10);
          }
          
          const funcMatch = hash.match(/#func:([\w_]+)/);
          if (funcMatch) {
            functionName = funcMatch[1];
          }
        }
      }
    } else if (part === 'stripDocstring') {
      stripDocstring = true;
    } else if (part.length > 0) {
      preservedMeta.push(part);
    }
  }

  return {
    filePath,
    lineStart,
    lineEnd,
    functionName,
    stripDocstring,
    preservedMeta
  };
}

// Simple test runner
function runTests() {
  const tests = [
    {
      name: 'line-based import',
      input: 'file=examples/code/prefix_sum.py#L5-L36 meta="example"',
      expected: {
        filePath: 'examples/code/prefix_sum.py',
        lineStart: 5,
        lineEnd: 36,
        functionName: undefined,
        stripDocstring: false,
        preservedMeta: ['meta="example"']
      }
    },
    {
      name: 'function-based import',
      input: 'file=examples/code/prefix_sum.py#func:maxSubArrayLen meta="example"',
      expected: {
        filePath: 'examples/code/prefix_sum.py',
        lineStart: undefined,
        lineEnd: undefined,
        functionName: 'maxSubArrayLen',
        stripDocstring: false,
        preservedMeta: ['meta="example"']
      }
    },
    {
      name: 'function with docstring stripping',
      input: 'file=examples/code/prefix_sum.py#func:maxSubArrayLen stripDocstring meta="example"',
      expected: {
        filePath: 'examples/code/prefix_sum.py',
        lineStart: undefined,
        lineEnd: undefined,
        functionName: 'maxSubArrayLen',
        stripDocstring: true,
        preservedMeta: ['meta="example"']
      }
    },
    {
      name: 'multiple meta attributes',
      input: 'file=examples/code/prefix_sum.py#func:maxSubArrayLen stripDocstring meta="example" highlight="true"',
      expected: {
        filePath: 'examples/code/prefix_sum.py',
        lineStart: undefined,
        lineEnd: undefined,
        functionName: 'maxSubArrayLen',
        stripDocstring: true,
        preservedMeta: ['meta="example"', 'highlight="true"']
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    const result = parseMeta(test.input);
    const success = JSON.stringify(result) === JSON.stringify(test.expected);
    
    if (success) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${JSON.stringify(test.expected)}`);
      console.log(`   Got:      ${JSON.stringify(result)}`);
      failed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { parseMeta, runTests }; 