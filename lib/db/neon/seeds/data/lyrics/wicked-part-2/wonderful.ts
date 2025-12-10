
import type { LexicalEntrySeed, SourceSeed } from "../../dictionary";

// =============================================================================
// SHARED CONSTANTS
// =============================================================================

const WICKED_SOURCE: SourceSeed = {
  type: "musical",
  title: "Wicked Part 2",
  publication_year: 2003,
  contributors: [
    { name: "Stephen Schwartz", role: "composer" },
    { name: "Stephen Schwartz", role: "lyricist" },
  ],
};

const WONDERFUL_PATH = ["Wonderful"];

// =============================================================================
// SEED DATA
// =============================================================================

export const WONDERFUL_DATA: LexicalEntrySeed[] = [
  // ===========================================================================
  // CARNY (Noun)
  // ===========================================================================
  {
    lemma: "carny",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "carnies", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A person who works at a carnival or traveling fair.",
        order_index: 0,
        tags: ["slang", "colloquial", "job"],
        relations: [
          { target_lemma: "showman", relation_type: "synonym" },
          { target_lemma: "barker", relation_type: "synonym" },
          { target_lemma: "huckster", relation_type: "synonym" },
          { target_lemma: "worker", relation_type: "hypernym" },
        ],
        examples: [
          {
            text: "Take it from a wise old carny...",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // BLARNEY (Noun)
  // ===========================================================================
  {
    lemma: "blarney",
    part_of_speech: "noun",
    language_code: "en",
    // No specific plural form used in song, but consistent to leave empty if standard
    senses: [
      {
        definition:
          "Talk that aims to charm, pleasantly flatter, or persuade, often considered deceptive or nonsense.",
        order_index: 0,
        tags: ["colloquial", "communication"],
        relations: [
          { target_lemma: "flattery", relation_type: "synonym" },
          { target_lemma: "cajolery", relation_type: "synonym" },
          { target_lemma: "nonsense", relation_type: "synonym" },
          { target_lemma: "charm", relation_type: "synonym" },
          { target_lemma: "humbug", relation_type: "synonym" },
        ],
        examples: [
          {
            text: "Once folks buy into your blarney, it becomes the thing they'll most hold onto.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SHAM (Noun)
  // ===========================================================================
  {
    lemma: "sham",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "shams", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "Something that is not what it claims to be; a fraud or hoax.",
        order_index: 0,
        tags: ["negative", "deception"],
        relations: [
          { target_lemma: "fake", relation_type: "synonym" },
          { target_lemma: "fraud", relation_type: "synonym" },
          { target_lemma: "hoax", relation_type: "synonym" },
          { target_lemma: "counterfeit", relation_type: "synonym" },
          { target_lemma: "pretense", relation_type: "synonym" },
          { target_lemma: "authentic", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "Once they've swallowed sham and hokum...",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // HOKUM (Noun)
  // ===========================================================================
  {
    lemma: "hokum",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Nonsense, rubbish, or theatrical trickery used to impress people.",
        order_index: 0,
        tags: ["slang", "theatre", "negative"],
        relations: [
          { target_lemma: "bunk", relation_type: "synonym" },
          { target_lemma: "nonsense", relation_type: "synonym" },
          { target_lemma: "rubbish", relation_type: "synonym" },
          { target_lemma: "claptrap", relation_type: "synonym" },
          { target_lemma: "drivel", relation_type: "synonym" },
          { target_lemma: "malarkey", relation_type: "synonym" },
          { target_lemma: "truth", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "Once they've swallowed sham and hokum, facts and logic won't unchoke 'em.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // UNCHOKE (Verb)
  // ===========================================================================
  {
    lemma: "unchoke",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "unchoked", grammatical_features: { tense: "past" } },
      {
        form_text: "unchokes",
        grammatical_features: {
          tense: "present",
          person: "3rd",
          number: "singular",
        },
      },
    ],
    senses: [
      {
        definition:
          "To clear a blockage; metaphorically, to force someone to accept reality after they have swallowed lies.",
        order_index: 0,
        tags: ["metaphorical", "rare"],
        relations: [
          { target_lemma: "clear", relation_type: "synonym" },
          { target_lemma: "release", relation_type: "synonym" },
          { target_lemma: "disabuse", relation_type: "synonym" },
          { target_lemma: "free", relation_type: "synonym" },
        ],
        examples: [
          {
            text: "Facts and logic won't unchoke 'em.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // HICK (Noun)
  // ===========================================================================
  {
    lemma: "hick",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "hicks", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "An unsophisticated country person, often used as a derogatory term.",
        order_index: 0,
        tags: ["slang", "derogatory", "rural"],
        relations: [
          { target_lemma: "yokel", relation_type: "synonym" },
          { target_lemma: "bumpkin", relation_type: "synonym" },
          { target_lemma: "rustic", relation_type: "synonym" },
          { target_lemma: "provincial", relation_type: "synonym" },
          { target_lemma: "sophisticate", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "Look who's wonderful, this corn-fed hick.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // KEEN (Adjective)
  // ===========================================================================
  {
    lemma: "keen",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "keener", grammatical_features: { degree: "comparative" } },
      {
        form_text: "keenest",
        grammatical_features: { degree: "superlative" },
      },
    ],
    senses: [
      {
        definition: "Wonderful, excellent, or very good (dated slang).",
        order_index: 0,
        tags: ["slang", "dated", "positive"],
        relations: [
          { target_lemma: "wonderful", relation_type: "synonym" },
          { target_lemma: "great", relation_type: "synonym" },
          { target_lemma: "swell", relation_type: "synonym" },
          { target_lemma: "nifty", relation_type: "synonym" },
          { target_lemma: "dandy", relation_type: "synonym" },
        ],
        examples: [
          {
            text: "Who said it might be keen to build a town of green?",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
      {
        definition: "Showing eagerness or enthusiasm.",
        order_index: 1,
        tags: ["emotion"],
        relations: [
          { target_lemma: "eager", relation_type: "synonym" },
          { target_lemma: "enthusiastic", relation_type: "synonym" },
          { target_lemma: "intent", relation_type: "synonym" },
          { target_lemma: "apathetic", relation_type: "antonym" },
        ],
      },
    ],
  },

  // ===========================================================================
  // TRAITOR (Noun)
  // ===========================================================================
  {
    lemma: "traitor",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "traitors", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition: "A person who betrays a friend, country, principle, etc.",
        order_index: 0,
        tags: ["politics", "conflict", "negative"],
        relations: [
          { target_lemma: "betrayer", relation_type: "synonym" },
          { target_lemma: "turncoat", relation_type: "synonym" },
          { target_lemma: "defector", relation_type: "synonym" },
          { target_lemma: "quisling", relation_type: "synonym" },
          { target_lemma: "renegade", relation_type: "synonym" },
          { target_lemma: "loyalist", relation_type: "antonym" },
          { target_lemma: "patriot", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "A man's called a traitor or liberator...",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // LIBERATOR (Noun)
  // ===========================================================================
  {
    lemma: "liberator",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "liberators", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition:
          "A person who sets someone free from imprisonment, slavery, or oppression.",
        order_index: 0,
        tags: ["politics", "positive"],
        relations: [
          { target_lemma: "savior", relation_type: "synonym" },
          { target_lemma: "rescuer", relation_type: "synonym" },
          { target_lemma: "deliverer", relation_type: "synonym" },
          { target_lemma: "emancipator", relation_type: "synonym" },
          { target_lemma: "redeemer", relation_type: "synonym" },
          { target_lemma: "oppressor", relation_type: "antonym" },
          { target_lemma: "captor", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "A man's called a traitor or liberator, it's all in which label is able to persist.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // PHILANTHROPIST (Noun)
  // ===========================================================================
  {
    lemma: "philanthropist",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      {
        form_text: "philanthropists",
        grammatical_features: { number: "plural" },
      },
    ],
    senses: [
      {
        definition:
          "A person who seeks to promote the welfare of others, especially by the generous donation of money.",
        order_index: 0,
        tags: ["sociology", "positive", "GRE"],
        relations: [
          { target_lemma: "benefactor", relation_type: "synonym" },
          { target_lemma: "patron", relation_type: "synonym" },
          { target_lemma: "donor", relation_type: "synonym" },
          { target_lemma: "humanitarian", relation_type: "synonym" },
          { target_lemma: "altruist", relation_type: "synonym" },
          { target_lemma: "miser", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "A rich man's a thief or philanthropist...",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // INVADER (Noun)
  // ===========================================================================
  {
    lemma: "invader",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "invaders", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition:
          "A person or group that enters a country or place with force.",
        order_index: 0,
        tags: ["military", "conflict", "negative"],
        relations: [
          { target_lemma: "attacker", relation_type: "synonym" },
          { target_lemma: "aggressor", relation_type: "synonym" },
          { target_lemma: "raider", relation_type: "synonym" },
          { target_lemma: "occupier", relation_type: "synonym" },
          { target_lemma: "infiltrator", relation_type: "synonym" },
          { target_lemma: "defender", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "Is one an invader or noble crusader?",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // CRUSADER (Noun)
  // ===========================================================================
  {
    lemma: "crusader",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "crusaders", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition:
          "A person who campaigns vigorously for political, social, or religious change.",
        order_index: 0,
        tags: ["politics", "history", "positive"],
        relations: [
          { target_lemma: "campaigner", relation_type: "synonym" },
          { target_lemma: "fighter", relation_type: "synonym" },
          { target_lemma: "champion", relation_type: "synonym" },
          { target_lemma: "advocate", relation_type: "synonym" },
          { target_lemma: "reformer", relation_type: "synonym" },
          { target_lemma: "activist", relation_type: "synonym" },
        ],
        examples: [
          {
            text: "Is one an invader or noble crusader?",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // AMBIGUITY (Noun)
  // ===========================================================================
  {
    lemma: "ambiguity",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "ambiguities", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition:
          "The quality of being open to more than one interpretation; inexactness.",
        order_index: 0,
        tags: ["logic", "language", "GRE"],
        relations: [
          { target_lemma: "vagueness", relation_type: "synonym" },
          { target_lemma: "obscurity", relation_type: "synonym" },
          { target_lemma: "uncertainty", relation_type: "synonym" },
          { target_lemma: "equivocation", relation_type: "synonym" },
          { target_lemma: "clarity", relation_type: "antonym" },
          { target_lemma: "certainty", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "There are precious few at ease with moral ambiguities.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // TANDEM (Noun)
  // ===========================================================================
  {
    lemma: "tandem",
    part_of_speech: "noun", // Commonly used in "in tandem" (adverbial phrase), but "tandem" itself is a noun/adjective
    language_code: "en",
    senses: [
      {
        definition: "To work alongside each other; together.",
        order_index: 0,
        tags: ["cooperation"],
        relations: [
          { target_lemma: "together", relation_type: "synonym" },
          { target_lemma: "jointly", relation_type: "synonym" },
          { target_lemma: "pair", relation_type: "synonym" },
          { target_lemma: "partnership", relation_type: "synonym" },
          { target_lemma: "separately", relation_type: "antonym" },
          { target_lemma: "alone", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "Dreams the way we planned 'em, if we work in tandem.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // PERSIST (Verb)
  // ===========================================================================
  {
    lemma: "persist",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "persisted", grammatical_features: { tense: "past" } },
      {
        form_text: "persisting",
        grammatical_features: { participle: "present" },
      },
      {
        form_text: "persists",
        grammatical_features: {
          tense: "present",
          person: "3rd",
          number: "singular",
        },
      },
    ],
    senses: [
      {
        definition:
          "To continue to exist or be prolonged, especially when faced with opposition.",
        order_index: 0,
        tags: ["action", "time"],
        relations: [
          { target_lemma: "continue", relation_type: "synonym" },
          { target_lemma: "endure", relation_type: "synonym" },
          { target_lemma: "remain", relation_type: "synonym" },
          { target_lemma: "last", relation_type: "synonym" },
          { target_lemma: "persevere", relation_type: "synonym" },
          { target_lemma: "cease", relation_type: "antonym" },
          { target_lemma: "stop", relation_type: "antonym" },
        ],
        examples: [
          {
            text: "It's all in which label is able to persist.",
            source: { source: WICKED_SOURCE, part_path: WONDERFUL_PATH },
          },
        ],
      },
    ],
  },
];
