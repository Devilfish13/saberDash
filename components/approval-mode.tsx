"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RegexExtraction, ExtractionResult } from "@/types"

interface ApprovalModeProps {
  extractions: RegexExtraction[]
  extractionResults: ExtractionResult[]
  onApproveExtraction: (id: string) => void
}

export function ApprovalMode({ extractions, extractionResults, onApproveExtraction }: ApprovalModeProps) {
  const [selectedExtractionId, setSelectedExtractionId] = useState<string>("")

  const selectedResult = extractionResults.find((r) => r.id === selectedExtractionId)
  const selectedExtraction = extractions.find((e) => e.id === selectedExtractionId)

  const handleApprove = () => {
    if (selectedExtractionId) {
      onApproveExtraction(selectedExtractionId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Approval Mode</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Select Regex Extraction</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExtractionId} onValueChange={setSelectedExtractionId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a regex extraction..." />
            </SelectTrigger>
            <SelectContent>
              {extractions.map((extraction) => (
                <SelectItem key={extraction.id} value={extraction.id}>
                  <div className="flex items-center gap-2">
                    <span>{extraction.name}</span>
                    {extraction.approved && (
                      <Badge variant="secondary" className="text-xs">
                        Approved
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedResult && selectedExtraction && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Extracted Terms: {selectedExtraction.name}</CardTitle>
              <Button onClick={handleApprove} disabled={selectedExtraction.approved} size="sm" className="ml-2">
                <Check className="h-4 w-4 mr-2" />
                {selectedExtraction.approved ? "Approved" : "Approve"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Pattern:{" "}
                <code className="font-mono">
                  /{selectedExtraction.pattern}/{selectedExtraction.flags}
                </code>
              </p>
              <p className="text-sm text-muted-foreground">Found {selectedResult.matches.length} matches</p>

              {selectedResult.matches.length > 0 ? (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Matches:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {selectedResult.matches.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <code className="font-mono">{match.value}</code>
                        <Badge variant="outline" className="text-xs">
                          Position: {match.index}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No matches found in the current text.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {extractions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No regex extractions available.</p>
          <p className="text-sm">Switch to Edit Mode to add some regex patterns.</p>
        </div>
      )}

      {extractions.length > 0 && !selectedExtractionId && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Select a regex extraction to view matches.</p>
        </div>
      )}
    </div>
  )
}
