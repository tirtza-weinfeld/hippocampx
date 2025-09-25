export interface Token {
  type: TokenType
  content: string
  start: number
  end: number
}

export type TokenType =
  | 'text'
  | 'strong'
  | 'emphasis'
  | 'inlineCode'
  | 'link'
  | 'math'
  | 'mathDisplay'
  | 'list'
  | 'listItem'

export interface TextToken extends Token {
  type: 'text'
  stepData?: {
    step: string
    color: string
  }
}

export interface StrongToken extends Token {
  type: 'strong'
  children: Token[]
  stepData?: {
    step: string
    color: string
  }
}

export interface EmphasisToken extends Token {
  type: 'emphasis'
  children: Token[]
  stepData?: {
    step: string
    color: string
  }
}

export interface InlineCodeToken extends Token {
  type: 'inlineCode'
  stepData?: {
    step: string
    color: string
  }
}

export interface LinkToken extends Token {
  type: 'link'
  href: string
  children: Token[]
}

export interface MathToken extends Token {
  type: 'math'
  latex: string
}

export interface MathDisplayToken extends Token {
  type: 'mathDisplay'
  latex: string
}

export interface ListToken extends Token {
  type: 'list'
  ordered: boolean
  items: ListItemToken[]
  level: number
}

export interface ListItemToken extends Token {
  type: 'listItem'
  children: ParsedToken[]
  level: number
  headerItem?: boolean
  displayNumber?: string
}

export type ParsedToken =
  | TextToken
  | StrongToken
  | EmphasisToken
  | InlineCodeToken
  | LinkToken
  | MathToken
  | MathDisplayToken
  | ListToken
  | ListItemToken

export interface ParseResult {
  tokens: ParsedToken[]
  remaining: string
  consumed: number
}

export interface StepData {
  step: string
  color: string
}