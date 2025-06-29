import CopyCode from './copy-code';
import { tooltipifyJSX } from './tooltipify-jsx';
import { renderTooltipContent } from './render-tooltip-content';
import highlightCode from './code-highlighter';
import { getTooltipContent } from './tooltip-content';

export type CodeBlockProps = {
  className: string;
  meta?: string;
  children: React.ReactNode;
};

export default async function CodeBlock(props: CodeBlockProps) {

  const { className, meta, children: code } = { ...props }

  const tooltipContent = await getTooltipContent()

  const highlightedCode = await highlightCode(code as string, className.replace('language-', ''), meta as string)
  const highlightedCodeWithTooltips = tooltipifyJSX(
    highlightedCode,
    (symbol, parent, path) =>
      renderTooltipContent(symbol, parent, { ...tooltipContent}, path)
  );

  return (
    <div className="shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4">
      <div className="relative">
        <CopyCode className="absolute top-0 right-0" code={code as string} />
        <div className="overflow-x-auto py-8 line-numbers">{highlightedCodeWithTooltips}</div>
      </div>
    </div>
  )
}

