import { cn } from "@/lib/utils";
import { ProblemCardToggleButton } from "./toggle-button";

/**
 * Server-rendered header for problem cards.
 * Renders immediately with no hydration delay.
 */
export function ProblemCardHeader({ children, className, id }: {
    children: React.ReactNode;
    className?: string;
    id: string;
}) {
    return (
        <h2 id={id} className="relative flex ">
            <a
                href={`#${id}`}
                className={cn("px-4 pt-3 flex-1 anchor",
                "[&_*]:bg-gradient-to-r [&_*]:hover:bg-gradient-to-l [&_*]:from-sky-500 [&_*]:to-blue-500 [&_*]:via-rose-500",
                "[&_*]:dark:from-sky-900 [&_*]:dark:to-blue-900 [&_*]:dark:via-red-900",
                "[&_*]:bg-clip-text [&_*]:text-transparent",
                "[&_*]:mb-1",
                "[&_*]:tracking-tight",
                "[&_*]:font-semibold",
                "[&_*]:leading-tight",
                
                className
            )}>
                {children}
            </a>
            <ProblemCardToggleButton id={id} />
        </h2>
    )
}
