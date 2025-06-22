import { extractTextFromPdfFile } from '@/lib/utils/pdf-client'

/**
 * Generate blog content from plain text
 */
export async function generateFromText({
  text,
  setIsGenerating,
  setGenerationError,
  setFormData,
  generateSlug,
}) {
  setIsGenerating(true)
  setGenerationError('')
  try {
    const response = await fetch('/api/allset/generate-from-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceType: 'text', content: text }),
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to generate content')
    }
    const data = await response.json()
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      summary: data.summary || prev.summary,
      content: data.content || prev.content,
      tags: data.tags?.join(', ') || prev.tags,
      slug: data.title ? generateSlug(data.title) : prev.slug,
    }))
  } catch (error) {
    setGenerationError(
      error instanceof Error ? error.message : 'An error occurred while generating content'
    )
  } finally {
    setIsGenerating(false)
  }
}

/**
 * Generate blog content from a PDF file
 */
export async function generateFromPdf({
  pdfFile,
  setIsGenerating,
  setGenerationError,
  setFormData,
  generateSlug,
}) {
  if (!pdfFile) {
    setGenerationError('Please upload a PDF file')
    return
  }
  setIsGenerating(true)
  setGenerationError('')
  try {
    const extractedText = await extractTextFromPdfFile(pdfFile)
    const response = await fetch('/api/allset/generate-from-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceType: 'text', content: extractedText }),
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to generate content')
    }
    const data = await response.json()
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      summary: data.summary || prev.summary,
      content: data.content || prev.content,
      tags: data.tags?.join(', ') || prev.tags,
      slug: data.title ? generateSlug(data.title) : prev.slug,
    }))
  } catch (error) {
    setGenerationError(
      error instanceof Error ? error.message : 'An error occurred while generating content'
    )
  } finally {
    setIsGenerating(false)
  }
}

/**
 * Generate blog content from a URL
 */
export async function generateFromUrl({
  url,
  setIsGenerating,
  setGenerationError,
  setFormData,
  generateSlug,
}) {
  setIsGenerating(true)
  setGenerationError('')
  try {
    const response = await fetch('/api/allset/generate-from-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceType: 'url', url }),
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to generate content')
    }
    const data = await response.json()
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      summary: data.summary || prev.summary,
      content: data.content || prev.content,
      tags: data.tags?.join(', ') || prev.tags,
      slug: data.title ? generateSlug(data.title) : prev.slug,
    }))
  } catch (error) {
    setGenerationError(
      error instanceof Error ? error.message : 'An error occurred while generating content'
    )
  } finally {
    setIsGenerating(false)
  }
}
