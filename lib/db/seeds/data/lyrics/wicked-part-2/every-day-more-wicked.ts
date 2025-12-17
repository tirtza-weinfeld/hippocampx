import type { LexicalEntrySeed } from "../../dictionary";

// Shared source constant
const WICKED_SOURCE = {
  type: "musical" as const,
  title: "Wicked Part 2",
  publication_year: 2003,
  contributors: [
    { name: "Stephen Schwartz", role: "composer" as const },
    { name: "Stephen Schwartz", role: "lyricist" as const },
  ]
};

// "Every Day More Wicked" is technically part of "March of the Witch Hunters" or "Thank Goodness" depending on the specific track listing, 
// but we will stick to the user's explicit labelling.
const EVERY_DAY_PATH = ["Every Day More Wicked"];

export const EVERY_DAY_MORE_WICKED_DATA: LexicalEntrySeed[] = [
  // ===========================================================================
  // WICKED (Adjective)
  // ===========================================================================
  {
    lemma: "wicked",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "wickeder", grammatical_features: { degree: "comparative" } },
      { form_text: "wickedest", grammatical_features: { degree: "superlative" } },
      { form_text: "wickedly", grammatical_features: {} }, // Adverb
      { form_text: "wickedness", grammatical_features: {} }, // Noun
    ],
    senses: [
      {
        definition: "Morally very bad or evil.",
        order_index: 0,
        tags: ["morality", "negative"],
        examples: [
          {
            text: "Every day more wicked, every day the terror grows.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // TERROR (Noun)
  // ===========================================================================
  {
    lemma: "terror",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "terrors", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A feeling of extreme fear.",
        order_index: 0,
        tags: ["emotion", "negative"],
        examples: [
          {
            text: "Every day, the terror grows across Oz.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ALERT (Noun)
  // ===========================================================================
  {
    lemma: "alert",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "alerts", grammatical_features: { number: "plural" } },
      // Note: The original data listed verb/adj forms here, but since the definition 
      // provided is strictly for the Noun, we keep the forms relevant to the Lemma or derived forms.
    ],
    senses: [
      {
        definition: "A warning that something dangerous or important may happen.",
        order_index: 0,
        tags: ["safety"],
        examples: [
          {
            text: "All of Oz is ever on alert for the wicked witch.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // VICTIM (Noun)
  // ===========================================================================
  {
    lemma: "victim",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "victims", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "Someone who is harmed, hurt, or treated badly by another person or by an event.",
        order_index: 0,
        tags: ["psychology", "legal", "negative"],
        examples: [
          {
            text: "She is always seeking out new victims she can hurt.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // BLIZZARD (Noun)
  // ===========================================================================
  {
    lemma: "blizzard",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "blizzards", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A severe snowstorm with strong winds and very poor visibility.",
        order_index: 0,
        tags: ["nature", "weather"],
        examples: [
          {
            text: "Like some terrible green blizzard, throughout the land she flies.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // DEFAME (Verb)
  // ===========================================================================
  {
    lemma: "defame",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "defamed", grammatical_features: { tense: "past" } },
      { form_text: "defaming", grammatical_features: { participle: "present" } },
      { form_text: "defames", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "defamation", grammatical_features: {} }, // Nominal
    ],
    senses: [
      {
        definition: "To harm someone's reputation by saying or writing false things about them.",
        order_index: 0,
        tags: ["legal", "negative"],
        examples: [
          {
            text: "She is defaming our poor Wizard with her stories.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // CALUMNY (Noun)
  // ===========================================================================
  {
    lemma: "calumny",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "calumnies", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A false and damaging statement about someone that harms their reputation.",
        order_index: 0,
        tags: ["legal", "negative", "GRE"],
        examples: [
          {
            text: "He was the target of calumny and lies.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SHIELD (Verb)
  // ===========================================================================
  {
    lemma: "shield",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "shielded", grammatical_features: { tense: "past" } },
      { form_text: "shielding", grammatical_features: { participle: "present" } },
      { form_text: "shields", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To protect someone or something from danger or harm.",
        order_index: 0,
        tags: ["protection"],
        examples: [
          {
            text: "Shield us so we won’t be hexed.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // HEX (Verb)
  // ===========================================================================
  {
    lemma: "hex",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "hexed", grammatical_features: { tense: "past" } },
      { form_text: "hexes", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "hexing", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To put a curse or magic spell on someone.",
        order_index: 0,
        tags: ["folklore", "colloquial", "negative"],
        examples: [
          {
            text: "Save us from the wicked, shield us so we won’t be hexed.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // STRIKE (Verb)
  // ===========================================================================
  {
    lemma: "strike",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "struck", grammatical_features: { tense: "past" } },
      { form_text: "strikes", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "striking", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To attack or hit someone or something suddenly; to cause harm in a particular place.",
        order_index: 0,
        tags: ["conflict"],
        examples: [
          {
            text: "Give us warning, where will she strike next?",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // APPLAUD (Verb)
  // ===========================================================================
  {
    lemma: "applaud",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "applauded", grammatical_features: { tense: "past" } },
      { form_text: "applauding", grammatical_features: { participle: "present" } },
      { form_text: "applauds", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "applause", grammatical_features: {} }, // Nominal
    ],
    senses: [
      {
        definition: "To show approval by clapping your hands; to praise or approve of something.",
        order_index: 0,
        tags: ["emotion", "positive"],
        examples: [
          {
            text: "When I stop the Wizard, all Oz will applaud.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // FRAUD (Noun)
  // ===========================================================================
  {
    lemma: "fraud",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "frauds", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "The crime of lying or cheating to get money, power, or advantage; or a person who pretends to be something they are not.",
        order_index: 0,
        tags: ["legal", "morality", "negative"],
        examples: [
          {
            text: "By revealing he’s a fraud, she hopes to save Oz.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // GAZE (Verb)
  // ===========================================================================
  {
    lemma: "gaze",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "gazed", grammatical_features: { tense: "past" } },
      { form_text: "gazing", grammatical_features: { participle: "present" } },
      { form_text: "gazes", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To look steadily and with interest at someone or something.",
        order_index: 0,
        tags: ["perception"],
        examples: [
          {
            text: "We feel merry, we feel cheery just to gaze on your reflection.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // REFLECTION (Noun)
  // ===========================================================================
  {
    lemma: "reflection",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "reflections", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "The image of something in a mirror or on a shiny surface.",
        order_index: 0,
        tags: ["perception", "psychology"],
        examples: [
          {
            text: "They feel happy just to gaze on Glinda’s reflection.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
      {
        definition: "Careful thought about something.",
        order_index: 1,
        tags: ["psychology"],
        examples: [
          {
            text: "The song also invites reflection on what ‘good’ really means.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // DISPROVE (Verb)
  // ===========================================================================
  {
    lemma: "disprove",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "disproved", grammatical_features: { tense: "past" } },
      { form_text: "disproving", grammatical_features: { participle: "present" } },
      { form_text: "disproves", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To show that something is not true or is wrong, especially using facts or logic.",
        order_index: 0,
        tags: ["logic", "science"],
        examples: [
          {
            text: "Only you disprove the theory that you can’t improve perfection.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // THEORY (Noun)
  // ===========================================================================
  {
    lemma: "theory",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "theories", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "An idea or set of ideas that explains how or why something happens, based on evidence.",
        order_index: 0,
        tags: ["science", "academia", "GRE"],
        examples: [
          {
            text: "Only you disprove the theory that you can’t improve perfection.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // PERFECTION (Noun)
  // ===========================================================================
  {
    lemma: "perfection",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "perfect", grammatical_features: {} }, // Adjective
      { form_text: "perfectly", grammatical_features: {} }, // Adverb
    ],
    senses: [
      {
        definition: "The state of being as good as something can possibly be; without any faults.",
        order_index: 0,
        tags: ["philosophy"],
        examples: [
          {
            text: "They say you can’t improve perfection, but Glinda comes close.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // VICTIMHOOD (Noun)
  // ===========================================================================
  {
    lemma: "victimhood",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The state of being a victim, especially when it strongly shapes how someone sees themselves or is treated.",
        order_index: 0,
        tags: ["psychology", "negative"],
        examples: [
          {
            text: "Save us from this fear and victimhood, they sing to Glinda.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // PREVAIL (Verb)
  // ===========================================================================
  {
    lemma: "prevail",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "prevailed", grammatical_features: { tense: "past" } },
      { form_text: "prevailing", grammatical_features: { participle: "present" } },
      { form_text: "prevails", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To win in the end; to be more powerful or successful than something else.",
        order_index: 0,
        tags: ["conflict", "positive"],
        examples: [
          {
            text: "With her magic, she’ll prevail and make it end the way it should.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // WAIL (Verb)
  // ===========================================================================
  {
    lemma: "wail",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "wailed", grammatical_features: { tense: "past" } },
      { form_text: "wailing", grammatical_features: { participle: "present" } },
      { form_text: "wails", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To cry out loudly in pain, sadness, or fear.",
        order_index: 0,
        tags: ["sound", "emotion", "negative"],
        examples: [
          {
            text: "Every night our voices wail, begging to be saved from the wicked.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // DEFEAT (Verb)
  // ===========================================================================
  {
    lemma: "defeat",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "defeated", grammatical_features: { tense: "past" } },
      { form_text: "defeating", grammatical_features: { participle: "present" } },
      { form_text: "defeats", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To win against someone or something in a fight, game, or struggle.",
        order_index: 0,
        tags: ["conflict", "negative"],
        examples: [
          {
            text: "When at last the wicked is defeated by the good, the story ends.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // DEFEAT (Noun) - Split from above
  // ===========================================================================
  {
    lemma: "defeat",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The loss or failure experienced when you do not win.",
        order_index: 0,
        tags: ["conflict", "negative"],
        examples: [
          {
            text: "The witch’s defeat brings joy throughout the land.",
            source: {
              source: WICKED_SOURCE,
              part_path: EVERY_DAY_PATH,
            },
          },
        ],
      },
    ],
  },
];
