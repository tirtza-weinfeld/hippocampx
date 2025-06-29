import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { InlineCodeClient } from './code-inline-client';
import highlightCode from './code-highlighter';


type InlineCodeProps = ComponentPropsWithoutRef<'code'> & { children: ReactNode };

export default async function InlineCode({ children, ...restProps }: InlineCodeProps) {
  const codeText = children as string;

  // Check for step highlighting syntax: [step:]code
  const stepMatch = codeText.match(/^\[(\d+):\](.+)$/);
  if (stepMatch) {
    const [, step, code] = stepMatch;
    const stepNumber = parseInt(step, 10);

    return (
      <InlineCodeClient highlighted={true} step={stepNumber} {...restProps}>
        <span className="inline-block">{code.trim()}</span>
      </InlineCodeClient>
    );
  }

  // Check for the language highlighting syntax: [meta:]code
  const metaMatch = codeText.match(/^\[([^\]]+):\](.+)$/);

  if (metaMatch) {
    const [, lang, code] = metaMatch;

    const highlighted = await highlightCode(code.trim(), lang, undefined, false, true);
    return (
      <InlineCodeClient highlighted={true} {...restProps}>
        <span className="inline-block">{highlighted}</span>
      </InlineCodeClient>
    );

  }

  // Default styling for regular inline code (CSS only, no JS overhead)
  return (
    <InlineCodeClient highlighted={false} {...restProps}>
      {children}
    </InlineCodeClient>
  );
} 