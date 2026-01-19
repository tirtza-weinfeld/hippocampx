
/**
 * Advanced Vocabulary Seed Data
 *
 * Covers:
 * - Words about words (metalinguistic terms)
 * - Greek/Latin derived vocabulary
 * - Neuroscience terminology
 */

import type { LexicalEntrySeed } from "../../dictionary";

export const VOCABULARY_DATA: LexicalEntrySeed[] = [
  // ===========================
  // Words About Words
  // ===========================
  {
    lemma: "sesquipedalian",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "characterized by the use of long words; given to using long words",
        tags: ["rhetoric", "writing-style"],
        examples: [
          { text: "His sesquipedalian prose made the article difficult to read." },
          { text: "The professor's sesquipedalian lectures left students scrambling for dictionaries." },
          { text: "She avoided sesquipedalian language in her children's books." },
        ],
        relations: [
          { target_lemma: "sesquipedalianism", relation_type: "derivation" },
          { target_lemma: "verbose", relation_type: "synonym" },
          { target_lemma: "concise", relation_type: "antonym" },
        ],
      },
      {
        order_index: 1,
        definition: "(of a word) polysyllabic; having many syllables",
        tags: ["linguistics", "phonology"],
        examples: [
          { text: "'Hippopotomonstrosesquipedaliophobia' is a sesquipedalian word." },
          { text: "Medical terminology is notoriously sesquipedalian." },
          { text: "'Antidisestablishmentarianism' is often cited as a sesquipedalian example." },
        ],
      },
    ],
    metadata: {
      etymology:
        "From Latin sesquipedalis ('a foot and a half long'), from sesqui- ('one and a half') + pes ('foot')",
    },
  },

  {
    lemma: "sesquipedalianism",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "the practice or habit of using long words, especially in speech or writing",
        tags: ["rhetoric", "writing-style"],
        examples: [
          { text: "Academic writing is often criticized for its sesquipedalianism." },
          { text: "His sesquipedalianism obscured otherwise simple ideas." },
          { text: "Plain-language movements argue against bureaucratic sesquipedalianism." },
        ],
        relations: [
          { target_lemma: "sesquipedalian", relation_type: "derivation" },
          { target_lemma: "verbosity", relation_type: "synonym" },
        ],
      },
    ],
  },

  {
    lemma: "hippopotomonstrosesquipedaliophobia",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "a humorous, non-clinical term meaning fear of long words",
        tags: ["humor", "neologism", "non-clinical"],
        examples: [
          { text: "The term is deliberately ironic, being extremely long itself." },
          { text: "It is commonly cited as an example of linguistic humor." },
          { text: "The word appears in popular word lists but not in clinical literature." },
        ],
        relations: [
          {
            target_lemma: "sesquipedalian",
            relation_type: "derivation",
            explanation: "contains the sesquipedali- root referring to long words",
          },
        ],
      },
    ],
    metadata: {
      etymology:
        "Humorous coinage combining hippopotamus, monstrum, sesquipedalian, and -phobia",
      note: "Not a recognized medical or psychological diagnosis",
    },
  },

  // ===========================
  // Neuroscience (hippo- = seahorse)
  // ===========================
  {
    lemma: "hippocampus",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a seahorse-shaped structure in the medial temporal lobe, part of the limbic system, involved in memory consolidation and spatial navigation",
        tags: ["neuroanatomy", "limbic-system", "memory"],
        examples: [
          { text: "Damage to the hippocampus impairs the formation of new declarative memories." },
          { text: "The hippocampus is involved in spatial navigation and contextual memory." },
          { text: "Studies have reported hippocampal differences in individuals with extensive navigation experience." },
          { text: "Patient H.M.'s surgery involving medial temporal lobe structures revealed the hippocampus’s role in memory." },
        ],
        relations: [
          { target_lemma: "hippocampal", relation_type: "derivation" },
          {
            target_lemma: "amygdala",
            relation_type: "analog",
            explanation: "neighboring limbic structure involved in emotional processing",
          },
        ],
      },
      {
        order_index: 1,
        definition:
          "a genus of marine fish in the family Syngnathidae; seahorses",
        tags: ["zoology", "marine-biology", "taxonomy"],
        examples: [
          { text: "Hippocampus erectus is the lined seahorse." },
          { text: "The genus Hippocampus includes dozens of recognized seahorse species." },
        ],
      },
    ],
    metadata: {
      etymology:
        "From Greek hippokampos ('seahorse'), from hippos ('horse') + kampos ('sea monster')",
    },
  },

  {
    lemma: "hippocampal",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition: "relating to or affecting the hippocampus",
        tags: ["neuroanatomy", "neuroscience"],
        examples: [
          { text: "Hippocampal neurons are vulnerable to hypoxia." },
          { text: "Hippocampal atrophy is associated with Alzheimer’s disease." },
          { text: "The hippocampal formation includes the dentate gyrus and subiculum." },
        ],
        relations: [{ target_lemma: "hippocampus", relation_type: "derivation" }],
      },
    ],
  },

  // ===========================
  // Therapy (hippo- = horse)
  // ===========================
  {
    lemma: "hippotherapy",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a clinical therapy in which licensed therapists use the movement of a horse to provide motor and sensory input",
        tags: ["rehabilitation", "physical-therapy", "occupational-therapy"],
        examples: [
          { text: "Hippotherapy is used to improve postural control and balance." },
          { text: "The horse’s gait provides patterned sensory input during hippotherapy." },
          { text: "Hippotherapy is distinct from recreational or therapeutic riding." },
        ],
        relations: [
          {
            target_lemma: "hippocampus",
            relation_type: "analog",
            explanation: "shares the Greek root hippos ('horse')",
          },
        ],
      },
    ],
    metadata: {
      etymology:
        "From Greek hippos ('horse') + therapeia ('treatment')",
      note: "Requires licensed clinicians; not a riding lesson",
    },
  },

  // ===========================
  // Transformation (meta- = change)
  // ===========================
  {
    lemma: "metamorphosis",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "(biology) a developmental process involving a marked change in body form across life stages",
        tags: ["developmental-biology", "entomology", "zoology"],
        examples: [
          { text: "Insects like butterflies undergo complete metamorphosis." },
          { text: "Amphibians experience metamorphosis from larval to adult forms." },
        ],
        relations: [{ target_lemma: "metamorphose", relation_type: "derivation" }],
      },
      {
        order_index: 1,
        definition:
          "a profound change in form, character, or condition",
        tags: ["literary", "conceptual-change"],
        examples: [
          { text: "The organization underwent a cultural metamorphosis." },
          { text: "Kafka’s work uses physical metamorphosis as a metaphor." },
        ],
      },
    ],
    metadata: {
      etymology:
        "From Greek meta- ('change') + morphe ('form')",
    },
  },

  {
    lemma: "metamorphose",
    part_of_speech: "verb",
    language_code: "en",
    senses: [
      {
        definition:
          "to undergo or cause a complete transformation",
        tags: ["transformation"],
        examples: [
          { text: "The caterpillar metamorphoses inside the chrysalis." },
          { text: "The town metamorphosed into a cultural center." },
        ],
        relations: [
          { target_lemma: "metamorphosis", relation_type: "derivation" },
          { target_lemma: "transform", relation_type: "synonym" },
        ],
      },
    ],
  },

  // ===========================
  // Latin-Root Adjectives
  // ===========================
  {
    lemma: "precocious",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "(of a person, especially a child) having developed abilities earlier than usual",
        tags: ["child-development", "developmental-psychology"],
        examples: [
          { text: "The precocious child was reading fluently by age five." },
          { text: "She showed precocious mathematical reasoning." },
          { text: "Mozart is often cited as a precocious musician." },
        ],
        relations: [
          { target_lemma: "precociousness", relation_type: "derivation" },
          { target_lemma: "advanced", relation_type: "synonym" },
        ],
      },
      {
        order_index: 1,
        definition:
          "(botany) developing earlier than usual",
        tags: ["botany", "plant-development"],
        examples: [
          { text: "Some cultivars are valued for their precocious flowering." },
        ],
      },
    ],
    metadata: {
      etymology:
        "From Latin praecox ('ripening early')",
    },
  },

  {
    lemma: "precarious",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "not securely positioned; liable to fall or collapse",
        tags: ["physical-instability", "danger"],
        examples: [
          { text: "The ladder stood in a precarious position." },
        ],
        relations: [
          { target_lemma: "unstable", relation_type: "synonym" },
          { target_lemma: "secure", relation_type: "antonym" },
        ],
      },
      {
        order_index: 1,
        definition:
          "dependent on uncertain conditions; insecure",
        tags: ["risk", "economic-insecurity"],
        examples: [
          { text: "Many workers face precarious employment." },
        ],
      },
    ],
  },

  {
    lemma: "superfluous",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "more than necessary; unnecessary or excessive",
        tags: ["redundancy", "editing"],
        examples: [
          { text: "The editor removed superfluous words." },
          { text: "The device included superfluous features." },
        ],
        relations: [
          { target_lemma: "superfluity", relation_type: "derivation" },
          { target_lemma: "redundant", relation_type: "synonym" },
          { target_lemma: "necessary", relation_type: "antonym" },
        ],
      },
    ],
  },
];
