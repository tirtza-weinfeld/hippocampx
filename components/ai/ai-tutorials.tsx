"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Network, CheckCircle, ArrowRight, ArrowLeft, Lightbulb, Zap, Puzzle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
export default function AITutorials() {
  const [activeTab, setActiveTab] = useState("decision-trees")
  const [currentStep, setCurrentStep] = useState(1)
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([])

  const tutorials = [
    {
      id: "decision-trees",
      title: "Decision Trees",
      icon: <Puzzle className="h-5 w-5" />,
      description: "Learn how computers make decisions like a game of 20 questions!",
      color: "from-green-500 to-teal-500",
      steps: 5,
      difficulty: "Beginner",
    },
    {
      id: "neural-networks",
      title: "Neural Networks",
      icon: <Network className="h-5 w-5" />,
      description: "Discover how computers learn to recognize patterns like our brains!",
      color: "from-blue-500 to-purple-500",
      steps: 6,
      difficulty: "Intermediate",
    },
    {
      id: "reinforcement",
      title: "Reinforcement Learning",
      icon: <Zap className="h-5 w-5" />,
      description: "See how AI learns by trying things and getting rewards!",
      color: "from-orange-500 to-red-500",
      steps: 4,
      difficulty: "Intermediate",
    },
    {
      id: "clustering",
      title: "Clustering",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Learn how AI groups similar things together!",
      color: "from-purple-500 to-pink-500",
      steps: 3,
      difficulty: "Beginner",
    },
  ]

  const tutorialContent = {
    "decision-trees": [
      {
        title: "What is a Decision Tree?",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              A decision tree is like playing a game of 20 questions to figure something out!
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                How It Works
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Imagine you&apos;re trying to figure out what animal someone is thinking of. You might ask:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Does it have fur? (If yes, go down one path; if no, go down another)</li>
                <li>Does it have four legs? (Another decision point)</li>
                <li>Does it bark? (Another decision point)</li>
              </ul>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                By following these questions, you eventually reach an answer: &quot;It&apos;s a dog!&quot;
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Simple decision tree diagram showing yes/no questions leading to different outcomes"
                className="rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        ),
      },
      {
        title: "Let's Build a Simple Decision Tree",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Let&apos;s create a decision tree to classify fruits! We&apos;ll use questions to determine if a fruit is an apple,
              banana, or orange.
            </p>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Our Decision Tree:</h4>
              <div className="relative pl-6 border-l-2 border-green-500 dark:border-green-400 pb-2">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400"></div>
                <p className="font-medium text-green-700 dark:text-green-300">Is it yellow?</p>
                <div className="mt-2 ml-4">
                  <div className="relative pl-6 border-l-2 border-yellow-500 dark:border-yellow-400 pb-2">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                    <p className="font-medium text-yellow-700 dark:text-yellow-300">Yes → Is it long?</p>
                    <div className="mt-2 ml-4">
                      <div className="relative pl-6 border-l-2 border-yellow-500 dark:border-yellow-400 pb-2">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                        <p className="font-medium text-yellow-700 dark:text-yellow-300">Yes → It&apos;s a banana! 🍌</p>
                      </div>
                      <div className="relative pl-6 border-l-2 border-red-500 dark:border-red-400 pb-2 mt-2">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500 dark:bg-red-400"></div>
                        <p className="font-medium text-red-700 dark:text-red-300">No → Is it round?</p>
                        <div className="mt-2 ml-4">
                          <p className="font-medium text-orange-700 dark:text-orange-300">Yes → It&apos;s an orange! 🍊</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative pl-6 border-l-2 border-red-500 dark:border-red-400 pb-2 mt-2">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500 dark:bg-red-400"></div>
                    <p className="font-medium text-red-700 dark:text-red-300">No → Is it round?</p>
                    <div className="mt-2 ml-4">
                      <p className="font-medium text-red-700 dark:text-red-300">No → It&apos;s an apple! 🍎</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Try it yourself!</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Think about a yellow, round fruit. Follow the decision tree above to classify it. What does the tree say
                it is? (It should be an orange! 🍊)
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "How Computers Use Decision Trees",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Computers use decision trees to make predictions based on data. Let&apos;s see how a computer would learn a
              decision tree!
            </p>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">The Learning Process:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>The computer looks at lots of examples (like different fruits with their characteristics)</li>
                <li>It finds the best question to ask first (the one that helps separate the data the most)</li>
                <li>Then it finds the next best question for each branch</li>
                <li>It keeps going until it can classify everything correctly</li>
              </ol>
            </div>

            <div className="flex justify-center">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm max-w-md">
                <h4 className="font-medium text-center mb-3">Example Training Data</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2">Color</th>
                      <th className="text-left py-2">Shape</th>
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Fruit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2">Red</td>
                      <td className="py-2">Round</td>
                      <td className="py-2">Medium</td>
                      <td className="py-2">Apple</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2">Yellow</td>
                      <td className="py-2">Long</td>
                      <td className="py-2">Medium</td>
                      <td className="py-2">Banana</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2">Orange</td>
                      <td className="py-2">Round</td>
                      <td className="py-2">Medium</td>
                      <td className="py-2">Orange</td>
                    </tr>
                    <tr>
                      <td className="py-2">Green</td>
                      <td className="py-2">Round</td>
                      <td className="py-2">Small</td>
                      <td className="py-2">Grape</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              From this data, the computer would learn that &quot;Color&quot; is the most important feature to ask about first,
              followed by &quot;Shape&quot; for some branches.
            </p>
          </div>
        ),
      },
      {
        title: "Interactive Decision Tree Game",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Let&apos;s play a game! You&apos;ll be the decision tree, and you need to guess what animal I&apos;m thinking of by
              asking yes/no questions.
            </p>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-medium text-center mb-4 text-lg">Animal Guesser</h4>

              <div className="space-y-4">
                <p className="text-center text-gray-700 dark:text-gray-300">
                  I&apos;m thinking of an animal. Ask yes/no questions to figure it out!
                </p>

                <div className="flex flex-col items-center space-y-3">
                  <Button
                    onClick={() => {}}
                    className="w-full max-w-xs bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    aria-label="Ask if it has fur"
                  >
                    Does it have fur?
                  </Button>
                  <div className="text-green-600 dark:text-green-400 font-medium">Yes!</div>

                  <Button
                    onClick={() => {}}
                    className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    aria-label="Ask if it has four legs"
                  >
                    Does it have four legs?
                  </Button>
                  <div className="text-green-600 dark:text-green-400 font-medium">Yes!</div>

                  <Button
                    onClick={() => {}}
                    className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    aria-label="Ask if it barks"
                  >
                    Does it bark?
                  </Button>
                  <div className="text-green-600 dark:text-green-400 font-medium">Yes!</div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 w-full max-w-xs text-center">
                    <p className="font-bold text-green-700 dark:text-green-300">It&apos;s a dog! 🐕</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      You used a decision tree to figure it out!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Fun Fact!
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Decision trees are used in real life for things like diagnosing medical conditions, predicting weather,
                and recommending movies you might like!
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Build Your Own Decision Tree",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Now it&apos;s your turn to create a decision tree! Let&apos;s build one to help decide what to do on the weekend.
            </p>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-medium text-center mb-4 text-lg">Weekend Activity Planner</h4>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Here&apos;s a partially built decision tree. Can you think about what questions should go in the empty spots?
              </p>

              <div className="relative pl-6 border-l-2 border-blue-500 dark:border-blue-400 pb-2">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Is it raining?</p>
                <div className="mt-2 ml-4">
                  <div className="relative pl-6 border-l-2 border-blue-500 dark:border-blue-400 pb-2">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">Yes → Do you like museums?</p>
                    <div className="mt-2 ml-4">
                      <div className="relative pl-6 border-l-2 border-blue-500 dark:border-blue-400 pb-2">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">Yes → Visit a museum! 🏛️</p>
                      </div>
                      <div className="relative pl-6 border-l-2 border-red-500 dark:border-red-400 pb-2 mt-2">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500 dark:bg-red-400"></div>
                        <p className="font-medium text-red-700 dark:text-red-300">No → Watch a movie! 🎬</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative pl-6 border-l-2 border-green-500 dark:border-green-400 pb-2 mt-2">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <p className="font-medium text-green-700 dark:text-green-300">No → Do you like being active?</p>
                    <div className="mt-2 ml-4">
                      <div className="relative pl-6 border-l-2 border-green-500 dark:border-green-400 pb-2">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400"></div>
                        <p className="font-medium text-green-700 dark:text-green-300">Yes → Go hiking! 🥾</p>
                      </div>
                      <div className="relative pl-6 border-l-2 border-orange-500 dark:border-orange-400 pb-2 mt-2">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500 dark:bg-orange-400"></div>
                        <p className="font-medium text-orange-700 dark:text-orange-300">No → Have a picnic! 🧺</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Challenge:</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Try creating your own decision tree for choosing what to eat for dinner! Start with a question like &quot;Do
                you want something hot?&quot; and build from there.
              </p>
            </div>
          </div>
        ),
      },
    ],
    "neural-networks": [
      {
        title: "Introduction to Neural Networks",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Neural networks are computer systems inspired by the human brain. They&apos;re made up of connected &quot;neurons&quot;
              that work together to solve problems!
            </p>

            <div className="flex justify-center">
                <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Simple neural network diagram showing input, hidden, and output layers"
                className="rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                How Neural Networks Work
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Information enters through the <strong>input layer</strong> (like your eyes and ears)
                </li>
                <li>
                  It travels through <strong>hidden layers</strong> where processing happens (like your brain thinking)
                </li>
                <li>
                  Results come out through the <strong>output layer</strong> (like your decisions or actions)
                </li>
              </ol>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              Neural networks are especially good at recognizing patterns, like identifying pictures, understanding
              speech, or predicting what you might like!
            </p>
          </div>
        ),
      },
      // Add more steps for neural networks tutorial
    ],
    reinforcement: [
      {
        title: "What is Reinforcement Learning?",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Reinforcement learning is how AI learns by trying things and getting rewards or penalties - just like
              training a pet!
            </p>

            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Diagram showing the reinforcement learning cycle of action, environment, reward, and state"
                className="rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
              <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                How It Works
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>The AI (agent) observes its environment</li>
                <li>It takes an action</li>
                <li>It gets a reward or penalty based on that action</li>
                <li>It learns which actions lead to the most rewards</li>
                <li>Over time, it gets better at choosing the right actions!</li>
              </ol>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              This is how AI learns to play games, control robots, or even drive cars - by practicing and learning from
              experience!
            </p>
          </div>
        ),
      },
      // Add more steps for reinforcement learning tutorial
    ],
    clustering: [
      {
        title: "What is Clustering?",
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Clustering is how AI groups similar things together without being told how to do it. It&apos;s like sorting
              your toys by type without anyone telling you the categories!
            </p>

            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Diagram showing data points grouped into different clusters by similarity"
                className="rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                How It Works
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>The AI looks at many examples (like different animals)</li>
                <li>It figures out which ones are similar to each other</li>
                <li>It creates groups (clusters) based on these similarities</li>
                <li>New examples can then be assigned to the closest group</li>
              </ol>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              Clustering is used for things like grouping customers with similar shopping habits, finding patterns in
              health data, or organizing large collections of documents!
            </p>
          </div>
        ),
      },
      // Add more steps for clustering tutorial
    ],
  }

  const handleNextStep = () => {
    const maxSteps = tutorialContent[activeTab as keyof typeof tutorialContent].length
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mark tutorial as completed
      if (!completedTutorials.includes(activeTab)) {
        setCompletedTutorials([...completedTutorials, activeTab])
      }
      // Reset to step 1 for next tutorial
      setCurrentStep(1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTutorialChange = (tutorialId: string) => {
    setActiveTab(tutorialId)
    setCurrentStep(1)
  }

  const activeTutorial = tutorials.find((t) => t.id === activeTab) || tutorials[0]
  const currentTutorialContent = tutorialContent[activeTab as keyof typeof tutorialContent] || []
  const currentContent = currentTutorialContent[currentStep - 1] || currentTutorialContent[0]
  const isLastStep = currentStep === currentTutorialContent.length

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold gradient-text gradient-purple-blue">AI Tutorials & Games</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Learn how AI algorithms work through fun, interactive tutorials and games!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tutorials.map((tutorial) => (
          <motion.div key={tutorial.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card
              className={`cursor-pointer h-full border ${
                activeTab === tutorial.id
                  ? "border-blue-500 dark:border-blue-400 shadow-md"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleTutorialChange(tutorial.id)}
            >
              <CardHeader className={`bg-gradient-to-r ${tutorial.color} text-white pb-3`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    {tutorial.icon}
                    <span className="ml-2">{tutorial.title}</span>
                  </CardTitle>
                  {completedTutorials.includes(tutorial.id) && <CheckCircle className="h-5 w-5 text-white" />}
                </div>
                <CardDescription className="text-white/90 text-sm">
                  {tutorial.difficulty} • {tutorial.steps} steps
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 bg-white dark:bg-slate-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">{tutorial.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className={`bg-gradient-to-r ${activeTutorial.color} text-white`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              {activeTutorial.icon}
              <span className="ml-2">{activeTutorial.title}</span>
            </CardTitle>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Step {currentStep} of {currentTutorialContent.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-slate-800">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{currentContent.title}</h3>
            {currentContent.content}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center"
            aria-label="Go to previous step"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNextStep}
            className={`bg-gradient-to-r ${activeTutorial.color} hover:opacity-90 text-white`}
            aria-label={isLastStep ? "Complete tutorial" : "Go to next step"}
          >
            {isLastStep ? "Complete" : "Next"}
            {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
            {isLastStep && <CheckCircle className="h-4 w-4 ml-2" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
