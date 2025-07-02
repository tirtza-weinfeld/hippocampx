import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { InlineCodeClient } from './code-inline-client';
import highlightCode from './code-highlighter';
import { isValidColorName } from '@/lib/step-colors';


type InlineCodeProps = ComponentPropsWithoutRef<'code'> & { children: ReactNode };

export default async function InlineCode({ children, ...restProps }: InlineCodeProps) {
  const codeText = children as string;

  // Check for step highlighting syntax: [step:]code or [color:]code
  const stepOrColorMatch = codeText.match(/^\[([^:\]]+):\](.+)$/);
  if (stepOrColorMatch) {
    const [, stepOrColor, code] = stepOrColorMatch;
    
    // Check if it's a number (step) or color name
    if (/^\d+$/.test(stepOrColor)) {
      // It's a numbered step
      const stepNumber = parseInt(stepOrColor, 10);
      return (
        <InlineCodeClient highlighted={true} step={stepNumber} {...restProps}>
          <span className="inline-block">{code.trim()}</span>
        </InlineCodeClient>
      );
    } else if (isValidColorName(stepOrColor)) {
      // It's a color name
      return (
        <InlineCodeClient highlighted={true} colorName={stepOrColor} {...restProps}>
          <span className="inline-block">{code.trim()}</span>
        </InlineCodeClient>
      );
    }
    // If it doesn't match step or color, fall through to language highlighting
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