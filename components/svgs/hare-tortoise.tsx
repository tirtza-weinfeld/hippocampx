import type { SVGProps } from 'react';

/**
 * HareAndTortoise - React 19.3
 * Floyd's Cycle-Finding visualized with animal shapes.
 * Uses native ref-as-prop support.
 */
export function HareTortoise({
  size = 48,
  color = "currentColor",
  ref,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) {
  // The algorithm's loop path
  const loopPath = "M 7,12 A 5,5 0 1 1 7,13 Z";

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Linked List structure */}
      <path d="M2 12h5" opacity="0.3" />
      <circle cx="12" cy="12" r="5" strokeDasharray="1 2" opacity="0.2" />

      {/* Tortoise (Slow Pointer - 1x speed) */}
      <g>
        <animateMotion path={loopPath} dur="6s" repeatCount="indefinite" />
        {/* Tortoise Shell & Head */}
        <path d="M-1.5 0.5 a 1.5 1 0 0 1 3 0" fill={color} />
        <circle cx="1.8" cy="0.4" r="0.4" fill={color} stroke="none" />
        <path d="M-1.2 0.8 l -0.3 0.4 M 1.2 0.8 l 0.3 0.4" strokeWidth="0.5" />
      </g>

      {/* Hare (Fast Pointer - 2x speed) */}
      <g>
        <animateMotion path={loopPath} dur="3s" repeatCount="indefinite" />
        {/* Hare Body & Long Ears */}
        <ellipse cx="0" cy="0" rx="1.6" ry="0.7" fill={color} />
        <path d="M 0.5 -0.4 c 0.5 -1.5 1 -1.5 1 0" stroke={color} strokeWidth="0.6" fill="none" />
        <path d="M 0.8 -0.3 c 0.5 -1.2 0.8 -1.2 0.8 0" stroke={color} strokeWidth="0.6" fill="none" />
        <circle cx="1.4" cy="0.1" r="0.3" fill="white" stroke="none" />
      </g>
    </svg>
  );
}
