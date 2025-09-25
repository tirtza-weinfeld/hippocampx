// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Lightbulb, RotateCcw, CheckCircle, Eye, EyeOff } from 'lucide-react';

// interface AcrosticClue {
//   number: number;
//   clue: string;
//   answer: string;
//   letterPositions: number[];
// }

// interface AcrosticPuzzle {
//   title: string;
//   quote: string;
//   author: string;
//   clues: AcrosticClue[];
//   quoteLetters: string[];
// }

// interface AcrosticsProps {
//   onGameEnd?: (completed: boolean, timeElapsed: number) => void;
// }

// const SAMPLE_PUZZLE: AcrosticPuzzle = {
//   title: "Famous Quote",
//   quote: "TO BE OR NOT TO BE THAT IS THE QUESTION",
//   author: "SHAKESPEARE",
//   quoteLetters: ["T", "O", " ", "B", "E", " ", "O", "R", " ", "N", "O", "T", " ", "T", "O", " ", "B", "E", " ", "T", "H", "A", "T", " ", "I", "S", " ", "T", "H", "E", " ", "Q", "U", "E", "S", "T", "I", "O", "N"],
//   clues: [
//     {
//       number: 1,
//       clue: "England's greatest playwright",
//       answer: "SHAKESPEARE",
//       letterPositions: [26, 20, 0, 33, 28, 26, 37, 28, 0, 32, 28]
//     },
//     {
//       number: 2,
//       clue: "Opposite of yes",
//       answer: "NO",
//       letterPositions: [9, 10]
//     },
//     {
//       number: 3,
//       clue: "Inquiry or doubt",
//       answer: "QUESTION",
//       letterPositions: [31, 32, 33, 34, 35, 36, 37, 38]
//     }
//   ]
// };

// interface GameState {
//   puzzle: AcrosticPuzzle;
//   clueAnswers: Record<number, string>;
//   quoteSolution: string[];
//   selectedClue: number | null;
//   showQuote: boolean;
//   startTime: Date;
//   actionsCount: number;
//   gameStatus: 'playing' | 'completed';
//   hintsUsed: number;
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'SET_CLUE_INPUT'; clueNumber: number; value: string }
//   | { type: 'SELECT_CLUE'; clueNumber: number | null }
//   | { type: 'TOGGLE_QUOTE_VISIBILITY' }
//   | { type: 'REVEAL_CLUE'; clueNumber: number }
//   | { type: 'INCREMENT_ACTIONS' };

// const initialGameState: GameState = {
//   puzzle: SAMPLE_PUZZLE,
//   clueAnswers: {},
//   quoteSolution: new Array(SAMPLE_PUZZLE.quoteLetters.length).fill(''),
//   selectedClue: null,
//   showQuote: false,
//   startTime: new Date(),
//   actionsCount: 0,
//   gameStatus: 'playing',
//   hintsUsed: 0
// };

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return {
//         ...initialGameState,
//         startTime: new Date()
//       };

//     case 'SET_CLUE_INPUT': {
//       const sanitizedValue = action.value.toUpperCase().replace(/[^A-Z]/g, '');
//       const newClueAnswers = { ...state.clueAnswers, [action.clueNumber]: sanitizedValue };

//       // Update quote solution from all clues
//       const newQuoteSolution = new Array(state.puzzle.quoteLetters.length).fill('');
//       state.puzzle.clues.forEach(clue => {
//         const answer = newClueAnswers[clue.number] || '';
//         clue.letterPositions.forEach((position, index) => {
//           if (index < answer.length) {
//             newQuoteSolution[position] = answer[index];
//           }
//         });
//       });

//       // Check completion
//       const isComplete = state.puzzle.clues.every(clue => {
//         const userAnswer = newClueAnswers[clue.number] || '';
//         return userAnswer === clue.answer;
//       });

//       return {
//         ...state,
//         clueAnswers: newClueAnswers,
//         quoteSolution: newQuoteSolution,
//         gameStatus: isComplete ? 'completed' : 'playing',
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'SELECT_CLUE':
//       return { ...state, selectedClue: action.clueNumber };

//     case 'TOGGLE_QUOTE_VISIBILITY':
//       return {
//         ...state,
//         showQuote: !state.showQuote,
//         hintsUsed: !state.showQuote ? state.hintsUsed + 1 : state.hintsUsed
//       };

//     case 'REVEAL_CLUE': {
//       const clue = state.puzzle.clues.find(c => c.number === action.clueNumber);
//       if (!clue) return state;

//       const newClueAnswers = { ...state.clueAnswers, [action.clueNumber]: clue.answer };

//       // Update quote solution
//       const newQuoteSolution = new Array(state.puzzle.quoteLetters.length).fill('');
//       state.puzzle.clues.forEach(clue => {
//         const answer = newClueAnswers[clue.number] || '';
//         clue.letterPositions.forEach((position, index) => {
//           if (index < answer.length) {
//             newQuoteSolution[position] = answer[index];
//           }
//         });
//       });

//       // Check completion
//       const isComplete = state.puzzle.clues.every(clue => {
//         const userAnswer = newClueAnswers[clue.number] || '';
//         return userAnswer === clue.answer;
//       });

//       return {
//         ...state,
//         clueAnswers: newClueAnswers,
//         quoteSolution: newQuoteSolution,
//         hintsUsed: state.hintsUsed + 1,
//         gameStatus: isComplete ? 'completed' : 'playing',
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function Acrostics({ onGameEnd }: AcrosticsProps) {
//   const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

//   // Calculate elapsed time based on actions instead of real-time timer
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (gameState.gameStatus === 'completed') {
//     onGameEnd?.(true, getElapsedTime());
//   }

//   const handleClueInput = (clueNumber: number, value: string): void => {
//     dispatch({ type: 'SET_CLUE_INPUT', clueNumber, value });
//   };

//   const toggleQuoteVisibility = (): void => {
//     dispatch({ type: 'TOGGLE_QUOTE_VISIBILITY' });
//   };

//   const revealClue = (clueNumber: number): void => {
//     dispatch({ type: 'REVEAL_CLUE', clueNumber });
//   };

//   const initGame = (): void => {
//     dispatch({ type: 'INIT_GAME' });
//   };

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getClueProgress = (clue: AcrosticClue): number => {
//     const userAnswer = gameState.clueAnswers[clue.number] || '';
//     return (userAnswer.length / clue.answer.length) * 100;
//   };

//   const renderQuoteLine = () => {
//     const words: React.JSX.Element[] = [];
//     let currentWord: React.JSX.Element[] = [];
//     let wordIndex = 0;

//     gameState.puzzle.quoteLetters.forEach((letter, index) => {
//       if (letter === ' ') {
//         if (currentWord.length > 0) {
//           words.push(
//             <div key={wordIndex} className="flex gap-1">
//               {currentWord}
//             </div>
//           );
//           currentWord = [];
//           wordIndex++;
//         }
//       } else {
//         const userLetter = gameState.quoteSolution[index];
//         const isCorrect = userLetter === letter;

//         currentWord.push(
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             className={`
//               w-8 h-8 border-2 flex items-center justify-center text-lg font-bold
//               ${isCorrect ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white border-gray-300'}
//             `}
//           >
//             {gameState.showQuote ? letter : userLetter}
//           </motion.div>
//         );
//       }
//     });

//     if (currentWord.length > 0) {
//       words.push(
//         <div key={wordIndex} className="flex gap-1">
//           {currentWord}
//         </div>
//       );
//     }

//     return words;
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-[to_right,theme(colors.purple.600),theme(colors.indigo.600)] text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <div className="text-2xl font-bold">A</div>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Acrostics</h1>
//                 <p className="text-purple-100">Solve clues to reveal the quote</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-purple-100">Time</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{gameState.hintsUsed}</div>
//                 <p className="text-sm text-purple-100">Hints</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold">Quote</h2>
//               <button
//                 onClick={toggleQuoteVisibility}
//                 className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
//               >
//                 {gameState.showQuote ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 {gameState.showQuote ? 'Hide' : 'Reveal'} Quote
//               </button>
//             </div>
//             <div className="bg-gray-50 rounded-xl p-6">
//               <div className="flex flex-wrap gap-2 justify-center">
//                 {renderQuoteLine()}
//               </div>
//               <div className="text-center mt-4 text-gray-600">
//                 — {gameState.showQuote ? gameState.puzzle.author : '???'}
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-bold">Clues</h3>
//               {gameState.puzzle.clues.map(clue => {
//                 const progress = getClueProgress(clue);
//                 const isSelected = gameState.selectedClue === clue.number;
//                 const userAnswer = gameState.clueAnswers[clue.number] || '';
//                 const isComplete = userAnswer === clue.answer;

//                 return (
//                   <motion.div
//                     key={clue.number}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: clue.number * 0.1 }}
//                     className={`p-4 rounded-xl border-2 transition-all ${
//                       isSelected ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="font-bold text-purple-600">{clue.number}.</span>
//                           <span className="text-gray-700">{clue.clue}</span>
//                           {isComplete && <CheckCircle className="w-5 h-5 text-green-500" />}
//                         </div>
//                         <input
//                           type="text"
//                           value={userAnswer}
//                           onChange={(e) => handleClueInput(clue.number, e.target.value)}
//                           onFocus={() => dispatch({ type: 'SELECT_CLUE', clueNumber: clue.number })}
//                           onBlur={() => dispatch({ type: 'SELECT_CLUE', clueNumber: null })}
//                           placeholder={`${clue.answer.length} letters`}
//                           maxLength={clue.answer.length}
//                           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-lg"
//                         />
//                       </div>
//                       <button
//                         onClick={() => revealClue(clue.number)}
//                         disabled={isComplete}
//                         className="ml-2 p-1 text-yellow-600 hover:text-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Reveal answer"
//                       >
//                         <Lightbulb className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-purple-500 transition-all duration-300"
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold mb-3">Progress</h3>
//                 <div className="space-y-2">
//                   {gameState.puzzle.clues.map(clue => {
//                     const userAnswer = gameState.clueAnswers[clue.number] || '';
//                     const isComplete = userAnswer === clue.answer;
//                     const progress = getClueProgress(clue);

//                     return (
//                       <div key={clue.number} className="flex items-center gap-3">
//                         <span className="font-semibold text-sm w-6">{clue.number}.</span>
//                         <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className={`h-full transition-all duration-300 ${
//                               isComplete ? 'bg-green-500' : 'bg-purple-500'
//                             }`}
//                             style={{ width: `${progress}%` }}
//                           />
//                         </div>
//                         {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold mb-3">How to Play</h3>
//                 <div className="text-sm text-gray-600 space-y-2">
//                   <p>• Solve the clues to reveal letters in the quote</p>
//                   <p>• Each letter in your answer corresponds to a position in the quote</p>
//                   <p>• Use the quote visibility toggle as a hint</p>
//                   <p>• Complete all clues to solve the puzzle</p>
//                 </div>
//               </div>

//               <button
//                 onClick={initGame}
//                 className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 <RotateCcw className="w-4 h-4" />
//                 Reset Puzzle
//               </button>
//             </div>
//           </div>

//           <AnimatePresence>
//             {gameState.gameStatus === 'completed' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-8 text-center p-6 bg-green-50 rounded-xl border border-green-200"
//               >
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-green-900 mb-2">Excellent Work!</h2>
//                 <p className="text-green-700 mb-2">
//                   You solved the acrostic in {formatTime(getElapsedTime())}!
//                 </p>
//                 <p className="text-lg font-semibold text-gray-800 mb-4">
//                   &ldquo;{gameState.puzzle.quote}&rdquo; — {gameState.puzzle.author}
//                 </p>
//                 <button
//                   onClick={initGame}
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