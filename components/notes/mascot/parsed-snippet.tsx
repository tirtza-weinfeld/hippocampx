"use client"

import React from "react"
import Alert from "@/components/mdx/alert"
import { TooltipMarkdown } from "@/components/mdx/code/tooltip-markdown"

type ParsedSnippetProps = {
  text: string
  className?: string
}

// Lightweight parser for mascot snippets:
// - Converts GitHub-style alerts in blockquotes to our <Alert />
// - Parses inline markdown and $math$ via TooltipMarkdown for all text
export function ParsedSnippet({ text, className = "" }: ParsedSnippetProps) {
  if (!text) return null

  const lines = text.replaceAll("\r\n", "\n").split("\n")
  const elements: React.ReactNode[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Detect: > [!type(:collapse)?]
    const alertHeaderMatch = line.match(/^\s*>\s*\[!(\w+)(:collapse)?\]\s*$/i)
    if (alertHeaderMatch) {
      const type = alertHeaderMatch[1].toLowerCase() as Parameters<typeof Alert>[0]["type"]
      const isCollapse = Boolean(alertHeaderMatch[2])

      const contentLines: string[] = []
      i += 1
      while (i < lines.length) {
        const inner = lines[i]
        if (!/^\s*>/.test(inner)) break
        // strip leading "> " or ">"
        contentLines.push(inner.replace(/^\s*>\s?/, ""))
        i += 1
      }

      // Derive summary (first non-empty) and details (rest)
      let summary = ""
      const detailsParts: string[] = []
      for (const cl of contentLines) {
        if (summary === "" && cl.trim().length > 0) {
          summary = cl.trim()
        } else {
          detailsParts.push(cl)
        }
      }
      const details = detailsParts.join("\n").trim()

      elements.push(
        <Alert key={`alert-${elements.length}`} type={type} collapse={isCollapse}>
          {summary ? <TooltipMarkdown>{summary}</TooltipMarkdown> : null}
          {details ? <TooltipMarkdown>{details}</TooltipMarkdown> : null}
        </Alert>
      )
      continue
    }

    // Fallback: regular line (coalesce consecutive non-alert lines into a paragraph-ish block)
    const paragraphLines: string[] = []
    while (i < lines.length) {
      const l = lines[i]
      // stop at alert header or blank line to split blocks
      if (/^\s*>\s*\[!\w+(?::collapse)?\]/i.test(l) || l.trim() === "") break
      paragraphLines.push(l)
      i += 1
    }

    if (paragraphLines.length > 0) {
      const block = paragraphLines.join("\n")
      elements.push(
        <div key={`p-${elements.length}`} className={className}>
          <TooltipMarkdown>{block}</TooltipMarkdown>
        </div>
      )
      continue
    }

    // Handle single blank line
    if (i < lines.length && lines[i].trim() === "") {
      elements.push(<div key={`sp-${elements.length}`} className="h-1" />)
      i += 1
      continue
    }
  }

  return <>{elements}</>
}

export default ParsedSnippet


