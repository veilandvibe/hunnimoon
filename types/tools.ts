export interface FAQ {
  question: string
  answer: string
}

export interface ToolSEOContent {
  h2: string
  content: string // Long-form write-up in HTML
  faqs: FAQ[]
}

export interface Tool {
  slug: string
  name: string
  h1: string // Exact main keyword
  description: string // 1-2 sentences, includes keyword
  category: 'planning' | 'budget' | 'guests' | 'timeline' | 'reception'
  seoContent: ToolSEOContent
  component: string // Component name to render
  image?: string // Product image path
}

export type ToolCategory = Tool['category']
