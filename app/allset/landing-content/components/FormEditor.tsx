'use client'

import { useEffect } from 'react'
import { useFormData } from './useFormData'
import { FieldRenderer } from './FieldRenderer'
import { PageType, PAGE_TYPES } from '../types'

interface FormEditorProps<T> {
  content: T
  onSave: (content: T) => void
  isSaving: boolean
  pageType?: PageType
}

export default function FormEditor<T extends Record<string, unknown>>({
  content,
  onSave,
  isSaving,
  pageType = 'product',
}: FormEditorProps<T>) {
  const {
    formData,
    setFormData,
    getValueAtPath,
    handleFieldChange,
    handleArrayAdd,
    handleArrayRemove,
  } = useFormData<T>(content)

  useEffect(() => {
    setFormData(content)
  }, [content, setFormData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // Get the fields specific to the current page type
  const renderFields = () => {
    // Common fields that should appear for all page types
    const commonFields = ['pageType', 'title', 'description', 'metaDescription', 'metaKeywords']

    // Fields to render based on page type
    let fieldsToRender = Object.keys(formData)

    // If we have specific field requirements for a page type, filter the fields
    if (pageType === 'product') {
      // For product pages, we want to prioritize product-specific fields
      const productFields = [
        ...commonFields,
        'heroSection',
        'features',
        'pricing',
        'testimonials',
        'callToAction',
      ]
      fieldsToRender = fieldsToRender.sort((a, b) => {
        const aIndex = productFields.indexOf(a)
        const bIndex = productFields.indexOf(b)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    } else if (pageType === 'youtube') {
      // For YouTube pages, prioritize video-related fields
      const youtubeFields = [
        ...commonFields,
        'channelInfo',
        'featuredVideos',
        'playlists',
        'subscriberCount',
        'socialLinks',
      ]
      fieldsToRender = fieldsToRender.sort((a, b) => {
        const aIndex = youtubeFields.indexOf(a)
        const bIndex = youtubeFields.indexOf(b)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    }

    return fieldsToRender.map((fieldKey) => (
      <FieldRenderer
        key={fieldKey}
        fieldKey={fieldKey}
        value={formData[fieldKey]}
        parentKeys={[]}
        getValueAtPath={getValueAtPath}
        handleFieldChange={handleFieldChange}
        handleArrayAdd={handleArrayAdd}
        handleArrayRemove={handleArrayRemove}
        formData={formData}
        pageType={pageType}
      />
    ))
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Page Type Info */}
        <div className="mb-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
          <div className="flex">
            <div className="text-sm text-blue-800 dark:text-blue-400">
              <p className="font-medium">{PAGE_TYPES[pageType].name} Landing Page</p>
              <p>{PAGE_TYPES[pageType].description}</p>
            </div>
          </div>
        </div>

        {renderFields()}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
