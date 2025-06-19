"use client"

import { motion } from "framer-motion"

export const HorizontalRule = () => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="my-16 flex items-center justify-center"
  >
    <div className="relative w-full ">
      {/* Main gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      {/* Decorative elements */}
      {/* <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg" />
      </div> */}

      {/* Side decorations */}
      {/* <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
        <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      </div>
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      </div> */}
    </div>
  </motion.div>
)
