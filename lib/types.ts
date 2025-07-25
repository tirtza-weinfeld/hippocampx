// Types for the code highlighting and metadata system

export interface Parameter {
  name: string
  type: string
  description: string
  default: string | null
}

export interface Variable {
  name: string
  description: string
  type: string
}

export interface Expression {
  expression: string
  description: string
  type: string
}

export interface SymbolMetadata {
  name: string
  type: 'function' | 'class' | 'method'
  language: string
  file: string
  line: number
  signature: string
  parameters: Parameter[]
  return_type: string
  return_description: string
  description: string
  code: string
  variables: Variable[]
  expressions: Expression[]
  parent?: string
  path?: string[]
}

export interface HighlightedCode {
  jsx: React.ReactNode
  hash: string
  metadata?: {
    lines: number
    symbols: string[]
    complexity: number
  }
}

export interface HighlightOptions {
  lang: string
  meta?: string
  inline?: boolean
  cache?: boolean
} 