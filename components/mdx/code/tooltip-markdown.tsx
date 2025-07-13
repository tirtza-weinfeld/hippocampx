import { Fragment } from 'react'
import katex from 'katex'

interface TooltipMarkdownProps {
  children: string
  className?: string
}

export function TooltipMarkdown({ children, className = '' }: TooltipMarkdownProps) {
  return (
    <div className={className}>
      {parseMarkdownWithMath(children)}
    </div>
  )
}

function parseMarkdownWithMath(text: string): React.ReactNode {
  // First, split by math expressions to handle them separately
  const mathRegex = /\$([^$]+)\$/g
  const parts = text.split(mathRegex)
  
  return parts.map((part, index) => {
    // Even indices are regular text, odd indices are math expressions
    if (index % 2 === 1) {
      // This is a math expression - render with KaTeX server-side
      try {
        const processedEquation = part.replace(/\\\\/g, '\\')
        const katexHtml = katex.renderToString(processedEquation, {
          throwOnError: false,
          displayMode: false,
          strict: false,
          trust: true,
          output: 'html',
          maxSize: 10,
          maxExpand: 1000,
          minRuleThickness: 0.04
        })
        
        return (
          <span 
            key={index} 
            className="mx-1 inline-flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: katexHtml }}
          />
        )
      } catch {
        // Fallback to styled code if KaTeX fails
        return (
          <code key={index} className="mx-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded font-mono text-sm border border-blue-200 dark:border-blue-700">
            ${part}$
          </code>
        )
      }
    } else {
      // This is regular text that might have markdown
      return parseMarkdown(part, index)
    }
  })
}

function parseMarkdown(text: string, baseKey: number): React.ReactNode {
  if (!text.trim()) return text
  
  // Split by different markdown patterns
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, component: 'strong' }, // **bold**
    { regex: /\*([^*]+)\*/g, component: 'em' },         // *italic*
    { regex: /`([^`]+)`/g, component: 'code' },         // `inline code`
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, component: 'link' }, // [text](url)
  ]
  
  let result: React.ReactNode[] = [text]
  
  patterns.forEach(({ regex, component }) => {
    result = result.flatMap((node, nodeIndex) => {
      if (typeof node !== 'string') return [node]
      
      const parts = node.split(regex)
      const elements: React.ReactNode[] = []
      
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // Regular text
          if (parts[i]) {
            elements.push(parts[i])
          }
        } else {
          // Matched content
          const content = parts[i]
          const key = `${baseKey}-${nodeIndex}-${i}`
          
          switch (component) {
            case 'strong':
              elements.push(<strong key={key} className="font-bold text-current">{content}</strong>)
              break
            case 'em':
              elements.push(<em key={key} className="italic text-current">{content}</em>)
              break
            case 'code':
              elements.push(
                <code key={key} className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-current">
                  {content}
                </code>
              )
              break
            case 'link':
              const url = parts[i + 1]
              elements.push(
                <a key={key} href={url} className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200" target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              )
              i++ // Skip the URL part
              break
          }
        }
      }
      
      return elements
    })
  })
  
  return result.length === 1 ? result[0] : <Fragment key={baseKey}>{result}</Fragment>
} 