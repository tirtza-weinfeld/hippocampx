

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue }
    from "@/components/ui/select";
import { MinusIcon, PlusIcon, ToggleLeft, } from "lucide-react";
import React from "react";
import FlashcardControl from "./flashcard-control";

export default function FlashcardsControls({ showAll, textDelta, setTextDelta,
    categories, setCategory,

    onShowAll}: {
        showAll: boolean,
        textDelta: number,
        setTextDelta: (textDelta: number) => void,
        categories: { [name: string]: string },
        setCategory: (category: string) => void,
        length: number,
        selectedIndex: number,
        onIndexChange: (index: number) => void,
        onShowAll: () => void
    }) {
    return (

        <div className=" h-12  absolute top-0 right-0   flex flex-row-reverse gap-1 w-full m-5 overflow-scroll 

        *:h-10
        *:m-1
        
        
        

                    
        
        ">

            <FlashcardControl
                className={` 
                       ${showAll ? ' [&>svg]:rotate-180      [&>svg>circle]:fill-accent  [&>svg]:stroke-accent' : ''}

                     transition-all
                     ease-in-out
                     duration-500
                  `}

                onClick={onShowAll}>
                <ToggleLeft className="w-4 h-4   " />
            </FlashcardControl>


            <FlashcardControl
                onClick={() => {
                    setTextDelta(textDelta - 1)
                }}
            >
                <MinusIcon className="w-4 h-4  " />
            </FlashcardControl>

            <FlashcardControl
                onClick={() => {
                    setTextDelta(textDelta + 1)
                }}
            >
                <PlusIcon className="w-4 h-4  " />

            </FlashcardControl>



            <Select





                onValueChange={(value: string) => {
                    setCategory(value)
                }}

            >

                <SelectTrigger className={` 
                w-[12rem] text-center bg-accent/20  rounded-3xl border-none   h-10 m-1
          
                
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
                            className="h-12 p-1 "
                            value={"all"}

                        >
                            <div >
                                <span>all</span>
                            </div>
                        </SelectItem>
                        {

                            Object.keys(categories).map((category) =>
                                <SelectItem

                                    className="h-12"
                                    key={category}
                                    value={category}

                                >{category}
                                </SelectItem>
                            )
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>


         
        </div>


    )
}