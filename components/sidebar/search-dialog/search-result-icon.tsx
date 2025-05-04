import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResultIconProps {
  icon: LucideIcon
  color: string
  bgColor: string
}

export function SearchResultIcon({ icon: Icon, color, bgColor }: SearchResultIconProps) {
  return (
    <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", bgColor)}>
      <Icon className={cn("h-4 w-4", color)} />
    </div>
  )
}
