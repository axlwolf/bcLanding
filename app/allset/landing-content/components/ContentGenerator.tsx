'use client'

import { useState } from 'react'
import { PAGE_TYPES } from '../types'

interface ContentGeneratorProps {
  onGenerate: (prompt: string, pageType: string) => Promise<void>
  isLoading: boolean
  pageType: string
}

export default function ContentGenerator({
  onGenerate,
  isLoading,
  pageType,
}: ContentGeneratorProps) {
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [generationMessage, setGenerationMessage] = useState('')

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please provide a description')
      return
    }

    setError('')
    setGenerationMessage('')

    try {
      await onGenerate(description, pageType)
      setGenerationMessage('Content generated successfully!')
      setDescription('')
    } catch (err) {
      console.error('Error generating content:', err)
      setError('Failed to generate content. Please try again.')
    }
  }

  return (
    <div className="mb-6 rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold">AI Content Generator</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Describe your business or SaaS product, and our AI will generate landing page content for
        you.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-red-800 dark:text-red-400">{error}</div>
          </div>
        </div>
      )}

      {generationMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-green-800 dark:text-green-400">
              {generationMessage}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="business-description"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Business Description
        </label>
        <textarea
          id="business-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Describe your business, product, or service in detail. Include your target audience, main features, benefits, and any other relevant information."
          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 mt-4 w-full rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
        >
          {isLoading
            ? 'Generating...'
            : `Generate ${PAGE_TYPES[pageType as keyof typeof PAGE_TYPES]?.name || ''} Content`}
        </button>
      </div>
    </div>
  )
}
