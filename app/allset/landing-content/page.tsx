'use client'

import { useState, useEffect } from 'react'
import FormEditor from './components/FormEditor'
import ContentGenerator from './components/ContentGenerator'
import { LandingContent, PageType, PAGE_TYPES } from './types'

export default function LandingContentPage() {
  const [content, setContent] = useState('')
  const [parsedContent, setParsedContent] = useState<LandingContent | null>(null)
  const [originalContent, setOriginalContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [editorMode, setEditorMode] = useState<'json' | 'form'>('form')
  const [pageType, setPageType] = useState<PageType>('product')

  // Section tab state for form editor
  const [activeSection, setActiveSection] = useState('')
  useEffect(() => {
    const sectionKeys =
      parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent)
        ? Object.keys(parsedContent)
        : []
    if (sectionKeys.length > 0) setActiveSection(sectionKeys[0])
  }, [content, parsedContent])

  // Fetch the current landing content
  useEffect(() => {
    async function fetchLandingContent() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/allset/landing-content')

        if (!response.ok) {
          throw new Error('Failed to fetch landing content')
        }

        const data = await response.json()
        const formattedContent = JSON.stringify(data, null, 2)
        setContent(formattedContent)
        setParsedContent(data)
        setOriginalContent(formattedContent)

        // Set page type if available in the content
        if (data.pageType) {
          setPageType(data.pageType as PageType)
        }
      } catch (err) {
        console.error('Error fetching landing content:', err)
        setError('Failed to load landing content. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLandingContent()
  }, [])

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    // Try to parse the JSON to update the form editor
    try {
      const parsed = JSON.parse(e.target.value)
      setParsedContent(parsed)
    } catch (err) {
      // Don't update parsedContent if JSON is invalid
    }
  }

  // Validate JSON
  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  // Handle form submission for JSON editor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate JSON
    if (!isValidJSON(content)) {
      setError('Invalid JSON format. Please check your content.')
      return
    }

    await saveContent(content)
  }

  // Handle form submission for form editor
  const handleFormSubmit = async (formData: LandingContent) => {
    const formContent = JSON.stringify(formData, null, 2)
    await saveContent(formContent)
  }

  // Common save function
  const saveContent = async (contentToSave: string) => {
    setError('')
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/allset/landing-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: contentToSave,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save landing content')
      }

      // Update both editors
      setContent(contentToSave)
      try {
        setParsedContent(JSON.parse(contentToSave))
      } catch (err) {
        console.error('Error parsing saved content:', err)
      }

      setSaveMessage('Landing content saved successfully!')
      setOriginalContent(contentToSave)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('')
      }, 3000)
    } catch (err: Error | unknown) {
      console.error('Error saving landing content:', err)
      setError(
        err instanceof Error ? err.message : 'An error occurred while saving landing content'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateContent = async (prompt: string, pageType: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/allset/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: prompt, pageType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate content')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate content')
      }

      handleContentGenerated(data.content)
    } catch (err) {
      console.error('Error generating content:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset to original content
  const handleReset = () => {
    setContent(originalContent)
    setError('')
    try {
      setParsedContent(JSON.parse(originalContent))
    } catch (err) {
      // Ignore parsing errors
    }
  }

  // Format JSON
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(content)
      setContent(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setError('Cannot format: Invalid JSON format. Please fix the errors first.')
    }
  }

  // Handle content generated by AI
  const handleContentGenerated = (generatedContent: LandingContent) => {
    setContent(JSON.stringify(generatedContent, null, 2))
    setParsedContent(generatedContent)
    setEditorMode('form')

    // Update page type if it's in the generated content
    if (generatedContent.pageType && Object.keys(PAGE_TYPES).includes(generatedContent.pageType)) {
      setPageType(generatedContent.pageType as PageType)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Landing Page Content Editor</h1>

      {/* Editor Mode Toggle and Controls */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setEditorMode('form')}
              className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${editorMode === 'form' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
              Form Editor
            </button>
            <button
              onClick={() => setEditorMode('json')}
              className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${editorMode === 'json' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
              JSON Editor
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Reset
            </button>
            {editorMode === 'json' && (
              <button
                onClick={handleFormat}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Format
              </button>
            )}
          </div>
        </div>

        {/* Page Type Selector */}
        <div className="flex items-center space-x-2">
          <label
            htmlFor="page-type"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Page Type:
          </label>
          <select
            id="page-type"
            value={pageType}
            onChange={(e) => setPageType(e.target.value as PageType)}
            className="rounded-md border-gray-300 py-2 pr-10 pl-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {Object.entries(PAGE_TYPES).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Content Generator */}
      {!isLoading && (
        <ContentGenerator
          onGenerate={handleGenerateContent}
          isLoading={isLoading}
          pageType={pageType}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center rounded-lg bg-slate-100 p-6 py-8 shadow-md dark:bg-gray-800">
          <div className="border-t-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-slate-300"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <div className="flex">
                <div className="text-sm font-medium text-red-800 dark:text-red-400">{error}</div>
              </div>
            </div>
          )}

          {saveMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
              <div className="flex">
                <div className="text-sm font-medium text-green-800 dark:text-green-400">
                  {saveMessage}
                </div>
              </div>
            </div>
          )}

          {editorMode === 'json' ? (
            <div className="rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Edit the JSON content of your landing page below. Be careful to maintain valid
                    JSON format.
                  </p>

                  <div className="relative mt-4">
                    <textarea
                      value={content}
                      onChange={handleContentChange}
                      rows={30}
                      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 font-mono text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      spellCheck="false"
                      data-gramm="false"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving || !isValidJSON(content)}
                    className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : parsedContent &&
            typeof parsedContent === 'object' &&
            !Array.isArray(parsedContent) ? (
            <>
              {parsedContent && Object.keys(parsedContent).length > 1 ? (
                <div className="mb-4 flex gap-2">
                  {Object.keys(parsedContent).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={
                        activeSection === key
                          ? 'bg-primary-600 rounded px-3 py-1 text-white'
                          : 'rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300'
                      }
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              ) : null}
              {parsedContent && (
                <FormEditor
                  content={parsedContent[activeSection] || parsedContent}
                  onSave={(sectionData) => {
                    if (parsedContent) {
                      const updated = { ...parsedContent, [activeSection]: sectionData }
                      handleFormSubmit(updated as LandingContent)
                    }
                  }}
                  isSaving={isSaving}
                  pageType={pageType}
                />
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  )
}
