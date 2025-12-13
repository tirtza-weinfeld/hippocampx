import type { ERTopology } from '../types'

/**
 * Generate a simple hash from a string.
 * Uses djb2 algorithm for fast, deterministic hashing.
 */
function simpleHash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
  }
  return Math.abs(hash).toString(36).slice(0, 8)
}

/**
 * Convert a string to a URL-safe slug.
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
}

/**
 * Generate a stable, unique ID for an ER diagram.
 *
 * The ID is based on the diagram's structural fingerprint (table names and relationships)
 * with an optional title prefix for human readability.
 *
 * @param topology - The ER diagram topology
 * @param title - Optional title to prefix the ID
 * @returns A stable identifier string
 */
export function generateDiagramId(topology: ERTopology, title?: string): string {
  // Collect table names sorted alphabetically
  const tableNames = topology.tables.map(t => t.name).sort().join(',')

  // Collect relationship keys sorted alphabetically
  const relationshipKeys = topology.relationships
    .map(r => `${r.from.table}.${r.from.column}-${r.to.table}.${r.to.column}`)
    .sort()
    .join(',')

  // Create fingerprint from structure
  const fingerprint = `${tableNames}|${relationshipKeys}`
  const hash = simpleHash(fingerprint)

  // Combine with slugified title if provided
  if (title) {
    const slug = slugify(title)
    return slug ? `er-${slug}-${hash}` : `er-${hash}`
  }

  return `er-${hash}`
}
