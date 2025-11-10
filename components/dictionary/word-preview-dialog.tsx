// "use client";

// import { use } from "react";
// import Link from "next/link";
// import { AudioButton } from "./audio-button";
// import type { WordWithDefinitions } from "@/lib/db/dictionary-schema";

// type WordPreviewDialogProps = {
//   readonly word: string;
//   readonly wordDataPromise: Promise<WordWithDefinitions | undefined>;
//   readonly onClose: () => void;
// };

// export function WordPreviewDialog({ word, wordDataPromise, onClose }: WordPreviewDialogProps) {
//   const wordData = use(wordDataPromise);

//   return (
//     <div
//       className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-3">
//               {wordData?.audioUrl && (
//                 <AudioButton audioUrl={wordData.audioUrl} word={word} />
//               )}
//               <div>
//                 <h2 className="text-2xl font-normal text-gray-900 dark:text-white">
//                   {word}
//                 </h2>
//                 {wordData?.pronunciation && (
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {wordData.pronunciation}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//               aria-label="Close"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {!wordData ? (
//             <div className="py-8 text-center text-gray-500 dark:text-gray-400">
//               Word not found
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {wordData.definitions.slice(0, 1).map((def) => (
//                 <div key={def.id}>
//                   <p className="text-xs italic text-gray-600 dark:text-gray-400 mb-2">
//                     {def.partOfSpeech}
//                   </p>
//                   <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
//                     {def.definition}
//                   </p>
//                   {def.example && (
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
//                       &quot;{def.example}&quot;
//                     </p>
//                   )}
//                 </div>
//               ))}

//               <Link
//                 href={`/dictionary/${encodeURIComponent(word)}`}
//                 onClick={onClose}
//                 className="block w-full py-3 text-center text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
//               >
//                 FULL DEFINITION
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }