"use client"

import { motion } from "framer-motion"
import RobotFriend from "@/components/ai/robot-friend"

export default function RobotFriendPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
        Your Robot Friend
      </h1>
      <RobotFriend />
    </motion.div>
  )
}
