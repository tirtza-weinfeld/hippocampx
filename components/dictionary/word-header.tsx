// import { use } from "react";
// import { AudioButton } from "./audio-button";
// import type { Word } from "@/lib/db/dictionary-schema";

// type WordHeaderProps = {
//   readonly wordPromise: Promise<Word | undefined>;
// };

// export function WordHeader({ wordPromise }: WordHeaderProps) {
//   const wordData = use(wordPromise);

//   if (!wordData) return null;

//   return (
//     <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
//       <div className="flex items-center gap-3 mb-2">
//         {wordData.audioUrl && (
//           <AudioButton audioUrl={wordData.audioUrl} word={wordData.word} />
//         )}
//         <h1 className="text-[2.5rem] leading-tight font-normal text-gray-900 dark:text-white">
//           {wordData.word}
//         </h1>
//       </div>
//       {wordData.pronunciation && (
//         <p className="text-base text-gray-600 dark:text-gray-400 font-normal ml-[52px]">
//           {wordData.pronunciation}
//         </p>
//       )}
//     </header>
//   );
// }

// export function WordHeaderSkeleton() {
//   return (
//     <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
//       <div className="flex items-center gap-3 mb-2">
//         <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
//         <div className="h-12 w-64 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
//       </div>
//       <div className="h-6 w-48 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse ml-[52px]" />
//     </header>
//   );
// }