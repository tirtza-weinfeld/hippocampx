"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIExplorer from "@/components/ai/ai-explorer"
import MLTrainer from "@/components/ai/ml-trainer"
import RobotFriend from "@/components/ai/robot-friend"
import AIQuiz from "@/components/ai/ai-quiz"
import AdvancedConcepts from "@/components/ai/advanced-concepts"
import MobileNav from "@/components/ai/mobile-nav"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeTab, setActiveTab] = useState("what-is-ai")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setMobileMenuOpen(false)
  }

  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 py-6 relative">
      
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
            AI & ML for Kids!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Discover the amazing world of Artificial Intelligence and Machine Learning through fun, interactive
            examples!
          </p>
        </header>

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 z-50 mb-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg shadow-md p-3">
            <span className="font-bold text-lg gradient-text gradient-purple-blue">
              {activeTab === "what-is-ai"
                ? "What is AI?"
                : activeTab === "train-ml"
                  ? "Train ML"
                  : activeTab === "advanced"
                    ? "Advanced AI"
                    : activeTab === "robot-friend"
                      ? "Robot Friend"
                      : "Fun Quiz"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <MobileNav
            isOpen={mobileMenuOpen}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Desktop Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-5 mb-6 sticky top-4 z-50 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-1 h-13
          [&>*]:h-11
          [&>*]:rounded-full
          [&>*]:cursor-pointer
          ">
            <TabsTrigger 
              value="what-is-ai"
              className=" data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 
              data-[state=active]:text-white transition-all duration-300"
              aria-label="What is AI section"
            >
              What is AI?
            </TabsTrigger>
            <TabsTrigger
              value="train-ml"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
              aria-label="Train ML section"
            >
              Train ML
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              aria-label="Advanced AI section"
            >
              Advanced AI
            </TabsTrigger>
            <TabsTrigger
              value="robot-friend"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300"
              aria-label="Robot Friend section"
            >
              Robot Friend
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300"
              aria-label="Fun Quiz section"
            >
              Fun Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="what-is-ai"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-4 animate-fade-in"
          >
            <AIExplorer />
          </TabsContent>
          <TabsContent
            value="train-ml"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-4 animate-fade-in"
          >
            <MLTrainer />
          </TabsContent>
          <TabsContent
            value="advanced"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-4 animate-fade-in"
          >
            <AdvancedConcepts />
          </TabsContent>
          <TabsContent
            value="robot-friend"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-4 animate-fade-in"
          >
            <RobotFriend />
          </TabsContent>
          <TabsContent
            value="quiz"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-4 animate-fade-in"
          >
            <AIQuiz />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

