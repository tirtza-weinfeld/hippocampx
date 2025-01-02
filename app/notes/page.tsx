
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Notes',
};

export default function Notes() {
    return <div className="min-h-svh grid grid-rows-5   grid-cols-5 gap-4 grid-flow-row place-items-center w-full ">

        <h2 className="text-5xl font-bold p-4 m-4 text-accent  col-span-5  
            hover:text-accent/50 hover:animate-spin transition-all
             hover:translate-y-20 hover:translate-x-10 hover:rotate-45 hover:scale-150 duration-1000 cursor-pointer peer">
            NOTES

        </h2>
        <div className=" w-10 h-10 bg-accent rounded-full animate-pulse transition-all duration-1000 hidden peer-hover:block"></div>
        <div className="w-10 h-10 bg-primary/20 rounded-full animate-pulse transition-all duration-1000 hidden peer-hover:block "></div>
        <div className="col-span-5 row-span-4 hidden peer-hover:block  ">


            <div className=" rotate-45 w-200 h-20 bg-primary/20 rounded-full animate-pulse transition-all duration-1000 "></div>
        </div>
        <div className="col-span-5 row-span-4 hidden peer-hover:block  ">

            <div className="col-span-5 row-span-4  w-200 h-20 bg-primary/20 rounded-full animate-pulse transition-all duration-1000  "></div>

            <div className=" rotate-45 w-200 h-20 bg-accent rounded-full animate-pulse transition-all duration-1000 "></div>
        </div>



    </div>;
}   
