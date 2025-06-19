import Callout from './callout';

const labelMap = {
  'note': 'note',
  'tip': 'info',
  'warning': 'warning',
  'error': 'error',
  'success': 'success',
  'info': 'info',
} as const;

import React from 'react';

export default function MDXBlockquote(props: { children: React.ReactNode }) {
  // If children is an array, check if the first is a label string
  const childrenArray = React.Children.toArray(props.children);
  if (childrenArray.length === 0) {
    return <blockquote className="border-l-4 border-teal-500/20 pl-4">{props.children}</blockquote>;
  }

  // Try to match the first child if it's a string
  const first = childrenArray[0];
  if (typeof first === 'string') {
    const match = first.match(/^(note|tip|warning|error|success|info):\s*/i);
    if (match) {
      const label = match[1].toLowerCase();
      const type = labelMap[label as keyof typeof labelMap] ?? 'note';
      // Remove the label from the first string
      const firstWithoutLabel = first.replace(/^(note|tip|warning|error|success|info):\s*/i, '');
      // Rebuild children, replacing the first string with the label-removed version
      const newChildren = [firstWithoutLabel, ...childrenArray.slice(1)];
      return <Callout type={type} title={label.charAt(0).toUpperCase() + label.slice(1)}>{newChildren}</Callout>;
    }
  }

  // Fallback: render as regular blockquote
  return <blockquote className="border-l-4 border-teal-500/20 pl-4">{props.children}</blockquote>;
}

