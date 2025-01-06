"use client"
import React from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
export function AppHeader() {
    const { isMobile, state } = useSidebar();



    return (
        <header className={` z-10 fixed top-0 left-0 right-0 h-12 bg-sidebar bg-red-500`}>
            <div className={`relative h-full  
             ${!isMobile ? state === "collapsed" ? "ml-[4rem]  mr-2  " : "ml-[16rem] mr-2 " : " "} 
            ${isMobile ? 'mt-0' : 'mt-2 rounded-t-xl '} bg-background transition-all duration-200 ease-linear
`
            }
            >





                {isMobile && (
                    <div className="flex place-items-center justify-content-center h-full w-full gap-2 p-2">
                        <SidebarTrigger />
                    </div>
                )}



            </div>
        </header>
    )
}