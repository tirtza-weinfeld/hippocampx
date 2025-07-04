"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { getStepColor, getStepGradient, getColorText, getColorGradient, isValidColorName } from "@/lib/step-colors"
import { cn } from "@/lib/utils"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },

}

interface TypographyProps {
  children: ReactNode
}

export const H1 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp}

    className="relative mb-12 mt-16 first:mt-2 group  " {...props}>


    <h1 className="text-4xl md:text-5xl font-extrabold   text-center
     tracking-tight leading-tight   " {...props}>
      {/* <span className="bg-gradient-to-l from-teal-600 via-sky-600/80 via-80% to-blue-600/80 bg-clip-text text-transparent font-bold "> */}
      <span className="text-teal-600 dark:text-teal-700">
        {children}

      </span>

    </h1>
  </motion.div>
)

export const H2 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-8 mt-12  " {...props}>
    <div className="absolute -left-3 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-sky-500
     via-teal-500/80 rounded-full" />
    <h2 className="text-3xl md:text-4xl  font-black tracking-tight leading-tight" {...props}>
      <span className="text-teal-500 dark:text-teal-800">
        {children}
      </span>
    </h2>


  </motion.div>
)
export const H3 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-6 mt-10 ">
      <div className="w-3 h-1 bg-linear-to-r from-blue-700 to-sky-500 rounded-sm absolute -left-4 top-1/2 
      hover:bg-linear-to-l transition-all duration-300  "/>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </h3>
  </motion.div>
)

export const H4 = ({ children, ...props }: TypographyProps) => (
  <motion.div {...fadeInUp} className="relative mb-4 mt-8" {...props}>
    <div className="flex items-center gap-2">
      {/* <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" /> */}
      <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </h4>
    </div>
  </motion.div>
)

export const H5 = ({ children, ...props }: TypographyProps) => (
  <motion.h5
    {...fadeInUp}
    className="text-lg md:text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 mb-3 mt-6 border-l-2 border-blue-500 pl-3" {...props}

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
    className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-none
    
    
    " {...props}
  >
    {children}
  </motion.p>
)

// bg-gradient-to-r 

// from-pink-500 to-purple-600
// dark:from-pink-400 dark:to-purple-500
// via-pink-700 dark:via-pink-400
// bg-clip-text text-transparent
export const Strong = ({ children, ...props }: TypographyProps) => {
  const text = children as string;
  
  // Check for step highlighting syntax: [step:]text or [color:]text
  const stepMatch = typeof text === 'string' ? text.match(/^\[([^:\]]+):\](.+)$/) : null;
  
  if (stepMatch) {
    const [, stepOrColor, content] = stepMatch;
    
    let stepColorClass: string;
    let shadowColorClass: string;
    
    // Check if it's a number (step) or color name
    if (/^\d+$/.test(stepOrColor)) {
      // It's a numbered step
      const stepNumber = parseInt(stepOrColor, 10);
      stepColorClass = getStepColor(stepNumber);
      // Extract color name for shadow
      const colorName = stepColorClass.match(/text-(\w+)-/)?.[1] || 'sky';
      shadowColorClass = `shadow-${colorName}-400/15 dark:shadow-${colorName}-300/15`;
    } else if (isValidColorName(stepOrColor)) {
      // It's a color name
      stepColorClass = getColorText(stepOrColor);
      shadowColorClass = `shadow-${stepOrColor}-400/15 dark:shadow-${stepOrColor}-300/15`;
    } else {
      // Invalid, fallback to default
      return (
        <motion.strong
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-semibold shadow-sm shadow-sky-400/15 dark:shadow-sky-300/15 text-sky-600/80 dark:text-sky-300/80 px-1.5 py-0.5 rounded-md"
          {...props}
        >
          {children}
        </motion.strong>
      );
    }
    
    return (
      <motion.strong
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "font-semibold shadow-sm",
          stepColorClass,
          shadowColorClass,
          "px-1.5 py-0.5 rounded-md"
        )}
        {...props}
      >
        {content.trim()}
      </motion.strong>
    );
  }

  return (
    <motion.strong
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
        font-semibold
   
        shadow-sm
        shadow-sky-400/15
        dark:shadow-sky-300/15

        text-sky-600/80 dark:text-sky-300/80

     
        px-1.5 py-0.5 rounded-md

      " {...props}
    >
      {children}
    </motion.strong>
  )
}

export const Em = ({ children, ...props }: TypographyProps) => {
  const text = children as string;
  
  // Check for step highlighting syntax: [step:]text or [color:]text
  const stepMatch = typeof text === 'string' ? text.match(/^\[([^:\]]+):\](.+)$/) : null;
  
  if (stepMatch) {
    const [, stepOrColor, content] = stepMatch;
    
    let stepGradientClass: string;
    
    // Check if it's a number (step) or color name
    if (/^\d+$/.test(stepOrColor)) {
      // It's a numbered step
      const stepNumber = parseInt(stepOrColor, 10);
      stepGradientClass = getStepGradient(stepNumber);
    } else if (isValidColorName(stepOrColor)) {
      // It's a color name
      stepGradientClass = getColorGradient(stepOrColor);
    } else {
      // Invalid, fallback to default
      return (
        <motion.em
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="italic bg-linear-to-r from-sky-500 to-teal-600 via-sky-800 dark:from-sky-200 dark:to-teal-200 dark:via-sky-200 bg-clip-text text-transparent px-1.5 py-0.5 rounded-sm"
          {...props}
        >
          {children}
        </motion.em>
      );
    }
    
    return (
      <motion.em
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "italic bg-linear-to-r",
          stepGradientClass,
          "bg-clip-text text-transparent px-1.5 py-0.5 rounded-sm"
        )}
        {...props}
      >
        {content.trim()}
      </motion.em>
    );
  }

  return (
    <motion.em
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="italic 
      bg-linear-to-r 

      from-sky-500 to-teal-600 via-sky-800

      dark:from-sky-200 dark:to-teal-200 dark:via-sky-200

      bg-clip-text text-transparent
        px-1.5 py-0.5 rounded-sm
      " {...props}
    >
      {children}
    </motion.em>
  )
}
