import { memo, Suspense } from "react";
import { shuffleItemsAction } from "./pair-game.actions";
import ShuffledList from "./shuffled-list";



 async function Wrapper(
    { dataPromise  , title,keyTitle,valueTitle}:
     { dataPromise: Promise<{ [id: string]: { key: string, value: string } }>, title: string,keyTitle:string,valueTitle:string }) {

    const data = await dataPromise;

    const shuffledKeys = await shuffleItemsAction(Object.keys(data), 0.7);
    const shuffledValues = await shuffleItemsAction(Object.keys(data), 0.4);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShuffledList data={data}  keys={shuffledKeys} values={shuffledValues}  title={title} keyTitle={keyTitle} valueTitle={valueTitle} />
            
        </Suspense>
    );
}


export const PairGame = memo(Wrapper);