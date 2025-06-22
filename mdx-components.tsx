import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import CodeBlock, { CodeBlockProps } from '@/components/mdx/code-block';
import InlineCode from '@/components/mdx/code-inline';
import CodeStep from '@/components/mdx/code-step';
import { H1, H2, H3, H4, H5, H6, Paragraph, Strong, Em } from '@/components/mdx/typography';
import { Link } from '@/components/mdx/links';
import { HorizontalRule } from '@/components/mdx/dividers';
import Blockquote from '@/components/mdx/blockquotes';
import ContentPopover from '@/components/mdx/content-popover';
import { POPOVER_CONTENT } from '@/components/mdx/code/popover-content';
import Alert from '@/components/mdx/alert';
import { TableOfContents } from '@/components/mdx/toc/table-of-contents';
import { ResizableWrapper } from '@/components/mdx/toc/resizable-wrapper';

type SpanProps = ComponentPropsWithoutRef<'span'> & {
  'data-tooltip'?: string;
  'data-step'?: string;
  'data-has-highlight'?: string;
};

export const customComponents = {

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

  // Links and Images
  a: Link,
  code: ({ children, ...props }: ComponentPropsWithoutRef<'code'> & CodeBlockProps) => {
    if (props.className?.includes('language-')) {
      return (
        <CodeBlock {...props} >
          {children}
        </CodeBlock>
      )
    }
    return (
      <InlineCode {...props}>{children}</InlineCode>
    )
  },
  CodeStep,
  ContentPopover,
  // TOC Components
  TableOfContents,
  ResizableWrapper,
  // Custom span renderer to handle tooltips
  span: ({ children, ...props }: SpanProps) => {
    const key = props['data-tooltip'];
    if (props.className?.includes('hasToolTip') && typeof key === 'string') {
      const step = props['data-step'] ? parseInt(props['data-step'], 10) : undefined;
      const hasHighlight = props['data-has-highlight'] === 'true';
      return <ContentPopover 
        word={key} 
        content={POPOVER_CONTENT[key.toLocaleLowerCase()]} 
        step={step}
        hasHighlight={hasHighlight}
        className={props.className}
      />;
    }
    return <span {...props}>{children}</span>;
  },
} as MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,

    ...components,
  };
}


