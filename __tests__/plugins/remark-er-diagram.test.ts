import { describe, it, expect } from 'vitest'
import { parseERDiagram } from '@/plugins/remark-er-diagram'

describe('remark-er-diagram', () => {
  describe('parseERDiagram', () => {
    it('should parse basic table with columns', () => {
      const input = `
users
  id    int     PK
  name  varchar
`
      const result = parseERDiagram(input)

      expect(result.tables).toHaveLength(1)
      expect(result.tables[0].name).toBe('users')
      expect(result.tables[0].columns).toHaveLength(2)
      expect(result.tables[0].columns[0]).toEqual({
        name: 'id',
        type: 'int',
        constraints: ['PK'],
        foreignKey: undefined,
        comment: undefined,
        example: undefined,
      })
    })

    it('should parse column with comment only', () => {
      const input = `
users
  id    int     PK  // Unique identifier
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns[0]).toMatchObject({
        name: 'id',
        type: 'int',
        constraints: ['PK'],
        comment: 'Unique identifier',
        example: undefined,
      })
    })

    it('should parse column with comment and example', () => {
      const input = `
users
  id    int     PK  // Unique identifier | 42
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns[0]).toMatchObject({
        name: 'id',
        type: 'int',
        constraints: ['PK'],
        comment: 'Unique identifier',
        example: '42',
      })
    })

    it('should parse column with example only (empty comment)', () => {
      const input = `
users
  id    int     PK  // | 42
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns[0]).toMatchObject({
        name: 'id',
        type: 'int',
        constraints: ['PK'],
        comment: undefined,
        example: '42',
      })
    })

    it('should parse complex example values with special characters', () => {
      const input = `
users
  email    varchar  // Contact email | "jane@example.com"
  metadata jsonb    // Extra data | {"theme": "dark"}
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns[0]).toMatchObject({
        comment: 'Contact email',
        example: '"jane@example.com"',
      })
      expect(result.tables[0].columns[1]).toMatchObject({
        comment: 'Extra data',
        example: '{"theme": "dark"}',
      })
    })

    it('should parse FK constraints with comment', () => {
      const input = `
posts
  user_id  int  FK(users.id)  // Author of the post | 123
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns[0]).toMatchObject({
        name: 'user_id',
        type: 'int',
        constraints: ['FK'],
        foreignKey: { table: 'users', column: 'id' },
        comment: 'Author of the post',
        example: '123',
      })
    })

    it('should parse composite PK FK with comment', () => {
      const input = `
sense_tags
  sense_id  int  PK FK(senses.id)  // Linked sense
  tag_id    int  PK FK(tags.id)    // Linked tag
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns[0]).toMatchObject({
        constraints: ['PK', 'FK'],
        foreignKey: { table: 'senses', column: 'id' },
        comment: 'Linked sense',
      })
      expect(result.tables[0].columns[1]).toMatchObject({
        constraints: ['PK', 'FK'],
        foreignKey: { table: 'tags', column: 'id' },
        comment: 'Linked tag',
      })
    })

    it('should parse domains with tables and comments', () => {
      const input = `
--- LEXICAL CORE ---

lexical_entries
  id     int           PK  // Unique identifier | 202
  lemma  varchar(255)      // Dictionary form | "go"

--- TAXONOMY ---

categories
  id    varchar(50)   PK  // Category identifier | "grammar"
`
      const result = parseERDiagram(input)

      expect(result.domains).toHaveLength(2)
      expect(result.domains[0].name).toBe('LEXICAL CORE')
      expect(result.domains[1].name).toBe('TAXONOMY')

      expect(result.tables).toHaveLength(2)
      expect(result.tables[0].domain).toBe('LEXICAL CORE')
      expect(result.tables[1].domain).toBe('TAXONOMY')

      expect(result.tables[0].columns[0]).toMatchObject({
        comment: 'Unique identifier',
        example: '202',
      })
    })

    it('should handle columns without any metadata', () => {
      const input = `
users
  id        int     PK
  name      varchar
  email     varchar UK
`
      const result = parseERDiagram(input)

      expect(result.tables[0].columns).toHaveLength(3)
      result.tables[0].columns.forEach(col => {
        expect(col.comment).toBeUndefined()
        expect(col.example).toBeUndefined()
      })
    })

    it('should extract relationships from FK definitions', () => {
      const input = `
users
  id  int  PK

posts
  id       int  PK
  user_id  int  FK(users.id)  // Author
`
      const result = parseERDiagram(input)

      expect(result.relationships).toHaveLength(1)
      expect(result.relationships[0]).toEqual({
        from: { table: 'posts', column: 'user_id' },
        to: { table: 'users', column: 'id' },
      })
    })
  })
})
