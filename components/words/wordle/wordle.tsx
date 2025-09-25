// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
// import { Trophy, RotateCcw, Share2, BarChart3 } from 'lucide-react';
// import { checkWordleGuess, getRandomFiveLetterWord, isValidWord } from '../shared/utils';
// import { FIVE_LETTER_WORDS } from '../shared/word-lists';
// import { WordleGuess, WordStats } from '../shared/types';

// interface WordleState {
//   targetWord: string;
//   guesses: WordleGuess[];
//   currentGuess: string;
//   gameState: 'playing' | 'won' | 'lost';
//   showStats: boolean;
//   stats: WordStats;
//   keyboardColors: Record<string, 'correct' | 'present' | 'absent'>;
// }

// type WordleAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'ADD_LETTER'; letter: string }
//   | { type: 'REMOVE_LETTER' }
//   | { type: 'SUBMIT_GUESS' }
//   | { type: 'TOGGLE_STATS' };

// function wordleReducer(state: WordleState, action: WordleAction): WordleState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       const word = getRandomFiveLetterWord().toLowerCase();
//       return {
//         ...state,
//         targetWord: word,
//         guesses: [],
//         currentGuess: '',
//         gameState: 'playing',
//         showStats: false,
//         keyboardColors: {}
//       };

//     case 'ADD_LETTER':
//       if (state.gameState !== 'playing' || state.currentGuess.length >= 5) {
//         return state;
//       }
//       return {
//         ...state,
//         currentGuess: state.currentGuess + action.letter.toLowerCase()
//       };

//     case 'REMOVE_LETTER':
//       if (state.gameState !== 'playing') {
//         return state;
//       }
//       return {
//         ...state,
//         currentGuess: state.currentGuess.slice(0, -1)
//       };

//     case 'SUBMIT_GUESS': {
//       if (state.gameState !== 'playing' || state.currentGuess.length !== 5) {
//         return state;
//       }

//       if (!isValidWord(state.currentGuess, FIVE_LETTER_WORDS)) {
//         return state;
//       }

//       const feedback = checkWordleGuess(state.currentGuess, state.targetWord);
//       const newGuess: WordleGuess = { word: state.currentGuess, feedback };
//       const newGuesses = [...state.guesses, newGuess];

//       const newKeyboardColors = { ...state.keyboardColors };
//       feedback.forEach(({ letter, status }) => {
//         if (!newKeyboardColors[letter] ||
//             (newKeyboardColors[letter] === 'absent' && status !== 'absent') ||
//             (newKeyboardColors[letter] === 'present' && status === 'correct')) {
//           newKeyboardColors[letter] = status;
//         }
//       });

//       let newGameState: 'playing' | 'won' | 'lost' = 'playing';
//       if (state.currentGuess === state.targetWord) {
//         newGameState = 'won';
//       } else if (newGuesses.length >= 6) {
//         newGameState = 'lost';
//       }

//       return {
//         ...state,
//         guesses: newGuesses,
//         currentGuess: '',
//         gameState: newGameState,
//         keyboardColors: newKeyboardColors
//       };
//     }

//     case 'TOGGLE_STATS':
//       return {
//         ...state,
//         showStats: !state.showStats
//       };

//     default:
//       return state;
//   }
// }

// interface WordleProps {
//   onGameEnd?: (won: boolean, guesses: number) => void;
// }

// export function Wordle({ onGameEnd }: WordleProps): React.JSX.Element {
//   const [state, dispatch] = useReducer(wordleReducer, {
//     targetWord: '',
//     guesses: [],
//     currentGuess: '',
//     gameState: 'playing' as const,
//     showStats: false,
//     stats: {
//       gamesPlayed: 0,
//       gamesWon: 0,
//       currentStreak: 0,
//       maxStreak: 0,
//       averageGuesses: 0
//     },
//     keyboardColors: {}
//   });
//   const shouldReduceMotion = useReducedMotion();

//   const keyboard = [
//     ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
//     ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
//     ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE']
//   ] as const;

//   function handleKeyPress(key: string): void {
//     if (key === 'ENTER') {
//       dispatch({ type: 'SUBMIT_GUESS' });
//     } else if (key === 'BACKSPACE') {
//       dispatch({ type: 'REMOVE_LETTER' });
//     } else if (key.length === 1) {
//       dispatch({ type: 'ADD_LETTER', letter: key });
//     }
//   }

//   function initGame(): void {
//     dispatch({ type: 'INIT_GAME' });
//   }

//   function shareResult(): void {
//     const result = state.guesses.map(guess =>
//       guess.feedback.map(f =>
//         f.status === 'correct' ? '🟩' :
//         f.status === 'present' ? '🟨' : '⬜'
//       ).join('')
//     ).join('\n');

//     const text = `Wordle ${state.guesses.length}/6\n\n${result}`;

//     if (navigator.share) {
//       navigator.share({ text });
//     } else {
//       navigator.clipboard.writeText(text);
//     }
//   }

//   function getLetterColor(index: number, guess: WordleGuess): string {
//     const feedback = guess.feedback[index];
//     switch (feedback.status) {
//       case 'correct': return 'bg-green-500 text-white border-green-500';
//       case 'present': return 'bg-yellow-500 text-white border-yellow-500';
//       case 'absent': return 'bg-gray-500 text-white border-gray-500';
//     }
//   }

//   function getKeyColor(key: string): string {
//     const status = state.keyboardColors[key];
//     switch (status) {
//       case 'correct': return 'bg-green-500 text-white';
//       case 'present': return 'bg-yellow-500 text-white';
//       case 'absent': return 'bg-gray-500 text-white';
//       default: return 'bg-gray-200 text-gray-900 hover:bg-gray-300';
//     }
//   }

//   // Initialize game on first render
//   if (!state.targetWord) {
//     dispatch({ type: 'INIT_GAME' });
//   }

//   // Game completion effect
//   if (state.gameState === 'won') {
//     onGameEnd?.(true, state.guesses.length);
//   } else if (state.gameState === 'lost') {
//     onGameEnd?.(false, state.guesses.length);
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
//         <div className="bg-linear-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                 <span className="text-xl sm:text-2xl font-bold">W</span>
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold">Wordle</h1>
//                 <p className="text-sm sm:text-base text-green-100">Guess the 5-letter word</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 sm:gap-4">
//               <button
//                 onClick={() => dispatch({ type: 'TOGGLE_STATS' })}
//                 className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors touch-manipulation"
//                 aria-label="Show statistics"
//               >
//                 <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//               <button
//                 onClick={initGame}
//                 className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors touch-manipulation"
//                 aria-label="New game"
//               >
//                 <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-4 sm:p-6">
//           <input
//             type="text"
//             value=""
//             onKeyDown={(e) => {
//               const key = e.key.toUpperCase();
//               if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
//                 e.preventDefault();
//                 handleKeyPress(key);
//               }
//             }}
//             className="absolute opacity-0 pointer-events-none"
//             autoFocus
//           />

//           <div className="grid grid-rows-6 gap-1 sm:gap-2 mb-4 sm:mb-6">
//             {Array.from({ length: 6 }, (_, rowIndex) => (
//               <div key={rowIndex} className="grid grid-cols-5 gap-1 sm:gap-2">
//                 {Array.from({ length: 5 }, (_, colIndex) => {
//                   const guess = state.guesses[rowIndex];
//                   const letter = guess?.word[colIndex] ||
//                                 (rowIndex === state.guesses.length ? state.currentGuess[colIndex] : '');
//                   const isCurrentRow = rowIndex === state.guesses.length;

//                   return (
//                     <motion.div
//                       key={colIndex}
//                       initial={guess && !shouldReduceMotion ? { rotateY: 0 } : {}}
//                       animate={guess && !shouldReduceMotion ? { rotateY: 180 } : {}}
//                       transition={shouldReduceMotion ? {} : { delay: colIndex * 0.1, duration: 0.3 }}
//                       className={`
//                         w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold
//                         ${guess
//                           ? getLetterColor(colIndex, guess)
//                           : isCurrentRow && letter
//                           ? 'border-gray-400 bg-white text-gray-900'
//                           : 'border-gray-300 bg-white text-gray-900'
//                         }
//                       `}
//                     >
//                       {letter?.toUpperCase() || ''}
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>

//           <div className="space-y-1 sm:space-y-2">
//             {keyboard.map((row, rowIndex) => (
//               <div key={rowIndex} className="flex justify-center gap-0.5 sm:gap-1">
//                 {row.map((key) => (
//                   <button
//                     key={key}
//                     onClick={() => handleKeyPress(key)}
//                     className={`
//                       px-2 py-3 sm:px-3 sm:py-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 touch-manipulation
//                       ${key === 'ENTER' || key === 'BACKSPACE' ? 'px-3 sm:px-4' : ''}
//                       ${getKeyColor(key)}
//                     `}
//                   >
//                     {key === 'BACKSPACE' ? '⌫' : key}
//                   </button>
//                 ))}
//               </div>
//             ))}
//           </div>

//           <AnimatePresence>
//             {state.gameState !== 'playing' && (
//               <motion.div
//                 initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
//                 animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
//                 className="mt-6 text-center p-6 bg-gray-50 rounded-xl"
//               >
//                 <div className="flex items-center justify-center gap-2 mb-4">
//                   <Trophy className="w-8 h-8 text-yellow-500" />
//                   <h2 className="text-2xl font-bold">
//                     {state.gameState === 'won' ? 'Congratulations!' : 'Game Over!'}
//                   </h2>
//                 </div>

//                 <p className="text-lg text-gray-700 mb-2">
//                   {state.gameState === 'won'
//                     ? `You solved it in ${state.guesses.length} guess${state.guesses.length === 1 ? '' : 'es'}!`
//                     : `The word was: ${state.targetWord.toUpperCase()}`
//                   }
//                 </p>

//                 <div className="flex justify-center gap-4">
//                   <button
//                     onClick={shareResult}
//                     className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     <Share2 className="w-4 h-4" />
//                     Share
//                   </button>
//                   <button
//                     onClick={initGame}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <RotateCcw className="w-4 h-4" />
//                     Play Again
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {state.showStats && (
//               <motion.div
//                 initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
//                 animate={shouldReduceMotion ? {} : { opacity: 1, height: 'auto' }}
//                 exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
//                 className="mt-6 p-6 bg-gray-50 rounded-xl"
//               >
//                 <h3 className="text-xl font-bold mb-4">Statistics</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-gray-900">{state.stats.gamesPlayed}</div>
//                     <div className="text-sm text-gray-600">Games Played</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-gray-900">
//                       {state.stats.gamesPlayed > 0 ? Math.round((state.stats.gamesWon / state.stats.gamesPlayed) * 100) : 0}%
//                     </div>
//                     <div className="text-sm text-gray-600">Win Rate</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-gray-900">{state.stats.currentStreak}</div>
//                     <div className="text-sm text-gray-600">Current Streak</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-gray-900">{state.stats.maxStreak}</div>
//                     <div className="text-sm text-gray-600">Max Streak</div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }