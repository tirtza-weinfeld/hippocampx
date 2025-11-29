"use client"

import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
}

export default function Card({ children }: CardProps) {
  return (
    <div>
      {children}
    </div>
  )
}
