"use client"


import React, { useRef, useState } from "react";
import { Term } from "@/lib/db/schema";
import { ChevronLeftIcon, ChevronRightIcon, MinimizeIcon } from "lucide-react";
import FlashcardControl from "./flashcard-control";



export default function FlashcardsCarousel({ terms, selectedCardId, onListView, showAll,
    onCardClick,
    definitionsState,
    onCardChange
}: {
    terms: Term[]
    selectedCardId: string | undefined
    onListView: (id: string) => void
    showAll: boolean
    definitionsState: { [key: string]: boolean }
    onCardClick: (id: string) => void
    onCardChange: (id: string) => void
}) {



    const [selectedCardIndex, setSelectedCardIndex] = 
    useState<number | null>(selectedCardId ? terms.findIndex(term => 
        term.id === selectedCardId) : 0);

    const nextRef = useRef<HTMLButtonElement>(null)
    const previousRef = useRef<HTMLButtonElement>(null)


    const nextCard = () => {
        if (selectedCardIndex! < terms.length - 1) {
            setSelectedCardIndex(selectedCardIndex! + 1)
            onCardChange(terms[selectedCardIndex!+1].id)
            // nextRef.current?.classList.add("animate-[pulse_1s_ease-in-out_1]")

        }
    }

    const previousCard = () => {
        if (selectedCardIndex! > 0) {
            setSelectedCardIndex(selectedCardIndex! - 1)
            onCardChange(terms[selectedCardIndex!-1].id)

            // previousRef.current?.classList.add("animate-[pulse_1s_ease-in-out_1]")
 

        }
      
   
    }





    return (




        <div
            className=" @container/carousel relative   flex flex-col     w-full h-[calc(100%-1rem)] bg-background p-4 rounded-lg 
                 gap-4  justify-between   focus:outline-none "

    tabIndex={0}


            onClick={(e) => {
                e.stopPropagation()
                onCardClick(terms[selectedCardIndex!].id)
            }}
             onKeyDown={(e) => {
                e.stopPropagation()
                switch (e.key) {
                    case 'Escape':
                        onListView(terms[selectedCardIndex!].id)
                        break
                    case 'Enter':
                        onCardClick(terms[selectedCardIndex!].id)
                        break
                    case 'ArrowLeft':
                        {

                            previousCard()

                           

                        }
                        break
                    case 'ArrowRight':
                        {

                            nextCard()
                            // nextRef.current?.focus()
                            // nextRef.current?.click()
                        }
                        break
                }
            }}
        >

            <div className={`
                    
                           absolute top-3 right-3 h-10  flex flex-row gap-1 
                
   


`}

            >
                <FlashcardControl
                    onClick={() => {
                        onListView(terms[selectedCardIndex!].id);

                    }}>
                    <MinimizeIcon className="w-4 h-4  " />
                </FlashcardControl>
            </div>

            <div>


                <div className="absolute bottom-3 right-3 flex flex-row gap-1
">
                    <FlashcardControl
                        disabled={selectedCardIndex === 0}
                        ref={previousRef}
                        onClick={() => {
                            previousCard()
                        }}><ChevronLeftIcon className="w-4 h-4" /></FlashcardControl>

                    <FlashcardControl
                        disabled={selectedCardIndex === terms.length - 1}
                        ref={nextRef}
                        onClick={() => {
                            nextCard()
                        }}><ChevronRightIcon className="w-4 h-4" /></FlashcardControl>


                </div>





            </div>



            <div className="grid grid-cols-1 gap-2 h-full  w-full bg-background  cursor-pointer"

            >


                {

                    showAll && !(terms[selectedCardIndex!].id in definitionsState)
                        || definitionsState[terms[selectedCardIndex!].id] ?


                        <div className=" max-w-2xl grid gap-4 place-self-center text-wrap [&>*]:text-wrap  ">

                            <h3 className="font-extrabold text-accent  text-[calc(2.25rem+var(--text-delta))] my-4 ">
                                {terms[selectedCardIndex!].term}
                            </h3>

                            <div className="text-[calc(1.5rem+var(--text-delta))]">
                                {terms[selectedCardIndex!].definition}</div>



                        </div> :
                        <h3 className="font-extrabold text-accent   text-[calc(2.5rem+var(--text-delta))]
                             place-self-center ">
                            {terms[selectedCardIndex!].term}</h3>
                }
            </div>

        </div>



    )
}
