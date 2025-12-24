import fs from 'fs';
import path from 'path';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Literal, Node } from 'unist';

interface CodeNode extends Literal {
  type: 'code';
  lang?: string;
  meta?: string;
  value: string;
}

interface ParsedMeta {
  filePath: string;
  lineStart?: number;
  lineEnd?: number;
  nestedPath?: string[];
  preserveDocstring: boolean;
  preserveComments: boolean;
  preservedMeta: string[];
}

function extractLines(code: string, start: number, end: number): string {
  const lines = code.split('\n');
  // Ensure bounds are within valid range
  const safeStart = Math.max(1, start);
  const safeEnd = Math.min(lines.length, end);
  
  if (safeStart > safeEnd) {
    return '';
  }
  
  return lines.slice(safeStart - 1, safeEnd).join('\n');
}

function stripAllDocstrings(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line contains a docstring start (handle both """ and ''' with any indentation, including raw strings)
    const docstringMatch = trimmed.match(/^r?("""|''')/);
    if (docstringMatch) {
      const quoteType = docstringMatch[1]; // Gets """ or '''
      
      // Single-line docstring (entire docstring on one line)
      const prefixLength = docstringMatch[0].length; // Length of r""" or """ etc.
      if (trimmed.length > prefixLength && trimmed.endsWith(quoteType) && trimmed !== docstringMatch[0]) {
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

function stripAllComments(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip lines that are just comments (start with #)
    if (trimmed.startsWith('#')) {
      continue;
    }
    
    // Remove inline comments (but be careful with strings)
    let processedLine = line;
    let inString = false;
    let stringChar = '';
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      // Handle string boundaries
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar) {
        // Check if it's escaped
        let escapeCount = 0;
        let j = i - 1;
        while (j >= 0 && line[j] === '\\') {
          escapeCount++;
          j--;
        }
        if (escapeCount % 2 === 0) {
          inString = false;
          stringChar = '';
        }
      } else if (!inString && char === '#') {
        // Found a comment outside of strings, truncate here
        processedLine = line.substring(0, i).trimEnd();
        break;
      }
      
      i++;
    }
    
    result.push(processedLine);
  }
  
  return result.join('\n');
}

function extractFunction(code: string, functionName: string, preserveDocstring = false, preserveComments = false): string {
  const lines = code.split('\n');
  let functionStart = -1;
  let functionEnd = -1;

  // Find the function start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith(`def ${functionName}(`)) {
      functionStart = i;
      break;
    }
  }

  if (functionStart === -1) {
    return '';
  }

  // Find the function end by looking for the next function/class at the same or lower indentation
  const startIndent = lines[functionStart].search(/\S/);
  
  for (let i = functionStart + 1; i < lines.length; i++) {
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
      functionEnd = i - 1;
      break;
    }
  }

  // If we didn't find an end, use the last line
  if (functionEnd === -1) {
    functionEnd = lines.length - 1;
  }


  // Extract the function
  let functionCode = lines.slice(functionStart, functionEnd + 1).join('\n');

  // Strip docstrings and comments by default (only preserve if explicitly requested)
  if (!preserveDocstring) {
    functionCode = stripAllDocstrings(functionCode);
  }
  
  if (!preserveComments) {
    functionCode = stripAllComments(functionCode);
  }

  return functionCode.trim();
}

function extractClass(code: string, className: string, preserveDocstring = false, preserveComments = false): string {
  const lines = code.split('\n');
  let classStart = -1;
  let classEnd = -1;

  // Find the class start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Use regex to match exact class name with word boundary
    const classRegex = new RegExp(`^class\\s+${className}(?:[:(\\s]|$)`);
    if (classRegex.test(line)) {
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


  // Extract the class
  let classCode = lines.slice(classStart, classEnd + 1).join('\n');

  // Strip docstrings and comments by default (only preserve if explicitly requested)
  if (!preserveDocstring) {
    classCode = stripAllDocstrings(classCode);
  }
  
  if (!preserveComments) {
    classCode = stripAllComments(classCode);
  }

  return classCode.trim();
}


function extractNestedStructure(code: string, path: string[], preserveDocstring = false, preserveComments = false): string {
  if (path.length === 1) {
    // Single element - try function first, then class
    const functionResult = extractFunction(code, path[0], preserveDocstring, preserveComments);
    if (functionResult) return functionResult;
    return extractClass(code, path[0], preserveDocstring, preserveComments);
  }
  
  if (path.length === 2) {
    // Two elements - likely class.method
    return extractClassMethod(code, path[0], path[1], preserveDocstring, preserveComments);
  }
  
  // More than 2 elements - need to recursively find nested structures
  return extractDeepNested(code, path, preserveDocstring, preserveComments);
}

function extractDeepNested(code: string, path: string[], preserveDocstring = false, preserveComments = false): string {
  // Handle deeper nesting by recursively finding nested structures
  if (path.length === 2) {
    return extractClassMethod(code, path[0], path[1], preserveDocstring, preserveComments);
  }
  
  if (path.length === 3) {
    // Handle Class.InnerClass.method or Class.method.inner_function patterns
    // First, try to find the outer class/function
    const outerCode = extractClass(code, path[0], true, true); // Don't strip yet - preserve all for parsing
    if (outerCode) {
      // Now look for the nested element within the outer code
      const remainingPath = path.slice(1);
      const innerCode = extractNestedStructure(outerCode, remainingPath, preserveDocstring, preserveComments);
      if (innerCode) {
        // If we found something, wrap it with the class header
        const lines = code.split('\n');
        let classStart = -1;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const classRegex = new RegExp(`^class\\s+${path[0]}(?:[:,\\s(]|$)`);
          if (classRegex.test(line)) {
            classStart = i;
            break;
          }
        }
        if (classStart !== -1) {
          let result = lines[classStart] + '\n' + innerCode;
          if (!preserveDocstring) {
            result = stripAllDocstrings(result);
          }
          if (!preserveComments) {
            result = stripAllComments(result);
          }
          return result.trim();
        }
      }
    }
    
    // Try as nested function
    const outerFunc = extractFunction(code, path[0], true, true); // Don't strip yet - preserve all for parsing
    if (outerFunc) {
      const remainingPath = path.slice(1);
      return extractNestedStructure(outerFunc, remainingPath, preserveDocstring, preserveComments);
    }
  }
  
  // For deeper nesting (4+ levels), we'd need full AST parsing
  // Return empty for now
  return '';
}

function extractClassMethod(code: string, className: string, methodName: string, preserveDocstring = false, preserveComments = false): string {
  const lines = code.split('\n');
  let classStart = -1;
  let classEnd = -1;

  // Find the class start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Use regex to match exact class name with word boundary
    const classRegex = new RegExp(`^class\\s+${className}(?:[:(\\s]|$)`);
    if (classRegex.test(line)) {
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
  
  // Strip docstrings and comments by default (only preserve if explicitly requested)
  if (!preserveDocstring) {
    result = stripAllDocstrings(result);
  }
  
  if (!preserveComments) {
    result = stripAllComments(result);
  }
  
  return result.trim();
}

function parseMeta(meta: string): ParsedMeta | null {
  const metaParts = meta.split(/\s+/);
  let filePath = '';
  let lineStart: number | undefined;
  let lineEnd: number | undefined;
  let nestedPath: string[] | undefined;
  let preserveDocstring = false; // Strip by default, only preserve if explicitly requested
  let preserveComments = false; // Strip by default, only preserve if explicitly requested
  const preservedMeta: string[] = [];

  for (const part of metaParts) {
    if (part.startsWith('file=')) {
      // Parse the file path and any colon-separated selectors
      const fileMatch = part.match(/file=([^:]+)(:.*)?/);
      if (fileMatch) {
        filePath = fileMatch[1];
        
        // Parse colon-separated selectors
        if (fileMatch[2]) {
          const selector = fileMatch[2].substring(1); // Remove leading ':'
          
          // Check for line range: L5-L36
          const lineMatch = selector.match(/L(\d+)-L(\d+)/);
          if (lineMatch) {
            lineStart = parseInt(lineMatch[1], 10);
            lineEnd = parseInt(lineMatch[2], 10);
          }
          // Parse nested path (any number of dots for nesting)
          else if (selector.match(/^[\w_.]+$/)) {
            nestedPath = selector.split('.');
          }
        }
      }
    } else if (part === 'docstring') {
      preserveDocstring = true; // Explicitly preserve docstrings
    } else if (part === 'comments') {
      preserveComments = true; // Explicitly preserve comments
    } else if (part.length > 0) {
      // Preserve all other meta attributes
      preservedMeta.push(part);
    }
  }

  if (!filePath) {
    return null;
  }

  return {
    filePath,
    lineStart,
    lineEnd,
    nestedPath,
    preserveDocstring,
    preserveComments,
    preservedMeta
  };
}

function readFileSafely(filePath: string): string | null {
  try {
    const fullPath = path.join('./backend/algorithms/', filePath);
    const absPath = path.resolve(process.cwd(), fullPath);
    return fs.readFileSync(absPath, 'utf8');
  } catch (error) {
    const fullPath = path.join('./backend/algorithms/', filePath);
    console.warn(`Failed to read file: ${fullPath}`, error);
    return null;
  }
}

const remarkSmartCodeImport: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'code', (node: CodeNode) => {
      // Check if file= is in meta or in the language identifier
      const hasFileInMeta = node.meta && node.meta.includes('file=');
      const hasFileInLang = node.lang && node.lang.includes('file=');
      
      if (!hasFileInMeta && !hasFileInLang) {
        return;
      }
      
      // If file= is in the language identifier, extract it and set proper lang/meta
      if (hasFileInLang && !hasFileInMeta && node.lang) {
        // Extract the actual language and file path from lang
        const langMatch = node.lang.match(/^(\w+)?\s*file=(.+)$/) ?? node.lang.match(/^file=(.+)$/);
        if (langMatch) {
          if (langMatch[2]) {
            // Format: "python file=example.py"
            node.lang = langMatch[1];
            node.meta = `file=${langMatch[2]}`;
          } else {
            // Format: "file=example.py" (no language specified)
            node.lang = 'python'; // Default to python
            node.meta = `file=${langMatch[1]}`;
          }
        }
      }

      if (!node.meta) return;
      const parsed = parseMeta(node.meta);
      if (!parsed) {
        return;
      }

      const fileContent = readFileSafely(parsed.filePath);
      if (!fileContent) {
        return;
      }

      let extractedCode = '';

      if (parsed.nestedPath) {
        extractedCode = extractNestedStructure(fileContent, parsed.nestedPath, parsed.preserveDocstring, parsed.preserveComments);
        if (!extractedCode) {
          console.warn(`'${parsed.nestedPath.join('.')}' not found in ${parsed.filePath}`);
          return;
        }
      } else if (parsed.lineStart && parsed.lineEnd) {
        extractedCode = extractLines(fileContent, parsed.lineStart, parsed.lineEnd);
        // For line ranges, apply stripping if not preserving
        if (!parsed.preserveDocstring) {
          extractedCode = stripAllDocstrings(extractedCode);
        }
        if (!parsed.preserveComments) {
          extractedCode = stripAllComments(extractedCode);
        }
        if (!extractedCode.trim()) {
          console.warn(`Lines ${parsed.lineStart}-${parsed.lineEnd} not found in ${parsed.filePath}`);
          return;
        }
      } else {
        // If no specific extraction is specified, use the entire file
        extractedCode = fileContent;
        // Apply stripping to entire file if not preserving
        if (!parsed.preserveDocstring) {
          extractedCode = stripAllDocstrings(extractedCode);
        }
        if (!parsed.preserveComments) {
          extractedCode = stripAllComments(extractedCode);
        }
      }

      // Update the node with extracted code and preserved meta
      node.value = extractedCode;
      
      // Create meta attribute with source parameter
      // const sourceParam = `source=${parsed.filePath}`;
      // If we have a nested path, include it in the source for tooltip lookup
      // console.log(`parsed.filePath: ${parsed.filePath}, parsed.nestedPath: ${parsed.nestedPath}`);
      let sourceParam;
      if (parsed.nestedPath) {
        // console.log(`parsed.filePath: ${parsed.filePath}, parsed.nestedPath: ${parsed.nestedPath}`);
        sourceParam = `source=${parsed.filePath}:${parsed.nestedPath.join('.')}`;
      } else {
        sourceParam = `source=${parsed.filePath}`;
      }
      const allMeta = [sourceParam, ...parsed.preservedMeta];
      node.meta = allMeta.length > 0 ? `meta="${allMeta.join(' ')}"` : undefined;
    });
  };
};

export default remarkSmartCodeImport; 