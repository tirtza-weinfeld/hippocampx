

import type { LexicalEntrySeed } from "../../dictionary";

/* =========================
   DATABASES
   relation_type only:
   synonym | antonym | hypernym | hyponym | meronym | holonym
   ========================= */

export const DATABASE_VOCAB: LexicalEntrySeed[] = [
  {
    lemma: "query",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "queries", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A request to retrieve or modify data from a database.",
        tags: ["database"],
        examples: [{ text: "The query selects all active users." }],
      },
    ],
  },

  {
    lemma: "index",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "indexes", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A data structure that speeds up data retrieval at the cost of extra storage.",
        tags: ["database"],
        examples: [{ text: "Adding an index made the query much faster." }],
        relations: [
          {
            target_lemma: "query",
            relation_type: "holonym",
            explanation: "Indexes exist to optimize queries.",
          },
        ],
      },
    ],
  },

  {
    lemma: "join",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "joins", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "An operation that combines rows from multiple tables using related columns.",
        tags: ["database"],
        examples: [{ text: "An inner join matches rows from both tables." }],
      },
    ],
  },

  {
    lemma: "aggregate",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "aggregates", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "aggregated", grammatical_features: { tense: "past" } },
      { form_text: "aggregating", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To combine multiple rows into a single summarized value.",
        tags: ["database"],
        examples: [{ text: "We aggregate sales by month." }],
      },
    ],
  },

  {
    lemma: "normalize",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "normalizes", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "normalized", grammatical_features: { tense: "past" } },
      { form_text: "normalizing", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To structure a database to reduce redundancy and improve integrity.",
        tags: ["database"],
        examples: [{ text: "Normalize tables to avoid duplicate data." }],
        relations: [
          {
            target_lemma: "denormalize",
            relation_type: "antonym",
          },
        ],
      },
    ],
  },

  {
    lemma: "shard",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "shards", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "sharded", grammatical_features: { tense: "past" } },
      { form_text: "sharding", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To split a database into smaller pieces distributed across machines.",
        tags: ["database", "scaling"],
        examples: [{ text: "We shard by user_id for horizontal scaling." }],
      },
    ],
  },

  {
    lemma: "transaction",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "transactions", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A sequence of operations treated as a single, atomic unit of work.",
        tags: ["database"],
        examples: [{ text: "The transaction ensures consistency." }],
        relations: [
          {
            target_lemma: "commit",
            relation_type: "meronym",
          },
          {
            target_lemma: "rollback",
            relation_type: "meronym",
          },
        ],
      },
    ],
  },

  {
    lemma: "commit",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "commits", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "committed", grammatical_features: { tense: "past" } },
      { form_text: "committing", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To permanently apply the changes made in a transaction.",
        tags: ["database"],
        examples: [{ text: "The transaction commits successfully." }],
        relations: [
          {
            target_lemma: "rollback",
            relation_type: "antonym",
          },
        ],
      },
    ],
  },

  {
    lemma: "rollback",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "rollbacks", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "rolled back", grammatical_features: { tense: "past" } },
      { form_text: "rolling back", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To undo all changes made during a transaction.",
        tags: ["database"],
        examples: [{ text: "The system rolled back after an error." }],
        relations: [
          {
            target_lemma: "commit",
            relation_type: "antonym",
          },
        ],
      },
    ],
  },

  {
    lemma: "constraint",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "constraints", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A rule that restricts what data can be stored in a database.",
        tags: ["database"],
        examples: [{ text: "Foreign key constraints enforce relationships." }],
      },
    ],
  },

  {
    lemma: "schema",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "schemas", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "The structural definition of tables, columns, and relationships.",
        tags: ["database"],
        examples: [{ text: "Migrations update the schema over time." }],
        relations: [
          {
            target_lemma: "table",
            relation_type: "holonym",
          },
        ],
      },
    ],
  },

  {
    lemma: "migrate",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "migrates", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "migrated", grammatical_features: { tense: "past" } },
      { form_text: "migrating", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition: "To apply controlled changes to a database schema or data over time.",
        tags: ["database"],
        examples: [{ text: "We migrate the database during deployment." }],
      },
    ],
  },
];


/* =========================
   STATISTICS
   relation_type only:
   synonym | antonym | hypernym | hyponym | meronym | holonym
   ========================= */

export const STATISTICS_VOCAB: LexicalEntrySeed[] = [
  {
    lemma: "mean",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "means", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "The arithmetic average of a set of numbers.",
        tags: ["statistics"],
        examples: [{ text: "The mean height is 170 cm." }],
        relations: [
          { target_lemma: "median", relation_type: "antonym", explanation: "Mean averages values; median selects the middle value." },
        ],
      },
    ],
  },

  {
    lemma: "median",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "medians", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "The middle value when data is ordered.",
        tags: ["statistics"],
        examples: [{ text: "Median is robust to outliers." }],
        relations: [{ target_lemma: "mean", relation_type: "antonym" }],
      },
    ],
  },

  {
    lemma: "variance",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "A measure of how spread out values are around the mean.",
        tags: ["statistics"],
        examples: [{ text: "High variance indicates wide dispersion." }],
        relations: [{ target_lemma: "standard deviation", relation_type: "holonym", explanation: "Standard deviation is derived from variance." }],
      },
    ],
  },

  {
    lemma: "standard deviation",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "standard deviations", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "The square root of variance; spread in the same units as the data.",
        tags: ["statistics"],
        examples: [{ text: "A small standard deviation means values cluster near the mean." }],
        relations: [{ target_lemma: "variance", relation_type: "meronym" }],
      },
    ],
  },

  {
    lemma: "distribution",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "distributions", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "How values are spread across possible outcomes.",
        tags: ["statistics"],
        examples: [{ text: "The normal distribution is bell-shaped." }],
        relations: [{ target_lemma: "sample", relation_type: "holonym", explanation: "Samples follow an underlying distribution." }],
      },
    ],
  },

  {
    lemma: "correlation",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "correlations", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A measure of how strongly two variables move together.",
        tags: ["statistics"],
        examples: [{ text: "Correlation does not imply causation." }],
      },
    ],
  },

  {
    lemma: "sample",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "samples", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A subset of data drawn from a population.",
        tags: ["statistics"],
        examples: [{ text: "We analyzed a random sample of users." }],
        relations: [{ target_lemma: "population", relation_type: "meronym" }],
      },
    ],
  },

  {
    lemma: "population",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "populations", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "The entire group of interest being studied.",
        tags: ["statistics"],
        examples: [{ text: "The population includes all customers." }],
        relations: [{ target_lemma: "sample", relation_type: "holonym" }],
      },
    ],
  },

  {
    lemma: "hypothesis",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "hypotheses", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A testable claim about a population parameter.",
        tags: ["statistics"],
        examples: [{ text: "We test the null hypothesis." }],
      },
    ],
  },

  {
    lemma: "confidence interval",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "confidence intervals", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A range likely to contain the true population parameter.",
        tags: ["statistics"],
        examples: [{ text: "The 95% confidence interval excludes zero." }],
      },
    ],
  },

  {
    lemma: "regression",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "A method for modeling the relationship between variables, typically predicting a continuous outcome.",
        tags: ["statistics", "ml"],
        examples: [{ text: "Linear regression fits a line to data." }],
        relations: [{ target_lemma: "classification", relation_type: "antonym" }],
      },
    ],
  },

  {
    lemma: "likelihood",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The probability of observed data given model parameters.",
        tags: ["statistics", "ml"],
        examples: [{ text: "We maximize likelihood during estimation." }],
        relations: [{ target_lemma: "posterior", relation_type: "meronym" }],
      },
    ],
  },

  {
    lemma: "prior",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "A probability distribution expressing beliefs before seeing data.",
        tags: ["statistics", "ml"],
        examples: [{ text: "Bayesian methods combine prior with likelihood." }],
        relations: [{ target_lemma: "posterior", relation_type: "meronym" }],
      },
    ],
  },

  {
    lemma: "posterior",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The updated probability distribution after observing data.",
        tags: ["statistics", "ml"],
        examples: [{ text: "The posterior reflects evidence from the data." }],
        relations: [{ target_lemma: "prior", relation_type: "holonym" }],
      },
    ],
  },
];


/* =========================
   CALCULUS
   relation_type only:
   synonym | antonym | hypernym | hyponym | meronym | holonym
   ========================= */

export const CALCULUS_VOCAB: LexicalEntrySeed[] = [
  {
    lemma: "derivative",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "derivatives", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A measure of how fast a function changes with respect to its input.",
        tags: ["calculus", "ml"],
        examples: [{ text: "The derivative gives the slope of the curve at a point." }],
        relations: [
          {
            target_lemma: "slope",
            relation_type: "synonym",
            explanation: "In single-variable calculus, the derivative equals the slope.",
          },
        ],
      },
    ],
  },

  {
    lemma: "integral",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "integrals", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A quantity that accumulates values of a function, often representing area or total change.",
        tags: ["calculus"],
        examples: [{ text: "The integral computes the area under the curve." }],
        relations: [
          {
            target_lemma: "derivative",
            relation_type: "antonym",
            explanation: "Derivatives break change into rates; integrals accumulate change.",
          },
        ],
      },
    ],
  },

  {
    lemma: "limit",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "limits", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The value a function approaches as the input gets arbitrarily close to some point.",
        tags: ["calculus"],
        examples: [{ text: "Limits define derivatives and continuity." }],
      },
    ],
  },

  {
    lemma: "slope",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "slopes", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The steepness of a line or curve, measured as change in output over change in input.",
        tags: ["calculus"],
        examples: [{ text: "A positive slope means the function increases." }],
      },
    ],
  },

  {
    lemma: "tangent",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "tangents", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A line that touches a curve at a single point and has the same slope there.",
        tags: ["calculus"],
        examples: [{ text: "The tangent line approximates the curve locally." }],
      },
    ],
  },

  {
    lemma: "rate of change",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "rates of change", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "How quickly one quantity changes relative to another.",
        tags: ["calculus", "physics", "ml"],
        examples: [{ text: "Velocity is the rate of change of position." }],
        relations: [
          {
            target_lemma: "derivative",
            relation_type: "synonym",
            explanation: "The derivative formally defines rate of change.",
          },
        ],
      },
    ],
  },

  {
    lemma: "converge",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "converges", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "converged", grammatical_features: { tense: "past" } },
      { form_text: "converging", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To approach a finite value as inputs progress or iterations continue.",
        tags: ["calculus", "ml"],
        examples: [{ text: "The sequence converges to zero." }],
        relations: [
          {
            target_lemma: "diverge",
            relation_type: "antonym",
          },
        ],
      },
    ],
  },

  {
    lemma: "diverge",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "diverges", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "diverged", grammatical_features: { tense: "past" } },
      { form_text: "diverging", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To fail to approach a finite value or to grow without bound.",
        tags: ["calculus", "ml"],
        examples: [{ text: "Training can diverge if the learning rate is too high." }],
        relations: [
          { target_lemma: "converge", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "continuous",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "Describes a function with no jumps; small input changes cause small output changes.",
        tags: ["calculus"],
        examples: [{ text: "Polynomials are continuous everywhere." }],
        relations: [
          { target_lemma: "discontinuous", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "discontinuous",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "Describes a function that has jumps, breaks, or gaps.",
        tags: ["calculus"],
        examples: [{ text: "Step functions are discontinuous." }],
        relations: [
          { target_lemma: "continuous", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "inflection point",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      { form_text: "inflection points", grammatical_features: { number: "plural" } },
    ],
    senses: [
      {
        definition:
          "A point where a curve changes concavity (from concave up to concave down or vice versa).",
        tags: ["calculus"],
        examples: [{ text: "The second derivative is zero at an inflection point." }],
      },
    ],
  },

  {
    lemma: "differentiate",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "differentiates", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "differentiated", grammatical_features: { tense: "past" } },
      { form_text: "differentiating", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To compute the derivative of a function.",
        tags: ["calculus"],
        examples: [{ text: "Differentiate f(x) to find its slope." }],
        relations: [
          { target_lemma: "derivative", relation_type: "holonym" },
        ],
      },
    ],
  },

  {
    lemma: "integrate",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "integrates", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "integrated", grammatical_features: { tense: "past" } },
      { form_text: "integrating", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To compute the integral of a function.",
        tags: ["calculus"],
        examples: [{ text: "Integrate the velocity to get position." }],
        relations: [
          { target_lemma: "integral", relation_type: "holonym" },
        ],
      },
    ],
  },

  {
    lemma: "optimize",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "optimizes", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "optimized", grammatical_features: { tense: "past" } },
      { form_text: "optimizing", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To find the maximum or minimum value of a function under given conditions.",
        tags: ["calculus", "ml"],
        examples: [{ text: "Gradient descent optimizes the loss function." }],
      },
    ],
  },

  {
    lemma: "approximate",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "approximates", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "approximated", grammatical_features: { tense: "past" } },
      { form_text: "approximating", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To estimate a value close to the true value when an exact solution is difficult.",
        tags: ["calculus", "numerical"],
        examples: [{ text: "We approximate the integral numerically." }],
      },
    ],
  },
];



/* =========================
   AI & MACHINE LEARNING (person uses "1st" | "2nd" | "3rd")
   relation_type only: synonym | antonym | hypernym | hyponym | meronym | holonym
   ========================= */

export const AI_ML_VOCAB: LexicalEntrySeed[] = [
  {
    lemma: "model",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "models", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A parameterized function/system that maps inputs (features) to outputs (predictions).",
        tags: ["ml", "ai"],
        examples: [{ text: "We trained a model to classify emails as spam or not spam." }],
        relations: [
          {
            target_lemma: "transformer",
            relation_type: "hyponym",
            explanation: "A transformer is a specific type of model architecture.",
          },
        ],
      },
      {
        definition:
          "A simplified representation used to understand or simulate something.",
        tags: ["ml", "math"],
        examples: [{ text: "A linear model assumes outputs change proportionally with inputs." }],
      },
    ],
  },

  {
    lemma: "training",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The process of fitting a model by adjusting weights to reduce loss on training data.",
        tags: ["ml", "ai"],
        examples: [{ text: "Training updates the model’s weights using gradients." }],
        relations: [
          {
            target_lemma: "inference",
            relation_type: "antonym",
            explanation: "Training changes weights; inference uses fixed weights to predict.",
          },
        ],
      },
    ],
  },

  {
    lemma: "inference",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Using a trained model to produce outputs (predictions) from new inputs.",
        tags: ["ml", "ai"],
        examples: [{ text: "Inference runs on-device to predict the next word." }],
        relations: [
          {
            target_lemma: "training",
            relation_type: "antonym",
            explanation: "Inference does not update the model; it only computes outputs.",
          },
        ],
      },
    ],
  },

  {
    lemma: "loss",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "losses", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A number that measures how wrong a model’s predictions are; training tries to minimize it.",
        tags: ["ml", "ai"],
        examples: [{ text: "Lower loss usually means better fit to the training data." }],
        relations: [
          {
            target_lemma: "optimize",
            relation_type: "holonym",
            explanation: "Loss is the objective minimized during optimize/optimization.",
          },
        ],
      },
    ],
  },

  {
    lemma: "gradient",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "gradients", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A vector of partial derivatives showing how loss changes when each weight changes.",
        tags: ["ml", "calculus"],
        examples: [{ text: "We take a gradient step to reduce the loss." }],
      },
      {
        definition:
          "In ML training, the computed signal used to update weights (typically via backpropagation).",
        tags: ["ml"],
        examples: [{ text: "Vanishing gradients can make deep networks hard to train." }],
      },
    ],
  },

  {
    lemma: "epoch",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "epochs", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "One full pass through the training dataset.",
        tags: ["ml"],
        examples: [{ text: "We trained for 20 epochs." }],
        relations: [
          {
            target_lemma: "batch",
            relation_type: "meronym",
            explanation: "An epoch is made of many batches.",
          },
        ],
      },
    ],
  },

  {
    lemma: "batch",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "batches", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A subset of the training data processed together to compute loss and gradients.",
        tags: ["ml", "ai"],
        examples: [{ text: "Batch size 128 means 128 examples per update step." }],
        relations: [
          {
            target_lemma: "epoch",
            relation_type: "holonym",
            explanation: "Batches collectively make up an epoch.",
          },
        ],
      },
    ],
  },

  {
    lemma: "learning rate",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "learning rates", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A step-size hyperparameter controlling how much weights change per gradient update.",
        tags: ["ml", "ai"],
        examples: [{ text: "Too high a learning rate can cause training to diverge." }],
        relations: [
          {
            target_lemma: "optimize",
            relation_type: "meronym",
            explanation: "Learning rate is a key component of optimization dynamics.",
          },
        ],
      },
    ],
  },

  {
    lemma: "overfit",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "overfits", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "overfitted", grammatical_features: { tense: "past" } },
      { form_text: "overfitting", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To fit the training data too closely, reducing performance on new (unseen) data.",
        tags: ["ml", "statistics"],
        examples: [{ text: "The model overfits: training loss drops but validation loss rises." }],
        relations: [
          {
            target_lemma: "underfit",
            relation_type: "antonym",
            explanation: "Underfitting is failing to fit even the training signal.",
          },
        ],
      },
    ],
  },

  {
    lemma: "underfit",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "underfits", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "underfitted", grammatical_features: { tense: "past" } },
      { form_text: "underfitting", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To fit the data poorly because the model is too simple or not trained enough.",
        tags: ["ml", "statistics"],
        examples: [{ text: "A shallow model may underfit a complex dataset." }],
        relations: [
          { target_lemma: "overfit", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "regularization",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Techniques that reduce overfitting by discouraging overly complex solutions.",
        tags: ["ml", "statistics"],
        examples: [{ text: "Weight decay is a common regularization method." }],
        relations: [
          { target_lemma: "dropout", relation_type: "hyponym", explanation: "Dropout is a specific regularization technique." },
        ],
      },
    ],
  },

  {
    lemma: "dropout",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A regularization technique that randomly zeros some activations during training to prevent co-adaptation.",
        tags: ["ml"],
        examples: [{ text: "Dropout is applied during training but typically disabled at inference." }],
        relations: [
          { target_lemma: "regularization", relation_type: "hypernym" },
        ],
      },
    ],
  },

  {
    lemma: "embedding",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "embeddings", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A learned vector representation of an item (word, image, user) so similar items are near each other in vector space.",
        tags: ["ml", "ai", "linear_algebra"],
        examples: [{ text: "We use embeddings to do semantic search." }],
        relations: [
          { target_lemma: "vector", relation_type: "hypernym", explanation: "An embedding is a vector (with learned meaning)." },
        ],
      },
    ],
  },

  {
    lemma: "attention",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A mechanism that weights which tokens/features matter most when computing a representation.",
        tags: ["ml", "ai"],
        examples: [{ text: "Attention lets the model focus on relevant previous tokens." }],
        relations: [
          { target_lemma: "transformer", relation_type: "meronym", explanation: "Attention is a core component inside transformers." },
        ],
      },
    ],
  },

  {
    lemma: "transformer",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "transformers", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A neural network architecture built around attention for sequence modeling (text, audio, vision).",
        tags: ["ml", "ai"],
        examples: [{ text: "Modern LLMs are transformer-based." }],
        relations: [
          { target_lemma: "model", relation_type: "hypernym" },
          { target_lemma: "attention", relation_type: "holonym", explanation: "Transformers contain attention blocks." },
        ],
      },
    ],
  },

  {
    lemma: "feature",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "features", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "An input variable used by a model (a measurable property or representation).",
        tags: ["ml", "statistics"],
        examples: [{ text: "Age and height can be features for predicting weight." }],
        relations: [
          { target_lemma: "label", relation_type: "antonym", explanation: "Features are inputs; labels are target outputs." },
        ],
      },
    ],
  },

  {
    lemma: "label",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "labels", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The target output for supervised learning (the correct answer).",
        tags: ["ml", "statistics"],
        examples: [{ text: "In classification, labels are the class IDs." }],
        relations: [
          { target_lemma: "feature", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "prediction",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "predictions", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A model’s produced output for a given input.",
        tags: ["ml", "ai"],
        examples: [{ text: "The prediction probability was 0.92 for class A." }],
      },
    ],
  },

  {
    lemma: "classification",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A task where the model predicts a discrete category (class).",
        tags: ["ml", "statistics"],
        examples: [{ text: "Spam detection is a classification problem." }],
        relations: [
          { target_lemma: "regression", relation_type: "antonym", explanation: "Classification predicts categories; regression predicts continuous values." },
        ],
      },
    ],
  },

  {
    lemma: "regression",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A task where the model predicts a continuous numeric value.",
        tags: ["ml", "statistics"],
        examples: [{ text: "House-price prediction is regression." }],
        relations: [
          { target_lemma: "classification", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "clustering",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An unsupervised task of grouping similar items without labels.",
        tags: ["ml", "statistics"],
        examples: [{ text: "K-means is a classic clustering algorithm." }],
      },
    ],
  },

  {
    lemma: "weight",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "weights", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A learned parameter that scales inputs inside a model.",
        tags: ["ml", "ai"],
        examples: [{ text: "Training updates weights to reduce loss." }],
        relations: [
          { target_lemma: "bias", relation_type: "antonym", explanation: "Weights scale inputs; biases shift outputs." },
        ],
      },
    ],
  },

  {
    lemma: "bias",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "biases", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A learned parameter that shifts an activation/output independent of the input value.",
        tags: ["ml", "ai"],
        examples: [{ text: "Bias terms help the model fit offsets." }],
        relations: [
          { target_lemma: "weight", relation_type: "antonym" },
        ],
      },
    ],
  },

  {
    lemma: "activation",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "activations", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The output value of a neuron/layer after applying a nonlinearity.",
        tags: ["ml", "ai"],
        examples: [{ text: "ReLU is a common activation function." }],
      },
    ],
  },

  {
    lemma: "backpropagation",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An algorithm to compute gradients efficiently by propagating error signals backward through the network.",
        tags: ["ml", "ai", "calculus"],
        examples: [{ text: "Backpropagation computes gradients for each weight." }],
        relations: [
          { target_lemma: "gradient", relation_type: "holonym", explanation: "Backpropagation is used to obtain gradients." },
        ],
      },
    ],
  },

  {
    lemma: "convergence",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "When training stabilizes toward a solution where updates become small and loss stops improving significantly.",
        tags: ["ml", "calculus"],
        examples: [{ text: "After lowering the learning rate, training finally reached convergence." }],
      },
    ],
  },
];



/* =========================
   LINEAR ALGEBRA (FIXED: relation_type constrained)
   Allowed relation_type only:
   "synonym" | "antonym" | "hypernym" | "hyponym" | "meronym" | "holonym"
   ========================= */

export const LINEAR_ALGEBRA_VOCAB: LexicalEntrySeed[] = [
  {
    lemma: "vector",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "vectors", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "An ordered list of numbers representing a point, direction, or quantity in space.",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "An embedding is a high-dimensional vector." }],
        relations: [
          {
            target_lemma: "scalar",
            relation_type: "antonym",
            explanation:
              "A scalar is a single number; a vector has multiple components.",
          },
        ],
      },
    ],
  },

  {
    lemma: "matrix",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "matrices", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A rectangular array of numbers that represents a linear transformation or a system of equations.",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "Weights in neural networks are stored as matrices." }],
        relations: [
          {
            target_lemma: "array",
            relation_type: "hypernym",
            explanation:
              "A matrix is a structured numerical array (specifically 2D).",
          },
        ],
      },
    ],
  },

  {
    lemma: "scalar",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "scalars", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A single numerical value, often used to scale vectors or matrices.",
        tags: ["linear_algebra", "calculus"],
        examples: [{ text: "Multiply the vector by a scalar to resize it." }],
        relations: [
          {
            target_lemma: "vector",
            relation_type: "antonym",
            explanation: "Vectors have multiple components; scalars do not.",
          },
        ],
      },
    ],
  },

  {
    lemma: "dot product",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      {
        form_text: "dot products",
        grammatical_features: { number: "plural" },
      },
    ],
    senses: [
      {
        definition:
          "An operation that takes two vectors and returns a scalar measuring how aligned they are.",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "If the dot product is 0, the vectors are orthogonal." }],
      },
    ],
  },

  {
    lemma: "transpose",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "transposes", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition: "A matrix formed by swapping rows and columns.",
        tags: ["linear_algebra"],
        examples: [{ text: "The transpose of an m×n matrix is n×m." }],
        relations: [
          {
            target_lemma: "matrix",
            relation_type: "hypernym",
            explanation: "A transpose is a kind of matrix derived from a matrix.",
          },
        ],
      },
    ],
  },

  {
    lemma: "inverse",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "inverses", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A matrix that undoes another matrix under multiplication, producing the identity matrix.",
        tags: ["linear_algebra"],
        examples: [{ text: "Only some square matrices have an inverse." }],
        relations: [
          {
            target_lemma: "matrix",
            relation_type: "hypernym",
            explanation: "An inverse is a special kind of matrix.",
          },
        ],
      },
    ],
  },

  {
    lemma: "eigenvalue",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "eigenvalues", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A scalar that tells how much a matrix scales its corresponding eigenvector.",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "PCA uses eigenvalues to rank principal directions." }],
      },
    ],
  },

  {
    lemma: "eigenvector",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "eigenvectors", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A nonzero vector that keeps its direction under a matrix transformation (it may scale).",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "An eigenvector maps to a scaled version of itself." }],
      },
    ],
  },

  {
    lemma: "determinant",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "determinants", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A scalar value computed from a square matrix that indicates volume scaling and whether the matrix is invertible.",
        tags: ["linear_algebra"],
        examples: [{ text: "If det(A) = 0, then A is not invertible." }],
      },
    ],
  },

  {
    lemma: "rank",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "ranks", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The number of linearly independent rows or columns of a matrix.",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "Low-rank factorization can compress a matrix." }],
      },
    ],
  },

  {
    lemma: "span",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "spans", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The set of all vectors you can form using linear combinations of a given set of vectors.",
        tags: ["linear_algebra"],
        examples: [{ text: "Those two vectors span a plane in 3D." }],
      },
    ],
  },

  {
    lemma: "basis",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "bases", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "A minimal set of linearly independent vectors that spans a vector space.",
        tags: ["linear_algebra"],
        examples: [{ text: "A basis lets you represent any vector using coordinates." }],
      },
    ],
  },

  {
    lemma: "dimension",
    part_of_speech: "noun",
    language_code: "en",
    forms: [{ form_text: "dimensions", grammatical_features: { number: "plural" } }],
    senses: [
      {
        definition:
          "The number of independent directions in a vector space (equal to the size of any basis).",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "A 3D space has dimension 3." }],
      },
    ],
  },

  {
    lemma: "linear combination",
    part_of_speech: "noun",
    language_code: "en",
    forms: [
      {
        form_text: "linear combinations",
        grammatical_features: { number: "plural" },
      },
    ],
    senses: [
      {
        definition:
          "A sum of vectors multiplied by scalars, like a·v + b·w.",
        tags: ["linear_algebra"],
        examples: [{ text: "Any vector in the span is a linear combination." }],
      },
    ],
  },

  {
    lemma: "orthogonal",
    part_of_speech: "adjective",
    language_code: "en",
    forms: [
      { form_text: "more orthogonal", grammatical_features: { degree: "comparative" } },
      { form_text: "most orthogonal", grammatical_features: { degree: "superlative" } },
    ],
    senses: [
      {
        definition:
          "Perpendicular or independent; two vectors are orthogonal if their dot product is 0.",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "Orthogonal vectors share no component in the same direction." }],
      },
    ],
  },

  {
    lemma: "normalize",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "normalizes", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "normalized", grammatical_features: { tense: "past" } },
      { form_text: "normalizing", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To rescale a vector so it has length 1 (unit norm), or to put data into a standard scale.",
        tags: ["linear_algebra", "ml", "statistics"],
        examples: [{ text: "Normalize the embedding vectors before similarity search." }],
      },
    ],
  },

  {
    lemma: "project",
    part_of_speech: "verb",
    language_code: "en",
    forms: [
      { form_text: "projects", grammatical_features: { tense: "present", person: "3rd" } },
      { form_text: "projected", grammatical_features: { tense: "past" } },
      { form_text: "projecting", grammatical_features: { participle: "present" } },
    ],
    senses: [
      {
        definition:
          "To map a vector onto a subspace (often the closest point in that subspace).",
        tags: ["linear_algebra", "ml"],
        examples: [{ text: "Project the point onto the line to minimize distance." }],
      },
    ],
  },
];


export const PRACTICAL_VOCAB_DATA: LexicalEntrySeed[] = [
  ...DATABASE_VOCAB,
  ...STATISTICS_VOCAB,
  ...CALCULUS_VOCAB,
  ...AI_ML_VOCAB,
  ...LINEAR_ALGEBRA_VOCAB,
];