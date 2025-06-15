"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { HighlightedText } from "./highlighted-text"
import { LoremIpsum } from "lorem-ipsum"
import type { RegexExtraction, ExtractionResult } from "@/types"

interface TextAreaSectionProps {
  content: string
  onContentChange: (content: string) => void
  extractions: RegexExtraction[]
  extractionResults: ExtractionResult[]
}

export function TextAreaSection({ content, onContentChange, extractions, extractionResults }: TextAreaSectionProps) {
  const [lorem] = useState(
    () =>
      new LoremIpsum({
        sentencesPerParagraph: {
          max: 8,
          min: 4,
        },
        wordsPerSentence: {
          max: 16,
          min: 4,
        },
      }),
  )

  const [showHighlights, setShowHighlights] = useState(false)
  const [selectedHighlightId, setSelectedHighlightId] = useState<string>("")

  const generateNewText = () => {
    const newText = lorem.generateParagraphs(3)
    onContentChange(newText)
  }

  useEffect(() => {
    if (!content) {
      generateNewText()
    }
  }, [])

  const selectedResult = extractionResults.find((r) => r.id === selectedHighlightId)
  const selectedExtraction = extractions.find((e) => e.id === selectedHighlightId)

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Document Content</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={generateNewText} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Text
            </Button>
            <Button
              onClick={() => setShowHighlights(!showHighlights)}
              variant={showHighlights ? "default" : "outline"}
              size="sm"
            >
              {showHighlights ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showHighlights ? "Hide" : "Show"} Highlights
            </Button>
          </div>
        </div>

        {showHighlights && (
          <div className="flex items-center gap-2 pt-2">
            <Select value={selectedHighlightId} onValueChange={setSelectedHighlightId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select pattern to highlight..." />
              </SelectTrigger>
              <SelectContent>
                {extractions.map((extraction) => {
                  const result = extractionResults.find((r) => r.id === extraction.id)
                  const matchCount = result?.matches.length || 0
                  return (
                    <SelectItem key={extraction.id} value={extraction.id}>
                      <div className="flex items-center gap-2">
                        <span>{extraction.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {matchCount} matches
                        </Badge>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {selectedExtraction && selectedResult && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Highlighting:</span>
                <Badge variant="outline">{selectedExtraction.name}</Badge>
                <span>({selectedResult.matches.length} matches)</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="h-full">
        <div className="space-y-4">
          {!showHighlights || !selectedHighlightId ? (
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Enter or generate text content..."
              className="min-h-[400px] resize-none font-mono text-sm"
            />
          ) : (
            <div className="border rounded-md p-3 min-h-[400px] max-h-[400px] overflow-y-auto bg-background">
              {selectedResult ? (
                <HighlightedText text={content} matches={selectedResult.matches} extractionId={selectedHighlightId} />
              ) : (
                <div className="text-muted-foreground italic">Select a regex pattern to highlight matches</div>
              )}
            </div>
          )}

          {showHighlights && selectedResult && selectedResult.matches.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 border border-yellow-400 dark:border-yellow-600 rounded"></div>
                <span>Highlighted matches ({selectedResult.matches.length} found)</span>
              </div>
              <div className="space-y-1">
                {selectedResult.matches.slice(0, 5).map((match, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {match.value}
                    </Badge>
                    <span className="text-muted-foreground">at position {match.index}</span>
                  </div>
                ))}
                {selectedResult.matches.length > 5 && (
                  <div className="text-muted-foreground">... and {selectedResult.matches.length - 5} more matches</div>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-2">{content.length} characters</p>
      </CardContent>
    </Card>
  )
}
