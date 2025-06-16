import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import CodeBlock, { CodeBlockProps } from '@/components/mdx/code-block';
import InlineCode from '@/components/mdx/code-inline';
import CodeStep from '@/components/mdx/code-step';
import { H1, H2, H3, H4, H5, H6, Paragraph, Strong, Em } from '@/components/mdx/typography';
import { Link } from '@/components/mdx/links';
export function useMDXComponents(
  components: MDXComponents
): MDXComponents {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    p: Paragraph,
    strong: Strong,
    em: Em,

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
    ...components,
  };
}
