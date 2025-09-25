// import { COMMON_WORDS, FIVE_LETTER_WORDS, WORD_DEFINITIONS } from './word-lists';
// import { WordCoachQuestion, LetterFeedback } from './types';

// export function getRandomWord(wordList: readonly string[] = COMMON_WORDS): string {
//   return wordList[Math.floor(Math.random() * wordList.length)];
// }

// export function getRandomFiveLetterWord(): string {
//   return getRandomWord(FIVE_LETTER_WORDS);
// }

// export function shuffleArray<T>(array: readonly T[]): T[] {
//   const shuffled = [...array];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// }

// export function generateWordCoachQuestion(word?: string): WordCoachQuestion {
//   // If no word provided or word not found, pick a random word from definitions
//   const availableWords = Object.keys(WORD_DEFINITIONS);
//   const selectedWord = word && WORD_DEFINITIONS[word as keyof typeof WORD_DEFINITIONS]
//     ? word
//     : availableWords[Math.floor(Math.random() * availableWords.length)];

//   const correctDefinition = WORD_DEFINITIONS[selectedWord as keyof typeof WORD_DEFINITIONS];

//   const allDefinitions = Object.values(WORD_DEFINITIONS);
//   const incorrectDefinitions = allDefinitions.filter(def => def !== correctDefinition);
//   const shuffledIncorrect = shuffleArray(incorrectDefinitions);
//   const incorrectOptions = shuffledIncorrect.slice(0, 3);

//   return {
//     id: `${selectedWord}-${Date.now()}`,
//     word: selectedWord,
//     correctDefinition,
//     incorrectOptions,
//     difficulty: (selectedWord.length <= 4 ? 'easy' : selectedWord.length <= 6 ? 'medium' : 'hard') as const
//   };
// }

// export function checkWordleGuess(guess: string, target: string): LetterFeedback[] {
//   const targetLetters = target.split('');
//   const guessLetters = guess.split('');
//   const feedback: LetterFeedback[] = [];
//   const targetLetterCount: Record<string, number> = {};

//   targetLetters.forEach(letter => {
//     targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
//   });

//   guessLetters.forEach((letter, index) => {
//     if (letter === targetLetters[index]) {
//       feedback.push({ letter, status: 'correct' });
//       targetLetterCount[letter]--;
//     } else {
//       feedback.push({ letter, status: 'absent' });
//     }
//   });

//   feedback.forEach((item, index) => {
//     if (item.status === 'absent' && targetLetterCount[item.letter] > 0) {
//       feedback[index] = { letter: item.letter, status: 'present' };
//       targetLetterCount[item.letter]--;
//     }
//   });

//   return feedback;
// }

// export function isValidWord(word: string, wordList: readonly string[] = COMMON_WORDS): boolean {
//   if (!word || word.length < 2) return false;
//   const lowerWord = word.toLowerCase();
//   return wordList.includes(lowerWord);
// }

// export function formatTime(seconds: number): string {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
// }

// export function calculateScore(baseScore: number, timeBonus: number, streakMultiplier: number): number {
//   return Math.floor(baseScore * streakMultiplier + timeBonus);
// }

// export function generateSpellingBeeLetters(): { center: string; outer: string[] } {
//   const vowels = ['a', 'e', 'i', 'o', 'u'] as const;
//   const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'] as const;

//   const center = Math.random() < 0.7 ?
//     vowels[Math.floor(Math.random() * vowels.length)] :
//     consonants[Math.floor(Math.random() * consonants.length)];

//   const allLetters = [...vowels, ...consonants].filter(letter => letter !== center);
//   const outer = shuffleArray(allLetters).slice(0, 6);

//   return { center, outer };
// }

// export function findSpellingBeeWords(centerLetter: string, outerLetters: readonly string[], wordList: readonly string[]): string[] {
//   const allLetters = [centerLetter, ...outerLetters];

//   return wordList.filter(word => {
//     if (word.length < 4) return false;
//     if (!word.includes(centerLetter)) return false;

//     return word.split('').every(letter => allLetters.includes(letter));
//   });
// }

// export function isPangram(word: string, allLetters: readonly string[]): boolean {
//   const uniqueLetters = new Set(word.split(''));
//   return allLetters.every(letter => uniqueLetters.has(letter));
// }

// export function generateLetterBoxedSides(): string[][] {
//   const letters = 'abcdefghijklmnopqrstuvwxyz'.split('') as const;
//   const shuffled = shuffleArray(letters);

//   return [
//     shuffled.slice(0, 3),
//     shuffled.slice(3, 6),
//     shuffled.slice(6, 9),
//     shuffled.slice(9, 12)
//   ];
// }

// export function isValidLetterBoxedWord(word: string, sides: readonly (readonly string[])[], previousWord?: string): boolean {
//   if (word.length < 3) return false;

//   if (previousWord && word[0] !== previousWord[previousWord.length - 1]) {
//     return false;
//   }

//   const letters = word.split('');
//   for (let i = 0; i < letters.length - 1; i++) {
//     const currentLetter = letters[i];
//     const nextLetter = letters[i + 1];

//     const currentSide = sides.findIndex(side => side.includes(currentLetter));
//     const nextSide = sides.findIndex(side => side.includes(nextLetter));

//     if (currentSide === nextSide) {
//       return false;
//     }
//   }

//   return true;
// }

// export function getWordDifficulty(word: string): 'easy' | 'medium' | 'hard' {
//   if (word.length <= 4) return 'easy';
//   if (word.length <= 6) return 'medium';
//   return 'hard';
// }

// export function saveGameState(gameType: string, state: unknown): void {
//   try {
//     localStorage.setItem(`wordGames_${gameType}`, JSON.stringify(state));
//   } catch (error) {
//     console.warn('Failed to save game state:', error);
//   }
// }

// export function loadGameState(gameType: string): unknown {
//   try {
//     const saved = localStorage.getItem(`wordGames_${gameType}`);
//     return saved ? JSON.parse(saved) : null;
//   } catch (error) {
//     console.warn('Failed to load game state:', error);
//     return null;
//   }
// }