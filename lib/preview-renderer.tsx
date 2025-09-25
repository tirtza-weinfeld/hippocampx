import fs from 'fs/promises'
import path from 'path'

interface SymbolTag {
  name: string
  title?: string
  definition?: string
  leetcode?: string
  intuition?: string
  time_complexity?: string
  topics?: string[]
  difficulty?: string
  variables?: string[]
  args?: string[]
  returns?: { label: string }
  kind: string
  label?: string
  code?: string
  file_path?: string
}

/**
 * Load problem metadata from symbol tags
 */
async function loadProblemData(slug: string): Promise<SymbolTag | null> {
  try {
    const metadataPath = path.join(process.cwd(), 'lib', 'extracted-metadata', 'symbol_tags.json')
    const metadataContent = await fs.readFile(metadataPath, 'utf-8')
    const symbolTags: Record<string, SymbolTag> = JSON.parse(metadataContent)
    
    // Find problem by matching the slug to the filename
    const problem = Object.values(symbolTags).find(tag => {
      if (tag.kind !== 'function' || !tag.definition) return false
      if (tag.name.includes('.')) return false // Exclude nested functions
      
      const filename = tag.file_path?.split('/').pop()?.replace('.py', '')
      return filename === slug
    })
    
    return problem || null
  } catch (error) {
    console.error('Error loading problem data:', error)
    return null
  }
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Format text with basic markdown-like formatting
 */
function formatText(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\s*-\s*/g, '<br>• ')
    .replace(/\n/g, '<br>')
}

/**
 * Create rich HTML preview that mimics the actual MDX component styling
 */
export async function renderProblemPreview(slug: string): Promise<string | null> {
  try {
    const problemData = await loadProblemData(slug)
    if (!problemData) return null

    const title = problemData.title || problemData.name.replace(/^\s*-\s*/, '').trim()
    
    let html = `
      <div class="problem-preview-content">
        <style>
          .problem-preview-content {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            max-width: 450px;
            color: #1f2937;
            background: white;
            padding: 16px;
            border-radius: 8px;
          }
          .problem-preview-content h1 {
            font-size: 20px !important;
            margin: 0 0 16px 0 !important;
            font-weight: 700;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .problem-section {
            margin: 16px 0;
            padding: 12px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 4px solid #e5e7eb;
          }
          .problem-header {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .problem-content {
            color: #4b5563;
            line-height: 1.5;
          }
          .problem-content code {
            font-size: 12px !important;
            padding: 2px 6px;
            background: #f1f5f9;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            color: #1e293b;
            border: 1px solid #e2e8f0;
          }
          .problem-content strong {
            color: #374151;
            font-weight: 600;
          }
          .difficulty-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            margin: 4px 0;
            text-transform: capitalize;
          }
          .difficulty-easy { 
            background: linear-gradient(135deg, #10b981, #059669);
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
          }
          .difficulty-medium { 
            background: linear-gradient(135deg, #f59e0b, #d97706);
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
          }
          .difficulty-hard { 
            background: linear-gradient(135deg, #ef4444, #dc2626);
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
          }
          .topic-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
          }
          .topic-tag {
            display: inline-flex;
            align-items: center;
            background: #f3f4f6;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            color: #6b7280;
            border: 1px solid #e5e7eb;
            transition: all 0.2s ease;
          }
          .topic-tag:hover {
            background: #e5e7eb;
            color: #374151;
          }
          .leetcode-link {
            display: inline-flex;
            align-items: center;
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 12px;
            background: #eff6ff;
            border-radius: 6px;
            border: 1px solid #dbeafe;
            font-size: 13px;
          }
          .leetcode-link:hover {
            background: #dbeafe;
            text-decoration: none;
          }
          .code-section {
            margin: 16px 0;
          }
          .code-section pre {
            margin: 8px 0 !important;
            padding: 16px !important;
            font-size: 12px !important;
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            line-height: 1.5;
            border: 1px solid #334155;
          }
          .code-section pre code {
            background: transparent !important;
            padding: 0 !important;
            border: none !important;
            color: inherit;
          }
          .complexity-text {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 13px;
            background: #fef3c7;
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
          }
        </style>
    `
    
    // Title
    html += `<h1>${escapeHtml(title)}</h1>`
    
    // LeetCode link
    if (problemData.leetcode) {
      const cleanLeetcode = problemData.leetcode.replace(/^-\s*/gm, '').trim()
      // Extract link if it's in markdown format
      const linkMatch = cleanLeetcode.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        const [, linkText, linkUrl] = linkMatch
        html += `<div style="margin-bottom: 16px;"><a href="${escapeHtml(linkUrl)}" class="leetcode-link" target="_blank" rel="noopener">${escapeHtml(linkText)}</a></div>`
      } else {
        html += `<div class="problem-section"><div class="problem-content">${formatText(cleanLeetcode)}</div></div>`
      }
    }
    
    // Definition
    if (problemData.definition?.trim()) {
      html += `
        <div class="problem-section" style="border-left-color: #3b82f6;">
          <div class="problem-header">Problem Definition</div>
          <div class="problem-content">${formatText(problemData.definition.trim())}</div>
        </div>
      `
    }
    
    // Difficulty and Topics in a flex container
    if (problemData.difficulty || (problemData.topics && problemData.topics.length > 0)) {
      html += `<div style="display: flex; gap: 16px; margin: 16px 0; flex-wrap: wrap;">`
      
      if (problemData.difficulty) {
        const difficultyClass = `difficulty-${problemData.difficulty.toLowerCase()}`
        html += `<span class="difficulty-badge ${difficultyClass}">${problemData.difficulty}</span>`
      }
      
      if (problemData.topics && problemData.topics.length > 0) {
        html += `
          <div class="topic-container">
            ${problemData.topics.map(topic => `<span class="topic-tag">${escapeHtml(topic)}</span>`).join('')}
          </div>
        `
      }
      
      html += `</div>`
    }
    
    // Intuition
    if (problemData.intuition?.trim()) {
      let intuition = problemData.intuition.trim()
      if (intuition.length > 250) {
        intuition = intuition.substring(0, 250) + '...'
      }
      html += `
        <div class="problem-section" style="border-left-color: #10b981;">
          <div class="problem-header">Approach & Intuition</div>
          <div class="problem-content">${formatText(intuition)}</div>
        </div>
      `
    }
    
    // Time Complexity
    if (problemData.time_complexity?.trim()) {
      let complexity = problemData.time_complexity.trim()
      if (complexity.length > 150) {
        complexity = complexity.substring(0, 150) + '...'
      }
      html += `
        <div class="problem-section" style="border-left-color: #f59e0b;">
          <div class="problem-header">Time Complexity</div>
          <div class="complexity-text">${formatText(complexity)}</div>
        </div>
      `
    }
    
    // Code snippet
    if (problemData.code && problemData.file_path) {
      let code = problemData.code.trim()
      if (code.length > 400) {
        code = code.substring(0, 400) + '\n  # ... (truncated for preview)'
      }
      html += `
        <div class="code-section">
          <div class="problem-header" style="margin-bottom: 8px;">Code Implementation</div>
          <pre><code>${escapeHtml(code)}</code></pre>
        </div>
      `
    }
    
    html += `</div>`
    
    return html

  } catch (error) {
    console.error('Error rendering problem preview:', error)
    return null
  }
}

/**
 * Create a condensed version by truncating content
 */
export function createCondensedPreview(html: string): string {
  // The preview is already condensed, just return as-is
  return html
}