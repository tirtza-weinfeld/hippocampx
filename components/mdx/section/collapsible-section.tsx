"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState, Activity } from "react"

export function CollapsibleSection({ children }: { children: React.ReactNode }) {
    const [header, content, expand] = children as [React.ReactNode, React.ReactNode, string | undefined]
    const [expanded, setExpanded] = useState(expand ?? false)

    return (
        <div>
            <div className='relative w-fit'>
                <button
                    className="absolute top-2 -right-12 rounded-full p-2 transition-all duration-200
                     hover:scale-110 hover:bg-teal-500/10 active:scale-95"
                    onClick={() => setExpanded(!expanded)}
                    aria-label={expanded ? "Collapse section" : "Expand section"}
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-300 ease-out",
                            expanded ? 'rotate-180' : ''
                        )}
                    />
                </button>
                {header}
            </div>
            <Activity mode={expanded ? 'visible' : 'hidden'}>
                {content}
            </Activity>
        </div>
    )
}


// export function Section({ header, content }: { header: JSX.Element, content: JSX.Element }) {
//     const [expanded, setExpanded] = useState(false)
//     return (
//         <div>
//             <div className='relative flex items-center gap-2 w-fit'>
//                 <button className="absolute top-0 -right-12 rounded-full bg-background p-1" onClick={() => setExpanded(!expanded)}><ChevronDown /></button>
//                 {header}
//             </div>
//             <Activity mode={expanded ? 'visible' : 'hidden'}>
//                 {content}
//             </Activity>
//         </div>
//     )
// }