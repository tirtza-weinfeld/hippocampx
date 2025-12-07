import type { VocabularyData, GameGuides, SpellingWord, SpellingGuideStep, MemoryPair, LyricChallenge, Season, GameGuideContent } from "./types"

export const HADESTOWN_VOCABULARY: VocabularyData = {
  quiz: [
    {
      word: "Melody",
      definition: "A sequence of musical notes that form a satisfying pattern",
      example: "Orpheus played a beautiful melody on his lyre.",
      options: [
        "A sequence of musical notes that form a satisfying pattern",
        "A loud sound made by many instruments",
        "A type of musical instrument",
        "A group of singers",
      ],
    },
    {
      word: "Underworld",
      definition: "The world of the dead, located beneath the world of the living",
      example: "Hades rules the underworld with Persephone by his side.",
      options: [
        "The world of the dead, located beneath the world of the living",
        "A secret place where criminals hide",
        "A subway system in a big city",
        "A fantasy world in a video game",
      ],
    },
    {
      word: "Fate",
      definition: "The development of events beyond a person's control",
      example: "The Fates determined the destiny of every mortal and immortal.",
      options: [
        "The development of events beyond a person's control",
        "A type of celebration or festival",
        "A decision made by a king or queen",
        "A journey to a faraway place",
      ],
    },
    {
      word: "Lyre",
      definition: "A stringed musical instrument like a small U-shaped harp",
      example: "Orpheus was known for playing the lyre better than anyone else.",
      options: [
        "A stringed musical instrument like a small U-shaped harp",
        "A type of bird that sings beautifully",
        "A tool used for digging in the ground",
        "A special kind of boat",
      ],
    },
    {
      word: "Persevere",
      definition: "To continue doing something despite difficulties or delays",
      example: "Orpheus had to persevere on his difficult journey through the underworld.",
      options: [
        "To continue doing something despite difficulties or delays",
        "To give up when things get hard",
        "To celebrate a victory",
        "To sleep for a long time",
      ],
    },
  ],

  matching: [
    { word: "Melody", match: "Musical pattern" },
    { word: "Underworld", match: "Hades' realm" },
    { word: "Lyre", match: "Orpheus' instrument" },
    { word: "Eurydice", match: "Orpheus' love" },
    { word: "Persephone", match: "Goddess of spring" },
    { word: "Hermes", match: "Divine messenger" },
    { word: "Railroad", match: "Path to Hadestown" },
    { word: "Fates", match: "Three sisters" },
  ],

  fillBlanks: [
    {
      sentence: "Orpheus played his _____ to charm the stones and trees.",
      answer: "lyre",
      options: ["lyre", "guitar", "flute", "drum"],
    },
    {
      sentence: "_____ is the wife of Hades and brings spring when she returns.",
      answer: "Persephone",
      options: ["Persephone", "Eurydice", "Athena", "Aphrodite"],
    },
    {
      sentence: "The _____ is the underground realm ruled by Hades.",
      answer: "underworld",
      options: ["underworld", "mountain", "forest", "ocean"],
    },
    {
      sentence: "Orpheus tried to _____ on his difficult journey to save Eurydice.",
      answer: "persevere",
      options: ["persevere", "surrender", "sleep", "dance"],
    },
    {
      sentence: "_____ told the story of Orpheus and Eurydice.",
      answer: "Hermes",
      options: ["Hermes", "Zeus", "Apollo", "Poseidon"],
    },
  ],

  categories: [
    {
      category: "Characters",
      words: ["Orpheus", "Eurydice", "Hermes", "Persephone", "Hades"],
    },
    {
      category: "Places",
      words: ["Hadestown", "Underworld", "Railroad", "River Styx", "Above Ground"],
    },
    {
      category: "Music Terms",
      words: ["Melody", "Lyre", "Harmony", "Rhythm", "Song"],
    },
    {
      category: "Themes",
      words: ["Love", "Fate", "Hope", "Doubt", "Perseverance"],
    },
  ],
}

export const HADESTOWN_GAME_GUIDES: GameGuides = {
  quiz: {
    title: "Vocabulary Quiz",
    steps: [
      "Read the word at the top of the screen",
      "Choose the correct definition from the options",
      "Click 'Check Answer' to see if you're right",
      "Use the navigation buttons to move between words",
      "Try to get all the words correct!",
    ],
  },
  matching: {
    title: "Word Matching Game",
    steps: [
      "Click on a word from the top section",
      "Then click on its matching definition below",
      "Matched pairs will turn green",
      "Try to match all pairs with the fewest attempts",
      "Reset the game anytime to try again",
    ],
  },
  fillBlanks: {
    title: "Fill in the Blanks",
    steps: [
      "Read the sentence with a missing word",
      "Choose the correct word from the options",
      "Click 'Check Answer' to see if you're right",
      "Use the navigation buttons to try more sentences",
      "Try to fill in all the blanks correctly!",
    ],
  },
  categories: {
    title: "Word Categories",
    steps: [
      "Click on a word from the available words",
      "Then click on the category where it belongs",
      "Sort all words into their correct categories",
      "Click 'Check Answers' when you're done",
      "Try to categorize all words correctly!",
    ],
  },
}

export const HADESTOWN_THEME = {
  title: "Vocabulary Games",
  subtitle: "Discover amazing words from the world of Hadestown!",
  badges: ["Fun!", "Learn!", "Play!", "Explore!"],
  celebrationMessage: "Your knowledge of Hadestown vocabulary is impressive!",
}

export const HADESTOWN_SPELLING_WORDS: SpellingWord[] = [
  {
    word: "ORPHEUS",
    hint: "The musician who tries to rescue his love from the underworld",
    funFact: "Orpheus was said to play music so beautiful that even rocks and trees were charmed by his songs!",
    character: "orpheus",
  },
  {
    word: "EURYDICE",
    hint: "The woman who follows the call down below",
    funFact: "Eurydice's name is pronounced you-RID-ih-see in the musical.",
    character: "eurydice",
  },
  {
    word: "HERMES",
    hint: "The messenger who narrates the ancient tale",
    funFact: "Hermes is known as the god of transitions and boundaries in Greek mythology.",
    character: "hermes",
  },
  {
    word: "PERSEPHONE",
    hint: "The goddess who brings the seasons",
    funFact: "When Persephone is in the underworld during winter, her mother Demeter mourns, causing plants to die.",
    character: "persephone",
  },
  {
    word: "HADES",
    hint: "The king of the underworld",
    funFact: "Hades is both the name of the god and the place he rules in Greek mythology.",
    character: "hades",
  },
  {
    word: "MELODY",
    hint: "A sequence of musical notes",
    funFact: "The word 'melody' comes from Greek words meaning 'singing' and 'song'.",
    character: "orpheus",
  },
  {
    word: "JOURNEY",
    hint: "A long trip or adventure",
    funFact: "Orpheus takes a long journey to find Eurydice in the underworld.",
    character: "hermes",
  },
  {
    word: "UNDERWORLD",
    hint: "The realm beneath the earth",
    funFact: "In Hadestown, the underworld is portrayed as an industrial factory town.",
    character: "hades",
  },
]

export const HADESTOWN_SPELLING_GUIDE: SpellingGuideStep[] = [
  {
    title: "Welcome to Spelling Challenge!",
    content: "In this game, you'll spell words from the world of Hadestown!",
    target: null,
    image: "orpheus",
  },
  {
    title: "Click Letters",
    content: "Click on the scrambled letters to place them in order.",
    target: "scrambled-letters",
    image: "eurydice",
  },
  {
    title: "Build the Word",
    content: "Letters will fill in the empty spaces. Click placed letters to return them.",
    target: "letter-targets",
    image: "hermes",
  },
  {
    title: "Use Hints",
    content: "Need help? Click the 'Show Hint' button for a clue about the word.",
    target: "hint-button",
    image: "persephone",
  },
  {
    title: "Check Your Answer",
    content: "When you've placed all the letters, click 'Check Answer' to see if you're correct!",
    target: "check-button",
    image: "hades",
  },
  {
    title: "Ready to Play!",
    content: "Now you're ready to start spelling! Good luck!",
    target: null,
    image: "orpheus",
  },
]

export const HADESTOWN_MEMORY_PAIRS: MemoryPair[] = [
  { word: "Tragedy", definition: "A play or story that ends sadly, often with the death of the main character" },
  { word: "Lyre", definition: "A stringed instrument like a small U-shaped harp used in ancient Greece" },
  { word: "Melody", definition: "A sequence of musical notes that form a satisfying pattern" },
  { word: "Harmony", definition: "The combination of musical notes to produce a pleasing effect" },
  { word: "Persevere", definition: "To continue doing something despite difficulties" },
  { word: "Underworld", definition: "The world of the dead, located beneath the world of the living" },
  { word: "Ancient", definition: "Belonging to the very distant past and no longer in existence" },
  { word: "Hellhound", definition: "A mythical dog associated with the underworld" },
  { word: "Abandonment", definition: "The action of leaving someone or something behind" },
  { word: "Mighty", definition: "Possessing great and impressive power or strength" },
  { word: "Beneath", definition: "In or to a lower position than; under" },
  { word: "Echo", definition: "A sound that is reflected back to its source" },
]

export const HADESTOWN_LYRICS: LyricChallenge[] = [
  {
    title: "Way Down Hadestown",
    lyrics: [
      "Way down Hadestown",
      "Way down under the ground",
      "Hound dog howl and the train roll round",
      "It's a sad song, but we sing it anyway",
    ],
    missing: [1, 3],
    context: "This song introduces Hadestown, the industrial underworld where Hades rules.",
  },
  {
    title: "Road to Hell",
    lyrics: [
      "It's an old song",
      "It's an old tale from way back when",
      "And we're gonna sing it again and again",
      "We're gonna sing it again",
    ],
    missing: [0, 2],
    context: "Hermes narrates this opening number, setting up the ancient myth.",
  },
  {
    title: "Wait for Me",
    lyrics: [
      "Wait for me, I'm coming",
      "Wait, I'm coming with you",
      "Wait for me, I'm coming too",
      "I'm coming too",
    ],
    missing: [0, 2],
    context: "Orpheus sings this when he decides to follow Eurydice to Hadestown.",
  },
  {
    title: "All I've Ever Known",
    lyrics: [
      "I don't know where I'm going",
      "But I'm on my way",
      "I'm on my way to somewhere",
      "And home could be this",
    ],
    missing: [1, 3],
    context: "Eurydice sings about finding love and a sense of home with Orpheus.",
  },
]

export const HADESTOWN_SEASONS: Season[] = [
  {
    id: "spring",
    name: "Spring",
    description: "When Persephone returns",
    color: "green",
    items: [
      { id: "flowers", name: "Flowers", emoji: "🌸" },
      { id: "rain", name: "Rain", emoji: "🌧️" },
      { id: "birds", name: "Birds", emoji: "🐦" },
      { id: "persephone-return", name: "Persephone Returns", emoji: "👑" },
    ],
  },
  {
    id: "summer",
    name: "Summer",
    description: "Time of abundance",
    color: "yellow",
    items: [
      { id: "sun", name: "Sunshine", emoji: "☀️" },
      { id: "harvest", name: "Harvest", emoji: "🌾" },
      { id: "warmth", name: "Warmth", emoji: "🔥" },
      { id: "music", name: "Music in Fields", emoji: "🎵" },
    ],
  },
  {
    id: "fall",
    name: "Fall",
    description: "Persephone prepares to leave",
    color: "orange",
    items: [
      { id: "leaves", name: "Falling Leaves", emoji: "🍂" },
      { id: "wind", name: "Cold Wind", emoji: "🌬️" },
      { id: "migration", name: "Migration", emoji: "🦆" },
      { id: "farewell", name: "Farewell Songs", emoji: "💔" },
    ],
  },
  {
    id: "winter",
    name: "Winter",
    description: "Hades keeps Persephone below",
    color: "blue",
    items: [
      { id: "snow", name: "Snow", emoji: "❄️" },
      { id: "darkness", name: "Darkness", emoji: "🌑" },
      { id: "cold", name: "Cold", emoji: "🥶" },
      { id: "hadestown", name: "Hadestown Thrives", emoji: "⚙️" },
    ],
  },
]

export const HADESTOWN_SPELLING_GAME_GUIDE: GameGuideContent = {
  title: "Spelling Challenge",
  steps: [
    "Look at the scrambled letters displayed",
    "Click on letters to place them in order",
    "Use the hint button if you need a clue",
    "Click placed letters to return them",
    "Submit when you think you've spelled it correctly",
  ],
}

export const HADESTOWN_MEMORY_GAME_GUIDE: GameGuideContent = {
  title: "Word Memory",
  steps: [
    "Choose a difficulty level (easy, medium, hard)",
    "Click on any card to flip it over",
    "Try to find the matching word and definition",
    "Match all pairs with as few moves as possible",
    "The fewer moves you make, the better!",
  ],
}

export const HADESTOWN_LYRICS_GAME_GUIDE: GameGuideContent = {
  title: "Lyric Challenge",
  steps: [
    "Read the song lyrics with missing lines",
    "Type in what you think the missing lyrics are",
    "Click Show Context for a hint about the song",
    "Check your answers when ready",
    "Get 70% of words correct to pass each line",
  ],
}

export const HADESTOWN_SEASONS_GAME_GUIDE: GameGuideContent = {
  title: "Seasons Sort",
  steps: [
    "Click on an item from the available items",
    "Then click on the season where it belongs",
    "Items are related to Hadestown's seasonal themes",
    "Sort all items into their correct seasons",
    "Check your answers when all items are placed",
  ],
}
