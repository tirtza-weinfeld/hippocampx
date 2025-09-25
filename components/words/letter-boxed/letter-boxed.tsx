// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { RotateCcw, Trophy, Target, CheckCircle } from 'lucide-react';

// interface LetterBoxedProps {
//   onGameEnd?: (success: boolean, wordsUsed: number) => void;
// }

// interface GameState {
//   sides: string[][];
//   foundWords: string[];
//   currentWord: string;
//   selectedLetters: Array<{ letter: string; side: number; index: number }>;
//   targetWordCount: number;
//   isComplete: boolean;
//   message: string;
//   validWords: string[];
//   usedLetters: Set<string>;
//   startTime: Date;
//   actionsCount: number;
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'ADD_LETTER'; letter: string; side: number; index: number }
//   | { type: 'REMOVE_LETTER' }
//   | { type: 'CLEAR_WORD' }
//   | { type: 'SUBMIT_WORD' }
//   | { type: 'INCREMENT_ACTIONS' };

// const SAMPLE_SIDES = [
//   ['A', 'B', 'C'],
//   ['D', 'E', 'F'],
//   ['G', 'H', 'I'],
//   ['J', 'K', 'L']
// ];

// const SAMPLE_VALID_WORDS = ['CAB', 'BAD', 'DAB', 'FAD', 'GAB', 'HAD', 'JAB', 'LAB'];

// const getInitialState = (): GameState => ({
//   sides: SAMPLE_SIDES,
//   foundWords: [],
//   currentWord: '',
//   selectedLetters: [],
//   targetWordCount: 5,
//   isComplete: false,
//   message: 'Connect letters from different sides to form words',
//   validWords: SAMPLE_VALID_WORDS,
//   usedLetters: new Set(),
//   startTime: new Date(),
//   actionsCount: 0
// });

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return { ...getInitialState(), startTime: new Date() };

//     case 'ADD_LETTER': {
//       // Check if letter can be added (different side from last letter)
//       const lastLetter = state.selectedLetters[state.selectedLetters.length - 1];
//       if (lastLetter && lastLetter.side === action.side) {
//         return {
//           ...state,
//           message: 'Cannot select consecutive letters from the same side',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const newSelectedLetters = [...state.selectedLetters, { letter: action.letter, side: action.side, index: action.index }];
//       const newCurrentWord = state.currentWord + action.letter;

//       return {
//         ...state,
//         selectedLetters: newSelectedLetters,
//         currentWord: newCurrentWord,
//         message: 'Connect letters from different sides to form words',
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'REMOVE_LETTER': {
//       if (state.selectedLetters.length === 0) return state;

//       const newSelectedLetters = state.selectedLetters.slice(0, -1);
//       const newCurrentWord = state.currentWord.slice(0, -1);

//       return {
//         ...state,
//         selectedLetters: newSelectedLetters,
//         currentWord: newCurrentWord,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'CLEAR_WORD':
//       return {
//         ...state,
//         selectedLetters: [],
//         currentWord: '',
//         message: 'Connect letters from different sides to form words',
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SUBMIT_WORD': {
//       if (state.currentWord.length < 3) {
//         return {
//           ...state,
//           message: 'Words must be at least 3 letters long',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (state.foundWords.includes(state.currentWord)) {
//         return {
//           ...state,
//           message: 'Word already found!',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (!state.validWords.includes(state.currentWord)) {
//         return {
//           ...state,
//           message: 'Not a valid word',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       // Check if all letters are used
//       const newUsedLetters = new Set(state.usedLetters);
//       state.selectedLetters.forEach(sel => newUsedLetters.add(sel.letter));

//       const allLetters = state.sides.flat();
//       const allLettersUsed = allLetters.every(letter => newUsedLetters.has(letter));

//       const newFoundWords = [...state.foundWords, state.currentWord];
//       const isComplete = allLettersUsed || newFoundWords.length >= state.targetWordCount;

//       return {
//         ...state,
//         foundWords: newFoundWords,
//         currentWord: '',
//         selectedLetters: [],
//         usedLetters: newUsedLetters,
//         isComplete,
//         message: isComplete ? 'Congratulations! Puzzle solved!' : `Great! Found "${state.currentWord}"`,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function LetterBoxed({ onGameEnd }: LetterBoxedProps) {
//   const [gameState, dispatch] = useReducer(gameReducer, getInitialState());

//   // Calculate elapsed time
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (gameState.isComplete) {
//     onGameEnd?.(true, gameState.foundWords.length);
//   }

//   const handleLetterClick = (letter: string, side: number, index: number): void => {
//     dispatch({ type: 'ADD_LETTER', letter, side, index });
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       dispatch({ type: 'SUBMIT_WORD' });
//     } else if (e.key === 'Backspace') {
//       e.preventDefault();
//       dispatch({ type: 'REMOVE_LETTER' });
//     } else if (e.key === 'Escape') {
//       e.preventDefault();
//       dispatch({ type: 'CLEAR_WORD' });
//     }
//   };

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getLetterOpacity = (letter: string, sideIndex: number): number => {
//     const lastSelection = gameState.selectedLetters[gameState.selectedLetters.length - 1];

//     if (gameState.selectedLetters.length === 0) return 1;

//     // Can't select from same side as last selection
//     if (lastSelection && lastSelection.side === sideIndex) return 0.3;

//     // Already used letters have reduced opacity
//     if (gameState.usedLetters.has(letter)) return 0.6;

//     return 1;
//   };

//   const isLetterSelectable = (sideIndex: number): boolean => {
//     if (gameState.selectedLetters.length === 0) return true;
//     const lastSelection = gameState.selectedLetters[gameState.selectedLetters.length - 1];
//     return lastSelection.side !== sideIndex;
//   };

//   const progress = (gameState.usedLetters.size / gameState.sides.flat().length) * 100;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-[to_right,theme(colors.purple.600),theme(colors.pink.600)] text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Letter Boxed</h1>
//                 <p className="text-purple-100">Connect letters from different sides</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{gameState.foundWords.length}</div>
//                 <p className="text-sm text-purple-100">Words</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-purple-100">Time</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 bg-white/20 rounded-full h-2">
//             <div
//               className="bg-white rounded-full h-2 transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="text-center mb-6">
//             <p className="text-gray-600 mb-4">{gameState.message}</p>

//             <div className="relative">
//               <div className="w-80 h-80 mx-auto relative border-4 border-gray-300 rounded-lg">
//                 {gameState.sides.map((side, sideIndex) => {
//                   const positions = [
//                     { top: '10px', left: '50%', transform: 'translateX(-50%)' }, // top
//                     { right: '10px', top: '50%', transform: 'translateY(-50%)' }, // right
//                     { bottom: '10px', left: '50%', transform: 'translateX(-50%)' }, // bottom
//                     { left: '10px', top: '50%', transform: 'translateY(-50%)' } // left
//                   ];

//                   return (
//                     <div key={sideIndex} className="absolute" style={positions[sideIndex]}>
//                       <div className="flex gap-2">
//                         {side.map((letter, letterIndex) => (
//                           <motion.button
//                             key={`${sideIndex}-${letterIndex}`}
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleLetterClick(letter, sideIndex, letterIndex)}
//                             disabled={!isLetterSelectable(sideIndex)}
//                             className={`
//                               w-12 h-12 rounded-full border-2 font-bold text-lg transition-all
//                               ${isLetterSelectable(sideIndex)
//                                 ? 'bg-purple-100 border-purple-300 hover:bg-purple-200 cursor-pointer'
//                                 : 'bg-gray-100 border-gray-300 cursor-not-allowed'
//                               }
//                             `}
//                             style={{ opacity: getLetterOpacity(letter, sideIndex) }}
//                           >
//                             {letter}
//                           </motion.button>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* Connection lines */}
//                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                   {gameState.selectedLetters.map((selection, index) => {
//                     if (index === 0) return null;

//                     const prev = gameState.selectedLetters[index - 1];
//                     const curr = selection;

//                     // Calculate positions (simplified)
//                     const positions = [
//                       { x: 160, y: 30 }, // top center
//                       { x: 290, y: 160 }, // right center
//                       { x: 160, y: 290 }, // bottom center
//                       { x: 30, y: 160 } // left center
//                     ];

//                     const start = positions[prev.side];
//                     const end = positions[curr.side];

//                     return (
//                       <motion.line
//                         key={index}
//                         x1={start.x}
//                         y1={start.y}
//                         x2={end.x}
//                         y2={end.y}
//                         stroke="#8b5cf6"
//                         strokeWidth="3"
//                         initial={{ pathLength: 0 }}
//                         animate={{ pathLength: 1 }}
//                         transition={{ duration: 0.3 }}
//                       />
//                     );
//                   })}
//                 </svg>
//               </div>
//             </div>

//             <div className="mt-6">
//               <div className="bg-gray-100 rounded-lg p-4 min-h-[60px] flex items-center justify-center mb-4">
//                 <input
//                   type="text"
//                   value={gameState.currentWord || 'Click letters to form words...'}
//                   onKeyDown={handleKeyDown}
//                   readOnly
//                   className="text-2xl font-mono tracking-wider bg-transparent border-none outline-none text-center w-full"
//                   autoFocus
//                 />
//               </div>

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => dispatch({ type: 'REMOVE_LETTER' })}
//                   disabled={gameState.selectedLetters.length === 0}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'CLEAR_WORD' })}
//                   disabled={gameState.selectedLetters.length === 0}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'SUBMIT_WORD' })}
//                   disabled={gameState.currentWord.length < 3}
//                   className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-bold mb-4">Found Words</h3>
//               <div className="space-y-2 max-h-40 overflow-y-auto">
//                 {gameState.foundWords.map((word, index) => (
//                   <motion.div
//                     key={word}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="flex items-center gap-2 p-2 bg-green-100 rounded-lg"
//                   >
//                     <CheckCircle className="w-4 h-4 text-green-600" />
//                     <span className="font-mono font-bold text-green-800">{word}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">Progress</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">Letters Used:</span>
//                     <span className="text-sm font-bold">{gameState.usedLetters.size}/{gameState.sides.flat().length}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-purple-500 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">Rules</h3>
//                 <div className="text-sm text-gray-600 space-y-2">
//                   <p>• Click letters around the box to form words</p>
//                   <p>• Cannot use consecutive letters from the same side</p>
//                   <p>• Words must be at least 3 letters long</p>
//                   <p>• Try to use all letters to complete the puzzle</p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => dispatch({ type: 'INIT_GAME' })}
//                 className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 <RotateCcw className="w-4 h-4" />
//                 New Puzzle
//               </button>
//             </div>
//           </div>

//           <AnimatePresence>
//             {gameState.isComplete && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-8 text-center p-6 bg-green-50 rounded-xl border border-green-200"
//               >
//                 <Trophy className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-green-900 mb-2">Excellent Work!</h2>
//                 <p className="text-green-700 mb-4">
//                   You completed the puzzle in {formatTime(getElapsedTime())} using {gameState.foundWords.length} words!
//                 </p>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
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