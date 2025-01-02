"use client"
import React from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
export function AppHeader() {
    const { isMobile } = useSidebar();

    return (
        <header className="border-b border-gray-200 dark:border-gray-800 h-12 p-1">
            {isMobile && (
                <div className="flex ">
                    <SidebarTrigger />
                </div>
            )}

        </header>
    )
}