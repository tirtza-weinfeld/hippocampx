// 'use client';

// import { useState } from 'react';
// import { motion } from 'motion/react';
// import {
//   Brain,
//   Grid3X3,
//   Target,
//   Square,
//   Trophy,
//   Clock,
//   Star,
//   TrendingUp,
//   Play,
//   ArrowLeft,

// } from 'lucide-react';
// import { WordCoach } from './word-coach/word-coach';
// import { Wordle } from './wordle/wordle';
// import { SpellingBee } from './spelling-bee/spelling-bee';
// import { LetterBoxed } from './letter-boxed/letter-boxed';
// import { WordChains } from './word-chains/word-chains';
// import { WordLadder } from './word-ladder/word-ladder';
// import { Acrostics } from './acrostics/acrostics';
// import { Crosswords } from './crosswords/crosswords';
// import { Anagrams } from './anagrams/anagrams';
// import { WordSnake } from './word-snake/word-snake';

// type GameType = 'word-coach' | 'wordle' | 'spelling-bee' | 'letter-boxed' |
// 'word-chains' | 'word-ladder' | 'acrostics' | 'crosswords' | 'anagrams' | 'word-snake' | null;

// interface GameStats {
//   totalGamesPlayed: number;
//   totalScore: number;
//   averageScore: number;
//   favoriteGame: string;
// }

// const games = [
//   {
//     id: 'word-chains' as const,
//     title: 'Word Chains',
//     description: 'Create words by chaining letters',
//     icon: Brain,
//     color: 'from-cyan-500 to-blue-500',
//     difficulty: 'Medium',
//     timeEstimate: '5-15 minutes',
//     features: ['Word chaining', 'Score tracking', 'Time limit']
//   },
//   {
//     id: 'anagrams' as const,
//     title: 'Anagrams',
//     description: 'Shuffle letters to find all words',
//     icon: Brain,
//     color: 'from-purple-500 to-blue-500',
//     difficulty: 'Medium',
//     timeEstimate: '5-15 minutes',
//     features: ['Anagrams', 'Score tracking', 'Time limit']
//   },
//   {
//     id: 'crosswords' as const,
//     title: 'Crosswords',
//     description: 'Solve crosswords to reveal a hidden phrase',
//     icon: Brain,
//     color: 'from-purple-500 to-blue-500',
//     difficulty: 'Medium',
//     timeEstimate: '5-15 minutes',
//     features: ['Crosswords', 'Score tracking', 'Time limit']
//   },
//   {
//     id: 'acrostics' as const,
//     title: 'Acrostics',
//     description: 'Solve clues to spell a hidden phrase',
//     icon: Brain,
//     color: 'from-purple-500 to-blue-500',
//     difficulty: 'Medium',
//     timeEstimate: '5-15 minutes',
//     features: ['Acrostics', 'Score tracking', 'Time limit']
//   },
//   {
//     id: 'word-ladder' as const,
//     title: 'Word Ladder',
//     description: 'Change one letter at a time to create words',
//     icon: Brain,
//     color: 'from-green-500 to-blue-500',
//     difficulty: 'Medium',
//     timeEstimate: '5-15 minutes',
//     features: ['Word ladder', 'Score tracking', 'Time limit']
//   },
//   {
//     id: 'word-coach' as const,
//     title: 'Word Coach',
//     description: 'Test your vocabulary with multiple choice questions',
//     icon: Brain,
//     color: 'from-purple-500 to-blue-500',
//     difficulty: 'Easy to Hard',
//     timeEstimate: '2-5 minutes',
//     features: ['Multiple choice', 'Difficulty scaling', 'Score tracking']
//   },
//   {
//     id: 'wordle' as const,
//     title: 'Wordle',
//     description: 'Guess the 5-letter word in 6 tries',
//     icon: Grid3X3,
//     color: 'from-green-500 to-blue-500',
//     difficulty: 'Medium',
//     timeEstimate: '3-10 minutes',
//     features: ['6 guesses', 'Color feedback', 'Daily challenge']
//   },
//   {
//     id: 'spelling-bee' as const,
//     title: 'Spelling Bee',
//     description: 'Make words using the center letter',
//     icon: Target,
//     color: 'from-yellow-500 to-amber-500',
//     difficulty: 'Medium to Hard',
//     timeEstimate: '10-30 minutes',
//     features: ['Center letter required', 'Pangrams', 'Ranking system']
//   },
//   {
//     id: 'letter-boxed' as const,
//     title: 'Letter Boxed',
//     description: 'Connect letters around the box perimeter',
//     icon: Square,
//     color: 'from-indigo-500 to-purple-500',
//     difficulty: 'Hard',
//     timeEstimate: '10-20 minutes',
//     features: ['Letter chaining', 'Use all letters', 'Strategy required']
//   }
// ];

// export function WordsHub() {
//   const [currentGame, setCurrentGame] = useState<GameType>(null);
//   const [stats, setStats] = useState<GameStats>({
//     totalGamesPlayed: 0,
//     totalScore: 0,
//     averageScore: 0,
//     favoriteGame: 'Word Coach'
//   });

//   const handleGameEnd = (_gameType: string, score?: number) => {
//     setStats(prev => ({
//       ...prev,
//       totalGamesPlayed: prev.totalGamesPlayed + 1,
//       totalScore: prev.totalScore + (score || 0),
//       averageScore: Math.round((prev.totalScore + (score || 0)) / (prev.totalGamesPlayed + 1))
//     }));
//   };

//   const renderGame = () => {
//     switch (currentGame) {
//       case 'word-chains':
//         return <WordChains onGameEnd={() => handleGameEnd('word-chains', 0)} />;
//       case 'anagrams':
//         return <Anagrams onGameEnd={() => handleGameEnd('anagrams', 0)} />;
//       case 'crosswords':
//         return <Crosswords onGameEnd={() => handleGameEnd('crosswords', 0)} />;
//       case 'acrostics':
//         return <Acrostics onGameEnd={() => handleGameEnd('acrostics', 0)} />;
//       case 'word-ladder':
//         return <WordLadder onGameEnd={() => handleGameEnd('word-ladder', 0)} />;
//       case 'word-snake':
//         return <WordSnake onGameEnd={(wordsFound) => handleGameEnd('word-snake', wordsFound)} />;
//       case 'word-coach':
//         return <WordCoach onGameEnd={(score) => handleGameEnd('word-coach', score)} />;
//       case 'wordle':
//         return <Wordle onGameEnd={(won, guesses) => handleGameEnd('wordle', won ? 100 - (guesses * 10) : 0)} />;
//       case 'spelling-bee':
//         return <SpellingBee onGameEnd={(score) => handleGameEnd('spelling-bee', score)} />;
//       case 'letter-boxed':
//         return <LetterBoxed onGameEnd={(success, words) => handleGameEnd('letter-boxed', success ? words * 20 : 0)} />;
//       default:
//         return null;
//     }
//   };

//   if (currentGame) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
//           <button
//             onClick={() => setCurrentGame(null)}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Games</span>
//           </button>
//         </div>
//         <div className="py-8">
//           {renderGame()}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//             Word Games Hub
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Challenge your vocabulary and language skills with our collection of word games
//           </p>
//         </motion.div>

//         <div className="grid lg:grid-cols-4 gap-6 mb-12">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1 }}
//             className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
//           >
//             <div className="text-center">
//               <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h3>
//               <div className="space-y-4">
//                 <div>
//                   <div className="text-3xl font-bold text-blue-600">{stats.totalGamesPlayed}</div>
//                   <div className="text-sm text-gray-600">Games Played</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-green-600">{stats.totalScore}</div>
//                   <div className="text-sm text-gray-600">Total Score</div>
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold text-purple-600">{stats.averageScore}</div>
//                   <div className="text-sm text-gray-600">Average Score</div>
//                 </div>
//                 <div className="pt-4 border-t border-gray-200">
//                   <div className="flex items-center gap-2 justify-center">
//                     <Star className="w-4 h-4 text-yellow-500" />
//                     <span className="text-sm font-medium text-gray-700">
//                       Favorite: {stats.favoriteGame}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
//             {games.map((game, index) => (
//               <motion.div
//                 key={game.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 + index * 0.1 }}
//                 className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
//                 onClick={() => setCurrentGame(game.id)}
//               >
//                 <div className={`h-32 bg-gradient-to-r ${game.color} relative overflow-hidden`}>
//                   <div className="absolute inset-0 bg-black/10" />
//                   <div className="relative h-full flex items-center justify-between p-6 text-white">
//                     <div>
//                       <h3 className="text-2xl font-bold mb-1">{game.title}</h3>
//                       <p className="text-white/90 text-sm">{game.description}</p>
//                     </div>
//                     <game.icon className="w-12 h-12 text-white/80" />
//                   </div>
//                   <motion.div
//                     initial={{ x: '100%' }}
//                     whileHover={{ x: 0 }}
//                     className="absolute inset-0 bg-white/20 flex items-center justify-center"
//                   >
//                     <Play className="w-8 h-8 text-white" />
//                   </motion.div>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="flex items-center gap-2">
//                       <TrendingUp className="w-4 h-4 text-gray-500" />
//                       <span className="text-sm text-gray-600">{game.difficulty}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-gray-500" />
//                       <span className="text-sm text-gray-600">{game.timeEstimate}</span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <h4 className="font-medium text-gray-900">Features:</h4>
//                     <ul className="space-y-1">
//                       {game.features.map((feature, featureIndex) => (
//                         <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
//                           <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium group-hover:bg-gray-800">
//                     Play Now
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
//         >
//           <div className="text-center">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Play</h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="space-y-3">
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
//                   <Brain className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <h3 className="font-semibold">Word Coach</h3>
//                 <p className="text-sm text-gray-600">
//                   Choose the correct definition from multiple options. Perfect for building vocabulary!
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
//                   <Grid3X3 className="w-6 h-6 text-green-600" />
//                 </div>
//                 <h3 className="font-semibold">Wordle</h3>
//                 <p className="text-sm text-gray-600">
//                   Guess the word in 6 tries using color clues. Green means correct position!
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
//                   <Target className="w-6 h-6 text-yellow-600" />
//                 </div>
//                 <h3 className="font-semibold">Spelling Bee</h3>
//                 <p className="text-sm text-gray-600">
//                   Create words using the center letter. Find pangrams for bonus points!
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto">
//                   <Square className="w-6 h-6 text-indigo-600" />
//                 </div>
//                 <h3 className="font-semibold">Letter Boxed</h3>
//                 <p className="text-sm text-gray-600">
//                   Connect letters around the box. Each word must start with the previous word&apos;s last letter!
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }