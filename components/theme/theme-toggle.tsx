"use client"

import React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "../ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (

            <Button variant="ghost" onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                console.log(theme);

            }}
                className="  place-items-center p-2 rounded-md hover:scale-101 transition-all duration-300 cursor-pointer  hover:bg-accent"
            >
                <MoonIcon className="w-4 h-4 block dark:hidden  " />
                <SunIcon className="w-4 h-4 hidden dark:block" />


            </Button>



    )
}