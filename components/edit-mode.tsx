"use client"

import { useState, useMemo } from "react"
import { Plus, Edit2, Trash2, Save, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { RegexExtraction, ExtractionResult } from "@/types"
import { validateRegexPattern, extractMatches } from "@/utils/regexExtraction"

interface EditModeProps {
  extractions: RegexExtraction[]
  extractionResults: ExtractionResult[]
  textContent: string
  onAddExtraction: (extraction: Omit<RegexExtraction, "id" | "createdAt" | "updatedAt">) => void
  onUpdateExtraction: (id: string, extraction: Partial<RegexExtraction>) => void
  onDeleteExtraction: (id: string) => void
}

export function EditMode({
  extractions,
  extractionResults,
  textContent,
  onAddExtraction,
  onUpdateExtraction,
  onDeleteExtraction,
}: EditModeProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    pattern: "",
    flags: "g",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Real-time preview of matches for the current form data
  const previewMatches = useMemo(() => {
    if (!formData.pattern.trim() || !textContent.trim()) return []

    try {
      const tempExtraction: RegexExtraction = {
        id: "preview",
        name: formData.name || "Preview",
        pattern: formData.pattern,
        flags: formData.flags,
        approved: false,
        createdAt: "",
        updatedAt: "",
      }
      return extractMatches(textContent, tempExtraction)
    } catch {
      return []
    }
  }, [formData.pattern, formData.flags, textContent])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.pattern.trim()) {
      newErrors.pattern = "Pattern is required"
    } else if (!validateRegexPattern(formData.pattern, formData.flags)) {
      newErrors.pattern = "Invalid regex pattern"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingId) {
      onUpdateExtraction(editingId, {
        name: formData.name,
        pattern: formData.pattern,
        flags: formData.flags,
        updatedAt: new Date().toISOString(),
      })
      setEditingId(null)
    } else {
      onAddExtraction({
        name: formData.name,
        pattern: formData.pattern,
        flags: formData.flags,
        approved: false,
      })
      setShowAddForm(false)
    }

    setFormData({ name: "", pattern: "", flags: "g" })
    setErrors({})
  }

  const handleEdit = (extraction: RegexExtraction) => {
    setFormData({
      name: extraction.name,
      pattern: extraction.pattern,
      flags: extraction.flags,
    })
    setEditingId(extraction.id)
    setShowAddForm(false)
  }

  const handleCancel = () => {
    setFormData({ name: "", pattern: "", flags: "g" })
    setEditingId(null)
    setShowAddForm(false)
    setErrors({})
  }

  const getMatchCount = (id: string) => {
    const result = extractionResults.find((r) => r.id === id)
    return result?.matches.length || 0
  }

  const isValidPattern = formData.pattern.trim() && validateRegexPattern(formData.pattern, formData.flags)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Edit Mode</h2>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingId} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Regex
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {editingId ? "Edit Regex Extraction" : "Add New Regex Extraction"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Email Addresses"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="pattern">Regex Pattern</Label>
              <Input
                id="pattern"
                value={formData.pattern}
                onChange={(e) => setFormData((prev) => ({ ...prev, pattern: e.target.value }))}
                placeholder="e.g., \b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
                className={errors.pattern ? "border-red-500" : ""}
                style={{ fontFamily: "monospace" }}
              />
              {errors.pattern && <p className="text-sm text-red-500 mt-1">{errors.pattern}</p>}
            </div>

            <div>
              <Label htmlFor="flags">Flags</Label>
              <Input
                id="flags"
                value={formData.flags}
                onChange={(e) => setFormData((prev) => ({ ...prev, flags: e.target.value }))}
                placeholder="g, i, m, etc."
                className="font-mono"
              />
            </div>

            {/* Real-time Match Preview */}
            {formData.pattern.trim() && (
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <Label className="text-sm font-medium">Live Preview</Label>
                  {isValidPattern ? (
                    <Badge variant={previewMatches.length > 0 ? "default" : "secondary"} className="text-xs">
                      {previewMatches.length} matches found
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Invalid pattern
                    </Badge>
                  )}
                </div>

                {isValidPattern && previewMatches.length > 0 && (
                  <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-muted rounded-md">
                    {previewMatches.slice(0, 10).map((match, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <code className="font-mono bg-background px-1 py-0.5 rounded">{match.value}</code>
                        <Badge variant="outline" className="text-xs">
                          pos: {match.index}
                        </Badge>
                      </div>
                    ))}
                    {previewMatches.length > 10 && (
                      <div className="text-xs text-muted-foreground text-center pt-1">
                        ... and {previewMatches.length - 10} more matches
                      </div>
                    )}
                  </div>
                )}

                {isValidPattern && previewMatches.length === 0 && textContent.trim() && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md text-center">
                    No matches found in the current text
                  </div>
                )}

                {!textContent.trim() && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md text-center">
                    Add some text content to see matches
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSubmit} size="sm" disabled={!isValidPattern}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Update" : "Add"}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {extractions.map((extraction) => {
          const matchCount = getMatchCount(extraction.id)
          const result = extractionResults.find((r) => r.id === extraction.id)

          return (
            <Card key={extraction.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{extraction.name}</h3>
                      {extraction.approved && (
                        <Badge variant="secondary" className="text-xs">
                          Approved
                        </Badge>
                      )}
                      <Badge variant={matchCount > 0 ? "default" : "outline"} className="text-xs">
                        {matchCount} matches
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono mb-2">
                      /{extraction.pattern}/{extraction.flags}
                    </p>

                    {/* Show recent matches for existing extractions */}
                    {result && result.matches.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Recent matches:</div>
                        <div className="flex flex-wrap gap-1">
                          {result.matches.slice(0, 3).map((match, index) => (
                            <code key={index} className="text-xs bg-muted px-1 py-0.5 rounded">
                              {match.value.length > 20 ? `${match.value.slice(0, 20)}...` : match.value}
                            </code>
                          ))}
                          {result.matches.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{result.matches.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(extraction)}
                      disabled={showAddForm || editingId}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteExtraction(extraction.id)}
                      disabled={showAddForm || editingId}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {extractions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No regex extractions yet.</p>
          <p className="text-sm">Click "Add Regex" to get started.</p>
        </div>
      )}
    </div>
  )
}
