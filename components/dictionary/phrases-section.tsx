// import type { Phrase } from "@/lib/db/dictionary-schema";

// type PhrasesSectionProps = {
//   readonly phrases: readonly Phrase[];
// };

// export function PhrasesSection({ phrases }: PhrasesSectionProps) {
//   if (phrases.length === 0) return null;

//   return (
//     <section className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//       <h2 className="text-base font-medium mb-4 text-gray-800 dark:text-gray-200">Phrases</h2>
//       <ul className="space-y-3">
//         {phrases.map((phrase) => (
//           <li key={phrase.id}>
//             <h3 className="font-medium text-[15px] text-gray-900 dark:text-white">{phrase.phrase}</h3>
//             <p className="text-[14px] text-gray-700 dark:text-gray-300 mt-1">{phrase.definition}</p>
//             {phrase.example && (
//               <p className="text-[14px] text-gray-600 dark:text-gray-400 mt-1">
//                 <span className="text-gray-500 dark:text-gray-500">&quot;</span>
//                 {phrase.example}
//                 <span className="text-gray-500 dark:text-gray-500">&quot;</span>
//               </p>
//             )}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }

export function PhrasesSection() {
  return (
    <div>
      <h1>Phrases Section</h1>
    </div>
  );
}