import React from "react";
import { Metadata } from "next";
import { PairGame } from "@/components/games/pair-game/pair-game.component";
import { fetchAlgorithmPairs } from "@/lib/db/query";


export const metadata: Metadata = {
    title: 'Games',
};

export default function Games() {

    const algorithmsAverageCasePromise = fetchAlgorithmPairs("average");
    const algorithmsWorstCasePromise = fetchAlgorithmPairs("worst");

    const games = [
        {
            title: "Average Case Time Complexity",
            keyTitle: "Algorithm",
            valueTitle: "Time Complexity",
            dataPromise: algorithmsAverageCasePromise
        },
        {
            title: "Worst Case Time Complexity",
            keyTitle: "Algorithm",
            valueTitle: "Time Complexity",
            dataPromise: algorithmsWorstCasePromise
        }
    ]
    return (
        <div className=" @container/games w-full h-full  p-4 m-auto ">
               <div className="@sm:grid @sm:grid-cols-2 @sm:gap-4">
                {games.map((game,index)=>(
                    <PairGame key={index} {...game} />
                ))}
               </div>
        </div>   
    );
}
