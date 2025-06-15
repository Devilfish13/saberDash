"use client"

import { useMemo } from "react"
import type { ExtractedMatch } from "@/types"
import { highlightText } from "@/utils/textHighlighting"

interface HighlightedTextProps {
  text: string
  matches: ExtractedMatch[]
  extractionId: string
  className?: string
}

export function HighlightedText({ text, matches, extractionId, className = "" }: HighlightedTextProps) {
  const segments = useMemo(() => {
    return highlightText(text, matches, extractionId)
  }, [text, matches, extractionId])

  return (
    <div className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${className}`}>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={
            segment.isMatch
              ? "bg-yellow-200 dark:bg-yellow-800 px-1 py-0.5 rounded border border-yellow-400 dark:border-yellow-600"
              : ""
          }
          title={segment.isMatch ? `Match: ${segment.text}` : undefined}
        >
          {segment.text}
        </span>
      ))}
    </div>
  )
}
