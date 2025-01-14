"use server"




const shuffle= <T,>(array: T[],r:number): T[] => {
    return [...array].sort(() => Math.random() - 0.5 *r);

};

export async function shuffleItemsAction<T>(items: T[],r:number): Promise<T[]> {
    return Promise.resolve(shuffle(items,r));
}
