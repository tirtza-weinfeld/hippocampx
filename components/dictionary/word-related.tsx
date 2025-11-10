// import { use } from "react";
// import type { Phrase } from "@/lib/db/dictionary-schema";
// import { PhrasesSection } from "./phrases-section";
// import { RelatedWordsGroup } from "./related-words-group";

// type WordRelatedProps = {
//   readonly relatedPromise: Promise<{
//     phrases: Phrase[];
//     synonymsByDef: Map<string, any>;
//     antonymsByDef: Map<string, any>;
//     relatedByDef: Map<string, any>;
//     existingWords: Set<string>;
//   }>;
//   readonly definitionIds: string[];
// };

// export function WordRelated({ relatedPromise, definitionIds }: WordRelatedProps) {
//   const { phrases, synonymsByDef, antonymsByDef, relatedByDef, existingWords } = use(relatedPromise);

//   return (
//     <>
//       {definitionIds.map((defId) => {
//         const synonyms = (synonymsByDef.get(defId) ?? []).map((item: any) => item.synonyms.synonym);
//         const antonyms = (antonymsByDef.get(defId) ?? []).map((item: any) => item.antonyms.antonym);
//         const related = (relatedByDef.get(defId) ?? [])
//           .filter((item: any) => item.related_words.relationshipType === "similar")
//           .map((item: any) => item.related_words.relatedWord);

//         const allSynonyms = [...synonyms, ...related];

//         const validatedSynonyms = allSynonyms.map(word => ({
//           word,
//           exists: existingWords.has(word.toLowerCase())
//         }));

//         const validatedAntonyms = antonyms.map((word: string) => ({
//           word,
//           exists: existingWords.has(word.toLowerCase())
//         }));

//         return (
//           <div key={defId} className="space-y-3">
//             {validatedSynonyms.length > 0 && (
//               <RelatedWordsGroup
//                 label="Similar"
//                 validatedWords={validatedSynonyms}
//               />
//             )}
//             {validatedAntonyms.length > 0 && (
//               <RelatedWordsGroup
//                 label="Opposite"
//                 validatedWords={validatedAntonyms}
//               />
//             )}
//           </div>
//         );
//       })}

//       {phrases.length > 0 && (
//         <PhrasesSection phrases={phrases} />
//       )}
//     </>
//   );
// }

// export function WordRelatedSkeleton() {
//   return (
//     <div className="space-y-4">
//       <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
//       <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
//     </div>
//   );
// }