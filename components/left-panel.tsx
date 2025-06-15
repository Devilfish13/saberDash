"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditMode } from "./edit-mode"
import { ApprovalMode } from "./approval-mode"
import type { DashboardMode, RegexExtraction, ExtractionResult } from "@/types"

interface LeftPanelProps {
  mode: DashboardMode
  onModeChange: (mode: DashboardMode) => void
  extractions: RegexExtraction[]
  extractionResults: ExtractionResult[]
  textContent: string
  onAddExtraction: (extraction: Omit<RegexExtraction, "id" | "createdAt" | "updatedAt">) => void
  onUpdateExtraction: (id: string, extraction: Partial<RegexExtraction>) => void
  onDeleteExtraction: (id: string) => void
  onApproveExtraction: (id: string) => void
}

export function LeftPanel({
  mode,
  onModeChange,
  extractions,
  extractionResults,
  textContent,
  onAddExtraction,
  onUpdateExtraction,
  onDeleteExtraction,
  onApproveExtraction,
}: LeftPanelProps) {
  const approvedCount = extractions.filter((e) => e.approved).length
  const totalMatches = extractionResults.reduce((sum, result) => sum + result.matches.length, 0)

  return (
    <div className="h-full flex flex-col">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => onModeChange("edit")}
              variant={mode === "edit" ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              Edit Mode
            </Button>
            <Button
              onClick={() => onModeChange("approval")}
              variant={mode === "approval" ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              Approval Mode
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold">{extractions.length}</div>
              <div className="text-muted-foreground">Total Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{totalMatches}</div>
              <div className="text-muted-foreground">Total Matches</div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-3">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Approved:</span>
              <Badge variant="secondary" className="text-xs">
                {approvedCount}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 overflow-auto">
        {mode === "edit" ? (
          <EditMode
            extractions={extractions}
            extractionResults={extractionResults}
            textContent={textContent}
            onAddExtraction={onAddExtraction}
            onUpdateExtraction={onUpdateExtraction}
            onDeleteExtraction={onDeleteExtraction}
          />
        ) : (
          <ApprovalMode
            extractions={extractions}
            extractionResults={extractionResults}
            onApproveExtraction={onApproveExtraction}
          />
        )}
      </div>
    </div>
  )
}
