import React from 'react';
import { MarkdownRenderer } from '../parse';
import type { SymbolMetadata } from './transformers/types';
import { convertMathToKatex } from '@/lib/utils/math-to-katex';
type TooltipMeta = SymbolMetadata;

function TooltipHeader({ meta }: { meta: TooltipMeta }) {
  // Handle parameter
  if (meta.kind === 'parameter') {
    return (
      <div className="mb-4 rounded-lg">
          <div className="
          absolute
          right-3
          top-1.5
          bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 
          rounded-full text-xs font-semibold 
          shadow-sm backdrop-blur-s
           hover:bg-linear-to-l 
           ">
            parameter
          </div>

    

        {/* Modern parameter signature */}
        {meta.label && (
          <div className="">
            <div className="">
              <MarkdownRenderer>{`[language="python" meta="/[blue!]${meta.name}/"] ${meta.label}`}</MarkdownRenderer>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle variable
  if (meta.kind === 'variable') {
    return (
      <div className=" text-sm mb-3 flex items-center gap-3 ">
        <div className=" absolute right-3 top-1.5  bg-linear-to-r from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
          variable
        </div>

        <MarkdownRenderer >
       {`[purple!]${meta.name}`}
        </MarkdownRenderer>
      </div>
    );
  }

  // Handle expression
  if (meta.kind === 'expression') {
    return (
      <div className="mb-4 mt-3">
          <div className=" absolute right-3 top-1.5  bg-linear-to-r from-cyan-50 to-teal-100 dark:from-cyan-900/40 dark:to-teal-800/40 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold border border-cyan-200/60 dark:border-cyan-700/60 shadow-sm backdrop-blur-sm hover:bg-linear-to-l">
            expression
          </div>

        {/* Expression code block */}
        <div className="font-mono text-sm 
         rounded  backdrop-blur-sm">
          <div className="break-all">
            <MarkdownRenderer>{`[language="python"] ${meta.name}`}</MarkdownRenderer>
            
          </div>
        </div>
      </div>
    );
  }

  // Function/method/class style
  // const displayName = meta.title || meta.name;

  const getKindStyles = (kind: string) => {
    switch (kind) {
      case 'function':
        return {
          badge: `from-yellow-50 to-amber-100  dark:from-amber-400/10 dark:to-amber-200/10 `,
          title: 'from-yellow-700 to-yellow-500  dark:from-yellow-400 dark:to-amber-500',
        };
      case 'method':
        return {
          badge: ' from-purple-50 to-violet-50 dark:from-purple-900/40 dark:to-violet-900/40 ',
          title: 'from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400'
        };
      case 'class':
        return {
          badge: 'from-sky-50 to-blue-50 dark:from-sky-900/40 dark:to-blue-900/40 ',
          title: 'from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400'
        };
      default:
        return {
          badge: 'bg-linear-to-r from-slate-50 to-gray-50 dark:from-slate-900/40 dark:to-gray-900/40 ',
          title: 'from-slate-600 to-gray-600 dark:from-slate-400 dark:to-gray-400'
        };
    }
  };



  const kindStyles = getKindStyles(meta.kind);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={` absolute right-3 top-1.5  rounded-full text-xs font-semibold  shadow-sm backdrop-blur-sm ${kindStyles.badge} bg-linear-to-r hover:bg-linear-to-l `}>
          <div className={` font-bold text-xs bg-linear-to-r ${kindStyles.title} bg-clip-text text-transparent  hover:bg-linear-to-l`}>
            {meta.kind}
          </div>
        </div>
   
      </div>
      {/* <div className={`font-bold text-md
        text-xl bg-linear-to-r ${kindStyles.title} bg-clip-text text-transparent mb-3 hover:bg-linear-to-l `}>
        {displayName}
      </div> */}
      {/* Modern function signature */}
      {meta.label && (
        <div className="font-mono text-sm ">
          <div className="text-slate-800 dark:text-slate-200  break-all">
            <MarkdownRenderer>{`[language="python" meta="/[yellow!]${meta.name}/"] ${meta.label}`}</MarkdownRenderer>

          </div>
        </div>
      )}
    </div>
  );
}

function TooltipDescription({ meta }: { meta: TooltipMeta }) {
  // Parameter description
  if (meta.kind === 'parameter' && meta.summary) {
    return (
      <div className="">
        <div className="text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
          <MarkdownRenderer>{meta.summary}</MarkdownRenderer>
        </div>
      </div>
    );
  }

  // Variable description
  if (meta.kind === 'variable' && meta.summary) {
    return (
      <div className="">
        <div className="text-purple-800 dark:text-purple-200 font-medium leading-relaxed">
          <MarkdownRenderer>{meta.summary}</MarkdownRenderer>
        </div>
      </div>
    );
  }

  // Expression description
  if (meta.kind === 'expression' && meta.summary) {
    // console.log('expression', meta.summary)
    return (
      <div className="">
        <div className="text-cyan-800 dark:text-cyan-200 font-medium ">
          <MarkdownRenderer>
            {meta.summary}
          </MarkdownRenderer>
        </div>
      </div>
    );
  }

  // Function/method definition, summary, and intuition
  if (meta.definition || meta.summary || meta.intuition) {
    return (
      <div className="space-y-4">
        {meta.summary && (
          <div className="text-sm p-4
           bg-linear-to-r hover:bg-linear-to-l
            from-slate-50/80 via-gray-50/60 to-transparent dark:from-slate-900/30 dark:via-gray-900/20 
            dark:to-transparent 
         shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">Summary</div>
            </div>
            <MarkdownRenderer className=" leading-relaxed">
              {meta.summary}
            </MarkdownRenderer>
          </div>
        )}
        {meta.definition && (
          <div className="text-sm p-4 bg-linear-to-r from-blue-50/80 to-sky-50/60 dark:from-blue-900/30 dark:to-sky-900/20  rounded-xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <div className="font-semibold text-blue-900 dark:text-blue-100 text-xs uppercase tracking-wider">Definition</div>
            </div>
            <MarkdownRenderer className="text-blue-800 dark:text-blue-200 leading-relaxed">
              {meta.definition}
            </MarkdownRenderer>
          </div>
        )}
        {/* {meta.intuition && (
          <div className="
          text-sm 
          bg-linear-to-r hover:bg-linear-to-l from-yellow-50/20 via-yellow-300/10 to-transparent dark:from-yellow-400/5 dark:via-yellow-500/10 
          dark:to-transparent
          p-3
          hover:shadow-sm hover:shadow-yellow-500/50 dark:hover:shadow-yellow-400/50
         ">
            <div className="flex items-center gap-2 mb-1  pt-3">
        <div className="w-1.5 h-1.5 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>

        <div className="font-semibold text-yellow-500 dark:text-yellow-400 text-xs uppercase tracking-wider">Intuition</div>

            </div>
            <MarkdownRenderer >
              {meta.intuition}
            </MarkdownRenderer>
          </div>
         
        )} */}
      </div>
    );
  }

  return null;
}

function createTooltipParameters(allMetadata: Record<string, SymbolMetadata>) {
  return function TooltipParameters({ meta }: { meta: TooltipMeta }) {
    if (!meta.args || !Array.isArray(meta.args) || meta.args.length === 0) {
      return null;
    }

    // Check if any parameters have documentation
    const hasDocumentedParams = meta.args.some(arg => {
      const paramQname = `${meta.name}:${meta.name}.${arg}`;
      const paramMeta = allMetadata[paramQname];
      return paramMeta?.label || paramMeta?.summary;
    });

    if (!hasDocumentedParams) {
      return null;
    }

    return (
      <div className="text-sm mb-4">
        <div className="flex items-center gap-2 mt-3">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="font-semibold text-blue-900 dark:text-blue-100 text-xs uppercase tracking-wider">Parameters</div>
        </div>
        <div className="space-y-3">
          {meta.args.map((arg) => {
            // Build qualified name for parameter lookup
            // Format: "function_name:function_name.parameter_name"
            const paramQname = `${meta.name}:${meta.name}.${arg}`;
            const paramMeta = allMetadata[paramQname];

            // Only render if there's documentation
            if (!paramMeta?.label && !paramMeta?.summary) {
              return null;
            }

            return (
              <div key={arg} className="p-3 bg-linear-to-r from-emerald-50/80 to-emerald-100/60 dark:from-emerald-900/30 dark:to-emerald-800/20  rounded-xl shadow-sm backdrop-blur-sm">
                {paramMeta?.label && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-100/80 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-medium
                     ">
                      <MarkdownRenderer>{`[language="python"] ${paramMeta.label}`}</MarkdownRenderer>
                    </span>
                  </div>
                )}
                {paramMeta?.summary && (
                  <div className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    <MarkdownRenderer>{paramMeta.summary}</MarkdownRenderer>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}

function TooltipReturns({ meta }: { meta: TooltipMeta }) {
  return meta.returns?.summary ? (
    <div className="transition-all duration-300 ease-out hover:translate-x-1 relative p-3 text-sm mb-4 mt-3  bg-linear-to-r  hover:bg-linear-to-l
    hover:shadow-sm hover:shadow-indigo-500/50 dark:hover:shadow-indigo-400/50
    
    from-indigo-50/20 via-indigo-300/10 to-transparent dark:from-indigo-900/30 dark:via-indigo-800/20  shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
        <div className="font-semibold text-indigo-900 dark:text-indigo-100 text-xs uppercase tracking-wider">Returns</div>
      </div>
      <div className="
    
       ">
        {/* <div className="space-y-2 "> */}
          <span className=" absolute right-3 top-1.5 inline-flex items-center font-mono text-indigo-800 dark:text-indigo-200 font-medium bg-indigo-100/80 
          dark:bg-indigo-900/60 rounded-lg  text-sm">
            {meta.returns.label}
          </span>
          <div className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
            <MarkdownRenderer>{meta.returns.summary}</MarkdownRenderer>
          </div>
        </div>
      </div>
    // </div>
  ) : null;
}

function createTooltipVariables(allMetadata: Record<string, SymbolMetadata>) {
  return function TooltipVariables({ meta }: { meta: TooltipMeta }) {
    if (!meta.variables || !Array.isArray(meta.variables) || meta.variables.length === 0) {
      return null;
    }

    // Check if any variables have documentation
    const hasDocumentedVars = meta.variables.some(variable => {
      const variableQname = `${meta.name}:${meta.name}.${variable}`;
      const variableMeta = allMetadata[variableQname];
      return variableMeta?.summary;
    });

    if (!hasDocumentedVars) {
      return null;
    }

    return (
      <div className="text-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
          <div className="font-semibold text-purple-900 dark:text-purple-100 text-xs uppercase tracking-wider">Variables</div>
        </div>
        <div className="space-y-3">
          {meta.variables.map((variable) => {
            // Build qualified name for variable lookup
            // Format: "function_name:function_name.variable_name"
            const variableQname = `${meta.name}:${meta.name}.${variable}`;
            const variableMeta = allMetadata[variableQname];

            // Only render if there's documentation
            if (!variableMeta?.summary) {
              return null;
            }

            return (
              <div key={variable} className="p-3 bg-linear-to-r from-purple-50/80 to-purple-100/60 dark:from-purple-900/30 dark:to-purple-800/20  rounded-xl shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center font-mono text-purple-800 dark:text-purple-200 font-medium px-3 py-1.5 bg-purple-100/80 dark:bg-purple-900/60 rounded-lg
                  text-sm">{variable}</span>
                </div>
                <div className="text-xs text-purple-800 dark:text-purple-200 leading-relaxed">
                  {/* <TooltipMDXContentSync >{variableMeta.summary}</TooltipMDXContentSync> */}
                  <MarkdownRenderer>
                    {variableMeta.summary}
                  </MarkdownRenderer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}

function TooltipTimeComplexity({ meta }: { meta: TooltipMeta }) {
  return meta.time_complexity ? (
    <div className="text-sm mt-3 bg-linear-to-r  hover:bg-linear-to-l from-sky-50/20 via-sky-300/10 to-transparent 
    hover:shadow-md hover:shadow-blue-500/50 dark:hover:shadow-blue-400/50
    dark:from-sky-900/10 dark:via-sky-800/10  p-3  hover:translate-x-1
    transition-all duration-300 ease-out
">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
        <div className="font-semibold text-sky-900 dark:text-sky-100 text-xs uppercase tracking-wider">Time Complexity</div>
      </div>
      <div className="px-3">

       
        <MarkdownRenderer className="text-sky-800 dark:text-sky-200">
         {convertMathToKatex(meta.time_complexity.split('\n')[0].replace(/:\s*$/, ''))}
        </MarkdownRenderer>
        
      </div>
    </div>
  ) : null;
}

function TooltipTopics({ meta }: { meta: TooltipMeta }) {
  return meta.topics && Array.isArray(meta.topics) && meta.topics.length > 0 ? (
    <div className="text-sm mb-4 ">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
        <div className="font-semibold text-teal-900 dark:text-teal-100 text-xs uppercase tracking-wider">Topics</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {meta.topics.map((topic, idx) => (
          <span key={topic || idx} className="inline-flex items-center px-3 py-1.5 
          bg-linear-to-r from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 text-teal-800 dark:text-teal-200 
          rounded-full text-xs font-medium  shadow-sm backdrop-blur-sm
          hover:bg-linear-to-l
          ">
            {topic}
          </span>
        ))}
      </div>
    </div>
  ) : null;
}

function TooltipLeetcode({ meta }: { meta: TooltipMeta }) {
  return meta.leetcode ? (
    <div className="text-sm ">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
        <div className="font-semibold 
        bg-linear-to-r from-black to-gray-500 via-orange-500  bg-clip-text text-transparent
        hover:bg-linear-to-l
     
        text-xs uppercase tracking-wider">LeetCode</div>
      </div>
      <div className="p-3 bg-linear-to-r from-slate-50/80 to-slate-100/60 dark:from-slate-900/30 dark:to-slate-800/20 
       rounded-xl shadow-sm backdrop-blur-sm">
        {/* <TooltipMDXContentSync className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed"> */}
        <MarkdownRenderer>
          {meta.leetcode}
        </MarkdownRenderer>
        {/* </TooltipMDXContentSync> */}
      </div>
    </div>
  ) : null;
}

// Remove TooltipCode since it's not in the new structure

/**
 * Generates structured tooltip content for code symbols based on metadata lookup.
 * 
 * This server-side function searches through symbol metadata using qualified names (qnames)
 * to find documentation for functions, methods, classes, parameters, variables, and expressions.
 * 
 * @param qname - The qualified name to look up (e.g., "koko_eating_bananas:koko_eating_bananas.h")
 * @param TOOLTIP_CONTENT - Dictionary containing all symbol metadata indexed by qname
 * 
 * @returns React node containing structured tooltip content with appropriate sections
 * 
 * @example
 * ```tsx
 * const tooltip = renderTooltipContent(
 *   "koko_eating_bananas:koko_eating_bananas.h", 
 *   metadata
 * );
 * ```
 * 
 * Symbol type handling based on 'kind':
 * - **function/method/class**: Full documentation with parameters, return types, complexity, etc.
 * - **parameter**: Type and description with emerald styling
 * - **variable**: Name and description with purple styling  
 * - **expression**: Expression and description with cyan styling
 */
export function renderTooltipContent(
  qname: string,
  TOOLTIP_CONTENT: Record<string, SymbolMetadata>
): React.ReactNode {

  const meta = TOOLTIP_CONTENT[qname];

  // Fallback: show qname with helpful debug info
  if (!meta) {
    const availableKeys = Object.keys(TOOLTIP_CONTENT)
      .filter(key => key.includes(qname.split(':')[0]) || key.includes(qname.split('.').pop() || ''))
      .slice(0, 3); // Show first 3 matches for debugging

    return (
      <div className="p-4 bg-linear-to-r from-red-50/80 to-rose-50/60 dark:from-red-900/30 dark:to-rose-900/20  rounded-xl shadow-sm backdrop-blur-sm">
        <div className="text-red-800 dark:text-red-200 font-medium">
          Symbol <span className="font-mono bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded">{qname}</span> not found.
        </div>
        {availableKeys.length > 0 && (
          <div className="text-xs mt-3 text-red-600 dark:text-red-400 font-medium">
            <div className="mb-1">Similar symbols:</div>
            <div className="space-x-1">
              {availableKeys.map((key) => (
                <span key={key} className="font-mono bg-red-100/50 dark:bg-red-900/30 px-1.5 py-0.5 rounded text-red-700 dark:text-red-300">
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Create closures with metadata access
  const TooltipParameters = createTooltipParameters(TOOLTIP_CONTENT);
  const TooltipVariables = createTooltipVariables(TOOLTIP_CONTENT);

  // Handle different symbol kinds
  return (
    // <div className="w-[90vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-5">
    <div
      className="min-w-[280px] max-w-[420px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg rounded-lg
      shadow-xl  p-5 @container
      relative transition-all duration-200 ease-out
      "
      style={{
        willChange: 'auto',
        transform: 'translateZ(0)'
      }}
    >
      <TooltipHeader meta={meta} />
      <TooltipDescription meta={meta} />
      <TooltipParameters meta={meta} />
      <TooltipReturns meta={meta} />
      <TooltipVariables meta={meta} />
      <TooltipTimeComplexity meta={meta} />
      <TooltipTopics meta={meta} />
      <TooltipLeetcode meta={meta} />
    </div>
  );
} 