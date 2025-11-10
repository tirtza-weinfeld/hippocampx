// 'use client';

// import { useReducer } from 'react';
// import Link from 'next/link';
// import * as motion from 'motion/react-client';
// import type { Word } from '@/lib/db/dictionary-schema';

// type HoverState = {
//   readonly isHovered: boolean;
// };

// type HoverAction = { readonly type: "HOVER_START" } | { readonly type: "HOVER_END" };

// function hoverReducer(state: HoverState, action: HoverAction): HoverState {
//   switch (action.type) {
//     case "HOVER_START":
//       return { isHovered: true };
//     case "HOVER_END":
//       return { isHovered: false };
//   }
// }

// type WordListItemProps = {
//   readonly word: Word;
// };

// export function WordListItem({ word }: WordListItemProps) {
//   const [state, dispatch] = useReducer(hoverReducer, { isHovered: false });

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ x: 4 }}
//       onHoverStart={() => dispatch({ type: "HOVER_START" })}
//       onHoverEnd={() => dispatch({ type: "HOVER_END" })}
//       className="relative"
//     >
//       <Link
//         href={`/dictionary/${word.word}`}
//         prefetch={true}
//         className="block w-full text-left px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold">{word.word}</h3>
//             {word.pronunciation && (
//               <p className="text-sm text-neutral-500 dark:text-neutral-400">
//                 {word.pronunciation}
//               </p>
//             )}
//           </div>
//           <motion.div
//             animate={{ x: state.isHovered ? 4 : 0 }}
//             transition={{ duration: 0.2 }}
//           >
//             <svg
//               className="w-5 h-5 text-neutral-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </motion.div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }