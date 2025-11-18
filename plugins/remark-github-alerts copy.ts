// import { visit } from 'unist-util-visit';
// import type { Plugin } from 'unified';
// import type { Node, Parent } from 'unist';

// // Regex: [!TYPE(:collapse)?] (case-insensitive, allow whitespace)
// const ALERT_REGEX = /^\s*\[!(\w+)(:collapse)?\]\s*\n?/i;

// /**
//  * Preprocessor that normalizes blockquote syntax:
//  * Converts indented content after "> [!note]" to proper blockquote format
//  */
// function preprocessMarkdown(markdown: string): string {
//   const lines = markdown.split('\n');
//   const result: string[] = [];
//   let inAlertBlock = false;
//   let alertIndentLevel = 0;

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];

//     if (line.match(/^>\s*\[!\w+(:collapse)?\]/i)) {
//       inAlertBlock = true;
//       result.push(line);

//       alertIndentLevel = 0;
//       for (let j = i + 1; j < lines.length; j++) {
//         const nextLine = lines[j];
//         if (nextLine.trim() === '') continue;
//         if (nextLine.startsWith('>')) {
//           inAlertBlock = false;
//           break;
//         }
//         const indentMatch = nextLine.match(/^(\s+)/);
//         if (indentMatch) {
//           alertIndentLevel = indentMatch[1].length;
//         } else {
//           inAlertBlock = false;
//         }
//         break;
//       }
//       continue;
//     }

//     if (inAlertBlock) {
//       if (line.trim() === '') {
//         result.push('>');
//       } else if (!line.startsWith('>')) {
//         const indentMatch = line.match(/^(\s*)/);
//         const currentIndent = indentMatch ? indentMatch[1].length : 0;

//         if (currentIndent >= alertIndentLevel && alertIndentLevel > 0) {
//           const contentAfterIndent = line.slice(alertIndentLevel);
//           result.push(`> ${contentAfterIndent}`);
//         } else {
//           inAlertBlock = false;
//           alertIndentLevel = 0;
//           result.push(line);
//         }
//       } else {
//         result.push(line);
//       }
//     } else {
//       result.push(line);
//     }
//   }

//   return result.join('\n');
// }

// /**
//  * Remark plugin that transforms blockquotes with [!TYPE] markers into Alert JSX components
//  *
//  * To use indented syntax (without > on every line), this plugin preprocesses markdown
//  * automatically by hooking into MDX's file loading.
//  */
// const remarkGithubAlerts: Plugin = function() {
//   // Get the data object where MDX stores its configuration
//   const data = (this as any).data() || {};

//   // Hook into MDX's micromarkExtensions or file loading
//   // This ensures preprocessing happens before parsing
//   const toMarkdownExtensions = data.toMarkdownExtensions || [];
//   const micromarkExtensions = data.micromarkExtensions || [];

//   // Add our preprocessing to the data
//   data.alertPreprocess = preprocessMarkdown;
//   (this as any).data('alertPreprocess', preprocessMarkdown);

//   // Return transformer
//   return function transformer(tree: Node, file: any) {
//     // As a fallback, if file.value hasn't been preprocessed yet, do it now
//     // (This handles cases where preprocessing didn't happen earlier)
//     if (file && file.value && typeof file.value === 'string' && !file.data.alertPreprocessed) {
//       file.value = preprocessMarkdown(file.value);
//       file.data.alertPreprocessed = true;
//     }

//     // Transform blockquotes to Alert components
//     visit(tree, 'blockquote', (node: Node, index: number | null, parent: Parent | null) => {
//       if (!parent || index === null) return;
//       if (!('children' in node) || !Array.isArray((node as Parent).children) || (node as Parent).children.length === 0) return;

//       const first = (node as Parent).children[0];
//       if (
//         !('type' in first) ||
//         first.type !== 'paragraph' ||
//         !('children' in first) ||
//         !Array.isArray(first.children) ||
//         first.children.length === 0
//       ) return;

//       const firstTextNode = first.children[0];
//       if (
//         !('type' in firstTextNode) ||
//         firstTextNode.type !== 'text' ||
//         !('value' in firstTextNode)
//       ) return;

//       const match = (firstTextNode.value as string).match(ALERT_REGEX);
//       if (!match) return;

//       const type = match[1].toLowerCase();
//       const collapse = !!match[2];
//       firstTextNode.value = (firstTextNode.value as string).replace(ALERT_REGEX, '');

//       const attributes = [
//         { type: 'mdxJsxAttribute', name: 'type', value: type },
//       ];
//       if (collapse) {
//         attributes.push({ type: 'mdxJsxAttribute', name: 'collapse', value: 'true' });
//       }

//       parent.children[index] = {
//         type: 'mdxJsxFlowElement',
//         name: 'Alert',
//         attributes,
//         children: (node as Parent).children,
//       } as Node;
//     });
//   };
// };

// /**
//  * Export the preprocessing function for use in custom MDX loaders
//  */
// export { preprocessMarkdown };

// /**
//  * Default export remains the remark plugin
//  * Note: For indented syntax to work in production, you'll need to preprocess
//  * files before they reach this plugin. This can be done via:
//  * 1. A custom webpack/MDX loader that calls preprocessMarkdown
//  * 2. A build script that preprocesses .mdx files
//  * 3. Using the standard > syntax on every line (no preprocessing needed)
//  */
// export default remarkGithubAlerts;
