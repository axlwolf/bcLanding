import React from 'react'
import Image from 'next/image'
import { PageType } from '../types'

const ImageUploader = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Image URL"
      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
    {/* You can replace this with a real uploader */}
    {value && (
      <Image src={value} alt="Preview" width={200} height={200} className="mt-2 max-h-32 rounded" />
    )}
  </div>
)

interface FieldRendererProps {
  fieldKey: string
  value: unknown
  parentKeys?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValueAtPath: (obj: any, path: string) => any
  handleFieldChange: (path: string, value: unknown) => void
  handleArrayAdd: (path: string) => void
  handleArrayRemove: (path: string, idx: number) => void
  formData: unknown
  pageType?: PageType
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  fieldKey,
  value,
  parentKeys = [],
  getValueAtPath,
  handleFieldChange,
  handleArrayAdd,
  handleArrayRemove,
  formData,
  pageType = 'product',
}) => {
  const fullKey = [...parentKeys, fieldKey].join('.')
  const label = fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())

  // Helper function to get field-specific help text based on page type
  const getFieldHelpText = () => {
    // Only show help text for top-level fields
    if (parentKeys.length > 0) return null

    const helpTexts: Record<string, Record<string, string>> = {
      product: {
        heroSection:
          'The main section at the top of the page with headline, subheading, and call to action',
        features: 'Key product features or benefits',
        pricing: 'Pricing plans and options',
        testimonials: 'Customer reviews and testimonials',
        callToAction: 'Final call to action section at the bottom of the page',
      },
      youtube: {
        channelInfo: 'Information about the YouTube channel',
        featuredVideos: 'Highlighted videos from the channel',
        playlists: 'Collections of videos organized by theme',
        subscriberCount: 'Number of channel subscribers',
        socialLinks: 'Links to other social media platforms',
      },
    }

    return helpTexts[pageType]?.[fieldKey] || null
  }

  const helpText = getFieldHelpText()

  if (typeof value === 'string') {
    if (fieldKey === 'description') {
      return (
        <div key={fullKey}>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {helpText && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({helpText})</span>
            )}
          </label>
          <textarea
            value={getValueAtPath(formData, fullKey)}
            onChange={(e) => handleFieldChange(fullKey, e.target.value)}
            rows={3}
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      )
    }
    if (fieldKey === 'image') {
      return (
        <div key={fullKey}>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <ImageUploader
            value={getValueAtPath(formData, fullKey)}
            onChange={(url) => handleFieldChange(fullKey, url)}
          />
        </div>
      )
    }
    if (fieldKey === 'downloadUrl') {
      return (
        <div key={fullKey} className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <input
            type="file"
            accept="application/pdf,application/epub+zip,.mobi,.doc,.docx,.txt,.zip,.rar"
            className="block w-full rounded border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const formData = new FormData()
              formData.append('file', file)
              const res = await fetch('/api/upload', { method: 'POST', body: formData })
              const { url } = await res.json()
              handleFieldChange(fullKey, url)
            }}
          />
          {getValueAtPath(formData, fullKey) && (
            <a
              href={getValueAtPath(formData, fullKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-blue-600 underline"
            >
              Download uploaded file
            </a>
          )}
        </div>
      )
    }
    return (
      <div key={fullKey} className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          type="text"
          value={getValueAtPath(formData, fullKey) ?? ''}
          onChange={(e) => handleFieldChange(fullKey, e.target.value)}
          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
    )
  }
  if (typeof value === 'number') {
    return (
      <div key={fullKey} className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {helpText && (
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({helpText})</span>
          )}
        </label>
        <input
          type="number"
          value={getValueAtPath(formData, fullKey)}
          onChange={(e) => handleFieldChange(fullKey, Number(e.target.value))}
          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
    )
  }
  if (typeof value === 'boolean') {
    return (
      <div key={fullKey} className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {helpText && (
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({helpText})</span>
          )}
        </label>
        <input
          type="checkbox"
          checked={getValueAtPath(formData, fullKey)}
          onChange={(e) => handleFieldChange(fullKey, e.target.checked)}
          className="text-primary-600 focus:border-primary-500 focus:ring-primary-500 focus:ring-opacity-50 rounded border-gray-300 shadow-sm focus:ring"
        />
      </div>
    )
  }
  if (Array.isArray(value)) {
    return (
      <div key={fullKey + '-array'} className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {helpText && (
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({helpText})</span>
          )}
        </label>
        {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {getValueAtPath(formData, fullKey).map((item: unknown, idx: number) => (
          <div key={idx} className="relative mb-2 ml-4 border-l-2 border-gray-200 pl-4">
            <button
              type="button"
              className="absolute top-1 left-[-30px] text-red-500 hover:text-red-700"
              onClick={() => handleArrayRemove(fullKey, idx)}
              aria-label="Remove item"
            >
              &times;
            </button>
            {typeof item === 'object' && item !== null ? (
              Object.entries(item).map(([k, v]) => (
                <FieldRenderer
                  key={k}
                  fieldKey={k}
                  value={v}
                  parentKeys={[...parentKeys, fieldKey, String(idx)]}
                  getValueAtPath={getValueAtPath}
                  handleFieldChange={handleFieldChange}
                  handleArrayAdd={handleArrayAdd}
                  handleArrayRemove={handleArrayRemove}
                  formData={formData}
                  pageType={pageType}
                />
              ))
            ) : (
              <input
                type="text"
                value={getValueAtPath(formData, [...parentKeys, fieldKey, String(idx)].join('.'))}
                onChange={(e) =>
                  handleFieldChange(
                    [...parentKeys, fieldKey, String(idx)].join('.'),
                    e.target.value
                  )
                }
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="bg-primary-600 hover:bg-primary-700 mt-2 rounded px-2 py-1 text-xs text-white"
          onClick={() => handleArrayAdd(fullKey)}
        >
          Add Item
        </button>
      </div>
    )
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <div key={fullKey + '-object'} className="ml-2 border-l-2 border-gray-200 pl-4">
        <div className="mb-1 font-medium text-gray-600 dark:text-gray-400">{label}</div>
        {Object.entries(value).map(([k, v]) => (
          <FieldRenderer
            key={k}
            fieldKey={k}
            value={v}
            parentKeys={[...parentKeys, fieldKey]}
            getValueAtPath={getValueAtPath}
            handleFieldChange={handleFieldChange}
            handleArrayAdd={handleArrayAdd}
            handleArrayRemove={handleArrayRemove}
            formData={formData}
            pageType={pageType}
          />
        ))}
      </div>
    )
  }
  return null
}
