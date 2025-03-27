"use client"

import { useEffect, useState } from "react"

type ConfettiPiece = {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  size: number
  animationDuration: number
}

type ConfettiProps = {
  count?: number
  duration?: number
  trigger?: boolean
}

export function Confetti({ count = 100, duration = 5, trigger = false }: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const shapes = ["square", "circle", "triangle"]

  useEffect(() => {
    const colors = [
      "#3B82F6", // blue-500
      "#0EA5E9", // sky-500
      "#14B8A6", // teal-500
      "#10B981", // emerald-500
      "#6366F1", // indigo-500
      "#A855F7", // purple-500
    ]

    if (trigger && !isActive) {
      setIsActive(true)

      const pieces: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: 5 + Math.random() * 10,
        animationDuration: duration * (0.8 + Math.random() * 0.4),
      }))

      setConfetti(pieces)

      const timer = setTimeout(() => {
        setConfetti([])
        setIsActive(false)
      }, duration * 1000)

      return () => clearTimeout(timer)
    }
  }, [trigger, count, duration, isActive])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius:
              shapes[Math.floor(Math.random() * shapes.length)] === "circle"
                ? "50%"
                : shapes[Math.floor(Math.random() * shapes.length)] === "triangle"
                  ? "0"
                  : "2px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.animationDuration}s linear forwards`,
          }}
        />
      ))}
    </div>
  )
}

