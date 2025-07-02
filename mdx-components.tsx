import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';

import CodeBlock from '@/components/mdx/code/code-block';
import InlineCode from '@/components/mdx/code/code-inline';

import { H1, H2, H3, H4, H5, H6, Paragraph, Strong, Em } from '@/components/mdx/typography';
import { Link } from '@/components/mdx/links';
import { HorizontalRule } from '@/components/mdx/dividers';
import Blockquote from '@/components/mdx/blockquotes';
import ContentPopover from '@/components/mdx/content-popover';
import Alert from '@/components/mdx/alert';
import { TableOfContents } from '@/components/mdx/toc/table-of-contents';
import { ResizableWrapper } from '@/components/mdx/toc/resizable-wrapper';
import CodeTooltip from '@/components/mdx/code/code-tooltip';
import { ListItem, OrderedList, UnorderedList } from './components/mdx/list';

export const customComponents = {
  
  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,

  // Typography
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  strong: Strong,
  em: Em,
  hr: HorizontalRule,
  blockquote: Blockquote,
  Alert,

  // Links
  a: Link,

  // Code components with proper handling
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) => {
    // Handle code blocks (with language specification)
    if (className?.includes('language-')) {
      return (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      );
    }
    
    // Handle inline code
    return (
      <InlineCode {...props}>
        {children}
      </InlineCode>
    );
  },

  // Pre component for code blocks
  pre: ({ children }: ComponentPropsWithoutRef<'pre'>) => {
    return (
      <div className="my-4">
        {children}
      </div>
    );
  },

  // Content components
  ContentPopover,
  CodeTooltip,
  
  // TOC Components
  TableOfContents,
  ResizableWrapper,
} as MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  };
}


