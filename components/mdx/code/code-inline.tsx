import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { InlineCodeClient } from './code-inline-client';
import highlightCode from './code-highlighter';
import { isValidColorName } from '@/lib/step-colors';
import { InlineMath } from '@/components/mdx/inline-math';
import { getTooltipContent } from './tooltip-content';
import { renderTooltipContent } from './render-tooltip-content';
import { tooltipifyJSX } from './tooltipify-jsx';

// Helper: get step/color if present
function parseStepOrColor(str: string): { step?: number; colorName?: string } {
  if (/^\d+$/.test(str)) {
    return { step: parseInt(str, 10) };
  } else if (isValidColorName(str)) {
    return { colorName: str };
  }
  return {};
}

// Helper: extract symbol name from code text (handles function calls, variables, etc.)
function extractSymbolFromCode(code: string): string | null {
  // Remove common punctuation and whitespace
  const cleaned = code.trim();
  
  // Handle function calls: function() -> function
  const funcMatch = cleaned.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
  if (funcMatch) {
    return funcMatch[1];
  }
  
  // Handle simple identifiers (variables, constants, etc.)
  const identifierMatch = cleaned.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (identifierMatch) {
    return cleaned;
  }
  
  return null;
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

  // Check for the language highlighting syntax: [meta:]code, [language:meta="..."]code, or [tooltip:]code
  const metaMatch = codeText.match(/^\[([^\]]+):\](.+)$/);
  if (metaMatch) {
    let [, metaStr, code] = metaMatch;
    
    // Parse meta attributes like [python:meta="/initial/"] or [language:highlight="1,3-5"]
    let language = metaStr;
    let meta: string | undefined;
    
    const metaAttributeMatch = metaStr.match(/^([^:]+):(.+)$/);
    if (metaAttributeMatch) {
      const [, lang, metaAttrs] = metaAttributeMatch;
      language = lang;
      meta = metaAttrs;
    }
    
    // Handle tooltip-specific syntax
    if (language === 'tooltip') {
      // Extract symbol for tooltip support
      const symbol = extractSymbolFromCode(code.trim());
      
      if (symbol) {
        const tooltipData = await getTooltipContent();
        if (tooltipData[symbol]) {
          // Create a span with tooltip attributes that tooltipifyJSX can process
          const codeWithAttributes = (
            <span 
              data-tooltip-symbol={symbol}
              data-tooltip-type={tooltipData[symbol].type}
              className="tooltip-symbol"
            >
              <InlineCodeClient highlighted={false} {...restProps}>
                <span className="inline-block">{code.trim()}</span>
              </InlineCodeClient>
            </span>
          );
          
          // Apply tooltipify to add popover functionality, same as code blocks
          const codeWithTooltips = tooltipifyJSX(
            codeWithAttributes,
            (symbol, parent, path) =>
              renderTooltipContent(symbol, parent, tooltipData, path)
          );
          
          return codeWithTooltips;
        }
      }
      
      // Fallback: no tooltip data found, just return regular inline code
      return (
        <InlineCodeClient highlighted={false} {...restProps}>
          {code.trim()}
        </InlineCodeClient>
      );
    }
    
    // Handle language highlighting (python, javascript, etc.)
    const highlighted = await highlightCode(code.trim(), language, meta, true, true);
    
    // Apply tooltipify to add popover functionality for any symbols found in the highlighted code
    const tooltipData = await getTooltipContent();
    const highlightedWithTooltips = tooltipifyJSX(
      highlighted,
      (symbol, parent, path) =>
        renderTooltipContent(symbol, parent, tooltipData, path)
    );
    
    return (
      <InlineCodeClient highlighted={true} {...restProps}>
        <span className="inline-block">{highlightedWithTooltips}</span>
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