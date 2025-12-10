import type { LexicalEntrySeed } from "../../dictionary";

/**
 * Shared source for all examples from "Dear Old Shiz"
 * Wicked Part 1 (2024) - Song #2
 */
const WICKED_DEAR_OLD_SHIZ_SOURCE = {
  source: {
    type: "musical" as const,
    title: "Wicked Part 1",
    publication_year: 2024,
    contributors: [
      { name: "Stephen Schwartz", role: "composer" as const },
      { name: "Stephen Schwartz", role: "lyricist" as const },
      { name: "Winnie Holzman", role: "playwright" as const },
    ],
  },
  part_path: [ "Dear Old Shiz"],
};

export const DEAR_OLD_SHIZ_DICTIONARY_DATA: LexicalEntrySeed[] = [
  // hallowed (adjective)
  {
    lemma: "hallowed",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition: "Greatly respected and treated as holy or very special.",
        order_index: 0,
        tags: ["religion", "education", "formal", "positive"],
        examples: [
          {
            text: "Graduates spoke of the hallowed halls of their old university.",
            source: WICKED_DEAR_OLD_SHIZ_SOURCE,
          },
        ],
      },
    ],
  },

  // vine-draped (adjective)
  {
    lemma: "vine-draped",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition: "Covered or decorated with vines hanging down.",
        order_index: 0,
        tags: ["nature", "description", "poetic"],
        examples: [
          {
            text: "The vine-draped walls made the old school look ancient and grand.",
            source: WICKED_DEAR_OLD_SHIZ_SOURCE,
          },
        ],
      },
    ],
  },

  // proud (adjective) - with forms
  {
    lemma: "proud",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "prouder", grammatical_features: { degree: "comparative" } },
      { form_text: "proudest", grammatical_features: { degree: "superlative" } },
    ],
    senses: [
      {
        definition:
          "Feeling pleased and satisfied because of something you or someone connected to you has done.",
        order_index: 0,
        tags: ["emotion", "positive"],
        examples: [
          {
            text: "They felt proud when they looked back on their school days.",
            source: WICKED_DEAR_OLD_SHIZ_SOURCE,
          },
        ],
      },
    ],
  },

  // proudly (adverb) - derived from proud, but separate entry
  {
    lemma: "proudly",
    part_of_speech: "adverb",
    language_code: "en",
    senses: [
      {
        definition: "In a way that shows pride or satisfaction.",
        order_index: 0,
        tags: ["emotion", "positive"],
        relations: [
          { target_lemma: "proud", target_pos: "adjective", relation_type: "nuance" },
        ],
      },
    ],
  },

  // sere (adjective)
  {
    lemma: "sere",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition: "Dry and withered, especially about plants or grass.",
        order_index: 0,
        tags: ["nature", "description", "poetic", "archaic"],
        examples: [
          {
            text: "By late summer, the once green fields were sere and brown.",
            source: WICKED_DEAR_OLD_SHIZ_SOURCE,
          },
        ],
      },
    ],
  },

  // hath (verb) - archaic form of "has"
  {
    lemma: "hath",
    part_of_speech: "verb",
    language_code: "en",
    senses: [
      {
        definition: "An old or literary form of 'has', used with 'he', 'she' or 'it'.",
        order_index: 0,
        tags: ["grammar", "archaic"],
        examples: [
          {
            text: "In old texts, you might read that time hath passed.",
            source: WICKED_DEAR_OLD_SHIZ_SOURCE,
          },
        ],
        relations: [
          { target_lemma: "have", target_pos: "verb", relation_type: "nuance", explanation: "Archaic third-person singular form" },
        ],
      },
    ],
  },

  // revere (verb) - with forms
  {
    lemma: "revere",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "revered", grammatical_features: { tense: "past" } },
      { form_text: "revered", grammatical_features: { participle: "past" } },
      { form_text: "revering", grammatical_features: { participle: "present" } },
      { form_text: "reveres", grammatical_features: { person: "3rd", number: "singular" } },
    ],
    senses: [
      {
        definition: "To feel deep respect and admiration for someone or something.",
        order_index: 0,
        tags: ["emotion", "respect", "formal", "positive"],
        examples: [
          {
            text: "Students often revere the teachers who changed their lives.",
            source: WICKED_DEAR_OLD_SHIZ_SOURCE,
          },
        ],
      },
    ],
  },

  // reverence (noun) - derived from revere
  {
    lemma: "reverence",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "Deep respect and admiration for someone or something.",
        order_index: 0,
        tags: ["emotion", "respect", "formal", "positive"],
        relations: [
          { target_lemma: "revere", target_pos: "verb", relation_type: "nuance", explanation: "Noun form of the verb" },
        ],
      },
    ],
  },
];