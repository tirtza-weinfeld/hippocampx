import { LexicalEntrySeed } from "../../dictionary";

export const VOCABULARY_DATA_ADDITIONS: LexicalEntrySeed[] = [
  {
    lemma: "ludicrous",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "so unreasonable, exaggerated, or illogical that it provokes laughter or disbelief",
        tags: [ "negative"],
        examples: [
          { text: "The idea that the task would take five minutes was ludicrous." },
          { text: "She laughed at the ludicrous excuse." },
          { text: "Charging that much for water is ludicrous." },
        ],
      },
    ],
  },
  {
    lemma: "presumptuous",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "overstepping proper limits by assuming permission, authority, or familiarity without justification",
        tags: ["negative"],
        examples: [
          { text: "It was presumptuous to speak on her behalf." },
          { text: "He made a presumptuous decision without consulting the team." },
          { text: "Asking personal questions felt presumptuous." },
        ],
      },
    ],
  },
  {
    lemma: "celestial",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "relating to the sky, outer space, or astronomical objects beyond Earth",
        tags: ["science"],
        examples: [
          { text: "The telescope captured images of distant celestial bodies." },
          { text: "Ancient calendars were based on celestial movements." },
          { text: "The comet is a celestial object." },
        ],
      },
    ],
  },
  {
    lemma: "bombard",
    part_of_speech: "verb",
    language_code: "en",
    senses: [
      {
        definition:
          "to subject someone or something to a rapid, continuous, or overwhelming stream of actions, questions, or information",
        tags: ["negative"],
        examples: [
          { text: "He was bombarded with questions after the lecture." },
          { text: "The app bombards users with notifications." },
          { text: "Reporters bombarded the official for answers." },
        ],
      },
    ],
  },
  {
    lemma: "carbon dioxide",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a gas produced by respiration, combustion, and decay, and used by plants during photosynthesis",
        tags: ["science"],
        examples: [
          { text: "Humans release carbon dioxide when they breathe out." },
          { text: "Burning fuel produces carbon dioxide." },
          { text: "Plants absorb carbon dioxide during photosynthesis." },
        ],
      },
      {
        order_index: 1,
        definition:
          "a colorless, odorless chemical compound with the molecular formula CO₂",
        tags: ["science"],
        examples: [
          { text: "Carbon dioxide is written chemically as CO₂." },
        ],
        notations: [{ type: "formula", value: "CO₂" }],
      },
    ],
  },
  {
    lemma: "carbon",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a fundamental element present in all known life forms and many natural materials",
        tags: ["science"],
        examples: [
          { text: "Living organisms are built around carbon." },
          { text: "Carbon forms the backbone of organic molecules." },
        ],
      },
      {
        order_index: 1,
        definition:
          "a chemical element with atomic symbol C and atomic number 6",
        tags: ["science"],
        examples: [
          { text: "Carbon’s symbol on the periodic table is C." },
        ],
        notations: [{ type: "symbol", value: "C" }],
      },
    ],
  },
  {
    lemma: "oxygen",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a gas essential for respiration in most living organisms",
        tags: ["science"],
        examples: [
          { text: "Humans require oxygen to survive." },
          { text: "Oxygen enters the blood through the lungs." },
        ],
      },
      {
        order_index: 1,
        definition:
          "a chemical element with atomic symbol O and atomic number 8",
        tags: ["science"],
        examples: [
          { text: "Oxygen is represented by the symbol O." },
        ],
        notations: [{ type: "symbol", value: "O" }],
      },
    ],
  },
  {
    lemma: "respiration",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "the biological process by which cells use oxygen to release energy from nutrients, producing carbon dioxide as a byproduct",
        tags: ["science"],
        examples: [
          { text: "Cellular respiration releases energy from glucose." },
          { text: "Respiration produces carbon dioxide." },
          { text: "Animals rely on respiration for energy." },
        ],
      },
    ],
  },
  {
    lemma: "photosynthesis",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "the process by which plants, algae, and some bacteria use light energy to convert carbon dioxide and water into sugars",
        tags: ["science"],
        examples: [
          { text: "Photosynthesis allows plants to make their own food." },
          { text: "Sunlight drives photosynthesis in leaves." },
          { text: "Oxygen is released during photosynthesis." },
        ],
      },
    ],
  },
  {
    lemma: "carbon cycle",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "the continuous movement of carbon between living organisms, the atmosphere, oceans, and Earth’s crust",
        tags: ["science"],
        examples: [
          { text: "Photosynthesis and respiration are key steps in the carbon cycle." },
          { text: "Carbon moves through air, water, and living things." },
        ],
      },
    ],
  },
  {
    lemma: "compound",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "something formed by combining multiple parts or elements",
        examples: [
          { text: "A compound word joins two smaller words." },
          { text: "The problem had several compound steps." },
        ],
      },
      {
        order_index: 1,
        definition:
          "a chemical substance composed of two or more elements chemically bonded together",
        tags: ["science"],
        examples: [
          { text: "Water is a compound made of hydrogen and oxygen." },
          { text: "Carbon dioxide is a chemical compound." },
        ],
      },
    ],
  },
  {
    lemma: "nucleus",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a membrane-bound structure in eukaryotic cells that contains genetic material and controls cellular activity",
        tags: ["science"],
        examples: [
          { text: "The nucleus stores DNA." },
          { text: "Cell division involves the nucleus." },
          { text: "The nucleus acts as the cell’s control center." },
        ],
      },
      {
        order_index: 1,
        definition:
          "the central or most important part of something",
        examples: [
          { text: "Curiosity formed the nucleus of her interest." },
          { text: "Trust was the nucleus of the relationship." },
        ],
      },
      {
        order_index: 2,
        definition:
          "a distinct cluster of neurons in the brain or spinal cord that serves a specific function",
        tags: ["medical"],
        examples: [
          { text: "The caudate nucleus is involved in learning and movement." },
          { text: "Damage to a brain nucleus can affect behavior." },
        ],
      },
    ],
  },
  {
    lemma: "caudate nucleus",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a C-shaped structure within the basal ganglia involved in learning, memory, and voluntary movement",
        tags: ["medical"],
        examples: [
          { text: "The caudate nucleus plays a role in habit formation." },
          { text: "Researchers study the caudate nucleus in decision-making tasks." },
        ],
      },
    ],
  },
  {
    lemma: "diencephalon",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "a region of the forebrain that includes the thalamus, hypothalamus, and related structures",
        tags: ["medical"],
        examples: [
          { text: "The diencephalon regulates sensory and hormonal functions." },
          { text: "The thalamus is part of the diencephalon." },
        ],
      },
    ],
  },
];
