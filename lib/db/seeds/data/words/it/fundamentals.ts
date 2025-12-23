
import type { LexicalEntrySeed } from "../../dictionary";

export const IT_FUNDAMENTAL_DATA_EXPANDED: LexicalEntrySeed[] = [
  // ===========================================================================
  // IL (The - Definite Article)
  // ===========================================================================
  {
    lemma: "il",
    part_of_speech: "article",
    language_code: "it",
    forms: [
      // MASCULINE SINGULAR
      {
        form_text: "il", // Standard (before consonants)
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      {
        form_text: "lo", // Before s+cons, z, gn, ps, y
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      {
        form_text: "l'", // Before vowels
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      // MASCULINE PLURAL
      {
        form_text: "i", // Standard (before consonants)
        grammatical_features: { gender: "masculine", number: "plural" },
      },
      {
        form_text: "gli", // Before vowels, s+cons, z, gn, ps
        grammatical_features: { gender: "masculine", number: "plural" },
      },
      // FEMININE SINGULAR
      {
        form_text: "la", // Standard (before consonants)
        grammatical_features: { gender: "feminine", number: "singular" },
      },
      {
        form_text: "l'", // Before vowels
        grammatical_features: { gender: "feminine", number: "singular" },
      },
      // FEMININE PLURAL
      {
        form_text: "le", // Standard
        grammatical_features: { gender: "feminine", number: "plural" },
      },
    ],
    senses: [
      {
        definition: "The definite article; indicates a specific noun.",
        order_index: 0,
        tags: ["grammar"],
        examples: [
          { text: "Il cane abbaia." }, // il
          { text: "Lo zaino è pesante." }, // lo
          { text: "L'albero è alto." }, // l' (masc)
          { text: "I gatti dormono." }, // i
          { text: "Gli studenti studiano." }, // gli
          { text: "La casa è bella." }, // la
          { text: "L'amica è gentile." }, // l' (fem)
          { text: "Le ragazze corrono." }, // le
        ],
        relations: [
          {
            target_lemma: "uno",
            relation_type: "antonym",
            explanation: "Definite vs Indefinite",
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // UNO (A/An - Indefinite Article)
  // ===========================================================================
  {
    lemma: "uno",
    part_of_speech: "article",
    language_code: "it",
    forms: [
      // MASCULINE
      {
        form_text: "un", // Standard (before vowels and most consonants)
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      {
        form_text: "uno", // Before s+cons, z, gn, ps
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      // FEMININE
      {
        form_text: "una", // Standard (before consonants)
        grammatical_features: { gender: "feminine", number: "singular" },
      },
      {
        form_text: "un'", // Before vowels (apostrophe is mandatory for feminine!)
        grammatical_features: { gender: "feminine", number: "singular" },
      },
    ],
    senses: [
      {
        definition: "The indefinite article; indicates a non-specific noun.",
        order_index: 0,
        tags: ["grammar"],
        examples: [
          { text: "Ho visto un film interessante." }, // un
          { text: "Vorrei uno specchio." }, // uno
          { text: "È una bella giornata." }, // una
          { text: "È un'ottima idea." }, // un'
        ],
        relations: [
          {
            target_lemma: "il",
            relation_type: "antonym",
            explanation: "Indefinite vs Definite",
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ESSERE (To Be)
  // ===========================================================================
  {
    lemma: "essere",
    part_of_speech: "verb",
    language_code: "it",
    forms: [
      // Present Indicative
      {
        form_text: "sono",
        grammatical_features: { tense: "present", person: "1st", number: "singular" },
      },
      {
        form_text: "sei",
        grammatical_features: { tense: "present", person: "2nd", number: "singular" },
      },
      {
        form_text: "è",
        grammatical_features: { tense: "present", person: "3rd", number: "singular" },
      },
      {
        form_text: "siamo",
        grammatical_features: { tense: "present", person: "1st", number: "plural" },
      },
      {
        form_text: "siete",
        grammatical_features: { tense: "present", person: "2nd", number: "plural" },
      },
      {
        form_text: "sono",
        grammatical_features: { tense: "present", person: "3rd", number: "plural" },
      },
      // Participle
      {
        form_text: "stato",
        grammatical_features: { participle: "past" }, // Using valid union type field
      },
    ],
    senses: [
      {
        definition: "To exist; to have a specific identity, nature, or condition.",
        order_index: 0,
        tags: ["auxiliary"],
        examples: [
          { text: "Io sono italiano." },
          { text: "Tu sei felice?" },
          { text: "Lui è a casa." },
        ],
        relations: [
          {
            target_lemma: "avere",
            relation_type: "analog",
            explanation: "The other primary auxiliary verb in Italian.",
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // AVERE (To Have)
  // ===========================================================================
  {
    lemma: "avere",
    part_of_speech: "verb",
    language_code: "it",
    forms: [
      // Present Indicative
      {
        form_text: "ho",
        grammatical_features: { tense: "present", person: "1st", number: "singular" },
      },
      {
        form_text: "hai",
        grammatical_features: { tense: "present", person: "2nd", number: "singular" },
      },
      {
        form_text: "ha",
        grammatical_features: { tense: "present", person: "3rd", number: "singular" },
      },
      {
        form_text: "abbiamo",
        grammatical_features: { tense: "present", person: "1st", number: "plural" },
      },
      {
        form_text: "avete",
        grammatical_features: { tense: "present", person: "2nd", number: "plural" },
      },
      {
        form_text: "hanno",
        grammatical_features: { tense: "present", person: "3rd", number: "plural" },
      },
      // Participle
      {
        form_text: "avuto",
        grammatical_features: { participle: "past" },
      },
    ],
    senses: [
      {
        definition: "To possess or hold something; also used as an auxiliary for transitive verbs.",
        order_index: 0,
        tags: ["auxiliary"],
        examples: [
          { text: "Io ho un gatto." },
          { text: "Hai fame?" },
          { text: "Loro hanno molti soldi." },
        ],
      },
    ],
  },

  // ===========================================================================
  // BELLO (Beautiful)
  // ===========================================================================
  {
    lemma: "bello",
    part_of_speech: "adjective",
    language_code: "it",
    forms: [
      // BELLO follows the exact same phonetic rules as "QUELLO" when placed before a noun
      // MASCULINE SINGULAR
      {
        form_text: "bello",
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      {
        form_text: "bel",
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      {
        form_text: "bell'",
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      // FEMININE SINGULAR
      {
        form_text: "bella",
        grammatical_features: { gender: "feminine", number: "singular" },
      },
      {
        form_text: "bell'",
        grammatical_features: { gender: "feminine", number: "singular" },
      },
      // MASCULINE PLURAL
      {
        form_text: "belli",
        grammatical_features: { gender: "masculine", number: "plural" },
      },
      {
        form_text: "bei",
        grammatical_features: { gender: "masculine", number: "plural" },
      },
      {
        form_text: "begli",
        grammatical_features: { gender: "masculine", number: "plural" },
      },
      // FEMININE PLURAL
      {
        form_text: "belle",
        grammatical_features: { gender: "feminine", number: "plural" },
      },
    ],
    senses: [
      {
        definition: "Pleasing to the senses or mind aesthetically.",
        order_index: 0,
        tags: [],
        examples: [
          { text: "Che bel cane!" }, // bel + consonant
          { text: "È un bell'uomo." }, // bell' + vowel
          { text: "Quei fiori sono belli." }, // Predicative use (always belli)
          { text: "Ho visto dei bei quadri." }, // bei + consonant
        ],
        relations: [
          {
            target_lemma: "brutto",
            relation_type: "antonym",
            explanation: "Beautiful vs Ugly",
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // TUTTO (All/Everything)
  // ===========================================================================
  {
    lemma: "tutto",
    part_of_speech: "adjective", // Can also be pronoun, but Adjective covers the forms well
    language_code: "it",
    forms: [
      {
        form_text: "tutto",
        grammatical_features: { gender: "masculine", number: "singular" },
      },
      {
        form_text: "tutta",
        grammatical_features: { gender: "feminine", number: "singular" },
      },
      {
        form_text: "tutti",
        grammatical_features: { gender: "masculine", number: "plural" },
      },
      {
        form_text: "tutte",
        grammatical_features: { gender: "feminine", number: "plural" },
      },
    ],
    senses: [
      {
        definition: "The whole quantity or extent of; every.",
        order_index: 0,
        tags: ["quantifier"],
        examples: [
          { text: "Ho mangiato tutto il pane." },
          { text: "Tutti i ragazzi sono qui." },
          { text: "Tutta la vita." },
        ],
        relations: [
          {
            target_lemma: "niente",
            relation_type: "antonym",
            explanation: "Everything vs Nothing",
          },
        ],
      },
    ],
  },
];