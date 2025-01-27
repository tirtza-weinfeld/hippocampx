
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Notes',
};

export default function Notes() {
    return <div className="min-h-svh @container/notes flex flex-col gap-4 w-full ">

        <h2 className="text-5xl   w-fit h-fit
             hover:bg-gradient-to-r/oklch hover:from-teal-400 hover:to-primary
            hover:animate-pulse
            
            font-extrabold  bg-linear-to-r/oklch  from-primary to-accent
             bg-clip-text 
            text-transparent 
            transition-all duration-1000  ease-in-out
            p-4
        ">
            NOTES

        </h2>
        <div className="grid grid-flow-col   gap-4  ">
 
        </div>
     



    </div>;
}   
