// import type { ShikiTransformer } from 'shiki';
// import type { SymbolMetadata, LineRangeTooltip } from '@/lib/types';

// export function transformerLineRangeTooltips(tooltipMap: Record<string, SymbolMetadata>): ShikiTransformer {
//   return {
//     name: 'line-range-tooltips',
    
//     preprocess(code, options) {
//       options.decorations ||= [];
      
//       // Build function code regions for function-scoped line range tooltips
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

//       // Handle line range tooltips only
//       for (const [symbol, meta] of Object.entries(tooltipMap)) {
//         if (meta.expressions && meta.expressions.length > 0) {
//           const region = functionRegions[symbol];
//           if (!region) continue;
          
//           for (const expression of meta.expressions) {
//             // Handle only line range tooltips
//             if (expression.type === 'line_range') {
//               const lineRangeTooltip = expression as LineRangeTooltip;
              
//               // Check if we have highlight range information
//               if (typeof lineRangeTooltip.highlight_start === 'number' && 
//                   typeof lineRangeTooltip.highlight_end === 'number') {
                
//                 // Use the pre-calculated highlight range relative to the function region
//                 const absoluteStart = region.start + lineRangeTooltip.highlight_start;
//                 const absoluteEnd = region.start + lineRangeTooltip.highlight_end;
                
//                 // Create a SINGLE decoration for the entire line range
//                 // This creates the unified rectangular background without interfering with individual tooltips
//                 options.decorations.push({
//                   start: absoluteStart,
//                   end: absoluteEnd,
//                   properties: {
//                     'data-line-range-expression': lineRangeTooltip.expression,
//                     'data-line-range-comment': lineRangeTooltip.comment,
//                     'data-line-range-start': lineRangeTooltip.start_line.toString(),
//                     'data-line-range-end': lineRangeTooltip.end_line.toString(),
//                     'data-line-range-type': 'line_range',
//                     class: 'line-range-highlight',
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
//       // No span-level processing needed for line range tooltips
//     },
//   };
// } 