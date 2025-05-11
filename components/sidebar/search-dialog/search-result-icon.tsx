import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResultIconProps {
  icon: LucideIcon
  color: string
  bgColor: string
}

export function SearchResultIcon({ icon: Icon, color, bgColor }: SearchResultIconProps) {
  return (
    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", bgColor)}>
      <Icon className={cn("h-4.5 w-4.5", color)} />
    </div>
  )
}
