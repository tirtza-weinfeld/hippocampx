"use client"

import React, { useState, use, useMemo } from "react";
import { PairGameButton } from "../pair-game/pair-game-button";
import { Question } from "@/lib/db/schema";

export default function TriviaGame({ questionsPromise}: { questionsPromise: Promise<Question[]> }) {


  const questions = use(questionsPromise);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({} as { [questionId: string]: number })
  const [showStats, setShowStats] = useState(false)

  function newGame() {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowStats(false)
  }

  const score = useMemo(() => {
    return questions.filter((question) => selectedAnswers[question.id] === question.correctAnswer).length
  }, [selectedAnswers, questions])


  function handleAnswer(selectedAnswerIndex: number) {
    setSelectedAnswers({ ...selectedAnswers, [questions[currentQuestion].id]: selectedAnswerIndex })
  }



  return <div className="@container/trivia grid grid-cols-1 gap-4 h-full w-full bg-foreground/5 rounded-lg p-4">
    <div className="flex justify-end gap-2 h-10 ">
      <button onClick={() => newGame()} className="
      text-sm text-muted-foreground bg-background/50 rounded-lg p-2 ">New Game</button>
      <button onClick={() => setShowStats(!showStats)} className="text-sm text-muted-foreground bg-background/50 rounded-lg p-2">
        {showStats ? "Hide Stats" : "Show Stats"}</button>
    </div>

    {
      currentQuestion < questions.length && !showStats &&

      <div className="flex flex-col gap-2 
        transition-all duration-500 transition-discrete  starting:translate-y-100 starting:opacity-0 starting:scale-0
      ">
        <div className="text-sm text-muted-foreground"> {currentQuestion + 1}/{questions.length}</div>
        <h4 className="text-md font-bold text-primary">{questions[currentQuestion].title}</h4>
        <p className="text-sm text-muted-foreground">{questions[currentQuestion].text}</p>

        {questions[currentQuestion].options.map((option, index) => (
          <PairGameButton
          
            key={index}
            onClick={() => handleAnswer(index)}
            selected={selectedAnswers[questions[currentQuestion].id] === index}
            disabled={selectedAnswers[questions[currentQuestion].id] !== undefined}
            status={selectedAnswers[questions[currentQuestion].id] === index
              && questions[currentQuestion].correctAnswer === index
              ? "correct"
              : selectedAnswers[questions[currentQuestion].id] === index
                && questions[currentQuestion].correctAnswer !== index
                ? "incorrect"
                : null}
            onAnimationEnd={() => setCurrentQuestion(currentQuestion + 1)}
          >
            {option}
          </PairGameButton >
        ))
        }

      </div>}

    {(currentQuestion === questions.length || showStats) &&

      <div className="grid grid-cols-2 gap-2 [&>*]:text-sm [&>*]:text-muted-foreground [&>*]:bg-background/50 [&>*]:rounded-lg [&>*]:p-2 [&>*]:text-center
       [&>*]:flex [&>*]:items-center [&>*]:justify-center ">
        <div>correct {score}</div>
        <div> incorrect {Object.keys(selectedAnswers).length - score}</div>


        
          {Object.keys(selectedAnswers).length < questions.length &&
            <div className="animate-pulse col-span-2">remaining {questions.length - Object.keys(selectedAnswers).length} questions</div>
          }
      </div>
    }
  </div>


};



