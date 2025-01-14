"use client"

import React, { useState, useTransition } from "react";
import { shuffleItemsAction } from "./pair-game.actions";
import { PairGameButton } from "./pair-game-button";


export default function ShuffledList({ data, keys, values, title, keyTitle, valueTitle }: {
    data: { [id: string]: { value: string, key: string } },
    keys: string[],
    values: string[],
    title: string,
    keyTitle: string,
    valueTitle: string
}) {

    const [shuffledKeys, setShuffledKeys] = useState(keys);
    const [shuffledValues, setShuffledValues] = useState(values);
    const [isPending, startTransition] = useTransition();


    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [pairs, setPairs] = useState<{ keyId: string, valueId: string }[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [animatedPair, setAnimatedPair] = useState<{ keyId: string, valueId: string, status: "correct" | "incorrect" } | null>(null);


    const handleShuffle = () => {
        startTransition(async () => {

            setPairs([]);
            setAnimatedPair(null);
            setSelectedKey(null);
            setSelectedValue(null);

            const newShuffledKeys = await shuffleItemsAction(shuffledKeys, 0.7);
            setShuffledKeys(newShuffledKeys);
            const newShuffledValues = await shuffleItemsAction(shuffledValues, 0.4);
            setShuffledValues(newShuffledValues);
        });
    };

    const isPairCorrect = (keyId: string, valueId: string) => {
        if (keyId === valueId) {
            return true;
        }

        return data[keyId].value === data[valueId].value;
    }

    const handleSelection = (type: "key" | "value", id: string) => {

        if (type === "key") {
            if (selectedValue) {
                if (isPairCorrect(id, selectedValue)) {
                    setPairs([...pairs, { keyId: id, valueId: selectedValue }]);
                    setSelectedValue(null);
                    setAnimatedPair({ keyId: id, valueId: selectedValue, status: "correct" });
                }
                else {
                    setSelectedValue(null);
                    setAnimatedPair({ keyId: id, valueId: selectedValue, status: "incorrect" });
                }
            }
            else {
                setSelectedKey(id);
            }
        }


        else {
            if (selectedKey) {
                if (isPairCorrect(selectedKey, id)) {
                    setSelectedKey(null);
                    setPairs([...pairs, { keyId: selectedKey, valueId: id }]);
                    setAnimatedPair({ keyId: selectedKey, valueId: id, status: "correct" });
                }
                else {
                    setSelectedKey(null);
                    setAnimatedPair({ keyId: selectedKey, valueId: id, status: "incorrect" });
                }
            }
            else {
                setSelectedValue(id);
            }
        }



    }


    return (
        <div>
            <div className="flex flex-row ">
                <h2 className="text-2xl w-fit h-fit
            hover:bg-gradient-to-r/oklch hover:from-teal-400 hover:to-primary
            hover:animate-pulse
            
            font-bold  bg-linear-to-r/oklch  from-primary to-accent
             bg-clip-text 
            text-transparent 
            transition-all duration-1000  ease-in-out
            p-4">
                   {title}
                </h2>

            </div>

            <div className="flex flex-row gap-4">

                <div className="grid grid-flow-row gap-2   ">
                    <div className=" font-bold text-accent ">{keyTitle}</div>
                    {shuffledKeys.map((id) => (
                     

                        <PairGameButton
                            onClick={() => handleSelection("key", id)}
                            disabled={pairs.some(pair => pair.keyId === id)}
                            key={id}
                            selected={selectedKey === id}
                            status={animatedPair?.keyId === id ? animatedPair.status : null}
                        >{data[id].key}
                        </PairGameButton>
                    ))}
                </div>

                <div className="grid grid-flow-row gap-2   ">
                    <div className=" font-bold text-accent  ">{valueTitle}</div>
                    <div className="flex flex-col-reverse gap-2   ">
                        {shuffledValues.map((id) => (
                            <PairGameButton
                                key={id}
                                onClick={() => handleSelection("value", id)}

                                disabled={pairs.some(pair => pair.valueId === id)}
                                selected={selectedValue === id}
                                status={animatedPair?.valueId === id ? animatedPair.status : null}
                            >{data[id].value} </PairGameButton>


                        ))}
                    </div>
                </div>



            </div>
            <button 
            onClick={handleShuffle} disabled={isPending} className=" text-white  rounded-full
            bg-linear-to-r/oklch from-accent to-primary
            hover:bg-linear-to-r/oklch  hover:from-primary hover:to-accent
            transition-all duration-1000  ease-in-out
         place-self-center place-content-center
            px-4 py-1  opacity-70 w-40 mt-4
            
            ">
                {isPending ? "Resetting..." : "New Game"}
            </button>
        </div>
    );
};

