"use client"

import type { ElementType } from "react"
import type { Route } from "next"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { NavigationItem } from "@/lib/routes"
import { getIsActive } from "./nav-item-utils"

type NavItemExpandedProps = {
  readonly item: NavigationItem
  readonly pathname: string
  readonly onNavigate: (href: string, parentHref?: string) => void
  readonly isOpen: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly registerRef: (href: string, el: HTMLElement | null) => void
}

function ActiveIndicator() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-linear-to-b from-primary via-indigo-400 to-accent rounded-r-sm" />
  )
}

export function NavItemExpanded({
  item,
  pathname,
  onNavigate,
  isOpen,
  onOpenChange,
  registerRef,
}: NavItemExpandedProps) {
  const isActive = getIsActive(pathname, item)
  const Icon = item.icon

  return (
    <div className="space-y-1 relative">
      {isActive && <ActiveIndicator />}

      {item.children ? (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-lg text-sm font-medium h-10 px-3",
            "transition-colors transition-transform hover:translate-x-1 hover:bg-primary/10",
            isActive && "bg-primary/10",
          )}
          onClick={() => onOpenChange(!isOpen)}
        >
          <div className="flex size-8 items-center justify-center">
            <Icon className={cn("size-5", isActive ? "text-primary" : item.color)} />
          </div>
          <span className="animate-fade-in animate-slide-in-from-left duration-200 truncate">{item.title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="ml-auto"
          >
            <ChevronDown className="size-4" />
          </motion.div>
        </Button>
      ) : (
        <Link
          href={item.href as Route}
          className={cn(
            "flex w-full justify-start gap-3 rounded-lg text-sm font-medium h-10 px-3 items-center",
            "transition-colors transition-transform hover:translate-x-1 hover:bg-primary/10",
            isActive && "bg-primary/10",
          )}
        >
          <div className="flex size-8 items-center justify-center">
            <Icon className={cn("size-5", isActive ? "text-primary" : item.color)} />
          </div>
          <span className="animate-fade-in animate-slide-in-from-left duration-200 truncate">{item.title}</span>
        </Link>
      )}

      <AnimatePresence>
        {isOpen && item.children && (
          <motion.div
            className="ml-10 space-y-1"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                },
                opacity: { duration: 0.2 },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <ul className="space-y-1">
              {item.children.map((child: { title: string; href: string; icon?: ElementType }) => (
                <li
                  key={child.title}
                  ref={(el) => registerRef(child.href, el)}
                >
                  <Link
                    href={child.href as Route}
                    className={cn(
                      "flex rounded-lg px-3 mr-1 py-2 text-sm transition-colors transition-transform hover:translate-x-1",
                      pathname === child.href
                        ? "bg-primary/15 text-primary font-medium"
                        : "hover:bg-muted/50",
                    )}
                    onClick={() => onNavigate(child.href, item.href)}
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
