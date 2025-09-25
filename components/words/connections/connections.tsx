// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Shuffle, RotateCcw, Target, CheckCircle, X } from 'lucide-react';

// interface ConnectionGroup {
//   category: string;
//   words: string[];
//   difficulty: 1 | 2 | 3 | 4;
//   color: string;
// }

// interface ConnectionsState {
//   currentPuzzle: ConnectionGroup[];
//   allWords: string[];
//   selectedWords: string[];
//   solvedGroups: ConnectionGroup[];
//   attempts: number;
//   message: string;
//   gameState: 'playing' | 'won' | 'lost';
//   mistakes: string[][];
//   startTime: Date;
//   actionsCount: number;
// }

// type ConnectionsAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'TOGGLE_WORD'; word: string }
//   | { type: 'SHUFFLE_WORDS' }
//   | { type: 'CLEAR_SELECTION' }
//   | { type: 'SUBMIT_GUESS' }
//   | { type: 'INCREMENT_ACTIONS' };

// interface ConnectionsProps {
//   onGameEnd?: (won: boolean, timeElapsed: number) => void;
// }

// const SAMPLE_PUZZLES: ConnectionGroup[][] = [
//   [
//     { category: 'TYPES OF BEARS', words: ['POLAR', 'GRIZZLY', 'PANDA', 'BLACK'], difficulty: 1, color: 'bg-yellow-400' },
//     { category: 'THINGS THAT ARE RED', words: ['APPLE', 'ROSE', 'FIRE', 'BLOOD'], difficulty: 2, color: 'bg-green-400' },
//     { category: 'PROGRAMMING LANGUAGES', words: ['PYTHON', 'JAVA', 'RUST', 'SWIFT'], difficulty: 3, color: 'bg-blue-400' },
//     { category: 'WORDS ENDING IN -LE', words: ['PUZZLE', 'BOTTLE', 'SIMPLE', 'MIDDLE'], difficulty: 4, color: 'bg-purple-400' }
//   ]
// ];

// const getInitialState = (): ConnectionsState => {
//   const puzzle = SAMPLE_PUZZLES[Math.floor(Math.random() * SAMPLE_PUZZLES.length)];
//   const words = puzzle.flatMap(group => group.words);
//   const shuffledWords = [...words].sort(() => Math.random() - 0.5);

//   return {
//     currentPuzzle: puzzle,
//     allWords: shuffledWords,
//     selectedWords: [],
//     solvedGroups: [],
//     attempts: 4,
//     message: 'Find groups of 4 connected words',
//     gameState: 'playing',
//     mistakes: [],
//     startTime: new Date(),
//     actionsCount: 0
//   };
// };

// function connectionsReducer(state: ConnectionsState, action: ConnectionsAction): ConnectionsState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return { ...getInitialState(), startTime: new Date() };

//     case 'TOGGLE_WORD': {
//       const isSelected = state.selectedWords.includes(action.word);
//       let newSelectedWords: string[];

//       if (isSelected) {
//         newSelectedWords = state.selectedWords.filter(w => w !== action.word);
//       } else if (state.selectedWords.length < 4) {
//         newSelectedWords = [...state.selectedWords, action.word];
//       } else {
//         return state;
//       }

//       return {
//         ...state,
//         selectedWords: newSelectedWords,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'SHUFFLE_WORDS': {
//       const availableWords = state.allWords.filter(word =>
//         !state.solvedGroups.some(group => group.words.includes(word))
//       );
//       const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);

//       const newAllWords = [...state.allWords];
//       availableWords.forEach((word, index) => {
//         const originalIndex = newAllWords.indexOf(word);
//         newAllWords[originalIndex] = shuffledWords[index];
//       });

//       return {
//         ...state,
//         allWords: newAllWords,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'CLEAR_SELECTION':
//       return {
//         ...state,
//         selectedWords: [],
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SUBMIT_GUESS': {
//       if (state.selectedWords.length !== 4 || state.gameState !== 'playing') {
//         return state;
//       }

//       const selectedSet = new Set(state.selectedWords);
//       const correctGroup = state.currentPuzzle.find(group =>
//         group.words.every(word => selectedSet.has(word)) &&
//         selectedSet.size === group.words.length
//       );

//       if (correctGroup) {
//         const newSolvedGroups = [...state.solvedGroups, correctGroup];
//         const isGameWon = newSolvedGroups.length === state.currentPuzzle.length;

//         return {
//           ...state,
//           selectedWords: [],
//           solvedGroups: newSolvedGroups,
//           message: isGameWon ? 'Congratulations! You solved all groups!' : `Found ${correctGroup.category}!`,
//           gameState: isGameWon ? 'won' : 'playing',
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         const newAttempts = state.attempts - 1;
//         const newMistakes = [...state.mistakes, [...state.selectedWords]];
//         const isGameLost = newAttempts === 0;

//         return {
//           ...state,
//           selectedWords: [],
//           attempts: newAttempts,
//           mistakes: newMistakes,
//           message: isGameLost ? 'Game Over! Better luck next time!' : `Incorrect. ${newAttempts} attempts remaining.`,
//           gameState: isGameLost ? 'lost' : 'playing',
//           actionsCount: state.actionsCount + 1
//         };
//       }
//     }

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function Connections({ onGameEnd }: ConnectionsProps) {
//   const [state, dispatch] = useReducer(connectionsReducer, getInitialState());

//   // Calculate elapsed time
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - state.startTime.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (state.gameState === 'won') {
//     onGameEnd?.(true, getElapsedTime());
//   } else if (state.gameState === 'lost') {
//     onGameEnd?.(false, getElapsedTime());
//   }

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getMistakeColor = (attempt: number): string => {
//     const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
//     return colors[4 - attempt] || 'bg-gray-300';
//   };

//   const isWordSolved = (word: string): boolean => {
//     return state.solvedGroups.some(group => group.words.includes(word));
//   };

//   const getSolvedGroupForWord = (word: string): ConnectionGroup | undefined => {
//     return state.solvedGroups.find(group => group.words.includes(word));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Connections</h1>
//                 <p className="text-green-100">Find groups of 4 connected words</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{state.attempts}</div>
//                 <p className="text-sm text-green-100">Attempts</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-green-100">Time</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex gap-2">
//             {Array.from({ length: 4 }, (_, i) => (
//               <div
//                 key={i}
//                 className={`h-2 flex-1 rounded-full ${
//                   i < state.attempts ? 'bg-white' : getMistakeColor(i + 1)
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="text-center mb-6">
//             <p className="text-gray-600 mb-4">{state.message}</p>
//           </div>

//           <div className="space-y-4 mb-6">
//             {state.solvedGroups.map((group, index) => (
//               <motion.div
//                 key={group.category}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`${group.color} rounded-lg p-4`}
//               >
//                 <div className="text-center">
//                   <h3 className="font-bold text-lg text-white mb-2">{group.category}</h3>
//                   <div className="flex justify-center gap-2 flex-wrap">
//                     {group.words.map(word => (
//                       <span key={word} className="bg-white/20 text-white px-3 py-1 rounded text-sm font-medium">
//                         {word}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <div className="grid grid-cols-4 gap-3 mb-6">
//             {state.allWords.map((word, index) => {
//               const solved = isWordSolved(word);
//               const selected = state.selectedWords.includes(word);
//               const solvedGroup = getSolvedGroupForWord(word);

//               if (solved && solvedGroup) {
//                 return <div key={word} />; // Empty placeholder for solved words
//               }

//               return (
//                 <motion.button
//                   key={word}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: index * 0.02 }}
//                   onClick={() => dispatch({ type: 'TOGGLE_WORD', word })}
//                   disabled={state.gameState !== 'playing'}
//                   className={`
//                     p-4 rounded-lg border-2 font-bold text-sm transition-all duration-200
//                     ${selected
//                       ? 'bg-blue-100 border-blue-400 text-blue-800 scale-95'
//                       : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
//                     }
//                     ${state.gameState !== 'playing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
//                   `}
//                 >
//                   {word}
//                 </motion.button>
//               );
//             })}
//           </div>

//           <div className="flex justify-center gap-3 mb-6">
//             <button
//               onClick={() => dispatch({ type: 'SHUFFLE_WORDS' })}
//               disabled={state.gameState !== 'playing'}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Shuffle className="w-4 h-4" />
//               Shuffle
//             </button>
//             <button
//               onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
//               disabled={state.selectedWords.length === 0 || state.gameState !== 'playing'}
//               className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <X className="w-4 h-4" />
//               Clear
//             </button>
//             <button
//               onClick={() => dispatch({ type: 'SUBMIT_GUESS' })}
//               disabled={state.selectedWords.length !== 4 || state.gameState !== 'playing'}
//               className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Submit
//             </button>
//           </div>

//           {state.mistakes.length > 0 && (
//             <div className="bg-gray-50 rounded-xl p-4 mb-6">
//               <h3 className="font-bold mb-3">Previous Attempts</h3>
//               <div className="space-y-2">
//                 {state.mistakes.map((mistake, index) => (
//                   <div key={index} className="flex gap-2 text-sm">
//                     {mistake.map(word => (
//                       <span key={word} className="bg-red-100 text-red-800 px-2 py-1 rounded">
//                         {word}
//                       </span>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-center">
//             <button
//               onClick={() => dispatch({ type: 'INIT_GAME' })}
//               className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
//             >
//               <RotateCcw className="w-4 h-4" />
//               New Puzzle
//             </button>
//           </div>

//           <AnimatePresence>
//             {state.gameState !== 'playing' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`mt-6 text-center p-6 rounded-xl border ${
//                   state.gameState === 'won'
//                     ? 'bg-green-50 border-green-200'
//                     : 'bg-red-50 border-red-200'
//                 }`}
//               >
//                 {state.gameState === 'won' ? (
//                   <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                 ) : (
//                   <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                 )}
//                 <h2 className={`text-2xl font-bold mb-2 ${
//                   state.gameState === 'won' ? 'text-green-900' : 'text-red-900'
//                 }`}>
//                   {state.gameState === 'won' ? 'Congratulations!' : 'Game Over!'}
//                 </h2>
//                 <p className={`mb-4 ${
//                   state.gameState === 'won' ? 'text-green-700' : 'text-red-700'
//                 }`}>
//                   {state.gameState === 'won'
//                     ? `You solved all groups in ${formatTime(getElapsedTime())}!`
//                     : `Better luck next time! You solved ${state.solvedGroups.length} out of ${state.currentPuzzle.length} groups.`
//                   }
//                 </p>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className={`px-6 py-3 text-white rounded-lg transition-colors font-semibold ${
//                     state.gameState === 'won'
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   Play Again
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }