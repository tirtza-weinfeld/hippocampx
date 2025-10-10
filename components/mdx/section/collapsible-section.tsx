"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState, Activity,  } from "react"



export function CollapsibleSection({ children }: { children: React.ReactNode }) {
    const [header, content, expand] = children as [React.ReactNode, React.ReactNode, string | undefined]
    const [expanded, setExpanded] = useState(expand ?? false)
    return (
        <>
        {/* <div className="relative w-fit border-2 border-gray-200  bg-teal-500/10 rounded-lg p-2 my-2"> */}
            <div className='relative w-fit ' >
                <button className="absolute top-2 -right-12 rounded-full bg-background/80 p-1
                hover:bg-background/80
                " onClick={() => setExpanded(!expanded)}><ChevronDown className={cn(expanded ? 'rotate-180' : '')} /></button>
                {header}
            </div>
            <Activity mode={expanded ? 'visible' : 'hidden'}>
                {content}
            </Activity>
        {/* </div> */}
        </>
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