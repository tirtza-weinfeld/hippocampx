"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Sparkles } from "lucide-react";
import type { TokenizationPuzzle } from "@/lib/games/word-vault/types";

interface TokenizationBoardProps {
  puzzle: TokenizationPuzzle;
  onComplete: (score: number) => void;
}

// Colors for different pairs - visually distinct
const PAIR_COLORS = [
  { bg: "bg-violet-500/25", text: "text-violet-400", bar: "bg-violet-500" },
  { bg: "bg-amber-500/25", text: "text-amber-400", bar: "bg-amber-500" },
  { bg: "bg-cyan-500/25", text: "text-cyan-400", bar: "bg-cyan-500" },
  { bg: "bg-rose-500/25", text: "text-rose-400", bar: "bg-rose-500" },
  { bg: "bg-emerald-500/25", text: "text-emerald-400", bar: "bg-emerald-500" },
];

interface PairData {
  pair: string;
  count: number;
  color: (typeof PAIR_COLORS)[number];
}

function findRepeatingPairs(text: string): Map<string, PairData> {
  const counts = new Map<string, number>();

  for (let i = 0; i < text.length - 1; i++) {
    if (text[i] === " " || text[i + 1] === " ") continue;
    if (text[i] === "[" || text[i] === "]") continue;
    if (text[i + 1] === "[" || text[i + 1] === "]") continue;

    const pair = text.slice(i, i + 2);
    counts.set(pair, (counts.get(pair) ?? 0) + 1);
  }

  const repeating = Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  const result = new Map<string, PairData>();
  repeating.forEach(([pair, count], index) => {
    if (index < PAIR_COLORS.length) {
      result.set(pair, { pair, count, color: PAIR_COLORS[index] });
    }
  });

  return result;
}

// Learning moments shown AFTER merging (teaching through doing)
const LEARNING_MOMENTS = [
  "You created a token! The AI now sees this as one piece, not two letters.",
  "Your vocabulary is growing. Fewer pieces means faster reading.",
  "Pattern found! This is exactly how Claude learned to read text.",
];

export function TokenizationBoard({
  puzzle,
  onComplete,
}: TokenizationBoardProps) {
  const [currentText, setCurrentText] = useState(puzzle.initialText);
  const [mergedPairs, setMergedPairs] = useState<string[]>([]);
  const [showCounts, setShowCounts] = useState(false);
  const [learningMoment, setLearningMoment] = useState<string | null>(null);
  const [shouldNudge, setShouldNudge] = useState(false);
  const [actionTick, setActionTick] = useState(0);

  const pairData = useMemo(() => findRepeatingPairs(currentText), [currentText]);
  const isComplete = mergedPairs.length >= puzzle.targetMerges;
  const initialCharCount = puzzle.initialText.replace(/\s/g, "").length;

  // Get current token count (merged tokens count as 1)
  const currentTokenCount = useMemo(() => {
    let count = 0;
    let i = 0;
    while (i < currentText.length) {
      if (currentText[i] === " ") {
        i++;
        continue;
      }
      if (currentText[i] === "[") {
        count++;
        i = currentText.indexOf("]", i) + 1;
        continue;
      }
      count++;
      i++;
    }
    return count;
  }, [currentText]);

  // Get the highest frequency pair for nudging
  const topPair = useMemo(() => {
    const pairs = Array.from(pairData.values());
    return pairs.length > 0 ? pairs[0].pair : null;
  }, [pairData]);

  // Idle nudge - after 8 seconds without action, pulse the top pair
  useEffect(() => {
    if (isComplete || shouldNudge) return;

    const timer = setTimeout(() => {
      setShouldNudge(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isComplete, actionTick, shouldNudge]);

  const handleMerge = (pair: string) => {
    if (isComplete) return;

    setActionTick((t) => t + 1);
    setShouldNudge(false);

    const regex = new RegExp(pair.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    const newText = currentText.replace(regex, `[${pair}]`);
    setCurrentText(newText);

    const newMerged = [...mergedPairs, pair];
    setMergedPairs(newMerged);

    // Show learning moment after merge
    if (newMerged.length <= LEARNING_MOMENTS.length) {
      setLearningMoment(LEARNING_MOMENTS[newMerged.length - 1]);
      setTimeout(() => setLearningMoment(null), 3500);
    }

    // Check completion
    if (newMerged.length >= puzzle.targetMerges) {
      setTimeout(() => {
        let score = 0;
        for (let i = 0; i < newMerged.length; i++) {
          if (newMerged[i] === puzzle.expectedSequence[i]) score += 10;
          else if (puzzle.expectedSequence.includes(newMerged[i])) score += 5;
        }
        onComplete(score);
      }, 2000);
    }
  };

  // Render text with colored pairs
  const renderText = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;
    let keyIndex = 0;

    while (i < currentText.length) {
      // Handle merged tokens [XX]
      if (currentText[i] === "[") {
        const closeIdx = currentText.indexOf("]", i);
        if (closeIdx !== -1) {
          const token = currentText.slice(i + 1, closeIdx);
          elements.push(
            <motion.span
              key={`token-${keyIndex++}`}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-flex items-center px-2.5 py-1 mx-0.5 rounded-lg
                bg-wv-completed/30 text-wv-completed font-bold
                ring-2 ring-wv-completed/50"
            >
              {token}
            </motion.span>
          );
          i = closeIdx + 1;
          continue;
        }
      }

      // Handle spaces
      if (currentText[i] === " ") {
        elements.push(<span key={`space-${keyIndex++}`} className="mx-3" />);
        i++;
        continue;
      }

      // Check if this starts a repeating pair
      if (i < currentText.length - 1) {
        const pair = currentText.slice(i, i + 2);
        const data = pairData.get(pair);

        if (data) {
          const isNudging = shouldNudge && pair === topPair;

          elements.push(
            <motion.button
              key={`pair-${keyIndex++}`}
              type="button"
              onClick={() => handleMerge(pair)}
              disabled={isComplete}
              className={`
                relative inline-flex items-center px-1.5 py-0.5 mx-px rounded-lg
                cursor-pointer transition-all duration-200
                ${data.color.bg} ${data.color.text}
                hover:scale-110 hover:ring-2 hover:ring-current
                active:scale-95
                disabled:cursor-default disabled:opacity-60
                ${isNudging ? "animate-wv-pulse ring-2 ring-current" : ""}
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {pair}
              {/* Count badge - shown when showCounts is on, or on hover */}
              <AnimatePresence>
                {showCounts && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2
                      px-1.5 py-0.5 rounded text-xs font-bold
                      bg-foreground text-background whitespace-nowrap"
                  >
                    ×{data.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
          i += 2;
          continue;
        }
      }

      // Regular character
      elements.push(
        <span key={`char-${keyIndex++}`} className="opacity-50">
          {currentText[i]}
        </span>
      );
      i++;
    }

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: puzzle.targetMerges }).map((_, idx) => (
            <motion.div
              key={idx}
              className={`size-3 rounded-full transition-colors duration-300 ${
                idx < mergedPairs.length
                  ? "bg-wv-completed"
                  : "bg-wv-surface/50 ring-1 ring-wv-available/30"
              }`}
              animate={
                idx === mergedPairs.length - 1 && mergedPairs.length > 0
                  ? { scale: [1, 1.5, 1.2] }
                  : {}
              }
            />
          ))}
        </div>

        {/* Show Counts button - replaces text hints */}
        <button
          type="button"
          onClick={() => setShowCounts(!showCounts)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
            transition-all duration-200
            ${showCounts
              ? "bg-wv-available/20 text-wv-available"
              : "bg-wv-surface/30 text-muted-foreground hover:bg-wv-surface/50"
            }
          `}
        >
          <Eye className="size-4" />
          {showCounts ? "Counts shown" : "Show counts"}
        </button>
      </div>

      {/* The text - main game area */}
      <div className="rounded-3xl bg-wv-surface/10 p-8 sm:p-10">
        <div className="flex flex-wrap justify-center items-center gap-y-4 text-3xl sm:text-4xl font-mono font-semibold select-none leading-relaxed">
          {renderText()}
        </div>
      </div>

      {/* Pair frequency bar - visual hint */}
      <AnimatePresence>
        {pairData.size > 0 && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl bg-wv-surface/10 p-4"
          >
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Tap a pattern to merge it
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from(pairData.values()).map((data) => (
                <motion.button
                  key={data.pair}
                  type="button"
                  onClick={() => handleMerge(data.pair)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl
                    ${data.color.bg} hover:ring-2 hover:ring-current
                    transition-all duration-200
                    ${shouldNudge && data.pair === topPair ? "animate-wv-pulse ring-2 ring-current" : ""}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`font-mono font-bold ${data.color.text}`}>
                    {data.pair}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 rounded-full ${data.color.bar}`}
                      style={{ width: `${data.count * 12}px` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      ×{data.count}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning moment - shown AFTER action */}
      <AnimatePresence>
        {learningMoment && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="text-center p-4 rounded-2xl bg-wv-completed/10 border border-wv-completed/20"
          >
            <p className="text-sm text-wv-completed font-medium">
              {learningMoment}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Vocabulary - grows as you merge */}
      <AnimatePresence>
        {mergedPairs.length > 0 && !learningMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-gradient-wv-hint-bg/50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                AI Vocabulary
              </span>
              <span className="text-xs text-muted-foreground">
                {initialCharCount} chars → {currentTokenCount} tokens
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mergedPairs.map((pair, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: idx * 0.05,
                  }}
                  className="px-3 py-1.5 rounded-lg bg-wv-completed/20 text-wv-completed
                    text-sm font-mono font-bold ring-1 ring-wv-completed/30"
                >
                  {pair}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion celebration */}
      <AnimatePresence>
        {isComplete && !learningMoment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 rounded-2xl bg-gradient-wv-success/10 border border-wv-success/20"
          >
            <p className="text-lg font-bold text-wv-success mb-2">
              Tokenization Complete!
            </p>
            <p className="text-sm text-muted-foreground">
              {initialCharCount} characters → {currentTokenCount} tokens + {mergedPairs.length} vocabulary words
            </p>
            <p className="text-xs text-muted-foreground mt-2 opacity-75">
              This is called BPE. It&apos;s how Claude and GPT learned to read!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
