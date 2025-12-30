"use client"

import { useState, type ElementType } from "react"
import type { Route } from "next"
import Link from "next/link"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { NavigationItem } from "@/lib/routes"
import { getIsActive } from "./nav-item-utils"

type NavItemCollapsedProps = {
  readonly item: NavigationItem
  readonly pathname: string
  readonly registerRef: (href: string, el: HTMLElement | null) => void
}

function ActiveIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: 1,
        height: "70%",
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }}
      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-linear-to-b from-teal-500 to-black-500 rounded-r-sm"
    />
  )
}

export function NavItemCollapsedWithChildren({ item, pathname, registerRef }: NavItemCollapsedProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const isActive = getIsActive(pathname, item)
  const Icon = item.icon

  return (
    <>
      {isActive && <ActiveIndicator />}

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-10 justify-center rounded-lg transition-colors hover:bg-primary/10",
                  isActive && "bg-primary/10",
                )}
                aria-label={item.title}
              >
                <div className="flex size-8 items-center justify-center">
                  <Icon className={cn("size-5", isActive ? "text-primary" : item.color)} />
                </div>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
        <PopoverContent
          side="right"
          className="w-56 p-0 bg-background border-none shadow-sky-400/30 shadow-lg rounded-lg max-h-[80vh]"
          align="start"
          alignOffset={-5}
          sideOffset={12}
        >
          <motion.div
            className="flex flex-col max-h-[80vh]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
              },
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium border-b border-sky-400/20 pb-2 mb-1 flex-shrink-0">
              <Icon className={cn("size-4", item.color)} />
              <span className="bg-linear-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                {item.title}
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto p-3 flex-1">
              {item.children?.map((child: { title: string; href: string; icon?: ElementType }) => (
                <div key={child.title}>
                  <Link
                    ref={(el) => registerRef(child.href, el)}
                    href={child.href as Route}
                    className={cn(
                      "flex w-full justify-start px-3 py-2 text-sm rounded-lg transition-colors items-center",
                      pathname === child.href
                        ? "bg-primary/20 text-primary font-medium"
                        : "hover:bg-primary/10",
                    )}
                    onClick={() => setPopoverOpen(false)}
                    data-href={child.href}
                  >
                    {child.title}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export function NavItemCollapsedSimple({ item, pathname }: Omit<NavItemCollapsedProps, "registerRef">) {
  const isActive = getIsActive(pathname, item)
  const Icon = item.icon

  return (
    <>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-linear-to-b from-teal-500 to-blue-500 rounded-r-sm" />
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href as Route}
            className={cn(
              "flex size-10 justify-center rounded-lg transition-colors items-center hover:bg-primary/10",
              isActive && "bg-primary/10",
            )}
            aria-label={item.title}
          >
            <div className="flex size-8 items-center justify-center">
              <Icon className={cn("size-5", isActive ? "text-primary" : item.color)} />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    </>
  )
}
