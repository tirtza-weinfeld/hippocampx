import React from 'react';
import type { SymbolMetadata, Parameter, Variable, Expression } from '@/lib/types';
import highlightCode from './code-highlighter';
import InlineCode from './code-inline';
import { TooltipMarkdown } from './tooltip-markdown';

interface ParameterTooltip extends Parameter {
  type: string;
  parent: string;
  path?: string[];
  isParam?: boolean;
}

interface VariableTooltip extends Variable {
  parent: string;
  path?: string[];
  isVar?: boolean;
}

interface ExpressionTooltip extends Expression {
  parent: string;
  path?: string[];
  isExpr?: boolean;
}

type TooltipMeta = SymbolMetadata | ParameterTooltip | VariableTooltip | ExpressionTooltip;

function TooltipHeader({ meta }: { meta: TooltipMeta }) {
  if ('isParam' in meta && meta.isParam) {
    const paramType = typeof (meta as Parameter).type === 'string' && (meta as Parameter).type ? (meta as Parameter).type : 'unknown';
    return (
      <div className="text-sm mb-2 flex items-center gap-2">
        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
          parameter
        </span>
        <InlineCode className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200">
          {`${meta.name}: ${paramType}`}
        </InlineCode>
      </div>
    );
  }
  
  if ('isExpr' in meta && meta.isExpr) {
    return (
      <div className="text-sm mb-2 flex items-center gap-2">
        <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded text-xs font-medium">
          expression
        </span>
        <InlineCode className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-200">
          {meta.expression}
        </InlineCode>
      </div>
    );
  }
  
  // Function/class style as before
  const displayName = 'path' in meta && Array.isArray(meta.path) && meta.path.length > 0 
    ? [...meta.path, 'name' in meta ? meta.name : meta.expression].join('.') 
    : 'parent' in meta && meta.parent 
      ? `${meta.parent}.${'name' in meta ? meta.name : meta.expression}` 
      : 'name' in meta ? meta.name : meta.expression;
  
  const typeColor = meta.type === 'function' ? 'text-yellow-600 dark:text-yellow-400' :
                   meta.type === 'method' ? 'text-purple-600 dark:text-purple-400' :
                   meta.type === 'class' ? 'text-sky-600 dark:text-sky-400' :
                   'text-gray-600 dark:text-gray-400';
  
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-1">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          meta.type === 'function' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
          meta.type === 'method' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
          meta.type === 'class' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' :
          'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
        }`}>
          {meta.type}
        </span>
      </div>
      <div className={`font-bold text-lg ${typeColor}`}>
        {displayName}
      </div>
    </div>
  );
}

// function TooltipType({ meta }: { meta: TooltipMeta }) {
//   return !('type' in meta && meta.type === 'parameter') && meta.type ? (
//     <div className="text-xs text-blue-700 mb-1 bg-blue-500">{meta.type}</div>
//   ) : null;
// }



// Helper function to parse docstrings and make parameter names clickable (server-side)
// Currently unused - may be integrated with TooltipMarkdown in the future
/* function parseDocstringWithClickableParams(
  description: string,
  parameters: Parameter[]
): React.ReactNode {
  if (!description || !parameters || parameters.length === 0) {
    return description;
  }

  // Create a set of parameter names for quick lookup
  const paramNames = new Set(parameters.map(p => p.name));
  
  // Split the description into words while preserving punctuation and spaces
  const words = description.split(/(\s+|[.,!?;:()[\]{}"])/);
  
  return words.map((word, index) => {
    // Check if this word (without surrounding punctuation) is a parameter name
    const cleanWord = word.replace(/[.,!?;:()[\]{}"`]/g, '');
    
    if (paramNames.has(cleanWord)) {
      // Find the parameter metadata
      const param = parameters.find(p => p.name === cleanWord);
      if (param) {
        return (
          <span 
            key={index}
            className="tooltip-param-reference font-mono text-blue-600 dark:text-blue-400 font-semibold border-b border-dotted border-blue-400"
            title={`Parameter: ${param.name}: ${param.type || 'unknown'} - ${param.description || 'No description'}`}
          >
            {word}
          </span>
        );
      }
    }
    
    return word;
  });
} */

function TooltipDescription({ meta }: { meta: TooltipMeta }) {
  // VS Code style for parameter
  if ('type' in meta && meta.type === 'parameter') {
    const desc = typeof meta.description === 'string' && meta.description ? meta.description : 'No description.';
    return (
      <div className="text-sm mb-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 dark:border-emerald-600 rounded-r">
        <div className="text-emerald-800 dark:text-emerald-200 font-medium">
          {'name' in meta ? meta.name : ''}{'name' in meta ? ': ' : ''}<TooltipMarkdown>{desc}</TooltipMarkdown>
        </div>
      </div>
    );
  }
  
  // VS Code style for expression
  if ('isExpr' in meta && meta.isExpr) {
    const desc = typeof meta.description === 'string' && meta.description ? meta.description : 'No description.';
    return (
      <div className="text-sm mb-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-400 dark:border-cyan-600 rounded-r">
        <div className="text-cyan-800 dark:text-cyan-200 font-medium">
          <TooltipMarkdown>{desc}</TooltipMarkdown>
        </div>
      </div>
    );
  }
  
  // Enhanced function/method style with clickable parameters
  if ('description' in meta && meta.description) {
    const isMethod = 'parent' in meta && meta.parent;
    
    return (
      <div className="text-sm mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 rounded-r">
        <TooltipMarkdown className="text-blue-800 dark:text-blue-200 leading-relaxed">
          {/* For methods, make parameter names in docstrings clickable */}
          {isMethod && 'parameters' in meta && Array.isArray(meta.parameters) ? (
            // For now, just use the description as-is with TooltipMarkdown
            // TODO: Combine with parseDocstringWithClickableParams if needed
            meta.description
          ) : (
            meta.description
          )}
        </TooltipMarkdown>
      </div>
    );
  }
  
  return null;
}

function TooltipParameters({ meta }: { meta: TooltipMeta }) {
  return 'parameters' in meta && Array.isArray(meta.parameters) && meta.parameters.length > 0 ? (
    <div className="text-sm mb-3">
      <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
        Parameters:
      </div>
      <div className="space-y-2">
        {meta.parameters.map((param, idx) => (
          <div key={param.name || idx} className="flex flex-col gap-1 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-800 dark:text-emerald-200 font-medium">{param.name}</span>
              {param.type && <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-100 rounded border border-emerald-200 dark:border-emerald-600"><TooltipMarkdown>{param.type}</TooltipMarkdown></span>}
            </div>
            {param.description && <span className="text-emerald-700 dark:text-emerald-300 text-xs"><TooltipMarkdown>{param.description}</TooltipMarkdown></span>}
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

function TooltipReturns({ meta }: { meta: TooltipMeta }) {
  return 'return_type' in meta && meta.return_type ? (
    <div className="text-sm mb-3">
      <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
        Returns:
      </div>
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center gap-2">
          <span className="font-mono text-indigo-800 dark:text-indigo-100 font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 rounded border border-indigo-200 dark:border-indigo-600"><TooltipMarkdown>{meta.return_type}</TooltipMarkdown></span>
        </div>
        {'return_description' in meta && meta.return_description && (
          <div className="text-indigo-700 dark:text-indigo-300 text-xs mt-1"><TooltipMarkdown>{meta.return_description}</TooltipMarkdown></div>
        )}
      </div>
    </div>
  ) : null;
}

function TooltipVariables({ meta }: { meta: TooltipMeta }) {
  // Handle individual variable tooltip
  if ('isVar' in meta && meta.isVar && 'name' in meta) {
    return (
      <div className="text-sm mb-3">
        <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Variable:
        </div>
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2">
            <span className="font-mono text-purple-800 dark:text-purple-200 font-medium">{meta.name}</span>
          </div>
          {meta.description && (
            <div className="text-purple-700 dark:text-purple-300 text-xs mt-1">
              <TooltipMarkdown>{meta.description}</TooltipMarkdown>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Handle variables list for function/class tooltips
  return 'variables' in meta && Array.isArray(meta.variables) && meta.variables.length > 0 ? (
    <div className="text-sm mb-3">
      <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        Variables:
      </div>
      <div className="space-y-2">
        {meta.variables.map((variable, idx) => (
          <div key={variable.name || idx} className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-2">
              <span className="font-mono text-purple-800 dark:text-purple-200 font-medium">{variable.name}</span>
            </div>
            {variable.description && (
              <div className="text-purple-700 dark:text-purple-300 text-xs mt-1">
                <TooltipMarkdown>{variable.description}</TooltipMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

function TooltipExpressions({ meta }: { meta: TooltipMeta }) {
  // Handle individual expression tooltip
  if ('isExpr' in meta && meta.isExpr) {
    return (
      <div className="text-sm mb-3">
        <div className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
          Expression:
        </div>
        <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-700">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-800 dark:text-cyan-200 font-medium">{meta.expression}</span>
          </div>
          {meta.description && (
            <div className="text-cyan-700 dark:text-cyan-300 text-xs mt-1">
              <TooltipMarkdown>{meta.description}</TooltipMarkdown>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Handle expressions list for function/class tooltips
  return 'expressions' in meta && Array.isArray(meta.expressions) && meta.expressions.length > 0 ? (
    <div className="text-sm mb-3">
      <div className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
        Expressions:
      </div>
      <div className="space-y-2">
        {meta.expressions.map((expression, idx) => (
          <div key={expression.expression || idx} className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-700">
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-800 dark:text-cyan-200 font-medium">{expression.expression}</span>
            </div>
            {expression.description && (
              <div className="text-cyan-700 dark:text-cyan-300 text-xs mt-1">
                <TooltipMarkdown>{expression.description}</TooltipMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

async function TooltipCode({ meta }: { meta: TooltipMeta }) {
  if  ('code' in meta && meta.code) {
    const highlightedCode = await highlightCode(meta.code as string, 'python', undefined, false)
    return (
      <div className="text-sm">
        <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
          Code:
        </div>
        <pre className="text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
          <code className="line-numbers">{highlightedCode}</code>
        </pre>
      </div>
    )
   
  }
  return null;
}

export function renderTooltipContent(
  symbol: string,
  parent: string | undefined,
  TOOLTIP_CONTENT: Record<string, SymbolMetadata>,
  path?: string[]
): React.ReactNode {

  let meta: TooltipMeta | undefined;
  const trimmedSymbol = symbol.trim();

  // If this is a parameter, look up the parent and parameter info
  if (parent && TOOLTIP_CONTENT[parent]) {
    const parentMeta = TOOLTIP_CONTENT[parent];
    if (parentMeta && Array.isArray(parentMeta.parameters)) {
      const paramMeta = parentMeta.parameters.find((p: Parameter) => p.name === trimmedSymbol);
      if (paramMeta) {
        meta = { ...paramMeta, parent, path ,isParam: true};
      }
    }
    // If this is a variable, look up the parent and variable info
    if (!meta && parentMeta && Array.isArray(parentMeta.variables)) {
      const varMeta = parentMeta.variables.find((v: Variable) => v.name === trimmedSymbol);
      if (varMeta) {
        meta = { ...varMeta, parent, path, isVar: true };
      }
    }
    // If this is an expression, look up the parent and expression info
    if (!meta && parentMeta && Array.isArray(parentMeta.expressions)) {
      const exprMeta = parentMeta.expressions.find((e: Expression) => e.expression === trimmedSymbol);
      if (exprMeta) {
        meta = { ...exprMeta, parent, path, isExpr: true };
      }
    }
  }
  // If this is a top-level symbol (function/method/class), show full info
  if (!meta && TOOLTIP_CONTENT[trimmedSymbol]) {
    meta = TOOLTIP_CONTENT[trimmedSymbol];
  }
  
  // Try to find nested function with parent context
  if (!meta && parent) {
    // Try combinations with parent for nested functions
    const possibleKeys = [
      `${parent}.${trimmedSymbol}`,
      // Handle nested paths like DP.triangle.dp
      ...Object.keys(TOOLTIP_CONTENT).filter(key => 
        key.includes(parent) && key.endsWith(`.${trimmedSymbol}`)
      )
    ];
    
    for (const key of possibleKeys) {
      if (TOOLTIP_CONTENT[key]) {
        meta = TOOLTIP_CONTENT[key];
        break;
      }
    }
  }
  
  // Fallback: show symbol and parent with helpful debug info
  if (!meta) {
    if (parent) {
      const availableKeys = Object.keys(TOOLTIP_CONTENT).filter(key => 
        key.includes(parent) || key.includes(trimmedSymbol)
      ).slice(0, 3); // Show first 3 matches for debugging
      
      return (
        <div className="text-red-600">
          <div>Symbol <b>{trimmedSymbol}</b> not found in <b>{parent}</b> context.</div>
          {availableKeys.length > 0 && (
            <div className="text-xs mt-2 text-gray-500">
              Available: {availableKeys.join(', ')}
            </div>
          )}
        </div>
      );
    }
    return <div>No tooltip data for: <b>{trimmedSymbol}</b></div>;
  }

  // --- Only render the variable block for variables ---
  if ('isVar' in meta && meta.isVar) {
    return (
      <div className="min-w-[220px] max-w-[400px]">
        <TooltipVariables meta={meta} />
      </div>
    );
  }

  // --- Only render the expression block for expressions ---
  if ('isExpr' in meta && meta.isExpr) {
    return (
      <div className="min-w-[220px] max-w-[400px]">
        <TooltipExpressions meta={meta} />
      </div>
    );
  }

  return (
    <div className="min-w-[220px] max-w-[400px]">
      <TooltipHeader meta={meta} />
      <TooltipDescription meta={meta} />
      <TooltipParameters meta={meta} />
      <TooltipReturns meta={meta} />
      <TooltipVariables meta={meta} />
      <TooltipExpressions meta={meta} />
      <TooltipCode meta={meta} />
    </div>
  );
} 