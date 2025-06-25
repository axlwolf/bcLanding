import { NextRequest, NextResponse } from 'next/server'
import { updateActiveTemplate } from '@/lib/config'

// Enable dynamic behavior for API routes
export const dynamic = 'force-dynamic'

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

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    // Check for Supabase-specific connection errors
    if (
      errorMessage.toLowerCase().includes('supabase') ||
      errorMessage.toLowerCase().includes('fetch failed')
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Database connection error. Please verify your Supabase configuration and network status.',
          error: 'SUPABASE_CONNECTION_ERROR',
          details: errorMessage,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An internal server error occurred.',
        error: 'GENERAL_ERROR',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
