/**
 * Shared formatting utilities for problem content (intuition, time complexity, etc.)
 */

/**
 * Formats intuition content with proper bullet points and nested lists
 */
export function formatIntuitionContent(content: string): string {
  // Check if line already has a numbered list marker (1. 2. etc)
  function hasNumberedMarker(line: string): boolean {
    return /^\d+\.\s/.test(line.trim());
  }

  // Split content into paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

  return paragraphs.map(paragraph => {
    const lines = paragraph.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';

    // First line becomes the main bullet point (unless it already has a numbered marker)
    const firstLine = lines[0].trim();
    let result = hasNumberedMarker(firstLine) ? firstLine : `- ${firstLine}`;

    // Remaining lines use indentation from JSON (already MDX-ready from Python script)
    if (lines.length > 1) {
      let inCodeBlock = false;
      const nestedLines = lines.slice(1).map(line => {
        const trimmed = line.trim();
        // Extract indentation from the line (already correct from Python)
        const indent = line.substring(0, line.length - line.trimStart().length);

        // Check if this line starts or ends a code block
        if (trimmed.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          // Code block delimiters don't get list markers
          return line;
        }

        // If inside code block, preserve line without list marker
        if (inCodeBlock) {
          return line;
        }

        // Normal lines get list markers (unless they already have numbered markers)
        if (hasNumberedMarker(trimmed)) {
          return line;
        }
        return `${indent}- ${trimmed}`;
      });
      result += '\n' + nestedLines.join('\n');
    }

    return result;
  }).join('\n\n');
}

/**
 * Formats time complexity content
 */
export function formatTimeComplexity(content: string): string {
  return formatIntuitionContent(content);
}

/**
 * Formats space complexity content
 */
export function formatSpaceComplexity(content: string): string {
  return formatIntuitionContent(content);
}
