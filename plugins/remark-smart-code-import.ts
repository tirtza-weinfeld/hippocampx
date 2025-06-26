import fs from 'fs';
import path from 'path';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Literal, Node } from 'unist';

type Code = Literal & {
  type: 'code'
  lang?: string
  meta?: string
}

function extractLines(code: string, start: number, end: number): string {
  return code.split('\n').slice(start - 1, end).join('\n');
}

function extractFunction(code: string, functionName: string, stripDocstring = false): string {
  // Simple regex-based extraction for Python functions
  const funcRegex = new RegExp(
    `^def\\s+${functionName}\\s*\\([^)]*\\):[\\s\\S]*?(?=^def\\s|^class\\s|\\Z)`,
    'gm'
  );
  const match = code.match(funcRegex);
  if (!match) return '';
  let funcCode = match[0];
  if (stripDocstring) {
    // Remove the first triple-quoted string after the function signature
    funcCode = funcCode.replace(
      /(\):\s*\n\s*)([ru]?['\"]{3}[\s\S]*?['\"]{3}\s*)/m,
      '$1'
    );
  }
  return funcCode.trim();
}

const remarkSmartCodeImport: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'code', (node: Code) => {
      if (node.meta && node.meta.includes('file=')) {
        // Parse meta string for file, lines, function, and other meta
        const metaParts = node.meta.split(/\s+/);
        let filePath: string | undefined;
        let lineStart: number | undefined;
        let lineEnd: number | undefined;
        let functionName: string | undefined;
        let stripDocstring = false;
        const newMeta: string[] = [];
        for (const part of metaParts) {
          if (part.startsWith('file=')) {
            const fileMatch = part.match(/file=([^#\s]+)(#L(\d+)(-L(\d+))?)?(#func:([\w_]+))?/);
            if (fileMatch) {
              filePath = fileMatch[1];
              if (fileMatch[3]) lineStart = parseInt(fileMatch[3], 10);
              if (fileMatch[5]) lineEnd = parseInt(fileMatch[5], 10);
              if (fileMatch[7]) functionName = fileMatch[7];
            }
          } else if (part === 'stripDocstring') {
            stripDocstring = true;
          } else if (part.length > 0) {
            newMeta.push(part);
          }
        }
        if (!filePath) return;
        const absPath = path.resolve(process.cwd(), filePath);
        let code = fs.readFileSync(absPath, 'utf8');
        if (functionName) {
          code = extractFunction(code, functionName, stripDocstring);
        } else if (lineStart && lineEnd) {
          code = extractLines(code, lineStart, lineEnd);
        }
        node.value = code;
        node.meta = newMeta.join(' ') || undefined;
      }
    });
  };
};

export default remarkSmartCodeImport; 