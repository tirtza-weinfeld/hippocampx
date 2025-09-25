// 'use client';

// import { useReducer, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { ArrowRight, RotateCcw, Target, CheckCircle, X } from 'lucide-react';
// import { isValidWord } from '../shared/utils';
// import { COMMON_WORDS } from '../shared/word-lists';

// interface WordChainsProps {
//   onGameEnd?: (chainLength: number, timeElapsed: number) => void;
// }

// interface GameState {
//   wordChain: string[];
//   currentInput: string;
//   message: string;
//   startTime: Date;
//   actionsCount: number;
//   gameState: 'playing' | 'ended';
//   targetLength: number;
//   usedWords: Set<string>;
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'SET_INPUT'; value: string }
//   | { type: 'SUBMIT_WORD' }
//   | { type: 'REMOVE_LAST_WORD' }
//   | { type: 'GIVE_UP' }
//   | { type: 'INCREMENT_ACTIONS' };

// const getInitialState = (): GameState => {
//   const startingWords = ['CAT', 'DOG', 'SUN', 'MOON', 'TREE', 'FISH', 'BIRD', 'STAR'];
//   const startWord = startingWords[Math.floor(Math.random() * startingWords.length)];
//   const targetLength = Math.floor(Math.random() * 5) + 8;

//   return {
//     wordChain: [startWord],
//     currentInput: '',
//     message: `Starting with "${startWord}". Next word must start with "${startWord[startWord.length - 1]}"`,
//     startTime: new Date(),
//     actionsCount: 0,
//     gameState: 'playing',
//     targetLength,
//     usedWords: new Set([startWord.toLowerCase()])
//   };
// };

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return { ...getInitialState(), startTime: new Date() };

//     case 'SET_INPUT':
//       return {
//         ...state,
//         currentInput: action.value.toUpperCase(),
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SUBMIT_WORD': {
//       const word = state.currentInput.trim();

//       if (word.length < 2) {
//         return {
//           ...state,
//           message: 'Words must be at least 2 letters long',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (state.usedWords.has(word.toLowerCase())) {
//         return {
//           ...state,
//           message: 'Word already used in this chain!',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const lastWord = state.wordChain[state.wordChain.length - 1];
//       const expectedFirstLetter = lastWord[lastWord.length - 1];

//       if (word[0] !== expectedFirstLetter) {
//         return {
//           ...state,
//           message: `Word must start with "${expectedFirstLetter}"`,
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (!isValidWord(word, COMMON_WORDS)) {
//         return {
//           ...state,
//           message: 'Not a valid word',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const newChain = [...state.wordChain, word];
//       const newUsedWords = new Set([...state.usedWords, word.toLowerCase()]);

//       if (newChain.length >= state.targetLength) {
//         return {
//           ...state,
//           wordChain: newChain,
//           usedWords: newUsedWords,
//           currentInput: '',
//           gameState: 'ended',
//           message: `🎉 Excellent! Chain completed with ${newChain.length} words!`,
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         const nextLetter = word[word.length - 1];
//         return {
//           ...state,
//           wordChain: newChain,
//           usedWords: newUsedWords,
//           currentInput: '',
//           message: `Great! Next word must start with "${nextLetter}"`,
//           actionsCount: state.actionsCount + 1
//         };
//       }
//     }

//     case 'REMOVE_LAST_WORD': {
//       if (state.wordChain.length > 1) {
//         const newChain = state.wordChain.slice(0, -1);
//         const removedWord = state.wordChain[state.wordChain.length - 1];
//         const newUsedWords = new Set(state.usedWords);
//         newUsedWords.delete(removedWord.toLowerCase());

//         const lastWord = newChain[newChain.length - 1];
//         return {
//           ...state,
//           wordChain: newChain,
//           usedWords: newUsedWords,
//           message: `Removed "${removedWord}". Next word must start with "${lastWord[lastWord.length - 1]}"`,
//           actionsCount: state.actionsCount + 1
//         };
//       }
//       return state;
//     }

//     case 'GIVE_UP':
//       return {
//         ...state,
//         gameState: 'ended',
//         message: `Chain ended with ${state.wordChain.length} words. Try again!`,
//         actionsCount: state.actionsCount + 1
//       };

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function WordChains({ onGameEnd }: WordChainsProps) {
//   const [gameState, dispatch] = useReducer(gameReducer, getInitialState());
//   const gameEndCalledRef = useRef(false);

//   // Calculate elapsed time based on actions instead of real-time timer
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   };

//   // Game completion effect - only call once
//   useEffect(() => {
//     if (gameState.gameState === 'ended' && !gameEndCalledRef.current) {
//       gameEndCalledRef.current = true;
//       onGameEnd?.(gameState.wordChain.length, getElapsedTime());
//     }
//     if (gameState.gameState === 'playing') {
//       gameEndCalledRef.current = false;
//     }
//   }, [gameState.gameState, gameState.wordChain.length, onGameEnd]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       dispatch({ type: 'SUBMIT_WORD' });
//     }
//   };

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getChainScore = (): string => {
//     const length = gameState.wordChain.length;
//     if (length >= gameState.targetLength) return 'Excellent!';
//     if (length >= gameState.targetLength * 0.8) return 'Great!';
//     if (length >= gameState.targetLength * 0.6) return 'Good!';
//     if (length >= gameState.targetLength * 0.4) return 'Nice try!';
//     return 'Keep practicing!';
//   };

//   const nextLetter = gameState.wordChain.length > 0 ? gameState.wordChain[gameState.wordChain.length - 1][gameState.wordChain[gameState.wordChain.length - 1].length - 1] : '';

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-[to_right,theme(colors.cyan.600),theme(colors.blue.600)] text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Word Chains</h1>
//                 <p className="text-cyan-100">Connect words by their last letter</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{gameState.wordChain.length}/{gameState.targetLength}</div>
//                 <p className="text-sm text-cyan-100">Words</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-cyan-100">Time</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 bg-white/20 rounded-full h-2">
//             <div
//               className="bg-white rounded-full h-2 transition-all duration-500"
//               style={{ width: `${Math.min((gameState.wordChain.length / gameState.targetLength) * 100, 100)}%` }}
//             />
//           </div>
//         </div>

//         <div className="p-6">

//           <div className="text-center mb-6">
//             <p className="text-gray-600 mb-4">{gameState.message}</p>
//             {gameState.gameState === 'playing' && nextLetter && (
//               <div className="text-lg font-semibold text-blue-600 mb-4">
//                 Next word starts with: <span className="text-2xl font-bold">{nextLetter}</span>
//               </div>
//             )}
//           </div>

//           <div className="mb-6">
//             <div className="flex flex-wrap items-center gap-2 justify-center">
//               {gameState.wordChain.map((word, index) => (
//                 <div key={index} className="flex items-center">
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="relative bg-blue-100 border-2 border-blue-300 rounded-lg px-4 py-2 font-bold text-blue-800"
//                   >
//                     {word}
//                     {index === gameState.wordChain.length - 1 && index > 0 && gameState.gameState === 'playing' && (
//                       <button
//                         onClick={() => dispatch({ type: 'REMOVE_LAST_WORD' })}
//                         className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
//                         title="Remove this word"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     )}
//                   </motion.div>
//                   {index < gameState.wordChain.length - 1 && (
//                     <ArrowRight className="w-5 h-5 text-gray-400 mx-1" />
//                   )}
//                 </div>
//               ))}

//               {gameState.gameState === 'playing' && (
//                 <div className="flex items-center">
//                   <ArrowRight className="w-5 h-5 text-gray-400 mx-1" />
//                   <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={gameState.currentInput}
//                       onChange={(e) => dispatch({ type: 'SET_INPUT', value: e.target.value })}
//                       onKeyDown={handleKeyDown}
//                       placeholder="?"
//                       className="bg-transparent outline-none text-center font-bold text-gray-700 w-full"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {gameState.gameState === 'playing' && (
//             <div className="flex justify-center gap-3 mb-6">
//               <button
//                 onClick={() => dispatch({ type: 'SUBMIT_WORD' })}
//                 disabled={gameState.currentInput.length < 2}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
//               >
//                 Add Word
//               </button>
//               <button
//                 onClick={() => dispatch({ type: 'GIVE_UP' })}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Give Up
//               </button>
//             </div>
//           )}

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-bold mb-4">Chain Progress</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Current Length:</span>
//                   <span className="font-semibold">{gameState.wordChain.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Target Length:</span>
//                   <span className="font-semibold">{gameState.targetLength}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Progress:</span>
//                   <span className="font-semibold">
//                     {Math.min(Math.round((gameState.wordChain.length / gameState.targetLength) * 100), 100)}%
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Words Used:</span>
//                   <span className="font-semibold">{gameState.usedWords.size}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-bold mb-4">Rules</h3>
//               <div className="text-sm text-gray-600 space-y-2">
//                 <p>• Each word must start with the last letter of the previous word</p>
//                 <p>• Words must be at least 2 letters long</p>
//                 <p>• Cannot reuse words in the same chain</p>
//                 <p>• Try to reach the target length!</p>
//                 <p>• All words must be valid English words</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               onClick={() => dispatch({ type: 'INIT_GAME' })}
//               className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
//             >
//               <RotateCcw className="w-4 h-4" />
//               New Chain
//             </button>
//           </div>

//           <AnimatePresence>
//             {gameState.gameState === 'ended' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-8 text-center p-6 bg-blue-50 rounded-xl border border-blue-200"
//               >
//                 <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-blue-900 mb-2">{getChainScore()}</h2>
//                 <p className="text-blue-700 mb-2">
//                   Your chain reached {gameState.wordChain.length} word{gameState.wordChain.length === 1 ? '' : 's'}!
//                 </p>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Time: {formatTime(getElapsedTime())} | Target: {gameState.targetLength} words
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-1 mb-4">
//                   {gameState.wordChain.map((word, index) => (
//                     <span key={index} className="text-sm bg-blue-100 px-2 py-1 rounded">
//                       {word}
//                     </span>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//                 >
//                   Start New Chain
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }