// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Lightbulb, RotateCcw, CheckCircle } from 'lucide-react';

// interface CrosswordClue {
//   number: number;
//   clue: string;
//   answer: string;
//   direction: 'across' | 'down';
//   startRow: number;
//   startCol: number;
// }

// interface CrosswordCell {
//   letter: string;
//   number?: number;
//   isBlocked: boolean;
//   userInput: string;
//   isCorrect?: boolean;
// }

// interface CrosswordPuzzle {
//   title: string;
//   grid: CrosswordCell[][];
//   clues: CrosswordClue[];
//   size: number;
// }

// interface CrosswordsProps {
//   onGameEnd?: (completed: boolean, timeElapsed: number) => void;
// }

// const SAMPLE_PUZZLE: CrosswordPuzzle = {
//   title: "Mini Crossword",
//   size: 5,
//   grid: [
//     [
//       { letter: 'C', number: 1, isBlocked: false, userInput: '' },
//       { letter: 'A', isBlocked: false, userInput: '' },
//       { letter: 'T', isBlocked: false, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: 'D', number: 2, isBlocked: false, userInput: '' }
//     ],
//     [
//       { letter: 'O', isBlocked: false, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: 'H', number: 3, isBlocked: false, userInput: '' },
//       { letter: 'E', isBlocked: false, userInput: '' },
//       { letter: 'O', isBlocked: false, userInput: '' }
//     ],
//     [
//       { letter: 'D', number: 4, isBlocked: false, userInput: '' },
//       { letter: 'O', isBlocked: false, userInput: '' },
//       { letter: 'G', isBlocked: false, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: 'G', isBlocked: false, userInput: '' }
//     ],
//     [
//       { letter: 'E', isBlocked: false, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' }
//     ],
//     [
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' },
//       { letter: '', isBlocked: true, userInput: '' }
//     ]
//   ],
//   clues: [
//     { number: 1, clue: "Feline pet", answer: "CAT", direction: "across", startRow: 0, startCol: 0 },
//     { number: 2, clue: "Canine pet", answer: "DOG", direction: "down", startRow: 0, startCol: 4 },
//     { number: 3, clue: "Friendly greeting", answer: "HELLO", direction: "across", startRow: 1, startCol: 2 },
//     { number: 4, clue: "Programming language", answer: "CODE", direction: "down", startRow: 2, startCol: 0 }
//   ]
// };

// interface GameState {
//   puzzle: CrosswordPuzzle;
//   selectedCell: {row: number; col: number} | null;
//   selectedClue: CrosswordClue | null;
//   direction: 'across' | 'down';
//   startTime: Date;
//   actionsCount: number;
//   gameStatus: 'playing' | 'completed';
//   showSolution: boolean;
//   hintsUsed: number;
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'SET_CELL_INPUT'; row: number; col: number; letter: string }
//   | { type: 'SELECT_CELL'; row: number; col: number }
//   | { type: 'SELECT_CLUE'; clue: CrosswordClue | null }
//   | { type: 'SET_DIRECTION'; direction: 'across' | 'down' }
//   | { type: 'TOGGLE_SOLUTION' }
//   | { type: 'MOVE_TO_NEXT_CELL' }
//   | { type: 'MOVE_TO_PREVIOUS_CELL' }
//   | { type: 'MOVE_CELL'; direction: 'up' | 'down' | 'left' | 'right' }
//   | { type: 'INCREMENT_ACTIONS' };

// const getInitialGrid = (): CrosswordCell[][] => {
//   return SAMPLE_PUZZLE.grid.map(row =>
//     row.map(cell => ({ ...cell, userInput: '', isCorrect: undefined }))
//   );
// };

// const initialGameState: GameState = {
//   puzzle: { ...SAMPLE_PUZZLE, grid: getInitialGrid() },
//   selectedCell: null,
//   selectedClue: null,
//   direction: 'across',
//   startTime: new Date(),
//   actionsCount: 0,
//   gameStatus: 'playing',
//   showSolution: false,
//   hintsUsed: 0
// };

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return {
//         ...initialGameState,
//         puzzle: { ...SAMPLE_PUZZLE, grid: getInitialGrid() },
//         startTime: new Date()
//       };

//     case 'SET_CELL_INPUT': {
//       const newGrid = [...state.puzzle.grid];
//       newGrid[action.row][action.col] = {
//         ...newGrid[action.row][action.col],
//         userInput: action.letter
//       };

//       // Check completion
//       const isComplete = state.puzzle.clues.every(clue => {
//         let currentAnswer = '';
//         for (let i = 0; i < clue.answer.length; i++) {
//           const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
//           const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
//           currentAnswer += newGrid[row][col].userInput;
//         }
//         return currentAnswer === clue.answer;
//       });

//       return {
//         ...state,
//         puzzle: { ...state.puzzle, grid: newGrid },
//         gameStatus: isComplete ? 'completed' : 'playing',
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'SELECT_CELL': {
//       if (state.puzzle.grid[action.row][action.col].isBlocked) {
//         return state;
//       }

//       // Find clues at this cell
//       const cluesAtCell = state.puzzle.clues.filter(clue => {
//         if (clue.direction === 'across') {
//           return action.row === clue.startRow &&
//                  action.col >= clue.startCol &&
//                  action.col < clue.startCol + clue.answer.length;
//         } else {
//           return action.col === clue.startCol &&
//                  action.row >= clue.startRow &&
//                  action.row < clue.startRow + clue.answer.length;
//         }
//       });

//       let newClue = state.selectedClue;
//       let newDirection = state.direction;

//       if (cluesAtCell.length > 0) {
//         const preferredClue = cluesAtCell.find(clue => clue.direction === state.direction) || cluesAtCell[0];
//         newClue = preferredClue;
//         newDirection = preferredClue.direction;
//       }

//       return {
//         ...state,
//         selectedCell: { row: action.row, col: action.col },
//         selectedClue: newClue,
//         direction: newDirection,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'SELECT_CLUE':
//       return { ...state, selectedClue: action.clue };

//     case 'SET_DIRECTION':
//       return { ...state, direction: action.direction };

//     case 'TOGGLE_SOLUTION':
//       return {
//         ...state,
//         showSolution: !state.showSolution,
//         hintsUsed: !state.showSolution ? state.hintsUsed + 1 : state.hintsUsed
//       };

//     case 'MOVE_TO_NEXT_CELL': {
//       if (!state.selectedCell || !state.selectedClue) return state;

//       const { row, col } = state.selectedCell;
//       const { direction: clueDirection, startRow, startCol, answer } = state.selectedClue;

//       let nextRow = row;
//       let nextCol = col;

//       if (clueDirection === 'across') {
//         nextCol = Math.min(col + 1, startCol + answer.length - 1);
//       } else {
//         nextRow = Math.min(row + 1, startRow + answer.length - 1);
//       }

//       if (nextRow !== row || nextCol !== col) {
//         return { ...state, selectedCell: { row: nextRow, col: nextCol } };
//       }
//       return state;
//     }

//     case 'MOVE_TO_PREVIOUS_CELL': {
//       if (!state.selectedCell || !state.selectedClue) return state;

//       const { row, col } = state.selectedCell;
//       const { direction: clueDirection, startRow, startCol } = state.selectedClue;

//       let prevRow = row;
//       let prevCol = col;

//       if (clueDirection === 'across') {
//         prevCol = Math.max(col - 1, startCol);
//       } else {
//         prevRow = Math.max(row - 1, startRow);
//       }

//       if (prevRow !== row || prevCol !== col) {
//         return { ...state, selectedCell: { row: prevRow, col: prevCol } };
//       }
//       return state;
//     }

//     case 'MOVE_CELL': {
//       if (!state.selectedCell) return state;

//       const { row, col } = state.selectedCell;
//       let newRow = row;
//       let newCol = col;

//       switch (action.direction) {
//         case 'up':
//           newRow = Math.max(0, row - 1);
//           break;
//         case 'down':
//           newRow = Math.min(state.puzzle.size - 1, row + 1);
//           break;
//         case 'left':
//           newCol = Math.max(0, col - 1);
//           break;
//         case 'right':
//           newCol = Math.min(state.puzzle.size - 1, col + 1);
//           break;
//       }

//       if (!state.puzzle.grid[newRow][newCol].isBlocked) {
//         return { ...state, selectedCell: { row: newRow, col: newCol } };
//       }
//       return state;
//     }

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function Crosswords({ onGameEnd }: CrosswordsProps) {
//   const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

//   // Calculate elapsed time
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.startTime.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (gameState.gameStatus === 'completed') {
//     onGameEnd?.(true, getElapsedTime());
//   }

//   const handleCellClick = (row: number, col: number): void => {
//     dispatch({ type: 'SELECT_CELL', row, col });
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (!gameState.selectedCell || gameState.gameStatus !== 'playing') return;

//     const { row, col } = gameState.selectedCell;

//     if (e.key.match(/^[a-zA-Z]$/)) {
//       e.preventDefault();
//       const letter = e.key.toUpperCase();
//       dispatch({ type: 'SET_CELL_INPUT', row, col, letter });
//       dispatch({ type: 'MOVE_TO_NEXT_CELL' });
//     } else if (e.key === 'Backspace') {
//       e.preventDefault();
//       dispatch({ type: 'SET_CELL_INPUT', row, col, letter: '' });
//       dispatch({ type: 'MOVE_TO_PREVIOUS_CELL' });
//     } else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       dispatch({ type: 'MOVE_CELL', direction: 'up' });
//     } else if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       dispatch({ type: 'MOVE_CELL', direction: 'down' });
//     } else if (e.key === 'ArrowLeft') {
//       e.preventDefault();
//       dispatch({ type: 'MOVE_CELL', direction: 'left' });
//     } else if (e.key === 'ArrowRight') {
//       e.preventDefault();
//       dispatch({ type: 'MOVE_CELL', direction: 'right' });
//     } else if (e.key === 'Tab') {
//       e.preventDefault();
//       dispatch({ type: 'SET_DIRECTION', direction: gameState.direction === 'across' ? 'down' : 'across' });
//     }
//   };

//   const formatTime = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getClueProgress = (clue: CrosswordClue): number => {
//     let filledCells = 0;
//     for (let i = 0; i < clue.answer.length; i++) {
//       const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
//       const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
//       if (gameState.puzzle.grid[row][col].userInput) {
//         filledCells++;
//       }
//     }
//     return (filledCells / clue.answer.length) * 100;
//   };

//   const acrossClues = gameState.puzzle.clues.filter(clue => clue.direction === 'across');
//   const downClues = gameState.puzzle.clues.filter(clue => clue.direction === 'down');

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <div className="grid grid-cols-2 gap-1">
//                   <div className="w-2 h-2 bg-white rounded-sm"></div>
//                   <div className="w-2 h-2 bg-white/50 rounded-sm"></div>
//                   <div className="w-2 h-2 bg-white/50 rounded-sm"></div>
//                   <div className="w-2 h-2 bg-white rounded-sm"></div>
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">{gameState.puzzle.title}</h1>
//                 <p className="text-blue-100">Solve the crossword puzzle</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-right">
//               <div>
//                 <div className="text-2xl font-bold">{formatTime(getElapsedTime())}</div>
//                 <p className="text-sm text-blue-100">Time</p>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">{gameState.hintsUsed}</div>
//                 <p className="text-sm text-blue-100">Hints</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="grid lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <div className="grid grid-cols-5 gap-1 mb-6 mx-auto w-fit">
//                 {gameState.puzzle.grid.map((row, rowIndex) =>
//                   row.map((cell, colIndex) => {
//                     const isSelected = gameState.selectedCell?.row === rowIndex && gameState.selectedCell?.col === colIndex;
//                     const isInSelectedClue = gameState.selectedClue && (() => {
//                       if (gameState.selectedClue.direction === 'across') {
//                         return rowIndex === gameState.selectedClue.startRow &&
//                                colIndex >= gameState.selectedClue.startCol &&
//                                colIndex < gameState.selectedClue.startCol + gameState.selectedClue.answer.length;
//                       } else {
//                         return colIndex === gameState.selectedClue.startCol &&
//                                rowIndex >= gameState.selectedClue.startRow &&
//                                rowIndex < gameState.selectedClue.startRow + gameState.selectedClue.answer.length;
//                       }
//                     })();

//                     return (
//                       <motion.div
//                         key={`${rowIndex}-${colIndex}`}
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: (rowIndex * 5 + colIndex) * 0.02 }}
//                         onClick={() => handleCellClick(rowIndex, colIndex)}
//                         className={`
//                           w-12 h-12 border-2 flex items-center justify-center relative cursor-pointer text-lg font-bold
//                           ${cell.isBlocked
//                             ? 'bg-gray-900 border-gray-900'
//                             : isSelected
//                             ? 'bg-blue-200 border-blue-400'
//                             : isInSelectedClue
//                             ? 'bg-blue-50 border-blue-200'
//                             : 'bg-white border-gray-300 hover:bg-gray-50'
//                           }
//                         `}
//                       >
//                         {!cell.isBlocked && (
//                           <>
//                             {cell.number && (
//                               <span className="absolute top-0 left-0 text-xs font-normal p-0.5 leading-none">
//                                 {cell.number}
//                               </span>
//                             )}
//                             <span className="text-center">
//                               {gameState.showSolution ? cell.letter : cell.userInput}
//                             </span>
//                           </>
//                         )}
//                       </motion.div>
//                     );
//                   })
//                 )}
//               </div>

//               {/* Hidden input for keyboard capture */}
//               <input
//                 type="text"
//                 className="sr-only"
//                 onKeyDown={handleKeyDown}
//                 autoFocus
//                 readOnly
//               />

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => dispatch({ type: 'TOGGLE_SOLUTION' })}
//                   className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
//                 >
//                   <Lightbulb className="w-4 h-4" />
//                   {gameState.showSolution ? 'Hide' : 'Show'} Solution
//                 </button>
//                 <button
//                   onClick={() => dispatch({ type: 'INIT_GAME' })}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <RotateCcw className="w-4 h-4" />
//                   Reset
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold mb-3">Across</h3>
//                 <div className="space-y-2">
//                   {acrossClues.map(clue => {
//                     const progress = getClueProgress(clue);
//                     const isSelected = gameState.selectedClue?.number === clue.number && gameState.selectedClue?.direction === clue.direction;

//                     return (
//                       <div
//                         key={`across-${clue.number}`}
//                         onClick={() => {
//                           dispatch({ type: 'SELECT_CLUE', clue });
//                           dispatch({ type: 'SET_DIRECTION', direction: 'across' });
//                           dispatch({ type: 'SELECT_CELL', row: clue.startRow, col: clue.startCol });
//                         }}
//                         className={`p-2 rounded cursor-pointer transition-colors ${
//                           isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
//                         }`}
//                       >
//                         <div className="flex items-start gap-2">
//                           <span className="font-semibold text-sm">{clue.number}.</span>
//                           <span className="text-sm flex-1">{clue.clue}</span>
//                         </div>
//                         <div className="mt-1 h-1 bg-gray-200 rounded">
//                           <div
//                             className="h-1 bg-blue-500 rounded transition-all duration-300"
//                             style={{ width: `${progress}%` }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold mb-3">Down</h3>
//                 <div className="space-y-2">
//                   {downClues.map(clue => {
//                     const progress = getClueProgress(clue);
//                     const isSelected = gameState.selectedClue?.number === clue.number && gameState.selectedClue?.direction === clue.direction;

//                     return (
//                       <div
//                         key={`down-${clue.number}`}
//                         onClick={() => {
//                           dispatch({ type: 'SELECT_CLUE', clue });
//                           dispatch({ type: 'SET_DIRECTION', direction: 'down' });
//                           dispatch({ type: 'SELECT_CELL', row: clue.startRow, col: clue.startCol });
//                         }}
//                         className={`p-2 rounded cursor-pointer transition-colors ${
//                           isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
//                         }`}
//                       >
//                         <div className="flex items-start gap-2">
//                           <span className="font-semibold text-sm">{clue.number}.</span>
//                           <span className="text-sm flex-1">{clue.clue}</span>
//                         </div>
//                         <div className="mt-1 h-1 bg-gray-200 rounded">
//                           <div
//                             className="h-1 bg-blue-500 rounded transition-all duration-300"
//                             style={{ width: `${progress}%` }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold mb-3">Instructions</h3>
//                 <div className="text-sm text-gray-600 space-y-1">
//                   <p>• Click a cell to select it</p>
//                   <p>• Type letters to fill cells</p>
//                   <p>• Use arrow keys to navigate</p>
//                   <p>• Press Tab to switch direction</p>
//                   <p>• Click clues to jump to them</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <AnimatePresence>
//             {gameState.gameStatus === 'completed' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-6 text-center p-6 bg-green-50 rounded-xl border border-green-200"
//               >
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-green-900 mb-2">Congratulations!</h2>
//                 <p className="text-green-700 mb-4">
//                   You completed the crossword in {formatTime(getElapsedTime())} with {gameState.hintsUsed} hint{gameState.hintsUsed === 1 ? '' : 's'}!
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