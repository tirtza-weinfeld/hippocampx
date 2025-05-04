"use client"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { routes } from "@/lib/routes";
import { usePathname } from "next/navigation";

export function AppSidebar({ variant, collapsible, className, side }: {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  className?: string
}) {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();


  return (
    <Sidebar
      variant={variant}
      collapsible={collapsible}
      className={`${className} `}
      side={side}
    >
      <SidebarHeader >
        <SidebarTrigger />

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>HippoCampX</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.href === pathname}>
                    <Link href={item.href} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}

