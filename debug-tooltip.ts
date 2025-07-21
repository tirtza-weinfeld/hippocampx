#!/usr/bin/env tsx

import fs from 'fs';
import { transformerCodeTooltipWords } from './components/mdx/code/transformers/meta-tooltip';

// Read the metadata
const metadataContent = fs.readFileSync('./lib/extracted-metadata/code_metadata.json', 'utf8');
const tooltipMap = JSON.parse(metadataContent) as Record<string, any>;

// Create the transformer
const transformer = transformerCodeTooltipWords(tooltipMap);

// Test code that should have tooltips
const testCode = `class DP:
    def minimumTotal(self, triangle: list[list[int]]) -> int:
        memo, n = {}, len(triangle)
        def dp(r, c):
            if r >= n or c > r:
                return 0
            if (r, c) not in memo:
                memo[(r, c)] = min(
                    triangle[r][c] + dp(r + 1, c), 
                    triangle[r][c] + dp(r + 1, c + 1)
                )
            return memo[(r, c)]
        return dp(0, 0)`;

console.log('=== DEBUGGING TOOLTIP TRANSFORMER ===');
console.log('Available symbols in tooltipMap:');
Object.keys(tooltipMap).forEach(key => {
  if (key.includes('DP') || key.includes('minimumTotal')) {
    console.log(`- ${key}: ${tooltipMap[key].type}`);
    if (tooltipMap[key].variables) {
      console.log(`  Variables: ${tooltipMap[key].variables.map((v: any) => v.name).join(', ')}`);
    }
  }
});

console.log('\n=== PROCESSING CODE ===');

// Let's manually check function regions
console.log('\n=== FUNCTION REGION DEBUG ===');
const functionRegions: Record<string, { start: number; end: number }> = {};
for (const [symbol, meta] of Object.entries(tooltipMap)) {
  if (symbol.includes('DP.minimumTotal') && meta.signature) {
    console.log(`Checking symbol: ${symbol}`);
    console.log(`Signature: "${meta.signature}"`);
    
    const sig = meta.signature.replace(/\s+/g, ' ').trim();
    const escapedSig = sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flexibleRegex = new RegExp(escapedSig.replace(/:\\s*$/, ':\\s*'), 'g');
    
    console.log(`Looking for regex: ${flexibleRegex.source}`);
    const match = flexibleRegex.exec(testCode);
    if (match) {
      console.log(`Found at index ${match.index}: "${match[0]}"`);
      functionRegions[symbol] = { start: match.index, end: testCode.length };
    } else {
      console.log(`NOT FOUND in test code`);
    }
    console.log('');
  }
}

// Let's check what's in parameterToHierarchy for memo
console.log('\n=== PARAMETER TO HIERARCHY DEBUG ===');

// Let's manually recreate the parameterToHierarchy logic to debug
const hierarchyMap = new Map();
for (const [symbol, meta] of Object.entries(tooltipMap)) {
  hierarchyMap.set(symbol, {
    symbol,
    parent: (meta as any).parent,
    parameters: (meta as any).parameters?.map((p: any) => p.name) || [],
    variables: (meta as any).variables?.map((v: any) => v.name) || [],
    expressions: (meta as any).expressions?.map((e: any) => e.expression) || [],
    children: []
  });
}
for (const [symbol, hierarchy] of hierarchyMap) {
  if ((hierarchy as any).parent && hierarchyMap.has((hierarchy as any).parent)) {
    hierarchyMap.get((hierarchy as any).parent)!.children.push(symbol);
  }
}

const parameterToHierarchy: Record<string, { symbol: string; path: string[] }[]> = {};
function buildParameterMap(symbol: string, path: string[] = []): void {
  const hierarchy = hierarchyMap.get(symbol);
  if (!hierarchy) return;
  const currentPath = [...path, symbol];
  
  console.log(`Building parameter map for ${symbol}:`);
  console.log(`  Variables: ${(hierarchy as any).variables}`);
  console.log(`  Parent: ${(hierarchy as any).parent}`);
  
  // Add current scope's variables
  for (const variable of (hierarchy as any).variables) {
    if (!parameterToHierarchy[variable]) parameterToHierarchy[variable] = [];
    parameterToHierarchy[variable].push({ symbol, path: currentPath });
    console.log(`    Added variable '${variable}' to scope ${symbol}`);
  }
  
  // For nested functions, also include parent scope variables
  if ((hierarchy as any).parent) {
    const parentHierarchy = hierarchyMap.get((hierarchy as any).parent);
    if (parentHierarchy) {
      console.log(`  Checking parent ${(hierarchy as any).parent} variables: ${(parentHierarchy as any).variables}`);
      for (const variable of (parentHierarchy as any).variables) {
        if (!parameterToHierarchy[variable]) parameterToHierarchy[variable] = [];
        parameterToHierarchy[variable].push({ symbol, path: currentPath });
        console.log(`    Added parent variable '${variable}' to nested scope ${symbol}`);
      }
    }
  }
  
  for (const child of (hierarchy as any).children) {
    buildParameterMap(child, currentPath);
  }
}

for (const [symbol, hierarchy] of hierarchyMap) {
  if (!(hierarchy as any).parent) {
    buildParameterMap(symbol);
  }
}

console.log('\nParameterToHierarchy for memo:', parameterToHierarchy['memo']);

const options = { decorations: [] };
if (transformer.preprocess) {
  // @ts-ignore - Debug script, preprocess method doesn't use 'this' context
  transformer.preprocess(testCode, options);
}

console.log(`\nFound ${options.decorations?.length || 0} decorations:`);
options.decorations?.forEach((decoration: any, index: number) => {
  const decoratedText = testCode.slice(decoration.start, decoration.end);
  console.log(`${index + 1}. "${decoratedText}" (${decoration.start}-${decoration.end})`);
  console.log(`   Type: ${decoration.properties['data-tooltip-type']}`);
  console.log(`   Symbol: ${decoration.properties['data-tooltip-symbol']}`);
  console.log(`   Parent: ${decoration.properties['data-tooltip-parent']}`);
  console.log('');
});

// Specifically check for 'memo' decorations
console.log('=== MEMO DECORATIONS ===');
const memoDecorations = options.decorations?.filter((d: any) => 
  testCode.slice(d.start, d.end) === 'memo'
);
console.log(`Found ${memoDecorations?.length || 0} memo decorations:`);
memoDecorations?.forEach((decoration: any, index: number) => {
  const line = testCode.slice(0, decoration.start).split('\n').length;
  console.log(`${index + 1}. Line ${line}: "${testCode.slice(decoration.start, decoration.end)}"`);
  console.log(`   Parent: ${decoration.properties['data-tooltip-parent']}`);
  console.log(`   Type: ${decoration.properties['data-tooltip-type']}`);
});