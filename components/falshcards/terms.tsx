"use client"

import { Term } from "@/lib/db/schema";
import React from "react";
import { TermCard } from "./term";
export function Terms({ terms, search, definitionsState, handleTermClick }: { terms: Term[], search: string, definitionsState: { [key: string]: boolean }, handleTermClick: (id: string) => void }) {



    return (
        <>



            <div className=" h-full w-full pb-4">

                {terms.length > 0 ?
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {terms.map((term) => (
                            <TermCard key={term.id} term={term} search={search}
                                define={definitionsState[term.id]}
                                onClick={() => handleTermClick(term.id)} />
                        ))}
                    </div>
                    :
                    <div className="text-center text-muted-foreground bg-card p-4 w-full h-full flex items-center justify-center rounded-md">
                        No terms found
                    </div>
                }
            </div>
        </>
    )
}








export function TermsFallback() {
    return (
        <div>
            <h1>Terms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="bg-primary/10 p-4 rounded-md">
                        <div className="animate-pulse h-24 w-full bg-gray-200 rounded-md"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}