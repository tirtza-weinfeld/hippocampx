import React, { Suspense } from "react";
import { Metadata } from "next";
import { PairGame } from "@/components/games/pair-game/pair-game.component";
import { fetchAlgorithmPairs, fetchFlashcards, fetchTriviaQuestions, getTermsCategoriesMap } from "@/lib/db/query";
import TriviaGame from "@/components/games/trivia/trivia-game";
import Flashcards from "@/components/games/flashcards/flashcards";
export const metadata: Metadata = {
    title: 'Games',
};

export default function Games() {

    const algorithmsAverageCasePromise = fetchAlgorithmPairs("average");
    const algorithmsWorstCasePromise = fetchAlgorithmPairs("worst");
    const triviaQuestionsPromise = fetchTriviaQuestions();
    const flashcardsPromise = fetchFlashcards();
    const categoriesPromise = getTermsCategoriesMap();
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

            <div className="grid @sm:grid-cols-1 @lg:grid-cols-2 
            grid-rows-[repeat(9,minmax(0,calc(100vh/2)))] 
            
            gap-4">

                <Suspense fallback={<GameFallback game="Flashcards" />}>
                    <Flashcards termsPromise={flashcardsPromise} categoriesPromise={categoriesPromise} />
                </Suspense>
                {games.map((game, index) => (
                    <Suspense key={index} fallback={<GameFallback game={game.title} />}>
                        <PairGame {...game} />
                    </Suspense>
                ))}

                <Suspense fallback={<GameFallback game="Trivia" />}>
                    <TriviaGame questionsPromise={triviaQuestionsPromise} />
                </Suspense>


                {/* <GameFallback game="Flashcards" /> */}
            </div>


        </div>
    );
}



function GameFallback({ game }: { game: string }) {
    return <div className="w-full h-full bg-foreground/5 rounded-lg p-4 ">
        <h2 className="   w-fit h-fit
            hover:bg-gradient-to-r/oklch hover:from-accent/90 hover:via-accent  hover:to-accent/10  
            
                font-extrabold text-3xl  bg-linear-to-r/oklch  from-accent/80 via-accent/50 to-accent/75
             bg-clip-text 
            text-transparent 
            transition-all duration-500  ease-in-out
            p-4">
            Loading {game}..
        </h2>
    </div>
}