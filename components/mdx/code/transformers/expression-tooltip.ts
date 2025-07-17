// import type { ShikiTransformer } from 'shiki';
// import type { SymbolMetadata, ExpressionTooltip } from '@/lib/types';

// export function transformerExpressionTooltips(tooltipMap: Record<string, SymbolMetadata>): ShikiTransformer {
//   return {
//     name: 'expression-tooltips',
    
//     preprocess(code, options) {
//       options.decorations ||= [];
      
//       // Build function code regions for function-scoped expression tooltips
//       const functionRegions: Record<string, { start: number; end: number }> = {};
//       for (const [symbol, meta] of Object.entries(tooltipMap)) {
//         if (meta.signature) {
//           // Extract just the function definition line (without docstring)
//           const sig = meta.signature.replace(/\s+/g, ' ').trim();
          
//           // Create a more flexible regex that matches the function signature
//           // but allows for whitespace variations and doesn't require exact match after the colon
//           const escapedSig = sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//           const flexibleRegex = new RegExp(escapedSig.replace(/:\\s*$/, ':\\s*'));
          
//           const match = code.match(flexibleRegex);
//           if (match && match.index !== undefined) {
//             const start = match.index;
//             // Heuristic: function region ends at the start of the next function or end of file
//             let end = code.length;
//             for (const [otherSymbol, otherMeta] of Object.entries(tooltipMap)) {
//               if (otherSymbol !== symbol && otherMeta.signature) {
//                 const otherSig = otherMeta.signature.replace(/\s+/g, ' ').trim();
//                 const otherEscapedSig = otherSig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//                 const otherFlexibleRegex = new RegExp(otherEscapedSig.replace(/:\\s*$/, ':\\s*'));
//                 const otherMatch = code.match(otherFlexibleRegex);
//                 if (otherMatch && otherMatch.index !== undefined && otherMatch.index > start && otherMatch.index < end) {
//                   end = otherMatch.index;
//                 }
//               }
//             }
//             functionRegions[symbol] = { start, end };
//           } else {
//             // Function signature not found - this is normal for functions not in current code block
//           }
//         }
//       }

//       // Handle expression tooltips only (not line range tooltips)
//       for (const [symbol, meta] of Object.entries(tooltipMap)) {
//         if (meta.expressions && meta.expressions.length > 0) {
//           const region = functionRegions[symbol];
//           if (!region) continue;
          
//           const functionCode = code.slice(region.start, region.end);
          
//           for (const expression of meta.expressions) {
//             // Handle only expression tooltips (not line range tooltips)
//             if (expression.type === 'expression') {
//               const expressionTooltip = expression as ExpressionTooltip;
//               const expressionText = expressionTooltip.expression;
//               const indexes = findAllExpressionIndexes(functionCode, expressionText);
              
//               for (const relIndex of indexes) {
//                 const absoluteIndex = region.start + relIndex;
//                 options.decorations.push({
//                   start: absoluteIndex,
//                   end: absoluteIndex + expressionText.length,
//                   properties: {
//                     'data-expression-tooltip': expressionText,
//                     'data-expression-comment': expressionTooltip.comment,
//                     'data-expression-type': 'expression',
//                     class: 'expression-tooltip',
//                   },
//                 });
//               }
//             }
//           }
//         }
//       }
//     },
    
//     span() {
//       // This method is kept for backward compatibility but the main work is done in preprocess
//       // No span-level processing needed for expression tooltips
//     },
//   };
// }

// // Find all occurrences of an expression in code
// export function findAllExpressionIndexes(str: string, expression: string): number[] {
//   const indexes: number[] = [];
//   if (!expression) return indexes;
  
//   // Escape regex special chars in expression (including parentheses and brackets)
//   const escaped = expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
//   // Create a regex that allows for flexible whitespace matching
//   const flexibleExpression = escaped.replace(/\s+/g, '\\s+');
  
//   try {
//     const regex = new RegExp(flexibleExpression, 'g');
//     let match;
//     while ((match = regex.exec(str)) !== null) {
//       indexes.push(match.index);
//     }
//   } catch {
//     // If regex fails, fall back to simple string matching
//     let index = str.indexOf(expression);
//     while (index !== -1) {
//       indexes.push(index);
//       index = str.indexOf(expression, index + 1);
//     }
//   }
  
//   return indexes;
// } 