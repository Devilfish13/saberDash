import type { RegexExtraction } from "@/types"

const STORAGE_KEYS = {
  REGEX_EXTRACTIONS: "regex-extractions",
  TEXT_CONTENT: "text-content",
  DASHBOARD_MODE: "dashboard-mode",
}

export const localStorage = {
  getRegexExtractions: (): RegexExtraction[] => {
    if (typeof window === "undefined") return []
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.REGEX_EXTRACTIONS)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  setRegexExtractions: (extractions: RegexExtraction[]) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEYS.REGEX_EXTRACTIONS, JSON.stringify(extractions))
    } catch (error) {
      console.error("Failed to save regex extractions:", error)
    }
  },

  getTextContent: (): string => {
    if (typeof window === "undefined") return ""
    try {
      return window.localStorage.getItem(STORAGE_KEYS.TEXT_CONTENT) || ""
    } catch {
      return ""
    }
  },

  setTextContent: (content: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEYS.TEXT_CONTENT, content)
    } catch (error) {
      console.error("Failed to save text content:", error)
    }
  },

  getDashboardMode: (): "edit" | "approval" => {
    if (typeof window === "undefined") return "edit"
    try {
      const mode = window.localStorage.getItem(STORAGE_KEYS.DASHBOARD_MODE)
      return (mode as "edit" | "approval") || "edit"
    } catch {
      return "edit"
    }
  },

  setDashboardMode: (mode: "edit" | "approval") => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEYS.DASHBOARD_MODE, mode)
    } catch (error) {
      console.error("Failed to save dashboard mode:", error)
    }
  },
}
