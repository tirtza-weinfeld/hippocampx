// import { visit } from 'unist-util-visit'
// import type { Plugin } from 'unified'
// import type { Root, List, ListItem } from 'mdast'

// export interface EnhancedListsOptions {
//   /** Enable compact list syntax (--) */
//   compact?: boolean
//   /** Enable minimal list syntax (-.) */
//   minimal?: boolean
//   /** Enable feature list syntax (-!) */
//   feature?: boolean
//   /** Enable timeline list syntax (-@) */
//   timeline?: boolean
//   /** Enable task list syntax (-[]) */
//   task?: boolean
// }

// const defaultOptions: EnhancedListsOptions = {
//   compact: true,
//   minimal: true,
//   feature: true,
//   timeline: true,
//   task: true,
// }

// /**
//  * Remark plugin to enhance list parsing with custom variants
//  */
// const remarkEnhancedLists: Plugin<[EnhancedListsOptions?], Root> = (options = {}) => {
//   const config = { ...defaultOptions, ...options }

//   return (tree: Root) => {
//     visit(tree, 'list', (node: List, index, parent) => {
//       if (!node.children || node.children.length === 0) return

//       // Check first list item for special syntax
//       const firstItem = node.children[0] as ListItem
//       if (!firstItem.children || firstItem.children.length === 0) return

//       const firstChild = firstItem.children[0]
//       if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return

//       const firstText = firstChild.children[0]
//       if (firstText.type !== 'text') return

//       const text = firstText.value.trim()
//       let variant: string | null = null

//       // Detect list variants based on syntax
//       if (config.compact && text.startsWith('--')) {
//         variant = 'compact'
//         // Remove the -- prefix
//         firstText.value = text.substring(2).trim()
//       } else if (config.minimal && text.startsWith('-.')) {
//         variant = 'minimal'
//         // Remove the -. prefix
//         firstText.value = text.substring(2).trim()
//       } else if (config.feature && text.startsWith('-!')) {
//         variant = 'feature'
//         // Remove the -! prefix
//         firstText.value = text.substring(2).trim()
//       } else if (config.timeline && text.startsWith('-@')) {
//         variant = 'timeline'
//         // Remove the -@ prefix
//         firstText.value = text.substring(2).trim()
//       } else if (config.task && text.startsWith('-[]')) {
//         variant = 'task'
//         // Remove the -[] prefix
//         firstText.value = text.substring(3).trim()
//       }

//       // If we found a variant, modify the node
//       if (variant) {
//         // Add data property to indicate variant
//         if (!node.data) {
//           node.data = {}
//         }
//         if (!node.data.hProperties) {
//           node.data.hProperties = {}
//         }
//         node.data.hProperties['data-variant'] = variant

//         // Process remaining items in the list to remove prefixes
//         for (let i = 1; i < node.children.length; i++) {
//           const item = node.children[i] as ListItem
//           if (!item.children || item.children.length === 0) continue

//           const child = item.children[0]
//           if (child.type !== 'paragraph' || !child.children || child.children.length === 0) continue

//           const textNode = child.children[0]
//           if (textNode.type !== 'text') continue

//           const itemText = textNode.value.trim()
          
//           // Remove matching prefixes from subsequent items
//           if (variant === 'compact' && itemText.startsWith('--')) {
//             textNode.value = itemText.substring(2).trim()
//           } else if (variant === 'minimal' && itemText.startsWith('-.')) {
//             textNode.value = itemText.substring(2).trim()
//           } else if (variant === 'feature' && itemText.startsWith('-!')) {
//             textNode.value = itemText.substring(2).trim()
//           } else if (variant === 'timeline' && itemText.startsWith('-@')) {
//             textNode.value = itemText.substring(2).trim()
//           } else if (variant === 'task' && itemText.startsWith('-[]')) {
//             textNode.value = itemText.substring(3).trim()
//           }
//         }
//       }
//     })

//     // Handle ordered list variants
//     visit(tree, 'list', (node: List) => {
//       if (!node.ordered || !node.children || node.children.length === 0) return

//       const firstItem = node.children[0] as ListItem
//       if (!firstItem.children || firstItem.children.length === 0) return

//       const firstChild = firstItem.children[0]
//       if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return

//       const firstText = firstChild.children[0]
//       if (firstText.type !== 'text') return

//       const text = firstText.value.trim()
      
//       // Check for compact ordered list syntax (-1., -2., etc.)
//       if (config.compact && /^-\d+\./.test(text)) {
//         if (!node.data) {
//           node.data = {}
//         }
//         if (!node.data.hProperties) {
//           node.data.hProperties = {}
//         }
//         node.data.hProperties['data-variant'] = 'compact'

//         // Remove the - prefix from all items
//         for (const item of node.children as ListItem[]) {
//           if (!item.children || item.children.length === 0) continue
          
//           const child = item.children[0]
//           if (child.type !== 'paragraph' || !child.children || child.children.length === 0) continue

//           const textNode = child.children[0]
//           if (textNode.type !== 'text') continue

//           const itemText = textNode.value.trim()
//           if (/^-\d+\./.test(itemText)) {
//             textNode.value = itemText.replace(/^-\d+\./, '').trim()
//           }
//         }
//       }
//     })
//   }
// }

// export default remarkEnhancedLists