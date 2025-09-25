// "use client";

// import { cn } from "@/lib/utils";
// import { Lightbulb } from "lucide-react";
// import { Children, isValidElement, cloneElement } from "react";
// import { HorizontalRule } from "../dividers";

// interface ProblemIntuitionProps {
//   children: React.ReactNode;
//   className?: string;
//   [key: string]: any;
// }

// export function ProblemIntuitionHeader({ children, className }: ProblemIntuitionProps) {
//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex  items-center gap-2 mb-2">
//         <div className="flex-shrink-0 rounded-full p-1 bg-alert-intuition/10">
//           <Lightbulb className="w-4 h-4 text-alert-intuition" />
//         </div>
//         <div className="font-semibold text-sm uppercase tracking-wider text-alert-intuition">
//           {children}
//         </div>

//       </div>
//       {/* <div className="w-full h-0.5 bg-linear-to-r from-teal-500 via-blue-500 to-bg-red-500 my-2" /> */}

      

//     </div>
//   )
// }
// export function ProblemIntuition({ children, className, ...props }: ProblemIntuitionProps) {
//   return (
//     <div
//       {...props}
//       className={cn(
//         "flex items-start gap-4",
//         "rounded-md bg-linear-to-br",
//         "p-4",
//         "from-white to-alert-intuition/20 dark:from-gray-900 dark:to-alert-intuition/20",
//         "border-alert-intuition",
//         "shadow-sm border-l-2",
//         "mb-3",
//         className
//       )}
//       role="region"
//       aria-label="Problem intuition"
//     >
//       <div className="flex-1 min-w-0">

//         <div className={cn(
//           "text-sm leading-relaxed text-gray-600 dark:text-gray-400",
//           "[&_p]:m-0 [&_a]:font-medium",
//           "[&_code]:bg-black/[0.07] dark:[&_code]:bg-white/[0.07]",
//           "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs",
//           "text-alert-intuition",
//           "w-full mb-0"
//         )}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }