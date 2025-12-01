"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Layers, ActivityIcon, PlayCircle, ArrowDownUp, Brain, History, LineChart } from "lucide-react"
import { PageTransition } from "@/components/old/calculus/page-transition"
import type { Route } from "next"

export default function GamesPage() {
  const games = [
    {
      title: "Slope Racer",
      description: "Race against time by finding the correct slopes of curves and tangent lines.",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/old/calculus/games/slope-racer" as Route,
      color: "from-blue-500 to-sky-400",
      image: "/calculus/games/slope-racer.png",
      // age: "Ages 10-14",
    },
    {
      title: "Area Builder",
      description: "Build shapes and calculate their areas using the power of integration.",
      icon: <Layers className="h-6 w-6" />,
      href: "/old/calculus/games/area-builder" as Route,
      color: "from-green-500 to-emerald-400",
      image: "/calculus/games/area-builder.png",
      // age: "Ages 9-12",
    },
    {
      title: "Function Transformer",
      description: "Transform functions and predict how their graphs will change.",
      icon: <ActivityIcon className="h-6 w-6" />,
      href: "/old/calculus/games/function-transformer" as Route,
      color: "from-indigo-500 to-violet-400",
      image: "/calculus/games/function-transformer.png",
      // age: "Ages 8-12",
    },
    {
      title: "Limit Explorer",
      description: "Guide your character as close as possible to the boundary without crossing it.",
      icon: <ArrowDownUp className="h-6 w-6" />,
      href: "/old/calculus/games/limit-explorer" as Route,
      color: "from-purple-500 to-blue-400",
      image: "/calculus/games/limit-explorer.png",
      // age: "Ages 10-14",
    },
    {
      title: "Calculus Puzzles",
      description: "Solve fun puzzles that test your understanding of calculus concepts.",
      icon: <Brain className="h-6 w-6" />,
      href: "/old/calculus/games/calculus-puzzles" as Route,
      color: "from-pink-500 to-rose-400",
      image: "/calculus/games/calculus-puzzles.png",
      // age: "Ages 11-14",
    },
    {
      title: "Rate Master",
      description: "Master rates of change by predicting how fast objects move and grow.",
      icon: <PlayCircle className="h-6 w-6" />,
      href: "/old/calculus/games/rate-master" as Route,
      color: "from-amber-500 to-orange-400",
      image: "/calculus/games/rate-master.png",
      // age: "Ages 9-13",
    },  
    {
      title: "Graph Creator",
      description: "Create, visualize, and explore mathematical functions and their properties.",
      icon: <LineChart className="h-6 w-6" />,
      href: "/old/calculus/games/graph-creator" as Route,
      color: "from-cyan-500 to-blue-400",
      image: "/calculus/games/function-transformer.png", // Reusing an image temporarily
      // age: "Ages 12-16",
    },
    {
      title: "Calculus Legends",
      description: "Test your knowledge about the brilliant minds behind calculus in this fun trivia game.",
      icon: <History className="h-6 w-6" />,
      href: "/old/calculus/games/calculus-legends" as Route,
      color: "from-amber-600 to-red-500",
      // age: "Ages 10-15",
    },
  ]

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 text-transparent bg-clip-text">
            Calculus Games
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Have fun while learning calculus concepts with these interactive games
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {games.map((game) => (
            <Card
              key={game.title}
              className="border-2 border-border overflow-hidden transition-all hover:shadow-lg bg-background/60 backdrop-blur-sm"
            >
              <div className="aspect-video w-full overflow-hidden relative">
                {game.title === "Slope Racer" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="slopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className="stop-color-blue-500 dark:stop-color-blue-600" stopOpacity="0.8" />
                        <stop offset="100%" className="stop-color-sky-500 dark:stop-color-sky-600" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="slopeGlow" height="130%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                          result="glow"
                        />
                        <feComposite in="SourceGraphic" in2="glow" operator="over" />
                      </filter>
                    </defs>
                    <rect width="400" height="225" className="fill-blue-500/90 dark:fill-blue-700/90" />
                    <path
                      d="M 50,180 Q 150,20 350,120"
                      className="stroke-white"
                      strokeWidth="3"
                      fill="none"
                      filter="url(#slopeGlow)"
                    />
                    <line
                      x1="200"
                      y1="70"
                      x2="300"
                      y2="120"
                      className="stroke-white/80"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <circle cx="200" cy="70" r="8" className="fill-white" />
                    <polygon points="290,110 310,120 290,130" className="fill-white" />
                    <text x="150" y="40" fontFamily="sans-serif" fontSize="16" className="fill-white font-bold">
                      Slope = 0.5
                    </text>
                    <g transform="translate(320, 180)">
                      <path d="M-15,-15 L15,15 M-15,15 L15,-15" className="stroke-white" strokeWidth="3" />
                    </g>
                    <g transform="translate(70, 50)">
                      <circle cx="0" cy="0" r="15" className="fill-white/70" />
                      <text
                        x="0"
                        y="5"
                        fontFamily="sans-serif"
                        fontSize="18"
                        className="fill-blue-500 dark:fill-blue-700"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        f&apos;
                      </text>
                    </g>
                  </svg>
                )}

                {game.title === "Area Builder" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          className="stop-color-green-500 dark:stop-color-green-600"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="100%"
                          className="stop-color-emerald-500 dark:stop-color-emerald-600"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="225" className="fill-green-500/90 dark:fill-green-700/90" />
                    <path
                      d="M 50,180 Q 100,100 150,120 Q 200,140 250,80 Q 300,20 350,50"
                      className="stroke-white"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M 50,180 Q 100,100 150,120 Q 200,140 250,80 Q 300,20 350,50 L 350,180 L 50,180 Z"
                      className="fill-white/30"
                    />
                    <rect x="50" y="120" width="60" height="60" className="fill-white/30 stroke-white" />
                    <rect x="110" y="120" width="60" height="60" className="fill-white/30 stroke-white" />
                    <rect x="170" y="100" width="60" height="80" className="fill-white/30 stroke-white" />
                    <rect x="230" y="80" width="60" height="100" className="fill-white/30 stroke-white" />
                    <rect x="290" y="60" width="60" height="120" className="fill-white/30 stroke-white" />
                    <text
                      x="200"
                      y="210"
                      fontFamily="sans-serif"
                      fontSize="16"
                      className="fill-white font-bold"
                      textAnchor="middle"
                    >
                      ∫ f(x) dx
                    </text>
                    <g transform="translate(30, 50)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="24" className="fill-white font-bold">
                        ∫
                      </text>
                    </g>
                  </svg>
                )}

                {game.title === "Function Transformer" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="functionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          className="stop-color-indigo-500 dark:stop-color-indigo-600"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="100%"
                          className="stop-color-violet-500 dark:stop-color-violet-600"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="225" className="fill-indigo-500/90 dark:fill-indigo-700/90" />
                    <line
                      x1="50"
                      y1="112.5"
                      x2="350"
                      y2="112.5"
                      className="stroke-white/50"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="200"
                      y1="30"
                      x2="200"
                      y2="195"
                      className="stroke-white/50"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 50,112.5 Q 125,50 200,112.5 Q 275,175 350,112.5"
                      className="stroke-white"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="3,3"
                    />
                    <path
                      d="M 50,150 Q 125,87.5 200,150 Q 275,212.5 350,150"
                      className="stroke-white"
                      strokeWidth="3"
                      fill="none"
                    />
                    <g transform="translate(200, 70)">
                      <path d="M0,0 L0,30" className="stroke-white" strokeWidth="2" markerEnd="url(#arrowhead)" />
                      <polygon points="-5,25 0,35 5,25" className="fill-white" />
                    </g>
                    <g transform="translate(125, 40)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="14" className="fill-white font-bold">
                        f(x) = sin(x)
                      </text>
                    </g>
                    <g transform="translate(125, 190)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="14" className="fill-white font-bold">
                        g(x) = sin(x) + 2
                      </text>
                    </g>
                    <circle cx="200" cy="112.5" r="5" className="fill-white" />
                    <circle cx="200" cy="150" r="5" className="fill-white" />
                  </svg>
                )}

                {game.title === "Limit Explorer" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="limitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          className="stop-color-purple-500 dark:stop-color-purple-600"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="100%"
                          className="stop-color-blue-500 dark:stop-color-blue-600"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                      <filter id="limitGlow" height="130%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                          result="glow"
                        />
                        <feComposite in="SourceGraphic" in2="glow" operator="over" />
                      </filter>
                    </defs>
                    <rect width="400" height="225" className="fill-purple-500/90 dark:fill-purple-700/90" />
                    <line x1="50" y1="180" x2="350" y2="180" className="stroke-white" strokeWidth="2" />
                    <line
                      x1="200"
                      y1="30"
                      x2="200"
                      y2="180"
                      className="stroke-white"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 50,150 L 190,60 M 210,60 L 350,150"
                      className="stroke-white"
                      strokeWidth="3"
                      fill="none"
                      filter="url(#limitGlow)"
                    />
                    <circle cx="200" cy="60" r="15" className="fill-white/20 stroke-white" strokeWidth="2" />
                    <circle cx="200" cy="60" r="5" className="fill-white" />
                    <g transform="translate(150, 30)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="16" className="fill-white font-bold">
                        lim f(x)
                      </text>
                      <text x="50" y="15" fontFamily="sans-serif" fontSize="12" className="fill-white">
                        x→c
                      </text>
                    </g>
                    <g transform="translate(170, 100)">
                      <path d="M-10,0 L10,0 M0,-10 L0,10" className="stroke-white" strokeWidth="2" />
                      <text x="15" y="5" fontFamily="sans-serif" fontSize="16" className="fill-white font-bold">
                        c
                      </text>
                    </g>
                    <g transform="translate(100, 120)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="14" className="fill-white">
                        x → c⁻
                      </text>
                      <path d="M60,-10 L80,10" className="stroke-white" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                    </g>
                    <g transform="translate(240, 120)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="14" className="fill-white">
                        x → c⁺
                      </text>
                      <path
                        d="M-60,-10 L-80,10"
                        className="stroke-white"
                        strokeWidth="1.5"
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  </svg>
                )}

                {game.title === "Calculus Puzzles" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="puzzleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className="stop-color-pink-500 dark:stop-color-pink-600" stopOpacity="0.8" />
                        <stop
                          offset="100%"
                          className="stop-color-rose-500 dark:stop-color-rose-600"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="225" className="fill-pink-500/90 dark:fill-pink-700/90" />
                    <rect
                      x="100"
                      y="50"
                      width="70"
                      height="70"
                      rx="15"
                      className="fill-white/70 stroke-white"
                      strokeWidth="2"
                    />
                    <rect
                      x="170"
                      y="50"
                      width="70"
                      height="70"
                      rx="15"
                      className="fill-white/50 stroke-white"
                      strokeWidth="2"
                    />
                    <rect
                      x="240"
                      y="50"
                      width="70"
                      height="70"
                      rx="15"
                      className="fill-white/30 stroke-white"
                      strokeWidth="2"
                    />
                    <rect
                      x="100"
                      y="120"
                      width="70"
                      height="70"
                      rx="15"
                      className="fill-white/40 stroke-white"
                      strokeWidth="2"
                    />
                    <rect
                      x="170"
                      y="120"
                      width="70"
                      height="70"
                      rx="15"
                      className="fill-white/60 stroke-white"
                      strokeWidth="2"
                    />
                    <rect
                      x="240"
                      y="120"
                      width="70"
                      height="70"
                      rx="15"
                      className="fill-white/20 stroke-white"
                      strokeWidth="2"
                    />
                    <g transform="translate(135, 85)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-pink-800 dark:fill-pink-200 font-bold"
                      >
                        ∫x²dx
                      </text>
                    </g>
                    <g transform="translate(205, 85)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-pink-800 dark:fill-pink-200 font-bold"
                      >
                        d/dx
                      </text>
                    </g>
                    <g transform="translate(275, 85)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-pink-800 dark:fill-pink-200 font-bold"
                      >
                        lim
                      </text>
                    </g>
                    <g transform="translate(135, 155)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-pink-800 dark:fill-pink-200 font-bold"
                      >
                        f&apos;(x)
                      </text>
                    </g>
                    <g transform="translate(205, 155)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-pink-800 dark:fill-pink-200 font-bold"
                      >
                        ∑
                      </text>
                    </g>
                    <g transform="translate(275, 155)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-pink-800 dark:fill-pink-200 font-bold"
                      >
                        ∞
                      </text>
                    </g>
                    <path
                      d="M50,30 C70,10 90,20 90,40 C90,60 70,70 50,50 C30,30 50,10 70,30"
                      fill="none"
                      className="stroke-white"
                      strokeWidth="3"
                    />
                  </svg>
                )}

                {game.title === "Rate Master" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="rateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          className="stop-color-amber-500 dark:stop-color-amber-600"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="100%"
                          className="stop-color-orange-500 dark:stop-color-orange-600"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                      <filter id="rocketGlow" height="130%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                          result="glow"
                        />
                        <feComposite in="SourceGraphic" in2="glow" operator="over" />
                      </filter>
                    </defs>
                    <rect width="400" height="225" className="fill-amber-500/90 dark:fill-amber-700/90" />
                    <path
                      d="M 50,180 Q 125,150 200,120 Q 275,90 350,60"
                      className="stroke-white"
                      strokeWidth="3"
                      fill="none"
                    />
                    <line x1="50" y1="180" x2="350" y2="180" className="stroke-white/50" strokeWidth="1" />
                    <line x1="50" y1="60" x2="50" y2="180" className="stroke-white/50" strokeWidth="1" />
                    <g transform="translate(200, 120)">
                      <path d="M-10,10 L0,-20 L10,10 Z" className="fill-white" filter="url(#rocketGlow)" />
                      <path d="M-5,10 L-5,15 L5,15 L5,10 Z" className="fill-white" />
                      <path d="M-8,15 L-3,25 L3,25 L8,15 Z" className="fill-amber-300/70 dark:fill-amber-200/70" />
                    </g>
                    <g transform="translate(100, 150)">
                      <path d="M-10,10 L0,-20 L10,10 Z" className="fill-white/50" />
                      <path d="M-5,10 L-5,15 L5,15 L5,10 Z" className="fill-white/50" />
                      <path d="M-8,15 L-3,25 L3,25 L8,15 Z" className="fill-amber-300/30 dark:fill-amber-200/30" />
                    </g>
                    <g transform="translate(300, 90)">
                      <path d="M-10,10 L0,-20 L10,10 Z" className="fill-white/50" />
                      <path d="M-5,10 L-5,15 L5,15 L5,10 Z" className="fill-white/50" />
                      <path d="M-8,15 L-3,25 L3,25 L8,15 Z" className="fill-amber-300/30 dark:fill-amber-200/30" />
                    </g>
                    <g transform="translate(250, 50)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="16" className="fill-white font-bold">
                        v = dx/dt
                      </text>
                    </g>
                    <g transform="translate(100, 50)">
                      <text x="0" y="0" fontFamily="sans-serif" fontSize="16" className="fill-white font-bold">
                        a = dv/dt
                      </text>
                    </g>
                    <g transform="translate(200, 200)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="14"
                        className="fill-white font-bold"
                        textAnchor="middle"
                      >
                        Time (t)
                      </text>
                    </g>
                  </svg>
                )}
   {game.title === "Graph Creator" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="graphCreatorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className="stop-color-cyan-500 dark:stop-color-cyan-600" stopOpacity="0.8" />
                        <stop
                          offset="100%"
                          className="stop-color-blue-500 dark:stop-color-blue-600"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                      <filter id="graphGlow" height="130%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                          result="glow"
                        />
                        <feComposite in="SourceGraphic" in2="glow" operator="over" />
                      </filter>
                    </defs>
                    <rect width="400" height="225" className="fill-cyan-500/90 dark:fill-cyan-700/90" />

                    {/* Coordinate system */}
                    <line x1="50" y1="112.5" x2="350" y2="112.5" className="stroke-white" strokeWidth="2" />
                    <line x1="200" y1="30" x2="200" y2="195" className="stroke-white" strokeWidth="2" />

                    {/* X-axis ticks */}
                    <line x1="125" y1="108.5" x2="125" y2="116.5" className="stroke-white" strokeWidth="1.5" />
                    <line x1="275" y1="108.5" x2="275" y2="116.5" className="stroke-white" strokeWidth="1.5" />
                    <text
                      x="125"
                      y="130"
                      fontFamily="sans-serif"
                      fontSize="12"
                      className="fill-white"
                      textAnchor="middle"
                    >
                      -2
                    </text>
                    <text
                      x="275"
                      y="130"
                      fontFamily="sans-serif"
                      fontSize="12"
                      className="fill-white"
                      textAnchor="middle"
                    >
                      2
                    </text>

                    {/* Y-axis ticks */}
                    <line x1="196" y1="60" x2="204" y2="60" className="stroke-white" strokeWidth="1.5" />
                    <line x1="196" y1="165" x2="204" y2="165" className="stroke-white" strokeWidth="1.5" />
                    <text x="185" y="65" fontFamily="sans-serif" fontSize="12" className="fill-white" textAnchor="end">
                      2
                    </text>
                    <text x="185" y="170" fontFamily="sans-serif" fontSize="12" className="fill-white" textAnchor="end">
                      -2
                    </text>

                    {/* Function graphs */}
                    <path
                      d="M 50,60 Q 125,165 200,112.5 Q 275,60 350,112.5"
                      className="stroke-red-400"
                      strokeWidth="3"
                      fill="none"
                      filter="url(#graphGlow)"
                    />
                    <path
                      d="M 50,165 Q 125,60 200,112.5 Q 275,165 350,60"
                      className="stroke-blue-400"
                      strokeWidth="3"
                      fill="none"
                      filter="url(#graphGlow)"
                    />
                    <path
                      d="M 50,112.5 L 350,60"
                      className="stroke-green-400"
                      strokeWidth="3"
                      fill="none"
                      filter="url(#graphGlow)"
                    />

                    {/* Function labels */}
                    <g transform="translate(60, 50)">
                      <circle cx="0" cy="0" r="8" className="fill-red-400" />
                      <text x="15" y="5" fontFamily="sans-serif" fontSize="14" className="fill-white">
                        f(x) = sin(x)
                      </text>
                    </g>
                    <g transform="translate(60, 80)">
                      <circle cx="0" cy="0" r="8" className="fill-blue-400" />
                      <text x="15" y="5" fontFamily="sans-serif" fontSize="14" className="fill-white">
                        g(x) = cos(x)
                      </text>
                    </g>
                    <g transform="translate(60, 110)">
                      <circle cx="0" cy="0" r="8" className="fill-green-400" />
                      <text x="15" y="5" fontFamily="sans-serif" fontSize="14" className="fill-white">
                        h(x) = -0.5x + 1
                      </text>
                    </g>

                    {/* Interactive elements */}
                    <circle cx="200" cy="112.5" r="6" className="fill-white" />
                    <circle cx="275" cy="165" r="6" className="fill-white" />

                    {/* Title */}
                    <g transform="translate(200, 25)">
                      <text
                        x="0"
                        y="0"
                        fontFamily="sans-serif"
                        fontSize="16"
                        className="fill-white font-bold"
                        textAnchor="middle"
                      >
                        Graph Creator
                      </text>
                    </g>
                  </svg>
                )}
                {game.title === "Calculus Legends" && (
                  <svg viewBox="0 0 400 225" className="h-full w-full p-4">
                    <defs>
                      <linearGradient id="legendsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          className="stop-color-amber-600 dark:stop-color-amber-700"
                          stopOpacity="0.8"
                        />
                        <stop offset="100%" className="stop-color-red-500 dark:stop-color-red-600" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="225" className="fill-amber-600/90 dark:fill-amber-800/90" />
                    <circle cx="100" cy="100" r="40" className="fill-white/20 stroke-white" strokeWidth="2" />
                    <circle cx="200" cy="100" r="40" className="fill-white/20 stroke-white" strokeWidth="2" />
                    <circle cx="300" cy="100" r="40" className="fill-white/20 stroke-white" strokeWidth="2" />

                    <g transform="translate(100, 100)">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fontFamily="serif"
                        fontSize="14"
                        className="fill-white font-bold"
                      >
                        Newton
                      </text>
                      <text x="0" y="20" textAnchor="middle" fontFamily="serif" fontSize="12" className="fill-white">
                        F = ma
                      </text>
                    </g>

                    <g transform="translate(200, 100)">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fontFamily="serif"
                        fontSize="14"
                        className="fill-white font-bold"
                      >
                        Leibniz
                      </text>
                      <text x="0" y="20" textAnchor="middle" fontFamily="serif" fontSize="24" className="fill-white">
                        ∫
                      </text>
                    </g>

                    <g transform="translate(300, 100)">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fontFamily="serif"
                        fontSize="14"
                        className="fill-white font-bold"
                      >
                        Euler
                      </text>
                      <text x="0" y="20" textAnchor="middle" fontFamily="serif" fontSize="24" className="fill-white">
                        e
                      </text>
                    </g>

                    <g transform="translate(200, 30)">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fontFamily="serif"
                        fontSize="18"
                        className="fill-white font-bold"
                      >
                        Calculus Legends
                      </text>
                    </g>

                    <g transform="translate(200, 180)">
                      <text x="0" y="0" textAnchor="middle" fontFamily="serif" fontSize="14" className="fill-white">
                        Test your knowledge!
                      </text>
                    </g>
                  </svg>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${game.color} text-white`}
                    >
                      {game.icon}
                    </div>
                    <CardTitle>{game.title}</CardTitle>
                  </div>
                  <div>
                    {/* <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${game.color} text-white`}>
                      {game.age}
                    </span> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{game.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={game.href} className="w-full">
                  <Button className={`w-full bg-gradient-to-r ${game.color} text-white`}>
                    <PlayCircle className="mr-2 h-4 w-4" /> Play Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

