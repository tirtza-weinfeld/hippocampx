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
  functionName?: string;
  className?: string;
  classMethod?: string;
  classMethodName?: string;
  stripDocstring: boolean;
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

function extractFunction(code: string, functionName: string, stripDocstring = true): string {
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

  // Strip ALL docstrings if requested (including inner function docstrings)
  if (stripDocstring) {
    functionCode = stripAllDocstrings(functionCode);
  }

  return functionCode.trim();
}

function extractClass(code: string, className: string, stripDocstring = true): string {
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

  // Strip ALL docstrings if requested (including class and method docstrings)
  if (stripDocstring) {
    classCode = stripAllDocstrings(classCode);
  }

  return classCode.trim();
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

function parseMeta(meta: string): ParsedMeta | null {
  const metaParts = meta.split(/\s+/);
  let filePath = '';
  let lineStart: number | undefined;
  let lineEnd: number | undefined;
  let functionName: string | undefined;
  let className: string | undefined;
  let classMethod: string | undefined;
  let classMethodName: string | undefined;
  let stripDocstring = true; // Changed default to true
  const preservedMeta: string[] = [];

  for (const part of metaParts) {
    if (part.startsWith('file=')) {
      // Parse the file path and any hash fragments
      const fileMatch = part.match(/file=([^#]+)(#.*)?/);
      if (fileMatch) {
        filePath = fileMatch[1];
        
        // Parse hash fragments for line ranges or function names
        if (fileMatch[2]) {
          const hash = fileMatch[2];
          
          // Check for line range: #L5-L36
          const lineMatch = hash.match(/#L(\d+)-L(\d+)/);
          if (lineMatch) {
            lineStart = parseInt(lineMatch[1], 10);
            lineEnd = parseInt(lineMatch[2], 10);
          }
          
          // Check for function: #func:functionName
          const funcMatch = hash.match(/#func:([\w_]+)/);
          if (funcMatch) {
            functionName = funcMatch[1];
          }
          
          // Check for class: #class:ClassName
          const classMatch = hash.match(/#class:([\w_]+)/);
          if (classMatch) {
            className = classMatch[1];
          }
          
          // Check for method: #method:ClassName.methodName
          const methodMatch = hash.match(/#method:([\w_]+)\.([\w_]+)/);
          if (methodMatch) {
            classMethod = methodMatch[1];
            classMethodName = methodMatch[2];
          }
        }
      }
    } else if (part === 'stripDocstring') {
      stripDocstring = true;
    } else if (part === 'docstring') {
      stripDocstring = false; // New parameter to keep docstrings
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
    functionName,
    className,
    classMethod,
    classMethodName,
    stripDocstring,
    preservedMeta
  };
}

function readFileSafely(filePath: string): string | null {
  try {
    const absPath = path.resolve(process.cwd(), filePath);
    return fs.readFileSync(absPath, 'utf8');
  } catch (error) {
    console.warn(`Failed to read file: ${filePath}`, error);
    return null;
  }
}

const remarkSmartCodeImport: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'code', (node: CodeNode) => {
      if (!node.meta || !node.meta.includes('file=')) {
        return;
      }

      const parsed = parseMeta(node.meta);
      if (!parsed) {
        return;
      }

      const fileContent = readFileSafely(parsed.filePath);
      if (!fileContent) {
        return;
      }

      let extractedCode = '';

      if (parsed.functionName) {
        extractedCode = extractFunction(fileContent, parsed.functionName, parsed.stripDocstring);
        if (!extractedCode) {
          console.warn(`Function '${parsed.functionName}' not found in ${parsed.filePath}`);
          return;
        }
      } else if (parsed.classMethod && parsed.classMethodName) {
        extractedCode = extractClassMethod(fileContent, parsed.classMethod, parsed.classMethodName, parsed.stripDocstring);
        if (!extractedCode) {
          console.warn(`Method '${parsed.classMethod}.${parsed.classMethodName}' not found in ${parsed.filePath}`);
          return;
        }
      } else if (parsed.className) {
        extractedCode = extractClass(fileContent, parsed.className, parsed.stripDocstring);
        if (!extractedCode) {
          console.warn(`Class '${parsed.className}' not found in ${parsed.filePath}`);
          return;
        }
      } else if (parsed.lineStart && parsed.lineEnd) {
        extractedCode = extractLines(fileContent, parsed.lineStart, parsed.lineEnd);
        if (!extractedCode) {
          console.warn(`Lines ${parsed.lineStart}-${parsed.lineEnd} not found in ${parsed.filePath}`);
          return;
        }
      } else {
        // If no specific extraction is specified, use the entire file
        extractedCode = fileContent;
      }

      // Update the node with extracted code and preserved meta
      node.value = extractedCode;
      node.meta = parsed.preservedMeta.length > 0 ? parsed.preservedMeta.join(' ') : undefined;
    });
  };
};

export default remarkSmartCodeImport; 