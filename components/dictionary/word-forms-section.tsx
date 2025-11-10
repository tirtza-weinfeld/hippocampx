// import type { WordForm } from "@/lib/db/dictionary-schema";

// const formTypeLabels: Readonly<Record<string, string>> = {
//   plural: "plural noun",
//   past_tense: "past tense",
//   past_participle: "past participle",
//   gerund: "gerund or present participle",
//   third_person: "3rd person present",
// } as const;

// function getRelevantForms(wordForms: readonly WordForm[], partOfSpeech: string): readonly WordForm[] {
//   return wordForms.filter((form) => {
//     if (partOfSpeech === "noun") return form.formType === "plural";
//     if (partOfSpeech === "verb")
//       return ["past_tense", "past_participle", "gerund", "third_person"].includes(
//         form.formType
//       );
//     return false;
//   });
// }

// type WordFormsSectionProps = {
//   readonly wordForms: readonly WordForm[];
//   readonly partOfSpeech: string;
// };

// export function WordFormsSection({ wordForms, partOfSpeech }: WordFormsSectionProps) {
//   const relevantForms = getRelevantForms(wordForms, partOfSpeech);

//   if (relevantForms.length === 0) return null;

//   return (
//     <div className="mb-3 text-[13px] text-gray-600 dark:text-gray-400">
//       {relevantForms.map((form, index) => (
//         <span key={form.id}>
//           <span className="font-medium text-gray-700 dark:text-gray-300">{form.form}</span>
//           {form.formType && formTypeLabels[form.formType] && (
//             <span className="text-gray-500 dark:text-gray-500"> · {formTypeLabels[form.formType]}</span>
//           )}
//           {index < relevantForms.length - 1 && <span className="text-gray-400 dark:text-gray-500"> · </span>}
//         </span>
//       ))}
//     </div>
//   );
// }