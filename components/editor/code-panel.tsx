'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import highlightCode from '@/components/mdx/code/code-highlighter'
import type { CodeFile } from './types'

interface CodePanelProps {
  file: CodeFile | null | undefined
  showLineNumbers?: boolean
  fontSize?: number
  className?: string
}

interface LineNumbersProps {
  totalLines: number
  fontSize: number
}

function LineNumbers({ totalLines, fontSize }: LineNumbersProps) {
  const lines = Array.from({ length: totalLines }, (_, i) => i + 1)
  
  return (
    <div 
      className="flex flex-col text-muted-foreground/70 select-none font-mono text-right pr-3 py-4 bg-muted/20 border-r border-border"
      style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
    >
      {lines.map(lineNum => (
        <div key={lineNum} className="h-6 flex items-center justify-end">
          {lineNum}
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <div className="text-2xl mb-2">📝</div>
        <p className="text-sm">No file selected</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Open a file to start viewing code
        </p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  )
}

export function CodePanel({ 
  file, 
  showLineNumbers = true, 
  fontSize = 14, 
  className 
}: CodePanelProps) {
  const [highlightedCode, setHighlightedCode] = useState<React.ReactNode>(null)
  const [isLoading, setIsLoading] = useState(false)

  const totalLines = useMemo(() => {
    if (!file?.content) return 0
    return file.content.split('\n').length
  }, [file?.content])

  useEffect(() => {
    if (!file?.content) {
      setHighlightedCode(null)
      return
    }

    setIsLoading(true)
    
    highlightCode(file.content, file.language, undefined, true, false)
      .then(jsxResult => {
        setHighlightedCode(jsxResult)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Failed to highlight code:', error)
        // Fallback to plain text
        setHighlightedCode(
          <pre className="font-mono">
            <code>{file.content}</code>
          </pre>
        )
        setIsLoading(false)
      })
  }, [file?.content, file?.language])

  if (!file) {
    return (
      <div className={cn('flex h-full bg-background', className)}>
        <EmptyState />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn('flex h-full bg-background', className)}>
        <LoadingState />
      </div>
    )
  }

  return (
    <div className={cn('flex h-full bg-background', className)}>
      {showLineNumbers && totalLines > 0 && (
        <LineNumbers totalLines={totalLines} fontSize={fontSize} />
      )}
      
      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          <div 
            className={cn(
              'font-mono whitespace-pre-wrap break-words',
              'text-foreground'
            )}
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: '1.5',
              minHeight: '100%'
            }}
          >
            {highlightedCode || (
              <pre className="font-mono">
                <code>{file.content}</code>
              </pre>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}