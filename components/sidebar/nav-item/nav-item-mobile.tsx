"use client"

import type { ElementType } from "react"
import type { Route } from "next"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import type { NavigationItem } from "@/lib/routes"
import { getIsActive } from "./nav-item-utils"

type NavItemMobileProps = {
  readonly item: NavigationItem
  readonly pathname: string
  readonly onNavigate: (href: string, parentHref?: string) => void
  readonly isOpen: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly registerRef: (href: string, el: HTMLElement | null) => void
}

export function NavItemMobileWithChildren({
  item,
  pathname,
  onNavigate,
  isOpen,
  onOpenChange,
  registerRef,
}: NavItemMobileProps) {
  const isActive = getIsActive(pathname, item)
  const Icon = item.icon

  return (
    <>
      <button
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/50",
        )}
        onClick={() => onOpenChange(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`submenu-${item.href.replace(/\//g, "-")}`}
      >
        <div className="flex items-center gap-3">
          <div className={cn("flex size-8 items-center justify-center rounded-md", item.bgColor)}>
            <Icon className={cn("size-5", isActive ? "text-primary" : item.color)} />
          </div>
          <span>{item.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <ChevronDown className="size-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={`submenu-${item.href.replace(/\//g, "-")}`}
            className="mt-1 ml-10 space-y-1"
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
            {item.children?.map((child: { title: string; href: string; icon?: ElementType }) => (
              <li
                key={child.title}
                ref={(el) => registerRef(child.href, el)}
              >
                <Link
                  href={child.href as Route}
                  className={cn(
                    "flex rounded-lg px-3 py-2 text-sm transition-colors transition-transform duration-200",
                    pathname === child.href
                      ? "bg-primary/15 text-primary font-medium"
                      : "hover:bg-muted/50 hover:translate-x-1",
                  )}
                  onClick={() => onNavigate(child.href, item.href)}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  )
}

export function NavItemMobileSimple({
  item,
  pathname,
  onNavigate,
}: Omit<NavItemMobileProps, "isOpen" | "onOpenChange" | "registerRef">) {
  const isActive = getIsActive(pathname, item)
  const Icon = item.icon

  return (
    <Link
      href={item.href as Route}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
        isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/50",
      )}
      onClick={() => onNavigate(item.href)}
    >
      <div className={cn("flex size-8 items-center justify-center rounded-md", item.bgColor)}>
        <Icon className={cn("size-5", isActive ? "text-primary" : item.color)} />
      </div>
      <span>{item.title}</span>
    </Link>
  )
}
