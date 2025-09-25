'use client'

import { motion, useAnimation, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Brain, BookOpen, Target, Award } from 'lucide-react'

const stats = [
  {
    icon: <Brain className="w-8 h-8" />,
    label: "Interactive Learning",
    value: "Engaging",
    color: "from-violet-500 to-indigo-500"
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    label: "Educational Content",
    value: "Comprehensive",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Target className="w-8 h-8" />,
    label: "Learning Goals",
    value: "Achievable",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Award className="w-8 h-8" />,
    label: "Progress Tracking",
    value: "Personalized",
    color: "from-amber-500 to-orange-500"
  }
]

function AnimatedValue({ value }: { value: string }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
      })
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={controls}
      className="text-2xl font-bold bg-clip-text text-transparent"
    >
      {value}
    </motion.div>
  )
}

export function AnimatedStats() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="mb-4 text-primary mx-auto w-fit">
                    {stat.icon}
                  </div>
                  <AnimatedValue value={stat.value} />
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full">
            <span>Start your learning journey today!</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 