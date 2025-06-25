import { NextRequest, NextResponse } from 'next/server'
import { getSiteConfigFromSupabase, updateSiteConfigInSupabase } from '@/lib/config'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/allset/templates/update called')
    const { templateId } = await request.json()
    console.log('[API] Received templateId:', templateId)

    if (!templateId) {
      console.warn('[API] No templateId provided')
      return NextResponse.json(
        { success: false, message: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Leer configuración actual desde Supabase
    console.log('[API] Fetching site config from Supabase...')
    const config = await getSiteConfigFromSupabase()
    console.log('[API] Current config from Supabase:', config)

    // Mostrar los IDs de los templates disponibles para depuración
    console.log(
      '[API] availableTemplates IDs:',
      config.availableTemplates.map((t) => t.id)
    )

    // Validar que el template existe
    const templateExists = config.availableTemplates.some((t) => t.id === templateId)
    if (!templateExists) {
      console.warn(`[API] Template with ID "${templateId}" does not exist`)
      return NextResponse.json(
        { success: false, message: `Template with ID "${templateId}" does not exist` },
        { status: 400 }
      )
    }

    // Actualizar el template activo en Supabase
    console.log('[API] Updating activeTemplate in Supabase...')
    const updatedConfig = await updateSiteConfigInSupabase({ activeTemplate: templateId })
    console.log('[API] Updated config in Supabase:', updatedConfig)

    return NextResponse.json({
      success: true,
      activeTemplate: updatedConfig.activeTemplate,
    })
  } catch (error) {
    console.error('[API] Error updating template:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
