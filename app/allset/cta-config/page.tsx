'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useEffect } from 'react'
import type { EmailTemplateDataInstance } from '../../../lib/models/emailTemplateData'

const CTA_OPTIONS = [
  {
    label: 'Ebook Delivery',
    value: 'ebook-delivery',
    description:
      'Send a subscriber an ebook automatically after signup using the ebook-delivery template.',
  },
  {
    label: 'Downloadable Item',
    value: 'downloadable-item',
    description: 'Send a download link for a file (ZIP, template, etc.) after signup.',
  },
  {
    label: 'Newsletter',
    value: 'newsletter',
    description:
      'Send a recurring newsletter to subscribers. Configure how often the newsletter is sent.',
  },
  {
    label: 'Welcome Email Only',
    value: 'welcome',
    description: 'Send a one-time welcome email to new subscribers.',
  },
]

export default function CTAConfigPage() {
  const [ctaType, setCtaType] = useState<string>('ebook-delivery')
  const [newsletterFrequency, setNewsletterFrequency] = useState<string>('weekly')
  const [templateData, setTemplateData] = useState<EmailTemplateDataInstance[]>([])
  const [selectedTemplateDataId, setSelectedTemplateDataId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)
  const [existingConfigId, setExistingConfigId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch singleton CTA config on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/cta-config')
        if (res.ok) {
          const config = await res.json()
          console.log('[CTAConfigPage] Fetched singleton config:', config)
          if (config && config.id) {
            setExistingConfigId(config.id)
            setCtaType(config.cta_type)
            setSelectedTemplateDataId(config.template_data_id)
            if (config.newsletter_frequency) setNewsletterFrequency(config.newsletter_frequency)
            else setNewsletterFrequency('weekly')
            console.log('[CTAConfigPage] Set all states from config:', config)
          } else {
            setExistingConfigId(null)
            setSelectedTemplateDataId(null)
          }
        } else {
          setExistingConfigId(null)
          setSelectedTemplateDataId(null)
          console.log('[CTAConfigPage] Error fetching singleton config')
        }
      } catch (err) {
        setExistingConfigId(null)
        setSelectedTemplateDataId(null)
        console.log('[CTAConfigPage] Exception fetching singleton config', err)
      }
    }
    fetchConfig().finally(() => setLoading(false))
  }, [])

  // Fetch all template data on mount
  useEffect(() => {
    fetch('/api/template-data')
      .then((res) => res.json())
      .then((data) => setTemplateData(data))
      .catch(() => setTemplateData([]))
  }, [])

  // Filter template data by selected CTA type (template)
  const filteredData = templateData.filter((d) => d.template === ctaType)

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[300px] max-w-2xl flex-col items-center justify-center p-8">
        <div className="border-primary-600 mb-4 h-10 w-10 animate-spin rounded-full border-t-2 border-b-2"></div>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Loading configuration...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Configure Signup CTA</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Choose how your subscribers are engaged after signing up. You can send them an ebook, a
        newsletter, or just a welcome email.
      </p>
      <div className="mb-8 space-y-4">
        {CTA_OPTIONS.map((opt) => (
          <div
            key={opt.value}
            className={`block cursor-pointer rounded-lg border p-4 transition-all ${ctaType === opt.value ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'}`}
          >
            <input
              type="radio"
              id={`ctaType-${opt.value}`}
              name="ctaType"
              value={opt.value}
              checked={ctaType === opt.value}
              onChange={() => setCtaType(opt.value)}
              className="accent-primary-600 mr-3"
            />
            <label htmlFor={`ctaType-${opt.value}`} className="cursor-pointer font-semibold">
              {opt.label}
            </label>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{opt.description}</div>
          </div>
        ))}
      </div>
      {/* Template Data Instance Dropdown */}
      <div className="mb-8">
        <label htmlFor="templateDataSelect" className="mb-2 block font-medium">
          Select Template Data
        </label>
        <select
          id="templateDataSelect"
          className="dark:border-primary-700 border-primary-300 focus:ring-primary-500 w-full rounded border px-3 py-2 focus:ring-2 dark:bg-gray-800"
          value={selectedTemplateDataId ?? ''}
          onChange={(e) => setSelectedTemplateDataId(Number(e.target.value))}
        >
          <option value="">-- Select --</option>
          {filteredData.map((d) => {
            let label = `ID #${d.id}`
            try {
              const parsed = JSON.parse(d.data || '{}')
              if (d.template === 'ebook-delivery' && parsed.ebookTitle) {
                label = `Ebook: ${parsed.ebookTitle}`
              } else if (d.template === 'downloadable-item' && parsed.itemName) {
                label = `Download: ${parsed.itemName}`
              } else if (d.template === 'welcome' && parsed.welcomeMessage) {
                label = `Welcome: ${parsed.welcomeMessage.substring(0, 50)}${parsed.welcomeMessage.length > 50 ? '...' : ''}`
              } else if (d.template === 'newsletter' && parsed.subject) {
                label = `Newsletter: ${parsed.subject}`
              }
            } catch (err) {
              console.error('Error parsing template data:', err)
            }
            return (
              <option key={d.id} value={d.id}>
                {label} (Created: {new Date(d.created_at).toLocaleDateString()})
              </option>
            )
          })}
        </select>
      </div>

      {ctaType === 'newsletter' && (
        <div className="mb-8">
          <label htmlFor="newsletterFrequencySelect" className="mb-2 block font-medium">
            Newsletter Frequency
          </label>
          <select
            id="newsletterFrequencySelect"
            className="dark:border-primary-700 border-primary-300 focus:ring-primary-500 w-full rounded border px-3 py-2 focus:ring-2 dark:bg-gray-800"
            value={newsletterFrequency}
            onChange={(e) => setNewsletterFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}
      {/* Message Box */}
      {message && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm font-medium transition-all ${
            messageType === 'success'
              ? 'border-green-400 bg-green-50 text-green-800'
              : 'border-red-400 bg-red-50 text-red-800'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
      <div className="flex gap-4">
        <button
          className="bg-primary-600 hover:bg-primary-700 rounded-md px-6 py-2 font-semibold text-white disabled:opacity-60"
          disabled={!selectedTemplateDataId}
          onClick={async () => {
            if (!selectedTemplateDataId) return
            const payload: {
              cta_type: string
              template_data_id: number
              newsletter_frequency?: string
            } = {
              cta_type: ctaType,
              template_data_id: selectedTemplateDataId!,
            }
            if (ctaType === 'newsletter') {
              payload.newsletter_frequency = newsletterFrequency
            }
            try {
              let res
              if (existingConfigId) {
                // Update existing config
                res = await fetch('/api/cta-config', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: existingConfigId, ...payload }),
                })
              } else {
                // Create new config
                res = await fetch('/api/cta-config', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
              }
              if (res.ok) {
                setMessageType('success')
                setMessage(
                  existingConfigId
                    ? 'CTA configuration updated!'
                    : 'CTA configuration saved successfully!'
                )
              } else {
                const data = await res.json()
                setMessageType('error')
                setMessage('Failed to save: ' + (data.error || res.statusText))
              }
            } catch (err) {
              setMessageType('error')
              setMessage('Network error: ' + err)
            }
            setTimeout(() => {
              setMessage(null)
              setMessageType(null)
            }, 3500)
          }}
        >
          Save
        </button>
        <Link
          href="/allset"
          className="inline-block rounded-md border border-gray-300 px-6 py-2 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}
