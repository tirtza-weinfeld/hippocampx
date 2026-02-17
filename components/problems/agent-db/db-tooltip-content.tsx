import { MarkdownRenderer } from '@/components/mdx/parse/markdown-renderer';
import type { Symbol } from '@/lib/db/schema';

const kindStyles: Record<string, { bg: string; text: string }> = {
  parameter: {
    bg: 'from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40',
    text: 'text-blue-700 dark:text-blue-300',
  },
  variable: {
    bg: 'from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40',
    text: 'text-purple-700 dark:text-purple-300',
  },
  expression: {
    bg: 'from-cyan-50 to-teal-100 dark:from-cyan-900/40 dark:to-teal-800/40',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
  function: {
    bg: 'from-yellow-50 to-amber-100 dark:from-yellow-900/40 dark:to-amber-800/40',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  method: {
    bg: 'from-purple-50 to-violet-100 dark:from-purple-900/40 dark:to-violet-800/40',
    text: 'text-purple-700 dark:text-purple-300',
  },
  class: {
    bg: 'from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-800/40',
    text: 'text-blue-700 dark:text-blue-300',
  },
  comment: {
    bg: 'from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40',
    text: 'text-green-700 dark:text-green-300',
  },
};

/**
 * Renders tooltip content for a DB-backed symbol.
 */
export function DbTooltipContent({ symbol }: { symbol: Symbol }) {
  const style = kindStyles[symbol.kind] ?? kindStyles.variable;

  // Extract display name from qname (last segment after : and .)
  const afterColon = symbol.qname.split(':').pop() ?? symbol.qname;
  const name = afterColon.split('.').pop() ?? afterColon;

  if (symbol.kind === 'comment') {
    return (
      <div className="min-w-[280px] max-w-[420px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg p-4">
        <div className="text-sm text-green-700 dark:text-green-300">
          {symbol.summary && <MarkdownRenderer>{symbol.summary}</MarkdownRenderer>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[200px] max-w-[400px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg p-4 relative">
      <div className={`absolute right-3 top-1.5 bg-linear-to-r ${style.bg} ${style.text} rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm`}>
        {symbol.kind}
      </div>
      <div className="pr-16">
        <span className={`font-mono font-medium ${style.text}`}>{name}</span>
      </div>
      {symbol.summary && (
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <MarkdownRenderer>{symbol.summary}</MarkdownRenderer>
        </div>
      )}
    </div>
  );
}
