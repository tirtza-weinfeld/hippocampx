"use client"
import { Activity } from "react";
import { useProblemCardContext } from "./problem-context";
import { useProblemCardId } from "./problem";
// import { ProblemCardDialog } from "./callout-dialog";

export function ProblemCardContent({ children }: {
    children: React.ReactNode;
}) {
    const id = useProblemCardId()
    const { isExpanded } = useProblemCardContext()
    const expanded = isExpanded(id)

    return (
        <Activity mode={expanded ? "visible" : "hidden"}>
            {children}
        </Activity>
    )
}
