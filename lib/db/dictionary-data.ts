
export const dictionaryData = {
  words: [
    {
      word: "dawn",
      pronunciation: "/dɔːn/",
      audioUrl: null,
      usage: 75, // Popularity score 0-100
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the first appearance of light in the sky before sunrise.",
          example: "the rose-pink light of dawn",
          orderIndex: "1",
          synonyms: ["daybreak", "break of day", "crack of dawn", "sunrise", "first light", "daylight", "cockcrow", "sunup"],
          antonyms: ["dusk"],
          relatedWords: [
            { relatedWord: "early morning", relationshipType: "similar" },
            { relatedWord: "peep of day", relationshipType: "similar" },
            { relatedWord: "dawning", relationshipType: "related" },
            { relatedWord: "aurora", relationshipType: "similar" },
            { relatedWord: "dayspring", relationshipType: "similar" }
          ]
        },
        {
          partOfSpeech: "noun" as const,
          definition: "the beginning of a phenomenon or period of time, especially one considered favorable.",
          example: "the dawn of civilization",
          orderIndex: "2",
          synonyms: ["beginning", "start", "birth", "inception", "conception", "origination"],
          antonyms: [],
          relatedWords: []
        },
        {
          partOfSpeech: "verb" as const,
          definition: "(of a day) begin.",
          example: "Thursday dawned bright and sunny",
          orderIndex: "1",
          synonyms: ["begin", "open", "break", "arrive", "emerge", "lighten"],
          antonyms: [],
          relatedWords: [{ relatedWord: "grow light", relationshipType: "similar" }]
        },
        {
          partOfSpeech: "verb" as const,
          definition: "come into existence.",
          example: "a new era of land-use policy was dawning",
          orderIndex: "2",
          synonyms: ["begin", "start", "come into being", "be born", "come into existence"],
          antonyms: [],
          relatedWords: []
        },
        {
          partOfSpeech: "verb" as const,
          definition: "become evident to the mind; be perceived or understood.",
          example: "the awful truth was beginning to dawn on him",
          orderIndex: "3",
          synonyms: ["occur to", "come to", "come to mind", "spring to mind"],
          antonyms: [],
          relatedWords: []
        }
      ],
      phrases: [
        {
          phrase: "from dawn to dusk",
          definition: "all day; ceaselessly.",
          example: "day after day from dawn to dusk, they drove those loaded canoes"
        }
      ],
      wordForms: [
        { formType: "plural", form: "dawns" },
        { formType: "past_tense", form: "dawned" },
        { formType: "past_participle", form: "dawned" },
        { formType: "gerund", form: "dawning" }
      ]
    },
    {
      word: "serendipity",
      pronunciation: "/ˌsɛrənˈdɪpɪti/",
      audioUrl: null,
      usage: 60,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the occurrence and development of events by chance in a happy or beneficial way.",
          example: "a fortunate stroke of serendipity",
          orderIndex: "1",
          synonyms: ["chance", "happy chance", "accident", "happy accident", "fluke", "luck", "good luck", "good fortune"],
          antonyms: ["misfortune", "bad luck"],
          relatedWords: [
            { relatedWord: "fortuity", relationshipType: "similar" },
            { relatedWord: "providence", relationshipType: "related" }
          ]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "serendipities" }]
    },
    {
      word: "ephemeral",
      pronunciation: "/ɪˈfɛm(ə)rəl/",
      audioUrl: null,
      usage: 55,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "lasting for a very short time.",
          example: "fashions are ephemeral: new ones regularly drive out the old",
          orderIndex: "1",
          synonyms: ["transitory", "transient", "fleeting", "passing", "short-lived", "momentary", "brief", "temporary"],
          antonyms: ["permanent", "eternal", "lasting", "enduring"],
          relatedWords: [
            { relatedWord: "evanescent", relationshipType: "similar" },
            { relatedWord: "fugitive", relationshipType: "similar" }
          ]
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "loathing",
      pronunciation: "/ˈloʊðɪŋ/",
      audioUrl: null,
      usage: 50,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a feeling of intense dislike or disgust; hatred.",
          example: "she felt sudden loathing for the hypocrisy",
          orderIndex: "1",
          synonyms: ["abhorrence", "detestation", "hatred", "revulsion", "disgust", "odium", "antipathy"],
          antonyms: ["affection", "fondness", "liking"],
          relatedWords: [
            { relatedWord: "loathe", relationshipType: "base_form" },
            { relatedWord: "aversion", relationshipType: "similar" },
            { relatedWord: "contempt", relationshipType: "related" }
          ]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "loathings" }]
    },
    {
      word: "rational",
      pronunciation: "/ˈræʃ(ə)nəl/",
      audioUrl: null,
      usage: 70,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "based on or in accordance with reason or logic.",
          example: "a rational decision grounded in evidence",
          orderIndex: "1",
          synonyms: ["logical", "reasonable", "sound", "sensible", "coherent"],
          antonyms: ["irrational", "illogical"],
          relatedWords: [{ relatedWord: "reason", relationshipType: "root" }]
        },
        {
          partOfSpeech: "noun" as const,
          definition: "(mathematics) a rational number: a number expressible as the quotient of two integers with nonzero denominator.",
          example: "every integer is a rational",
          orderIndex: "2",
          synonyms: ["rational number"],
          antonyms: ["irrational (number)"],
          relatedWords: [
            { relatedWord: "fraction", relationshipType: "similar" },
            { relatedWord: "integer", relationshipType: "related" },
            { relatedWord: "irrational number", relationshipType: "contrast" }
          ]
        }
      ],
      phrases: [],
      wordForms: [
        { formType: "comparative", form: "more rational" },
        { formType: "superlative", form: "most rational" },
        { formType: "noun_form", form: "rationality" },
        { formType: "adverb_form", form: "rationally" }
      ]
    },
    {
      word: "set",
      pronunciation: "/sɛt/",
      audioUrl: null,
      usage: 95,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(mathematics) a well-defined collection of distinct objects considered as an object in its own right.",
          example: "the set of even integers is infinite",
          orderIndex: "1",
          synonyms: ["collection", "aggregate", "class"],
          antonyms: [],
          relatedWords: [
            { relatedWord: "subset", relationshipType: "part_of" },
            { relatedWord: "superset", relationshipType: "related" },
            { relatedWord: "element", relationshipType: "member_of" },
            { relatedWord: "union", relationshipType: "operation" },
            { relatedWord: "intersection", relationshipType: "operation" }
          ]
        },
        {
          partOfSpeech: "verb" as const,
          definition: "to put, place, or fix in a specified position; to establish.",
          example: "set the parameters before running the algorithm",
          orderIndex: "2",
          synonyms: ["place", "put", "establish", "fix"],
          antonyms: ["unset", "remove"],
          relatedWords: []
        }
      ],
      phrases: [
        { phrase: "set builder notation", definition: "notation describing a set by a property its members satisfy.", example: "A = { x ∈ ℝ : x ≥ 0 }" }
      ],
      wordForms: [
        { formType: "plural", form: "sets" },
        { formType: "third_person_singular", form: "sets" },
        { formType: "past_tense", form: "set" },
        { formType: "past_participle", form: "set" },
        { formType: "gerund", form: "setting" }
      ]
    },
    {
      word: "tensor",
      pronunciation: "/ˈtɛn.sər/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(mathematics/physics) a multilinear mapping or an array of components that transforms covariantly/contravariantly between coordinate systems; generalizes scalars, vectors, and matrices.",
          example: "the stress tensor captures internal forces within a material",
          orderIndex: "1",
          synonyms: ["multidimensional array (contextual)", "multilinear form"],
          antonyms: [],
          relatedWords: [
            { relatedWord: "rank", relationshipType: "attribute" },
            { relatedWord: "vector", relationshipType: "special_case" },
            { relatedWord: "matrix", relationshipType: "special_case" },
            { relatedWord: "scalar", relationshipType: "special_case" }
          ]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "tensors" }]
    },
    {
      word: "vector",
      pronunciation: "/ˈvɛk.tər/",
      audioUrl: null,
      usage: 65,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(mathematics) a quantity with magnitude and direction; an element of a vector space.",
          example: "velocity is a vector, combining speed with direction",
          orderIndex: "1",
          synonyms: ["directed quantity"],
          antonyms: ["scalar (contrast)"],
          relatedWords: [
            { relatedWord: "magnitude", relationshipType: "attribute" },
            { relatedWord: "direction", relationshipType: "attribute" },
            { relatedWord: "basis", relationshipType: "related" },
            { relatedWord: "dot product", relationshipType: "operation" },
            { relatedWord: "cross product", relationshipType: "operation" }
          ]
        }
      ],
      phrases: [
        { phrase: "zero vector", definition: "the unique vector of magnitude 0.", example: "adding the zero vector leaves any vector unchanged" },
        { phrase: "unit vector", definition: "a vector of magnitude 1.", example: "normalize v to get a unit vector" }
      ],
      wordForms: [{ formType: "plural", form: "vectors" }]
    },
    {
      word: "matrix",
      pronunciation: "/ˈmeɪtrɪks/",
      audioUrl: null,
      usage: 60,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(mathematics) a rectangular array of numbers or symbols arranged in rows and columns, representing a linear transformation or system.",
          example: "multiply the matrix by the vector to apply the transformation",
          orderIndex: "1",
          synonyms: ["array (rectangular)", "table (mathematical)"],
          antonyms: [],
          relatedWords: [
            { relatedWord: "determinant", relationshipType: "attribute" },
            { relatedWord: "rank", relationshipType: "attribute" },
            { relatedWord: "eigenvalue", relationshipType: "related" },
            { relatedWord: "eigenvector", relationshipType: "related" }
          ]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "matrices" }]
    },
    {
      word: "infinity",
      pronunciation: "/ɪnˈfɪnɪti/",
      audioUrl: null,
      usage: 70,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the state or quality of being infinite; without bound or end.",
          example: "the number line extends to infinity",
          orderIndex: "1",
          synonyms: ["endlessness", "limitlessness", "boundlessness"],
          antonyms: ["finitude", "boundedness"],
          relatedWords: [
            { relatedWord: "countable", relationshipType: "contrast" },
            { relatedWord: "uncountable", relationshipType: "contrast" },
            { relatedWord: "aleph-null", relationshipType: "related" },
            { relatedWord: "cardinality", relationshipType: "related" }
          ]
        }
      ],
      phrases: [
        { phrase: "approach infinity", definition: "increase without bound.", example: "as x approaches infinity, the function tends to zero" }
      ],
      wordForms: [{ formType: "adjective_form", form: "infinite" }]
    },
    {
      word: "algorithm",
      pronunciation: "/ˈælɡəˌrɪðəm/",
      audioUrl: null,
      usage: 80,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a finite, well-defined sequence of steps to solve a problem or compute a function.",
          example: "Dijkstra’s algorithm finds shortest paths in a weighted graph",
          orderIndex: "1",
          synonyms: ["procedure", "method", "process", "recipe", "routine"],
          antonyms: [],
          relatedWords: [
            { relatedWord: "data structure", relationshipType: "related" },
            { relatedWord: "complexity", relationshipType: "attribute" },
            { relatedWord: "greedy", relationshipType: "type_of" },
            { relatedWord: "dynamic programming", relationshipType: "type_of" }
          ]
        }
      ],
      phrases: [
        { phrase: "algorithmic complexity", definition: "resources required by an algorithm (time/memory).", example: "its time complexity is O(n log n)" }
      ],
      wordForms: [{ formType: "plural", form: "algorithms" }]
    },
    {
      word: "ineffable",
      pronunciation: "/ɪˈnɛfəbl/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "too great or extreme to be expressed or described in words.",
          example: "an ineffable sense of wonder filled the hall",
          orderIndex: "1",
          synonyms: ["inexpressible", "indescribable", "unspeakable", "transcendent"],
          antonyms: ["articulable", "expressible"],
          relatedWords: [{ relatedWord: "sublime", relationshipType: "similar" }]
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "quintessential",
      pronunciation: "/ˌkwɪntɪˈsɛnʃəl/",
      audioUrl: null,
      usage: 50,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "representing the most perfect or typical example of a quality or class.",
          example: "she is the quintessential mentor: rigorous yet kind",
          orderIndex: "1",
          synonyms: ["archetypal", "paradigmatic", "classic", "definitive"],
          antonyms: ["atypical", "uncharacteristic"],
          relatedWords: [{ relatedWord: "quintessence", relationshipType: "root" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "quintessence" }]
    },
    {
      word: "liminal",
      pronunciation: "/ˈlɪmɪnəl/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "relating to a transitional or initial stage; on a threshold between states.",
          example: "they stood in a liminal space between student and professional",
          orderIndex: "1",
          synonyms: ["transitional", "in-between", "threshold"],
          antonyms: ["settled", "definitive"],
          relatedWords: [{ relatedWord: "threshold", relationshipType: "similar" }]
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "perspicacious",
      pronunciation: "/ˌpɜːspɪˈkeɪʃəs/",
      audioUrl: null,
      usage: 25,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "having keen insight and sound understanding.",
          example: "a perspicacious analysis of the negotiation",
          orderIndex: "1",
          synonyms: ["astute", "shrewd", "discerning", "sagacious"],
          antonyms: ["obtuse", "gullible"],
          relatedWords: [{ relatedWord: "perspicacity", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "perspicacity" }]
    },
    {
      word: "sagacious",
      pronunciation: "/səˈɡeɪʃəs/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "wise or judicious; showing good judgment.",
          example: "her sagacious counsel saved the project",
          orderIndex: "1",
          synonyms: ["wise", "judicious", "prudent", "sapient"],
          antonyms: ["foolish", "imprudent"],
          relatedWords: [{ relatedWord: "sage", relationshipType: "root" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "adverb_form", form: "sagaciously" }]
    },
    {
      word: "punctilious",
      pronunciation: "/pʌŋkˈtɪlɪəs/",
      audioUrl: null,
      usage: 20,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "showing great attention to detail or correct behavior.",
          example: "punctilious about citation and sourcing",
          orderIndex: "1",
          synonyms: ["meticulous", "scrupulous", "fastidious", "exact"],
          antonyms: ["careless", "slapdash"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "punctiliousness" }]
    },
    {
      word: "fastidious",
      pronunciation: "/fæˈstɪdiəs/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "very attentive to and concerned about accuracy and detail; hard to please.",
          example: "a fastidious editor who catches every inconsistency",
          orderIndex: "1",
          synonyms: ["meticulous", "exacting", "particular", "punctilious"],
          antonyms: ["undemanding", "careless"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "adverb_form", form: "fastidiously" }]
    },
    {
      word: "assiduous",
      pronunciation: "/əˈsɪdjuəs/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "showing great care and persistent effort.",
          example: "assiduous practice led to mastery",
          orderIndex: "1",
          synonyms: ["diligent", "sedulous", "industrious", "undaunted"],
          antonyms: ["indolent", "slothful"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "adverb_form", form: "assiduously" }]
    },
    {
      word: "obdurate",
      pronunciation: "/ˈɒbdjʊrət/",
      audioUrl: null,
      usage: 25,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "stubbornly refusing to change one’s opinion or course of action.",
          example: "an obdurate stance despite new evidence",
          orderIndex: "1",
          synonyms: ["intransigent", "adamant", "unyielding", "stubborn"],
          antonyms: ["malleable", "amenable"],
          relatedWords: [{ relatedWord: "obduracy", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "obduracy" }]
    },
    {
      word: "intransigent",
      pronunciation: "/ɪnˈtrænzɪdʒənt/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "unwilling to change one’s views or agree.",
          example: "the team remained intransigent on quality standards",
          orderIndex: "1",
          synonyms: ["unyielding", "implacable", "obstinate"],
          antonyms: ["accommodating", "flexible"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "intransigence" }]
    },
    {
      word: "obfuscate",
      pronunciation: "/ˈɒbfʌskeɪt/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "verb" as const,
          definition: "to make something unclear or unintelligible.",
          example: "jargon can obfuscate the core idea",
          orderIndex: "1",
          synonyms: ["muddy", "confuse", "cloud", "blur"],
          antonyms: ["clarify", "elucidate"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "past_participle", form: "obfuscated" }]
    },
    {
      word: "elucidate",
      pronunciation: "/ɪˈluːsɪdeɪt/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "verb" as const,
          definition: "to make clear; explain.",
          example: "the figure elucidates the training loop",
          orderIndex: "1",
          synonyms: ["clarify", "illuminate", "explicate"],
          antonyms: ["obscure", "confound"],
          relatedWords: [{ relatedWord: "lucid", relationshipType: "root" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "elucidation" }]
    },
    {
      word: "ameliorate",
      pronunciation: "/əˈmiːlɪəreɪt/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "verb" as const,
          definition: "to make better or improve.",
          example: "caching can ameliorate latency",
          orderIndex: "1",
          synonyms: ["improve", "enhance", "mitigate", "better"],
          antonyms: ["worsen", "exacerbate"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "amelioration" }]
    },
    {
      word: "exacerbate",
      pronunciation: "/ɪɡˈzæsəbeɪt/",
      audioUrl: null,
      usage: 45,
      definitions: [
        {
          partOfSpeech: "verb" as const,
          definition: "to make a problem, situation, or feeling worse.",
          example: "premature optimization can exacerbate complexity",
          orderIndex: "1",
          synonyms: ["aggravate", "worsen", "amplify"],
          antonyms: ["alleviate", "ameliorate"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "exacerbation" }]
    },
    {
      word: "juxtapose",
      pronunciation: "/ˈdʒʌkstəpəʊz/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "verb" as const,
          definition: "to place side by side for contrast or comparison.",
          example: "the curriculum juxtaposes theory and practice",
          orderIndex: "1",
          synonyms: ["place side by side", "contrast", "collocate"],
          antonyms: [],
          relatedWords: [{ relatedWord: "juxtaposition", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "juxtaposition" }]
    },
    {
      word: "dichotomy",
      pronunciation: "/daɪˈkɒtəmi/",
      audioUrl: null,
      usage: 50,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a division or contrast between two things represented as entirely different.",
          example: "the client/server dichotomy is porous in modern React",
          orderIndex: "1",
          synonyms: ["division", "split", "duality", "binary"],
          antonyms: ["continuum", "unity"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "dichotomies" }]
    },
    {
      word: "paradigm",
      pronunciation: "/ˈpærədaɪm/",
      audioUrl: null,
      usage: 65,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a model or typical example; a conceptual framework.",
          example: "the server-first paradigm reduces client bundles",
          orderIndex: "1",
          synonyms: ["model", "archetype", "framework", "pattern"],
          antonyms: [],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "axiomatic",
      pronunciation: "/ˌæksiəˈmætɪk/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "self-evident or unquestionable.",
          example: "it is axiomatic that caching avoids duplicate fetches",
          orderIndex: "1",
          synonyms: ["self-evident", "taken for granted"],
          antonyms: ["controversial", "debatable"],
          relatedWords: [{ relatedWord: "axiom", relationshipType: "root" }]
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "corollary",
      pronunciation: "/ˈkɒrələri/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a proposition that follows from one already proven; a natural consequence.",
          example: "a corollary of immutability is simpler reasoning",
          orderIndex: "1",
          synonyms: ["consequence", "result", "upshot"],
          antonyms: ["counterexample"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "corollaries" }]
    },
    {
      word: "apotheosis",
      pronunciation: "/əˌpɒθiˈəʊsɪs/",
      audioUrl: null,
      usage: 25,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the highest point in the development of something; deification.",
          example: "the feature was the apotheosis of the release",
          orderIndex: "1",
          synonyms: ["culmination", "pinnacle", "zenith"],
          antonyms: ["nadir"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "plural", form: "apotheoses" }]
    },
    {
      word: "nadir",
      pronunciation: "/ˈneɪdɪə/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the lowest point in the fortunes of a person or organization.",
          example: "debugging at 3 a.m. felt like the nadir of morale",
          orderIndex: "1",
          synonyms: ["low point", "rock bottom"],
          antonyms: ["zenith", "apex"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "verisimilitude",
      pronunciation: "/ˌvɛrɪsɪˈmɪlɪtjuːd/",
      audioUrl: null,
      usage: 20,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the appearance of being true or real.",
          example: "the simulation achieved striking verisimilitude",
          orderIndex: "1",
          synonyms: ["plausibility", "realism", "credibility"],
          antonyms: ["implausibility", "artificiality"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "apocryphal",
      pronunciation: "/əˈpɒkrɪf(ə)l/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "of doubtful authenticity, though widely circulated as true.",
          example: "the apocryphal quote kept resurfacing online",
          orderIndex: "1",
          synonyms: ["dubious", "spurious", "questionable"],
          antonyms: ["authentic", "verifiable"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "salubrious",
      pronunciation: "/səˈluːbrɪəs/",
      audioUrl: null,
      usage: 20,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "health-giving; pleasant and not run-down.",
          example: "a salubrious routine of walks and sleep",
          orderIndex: "1",
          synonyms: ["wholesome", "healthful", "beneficial"],
          antonyms: ["insalubrious", "unhealthy"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "pernicious",
      pronunciation: "/pəˈnɪʃəs/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "having a harmful effect, especially in a subtle or gradual way.",
          example: "pernicious biases skew results over time",
          orderIndex: "1",
          synonyms: ["deleterious", "detrimental", "injurious"],
          antonyms: ["salutary", "beneficial"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "deleterious",
      pronunciation: "/ˌdɛlɪˈtɪəriəs/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "causing harm or damage.",
          example: "a deleterious interaction between features",
          orderIndex: "1",
          synonyms: ["harmful", "damaging", "pernicious"],
          antonyms: ["beneficial", "harmless"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "innocuous",
      pronunciation: "/ɪˈnɒkjʊəs/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "not harmful or offensive.",
          example: "an innocuous warning message",
          orderIndex: "1",
          synonyms: ["harmless", "benign", "inoffensive"],
          antonyms: ["noxious", "harmful"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "ubiquitous",
      pronunciation: "/juːˈbɪkwɪtəs/",
      audioUrl: null,
      usage: 60,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "present, appearing, or found everywhere.",
          example: "smartphones are ubiquitous in classrooms",
          orderIndex: "1",
          synonyms: ["omnipresent", "pervasive", "widespread"],
          antonyms: ["scarce", "rare"],
          relatedWords: [{ relatedWord: "ubiquity", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "ubiquity" }]
    },
    {
      word: "idiosyncratic",
      pronunciation: "/ˌɪdɪəʊsɪŋˈkrætɪk/",
      audioUrl: null,
      usage: 45,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "peculiar or individual; highly distinctive.",
          example: "an idiosyncratic taste in algorithms",
          orderIndex: "1",
          synonyms: ["distinctive", "quirky", "eccentric"],
          antonyms: ["conventional", "typical"],
          relatedWords: [{ relatedWord: "idiosyncrasy", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "idiosyncrasy" }]
    },
    {
      word: "nonplussed",
      pronunciation: "/nɒnˈplʌst/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "surprised and confused so as to be unsure how to react.",
          example: "the unexpected result left us nonplussed",
          orderIndex: "1",
          synonyms: ["bewildered", "perplexed", "baffled"],
          antonyms: ["unfazed", "composed"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "enervate",
      pronunciation: "/ˈɛnəveɪt/ (v), /ˈɛnərvɪt/ (adj)",
      audioUrl: null,
      usage: 25,
      definitions: [
        {
          partOfSpeech: "verb" as const,
          definition: "to sap energy or vitality from; weaken.",
          example: "heat can enervate even the most diligent team",
          orderIndex: "1",
          synonyms: ["debilitate", "sap", "weaken"],
          antonyms: ["fortify", "energize"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "past_participle", form: "enervated" }]
    },
    {
      word: "ennui",
      pronunciation: "/ɒnˈwiː/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a feeling of listlessness and dissatisfaction from lack of occupation or excitement.",
          example: "to stave off ennui, he tackled a hard puzzle",
          orderIndex: "1",
          synonyms: ["boredom", "tedium", "world-weariness"],
          antonyms: ["engagement", "interest"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "zeitgeist",
      pronunciation: "/ˈzaɪtɡaɪst/",
      audioUrl: null,
      usage: 45,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "the defining spirit or mood of a particular period.",
          example: "the app captured the zeitgeist of learning with AI",
          orderIndex: "1",
          synonyms: ["spirit of the age", "ethos", "mood"],
          antonyms: [],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "schadenfreude",
      pronunciation: "/ˈʃɑːdənˌfrɔɪdə/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "pleasure derived from another’s misfortune.",
          example: "good teams avoid schadenfreude and focus on learning",
          orderIndex: "1",
          synonyms: ["malicious joy"],
          antonyms: ["compassion", "empathy"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "platitude",
      pronunciation: "/ˈplætɪtjuːd/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a remark or statement that has been used too often to be interesting or thoughtful.",
          example: "avoid platitudes in feedback; be specific",
          orderIndex: "1",
          synonyms: ["cliché", "banality", "truism"],
          antonyms: ["insight", "originality"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "adjective_form", form: "platitudinous" }]
    },
    {
      word: "pithy",
      pronunciation: "/ˈpɪθi/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "concise and forcefully expressive.",
          example: "write pithy commit messages",
          orderIndex: "1",
          synonyms: ["succinct", "terse", "laconic"],
          antonyms: ["verbose", "prolix"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "laconic",
      pronunciation: "/ləˈkɒnɪk/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "using very few words.",
          example: "a laconic response that said it all",
          orderIndex: "1",
          synonyms: ["terse", "brief", "succinct"],
          antonyms: ["loquacious", "wordy"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "loquacious",
      pronunciation: "/ləˈkweɪʃəs/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "tending to talk a great deal; talkative.",
          example: "a loquacious host kept the guests entertained",
          orderIndex: "1",
          synonyms: ["garrulous", "voluble", "chatty"],
          antonyms: ["taciturn", "reticent"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "loquacity" }]
    },
    {
      word: "prolix",
      pronunciation: "/ˈprəʊlɪks/",
      audioUrl: null,
      usage: 20,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "using too many words; tediously lengthy.",
          example: "trim that prolix paragraph",
          orderIndex: "1",
          synonyms: ["verbose", "wordy", "long-winded"],
          antonyms: ["concise", "pithy"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "erudite",
      pronunciation: "/ˈɛrjʊdaɪt/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "having or showing great knowledge or learning.",
          example: "an erudite lecture on topology",
          orderIndex: "1",
          synonyms: ["learned", "scholarly", "sapient"],
          antonyms: ["ignorant", "illiterate"],
          relatedWords: [{ relatedWord: "erudition", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "erudition" }]
    },
    {
      word: "pedantic",
      pronunciation: "/pɪˈdantɪk/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "excessively concerned with minor details or rules.",
          example: "avoid pedantic nitpicks; focus on substance",
          orderIndex: "1",
          synonyms: ["hair-splitting", "precious", "schoolmasterly"],
          antonyms: ["broad-minded", "open"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "pedantry" }]
    },
    {
      word: "didactic",
      pronunciation: "/dɪˈdaktɪk/",
      audioUrl: null,
      usage: 35,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "intended to teach, particularly with moral instruction as an ulterior motive.",
          example: "didactic content works best with examples",
          orderIndex: "1",
          synonyms: ["instructive", "edifying", "pedagogical"],
          antonyms: ["uninstructive"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "heuristic",
      pronunciation: "/hjʊəˈrɪstɪk/",
      audioUrl: null,
      usage: 55,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "a practical method to solve problems quickly, not guaranteed to be optimal.",
          example: "beam search is a heuristic for decoding",
          orderIndex: "1",
          synonyms: ["rule of thumb", "approximation"],
          antonyms: ["exhaustive method"],
          relatedWords: [{ relatedWord: "stochastic", relationshipType: "related" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "adjective_form", form: "heuristic" }]
    },
    {
      word: "stochastic",
      pronunciation: "/stəˈkæstɪk/",
      audioUrl: null,
      usage: 45,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "randomly determined; involving probabilistic processes.",
          example: "SGD is a stochastic optimization method",
          orderIndex: "1",
          synonyms: ["probabilistic", "random"],
          antonyms: ["deterministic"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "orthogonal",
      pronunciation: "/ɔːˈθɒɡənəl/",
      audioUrl: null,
      usage: 50,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "(math) at right angles; (figurative) independent or unrelated.",
          example: "performance and readability aren’t always orthogonal",
          orderIndex: "1",
          synonyms: ["perpendicular", "independent"],
          antonyms: ["dependent", "correlated"],
          relatedWords: []
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "isomorphism",
      pronunciation: "/ˌaɪsəˈmɔːfɪz(ə)m/",
      audioUrl: null,
      usage: 30,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(math) a structure-preserving bijection between objects (e.g., groups, graphs).",
          example: "an isomorphism shows two structures are essentially the same",
          orderIndex: "1",
          synonyms: ["structure equivalence"],
          antonyms: ["non-isomorphism"],
          relatedWords: [{ relatedWord: "bijection", relationshipType: "related" }]
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "manifold",
      pronunciation: "/ˈmanɪfəʊld/",
      audioUrl: null,
      usage: 40,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(math) a topological space locally resembling Euclidean space.",
          example: "gradients on a manifold respect its geometry",
          orderIndex: "1",
          synonyms: ["differentiable space"],
          antonyms: [],
          relatedWords: [{ relatedWord: "Riemannian", relationshipType: "related" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "adjective_form", form: "manifold" }]
    },
    {
      word: "gradient",
      pronunciation: "/ˈɡreɪdiənt/",
      audioUrl: null,
      usage: 70,
      definitions: [
        {
          partOfSpeech: "noun" as const,
          definition: "(math) the vector of partial derivatives; direction of steepest ascent.",
          example: "backprop computes the gradient of the loss",
          orderIndex: "1",
          synonyms: ["derivative vector"],
          antonyms: [],
          relatedWords: [{ relatedWord: "descent", relationshipType: "operation" }]
        }
      ],
      phrases: [],
      wordForms: []
    },
    {
      word: "convex",
      pronunciation: "/ˈkɒnvɛks/",
      audioUrl: null,
      usage: 45,
      definitions: [
        {
          partOfSpeech: "adjective" as const,
          definition: "(math) a set or function with no internal ‘dents’; any line segment between points lies within.",
          example: "convex losses simplify optimization guarantees",
          orderIndex: "1",
          synonyms: ["bulging outward"],
          antonyms: ["concave"],
          relatedWords: [{ relatedWord: "convexity", relationshipType: "noun_form" }]
        }
      ],
      phrases: [],
      wordForms: [{ formType: "noun_form", form: "convexity" }]
    }
  ]
} as const;

export type DictionarySeedData = typeof dictionaryData;

