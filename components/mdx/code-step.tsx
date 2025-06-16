import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CodeStep({ children, step }: { children: ReactNode; step: number }) {
    return (
        <span
            data-step={step}
            className={cn(
                'code-step relative rounded px-[6px] py-[1.5px] border-b-[2px] border-opacity-60',
                {
                    'bg-blue-400/10 dark:bg-blue-400/20 border-blue-400 text-blue-600 dark:text-blue-300':
                        step === 1,
                    'bg-yellow-400/10 dark:bg-yellow-400/20 border-yellow-400 text-yellow-600 dark:text-yellow-300':
                        step === 2,
                    'bg-purple-400/10 dark:bg-purple-400/20 border-purple-400 text-purple-600 dark:text-purple-300':
                        step === 3,
                    'bg-green-400/10 dark:bg-green-400/20 border-green-400 text-green-600 dark:text-green-300':
                        step === 4,
                }
            )}>
            {children}
        </span>
    );
}