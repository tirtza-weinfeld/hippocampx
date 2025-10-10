// import type { Heading, Parent, RootContent } from 'mdast'
// import type { Plugin } from 'unified'
// import type { Node } from 'unist'
// import { visit } from 'unist-util-visit'
// import GithubSlugger from 'github-slugger'
// import { extractTextFromHeading } from './mdx-text-extraction.js'

// export const remarkCollapsibleSection: Plugin = () => {
//   return (tree: Node) => {
//     const slugger = new GithubSlugger()

//     visit(tree, 'heading', (node: Heading, index: number | undefined, parent: Parent | undefined) => {
//       if (!parent || index === undefined) return

//       // Skip h1 headings - they should not be collapsible
//       if (node.depth === 1) return

//       // Extract heading text
//       const headingText = extractTextFromHeading(node)

//       // Check if heading starts with "[!Collapsible]" pattern
//       const collapsibleMatch = headingText.match(/^\[!Collapsible\]\s*(.*)/)
//       if (!collapsibleMatch) return

//       const [, remainingText] = collapsibleMatch

//       // Remove the [!Collapsible] directive from heading content
//       updateHeadingContent(node, remainingText.trim())

//       // Generate slug for the cleaned heading text
//       const cleanText = extractTextFromHeading(node)
//       const customId = slugger.slug(cleanText)

//       // Find content after this heading until the next heading of same or higher level
//       const content = extractSectionContent(parent, index, node.depth)

//       // Create the collapsible section wrapper
//       const collapsibleSection = {
//         type: 'mdxJsxFlowElement',
//         name: 'CollapsibleSection',
//         attributes: [
//           {
//             type: 'mdxJsxAttribute',
//             name: 'defaultOpen',
//             value: 'false'
//           }
//         ],
//         children: [
//           {
//             type: 'mdxJsxFlowElement',
//             name: 'CollapsibleSectionHeader',
//             attributes: [
//               {
//                 type: 'mdxJsxAttribute',
//                 name: 'as',
//                 value: `h${node.depth}`
//               },
//               {
//                 type: 'mdxJsxAttribute',
//                 name: 'id',
//                 value: customId
//               },
//               {
//                 type: 'mdxJsxAttribute',
//                 name: 'level',
//                 value: String(node.depth)
//               }
//             ],
//             children: node.children
//           },
//           {
//             type: 'mdxJsxFlowElement',
//             name: 'CollapsibleSectionContent',
//             attributes: [],
//             children: content
//           }
//         ]
//       }

//       // Replace the heading and content with the collapsible section wrapper
//       parent.children.splice(index, content.length + 1, collapsibleSection as any)
//     })
//   }
// }

// function updateHeadingContent(node: Heading, newText: string): void {
//   if (!newText) {
//     removeCollapsibleDirective(node)
//     return
//   }

//   // Check if we have any non-text children (like inlineMath nodes) that we should preserve
//   const nonTextChildren = node.children.filter(child => child.type !== 'text')

//   if (nonTextChildren.length > 0) {
//     // We have math or other nodes - preserve them and just update the text part
//     removeCollapsibleDirective(node)
//   } else {
//     // Only text content - safe to replace completely
//     node.children = [{ type: 'text', value: newText }]
//   }
// }

// function removeCollapsibleDirective(node: Heading): void {
//   // Remove the [!Collapsible] part from the first text node
//   if (node.children.length > 0 && node.children[0].type === 'text') {
//     const textNode = node.children[0]
//     // Remove component directive but preserve single trailing space for proper spacing with following nodes
//     textNode.value = textNode.value.replace(/^\[!Collapsible\]\s*/, '')

//     // Only trim leading spaces, normalize trailing spaces to single space if there are following nodes
//     if (textNode.value.length > 0) {
//       textNode.value = textNode.value.replace(/^\s+/, '')

//       // If there are following nodes (like math) and current text has trailing spaces,
//       // normalize to exactly one space for consistent spacing
//       if (node.children.length > 1 && textNode.value.match(/\s+$/)) {
//         textNode.value = textNode.value.replace(/\s+$/, ' ')
//       }
//     }
//   }
// }

// function extractSectionContent(parent: Parent, headingIndex: number, currentDepth: number): Node[] {
//   const content: Node[] = []
//   let i = headingIndex + 1

//   // Collect content until we hit another heading of the same or higher level
//   while (i < parent.children.length) {
//     const node = parent.children[i]

//     // Stop if we hit another heading of the same or higher level
//     if (node.type === 'heading' && (node as Heading).depth <= currentDepth) {
//       break
//     }

//     content.push(node)
//     i++
//   }

//   return content
// }

// export default remarkCollapsibleSection
