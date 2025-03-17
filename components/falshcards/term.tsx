"use client"
import { Term } from "@/lib/db/schema";

export function TermCard({ term, search, define, onClick }: { term: Term, search: string, define: boolean, onClick: () => void }) {


    const highlightText = (text: string, search: string) =>
        search ? text.split(new RegExp(`(${search})`, "gi")).map((p, i) =>
            p.toLowerCase() === search.toLowerCase() ? <span key={i} className="bg-accent/40 
    rounded-sm underline 
    underline-offset-4 decoration-accent/60 decoration-2">{p}</span> : p
        ) : text;

    return (

        <button onClick={onClick} className="bg-card p-4 rounded-md  h-60 text-xl overflow-y-auto focus:bg-primary/30 focus:shadow-lg focus:outline-none focus:ring-0
        hover:scale-101 hover:bg-primary/30 hover:shadow-lg hover:text-foreground/80 transition-all ease-in-out duration-500 
        ">
            {define ?
                <div className="">
                    <h2 className="text-primary ">{highlightText(term.term, search)}</h2>
                    <p >{highlightText(term.definition, search)}</p>
                </div> :
                <div className=" ">
                    <h2 className="text-primary  text-center">{highlightText(term.term, search)}</h2>
                </div>
            }
        </button>

    )
}