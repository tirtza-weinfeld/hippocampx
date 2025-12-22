/**
 * Anatomy & Muscle Terminology Seed Data
 *
 * Covers:
 * - Major muscle groups
 * - Anatomical directional terms
 * - Movement types (kinesiology)
 * - Body regions
 */

import type { LexicalEntrySeed } from "../../dictionary";

export const ANATOMY_DATA: LexicalEntrySeed[] = [
    // =========
    // Core
    // =========
    {
      lemma: "tissue",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a group of similar cells organized to perform a specific function in the body",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Muscle is a specialized type of tissue." }],
        relations: [{ target_lemma: "muscle", relation_type: "hyponym" }],
      }],
    },
    {
      lemma: "muscle",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "contractile tissue that produces force, movement, and joint stabilization",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Skeletal muscle contracts to move bones at joints." }],
        relations: [
          { target_lemma: "tissue", relation_type: "hypernym" },
          { target_lemma: "hamstrings", relation_type: "hyponym" },
          { target_lemma: "quadriceps femoris", relation_type: "hyponym" },
          { target_lemma: "rotator cuff", relation_type: "hyponym" },
          { target_lemma: "hip adductors", relation_type: "hyponym" },
          { target_lemma: "gastrocnemius", relation_type: "hyponym" },
          { target_lemma: "soleus", relation_type: "hyponym" },
          { target_lemma: "tibialis anterior", relation_type: "hyponym" },
          { target_lemma: "deltoid muscle", relation_type: "hyponym" },
          { target_lemma: "transversus abdominis", relation_type: "hyponym" },
          { target_lemma: "multifidus", relation_type: "hyponym" },
        ],
      }],
    },
  
    // ==========
    // Regions
    // ==========
    {
      lemma: "thigh",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "the region of the lower limb between the hip and the knee",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "hamstrings", relation_type: "holonym" },
          { target_lemma: "quadriceps femoris", relation_type: "holonym" },
          { target_lemma: "hip adductors", relation_type: "holonym" },
        ],
      }],
    },
    {
      lemma: "lower leg",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "the region of the limb between the knee and the ankle",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "gastrocnemius", relation_type: "holonym" },
          { target_lemma: "soleus", relation_type: "holonym" },
          { target_lemma: "tibialis anterior", relation_type: "holonym" },
        ],
      }],
    },
    {
      lemma: "shoulder",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "the region where the upper limb attaches to the trunk, including the shoulder girdle and glenohumeral joint",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "deltoid muscle", relation_type: "holonym" },
          { target_lemma: "rotator cuff", relation_type: "holonym" },
          { target_lemma: "scapula", relation_type: "meronym", explanation: "includes (shoulder blade)" },
        ],
      }],
    },
    {
      lemma: "scapula",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "the shoulder blade; a flat bone on the posterior thorax that anchors many shoulder muscles",
        tags: ["anatomy", "musculoskeletal"],
        relations: [{ target_lemma: "shoulder", relation_type: "holonym" }],
      }],
    },
    {
      lemma: "hip",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "the joint region connecting the pelvis to the femur",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "thigh", relation_type: "holonym", explanation: "proximal connection region for the thigh" },
          { target_lemma: "hip adductors", relation_type: "holonym", explanation: "contains (major adductor muscles act here)" },
        ],
      }],
    },
    {
      lemma: "knee",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a joint between the femur and tibia that primarily permits flexion and extension",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "flexion", relation_type: "holonym", explanation: "permits" },
          { target_lemma: "extension", relation_type: "holonym", explanation: "permits" },
        ],
      }],
    },
  
    // ======================
    // Movement primitives
    // ======================
    {
      lemma: "movement",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a change in position of a body part, typically produced by muscle action at joints",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "flexion", relation_type: "hyponym" },
          { target_lemma: "extension", relation_type: "hyponym" },
          { target_lemma: "abduction", relation_type: "hyponym" },
          { target_lemma: "adduction", relation_type: "hyponym" },
          { target_lemma: "internal rotation", relation_type: "hyponym" },
          { target_lemma: "external rotation", relation_type: "hyponym" },
          { target_lemma: "supination", relation_type: "hyponym" },
          { target_lemma: "pronation", relation_type: "hyponym" },
        ],
      }],
    },
    {
      lemma: "flexion",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a movement that decreases the angle between body parts",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Knee flexion bends the leg." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "extension", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "extension",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a movement that increases the angle between body parts",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Knee extension straightens the leg." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "flexion", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "abduction",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "movement of a limb away from the body's midline",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Raising the arm out to the side is abduction." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "adduction", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "adduction",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "movement of a limb toward the body's midline",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Bringing the arm back to the side is adduction." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "abduction", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "internal rotation",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "rotation of a limb toward the midline around its long axis",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Internal rotation of the shoulder turns the arm inward." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "external rotation", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "external rotation",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "rotation of a limb away from the midline around its long axis",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "External rotation of the hip turns the thigh outward." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "internal rotation", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "supination",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "rotation of the forearm so the palm faces upward (anatomical position)",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Turning a doorknob can involve supination." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "pronation", relation_type: "antonym" },
        ],
      }],
    },
    {
      lemma: "pronation",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "rotation of the forearm so the palm faces downward",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Typing typically places the forearm in pronation." }],
        relations: [
          { target_lemma: "movement", relation_type: "hypernym" },
          { target_lemma: "supination", relation_type: "antonym" },
        ],
      }],
    },
  
    // ======================
    // Hamstrings (group + members)
    // ======================
    {
      lemma: "hamstrings",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition:
          "a posterior thigh muscle group—semitendinosus, semimembranosus, and biceps femoris (long head)—that flexes the knee and extends the hip",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "The hamstrings work eccentrically to decelerate the leg during running." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "thigh", relation_type: "meronym", explanation: "located in (posterior thigh)" },
          { target_lemma: "quadriceps femoris", relation_type: "antonym", explanation: "functional antagonist at the knee" },
          { target_lemma: "biceps femoris", relation_type: "hyponym" },
          { target_lemma: "semitendinosus", relation_type: "hyponym" },
          { target_lemma: "semimembranosus", relation_type: "hyponym" },
        ],
      }],
    },
    {
      lemma: "biceps femoris",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a posterior thigh muscle with long and short heads; flexes the knee, and the long head also extends the hip",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hamstrings", relation_type: "hypernym", explanation: "member of the hamstrings group" },
        ],
      }],
    },
    {
      lemma: "semitendinosus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a posterior thigh muscle that extends the hip and flexes the knee",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hamstrings", relation_type: "hypernym", explanation: "member of the hamstrings group" },
        ],
      }],
    },
    {
      lemma: "semimembranosus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a deep posterior thigh muscle that extends the hip and flexes the knee",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hamstrings", relation_type: "hypernym", explanation: "member of the hamstrings group" },
        ],
      }],
    },
  
    // ======================
    // Quadriceps (group + members)
    // ======================
    {
      lemma: "quadriceps femoris",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition:
          "an anterior thigh muscle group—rectus femoris, vastus lateralis, vastus medialis, and vastus intermedius—that primarily extends the knee",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "The quadriceps femoris generates knee extension during standing up." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "thigh", relation_type: "meronym", explanation: "located in (anterior thigh)" },
          { target_lemma: "hamstrings", relation_type: "antonym", explanation: "functional antagonist at the knee" },
          { target_lemma: "rectus femoris", relation_type: "hyponym" },
          { target_lemma: "vastus lateralis", relation_type: "hyponym" },
          { target_lemma: "vastus medialis", relation_type: "hyponym" },
          { target_lemma: "vastus intermedius", relation_type: "hyponym" },
        ],
      }],
    },
    {
      lemma: "rectus femoris",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a biarticular anterior thigh muscle that extends the knee and flexes the hip",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "quadriceps femoris", relation_type: "hypernym", explanation: "member of the quadriceps group" },
        ],
      }],
    },
    {
      lemma: "vastus lateralis",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a large lateral anterior thigh muscle responsible for knee extension",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "quadriceps femoris", relation_type: "hypernym", explanation: "member of the quadriceps group" },
        ],
      }],
    },
    {
      lemma: "vastus medialis",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a medial anterior thigh muscle that extends the knee and contributes to patellar stabilization",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "quadriceps femoris", relation_type: "hypernym", explanation: "member of the quadriceps group" },
        ],
      }],
    },
    {
      lemma: "vastus intermedius",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a deep anterior thigh muscle beneath rectus femoris that extends the knee",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "quadriceps femoris", relation_type: "hypernym", explanation: "member of the quadriceps group" },
        ],
      }],
    },
  
    // ======================
    // Hip adductors (group + members)
    // ======================
    {
      lemma: "hip adductors",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition:
          "a medial thigh muscle group—including adductor longus, adductor brevis, adductor magnus, gracilis, and pectineus—that primarily adducts the hip",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "The hip adductors stabilize the pelvis during single-leg stance." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "thigh", relation_type: "meronym", explanation: "located in (medial thigh)" },
          { target_lemma: "abduction", relation_type: "antonym", explanation: "opposite movement at the hip" },
          { target_lemma: "adductor longus", relation_type: "hyponym" },
          { target_lemma: "adductor brevis", relation_type: "hyponym" },
          { target_lemma: "adductor magnus", relation_type: "hyponym" },
          { target_lemma: "gracilis", relation_type: "hyponym" },
          { target_lemma: "pectineus", relation_type: "hyponym" },
        ],
      }],
    },
    {
      lemma: "adductor longus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a medial thigh muscle that adducts the hip",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hip adductors", relation_type: "hypernym" },
          { target_lemma: "adduction", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
    {
      lemma: "adductor brevis",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a medial thigh muscle that adducts the hip",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hip adductors", relation_type: "hypernym" },
          { target_lemma: "adduction", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
    {
      lemma: "adductor magnus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a large medial thigh muscle that strongly adducts the hip",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hip adductors", relation_type: "hypernym" },
          { target_lemma: "adduction", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
    {
      lemma: "gracilis",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a long superficial medial thigh muscle that adducts the hip and assists knee flexion",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hip adductors", relation_type: "hypernym" },
          { target_lemma: "adduction", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
    {
      lemma: "pectineus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a proximal medial thigh muscle that adducts the hip",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "hip adductors", relation_type: "hypernym" },
          { target_lemma: "adduction", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
  
    // ======================
    // Rotator cuff (group + members)
    // ======================
    {
      lemma: "rotator cuff",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition:
          "a shoulder stabilizer muscle group—supraspinatus, infraspinatus, teres minor, and subscapularis—that centers the humeral head in the glenoid during arm movement",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Rotator cuff activation helps stabilize the shoulder during overhead lifting." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "shoulder", relation_type: "meronym", explanation: "located in (shoulder complex)" },
          { target_lemma: "supraspinatus", relation_type: "hyponym" },
          { target_lemma: "infraspinatus", relation_type: "hyponym" },
          { target_lemma: "teres minor", relation_type: "hyponym" },
          { target_lemma: "subscapularis", relation_type: "hyponym" },
        ],
      }],
    },
    {
      lemma: "supraspinatus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a rotator cuff muscle that initiates shoulder abduction and contributes to glenohumeral stability",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "rotator cuff", relation_type: "hypernym" },
          { target_lemma: "abduction", relation_type: "holonym", explanation: "assists" },
        ],
      }],
    },
    {
      lemma: "infraspinatus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a rotator cuff muscle that externally rotates the shoulder and stabilizes the joint",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "rotator cuff", relation_type: "hypernym" },
          { target_lemma: "external rotation", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
    {
      lemma: "teres minor",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a rotator cuff muscle that externally rotates the shoulder and contributes to stability",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "rotator cuff", relation_type: "hypernym" },
          { target_lemma: "external rotation", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
    {
      lemma: "subscapularis",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a rotator cuff muscle that internally rotates the shoulder and stabilizes the joint",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "rotator cuff", relation_type: "hypernym" },
          { target_lemma: "internal rotation", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
  
    // ======================
    // Shoulder prime mover (minimal)
    // ======================
    {
      lemma: "deltoid muscle",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a thick triangular shoulder muscle that is a primary mover for arm abduction",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "shoulder", relation_type: "meronym" },
          { target_lemma: "abduction", relation_type: "holonym", explanation: "produces" },
        ],
      }],
    },
  
    // ======================
    // Core stabilizers (deep + interesting)
    // ======================
    {
      lemma: "core stabilizers",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "deep trunk muscles that contribute to spinal and pelvic stability during movement",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Core stabilizers help control the trunk during lifting and balance tasks." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "transversus abdominis", relation_type: "hyponym" },
          { target_lemma: "multifidus", relation_type: "hyponym" },
          { target_lemma: "diaphragm", relation_type: "hyponym" },
        ],
      }],
    },
    {
      lemma: "transversus abdominis",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a deep abdominal muscle that increases trunk stiffness and contributes to spinal stability",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Transversus abdominis activation can increase trunk stability during movement." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "core stabilizers", relation_type: "hypernym" },
        ],
      }],
    },
    {
      lemma: "multifidus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a deep spinal muscle group that contributes to segmental spinal stability",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "Multifidus helps stabilize the spine during loaded tasks." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "core stabilizers", relation_type: "hypernym" },
        ],
      }],
    },
    {
      lemma: "diaphragm",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "the primary muscle of respiration that also contributes to trunk pressure regulation",
        tags: ["anatomy", "musculoskeletal"],
        examples: [{ text: "The diaphragm contracts during inhalation." }],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "core stabilizers", relation_type: "hypernym" },
        ],
      }],
    },
  
    // ======================
    // Lower leg (minimal, high-signal)
    // ======================
    {
      lemma: "gastrocnemius",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a superficial calf muscle that plantarflexes the ankle and assists knee flexion",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "lower leg", relation_type: "meronym" },
        ],
      }],
    },
    {
      lemma: "soleus",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "a deep calf muscle that plantarflexes the ankle",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "lower leg", relation_type: "meronym" },
        ],
      }],
    },
    {
      lemma: "tibialis anterior",
      part_of_speech: "noun",
      language_code: "en",
      senses: [{
        definition: "an anterior lower leg muscle that dorsiflexes the ankle",
        tags: ["anatomy", "musculoskeletal"],
        relations: [
          { target_lemma: "muscle", relation_type: "hypernym" },
          { target_lemma: "lower leg", relation_type: "meronym" },
          { target_lemma: "gastrocnemius", relation_type: "antonym", explanation: "dorsiflexion vs plantarflexion (functional opposition at the ankle)" },
        ],
      }],
    },
  ];
  