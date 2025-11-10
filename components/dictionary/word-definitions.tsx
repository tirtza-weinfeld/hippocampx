// import { use } from "react";
// import type { Definition, WordForm } from "@/lib/db/dictionary-schema";
// import { WordFormsSection } from "./word-forms-section";

// type WordDefinitionsProps = {
//   readonly definitionsPromise: Promise<{
//     definitions: Definition[];
//     wordForms: WordForm[];
//   }>;
// };

// function groupDefinitions(definitions: Definition[]): Record<string, Definition[]> {
//   return definitions.reduce((acc, def) => {
//     if (!acc[def.partOfSpeech]) {
//       acc[def.partOfSpeech] = [];
//     }
//     acc[def.partOfSpeech].push(def);
//     return acc;
//   }, {} as Record<string, Definition[]>);
// }

// export function WordDefinitions({ definitionsPromise }: WordDefinitionsProps) {
//   const { definitions, wordForms } = use(definitionsPromise);
//   const groupedDefinitions = groupDefinitions(definitions);

//   return (
//     <div className="space-y-8">
//       {Object.entries(groupedDefinitions).map(([partOfSpeech, defs]) => (
//         <section key={partOfSpeech} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0">
//           <div className="mb-4">
//             <h2 className="text-base font-normal italic text-gray-600 dark:text-gray-400 mb-2">
//               {partOfSpeech}
//             </h2>
//             {wordForms.length > 0 && (
//               <WordFormsSection
//                 wordForms={wordForms}
//                 partOfSpeech={partOfSpeech}
//               />
//             )}
//           </div>
//           <ol className="space-y-6 list-decimal list-inside marker:text-gray-500 dark:marker:text-gray-500 marker:font-normal">
//             {defs.map((definition) => (
//               <li key={definition.id} className="space-y-2 pl-0">
//                 <p className="text-gray-900 dark:text-white font-normal text-[15px] leading-relaxed">
//                   {definition.definition}
//                 </p>
//                 {definition.example && (
//                   <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
//                     <span className="text-gray-500 dark:text-gray-500">&quot;</span>
//                     {definition.example}
//                     <span className="text-gray-500 dark:text-gray-500">&quot;</span>
//                   </p>
//                 )}
//               </li>
//             ))}
//           </ol>
//         </section>
//       ))}
//     </div>
//   );
// }

// export function WordDefinitionsSkeleton() {
//   return (
//     <div className="space-y-8">
//       {Array.from({ length: 2 }).map((_, i) => (
//         <section key={i} className="space-y-4">
//           <div className="h-6 w-24 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
//           <div className="space-y-3">
//             <div className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
//             <div className="h-12 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
//           </div>
//         </section>
//       ))}
//     </div>
//   );
// }