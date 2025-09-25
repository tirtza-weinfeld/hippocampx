// import type { ShikiTransformer, ShikiTransformerContext } from 'shiki';
// import { Element } from 'hast';
// import type { SymbolMetadata } from '@/lib/types';

// interface AutoLinkOptions {
//   /**
//    * Class for auto-linked symbols
//    * @default 'auto-link'
//    */
//   className?: string;
// }

// /**
//  * Transformer that adds IDs to tooltip symbols for anchor navigation
//  * Creates target elements that can be linked to
//  */
// export function transformerMetaAddIds(
//   tooltipMap: Record<string, SymbolMetadata>,
//   options: AutoLinkOptions = {}
// ): ShikiTransformer {
//   const {
//     className = 'auto-link-target',
//   } = options;

//   // Build a map of symbol names to their metadata for fast lookup (case-sensitive)
//   const symbolMap = new Map<string, SymbolMetadata>();
//   for (const [symbol, metadata] of Object.entries(tooltipMap)) {
//     symbolMap.set(symbol, metadata);
//   }

//   return {
//     name: 'transformers:meta-add-ids',
    
//     span(this: ShikiTransformerContext, node: Element) {
//       if (!Array.isArray(node.children) || node.children.length !== 1) return;
//       const textNode = node.children[0];
//       if (!textNode || textNode.type !== 'text') return;
//       const value = textNode.value.trim();
      
//       // Check if this is a known symbol (case-sensitive)
//       const metadata = symbolMap.get(value);
//       if (metadata) {
//         // Add ID to the existing element
//         node.properties = node.properties || {};
//         node.properties.id = value;
//         node.properties['data-auto-link'] = value;
//         node.properties['class'] = [
//           ...(Array.isArray(node.properties['class']) ? node.properties['class'] : []),
//           className,
//         ];
//         return;
//       }
//     },
//   };
// }

// /**
//  * Transformer that creates actual link elements after tooltip symbols
//  * Creates separate link elements that navigate to target elements
//  */
// export function transformerMetaAddHrefs(
//   tooltipMap: Record<string, SymbolMetadata>,
//   options: AutoLinkOptions = {}
// ): ShikiTransformer {
//   const {
//     className = 'auto-link',
//   } = options;

//   // Build a map of symbol names to their metadata for fast lookup (case-sensitive)
//   const symbolMap = new Map<string, SymbolMetadata>();
//   for (const [symbol, metadata] of Object.entries(tooltipMap)) {
//     symbolMap.set(symbol, metadata);
//   }

//   return {
//     name: 'transformers:meta-add-hrefs',
    
//     preprocess(code, options) {
//       options.decorations ||= [];
      
//       // Find all occurrences of function/method/class names (whole word only)
//       for (const [symbol] of Object.entries(tooltipMap)) {
//         const indexes = findAllWordIndexes(code, symbol);
//         for (const index of indexes) {
//           // Create a link element after the symbol
//           options.decorations.push({
//             start: index + symbol.length,
//             end: index + symbol.length,
//             properties: {
//               tagName: 'a',
//               href: `#${symbol}`,
//               'data-auto-link': symbol,
//               'class': className,
//               'aria-label': `Link to ${symbol}`,
//             },
//           });
//         }
//       }
//     },
    
//     span(this: ShikiTransformerContext, node: Element) {
//       // This method is kept for backward compatibility but the main work is done in preprocess
//       if (!Array.isArray(node.children) || node.children.length !== 1) return;
//       const textNode = node.children[0];
//       if (!textNode || textNode.type !== 'text') return;
//       const value = textNode.value.trim();
      
//       // Check if this is a known symbol (case-sensitive)
//       if (symbolMap.has(value)) {
//         // Create a link element after the current node
//         // Note: This is a simplified approach - the main work is done in preprocess
//         return;
//       }
//     },
//   };
// }

// /**
//  * Find all occurrences of a word in a string (whole word only)
//  */
// function findAllWordIndexes(str: string, word: string): number[] {
//   const indexes: number[] = [];
//   if (!word) return indexes;
//   // Escape regex special chars in word
//   const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   const regex = new RegExp(`\\b${escaped}\\b`, 'g');
//   let match;
//   while ((match = regex.exec(str)) !== null) {
//     indexes.push(match.index);
//   }
//   return indexes;
// } 