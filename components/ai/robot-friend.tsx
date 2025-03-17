"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Bot, Send, Trash, Sparkles, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SwipeContainer from "./swipe-container"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
}

export default function RobotFriend() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm your AI robot friend. What would you like to talk about?", sender: "bot" },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking and responding
    setTimeout(
      () => {
        const botResponse = generateBotResponse(input)
        const newBotMessage: Message = {
          id: messages.length + 2,
          text: botResponse,
          sender: "bot",
        }

        setMessages((prev) => [...prev, newBotMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const generateBotResponse = (userInput: string) => {
    const userInputLower = userInput.toLowerCase()

    // Simple pattern matching for responses
    if (userInputLower.includes("hello") || userInputLower.includes("hi")) {
      return "Hello there! How are you today?"
    } else if (userInputLower.includes("how are you")) {
      return "I'm just a simple program, but I'm working well! How about you?"
    } else if (userInputLower.includes("name")) {
      return "I'm RoboFriend, your AI buddy!"
    } else if (userInputLower.includes("ai") || userInputLower.includes("artificial intelligence")) {
      return "AI stands for Artificial Intelligence. It's about teaching computers to do tasks that normally require human intelligence!"
    } else if (userInputLower.includes("machine learning") || userInputLower.includes("ml")) {
      return "Machine Learning is how computers learn from examples instead of being explicitly programmed. It's a big part of AI!"
    } else if (userInputLower.includes("neural network")) {
      return "Neural networks are computer systems inspired by the human brain! They have layers of connected 'neurons' that process information and learn patterns."
    } else if (userInputLower.includes("generative ai")) {
      return "Generative AI is a type of AI that can create new content like images, text, or music. It learns patterns from examples and then creates new things that follow those patterns!"
    } else if (userInputLower.includes("robot")) {
      return "Robots are physical machines, while I'm just a software program. But we're both created by humans to be helpful!"
    } else if (userInputLower.includes("thank")) {
      return "You're welcome! I'm happy to help!"
    } else if (userInputLower.includes("bye") || userInputLower.includes("goodbye")) {
      return "Goodbye! Come back to chat anytime!"
    } else {
      const randomResponses = [
        "That's interesting! Tell me more.",
        "I'm still learning about that. Can you tell me something else?",
        "Cool! What else would you like to talk about?",
        "I'm not sure I understand that completely, but it sounds fascinating!",
        "That's a great point! What do you think about AI?",
      ]
      return randomResponses[Math.floor(Math.random() * randomResponses.length)]
    }
  }

  const clearChat = () => {
    setMessages([
      { id: 1, text: "Hi there! I'm your AI robot friend. What would you like to talk about?", sender: "bot" },
    ])
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) //Corrected dependency

  return (
    <SwipeContainer className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold gradient-text gradient-green-blue mb-4">Talk to an AI Robot Friend!</h2>
        <p className="text-lg dark:text-gray-300">
          This is a simple example of how AI can understand and respond to your messages. Try asking about AI, machine
          learning, neural networks, or generative AI!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="p-6 h-[500px] flex flex-col bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-100 dark:border-green-800 hover-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b dark:border-green-800/50">
            <div className="flex items-center">
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 5, duration: 1 }}
              >
                <Bot className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-3">
                <h3 className="font-bold text-green-700 dark:text-green-300">RoboFriend</h3>
                <p className="text-xs text-green-600 dark:text-green-400">AI Assistant</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              title="Clear chat"
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              aria-label="Clear chat history"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-sm"
                        : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-green-100 dark:border-green-800"
                    }`}
                  >
                    {message.sender === "bot" && <Bot className="h-4 w-4 inline-block mr-1 mb-1 text-green-500" />}
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-green-100 dark:border-green-800">
                    <div className="flex space-x-2 items-center">
                      <Bot className="h-4 w-4 text-green-500" />
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <motion.div
            className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="border-green-100 dark:border-green-800 focus-visible:ring-green-500 dark:bg-slate-700 dark:text-white"
              aria-label="Type your message"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.div
          className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 hover-card"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
            How This Chatbot Works
          </h3>
          <p className="mb-3 dark:text-gray-300">
            This simple chatbot uses pattern matching to respond to your messages. Real AI assistants use much more
            advanced techniques called Large Language Models (LLMs) that can understand and generate human-like text.
          </p>
          <p className="dark:text-gray-300">
            Try asking about AI, machine learning, neural networks, or generative AI to see how it responds!
          </p>
        </motion.div>

        <motion.div
          className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 hover-card"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
            Real AI Assistants
          </h3>
          <p className="dark:text-gray-300">
            Modern AI assistants can have much more natural conversations, remember what you&apos;ve said before, help with
            homework, write stories, explain complex topics, and even help you learn new things! They use advanced AI
            models trained on billions of examples of human language.
          </p>
        </motion.div>
      </motion.div>
    </SwipeContainer>
  )
}

