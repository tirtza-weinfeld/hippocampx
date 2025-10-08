import 'mdast'

declare module 'mdast' {
  interface HeadingData {
    hProperties?: {
      id?: string
      component?: string
      [key: string]: unknown
    }
  }

  interface ListData {
    hProperties?: {
      className?: string | string[]
      [key: string]: unknown
    }
  }

  interface ListItemData {
    hProperties?: {
      className?: string | string[]
      'data-variant'?: string
      'data-icon'?: string
      'data-color'?: string
      [key: string]: unknown
    }
  }

  interface StrongData {
    hProperties?: {
      'data-step'?: string
      [key: string]: unknown
    }
  }

  interface EmphasisData {
    hProperties?: {
      'data-step'?: string
      [key: string]: unknown
    }
  }

  interface RootData {
    hProperties?: {
      className?: string | string[]
      [key: string]: unknown
    }
  }
}
