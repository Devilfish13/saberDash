export interface RegexExtraction {
  id: string
  name: string
  pattern: string
  flags: string
  approved: boolean
  createdAt: string
  updatedAt: string
}

export interface ExtractedMatch {
  value: string
  index: number
  length: number
}

export interface ExtractionResult {
  id: string
  name: string
  matches: ExtractedMatch[]
}

export type DashboardMode = "edit" | "approval"
