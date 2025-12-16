import type { NavigationItem } from "@/lib/routes"

export function getIsActive(pathname: string, item: NavigationItem): boolean {
  if (pathname === item.href) return true

  if (item.children) {
    if (item.href === "/" && pathname.startsWith("/dashboard")) return true
    if (pathname.startsWith(item.href + "/")) return true
    return item.children.some((child) => pathname === child.href)
  }

  return false
}
