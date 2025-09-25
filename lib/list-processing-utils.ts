/**
 * Shared list processing utilities extracted from remark-list-variants.ts
 * Adapted for runtime use in MarkdownRenderer
 */

export interface ListItemData {
  content: string
  hasTrailingColon: boolean
  level: number
  displayNumber?: string
}


export interface ParsedListData {
  items: ListItemData[]
  ordered: boolean
  originalNumbers: number[]
  restartPoints: number[]
}

/**
 * Extract original numbers from source text lines
 * Adapted from remark-list-variants.ts
 */
export function extractOriginalNumbers(lines: string[], startLine: number, itemCount: number): number[] {
  const originalNumbers: number[] = []

  for (let i = 0; i < itemCount; i++) {
    const lineIndex = startLine + i
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const sourceLine = lines[lineIndex]
      const numberMatch = sourceLine.match(/^\s*(\d+(?:\.\d+)?)\.\s/)
      if (numberMatch) {
        const num = numberMatch[1]
        originalNumbers.push(num.includes('.') ? parseFloat(num) : parseInt(num, 10))
      } else {
        originalNumbers.push(0)
      }
    } else {
      originalNumbers.push(0)
    }
  }

  return originalNumbers
}

/**
 * Detect restart points in numbering
 * Adapted from remark-list-variants.ts
 */
export function detectRestartPoints(originalNumbers: number[]): number[] {
  const restartPoints: number[] = []

  for (let i = 0; i < originalNumbers.length; i++) {
    const currentNumber = originalNumbers[i]
    if (currentNumber === 1 && i > 0) {
      // Check if this is a restart (1 after higher numbers)
      let isRestart = false
      for (let j = i - 1; j >= 0; j--) {
        if (originalNumbers[j] > 1) {
          isRestart = true
          break
        }
      }
      if (isRestart) {
        restartPoints.push(i)
      }
    }
  }

  return restartPoints
}

/**
 * Calculate display number for an item
 * Adapted from remark-list-variants.ts
 */
export function calculateDisplayNumber(
  itemIndex: number,
  originalNumbers: number[],
  restartPoints: number[]
): string {
  const originalNumber = originalNumbers[itemIndex]

  // Handle decimal numbers (like 2.1)
  if (originalNumber && originalNumber.toString().includes('.')) {
    return originalNumber.toString()
  }

  // Handle restart numbering
  if (restartPoints.includes(itemIndex)) {
    return '1'
  }

  // Handle items after restart points
  if (restartPoints.length > 0) {
    let mostRecentRestart = -1
    for (const restartPoint of restartPoints) {
      if (restartPoint < itemIndex && restartPoint > mostRecentRestart) {
        mostRecentRestart = restartPoint
      }
    }

    if (mostRecentRestart !== -1) {
      const positionInSequence = itemIndex - mostRecentRestart + 1
      return positionInSequence.toString()
    }
  }

  // Handle explicit start numbers or normal sequential
  if (originalNumber > 0) {
    return originalNumber.toString()
  }

  // Fallback to sequential
  return (itemIndex + 1).toString()
}

/**
 * Clean text content from number prefixes and detect trailing colons
 * Adapted from remark-list-variants.ts
 */
export function cleanTextContent(text: string): { cleanedText: string; hasTrailingColon: boolean } {
  let cleanedText = text.trim()
  let hasTrailingColon = false

  // Check for number prefix first - only at the very beginning
  const numberMatch = cleanedText.match(/^(\d+(?:\.\d+)?)\.\s+(.*)/)
  if (numberMatch) {
    cleanedText = numberMatch[2]
  }

  // Handle trailing colons
  if (cleanedText.endsWith(':')) {
    hasTrailingColon = true
    cleanedText = cleanedText.slice(0, -1).trim()
  }

  return { cleanedText, hasTrailingColon }
}

/**
 * Process list data from source text
 * Main utility function that combines all the processing logic
 */
export function processListData(
  sourceText: string,
  startPosition: number,
  items: string[],
  ordered: boolean
): ParsedListData {
  const lines = sourceText.split('\n')
  const originalNumbers = ordered ? extractOriginalNumbers(lines, startPosition, items.length) : []
  const restartPoints = ordered ? detectRestartPoints(originalNumbers) : []

  const processedItems: ListItemData[] = items.map((itemText, index) => {
    const { cleanedText, hasTrailingColon } = cleanTextContent(itemText)
    const displayNumber = ordered ? calculateDisplayNumber(index, originalNumbers, restartPoints) : undefined

    return {
      content: cleanedText,
      hasTrailingColon,
      level: 1, // Will be set by BlockParser based on nesting
      displayNumber
    }
  })

  return {
    items: processedItems,
    ordered,
    originalNumbers,
    restartPoints
  }
}