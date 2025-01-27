import type { MDXComponents } from 'mdx/types';
import React, { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { LinkIcon } from 'lucide-react';
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;


const components: MDXComponents = {
  h1: (props: HeadingProps) => {

    return (
      <h1
        className=" 
      text-accent/90 font-extrabold mt-10 mb-4 text-2xl sm:text-[3.5rem] gradient-fade 
        animate-fade-in [&_span]:block
     
        "

        {...props}
      />
    )
  },
  h2: (props: HeadingProps) => {
    // console.log(props)
    return (
      <h2
        className={`text-secondary/50 font-bold mt-8 mb-3 text-3xl sm:[text-lte=400px]:text-xl    `}
        {...props}
      />
    )
  },
  h3: (props: HeadingProps) => (
    <h3
      className="text-accent/80 font-semibold mt-4 mb-2 text-2xl sm:[text-lte=400px]:text-lg

      "
      {...props}
    />
  ),
  h4: (props: HeadingProps) => (
    <h4
      className="text-foreground/70 font-medium mt-5 mb-1 text-lg sm:[text-lte=400px]:text-base"
      {...props}
    />
  ),
  p: (props: ParagraphProps) => (
    <p
      className="text-foreground/80 leading-relaxed mt-4 sm:[container-type=inline-size]:leading-loose"
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol
      className="list-decimal pl-5 space-y-3 text-primary/60 font-light sm:[container-type=inline-size]:space-y-2"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="list-disc pl-5 space-y-2 text-primary/60 font-light sm:[container-type=inline-size]:space-y-1"
      {...props}
    />
  ),
  li: (props: ListItemProps) => (
    <li className="pl-2 relative before:content-['•'] before:absolute before:-left-4 before:text-accent" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="font-semibold italic text-primary/70" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-bold text-accent/90" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const baseClass = 'underline text-blue-500 hover:text-blue-700 transition-colors';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={`${baseClass} focus-visible:ring`} {...props}>
          {children}
        </Link>
      );
    } if (href?.startsWith('#')) {
      if (children) { 
     
        if ( !children?.props?.className?.includes('icon icon-link')) {
          // console.log('children', children)
        }
      }
      return (
        <a href={href} className={baseClass} {...props}>

          {children }
          {children?.props?.className?.includes('icon icon-link') && <LinkIcon className='w-4 h-4' />}


        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} focus-visible:ring`}
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="relative text-lg font-light border-l-4 border-accent/30 pl-5 text-foreground/70 gradient-border 
      animate-slide-in sm:[container-type=inline-size]:border-none sm:[container-query=lte=500px]:text-sm"
      {...props}
    />
  ),
  code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="font-mono bg-foreground/10 px-2 py-1 rounded text-sm text-primary/70 gradient-code
        sm:[container-type=inline-size]:text-xs"
      {...props}
    >
      {children}
    </code>
  ),

  table: (props: ComponentPropsWithoutRef<'table'>) => {
    // console.log(props.children)
    // const data = props.children
    // console.log(JSON.stringify(data))
    return (
      <table {...props} className=' bg-foreground/10 rounded-lg p-4 m-4 
    [&>thead]:text-accent
    [&>thead>tr>th]:p-2
       [&>thead>tr>th]:bg-accent/10

 text-center
    [&>tbody>tr>td]:nth-1:bg-accent/10
    [&>tbody>tr>td]:nth-1:text-accent
    [&>tbody>tr>td]:border-b-2
    [&>tbody>tr>td]:border-accent/40
    [&>tbody>tr]:hover:bg-accent/10
    [&>tbody>tr>td]:p-2

    '>

      </table>
    )
  },
};

export function useMDXComponents(): MDXComponents {
  return { ...components };
}