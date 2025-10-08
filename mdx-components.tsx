import React, { Suspense } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { DifficultyBadge } from '@/components/mdx/difficulty-badge';
import CodeBlock, { CodeBlockSkeleton } from '@/components/mdx/code/code-block';
import InlineCode from '@/components/mdx/code/code-inline';
import { CodeTabs } from '@/components/mdx/code/code-tabs';
import { CodeTab } from '@/components/mdx/code/code-tab';
import { CodeTabsList } from '@/components/mdx/code/code-tabs-list';
import { CodeTabTrigger } from '@/components/mdx/code/code-tab-trigger';

// import { MermaidDiagram } from '@/components/mdx/code/mermaid-diagram';
// import { ProblemCodeBlock } from '@/components/mdx/problem/code/problem-code-block';
// import TabbedCodeBlock from '@/components/mdx/code/tabbed-code-block';
import { H1, H2, H3, H4, H5, H6, Paragraph, Strong, Em } from '@/components/mdx/typography';
import { Link } from '@/components/mdx/links';
// import { ProblemLinkPreview } from '@/components/mdx/problem-link-preview';
import { HorizontalRule } from '@/components/mdx/dividers';
import Blockquote from '@/components/mdx/blockquotes';
import ContentPopover from '@/components/mdx/content-popover';
import Alert, { AlertProps, AlertSuspense } from '@/components/mdx/alert';
import { TableOfContents } from '@/components/mdx/toc/table-of-contents';
import { ResizableWrapper } from '@/components/mdx/toc/resizable-wrapper';
import CodeTooltip from '@/components/mdx/code/code-tooltip';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from '@/components/mdx/table';
// Import standard list components only
import { OrderedList } from '@/components/mdx/list/ordered-list';
import { UnorderedList } from '@/components/mdx/list/unordered-list';
import ListItem from '@/components/mdx/list/list-item';
import FeatureItem from '@/components/mdx/list/feature-item';
import { TaskItem } from '@/components/mdx/list/task-item';
import { ProblemComponents, ProblemHeaders, ProblemItems } from '@/components/mdx/problem';
// All Problems Components
import { CodeEditor } from '@/components/editor'
import { ProblemDeepDive } from "@/components/mdx/problem/problem-deepdive"
import  CollapsibleListItem from '@/components/mdx/list/collapsible-list-item';
import CollapsibleIntuitionListItem from '@/components/mdx/list/collapsible-intuition-list-item';
import { CustomLists } from '@/components/mdx/custom/list'
import { PillList } from '@/components/mdx/list/pill-list';
// Collapsible Section Components
import { CollapsibleSection } from '@/components/mdx/collapsible/collapsible-section';
import { CollapsibleSectionHeader } from '@/components/mdx/collapsible/collapsible-section-header';
import { CollapsibleSectionContent } from '@/components/mdx/collapsible/collapsible-section-content';
// Header Components (using existing typography components)


export const customComponents = {
  PillList,
  // Lists - Standard HTML elements only
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,

  UnorderedList,
  OrderedList,
  ListItem,
  ...CustomLists,

  // Custom list item components for plugin-generated JSX
  FeatureItem,
  TaskItem,
  ...ProblemItems,
  ProblemDeepDive,
  CollapsibleListItem,
  CollapsibleIntuitionListItem,

  // Collapsible Section Components
  CollapsibleSection,
  CollapsibleSectionHeader,
  CollapsibleSectionContent,

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
  Alert:({ children, ...props }: ComponentPropsWithoutRef<'div'> & AlertProps) => {
    return (
      <Suspense fallback={<AlertSuspense />}>  
      <Alert {...props}>
        {children}
      </Alert>
      </Suspense>
    );
  },

  // Links with automatic problem preview enhancement
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
    // if (href && /\/problems\/[^\/]+\/?$/.test(href)) {
    //   return (
    //     <ProblemLinkPreview href={href}>
    //       {children}
    //     </ProblemLinkPreview>
    //   )
    // }
    return <Link href={href} {...props}>{children}</Link>
  },

  // Table components
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tfoot: TableFooter,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  caption: TableCaption,

  CodeEditor,
  CodeTabs,
  CodeTab,
  CodeTabsList,
  CodeTabTrigger,
  

  // Code components with proper handling
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) => {
    // Handle code blocks (with language specification)
    if (className?.includes('language-')) {
      // Handle mermaid diagrams
      // if (className === 'language-mermaid') {
      //   return <MermaidDiagram chart={children as string} />
      // }

      // console.log(`language-${className}, ${JSON.stringify(children)}`)

      return (
        <Suspense fallback={<CodeBlockSkeleton />}>
          <CodeBlock className={className} {...props}>
            {children}
          </CodeBlock>
        </Suspense>
      );

    }

    // console.log(`inline-${className}, ${JSON.stringify(children)}`)
    // Handle inline code
    // console.log('props', props);
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

  // Custom tabbed code block node
  // TabbedCodeBlock: (props: { tabs: string }) => (
  //   <TabbedCodeBlock tabs={JSON.parse(props.tabs)} />
  // ),

  // Content components
  ContentPopover,
  CodeTooltip,

  // TOC Components
  TableOfContents,
  ResizableWrapper,

  // Problem Components
  ...ProblemComponents,
  ...ProblemHeaders,
  DifficultyBadge,

  // Header Components handled by existing h1-h6 in typography

} as MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  };
}

export const mdxComponents = {
  ...customComponents,
};




