// // import type { Definition, Synonym, Antonym, RelatedWord } from "@/lib/db/dictionary-schema";
// // import { RelatedWordsGroup } from "./related-words-group";

// // type DefinitionWithRelations = Definition & {
// //   readonly synonyms: readonly Synonym[];
// //   readonly antonyms: readonly Antonym[];
// //   readonly relatedWords: readonly RelatedWord[];
// // };

// // type DefinitionEntryProps = {
// //   readonly definition: DefinitionWithRelations;
// //   readonly existingWords: Set<string>;
// // };

// // export function DefinitionEntry({ definition, existingWords }: DefinitionEntryProps) {
// //   const allSynonyms = [
// //     ...definition.synonyms.map(s => s.synonym),
// //     ...definition.relatedWords
// //       .filter(rw => rw.relationshipType === "similar")
// //       .map(rw => rw.relatedWord)
// //   ];

// //   const allAntonyms = definition.antonyms.map(a => a.antonym);

// //   const validatedSynonyms = allSynonyms.map(word => ({
// //     word,
// //     exists: existingWords.has(word.toLowerCase())
// //   }));

// //   const validatedAntonyms = allAntonyms.map(word => ({
// //     word,
// //     exists: existingWords.has(word.toLowerCase())
// //   }));

// //   return (
// //     <li className="space-y-2 pl-0">
// //       <p className="text-gray-900 dark:text-white font-normal text-[15px] leading-relaxed">
// //         {definition.definition}
// //       </p>

// //       {definition.example && (
// //         <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
// //           <span className="text-gray-500 dark:text-gray-500">&quot;</span>
// //           {definition.example}
// //           <span className="text-gray-500 dark:text-gray-500">&quot;</span>
// //         </p>
// //       )}

// //       {validatedSynonyms.length > 0 && (
// //         <RelatedWordsGroup
// //           label="Similar"
// //           validatedWords={validatedSynonyms}
// //         />
// //       )}

// //       {validatedAntonyms.length > 0 && (
// //         <RelatedWordsGroup
// //           label="Opposite"
// //           validatedWords={validatedAntonyms}
// //         />
// //       )}
// //     </li>
// //   );
// // }

// export function DefinitionEntry() {
//   return (
//     <div>
//       <h1>Definition Entry</h1>
//     </div>
//   );
// }