"use client"

import React from "react";
import { usePathname } from "next/navigation";

export function CustomTheme({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const theme = (pathname.includes("hadestown")) ? "hadestown" : "";


    return (
        <div className={theme}>
            {children}
        </div>
    )
}