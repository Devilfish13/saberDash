"use client"

import { useState, useEffect, useMemo } from "react"
import { LeftPanel } from "../components/left-panel"
import { TextAreaSection } from "../components/text-area-section"
import type { DashboardMode, RegexExtraction, ExtractionResult } from "@/types"
import { localStorage } from "@/utils/localStorage"
import { extractAllMatches } from "@/utils/regexExtraction"

export default function Dashboard() {
  const [mode, setMode] = useState<DashboardMode>("edit")
  const [extractions, setExtractions] = useState<RegexExtraction[]>([])
  const [textContent, setTextContent] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getDashboardMode()
    const savedExtractions = localStorage.getRegexExtractions()
    const savedTextContent = localStorage.getTextContent()

    setMode(savedMode)
    setExtractions(savedExtractions)
    setTextContent(savedTextContent)
    setIsLoaded(true)
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setDashboardMode(mode)
    }
  }, [mode, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setRegexExtractions(extractions)
    }
  }, [extractions, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setTextContent(textContent)
    }
  }, [textContent, isLoaded])

  // Calculate extraction results
  const extractionResults: ExtractionResult[] = useMemo(() => {
    return extractAllMatches(textContent, extractions)
  }, [textContent, extractions])

  const handleModeChange = (newMode: DashboardMode) => {
    setMode(newMode)
  }

  const handleAddExtraction = (extractionData: Omit<RegexExtraction, "id" | "createdAt" | "updatedAt">) => {
    const newExtraction: RegexExtraction = {
      ...extractionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setExtractions((prev) => [...prev, newExtraction])
  }

  const handleUpdateExtraction = (id: string, updates: Partial<RegexExtraction>) => {
    setExtractions((prev) =>
      prev.map((extraction) =>
        extraction.id === id ? { ...extraction, ...updates, updatedAt: new Date().toISOString() } : extraction,
      ),
    )
  }

  const handleDeleteExtraction = (id: string) => {
    setExtractions((prev) => prev.filter((extraction) => extraction.id !== id))
  }

  const handleApproveExtraction = (id: string) => {
    setExtractions((prev) =>
      prev.map((extraction) =>
        extraction.id === id ? { ...extraction, approved: true, updatedAt: new Date().toISOString() } : extraction,
      ),
    )
  }

  const handleTextContentChange = (content: string) => {
    setTextContent(content)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Regex Extraction Dashboard</h1>
          <p className="text-muted-foreground">Manage and approve regex extractions for document processing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <div className="order-2 lg:order-1">
            <LeftPanel
              mode={mode}
              onModeChange={handleModeChange}
              extractions={extractions}
              extractionResults={extractionResults}
              textContent={textContent}
              onAddExtraction={handleAddExtraction}
              onUpdateExtraction={handleUpdateExtraction}
              onDeleteExtraction={handleDeleteExtraction}
              onApproveExtraction={handleApproveExtraction}
            />
          </div>

          <div className="order-1 lg:order-2">
            <TextAreaSection
              content={textContent}
              onContentChange={handleTextContentChange}
              extractions={extractions}
              extractionResults={extractionResults}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
