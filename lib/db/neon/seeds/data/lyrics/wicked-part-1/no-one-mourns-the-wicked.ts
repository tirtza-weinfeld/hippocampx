import type { LexicalEntrySeed } from "../../dictionary";

// Shared source constant to reduce duplication
const WICKED_SOURCE = {
  type: "musical" as const,
  title: "Wicked Part 1",
  publication_year: 2003,
  contributors: [
    { name: "Stephen Schwartz", role: "composer" as const },
    { name: "Stephen Schwartz", role: "lyricist" as const },
  ]
};

const NO_ONE_MOURNS_THE_WICKED_PATH = ["No One Mourns the Wicked"];

export const NO_ONE_MOURNS_THE_WICKED_DATA: LexicalEntrySeed[] = [
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
      { form_text: "wickedly", grammatical_features: {} }, // Adverbial form
      { form_text: "wickedness", grammatical_features: {} }, // Nominal form
    ],
    senses: [
      {
        definition: "Morally very bad or evil.",
        order_index: 0,
        tags: ["morality", "negative"],
        examples: [
          {
            text: "The wickedest witch there ever was frightened everyone in Oz.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ENEMY (Noun)
  // ===========================================================================
  {
    lemma: "enemy",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "enemies", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A person or group that hates you or opposes you and may want to harm you.",
        order_index: 0,
        tags: ["conflict", "negative"],
        examples: [
          {
            text: "The enemy of all of us here in Oz is dead.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SUBDUE (Verb)
  // ===========================================================================
  {
    lemma: "subdue",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "subdued", grammatical_features: { tense: "past" } },
      { form_text: "subdues", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "subduing", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To bring something or someone under control, often by force or effort.",
        order_index: 0,
        tags: ["conflict"],
        examples: [
          {
            text: "Let us rejoicify that goodness could subdue the wicked workings of you-know-who.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // CONQUER (Verb)
  // ===========================================================================
  {
    lemma: "conquer",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "conquered", grammatical_features: { tense: "past" } },
      { form_text: "conquers", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "conquering", grammatical_features: { participle: "present" } },
      { form_text: "conquest", grammatical_features: {} }, // Nominal form
    ],
    senses: [
      {
        definition: "To defeat something or someone and take control over it.",
        order_index: 0,
        tags: ["conflict"],
        examples: [
          {
            text: "Isn't it nice to know that good will conquer evil?",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // EVIL (Adjective)
  // ===========================================================================
  {
    lemma: "evil",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "eviler", grammatical_features: { degree: "comparative" } },
      { form_text: "evilest", grammatical_features: { degree: "superlative" } },
      { form_text: "evilly", grammatical_features: {} },
    ],
    senses: [
      {
        definition: "Morally very wrong, causing harm or suffering.",
        order_index: 0,
        tags: ["morality", "negative"],
        examples: [
          {
            text: "That good will conquer evil is a comforting thought.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // EVIL (Noun) - Split from above
  // ===========================================================================
  {
    lemma: "evil",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The force of what is morally bad and harmful.",
        order_index: 0,
        tags: ["morality", "negative"],
        examples: [
          {
            text: "They believed evil had finally been defeated.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // MOURN (Verb)
  // ===========================================================================
  {
    lemma: "mourn",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "mourned", grammatical_features: { tense: "past" } },
      { form_text: "mourning", grammatical_features: { participle: "present" } },
      { form_text: "mourns", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "mourner", grammatical_features: {} }, // Nominal
    ],
    senses: [
      {
        definition: "To feel or show great sadness because someone has died or something has been lost.",
        order_index: 0,
        tags: ["emotion", "negative"],
        examples: [
          {
            text: "No one mourns the wicked when they are gone.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // LILY (Noun)
  // ===========================================================================
  {
    lemma: "lily",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "lilies", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A plant with large, often white or brightly colored flowers, sometimes used in funerals.",
        order_index: 0,
        tags: ["nature"],
        examples: [
          {
            text: "No one lays a lily on their grave.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // GRAVE (Noun)
  // ===========================================================================
  {
    lemma: "grave",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "graves", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A place in the ground where a dead person is buried.",
        order_index: 0,
        tags: ["death"],
        examples: [
          {
            text: "No one lays a lily on their grave.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SCORN (Verb)
  // ===========================================================================
  {
    lemma: "scorn",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "scorned", grammatical_features: { tense: "past" } },
      { form_text: "scorning", grammatical_features: { participle: "present" } },
      { form_text: "scorns", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To feel or show that someone or something is not worthy of respect or approval.",
        order_index: 0,
        tags: ["emotion", "negative"],
        examples: [
          {
            text: "The good man scorns the wicked.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SCORN (Noun) - Split from above
  // ===========================================================================
  {
    lemma: "scorn",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "scornful", grammatical_features: {} }, // Adjective
    ],
    senses: [
      {
        definition: "A strong feeling that someone or something is stupid or not good enough.",
        order_index: 0,
        tags: ["emotion", "negative"],
        examples: [
          {
            text: "Her voice was full of scorn when she spoke of the tyrant.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // MISBEHAVE (Verb)
  // ===========================================================================
  {
    lemma: "misbehave",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "misbehaved", grammatical_features: { tense: "past" } },
      { form_text: "misbehaving", grammatical_features: { participle: "present" } },
      { form_text: "misbehaves", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
      { form_text: "misbehavior", grammatical_features: {} }, // Nominal
    ],
    senses: [
      {
        definition: "To behave badly or in a way that causes problems.",
        order_index: 0,
        tags: ["behavior", "negative"],
        examples: [
          {
            text: "What we miss when we misbehave is often only clear later.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // LONELY (Adjective)
  // ===========================================================================
  {
    lemma: "lonely",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "lonelier", grammatical_features: { degree: "comparative" } },
      { form_text: "loneliest", grammatical_features: { degree: "superlative" } },
      { form_text: "loneliness", grammatical_features: {} }, // Nominal
    ],
    senses: [
      {
        definition: "Unhappy because you are alone or do not have anyone to talk to.",
        order_index: 0,
        tags: ["emotion", "negative"],
        examples: [
          {
            text: "Goodness knows the wicked's lives are lonely.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // REAP (Verb)
  // ===========================================================================
  {
    lemma: "reap",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "reaped", grammatical_features: { tense: "past" } },
      { form_text: "reaping", grammatical_features: { participle: "present" } },
      { form_text: "reaps", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To receive or experience something as a result of your own actions.",
        order_index: 0,
        tags: ["behavior"],
        examples: [
          {
            text: "They reap only what they've sown.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SOW (Verb)
  // ===========================================================================
  {
    lemma: "sow",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "sowed", grammatical_features: { tense: "past" } },
      { form_text: "sown", grammatical_features: { participle: "past" } },
      { form_text: "sowing", grammatical_features: { participle: "present" } },
      { form_text: "sows", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To plant seeds in the ground so that plants will grow.",
        order_index: 0,
        tags: ["nature", "poetic"],
        examples: [
          {
            text: "They reap only what they've sown is a way of saying our actions have consequences.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ATROCIOUS (Adjective)
  // ===========================================================================
  {
    lemma: "atrocious",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "atrociously", grammatical_features: {} },
      { form_text: "atrociousness", grammatical_features: {} },
    ],
    senses: [
      {
        definition: "Very bad or unpleasant; shocking in a way that upsets people.",
        order_index: 0,
        tags: ["negative"],
        examples: [
          {
            text: "When they saw the baby, they cried, 'It's atrocious!'",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // OBSCENE (Adjective)
  // ===========================================================================
  {
    lemma: "obscene",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "obscenely", grammatical_features: {} },
      { form_text: "obscenity", grammatical_features: {} },
    ],
    senses: [
      {
        definition: "Extremely offensive, shocking, or morally wrong.",
        order_index: 0,
        tags: ["morality", "negative"],
        examples: [
          {
            text: "They shouted, 'It's obscene!' when they saw how different the baby was.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SPURN (Verb)
  // ===========================================================================
  {
    lemma: "spurn",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "spurned", grammatical_features: { tense: "past" } },
      { form_text: "spurning", grammatical_features: { participle: "present" } },
      { form_text: "spurns", grammatical_features: { tense: "present", person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To refuse to accept something or someone, especially in an unkind or proud way.",
        order_index: 0,
        tags: ["emotion", "negative", "poetic"],
        examples: [
          {
            text: "Woe to those who spurn what goodnesses they are shown.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // WOE (Noun)
  // ===========================================================================
  {
    lemma: "woe",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "woes", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "Great sadness or trouble.",
        order_index: 0,
        tags: ["emotion", "negative", "poetic"],
        examples: [
          {
            text: "Woe to those who spurn what goodnesses they are shown.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ELIXIR (Noun)
  // ===========================================================================
  {
    lemma: "elixir",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "elixirs", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A magical liquid in stories that is believed to cure illness or give special powers; or any powerful, special drink.",
        order_index: 0,
        tags: ["fantasy"],
        examples: [
          {
            text: "Have another drink of green elixir, sang the lover.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // MIXER (Noun)
  // ===========================================================================
  {
    lemma: "mixer",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "mixers", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A small informal party or event where people meet and talk.",
        order_index: 0,
        tags: ["social"],
        examples: [
          {
            text: "We'll have ourselves a little mixer, promises the song.",
            source: {
              source: WICKED_SOURCE,
              part_path: NO_ONE_MOURNS_THE_WICKED_PATH,
            },
          },
        ],
      },
    ],
  },
];
