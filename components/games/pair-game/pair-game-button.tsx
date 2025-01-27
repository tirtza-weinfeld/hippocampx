"use client"
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> 
& { children: React.ReactNode, className?: string, selected?: boolean, status?: "correct" | "incorrect" | null,
    };

export function PairGameButton({ children, className, selected, status, ...props }: ButtonProps) {


    return <button {...props}

        className={`
        text-white
        text-sm
        w-full
        transition-all
        hover:scale-101
        hover:bg-accent/80
        bg-accent
        ease-in-out
        duration-500
        text-start
        cursor-pointer
        disabled:pointer-events-none
        disabled:opacity-80
        rounded-lg py-1 m-1 px-2
         ${selected ? "bg-accent/50 text-accent-foreground shadow-lg" : ""}
         ${status === null ? "" : status === "correct" ? "animate-correct" : "animate-incorrect"}
         ${className}

         
         `}
    >{children}

    </button>
        }
