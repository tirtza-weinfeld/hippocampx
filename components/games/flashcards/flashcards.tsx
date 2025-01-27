"use client"


import React, { use, useMemo, useState } from "react";
import { Term } from "@/lib/db/schema";

import FlashcardsList from "./flashcards-list";
import FlashcardsCarousel from "./flashcards-carousel";
import FlashcardsControls from "./flashcards-controls";

const filterTerms = (terms: Term[], categories: { [name: string]: string }, categoryName: string) => {
    if (categoryName === "all" ) return terms;
    return terms.filter(term => term.categoryId === categories[categoryName]);
}


export default function Flashcards({ termsPromise, categoriesPromise }: {
    termsPromise: Promise<Term[]>,
    categoriesPromise: Promise<{ [name: string]: string }>
}) {

    const categories = use(categoriesPromise);


    const terms = use(termsPromise);

    const [category, setCategory] = useState<string>("all");

 
    const [selectedCardId, setSelectedCardId] = useState<{ [category: string]: string } | null>(null);
    const [mode, setMode] = useState<"list" | "carousel">("list");

    const [textDelta, setTextDelta] = useState(0);

    const visibleTerms = useMemo(
        () => filterTerms(terms, categories, category),
        [terms, categories, category]
    );



    const [showAll, setShowAll] = useState(false)
    const [definitionsState, setDefinitionsState] = useState<{ [key: string]: boolean }>({})


    const handleCardChange = (cardId: string) => {
        setSelectedCardId({ ...selectedCardId, [category]: cardId })
    }

    const handleIndexChange = (index: number) => {
        setSelectedCardId({ ...selectedCardId, [category]: visibleTerms[index].id })
    }

    const handleCardClick = (id: string) => {
        if (id in definitionsState) {
            setDefinitionsState({ ...definitionsState, [id]: !definitionsState[id] })
        } else {
            setDefinitionsState({ ...definitionsState, [id]: !showAll })
        }
    }


   
    return (
        <div
            style={{
                '--text-delta': `${textDelta}rem`,
            } as React.CSSProperties}
            className=" w-full h-full 
            @container
            relative     p-6 bg-foreground/5 rounded-md 
     
     
        


            ">


            <FlashcardsControls
                selectedIndex={visibleTerms.findIndex(term => term.id === selectedCardId?.[category])}
                onIndexChange={handleIndexChange}
                length={visibleTerms.length}
                showAll={showAll}
                textDelta={textDelta}
                setTextDelta={setTextDelta}
                categories={categories}
                setCategory={setCategory}
                onShowAll={() => {
                    if (!showAll) {
                        setDefinitionsState({})
                    }
                    setShowAll(!showAll)
                }}
            />








            <div className="h-full w-full   rounded-md  p-4 mt-12">

                {mode === "list" &&

                    <FlashcardsList
                        terms={visibleTerms}
                        initialFocusedCardID={selectedCardId?.[category]}
                    
                        onCardChange={handleCardChange}
                        onCarouselView={() => setMode("carousel")}
                        definitionsState={definitionsState}
                        onCardClick={handleCardClick}
                        showAll={showAll}
                    />
                }



                {mode === "carousel" &&
                    <FlashcardsCarousel
                        terms={visibleTerms}
                        selectedCardId={selectedCardId?.[category]}
                 
                        onCardChange={handleCardChange}
                        onListView={() => setMode("list")}
                        showAll={showAll}
                        definitionsState={definitionsState}
                        onCardClick={handleCardClick}
                    />


                }
            </div>
        </div>

    )
}
