

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue }
    from "@/components/ui/select";
import React from "react";
import LearningSearch from "./learning-search";
import LearnControl from "./learn-control";
import { Menu, ToggleLeft } from "lucide-react";
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { SheetContent } from "../ui/sheet";

export default function LearnControls({ categories, setCategory, setSearch, defineAll, setDefineAll }:
    { categories: { [name: string]: string }, setCategory: (category: string) => void, setSearch: (search: string) => void, defineAll: boolean, setDefineAll: (defineAll: boolean) => void }) {


    return (
        <>

            <div className="hidden @md:flex  z-10 fixed top-3  right-4 h-12 bg-background  items-center gap-2">
                <LearnControlsContent defineAll={defineAll} setDefineAll={setDefineAll} setSearch={setSearch} setCategory={setCategory} categories={categories} />
            </div>

            <div className="block @md:hidden absolute top-3 right-4 z-10">

                <Sheet  >
                    <SheetTrigger><Menu /></SheetTrigger>
                    <SheetContent side="bottom" className="flex flex-col p-4 gap-4  [&>*]:w-full ">
                        <SheetHeader>
                            <SheetTitle>toggle definitions, search and filter</SheetTitle>
                            {/* <SheetDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </SheetDescription> */}
                        </SheetHeader>


                        <LearnControlsContent 
                        
                        defineAll={defineAll} setDefineAll={setDefineAll} setSearch={setSearch} setCategory={setCategory} categories={categories} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
    }







export function LearnControlsContent({ defineAll, setDefineAll, setSearch, setCategory, categories }: { defineAll: boolean, setDefineAll: (defineAll: boolean) => void, setSearch: (search: string) => void, setCategory: (category: string) => void, categories: { [name: string]: string } }) {
    return (
        // <div className="hidden @md:flex  z-10 fixed top-3  right-4 h-12 bg-background  items-center gap-2">
        <>
            <LearnControl
                className={` 
           ${defineAll ? ' [&>svg]:rotate-180      [&>svg>circle]:fill-accent  [&>svg]:stroke-accent' : ''}

         transition-all
         ease-in-out
         duration-500
      `}

                onClick={() => setDefineAll(!defineAll)}>
                <ToggleLeft className="w-4 h-4   " />
            </LearnControl>
            <LearningSearch setSearch={setSearch} />

            <Select

                onValueChange={(value: string) => {
                    setCategory(value)
                }}

            >

                <SelectTrigger className={` 
    w-[12rem] text-center bg-accent/20  rounded-3xl border-none    m-1

    
        `}>
                    <SelectValue
                        placeholder="Select a Category"
                    />

                </SelectTrigger>
                <SelectContent className="
        
    
        [&,*]:rounded-3xl
        [&,*]:border-none
      


        " >
                    <SelectGroup >
                        <SelectItem
                            className=" p-1 "
                            value={"all"}

                        >
                            <div >
                                <span>all</span>
                            </div>
                        </SelectItem>
                        {

                            Object.keys(categories).map((category) =>
                                <SelectItem

                                    className=""
                                    key={category}
                                    value={category}

                                >{category}
                                </SelectItem>
                            )
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}
