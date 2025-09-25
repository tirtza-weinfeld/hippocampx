// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
// import { ArrowDown, RotateCcw, Target, CheckCircle, X, Lightbulb } from 'lucide-react';
// import { isValidWord } from '../shared/utils';
// import { FIVE_LETTER_WORDS } from '../shared/word-lists';

// interface WordLadderPuzzle {
//   startWord: string;
//   endWord: string;
//   minSteps: number;
// }

// interface WordLadderProps {
//   onGameEnd?: (completed: boolean, steps: number) => void;
// }

// const SAMPLE_PUZZLES = [
//   { startWord: 'COLD', endWord: 'WARM', minSteps: 4 },
//   { startWord: 'HEAD', endWord: 'TAIL', minSteps: 5 },
//   { startWord: 'DARK', endWord: 'MOON', minSteps: 6 },
//   { startWord: 'LOVE', endWord: 'HATE', minSteps: 3 },
//   { startWord: 'FAST', endWord: 'SLOW', minSteps: 4 }
// ] as const satisfies readonly WordLadderPuzzle[];

// interface GameState {
//   currentPuzzle: WordLadderPuzzle;
//   wordChain: string[];
//   currentInput: string;
//   message: string;
//   gameState: 'playing' | 'completed' | 'stuck';
//   startTime: Date;
//   actionsCount: number;
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'SET_INPUT'; value: string }
//   | { type: 'SUBMIT_WORD' }
//   | { type: 'REMOVE_LAST_WORD' }
//   | { type: 'GET_HINT' }
//   | { type: 'INCREMENT_ACTIONS' };

// function getInitialState(): GameState {
//   const puzzle = SAMPLE_PUZZLES[Math.floor(Math.random() * SAMPLE_PUZZLES.length)];
//   return {
//     currentPuzzle: puzzle,
//     wordChain: [puzzle.startWord],
//     currentInput: '',
//     message: `Transform ${puzzle.startWord} into ${puzzle.endWord} by changing one letter at a time`,
//     gameState: 'playing',
//     startTime: new Date(),
//     actionsCount: 0
//   };
// }

// function isOneLetterDifferent(word1: string, word2: string): boolean {
//   if (word1.length !== word2.length) return false;

//   let differences = 0;
//   for (let i = 0; i < word1.length; i++) {
//     if (word1[i] !== word2[i]) {
//       differences++;
//     }
//   }
//   return differences === 1;
// }

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME': {
//       const newState = getInitialState();
//       return { ...newState, startTime: new Date() };
//     }

//     case 'SET_INPUT':
//       return {
//         ...state,
//         currentInput: action.value.toUpperCase(),
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SUBMIT_WORD': {
//       const word = state.currentInput.trim();

//       if (word.length !== state.currentPuzzle.startWord.length) {
//         return {
//           ...state,
//           message: `Word must be ${state.currentPuzzle.startWord.length} letters long`,
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (state.wordChain.includes(word)) {
//         return {
//           ...state,
//           message: 'Word already used in this chain',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const lastWord = state.wordChain[state.wordChain.length - 1];

//       if (!isOneLetterDifferent(lastWord, word)) {
//         return {
//           ...state,
//           message: 'You can only change one letter at a time',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (!isValidWord(word, FIVE_LETTER_WORDS)) {
//         return {
//           ...state,
//           message: 'Not a valid word',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const newChain = [...state.wordChain, word];

//       if (word === state.currentPuzzle.endWord) {
//         return {
//           ...state,
//           wordChain: newChain,
//           currentInput: '',
//           gameState: 'completed',
//           message: `🎉 Success! You solved it in ${newChain.length - 1} steps!`,
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         return {
//           ...state,
//           wordChain: newChain,
//           currentInput: '',
//           message: 'Great! Keep going...',
//           actionsCount: state.actionsCount + 1
//         };
//       }
//     }

//     case 'REMOVE_LAST_WORD': {
//       if (state.wordChain.length > 1) {
//         return {
//           ...state,
//           wordChain: state.wordChain.slice(0, -1),
//           message: 'Removed last word',
//           actionsCount: state.actionsCount + 1
//         };
//       }
//       return state;
//     }

//     case 'GET_HINT': {
//       const lastWord = state.wordChain[state.wordChain.length - 1];
//       const differences: string[] = [];

//       for (let i = 0; i < lastWord.length; i++) {
//         if (lastWord[i] !== state.currentPuzzle.endWord[i]) {
//           differences.push(`Position ${i + 1}: change '${lastWord[i]}' to '${state.currentPuzzle.endWord[i]}'`);
//         }
//       }

//       if (differences.length > 0) {
//         const randomHint = differences[Math.floor(Math.random() * differences.length)];
//         return {
//           ...state,
//           message: `Hint: ${randomHint}`,
//           actionsCount: state.actionsCount + 1
//         };
//       }
//       return state;
//     }

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function WordLadder({ onGameEnd }: WordLadderProps): React.JSX.Element {
//   const [gameState, dispatch] = useReducer(gameReducer, getInitialState());
//   const shouldReduceMotion = useReducedMotion();

//   // Calculate elapsed time based on actions instead of real-time timer
//   function getElapsedTime(): number {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   }

//   // Game completion effect
//   if (gameState.gameState === 'completed') {
//     onGameEnd?.(true, gameState.wordChain.length - 1);
//   }

//   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       dispatch({ type: 'SUBMIT_WORD' });
//     }
//   }

//   function formatTime(seconds: number): string {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   }

//   function renderWordWithDifferences(word: string, compareWith: string): React.JSX.Element {
//     return (
//       <div className="flex gap-1">
//         {word.split('').map((letter, index) => {
//           const isDifferent = letter !== compareWith[index];
//           return (
//             <span
//               key={index}
//               className={`
//                 w-8 h-8 flex items-center justify-center border-2 rounded font-bold text-lg
//                 ${isDifferent
//                   ? 'bg-red-100 border-red-300 text-red-700'
//                   : 'bg-green-100 border-green-300 text-green-700'
//                 }
//               `}
//             >
//               {letter}
//             </span>
//           );
//         })}
//       </div>
//     );
//   }

//   function getStepRating(): string {
//     const steps = gameState.wordChain.length - 1;
//     if (steps <= gameState.currentPuzzle.minSteps) return 'Perfect!';
//     if (steps <= gameState.currentPuzzle.minSteps + 2) return 'Great!';
//     if (steps <= gameState.currentPuzzle.minSteps + 4) return 'Good!';
//     return 'Complete!';
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Word Ladder</h1>
//                 <p className="text-green-100">Change one letter at a time</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{gameState.wordChain.length - 1}</div>
//                 <p className="text-sm text-green-100">Steps</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-green-100">Time</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <input
//             type="text"
//             value={gameState.currentInput}
//             onChange={(e) => dispatch({ type: 'SET_INPUT', value: e.target.value })}
//             onKeyDown={handleKeyDown}
//             className="absolute opacity-0 pointer-events-none"
//             autoFocus
//           />

//           <div className="text-center mb-6">
//             <p className="text-gray-600 mb-4">{gameState.message}</p>
//             <div className="flex items-center justify-center gap-4 mb-4">
//               <div className="text-center">
//                 <div className="text-sm text-gray-500 mb-1">Start</div>
//                 <div className="font-mono text-2xl font-bold text-green-600">
//                   {gameState.currentPuzzle.startWord}
//                 </div>
//               </div>
//               <ArrowDown className="w-6 h-6 text-gray-400" />
//               <div className="text-center">
//                 <div className="text-sm text-gray-500 mb-1">Target</div>
//                 <div className="font-mono text-2xl font-bold text-blue-600">
//                   {gameState.currentPuzzle.endWord}
//                 </div>
//               </div>
//             </div>
//             <div className="text-sm text-gray-500">
//               Minimum steps: {gameState.currentPuzzle.minSteps}
//             </div>
//           </div>

//           <div className="space-y-3 mb-6">
//             {gameState.wordChain.map((word, index) => (
//               <motion.div
//                 key={index}
//                 initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
//                 animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
//                 transition={shouldReduceMotion ? {} : { delay: index * 0.1 }}
//                 className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
//               >
//                 <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
//                   {index === 0 ? 'S' : index}
//                 </div>
//                 <div className="font-mono text-xl font-bold flex-1">
//                   {word}
//                 </div>
//                 {index > 0 && index < gameState.wordChain.length && (
//                   <div className="text-sm">
//                     {renderWordWithDifferences(word, gameState.wordChain[index - 1])}
//                   </div>
//                 )}
//                 {index === gameState.wordChain.length - 1 && index > 0 && gameState.gameState === 'playing' && (
//                   <button
//                     onClick={() => dispatch({ type: 'REMOVE_LAST_WORD' })}
//                     className="p-1 text-red-600 hover:text-red-700"
//                     title="Remove this word"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </motion.div>
//             ))}

//             {gameState.gameState === 'playing' && (
//               <motion.div
//                 initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
//                 animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
//                 className="flex items-center gap-4 p-3 border-2 border-dashed border-gray-300 rounded-lg"
//               >
//                 <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
//                   {gameState.wordChain.length}
//                 </div>
//                 <input
//                   type="text"
//                   value={gameState.currentInput}
//                   onChange={(e) => dispatch({ type: 'SET_INPUT', value: e.target.value })}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Enter next word..."
//                   maxLength={gameState.currentPuzzle.startWord.length}
//                   className="flex-1 font-mono text-xl font-bold bg-transparent outline-none placeholder-gray-400"
//                 />
//                 <button
//                   onClick={() => dispatch({ type: 'SUBMIT_WORD' })}
//                   disabled={gameState.currentInput.length !== gameState.currentPuzzle.startWord.length}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Add
//                 </button>
//               </motion.div>
//             )}
//           </div>

//           <div className="flex justify-center gap-3 mb-6">
//             <button
//               onClick={() => dispatch({ type: 'GET_HINT' })}
//               disabled={gameState.gameState !== 'playing'}
//               className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <Lightbulb className="w-4 h-4" />
//               Hint
//             </button>
//             <button
//               onClick={() => dispatch({ type: 'INIT_GAME' })}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               <RotateCcw className="w-4 h-4" />
//               New Puzzle
//             </button>
//           </div>

//           <div className="bg-gray-50 rounded-xl p-4">
//             <h3 className="font-bold mb-3">Rules</h3>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p>• Change exactly one letter at a time</p>
//               <p>• Each step must form a valid word</p>
//               <p>• Cannot reuse words in the same chain</p>
//               <p>• Try to reach the target in minimum steps</p>
//             </div>
//           </div>

//           <AnimatePresence>
//             {gameState.gameState === 'completed' && (
//               <motion.div
//                 initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
//                 animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
//                 className="mt-6 text-center p-6 bg-green-50 rounded-xl border border-green-200"
//               >
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-green-900 mb-2">{getStepRating()}</h2>
//                 <p className="text-green-700 mb-2">
//                   You transformed {gameState.currentPuzzle.startWord} into {gameState.currentPuzzle.endWord} in {gameState.wordChain.length - 1} steps!
//                 </p>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Time: {formatTime(getElapsedTime())} | Target: {gameState.currentPuzzle.minSteps} steps
//                 </p>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
//                 >
//                   Try Another Puzzle
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }