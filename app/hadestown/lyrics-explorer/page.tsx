"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MusicIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedTabs, AnimatedTabsList, AnimatedTab, AnimatedTabsContent } from "@/components/hadestown/animated-tabs"

// Sample song data with vocabulary words and sample lyrics (for educational purposes)
const SONGS = [
  {
    id: "road-to-hell",
    title: "Road to Hell",
    description: "The opening song where Hermes introduces the ancient story",
    lyrics: [
      {
        verse: "On the road to hell there was a railroad track",
        vocabWords: [],
      },
      {
        verse: "And there was a poor boy workin' on the railway line",
        vocabWords: [],
      },
      {
        verse: "Pickin' up the pieces of what the world left behind",
        vocabWords: [],
      },
      {
        verse: "It's a sad song, it's a sad tale, it's a *tragedy*",
        vocabWords: [
          {
            word: "tragedy",
            definition: "A play or story that ends sadly, often with the death of the main character",
            partOfSpeech: "noun",
            example: "The story of Orpheus and Eurydice is a tragedy because it ends in sadness.",
          },
        ],
      },
      {
        verse: "It's a sad song, but we sing it anyway",
        vocabWords: [],
      },
      {
        verse: "He was a poor boy with his heart in his hands",
        vocabWords: [],
      },
      {
        verse: "On the *lyre* singing tunes of love and *abandonment*",
        vocabWords: [
          {
            word: "lyre",
            definition: "A stringed instrument like a small U-shaped harp used in ancient Greece",
            partOfSpeech: "noun",
            example: "Orpheus played beautiful music on his lyre.",
          },
          {
            word: "abandonment",
            definition: "The action of leaving someone or something behind",
            partOfSpeech: "noun",
            example: "Eurydice feared abandonment after experiencing it in her past.",
          },
        ],
      },
    ],
  },
  {
    id: "wait-for-me",
    title: "Wait For Me",
    description: "Orpheus journeys to the underworld to find Eurydice",
    lyrics: [
      {
        verse: "Wait for me, I'm coming",
        vocabWords: [],
      },
      {
        verse: "Wait, I'm coming with you",
        vocabWords: [],
      },
      {
        verse: "Wait for me, I'm coming too",
        vocabWords: [],
      },
      {
        verse: "I'm coming wait for me",
        vocabWords: [],
      },
      {
        verse: "I hear the walls repeating",
        vocabWords: [],
      },
      {
        verse: "The falling of my feet and",
        vocabWords: [],
      },
      {
        verse: "It sounds like *drumming*",
        vocabWords: [
          {
            word: "drumming",
            definition: "The rhythmic beating of drums or a sound resembling it",
            partOfSpeech: "noun",
            example: "The drumming of his heart grew louder as he descended into the underworld.",
          },
        ],
      },
      {
        verse: "And I am not alone",
        vocabWords: [],
      },
      {
        verse: "I hear the *echoes* of many footsteps",
        vocabWords: [
          {
            word: "echoes",
            definition: "Repetitions of sounds caused by reflection of sound waves",
            partOfSpeech: "noun",
            example: "The echoes of his voice filled the cave as he called her name.",
          },
        ],
      },
      {
        verse: "Don't look back, just *persevere*",
        vocabWords: [
          {
            word: "persevere",
            definition: "To continue doing something despite difficulties",
            partOfSpeech: "verb",
            example: "Orpheus had to persevere on his difficult journey.",
          },
        ],
      },
    ],
  },
  {
    id: "way-down-hadestown",
    title: "Way Down Hadestown",
    description: "Describes the journey to and conditions in Hadestown",
    lyrics: [
      {
        verse: "Way down Hadestown",
        vocabWords: [],
      },
      {
        verse: "Way down under the ground",
        vocabWords: [],
      },
      {
        verse: "*Hound* dogs howl and the *hellhounds* growl",
        vocabWords: [
          {
            word: "hound",
            definition: "A dog, especially one used for hunting",
            partOfSpeech: "noun",
            example: "The hound followed the scent all the way to the underworld.",
          },
          {
            word: "hellhounds",
            definition: "Mythical dogs associated with the underworld",
            partOfSpeech: "noun",
            example: "The hellhounds guard the entrance to Hades' realm.",
          },
        ],
      },
      {
        verse: "And the whistle of the train sounds",
        vocabWords: [],
      },
      {
        verse: "Singing low, singing high",
        vocabWords: [],
      },
      {
        verse: "Way down Hadestown",
        vocabWords: [],
      },
      {
        verse: "Way down *beneath* the ground",
        vocabWords: [
          {
            word: "beneath",
            definition: "In or to a lower position than; under",
            partOfSpeech: "preposition",
            example: "Hadestown lies beneath the surface of the earth.",
          },
        ],
      },
      {
        verse: "Mr. Hades is a mighty king",
        vocabWords: [],
      },
      {
        verse: "Must be making something *mighty* down the line",
        vocabWords: [
          {
            word: "mighty",
            definition: "Possessing great and impressive power or strength",
            partOfSpeech: "adjective",
            example: "Hades is the mighty ruler of the underworld.",
          },
        ],
      },
      {
        verse: "Building walls with *ancient* stones",
        vocabWords: [
          {
            word: "ancient",
            definition: "Belonging to the very distant past and no longer in existence",
            partOfSpeech: "adjective",
            example: "The walls of Hadestown were built with ancient stones that had stood for centuries.",
          },
        ],
      },
    ],
  },
  {
    id: "epic",
    title: "Epic III",
    description: "The final song that reflects on the power of storytelling",
    lyrics: [
      {
        verse: "King of *diamonds*, king of spades",
        vocabWords: [
          {
            word: "diamonds",
            definition: "A precious stone consisting of a clear and colorless crystalline form of pure carbon",
            partOfSpeech: "noun",
            example: "The king of diamonds represents wealth and prosperity in the story.",
          },
        ],
      },
      {
        verse: "Hades is king of the kingdom of dirt",
        vocabWords: [],
      },
      {
        verse: "Miners of coal and miners of gold",
        vocabWords: [],
      },
      {
        verse: "They all dig for Hades in the hole in the earth",
        vocabWords: [],
      },
      {
        verse: "And down they go diggin' down to Hadestown",
        vocabWords: [],
      },
      {
        verse: "La la la la la la la...",
        vocabWords: [],
      },
      {
        verse: "And they keep diggin' down, and down, and down",
        vocabWords: [],
      },
      {
        verse: "And there ain't no end in sight",
        vocabWords: [],
      },
      {
        verse: "And the *melody* plays on though the singers are gone",
        vocabWords: [
          {
            word: "melody",
            definition: "A sequence of musical notes that form a satisfying pattern",
            partOfSpeech: "noun",
            example: "Orpheus created a beautiful melody that could change the world.",
          },
        ],
      },
      {
        verse: "And the *harmony's* so strong that it carries them along",
        vocabWords: [
          {
            word: "harmony",
            definition: "The combination of simultaneously sounded musical notes to produce a pleasing effect",
            partOfSpeech: "noun",
            example: "The harmony of the music brought people together.",
          },
        ],
      },
    ],
  },
]

export default function LyricsExplorerPage() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const currentSong = SONGS[currentSongIndex]

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length)
  }

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length)
  }

  // const stiffness = 400

  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-background to-background/90 text-foreground dark:from-gray-950 dark:to-amber-950/80">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-amber-800/30 dark:via-gray-900 dark:to-red-800/30 animate-gradient"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/30 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-transparent dark:from-amber-600/20 dark:to-transparent"></div>
        <div className="railroad-pattern absolute inset-0 opacity-10 dark:opacity-20"></div>
      </div>



      {/* Fixed, fun navigation buttons */}
      <div className="fixed bottom-6 right-6 flex flex-row gap-3 z-30">
        <motion.div
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          <Button
            onClick={prevSong}
            className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-br from-amber-400 to-red-500 text-white dark:from-amber-500 dark:to-red-600 dark:text-gray-900 ember-glow hover:shadow-amber-500/30 hover:shadow-xl"
            aria-label="Previous song"
          >
            <ArrowLeftIcon className="h-8 w-8" />
            <span className="sr-only">Previous</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: 10 }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut", delay: 0.5 },
            scale: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          <Button
            onClick={nextSong}
            className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white dark:from-amber-500 dark:to-orange-600 dark:text-gray-900 ember-glow hover:shadow-amber-500/30 hover:shadow-xl"
            aria-label="Next song"
          >
            <ArrowRightIcon className="h-8 w-8" />
            <span className="sr-only">Next</span>
          </Button>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <MusicIcon className="h-6 w-6 text-primary dark:text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-600">
              Lyrics Explorer
            </h1>
            <MusicIcon className="h-6 w-6 text-primary dark:text-amber-400" />
          </motion.div>
          <p className="text-muted-foreground dark:text-amber-300 text-readable">
            Explore Hadestown songs and learn new vocabulary words
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <AnimatedTabs
            defaultValue={currentSong.id}
            className="w-full max-w-3xl"
            onValueChange={(value) => {
              const newIndex = SONGS.findIndex((song) => song.id === value)
              if (newIndex !== -1) {
                setCurrentSongIndex(newIndex)
              }
            }}
          >
            {/* Ensure the tabs are working properly in both light and dark themes */}

            {/* Update the AnimatedTabsList styling for better theme support */}
            <AnimatedTabsList className="bg-amber-100/50 dark:bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-amber-200/30 dark:border-amber-700/30 overflow-x-auto scrollbar-hide">
              {SONGS.map((song) => (
                <AnimatedTab
                  key={song.id}
                  id={song.id}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all text-amber-800 dark:text-amber-300 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-amber-400"
                  icon={
                    song.id === currentSong.id ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <MusicIcon className="h-4 w-4" />
                      </motion.span>
                    ) : null
                  }
                >
                  {song.title}
                </AnimatedTab>
              ))}
            </AnimatedTabsList>

            {SONGS.map((song) => (
              <AnimatedTabsContent key={song.id} id={song.id}>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2" aria-hidden="true">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <MusicIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatedTabsContent>
            ))}
          </AnimatedTabs>
        </div>

        <SongLyrics song={currentSong} />
      </div>
    </main>
  )
}

function SongLyrics({ song }: { song: (typeof SONGS)[number] }) {
  const [activeDefinition, setActiveDefinition] = useState<{
    word: string
    definition: string
    partOfSpeech: string
    example: string
    wordElement: HTMLElement | null
  } | null>(null)

  // Reference to the lyrics container for scrolling
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  // Close popup when song changes
  useEffect(() => {
    setActiveDefinition(null)
  }, [song])

  // Function to handle clicking on a vocabulary word
  const handleWordClick = (
    word: {
      word: string
      definition: string
      partOfSpeech: string
      example: string
    },
    event: React.MouseEvent,
  ) => {
    // Get the clicked element
    const wordElement = event.currentTarget as HTMLElement

    // Set active definition with the word element reference
    setActiveDefinition({
      ...word,
      wordElement,
    })

    // Prevent event propagation
    event.stopPropagation()
  }

  // Close definition popup when clicking elsewhere
  const handleContainerClick = () => {
    setActiveDefinition(null)
  }

  // Process lyrics to make vocabulary words clickable
  const processLyrics = (verse: string, vocabWords: { word: string, definition: string, partOfSpeech: string, example: string }[]) => {
    if (vocabWords.length === 0) {
      return <span>{verse}</span>
    }

    try {
      // Split the verse by the vocabulary words (marked with asterisks)
      const parts: React.ReactNode[] = []
      let currentText = verse

      vocabWords.forEach((wordObj, index) => {
        const wordPattern = new RegExp(`\\*${wordObj.word}\\*`, "i")
        const match = currentText.match(wordPattern)

        if (match) {
          const parts1 = currentText.split(wordPattern)
          if (parts1[0]) parts.push(<span key={`text-${index}-1`}>{parts1[0]}</span>)

          parts.push(
            <motion.span
              key={`word-${index}`}
              className="font-bold text-amber-600 dark:text-amber-400 border-b-2 border-dashed border-amber-400 dark:border-amber-500 cursor-pointer hover:text-amber-700 dark:hover:text-amber-300 relative"
              onClick={(e) => handleWordClick(wordObj, e)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Click to see definition of ${wordObj.word}`}
            >
              {wordObj.word}
            </motion.span>,
          )

          currentText = parts1.slice(1).join(`*${wordObj.word}*`)
        }
      })

      if (currentText) parts.push(<span key="remaining">{currentText}</span>)

      return <>{parts}</>
    } catch (error) {
      console.error("Error processing lyrics:", error instanceof Error ? error.message : String(error))
      // Return the original verse if there's an error
      return <span>{verse}</span>
    }
  }

  // Calculate popup position based on the word element
  const getPopupPosition = () => {
    if (!activeDefinition?.wordElement) return { top: 0, left: 0 }

    const wordRect = activeDefinition.wordElement.getBoundingClientRect()
    const containerRect = lyricsContainerRef.current?.getBoundingClientRect() || {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }

    // Default position is below the word
    let top = wordRect.bottom - containerRect.top + 10
    let left = wordRect.left - containerRect.left

    // Make sure the popup stays within the container horizontally
    const maxLeft = containerRect.width - 300 // 300px is approximate popup width
    if (left > maxLeft) {
      left = maxLeft
    }

    // If the popup would go below the visible area, position it above the word instead
    const visibleHeight = window.innerHeight - containerRect.top
    if (top + 200 > visibleHeight) {
      // 200px is approximate popup height
      top = wordRect.top - containerRect.top - 210 // Position above with some margin
    }

    // Ensure popup is never positioned off-screen at the top
    if (top < 0) top = 10

    return { top, left }
  }

  const popupPosition = getPopupPosition()

  return (
    <div className="flex justify-center" onClick={handleContainerClick}>
      <Card className="max-w-3xl w-full bg-gradient-to-br from-amber-50/90 to-amber-100/80 backdrop-blur-sm border-amber-200/50 p-6 rounded-xl overflow-hidden relative dark:from-gray-900 dark:to-amber-950/50 dark:border-amber-700/60 dark:shadow-amber-900/30 ember-glow">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary dark:text-amber-400 mb-2">{song.title}</h2>
          <p className="text-muted-foreground dark:text-amber-300 text-sm">{song.description}</p>
        </div>
{/* 
        <div className="bg-gradient-to-br from-secondary/80 to-secondary/60 rounded-lg mb-4 p-4 text-xs text-muted-foreground dark:from-gray-800 dark:to-amber-950/60 dark:text-amber-300/80">
          <p>
            Note: Lyrics are displayed for educational purposes only. Words with vocabulary definitions are highlighted.
          </p>
        </div> */}

        <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar relative" ref={lyricsContainerRef}>
          <div className="space-y-6">
            {song.lyrics.map((line, lineIndex) => (
              <div key={lineIndex} className="relative">
                <p className="text-lg leading-relaxed dark:text-amber-100">
                  {processLyrics(line.verse, line.vocabWords)}
                </p>
              </div>
            ))}
          </div>

          {/* Definition Popup positioned within the scrollable container */}
          <AnimatePresence>
            {activeDefinition && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute z-50 p-4 bg-gradient-to-br from-white to-amber-50/90 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl border border-amber-300/50 dark:border-amber-600/40 ember-glow max-w-[280px]"
                style={{
                  top: popupPosition.top,
                  left: popupPosition.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-lg font-bold text-primary dark:text-amber-400">{activeDefinition.word}</h4>
                  <span className="text-xs px-2 py-0.5 bg-primary/20 dark:bg-amber-700/30 text-primary dark:text-amber-300 rounded-full">
                    {activeDefinition.partOfSpeech}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-foreground dark:text-amber-100">{activeDefinition.definition}</p>
                </div>

                <div className="bg-secondary/50 dark:bg-gray-700/50 p-3 rounded-md">
                  <p className="text-sm italic text-muted-foreground dark:text-amber-300/80">
                    <span className="font-semibold">Example:</span> {activeDefinition.example}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground dark:text-amber-300 dark:hover:text-amber-100 h-6 w-6 p-0"
                  onClick={() => setActiveDefinition(null)}
                >
                  ✕
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}

