'use client';

import {
  useFloating,
  offset,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingPortal,
  autoUpdate,
} from '@floating-ui/react';
import { useRef, useState } from 'react';

type TooltipProps = {
  word: string;
  content: string;
};

export default function HoverPopover({ word, content }: TooltipProps) {
  const arrowRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), shift(), arrow({ element: arrowRef })],
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

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="underline decoration-[0.1em] decoration-neutral-300 underline-offset-2 transition-colors hover:decoration-blue-400"
      >
        {word}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 max-w-xs rounded-xl bg-white text-black px-4 py-3 shadow-2xl border border-neutral-200 animate-fade-in"
          >
            <div className="font-semibold text-sm text-neutral-800">{word}</div>
            <div className="text-xs text-neutral-600 mt-1">{content}</div>
            <div
              ref={arrowRef}
              className="absolute h-2 w-2 rotate-45 bg-white border-l border-t border-neutral-300"
              style={{
                left: middlewareData.arrow?.x,
                top: middlewareData.arrow?.y,
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
