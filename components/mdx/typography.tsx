"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

interface TypographyProps {
  children: ReactNode
}

export const H1 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-12 mt-16 first:mt-2">
    {/* Decorative background */}
    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent rounded blur-2xl"
    {...props}
    />
    {/* <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl" /> */}

    <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight " {...props}>
      <span className="bg-gradient-to-l from-teal-600 via-sky-600/80 via-80% to-blue-600/80 bg-clip-text text-transparent 
      
      font-bold
      uppercase

      ">
        {children}

      </span>
      {/* Decorative underline */}
      {/* <div className="h-2 bg-gradient-to-r from-teal-600 via-indigo-600 to-blue-600 rounded-full mt-4 w-1/2" /> */}
      {/* <div className="h-px bg-gradient-to-r from-blue-500 via-pink-500 to-transparent mt-4 ml-4" /> */}
      {/* <div className="h-px bg-gradient-to-r from-teal-600 via-indigo-600 to-blue-600 mt-4 ml-4" /> */}

    </h1>
  </motion.div>
)

export const H2 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-8 mt-12  " {...props}>
    <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 via-teal-500/80 rounded-full" />
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight 
    bg-gradient-to-r from-teal-600/70 from-5% via-indigo-600/60 via-30% to-blue-500/80 to-50% 
      bg-clip-text text-transparent
    " {...props}>
      {children}
    </h2>
    <div className="h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-600 dark:via-gray-700
     mt-4 " />

  </motion.div>
)
export const H3 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-6 mt-10">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </h3>
    </div>
  </motion.div>
)

export const H4 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-4 mt-8" {...props}>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </h4>
    </div>
  </motion.div>
)

export const H5 = ({ children, ...props }: TypographyProps) => (
  <motion.h5
    {...fadeInUp}
    className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 mb-3 mt-6 border-l-2 border-blue-500 pl-3" {...props}
 
 >
    {children}
  </motion.h5>
)

export const H6 = ({ children, ...props }: TypographyProps) => (
  <motion.h6
    {...fadeInUp}
    className="text-base md:text-lg lg:text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 mb-2 mt-4 uppercase text-blue-600 dark:text-blue-400 tracking-wider" {...props}
  
  >
    {children}
  </motion.h6>
)

export const Paragraph = ({ children, ...props }: TypographyProps) => (
  <motion.p
    {...fadeInUp}
    className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-none" {...props}
  >
    {children}
  </motion.p>
)

export const Strong = ({ children, ...props }: TypographyProps) => (
  <motion.strong
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-900/40 dark:to-yellow-800/40 px-1.5 py-0.5 rounded-md" {...props}
  >
    {children}
  </motion.strong>
)

export const Em = ({ children, ...props }: TypographyProps) => (
  <motion.em
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="italic text-purple-700 dark:text-purple-300 font-medium" {...props}
  >
    {children}
  </motion.em>
)
