"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, X, ChevronDown, ChevronUp } from "lucide-react"
import { dictionaryEntries, categoryColors, difficultyColors } from "./mascot-data"
import { categoryIcons } from "./category-icons"
import { termIllustrations } from "./term-illustrations"

interface DictionaryViewProps {
  onBack: () => void
  onClose: () => void
}

export function DictionaryView({ onBack, onClose }: DictionaryViewProps) {
  const [expandedTerms, setExpandedTerms] = useState<Set<number>>(new Set())
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredDictionary = dictionaryEntries.filter((entry) => {
    const matchesSearch =
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.detailedExplanation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedTerms)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedTerms(newExpanded)
  }

  const getTermDefinition = (termName: string): string => {
    const term = dictionaryEntries.find((entry) => entry.term === termName)
    return term ? term.definition : "Definition not found"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={onBack}
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <h3 className="font-bold text-sm">📚 Calculus Dictionary</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Search terms, definitions, or explanations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full p-2 mb-3 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
      >
        <option value="all">All Categories</option>
        <option value="basics">🏗️ Basics - Foundation</option>
        <option value="functions">📊 Functions - Structure</option>
        <option value="limits">🎯 Limits - Approaching</option>
        <option value="derivatives">⚡ Derivatives - Change</option>
        <option value="integrals">📈 Integrals - Accumulation</option>
        <option value="advanced">🧠 Advanced - Complex</option>
      </select>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredDictionary.length > 0 ? (
          filteredDictionary.map((entry, index) => {
            const IconComponent = categoryIcons[entry.category]
            const IllustrationComponent = termIllustrations[entry.term]
            return (
              <div key={index} className={`rounded-lg border-l-4 ${categoryColors[entry.category]} overflow-hidden`}>
                <div
                  className="p-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IconComponent />
                      <h4 className="font-bold text-sm">{entry.term}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[entry.difficulty]}`}
                      >
                        {entry.difficulty}
                      </span>
                      {expandedTerms.has(index) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed">{entry.definition}</p>
                </div>

                <AnimatePresence>
                  {expandedTerms.has(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-current/20"
                    >
                      <div className="p-3 space-y-3 bg-black/5 dark:bg-white/5">
                        {/* Visual Illustration */}
                        {IllustrationComponent && (
                          <div>
                            <h5 className="font-semibold text-xs mb-2">🎨 Visual Illustration</h5>
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-current/20">
                              <IllustrationComponent />
                            </div>
                          </div>
                        )}

                        <div>
                          <h5 className="font-semibold text-xs mb-1">📖 Detailed Explanation</h5>
                          <p className="text-xs leading-relaxed">{entry.detailedExplanation}</p>
                        </div>

                        {entry.formula && (
                          <div>
                            <h5 className="font-semibold text-xs mb-1">🧮 Formula</h5>
                            <code className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded font-mono">
                              {entry.formula}
                            </code>
                          </div>
                        )}

                        {entry.example && (
                          <div>
                            <h5 className="font-semibold text-xs mb-1">💡 Example</h5>
                            <p className="text-xs leading-relaxed italic">{entry.example}</p>
                          </div>
                        )}

                        {entry.illustration && (
                          <div>
                            <h5 className="font-semibold text-xs mb-1">🎯 Key Points</h5>
                            <pre className="text-xs leading-relaxed font-mono bg-black/10 dark:bg-white/10 p-2 rounded whitespace-pre-wrap">
                              {entry.illustration}
                            </pre>
                          </div>
                        )}

                        {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-xs mb-1">🔗 Related Terms</h5>
                            <div className="flex flex-wrap gap-1">
                              {entry.relatedTerms.map((term, i) => (
                                <div key={i} className="relative">
                                  <span
                                    className="text-xs bg-current/20 px-2 py-0.5 rounded-full cursor-help hover:bg-current/30 transition-colors"
                                    onMouseEnter={() => setHoveredTerm(term)}
                                    onMouseLeave={() => setHoveredTerm(null)}
                                  >
                                    {term}
                                  </span>
                                  <AnimatePresence>
                                    {hoveredTerm === term && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg max-w-48 z-50"
                                      >
                                        <div className="font-semibold mb-1">{term}</div>
                                        <div className="text-xs opacity-90">{getTermDefinition(term)}</div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No matching terms found.</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search or category!</p>
          </div>
        )}
      </div>
    </div>
  )
}
