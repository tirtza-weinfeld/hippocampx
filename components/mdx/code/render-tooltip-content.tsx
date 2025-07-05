import React from 'react';
import type { SymbolMetadata, Parameter } from '@/lib/types';
import highlightCode from './code-highlighter';
import InlineCode from './code-inline';

interface ParameterTooltip extends Parameter {
  type: string;
  parent: string;
  path?: string[];
  isParam?: boolean;
}
type TooltipMeta = SymbolMetadata | ParameterTooltip;

function TooltipHeader({ meta }: { meta: TooltipMeta }) {
  if ('isParam' in meta && meta.isParam) {
    const paramType = typeof (meta as Parameter).type === 'string' && (meta as Parameter).type ? (meta as Parameter).type : 'unknown';
    return (
      <div className="text-sm mb-1 flex ">
        <InlineCode>{`[python:] (parameter) ${meta.name}:${paramType}`}</InlineCode>
      </div>
    );
  }
  // Function/class style as before
  const displayName = 'path' in meta && Array.isArray(meta.path) && meta.path.length > 0 
    ? [...meta.path, meta.name].join('.') 
    : 'parent' in meta && meta.parent 
      ? `${meta.parent}.${meta.name}` 
      : meta.name;
  return (
    <div className="font-bold text-base mb-1">
      {displayName}
    </div>
  );
}

// function TooltipType({ meta }: { meta: TooltipMeta }) {
//   return !('type' in meta && meta.type === 'parameter') && meta.type ? (
//     <div className="text-xs text-blue-700 mb-1 bg-blue-500">{meta.type}</div>
//   ) : null;
// }

function TooltipSignature({ meta }: { meta: TooltipMeta }) {
  return 'signature' in meta && meta.signature ? (
    <div className="font-mono text-xs mb-1">{meta.signature}</div>
  ) : null;
}

function TooltipDescription({ meta }: { meta: TooltipMeta }) {
  // VS Code style for parameter
  if ('type' in meta && meta.type === 'parameter') {
    const desc = typeof meta.description === 'string' && meta.description ? meta.description : 'No description.';
    return (
      <div className="font-mono text-xs mb-1 bg-green-500 ">{meta.name}: {desc}</div>
    );
  }
  // Function/class style as before
  return 'description' in meta && meta.description ? (
    <div className="text-xs mb-1 ">
      <span className="text-blue-700 dark:text-blue-300  text-sm mr-1">{meta.name}:</span> 
      {meta.description}</div>
  ) : null;
}

function TooltipParameters({ meta }: { meta: TooltipMeta }) {
  return 'parameters' in meta && Array.isArray(meta.parameters) && meta.parameters.length > 0 ? (
    <div className="text-xs mb-1">
      <div className="font-semibold">Parameters:</div>
      <ul className="ml-4">
        {meta.parameters.map((param, idx) => (
          <li key={param.name || idx}>
            <span className="font-mono">{param.name}</span>
            {param.type && <span className="text-gray-500"> : {param.type}</span>}
            {param.description && <span className="text-gray-600"> — {param.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}

function TooltipReturns({ meta }: { meta: TooltipMeta }) {
  return 'return_type' in meta && meta.return_type ? (
    <div className="text-xs mb-1">
      <span className="text-gray-500">Returns: </span>
      <span className="font-mono text-green-700">{meta.return_type}</span>
      {'return_description' in meta && meta.return_description && <span className="text-gray-600"> — {meta.return_description}</span>}
    </div>
  ) : null;
}

async function TooltipCode({ meta }: { meta: TooltipMeta }) {
  if  ('code' in meta && meta.code) {
    const highlightedCode = await highlightCode(meta.code as string, 'python', undefined, false)
    return (
      <pre className=" text-xs p-2 rounded mt-2 overflow-x-auto">
        <code className="line-numbers">{highlightedCode}</code>
      </pre>
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
  }
  // If this is a top-level symbol (function/method/class), show full info
  if (!meta && TOOLTIP_CONTENT[trimmedSymbol]) {
    meta = TOOLTIP_CONTENT[trimmedSymbol];
  }
  // Fallback: show symbol and parent
  if (!meta) {
    if (parent) {
      return <div className="text-red-600">Parameter <b>{symbol}</b> not found in <b>{parent}</b> context.</div>;
    }
    return <div>{symbol}</div>;
  }
  return (
    <div className="min-w-[220px] max-w-[400px]">
      <TooltipHeader meta={meta} />
      {/* <TooltipType meta={meta} /> */}
      <TooltipSignature meta={meta} />
      <TooltipDescription meta={meta} />
      <TooltipParameters meta={meta} />
      <TooltipReturns meta={meta} />
      <TooltipCode meta={meta} />
    </div>
  );
} 