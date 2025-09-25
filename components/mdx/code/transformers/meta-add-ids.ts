// import type { ShikiTransformer } from 'shiki';

// // Structure matching uses.json format
// interface SymbolUse {
//   range: {
//     start: { line: number; character: number };
//     end: { line: number; character: number };
//   };
//   nameRange: {
//     start: { line: number; character: number };
//     end: { line: number; character: number };
//   };
//   qname: string;
//   kind: string | null;
//   definitionRange?: {
//     start: { line: number; character: number };
//     end: { line: number; character: number };
//   };
// }

// export type UsesData = Record<string, SymbolUse[]>;

// /**
//  * Extract symbol name from qname (everything after the last ':')
//  * @param qname - Qualified name like "utils:cool_add_wrapper"
//  * @returns Symbol name like "cool_add_wrapper"
//  */
// function getSymbolName(qname: string): string {
//   const colonIndex = qname.lastIndexOf(':');
//   return colonIndex !== -1 ? qname.substring(colonIndex + 1) : qname;
// }

// export function transformerAddIds(usesData: UsesData): ShikiTransformer {
//   return {
//     name: 'meta-add-ids',
    
//     preprocess(code, options) {
//       // Only process if this code block has a source= meta attribute
//       const rawMeta = options.meta?.__raw;
//       if (!rawMeta) return;
      
//       // Parse source= from raw meta string
//       const sourceMatch = rawMeta.match(/source=([^\s]+)/);
//       if (!sourceMatch) return;
      
//       const sourceFile = sourceMatch[1];
      
//       // Get symbol uses for this source file  
//       const symbolUses = usesData[sourceFile];
//       if (!symbolUses) return;
      
//       options.decorations ||= [];
      
//       // Convert line-based positions to character offsets
//       const lines = code.split('\n');
      
//       for (const symbolUse of symbolUses) {
//         // Only add IDs to definitions (no definitionRange) and only for functions, classes, methods
//         if (!symbolUse.definitionRange && 
//             (symbolUse.kind === 'function' || symbolUse.kind === 'class' || symbolUse.kind === 'method')) {
          
//           const startOffset = getCharacterOffset(lines, symbolUse.nameRange.start.line, symbolUse.nameRange.start.character);
//           const endOffset = getCharacterOffset(lines, symbolUse.nameRange.end.line, symbolUse.nameRange.end.character);
          
//           if (startOffset !== -1 && endOffset !== -1 && startOffset < endOffset) {
//             const symbolName = getSymbolName(symbolUse.qname);
            
//             const properties: Record<string, string> = {
//               'id': symbolName,
//               'data-symbol-definition': symbolUse.qname,
//               'class': 'symbol-definition',
//               'style': 'scroll-margin-top: 4rem;', // Account for sticky headers
//             };
            
//             options.decorations.push({
//               start: startOffset,
//               end: endOffset,
//               properties,
//             });
//           }
//         }
//       }
//     },
//   };
// }

// function getCharacterOffset(lines: string[], line: number, character: number): number {
//   if (line < 0 || line >= lines.length) return -1;
  
//   let offset = 0;
  
//   // Add lengths of all previous lines (including newline characters)
//   for (let i = 0; i < line; i++) {
//     offset += lines[i].length + 1; // +1 for newline character
//   }
  
//   // Add character position within the target line
//   const targetLine = lines[line];
//   if (character < 0 || character > targetLine.length) return -1;
  
//   return offset + character;
// }