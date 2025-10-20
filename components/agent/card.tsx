"use client"

import { type ReactNode, useState } from 'react'

type CardProps = {
  children: ReactNode
}

export default function Card({ children }: CardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState('codeSnippet')
  const [activeFile, setActiveFile] = useState('')

  return (
    <div>
      {children}
    </div>
  )
}
