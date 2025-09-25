"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, PieChart, LineChart, RefreshCw } from "lucide-react"

type DataPoint = {
  label: string
  value: number
  color: string
}

type DataSet = {
  title: string
  description: string
  data: DataPoint[]
  type: "bar" | "pie" | "line"
}

const dataSets: DataSet[] = [
  {
    title: "AI Applications by Industry",
    description: "How AI is being used across different industries",
    type: "bar",
    data: [
      { label: "Healthcare", value: 85, color: "rgb(59, 130, 246)" },
      { label: "Finance", value: 78, color: "rgb(16, 185, 129)" },
      { label: "Education", value: 65, color: "rgb(249, 115, 22)" },
      { label: "Transportation", value: 72, color: "rgb(139, 92, 246)" },
      { label: "Entertainment", value: 60, color: "rgb(236, 72, 153)" },
    ],
  },
  {
    title: "Types of AI Systems",
    description: "Distribution of different AI system types",
    type: "pie",
    data: [
      { label: "Machine Learning", value: 45, color: "rgb(59, 130, 246)" },
      { label: "Computer Vision", value: 25, color: "rgb(16, 185, 129)" },
      { label: "Natural Language", value: 20, color: "rgb(249, 115, 22)" },
      { label: "Robotics", value: 10, color: "rgb(139, 92, 246)" },
    ],
  },
  {
    title: "AI Progress Over Time",
    description: "How AI capabilities have improved",
    type: "line",
    data: [
      { label: "2000", value: 10, color: "rgb(59, 130, 246)" },
      { label: "2005", value: 20, color: "rgb(59, 130, 246)" },
      { label: "2010", value: 35, color: "rgb(59, 130, 246)" },
      { label: "2015", value: 55, color: "rgb(59, 130, 246)" },
      { label: "2020", value: 80, color: "rgb(59, 130, 246)" },
      { label: "2023", value: 95, color: "rgb(59, 130, 246)" },
    ],
  },
]

export default function DataVisualization() {
  const [currentDataSet, setCurrentDataSet] = useState<DataSet>(dataSets[0])
  const [isAnimating, setIsAnimating] = useState(true)

  const switchDataSet = (index: number) => {
    setIsAnimating(false)
    setTimeout(() => {
      setCurrentDataSet(dataSets[index])
      setIsAnimating(true)
    }, 300)
  }

  const getMaxValue = () => {
    return Math.max(...currentDataSet.data.map((d) => d.value)) * 1.1
  }

  const renderChart = () => {
    switch (currentDataSet.type) {
      case "bar":
        return (
          <div className="h-64 flex items-end justify-around p-4">
            {currentDataSet.data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isAnimating ? `${(item.value / getMaxValue()) * 100}%` : 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
                  className="w-12 rounded-t-md"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs mt-2 font-medium text-center">{item.label}</div>
              </div>
            ))}
          </div>
        )

      case "pie":
        const total = currentDataSet.data.reduce((sum, item) => sum + item.value, 0)
        let cumulativePercent = 0

        return (
          <div className="h-64 flex items-center justify-center p-4">
            <div className="relative w-40 h-40">
              {currentDataSet.data.map((item, index) => {
                const percent = (item.value / total) * 100
                const startPercent = cumulativePercent
                cumulativePercent += percent

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimating ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(${item.color} ${startPercent}%, ${item.color} ${cumulativePercent}%, transparent ${cumulativePercent}%, transparent 100%)`,
                      borderRadius: "50%",
                    }}
                  />
                )
              })}
            </div>
            <div className="ml-6 space-y-2">
              {currentDataSet.data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">
                    {item.label} ({Math.round((item.value / total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )

      case "line":
        return (
          <div className="h-64 flex items-end justify-around p-4 relative">
            {/* Y-axis */}
            <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between items-end pr-2">
              <span className="text-xs">100%</span>
              <span className="text-xs">75%</span>
              <span className="text-xs">50%</span>
              <span className="text-xs">25%</span>
              <span className="text-xs">0%</span>
            </div>

            {/* Chart area */}
            <div className="ml-10 flex-1 h-full relative">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-gray-200 w-full h-0"></div>
                ))}
              </div>

              {/* Data points and lines */}
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isAnimating ? 1 : 0,
                      opacity: isAnimating ? 1 : 0,
                    }}
                    transition={{ duration: 1.5, type: "spring" }}
                    d={`M ${currentDataSet.data
                      .map((d, i) => `${i * (100 / (currentDataSet.data.length - 1))} ${100 - d.value}`)
                      .join(" L ")}`}
                    fill="none"
                    stroke={currentDataSet.data[0].color}
                    strokeWidth="2"
                  />
                </svg>

                {currentDataSet.data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isAnimating ? 1 : 0,
                      y: isAnimating ? 0 : 20,
                    }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="absolute w-2 h-2 rounded-full bg-blue-500"
                    style={{
                      bottom: `${item.value}%`,
                      left: `${index * (100 / (currentDataSet.data.length - 1))}%`,
                      transform: "translate(-50%, 50%)",
                    }}
                  />
                ))}
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {currentDataSet.data.map((item, index) => (
                  <div key={index} className="text-xs -mb-6">
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h3 className="text-lg font-semibold">{currentDataSet.title}</h3>
        <p className="text-sm opacity-90">{currentDataSet.description}</p>
      </div>

      <div className="p-4">{renderChart()}</div>

      <div className="p-4 border-t flex justify-center space-x-2">
        <Button
          variant={currentDataSet.type === "bar" ? "default" : "outline"}
          size="sm"
          onClick={() => switchDataSet(0)}
          className="flex items-center"
        >
          <BarChart className="h-4 w-4 mr-1" />
          Bar
        </Button>
        <Button
          variant={currentDataSet.type === "pie" ? "default" : "outline"}
          size="sm"
          onClick={() => switchDataSet(1)}
          className="flex items-center"
        >
          <PieChart className="h-4 w-4 mr-1" />
          Pie
        </Button>
        <Button
          variant={currentDataSet.type === "line" ? "default" : "outline"}
          size="sm"
          onClick={() => switchDataSet(2)}
          className="flex items-center"
        >
          <LineChart className="h-4 w-4 mr-1" />
          Line
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsAnimating(false)
            setTimeout(() => setIsAnimating(true), 300)
          }}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Animate
        </Button>
      </div>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 absolute bottom-2 w-full">
        Information flows from left to right through the network
      </div>

      <div className="mt-4 text-sm dark:text-gray-300">
        <p className="font-medium">What&apos;s happening here?</p>
        <p className="mt-1">
          Just like your brain has billions of connected cells called neurons, neural networks have digital &quot;neurons&quot;
          arranged in layers. Each connection can become stronger or weaker as the network learns!
        </p>
      </div>
    </Card>
  )
}

