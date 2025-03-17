"use client";
import { Term } from "@/lib/db/schema";
import { Terms, TermsFallback } from "./terms";
import { Suspense, use, useMemo, useState } from "react";
import LearnControls from "./learn-controls";


const searchFilter = (terms: Term[], search: string) => {
    return terms.filter(term => {
        return term.term.toLowerCase().includes(search.toLowerCase()) ||
            term.definition.toLowerCase().includes(search.toLowerCase()) 
    });
}

const filterTerms = (terms: Term[], categories: { [name: string]: string }, categoryName: string, search: string) => {
    if (categoryName === "all" ) return searchFilter(terms, search);
    return searchFilter(terms.filter(term => term.categoryId === categories[categoryName]), search);
}

export default function Learn({ termsPromise, categoriesPromise }:
    { termsPromise: Promise<Term[]>, categoriesPromise: Promise<{ [name: string]: string }> }) {

    const categories = use(categoriesPromise);
    const terms = use(termsPromise);
    const [category, setCategory] = useState<string>("all");
    const [search, setSearch] = useState<string>("");

    const visibleTerms = useMemo(
        () => filterTerms(terms, categories, category, search),
        [terms, categories, category, search]
    );

    const [defineAll, setDefineAll] = useState<boolean>(false);

    const [definitionsState, setDefinitionsState] = useState<{ [key: string]: boolean }>(terms.reduce((acc, term) => ({ ...acc, [term.id]: false }), {}));

    const handleTermClick = (id: string) => {
            setDefinitionsState({ ...definitionsState, [id]: !definitionsState[id] })
    }


    return (
        <div className="p-4 h-full w-full">
            {/* <h1>Learn</h1> */}

                <LearnControls categories={categories} 
                setCategory={setCategory} setSearch={setSearch} defineAll={defineAll} 
                setDefineAll={() => {
                    if (!defineAll) {
                        setDefinitionsState(Object.fromEntries(Object.keys(definitionsState).map((key) => [key, true])));

                    }
                    else {
                        setDefinitionsState(Object.fromEntries(Object.keys(definitionsState).map((key) => [key, false])));
                    }
                    setDefineAll(!defineAll)
                }} />

            <Suspense fallback={<TermsFallback />}>
                <Terms terms={visibleTerms} search={search} 
                definitionsState={definitionsState}
                 handleTermClick={handleTermClick} />
            </Suspense>
        </div>
    )
}