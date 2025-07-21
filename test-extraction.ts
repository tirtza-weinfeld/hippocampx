#!/usr/bin/env tsx

// Test the extraction function directly
import fs from 'fs';

function stripAllDocstrings(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line contains a docstring start (handle both """ and ''' with any indentation)
    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      const quoteType = trimmed.startsWith('"""') ? '"""' : "'''";
      
      // Single-line docstring (entire docstring on one line)
      if (trimmed.length > 3 && trimmed.endsWith(quoteType) && trimmed !== quoteType) {
        i++; // Skip this line entirely
        continue;
      }
      
      // Multi-line docstring - skip until closing quotes
      i++; // Skip opening line
      while (i < lines.length) {
        const currentTrimmed = lines[i].trim();
        if (currentTrimmed.endsWith(quoteType)) {
          i++; // Skip closing line
          break;
        }
        i++; // Skip content line
      }
      continue;
    }
    
    // For all other lines, just add them
    result.push(line);
    i++;
  }
  
  return result.join('\n');
}

function extractClassMethod(code: string, className: string, methodName: string, stripDocstring = true): string {
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

  // Include the class definition with the method
  // Create the class header and method body
  const classHeader = lines[classStart];
  const methodCode = lines.slice(methodStart, methodEnd + 1).join('\n');
  
  let result = classHeader + '\n' + methodCode;
  
  // Strip ALL docstrings if requested
  if (stripDocstring) {
    result = stripAllDocstrings(result);
  }
  
  return result.trim();
}

const code = fs.readFileSync('./backend/algorithms/dp.py', 'utf8');
const extracted = extractClassMethod(code, 'DP', 'minimumTotal', true);
console.log('=== EXTRACTED CODE (with stripDocstring=true) ===');
console.log(extracted);
console.log('=== END ===');