import { NextRequest, NextResponse } from 'next/server'
import { updateActiveTemplate } from '@/lib/config'

// Enable dynamic behavior for API routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/allset/templates/update called')

    // Verificar configuración de Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[API] Supabase environment variables not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'Database configuration error. Please check Supabase environment variables.',
          error: 'SUPABASE_CONFIG_ERROR',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { templateId } = body
    console.log('[API] Received request body:', body)

    if (!templateId) {
      console.warn('[API] No templateId provided')
      return NextResponse.json(
        { success: false, message: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Actualizar el template activo en Supabase
    console.log('[API] Updating activeTemplate in Supabase...')
    const updatedConfig = await updateActiveTemplate(templateId)
    console.log('[API] Successfully updated config:', updatedConfig)

    return NextResponse.json({
      success: true,
      activeTemplate: updatedConfig.activeTemplate,
      message: 'Template updated successfully',
    })
  } catch (error) {
    console.error('[API] Error updating template:', error)
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    // Check for specific error types
    if (errorMessage.includes('does not exist')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database table "site_config" does not exist. Please run the database setup.',
          error: 'TABLE_NOT_FOUND',
          details: errorMessage,
        },
        { status: 500 }
      )
    }

    if (
      errorMessage.toLowerCase().includes('supabase') ||
      errorMessage.toLowerCase().includes('fetch failed') ||
      errorMessage.toLowerCase().includes('network')
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection error. Please verify your Supabase configuration.',
          error: 'SUPABASE_CONNECTION_ERROR',
          details: errorMessage,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An internal server error occurred while updating the template.',
        error: 'GENERAL_ERROR',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
