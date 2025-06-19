'use client';

import {
  useFloating,

  useHover,
  useFocus,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingPortal,
  autoUpdate,
} from '@floating-ui/react';
import {  useState } from 'react';

type TooltipProps = {
  word: string;
  content: string;
  step?: number;
  hasHighlight?: boolean;
  className?: string;
};

export default function ContentPopover({ word, content, step, hasHighlight, className }: TooltipProps) {

  // const arrowRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    // middleware: [offset(8), shift(), arrow({ element: arrowRef })],
    strategy: 'absolute',
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false, restMs: 60 });
  const click = useClick(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    focus,
    dismiss,
    role,
  ]);

  // Merge highlight and underline classes
  // const underlineClasses = `underline shadow-xl shadow-cyan-500/50 decoration-dotted dark:decoration-gray-500 decoration-gray-600 underline-offset-4 cursor-pointer`;
  const underlineClasses = `shadow-xl/35 shadow-cyan-500/50 cursor-pointer`;
  // const underlineClasses = `cursor-pointer`;
  const mergedClassName = className ? `${className} ${underlineClasses}` : underlineClasses;

  // Determine keyword color class based on step
  const getKeywordClass = () => {
    if (!step) return 'popover-keyword-default';
    return `popover-keyword-step-${step}`;
  };

  // Generate popover classes based on step and highlight status
  const getPopoverClasses = () => {
    const baseClasses = [
      // Accessible, modern popover styles:
      'border border-gray-200 dark:border-zinc-700',
      'shadow-lg',
      'rounded-xl',
      'px-5 py-4',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
      'transition-all duration-150 ease-in-out',
      'text-base',
      'text-gray-900 dark:text-gray-100',
      'max-w-md',
      'animate-fade-in',
      'z-50',
    ];
    if (hasHighlight && step !== undefined) {
      baseClasses.unshift(`tooltip-step-${step}`);
    } else {
      baseClasses.unshift('popover-default-bg');
    }
    return baseClasses.join(' ');
  };

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={mergedClassName}
        tabIndex={0}
        aria-describedby={`popover-${word}`}
      >
        {word}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            id={`popover-${word}`}
            role="tooltip"
            aria-live="polite"
            className={getPopoverClasses()}
          >
            <div className={`font-bold text-lg mb-1 ${getKeywordClass()}`}>{word}</div>
            <div className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">{content}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
