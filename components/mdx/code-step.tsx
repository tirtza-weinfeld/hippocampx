import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CodeStep({ children, step }: { children: ReactNode; step: number }) {
    return (
        <span
            data-step={step}
            className={cn(
                'code-step relative rounded px-[6px] py-[1.5px] border-b-[2px] border-opacity-60',
                "data-[step=1]:bg-blue-400/10 data-[step=1]:dark:bg-blue-400/20 data-[step=1]:border-blue-400 data-[step=1]:text-blue-600 data-[step=1]:dark:text-blue-300",
                "data-[step=2]:bg-yellow-400/10 data-[step=2]:dark:bg-yellow-400/20 data-[step=2]:border-yellow-400 data-[step=2]:text-yellow-600 data-[step=2]:dark:text-yellow-300",
                "data-[step=3]:bg-purple-400/10 data-[step=3]:dark:bg-purple-400/20 data-[step=3]:border-purple-400 data-[step=3]:text-purple-600 data-[step=3]:dark:text-purple-300",
                "data-[step=4]:bg-green-400/10 data-[step=4]:dark:bg-green-400/20 data-[step=4]:border-green-400 data-[step=4]:text-green-600 data-[step=4]:dark:text-green-300",
                // {
                //     'bg-blue-400/30 dark:bg-blue-400/20 border-blue-400 text-blue-600 dark:text-blue-300':
                //         step === 1,
                //     'bg-yellow-400/30 dark:bg-yellow-400/20 border-yellow-400 text-yellow-600 dark:text-yellow-300':
                //         step === 2,
                //     'bg-purple-400/30 dark:bg-purple-400/20 border-purple-400 text-purple-600 dark:text-purple-300':
                //         step === 3,
                //     'bg-green-400/30 dark:bg-green-400/20 border-green-400 text-green-600 dark:text-green-300':
                //         step === 4,
                // }
            )}>
            {children}
        </span>
    );
}