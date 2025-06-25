'use client'

import { useState, useEffect } from 'react'
import { TemplateStorage } from '@/lib/templateStorage'
import Main from './Main'
import Main2 from './Main2'
import Main3 from './Main3'
import Main4 from './Main4'
import Main5 from './Main5'
import Main6 from './Main6'

interface ClientTemplateWrapperProps {
  serverTemplate: string // Template from server-side Supabase
}

export default function ClientTemplateWrapper({ serverTemplate }: ClientTemplateWrapperProps) {
  const [activeTemplate, setActiveTemplate] = useState(serverTemplate)
  const [isClient, setIsClient] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Mark as client-side after hydration
    setIsClient(true)

    // Check localStorage for more recent template
    const localTemplate = TemplateStorage.getLocalTemplate()

    if (localTemplate && localTemplate !== serverTemplate) {
      console.log(
        '[CLIENT] localStorage template:',
        localTemplate,
        'overriding server template:',
        serverTemplate
      )

      // Smooth transition when overriding server template
      setIsTransitioning(true)

      // Small delay to allow smooth transition
      setTimeout(() => {
        setActiveTemplate(localTemplate)
        setIsTransitioning(false)
      }, 50)
    } else {
      console.log('[CLIENT] Using server template:', serverTemplate)
    }

    // Setup cross-tab sync
    const cleanup = TemplateStorage.setupCrossTabSync((newTemplateId) => {
      console.log('[CLIENT] Template changed in another tab:', newTemplateId)
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTemplate(newTemplateId)
        setIsTransitioning(false)
      }, 50)
    })

    return cleanup
  }, [serverTemplate])

  // Before hydration, always show server template to avoid mismatch
  const templateToRender = isClient ? activeTemplate : serverTemplate

  console.log(
    '[CLIENT] Rendering template:',
    templateToRender,
    'isClient:',
    isClient,
    'transitioning:',
    isTransitioning
  )

  // Show loading during transition (optional, very brief)
  if (isTransitioning) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    )
  }

  // Render appropriate template
  switch (templateToRender) {
    case 'Main2':
      return <Main2 />
    case 'Main3':
      return <Main3 />
    case 'Main4':
      return <Main4 />
    case 'Main5':
      return <Main5 />
    case 'Main6':
      return <Main6 />
    default:
      return <Main />
  }
}
