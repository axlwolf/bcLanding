'use client'

import { useState, useEffect, ReactNode } from 'react'
import { TemplateStorage } from '@/lib/templateStorage'
// Main, Main2, etc., are no longer imported here.
// They will be passed as props via the `components` object.

interface ClientTemplateWrapperProps {
  serverTemplate: string // Template name from server-side Supabase (e.g., "Main", "Main2")
  components: { [key: string]: ReactNode } // An object mapping template names to their ReactNode components
  defaultComponent: ReactNode // A fallback component (e.g., <Main />)
}

export default function ClientTemplateWrapper({
  serverTemplate,
  components,
  defaultComponent,
}: ClientTemplateWrapperProps) {
  const [activeTemplate, setActiveTemplate] = useState(serverTemplate)
  const [isClient, setIsClient] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsClient(true) // Mark that component has mounted and is on the client

    const localTemplate = TemplateStorage.getLocalTemplate()
    if (localTemplate && localTemplate !== serverTemplate) {
      console.log(
        '[CLIENT] localStorage template:',
        localTemplate,
        'overriding server template:',
        serverTemplate
      )
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTemplate(localTemplate)
        setIsTransitioning(false)
      }, 50) // Short delay for transition effect
    } else {
      console.log('[CLIENT] Using server template:', serverTemplate)
      // If serverTemplate is already what we want, ensure activeTemplate reflects it
      // This is important if serverTemplate itself changes due to server-side logic on navigation
      if (activeTemplate !== serverTemplate) {
        setActiveTemplate(serverTemplate)
      }
    }

    const handleTemplateChange = (newTemplateId: string) => {
      console.log('[CLIENT] Template changed in another tab or by storage event:', newTemplateId)
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTemplate(newTemplateId)
        setIsTransitioning(false)
      }, 50)
    }

    // Setup cross-tab sync
    const cleanupSync = TemplateStorage.setupCrossTabSync(handleTemplateChange)
    // Also listen for direct local storage changes (e.g. from admin panel)
    window.addEventListener('storage', (event) => {
        if (event.key === TemplateStorage.getLocalStorageKey() && event.newValue) {
            handleTemplateChange(event.newValue);
        }
    });


    return () => {
      cleanupSync()
      // Remove the specific storage event listener if necessary, though setupCrossTabSync might handle it
      // window.removeEventListener('storage', ...);
    }
  }, [serverTemplate]) // Rerun if serverTemplate changes

  // Determine the template to render: use client-side activeTemplate if hydrated, otherwise serverTemplate.
  const templateToRender = isClient ? activeTemplate : serverTemplate

  console.log(
    '[CLIENT] Attempting to render template:',
    templateToRender,
    'isClient:',
    isClient,
    'isTransitioning:',
    isTransitioning
  )

  if (isTransitioning && isClient) { // Only show loader if client-side transition is happening
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    )
  }

  // Select the component from the passed `components` prop or use the default
  const ComponentToRender = components[templateToRender] || defaultComponent

  if (!ComponentToRender) {
    console.error(`[CLIENT] Error: No component found for template name "${templateToRender}". Rendering default.`);
    return <>{defaultComponent}</>;
  }

  return <>{ComponentToRender}</>
}
