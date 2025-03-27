'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Brain, Code, Sparkles, Rocket } from 'lucide-react'
import Image from 'next/image'

const stories = [
  {
    title: "The Birth of Computing",
    icon: <Brain className="w-8 h-8" />,
    content: "Discover how computers evolved from simple calculators to powerful machines that can think and learn!",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "The Language of Computers",
    icon: <Code className="w-8 h-8" />,
    content: "Learn how computers communicate using binary code and why it's the foundation of all digital technology.",
    image: "https://images.unsplash.com/photo-1555066931-bf19f8e1083d?q=80&w=800&auto=format&fit=crop",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    title: "The Rise of AI",
    icon: <Sparkles className="w-8 h-8" />,
    content: "Explore how artificial intelligence is transforming our world and what the future holds for this exciting technology.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "The Future of Learning",
    icon: <Rocket className="w-8 h-8" />,
    content: "See how technology is revolutionizing education and making learning more engaging and accessible than ever.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    gradient: "from-amber-500 to-orange-500"
  }
]

export function StoryCarousel() {
  const [currentStory, setCurrentStory] = useState(0)

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length)
  }

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length)
  }

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
            Interactive Learning Stories
          </h2>
          <p className="text-xl text-muted-foreground">
            Embark on an educational journey through technology and innovation
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Card className="overflow-hidden">
                <div className="relative h-[400px] md:h-[500px]">
                  <Image
                    src={stories[currentStory].image}
                    alt={stories[currentStory].title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${stories[currentStory].gradient} opacity-20`} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    {stories[currentStory].icon}
                    <h3 className="text-2xl font-bold text-white">{stories[currentStory].title}</h3>
                  </div>
                  <p className="text-white/90">{stories[currentStory].content}</p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={prevStory}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={nextStory}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 