"use client"

import { motion } from "motion/react"

export const BasicsIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.rect
      x="2"
      y="18"
      width="20"
      height="4"
      rx="1"
      fill="currentColor"
      initial={{ y: 24 }}
      animate={{ y: 18 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    />
    <motion.rect
      x="4"
      y="12"
      width="16"
      height="4"
      rx="1"
      fill="currentColor"
      initial={{ y: 24 }}
      animate={{ y: 12 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    />
    <motion.rect
      x="6"
      y="6"
      width="12"
      height="4"
      rx="1"
      fill="currentColor"
      initial={{ y: 24 }}
      animate={{ y: 6 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    />
    <motion.rect
      x="8"
      y="2"
      width="8"
      height="2"
      rx="1"
      fill="currentColor"
      initial={{ y: 24 }}
      animate={{ y: 2 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    />
  </motion.svg>
)

export const FunctionsIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.path
      d="M3 12h18M12 3v18"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.path
      d="M3 18c3-6 6-6 9 0s6 6 9 0"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    />
    <motion.circle
      cx="6"
      cy="15"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8, duration: 0.3 }}
    />
    <motion.circle
      cx="18"
      cy="9"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
    />
  </motion.svg>
)

export const LimitsIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.circle
      cx="18"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    />
    <motion.path
      d="M3 12h12"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8 }}
    />
    <motion.path
      d="M12 8l3 4-3 4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    />
    <motion.circle
      cx="6"
      cy="12"
      r="1"
      fill="currentColor"
      animate={{ x: [0, 6, 0] }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    />
  </motion.svg>
)

export const DerivativesIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.path
      d="M3 20c3-8 6-8 9 0s6 8 9 0"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    <motion.line
      x1="8"
      y1="8"
      x2="16"
      y2="16"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    />
    <motion.circle
      cx="12"
      cy="12"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2, duration: 0.3 }}
    />
    <motion.path
      d="M10 10l4 4"
      stroke="white"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.5, duration: 0.3 }}
    />
  </motion.svg>
)

export const IntegralsIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.path
      d="M3 20h18M3 20V8c0-2 1-4 3-4s3 2 3 4v8"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.path
      d="M3 18c3-6 6-6 9 0"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    />
    <motion.path
      d="M3 18c3-6 6-6 9 0V20H3V18z"
      fill="currentColor"
      opacity="0.3"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      style={{ transformOrigin: "bottom" }}
    />
    <motion.text
      x="15"
      y="12"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.3 }}
    >
      ∫
    </motion.text>
  </motion.svg>
)

export const AdvancedIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.circle
      cx="12"
      cy="12"
      r="8"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    <motion.path
      d="M8 8l8 8M16 8l-8 8"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />
    <motion.circle
      cx="12"
      cy="12"
      r="3"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
    />
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      style={{ transformOrigin: "12px 12px" }}
    >
      <circle cx="12" cy="6" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="12" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="18" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="6" cy="12" r="1" fill="currentColor" opacity="0.6" />
    </motion.g>
  </motion.svg>
)

export const categoryIcons = {
  basics: BasicsIcon,
  functions: FunctionsIcon,
  limits: LimitsIcon,
  derivatives: DerivativesIcon,
  integrals: IntegralsIcon,
  advanced: AdvancedIcon,
}
