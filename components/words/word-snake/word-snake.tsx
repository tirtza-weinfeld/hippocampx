// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { RotateCcw, Target, CheckCircle, Eye, EyeOff } from 'lucide-react';

// interface WordSnakeProps {
//   onGameEnd?: (wordsFound: number, timeElapsed: number) => void;
// }

// interface SnakeCell {
//   letter: string;
//   isPartOfWord: boolean;
//   wordIndex?: number;
//   isHighlighted: boolean;
// }

// const SNAKE_PUZZLES = [
//   {
//     title: "Animals",
//     grid: [
//       ['C', 'A', 'T', 'I', 'G'],
//       ['O', 'R', 'A', 'G', 'E'],
//       ['W', 'B', 'T', 'O', 'R'],
//       ['D', 'I', 'R', 'D', 'S'],
//       ['O', 'G', 'F', 'I', 'H']
//     ],
//     words: [
//       { word: 'CAT', path: [[0,0], [0,1], [0,2]] },
//       { word: 'DOG', path: [[3,0], [4,1], [4,2]] },
//       { word: 'BIRD', path: [[3,1], [3,2], [3,3], [3,4]] },
//       { word: 'FISH', path: [[4,2], [4,3], [4,4], [3,4]] },
//       { word: 'TIGER', path: [[0,2], [0,3], [1,3], [1,4], [2,4]] }
//     ]
//   }
// ];

// interface GameState {
//   currentPuzzle: typeof SNAKE_PUZZLES[0];
//   grid: SnakeCell[][];
//   foundWords: string[];
//   selectedPath: [number, number][];
//   currentWord: string;
//   message: string;
//   showSolution: boolean;
//   startTime: Date;
//   actionsCount: number;
//   gameState: 'playing' | 'completed';
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'CELL_CLICK'; row: number; col: number }
//   | { type: 'CLEAR_SELECTION' }
//   | { type: 'SUBMIT_WORD' }
//   | { type: 'TOGGLE_SOLUTION' }
//   | { type: 'INCREMENT_ACTIONS' };

// const getInitialState = (): GameState => {
//   const puzzle = SNAKE_PUZZLES[0];
//   const grid = puzzle.grid.map(row =>
//     row.map(letter => ({
//       letter,
//       isPartOfWord: false,
//       isHighlighted: false
//     }))
//   );

//   return {
//     currentPuzzle: puzzle,
//     grid,
//     foundWords: [],
//     selectedPath: [],
//     currentWord: '',
//     message: 'Find words hidden in the snake pattern',
//     showSolution: false,
//     startTime: new Date(),
//     actionsCount: 0,
//     gameState: 'playing'
//   };
// };

// const isAdjacent = (pos1: [number, number], pos2: [number, number]): boolean => {
//   const [row1, col1] = pos1;
//   const [row2, col2] = pos2;
//   const rowDiff = Math.abs(row1 - row2);
//   const colDiff = Math.abs(col1 - col2);
//   return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
// };

// const updateGridHighlight = (grid: SnakeCell[][], path: [number, number][]): SnakeCell[][] => {
//   const newGrid = grid.map(row =>
//     row.map(cell => ({ ...cell, isHighlighted: false }))
//   );

//   path.forEach(([row, col]) => {
//     newGrid[row][col].isHighlighted = true;
//   });

//   return newGrid;
// };

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return { ...getInitialState(), startTime: new Date() };

//     case 'CELL_CLICK': {
//       if (state.gameState !== 'playing') return state;

//       const { row, col } = action;
//       const position: [number, number] = [row, col];

//       if (state.selectedPath.length === 0) {
//         const newPath = [position];
//         return {
//           ...state,
//           selectedPath: newPath,
//           currentWord: state.grid[row][col].letter,
//           grid: updateGridHighlight(state.grid, newPath),
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         const lastPosition = state.selectedPath[state.selectedPath.length - 1];

//         if (row === lastPosition[0] && col === lastPosition[1]) {
//           return state;
//         }

//         if (state.selectedPath.some(([r, c]) => r === row && c === col)) {
//           const index = state.selectedPath.findIndex(([r, c]) => r === row && c === col);
//           const newPath = state.selectedPath.slice(0, index + 1);
//           return {
//             ...state,
//             selectedPath: newPath,
//             currentWord: newPath.map(([r, c]) => state.grid[r][c].letter).join(''),
//             grid: updateGridHighlight(state.grid, newPath),
//             actionsCount: state.actionsCount + 1
//           };
//         }

//         if (isAdjacent(lastPosition, position)) {
//           const newPath = [...state.selectedPath, position];
//           return {
//             ...state,
//             selectedPath: newPath,
//             currentWord: newPath.map(([r, c]) => state.grid[r][c].letter).join(''),
//             grid: updateGridHighlight(state.grid, newPath),
//             actionsCount: state.actionsCount + 1
//           };
//         }
//       }
//       return state;
//     }

//     case 'CLEAR_SELECTION':
//       return {
//         ...state,
//         selectedPath: [],
//         currentWord: '',
//         grid: state.grid.map(row =>
//           row.map(cell => ({ ...cell, isHighlighted: false }))
//         ),
//         actionsCount: state.actionsCount + 1
//       };

//     case 'SUBMIT_WORD': {
//       if (state.selectedPath.length < 2) {
//         return {
//           ...state,
//           message: 'Select at least 2 letters',
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

//       const matchingWord = state.currentPuzzle.words.find(wordObj => {
//         if (wordObj.word !== state.currentWord) return false;
//         if (wordObj.path.length !== state.selectedPath.length) return false;

//         return wordObj.path.every(([row, col], index) => {
//           const [selectedRow, selectedCol] = state.selectedPath[index];
//           return row === selectedRow && col === selectedCol;
//         });
//       });

//       if (matchingWord) {
//         const newFoundWords = [...state.foundWords, state.currentWord];
//         const newGrid = [...state.grid];

//         state.selectedPath.forEach(([row, col]) => {
//           newGrid[row][col] = {
//             ...newGrid[row][col],
//             isPartOfWord: true,
//             wordIndex: newFoundWords.length - 1,
//             isHighlighted: false
//           };
//         });

//         const isCompleted = newFoundWords.length === state.currentPuzzle.words.length;

//         return {
//           ...state,
//           foundWords: newFoundWords,
//           grid: newGrid,
//           selectedPath: [],
//           currentWord: '',
//           message: `Great! Found "${state.currentWord}"`,
//           gameState: isCompleted ? 'completed' : 'playing',
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         return {
//           ...state,
//           message: 'Not a valid word in this puzzle',
//           actionsCount: state.actionsCount + 1
//         };
//       }
//     }

//     case 'TOGGLE_SOLUTION': {
//       if (!state.showSolution) {
//         const newGrid = state.grid.map(row =>
//           row.map(cell => ({ ...cell, isPartOfWord: false, wordIndex: undefined }))
//         );

//         state.currentPuzzle.words.forEach((wordObj, wordIndex) => {
//           wordObj.path.forEach(([row, col]) => {
//             newGrid[row][col].isPartOfWord = true;
//             newGrid[row][col].wordIndex = wordIndex;
//           });
//         });

//         return {
//           ...state,
//           showSolution: true,
//           grid: newGrid,
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         const newGrid = state.grid.map(row =>
//           row.map(cell => ({ ...cell, isPartOfWord: false, wordIndex: undefined }))
//         );

//         state.foundWords.forEach((word, wordIndex) => {
//           const wordObj = state.currentPuzzle.words.find(w => w.word === word);
//           if (wordObj) {
//             wordObj.path.forEach(([row, col]) => {
//               newGrid[row][col].isPartOfWord = true;
//               newGrid[row][col].wordIndex = wordIndex;
//             });
//           }
//         });

//         return {
//           ...state,
//           showSolution: false,
//           grid: newGrid,
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

// export function WordSnake({ onGameEnd }: WordSnakeProps) {
//   const [gameState, dispatch] = useReducer(gameReducer, getInitialState());

//   // Calculate elapsed time based on actions instead of real-time timer
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (gameState.gameState === 'completed') {
//     onGameEnd?.(gameState.foundWords.length, getElapsedTime());
//   }

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getWordColors = (): string[] => {
//     return [
//       'bg-red-200 border-red-400 text-red-800',
//       'bg-blue-200 border-blue-400 text-blue-800',
//       'bg-green-200 border-green-400 text-green-800',
//       'bg-yellow-200 border-yellow-400 text-yellow-800',
//       'bg-purple-200 border-purple-400 text-purple-800',
//       'bg-pink-200 border-pink-400 text-pink-800',
//       'bg-indigo-200 border-indigo-400 text-indigo-800',
//       'bg-orange-200 border-orange-400 text-orange-800'
//     ];
//   };

//   const wordColors = getWordColors();
//   const progressPercentage = (gameState.foundWords.length / gameState.currentPuzzle.words.length) * 100;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-[to_right,theme(colors.emerald.600),theme(colors.teal.600)] text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <Target className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Word Snake</h1>
//                 <p className="text-emerald-100">Find words that snake through the grid</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{gameState.foundWords.length}/{gameState.currentPuzzle.words.length}</div>
//                 <p className="text-sm text-emerald-100">Words</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-emerald-100">Time</p>
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
//             {gameState.currentWord && (
//               <div className="text-2xl font-bold text-emerald-600 mb-4">
//                 Current: {gameState.currentWord}
//               </div>
//             )}
//           </div>

//           <div className="grid lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <div className="grid grid-cols-5 gap-2 mx-auto w-fit mb-6">
//                 {gameState.grid.map((row, rowIndex) =>
//                   row.map((cell, colIndex) => {
//                     const cellColor = cell.isPartOfWord && cell.wordIndex !== undefined
//                       ? wordColors[cell.wordIndex % wordColors.length]
//                       : cell.isHighlighted
//                       ? 'bg-blue-100 border-blue-400'
//                       : 'bg-gray-100 border-gray-300 hover:bg-gray-200';

//                     return (
//                       <motion.button
//                         key={`${rowIndex}-${colIndex}`}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: (rowIndex * 5 + colIndex) * 0.05 }}
//                         onClick={() => dispatch({ type: 'CELL_CLICK', row: rowIndex, col: colIndex })}
//                         className={`
//                           w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-all
//                           ${cellColor}
//                         `}
//                       >
//                         {cell.letter}
//                       </motion.button>
//                     );
//                   })
//                 )}
//               </div>

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'SUBMIT_WORD' })}
//                   disabled={gameState.selectedPath.length < 2}
//                   className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
//                 >
//                   Submit
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'TOGGLE_SOLUTION' })}
//                   className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
//                 >
//                   {gameState.showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   {gameState.showSolution ? 'Hide' : 'Show'} Solution
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">Words to Find</h3>
//                 <div className="space-y-2">
//                   {gameState.currentPuzzle.words.map((wordObj, index) => {
//                     const isFound = gameState.foundWords.includes(wordObj.word);
//                     const wordColor = wordColors[index % wordColors.length];

//                     return (
//                       <motion.div
//                         key={wordObj.word}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className={`p-3 rounded-lg border-2 ${
//                           isFound || gameState.showSolution
//                             ? wordColor
//                             : 'bg-gray-200 border-gray-300 text-gray-500'
//                         }`}
//                       >
//                         <div className="flex items-center gap-2">
//                           {(isFound || gameState.showSolution) && <CheckCircle className="w-5 h-5" />}
//                           <span className="font-bold">
//                             {isFound || gameState.showSolution ? wordObj.word : '?'.repeat(wordObj.word.length)}
//                           </span>
//                           <span className="text-sm">({wordObj.word.length} letters)</span>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-bold mb-4">How to Play</h3>
//                 <div className="text-sm text-gray-600 space-y-2">
//                   <p>• Click on letters to form a path</p>
//                   <p>• Letters must be adjacent (horizontal or vertical)</p>
//                   <p>• Words snake through the grid in order</p>
//                   <p>• Find all hidden words to complete the puzzle</p>
//                   <p>• Click on the same letter to backtrack</p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => dispatch({ type: 'INIT_GAME' })}
//                 className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//               >
//                 <RotateCcw className="w-4 h-4" />
//                 Reset Puzzle
//               </button>
//             </div>
//           </div>

//           <AnimatePresence>
//             {gameState.gameState === 'completed' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-8 text-center p-6 bg-green-50 rounded-xl border border-green-200"
//               >
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-green-900 mb-2">Puzzle Complete!</h2>
//                 <p className="text-green-700 mb-4">
//                   You found all {gameState.currentPuzzle.words.length} words in {formatTime(getElapsedTime())}!
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-2 mb-4">
//                   {gameState.foundWords.map((word, index) => (
//                     <span
//                       key={word}
//                       className={`px-3 py-1 rounded-lg text-sm font-bold ${wordColors[index % wordColors.length]}`}
//                     >
//                       {word}
//                     </span>
//                   ))}
//                 </div>
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