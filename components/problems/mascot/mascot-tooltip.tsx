// "use client"

// import { Star, Clock } from "lucide-react"
// import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"

// interface MascotTooltipProps {
//   content: {
//     title: string
//     subtitle: string
//     specialty: string
//     era: string
//   }
//   gradient: string
//   children: React.ReactNode
//   delayDuration?: number
// }

// export function MascotTooltip({
//   content,
//   gradient,
//   children,
//   delayDuration = 500
// }: MascotTooltipProps) {
//   return (
//     <Tooltip delayDuration={delayDuration}>
//       <TooltipTrigger asChild>
//         {children}
//       </TooltipTrigger>
//       <TooltipContent
//         side="top"
//         sideOffset={8}
//         className={cn(
//           "max-w-xs p-0 border-0 shadow-2xl",
//           `bg-linear-to-br ${gradient}`
//         )}
//       >
//         <div className="px-4 py-3 text-white space-y-2">
//           <div className="font-semibold text-sm leading-tight">{content.title}</div>
//           <div className="text-xs opacity-90 leading-tight">{content.subtitle}</div>
//           <div className="flex items-center gap-2 pt-1">
//             <Star className="w-3 h-3 opacity-75" />
//             <span className="text-xs font-medium opacity-90">{content.specialty}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock className="w-3 h-3 opacity-75" />
//             <span className="text-xs opacity-75 font-mono">{content.era}</span>
//           </div>
//         </div>
//       </TooltipContent>
//     </Tooltip>
//   )
// }