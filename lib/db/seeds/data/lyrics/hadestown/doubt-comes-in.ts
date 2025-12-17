import type { LexicalEntrySeed } from "../../dictionary";

/**
 * Shared source for all examples from "Doubt Comes In"
 * Hadestown (2019 Broadway) - Act 2
 */
const HADESTOWN_DOUBT_COMES_IN_SOURCE = {
  source: {
    type: "musical" as const,
    title: "Hadestown",
    publication_year: 2019,
    contributors: [
      { name: "Anais Mitchell", role: "composer" as const },
      { name: "Anais Mitchell", role: "lyricist" as const },
    ],
  },
  part_path: ["Doubt Comes In"],
};

export const HADESTOWN_DOUBT_COMES_IN_DICTIONARY_DATA: LexicalEntrySeed[] = [
  // doubt (noun)
  {
    lemma: "doubt",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "doubts", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A feeling of not being sure that something is true or will happen.",
        order_index: 0,
        tags: ["emotion", "cognition", "negative"],
        examples: [
          {
            text: "When doubt comes in, everything feels uncertain.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // doubt (verb) - separate entry for different POS
  {
    lemma: "doubt",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "doubts", grammatical_features: { person: "3rd", number: "singular" } },
      { form_text: "doubted", grammatical_features: { tense: "past" } },
      { form_text: "doubting", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To feel unsure about something or to not fully believe it.",
        order_index: 0,
        tags: ["emotion", "cognition", "negative"],
        examples: [
          {
            text: "They begin to doubt each other.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // doubtful (adjective) - derived from doubt
  {
    lemma: "doubtful",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition: "Feeling or showing uncertainty about something.",
        order_index: 0,
        tags: ["emotion", "negative"],
        relations: [
          { target_lemma: "doubt", target_pos: "noun", relation_type: "nuance" },
        ],
      },
    ],
  },

  // strip (verb)
  {
    lemma: "strip",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "strips", grammatical_features: { person: "3rd", number: "singular" } },
      { form_text: "stripped", grammatical_features: { tense: "past" } },
      { form_text: "stripping", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To remove a covering, layer, or surface from something.",
        order_index: 0,
        tags: ["action"],
        examples: [
          {
            text: "Doubt strips the paint from the picture.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // trace (noun)
  {
    lemma: "trace",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "traces", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A small sign, mark, or amount of something that remains.",
        order_index: 0,
        tags: ["description"],
        examples: [
          {
            text: "Doubt leaves a trace of something bitter behind.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // vinegar (noun)
  {
    lemma: "vinegar",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "A sour liquid made from fermented alcohol, used in cooking and for pickling.",
        order_index: 0,
        tags: ["food"],
        examples: [
          {
            text: "The song compares doubt to something sharp and sour like vinegar.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // turpentine (noun)
  {
    lemma: "turpentine",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "A strong-smelling liquid used as a solvent, especially for removing or thinning paint.",
        order_index: 0,
        tags: ["chemistry", "art"],
        examples: [
          {
            text: "Doubt is compared to turpentine, which can dissolve and strip away.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // shiver (verb)
  {
    lemma: "shiver",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "shivers", grammatical_features: { person: "3rd", number: "singular" } },
      { form_text: "shivered", grammatical_features: { tense: "past" } },
      { form_text: "shivering", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To shake slightly because you are cold, frightened, or excited.",
        order_index: 0,
        tags: ["body", "emotion"],
        examples: [
          {
            text: "Are you shivering from the cold or from fear?",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // tricky (adjective)
  {
    lemma: "tricky",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "trickier", grammatical_features: { degree: "comparative" } },
      { form_text: "trickiest", grammatical_features: { degree: "superlative" } },
    ],
    senses: [
      {
        definition: "Difficult to deal with or handle; likely to cause problems.",
        order_index: 0,
        tags: ["description", "colloquial", "negative"],
        examples: [
          {
            text: "Doubt has tricky fingers that make things go wrong.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // fickle (adjective)
  {
    lemma: "fickle",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "fickler", grammatical_features: { degree: "comparative" } },
      { form_text: "ficklest", grammatical_features: { degree: "superlative" } },
    ],
    senses: [
      {
        definition: "Changing often in mood, opinion, or loyalty, in a way that makes you unreliable.",
        order_index: 0,
        tags: ["personality", "negative", "GRE"],
        examples: [
          {
            text: "Doubt has fickle tongues that say one thing and then another.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // fickleness (noun) - derived from fickle
  {
    lemma: "fickleness",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The quality of being fickle; inconstancy.",
        order_index: 0,
        tags: ["personality", "negative"],
        relations: [
          { target_lemma: "fickle", target_pos: "adjective", relation_type: "nuance" },
        ],
      },
    ],
  },

  // falter (verb)
  {
    lemma: "falter",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "falters", grammatical_features: { person: "3rd", number: "singular" } },
      { form_text: "faltered", grammatical_features: { tense: "past" } },
      { form_text: "faltering", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To become weaker, less certain, or less confident; to hesitate or start to fail.",
        order_index: 0,
        tags: ["emotion", "behavior", "negative"],
        examples: [
          {
            text: "When doubt comes in, the heart falters and forgets.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // dawn (noun)
  {
    lemma: "dawn",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "dawns", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "The time of day when the sun first appears in the sky in the morning.",
        order_index: 0,
        tags: ["nature", "time", "poetic"],
        examples: [
          {
            text: "The darkest hour comes right before the dawn.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // dawn (verb)
  {
    lemma: "dawn",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "dawns", grammatical_features: { person: "3rd", number: "singular" } },
      { form_text: "dawned", grammatical_features: { tense: "past" } },
      { form_text: "dawning", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To begin to be understood or noticed.",
        order_index: 0,
        tags: ["cognition"],
        examples: [
          {
            text: "It may slowly dawn on someone that doubt has changed everything.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // gasp (verb)
  {
    lemma: "gasp",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "gasps", grammatical_features: { person: "3rd", number: "singular" } },
      { form_text: "gasped", grammatical_features: { tense: "past" } },
      { form_text: "gasping", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To take in a quick, sudden breath, often because of surprise, fear, or pain.",
        order_index: 0,
        tags: ["body", "emotion"],
        examples: [
          {
            text: "She gasps when he turns around.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },

  // gasp (noun)
  {
    lemma: "gasp",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "gasps", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A sudden, short breath that you take because you are shocked or in pain.",
        order_index: 0,
        tags: ["body", "emotion"],
        examples: [
          {
            text: "There was an audible gasp from the crowd.",
            source: HADESTOWN_DOUBT_COMES_IN_SOURCE,
          },
        ],
      },
    ],
  },
];
