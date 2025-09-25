'use client'

import { motion } from 'motion/react'
import { Card } from '@/components/ui/card'
import { 
  BookOpen, 
  Brain, 
  Target, 
  Users, 
  Zap, 
  Trophy,
  Sparkles,
  Lightbulb
} from 'lucide-react'

const features = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Interactive Learning",
    description: "Engage with dynamic content that adapts to your learning style",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Smart Progress",
    description: "Track your learning journey with AI-powered insights",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Goal Setting",
    description: "Set and achieve your learning objectives with precision",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Learning",
    description: "Connect with fellow learners and share knowledge",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Quick Quizzes",
    description: "Test your knowledge with interactive assessments",
    color: "from-yellow-500 to-amber-500"
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Achievements",
    description: "Earn badges and rewards as you progress",
    color: "from-indigo-500 to-violet-500"
  }
]

export function FeatureShowcase() {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Why Choose HippoCampX?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground"
          >
            Experience learning like never before with our innovative features
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5" />
            <span>Ready to start your learning journey?</span>
            <Lightbulb className="w-5 h-5" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 