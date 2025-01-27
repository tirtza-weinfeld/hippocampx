"use client"


import React, { useRef, useState } from "react";
import { Term } from "@/lib/db/schema";
import { MaximizeIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FLASHCARD_CONTROL_CLASSES } from "./flashcard-control";
import { cn } from "@/lib/utils";



export default function FlashcardsList({
    terms, initialFocusedCardID,
    showAll,
    onCarouselView,
    definitionsState,
    onCardChange,
    onCardClick }: {
        terms: Term[],
        initialFocusedCardID: string | undefined,
        showAll: boolean,
        onCarouselView: (cardId: string) => void,
        definitionsState: { [key: string]: boolean },
        onCardChange: (id: string) => void,
        onCardClick: (id: string) => void
    }) {



    const [focusedCardID, setFocusedCardID] = useState<string | undefined>(initialFocusedCardID)
    const itemsRef = useRef<Map<string, HTMLElement> | null>(null);
    const [count, setCount] = useState(0)


    function getMap() {
        if (!itemsRef.current) {
            itemsRef.current = new Map();
        }
        return itemsRef.current;
    }



    function focusCardMaximizeButton(cardId: string) {
        const map = getMap();
        const node = map.get(cardId);
        const mButton = node?.querySelector('#maximize-button')
        mButton.setAttribute('tabindex', '0')
        mButton.focus()

    }






    return (




        <ScrollArea className=" h-[calc(100%-1rem)]  w-full    ">


            <ul className={`
           
                                 

         
                    grid gap-4 @xs/list:grid-cols-1 @xl/list:[&>*]:p-8  @xl/list:[&>*]:text-xl  @xs/list:[&>*]:text-sm  w-full`}>
                {terms.map((card) => (
                    <button




                        ref={(node) => {
                            const map = getMap();

                            map.set(card.id, node);

                            if (focusedCardID !== null
                                && card.id === focusedCardID) {

                                node?.classList.add(
                                    'starting:scale-80',
                                    'starting:bg-accent/20',
                                    'transition-discrete',
                                    'ease-in-out',
                                    'duration-1000',

                                )

                                node?.scrollIntoView({ behavior: 'instant', block: 'center' })
                                node?.focus()
                                setFocusedCardID(null)
                            }
                            return () => {
                                map.delete(card.id);
                            };
                        }}


                        onKeyDown={(e) => {
                            if (e.key === "ArrowRight") {
                                e.stopPropagation();

                                focusCardMaximizeButton(card.id)
                            }

                            if ((e.key === "v" && e.metaKey) || (e.key === "v" && e.ctrlKey)) {
                                onCarouselView(card.id)
                                e.stopPropagation();
                            }
                        }}


                        onClick={() => onCardClick(card.id)}
                        key={card.id}

                        onFocus={(e) => {
                            e.stopPropagation()
                            onCardChange(card.id)
                            setCount(count + 1)
                        }}

                        className={`
                                border-none
                             
                                bg-background hover:bg-background/50 shadow-xs
                                rounded-xl
                                p-4     
                                cursor-pointer 
                                m-1
                                relative    
                                rounded-full

                    [&,*]:transition-discrete 
                 


                                `}
                    >

                        <div


                            id="maximize-button"
                            className={
                                cn(FLASHCARD_CONTROL_CLASSES, "absolute top-3 right-3 h-10 w-10 flex items-center justify-center")}




                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onCarouselView(card.id)
                                    e.stopPropagation();
                                }
                            }}
                            onClick={(e) => {
                                onCarouselView(card.id)
                                e.stopPropagation();
                            }}>
                            <MaximizeIcon className="w-4 h-4 cursor-pointer " />
                        </div>

                        <div className="  w-full place-content-center place-self-center   



                              


                          text-[calc(1.5rem+var(--text-delta))]        max-w-4xl ">
                            <h2 className="   text-start    font-semibold text-accent mb-2   ">

                                {card.term}
                            </h2>
                            <p className={`text-gray-600   text-start      
                          
                                    ${showAll && !(card.id in definitionsState) || definitionsState[card.id] ? "block" : `hidden
                    
                                    
                                        `}`}>
                                {card.definition}</p>

                        </div>


                    </button>
                ))}
            </ul>
        </ScrollArea>

    )
}
