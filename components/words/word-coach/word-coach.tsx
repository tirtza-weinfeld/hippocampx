// 'use client';

// import { useReducer } from 'react';
// import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
// import { Trophy, Brain, Clock, Zap, Star, CheckCircle, XCircle } from 'lucide-react';
// import { generateWordCoachQuestion, shuffleArray, formatTime, calculateScore } from '../shared/utils';
// import { WordCoachQuestion, GameState } from '../shared/types';

// interface WordCoachProps {
//   onGameEnd?: (score: number, correctAnswers: number) => void;
// }

// interface GameStateExtended extends GameState {
//   currentQuestion: WordCoachQuestion | null;
//   selectedAnswer: string;
//   showResult: boolean;
//   correctAnswers: number;
//   streak: number;
//   questionsAnswered: number;
//   allOptions: string[];
//   actionsCount: number;
// }

// type GameAction =
//   | { type: 'INIT_GAME' }
//   | { type: 'GENERATE_QUESTION' }
//   | { type: 'SELECT_ANSWER'; answer: string }
//   | { type: 'NEXT_QUESTION' }
//   | { type: 'COMPLETE_GAME' }
//   | { type: 'INCREMENT_ACTIONS' };

// function getInitialState(): GameStateExtended {
//   const question = generateWordCoachQuestion();
//   const options = shuffleArray([question.correctDefinition, ...question.incorrectOptions]);

//   return {
//     score: 0,
//     level: 1,
//     isComplete: false,
//     timeStarted: new Date(),
//     timeElapsed: 0,
//     currentQuestion: question,
//     selectedAnswer: '',
//     showResult: false,
//     correctAnswers: 0,
//     streak: 0,
//     questionsAnswered: 0,
//     allOptions: options,
//     actionsCount: 0
//   };
// }

// function gameReducer(state: GameStateExtended, action: GameAction): GameStateExtended {
//   switch (action.type) {
//     case 'INIT_GAME':
//       return { ...getInitialState(), timeStarted: new Date() };

//     case 'GENERATE_QUESTION': {
//       const question = generateWordCoachQuestion();
//       const options = shuffleArray([question.correctDefinition, ...question.incorrectOptions]);

//       return {
//         ...state,
//         currentQuestion: question,
//         allOptions: options,
//         selectedAnswer: '',
//         showResult: false,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'SELECT_ANSWER': {
//       if (state.showResult || !state.currentQuestion) return state;

//       const isCorrect = action.answer === state.currentQuestion.correctDefinition;
//       const newQuestionsAnswered = state.questionsAnswered + 1;

//       if (isCorrect) {
//         const newCorrectAnswers = state.correctAnswers + 1;
//         const newStreak = state.streak + 1;
//         const baseScore = 10;
//         const timeBonus = Math.max(0, 30 - state.timeElapsed);
//         const streakMultiplier = 1 + (newStreak * 0.1);
//         const points = calculateScore(baseScore, timeBonus, streakMultiplier);

//         return {
//           ...state,
//           selectedAnswer: action.answer,
//           showResult: true,
//           correctAnswers: newCorrectAnswers,
//           streak: newStreak,
//           questionsAnswered: newQuestionsAnswered,
//           score: state.score + points,
//           level: Math.floor(newCorrectAnswers / 5) + 1,
//           actionsCount: state.actionsCount + 1
//         };
//       } else {
//         return {
//           ...state,
//           selectedAnswer: action.answer,
//           showResult: true,
//           streak: 0,
//           questionsAnswered: newQuestionsAnswered,
//           actionsCount: state.actionsCount + 1
//         };
//       }
//     }

//     case 'NEXT_QUESTION': {
//       if (state.questionsAnswered >= 10) {
//         return {
//           ...state,
//           isComplete: true,
//           actionsCount: state.actionsCount + 1
//         };
//       }

//       const question = generateWordCoachQuestion();
//       const options = shuffleArray([question.correctDefinition, ...question.incorrectOptions]);

//       return {
//         ...state,
//         currentQuestion: question,
//         allOptions: options,
//         selectedAnswer: '',
//         showResult: false,
//         actionsCount: state.actionsCount + 1
//       };
//     }

//     case 'COMPLETE_GAME':
//       return {
//         ...state,
//         isComplete: true,
//         actionsCount: state.actionsCount + 1
//       };

//     case 'INCREMENT_ACTIONS':
//       return { ...state, actionsCount: state.actionsCount + 1 };

//     default:
//       return state;
//   }
// }

// export function WordCoach({ onGameEnd }: WordCoachProps): React.JSX.Element {
//   const [gameState, dispatch] = useReducer(gameReducer, getInitialState());
//   const shouldReduceMotion = useReducedMotion();

//   // Calculate elapsed time based on actions instead of real-time timer
//   const getElapsedTime = (): number => {
//     return Math.floor((Date.now() - gameState.timeStarted.getTime()) / 1000);
//   };

//   // Game completion effect
//   if (gameState.isComplete) {
//     onGameEnd?.(gameState.score, gameState.correctAnswers);
//   }

//   const handleAnswerSelect = (answer: string): void => {
//     dispatch({ type: 'SELECT_ANSWER', answer });
//     // Instead of setTimeout, we'll trigger next question through manual interaction
//   };

//   const handleNextQuestion = (): void => {
//     dispatch({ type: 'NEXT_QUESTION' });
//   };

//   const resetGame = (): void => {
//     dispatch({ type: 'INIT_GAME' });
//   };

//   const currentElapsedTime = getElapsedTime();

//   if (gameState.isComplete) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="max-w-2xl mx-auto p-8 bg-linear-[to_bottom_right,theme(colors.purple.50),theme(colors.blue.50)] rounded-2xl border border-purple-200"
//       >
//         <div className="text-center">
//           <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
//           <div className="space-y-2 mb-6">
//             <p className="text-xl text-gray-700">Final Score: {gameState.score}</p>
//             <p className="text-lg text-gray-600">Correct Answers: {gameState.correctAnswers}/10</p>
//             <p className="text-lg text-gray-600">Time: {formatTime(currentElapsedTime)}</p>
//             <p className="text-lg text-gray-600">Accuracy: {Math.round((gameState.correctAnswers / 10) * 100)}%</p>
//           </div>
//           <button
//             onClick={resetGame}
//             className="px-6 py-3 bg-linear-[to_right,theme(colors.purple.600),theme(colors.blue.600)] text-white rounded-lg font-semibold hover:bg-linear-[to_right,theme(colors.purple.700),theme(colors.blue.700)] transition-all duration-200"
//           >
//             Play Again
//           </button>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
//         <div className="bg-linear-[to_right,theme(colors.purple.600),theme(colors.blue.600)] text-white p-4 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold">Word Coach</h1>
//                 <p className="text-sm sm:text-base text-purple-100">Test your vocabulary knowledge</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 sm:gap-6 text-right">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Star className="w-4 h-4 sm:w-5 sm:h-5" />
//                   <span className="text-base sm:text-lg font-semibold">{gameState.score}</span>
//                 </div>
//                 <p className="text-xs sm:text-sm text-purple-100">Score</p>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
//                   <span className="text-base sm:text-lg font-semibold">{gameState.streak}</span>
//                 </div>
//                 <p className="text-xs sm:text-sm text-purple-100">Streak</p>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
//                   <span className="text-base sm:text-lg font-semibold">{formatTime(currentElapsedTime)}</span>
//                 </div>
//                 <p className="text-xs sm:text-sm text-purple-100">Time</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 bg-white/20 rounded-full h-2">
//             <div
//               className="bg-white rounded-full h-2 transition-all duration-500"
//               style={{ width: `${(gameState.questionsAnswered / 10) * 100}%` }}
//             />
//           </div>
//           <p className="text-center mt-2 text-purple-100">
//             Question {gameState.questionsAnswered + 1} of 10
//           </p>
//         </div>

//         <div className="p-4 sm:p-8">
//           {gameState.currentQuestion && (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={gameState.currentQuestion.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="text-center mb-6 sm:mb-8">
//                   <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
//                     {gameState.currentQuestion.word}
//                   </h2>
//                   <p className="text-lg sm:text-xl text-gray-600">
//                     What does this word mean?
//                   </p>
//                   <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-gray-100 rounded-full">
//                     <span className="text-sm font-medium text-gray-700">
//                       Difficulty: {gameState.currentQuestion.difficulty}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid gap-3 sm:gap-4 max-w-2xl mx-auto">
//                   {gameState.allOptions.map((option, index) => (
//                     <motion.button
//                       key={option}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       onClick={() => handleAnswerSelect(option)}
//                       disabled={gameState.showResult}
//                       className={`p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-200 touch-manipulation ${
//                         !gameState.showResult
//                           ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
//                           : option === gameState.currentQuestion?.correctDefinition
//                           ? 'border-green-500 bg-green-50'
//                           : option === gameState.selectedAnswer
//                           ? 'border-red-500 bg-red-50'
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm sm:text-base text-gray-900">{option}</span>
//                         {gameState.showResult && (
//                           <div className="flex-shrink-0 ml-3">
//                             {option === gameState.currentQuestion?.correctDefinition ? (
//                               <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
//                             ) : option === gameState.selectedAnswer ? (
//                               <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
//                             ) : null}
//                           </div>
//                         )}
//                       </div>
//                     </motion.button>
//                   ))}
//                 </div>

//                 {gameState.showResult && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-center mt-6"
//                   >
//                     <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
//                       gameState.selectedAnswer === gameState.currentQuestion.correctDefinition
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {gameState.selectedAnswer === gameState.currentQuestion.correctDefinition ? (
//                         <>
//                           <CheckCircle className="w-5 h-5" />
//                           <span className="font-semibold">Correct!</span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="w-5 h-5" />
//                           <span className="font-semibold">Incorrect</span>
//                         </>
//                       )}
//                     </div>

//                     {gameState.questionsAnswered < 10 ? (
//                       <button
//                         onClick={handleNextQuestion}
//                         className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
//                       >
//                         Next Question
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => dispatch({ type: 'COMPLETE_GAME' })}
//                         className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
//                       >
//                         View Results
//                       </button>
//                     )}
//                   </motion.div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }