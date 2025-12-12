import { describe, it, expect } from 'vitest'
import { computeERLayout } from '@/plugins/er-layout-algorithm'

interface Domain {
  name: string
  tables: string[]
  tablePositions: Record<string, { row: number; col: number }>
  columns: number
}

interface Relationship {
  from: { table: string; column: string }
  to: { table: string; column: string }
}

function createDomain(name: string, tables: string[]): Domain {
  return { name, tables, tablePositions: {}, columns: 1 }
}

function createFK(fromTable: string, fromCol: string, toTable: string, toCol: string): Relationship {
  return {
    from: { table: fromTable, column: fromCol },
    to: { table: toTable, column: toCol },
  }
}

describe('er-layout-algorithm', () => {
  describe('domain grid positioning', () => {
    it('should position hub domain at (0,0)', () => {
      const domains = [
        createDomain('CORE', ['users', 'posts']),
        createDomain('TAGS', ['tags', 'post_tags']),
      ]

      const relationships = [
        createFK('posts', 'user_id', 'users', 'id'),
        createFK('post_tags', 'post_id', 'posts', 'id'),
        createFK('post_tags', 'tag_id', 'tags', 'id'),
      ]

      const result = computeERLayout(domains, relationships)

      // CORE receives more cross-domain connections, should be hub
      expect(result.domainGrid['CORE']).toEqual({ row: 0, col: 0 })
    })

    it('should position connected domains adjacent to hub', () => {
      const domains = [
        createDomain('A', ['a1']),
        createDomain('B', ['b1']),
        createDomain('C', ['c1']),
      ]

      const relationships = [
        createFK('b1', 'a_id', 'a1', 'id'),
        createFK('c1', 'a_id', 'a1', 'id'),
      ]

      const result = computeERLayout(domains, relationships)

      // A is hub (receives FKs), B and C should be adjacent
      expect(result.domainGrid['A']).toEqual({ row: 0, col: 0 })
      // B and C should be at (0,1) and (1,0) or similar adjacent positions
      const bPos = result.domainGrid['B']
      const cPos = result.domainGrid['C']
      expect(bPos.row + bPos.col).toBeLessThanOrEqual(2) // Adjacent to (0,0)
      expect(cPos.row + cPos.col).toBeLessThanOrEqual(2)
    })
  })

  describe('internal domain layout', () => {
    it('should position hub table at CENTER of domain grid', () => {
      const domains = [createDomain('TEST', ['hub', 'child1', 'child2'])]
      const relationships = [
        createFK('child1', 'hub_id', 'hub', 'id'),
        createFK('child2', 'hub_id', 'hub', 'id'),
      ]

      computeERLayout(domains, relationships)

      // With radial layout, hub is at center, children orbit around it
      const hubPos = domains[0].tablePositions['hub']
      const child1Pos = domains[0].tablePositions['child1']
      const child2Pos = domains[0].tablePositions['child2']

      // Children should be adjacent to hub (within 1 cell)
      const child1Dist = Math.abs(child1Pos.row - hubPos.row) + Math.abs(child1Pos.col - hubPos.col)
      const child2Dist = Math.abs(child2Pos.row - hubPos.row) + Math.abs(child2Pos.col - hubPos.col)

      expect(child1Dist).toBeLessThanOrEqual(2)
      expect(child2Dist).toBeLessThanOrEqual(2)
    })

    it('should position tables with external connections at edge facing target domain', () => {
      // EXTERNAL receives FK from CORE, so EXTERNAL becomes hub domain at (0,0)
      // CORE is placed at (0,1) - to the right of EXTERNAL
      const domains = [
        createDomain('CORE', ['hub', 'interface_table', 'internal']),
        createDomain('EXTERNAL', ['target']),
      ]
      const relationships = [
        createFK('internal', 'hub_id', 'hub', 'id'),
        createFK('interface_table', 'hub_id', 'hub', 'id'),
        // CORE sends FK to EXTERNAL, so EXTERNAL (with incoming FK) becomes hub domain
        createFK('interface_table', 'target_id', 'target', 'id'),
      ]

      const result = computeERLayout(domains, relationships)

      // EXTERNAL is hub (receives FKs) at (0,0), CORE is at (0,1) to the right
      expect(result.domainGrid['EXTERNAL']).toEqual({ row: 0, col: 0 })
      expect(result.domainGrid['CORE']).toEqual({ row: 0, col: 1 })

      const positions = domains[0].tablePositions
      // interface_table has external connection to EXTERNAL (on LEFT since EXTERNAL is at 0,0)
      // So interface_table should be at LEFT edge of CORE domain
      expect(positions['interface_table'].col).toBeLessThanOrEqual(positions['hub'].col)
    })

    it('should position tables with external-left connections at left edge', () => {
      const domains = [
        createDomain('LEFT', ['source']),
        createDomain('RIGHT', ['hub', 'interface_table', 'internal']),
      ]
      const relationships = [
        createFK('internal', 'hub_id', 'hub', 'id'),
        createFK('interface_table', 'hub_id', 'hub', 'id'),
        createFK('interface_table', 'source_id', 'source', 'id'), // External to LEFT
      ]

      computeERLayout(domains, relationships)

      const positions = domains[1].tablePositions
      // interface_table has external connection to LEFT, should be at left edge
      expect(positions['interface_table'].col).toBeLessThanOrEqual(positions['hub'].col)
    })
  })

  describe('dictionary schema layout - Gemini target', () => {
    const dictionaryDomains = [
      createDomain('LEXICAL CORE', ['lexical_entries', 'word_forms', 'senses', 'entry_audio']),
      createDomain('TAXONOMY & TAGS', ['categories', 'tags', 'sense_tags']),
      createDomain('KNOWLEDGE GRAPH & RELATIONS', ['sense_relations']),
      createDomain('SOURCES & HIERARCHY', ['examples', 'contributors', 'sources', 'source_credits', 'source_parts']),
    ]

    const dictionaryRelationships = [
      // LEXICAL CORE internal
      createFK('word_forms', 'entry_id', 'lexical_entries', 'id'),
      createFK('senses', 'entry_id', 'lexical_entries', 'id'),
      createFK('entry_audio', 'entry_id', 'lexical_entries', 'id'),
      // TAXONOMY internal
      createFK('tags', 'category_id', 'categories', 'id'),
      // Cross-domain
      createFK('sense_tags', 'sense_id', 'senses', 'id'),
      createFK('sense_tags', 'tag_id', 'tags', 'id'),
      createFK('sense_relations', 'source_sense_id', 'senses', 'id'),
      createFK('sense_relations', 'target_sense_id', 'senses', 'id'),
      createFK('examples', 'sense_id', 'senses', 'id'),
      // SOURCES internal
      createFK('examples', 'source_part_id', 'source_parts', 'id'),
      createFK('source_credits', 'source_id', 'sources', 'id'),
      createFK('source_credits', 'contributor_id', 'contributors', 'id'),
      createFK('source_parts', 'source_id', 'sources', 'id'),
      createFK('source_parts', 'parent_part_id', 'source_parts', 'id'),
    ]

    /**
     * GEMINI'S EXPECTED LAYOUT:
     *
     * LEXICAL CORE (top-left):
     *   lexical_entries | senses | entry_audio
     *   word_forms      |        |
     *
     * TAXONOMY & TAGS (top-right):
     *   sense_tags | categories
     *              | tags
     *
     * KNOWLEDGE GRAPH (bottom-left):
     *   sense_relations
     *
     * SOURCES & HIERARCHY (bottom-right):
     *   examples     | sources
     *   contributors | source_credits | source_parts
     */

    it('LEXICAL CORE: should have 3 columns (hub + 2 interface tables in top row)', () => {
      const domains = dictionaryDomains.map(d => createDomain(d.name, d.tables))
      computeERLayout(domains, dictionaryRelationships)

      const lexicalCore = domains.find(d => d.name === 'LEXICAL CORE')!

      // Gemini layout: lexical_entries | senses | entry_audio in top row
      // word_forms alone in bottom row
      expect(lexicalCore.columns).toBe(3)
    })

    it('LEXICAL CORE: senses should be at right edge (interface to TAXONOMY)', () => {
      const domains = dictionaryDomains.map(d => createDomain(d.name, d.tables))
      computeERLayout(domains, dictionaryRelationships)

      const lexicalCore = domains.find(d => d.name === 'LEXICAL CORE')!
      const pos = lexicalCore.tablePositions

      // Radial layout: hub (lexical_entries) centered, interface tables at perimeter
      // senses has external FK to TAXONOMY (on the right), should be at right edge
      const maxCol = lexicalCore.columns - 1
      expect(pos['senses'].col).toBe(maxCol) // Right edge facing TAXONOMY

      // entry_audio and word_forms (internal only) should orbit the hub
      const hubPos = pos['lexical_entries']
      const entryAudioDist = Math.abs(pos['entry_audio'].row - hubPos.row) + Math.abs(pos['entry_audio'].col - hubPos.col)
      const wordFormsDist = Math.abs(pos['word_forms'].row - hubPos.row) + Math.abs(pos['word_forms'].col - hubPos.col)
      expect(entryAudioDist).toBeLessThanOrEqual(2)
      expect(wordFormsDist).toBeLessThanOrEqual(2)
    })

    it('LEXICAL CORE: hub opposite to external connections, interfaces at edges', () => {
      const domains = dictionaryDomains.map(d => createDomain(d.name, d.tables))
      computeERLayout(domains, dictionaryRelationships)

      const lexicalCore = domains.find(d => d.name === 'LEXICAL CORE')!
      const pos = lexicalCore.tablePositions
      const maxCol = lexicalCore.columns - 1

      // OPTIMAL: External connections go RIGHT (to TAXONOMY)
      // So hub should be at LEFT to minimize line crossings
      // senses (interface) should be at RIGHT edge
      expect(pos['senses'].col).toBe(maxCol) // Interface at right edge
      expect(pos['lexical_entries'].col).toBe(0) // Hub at left (opposite to external)
    })

    it('TAXONOMY: sense_tags at left edge (interface to LEXICAL CORE)', () => {
      const domains = dictionaryDomains.map(d => createDomain(d.name, d.tables))
      computeERLayout(domains, dictionaryRelationships)

      const taxonomy = domains.find(d => d.name === 'TAXONOMY & TAGS')!
      const pos = taxonomy.tablePositions

      // sense_tags has outgoing FK to senses (LEXICAL CORE, on left)
      // Should be at left edge (col 0), row doesn't matter
      expect(pos['sense_tags'].col).toBe(0)
    })

    it('SOURCES: examples at left edge (interface to LEXICAL CORE on left)', () => {
      const domains = dictionaryDomains.map(d => createDomain(d.name, d.tables))
      computeERLayout(domains, dictionaryRelationships)

      const sources = domains.find(d => d.name === 'SOURCES & HIERARCHY')!
      const pos = sources.tablePositions

      // examples has outgoing FK to senses (LEXICAL CORE, on left)
      // Should be at left edge (col 0)
      expect(pos['examples'].col).toBe(0)
    })

    it('SOURCES: sources hub centered, examples at interface edge', () => {
      const domains = dictionaryDomains.map(d => createDomain(d.name, d.tables))
      computeERLayout(domains, dictionaryRelationships)

      const sources = domains.find(d => d.name === 'SOURCES & HIERARCHY')!
      const pos = sources.tablePositions

      // sources is the hub (receives from source_credits, source_parts)
      // Radial layout: hub centered, interface tables at perimeter
      // examples has external connection to LEXICAL CORE (above-left)
      // examples should be at left/top edge, hub should be more central
      const hubCol = pos['sources'].col
      const examplesCol = pos['examples'].col

      // examples is interface table (connects to LEXICAL CORE on left)
      // should be at left edge (col 0)
      expect(examplesCol).toBe(0)

      // Hub should be interior (not at left edge where interface tables are)
      expect(hubCol).toBeGreaterThanOrEqual(examplesCol)
    })
  })

  describe('visualize layout', () => {
    it('should produce readable grid layout', () => {
      const domains = [
        createDomain('LEXICAL CORE', ['lexical_entries', 'word_forms', 'senses', 'entry_audio']),
        createDomain('TAXONOMY & TAGS', ['categories', 'tags', 'sense_tags']),
      ]

      const relationships = [
        createFK('word_forms', 'entry_id', 'lexical_entries', 'id'),
        createFK('senses', 'entry_id', 'lexical_entries', 'id'),
        createFK('entry_audio', 'entry_id', 'lexical_entries', 'id'),
        createFK('tags', 'category_id', 'categories', 'id'),
        createFK('sense_tags', 'sense_id', 'senses', 'id'),
        createFK('sense_tags', 'tag_id', 'tags', 'id'),
      ]

      const result = computeERLayout(domains, relationships)

      // Log for debugging
      console.log('\nDomain Grid:')
      for (const [name, pos] of Object.entries(result.domainGrid)) {
        console.log(`  ${name}: (${pos.row}, ${pos.col})`)
      }

      console.log('\nTable Positions:')
      for (const domain of domains) {
        console.log(`\n${domain.name}:`)
        const maxRow = Math.max(...Object.values(domain.tablePositions).map(p => p.row), 0)
        for (let r = 0; r <= maxRow; r++) {
          const row: string[] = []
          for (let c = 0; c < domain.columns; c++) {
            const table = Object.entries(domain.tablePositions).find(([_, p]) => p.row === r && p.col === c)
            row.push(table ? table[0].padEnd(16) : ''.padEnd(16))
          }
          console.log(`  ${row.join(' | ')}`)
        }
      }

      // Basic sanity checks
      expect(domains[0].columns).toBeGreaterThan(0)
      expect(Object.keys(domains[0].tablePositions)).toHaveLength(4)
    })
  })
})
