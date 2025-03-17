import Link from 'next/link';
import React, { ComponentPropsWithoutRef } from 'react';
// import { Link } from 'next-view-transitions';
import { highlight } from 'sugar-high';
// import CodeBlock from '@/components/notes/CodeBlock';
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;

const components = {
  h1: (props: HeadingProps) => (
    <h1 className="font-medium pt-12 mb-0 fade-in" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="text-primary font-medium mt-8 mb-3" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-primary font-medium mt-8 mb-3" {...props} />
  ),
  h4: (props: HeadingProps) => <h4 className="font-medium" {...props} />,
  p: (props: ParagraphProps) => (
    <p className="text-primary leading-snug" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="text-primary list-decimal pl-5 space-y-2" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="text-primary list-disc pl-5 space-y-1" {...props} />
  ),
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className = 'text-accent hover:text-accent/80';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },

  // pre: (props: any) => {
  //   console.log('props2', props);
  //   return <pre {...props} />;
  // },
  code: ({children,meta,...props}:React.ComponentPropsWithoutRef<'code'> & {meta:any}) => {
    // code: ({ children, ...props }: {children:any,props:any}) => {

    // console.log('meta', meta);
    // console.log('props1', props,meta);
    // console.log('props1', meta);
    const codeHTML = highlight(children as string);
    return <code


      dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  table: ({ data }: { data: { headers: string[]; rows: string[][] } }) =>{
    console.log('data', data);
    return(
    <table className="bg-red-800">
      <thead>
        <tr className="bg-green-800">
          {data?.headers?.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.rows?.map((row, index) => (
          <tr key={index}>
            {row?.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    )
  },
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-accent/80 pl-4 text-secondary
      bg-purple-800
      scale-180
      "
      {...props}
    />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
