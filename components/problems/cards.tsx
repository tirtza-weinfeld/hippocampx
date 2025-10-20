import { FilterProvider } from '@/components/mdx/problem/card/filter-context'
import { ProblemCardProvider } from '@/components/mdx/problem/card/problem-context'
import { ProblemCardFilterHeader } from '@/components/mdx/problem/card/filter-header'
import { ProblemCard } from '@/components/mdx/problem/card/problem'
import { ProblemCardHeader } from '@/components/mdx/problem/card/callout-header'

// Metadata extracted during build time
const CARDS_METADATA = {
  "121-best-time-to-buy-and-sell-stock": {
    id: "121-best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    topics: ["dynamic-programming"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "122-best-time-to-buy-and-sell-stock-ii": {
    id: "122-best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "medium",
    topics: ["greedy"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "123-best-time-to-buy-and-sell-stock-iii": {
    id: "123-best-time-to-buy-and-sell-stock-iii",
    title: "Best Time to Buy and Sell Stock III",
    difficulty: "hard",
    topics: ["dynamic-programming","array"],
    solutionFiles: ["dp.py","state.py"],
    defaultFile: "dp.py",
  },
  "188-best-time-to-buy-and-sell-stock-iv": {
    id: "188-best-time-to-buy-and-sell-stock-iv",
    title: "Best Time to Buy and Sell Stock IV",
    difficulty: "hard",
    topics: ["dynamic-programming"],
    solutionFiles: ["dp.py","states.py"],
    defaultFile: "dp.py",
  },
  "102-binary-tree-level-order-traversal": {
    id: "102-binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    topics: [],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "124-binary-tree-maximum-path-sum": {
    id: "124-binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "hard",
    topics: ["kadane"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1011-capacity-to-ship-packages-within-d-days": {
    id: "1011-capacity-to-ship-packages-within-d-days",
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "medium",
    topics: ["binary-search"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "787-cheapest-flights-within-k-stops": {
    id: "787-cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    difficulty: "medium",
    topics: ["dijkstra","bfs"],
    solutionFiles: ["dijkstra.py","bellman_ford.py"],
    defaultFile: "dijkstra.py",
  },
  "70-climbing-stairs": {
    id: "70-climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    topics: ["dynamic-programming"],
    solutionFiles: ["bottomup.py","topdown.py"],
    defaultFile: "bottomup.py",
  },
  "133-clone-graph": {
    id: "133-clone-graph",
    title: "Clone Graph",
    difficulty: "medium",
    topics: ["bfs"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "518-coin-change-ii": {
    id: "518-coin-change-ii",
    title: "Coin Change II",
    difficulty: "medium",
    topics: ["dynamic-programming","knapsack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "39-combination-sum": {
    id: "39-combination-sum",
    title: "Combination Sum",
    difficulty: "medium",
    topics: ["backtrack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "525-contiguous-array": {
    id: "525-contiguous-array",
    title: "Contiguous Array",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "523-continuous-subarray-sum": {
    id: "523-continuous-subarray-sum",
    title: "Continuous Subarray Sum",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "2145-count-the-hidden-sequences": {
    id: "2145-count-the-hidden-sequences",
    title: "Count the Hidden Sequences",
    difficulty: "medium",
    topics: ["array"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "394-decode-string": {
    id: "394-decode-string",
    title: "Decode String",
    difficulty: "medium",
    topics: ["stack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "211-design-add-and-search-words-data-structure": {
    id: "211-design-add-and-search-words-data-structure",
    title: "Design Add and Search Words Data Structure",
    difficulty: "medium",
    topics: ["trie"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "34-find-first-and-last-position-of-element-in-sorted-array": {
    id: "34-find-first-and-last-position-of-element-in-sorted-array",
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "medium",
    topics: ["binary-search"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "153-find-minimum-in-rotated-sorted-array": {
    id: "153-find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    topics: ["binary-search"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "198-house-robber": {
    id: "198-house-robber",
    title: "House Robber",
    difficulty: "medium",
    topics: ["dynamic_programming","dynamic_programming-1D"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "208-implement-trie-prefix-tree": {
    id: "208-implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "medium",
    topics: ["trie"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "875-koko-eating-bananas": {
    id: "875-koko-eating-bananas",
    title: "Koko Eating Bananas",
    difficulty: "medium",
    topics: ["binary-search","binary-search-answer-space"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "215-kth-largest-element-in-an-array": {
    id: "215-kth-largest-element-in-an-array",
    title: "Kth Largest Element In An Array",
    difficulty: "medium",
    topics: ["heap","min-heap"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "84-largest-rectangle-in-histogram": {
    id: "84-largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "hard",
    topics: ["stack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "460-lfu-cache": {
    id: "460-lfu-cache",
    title: "LFU Cache",
    difficulty: "hard",
    topics: ["cache"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "3-longest-substring-without-repeating-characters": {
    id: "3-longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topics: ["sliding-window"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "146-lru-cache": {
    id: "146-lru-cache",
    title: "LRU Cache",
    difficulty: "medium",
    topics: ["cache"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1590-make-sum-divisible-by-p": {
    id: "1590-make-sum-divisible-by-p",
    title: "Make Sum Divisible by P",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "542-01-matrix": {
    id: "542-01-matrix",
    title: "01 Matrix",
    difficulty: "medium",
    topics: ["bfs"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "152-maximum-product-subarray": {
    id: "152-maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "medium",
    topics: ["dynamic-programming"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "325-maximum-size-subarray-sum-equals-k": {
    id: "325-maximum-size-subarray-sum-equals-k",
    title: "Maximum Size Subarray Sum Equals k",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "53-maximum-subarray": {
    id: "53-maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "medium",
    topics: ["kadane"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "918-maximum-sum-of-circular-subarray": {
    id: "918-maximum-sum-of-circular-subarray",
    title: "Maximum Sum of Circular Subarray",
    difficulty: "medium",
    topics: ["kadane"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "363-max-sum-of-rectangle-no-larger-than-k": {
    id: "363-max-sum-of-rectangle-no-larger-than-k",
    title: "Max Sum of Rectangle No Larger Than K",
    difficulty: "hard",
    topics: ["kadane"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "76-minimum-window-substring": {
    id: "76-minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "hard",
    topics: ["sliding-window"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "743-network-delay-time": {
    id: "743-network-delay-time",
    title: "Network Delay Time",
    difficulty: "medium",
    topics: ["dijkstra"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "51-n-queens": {
    id: "51-n-queens",
    title: "N-Queens",
    difficulty: "hard",
    topics: ["backtrack","game"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "191-number-of-1-bits": {
    id: "191-number-of-1-bits",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    topics: ["bit-manipulation"],
    solutionFiles: ["bit_count.py","brian-kernighan.py"],
    defaultFile: "bit_count.py",
  },
  "200-number-of-islands": {
    id: "200-number-of-islands",
    title: "Number of Islands",
    difficulty: "medium",
    topics: ["dfs","bfs"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "416-partition-equal-subset-sum": {
    id: "416-partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "medium",
    topics: ["dynamic-programming"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1514-path-with-maximum-probability": {
    id: "1514-path-with-maximum-probability",
    title: "Path with Maximum Probability",
    difficulty: "medium",
    topics: ["bellman-ford"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1631-path-with-minimum-effort": {
    id: "1631-path-with-minimum-effort",
    title: "Path With Minimum Effort",
    difficulty: "medium",
    topics: ["dijkstra"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "46-permutations": {
    id: "46-permutations",
    title: "Permutations",
    difficulty: "medium",
    topics: ["backtrack","permutation"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "238-product-of-array-except-self": {
    id: "238-product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "medium",
    topics: ["prefix-suffix","two-pass-scan"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "370-range-addition": {
    id: "370-range-addition",
    title: "Range Addition",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "648-replace-words": {
    id: "648-replace-words",
    title: "Replace Words",
    difficulty: "medium",
    topics: ["trie"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "994-rotting-oranges": {
    id: "994-rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "medium",
    topics: ["bfs"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "33-search-in-rotated-sorted-array": {
    id: "33-search-in-rotated-sorted-array",
    title: "Search In Rotated Sorted Array",
    difficulty: "medium",
    topics: ["binary-search","rotated-array"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "35-search-insert-position": {
    id: "35-search-insert-position",
    title: "Search Insert Position",
    difficulty: "easy",
    topics: ["binary-search"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1293-shortest-path-in-a-grid-with-obstacles-elimination": {
    id: "1293-shortest-path-in-a-grid-with-obstacles-elimination",
    title: "Shortest Path in a Grid with Obstacles Elimination",
    difficulty: "hard",
    topics: ["bfs"],
    solutionFiles: ["dijkstra.py","a_star.py","bfs.py"],
    defaultFile: "a_star.py",
  },
  "136-single-number": {
    id: "136-single-number",
    title: "Single Number",
    difficulty: "Easy",
    topics: ["bit-manipulation"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "909-snakes-and-ladders": {
    id: "909-snakes-and-ladders",
    title: "Snakes and Ladders",
    difficulty: "medium",
    topics: ["bfs"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "2140-solving-questions-with-brainpower": {
    id: "2140-solving-questions-with-brainpower",
    title: "Most Points Solving Questions With Brainpower",
    difficulty: "medium",
    topics: ["dynamic-programming"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1406-stone-game-iii": {
    id: "1406-stone-game-iii",
    title: "Stone Game III",
    difficulty: "hard",
    topics: ["game","dynamic-programming"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1510-stone-game-iv": {
    id: "1510-stone-game-iv",
    title: "Stone Game IV",
    difficulty: "hard",
    topics: ["dynamic-programming","game"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "713-subarray-product-less-than-k": {
    id: "713-subarray-product-less-than-k",
    title: "Number of Subarrays with Product Less Than K",
    difficulty: "medium",
    topics: ["sliding-window"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "560-subarray-sum-equals-k": {
    id: "560-subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "974-subarray-sums-divisible-by-k": {
    id: "974-subarray-sums-divisible-by-k",
    title: "Subarray Sums Divisible by K",
    difficulty: "medium",
    topics: ["prefix-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "37-sudoku-solver": {
    id: "37-sudoku-solver",
    title: "Sudoku Solver",
    difficulty: "hard",
    topics: ["game"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "778-swim-in-rising-water": {
    id: "778-swim-in-rising-water",
    title: "Swim in Rising Water",
    difficulty: "hard",
    topics: ["dijkstra"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "347-top-k-frequent-elements": {
    id: "347-top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "medium",
    topics: ["heap","min-heap"],
    solutionFiles: ["heap.py","sort-frequency-bucketing.py","heap-nlargets.py"],
    defaultFile: "heap.py",
  },
  "120-triangle": {
    id: "120-triangle",
    title: "Triangle Minimum Path Sum",
    difficulty: "medium",
    topics: ["dynamic-programming"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "1-two-sum": {
    id: "1-two-sum",
    title: "Two Sum",
    difficulty: "easy",
    topics: ["hash-table","k-sum"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "20-valid-parentheses": {
    id: "20-valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    topics: ["stack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "36-valid-sudoku": {
    id: "36-valid-sudoku",
    title: "Valid Sudoku",
    difficulty: "medium",
    topics: ["game"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "127-word-ladder": {
    id: "127-word-ladder",
    title: "Word Ladder",
    difficulty: "hard",
    topics: ["bfs"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "79-word-search": {
    id: "79-word-search",
    title: "Word Search",
    difficulty: "medium",
    topics: ["backtrack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
  "212-word-search-ii": {
    id: "212-word-search-ii",
    title: "Word Search II",
    difficulty: "hard",
    topics: ["trie","backtrack"],
    solutionFiles: ["solution.py"],
    defaultFile: "",
  },
} as const

// Dynamic imports for card content
import BestTimeToBuyAndSellStockContent from './cards/121-best-time-to-buy-and-sell-stock.mdx'
import BestTimeToBuyAndSellStockIiContent from './cards/122-best-time-to-buy-and-sell-stock-ii.mdx'
import BestTimeToBuyAndSellStockIiiContent from './cards/123-best-time-to-buy-and-sell-stock-iii.mdx'
import BestTimeToBuyAndSellStockIvContent from './cards/188-best-time-to-buy-and-sell-stock-iv.mdx'
import BinaryTreeLevelOrderTraversalContent from './cards/102-binary-tree-level-order-traversal.mdx'
import BinaryTreeMaximumPathSumContent from './cards/124-binary-tree-maximum-path-sum.mdx'
import CapacityToShipPackagesWithinDDaysContent from './cards/1011-capacity-to-ship-packages-within-d-days.mdx'
import CheapestFlightsWithinKStopsContent from './cards/787-cheapest-flights-within-k-stops.mdx'
import ClimbingStairsContent from './cards/70-climbing-stairs.mdx'
import CloneGraphContent from './cards/133-clone-graph.mdx'
import CoinChangeIiContent from './cards/518-coin-change-ii.mdx'
import CombinationSumContent from './cards/39-combination-sum.mdx'
import ContiguousArrayContent from './cards/525-contiguous-array.mdx'
import ContinuousSubarraySumContent from './cards/523-continuous-subarray-sum.mdx'
import CountTheHiddenSequencesContent from './cards/2145-count-the-hidden-sequences.mdx'
import DecodeStringContent from './cards/394-decode-string.mdx'
import DesignAddAndSearchWordsDataStructureContent from './cards/211-design-add-and-search-words-data-structure.mdx'
import FindFirstAndLastPositionOfElementInSortedArrayContent from './cards/34-find-first-and-last-position-of-element-in-sorted-array.mdx'
import FindMinimumInRotatedSortedArrayContent from './cards/153-find-minimum-in-rotated-sorted-array.mdx'
import HouseRobberContent from './cards/198-house-robber.mdx'
import ImplementTriePrefixTreeContent from './cards/208-implement-trie-prefix-tree.mdx'
import KokoEatingBananasContent from './cards/875-koko-eating-bananas.mdx'
import KthLargestElementInAnArrayContent from './cards/215-kth-largest-element-in-an-array.mdx'
import LargestRectangleInHistogramContent from './cards/84-largest-rectangle-in-histogram.mdx'
import LfuCacheContent from './cards/460-lfu-cache.mdx'
import LongestSubstringWithoutRepeatingCharactersContent from './cards/3-longest-substring-without-repeating-characters.mdx'
import LruCacheContent from './cards/146-lru-cache.mdx'
import MakeSumDivisibleByPContent from './cards/1590-make-sum-divisible-by-p.mdx'
import MatrixContent from './cards/542-01-matrix.mdx'
import MaximumProductSubarrayContent from './cards/152-maximum-product-subarray.mdx'
import MaximumSizeSubarraySumEqualsKContent from './cards/325-maximum-size-subarray-sum-equals-k.mdx'
import MaximumSubarrayContent from './cards/53-maximum-subarray.mdx'
import MaximumSumOfCircularSubarrayContent from './cards/918-maximum-sum-of-circular-subarray.mdx'
import MaxSumOfRectangleNoLargerThanKContent from './cards/363-max-sum-of-rectangle-no-larger-than-k.mdx'
import MinimumWindowSubstringContent from './cards/76-minimum-window-substring.mdx'
import NetworkDelayTimeContent from './cards/743-network-delay-time.mdx'
import NQueensContent from './cards/51-n-queens.mdx'
import NumberOfBitsContent from './cards/191-number-of-1-bits.mdx'
import NumberOfIslandsContent from './cards/200-number-of-islands.mdx'
import PartitionEqualSubsetSumContent from './cards/416-partition-equal-subset-sum.mdx'
import PathWithMaximumProbabilityContent from './cards/1514-path-with-maximum-probability.mdx'
import PathWithMinimumEffortContent from './cards/1631-path-with-minimum-effort.mdx'
import PermutationsContent from './cards/46-permutations.mdx'
import ProductOfArrayExceptSelfContent from './cards/238-product-of-array-except-self.mdx'
import RangeAdditionContent from './cards/370-range-addition.mdx'
import ReplaceWordsContent from './cards/648-replace-words.mdx'
import RottingOrangesContent from './cards/994-rotting-oranges.mdx'
import SearchInRotatedSortedArrayContent from './cards/33-search-in-rotated-sorted-array.mdx'
import SearchInsertPositionContent from './cards/35-search-insert-position.mdx'
import ShortestPathInAGridWithObstaclesEliminationContent from './cards/1293-shortest-path-in-a-grid-with-obstacles-elimination.mdx'
import SingleNumberContent from './cards/136-single-number.mdx'
import SnakesAndLaddersContent from './cards/909-snakes-and-ladders.mdx'
import SolvingQuestionsWithBrainpowerContent from './cards/2140-solving-questions-with-brainpower.mdx'
import StoneGameIiiContent from './cards/1406-stone-game-iii.mdx'
import StoneGameIvContent from './cards/1510-stone-game-iv.mdx'
import SubarrayProductLessThanKContent from './cards/713-subarray-product-less-than-k.mdx'
import SubarraySumEqualsKContent from './cards/560-subarray-sum-equals-k.mdx'
import SubarraySumsDivisibleByKContent from './cards/974-subarray-sums-divisible-by-k.mdx'
import SudokuSolverContent from './cards/37-sudoku-solver.mdx'
import SwimInRisingWaterContent from './cards/778-swim-in-rising-water.mdx'
import TopKFrequentElementsContent from './cards/347-top-k-frequent-elements.mdx'
import TriangleContent from './cards/120-triangle.mdx'
import TwoSumContent from './cards/1-two-sum.mdx'
import ValidParenthesesContent from './cards/20-valid-parentheses.mdx'
import ValidSudokuContent from './cards/36-valid-sudoku.mdx'
import WordLadderContent from './cards/127-word-ladder.mdx'
import WordSearchContent from './cards/79-word-search.mdx'
import WordSearchIiContent from './cards/212-word-search-ii.mdx'

// Card shell renders with metadata and content
function CardShell({ id, Content }: { id: string; Content: React.ComponentType<any> }) {
  const meta = CARDS_METADATA[id as keyof typeof CARDS_METADATA]
  if (!meta) return null

  const topics = meta.topics.join(',')
  const solutionFiles = [...meta.solutionFiles] // Convert readonly to mutable

  return (
    <ProblemCard
      id={meta.id}
      difficulty={meta.difficulty}
      topics={topics}
      title={meta.title}
      defaultFile={meta.defaultFile}
      solutionFiles={solutionFiles}
    >
      <ProblemCardHeader id={meta.id}>
        {meta.title}
      </ProblemCardHeader>
      <Content />
    </ProblemCard>
  )
}

export default function ProblemsCards() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">LeetCode Problems</h1>

      <FilterProvider>
        <ProblemCardProvider
          problemIds={["37-sudoku-solver","1631-path-with-minimum-effort","909-snakes-and-ladders","1-two-sum","152-maximum-product-subarray","1293-shortest-path-in-a-grid-with-obstacles-elimination","648-replace-words","394-decode-string","211-design-add-and-search-words-data-structure","1406-stone-game-iii","875-koko-eating-bananas","460-lfu-cache","133-clone-graph","238-product-of-array-except-self","523-continuous-subarray-sum","518-coin-change-ii","416-partition-equal-subset-sum","188-best-time-to-buy-and-sell-stock-iv","20-valid-parentheses","370-range-addition","120-triangle","787-cheapest-flights-within-k-stops","363-max-sum-of-rectangle-no-larger-than-k","778-swim-in-rising-water","525-contiguous-array","3-longest-substring-without-repeating-characters","51-n-queens","560-subarray-sum-equals-k","1590-make-sum-divisible-by-p","191-number-of-1-bits","70-climbing-stairs","918-maximum-sum-of-circular-subarray","215-kth-largest-element-in-an-array","198-house-robber","146-lru-cache","102-binary-tree-level-order-traversal","974-subarray-sums-divisible-by-k","122-best-time-to-buy-and-sell-stock-ii","33-search-in-rotated-sorted-array","124-binary-tree-maximum-path-sum","1510-stone-game-iv","153-find-minimum-in-rotated-sorted-array","994-rotting-oranges","121-best-time-to-buy-and-sell-stock","53-maximum-subarray","34-find-first-and-last-position-of-element-in-sorted-array","76-minimum-window-substring","84-largest-rectangle-in-histogram","136-single-number","1514-path-with-maximum-probability","79-word-search","39-combination-sum","542-01-matrix","1011-capacity-to-ship-packages-within-d-days","208-implement-trie-prefix-tree","325-maximum-size-subarray-sum-equals-k","2145-count-the-hidden-sequences","35-search-insert-position","46-permutations","123-best-time-to-buy-and-sell-stock-iii","347-top-k-frequent-elements","200-number-of-islands","2140-solving-questions-with-brainpower","212-word-search-ii","713-subarray-product-less-than-k","36-valid-sudoku","743-network-delay-time","127-word-ladder"]}
          defaultExpanded={false}
        >
          <ProblemCardFilterHeader />

          <div className="space-y-4">
            <CardShell id="121-best-time-to-buy-and-sell-stock" Content={BestTimeToBuyAndSellStockContent} />
            <CardShell id="122-best-time-to-buy-and-sell-stock-ii" Content={BestTimeToBuyAndSellStockIiContent} />
            <CardShell id="123-best-time-to-buy-and-sell-stock-iii" Content={BestTimeToBuyAndSellStockIiiContent} />
            <CardShell id="188-best-time-to-buy-and-sell-stock-iv" Content={BestTimeToBuyAndSellStockIvContent} />
            <CardShell id="102-binary-tree-level-order-traversal" Content={BinaryTreeLevelOrderTraversalContent} />
            <CardShell id="124-binary-tree-maximum-path-sum" Content={BinaryTreeMaximumPathSumContent} />
            <CardShell id="1011-capacity-to-ship-packages-within-d-days" Content={CapacityToShipPackagesWithinDDaysContent} />
            <CardShell id="787-cheapest-flights-within-k-stops" Content={CheapestFlightsWithinKStopsContent} />
            <CardShell id="70-climbing-stairs" Content={ClimbingStairsContent} />
            <CardShell id="133-clone-graph" Content={CloneGraphContent} />
            <CardShell id="518-coin-change-ii" Content={CoinChangeIiContent} />
            <CardShell id="39-combination-sum" Content={CombinationSumContent} />
            <CardShell id="525-contiguous-array" Content={ContiguousArrayContent} />
            <CardShell id="523-continuous-subarray-sum" Content={ContinuousSubarraySumContent} />
            <CardShell id="2145-count-the-hidden-sequences" Content={CountTheHiddenSequencesContent} />
            <CardShell id="394-decode-string" Content={DecodeStringContent} />
            <CardShell id="211-design-add-and-search-words-data-structure" Content={DesignAddAndSearchWordsDataStructureContent} />
            <CardShell id="34-find-first-and-last-position-of-element-in-sorted-array" Content={FindFirstAndLastPositionOfElementInSortedArrayContent} />
            <CardShell id="153-find-minimum-in-rotated-sorted-array" Content={FindMinimumInRotatedSortedArrayContent} />
            <CardShell id="198-house-robber" Content={HouseRobberContent} />
            <CardShell id="208-implement-trie-prefix-tree" Content={ImplementTriePrefixTreeContent} />
            <CardShell id="875-koko-eating-bananas" Content={KokoEatingBananasContent} />
            <CardShell id="215-kth-largest-element-in-an-array" Content={KthLargestElementInAnArrayContent} />
            <CardShell id="84-largest-rectangle-in-histogram" Content={LargestRectangleInHistogramContent} />
            <CardShell id="460-lfu-cache" Content={LfuCacheContent} />
            <CardShell id="3-longest-substring-without-repeating-characters" Content={LongestSubstringWithoutRepeatingCharactersContent} />
            <CardShell id="146-lru-cache" Content={LruCacheContent} />
            <CardShell id="1590-make-sum-divisible-by-p" Content={MakeSumDivisibleByPContent} />
            <CardShell id="542-01-matrix" Content={MatrixContent} />
            <CardShell id="152-maximum-product-subarray" Content={MaximumProductSubarrayContent} />
            <CardShell id="325-maximum-size-subarray-sum-equals-k" Content={MaximumSizeSubarraySumEqualsKContent} />
            <CardShell id="53-maximum-subarray" Content={MaximumSubarrayContent} />
            <CardShell id="918-maximum-sum-of-circular-subarray" Content={MaximumSumOfCircularSubarrayContent} />
            <CardShell id="363-max-sum-of-rectangle-no-larger-than-k" Content={MaxSumOfRectangleNoLargerThanKContent} />
            <CardShell id="76-minimum-window-substring" Content={MinimumWindowSubstringContent} />
            <CardShell id="743-network-delay-time" Content={NetworkDelayTimeContent} />
            <CardShell id="51-n-queens" Content={NQueensContent} />
            <CardShell id="191-number-of-1-bits" Content={NumberOfBitsContent} />
            <CardShell id="200-number-of-islands" Content={NumberOfIslandsContent} />
            <CardShell id="416-partition-equal-subset-sum" Content={PartitionEqualSubsetSumContent} />
            <CardShell id="1514-path-with-maximum-probability" Content={PathWithMaximumProbabilityContent} />
            <CardShell id="1631-path-with-minimum-effort" Content={PathWithMinimumEffortContent} />
            <CardShell id="46-permutations" Content={PermutationsContent} />
            <CardShell id="238-product-of-array-except-self" Content={ProductOfArrayExceptSelfContent} />
            <CardShell id="370-range-addition" Content={RangeAdditionContent} />
            <CardShell id="648-replace-words" Content={ReplaceWordsContent} />
            <CardShell id="994-rotting-oranges" Content={RottingOrangesContent} />
            <CardShell id="33-search-in-rotated-sorted-array" Content={SearchInRotatedSortedArrayContent} />
            <CardShell id="35-search-insert-position" Content={SearchInsertPositionContent} />
            <CardShell id="1293-shortest-path-in-a-grid-with-obstacles-elimination" Content={ShortestPathInAGridWithObstaclesEliminationContent} />
            <CardShell id="136-single-number" Content={SingleNumberContent} />
            <CardShell id="909-snakes-and-ladders" Content={SnakesAndLaddersContent} />
            <CardShell id="2140-solving-questions-with-brainpower" Content={SolvingQuestionsWithBrainpowerContent} />
            <CardShell id="1406-stone-game-iii" Content={StoneGameIiiContent} />
            <CardShell id="1510-stone-game-iv" Content={StoneGameIvContent} />
            <CardShell id="713-subarray-product-less-than-k" Content={SubarrayProductLessThanKContent} />
            <CardShell id="560-subarray-sum-equals-k" Content={SubarraySumEqualsKContent} />
            <CardShell id="974-subarray-sums-divisible-by-k" Content={SubarraySumsDivisibleByKContent} />
            <CardShell id="37-sudoku-solver" Content={SudokuSolverContent} />
            <CardShell id="778-swim-in-rising-water" Content={SwimInRisingWaterContent} />
            <CardShell id="347-top-k-frequent-elements" Content={TopKFrequentElementsContent} />
            <CardShell id="120-triangle" Content={TriangleContent} />
            <CardShell id="1-two-sum" Content={TwoSumContent} />
            <CardShell id="20-valid-parentheses" Content={ValidParenthesesContent} />
            <CardShell id="36-valid-sudoku" Content={ValidSudokuContent} />
            <CardShell id="127-word-ladder" Content={WordLadderContent} />
            <CardShell id="79-word-search" Content={WordSearchContent} />
            <CardShell id="212-word-search-ii" Content={WordSearchIiContent} />
          </div>
        </ProblemCardProvider>
      </FilterProvider>
    </div>
  )
}
