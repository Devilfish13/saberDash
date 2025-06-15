import type { RegexExtraction, ExtractedMatch, ExtractionResult } from "@/types"

export const extractMatches = (text: string, extraction: RegexExtraction): ExtractedMatch[] => {
  try {
    const regex = new RegExp(extraction.pattern, extraction.flags)
    const matches: ExtractedMatch[] = []

    if (extraction.flags.includes("g")) {
      let match
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          value: match[0],
          index: match.index,
          length: match[0].length,
        })
        if (regex.lastIndex === match.index) {
          regex.lastIndex++
        }
      }
    } else {
      const match = regex.exec(text)
      if (match) {
        matches.push({
          value: match[0],
          index: match.index,
          length: match[0].length,
        })
      }
    }

    return matches
  } catch (error) {
    console.error("Regex extraction error:", error)
    return []
  }
}

export const extractAllMatches = (text: string, extractions: RegexExtraction[]): ExtractionResult[] => {
  return extractions.map((extraction) => ({
    id: extraction.id,
    name: extraction.name,
    matches: extractMatches(text, extraction),
  }))
}

export const validateRegexPattern = (pattern: string, flags: string): boolean => {
  try {
    new RegExp(pattern, flags)
    return true
  } catch {
    return false
  }
}
