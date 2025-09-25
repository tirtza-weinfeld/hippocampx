// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Shuffle, RotateCcw, Target, CheckCircle, Star } from 'lucide-react';

// interface AnagramsProps {
//   onGameEnd?: (wordsFound: number, timeElapsed: number) => void;
// }

// const ANAGRAM_SETS = [
//   {
//     letters: 'STREAM',
//     words: ['STREAM', 'MASTER', 'TERMS', 'SMART', 'TRAMS', 'ARMS', 'MARS', 'RATS', 'STAR', 'ARTS', 'TARS', 'MEAT', 'TEAM', 'MATE', 'TEAR', 'RATE', 'EAST']
//   },
//   {
//     letters: 'GARDEN',
//     words: ['GARDEN', 'DANGER', 'GRADE', 'GRAND', 'RANGE', 'ANGER', 'RAGE', 'GEAR', 'DEAR', 'READ', 'AGED', 'DRAG', 'GRAD']
//   },
//   {
//     letters: 'PLAYER',
//     words: ['PLAYER', 'REPLAY', 'EARLY', 'LAYER', 'RELAY', 'ROYAL', 'PEARL', 'LEAP', 'PALE', 'REAL', 'EARL', 'YEAR', 'PLAY', 'PRAY', 'PEAR']
//   }
// ];

// interface GameState {
//   currentSet: typeof ANAGRAM_SETS[0];
//   foundWords: string[];
//   currentInput: string;
//   shuffledLetters: string[];
//   message: string;
//   startTime: Date;
//   actionsCount: number;
//   gameStatus: 'playing' | 'completed';
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'ADD_LETTER'; letter: string }
//   | { type: 'REMOVE_LETTER' }
//   | { type: 'CLEAR_INPUT' }
//   | { type: 'SHUFFLE_LETTERS' }
//   | { type: 'SUBMIT_WORD' }
//   | { type: 'SET_MESSAGE'; message: string }
//   | { type: 'INCREMENT_ACTIONS' };

// const getInitialState = (): GameState => {
//   const set = ANAGRAM_SETS[Math.floor(Math.random() * ANAGRAM_SETS.length)];
//   return {
//     currentSet: set,
//     foundWords: [],
//     currentInput: '',
//     shuffledLetters: set.letters.split('').sort(() => Math.random() - 0.5),
//     message: `Find words using these letters: ${set.letters}`,
//     startTime: new Date(),
//     actionsCount: 0,
//     gameStatus: 'playing'
//   };
// };

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME': {
//       const newState = getInitialState();
//       return { ...newState, startTime: new Date() };
//     }

//     case 'ADD_LETTER':
//       if (state.currentInput.length >= state.currentSet.letters.length) {
//         return state;
//       }

//       // Check if letter is available
//       const lettersUsed = state.currentInput.split('');
//       const lettersAvailable = state.currentSet.letters.split('');

//       for (const usedLetter of lettersUsed) {
//         const index = lettersAvailable.indexOf(usedLetter);
//         if (index !== -1) lettersAvailable.splice(index, 1);
//       }

//       if (!lettersAvailable.includes(action.letter)) {
//         return state;
//       }

//       return {
//         ...state,
//         currentInput: state.currentInput + action.letter,
//         actionsCount: state.actionsCount + 1
//       };

//     case 'REMOVE_LETTER':
//       return {
//         ...state,
//         currentInput: state.currentInput.slice(0, -1),
//         actionsCount: state.actionsCount + 1
//       };

//     case 'CLEAR_INPUT':
//       return {
//         ...state,
//         currentInput: '',
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SHUFFLE_LETTERS':
//       return {
//         ...state,
//         shuffledLetters: [...state.shuffledLetters].sort(() => Math.random() - 0.5),
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SUBMIT_WORD': {
//       const word = state.currentInput.toUpperCase().trim();

//       if (word.length < 3) {
//         return {
//           ...state,
//           message: 'Words must be at least 3 letters long',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (state.foundWords.includes(word)) {
//         return {
//           ...state,
//           message: 'Already found this word!',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       if (!state.currentSet.words.includes(word)) {
//         return {
//           ...state,
//           message: 'Not a valid word from these letters',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       // Check if word can be made with available letters
//       const availableLetters = state.currentSet.letters.split('');
//       const neededLetters = word.split('');
//       const canMakeWord = neededLetters.every(letter => {
//         const index = availableLetters.indexOf(letter);
//         if (index === -1) return false;
//         availableLetters.splice(index, 1);
//         return true;
//       });

//       if (!canMakeWord) {
//         return {
//           ...state,
//           message: 'Cannot make this word with available letters',
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const newFoundWords = [...state.foundWords, word];
//       const isLongestWord = word.length === state.currentSet.letters.length;
//       const isComplete = newFoundWords.length === state.currentSet.words.length;

//       return {
//         ...state,
//         foundWords: newFoundWords,
//         currentInput: '',
//         message: isLongestWord ? '🌟 Amazing! You found the longest word!' : `Great! Found "${word}"`,
//         gameStatus: isComplete ? 'completed' : 'playing',
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'SET_MESSAGE':
//       return { ...state, message: action.message };

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function Anagrams({ onGameEnd }: AnagramsProps) {
//   const [gameState, dispatch] = useReducer(gameReducer, getInitialState());

//   // Calculate elapsed time
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (gameState.gameStatus === 'completed') {
//     onGameEnd?.(gameState.foundWords.length, getElapsedTime());
//   }

//   const handleLetterClick = (letter: string): void => {
//     dispatch({ type: 'ADD_LETTER', letter });
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       dispatch({ type: 'SUBMIT_WORD' });
//     } else if (e.key === 'Backspace') {
//       e.preventDefault();
//       dispatch({ type: 'REMOVE_LETTER' });
//     } else if (e.key === ' ') {
//       e.preventDefault();
//       dispatch({ type: 'SHUFFLE_LETTERS' });
//     } else if (e.key.match(/[a-zA-Z]/) && gameState.currentInput.length < gameState.currentSet.letters.length) {
//       const letter = e.key.toUpperCase();
//       if (gameState.currentSet.letters.includes(letter)) {
//         e.preventDefault();
//         dispatch({ type: 'ADD_LETTER', letter });
//       }
//     }
//   };

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getWordsByLength = (): Record<number, string[]> => {
//     const wordsByLength: Record<number, string[]> = {};
//     gameState.currentSet.words.forEach(word => {
//       if (!wordsByLength[word.length]) {
//         wordsByLength[word.length] = [];
//       }
//       wordsByLength[word.length].push(word);
//     });
//     return wordsByLength;
//   };

//   const wordsByLength = getWordsByLength();
//   const longestWords = gameState.currentSet.words.filter(word => word.length === gameState.currentSet.letters.length);
//   const progressPercentage = (gameState.foundWords.length / gameState.currentSet.words.length) * 100;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-to-r from-orange-600 to-red-600 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Anagrams</h1>
//                 <p className="text-orange-100">Find all possible words</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{gameState.foundWords.length}/{gameState.currentSet.words.length}</div>
//                 <p className="text-sm text-orange-100">Words</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-orange-100">Time</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 bg-white/20 rounded-full h-2">
//             <div
//               className="bg-white rounded-full h-2 transition-all duration-500"
//               style={{ width: `${progressPercentage}%` }}
//             />
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="text-center mb-6">
//             <p className="text-gray-600 mb-4">{gameState.message}</p>

//             <div className="flex justify-center gap-2 mb-6">
//               {gameState.shuffledLetters.map((letter, index) => (
//                 <motion.button
//                   key={index}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                   onClick={() => handleLetterClick(letter)}
//                   className="w-12 h-12 bg-orange-100 border-2 border-orange-300 rounded-lg flex items-center justify-center text-xl font-bold text-orange-800 hover:bg-orange-200 transition-colors"
//                 >
//                   {letter}
//                 </motion.button>
//               ))}
//             </div>

//             <div className="flex items-center justify-center gap-4 mb-4">
//               <div className="flex-1 max-w-md">
//                 <div className="bg-gray-100 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
//                   <input
//                     type="text"
//                     value={gameState.currentInput || 'Type or click letters...'}
//                     onKeyDown={handleKeyDown}
//                     readOnly
//                     className="text-2xl font-mono tracking-wider bg-transparent border-none outline-none text-center w-full"
//                     autoFocus
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center gap-3 mb-6">
//               <button
//                 onClick={() => dispatch({ type: 'REMOVE_LETTER' })}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => dispatch({ type: 'CLEAR_INPUT' })}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Clear
//               </button>
//               <button
//                 onClick={() => dispatch({ type: 'SHUFFLE_LETTERS' })}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Shuffle className="w-4 h-4" />
//                 Shuffle
//               </button>
//               <button
//                 onClick={() => dispatch({ type: 'SUBMIT_WORD' })}
//                 className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-bold mb-4">Words Found</h3>
//               <div className="max-h-64 overflow-y-auto">
//                 {Object.entries(wordsByLength)
//                   .sort(([a], [b]) => Number(b) - Number(a))
//                   .map(([length, words]) => (
//                     <div key={length} className="mb-3">
//                       <h4 className="font-semibold text-sm text-gray-600 mb-2">
//                         {length} Letters {longestWords.includes(words[0]) && <Star className="inline w-4 h-4 text-yellow-500" />}
//                       </h4>
//                       <div className="grid grid-cols-2 gap-1">
//                         {words.map(word => (
//                           <motion.div
//                             key={word}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: gameState.foundWords.includes(word) ? 1 : 0.3, x: 0 }}
//                             className={`p-2 rounded text-sm font-mono ${
//                               gameState.foundWords.includes(word)
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-gray-200 text-gray-500'
//                             }`}
//                           >
//                             {gameState.foundWords.includes(word) ? word : '?'.repeat(word.length)}
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">Progress</h3>
//                 <div className="space-y-3">
//                   {Object.entries(wordsByLength)
//                     .sort(([a], [b]) => Number(b) - Number(a))
//                     .map(([length, words]) => {
//                       const found = words.filter(word => gameState.foundWords.includes(word)).length;
//                       const total = words.length;
//                       const percentage = (found / total) * 100;

//                       return (
//                         <div key={length} className="flex items-center gap-3">
//                           <span className="font-semibold text-sm w-16">{length} letters:</span>
//                           <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-orange-500 transition-all duration-300"
//                               style={{ width: `${percentage}%` }}
//                             />
//                           </div>
//                           <span className="text-sm font-semibold">{found}/{total}</span>
//                         </div>
//                       );
//                     })}
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">Rules</h3>
//                 <div className="text-sm text-gray-600 space-y-2">
//                   <p>• Use the given letters to form words</p>
//                   <p>• Words must be at least 3 letters long</p>
//                   <p>• Each letter can only be used once per word</p>
//                   <p>• Find the longest word for bonus points!</p>
//                   <p>• Press SPACE to shuffle letters</p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => dispatch({ type: 'INIT_GAME' })}
//                 className="w-full flex items-center justify-center gap-2 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//               >
//                 <RotateCcw className="w-4 h-4" />
//                 New Set
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
//                 <h2 className="text-2xl font-bold text-green-900 mb-2">Perfect Score!</h2>
//                 <p className="text-green-700 mb-4">
//                   You found all {gameState.currentSet.words.length} words in {formatTime(getElapsedTime())}!
//                 </p>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
//                 >
//                   Try Another Set
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }