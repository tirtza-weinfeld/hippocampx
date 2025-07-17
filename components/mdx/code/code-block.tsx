import { tooltipifyJSX } from './tooltipify-jsx';
import { renderTooltipContent } from './render-tooltip-content';
import highlightCode from './code-highlighter';
import { getTooltipContent } from './tooltip-content';
import { CodeBlockClient } from './code-block-client';

export type CodeBlockProps = {
  className: string;
  meta?: string;
  children: React.ReactNode;
};

export default async function CodeBlock(props: CodeBlockProps) {
  const { className, meta, children: code } = { ...props }

  const tooltipContent = await getTooltipContent()

  const highlightedCode = await highlightCode(code as string, className.replace('language-', ''), meta as string)
  
  // Use tooltipifyJSX which internally handles both line range grouping and expression tooltips
  const highlightedCodeWithTooltips = tooltipifyJSX(
    highlightedCode,
    (symbol, parent, path) =>
      renderTooltipContent(symbol, parent, { ...tooltipContent}, path)
  );

  // Count lines in the code
  const codeLines = (code as string).split('\n');
  const totalLines = codeLines.length;

  return (
    <CodeBlockClient
      code={code as string}
      highlightedCodeWithTooltips={highlightedCodeWithTooltips}
      totalLines={totalLines}
    />
  )
}

