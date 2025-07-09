import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { InlineCodeClient } from './code-inline-client';
import highlightCode from './code-highlighter';
import { isValidColorName } from '@/lib/step-colors';
import { InlineMath } from '@/components/mdx/inline-math';

// Helper: get step/color if present
function parseStepOrColor(str: string): { step?: number; colorName?: string } {
  if (/^\d+$/.test(str)) {
    return { step: parseInt(str, 10) };
  } else if (isValidColorName(str)) {
    return { colorName: str };
  }
  return {};
}

type InlineCodeProps = ComponentPropsWithoutRef<'code'> & { children: ReactNode };

export default async function InlineCode({ children, ...restProps }: InlineCodeProps) {
  const codeText = children as string;

  // Check for step highlighting syntax: [step:]code or [color:]code
  const stepOrColorMatch = codeText.match(/^\[([^:\]]+):\](.+)$/);
  if (stepOrColorMatch) {
    const [, stepOrColor, code] = stepOrColorMatch;
    const { step, colorName } = parseStepOrColor(stepOrColor);
    // If the code is a math expression, render InlineMath with step/color
    const mathMatch = code.trim().match(/^\$([^$]+)\$$/);
    if (mathMatch) {
      const [, mathExpression] = mathMatch;
      return (
        <InlineMath className="inline-block" step={step} colorName={colorName}>
          {mathExpression.trim()}
        </InlineMath>
      );
    }
    // Otherwise, regular step/color inline code
    if (step) {
      return (
        <InlineCodeClient highlighted={true} step={step} {...restProps}>
          <span className="inline-block">{code.trim()}</span>
        </InlineCodeClient>
      );
    } else if (colorName) {
      return (
        <InlineCodeClient highlighted={true} colorName={colorName} {...restProps}>
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

  // Check if the code contains math expressions (single dollar signs for inline math)
  const mathMatch = codeText.match(/^\$([^$]+)\$$/);
  if (mathMatch) {
    const [, mathExpression] = mathMatch;
    return (
      <InlineMath className="inline-block">
        {mathExpression.trim()}
      </InlineMath>
    );
  }

  // Check if the code contains multiple math expressions that need to be parsed
  if (codeText.includes('$') && codeText.match(/\$[^$]+\$/)) {
    // Split the text by math expressions and render each part appropriately
    const parts = codeText.split(/(\$[^$]+\$)/);
    
    return (
      <InlineCodeClient highlighted={false} {...restProps}>
        {parts.map((part, index) => {
          // If part is a math expression, render InlineMath with default text color
          const mathMatch = part.match(/^\$([^$]+)\$$/);
          if (mathMatch) {
            const [, mathExpression] = mathMatch;
            return (
              <InlineMath 
                key={index}
                className="inline-block"
              >
                {mathExpression.trim()}
              </InlineMath>
            );
          }
          return part;
        })}
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