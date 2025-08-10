import type { ShikiTransformer } from 'shiki';

interface CommentMetadata {
  line: number;
  originalLine: number;
  content: string;
  type: 'inline' | 'full-line';
  indent?: number;
}

export interface CommentTransformerOptions {
  comments: CommentMetadata[];
}

/**
 * Transformer that detects comment markers and adds metadata for tooltip rendering
 */
export function transformerCommentTooltips(options: CommentTransformerOptions): ShikiTransformer {
  const { comments } = options;
  
  return {
    name: 'comment-tooltips',
    code(node) {
      if (!comments.length) return;
      
      // Walk through all text nodes and replace comment markers
      this.addClassToHast(node, 'has-comment-tooltips');
      
      walkElements(node, (element) => {
        if (element.type === 'text') {
          const text = element.value;
          
          // Check for comment markers
          const commentMarkerRegex = /\/\* (?:comment-(\d+)|inline-comment-(\d+)) \*\//g;
          let match;
          const replacements: Array<{ start: number; end: number; commentIndex: number; isInline: boolean }> = [];
          
          while ((match = commentMarkerRegex.exec(text)) !== null) {
            const commentIndex = parseInt(match[1] || match[2], 10);
            const isInline = !!match[2];
            
            replacements.push({
              start: match.index,
              end: match.index + match[0].length,
              commentIndex,
              isInline
            });
          }
          
          if (replacements.length > 0) {
            // Replace text with comment tooltip markers
            const newChildren: Array<any> = [];
            let lastIndex = 0;
            
            for (const replacement of replacements) {
              // Add text before the marker
              if (replacement.start > lastIndex) {
                newChildren.push({
                  type: 'text',
                  value: text.slice(lastIndex, replacement.start)
                });
              }
              
              // Add comment tooltip element
              const comment = comments[replacement.commentIndex];
              if (comment) {
                newChildren.push({
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    'data-comment-tooltip': 'true',
                    'data-comment-content': comment.content,
                    'data-comment-type': comment.type,
                    'data-comment-index': replacement.commentIndex.toString(),
                    className: replacement.isInline ? 'comment-inline' : 'comment-full-line'
                  },
                  children: []
                });
              }
              
              lastIndex = replacement.end;
            }
            
            // Add remaining text
            if (lastIndex < text.length) {
              newChildren.push({
                type: 'text',
                value: text.slice(lastIndex)
              });
            }
            
            // Replace the parent's children
            if (element.parent && element.parent.children) {
              const parentChildren = element.parent.children;
              const elementIndex = parentChildren.indexOf(element as any);
              if (elementIndex !== -1) {
                parentChildren.splice(elementIndex, 1, ...newChildren);
              }
            }
          }
        }
      });
    }
  };
}

function walkElements(node: any, callback: (element: any) => void) {
  callback(node);
  
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      child.parent = node;
      walkElements(child, callback);
    }
  }
}