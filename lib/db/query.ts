import 'server-only';


import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { algorithms } from './schema';
import { cache } from 'react';


export const db = drizzle(sql)


export const fetchAlgorithms = cache(async () => {
    return await db.select().from(algorithms);
});


export const fetchAlgorithmPairs = cache(async (caseType: "average" | "worst") => {

    const algorithms = await fetchAlgorithms();


 return algorithms.reduce((acc, algorithm) => {
        acc[algorithm.id] = { key: algorithm.name, value: algorithm[`${caseType}Case`] };
        return acc;
    }, {} as { [id: string]: { key: string, value: string } });






});


