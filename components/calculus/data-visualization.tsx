"use client"

import { useRef } from "react"
import { motion } from "motion/react"

type ChartData = {
  name: string
  value: number
}

export function BarChart({ data }: { data: ChartData[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="h-64 flex items-end gap-4 p-4 bg-muted/50 rounded-lg">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100

        return (
          <div key={item.name} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className={`w-full rounded-t-lg ${index === 0 ? "bg-violet-500" : "bg-amber-500"}`}
              style={{ height: `${height}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
            <div className="text-xs font-medium">{item.name}</div>
            <div className="text-sm font-bold">{item.value}</div>
          </div>
        )
      })}
    </div>
  )
}

export function PieChart({ data }: { data: ChartData[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1

  // Calculate pie slices using reduce to avoid variable reassignment
  const slices = data.reduce<{
    slices: Array<{
      path: string
      color: string
      percentage: number
      startAngle: number
      endAngle: number
      name: string
      value: number
    }>
    currentAngle: number
  }>(
    (acc, item, index) => {
      const percentage = item.value / total
      const angle = percentage * 360
      const startAngle = acc.currentAngle
      const endAngle = startAngle + angle

      // Calculate SVG arc path
      const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180)
      const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180)
      const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180)
      const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180)

      const largeArcFlag = angle > 180 ? 1 : 0

      const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

      const slice = {
        path: pathData,
        color: index === 0 ? "#8B5CF6" : "#F59E0B", // violet-500 or amber-500
        percentage,
        startAngle,
        endAngle,
        name: item.name,
        value: item.value,
      }

      return {
        slices: [...acc.slices, slice],
        currentAngle: endAngle,
      }
    },
    { slices: [], currentAngle: 0 }
  ).slices

  return (
    <div className="h-64 flex items-center justify-center p-4 bg-muted/50 rounded-lg">
      <div className="relative">
        <svg ref={svgRef} width="200" height="200" viewBox="0 0 200 200">
          {slices.map((slice, index) => (
            <motion.path
              key={slice.name}
              d={slice.path}
              fill={slice.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}
          <circle cx="100" cy="100" r="40" fill="var(--background)" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-xl font-bold">{total}</div>
          </div>
        </div>
      </div>

      <div className="ml-4 space-y-2">
        {slices.map((slice) => (
          <div key={slice.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
            <div className="text-xs">
              {slice.name}: {(slice.percentage * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

