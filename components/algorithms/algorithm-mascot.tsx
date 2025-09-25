"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Code2,
  ExternalLink,
  BookOpen,
  Zap,
  Brain,
  Target,
  Layers,
  Clock,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAlgorithmIllustration, getTopicIllustration } from "./algorithm-illustrations"

// Types for algorithm data
interface AlgorithmComplexity {
  time: string;
  space: string;
  explanation?: string;
}

interface AlgorithmLeetCode {
  problem: string;
  url?: string;
}

interface Algorithm {
  name: string;
  title: string;
  summary?: string;
  complexity?: AlgorithmComplexity;
  topics?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
  leetcode?: AlgorithmLeetCode;
  related?: string[];
  prerequisites?: string[];
  intuition?: string;
  applications?: string[];
}

interface AlgorithmMascotProps {
  isOpen: boolean;
  onClose: () => void;
  algorithms?: Record<string, Algorithm>;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300", 
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  expert: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
};

const difficultyIcons = {
  beginner: "🌱",
  intermediate: "⚡",
  advanced: "🔥", 
  expert: "💎"
};

// Mock data for development - replace with actual data
const mockAlgorithms: Record<string, Algorithm> = {
  binary_search: {
    name: "binary_search",
    title: "Binary Search",
    summary: "Find target value in sorted array using divide-and-conquer approach.",
    complexity: {
      time: "O(log n)",
      space: "O(1)",
      explanation: "Halve search space each iteration, constant extra space"
    },
    topics: ["searching", "divide-conquer", "arrays"],
    difficulty: "beginner",
    leetcode: {
      problem: "704. Binary Search", 
      url: "https://leetcode.com/problems/binary-search/"
    },
    related: ["binary_search_left", "binary_search_right", "ternary_search"],
    prerequisites: ["arrays", "recursion"],
    intuition: "Compare target with middle element, eliminate half the search space each time.",
    applications: ["database-search", "optimization", "peak-finding"]
  },
  dfs: {
    name: "dfs",
    title: "Depth-First Search",
    summary: "Traverse graph by exploring as far as possible before backtracking.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
      explanation: "Visit all vertices and edges, recursion stack space"
    },
    topics: ["graphs", "traversal", "recursion"],
    difficulty: "intermediate",
    related: ["bfs", "topological_sort", "connected_components"],
    intuition: "Go deep first, then backtrack - like exploring a maze systematically."
  },
  dynamic_programming: {
    name: "dynamic_programming", 
    title: "Dynamic Programming",
    summary: "Solve complex problems by breaking into overlapping subproblems.",
    complexity: {
      time: "O(n²)",
      space: "O(n)",
      explanation: "Depends on problem - typically polynomial time and space"
    },
    topics: ["dynamic-programming", "optimization", "memoization"],
    difficulty: "advanced",
    related: ["memoization", "tabulation", "greedy"],
    intuition: "Remember solutions to avoid recomputing - trade space for time."
  }
};

export function AlgorithmMascot({ isOpen, onClose, algorithms = mockAlgorithms }: AlgorithmMascotProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract all unique topics
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    Object.values(algorithms).forEach(alg => {
      alg.topics?.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  }, [algorithms]);

  // Filter algorithms based on search and filters
  const filteredAlgorithms = useMemo(() => {
    return Object.values(algorithms).filter(algorithm => {
      const matchesSearch = !searchQuery || 
        algorithm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algorithm.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algorithm.intuition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algorithm.topics?.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTopics = selectedTopics.size === 0 ||
        algorithm.topics?.some(topic => selectedTopics.has(topic));

      const matchesDifficulty = selectedDifficulty === "all" ||
        algorithm.difficulty === selectedDifficulty;

      return matchesSearch && matchesTopics && matchesDifficulty;
    });
  }, [algorithms, searchQuery, selectedTopics, selectedDifficulty]);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTopics(new Set());
    setSelectedDifficulty("all");
    setSearchQuery("");
  }, []);

  const toggleExpanded = useCallback((algorithmName: string) => {
    setExpandedAlgorithm(prev => prev === algorithmName ? null : algorithmName);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Brain size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Algorithm Dictionary
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredAlgorithms.length} algorithms • Modern learning companion
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label="Close dictionary"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search algorithms, topics, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                </div>
                
                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">⚡ Intermediate</option>
                  <option value="advanced">🔥 Advanced</option>
                  <option value="expert">💎 Expert</option>
                </select>

                {/* Topic Filters */}
                <div className="flex flex-wrap gap-2">
                  {allTopics.slice(0, 6).map(topic => {
                    const TopicIcon = getTopicIllustration(topic);
                    const isSelected = selectedTopics.has(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                          isSelected
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500/50"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        <TopicIcon size={12} />
                        {topic.replace('-', ' ')}
                      </button>
                    );
                  })}
                </div>

                {/* Clear Filters */}
                {(selectedTopics.size > 0 || selectedDifficulty !== "all" || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                )}

                {/* View Mode Toggle */}
                <div className="ml-auto flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-all",
                      viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-600"
                    )}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-all", 
                      viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-600"
                    )}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredAlgorithms.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No algorithms found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {filteredAlgorithms.map((algorithm) => {
                  const AlgorithmIcon = getAlgorithmIllustration(algorithm.name);
                  const isExpanded = expandedAlgorithm === algorithm.name;
                  
                  return (
                    <motion.div
                      key={algorithm.name}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600",
                        isExpanded && "shadow-xl ring-2 ring-blue-500/20"
                      )}
                    >
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => toggleExpanded(algorithm.name)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex-shrink-0">
                              <AlgorithmIcon size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                {algorithm.title}
                              </h3>
                              {algorithm.difficulty && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    difficultyColors[algorithm.difficulty]
                                  )}>
                                    {difficultyIcons[algorithm.difficulty]} {algorithm.difficulty}
                                  </span>
                                  {algorithm.complexity && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Clock size={10} />
                                      {algorithm.complexity.time}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>

                        {/* Summary */}
                        {algorithm.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {algorithm.summary}
                          </p>
                        )}

                        {/* Topics */}
                        {algorithm.topics && algorithm.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {algorithm.topics.slice(0, 3).map(topic => {
                              const TopicIcon = getTopicIllustration(topic);
                              return (
                                <span 
                                  key={topic}
                                  className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1"
                                >
                                  <TopicIcon size={10} />
                                  {topic.replace('-', ' ')}
                                </span>
                              );
                            })}
                            {algorithm.topics.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                +{algorithm.topics.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                          {algorithm.leetcode && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (algorithm.leetcode?.url) {
                                  window.open(algorithm.leetcode.url, '_blank');
                                }
                              }}
                              className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs rounded flex items-center gap-1 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                            >
                              <ExternalLink size={10} />
                              LeetCode
                            </button>
                          )}
                          <button className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded flex items-center gap-1 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                            <Code2 size={10} />
                            Code
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-200 dark:border-gray-700"
                          >
                            <div className="p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/50">
                              {/* Complexity Details */}
                              {algorithm.complexity && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Zap size={14} />
                                    Complexity Analysis
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                                      <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded font-mono text-xs">
                                        {algorithm.complexity.time}
                                      </code>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Space:</span>
                                      <code className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded font-mono text-xs">
                                        {algorithm.complexity.space}
                                      </code>
                                    </div>
                                    {algorithm.complexity.explanation && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                        {algorithm.complexity.explanation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Intuition */}
                              {algorithm.intuition && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Target size={14} />
                                    Key Intuition
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {algorithm.intuition}
                                  </p>
                                </div>
                              )}

                              {/* Applications */}
                              {algorithm.applications && algorithm.applications.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Layers size={14} />
                                    Applications
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {algorithm.applications.map(app => (
                                      <span 
                                        key={app}
                                        className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded"
                                      >
                                        {app.replace('-', ' ')}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Related Algorithms */}
                              {algorithm.related && algorithm.related.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <BookOpen size={14} />
                                    Related Algorithms
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {algorithm.related.map(related => (
                                      <button
                                        key={related}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (algorithms[related]) {
                                            setExpandedAlgorithm(related);
                                          }
                                        }}
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                      >
                                        {related.replace('_', ' ')}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Prerequisites */}
                              {algorithm.prerequisites && algorithm.prerequisites.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Star size={14} />
                                    Prerequisites
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {algorithm.prerequisites.map(prereq => (
                                      <span 
                                        key={prereq}
                                        className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded"
                                      >
                                        {prereq.replace('-', ' ')}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}