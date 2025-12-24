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
  functionName?: string;
  preservedMeta: string[];
}

// Type definitions for JSON structures
interface SymbolEntry {
  code?: string;
}

interface SymbolTagsData {
  [key: string]: SymbolEntry | undefined;
}

interface SolutionEntry {
  code?: string;
}

interface SolutionsMap {
  [fileName: string]: SolutionEntry | undefined;
}

interface ProblemEntry {
  solutions?: SolutionsMap;
}

interface ProblemsMap {
  [problemName: string]: ProblemEntry | undefined;
}

interface ProblemsMetadataData {
  problems?: ProblemsMap;
  core?: ProblemsMap;
}

function parseMeta(meta: string): ParsedMeta | null {
  const metaParts = meta.split(/\s+/);
  let filePath = '';
  let functionName: string | undefined;
  const preservedMeta: string[] = [];

  for (const part of metaParts) {
    if (part.startsWith('file=')) {
      const fileValue = part.substring('file='.length);
      // Check if file path contains a function name (e.g., "file.py:function_name")
      const colonIndex = fileValue.indexOf(':');
      if (colonIndex !== -1) {
        filePath = fileValue.substring(0, colonIndex);
        functionName = fileValue.substring(colonIndex + 1);
      } else {
        filePath = fileValue;
      }
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
    functionName,
    preservedMeta
  };
}

function isExpressionFilePath(filePath: string): boolean {
  // Check if this is a file path that should be looked up in expressions.json
  return filePath.match(/^(problems|core)\/.*\.py$/) !== null;
}

function buildSymbolKey(filePath: string, functionName: string): string {
  // Convert file path to symbol key format
  // e.g., "problems/1631-path-with-minimum-effort/solution.py" -> "problems.1631-path-with-minimum-effort.solution:function_name"
  const withoutExtension = filePath.replace(/\.py$/, '');
  const symbolPath = withoutExtension.replace(/\//g, '.');
  return `${symbolPath}:${functionName}`;
}

function extractFromSymbolTags(content: string, symbolKey: string): string | null {
  try {
    const data = JSON.parse(content) as SymbolTagsData;
    const symbol = data[symbolKey];

    if (symbol?.code) {
      return symbol.code;
    } else {
      // console.warn(`Symbol '${symbolKey}' not found in symbol_tags.json`);
      return null;
    }
  } catch (error) {
    console.warn(`Failed to parse symbol_tags.json:`, error);
    return null;
  }
}

function extractFromProblemsMetadata(content: string, filePath: string): string | null {
  try {
    const data = JSON.parse(content) as ProblemsMetadataData;

    // Map file path to JSON path in problems_metadata.json
    const match = filePath.match(/^problems\/([^\/]+)\/([^\/]+)\.py$/);
    if (match) {
      const problemName = match[1];
      const fileName = match[2];
      const fullFileName = `${fileName}.py`;

      // Navigate to problems.problemName.solutions
      const problem = data.problems?.[problemName]
      const solutions = problem?.solutions
      const solution = solutions?.[fullFileName]

      if (solution?.code) {
        return solution.code;
      } else {
        console.warn(`Solution '${fullFileName}' not found for problem '${problemName}'`);
        return null;
      }
    }

    // Map core file paths
    const coreMatch = filePath.match(/^core\/([^\/]+)\/([^\/]+)\.py$/);
    if (coreMatch) {
      const algorithmName = coreMatch[1];
      const fileName = coreMatch[2];
      const fullFileName = `${fileName}.py`;

      // Navigate to core.algorithmName.solutions
      const algorithm = data.core?.[algorithmName]
      const solutions = algorithm?.solutions
      const solution = solutions?.[fullFileName]

      if (solution?.code) {
        return solution.code;
      } else {
        console.warn(`Solution '${fullFileName}' not found for algorithm '${algorithmName}'`);
        return null;
      }
    }

    console.warn(`File path '${filePath}' does not match expected pattern`);
    return null;
  } catch (error) {
    console.warn(`Failed to parse problems_metadata.json:`, error);
    return null;
  }
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

const remarkCodeCopy: Plugin = () => {
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

      // Check if this is a problems/core file path that should be looked up in symbol_tags.json
      const isExpressionFile = isExpressionFilePath(parsed.filePath);

      let extractedContent: string | null = null;

      if (isExpressionFile && parsed.functionName) {
        // This is a problems/core file with function name - try symbol_tags.json first
        const symbolTagsPath = 'lib/extracted-metadata/symbol_tags.json';
        const symbolTagsContent = readFileSafely(symbolTagsPath);
        if (symbolTagsContent) {
          const symbolKey = buildSymbolKey(parsed.filePath, parsed.functionName);
          extractedContent = extractFromSymbolTags(symbolTagsContent, symbolKey);
        }

        // If not found in symbol_tags.json, fall back to problems_metadata.json
        if (!extractedContent) {
          const metadataPath = 'lib/extracted-metadata/problems_metadata.json';
          const metadataContent = readFileSafely(metadataPath);
          if (metadataContent) {
            extractedContent = extractFromProblemsMetadata(metadataContent, parsed.filePath);
          }
        }
      } else if (isExpressionFile) {
        // This is a problems/core file without function name - extract from problems_metadata.json
        const metadataPath = 'lib/extracted-metadata/problems_metadata.json';
        const metadataContent = readFileSafely(metadataPath);
        if (metadataContent) {
          extractedContent = extractFromProblemsMetadata(metadataContent, parsed.filePath);
        }
      } else {
        // This is a regular file - read it directly
        extractedContent = readFileSafely(parsed.filePath);
      }

      if (!extractedContent) {
        return;
      }

      // Update the node with the extracted content
      node.value = extractedContent.trim()
        .replace(/\n\s*\n/g, '\n\n'); // Normalize multiple consecutive newlines

      // Create meta attribute with source parameter
      const sourceParam = parsed.functionName
        ? `source=${parsed.filePath}:${parsed.functionName}`
        : `source=${parsed.filePath}`;
      const allMeta = [sourceParam, ...parsed.preservedMeta];
      node.meta = allMeta.length > 0 ? `meta="${allMeta.join(' ')}"` : undefined;
    });
  };
};

export default remarkCodeCopy;