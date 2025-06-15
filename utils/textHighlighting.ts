import type { ExtractedMatch } from "@/types"

export interface HighlightedSegment {
  text: string
  isMatch: boolean
  matchId?: string
  extractionId?: string
}

export const highlightText = (text: string, matches: ExtractedMatch[], extractionId: string): HighlightedSegment[] => {
  if (matches.length === 0) {
    return [{ text, isMatch: false }]
  }

  // Sort matches by index to process them in order
  const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

  const segments: HighlightedSegment[] = []
  let lastIndex = 0

  sortedMatches.forEach((match, matchIndex) => {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isMatch: false,
      })
    }

    // Add the matched text
    segments.push({
      text: match.value,
      isMatch: true,
      matchId: `${extractionId}-${matchIndex}`,
      extractionId,
    })

    lastIndex = match.index + match.length
  })

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMatch: false,
    })
  }

  return segments
}

export const combineHighlights = (
  text: string,
  extractionResults: Array<{ id: string; matches: ExtractedMatch[] }>,
  selectedExtractionId?: string,
): HighlightedSegment[] => {
  if (!selectedExtractionId) {
    return [{ text, isMatch: false }]
  }

  const selectedResult = extractionResults.find((r) => r.id === selectedExtractionId)
  if (!selectedResult) {
    return [{ text, isMatch: false }]
  }

  return highlightText(text, selectedResult.matches, selectedExtractionId)
}
