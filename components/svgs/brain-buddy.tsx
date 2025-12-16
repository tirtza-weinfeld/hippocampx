"use client"

import { motion } from "motion/react"

type BrainBuddyProps = {
  readonly size?: number
  readonly isActive?: boolean
}

export function BrainBuddy({ size = 32, isActive = false }: BrainBuddyProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        rotate: isActive ? [0, -5, 5, -3, 0] : 0,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {/* Node decorations with lines */}
      <g opacity="0.85">
        {/* Teal node - top left */}
        <line x1="14" y1="16" x2="20" y2="22" className="stroke-buddy-node-teal" strokeWidth="1.5" />
        <circle cx="12" cy="14" r="3" className="fill-buddy-node-teal" />
        <circle cx="12" cy="14" r="4" className="stroke-buddy-node-teal" strokeWidth="1" fill="none" />

        {/* Purple node - top left inner */}
        <line x1="18" y1="10" x2="22" y2="16" className="stroke-buddy-node-purple" strokeWidth="1.5" />
        <circle cx="17" cy="8" r="2.5" className="fill-buddy-node-purple" />
        <circle cx="17" cy="8" r="3.5" className="stroke-buddy-node-purple" strokeWidth="1" fill="none" />

        {/* Purple node - top right */}
        <line x1="50" y1="16" x2="44" y2="22" className="stroke-buddy-node-purple" strokeWidth="1.5" />
        <circle cx="52" cy="14" r="3" className="fill-buddy-node-purple" />
        <circle cx="52" cy="14" r="4" className="stroke-buddy-node-purple" strokeWidth="1" fill="none" />

        {/* Pink node - right */}
        <line x1="54" y1="32" x2="48" y2="34" className="stroke-buddy-node-pink" strokeWidth="1.5" />
        <circle cx="56" cy="31" r="2.5" className="fill-buddy-node-pink" />
        <circle cx="56" cy="31" r="3.5" className="stroke-buddy-node-pink" strokeWidth="1" fill="none" />

        {/* Orange node - left */}
        <line x1="10" y1="32" x2="16" y2="34" className="stroke-buddy-node-orange" strokeWidth="1.5" />
        <circle cx="8" cy="31" r="2.5" className="fill-buddy-node-orange" />
        <circle cx="8" cy="31" r="3.5" className="stroke-buddy-node-orange" strokeWidth="1" fill="none" />

        {/* Small white dots */}
        <circle cx="8" cy="20" r="1.5" fill="white" opacity="0.9" />
        <circle cx="56" cy="22" r="1.5" fill="white" opacity="0.9" />
        <circle cx="22" cy="6" r="1" fill="white" opacity="0.7" />
        <circle cx="44" cy="8" r="1.2" fill="white" opacity="0.7" />
      </g>

      {/* Body outline (sticker effect) */}
      <ellipse cx="32" cy="42" rx="18" ry="14" className="stroke-buddy-glasses" strokeWidth="2" fill="white" fillOpacity="0.15" />

      {/* Feet */}
      <ellipse cx="23" cy="54" rx="5" ry="3" className="fill-buddy-body stroke-buddy-glasses" strokeWidth="1.5" />
      <ellipse cx="41" cy="54" rx="5" ry="3" className="fill-buddy-body stroke-buddy-glasses" strokeWidth="1.5" />

      {/* Body */}
      <ellipse cx="32" cy="42" rx="16" ry="12" className="fill-buddy-body stroke-buddy-glasses" strokeWidth="2" />

      {/* Body highlight */}
      <ellipse cx="24" cy="38" rx="5" ry="3" fill="white" opacity="0.35" />

      {/* Small hands */}
      <ellipse cx="14" cy="40" rx="4" ry="5" className="fill-buddy-body stroke-buddy-glasses" strokeWidth="1.5" />
      <ellipse cx="50" cy="40" rx="4" ry="5" className="fill-buddy-body stroke-buddy-glasses" strokeWidth="1.5" />

      {/* Brain base */}
      <ellipse cx="32" cy="24" rx="13" ry="9" className="fill-buddy-brain stroke-buddy-glasses" strokeWidth="2" />

      {/* Brain lobes */}
      <circle cx="21" cy="20" r="6" className="fill-buddy-brain stroke-buddy-glasses" strokeWidth="1.5" />
      <circle cx="32" cy="17" r="7" className="fill-buddy-brain stroke-buddy-glasses" strokeWidth="1.5" />
      <circle cx="43" cy="20" r="6" className="fill-buddy-brain stroke-buddy-glasses" strokeWidth="1.5" />
      <circle cx="26" cy="14" r="4" className="fill-buddy-brain stroke-buddy-glasses" strokeWidth="1" />
      <circle cx="38" cy="14" r="4" className="fill-buddy-brain stroke-buddy-glasses" strokeWidth="1" />

      {/* Brain folds */}
      <path
        d="M22 22c2-3 4-3 6 0M30 18c2-2 4-2 6 0M38 22c2-3 4-3 6 0"
        className="stroke-buddy-glasses"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Brain highlights */}
      <circle cx="24" cy="16" r="2" fill="white" opacity="0.5" />
      <circle cx="34" cy="13" r="1.5" fill="white" opacity="0.4" />
      <circle cx="40" cy="17" r="1.5" fill="white" opacity="0.4" />

      {/* Eyes - white background */}
      <ellipse cx="25" cy="38" rx="7" ry="8" fill="white" className="stroke-buddy-glasses" strokeWidth="2" />
      <ellipse cx="39" cy="38" rx="7" ry="8" fill="white" className="stroke-buddy-glasses" strokeWidth="2" />

      {/* Glasses frame */}
      <circle cx="25" cy="38" r="9" className="stroke-buddy-glasses" strokeWidth="2.5" fill="none" />
      <circle cx="39" cy="38" r="9" className="stroke-buddy-glasses" strokeWidth="2.5" fill="none" />
      <path d="M34 36h-4" className="stroke-buddy-glasses" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 35l-3-2" className="stroke-buddy-glasses" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 35l3-2" className="stroke-buddy-glasses" strokeWidth="2" strokeLinecap="round" />

      {/* Pupils */}
      <circle cx="26" cy="39" r="4" className="fill-buddy-eye" />
      <circle cx="40" cy="39" r="4" className="fill-buddy-eye" />

      {/* Eye highlights */}
      <circle cx="24" cy="37" r="2" fill="white" />
      <circle cx="38" cy="37" r="2" fill="white" />
      <circle cx="27" cy="41" r="1" fill="white" opacity="0.7" />
      <circle cx="41" cy="41" r="1" fill="white" opacity="0.7" />

      {/* Open mouth */}
      <path
        d="M24 49 Q32 58 40 49 Q36 52 32 52 Q28 52 24 49Z"
        className="fill-buddy-eye stroke-buddy-glasses"
        strokeWidth="2"
      />

      {/* Tongue */}
      <ellipse cx="32" cy="52" rx="4" ry="2.5" className="fill-buddy-tongue" />

      {/* Blush */}
      <ellipse cx="15" cy="44" rx="3.5" ry="2" className="fill-buddy-blush" opacity="0.6" />
      <ellipse cx="49" cy="44" rx="3.5" ry="2" className="fill-buddy-blush" opacity="0.6" />

      {/* Motion lines */}
      <g opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="18" y1="60" x2="26" y2="60" />
        <line x1="38" y1="60" x2="46" y2="60" />
        <line x1="26" y1="62" x2="38" y2="62" />
      </g>
    </motion.svg>
  )
}
