"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/mdx/parse"
import { Topics } from "./mascot-types"




export function DictionaryView({topics}: { topics: Topics }) {

  
  // Extract unique topics and sort by frequency
  const topicEntries = Object.entries(topics).sort((a, b) => b[1].length - a[1].length)


  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 ">

          <div className="p-4">
            <h3 className="font-semibold text-lg">Algorithm Dictionary</h3>
            <p className="text-sm text-muted-foreground">{topicEntries.length} core techniques</p>
          </div>

      </div>

      {/* Dictionary Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {topicEntries.map(([topic, problems]) => (
            <div
              key={topic}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-medium ">{topic.replace(/[_-]/g, ' ')}</h4>
                    <Badge variant="secondary" className="text-xs shrink-0 bg-linear-to-br hover:bg-linear-to-l from-teal-500/50 to-sky-500/50 via-blue-500/50 text-white">
                      {problems.length} problems
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <MarkdownRenderer>
                      {DESCRIPTIONS[topic]}
                    </MarkdownRenderer>
                  </div>
                  
                  {/* Related Topics */}
                  {getRelatedTopics(topic).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getRelatedTopics(topic).map((related) => (
                        <Badge key={related} variant="outline" className="text-xs bg-linear-to-br hover:bg-linear-to-l from-teal-500/30 to-sky-500/30 via-blue-500/30 text-white">
                          {related}
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Stats Footer */}
      {/* <div className="mt-4 pt-3 border-t text-center">
        <div className="text-xs text-muted-foreground">
          Dictionary covers {topicEntries.length} algorithm patterns across {topics.total_problems} problems
        </div>
      </div> */}
    </div>
  )
}



  const DESCRIPTIONS: Record<string, string> = {
    array: `Contiguous, indexable sequence of fixed-type elements with $O(1)$ random access and $O(n)$ insert/delete (except at end in dynamic arrays)`,
    backtrack: `Systematic DFS that builds partial solutions and undoes choices (prunes when constraints fail) to search a state space`,
    bellman_ford: `Single-source shortest paths on weighted graphs with negative edges; relaxes edges *$|V|-1$* times and detects negative cycles`,
    bfs: `Breadth-first traversal using a queue; on unweighted graphs yields shortest path distances in **$O(V+E)$**`,
    binary_search: `Repeatedly halves a sorted search space to locate a target or insertion point in *$O(log n)$*`,
    binary_search_on_answer: `Binary search over monotonic feasibility of answers (not data indices) using a checker predicate`,
    cache: `Fast storage (memory or data structure) that holds recently/computed results to avoid recomputation or slow access`,
    dfs: `Depth-first traversal of graphs/trees using recursion or a stack; explores one branch fully before backtracking`,
    dijkstra: `Single-source shortest paths on non-negative weighted graphs using a priority queue; *$O((V+E)\ log V)$*`,
    dynamic_programming: `Technique of solving problems by breaking them into overlapping subproblems, storing solutions to reuse`,
    game: `Formalized problem with states, players, and payoffs; often analyzed with strategies, minimax, or Nash equilibrium`,
    greedy: `Algorithmic paradigm that builds a solution step-by-step, always choosing the locally optimal option.`,
    kadane: `Linear-time DP for maximum subarray sum; updates best prefix and global maximum in one pass`,
    knapsack: `Optimization problem of maximizing value under capacity constraints; solved via DP or approximations`,
    permutation: `Ordered arrangement of all elements of a set; n elements yield *$n!$* permutations`,
    prefix_sum: `Array where each element stores cumulative totals, enabling *$O(1)$* range queries after *$O(n)$* preprocessing`,
    sliding_window: `Technique of maintaining a moving subsequence (fixed or variable length) to process data in linear time`,
    stack: `LIFO (last-in, first-out) structure supporting *$O(1)$* push/pop; used in parsing, DFS, recursion`,
    trie: `Tree-like data structure for strings where each edge represents a character; supports fast prefix queries`
  };
 

function getRelatedTopics(topic: string): string[] {
  const relations: Record<string, string[]> = {
    'bfs': ['dfs', 'graph traversal'],
    'binary_search': ['divide & conquer', 'sorted arrays'],
    'dp': ['memoization', 'optimization'],
    'dijkstra': ['shortest path', 'priority queue'],
    'kadane': ['maximum subarray', 'dp'],
    'backtrack': ['recursion', 'constraint satisfaction'],
    'trie': ['string algorithms', 'prefix tree'],
    'cache': ['LRU', 'LFU', 'data structures'],
    'stack': ['LIFO', 'parsing', 'monotonic'],
    'sliding_window': ['two pointers', 'subarray'],
    'bellman_ford': ['shortest path', 'negative cycles'],
    'knapsack': ['dp', '0/1 knapsack', 'unbounded']
  }
  
  return relations[topic] || []
}


