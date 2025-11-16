import 'server-only';


import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';


export const db = drizzle(sql)


// export const fetchAlgorithms = cache(async () => {
//     return await db.select().from(algorithms);
// });


// export const fetchAlgorithmPairs = cache(async (caseType: "average" | "worst") => {

//     const algorithms = await fetchAlgorithms();


//     return algorithms.reduce((acc, algorithm) => {
//         acc[algorithm.id] = { key: algorithm.name, value: algorithm[`${caseType}Case`] };
//         return acc;
//     }, {} as { [id: string]: { key: string, value: string } });






// });



// export const fetchTriviaQuestions = cache(async (categoryName?: string) => {
//     const result = await db.select().from(questions)
//         .where(categoryName ?
//             eq(questions.categoryId,
//                 db.select({ id: categories.id })
//                     .from(categories)
//                     .where(eq(categories.name, categoryName))) : undefined);
//     return result as Question[];
// });

// export const fetchTerms = cache(async (categoryName: string) => {
//     return await fetchTriviaQuestions(categoryName);
// });


// export const fetchTriviaCategories = cache(async () => {
//     return await db.select().from(categories);
// });

// export const makePairs = cache(async (categoryName: string) => {
//     const questions = await fetchTriviaQuestions(categoryName);
//     return questions.map((question) => ({
//         question: question.text,
//         options: question.options,
//         hints: question.hints,
//     }));
// });


// export const getCategoriesMap = cache(async (): Promise<{ [name: string]: string }> => {
//     const categories = await fetchTriviaCategories();
//     return categories.reduce((acc, category) => {
//         acc[category.name] = category.id;
//         return acc;
//     }, {} as { [name: string]: string });
// });


// export const getTermsCategoriesMap = cache(async (): Promise<{ [name: string]: string }> => {
//     const res = await db.select().from(categories).where(
//         inArray(categories.id,
//             db.select({ id: terms.categoryId })
//                 .from(terms)
//                 .where(eq(terms.categoryId, categories.id))
//                 .groupBy(terms.categoryId)
//         )
//     );
//     return res.reduce((acc, category) => {
//         acc[category.name] = category.id;
//         return acc;
//     }, {} as { [name: string]: string });
// });
// export const fetchFlashcards = cache(async (categoryName?: string): Promise<Term[]> => {
//     const categoriesMap = await getCategoriesMap();
//     return await db.select().from(terms)
//         .where(categoryName ? eq(terms.categoryId,
//             categoriesMap[categoryName]) : undefined) as Term[];
// });





// export const getTerms = cache(async (categoryName?: string): Promise<Term[]> => {
//     const category = categoryName ? (await getTermsCategoriesMap())[categoryName] : undefined;
//     return await db.select().from(terms)
//         .where(category ? eq(terms.categoryId, category) : undefined) as Term[];
// });
