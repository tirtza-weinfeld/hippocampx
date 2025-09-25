// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Shuffle, RotateCcw, Target, Star, Lightbulb } from 'lucide-react';
// import { generateSpellingBeeLetters, findSpellingBeeWords, isPangram } from '../shared/utils';
// import { SPELLING_BEE_WORDS } from '../shared/word-lists';

// interface SpellingBeeState {
//   centerLetter: string;
//   outerLetters: string[];
//   foundWords: string[];
//   totalWords: string[];
//   pangrams: string[];
//   maxScore: number;
//   currentScore: number;
//   currentWord: string;
//   message: string;
//   showHint: boolean;
//   shuffledLetters: string[];
// }

// type SpellingBeeAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'ADD_LETTER'; letter: string }
//   | { type: 'REMOVE_LETTER' }
//   | { type: 'CLEAR_WORD' }
//   | { type: 'SUBMIT_WORD' }
//   | { type: 'SHUFFLE_LETTERS' }
//   | { type: 'TOGGLE_HINT' };

// function spellingBeeReducer(state: SpellingBeeState, action: SpellingBeeAction): SpellingBeeState {
//   switch (action.type) {
//     case 'INIT_GAME': {
//       const { center, outer } = generateSpellingBeeLetters();
//       const allLetters = [center, ...outer];
//       const validWords = findSpellingBeeWords(center, outer, SPELLING_BEE_WORDS);
//       const pangrams = validWords.filter(word => isPangram(word, allLetters));

//       const maxScore = validWords.reduce((score, word) => {
//         return score + (isPangram(word, allLetters) ? word.length + 7 : word.length === 4 ? 1 : word.length);
//       }, 0);

//       return {
//         centerLetter: center,
//         outerLetters: outer,
//         foundWords: [],
//         totalWords: validWords,
//         pangrams,
//         maxScore,
//         currentScore: 0,
//         currentWord: '',
//         message: `Find words using these letters. Words must include ${center.toUpperCase()}`,
//         showHint: false,
//         shuffledLetters: outer
//       };
//     }

//     case 'ADD_LETTER': {
//       return {
//         ...state,
//         currentWord: state.currentWord + action.letter
//       };
//     }

//     case 'REMOVE_LETTER': {
//       return {
//         ...state,
//         currentWord: state.currentWord.slice(0, -1)
//       };
//     }

//     case 'CLEAR_WORD': {
//       return {
//         ...state,
//         currentWord: ''
//       };
//     }

//     case 'SUBMIT_WORD': {
//       const word = state.currentWord.toLowerCase();

//       if (word.length < 4) {
//         return {
//           ...state,
//           message: 'Words must be at least 4 letters long'
//         };
//       }

//       if (!word.includes(state.centerLetter)) {
//         return {
//           ...state,
//           message: `Missing center letter: ${state.centerLetter.toUpperCase()}`
//         };
//       }

//       if (state.foundWords.includes(word)) {
//         return {
//           ...state,
//           message: 'Already found!'
//         };
//       }

//       if (!state.totalWords.includes(word)) {
//         return {
//           ...state,
//           message: 'Not in word list'
//         };
//       }

//       const allLetters = [state.centerLetter, ...state.outerLetters];
//       const isValidPangram = isPangram(word, allLetters);
//       const points = isValidPangram ? word.length + 7 : word.length === 4 ? 1 : word.length;

//       return {
//         ...state,
//         foundWords: [...state.foundWords, word],
//         currentScore: state.currentScore + points,
//         currentWord: '',
//         message: isValidPangram ? '🎉 PANGRAM! +7 bonus points!' : `Great! +${points} points`
//       };
//     }

//     case 'SHUFFLE_LETTERS': {
//       return {
//         ...state,
//         shuffledLetters: [...state.shuffledLetters].sort(() => Math.random() - 0.5)
//       };
//     }

//     case 'TOGGLE_HINT': {
//       return {
//         ...state,
//         showHint: !state.showHint
//       };
//     }

//     default:
//       return state;
//   }
// }

// interface SpellingBeeProps {
//   onGameEnd?: (score: number, wordsFound: number) => void;
// }

// export function SpellingBee({}: SpellingBeeProps) {
//   const [state, dispatch] = useReducer(spellingBeeReducer, {
//     centerLetter: '',
//     outerLetters: [],
//     foundWords: [],
//     totalWords: [],
//     pangrams: [],
//     maxScore: 0,
//     currentScore: 0,
//     currentWord: '',
//     message: '',
//     showHint: false,
//     shuffledLetters: []
//   });

//   // Initialize game on first render
//   if (!state.centerLetter) {
//     dispatch({ type: 'INIT_GAME' });
//   }

//   // Game completion logic handled by state

//   const getRank = () => {
//     const percentage = (state.currentScore / state.maxScore) * 100;
//     if (percentage >= 100) return { rank: 'Queen Bee', color: 'text-yellow-600' };
//     if (percentage >= 70) return { rank: 'Genius', color: 'text-purple-600' };
//     if (percentage >= 50) return { rank: 'Amazing', color: 'text-blue-600' };
//     if (percentage >= 40) return { rank: 'Great', color: 'text-green-600' };
//     if (percentage >= 25) return { rank: 'Nice', color: 'text-teal-600' };
//     if (percentage >= 15) return { rank: 'Solid', color: 'text-gray-600' };
//     if (percentage >= 8) return { rank: 'Good', color: 'text-gray-500' };
//     if (percentage >= 2) return { rank: 'Moving Up', color: 'text-gray-400' };
//     return { rank: 'Beginner', color: 'text-gray-400' };
//   };

//   const currentRank = getRank();

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-[to_right,theme(colors.yellow.500),theme(colors.amber.600)] text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Spelling Bee</h1>
//                 <p className="text-yellow-100">Make words with these letters</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{state.currentScore}</div>
//                 <p className="text-sm text-yellow-100">Score</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{state.foundWords.length}</div>
//                 <p className="text-sm text-yellow-100">Words</p>
//               </div>
//               <div>
//                 <div className={`text-lg font-semibold ${currentRank.color.replace('text-', 'text-white')}`}>
//                   {currentRank.rank}
//                 </div>
//                 <p className="text-sm text-yellow-100">Rank</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 bg-white/20 rounded-full h-2">
//             <div
//               className="bg-white rounded-full h-2 transition-all duration-500"
//               style={{ width: `${Math.min((state.currentScore / state.maxScore) * 100, 100)}%` }}
//             />
//           </div>
//         </div>

//         <div className="p-8">
//           <input
//             type="text"
//             value={state.currentWord}
//             onChange={(e) => {
//               const value = e.target.value.toUpperCase();
//               const allLetters = [state.centerLetter, ...state.outerLetters];

//               // Only allow letters that are available
//               if (value.split('').every(letter => allLetters.includes(letter.toLowerCase()))) {
//                 dispatch({ type: 'CLEAR_WORD' });
//                 value.split('').forEach(letter => {
//                   dispatch({ type: 'ADD_LETTER', letter: letter.toLowerCase() });
//                 });
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 dispatch({ type: 'SUBMIT_WORD' });
//               } else if (e.key === 'Backspace') {
//                 e.preventDefault();
//                 dispatch({ type: 'REMOVE_LETTER' });
//               } else if (e.key === ' ') {
//                 e.preventDefault();
//                 dispatch({ type: 'SHUFFLE_LETTERS' });
//               }
//             }}
//             className="absolute opacity-0 pointer-events-none"
//             autoFocus
//           />

//           <div className="text-center mb-8">
//             <div className="relative inline-block">
//               <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
//                 {/* Center hexagon */}
//                 <motion.polygon
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 0.2, type: 'spring' }}
//                   points="150,50 185,70 185,110 150,130 115,110 115,70"
//                   fill="#fbbf24"
//                   stroke="#f59e0b"
//                   strokeWidth="3"
//                   className="cursor-pointer hover:fill-yellow-300 transition-colors"
//                   onClick={() => dispatch({ type: 'ADD_LETTER', letter: state.centerLetter })}
//                 />
//                 <text
//                   x="150"
//                   y="95"
//                   textAnchor="middle"
//                   className="fill-white text-2xl font-bold pointer-events-none select-none"
//                 >
//                   {state.centerLetter.toUpperCase()}
//                 </text>

//                 {/* Outer hexagons */}
//                 {state.shuffledLetters.map((letter, index) => {
//                   const angle = (index * 60) - 90;
//                   const radian = (angle * Math.PI) / 180;
//                   const x = 150 + 80 * Math.cos(radian);
//                   const y = 90 + 80 * Math.sin(radian);

//                   return (
//                     <g key={index}>
//                       <motion.polygon
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
//                         points={`${x},${y-20} ${x+18},${y-10} ${x+18},${y+10} ${x},${y+20} ${x-18},${y+10} ${x-18},${y-10}`}
//                         fill="#e5e7eb"
//                         stroke="#d1d5db"
//                         strokeWidth="2"
//                         className="cursor-pointer hover:fill-gray-300 transition-colors"
//                         onClick={() => dispatch({ type: 'ADD_LETTER', letter })}
//                       />
//                       <text
//                         x={x}
//                         y={y + 5}
//                         textAnchor="middle"
//                         className="fill-gray-700 text-lg font-bold pointer-events-none select-none"
//                       >
//                         {letter.toUpperCase()}
//                       </text>
//                     </g>
//                   );
//                 })}
//               </svg>
//             </div>

//             <div className="mt-6">
//               <div className="flex items-center justify-center gap-4 mb-4">
//                 <div className="flex-1 max-w-md">
//                   <div className="bg-gray-100 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
//                     <span className="text-2xl font-mono tracking-wider">
//                       {state.currentWord.toUpperCase() || 'Type your word...'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-center gap-3 mb-4">
//                 <button
//                   onClick={() => dispatch({ type: 'REMOVE_LETTER' })}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                 >
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'SHUFFLE_LETTERS' })}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Shuffle className="w-4 h-4" />
//                   Shuffle
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'SUBMIT_WORD' })}
//                   className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
//                 >
//                   Submit
//                 </button>
//               </div>

//               <AnimatePresence>
//                 {state.message && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className={`text-center p-2 rounded-lg ${
//                       state.message.includes('🎉') ? 'bg-yellow-100 text-yellow-800' :
//                       state.message.includes('Great') ? 'bg-green-100 text-green-800' :
//                       'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {state.message}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gray-50 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-bold">Words Found</h3>
//                 <span className="text-sm text-gray-600">
//                   {state.foundWords.length} of {state.totalWords.length}
//                 </span>
//               </div>
//               <div className="max-h-64 overflow-y-auto">
//                 <div className="grid grid-cols-2 gap-2">
//                   {state.foundWords.map((word, index) => {
//                     const allLetters = [state.centerLetter, ...state.outerLetters];
//                     const isPangramWord = isPangram(word, allLetters);
//                     return (
//                       <motion.div
//                         key={word}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className={`flex items-center gap-2 p-2 rounded ${
//                           isPangramWord ? 'bg-yellow-100 text-yellow-800' : 'bg-white'
//                         }`}
//                       >
//                         {isPangramWord && <Star className="w-4 h-4 text-yellow-600" />}
//                         <span className="font-mono">{word.toUpperCase()}</span>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">Progress</h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span>Score:</span>
//                     <span className="font-semibold">{state.currentScore} / {state.maxScore}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Rank:</span>
//                     <span className={`font-semibold ${currentRank.color}`}>
//                       {currentRank.rank}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Pangrams:</span>
//                     <span className="font-semibold">
//                       {state.foundWords.filter(word => state.pangrams.includes(word)).length} / {state.pangrams.length}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold">Hints</h3>
//                   <button
//                     onClick={() => dispatch({ type: 'TOGGLE_HINT' })}
//                     className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
//                   >
//                     <Lightbulb className="w-4 h-4" />
//                     {state.showHint ? 'Hide' : 'Show'}
//                   </button>
//                 </div>
//                 {state.showHint && (
//                   <div className="text-sm text-gray-600 space-y-2">
//                     <p>• Words must be at least 4 letters long</p>
//                     <p>• Words must include the center letter</p>
//                     <p>• Pangrams use all 7 letters (bonus points!)</p>
//                     <p>• Use keyboard or click letters to spell</p>
//                     <p>• Press SPACE to shuffle outer letters</p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => dispatch({ type: 'SHUFFLE_LETTERS' })}
//                   className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Shuffle className="w-4 h-4" />
//                   Shuffle
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                 >
//                   <RotateCcw className="w-4 h-4" />
//                   New Game
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }