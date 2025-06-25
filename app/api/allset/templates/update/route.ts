import { NextRequest, NextResponse } from 'next/server'
import { updateActiveTemplate } from '@/lib/config'

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

    // Actualizar el template activo en Supabase usando función centralizada
    console.log('[API] Updating activeTemplate in Supabase...')
    const updatedConfig = await updateActiveTemplate(templateId)
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
