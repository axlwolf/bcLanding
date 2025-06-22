// Page for creating a Template Data Instance for any template
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { extractHandlebarsVariables } from '@/lib/utils/handlebarsVars'
import FormEditor from '../../landing-content/components/FormEditor'
import type { EmailTemplateData } from '@/types/email'
import { Suspense } from 'react'

export default function TemplateDataPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateDataPageContent />
    </Suspense>
  )
}

function TemplateDataPageContent() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const template = searchParams.get('template')
  const [templateContent, setTemplateContent] = useState<string>('')
  const [variables, setVariables] = useState<string[]>([])
  const [formData, setFormData] = useState<EmailTemplateData>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!template) return // Added a comment to avoid no-empty lint error
    setError(null)
    fetch(`/api/templates/${template}`)
      .then(async (res) => {
        if (!res.ok) {
          let errorMsg = 'Failed to load template content'
          try {
            const { error } = await res.json()
            errorMsg = error || errorMsg
          } catch (e) {
            /* ignore error, fallback to default */
          }
          setError(errorMsg)
          return ''
        }
        return res.text()
      })
      .then((content) => {
        if (!content) return
        setTemplateContent(content)
        const vars = extractHandlebarsVariables(content)
        setVariables(vars)
        setFormData(Object.fromEntries(vars.map((v) => [v, ''])) as EmailTemplateData)
      })
      .catch(() => setError('Network error loading template content'))
  }, [template])

  const handleSave = async (data: EmailTemplateData) => {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/template-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, data }),
      })
      if (!res.ok) {
        let errorMsg = 'Failed to save template data'
        try {
          const { error } = await res.json()
          errorMsg = error || errorMsg
        } catch (e) {
          /* ignore error, fallback to default */
        }
        setError(errorMsg)
        setIsSaving(false)
        return
      }
      setIsSaving(false)
      router.push('/allset/emails')
    } catch {
      setError('Network error saving template data')
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Create Data Instance for <span className="text-primary-600">{template}</span>
      </h1>
      {error && <div className="my-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}
      <FormEditor<EmailTemplateData> content={formData} onSave={handleSave} isSaving={isSaving} />
    </div>
  )
}
