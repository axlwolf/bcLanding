'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type SectionData = Record<string, unknown>

interface Template {
  id: string
  name: string
  description: string
  image?: string
  elements?: string[]
  colors?: string
  hero?: SectionData
  mainFeatures?: SectionData
  features?: SectionData
  pricing?: SectionData
  cta?: SectionData
  contact?: SectionData
  gallery?: SectionData
  faqs?: SectionData
  testimonials?: SectionData
  // Add more fields as needed for other sections
}

interface TemplateContextType {
  activeTemplate: string
  templates: Template[]
  loading: boolean
  error: string
  setActiveTemplate: (id: string) => void
}

export const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeTemplate, setActiveTemplateState] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch templates and active template from backend (Supabase)
  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/allset/templates', { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to fetch templates')
        const data = await response.json()
        setTemplates(data.availableTemplates || [])
        setActiveTemplateState(data.activeTemplate || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  // Change template instantly in context and persist in Supabase (optimistic update)
  const setActiveTemplate = async (id: string) => {
    setActiveTemplateState(id)
    setError('')
    try {
      const response = await fetch('/api/allset/templates/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: id }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update template')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <TemplateContext.Provider
      value={{ activeTemplate, templates, loading, error, setActiveTemplate }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = useContext(TemplateContext)
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }
  return context
}
