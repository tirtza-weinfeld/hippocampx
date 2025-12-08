/**
 * Dictionary Seed Data
 *
 * STRUCTURE:
 * - word_text + language_code (required)
 * - definitions[] - meaning, part of speech, examples
 * - tags[] - categorize the word (optional)
 * - forms[] - conjugations/variations (optional)
 * - relations[] - synonyms/antonyms (optional)
 *
 * TAGS (what the word is about):
 * - Topic: medical, legal, technology, science, music, art, politics, psychology
 * - Usage: slang, archaic, poetic, colloquial
 * - Connotation: negative, positive
 * - Test prep: GRE, SAT, TOEFL
 *
 * SOURCE (where the example came from):
 * - type: musical, book, movie, podcast, article, other
 * - title: "Wicked", "Pride and Prejudice"
 * - part: "Thank Goodness", "Chapter 7"
 * - part_order: track/chapter number (optional)
 */

import type { partOfSpeechEnum, relationTypeEnum, sourceTypeEnum } from "../../schemas/dictionary";

type PartOfSpeech = (typeof partOfSpeechEnum.enumValues)[number];
type RelationType = (typeof relationTypeEnum.enumValues)[number];
type SourceType = (typeof sourceTypeEnum.enumValues)[number];

export type SourceSeed = {
  type: SourceType;
  title: string;
  part: string;
  part_order?: number;
};

export type ExampleSeed = {
  example_text: string;
  source?: SourceSeed;
};

export type DictionaryWordSeed = {
  word_text: string;
  language_code: string;
  definitions: Array<{
    definition_text: string;
    part_of_speech: PartOfSpeech;
    order?: number;
    examples?: ExampleSeed[];
  }>;
  tags?: string[];
  forms?: Array<{
    form_text: string;
    form_type?: string;
  }>;
  relations?: Array<{
    related_word: string;
    relation_type: RelationType;
  }>;
};

// =============================================================================
// SEED DATA
// =============================================================================
export const wickedPart2EveryDayMoreWickedDictionaryData: DictionaryWordSeed[] = [
  // wicked
  {
    word_text: "wicked",
    language_code: "en",
    definitions: [
      {
        definition_text: "Morally very bad or evil.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "Every day more wicked, every day the terror grows.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["morality", "negative"],
    forms: [
      { form_text: "wickeder" },
      { form_text: "wickedest" },
      { form_text: "wickedly", form_type: "adverb" },
      { form_text: "wickedness", form_type: "noun" },
    ],
  },

  // terror
  {
    word_text: "terror",
    language_code: "en",
    definitions: [
      {
        definition_text: "A feeling of extreme fear.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "Every day, the terror grows across Oz.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["emotion", "negative"],
    forms: [{ form_text: "terrors" }],
  },

  // alert
  {
    word_text: "alert",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A warning that something dangerous or important may happen.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "All of Oz is ever on alert for the wicked witch.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["safety"],
    forms: [
      { form_text: "alerts" },
      { form_text: "alerted", form_type: "verb" },
      { form_text: "alerting", form_type: "verb" },
      { form_text: "alert", form_type: "adjective" },
    ],
  },

  // victim
  {
    word_text: "victim",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "Someone who is harmed, hurt, or treated badly by another person or by an event.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "She is always seeking out new victims she can hurt.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["psychology", "legal", "negative"],
    forms: [{ form_text: "victims" }],
  },

  // blizzard
  {
    word_text: "blizzard",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A severe snowstorm with strong winds and very poor visibility.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Like some terrible green blizzard, throughout the land she flies.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["nature", "weather"],
    forms: [{ form_text: "blizzards" }],
  },

  // defame
  {
    word_text: "defame",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To harm someone's reputation by saying or writing false things about them.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "She is defaming our poor Wizard with her stories.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["legal", "negative"],
    forms: [
      { form_text: "defamed" },
      { form_text: "defaming" },
      { form_text: "defames" },
      { form_text: "defamation", form_type: "noun" },
    ],
  },

  // calumny
  {
    word_text: "calumny",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A false and damaging statement about someone that harms their reputation.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "He was the target of calumny and lies.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["legal", "negative", "GRE"],
    forms: [{ form_text: "calumnies" }],
  },

  // shield
  {
    word_text: "shield",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To protect someone or something from danger or harm.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Shield us so we won’t be hexed.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["protection"],
    forms: [
      { form_text: "shielded" },
      { form_text: "shielding" },
      { form_text: "shields" },
      { form_text: "shield", form_type: "noun" },
    ],
  },

  // hex
  {
    word_text: "hex",
    language_code: "en",
    definitions: [
      {
        definition_text: "To put a curse or magic spell on someone.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Save us from the wicked, shield us so we won’t be hexed.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["folklore", "colloquial", "negative"],
    forms: [
      { form_text: "hexed" },
      { form_text: "hexes" },
      { form_text: "hexing" },
      { form_text: "hex", form_type: "noun" },
    ],
  },

  // strike
  {
    word_text: "strike",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To attack or hit someone or something suddenly; to cause harm in a particular place.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Give us warning, where will she strike next?",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["conflict"],
    forms: [
      { form_text: "strikes" },
      { form_text: "struck" },
      { form_text: "striking" },
    ],
  },

  // applaud
  {
    word_text: "applaud",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To show approval by clapping your hands; to praise or approve of something.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "When I stop the Wizard, all Oz will applaud.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["emotion", "positive"],
    forms: [
      { form_text: "applauded" },
      { form_text: "applauding" },
      { form_text: "applauds" },
      { form_text: "applause", form_type: "noun" },
    ],
  },

  // fraud
  {
    word_text: "fraud",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "The crime of lying or cheating to get money, power, or advantage; or a person who pretends to be something they are not.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "By revealing he’s a fraud, she hopes to save Oz.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["legal", "morality", "negative"],
    forms: [{ form_text: "frauds" }],
  },

  // gaze
  {
    word_text: "gaze",
    language_code: "en",
    definitions: [
      {
        definition_text: "To look steadily and with interest at someone or something.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "We feel merry, we feel cheery just to gaze on your reflection.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["perception"],
    forms: [
      { form_text: "gazed" },
      { form_text: "gazing" },
      { form_text: "gazes" },
      { form_text: "gaze", form_type: "noun" },
    ],
  },

  // reflection
  {
    word_text: "reflection",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "The image of something in a mirror or on a shiny surface.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "They feel happy just to gaze on Glinda’s reflection.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
      {
        definition_text:
          "Careful thought about something.",
        part_of_speech: "noun",
        order: 1,
        examples: [
          {
            example_text:
              "The song also invites reflection on what ‘good’ really means.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["perception", "psychology"],
    forms: [
      { form_text: "reflections" },
      { form_text: "reflect", form_type: "verb" },
    ],
  },

  // disprove
  {
    word_text: "disprove",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To show that something is not true or is wrong, especially using facts or logic.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "Only you disprove the theory that you can’t improve perfection.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["logic", "science"],
    forms: [
      { form_text: "disproved" },
      { form_text: "disproving" },
      { form_text: "disproves" },
    ],
  },

  // theory
  {
    word_text: "theory",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "An idea or set of ideas that explains how or why something happens, based on evidence.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Only you disprove the theory that you can’t improve perfection.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["science", "academia", "GRE"],
    forms: [{ form_text: "theories" }],
  },

  // perfection
  {
    word_text: "perfection",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "The state of being as good as something can possibly be; without any faults.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "They say you can’t improve perfection, but Glinda comes close.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["philosophy"],
    forms: [
      { form_text: "perfect", form_type: "adjective" },
      { form_text: "perfectly", form_type: "adverb" },
    ],
  },

  // victimhood
  {
    word_text: "victimhood",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "The state of being a victim, especially when it strongly shapes how someone sees themselves or is treated.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Save us from this fear and victimhood, they sing to Glinda.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["psychology", "negative"],
  },

  // prevail
  {
    word_text: "prevail",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To win in the end; to be more powerful or successful than something else.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "With her magic, she’ll prevail and make it end the way it should.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["conflict", "positive"],
    forms: [
      { form_text: "prevailed" },
      { form_text: "prevailing" },
      { form_text: "prevails" },
    ],
  },

  // wail
  {
    word_text: "wail",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To cry out loudly in pain, sadness, or fear.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "Every night our voices wail, begging to be saved from the wicked.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["sound", "emotion", "negative"],
    forms: [
      { form_text: "wailed" },
      { form_text: "wailing" },
      { form_text: "wails" },
    ],
  },

  // defeat
  {
    word_text: "defeat",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To win against someone or something in a fight, game, or struggle.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "When at last the wicked is defeated by the good, the story ends.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
      {
        definition_text:
          "The loss or failure experienced when you do not win.",
        part_of_speech: "noun",
        order: 1,
        examples: [
          {
            example_text:
              "The witch’s defeat brings joy throughout the land.",
            source: {
              type: "musical",
              title: "Wicked Part 2",
              part: "Every Day More Wicked",
            },
          },
        ],
      },
    ],
    tags: ["conflict", "negative"],
    forms: [
      { form_text: "defeated" },
      { form_text: "defeating" },
      { form_text: "defeats" },
    ],
  },
];

export const hadestownDoubtComesInDictionaryData: DictionaryWordSeed[] = [
  // doubt
  {
    word_text: "doubt",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A feeling of not being sure that something is true or will happen.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "Doubt comes in and makes everything feel uncertain.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
      {
        definition_text:
          "To feel unsure about something or to not fully believe it.",
        part_of_speech: "verb",
        order: 1,
        examples: [
          {
            example_text:
              "When the song says doubt comes in, it means they begin to doubt each other.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["emotion", "cognition", "negative"],
    forms: [
      { form_text: "doubts" },
      { form_text: "doubted" },
      { form_text: "doubting" },
      { form_text: "doubtful", form_type: "adjective" },
    ],
  },

  // strip
  {
    word_text: "strip",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To remove a covering, layer, or surface from something.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Doubt comes in and strips the paint from the picture.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["action"],
    forms: [
      { form_text: "strips" },
      { form_text: "stripped" },
      { form_text: "stripping" },
    ],
  },

  // trace
  {
    word_text: "trace",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A small sign, mark, or amount of something that remains.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Doubt comes in and leaves a trace of vinegar and turpentine.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["description"],
    forms: [
      { form_text: "traces" },
      { form_text: "trace", form_type: "verb" },
    ],
  },

  // vinegar
  {
    word_text: "vinegar",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A sour liquid made from fermented alcohol, used in cooking and for pickling.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "The song compares doubt to vinegar, something sharp and sour.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["food"],
    forms: [{ form_text: "vinegars" }],
  },

  // turpentine
  {
    word_text: "turpentine",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A strong-smelling liquid used as a solvent, especially for removing or thinning paint.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Doubt is compared to turpentine, which can strip paint away.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["chemistry", "art"],
  },

  // shiver
  {
    word_text: "shiver",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To shake slightly because you are cold, frightened, or excited.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "You’re shivering — is it cold or fear?",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["body", "emotion", "negative"],
    forms: [
      { form_text: "shivered" },
      { form_text: "shivering" },
      { form_text: "shivers" },
    ],
  },

  // tricky
  {
    word_text: "tricky",
    language_code: "en",
    definitions: [
      {
        definition_text: "Difficult to deal with or handle; likely to cause problems.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "Doubt comes in with tricky fingers that make things go wrong.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["description", "colloquial", "negative"],
    forms: [{ form_text: "trickier" }, { form_text: "trickiest" }],
  },

  // fickle
  {
    word_text: "fickle",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "Changing often in mood, opinion, or loyalty, in a way that makes you unreliable.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text:
              "Doubt comes in with fickle tongues that say one thing and then another.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["personality", "negative", "GRE"],
    forms: [
      { form_text: "fickler" },
      { form_text: "ficklest" },
      { form_text: "fickleness", form_type: "noun" },
    ],
  },

  // falter
  {
    word_text: "falter",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To become weaker, less certain, or less confident; to hesitate or start to fail.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "Doubt comes in and my heart falters, and forgets the songs it sung.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["emotion", "behavior", "negative"],
    forms: [
      { form_text: "faltered" },
      { form_text: "faltering" },
      { form_text: "falters" },
    ],
  },

  // dawn
  {
    word_text: "dawn",
    language_code: "en",
    definitions: [
      {
        definition_text: "The time of day when the sun first appears in the sky in the morning.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "The darkest hour of the darkest night comes right before the dawn.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
      {
        definition_text: "To begin to be understood or noticed.",
        part_of_speech: "verb",
        order: 1,
        examples: [
          {
            example_text:
              "It may slowly dawn on someone that doubt has changed everything.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["nature", "time", "poetic"],
    forms: [
      { form_text: "dawns" },
      { form_text: "dawned" },
      { form_text: "dawning" },
    ],
  },

  // gasp
  {
    word_text: "gasp",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To take in a quick, sudden breath, often because of surprise, fear, or pain.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Orpheus turns around and Eurydice gasps.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
      {
        definition_text:
          "A sudden, short breath that you take because you are shocked or in pain.",
        part_of_speech: "noun",
        order: 1,
        examples: [
          {
            example_text:
              "There was an audible gasp from the crowd at the turning point of the story.",
            source: {
              type: "musical",
              title: "Hadestown",
              part: "Doubt Comes In",
            },
          },
        ],
      },
    ],
    tags: ["body", "emotion", "negative"],
    forms: [
      { form_text: "gasped" },
      { form_text: "gasping" },
      { form_text: "gasps" },
    ],
  },
];

export const noOneMournsDictionaryData: DictionaryWordSeed[] = [
  // wicked
  {
    word_text: "wicked",
    language_code: "en",
    definitions: [
      {
        definition_text: "Morally very bad or evil.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "The wickedest witch there ever was frightened everyone in Oz.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["morality", "negative"],
    forms: [
      { form_text: "wickeder" },
      { form_text: "wickedest" },
      { form_text: "wickedly" },
      { form_text: "wickedness", form_type: "noun" },
    ],
  },

  // enemy
  {
    word_text: "enemy",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A person or group that hates you or opposes you and may want to harm you.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "The enemy of all of us here in Oz is dead.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["conflict", "negative"],
    forms: [{ form_text: "enemies" }],
  },

  // subdue
  {
    word_text: "subdue",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To bring something or someone under control, often by force or effort.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "Let us rejoicify that goodness could subdue the wicked workings of you-know-who.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["conflict"],
    forms: [
      { form_text: "subdued" },
      { form_text: "subdues" },
      { form_text: "subduing" },
    ],
  },

  // conquer
  {
    word_text: "conquer",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To defeat something or someone and take control over it.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Isn't it nice to know that good will conquer evil?",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["conflict"],
    forms: [
      { form_text: "conquered" },
      { form_text: "conquers" },
      { form_text: "conquering" },
      { form_text: "conquest", form_type: "noun" },
    ],
  },

  // evil
  {
    word_text: "evil",
    language_code: "en",
    definitions: [
      {
        definition_text: "Morally very wrong, causing harm or suffering.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "That good will conquer evil is a comforting thought.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
      {
        definition_text: "The force of what is morally bad and harmful.",
        part_of_speech: "noun",
        order: 1,
        examples: [
          {
            example_text: "They believed evil had finally been defeated.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["morality", "negative"],
    forms: [
      { form_text: "eviler" },
      { form_text: "evilest" },
      { form_text: "evilly" },
    ],
  },

  // mourn
  {
    word_text: "mourn",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To feel or show great sadness because someone has died or something has been lost.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "No one mourns the wicked when they are gone.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "negative"],
    forms: [
      { form_text: "mourned" },
      { form_text: "mourning" },
      { form_text: "mourns" },
      { form_text: "mourner", form_type: "noun" },
    ],
  },

  // lily
  {
    word_text: "lily",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A plant with large, often white or brightly colored flowers, sometimes used in funerals.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "No one lays a lily on their grave.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["nature"],
    forms: [{ form_text: "lilies" }],
  },

  // grave
  {
    word_text: "grave",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A place in the ground where a dead person is buried.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text: "No one lays a lily on their grave.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["death"],
    forms: [{ form_text: "graves" }],
  },

  // scorn
  {
    word_text: "scorn",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To feel or show that someone or something is not worthy of respect or approval.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "The good man scorns the wicked.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
      {
        definition_text:
          "A strong feeling that someone or something is stupid or not good enough.",
        part_of_speech: "noun",
        order: 1,
        examples: [
          {
            example_text: "Her voice was full of scorn when she spoke of the tyrant.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "negative"],
    forms: [
      { form_text: "scorned" },
      { form_text: "scorning" },
      { form_text: "scorns" },
      { form_text: "scornful", form_type: "adjective" },
    ],
  },

  // misbehave
  {
    word_text: "misbehave",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To behave badly or in a way that causes problems.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "What we miss when we misbehave is often only clear later.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["behavior", "negative"],
    forms: [
      { form_text: "misbehaved" },
      { form_text: "misbehaving" },
      { form_text: "misbehaves" },
      { form_text: "misbehavior", form_type: "noun" },
    ],
  },

  // lonely
  {
    word_text: "lonely",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "Unhappy because you are alone or do not have anyone to talk to.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "Goodness knows the wicked's lives are lonely.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "negative"],
    forms: [
      { form_text: "lonelier" },
      { form_text: "loneliest" },
      { form_text: "loneliness", form_type: "noun" },
    ],
  },

  // reap
  {
    word_text: "reap",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To receive or experience something as a result of your own actions.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "They reap only what they've sown.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["behavior"],
    forms: [
      { form_text: "reaped" },
      { form_text: "reaping" },
      { form_text: "reaps" },
    ],
  },

  // sow
  {
    word_text: "sow",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To plant seeds in the ground so that plants will grow.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "They reap only what they've sown is a way of saying our actions have consequences.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["nature", "poetic"],
    forms: [
      { form_text: "sowed" },
      { form_text: "sown" },
      { form_text: "sowing" },
      { form_text: "sows" },
    ],
  },

  // atrocious
  {
    word_text: "atrocious",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "Very bad or unpleasant; shocking in a way that upsets people.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "When they saw the baby, they cried, 'It's atrocious!'",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["negative"],
    forms: [
      { form_text: "atrociously" },
      { form_text: "atrociousness", form_type: "noun" },
    ],
  },

  // obscene
  {
    word_text: "obscene",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "Extremely offensive, shocking, or morally wrong.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "They shouted, 'It's obscene!' when they saw how different the baby was.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["morality", "negative"],
    forms: [
      { form_text: "obscenely" },
      { form_text: "obscenity", form_type: "noun" },
    ],
  },

  // spurn
  {
    word_text: "spurn",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "To refuse to accept something or someone, especially in an unkind or proud way.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text:
              "Woe to those who spurn what goodnesses they are shown.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "negative", "poetic"],
    forms: [
      { form_text: "spurned" },
      { form_text: "spurning" },
      { form_text: "spurns" },
    ],
  },

  // woe
  {
    word_text: "woe",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "Great sadness or trouble.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Woe to those who spurn what goodnesses they are shown.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "negative", "poetic"],
    forms: [{ form_text: "woes" }],
  },

  // elixir
  {
    word_text: "elixir",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A magical liquid in stories that is believed to cure illness or give special powers; or any powerful, special drink.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "Have another drink of green elixir, sang the lover.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["fantasy"],
    forms: [{ form_text: "elixirs" }],
  },

  // mixer
  {
    word_text: "mixer",
    language_code: "en",
    definitions: [
      {
        definition_text:
          "A small informal party or event where people meet and talk.",
        part_of_speech: "noun",
        order: 0,
        examples: [
          {
            example_text:
              "We'll have ourselves a little mixer, promises the song.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "No One Mourns the Wicked",
              part_order: 1,
            },
          },
        ],
      },
    ],
    tags: ["social"],
    forms: [{ form_text: "mixers" }],
  },
];

 const dearOldShizDictionaryData: DictionaryWordSeed[] = [
  // hallowed
  {
    word_text: "hallowed",
    language_code: "en",
    definitions: [
      {
        definition_text: "Greatly respected and treated as holy or very special.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "Graduates spoke of the hallowed halls of their old university.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "Dear Old Shiz",
              part_order: 2,
            },
          },
        ],
      },
    ],
    tags: ["religion", "education", "formal", "positive"],
    forms: [
      { form_text: "hallow", form_type: "base" },
      { form_text: "hallowing" },
      { form_text: "hallowed" },
    ],
  },

  // vine-draped
  {
    word_text: "vine-draped",
    language_code: "en",
    definitions: [
      {
        definition_text: "Covered or decorated with vines hanging down.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "The vine-draped walls made the old school look ancient and grand.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "Dear Old Shiz",
              part_order: 2,
            },
          },
        ],
      },
    ],
    tags: ["nature", "description", "poetic"],
    forms: [
      { form_text: "vine", form_type: "base-noun" },
      { form_text: "drape", form_type: "base-verb" },
      { form_text: "draped" },
    ],
  },

  // proud
  {
    word_text: "proud",
    language_code: "en",
    definitions: [
      {
        definition_text: "Feeling pleased and satisfied because of something you or someone connected to you has done.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "They felt proud when they looked back on their school days.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "Dear Old Shiz",
              part_order: 2,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "positive", "neutral"],
    forms: [
      { form_text: "prouder" },
      { form_text: "proudest" },
      { form_text: "proudly" },
      { form_text: "proudliest" },
    ],
  },

  // sere
  {
    word_text: "sere",
    language_code: "en",
    definitions: [
      {
        definition_text: "Dry and withered, especially about plants or grass.",
        part_of_speech: "adjective",
        order: 0,
        examples: [
          {
            example_text: "By late summer, the once green fields were sere and brown.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "Dear Old Shiz",
              part_order: 2,
            },
          },
        ],
      },
    ],
    tags: ["nature", "description", "poetic", "neutral"],
  },

  // hath
  {
    word_text: "hath",
    language_code: "en",
    definitions: [
      {
        definition_text: "An old or literary form of ‘has’, used with ‘he’, ‘she’ or ‘it’.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "In old texts, you might read that time hath passed.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "Dear Old Shiz",
              part_order: 2,
            },
          },
        ],
      },
    ],
    tags: ["grammar", "archaic", "neutral"],
    forms: [
      { form_text: "have", form_type: "base" },
      { form_text: "has" },
      { form_text: "had" },
    ],
  },

  // revere
  {
    word_text: "revere",
    language_code: "en",
    definitions: [
      {
        definition_text: "To feel deep respect and admiration for someone or something.",
        part_of_speech: "verb",
        order: 0,
        examples: [
          {
            example_text: "Students often revere the teachers who changed their lives.",
            source: {
              type: "musical",
              title: "Wicked Part 1",
              part: "Dear Old Shiz",
              part_order: 2,
            },
          },
        ],
      },
    ],
    tags: ["emotion", "respect", "formal", "positive"],
    forms: [
      { form_text: "revered" },
      { form_text: "revering" },
      { form_text: "reveres" },
      { form_text: "reverence", form_type: "noun" },
    ],
  },
];

const dictionaryDataOld: DictionaryWordSeed[] = [
  // 1. finale
  {
    word_text: "finale",
    language_code: "en",
    definitions: [
      {
        definition_text: "The last part of a piece of music, an entertainment, or a public event.",
        part_of_speech: "noun",
        order: 0,
        examples: [{ example_text: "The orchestra played a dramatic finale." }],
      },
    ],
    tags: ["performance" ],
    forms: [{ form_text: "finales" }],
  },

  // 2. ballyhoo
  {
    word_text: "ballyhoo",
    language_code: "en",
    definitions: [
      {
        definition_text: "Extravagant publicity or fuss.",
        part_of_speech: "noun",
        order: 0,
        examples: [{ example_text: "After all the ballyhoo, the film was a disappointment." }],
      },
    ],
    tags: ["media", "entertainment", "colloquial" ],
    forms: [{ form_text: "ballyhooed" }],
  },

  // 3. frank
  {
    word_text: "frank",
    language_code: "en",
    definitions: [
      {
        definition_text: "Open, honest, and direct in speech or writing.",
        part_of_speech: "adjective",
        order: 0,
        examples: [{ example_text: "She gave a frank assessment of the situation." }],
      },
    ],
    tags: ["communication", "positive"],
    forms: [
      { form_text: "franker" },
      { form_text: "frankest" },
      { form_text: "frankly" },
      { form_text: "frankness" },
    ],
    relations: [
      { related_word: "candid", relation_type: "synonym" },
      { related_word: "evasive", relation_type: "antonym" },
    ],
  },

  // 4. fiancé
  {
    word_text: "fiancé",
    language_code: "en",
    definitions: [
      {
        definition_text: "A man to whom someone is engaged to be married.",
        part_of_speech: "noun",
        order: 0,
        examples: [{ example_text: "She introduced him as her fiancé." }],
      },
    ],
    tags: ["relationship", "social"],
    forms: [
      { form_text: "fiancée" },
      { form_text: "fiancés" },
    ],
  },

  // 5. summon
  {
    word_text: "summon",
    language_code: "en",
    definitions: [
      {
        definition_text: "To formally call someone to come, especially for a meeting or official purpose.",
        part_of_speech: "verb",
        order: 0,
        examples: [{ example_text: "The judge summoned the witness to appear in court." }],
      },
    ],
    tags: ["legal"],
    forms: [
      { form_text: "summoned" },
      { form_text: "summoning" },
      { form_text: "summons" },
    ],
  },

  // 6. decree
  {
    word_text: "decree",
    language_code: "en",
    definitions: [
      {
        definition_text: "To order or decide something officially, especially by law or authority.",
        part_of_speech: "verb",
        order: 0,
        examples: [{ example_text: "The king decreed that all citizens must pay the new tax." }],
      },
      {
        definition_text: "An official order issued by a legal authority.",
        part_of_speech: "noun",
        order: 1,
        examples: [{ example_text: "The decree was published in the official gazette." }],
      },
    ],
    tags: ["legal", "politics", "formal" ],
    forms: [
      { form_text: "decreed" },
      { form_text: "decreeing" },
      { form_text: "decrees" },
    ],
  },

  // 7. concealment
  {
    word_text: "concealment",
    language_code: "en",
    definitions: [
      {
        definition_text: "The act of hiding something or keeping it secret.",
        part_of_speech: "noun",
        order: 0,
        examples: [{ example_text: "The concealment of evidence is a serious crime." }],
      },
    ],
    tags: ["legal", "negative"],
    relations: [
      { related_word: "lurk", relation_type: "related" },
      { related_word: "surreptitious", relation_type: "related" },
    ],
  },

  // 8. lurk
  {
    word_text: "lurk",
    language_code: "en",
    definitions: [
      {
        definition_text: "To stay hidden, often in order to watch or wait for something.",
        part_of_speech: "verb",
        order: 0,
        examples: [{ example_text: "A figure was lurking in the shadows." }],
      },
    ],
    tags: ["psychology", "negative"],
    forms: [
      { form_text: "lurked" },
      { form_text: "lurking" },
      { form_text: "lurks" },
    ],
  },

  // 9. surreptitious
  {
    word_text: "surreptitious",
    language_code: "en",
    definitions: [
      {
        definition_text: "Done secretly, without anyone seeing or knowing.",
        part_of_speech: "adjective",
        order: 0,
        examples: [{ example_text: "She made a surreptitious glance at her phone during the meeting." }],
      },
    ],
    tags: ["psychology", "GRE", "negative"],
    forms: [{ form_text: "surreptitiously" }],
    relations: [
      { related_word: "lurk", relation_type: "related" },
      { related_word: "concealment", relation_type: "related" },
    ],
  },

  // 10. rebel
  {
    word_text: "rebel",
    language_code: "en",
    definitions: [
      {
        definition_text: "To resist or fight against authority or control.",
        part_of_speech: "verb",
        order: 0,
        examples: [{ example_text: "The citizens rebelled against the oppressive government." }],
      },
      {
        definition_text: "A person who resists authority or control.",
        part_of_speech: "noun",
        order: 1,
        examples: [{ example_text: "He was known as a rebel in his youth." }],
      },
    ],
    tags: ["politics", "social"],
    forms: [
      { form_text: "rebelled" },
      { form_text: "rebelling" },
      { form_text: "rebels" },
      { form_text: "rebellion" },
      { form_text: "rebellious" },
    ],
  },

  // 11. unclean
  {
    word_text: "unclean",
    language_code: "en",
    definitions: [
      {
        definition_text: "Dirty or impure.",
        part_of_speech: "adjective",
        order: 0,
        examples: [{ example_text: "The kitchen was left in an unclean state." }],
      },
    ],
    tags: ["hygiene", "negative"],
    relations: [
      { related_word: "dirty", relation_type: "synonym" },
      { related_word: "clean", relation_type: "antonym" },
    ],
  },

  // 12. refreshment
  {
    word_text: "refreshment",
    language_code: "en",
    definitions: [
      {
        definition_text: "A snack or drink, especially one provided at an event.",
        part_of_speech: "noun",
        order: 0,
        examples: [{ example_text: "Light refreshments will be served after the meeting." }],
      },
    ],
    tags: ["food"],
    forms: [{ form_text: "refreshments" }],
  },

  // 13. anticipate
  {
    word_text: "anticipate",
    language_code: "en",
    definitions: [
      {
        definition_text: "To expect or predict something.",
        part_of_speech: "verb",
        order: 0,
        examples: [{ example_text: "We anticipate a large crowd at the event." }],
      },
    ],
    tags: ["communication", "GRE"],
    forms: [
      { form_text: "anticipated" },
      { form_text: "anticipating" },
      { form_text: "anticipates" },
      { form_text: "anticipation" },
    ],
  },
];


export const dictionaryData = [
  ...wickedPart2EveryDayMoreWickedDictionaryData,
  ...hadestownDoubtComesInDictionaryData,
  ...noOneMournsDictionaryData,
  ...dearOldShizDictionaryData,
  ...dictionaryDataOld,
];