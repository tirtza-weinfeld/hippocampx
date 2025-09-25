'use client'

import { motion } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, FunctionSquare, ArrowRight } from 'lucide-react'

const mathConcepts = [
  {
    title: "Calculus Fundamentals",
    icon: <Calculator className="w-8 h-8" />,
    description: "Explore the basics of calculus through interactive visualizations and real-world applications.",
    gradient: "from-blue-500 to-indigo-500",
    concepts: [
      {
        name: "Derivatives",
        description: "Learn how rates of change help us understand motion and growth.",
        animation: () => (
          <motion.div
            className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      },
      {
        name: "Integrals",
        description: "Discover how to find areas and accumulate quantities over time.",
        animation: () => (
          <motion.div
            className="w-full h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      }
    ]
  },
  {
    title: "Algebra Essentials",
    icon: <FunctionSquare className="w-8 h-8" />,
    description: "Master the building blocks of algebra with interactive examples and practice problems.",
    gradient: "from-violet-500 to-purple-500",
    concepts: [
      {
        name: "Quadratic Functions",
        description: "Understand the properties and applications of quadratic equations.",
        animation: () => (
          <motion.div
            className="w-full h-32 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      },
      {
        name: "Linear Functions",
        description: "Explore the relationship between variables in linear equations.",
        animation: () => (
          <motion.div
            className="w-full h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      }
    ]
  }
]

export function MathConcepts() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Interactive Math Concepts
          </h2>
          <p className="text-xl text-muted-foreground">
            Explore mathematical concepts through engaging visualizations and interactive examples
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mathConcepts.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.gradient}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                <div className="space-y-4">
                  {category.concepts.map((concept, conceptIndex) => (
                    <motion.div
                      key={concept.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: conceptIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg"
                    >
                      <h4 className="font-semibold mb-2">{concept.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{concept.description}</p>
                      <concept.animation />
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 