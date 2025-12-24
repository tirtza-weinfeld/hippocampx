import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`
        px-4 py-3 rounded-xl font-medium
        bg-grad-interactive
        hover:bg-grad-interactive-hovered
        active:bg-grad-interactive-pressed
        disabled:bg-grad-disabled

        shadow-md shadow-black/10
        hover:shadow-lg hover:shadow-black/15
        active:shadow-sm active:shadow-black/5
        disabled:shadow-none

        hover:scale-[1.02]
        active:scale-[0.98]

        transition-all duration-150
        disabled:cursor-not-allowed

        ${className}`}

      {...props}
    >
      <span 
      className={`
        text-grad-on-interactive
        in-disabled:text-grad-on-disabled
        `}>{children}</span>
    </button>
  );
}
