// "use client"

// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "motion/react"
// import { Award, Star, Trophy, Share } from "lucide-react"
// import { shareText } from "@/components/calculus/utility/share-utils"
// import { Button } from "@/components/ui/button"

// type RewardBadgeProps = {
//   title: string
//   description: string
//   icon?: "star" | "award" | "trophy" | "medal"
//   color?: "blue" | "teal" | "indigo" | "green" | "sky"
//   show: boolean
//   onClose?: () => void
//   score?: number
// }

// export function RewardBadge({
//   title,
//   description,
//   icon = "star",
//   color = "blue",
//   show,
//   onClose,
//   score = 0,
// }: RewardBadgeProps) {
//   const [isVisible, setIsVisible] = useState(false)
  
//   // Add ref for the badge container
//   const badgeRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (badgeRef.current && !badgeRef.current.contains(event.target as Node)) {
//         setIsVisible(false)
//         if (onClose) onClose()
//       }
//     }

//     if (isVisible) {
//       document.addEventListener('mousedown', handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [isVisible, onClose])

//   useEffect(() => {
//     if (show) {
//       setIsVisible(true)
//       const timer = setTimeout(() => {
//         setIsVisible(false)
//         if (onClose) onClose()
//       }, 5000)

//       return () => clearTimeout(timer)
//     }
//   }, [show, onClose])

//   const colorClasses = {
//     blue: "from-blue-500 to-sky-400 border-blue-300",
//     teal: "from-teal-500 to-emerald-400 border-teal-300",
//     indigo: "from-indigo-500 to-blue-400 border-indigo-300",
//     green: "from-green-500 to-emerald-400 border-green-300",
//     sky: "from-sky-500 to-cyan-400 border-sky-300",
//   }

//   const icons = {
//     star: <Star className="h-6 w-6" />,
//     award: <Award className="h-6 w-6" />,
//     trophy: <Trophy className="h-6 w-6" />,
//     medal: "🏅",
//   }

//   const handleShare = async () => {
//     try {
//       await shareText({
//         title: `I earned the "${title}" badge in CalKids!`,
//         text: `${description} My score: ${score} #CalKids #MathAchievement`,
//       })
//     } catch (error) {
//       console.error("Error sharing badge:", error)
//       alert("Failed to share your badge. The content has been copied to your clipboard instead.")
//     }
//   }

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           ref={badgeRef}
//           initial={{ opacity: 0, y: -50, scale: 0.8 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -50, scale: 0.8 }}
//           className="fixed top-20 right-4 z-[100] max-w-xs"
//         >
//           <div className={`rounded-xl overflow-hidden shadow-lg border-2 ${colorClasses[color]}`}>
//             <div className={`p-4 bg-gradient-to-r ${colorClasses[color]} text-white`}>
//               <div className="flex items-center gap-2">
//                 <div className="bg-white/20 rounded-full p-2">{icons[icon]}</div>
//                 <div>
//                   <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
//                   <p className="text-sm text-white/90">{title}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-3 bg-background/80 backdrop-blur-sm dark:bg-gray-800/80">
//               <p className="text-sm">{description}</p>
//             </div>
//             <div className="flex justify-between mt-6 p-4">
//               <Button variant="outline" onClick={onClose}>
//                 Close
//               </Button>
//               <Button onClick={handleShare} className="gap-2">
//                 <Share className="h-4 w-4" />
//                 Share
//               </Button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

